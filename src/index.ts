import * as fs from 'fs';
import BloomFilter from './BloomFilter';
import { fastHash, sdbm, Timer } from './utils';

const read = (path: string): Promise<string> => new Promise((resolve, reject) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(data.toString());
  });
});

const run = async () => {
  const readTimer = new Timer('Read dictionary');
  const dictionary = await read('/usr/share/dict/words');
  readTimer.end();

  const words = dictionary.split('\n');
  const addToFilterTimer = new Timer('Add all words to filter');
  const bloomFilter = new BloomFilter<string>(1024 * 512, [fastHash, sdbm]);
  bloomFilter.insertMany(words);
  addToFilterTimer.end();

  const lookupWordTimer = new Timer('Lookup a word');
  bloomFilter.query('video');
  lookupWordTimer.end();

  const lookupManyWordsTimer = new Timer('Lookup a word');
  console.log(
    ['hello', 'cat', 'dog', 'red', 'ewqeqew', 'fibble', 'gooseparts', 'goose', 'party']
      .reduce((result: {[key: string]: boolean}, word) => {
        result[word] = bloomFilter.query(word);
        return result;
      }, {}),  
  );
  lookupManyWordsTimer.end();
};

run();