export interface ValueObject<T> {
  value(): T;
  equals(vo: ValueObject<T>): boolean;
}
