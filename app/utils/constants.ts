// Matches "1." or "1)" at the start of a line (handles "\n1. " or "^1. ")
export const LIST_START_RE = /(?:^|\n) {0,4}1[.)]\s/;

// Matches "\n\n" followed by a non-digit, non-whitespace character.
// Allows "-" and "*" so an outro that opens with a bullet list is also detected.
// Excludes digits so numbered list items (2., 3., ...) don't trigger it.
// Excludes whitespace so indented multi-paragraph descriptions don't trigger it.
export const OUTRO_START_RE = /\n\n([^\d\s])/;