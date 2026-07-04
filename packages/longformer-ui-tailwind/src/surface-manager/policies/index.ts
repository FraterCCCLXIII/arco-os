import type { FormFactor, WindowPolicy } from "../types";
import { desktopPolicy } from "./desktop";
import { phonePolicy } from "./phone";
import { tabletPolicy } from "./tablet";
import { watchPolicy } from "./watch";

import { widgetPolicy } from "./widget";

const POLICIES: Record<FormFactor, WindowPolicy> = {
  desktop: desktopPolicy,
  tablet: tabletPolicy,
  phone: phonePolicy,
  watch: watchPolicy,
  widget: widgetPolicy,
};

export function getWindowPolicy(formFactor: FormFactor): WindowPolicy {
  return POLICIES[formFactor];
}

export { desktopPolicy, tabletPolicy, phonePolicy, watchPolicy, widgetPolicy };
export { PHONE_RECT, WATCH_RECT, maximizedRect } from "./desktop";
export { reflowTabletWindows } from "./tablet";
export { phoneVisibleWindowIds } from "./phone";
export { watchVisibleWindows, clampGlanceIndex } from "./watch";
