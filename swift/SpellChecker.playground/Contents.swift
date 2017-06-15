//: Playground - noun: a place where people can play

import Foundation

class BloomFilter<T: Hashable> {
    typealias Bitmap = [Bool]
    private var bitmap: Bitmap
    private let hashFunctions: [(T) -> Int]
    
    init(size: Int = 512, hashFunctions: [(T) -> Int]) {
        self.bitmap = Bitmap(repeating: false, count: size)
        self.hashFunctions = hashFunctions
    }
    
    private func computeHashes(_ value: T) -> [Int] {
        return hashFunctions.map { hashFunc in
            return abs(hashFunc(value) % bitmap.count)
        }
    }
    
    func add(_ element: T) {
        computeHashes(element).forEach { bitmap[$0] = true }
    }
    
    func add(_ elements: [T]) {
        elements.forEach { add($0) }
    }
    
    func find(_ value: T) -> Bool {
        return computeHashes(value)
            .map { bitmap[$0] }
            .reduce(true, { $0 && $1 })
    }
}

func simpleHash(value: String) -> Int {
    return value.hashValue
}

// Benefit of Swift and protocols, you can make anything hashable so that it can be
// used by a bloom filter.

struct User {
    let id: Int
    let username: String
}

extension User: Hashable, Equatable {
    var hashValue: Int {
        return username.hashValue
    }
}

func == (lhr: User, rhr: User) -> Bool {
    return lhr.hashValue == rhr.hashValue
}

// Similarly, an Image can be extended with the hashable protocol to derive a hash from
// its bitmap data, could be used to accomplish image searching.


if let words = try? String(contentsOfFile: "/usr/share/dict/words").components(separatedBy: "\n") {
    var filter = BloomFilter<String>(size: 1024 * 1024, hashFunctions: [simpleHash])
    filter.add(words)
    print(filter.find("cat"))
    print(filter.find("eqweqweqwe"))
}
