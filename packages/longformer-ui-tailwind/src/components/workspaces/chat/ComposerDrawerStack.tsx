import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { cx } from "../../../utils/cx";
import type { ComposerDrawerProps } from "./ComposerDrawer";
import drawerStyles from "./ComposerDrawer.tailwind";
import styles from "./ComposerDrawerStack.tailwind";

export interface ComposerDrawerStackProps {
  children: ReactNode;
  className?: string;
}

/**
 * Vertically stacks multiple `ComposerDrawer` panels above the composer input.
 * Following drawers overlap the previous panel by one corner radius (same tuck
 * model as the composer card) so each can keep rounded top corners without
 * background notches.
 */
export function ComposerDrawerStack({ children, className }: ComposerDrawerStackProps) {
  const drawers = Children.toArray(children).filter(Boolean);

  return (
    <div className={cx(styles.stack, className)}>
      {drawers.map((child, index) => {
        if (!isValidElement<ComposerDrawerProps>(child)) return child;

        const stackClass = index > 0 ? drawerStyles.drawerStackFollows : undefined;

        return cloneElement(child as ReactElement<ComposerDrawerProps>, {
          key: child.key ?? index,
          className: cx(child.props.className, stackClass),
        });
      })}
    </div>
  );
}
