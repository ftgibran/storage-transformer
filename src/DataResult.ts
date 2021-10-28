import * as Trans from 'class-transformer'

import type {DataStorage} from './DataStorage'

export type DataType<T> = Trans.ClassConstructor<T> | T

export class DataResult<T = any> {
  constructor(dataStore: DataStorage, dataType?: DataType<T>) {
    this.dataStore = dataStore
    this.dataType = dataType
  }

  private readonly dataStore: DataStorage
  readonly dataType?: DataType<T>

  erase() {
    localStorage.removeItem(this.dataStore.key)
  }

  save(data: T, options?: Trans.ClassTransformOptions) {
    const content = JSON.stringify(Trans.classToPlain(data, options))

    localStorage.setItem(this.dataStore.key, content)
  }

  load(options?: Trans.ClassTransformOptions) {
    const content = localStorage.getItem(this.dataStore.key)

    if (content === null) {
      return null
    }

    let data: T = JSON.parse(content ?? '{}')

    if (this.dataType === undefined) {
      return data
    }

    if (typeof this.dataType === 'object') {
      // Class object instance from constructor (new CustomClass())
      // The instance will be automatically populated
      data = Trans.plainToClassFromExist(this.dataType as T, data, options)
    } else if (typeof this.dataType === 'function') {
      // Class constructor (CustomClass, Number, String, Boolean, etc.)
      data = Trans.plainToClass(
        this.dataType as Trans.ClassConstructor<T>,
        data,
        options
      )
    } else throw Error('Error: Entity should be either a Class or ClassObject')

    return data
  }
}
