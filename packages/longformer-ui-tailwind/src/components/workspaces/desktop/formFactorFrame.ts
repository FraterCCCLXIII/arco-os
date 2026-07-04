import type { FormFactor } from "../../../surface-manager";

export interface FormFactorFrameSize {
  width: number;
  height: number;
}

/** Logical device dimensions used to size the simulated OS viewport. */
export const FORM_FACTOR_FRAME: Record<FormFactor, FormFactorFrameSize> = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 834, height: 1112 },
  phone: { width: 390, height: 844 },
  watch: { width: 196, height: 242 },
  widget: { width: 1280, height: 800 },
};

export function formFactorUsesFixedFrame(formFactor: FormFactor): boolean {
  return formFactor !== "desktop" && formFactor !== "widget";
}
