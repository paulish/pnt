// @flow
const Az = require('az');
const last = require('lodash').last;
const uniq = require('lodash').uniq;
const constants = require('./constants');

/**
 * Returns list words from text.
 */
const getWords = (text) => Az
  .Tokens(text)
  .tokens
  .filter(({ type }) => type === Az.Tokens.WORD)
  .map(({ st, length }) => text.substr(st, length).toLowerCase());

/**
 * Checks text for trigger words and yields possible replies.
 */
const getByWordTrigger = function* (text) {
  for (const word of getWords(text)) {
    for (const [regexp, answer] of constants.TRIGGERS) {
      if (word.match(regexp)) {
        yield answer;
      }
    }
  }
};

/**
 * Checks if text is a question and returns answer.
 */
const getAnswerToQuestion = (text) => {
  if (text.trim().endsWith('?')) {
    return [constants.ANSWER_TO_QUESTION];
  }

  const questionWords = getWords(text)
    .map((word) => Az.Morph(word))
    .filter((morphs) => morphs.length && morphs[0].tag.Ques);

  if (questionWords.length) {
    return [constants.ANSWER_TO_QUESTION];
  } else {
    return [];
  }
};

/**
 * Returns first syllable of a words.
 */
const getFirstSyllable = (word) => {
  const result = [];

  let readVowel = false;

  for (const letter of word) {
    const isVowel = constants.VOWELS.indexOf(letter) !== -1;

    if (readVowel && !isVowel) {
      break;
    }

    if (isVowel) {
      readVowel = true;
    }

    result.push(letter);
  }

  return result.join('');
};

/**
 * Returns possible rhyme for noun and adjective.
 */
const getRhyme = (word) => {
  const morphs = Az.Morph(word);
  if (!morphs.length) {
    return;
  }

  const { tag } = morphs[0];
  if (!tag.NOUN && !tag.ADJF) {
    return;
  }

  const syllable = getFirstSyllable(word);
  if (!syllable || syllable === word) {
    return;
  }

  const prefix = constants.VOWEL_TO_RHYME[last(syllable)];
  const postfix = word.substr(syllable.length);

  return `${prefix}${postfix}`;
};

/**
 * Returns all possible rhymes for text.
 */
const getRhymes = (text) =>
  getWords(text)
    .map(getRhyme)
    .filter(Boolean)
    .reverse();

/**
 * Returns all possible replies to text.
 */
module.exports = (text) => {
  const answers = uniq([
    ...getByWordTrigger(text),
    ...getAnswerToQuestion(text),
    ...getRhymes(text),
  ]);

  if (answers.length) {
    return answers;
  } else {
    return constants.NO_ANSWERS;
  }
}