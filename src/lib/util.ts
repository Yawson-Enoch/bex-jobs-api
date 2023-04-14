const removeRedundantSpacesInAString = (words: string): string => {
  return words.trim().replaceAll(/\W{2,}/g, ' ');
};

const capitalizeFirstLetterOfWord = (word: string): string => {
  const newWord = removeRedundantSpacesInAString(word);
  return newWord.slice(0, 1).toUpperCase() + newWord.slice(1).toLowerCase();
};

const capitalizeFirstLetterOfWords = (words: string): string => {
  return words
    .trim()
    .replaceAll(/\s{2,}/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export {
  removeRedundantSpacesInAString,
  capitalizeFirstLetterOfWord,
  capitalizeFirstLetterOfWords,
};
