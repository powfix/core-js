type Without<T, U = never> = { [P in keyof T]?: U }

export type XOR<T, U> = (Without<T> & U) | (Without<U> & T);
