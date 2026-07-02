import { Fragment } from "react";
import { cx } from "../../../utils/cx";
import { Icon } from "../../../icons";
import type { DocBlockNode, DocListItem } from "./types";
import styles from "./DocBlock.module.css";

function ListItems({ items, ordered }: { items: DocListItem[]; ordered: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={styles.list}>
      {items.map((item) => (
        <li key={item.id} className={styles.listItem}>
          {item.text}
          {item.children && item.children.length > 0 && (
            <ul className={styles.nestedList}>
              {item.children.map((child) => (
                <li key={child.id}>{child.text}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </Tag>
  );
}

export interface DocBlockProps {
  node: DocBlockNode;
}

/** Renders a single Notion-style content block (heading, paragraph, list, flow-steps, callout). */
export function DocBlock({ node }: DocBlockProps) {
  switch (node.type) {
    case "heading": {
      const Tag = (`h${node.level}` as unknown) as "h1" | "h2" | "h3";
      return (
        <Tag className={cx(styles.block, styles[`h${node.level}`])}>{node.text}</Tag>
      );
    }
    case "paragraph":
      return <p className={styles.block}>{node.text}</p>;
    case "bulletList":
      return (
        <div className={styles.block}>
          <ListItems items={node.items} ordered={false} />
        </div>
      );
    case "numberedList":
      return (
        <div className={styles.block}>
          <ListItems items={node.items} ordered />
        </div>
      );
    case "flowSteps":
      return (
        <div className={cx(styles.block, styles.flowSteps)}>
          {node.steps.map((step, index) => (
            <Fragment key={index}>
              {index > 0 && (
                <span className={styles.flowArrow} aria-hidden="true">
                  <Icon name="chevron-right" size={14} />
                </span>
              )}
              <span className={styles.flowStep}>{step}</span>
            </Fragment>
          ))}
        </div>
      );
    case "callout":
      return (
        <div className={cx(styles.block, styles.callout)}>
          <span className={styles.calloutIcon}>
            <Icon name={node.icon ?? "sparkles"} size={16} />
          </span>
          <span>{node.text}</span>
        </div>
      );
    default:
      return null;
  }
}
