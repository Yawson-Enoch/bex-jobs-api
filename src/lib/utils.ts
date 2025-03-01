import bcrypt from 'bcryptjs';

import env from '@/env';

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

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(env.PSWD_SALT);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (
  incomingPassword: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(incomingPassword, hashedPassword);
};

export {
  capitalizeFirstLetterOfWord,
  capitalizeFirstLetterOfWords,
  comparePassword,
  hashPassword,
};
