# @dev-plus-plus/storage-transformer

The JS native localStorage that transforms the storage raw data into a class instance or any other type.

It uses [Class-Transformer](https://github.com/typestack/class-transformer) to transform plain objects from/to class-objects

# Install
```
npm i @dev-plus-plus/storage-transformer class-transformer
```

## Getting Started

Imagine you want to store an instance of Foo class:

```typescript
// ~src/Foo.ts
export class Foo {
  constructor(public id: number, public name: string) {}

  get nameWithId() {
    return `${this.name}__${this.id}`
  }
}
```

You may create an abstract class to manage the storage in a single file:

```typescript
// ~src/AppStorage.ts
import {DataStorage} from '@dev-plus-plus/storage-transformer'
import {Foo} from '~src/Foo'

export abstract class AppStorage {
  static get dummyFoo() {
    return DataStorage.bind('@dummyFoo').as(Foo)
  }

  static get dummyArrayOfFoo() {
    return DataStorage.bind('@dummyArray').asArrayOf(Foo)
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
```

## Usage

Example of saving and loading a foo instance:

```typescript
import {AppStorage} from '~src/AppStorage'
import {Foo} from '~src/Foo'

const sample = new Foo(1, 'foo')

AppStorage.dummyFoo.save(sample) // it uses localStorage.setItem

const data = AppStorage.dummyFoo.load() // it uses localStorage.getItem

console.log(data?.nameWithId) // 'foo__1'

AppStorage.dummyFoo.erase() // it uses localStorage.removeItem
```

Example of saving and loading an array of foo instances:

```typescript
import {AppStorage} from '~src/AppStorage'
import {Foo} from '~src/Foo'

const sample = [
  new Foo(1, 'foo1'),
  new Foo(2, 'foo2'),
  new Foo(3, 'foo3'),
  new Foo(4, 'foo4'),
]

AppStorage.dummyArrayOfFoo.save(sample) // it uses localStorage.setItem

const data = AppStorage.dummyArrayOfFoo.load() // it uses localStorage.getItem

console.log(data?.[0]?.nameWithId) // 'foo1__1'
console.log(data?.[1]?.nameWithId) // 'foo2__2'
console.log(data?.[2]?.nameWithId) // 'foo3__3'
console.log(data?.[3]?.nameWithId) // 'foo4__4'

AppStorage.dummyArrayOfFoo.erase() // it uses localStorage.removeItem
```

Example of saving and loading any data type (string, number, boolean, etc.):

```typescript
import {AppStorage} from '~src/AppStorage'

AppStorage.dummyString.save('foo')
AppStorage.dummyNumber.save(99)
AppStorage.dummyBoolean.save(true)
AppStorage.dummyAny.save({foo: 'foo'})

console.log(AppStorage.dummyString.load()) // 'foo'
console.log(AppStorage.dummyNumber.load()) // 99
console.log(AppStorage.dummyBoolean.load()) // true
console.log(AppStorage.dummyAny.load()) // {foo: 'foo'}
```
