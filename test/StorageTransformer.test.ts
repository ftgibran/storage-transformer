import {DataStorage} from '../src'

class Foo {
  constructor(public id: number, public name: string) {}

  get nameWithId() {
    return `${this.name}__${this.id}`
  }
}

abstract class AppStorage {
  static get dummyFoo() {
    return DataStorage.bind('@dummyFoo').as(Foo)
  }

  static get dummyArrayOfFoo() {
    return DataStorage.bind('@dummyArrayOfFoo').asArrayOf(Foo)
  }

  static get dummyString() {
    return DataStorage.bind('@dummyString').asString()
  }

  static get dummyNumber() {
    return DataStorage.bind('@dummyNumber').asNumber()
  }

  static get dummyBoolean() {
    return DataStorage.bind('@dummyBoolean').asBoolean()
  }

  static get dummyAny() {
    return DataStorage.bind('@dummyAny').asAny()
  }
}

describe('StorageTransformer', () => {
  it('can store Foo', async () => {
    const storage = AppStorage.dummyFoo
    const sample = new Foo(1, 'foo')

    expect(storage.load()).toBeNull()

    storage.save(sample)

    const data = storage.load()
    expect(data?.nameWithId).toBe('foo__1')

    storage.erase()

    expect(storage.load()).toBeNull()
  })

  it('can store Array of Foo', async () => {
    const storage = AppStorage.dummyArrayOfFoo
    const sample = [
      new Foo(1, 'foo1'),
      new Foo(2, 'foo2'),
      new Foo(3, 'foo3'),
      new Foo(4, 'foo4'),
    ]

    expect(storage.load()).toBeNull()

    storage.save(sample)

    const data = storage.load()
    expect(data?.[0]?.nameWithId).toBe('foo1__1')
    expect(data?.[1]?.nameWithId).toBe('foo2__2')
    expect(data?.[2]?.nameWithId).toBe('foo3__3')
    expect(data?.[3]?.nameWithId).toBe('foo4__4')

    storage.erase()

    expect(storage.load()).toBeNull()
  })

  it('can store string data', async () => {
    const storage = AppStorage.dummyString
    const sample = 'foo'

    expect(storage.load()).toBeNull()

    storage.save(sample)

    const data = storage.load()
    expect(typeof data).toBe('string')
    expect(data).toEqual('foo')

    storage.erase()

    expect(storage.load()).toBeNull()
  })

  it('can store number data', async () => {
    const storage = AppStorage.dummyNumber
    const sample = 99

    expect(storage.load()).toBeNull()

    storage.save(sample)

    const data = storage.load()
    expect(typeof data).toBe('number')
    expect(data).toEqual(99)

    storage.erase()

    expect(storage.load()).toBeNull()
  })

  it('can store boolean data', async () => {
    const storage = AppStorage.dummyBoolean
    const sample = true

    expect(storage.load()).toBeNull()

    storage.save(sample)

    const data = storage.load()
    expect(typeof data).toBe('boolean')
    expect(data).toEqual(true)

    storage.erase()

    expect(storage.load()).toBeNull()
  })

  it('can store any data', async () => {
    const storage = AppStorage.dummyAny
    const sample = {
      foo: 'foo',
    }

    expect(storage.load()).toBeNull()

    storage.save(sample)

    const data = storage.load()
    expect(data).toEqual({foo: 'foo'})

    storage.erase()

    expect(storage.load()).toBeNull()
  })

  it('can store Foo instance', async () => {
    const sample1 = new Foo(1, 'foo1')
    const sample2 = new Foo(2, 'foo2')

    const storage = DataStorage.bind('whatever').as(sample1)

    expect(storage.load()).toBeNull()

    storage.save(sample2)

    const data = storage.load()
    expect(sample1).toEqual(sample2)
    expect(sample1?.nameWithId).toBe('foo2__2')
    expect(data?.nameWithId).toBe('foo2__2')

    storage.erase()

    expect(storage.load()).toBeNull()
  })
})
