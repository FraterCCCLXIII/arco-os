import { clampRect } from "./geometry";
import { getWindowPolicy, maximizedRect, phoneVisibleWindowIds, reflowTabletWindows, watchVisibleWindows } from "./policies";
import { bringToFront, nextStackOrder, sendToBack, visibleWindows } from "./stack";
import type {
  FormFactor,
  SurfaceAction,
  SurfaceManagerState,
  SurfaceRect,
  SurfaceWindow,
} from "./types";

export function createInitialSurfaceState(
  initialWindows: SurfaceWindow[],
  formFactor: FormFactor = "desktop",
  shell: SurfaceManagerState["shell"] = "macos",
): SurfaceManagerState {
  const baseWindows = initialWindows.filter((w) => w.layer === "base" && w.state !== "minimized");
  return {
    formFactor,
    shell,
    windows: initialWindows,
    activeWindowId: initialWindows[0]?.id,
    phoneStack: baseWindows.map((w) => w.id),
    watchGlanceIndex: 0,
  };
}

function updateWindow(
  windows: SurfaceWindow[],
  windowId: string,
  patch: Partial<SurfaceWindow>,
): SurfaceWindow[] {
  return windows.map((w) => (w.id === windowId ? { ...w, ...patch } : w));
}

function applyGeometry(
  state: SurfaceManagerState,
  windowId: string,
  rect: SurfaceRect,
  kind: "MOVE" | "RESIZE",
): SurfaceManagerState {
  const policy = getWindowPolicy(state.formFactor);
  if (kind === "MOVE" && !policy.allowDrag) return state;
  if (kind === "RESIZE" && !policy.allowResize) return state;

  const constrained = policy.constrainRect(rect, state.windows, windowId);
  let windows = updateWindow(state.windows, windowId, { rect: constrained });
  windows = bringToFront(windows, windowId);

  let next: SurfaceManagerState = { ...state, windows, activeWindowId: windowId };
  if (policy.onFocus) next = policy.onFocus(next, windowId);
  return next;
}

