/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

import config from '../../utils';
import HttpClient, { HttpClientOptions } from '../@ListSOA/vue-http';
import acdb from './acdb';
import auth from './auth';
import projects from './projects';
import roles from './roles';
import users from './users';
import core from './core';

export function getBaseUrl(): string {
  const {
    VUE_APP_BACKEND_URL,
    VUE_APP_BACKEND_PORT,
    VUE_APP_REVERSE_PROXY_BASE_URL,
    VUE_APP_REVERSE_PROXY_PREFIX,
    VUE_APP_REVERSE_PROXY_ENABLED,
  } = config();

  // Reverse proxy (see nginx/templates/http(s).conf)
  let url = "";
  if (VUE_APP_REVERSE_PROXY_ENABLED) {
    url = `${VUE_APP_REVERSE_PROXY_BASE_URL}${VUE_APP_REVERSE_PROXY_PREFIX}`;
    console.log(url);
    return url;
  }
    
  // Reach directly the backend without reverse proxy
  url = `${VUE_APP_BACKEND_URL}:${VUE_APP_BACKEND_PORT}`;
  console.log(url);
  return url;
  
}

const baseUrl = getBaseUrl();

let groups = [auth, acdb, roles, users, projects, core].reduce(
  (acc, currentGroup) => Object.assign(acc, init(currentGroup, baseUrl)),
  {},
);

const httpClient = new HttpClient(groups);
export default httpClient;

/**
 * Get the token from one of the browser storages.
 *
 * @param {Storage} storage The storage where the token is stored,
 * it can be of diffent types: localStorage, sessionStorage or cacheStorage.
 *
 * @param {string} key The key identifies a string value of the storage that
 *  will be parsed to javascript object.
 *
 * @param {string} tokenKey The tokenKey is the "keys path" in an object from the
 * "root key" to the "leaf key", leafs are separated by ".".
 *
 * Example: "key1.key2.token" = { key1: { key2: { token: "" }}}
 *
 * @returns {string|null} The token as a string or null.
 */
export function getToken(
  storage: Storage,
  key: string,
  tokenKey: string,
): string | null {
  const keys = tokenKey.split('.');

  const vuex = storage.getItem(key);
  const store = !!vuex ? JSON.parse(vuex) : null;

  if (store === null) return null;

  /**
   * Run through the object "obj" (like the Tree data structure).
   * You have levels (leafs) that are accessible by key.
   * Each new level the current leaf becomes the root object.
   *
   * Iterations:
   * 1) key = key1; obj = { key1: { key2: { token: "myToken" }}}
   * 2) key = key2; obj = { key2: { token: "myToken" }}
   * 3) key = token; obj = { token: "myToken" }
   * Result = "myToken"
   */
  let obj = store;
  keys.forEach(k => (obj = obj[k]));

  return obj;
}

export function removeToken(storage: Storage, key: string): void {
  storage.removeItem(key);
}

/**
 * Format the response object to a json object or throw an error
 * @param {Response} response
 */
export async function GenericResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) throw { statusCode: response.status, ...data };
  else return data;
}

export interface Query {
  [key: string]: any;
}

export function searchParamsBuilder(baseUrl: string, query: Query): string {
  try {
    const url = new URL(baseUrl);
    Object.keys(query).forEach((key: string) =>
      url.searchParams.append(key, query[key]),
    );
    return url.toString();
  } catch (e) {
    return baseUrl;
  }
}

export async function BlobResponse(response: Response) {
  const data = await response.blob();
  if (!response.ok) throw data;
  else return data;
}

export function init(group: HttpClientOptions, domain: string) {
  let structure = group;

  group.domain = `${domain}${structure.domain}`;

  return { [group.name]: group };
}
