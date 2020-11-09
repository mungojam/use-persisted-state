import { SetStateAction } from 'react';

type ValueOrGenerator<T> = (() => T) | T;

function isValue<T>(o: ValueOrGenerator<T> | SetStateAction<T>): o is T {
    return typeof o !== 'function';
}

export {ValueOrGenerator, isValue};
