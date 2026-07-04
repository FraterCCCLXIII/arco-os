import { useCallback, useMemo, useReducer } from "react";
import type { DesktopApp, DesktopShell } from "../components/workspaces/desktop/types";
import { getWindowPolicy } from "./policies";
import { createInitialSurfaceState, getRenderableWindows, surfaceReducer } from "./reducer";
import type {
  FormFactor,
  OpenWindowInput,
  SurfaceRect,
  SurfaceWindow,
} from "./types";
import { fromSurfaceWindow } from "./types";

export interface UseSurfaceManagerOptions {
  formFactor?: FormFactor;
  shell?: DesktopShell;
  initialWindows?: SurfaceWindow[];
}

export function useSurfaceManager(options: UseSurfaceManagerOptions = {}) {
  const {
    formFactor: initialFormFactor = "desktop",
    shell: initialShell = "macos",
    initialWindows = [],
  } = options;

  const [state, dispatch] = useReducer(
    surfaceReducer,
    createInitialSurfaceState(initialWindows, initialFormFactor, initialShell),
  );

  const policy = useMemo(() => getWindowPolicy(state.formFactor), [state.formFactor]);
  const renderableWindows = useMemo(() => getRenderableWindows(state), [state]);
  const legacyWindows = useMemo(() => state.windows.map(fromSurfaceWindow), [state.windows]);

  const open = useCallback((window: OpenWindowInput) => {
    dispatch({ type: "OPEN", window });
  }, []);

  const openApp = useCallback(
    (app: DesktopApp, factory: (app: DesktopApp, index: number) => OpenWindowInput) => {
      const input = factory(app, state.windows.length);
      dispatch({ type: "OPEN", window: input });
    },
    [state.windows.length],
  );

  const close = useCallback((windowId: string) => {
    dispatch({ type: "CLOSE", windowId });
  }, []);

  const focus = useCallback((windowId: string) => {
    dispatch({ type: "FOCUS", windowId });
  }, []);

  const minimize = useCallback((windowId: string) => {
    dispatch({ type: "MINIMIZE", windowId });
  }, []);

  const restore = useCallback((windowId: string) => {
    dispatch({ type: "RESTORE", windowId });
  }, []);

  const maximize = useCallback((windowId: string) => {
    dispatch({ type: "MAXIMIZE", windowId });
  }, []);

  const bringToFront = useCallback((windowId: string) => {
    dispatch({ type: "BRING_TO_FRONT", windowId });
  }, []);

  const sendToBack = useCallback((windowId: string) => {
    dispatch({ type: "SEND_TO_BACK", windowId });
  }, []);

  const moveWindow = useCallback((windowId: string, rect: SurfaceRect) => {
    dispatch({ type: "MOVE", windowId, rect });
  }, []);

  const resizeWindow = useCallback((windowId: string, rect: SurfaceRect) => {
    dispatch({ type: "RESIZE", windowId, rect });
  }, []);

  const push = useCallback((windowId: string) => {
    dispatch({ type: "PUSH", windowId });
  }, []);

  const pop = useCallback(() => {
    dispatch({ type: "POP" });
  }, []);

  const nextGlance = useCallback(() => {
    dispatch({ type: "NEXT_GLANCE" });
  }, []);

  const prevGlance = useCallback(() => {
    dispatch({ type: "PREV_GLANCE" });
  }, []);

  const setFormFactor = useCallback((formFactor: FormFactor) => {
    dispatch({ type: "SET_FORM_FACTOR", formFactor });
  }, []);

  const setShell = useCallback((shell: DesktopShell) => {
    dispatch({ type: "SET_SHELL", shell });
  }, []);

  return {
    state,
    policy,
    windows: state.windows,
    legacyWindows,
    renderableWindows,
    activeWindowId: state.activeWindowId,
    formFactor: state.formFactor,
    shell: state.shell,
    phoneStack: state.phoneStack,
    watchGlanceIndex: state.watchGlanceIndex,
    open,
    openApp,
    close,
    focus,
    minimize,
    restore,
    maximize,
    bringToFront,
    sendToBack,
    moveWindow,
    resizeWindow,
    push,
    pop,
    nextGlance,
    prevGlance,
    setFormFactor,
    setShell,
    dispatch,
  };
}

export type SurfaceManager = ReturnType<typeof useSurfaceManager>;
