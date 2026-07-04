import { useCallback, useState } from "react";

const MAX_DISPLAY_LENGTH = 10;

function compute(a: number, b: number, operator: string): number {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? Number.NaN : a / b;
    default:
      return b;
  }
}

function formatResult(value: number): string {
  if (!Number.isFinite(value)) return "Error";
  const rounded = Math.round(value * 1e10) / 1e10;
  const text = String(rounded);
  if (text.length <= MAX_DISPLAY_LENGTH) return text;
  return rounded.toPrecision(MAX_DISPLAY_LENGTH - 2).replace(/\.?0+$/, "");
}

export function useCalculator(initialValue = "0") {
  const [display, setDisplay] = useState(initialValue);
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [freshEntry, setFreshEntry] = useState(true);

  const clearAll = useCallback(() => {
    setDisplay("0");
    setStoredValue(null);
    setOperator(null);
    setFreshEntry(true);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay("0");
    setFreshEntry(true);
  }, []);

  const inputDigit = useCallback(
    (digit: string) => {
      setDisplay((current) => {
        if (freshEntry) {
          setFreshEntry(false);
          return digit === "." ? "0." : digit;
        }

        if (digit === "." && current.includes(".")) return current;
        if (current === "0" && digit !== ".") return digit;
        if (current.length >= MAX_DISPLAY_LENGTH) return current;
        return current + digit;
      });
    },
    [freshEntry],
  );

  const handleOperator = useCallback(
    (nextOperator: string) => {
      const current = Number.parseFloat(display);
      if (storedValue !== null && operator && !freshEntry) {
        const result = compute(storedValue, current, operator);
        const formatted = formatResult(result);
        setDisplay(formatted);
        setStoredValue(Number.parseFloat(formatted));
      } else {
        setStoredValue(current);
      }
      setOperator(nextOperator);
      setFreshEntry(true);
    },
    [display, freshEntry, operator, storedValue],
  );

  const handleEquals = useCallback(() => {
    if (storedValue === null || !operator) return;
    const current = Number.parseFloat(display);
    const result = compute(storedValue, current, operator);
    setDisplay(formatResult(result));
    setStoredValue(null);
    setOperator(null);
    setFreshEntry(true);
  }, [display, operator, storedValue]);

  const toggleSign = useCallback(() => {
    setDisplay((current) => {
      if (current === "0" || current === "Error") return current;
      return current.startsWith("-") ? current.slice(1) : `-${current}`;
    });
    setFreshEntry(false);
  }, []);

  const applyPercent = useCallback(() => {
    setDisplay((current) => formatResult(Number.parseFloat(current) / 100));
    setFreshEntry(true);
  }, []);

  const press = useCallback(
    (key: string) => {
      if (key === "c") {
        clearAll();
        return;
      }
      if (key === "ce") {
        clearEntry();
        return;
      }
      if (key === "sign") {
        toggleSign();
        return;
      }
      if (key === "%") {
        applyPercent();
        return;
      }
      if (key === "=") {
        handleEquals();
        return;
      }
      if (["+", "-", "*", "/"].includes(key)) {
        handleOperator(key);
        return;
      }
      inputDigit(key);
    },
    [applyPercent, clearAll, clearEntry, handleEquals, handleOperator, inputDigit, toggleSign],
  );

  return { display, press, clearAll };
}
