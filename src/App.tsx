import { useEffect, useState } from 'react';
import {
  CALL_BY_NUMBER, CHANGES, CHECKLIST, COLLAPSED_PLAYS, COVER_DETAILS, COVERS, FRONT_DETAILS, FRONT_NOTES, FRONTS,
  GAPS, MATRIX_GRADES, MATRIX_INTRO, MATRIX_NOTE, META, MOTION_NOTES, MOTIONS, ROUTE_TREE, ROUTE_TREE_NOTE, PLAY_DETAILS, PLAY_GROUPS, QUESTIONS, RESOLVED, SECTIONS, SHELLS,
  type Front,
} from './data/playbook';
import { POSITIONS, type Gap, type Motion, type Position, type RouteTreeRow, type Shell } from './data/types';
import { StickyHeader } from './components/StickyHeader';
import { Section } from './components/Section';
import { PlayIndex } from './components/PlayIndex';
import { PositionTasks } from './components/PositionTasks';
import { Tabs, toTabs } from './components/Tabs';
import { DataTable, KeyValueList } from './components/DataTable';
import { MatrixView } from './components/MatrixView';
import { PlayDetailView } from './components/PlayDetailView';
import { CollapsibleSection } from './components/CollapsibleSection';
import { Checklist } from './components/Checklist';
import { QuestionCard } from './components/QuestionCard';
import { Callout } from './components/Callout';

type CoverId = (typeof COVERS)[number];
const POS_KEY = 'navigators-posicao';

function initialPosition(): Position {
  const p = new URLSearchParams(location.search).get('pos') ?? localStorage.getItem(POS_KEY);
  return POSITIONS.includes(p as Position) ? (p as Position) : 'C';
}

const PLAY_GROUP_IDS = ['inside', 'outside', 'pa', 'boot', 'passes', 'especiais'] as const;

