/*
 *   Copyright (c) 2023 Luxembourg Institute of Science and Technology (LIST)
 *   All rights reserved.
 *   For licensing information see the "LICENSE" file in the root directory
 */

export interface Configuration {
  VUE_APP_I18N_LOCALE: string;
  VUE_APP_I18N_FALLBACK_LOCALE: string;
  VUE_APP_BACKEND_URL: string;
  VUE_APP_BACKEND_PORT: number;
  VUE_APP_REVERSE_PROXY_ENABLED: boolean;
  VUE_APP_REVERSE_PROXY_BASE_URL: string;
  VUE_APP_REVERSE_PROXY_PREFIX: string;
  NGINX_SERVER_NAME: string;
  NGINX_CERT_NAME: string;
  NGINX_KEY_NAME: string;
  HTTPS_ENABLED: boolean;
  [key: string]: string | number | boolean;
}

interface CustomWindow extends Window {
  __env__: Configuration;
}
const w = window as CustomWindow & typeof globalThis;

export default function config() {
  const stringConfiguration: string =
    window.location.protocol === 'https:'
      ? JSON.stringify(w.__env__)
      : JSON.stringify(process.env);
  const cfg: Configuration = JSON.parse(stringConfiguration) as Configuration;

  cfg.VUE_APP_BACKEND_PORT = parseInt(`${cfg.VUE_APP_BACKEND_PORT}`);

  if (window.location.protocol === 'https') cfg.HTTPS_ENABLED = true;
  cfg.VUE_APP_REVERSE_PROXY_ENABLED = Boolean(
    cfg.VUE_APP_REVERSE_PROXY_ENABLED,
  );

  console.log("cfg", cfg);

  return cfg;
}

/**
 * Create a Base64 data URL from a blob object
 * @param file The blob object
 * @returns promise<Base64Url> | null
 */
export function createImageAsync(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = event => {
      if (event.target && event.target.result) {
        let img = new Image();
        img.src = event.target.result.toString();
        img.setAttribute('style', 'width:300px');
        resolve(img);
      }
      else resolve(null);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const deg2rad = (degrees: number) => (degrees * Math.PI) / 180;
function lonToTile(lon: number, zoom: number): number {
  // prettier-ignore
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}
function latToTile(lat: number, zoom: number): number {
  // prettier-ignore
  return Math.floor(
    (
      (1 - Math.log(Math.tan(deg2rad(lat)) + 1 / Math.cos(deg2rad(lat))) / Math.PI)
      / 2
    ) * 2**zoom,
  );
}
function tileToLon(x: number, zoom: number): number {
  // prettier-ignore
  return (x / Math.pow(2, zoom) * 360);
}
function tileToLat(y: number, zoom: number): number {
  // prettier-ignore
  const n = Math.PI - 2 * Math.PI * y / 2 ** zoom;
  // prettier-ignore
  return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

export function boundaryBox(
  lat: number,
  lon: number,
  zoom: number = 18,
  width = 425,
  height = 350,
) {
  const tileSize = 256;

  const lonTile = lonToTile(lon, zoom);
  const latTile = latToTile(lat, zoom);

  const minLonTile = (lonTile * tileSize - width / 2) / tileSize; // left
  const minLatTile = (latTile * tileSize - height / 2) / tileSize; // bottom
  const maxLonTile = (lonTile * tileSize + width / 2) / tileSize; // right
  const maxLatTile = (latTile * tileSize + height / 2) / tileSize; // top

  const minLon = tileToLon(minLonTile, zoom);
  const minLat = tileToLat(minLatTile, zoom);
  const maxLon = tileToLon(maxLonTile, zoom);
  const maxLat = tileToLat(maxLatTile, zoom);

  return [minLon, minLat, maxLon, maxLat];
}

export interface OpenStreetMap {
  width: Number; // The width of the iframe (hardcoded: 425)
  height: Number; // The height of the iframe (hardcoded: 350)
  src: String; // The iframe src
  extendSrc: String; // The href link to OpenStreetMap
  zoom: Number;
  name: String; // The location name
}

export function reactive(obj: Record<string, unknown>) {
  return new Proxy(obj, {
    get(target, key: string): unknown {
      return target[key];
    },
    set(target, key: string, value: any, receiver: any): boolean {
      target[key] = value;
      return true;
    },
  });
}
export function ref(value: unknown) {
  const refObject = {
    get value() {
      return value;
    },
    set value(newValue) {
      value = newValue;
    },
  };
  return refObject;
}

export function isNumeric(str: string) {
  const regex = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
  return regex.test(str);
}