export function surfaceReducer(state: SurfaceManagerState, action: SurfaceAction): SurfaceManagerState {
  const policy = getWindowPolicy(state.formFactor);

  switch (action.type) {
    case "OPEN": {
      const { window: input } = action;
      const existing = state.windows.find((w) => w.appId === input.appId && w.state !== "minimized");
      if (existing) {
        return surfaceReducer(state, { type: "FOCUS", windowId: existing.id });
      }

      const rect = policy.defaultPlacement(state.windows, input);
      const newWindow: SurfaceWindow = {
        id: input.id,
        appId: input.appId,
        title: input.title,
        icon: input.icon,
        rect,
        state: state.formFactor === "phone" || state.formFactor === "watch" || state.formFactor === "widget" ? "fullscreen" : "normal",
        stackOrder: nextStackOrder(state.windows),
        layer: input.layer ?? "base",
        content: input.content,
      };

      let next: SurfaceManagerState = {
        ...state,
        windows: [...state.windows, newWindow],
        activeWindowId: newWindow.id,
      };
      next = { ...next, windows: bringToFront(next.windows, newWindow.id) };
      if (policy.onOpen) next = policy.onOpen(next, newWindow);
      if (policy.onFocus) next = policy.onFocus(next, newWindow.id);
      return next;
    }

    case "CLOSE": {
      const windows = state.windows.filter((w) => w.id !== action.windowId);
      const phoneStack = state.phoneStack.filter((id) => id !== action.windowId);
      const baseVisible = visibleWindows(windows).filter((w) => w.layer === "base");
      const activeWindowId =
        state.activeWindowId === action.windowId
          ? phoneStack[phoneStack.length - 1] ?? baseVisible[baseVisible.length - 1]?.id
          : state.activeWindowId;
      return {
        ...state,
        windows,
        phoneStack,
        activeWindowId,
        watchGlanceIndex: clampGlance(state.watchGlanceIndex, baseVisible.length),
      };
    }

    case "FOCUS": {
      let next: SurfaceManagerState = { ...state, activeWindowId: action.windowId, windows: bringToFront(state.windows, action.windowId) };
      if (policy.onFocus) next = policy.onFocus(next, action.windowId);
      return next;
    }

    case "MINIMIZE": {
      const windows = updateWindow(state.windows, action.windowId, { state: "minimized" });
      const phoneStack = state.phoneStack.filter((id) => id !== action.windowId);
      const baseVisible = visibleWindows(windows).filter((w) => w.layer === "base");
      return {
        ...state,
        windows,
        phoneStack,
        activeWindowId: state.activeWindowId === action.windowId ? undefined : state.activeWindowId,
        watchGlanceIndex: clampGlance(state.watchGlanceIndex, baseVisible.length),
      };
    }

    case "RESTORE": {
      let windows = updateWindow(state.windows, action.windowId, { state: "normal" });
      let next: SurfaceManagerState = {
        ...state,
        windows: bringToFront(windows, action.windowId),
        activeWindowId: action.windowId,
      };
      if (state.formFactor === "tablet") {
        next = { ...next, windows: reflowTabletWindows(next.windows) };
      }
      if (policy.onFocus) next = policy.onFocus(next, action.windowId);
      return next;
    }

    case "MAXIMIZE": {
      const target = state.windows.find((w) => w.id === action.windowId);
      if (!target || !policy.allowResize) return state;
      if (target.state === "maximized") {
        const restored = target.savedRect ?? target.rect;
        return {
          ...state,
          windows: updateWindow(state.windows, action.windowId, {
            state: "normal",
            rect: clampRect(restored),
            savedRect: undefined,
          }),
        };
      }
      return {
        ...state,
        windows: updateWindow(state.windows, action.windowId, {
          state: "maximized",
          savedRect: target.rect,
          rect: maximizedRect(),
        }),
        activeWindowId: action.windowId,
      };
    }

    case "BRING_TO_FRONT": {
      let next: SurfaceManagerState = { ...state, windows: bringToFront(state.windows, action.windowId), activeWindowId: action.windowId };
      if (policy.onFocus) next = policy.onFocus(next, action.windowId);
      return next;
    }

    case "SEND_TO_BACK": {
      return { ...state, windows: sendToBack(state.windows, action.windowId) };
    }

    case "MOVE":
      return applyGeometry(state, action.windowId, action.rect, "MOVE");

    case "RESIZE":
      return applyGeometry(state, action.windowId, action.rect, "RESIZE");

    case "PUSH": {
      if (state.formFactor !== "phone") return state;
      const stack = state.phoneStack.filter((id) => id !== action.windowId);
      stack.push(action.windowId);
      let next: SurfaceManagerState = {
        ...state,
        phoneStack: stack,
        activeWindowId: action.windowId,
        windows: bringToFront(state.windows, action.windowId),
      };
      if (policy.onFocus) next = policy.onFocus(next, action.windowId);
      return next;
    }

    case "POP": {
      if (state.formFactor !== "phone" || state.phoneStack.length <= 1) {
        if (state.phoneStack.length === 1) {
          return surfaceReducer(state, { type: "MINIMIZE", windowId: state.phoneStack[0] });
        }
        return state;
      }
      const stack = state.phoneStack.slice(0, -1);
      const activeWindowId = stack[stack.length - 1];
      return { ...state, phoneStack: stack, activeWindowId };
    }

    case "PRESENT_SHEET": {
      const windows = updateWindow(state.windows, action.windowId, { layer: "sheet" });
      let next: SurfaceManagerState = {
        ...state,
        windows: bringToFront(windows, action.windowId),
        activeWindowId: action.windowId,
      };
      if (policy.onFocus) next = policy.onFocus(next, action.windowId);
      return next;
    }

    case "DISMISS_SHEET": {
      return {
        ...state,
        windows: updateWindow(state.windows, action.windowId, { layer: "base" }),
      };
    }

    case "NEXT_GLANCE": {
      if (state.formFactor !== "watch") return state;
      const base = visibleWindows(state.windows).filter((w) => w.layer === "base");
      if (base.length <= 1) return state;
      const watchGlanceIndex = Math.min(base.length - 1, state.watchGlanceIndex + 1);
      return {
        ...state,
        watchGlanceIndex,
        activeWindowId: base[watchGlanceIndex]?.id ?? state.activeWindowId,
      };
    }

    case "PREV_GLANCE": {
      if (state.formFactor !== "watch") return state;
      const base = visibleWindows(state.windows).filter((w) => w.layer === "base");
      if (base.length <= 1) return state;
      const watchGlanceIndex = Math.max(0, state.watchGlanceIndex - 1);
      return {
        ...state,
        watchGlanceIndex,
        activeWindowId: base[watchGlanceIndex]?.id ?? state.activeWindowId,
      };
    }

    case "SET_GLANCE_INDEX": {
      if (state.formFactor !== "watch") return state;
      const base = visibleWindows(state.windows).filter((w) => w.layer === "base");
      const watchGlanceIndex = clampGlance(action.index, base.length);
      return {
        ...state,
        watchGlanceIndex,
        activeWindowId: base[watchGlanceIndex]?.id ?? state.activeWindowId,
      };
    }

    case "SET_FORM_FACTOR": {
      if (action.formFactor === state.formFactor) return state;
      const nextPolicy = getWindowPolicy(action.formFactor);
      let next: SurfaceManagerState = { ...state, formFactor: action.formFactor };
      next = {
        ...next,
        windows: next.windows.map((w) => ({
          ...w,
          rect: nextPolicy.defaultPlacement(next.windows, {
            id: w.id,
            appId: w.appId,
            title: w.title,
            icon: w.icon,
          }),
          state:
            action.formFactor === "phone" || action.formFactor === "watch" || action.formFactor === "widget"
              ? w.state === "minimized"
                ? "minimized"
                : "fullscreen"
              : w.state === "fullscreen"
                ? "normal"
                : w.state,
        })),
      };
      if (nextPolicy.onFormFactorChange) next = nextPolicy.onFormFactorChange(next);
      return next;
    }

    case "SET_SHELL":
      return { ...state, shell: action.shell };

    default:
      return state;
  }
}

function clampGlance(index: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(count - 1, Math.max(0, index));
}

export function getRenderableWindows(state: SurfaceManagerState): SurfaceWindow[] {
  const policy = getWindowPolicy(state.formFactor);
  const visible = visibleWindows(state.windows);

  if (state.formFactor === "phone") {
    const ids = new Set(phoneVisibleWindowIds(state));
    return visible.filter((w) => ids.has(w.id));
  }

  if (state.formFactor === "watch") {
    return watchVisibleWindows(state.windows, state.watchGlanceIndex);
  }

  if (state.formFactor === "widget") {
    return [];
  }

  if (state.formFactor === "tablet") {
    return visible.filter((w) => w.layer === "base").slice(0, policy.maxVisible);
  }

  return visible.filter((w) => w.layer === "base" || w.layer === "sheet" || w.layer === "modal");
}
