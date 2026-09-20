const WORD_BOUNDARY_REGEX = /(^|[\s'-])(\p{L})/gu;

export const capitalizeName = (rawName: string): string =>
  rawName
    .toLocaleLowerCase()
    .replace(
      WORD_BOUNDARY_REGEX,
      (_match, separator: string, firstLetter: string) =>
        `${separator}${firstLetter.toLocaleUpperCase()}`,
    );
