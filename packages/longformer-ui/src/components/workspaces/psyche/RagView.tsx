import { useState } from "react";
import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { Input } from "../../primitives/Input";
import { cx } from "../../../utils/cx";
import type { PsycheWorkspaceData, RagChunk } from "./types";
import styles from "./RagView.module.css";

export interface RagViewProps {
  data: PsycheWorkspaceData;
}

function scoreTone(score: number) {
  if (score >= 0.85) return "success" as const;
  if (score >= 0.7) return "accent" as const;
  return "neutral" as const;
}

function ChunkCard({ chunk, rank }: { chunk: RagChunk; rank: number }) {
  return (
    <Card padding="lg" className={styles.chunkCard}>
      <div className={styles.chunkHead}>
        <div className={styles.chunkRank}>#{rank}</div>
        <div className={styles.chunkSource}>
          <Icon name="file" size={12} />
          {chunk.source}
        </div>
        <Badge tone={scoreTone(chunk.score)}>{(chunk.score * 100).toFixed(0)}% match</Badge>
      </div>
      <p className={styles.chunkContent}>{chunk.content}</p>
      <div className={styles.chunkMeta}>
        <span>{chunk.tokens} tokens</span>
        {Object.entries(chunk.metadata).map(([key, value]) => (
          <span key={key} className={styles.metaTag}>
            {key}: {value}
          </span>
        ))}
      </div>
    </Card>
  );
}

/** RAG pipeline — query interface with retrieved context chunks and answer synthesis. */
export function RagView({ data }: RagViewProps) {
  const [query, setQuery] = useState(data.ragQueries[0]?.query ?? "");
  const activeQuery = data.ragQueries[0];

  return (
    <div className={styles.view}>
      <header className={styles.header}>
        <h1 className={styles.title}>RAG Pipeline</h1>
        <p className={styles.subtitle}>
          Retrieval-augmented generation — embed queries, search vector stores, and synthesize grounded answers.
        </p>
      </header>

      <Card padding="lg" className={styles.queryPanel}>
        <label className={styles.queryLabel} htmlFor="rag-query">
          Query
        </label>
        <div className={styles.queryRow}>
          <Input
            id="rag-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask about model knowledge, policies, or past context…"
            startSlot={<Icon name="search" size={14} />}
            className={styles.queryInput}
          />
          <Button type="button" variant="primary">
            <Icon name="sparkles" size={14} />
            Retrieve
          </Button>
        </div>
        <div className={styles.pipeline}>
          <span className={styles.pipelineStep}>
            <Icon name="code" size={12} /> Embed
          </span>
          <span className={styles.pipelineArrow}>→</span>
          <span className={styles.pipelineStep}>
            <Icon name="layers" size={12} /> Search
          </span>
          <span className={styles.pipelineArrow}>→</span>
          <span className={styles.pipelineStep}>
            <Icon name="bookmark" size={12} /> Rerank
          </span>
          <span className={styles.pipelineArrow}>→</span>
          <span className={cx(styles.pipelineStep, styles.pipelineStepActive)}>
            <Icon name="sparkles" size={12} /> Generate
          </span>
        </div>
      </Card>

      <div className={styles.layout}>
        <div>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Retrieved Chunks</h2>
            {activeQuery && (
              <span className={styles.latency}>
                {activeQuery.chunksRetrieved} chunks · {activeQuery.latencyMs}ms
              </span>
            )}
          </div>
          <div className={styles.chunkList}>
            {data.ragChunks.map((chunk, index) => (
              <ChunkCard key={chunk.id} chunk={chunk} rank={index + 1} />
            ))}
          </div>
        </div>

        <aside>
          <Card padding="lg" className={styles.answerCard}>
            <div className={styles.answerLabel}>
              <Icon name="sparkles" size={14} />
              Synthesized Answer
            </div>
            <p className={styles.answerText}>{activeQuery?.answerPreview}</p>
          </Card>

          <h2 className={styles.sectionTitle}>Query History</h2>
          <div className={styles.historyList}>
            {data.ragQueries.map((item) => (
              <button key={item.id} type="button" className={styles.historyItem} onClick={() => setQuery(item.query)}>
                <div className={styles.historyQuery}>{item.query}</div>
                <div className={styles.historyMeta}>
                  {item.timestamp} · {item.latencyMs}ms
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
