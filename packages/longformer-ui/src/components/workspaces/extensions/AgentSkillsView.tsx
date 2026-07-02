import { useMemo, useState } from "react";
import { Icon } from "../../../icons";
import { Badge } from "../../primitives/Badge";
import { Button } from "../../primitives/Button";
import { Card } from "../../primitives/Card";
import { EmptyState } from "../../primitives/EmptyState";
import { Input } from "../../primitives/Input";
import { cx } from "../../../utils/cx";
import { filterByQuery, type AgentSkill, type ExtensionsWorkspaceData } from "./types";
import styles from "./ExtensionPage.module.css";

export interface AgentSkillsViewProps {
  data: ExtensionsWorkspaceData;
}

/** Agent Skills catalog — reusable instruction packs for specialized agent behavior. */
export function AgentSkillsView({ data }: AgentSkillsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEnabledOnly, setShowEnabledOnly] = useState(false);

  const visibleSkills = useMemo(() => {
    let items = filterByQuery(data.agentSkills, searchQuery);
    if (showEnabledOnly) items = items.filter((skill) => skill.enabled);
    return items;
  }, [data.agentSkills, searchQuery, showEnabledOnly]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerBody}>
          <h1 className={styles.title}>Agent Skills</h1>
          <p className={styles.subtitle}>
            Reusable instruction packs that teach agents how to handle specialized workflows — from code review to
            deployment automation.
          </p>
        </div>
        <Button type="button" variant="primary" size="sm">
          <Icon name="plus" size={14} />
          New skill
        </Button>
      </header>

      <div className={styles.toolbar}>
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search skills"
          aria-label="Search agent skills"
          startSlot={<Icon name="search" size={14} />}
          wrapperClassName={styles.searchInput}
        />
        <button
          type="button"
          className={cx(styles.filterChip, showEnabledOnly && styles.filterChipActive)}
          onClick={() => setShowEnabledOnly((prev) => !prev)}
        >
          Enabled only
        </button>
      </div>

      {visibleSkills.length === 0 ? (
        <EmptyState
          icon={<Icon name="sparkles" size={22} />}
          title="No skills found"
          description="Try a different search term or create a new agent skill."
        />
      ) : (
        <div className={styles.cardGrid}>
          {visibleSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}

function SkillCard({ skill }: { skill: AgentSkill }) {
  return (
    <Card className={styles.card} padding="lg">
      <div className={styles.cardHead}>
        <span className={styles.cardIcon}>
          <Icon name="sparkles" size={18} />
        </span>
        <Badge tone={skill.enabled ? "success" : "neutral"}>{skill.enabled ? "Enabled" : "Disabled"}</Badge>
      </div>
      <div className={styles.cardTitle}>{skill.name}</div>
      <div className={styles.cardMeta}>{skill.author}</div>
      <div className={styles.cardDescription}>{skill.description}</div>
      <div className={styles.tagRow}>
        {skill.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.stat}>
          {skill.triggerCount} triggers · Updated {skill.updatedAt}
        </span>
        <Button type="button" variant="secondary" size="sm">
          {skill.enabled ? "Configure" : "Enable"}
        </Button>
      </div>
    </Card>
  );
}
