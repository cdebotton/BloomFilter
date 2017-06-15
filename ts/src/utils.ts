import * as fs from 'fs';
import { Md5 } from 'ts-md5/dist/md5';
import BloomFilter from './BloomFilter';

export const fastHash = (str: string): number => {
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  return hash >>> 0;
};

export const sdbm = (str: string): number => {
  let hash = 0;
  let i = str.length;
  while (i) {
    hash = str.charCodeAt(--i) & (hash << 6) & (hash << 16) & hash;
  }

  return hash;
};

export const md5 = (str: string): number => {
  const hash = Md5.hashStr(str, true).toString();
  return parseInt(hash, 10);
};

export class Timer {
  name: string;
  start: number;

  constructor(name: string) {
    this.name= name;
    this.start = Date.now();
  }

  end() {
    const delta = Date.now() - this.start;
    console.log(`Completed [${this.name}] in ${delta}ms.`);
  }
}

export const read = (path: string): Promise<string> => new Promise((resolve, reject) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(data.toString());
  });
});

export const makeWords = (count: number = 10, maxLength: number = 16): string[] => {
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

export const checkAllWords = (words: string[], bloomFilter: BloomFilter<string>, onlyTrue = false): { [key: string]: boolean } => {
  return words.reduce((result: {[key: string]: boolean}, word) => {
      const isReal = bloomFilter.query(word);;
      
      if (!onlyTrue || isReal) {
        result[word] = isReal;
      }

      return result;
    }, {});
};