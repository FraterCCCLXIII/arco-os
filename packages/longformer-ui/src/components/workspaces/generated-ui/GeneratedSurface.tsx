/**
 * GeneratedSurface — turns a plain-data block schema into real Longformer UI.
 *
 * This is the piece that makes "generated inline UI" possible: an agent only
 * needs to produce `GeneratedBlock[]` JSON and this component renders it with
 * native, themed components. Rendering is a registry lookup, so adding a
 * block type means one `defineBlock` entry — no switch to extend.
 */
import type { ComponentType } from "react";
import { BLOCK_REGISTRY } from "./registry";
import type { GeneratedBlock, GeneratedSurfaceSchema } from "./types";

export interface GeneratedSurfaceProps {
  schema: GeneratedSurfaceSchema;
}

export function GeneratedSurface({ schema }: GeneratedSurfaceProps) {
  return (
    <div>
      {schema.blocks.map((block) => {
        // The registry is total over GeneratedBlock["type"], so this lookup
        // always succeeds for schema-typed input. The cast widens the
        // per-type component to accept the union member we hold here.
        const definition = BLOCK_REGISTRY[block.type];
        const Block = definition.Component as ComponentType<{ block: GeneratedBlock }>;
        return <Block key={block.id} block={block} />;
      })}
    </div>
  );
}
