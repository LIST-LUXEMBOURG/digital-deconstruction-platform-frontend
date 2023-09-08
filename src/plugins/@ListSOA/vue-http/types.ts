/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import { VueConstructor } from "vue";

/**
 * A Call is a function that return another function.
 * More precisely, it returns a Fetch function.
 *
 * @property {any} params [0..N] parameters allowed
 */
export type Call = (
  ...params: any
) => Promise<Response> | Promise<Response[]> | Promise<any>;

/**
 * A HttpClientOptions is single client with a domain URL and a list of
 * Call functions
 *
 * @property {string} domain is the base URL of the server to contact.
 * @property {string} name is a name tag grouping together one or more Call functions.
 * @property {object} options are custom/dynamic properties shared between Call functions.
 * @property {any} func are Call functions
 *
 * See type "Call"
 */
export interface HttpClientOptions {
  domain: string;
  name: string;
  options: { [key: string]: any };
  [key: string]: Call | any;
}

/**
 * Contains the list of HTTP clients, one namespace per HTTP client.
 * See interface "HttpClientOptions"
 */
export interface HttpClientsOptions {
  [namespace: string]: HttpClientOptions;
}

export interface VueHttp {
  version: string;
  _http: HttpClientsOptions;
  install(Vue: VueConstructor, options?: any): void;
}

declare module "vue/types/vue" {
  interface Vue {
    $http: HttpClientsOptions;
  }
}

// https://stackoverflow.com/questions/41103360/how-to-use-fetch-in-typescript
