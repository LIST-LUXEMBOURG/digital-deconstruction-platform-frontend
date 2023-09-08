/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { VueHttp, HttpClientsOptions } from "./types";
import { VueConstructor } from "vue";

const defaultOptions = {
  reservedKeywords: [
    "constructor",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "should",
    "toLocaleString",
    "toString",
    "valueOf",
  ],
};

class VueHttpClient implements VueHttp {
  readonly version: string = "0.0.4";
  _http: HttpClientsOptions = {};

  public install(Vue: VueConstructor, options?: any): void {
    Vue.prototype.$http = this._http;
  }

  constructor(options: HttpClientsOptions) {
    // iterate over the namespaces contain in the options object.
    for (const namespace in options) {
      // determine if the _http has a property with the specified "namespace".
      if (defaultOptions.reservedKeywords.includes(namespace))
        throw `The property "${namespace}" cannot be used as a namespace!`;

      const error = `The namespace "${namespace}" must at least have one Call function!`;
      const keys = Object.keys(options[namespace]);
      if (keys.length <= 2) throw error;

      const func = keys.find(
        (el) =>
          el !== "domain" &&
          el !== "options" &&
          typeof options[namespace][el] === "function"
      );

      if (func == undefined) throw error;
    }

    this._http = options;

    return {
      install: this.install,
      _http: this._http,
      version: this.version,
    };
  }
}

export default VueHttpClient;

export * from "./types";
