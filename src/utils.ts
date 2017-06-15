import { Md5 } from 'ts-md5/dist/md5';

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
