#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const configPath = resolve(root, process.env.CLICKUP_TASK_MAP ?? "config/clickup-tasks.json");
const statePath = resolve(root, process.env.CLICKUP_SYNC_STATE ?? ".clickup-sync-state.json");
const runId = process.env.ORCA_RUN_ID;
const token = process.env.CLICKUP_API_TOKEN;
const listId = process.env.CLICKUP_LIST_ID;
const dryRun = process.argv.includes("--dry-run");
const interval = Number(process.env.CLICKUP_SYNC_INTERVAL ?? 0);

const statusMap = {
  pending: "Backlog",
  ready: "Pronto",
  dispatched: "Em andamento",
  blocked: "Bloqueado",
  completed: "Concluído",
  failed: "Revisão",
};

function fail(message) {
  console.error(`ClickUp sync: ${message}`);
  process.exitCode = 1;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function getTasks() {
  const output = execFileSync(
    "orca",
    ["orchestration", "task-list", "--run", runId, "--json", "--full"],
    { encoding: "utf8" },
  );
  const payload = JSON.parse(output);
  return payload.result?.tasks ?? [];
}

async function clickup(path, options = {}) {
  const response = await fetch(`https://api.clickup.com/api/v2${path}`, {
    ...options,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${body}`);
  }

  return response.status === 204 ? null : response.json();
}

function reportBody(task) {
  if (!task.result) return "";
  try {
    const result = JSON.parse(task.result);
    return result.body ?? result.message ?? "";
  } catch {
    return "";
  }
}

async function syncOnce() {
  if (!runId) throw new Error("ORCA_RUN_ID não foi definido.");
  if (!existsSync(configPath)) {
    throw new Error(
      `Mapa não encontrado em ${configPath}. Copie config/clickup-tasks.example.json para config/clickup-tasks.json.`,
    );
  }
  if (!dryRun && (!token || !listId)) {
    throw new Error("Defina CLICKUP_API_TOKEN e CLICKUP_LIST_ID (ou use --dry-run).");
  }

  const mapping = readJson(configPath);
  const state = existsSync(statePath) ? readJson(statePath) : {};
  const tasks = getTasks();
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const nextState = { ...state };
  let changed = 0;

  for (const [orcaId, clickupId] of Object.entries(mapping)) {
    const task = taskById.get(orcaId);
    if (!task) {
      console.warn(`Ignorado: ${orcaId} não pertence ao run ${runId}.`);
      continue;
    }
    if (!clickupId || clickupId.startsWith("REPLACE_")) {
      console.warn(`Pendente: informe o ID ClickUp de ${orcaId}.`);
      continue;
    }

    const status = statusMap[task.status] ?? "Backlog";
    const previous = state[orcaId];
    const statusChanged = previous?.status !== status;
    const result = reportBody(task);
    const reportChanged = result && previous?.result !== result;

    console.log(`${task.task_title ?? task.display_name}: ${task.status} → ${status}`);
    if (!dryRun && (statusChanged || reportChanged)) {
      await clickup(`/task/${clickupId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      if (reportChanged) {
        await clickup(`/task/${clickupId}/comment`, {
          method: "POST",
          body: JSON.stringify({
            comment_text: result,
            notify_all: false,
          }),
        });
      }
      changed += 1;
    }
    nextState[orcaId] = { status, result, syncedAt: new Date().toISOString() };
  }

  if (!dryRun) writeFileSync(statePath, `${JSON.stringify(nextState, null, 2)}\n`);
  console.log(`${dryRun ? "Simulação" : "Sincronização"} concluída: ${changed} card(s) atualizado(s).`);
}

async function main() {
  do {
    try {
      await syncOnce();
    } catch (error) {
      fail(error instanceof Error ? error.message : String(error));
      return;
    }
    if (interval > 0) {
      await new Promise((resolvePromise) => setTimeout(resolvePromise, interval * 1000));
    }
  } while (interval > 0);
}

main();
