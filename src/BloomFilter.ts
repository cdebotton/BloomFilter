type Hasher<T> = (value: T) => number;

export default class BloomFilter<T> {
  private bitmap: Uint8Array;
  private hashFunctions: Hasher<T>[];

  constructor(size: number = 1024, hashFunctions: Hasher<T>[]) {
    this.bitmap = new Uint8Array(size);
    this.bitmap.fill(0);
    this.hashFunctions = hashFunctions;
  }

  private computeHash(value: T): number[] {
    return this.hashFunctions.map(fn => Math.abs(fn(value) % this.bitmap.length));
  }

  insert(value: T) {
    this.computeHash(value)
      .forEach(hash => this.bitmap[hash] = 1);
  }

  insertMany(values: T[]) {
    values.forEach(value => this.insert(value));
  }

  query(value: T): boolean {
    return this.computeHash(value)
      .map(hash => this.bitmap[hash])
      .reduce((result, bit) => bit === 1 && result, true);
  }
}