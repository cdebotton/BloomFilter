import BloomFilter from './BloomFilter';

import {
  fastHash,
  sdbm,
  md5,
  Timer,
  read,
  checkAllWords,
  makeWords,
} from './utils';

const run = async () => {
  const readTimer = new Timer('Read dictionary');
  const dictionary = await read('/usr/share/dict/words');
  readTimer.end();

  const words = dictionary.split('\n');
  const addToFilterTimer = new Timer('Add all words to filter');
  const bloomFilter = new BloomFilter<string>(1024 * 1024 * 64, [fastHash, sdbm, md5]);
  bloomFilter.insertMany(words);
  addToFilterTimer.end();

  const lookupWordTimer = new Timer('Lookup a word');
  bloomFilter.query('video');
  lookupWordTimer.end();

  const lookupManyWordsTimer = new Timer('Lookup a word');
  console.log(checkAllWords(
    [
      'hello',
      'cat',
      'dog',
      'red',
      'ewqeqew',
      'fibble',
      'gooseparts',
      'goose',
      'party',
      'kettle',
      'alphabet',
      'xylophone',
      'xyllopone',
    ],
    bloomFilter
  ));
  lookupManyWordsTimer.end();

  console.log(checkAllWords(makeWords(512), bloomFilter, true));
};

run();