export default function App() {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [front, setFront] = useState<Front>('4-3');
  const [cover, setCover] = useState<CoverId>('C2');

  useEffect(() => { try { localStorage.setItem(POS_KEY, position); } catch { /* ignore */ } }, [position]);

  const groupTitle = (id: string) => PLAY_GROUPS.find((g) => g.id === id)!.title;

  return (
    <div className="app">
      <StickyHeader team={META.team} title={META.shortTitle} position={position} onPositionChange={setPosition}
        sections={SECTIONS} validNumbers={Object.keys(CALL_BY_NUMBER).map(Number)} />

      <main className="container">
        <section className="section" id="topo">
          <h1 className="page-title">{META.title}</h1>
          <p className="lead">{META.intro}</p>
          <Callout><strong>Nota:</strong> {META.termsNote}</Callout>
        </section>

        <Section id="indice" title="Índice: 40 jogadas por grupo" subtitle="Pares Esquerda/Direita por conceito. Uma jogada com dois conceitos aparece em cada um deles.">
          <PlayIndex groups={PLAY_GROUPS} />
          <p className="small top-gap">{META.termsNote}</p>
        </Section>

        <Section id="posicao" title={`A minha posição: ${position}`} subtitle={`A tarefa do ${position} em cada jogada, pela ordem do livro. Mude a posição no topo.`}>
          <PositionTasks position={position} />
        </Section>

        <Section id="frentes" title="Frentes: 4-3, 3-4, Over e Under">
          <Tabs label="Frente" items={toTabs(FRONTS)} active={front} onChange={setFront} />
          {FRONT_DETAILS[front] ? <KeyValueList rows={FRONT_DETAILS[front]!} /> : <p className="muted-note">Conteúdo da frente {front} por extrair do livro.</p>}
          <h3 className="sub-title">Gaps</h3>
          <DataTable<Gap> caption="Gaps" rows={GAPS} rowKey={(g) => g.numbers}
            columns={[
              { key: 'n', header: 'Gap', primary: true, render: (g) => <span className="mono strong">{g.numbers}</span> },
              { key: 'l', header: 'Letra', render: (g) => <span className="strong navy">{g.letter}</span> },
              { key: 'w', header: 'Onde', render: (g) => g.where },
              { key: 't', header: 'Técnica do DL', render: (g) => g.technique },
            ]} />
          <ul className="notes">{FRONT_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
        </Section>

        <Section id="coverages" title="Coverages: como reconhecer e o que usar">
          <DataTable<Shell> caption="Shells" rows={SHELLS} rowKey={(s) => s.shell}
            columns={[
              { key: 's', header: 'Shell', primary: true, render: (s) => <span className="strong navy">{s.shell}</span> },
              { key: 'c', header: 'Covers', render: (s) => <span className="mono strong">{s.covers}</span> },
              { key: 'r', header: 'Como ler', render: (s) => s.read },
            ]} />
          <Tabs label="Cover" items={toTabs(COVERS)} active={cover} onChange={setCover} />
          {COVER_DETAILS[cover] ? <KeyValueList rows={COVER_DETAILS[cover]!} /> : <p className="muted-note">Ficha de {cover} por extrair do livro.</p>}
        </Section>

        <Section id="matriz" title="Matriz: jogadas × frentes e covers" subtitle={MATRIX_INTRO}>
          <MatrixView rows={MATRIX_GRADES} />
          <Callout>{MATRIX_NOTE}</Callout>
        </Section>

        {PLAY_GROUP_IDS.map((gid) => {
          const pairIds = new Set(PLAY_GROUPS.find((g) => g.id === gid)!.pairs.map((x) => x.id));
          const details = PLAY_DETAILS.filter((d) => pairIds.has(d.id));
          return (
            <Section key={gid} id={gid} title={groupTitle(gid)}>
              <div className="stack">
                {details.map((d) => (
                  <PlayDetailView key={d.id} detail={d} position={position} defaultOpen={gid === 'inside' && d.id === 'iso'} />
                ))}
                {(COLLAPSED_PLAYS[gid] ?? []).map((p) => (
                  <CollapsibleSection key={p.title} title={`${p.title} · regras do playbook`}>
                    {p.missing && <p className="muted-note">{p.missing.trim()}</p>}
                    {p.playbook.length > 0
                      ? <><p className="small">Regras do conceito no playbook:</p><KeyValueList rows={p.playbook} /></>
                      : <p className="muted-note">Sem regras no playbook para esta jogada.</p>}
                  </CollapsibleSection>
                ))}
              </div>
            </Section>
          );
        })}

        <Section id="rotas">
          <CollapsibleSection title="Rotas, motions e marcas deste livro">
            <div className="stack">
              <DataTable<RouteTreeRow> caption="Árvore de rotas (números)" rows={ROUTE_TREE} rowKey={(r) => String(r.n)}
                columns={[
                  { key: 'n', header: 'N.º', render: (r) => r.n, primary: true },
                  { key: 'outside', header: 'Outside Tree', render: (r) => r.outside },
                  { key: 'inside', header: 'Inside Tree', render: (r) => r.inside },
                ]} />
              <p className="small">{ROUTE_TREE_NOTE}</p>
              <DataTable<Motion> caption="Motions" rows={MOTIONS} rowKey={(m) => m.call}
                columns={[
                  { key: 'call', header: 'Chamada', render: (m) => m.call, primary: true },
                  { key: 'kind', header: 'Tipo', render: (m) => m.kind },
                  { key: 'what', header: 'O que faz', render: (m) => m.what },
                ]} />
              <ul className="bullets">{MOTION_NOTES.map((n) => <li key={n}>{n}</li>)}</ul>
            </div>
          </CollapsibleSection>
        </Section>

        <Section id="checklist" title="Checklist do jogo" subtitle="Lista fixa para rever antes do jogo.">
          <Checklist items={CHECKLIST} />
        </Section>

        <Section id="mudou">
          <CollapsibleSection title="O que mudou face ao livro de 3 nov (42 jogadas)">
            <div className="stack">
              {CHANGES.map((c) => (
                <div key={c.state} className="rule">
                  <div className="rule__head"><span className="mono strong navy">{c.state}</span> · {c.plays}</div>
                  <p className="strong">{c.what}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </Section>

        <Section id="questoes" title="Questões em aberto (confirmar com o coach)" tone="surface">
          <div className="q-grid">{QUESTIONS.map((q) => <QuestionCard key={q.point} q={q} />)}</div>
          <Callout tone="good" title="Resolvidas com o livro final">
            <ul className="bullets">{RESOLVED.map((r) => <li key={r}>{r}</li>)}</ul>
          </Callout>
        </Section>
      </main>
    </div>
  );
}
