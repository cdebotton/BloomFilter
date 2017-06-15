import * as fs from 'fs';
import BloomFilter from './BloomFilter';
import { fastHash, sdbm, md5, Timer } from './utils';

const read = (path: string): Promise<string> => new Promise((resolve, reject) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(data.toString());
  });
});

const makeWords = (count: number = 10, maxLength: number = 16): string[] => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  return Array.from<string>({ length: count })
    .map(() => {
      const limit = Math.ceil(Math.random() * maxLength);
      return Array.from<string>({ length: limit }).map(() => {
        const idx = Math.floor(Math.random() * letters.length);
        return letters[idx];
      }).join('');
    });
};

const checkAllWords = (words: string[], bloomFilter: BloomFilter<string>, onlyTrue = false): { [key: string]: boolean } => {
  return words.reduce((result: {[key: string]: boolean}, word) => {
      const isReal = bloomFilter.query(word);;
      
      if (!onlyTrue || isReal) {
        result[word] = isReal;
      }

      return result;
    }, {});
};

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
    ['hello', 'cat', 'dog', 'red', 'ewqeqew', 'fibble', 'gooseparts', 'goose', 'party', 'kettle', 'alphabet', 'xylophone', 'xyllopone'],
    bloomFilter
  ));
  lookupManyWordsTimer.end();

  console.log(checkAllWords(makeWords(512), bloomFilter, true));
};

run();