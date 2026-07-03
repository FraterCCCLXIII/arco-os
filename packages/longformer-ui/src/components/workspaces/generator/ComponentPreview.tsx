import { Icon } from "../../../icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  CountBadge,
  EmptyState,
  IconButton,
  Input,
  Kbd,
  Label,
  ListItem,
  Switch,
  Tabs,
  Textarea,
} from "../../primitives";
import { GeneratedSurface } from "../generated-ui/GeneratedSurface";
import type { CatalogItem } from "./types";
import styles from "./GeneratorWorkspace.module.css";

export function ComponentPreview({ item }: { item: Pick<CatalogItem, "block" | "componentPreviewId"> }) {
  if (item.block) {
    return <GeneratedSurface schema={{ id: `preview-${item.block.id}`, blocks: [item.block] }} />;
  }

  return <AtomPreview itemId={item.componentPreviewId ?? ""} />;
}

function AtomPreview({ itemId }: { itemId: string }) {
  switch (itemId) {
    case "gallery-btn-primary":
      return <Button variant="primary">Primary action</Button>;
    case "gallery-btn-secondary":
      return <Button variant="secondary">Secondary</Button>;
    case "gallery-btn-ghost":
      return <Button variant="ghost">Ghost</Button>;
    case "gallery-btn-danger":
      return <Button variant="danger">Danger</Button>;
    case "gallery-icon-btn":
      return (
        <div className={styles.previewRow}>
          <IconButton icon="plus" label="Add" />
          <IconButton icon="settings" label="Settings" variant="primary" />
        </div>
      );
    case "gallery-input":
      return <Input placeholder="Search components" startSlot={<Icon name="search" size={14} />} />;
    case "gallery-textarea":
      return <Textarea placeholder="Write a prompt…" rows={3} autoResize={false} />;
    case "gallery-label":
      return (
        <div className={styles.previewColumn}>
          <Label htmlFor="preview-label">Email address</Label>
          <Input id="preview-label" placeholder="you@example.com" />
        </div>
      );
    case "gallery-checkbox":
      return <Checkbox label="Remember me" checked />;
    case "gallery-switch":
      return <Switch label="Enable notifications" checked />;
    case "gallery-chips":
      return (
        <div className={styles.previewRow}>
          <Chip active>Active</Chip>
          <Chip>Default</Chip>
        </div>
      );
    case "gallery-badges":
      return (
        <div className={styles.previewRow}>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success" dot>
            Online
          </Badge>
          <CountBadge count={8} />
        </div>
      );
    case "gallery-avatar-list":
      return (
        <Card padding="md" className={styles.previewCard}>
          <div className={styles.previewRow}>
            <Avatar name="Alex Morgan" status="online" />
            <ListItem leading={<Icon name="folder" size={15} />} label="List item" description="Supporting text" />
          </div>
        </Card>
      );
    case "gallery-tabs":
      return (
        <Tabs
          items={[
            { id: "one", label: "First" },
            { id: "two", label: "Second" },
            { id: "three", label: "Third" },
          ]}
          value="one"
          onChange={() => undefined}
        />
      );
    case "gallery-card":
      return (
        <Card padding="lg" className={styles.previewCard}>
          <div className={styles.previewColumn}>
            <strong>Card title</strong>
            <span className={styles.previewMuted}>Supporting description for a composed surface.</span>
          </div>
        </Card>
      );
    case "gallery-empty":
      return (
        <EmptyState
          icon={<Icon name="sparkles" size={20} />}
          title="Nothing here"
          description="Empty states anchor list and detail panes."
        />
      );
    case "gallery-kbd":
      return (
        <p className={styles.previewMuted}>
          Press <Kbd>⌘</Kbd> <Kbd>Enter</Kbd> to generate
        </p>
      );
    default:
      return null;
  }
}
