export interface ComposerTypeaheadItem {
  id: string;
  /** Full suggested message text. */
  text: string;
}

export interface ComposerTypeaheadProps {
  value: string;
  items: ComposerTypeaheadItem[];
  activeIndex?: number;
  onSelect: (item: ComposerTypeaheadItem) => void;
  className?: string;
}

/** Split a suggestion into muted prefix + highlighted completion relative to current input. */
export function splitTypeaheadSuggestion(value: string, suggestion: string): { prefix: string; completion: string } {
  const input = value.trimEnd();
  let index = 0;
  const limit = Math.min(input.length, suggestion.length);
  while (index < limit && input[index]!.toLowerCase() === suggestion[index]!.toLowerCase()) {
    index += 1;
  }
  return {
    prefix: suggestion.slice(0, index),
    completion: suggestion.slice(index),
  };
}

/** Keep suggestions that extend the current input and still have text to complete. */
export function filterTypeaheadItems(value: string, items: ComposerTypeaheadItem[]): ComposerTypeaheadItem[] {
  const input = value.trimEnd();
  if (!input) return [];

  return items.filter((item) => {
    if (item.text.length <= input.length) return false;
    if (!item.text.toLowerCase().startsWith(input.toLowerCase())) return false;
    return splitTypeaheadSuggestion(input, item.text).completion.length > 0;
  });
}
