import { useCallback, useMemo, useState } from "react";
import { catalogItemById } from "./catalog";
import { generateFromPrompt } from "./generate-ui";
import {
  GeneratorCatalogSidebar,
  GeneratorPreviewPanel,
  GeneratorPromptPanel,
  useGeneratorCatalog,
} from "./GeneratorParts";
import { GENERATOR_SAMPLE_DATA } from "./sample-data";
import type { GeneratorPreviewTab, GeneratorResult, GeneratorWorkspaceData } from "./types";
import styles from "./GeneratorWorkspace.tailwind";

export interface GeneratorWorkspaceProps {
  data?: GeneratorWorkspaceData;
}

/** AI-powered component generator with a scrollable catalog sidebar and prompt-driven preview. */
export function GeneratorWorkspace({ data = GENERATOR_SAMPLE_DATA }: GeneratorWorkspaceProps) {
  const catalog = useGeneratorCatalog();
  const [catalogSearch, setCatalogSearch] = useState("");
  const [activeCatalogId, setActiveCatalogId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState(data.defaultPrompt);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GeneratorResult | null>(() => generateFromPrompt(data.defaultPrompt));
  const [previewTab, setPreviewTab] = useState<GeneratorPreviewTab>("preview");

  const handleSelectCatalogItem = useCallback(
    (id: string) => {
      const item = catalogItemById(catalog, id);
      if (!item) return;
      setActiveCatalogId(id);
      setResult({ kind: "catalog", title: item.label, item });
      setPreviewTab("preview");
    },
    [catalog],
  );

  const handleGenerate = useCallback(() => {
    if (prompt.trim().length === 0 || generating) return;

    setGenerating(true);
    setActiveCatalogId(null);

    window.setTimeout(() => {
      setResult(generateFromPrompt(prompt));
      setPreviewTab("preview");
      setGenerating(false);
    }, 650);
  }, [generating, prompt]);

  const handleExampleSelect = useCallback((example: string) => {
    setPrompt(example);
  }, []);

  const activeCatalogSelection = useMemo(() => activeCatalogId, [activeCatalogId]);

  return (
    <div className={styles.workspace}>
      <GeneratorCatalogSidebar
        items={catalog}
        searchQuery={catalogSearch}
        onSearchChange={setCatalogSearch}
        activeId={activeCatalogSelection}
        onSelect={handleSelectCatalogItem}
      />

      <div className={styles.mainGrid}>
        <GeneratorPromptPanel
          prompt={prompt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          generating={generating}
          examples={data.examplePrompts}
          onExampleSelect={handleExampleSelect}
        />
        <GeneratorPreviewPanel result={result} activeTab={previewTab} onTabChange={setPreviewTab} />
      </div>
    </div>
  );
}

export type { GeneratorWorkspaceData } from "./types";
