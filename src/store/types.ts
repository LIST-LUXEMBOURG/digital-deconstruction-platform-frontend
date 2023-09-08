/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

export interface RootState {
  version: string;
  isLoading: boolean;
}

export const SET_LOADING = 'setLoading';
export const IS_LOADING = 'isLoading';

export interface FetchErrorInterface {
  statusCode: number;
  message: string;
  [key: string]: any;
}
class FetchErrorBase extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'Fetch error';
  }
}
export class FetchError extends FetchErrorBase {
  public statusCode: number;
  constructor({ message, statusCode }: FetchErrorInterface) {
    super(message);
    this.name = 'Fetch error';
    Object.setPrototypeOf(this, FetchError.prototype);
    this.statusCode = statusCode;
  }
}

// @ts-ignore
export interface Tuple<T extends any[], L extends number> extends T {
  length: L;
}
