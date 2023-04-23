const capitalizeFirstLetterOfWord = (word: string): string => {
  return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
};

const capitalizeFirstLetterOfWords = (words: string): string => {
  return words
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export { capitalizeFirstLetterOfWord, capitalizeFirstLetterOfWords };
