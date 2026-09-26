// SVG text cannot wrap or ellipsize, so long labels are cut to fit the space between nodes
const MAX_LABEL_LENGTH = 22;

export const truncateLabel = (label: string): string =>
  label.length > MAX_LABEL_LENGTH
    ? `${label.slice(0, MAX_LABEL_LENGTH - 1).trimEnd()}…`
    : label;
