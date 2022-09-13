import { compose } from 'redux';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
  interface ObjectConstructor {
    typedKeys<T>(obj: T): Array<keyof T>
  }
}
