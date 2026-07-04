import { forwardRef } from "react";
import { Button, type ButtonProps } from "../Button";
import { Icon, type IconName } from "../../../icons";

export interface IconButtonProps extends Omit<ButtonProps, "iconOnly" | "children"> {
  icon: IconName;
  /** Accessible label — required since there is no visible text. */
  label: string;
  iconSize?: number;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, iconSize = 16, variant = "ghost", size = "md", ...rest },
  ref
) {
  return (
    <Button ref={ref} variant={variant} size={size} iconOnly aria-label={label} title={label} {...rest}>
      <Icon name={icon} size={iconSize} />
    </Button>
  );
});
