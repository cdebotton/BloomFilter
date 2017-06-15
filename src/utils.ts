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