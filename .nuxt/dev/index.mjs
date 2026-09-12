import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import nodeCrypto from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, createError, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, getQuery as getQuery$1, getRequestWebStream, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getRouterParam, readBody, getResponseStatusText } from 'file://D:/program/vape2/node_modules/h3/dist/index.mjs';
import { escapeHtml } from 'file://D:/program/vape2/node_modules/@vue/shared/dist/shared.cjs.js';
import viteNodeEntry_mjs from 'file://D:/program/vape2/node_modules/@nuxt/vite-builder/dist/vite-node-entry.mjs';
import { viteNodeFetch } from 'file://D:/program/vape2/node_modules/@nuxt/vite-builder/dist/vite-node.mjs';
import { eq, gte, lte, sql, and, asc, desc, inArray } from 'file://D:/program/vape2/node_modules/drizzle-orm/index.js';
import { drizzle } from 'file://D:/program/vape2/node_modules/drizzle-orm/node-postgres/index.js';
import pg from 'file://D:/program/vape2/node_modules/pg/esm/index.mjs';
import { pgTable, timestamp, boolean, jsonb, integer, text, serial, date, pgEnum } from 'file://D:/program/vape2/node_modules/drizzle-orm/pg-core/index.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://D:/program/vape2/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, encodePath, joinRelativeURL } from 'file://D:/program/vape2/node_modules/ufo/dist/index.mjs';
import destr, { destr as destr$1 } from 'file://D:/program/vape2/node_modules/destr/dist/index.mjs';
import { renderToString } from 'file://D:/program/vape2/node_modules/vue/server-renderer/index.mjs';
import { klona } from 'file://D:/program/vape2/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://D:/program/vape2/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file://D:/program/vape2/node_modules/scule/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://D:/program/vape2/node_modules/unhead/dist/server.mjs';
import { stringify, uneval } from 'file://D:/program/vape2/node_modules/devalue/index.js';
import { isVNode, isRef, toValue } from 'file://D:/program/vape2/node_modules/vue/index.mjs';
import { createHooks } from 'file://D:/program/vape2/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file://D:/program/vape2/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://D:/program/vape2/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://D:/program/vape2/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://D:/program/vape2/node_modules/unstorage/drivers/fs.mjs';
import file_58_47_47_47D_58_47program_47vape2_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46js from 'file://D:/program/vape2/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js';
import { digest, hash as hash$1 } from 'file://D:/program/vape2/node_modules/ohash/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://D:/program/vape2/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file://D:/program/vape2/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file://D:/program/vape2/node_modules/youch-core/build/index.js';
import { Youch } from 'file://D:/program/vape2/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://D:/program/vape2/node_modules/nitropack/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://D:/program/vape2/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://D:/program/vape2/node_modules/errx/dist/index.mjs';
import _wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw from 'file://D:/program/vape2/node_modules/@nuxt/vite-builder/dist/fix-stacktrace.mjs';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file://D:/program/vape2/node_modules/pathe/dist/index.mjs';
import { walkResolver } from 'file://D:/program/vape2/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"D:/program/vape2/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:/program/vape2","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:/program/vape2/server","watchOptions":{"ignored":[null]}}));
storage.mount('cache:nuxt:payload', file_58_47_47_47D_58_47program_47vape2_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46js({"driver":"file:///D:/program/vape2/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js","base":"D:/program/vape2/.nuxt/cache/nuxt/payload"}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:/program/vape2/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:/program/vape2/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"D:/program/vape2/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {}
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
	
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

const iframeStorageBridge = (nonce) => `
(function () {
  const NONCE = ${JSON.stringify(nonce)};
  const memoryStore = Object.create(null);

  const post = (type, payload) => {
    window.parent.postMessage({ type, nonce: NONCE, ...payload }, '*');
  };

  const isValid = (data) => data && data.nonce === NONCE;

  const mockStorage = {
    getItem(key) {
      return Object.hasOwn(memoryStore, key)
        ? memoryStore[key]
        : null;
    },
    setItem(key, value) {
      const v = String(value);
      memoryStore[key] = v;
      post('storage-set', { key, value: v });
    },
    removeItem(key) {
      delete memoryStore[key];
      post('storage-remove', { key });
    },
    clear() {
      for (const key of Object.keys(memoryStore))
        delete memoryStore[key];
      post('storage-clear', {});
    },
    key(index) {
      const keys = Object.keys(memoryStore);
      return keys[index] ?? null;
    },
    get length() {
      return Object.keys(memoryStore).length;
    }
  };

  const defineLocalStorage = () => {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: false,
        configurable: true
      });
    } catch {
      window.localStorage = mockStorage;
    }
  };

  defineLocalStorage();

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!isValid(data) || data.type !== 'storage-sync-data') return;

    const incoming = data.data || {};
    for (const key of Object.keys(incoming))
      memoryStore[key] = incoming[key];

    if (typeof window.initTheme === 'function')
      window.initTheme();
    window.dispatchEvent(new Event('storage-ready'));
  });

  // Clipboard API is unavailable in data: URL iframe, so we use postMessage
  document.addEventListener('DOMContentLoaded', function() {
    window.copyErrorMessage = function(button) {
      post('clipboard-copy', { text: button.dataset.errorText });
      button.classList.add('copied');
      setTimeout(function() { button.classList.remove('copied'); }, 2000);
    };
  });

  post('storage-sync-request', {});
})();
`;
const parentStorageBridge = (nonce) => `
(function () {
  const host = document.querySelector('nuxt-error-overlay');
  if (!host) return;

  const NONCE = ${JSON.stringify(nonce)};
  const isValid = (data) => data && data.nonce === NONCE;

  // Handle clipboard copy from iframe
  window.addEventListener('message', function(e) {
    if (isValid(e.data) && e.data.type === 'clipboard-copy') {
      navigator.clipboard.writeText(e.data.text).catch(function() {});
    }
  });

  const collectLocalStorage = () => {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k != null) all[k] = localStorage.getItem(k);
    }
    return all;
  };

  const attachWhenReady = () => {
    const root = host.shadowRoot;
    if (!root)
      return false;
    const iframe = root.getElementById('frame');
    if (!iframe || !iframe.contentWindow)
      return false;

    const handlers = {
      'storage-set': (d) => localStorage.setItem(d.key, d.value),
      'storage-remove': (d) => localStorage.removeItem(d.key),
      'storage-clear': () => localStorage.clear(),
      'storage-sync-request': () => {
        iframe.contentWindow.postMessage({
          type: 'storage-sync-data',
          data: collectLocalStorage(),
          nonce: NONCE
        }, '*');
      }
    };

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!isValid(data)) return;
      const fn = handlers[data.type];
      if (fn) fn(data);
    });

    return true;
  };

  if (attachWhenReady())
    return;

  const obs = new MutationObserver(() => {
    if (attachWhenReady())
      obs.disconnect();
  });

  obs.observe(host, { childList: true, subtree: true });
})();
`;
const errorCSS = `
:host {
  --preview-width: 240px;
  --preview-height: 180px;
  --base-width: 1200px;
  --base-height: 900px;
  --z-base: 999999998;
  --error-pip-left: auto;
  --error-pip-top: auto;
  --error-pip-right: 5px;
  --error-pip-bottom: 5px;
  --error-pip-origin: bottom right;
  --app-preview-left: auto;
  --app-preview-top: auto;
  --app-preview-right: 5px;
  --app-preview-bottom: 5px;
  all: initial;
  display: contents;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
#frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  z-index: var(--z-base);
}
#frame[inert] {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: var(--error-pip-right);
  bottom: var(--error-pip-bottom);
  width: var(--base-width);
  height: var(--base-height);
  transform: scale(calc(240 / 1200));
  transform-origin: var(--error-pip-origin);
  overflow: hidden;
  border-radius: calc(1200 * 8px / 240);
}
#preview {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: var(--app-preview-right);
  bottom: var(--app-preview-bottom);
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
  border-radius: 6px;
  pointer-events: none;
  z-index: var(--z-base);
  background: white;
  display: none;
}
#preview iframe {
  transform-origin: var(--error-pip-origin);
}
#frame:not([inert]) + #preview {
  display: block;
}
#toggle {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: calc(var(--app-preview-right) - 3px);
  bottom: calc(var(--app-preview-bottom) - 3px);
  width: var(--preview-width);
  height: var(--preview-height);
  background: none;
  border: 3px solid #00DC82;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, box-shadow 0.2s;
  z-index: calc(var(--z-base) + 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
#toggle:hover,
#toggle:focus {
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6);
}
#toggle:focus-visible {
  outline: 3px solid #00DC82;
  outline-offset: 0;
  box-shadow: 0 0 24px rgba(0, 220, 130, 0.8);
}
#frame[inert] ~ #toggle {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: calc(var(--error-pip-right) - 3px);
  bottom: calc(var(--error-pip-bottom) - 3px);
  cursor: grab;
}
:host(.dragging) #frame[inert] ~ #toggle {
  cursor: grabbing;
}
#frame:not([inert]) ~ #toggle,
#frame:not([inert]) + #preview {
  cursor: grab;
}
:host(.dragging-preview) #frame:not([inert]) ~ #toggle,
:host(.dragging-preview) #frame:not([inert]) + #preview {
  cursor: grabbing;
}

#pip-close {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
#pip-close:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}

#pip-restore {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid #00DC82;
  background: #111;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: calc(var(--z-base) + 2);
  cursor: grab;
}
#pip-restore:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}
:host(.dragging-restore) #pip-restore {
  cursor: grabbing;
}

#frame[hidden],
#toggle[hidden],
#preview[hidden],
#pip-restore[hidden],
#pip-close[hidden] {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  #toggle {
    transition: none;
  }
}
`;
function webComponentScript(base64HTML, startMinimized) {
	return `
(function () {
  try {
    // =========================
    // Host + Shadow
    // =========================
    const host = document.querySelector('nuxt-error-overlay');
    if (!host)
      return;
    const shadow = host.attachShadow({ mode: 'open' });

    // =========================
    // DOM helpers
    // =========================
    const el = (tag) => document.createElement(tag);
    const on = (node, type, fn, opts) => node.addEventListener(type, fn, opts);
    const hide = (node, v) => node.toggleAttribute('hidden', !!v);
    const setVar = (name, value) => host.style.setProperty(name, value);
    const unsetVar = (name) => host.style.removeProperty(name);

    // =========================
    // Create DOM
    // =========================
    const style = el('style');
    style.textContent = ${JSON.stringify(errorCSS)};

    const iframe = el('iframe');
    iframe.id = 'frame';
    iframe.src = 'data:text/html;base64,${base64HTML}';
    iframe.title = 'Detailed error stack trace';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation');

    const preview = el('div');
    preview.id = 'preview';

    const toggle = el('div');
    toggle.id = 'toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.innerHTML = '<span class="sr-only">Toggle detailed error view</span>';

    const liveRegion = el('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';

    const pipCloseButton = el('button');
    pipCloseButton.id = 'pip-close';
    pipCloseButton.setAttribute('type', 'button');
    pipCloseButton.setAttribute('aria-label', 'Hide error preview overlay');
    pipCloseButton.innerHTML = '&times;';
    pipCloseButton.hidden = true;
    toggle.appendChild(pipCloseButton);

    const pipRestoreButton = el('button');
    pipRestoreButton.id = 'pip-restore';
    pipRestoreButton.setAttribute('type', 'button');
    pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
    pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
    pipRestoreButton.hidden = true;

    // Order matters: #frame + #preview adjacency
    shadow.appendChild(style);
    shadow.appendChild(liveRegion);
    shadow.appendChild(iframe);
    shadow.appendChild(preview);
    shadow.appendChild(toggle);
    shadow.appendChild(pipRestoreButton);

    // =========================
    // Constants / keys
    // =========================
    const POS_KEYS = {
      position: 'nuxt-error-overlay:position',
      hiddenPretty: 'nuxt-error-overlay:error-pip:hidden',
      hiddenPreview: 'nuxt-error-overlay:app-preview:hidden'
    };

    const CSS_VARS = {
      pip: {
        left: '--error-pip-left',
        top: '--error-pip-top',
        right: '--error-pip-right',
        bottom: '--error-pip-bottom'
      },
      preview: {
        left: '--app-preview-left',
        top: '--app-preview-top',
        right: '--app-preview-right',
        bottom: '--app-preview-bottom'
      }
    };

    const MIN_GAP = 5;
    const DRAG_THRESHOLD = 2;

    // =========================
    // Local storage safe access + state
    // =========================
    let storageReady = true;
    let isPrettyHidden = false;
    let isPreviewHidden = false;

    const safeGet = (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    };

    const safeSet = (k, v) => {
      if (!storageReady) 
        return;
      try {
        localStorage.setItem(k, v);
      } catch {}
    };

    // =========================
    // Sizing helpers
    // =========================
    const vvSize = () => {
      const v = window.visualViewport;
      return v ? { w: v.width, h: v.height } : { w: window.innerWidth, h: window.innerHeight };
    };

    const previewSize = () => {
      const styles = getComputedStyle(host);
      const w = parseFloat(styles.getPropertyValue('--preview-width')) || 240;
      const h = parseFloat(styles.getPropertyValue('--preview-height')) || 180;
      return { w, h };
    };

    const sizeForTarget = (target) => {
      if (!target)
        return previewSize();
      const rect = target.getBoundingClientRect();
      if (rect.width && rect.height)
        return { w: rect.width, h: rect.height };
      return previewSize();
    };

    // =========================
    // Dock model + offset/alignment calculations
    // =========================
    const dock = { edge: null, offset: null, align: null, gap: null };

    const maxOffsetFor = (edge, size) => {
      const vv = vvSize();
      if (edge === 'left' || edge === 'right')
        return Math.max(MIN_GAP, vv.h - size.h - MIN_GAP);
      return Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
    };

    const clampOffset = (edge, value, size) => {
      const max = maxOffsetFor(edge, size);
      return Math.min(Math.max(value, MIN_GAP), max);
    };

    const updateDockAlignment = (size) => {
      if (!dock.edge || dock.offset == null)
        return;
      const max = maxOffsetFor(dock.edge, size);
      if (dock.offset <= max / 2) {
        dock.align = 'start';
        dock.gap = dock.offset;
      } else {
        dock.align = 'end';
        dock.gap = Math.max(0, max - dock.offset);
      }
    };

    const appliedOffsetFor = (size) => {
      if (!dock.edge || dock.offset == null)
        return null;
      const max = maxOffsetFor(dock.edge, size);

      if (dock.align === 'end' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, max - dock.gap, size);
      }
      if (dock.align === 'start' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, dock.gap, size);
      }
      return clampOffset(dock.edge, dock.offset, size);
    };

    const nearestEdgeAt = (x, y) => {
      const { w, h } = vvSize();
      const d = { left: x, right: w - x, top: y, bottom: h - y };
      return Object.keys(d).reduce((a, b) => (d[a] < d[b] ? a : b));
    };

    const cornerDefaultDock = () => {
      const vv = vvSize();
      const size = previewSize();
      const offset = Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
      return { edge: 'bottom', offset };
    };

    const currentTransformOrigin = () => {
      if (!dock.edge) return null;
      if (dock.edge === 'left' || dock.edge === 'top')
        return 'top left';
      if (dock.edge === 'right')
        return 'top right';
      return 'bottom left';
    };

    // =========================
    // Persist / load dock
    // =========================
    const loadDock = () => {
      const raw = safeGet(POS_KEYS.position);
      if (!raw)
        return;
      try {
        const parsed = JSON.parse(raw);
        const { edge, offset, align, gap } = parsed || {};
        if (!['left', 'right', 'top', 'bottom'].includes(edge))
          return;
        if (typeof offset !== 'number')
          return;

        dock.edge = edge;
        dock.offset = clampOffset(edge, offset, previewSize());
        dock.align = align === 'start' || align === 'end' ? align : null;
        dock.gap = typeof gap === 'number' ? gap : null;

        if (!dock.align || dock.gap == null)
          updateDockAlignment(previewSize());
      } catch {}
    };

    const persistDock = () => {
      if (!dock.edge || dock.offset == null)
        return; 
      safeSet(POS_KEYS.position, JSON.stringify({
        edge: dock.edge,
        offset: dock.offset,
        align: dock.align,
        gap: dock.gap
      }));
    };

    // =========================
    // Apply dock
    // =========================
    const dockToVars = (vars) => ({
      set: (side, v) => host.style.setProperty(vars[side], v),
      clear: (side) => host.style.removeProperty(vars[side])
    });

    const dockToEl = (node) => ({
      set: (side, v) => { node.style[side] = v; },
      clear: (side) => { node.style[side] = ''; }
    });

    const applyDock = (target, size, opts) => {
      if (!dock.edge || dock.offset == null) {
        target.clear('left');
        target.clear('top');
        target.clear('right');
        target.clear('bottom');
        return;
      }

      target.set('left', 'auto');
      target.set('top', 'auto');
      target.set('right', 'auto');
      target.set('bottom', 'auto');

      const applied = appliedOffsetFor(size);

      if (dock.edge === 'left') {
        target.set('left', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'right') {
        target.set('right', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'top') {
        target.set('top', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      } else {
        target.set('bottom', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      }

      if (!opts || opts.persist !== false)
        persistDock();
    };

    const applyDockAll = (opts) => {
      applyDock(dockToVars(CSS_VARS.pip), previewSize(), opts);
      applyDock(dockToVars(CSS_VARS.preview), previewSize(), opts);
      applyDock(dockToEl(pipRestoreButton), sizeForTarget(pipRestoreButton), opts);
    };

    const repaintToDock = () => {
      if (!dock.edge || dock.offset == null)
        return;
      const origin = currentTransformOrigin();
      if (origin)
        setVar('--error-pip-origin', origin);
      else 
        unsetVar('--error-pip-origin');
      applyDockAll({ persist: false });
    };

    // =========================
    // Hidden state + UI
    // =========================
    const loadHidden = () => {
      const rawPretty = safeGet(POS_KEYS.hiddenPretty);
      if (rawPretty != null)
        isPrettyHidden = rawPretty === '1' || rawPretty === 'true';
      const rawPreview = safeGet(POS_KEYS.hiddenPreview);
      if (rawPreview != null)
        isPreviewHidden = rawPreview === '1' || rawPreview === 'true';
    };

    const setPrettyHidden = (v) => {
      isPrettyHidden = !!v;
      safeSet(POS_KEYS.hiddenPretty, isPrettyHidden ? '1' : '0');
      updateUI();
    };

    const setPreviewHidden = (v) => {
      isPreviewHidden = !!v;
      safeSet(POS_KEYS.hiddenPreview, isPreviewHidden ? '1' : '0');
      updateUI();
    };

    const isMinimized = () => iframe.hasAttribute('inert');

    const setMinimized = (v) => {
      if (v) {
        iframe.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        iframe.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true');
      }
    };

    const setRestoreLabel = (kind) => {
      if (kind === 'pretty') {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
      } else {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error page</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error page');
      }
    };

    const updateUI = () => {
      const minimized = isMinimized();
      const showPiP = minimized && !isPrettyHidden;
      const showPreview = !minimized && !isPreviewHidden;
      const pipHiddenByUser = minimized && isPrettyHidden;
      const previewHiddenByUser = !minimized && isPreviewHidden;
      const showToggle = minimized ? showPiP : showPreview;
      const showRestore = pipHiddenByUser || previewHiddenByUser;

      hide(iframe, pipHiddenByUser);
      hide(preview, !showPreview);
      hide(toggle, !showToggle);
      hide(pipCloseButton, !showToggle);
      hide(pipRestoreButton, !showRestore);

      pipCloseButton.setAttribute('aria-label', minimized ? 'Hide error overlay' : 'Hide error page preview');

      if (pipHiddenByUser)
        setRestoreLabel('pretty');
      else if (previewHiddenByUser)
        setRestoreLabel('preview');

      host.classList.toggle('pip-hidden', isPrettyHidden);
      host.classList.toggle('preview-hidden', isPreviewHidden);
    };

    // =========================
    // Preview snapshot
    // =========================
    const updatePreview = () => {
      try {
        let previewIframe = preview.querySelector('iframe');
        if (!previewIframe) {
          previewIframe = el('iframe');
          previewIframe.style.cssText = 'width: 1200px; height: 900px; transform: scale(0.2); transform-origin: top left; border: none;';
          previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          preview.appendChild(previewIframe);
        }

        const doctype = document.doctype ? '<!DOCTYPE ' + document.doctype.name + '>' : '';
        const cleanedHTML = document.documentElement.outerHTML
          .replace(/<nuxt-error-overlay[^>]*>.*?<\\/nuxt-error-overlay>/gs, '')
          .replace(/<script[^>]*>.*?<\\/script>/gs, '');

        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(doctype + cleanedHTML);
        iframeDoc.close();
      } catch (err) {
        console.error('Failed to update preview:', err);
      }
    };

    // =========================
    // View toggling
    // =========================
    const toggleView = () => {
      if (isMinimized()) {
        updatePreview();
        setMinimized(false);
        liveRegion.textContent = 'Showing detailed error view';
        setTimeout(() => { 
          try { 
            iframe.contentWindow.focus();
          } catch {}
        }, 100);
      } else {
        setMinimized(true);
        liveRegion.textContent = 'Showing error page';
        repaintToDock();
        void iframe.offsetWidth;
      }
      updateUI();
    };

    // =========================
    // Dragging (unified, rAF throttled)
    // =========================
    let drag = null;
    let rafId = null;
    let suppressToggleClick = false;
    let suppressRestoreClick = false;

    const beginDrag = (e) => {
      if (drag) 
        return;

      if (!dock.edge || dock.offset == null) {
        const def = cornerDefaultDock();
        dock.edge = def.edge;
        dock.offset = def.offset;
        updateDockAlignment(previewSize());
      }

      const isRestoreTarget = e.currentTarget === pipRestoreButton;

      drag = {
        kind: isRestoreTarget ? 'restore' : (isMinimized() ? 'pip' : 'preview'),
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        target: e.currentTarget
      };

      drag.target.setPointerCapture(e.pointerId);

      if (drag.kind === 'restore')
        host.classList.add('dragging-restore');
      else 
        host.classList.add(drag.kind === 'pip' ? 'dragging' : 'dragging-preview');

      e.preventDefault();
    };

    const moveDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      
      const dx = drag.lastX - drag.startX;
      const dy = drag.lastY - drag.startY;

      if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        drag.moved = true;
      }

      if (!drag.moved)
        return;
      if (rafId)
        return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const edge = nearestEdgeAt(drag.lastX, drag.lastY);
        const size = sizeForTarget(drag.target);

        let offset;
        if (edge === 'left' || edge === 'right') {
          const top = drag.lastY - (size.h / 2);
          offset = clampOffset(edge, Math.round(top), size);
        } else {
          const left = drag.lastX - (size.w / 2);
          offset = clampOffset(edge, Math.round(left), size);
        }

        dock.edge = edge;
        dock.offset = offset;
        updateDockAlignment(size);

        const origin = currentTransformOrigin();
        setVar('--error-pip-origin', origin || 'bottom right');

        applyDockAll({ persist: false });
      });
    };

    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      const endedKind = drag.kind;
      drag.target.releasePointerCapture(e.pointerId);

      if (endedKind === 'restore')
        host.classList.remove('dragging-restore');
      else 
        host.classList.remove(endedKind === 'pip' ? 'dragging' : 'dragging-preview');

      const didMove = drag.moved;
      drag = null;

      if (didMove) {
        persistDock();
        if (endedKind === 'restore')
          suppressRestoreClick = true;
        else 
          suppressToggleClick = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const bindDragTarget = (node) => {
      on(node, 'pointerdown', beginDrag);
      on(node, 'pointermove', moveDrag);
      on(node, 'pointerup', endDrag);
      on(node, 'pointercancel', endDrag);
    };

    bindDragTarget(toggle);
    bindDragTarget(pipRestoreButton);

    // =========================
    // Events (toggle / close / restore)
    // =========================
    on(toggle, 'click', (e) => {
      if (suppressToggleClick) {
        e.preventDefault();
        suppressToggleClick = false;
        return;
      }
      toggleView();
    });

    on(toggle, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleView();
      }
    });

    on(pipCloseButton, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized())
        setPrettyHidden(true);
      else
        setPreviewHidden(true);
    });

    on(pipCloseButton, 'pointerdown', (e) => {
      e.stopPropagation();
    });

    on(pipRestoreButton, 'click', (e) => {
      if (suppressRestoreClick) {
        e.preventDefault();
        suppressRestoreClick = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized()) 
        setPrettyHidden(false);
      else 
        setPreviewHidden(false);
    });

    // =========================
    // Lifecycle: load / sync / repaint
    // =========================
    const loadState = () => {
      loadDock();
      loadHidden();

      if (isPrettyHidden && !isMinimized())
        setMinimized(true);

      updateUI();
      repaintToDock();
    };

    loadState();

    on(window, 'storage-ready', () => {
      storageReady = true;
      loadState();
    });

    const onViewportChange = () => repaintToDock();

    on(window, 'resize', onViewportChange);

    if (window.visualViewport) {
      on(window.visualViewport, 'resize', onViewportChange);
      on(window.visualViewport, 'scroll', onViewportChange);
    }

    // initial preview
    setTimeout(updatePreview, 100);

    // initial minimized option
    if (${startMinimized}) {
      setMinimized(true);
      repaintToDock();
      void iframe.offsetWidth;
      updateUI();
    }
  } catch (err) {
    console.error('Failed to initialize Nuxt error overlay:', err);
  }
})();
`;
}
function generateErrorOverlayHTML(html, options) {
	const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
	const errorPage = html.replace("<head>", `<head><script>${iframeStorageBridge(nonce)}<\/script>`);
	const base64HTML = Buffer.from(errorPage, "utf8").toString("base64");
	return `
    <script>${parentStorageBridge(nonce)}<\/script>
    <nuxt-error-overlay></nuxt-error-overlay>
    <script>${webComponentScript(base64HTML, options?.startMinimized ?? false)}<\/script>
  `;
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		
		return;
	}
	
	const defaultRes = await defaultHandler(error, event, { json: true });
	
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
		
		defaultRes.body.stack = defaultRes.body.stack.join("\n");
	}
	const errorObject = defaultRes.body;
	
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	
	const reqHeaders = getRequestHeaders(event);
	
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"] || !!event.context.nuxt?.["~rendering-error"];
	if (!isRenderingError) {
		event.context.nuxt ||= {};
		event.context.nuxt["~rendering-error"] = true;
	}
	
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	
	if (!res) {
		const { template } = await Promise.resolve().then(function () { return error500; });
		{
			
			errorObject.description = errorObject.message;
		}
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	if (!globalThis._importMeta_.test && typeof html === "string") {
		const prettyResponse = await defaultHandler(error, event, { json: false });
		if (typeof prettyResponse.body === "string") {
			return send(event, html.replace("</body>", `${generateErrorOverlayHTML(prettyResponse.body, { startMinimized: 300 <= status && status < 500 })}</body>`));
		}
	}
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json ?? !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const rootDir = "D:/program/vape2";

const appHead = {"meta":[{"charset":"utf-8"},{"name":"viewport","content":"width=device-width, initial-scale=1, viewport-fit=cover"},{"name":"theme-color","content":"#09090b"},{"name":"description","content":"فروشگاه تخصصی ویپورا — خرید آنلاین پاد یک‌بارمصرف، سالت نیکوتین، مود و لوازم جانبی اصل با هولوگرام. ارسال فوری تهران، پرداخت در محل، ضمانت اصالت کالا."},{"property":"og:type","content":"website"},{"property":"og:locale","content":"fa_IR"},{"property":"og:title","content":"ویپورا — دودِ نرم، طعمِ ناب"},{"property":"og:description","content":"پاد یک‌بارمصرف، سالت نیکوتین و مود اصل با ضمانت اصالت و ارسال فوری."},{"property":"og:image","content":"https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1200"}],"link":[{"rel":"preconnect","href":"https://fonts.googleapis.com"},{"rel":"preconnect","href":"https://fonts.gstatic.com","crossorigin":""},{"rel":"stylesheet","href":"https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap"},{"rel":"icon","type":"image/svg+xml","href":"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='7' fill='%2309090b'/%3E%3Cpath d='M12 4.5s5.2 5.4 5.2 9.2a5.2 5.2 0 0 1-10.4 0C6.8 9.9 12 4.5 12 4.5Z' fill='%23a78bfa'/%3E%3C/svg%3E"}],"style":[],"script":[],"noscript":[],"htmlAttrs":{"lang":"fa","dir":"rtl"},"title":"ویپورا | فروشگاه تخصصی ویپ، سالت و پاد — دودِ نرم، طعمِ ناب","titleTemplate":"%s | ویپورا"};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appSpaLoaderTag = "div";

const appSpaLoaderAttrs = {"id":"__nuxt-loader"};

const appId = "nuxt-app";

const devReducers = {
	VNode: (data) => isVNode(data) ? {
		type: data.type,
		props: data.props
	} : undefined,
	URL: (data) => data instanceof URL ? data.toString() : undefined,
	Symbol: (data) => typeof data === "symbol" ? data.description ?? "" : undefined
};
const asyncContext = getContext("nuxt-dev", {
	asyncContext: true,
	AsyncLocalStorage
});
const _o3Mdp2L6j1voErXu3FeF1hY6DtUICyfmOWUsjtRECxw = (nitroApp) => {
	const handler = nitroApp.h3App.handler;
	nitroApp.h3App.handler = (event) => {
		return asyncContext.callAsync({
			logs: [],
			event
		}, () => handler(event));
	};
	onConsoleLog((_log) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		const rawStack = captureRawStackTrace();
		if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
			return;
		}
		const trace = [];
		let filename = "";
		for (const entry of parseRawStackTrace(rawStack)) {
			if (entry.source === globalThis._importMeta_.url) {
				continue;
			}
			if (EXCLUDE_TRACE_RE.test(entry.source)) {
				continue;
			}
			filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
			trace.push({
				...entry,
				source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
			});
		}
		const log = {
			..._log,
			
			filename,
			
			stack: trace
		};
		
		ctx.logs.push(log);
	});
	nitroApp.hooks.hook("afterResponse", () => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		return nitroApp.hooks.callHook("dev:ssr-logs", {
			logs: ctx.logs,
			path: ctx.event.path
		});
	});
	
	nitroApp.hooks.hook("render:html", (htmlContext) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		try {
			const reducers = Object.assign(Object.create(null), devReducers, ctx.event.context["~payloadReducers"]);
			htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
		} catch (e) {
			const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
			console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
		}
	});
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
	consola$1.addReporter({ log(logObj) {
		callback(logObj);
	} });
	consola$1.wrapConsole();
}

const plugins = [
  _o3Mdp2L6j1voErXu3FeF1hY6DtUICyfmOWUsjtRECxw,
_wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw
];

const assets = {
  "/index.mjs": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"6c680-1F48YS0WiXGMWcHvOxwTya83+b0\"",
    "mtime": "2026-09-12T09:05:14.353Z",
    "size": 444032,
    "path": "index.mjs"
  },
  "/index.mjs.map": {
    "type": "application/json",
    "etag": "\"1e927a-SWJR4z7WP9idyE0EritEI4rhSm4\"",
    "mtime": "2026-09-12T09:05:14.353Z",
    "size": 2003578,
    "path": "index.mjs.map"
  }
};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _egHosr = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

// @__NO_SIDE_EFFECTS__
function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function computeIslandHash(name, serializedProps, context, source) {
  let parsed;
  try {
    parsed = JSON.parse(serializedProps);
  } catch {
    parsed = serializedProps;
  }
  return hash$1([name, parsed, context, source]).replace(/[-_]/g, "");
}

const MAX_ISLAND_BODY_BYTES = 64 * 1024;

const MAX_ISLAND_PROP_DEPTH = 64;

function exceedsMaxDepth(raw, maxDepth = MAX_ISLAND_PROP_DEPTH) {
	let depth = 0;
	let inString = false;
	let escaped = false;
	for (let i = 0; i < raw.length; i++) {
		const ch = raw[i];
		if (inString) {
			if (escaped) {
				escaped = false;
			} else if (ch === "\\") {
				escaped = true;
			} else if (ch === "\"") {
				inString = false;
			}
			continue;
		}
		if (ch === "\"") {
			inString = true;
		} else if (ch === "{" || ch === "[") {
			if (++depth > maxDepth) {
				return true;
			}
		} else if (ch === "}" || ch === "]") {
			if (depth > 0) {
				depth--;
			}
		}
	}
	return false;
}

function exceedsMaxBytes(raw, maxBytes = MAX_ISLAND_BODY_BYTES) {
	return Buffer.byteLength(raw, "utf8") > maxBytes;
}

const NUXT_RUNTIME_PAYLOAD_EXTRACTION = false;

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
};

function encodeEventPath(path) {
	const queryIndex = path.indexOf("?");
	if (queryIndex === -1) {
		return encodePath(path);
	}
	return encodePath(path.slice(0, queryIndex)) + path.slice(queryIndex);
}
function createSSRContext(event) {
	const url = encodeEventPath(event.path);
	const ssrContext = {
		url,
		event,
		runtimeConfig: useRuntimeConfig(event),
		noSSR: event.context.nuxt?.noSSR || (false),
		head: createHead(unheadOptions),
		error: false,
		nuxt: undefined,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: new Set()
	};
	return ssrContext;
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

function buildAssetsDir() {
	
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
// @ts-expect-error file will be produced after app build
const getServerEntry = () => Promise.resolve().then(function () { return server; }).then((r) => r.default || r);
// @ts-expect-error file will be produced after app build
const getClientManifest = () => Promise.resolve().then(function () { return client_manifest$1; }).then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);

const getSSRRenderer = lazyCachedFunction(async () => {
	
	const createSSRApp = await getServerEntry();
	if (!createSSRApp) {
		throw new Error("Server bundle is not available");
	}
	
	const precomputed = undefined ;
	
	const renderer = createRenderer(createSSRApp, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: renderToString$1,
		buildAssetsURL
	});
	async function renderToString$1(input, context) {
		const html = await renderToString(input, context);
		
		
		if (process.env.NUXT_VITE_NODE_OPTIONS) {
			renderer.rendererContext.updateManifest(await getClientManifest());
		}
		return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
	}
	return renderer;
});

const getSPARenderer = lazyCachedFunction(async () => {
	const precomputed = undefined ;
	// @ts-expect-error virtual file
	const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
		{
			const APP_SPA_LOADER_OPEN_TAG = `<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
			const APP_SPA_LOADER_CLOSE_TAG = `</${appSpaLoaderTag}>`;
			const appTemplate = APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG;
			const loaderTemplate = r ? APP_SPA_LOADER_OPEN_TAG + r + APP_SPA_LOADER_CLOSE_TAG : "";
			return appTemplate + loaderTemplate;
		}
	});
	
	const renderer = createRenderer(() => () => {}, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: () => spaTemplate,
		buildAssetsURL
	});
	const result = await renderer.renderToString({});
	const renderToString = (ssrContext) => {
		const config = useRuntimeConfig(ssrContext.event);
		ssrContext.modules ||= new Set();
		ssrContext.payload.serverRendered = false;
		ssrContext.config = {
			public: config.public,
			app: config.app
		};
		return Promise.resolve(result);
	};
	return {
		rendererContext: renderer.rendererContext,
		renderToString
	};
});
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) {
			res = fn().catch((err) => {
				res = null;
				throw err;
			});
		}
		return res;
	};
}
function getRenderer(ssrContext) {
	return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
// @ts-expect-error file will be produced after app build
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
	const styleMap = await getSSRStyles();
	const inlinedStyles = new Set();
	for (const mod of usedModules) {
		if (mod in styleMap && styleMap[mod]) {
			for (const style of await styleMap[mod]()) {
				inlinedStyles.add(style);
			}
		}
	}
	return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

// @ts-expect-error virtual file
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);

function getServerComponentHTML(body) {
	const match = body.match(ROOT_NODE_REGEX);
	return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
		return undefined;
	}
	const response = {};
	for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
		response[name] = {
			...slot,
			fallback: ssrContext.teleports?.[`island-fallback=${name}`]
		};
	}
	return response;
}
function getClientIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
		return undefined;
	}
	const response = {};
	for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
		
		let html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
		
		if (!html && ssrContext.teleports) {
			for (const [key, value] of Object.entries(ssrContext.teleports)) {
				const [, , componentUid] = key.match(SSR_CLIENT_TELEPORT_MARKER) ?? [];
				if (componentUid === clientUid) {
					html = value.replaceAll("<!--teleport start anchor-->", "");
					break;
				}
			}
		}
		response[clientUid] = {
			...component,
			html,
			slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
		};
	}
	return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
	const entries = Object.entries(teleports);
	const slots = {};
	for (const [key, value] of entries) {
		const match = key.match(SSR_CLIENT_SLOT_MARKER);
		if (match) {
			const [, id, slot] = match;
			if (!slot || clientUid !== id) {
				continue;
			}
			slots[slot] = value;
		}
	}
	return slots;
}
function replaceIslandTeleports(ssrContext, html) {
	const { teleports, islandContext } = ssrContext;
	if (islandContext || !teleports) {
		return html;
	}
	for (const key in teleports) {
		const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
		if (matchClientComp) {
			const [, uid, clientId] = matchClientComp;
			if (!uid || !clientId) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
			continue;
		}
		const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
		if (matchSlot) {
			const [, uid, slot] = matchSlot;
			if (!uid || !slot) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
		}
	}
	return html;
}

const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const handler$1 = defineEventHandler(async (event) => {
	setResponseHeaders(event, {
		"content-type": "application/json;charset=utf-8",
		"x-powered-by": "Nuxt"
	});
	{
		return toResponse(event, await renderIsland(event));
	}
});
function toResponse(event, result) {
	return "raw" in result ? returnIslandResponse(event, result.raw) : result;
}
async function renderIsland(event) {
	const nitroApp = useNitroApp();
	const islandContext = await getIslandContext(event);
	const ssrContext = {
		...createSSRContext(event),
		islandContext,
		noSSR: false,
		url: islandContext.url
	};
	
	const renderer = await getSSRRenderer();
	const renderResult = await renderer.renderToString(ssrContext).catch(async (err) => {
		if (ssrContext["~renderResponse"] && err?.message === "skipping render") {
			return {};
		}
		await ssrContext.nuxt?.hooks.callHook("app:error", err);
		throw err;
	});
	
	
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult
	});
	if (ssrContext["~renderResponse"]) {
		const response = ssrContext["~renderResponse"];
		if (response.statusCode && response.statusCode >= 400) {
			throw createError({
				statusCode: response.statusCode,
				statusMessage: response.statusMessage
			});
		}
		return { raw: response };
	}
	
	if (ssrContext.payload?.error) {
		throw ssrContext.payload.error;
	}
	const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	{
		const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
		const link = [];
		for (const resource of Object.values(styles)) {
			
			if ("inline" in getQuery(resource.file)) {
				continue;
			}
			
			
			if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
				link.push({
					rel: "stylesheet",
					href: renderer.rendererContext.buildAssetsURL(resource.file),
					crossorigin: ""
				});
			}
		}
		if (link.length) {
			ssrContext.head.push({ link }, { mode: "server" });
		}
	}
	const islandHead = {};
	for (const entry of ssrContext.head.entries.values()) {
		
		for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
			const currentValue = islandHead[key];
			if (Array.isArray(currentValue)) {
				currentValue.push(...value);
			} else {
				islandHead[key] = value;
			}
		}
	}
	
	islandHead.link ||= [];
	islandHead.style ||= [];
	const islandResponse = {
		id: islandContext.id,
		head: islandHead,
		html: getServerComponentHTML(renderResult.html),
		components: getClientIslandResponse(ssrContext),
		slots: getSlotIslandResponse(ssrContext)
	};
	await nitroApp.hooks.callHook("render:island", islandResponse, {
		event,
		islandContext
	});
	return islandResponse;
}
function returnIslandResponse(event, response) {
	for (const header in response.headers || {}) {
		setResponseHeader(event, header, response.headers[header]);
	}
	if (response.statusCode) {
		setResponseStatus(event, response.statusCode, response.statusMessage);
	}
	return response.body;
}
const ISLAND_PATH_PREFIX = "/__nuxt_island/";
const VALID_COMPONENT_NAME_RE = /^[a-z][\w.-]*$/i;


async function readGuardedIslandBody(event) {
	const contentLength = Number(getRequestHeader(event, "content-length"));
	if (contentLength > MAX_ISLAND_BODY_BYTES) {
		throw createError({
			statusCode: 413,
			statusMessage: "Island request body too large"
		});
	}
	
	
	let received = 0;
	let raw = "";
	let overflowed = false;
	const stream = getRequestWebStream(event);
	if (stream) {
		const decoder = new TextDecoder();
		const reader = stream.getReader();
		try {
			for (;;) {
				const { done, value } = await reader.read();
				if (done) {
					break;
				}
				received += value.byteLength;
				if (received > MAX_ISLAND_BODY_BYTES) {
					
					
					
					overflowed = true;
					continue;
				}
				raw += decoder.decode(value, { stream: true });
			}
		} finally {
			reader.releaseLock();
		}
		raw += decoder.decode();
	}
	if (overflowed) {
		throw createError({
			statusCode: 413,
			statusMessage: "Island request body too large"
		});
	}
	if (!raw) {
		return {};
	}
	if (exceedsMaxDepth(raw)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Island request body too deeply nested"
		});
	}
	return destr$1(raw) || {};
}
async function getIslandContext(event) {
	let url = event.path || "";
	url.replace(/\?.*$/, "");
	if (!url.startsWith(ISLAND_PATH_PREFIX)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request path"
		});
	}
	const componentParts = url.substring(ISLAND_PATH_PREFIX.length).replace(ISLAND_SUFFIX_RE, "").split("_");
	const hashId = componentParts.length > 1 ? componentParts.pop() : undefined;
	const componentName = componentParts.join("_");
	if (!componentName || !VALID_COMPONENT_NAME_RE.test(componentName)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island component name"
		});
	}
	const rawContext = event.method === "GET" ? getQuery$1(event) : await readGuardedIslandBody(event);
	const serializedProps = typeof rawContext?.props === "string" ? rawContext.props : "{}";
	
	
	if (exceedsMaxBytes(serializedProps)) {
		throw createError({
			statusCode: 413,
			statusMessage: "Island request props too large"
		});
	}
	if (exceedsMaxDepth(serializedProps)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Island request props too deeply nested"
		});
	}
	
	
	const clientContext = {};
	if (rawContext && typeof rawContext === "object") {
		for (const key in rawContext) {
			if (key !== "props") {
				clientContext[key] = rawContext[key];
			}
		}
	}
	const parsed = destr$1(serializedProps);
	if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request props"
		});
	}
	const parsedProps = parsed;
	
	
	const expectedHash = computeIslandHash(componentName, serializedProps, clientContext, undefined);
	if (!hashId || hashId !== expectedHash) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request hash"
		});
	}
	return {
		url: typeof rawContext?.url === "string" ? rawContext.url : "/",
		id: hashId,
		name: componentName,
		props: parsedProps,
		slots: {},
		components: {}
	};
}

const _lazy_u5NhE9 = () => Promise.resolve().then(function () { return admin_post$1; });
const _lazy_R87Iwv = () => Promise.resolve().then(function () { return chat_post$1; });
const _lazy_P5lgd3 = () => Promise.resolve().then(function () { return brands_get$1; });
const _lazy_quzaxj = () => Promise.resolve().then(function () { return categories_get$1; });
const _lazy_t_MKoe = () => Promise.resolve().then(function () { return checkout_post$1; });
const _lazy_Eo7l_5 = () => Promise.resolve().then(function () { return contact_post$1; });
const _lazy_dROJ4p = () => Promise.resolve().then(function () { return coupon_get$1; });
const _lazy_s0QOS6 = () => Promise.resolve().then(function () { return health_get$1; });
const _lazy___thfy = () => Promise.resolve().then(function () { return newsletter_post$1; });
const _lazy_lWnO4N = () => Promise.resolve().then(function () { return orders_get$1; });
const _lazy_TdAdqX = () => Promise.resolve().then(function () { return products_get$1; });
const _lazy_V7GxQ3 = () => Promise.resolve().then(function () { return _slug__get$1; });
const _lazy_zvV5pt = () => Promise.resolve().then(function () { return reviews_post$1; });
const _lazy_on_qcH = () => Promise.resolve().then(function () { return search_get$1; });
const _lazy_tOl7cM = () => Promise.resolve().then(function () { return robots_txt$1; });
const _lazy_aslpYW = () => Promise.resolve().then(function () { return sitemap_xml$1; });
const _lazy_HOpcdy = () => Promise.resolve().then(function () { return renderer; });

const handlers = [
  { route: '', handler: _egHosr, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin', handler: _lazy_u5NhE9, lazy: true, middleware: false, method: "post" },
  { route: '/api/ai/chat', handler: _lazy_R87Iwv, lazy: true, middleware: false, method: "post" },
  { route: '/api/brands', handler: _lazy_P5lgd3, lazy: true, middleware: false, method: "get" },
  { route: '/api/categories', handler: _lazy_quzaxj, lazy: true, middleware: false, method: "get" },
  { route: '/api/checkout', handler: _lazy_t_MKoe, lazy: true, middleware: false, method: "post" },
  { route: '/api/contact', handler: _lazy_Eo7l_5, lazy: true, middleware: false, method: "post" },
  { route: '/api/coupon', handler: _lazy_dROJ4p, lazy: true, middleware: false, method: "get" },
  { route: '/api/health', handler: _lazy_s0QOS6, lazy: true, middleware: false, method: "get" },
  { route: '/api/newsletter', handler: _lazy___thfy, lazy: true, middleware: false, method: "post" },
  { route: '/api/orders', handler: _lazy_lWnO4N, lazy: true, middleware: false, method: "get" },
  { route: '/api/products', handler: _lazy_TdAdqX, lazy: true, middleware: false, method: "get" },
  { route: '/api/products/:slug', handler: _lazy_V7GxQ3, lazy: true, middleware: false, method: "get" },
  { route: '/api/reviews', handler: _lazy_zvV5pt, lazy: true, middleware: false, method: "post" },
  { route: '/api/search', handler: _lazy_on_qcH, lazy: true, middleware: false, method: "get" },
  { route: '/robots.txt', handler: _lazy_tOl7cM, lazy: true, middleware: false, method: undefined },
  { route: '/sitemap.xml', handler: _lazy_aslpYW, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_HOpcdy, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: handler$1, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_HOpcdy, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = nodeCrypto.webcrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server$1 = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server$1.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server$1.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server$1.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = {
	"appName": "Nuxt",
	"version": "",
	"status": 500,
	"statusText": "Server error",
	"description": "This page is temporarily unavailable."
};
const template$1 = (messages) => {
	messages = {
		..._messages,
		...messages
	};
	return "<!DOCTYPE html><html lang=\"en\"><head><title>" + escapeHtml(messages.status) + " - " + escapeHtml(messages.statusText) + " | " + escapeHtml(messages.appName) + "</title><meta charset=\"utf-8\"><meta content=\"width=device-width,initial-scale=1,minimum-scale=1\" name=\"viewport\"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);filter:blur(20vh)}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:\"\"}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.-bottom-1\\/2{bottom:-50%}.left-0{left:0}.right-0{right:0}.grid{display:grid}.mb-16{margin-bottom:4rem}.mb-8{margin-bottom:2rem}.h-1\\/2{height:50%}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-8{padding-left:2rem;padding-right:2rem}.text-center{text-align:center}.text-8xl{font-size:6rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media(prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media(min-width:640px){.sm\\:px-0{padding-left:0;padding-right:0}.sm\\:text-4xl{font-size:2.25rem;line-height:2.5rem}}</style><script>!function(){const e=document.createElement(\"link\").relList;if(!(e&&e.supports&&e.supports(\"modulepreload\"))){for(const e of document.querySelectorAll('link[rel=\"modulepreload\"]'))r(e);new MutationObserver(e=>{for(const o of e)if(\"childList\"===o.type)for(const e of o.addedNodes)\"LINK\"===e.tagName&&\"modulepreload\"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),\"use-credentials\"===e.crossOrigin?r.credentials=\"include\":\"anonymous\"===e.crossOrigin?r.credentials=\"omit\":r.credentials=\"same-origin\",r}(e);fetch(e.href,r)}}();<\/script></head><body class=\"antialiased bg-white dark:bg-black dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-black\"><div class=\"-bottom-1/2 fixed h-1/2 left-0 right-0 spotlight\"></div><div class=\"max-w-520px text-center\"><h1 class=\"font-medium mb-8 sm:text-10xl text-8xl\">" + escapeHtml(messages.status) + "</h1><p class=\"font-light leading-tight mb-16 px-8 sm:px-0 sm:text-4xl text-xl\">" + escapeHtml(messages.description) + "</p></div></body></html>";
};

const error500 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const server = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: viteNodeEntry_mjs
}, Symbol.toStringTag, { value: 'Module' }));

const client_manifest = () => viteNodeFetch.getManifest();

const client_manifest$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: client_manifest
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

var _a;
const { Pool } = pg;
const databaseUrl = process.env.DATABASE_URL;
const globalForDb = globalThis;
const pool = databaseUrl ? (_a = globalForDb.__arenaNuxtPostgresqlPool) != null ? _a : new Pool({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 5e3
}) : null;
if (pool && true) {
  globalForDb.__arenaNuxtPostgresqlPool = pool;
}
const db = pool ? drizzle(pool) : null;

const orderStatus = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "refunded"
]);
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
pgTable("addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull().default("Home"),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  zip: text("zip").notNull(),
  country: text("country").notNull().default("United States")
});
const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description")
});
const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  featured: boolean("featured").notNull().default(true)
});
const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  description: text("description").notNull(),
  specs: jsonb("specs").$type(),
  price: integer("price").notNull(),
  // cents / tomans
  discountPrice: integer("discount_price"),
  rating: integer("rating").notNull().default(0),
  // tenths of a star (e.g. 48 = 4.8)
  reviewCount: integer("review_count").notNull().default(0),
  stock: integer("stock").notNull().default(0),
  brandId: integer("brand_id").references(() => brands.id),
  categoryId: integer("category_id").references(() => categories.id),
  images: jsonb("images").$type(),
  featured: boolean("featured").notNull().default(false),
  newArrival: boolean("new_arrival").notNull().default(false),
  bestSeller: boolean("best_seller").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  title: text("title"),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  shipping: jsonb("shipping").$type(),
  couponCode: text("coupon_code"),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  shippingFee: integer("shipping_fee").notNull().default(0),
  total: integer("total").notNull(),
  status: orderStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id),
  name: text("name").notNull(),
  image: text("image"),
  price: integer("price").notNull(),
  qty: integer("qty").notNull()
});
pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  percent: integer("percent"),
  fixed: integer("fixed"),
  minSubtotal: integer("min_subtotal").notNull().default(0),
  active: boolean("active").notNull().default(true),
  validUntil: date("valid_until")
});
const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});
const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

function emailOk(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

const px = (id, w = 800) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const FALLBACK_IMAGES = {
  A: px(19344605),
  B: px(17962162),
  C: px(17962161),
  D: px(14472703),
  E: px(11587603),
  F: px(12345382),
  G: px(13870347),
  I: px(17962164)};
const FALLBACK_CATEGORIES = [
  { id: 1, name: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641", slug: "pods", description: "\u067E\u0627\u062F\u0647\u0627\u06CC \u0622\u0645\u0627\u062F\u0647 \u0645\u0635\u0631\u0641 \u0628\u0627 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC \u0645\u062A\u0646\u0648\u0639 \u2014 \u0628\u062F\u0648\u0646 \u0646\u06CC\u0627\u0632 \u0628\u0647 \u06A9\u0648\u06CC\u0644 \u0648 \u0633\u0627\u0644\u062A \u062C\u062F\u0627", image: FALLBACK_IMAGES.A, count: 6 },
  { id: 2, name: "\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646", slug: "salts", description: "\u0646\u0645\u06A9 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u0627\u0635\u0644 \u0628\u0627 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u06F2\u06F0 \u062A\u0627 \u06F5\u06F0 \u2014 \u062D\u0633 \u0646\u0631\u0645 \u0648 \u0634\u0628\u06CC\u0647 \u0633\u06CC\u06AF\u0627\u0631", image: FALLBACK_IMAGES.F, count: 3 },
  { id: 3, name: "\u0645\u0648\u062F \u0648 \u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645", slug: "mods", description: "\u062F\u0633\u062A\u06AF\u0627\u0647\u200C\u0647\u0627\u06CC \u0642\u0627\u0628\u0644 \u0634\u0627\u0631\u0698 \u0628\u0627 \u06A9\u0648\u06CC\u0644 \u0642\u0627\u0628\u0644 \u062A\u0639\u0648\u06CC\u0636 \u0628\u0631\u0627\u06CC \u0645\u0635\u0631\u0641 \u0631\u0648\u0632\u0627\u0646\u0647 \u0648 \u0627\u0642\u062A\u0635\u0627\u062F\u06CC", image: FALLBACK_IMAGES.C, count: 3 },
  { id: 4, name: "\u0644\u0648\u0627\u0632\u0645 \u062C\u0627\u0646\u0628\u06CC", slug: "gear", description: "\u06A9\u0648\u06CC\u0644\u060C \u0686\u0627\u0631\u062C\u0631\u060C \u06A9\u06CC\u0633 \u0648 \u0627\u0628\u0632\u0627\u0631 \u062A\u0645\u06CC\u0632\u06A9\u0627\u0631\u06CC \u0628\u0631\u0627\u06CC \u0646\u06AF\u0647\u062F\u0627\u0631\u06CC \u062D\u0631\u0641\u0647\u200C\u0627\u06CC", image: FALLBACK_IMAGES.I, count: 4 }
];
const FALLBACK_BRANDS = [
  { id: 1, name: "ELFBAR", slug: "elfbar", description: "\u067E\u0631\u0641\u0631\u0648\u0634\u200C\u062A\u0631\u06CC\u0646 \u0628\u0631\u0646\u062F \u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641 \u062C\u0647\u0627\u0646", count: 2 },
  { id: 2, name: "VOZOL", slug: "vozol", description: "\u067E\u0627\u062F\u0647\u0627\u06CC \u0642\u062F\u0631\u062A\u0645\u0646\u062F \u0628\u0627 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC \u062E\u0627\u0635", count: 2 },
  { id: 3, name: "LOST MARY", slug: "lostmary", description: "\u0637\u0631\u0627\u062D\u06CC \u0645\u062F\u0631\u0646 \u0648 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC \u0645\u06CC\u0648\u0647\u200C\u0627\u06CC \u062C\u0630\u0627\u0628", count: 1 },
  { id: 4, name: "IGET", slug: "iget", description: "\u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0644\u0627\u0633\u06CC\u06A9 \u0648\u0627\u067E\u0631\u0647\u0627\u06CC \u062D\u0631\u0641\u0647\u200C\u0627\u06CC", count: 1 },
  { id: 5, name: "AIR BAR", slug: "airbar", description: "\u067E\u0627\u062F\u0647\u0627\u06CC \u0633\u0628\u06A9 \u0648 \u062E\u0648\u0634\u200C\u062F\u0633\u062A", count: 1 },
  { id: 6, name: "VAPORESSO", slug: "vaporesso", description: "\u0645\u0648\u062F \u0648 \u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645 \u0628\u0627 \u062A\u06A9\u0646\u0648\u0644\u0648\u0698\u06CC \u0631\u0648\u0632", count: 3 },
  { id: 7, name: "NASTY", slug: "nasty", description: "\u0633\u0627\u0644\u062A\u200C\u0647\u0627\u06CC \u0645\u0637\u0631\u062D \u0645\u0627\u0644\u0632\u06CC\u0627\u06CC\u06CC", count: 1 },
  { id: 8, name: "VAPORA", slug: "vapora", description: "\u0628\u0631\u0646\u062F \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u0648\u06CC\u067E\u0648\u0631\u0627", count: 5 }
];
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    slug: "elfbar-te6000",
    name: "ELFBAR TE6000",
    tagline: "\u06F6\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0637\u0639\u0645 \u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E \u{1F347}",
    description: "\u0627\u0644 \u0627\u0641 \u0628\u0627\u0631 TE6000 \u0628\u0627 \u06F6\u06F0\u06F0\u06F0 \u067E\u0627\u0641\u060C \u06F1\u06F5 \u0645\u06CC\u0644\u06CC\u200C\u0644\u06CC\u062A\u0631 \u062C\u0648\u062E \u0648 \u0628\u0627\u062A\u0631\u06CC \u06F6\u06F0\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u0622\u0645\u067E\u0631\u06CC\u060C \u0645\u062D\u0628\u0648\u0628\u200C\u062A\u0631\u06CC\u0646 \u0627\u0646\u062A\u062E\u0627\u0628 \u0648\u0627\u067E\u0631\u0647\u0627\u06CC \u0627\u06CC\u0631\u0627\u0646\u06CC \u0627\u0633\u062A. \u0637\u0639\u0645 \u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E \u0628\u0627 \u0633\u0631\u062F\u06CC \u0645\u062A\u0639\u0627\u062F\u0644\u060C \u06A9\u0634\u06CC\u062F\u0646\u0634 \u0631\u0627 \u0628\u0647 \u06CC\u06A9 \u0639\u0627\u062F\u062A \u062E\u0648\u0634\u200C\u0637\u0639\u0645 \u062A\u0628\u062F\u06CC\u0644 \u0645\u06CC\u200C\u06A9\u0646\u062F. \u062F\u0627\u0631\u0627\u06CC \u0647\u0648\u0644\u0648\u06AF\u0631\u0627\u0645 \u0627\u0635\u0627\u0644\u062A \u0648 \u06A9\u062F \u0627\u0633\u062A\u0639\u0644\u0627\u0645.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E \u{1F347}", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647 \u06CC\u062E\u06CC \u{1F349}", "\u0628\u0644\u0648\u0628\u0631\u06CC \u0631\u0627\u0632\u0628\u0631\u06CC", "\u062A\u0648\u062A\u200C\u0641\u0631\u0646\u06AF\u06CC \u06A9\u06CC\u0648\u06CC", "\u0633\u06CC\u0628 \u0633\u0628\u0632 \u{1F34F}", "\u0644\u06CC\u0686\u06CC"],
        nicotine: ["20", "50"],
        puffs: "\u06F6\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "15 ml",
      \u0628\u0627\u062A\u0631\u06CC: "600 mAh",
      \u0634\u0627\u0631\u0698: "Type-C",
      "\u0646\u0648\u0639 \u0637\u0639\u0645": "\u0645\u06CC\u0648\u0647\u200C\u0627\u06CC \u06CC\u062E\u06CC"
    },
    price: 115e4,
    discountPrice: 99e4,
    rating: 4.8,
    reviewCount: 214,
    stock: 46,
    brand: "ELFBAR",
    brandSlug: "elfbar",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.A, FALLBACK_IMAGES.B],
    featured: true,
    newArrival: false,
    bestSeller: true,
    createdAt: new Date(Date.now() - 120 * 864e5).toISOString()
  },
  {
    id: 2,
    slug: "vozol-gecko-10000",
    name: "VOZOL GECKO 10000",
    tagline: "\u06F1\u06F0\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0646\u0645\u0627\u06CC\u0634\u06AF\u0631 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u26A1",
    description: "\u063A\u0648\u0644 \u062C\u062F\u06CC\u062F \u0648\u0648\u0632\u0648\u0644 \u0628\u0627 \u06F1\u06F0\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \u0648 \u0646\u0645\u0627\u06CC\u0634\u06AF\u0631 \u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 \u06A9\u0647 \u0645\u06CC\u0632\u0627\u0646 \u062C\u0648\u062E \u0648 \u0628\u0627\u062A\u0631\u06CC \u0631\u0627 \u0646\u0634\u0627\u0646 \u0645\u06CC\u200C\u062F\u0647\u062F. \u062C\u0631\u06CC\u0627\u0646 \u0647\u0648\u0627 \u0642\u0627\u0628\u0644 \u062A\u0646\u0638\u06CC\u0645 \u0627\u0633\u062A \u0648 \u0637\u0639\u0645\u200C\u0647\u0627 \u062A\u0627 \u0622\u062E\u0631\u06CC\u0646 \u067E\u0627\u0641 \u06CC\u06A9\u062F\u0633\u062A \u0645\u06CC\u200C\u0645\u0627\u0646\u0646\u062F.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0628\u0644\u0648\u0628\u0631\u06CC \u0622\u06CC\u0633 \u{1FAD0}", "\u0627\u0646\u0628\u0647 \u{1F96D}", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647 \u0633\u0631\u062F", "\u06AF\u0631\u06CC\u067E\u200C\u0641\u0631\u0648\u062A", "\u06A9\u0648\u0644\u0627 \u06CC\u062E\u06CC"],
        nicotine: ["20", "50"],
        puffs: "\u06F1\u06F0\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "22 ml",
      \u0628\u0627\u062A\u0631\u06CC: "850 mAh",
      \u0646\u0645\u0627\u06CC\u0634\u06AF\u0631: "\u062F\u06CC\u062C\u06CC\u062A\u0627\u0644 OLED"
    },
    price: 148e4,
    discountPrice: null,
    rating: 4.5,
    reviewCount: 87,
    stock: 30,
    brand: "VOZOL",
    brandSlug: "vozol",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.B, FALLBACK_IMAGES.A],
    featured: false,
    newArrival: true,
    bestSeller: false,
    createdAt: new Date(Date.now() - 8 * 864e5).toISOString()
  },
  {
    id: 3,
    slug: "lostmary-os5000",
    name: "LOST MARY OS5000",
    tagline: "\u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0637\u0631\u0627\u062D\u06CC \u0645\u062F\u0631\u0646 \u2728",
    description: "\u0644\u0627\u0633\u062A \u0645\u0627\u0631\u06CC \u0628\u0627 \u0628\u062F\u0646\u0647\u200C\u06CC \u0645\u0627\u062A \u0648 \u0627\u0631\u06AF\u0648\u0646\u0648\u0645\u06CC\u06A9\u060C \u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \u0645\u0627\u0646\u062F\u06AF\u0627\u0631\u06CC \u062F\u0627\u0631\u062F \u0648 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC\u0634 \u0628\u06CC\u0646\u200C\u0627\u0644\u0645\u0644\u0644\u06CC \u0647\u0633\u062A\u0646\u062F. \u0633\u0627\u06CC\u0632 \u06A9\u0648\u0686\u06A9 \u0648 \u0648\u0632\u0646 \u0633\u0628\u06A9\u0634 \u0628\u0631\u0627\u06CC \u0647\u0645\u0631\u0627\u0647\u200C\u062F\u0627\u0634\u062A\u0646 \u0631\u0648\u0632\u0627\u0646\u0647 \u0639\u0627\u0644\u06CC \u0627\u0633\u062A.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0647\u0644\u0648 \u{1F351}", "\u062A\u0648\u062A\u200C\u0641\u0631\u0646\u06AF\u06CC \u{1F353}", "\u0622\u0628\u200C\u0645\u06CC\u0648\u0647 \u0642\u0631\u0645\u0632", "\u0627\u0646\u06AF\u0648\u0631"],
        nicotine: ["20", "50"],
        puffs: "\u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "13 ml",
      \u0628\u0627\u062A\u0631\u06CC: "500 mAh"
    },
    price: 102e4,
    discountPrice: null,
    rating: 4.7,
    reviewCount: 142,
    stock: 55,
    brand: "LOST MARY",
    brandSlug: "lostmary",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.C, FALLBACK_IMAGES.A],
    featured: false,
    newArrival: false,
    bestSeller: true,
    createdAt: new Date(Date.now() - 200 * 864e5).toISOString()
  },
  {
    id: 4,
    slug: "iget-xxl-5000",
    name: "IGET XXL 5000",
    tagline: "\u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0637\u0639\u0645 \u06A9\u0644\u0627\u0633\u06CC\u06A9",
    description: "\u0622\u06CC\u200C\u06AF\u062A XXL \u0628\u0627 \u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \u0648 \u0633\u0627\u06CC\u0632 \u0628\u0632\u0631\u06AF\u060C \u0627\u0646\u062A\u062E\u0627\u0628 \u0642\u062F\u06CC\u0645\u06CC\u200C\u0647\u0627\u06CC \u062F\u0646\u06CC\u0627\u06CC \u0648\u06CC\u067E \u0627\u0633\u062A. \u0628\u062E\u0627\u0631 \u062D\u062C\u06CC\u0645 \u0648 \u06A9\u0634\u0634 \u0628\u0627\u0632\u060C \u062A\u062C\u0631\u0628\u0647\u200C\u0627\u06CC \u0646\u0632\u062F\u06CC\u06A9 \u0628\u0647 \u0645\u0648\u062F\u0647\u0627\u06CC \u062D\u0631\u0641\u0647\u200C\u0627\u06CC \u0645\u06CC\u200C\u062F\u0647\u062F.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0627\u0646\u06AF\u0648\u0631", "\u0628\u0644\u0648\u0628\u0631\u06CC", "\u0646\u0639\u0646\u0627\u0639", "\u062A\u0648\u062A\u200C\u0641\u0631\u0646\u06AF\u06CC"],
        nicotine: ["20", "50"],
        puffs: "\u06F5\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "12 ml",
      \u0628\u0627\u062A\u0631\u06CC: "550 mAh"
    },
    price: 89e4,
    discountPrice: null,
    rating: 4.4,
    reviewCount: 96,
    stock: 40,
    brand: "IGET",
    brandSlug: "iget",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.D, FALLBACK_IMAGES.E],
    featured: true,
    newArrival: false,
    bestSeller: false,
    createdAt: new Date(Date.now() - 300 * 864e5).toISOString()
  },
  {
    id: 5,
    slug: "airbar-lux-4000",
    name: "AIR BAR LUX 4000",
    tagline: "\u06F4\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0633\u0628\u06A9 \u0648 \u062E\u0648\u0634\u200C\u062F\u0633\u062A",
    description: "\u0627\u06CC\u0631\u0628\u0627\u0631 \u0633\u0628\u06A9\u200C\u062A\u0631\u06CC\u0646 \u0627\u0646\u062A\u062E\u0627\u0628 \u0631\u0648\u0632\u0645\u0631\u0647 \u0627\u0633\u062A\u061B \u06F4\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \u062F\u0631 \u0628\u062F\u0646\u0647\u200C\u0627\u06CC \u0628\u0627\u0631\u06CC\u06A9 \u06A9\u0647 \u062A\u0648\u06CC \u062C\u06CC\u0628 \u06AF\u0645 \u0645\u06CC\u200C\u0634\u0648\u062F. \u0637\u0639\u0645 \u0646\u0639\u0646\u0627\u0639 \u06CC\u062E\u06CC\u200C\u0627\u0634 \u0645\u0639\u0631\u0648\u0641 \u0627\u0633\u062A.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0646\u0639\u0646\u0627\u0639 \u06CC\u062E\u06CC \u2744\uFE0F", "\u0644\u06CC\u0645\u0648", "\u0627\u0646\u06AF\u0648\u0631", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647"],
        nicotine: ["20", "50"],
        puffs: "\u06F4\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "10 ml",
      \u0628\u0627\u062A\u0631\u06CC: "450 mAh"
    },
    price: 74e4,
    discountPrice: null,
    rating: 4.3,
    reviewCount: 61,
    stock: 64,
    brand: "AIR BAR",
    brandSlug: "airbar",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.E, FALLBACK_IMAGES.D],
    featured: false,
    newArrival: false,
    bestSeller: false,
    createdAt: new Date(Date.now() - 90 * 864e5).toISOString()
  },
  {
    id: 6,
    slug: "vapora-puff-8000",
    name: "VAPORA PUFF 8000",
    tagline: "\u06F8\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \xB7 \u0628\u0631\u0646\u062F \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0648\u06CC\u067E\u0648\u0631\u0627 \u{1F3F7}\uFE0F",
    description: "\u067E\u0627\u062F \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0641\u0631\u0648\u0634\u06AF\u0627\u0647 \u0648\u06CC\u067E\u0648\u0631\u0627 \u0628\u0627 \u06F8\u06F0\u06F0\u06F0 \u067E\u0627\u0641 \u0648 \u0628\u0647\u062A\u0631\u06CC\u0646 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC \u067E\u0631\u0641\u0631\u0648\u0634 \u0628\u0627\u0632\u0627\u0631\u060C \u0628\u0627 \u0642\u06CC\u0645\u062A\u06CC \u0645\u0646\u0635\u0641\u0627\u0646\u0647\u200C\u062A\u0631 \u0648 \u0647\u0645\u0627\u0646 \u06A9\u06CC\u0641\u06CC\u062A \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E", "\u0628\u0644\u0648\u0628\u0631\u06CC \u0622\u06CC\u0633", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647 \u0633\u0631\u062F", "\u0627\u0646\u0628\u0647"],
        nicotine: ["20", "50"],
        puffs: "\u06F8\u06F0\u06F0\u06F0 \u067E\u0627\u0641"
      }),
      "\u0645\u0642\u062F\u0627\u0631 \u062C\u0648\u062E": "16 ml",
      \u0628\u0627\u062A\u0631\u06CC: "650 mAh"
    },
    price: 119e4,
    discountPrice: 105e4,
    rating: 4.6,
    reviewCount: 38,
    stock: 28,
    brand: "VAPORA",
    brandSlug: "vapora",
    category: "\u067E\u0627\u062F \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641",
    categorySlug: "pods",
    images: [FALLBACK_IMAGES.B, FALLBACK_IMAGES.D],
    featured: false,
    newArrival: true,
    bestSeller: false,
    createdAt: new Date(Date.now() - 4 * 864e5).toISOString()
  },
  {
    id: 7,
    slug: "vapora-salt-30",
    name: "VAPORA SALT 30ml",
    tagline: "\u0633\u0627\u0644\u062A \u06F3\u06F0 \u0645\u06CC\u0644 \xB7 \u0637\u0639\u0645 \u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E",
    description: "\u0633\u0627\u0644\u062A \u0627\u062E\u062A\u0635\u0627\u0635\u06CC \u0648\u06CC\u067E\u0648\u0631\u0627 \u0628\u0627 \u06F3\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u0644\u06CC\u062A\u0631 \u062D\u062C\u0645 \u0648 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u06F3\u06F5/\u06F5\u06F0. \u062A\u0631\u06A9\u06CC\u0628 \u0627\u0646\u06AF\u0648\u0631 \u0648 \u0633\u0631\u062F\u06CC \u0646\u0639\u0646\u0627\u0639\u060C \u062A\u062C\u0631\u0628\u0647\u200C\u0627\u06CC \u0646\u0631\u0645 \u0648 \u0628\u06CC\u200C\u062E\u0634\u0648\u0646\u062A \u0645\u06CC\u200C\u0633\u0627\u0632\u062F.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E \u{1F347}", "\u0628\u0644\u0648\u0628\u0631\u06CC \u{1FAD0}", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647", "\u062A\u0646\u0628\u0627\u06A9\u0648 \u0648 \u06A9\u0627\u0631\u0627\u0645\u0644", "\u0646\u0639\u0646\u0627\u0639"],
        nicotine: ["35", "50"],
        salt: "\u0646\u0645\u06A9 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646"
      }),
      \u062D\u062C\u0645: "30 ml",
      "\u0646\u0633\u0628\u062A VG/PG": "50/50",
      \u06A9\u0634\u0648\u0631: "\u0645\u0627\u0644\u0632\u06CC"
    },
    price: 385e3,
    discountPrice: null,
    rating: 4.6,
    reviewCount: 173,
    stock: 80,
    brand: "VAPORA",
    brandSlug: "vapora",
    category: "\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646",
    categorySlug: "salts",
    images: [FALLBACK_IMAGES.F, FALLBACK_IMAGES.G],
    featured: false,
    newArrival: false,
    bestSeller: true,
    createdAt: new Date(Date.now() - 150 * 864e5).toISOString()
  },
  {
    id: 8,
    slug: "elfbar-salt-30",
    name: "ELFBAR SALT 30ml",
    tagline: "\u0633\u0627\u0644\u062A \u06F3\u06F0 \u0645\u06CC\u0644 \u0627\u0644 \u0627\u0641 \u0628\u0627\u0631 \xB7 \u0628\u0644\u0648\u0628\u0631\u06CC",
    description: "\u0633\u0627\u0644\u062A \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644 \u0627\u0644 \u0627\u0641 \u0628\u0627\u0631 \u062F\u0631 \u0628\u0637\u0631\u06CC \u06F3\u06F0 \u0645\u06CC\u0644 \u0628\u0627 \u0637\u0639\u0645 \u0628\u0644\u0648\u0628\u0631\u06CC \u0634\u06CC\u0631\u06CC\u0646 \u0648 \u0633\u0631\u062F\u06CC \u0645\u0644\u0627\u06CC\u0645. \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u0646\u0631\u0645 \u0648 \u0628\u0627 \u06A9\u06CC\u0641\u06CC\u062A \u062B\u0627\u0628\u062A.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u0628\u0644\u0648\u0628\u0631\u06CC", "\u0627\u0646\u06AF\u0648\u0631", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647", "\u062A\u0648\u062A\u200C\u0641\u0631\u0646\u06AF\u06CC"],
        nicotine: ["35", "50"]
      }),
      \u062D\u062C\u0645: "30 ml",
      \u06A9\u0634\u0648\u0631: "\u0645\u0627\u0644\u0632\u06CC"
    },
    price: 42e4,
    discountPrice: null,
    rating: 4.5,
    reviewCount: 84,
    stock: 60,
    brand: "ELFBAR",
    brandSlug: "elfbar",
    category: "\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646",
    categorySlug: "salts",
    images: [FALLBACK_IMAGES.G, FALLBACK_IMAGES.F],
    featured: false,
    newArrival: false,
    bestSeller: false,
    createdAt: new Date(Date.now() - 150 * 864e5).toISOString()
  },
  {
    id: 9,
    slug: "nasty-salt-30",
    name: "NASTY SALT 30ml",
    tagline: "\u0633\u0627\u0644\u062A \u0646\u0633\u062A\u06CC \xB7 \u0637\u0639\u0645 \u062A\u0631\u0634 \u0648 \u0634\u06CC\u0631\u06CC\u0646 \u{1F36C}",
    description: "\u0646\u0627\u0633\u062A\u06CC \u0628\u0627 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC \u062C\u0633\u0648\u0631\u0627\u0646\u0647\u200C\u0627\u0634 \u0645\u0639\u0631\u0648\u0641 \u0627\u0633\u062A\u061B \u062A\u0631\u06A9\u06CC\u0628 \u062A\u0631\u0634 \u0648 \u0634\u06CC\u0631\u06CC\u0646 \u0628\u0627 \u0633\u0631\u062F\u06CC \u06A9\u0647 \u0637\u0631\u0641\u062F\u0627\u0631\u0627\u0646 \u062E\u0627\u0635 \u062E\u0648\u062F\u0634 \u0631\u0627 \u062F\u0627\u0631\u062F.",
    specs: {
      options: JSON.stringify({
        flavors: ["\u06A9\u0634\u0646\u062F\u0647 \u062A\u0631\u0634 \u{1F36C}", "\u0627\u0646\u06AF\u0648\u0631 \u06CC\u062E", "\u0628\u0644\u0648\u0628\u0631\u06CC"],
        nicotine: ["35", "50"]
      }),
      \u062D\u062C\u0645: "30 ml",
      \u06A9\u0634\u0648\u0631: "\u0645\u0627\u0644\u0632\u06CC"
    },
    price: 465e3,
    discountPrice: null,
    rating: 4.4,
    reviewCount: 51,
    stock: 36,
    brand: "NASTY",
    brandSlug: "nasty",
    category: "\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646",
    categorySlug: "salts",
    images: [FALLBACK_IMAGES.F],
    featured: false,
    newArrival: true,
    bestSeller: false,
    createdAt: new Date(Date.now() - 6 * 864e5).toISOString()
  },
  {
    id: 10,
    slug: "vaporesso-luxe-xr",
    name: "VAPORESSO LUXE XR",
    tagline: "\u0645\u0648\u062F \u06F4\u06F0 \u0648\u0627\u062A \xB7 \u06A9\u0648\u06CC\u0644 GTX \u{1F525}",
    description: "\u0644\u0648\u06A9\u0633 XR \u0628\u0627 \u062A\u0631\u0627\u0634\u0647 AXON \u062A\u0627 \u06F4\u06F0 \u0648\u0627\u062A \u062A\u0648\u0627\u0646\u060C \u0628\u0627\u062A\u0631\u06CC \u06F1\u06F8\u06F0\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u0622\u0645\u067E\u0631\u06CC \u062F\u0627\u062E\u0644\u06CC \u0648 \u06A9\u0648\u06CC\u0644\u200C\u0647\u0627\u06CC GTX\u060C \u06CC\u06A9\u06CC \u0627\u0632 \u0628\u0647\u062A\u0631\u06CC\u0646 \u0645\u0648\u062F\u0647\u0627\u06CC \u062C\u0645\u0639\u200C\u0648\u062C\u0648\u0631 \u0628\u0631\u0627\u06CC \u0645\u0635\u0631\u0641 \u0631\u0648\u0632\u0627\u0646\u0647 \u0627\u0633\u062A.",
    specs: {
      "\u062A\u0648\u0627\u0646 \u062E\u0631\u0648\u062C\u06CC": "5-40 W",
      \u0628\u0627\u062A\u0631\u06CC: "1800 mAh",
      "\u0645\u0642\u062F\u0627\u0631 \u062A\u0627\u0646\u06A9": "4 ml",
      "\u06A9\u0648\u06CC\u0644 \u0633\u0627\u0632\u06AF\u0627\u0631": "GTX 0.6/0.8 ohm",
      \u0634\u0627\u0631\u0698: "Type-C 2A"
    },
    price: 245e4,
    discountPrice: 215e4,
    rating: 4.8,
    reviewCount: 122,
    stock: 14,
    brand: "VAPORESSO",
    brandSlug: "vaporesso",
    category: "\u0645\u0648\u062F \u0648 \u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645",
    categorySlug: "mods",
    images: [FALLBACK_IMAGES.A, FALLBACK_IMAGES.D],
    featured: true,
    newArrival: false,
    bestSeller: true,
    createdAt: new Date(Date.now() - 260 * 864e5).toISOString()
  },
  {
    id: 11,
    slug: "vaporesso-xros3",
    name: "VAPORESSO XROS 3",
    tagline: "\u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645 XROS \xB7 \u06F1\u06F0\u06F0\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u0622\u0645\u067E\u0631",
    description: "\u0627\u06CC\u06A9\u0633\u200C\u0631\u0627\u0633 \u06F3 \u0628\u0627 \u0637\u0631\u0627\u062D\u06CC \u0628\u0627\u0631\u06CC\u06A9 \u0648 \u0628\u0627\u062A\u0631\u06CC \u06F1\u06F0\u06F0\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u0622\u0645\u067E\u0631\u06CC\u060C \u0645\u062D\u0628\u0648\u0628\u200C\u062A\u0631\u06CC\u0646 \u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645 \u062C\u0647\u0627\u0646 \u0627\u0633\u062A. \u06A9\u0648\u06CC\u0644\u200C\u0647\u0627\u06CC \u06F0.\u06F6 \u0648 \u06F0.\u06F8 \u0627\u0647\u0645 \u0628\u0627 \u0637\u0639\u0645 \u0639\u0627\u0644\u06CC.",
    specs: {
      \u0628\u0627\u062A\u0631\u06CC: "1000 mAh",
      "\u0645\u0642\u062F\u0627\u0631 \u062A\u0627\u0646\u06A9": "2 ml",
      "\u06A9\u0648\u06CC\u0644 \u0633\u0627\u0632\u06AF\u0627\u0631": "XROS 0.6/0.8/1.0 ohm",
      \u0634\u0627\u0631\u0698: "Type-C"
    },
    price: 189e4,
    discountPrice: null,
    rating: 4.7,
    reviewCount: 98,
    stock: 22,
    brand: "VAPORESSO",
    brandSlug: "vaporesso",
    category: "\u0645\u0648\u062F \u0648 \u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645",
    categorySlug: "mods",
    images: [FALLBACK_IMAGES.B, FALLBACK_IMAGES.C],
    featured: false,
    newArrival: false,
    bestSeller: false,
    createdAt: new Date(Date.now() - 180 * 864e5).toISOString()
  },
  {
    id: 12,
    slug: "xros-coil-pack",
    name: "XROS Coil Pack",
    tagline: "\u06A9\u0648\u06CC\u0644 \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644 XROS \u2014 \u067E\u06A9 \u06F4 \u0639\u062F\u062F\u06CC",
    description: "\u06A9\u0648\u06CC\u0644\u200C\u0647\u0627\u06CC \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644 \u0648\u0627\u067E\u0631\u0633\u0648 \u0628\u0631\u0627\u06CC \u062F\u0633\u062A\u06AF\u0627\u0647\u200C\u0647\u0627\u06CC XROS. \u067E\u06A9 \u06F4 \u0639\u062F\u062F\u06CC \u0628\u0627 \u0645\u0642\u0627\u0648\u0645\u062A\u200C\u0647\u0627\u06CC \u06F0.\u06F6\u060C \u06F0.\u06F8 \u0648 \u06F1.\u06F0 \u0627\u0647\u0645.",
    specs: {
      "\u0645\u0642\u0627\u0648\u0645\u062A\u200C\u0647\u0627": "0.6 / 0.8 / 1.0 ohm",
      \u062A\u0639\u062F\u0627\u062F: "4 \u0639\u062F\u062F",
      \u0633\u0627\u0632\u06AF\u0627\u0631\u06CC: "XROS 1/2/3/4"
    },
    price: 32e4,
    discountPrice: null,
    rating: 4.5,
    reviewCount: 210,
    stock: 120,
    brand: "VAPORESSO",
    brandSlug: "vaporesso",
    category: "\u0644\u0648\u0627\u0632\u0645 \u062C\u0627\u0646\u0628\u06CC",
    categorySlug: "gear",
    images: [FALLBACK_IMAGES.I, FALLBACK_IMAGES.G],
    featured: false,
    newArrival: false,
    bestSeller: true,
    createdAt: new Date(Date.now() - 300 * 864e5).toISOString()
  }
];
[
  { id: 1, author: "\u0639\u0644\u06CC \u0631.", rating: 5, title: "\u0639\u0627\u0644\u06CC \u0628\u0648\u062F", body: "\u0637\u0639\u0645 \u0648 \u0645\u0627\u0646\u062F\u06AF\u0627\u0631\u06CC \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u0627\u0633\u062A. \u0627\u0631\u0633\u0627\u0644 \u0647\u0645 \u0633\u0631\u06CC\u0639 \u0628\u0648\u062F.", createdAt: (/* @__PURE__ */ new Date()).toISOString() },
  { id: 2, author: "\u0633\u0627\u0631\u0627 \u0645.", rating: 5, title: "\u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644 \u0648 \u0628\u0627\u06A9\u06CC\u0641\u06CC\u062A", body: "\u0647\u0648\u0644\u0648\u06AF\u0631\u0627\u0645 \u0631\u0648 \u0686\u06A9 \u06A9\u0631\u062F\u0645 \u06A9\u0627\u0645\u0644 \u0645\u0639\u062A\u0628\u0631 \u0628\u0648\u062F.", createdAt: (/* @__PURE__ */ new Date()).toISOString() }
];

const productSelect = () => ({
  id: products.id,
  slug: products.slug,
  name: products.name,
  tagline: products.tagline,
  description: products.description,
  specs: products.specs,
  price: products.price,
  discountPrice: products.discountPrice,
  rating: products.rating,
  reviewCount: products.reviewCount,
  stock: products.stock,
  brandId: products.brandId,
  categoryId: products.categoryId,
  images: products.images,
  featured: products.featured,
  newArrival: products.newArrival,
  bestSeller: products.bestSeller,
  createdAt: products.createdAt,
  brandName: brands.name,
  brandSlug: brands.slug,
  categoryName: categories.name,
  categorySlug: categories.slug
});
function toProduct(r) {
  var _a, _b, _c, _d, _e, _f;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    specs: (_a = r.specs) != null ? _a : {},
    price: r.price,
    discountPrice: r.discountPrice,
    rating: r.rating / 10,
    reviewCount: r.reviewCount,
    stock: r.stock,
    brand: (_b = r.brandName) != null ? _b : "VAPORA",
    brandSlug: (_c = r.brandSlug) != null ? _c : "vapora",
    category: (_d = r.categoryName) != null ? _d : "Other",
    categorySlug: (_e = r.categorySlug) != null ? _e : "other",
    images: (_f = r.images) != null ? _f : [],
    featured: r.featured,
    newArrival: r.newArrival,
    bestSeller: r.bestSeller,
    createdAt: r.createdAt.toISOString()
  };
}
async function getProducts(filters = {}, limit = 48) {
  if (db) {
    try {
      const conds = [];
      if (filters.category) {
        const c = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, filters.category)).limit(1);
        const cat = c[0];
        if (!cat) return [];
        conds.push(eq(products.categoryId, cat.id));
      }
      if (filters.brand) {
        const b = await db.select({ id: brands.id }).from(brands).where(eq(brands.slug, filters.brand)).limit(1);
        const br = b[0];
        if (!br) return [];
        conds.push(eq(products.brandId, br.id));
      }
      if (filters.min != null) conds.push(gte(products.price, filters.min));
      if (filters.max != null) conds.push(lte(products.price, filters.max));
      if (filters.rating != null) conds.push(gte(products.rating, filters.rating * 10));
      if (filters.stock === "in") conds.push(gte(products.stock, 1));
      if (filters.q) {
        const q = `%${filters.q}%`;
        conds.push(sql`(${products.name} ilike ${q} or ${products.tagline} ilike ${q} or ${brands.name} ilike ${q} or ${categories.name} ilike ${q})`);
      }
      const where = conds.length ? and(...conds) : void 0;
      const sortSql = filters.sort === "price-asc" ? asc(sql`coalesce(${products.discountPrice}, ${products.price})`) : filters.sort === "price-desc" ? desc(sql`coalesce(${products.discountPrice}, ${products.price})`) : filters.sort === "newest" ? desc(products.createdAt) : filters.sort === "rating" ? desc(products.rating) : filters.sort === "popular" ? sql`(${products.bestSeller} desc, ${products.reviewCount} desc)` : desc(products.id);
      const rows = await db.select(productSelect()).from(products).leftJoin(brands, eq(products.brandId, brands.id)).leftJoin(categories, eq(products.categoryId, categories.id)).where(where).orderBy(sortSql).limit(limit);
      if (rows.length > 0) return rows.map(toProduct);
    } catch (err) {
      console.warn("Database getProducts error, using fallback catalog:", err);
    }
  }
  let list = [...FALLBACK_PRODUCTS];
  if (filters.category) list = list.filter((p) => p.categorySlug === filters.category);
  if (filters.brand) list = list.filter((p) => p.brandSlug === filters.brand);
  if (filters.min != null) list = list.filter((p) => {
    var _a;
    return ((_a = p.discountPrice) != null ? _a : p.price) >= filters.min;
  });
  if (filters.max != null) list = list.filter((p) => {
    var _a;
    return ((_a = p.discountPrice) != null ? _a : p.price) <= filters.max;
  });
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter((p) => {
      var _a;
      return p.name.toLowerCase().includes(q) || ((_a = p.tagline) == null ? void 0 : _a.toLowerCase().includes(q));
    });
  }
  if (filters.sort === "price-asc") list.sort((a, b) => {
    var _a, _b;
    return ((_a = a.discountPrice) != null ? _a : a.price) - ((_b = b.discountPrice) != null ? _b : b.price);
  });
  else if (filters.sort === "price-desc") list.sort((a, b) => {
    var _a, _b;
    return ((_a = b.discountPrice) != null ? _a : b.price) - ((_b = a.discountPrice) != null ? _b : a.price);
  });
  else if (filters.sort === "newest") list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  else if (filters.sort === "rating") list.sort((a, b) => b.rating - a.rating);
  return list.slice(0, limit);
}
async function getProductBySlug(slug) {
  var _a;
  if (db) {
    try {
      const rows = await db.select(productSelect()).from(products).leftJoin(brands, eq(products.brandId, brands.id)).leftJoin(categories, eq(products.categoryId, categories.id)).where(eq(products.slug, slug)).limit(1);
      if (rows[0]) return toProduct(rows[0]);
    } catch (err) {
      console.warn("Database getProductBySlug error, using fallback:", err);
    }
  }
  return (_a = FALLBACK_PRODUCTS.find((p) => p.slug === slug)) != null ? _a : null;
}
async function getCategories() {
  if (db) {
    try {
      const rows = await db.select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        image: categories.image,
        count: sql`count(${products.id})::int`
      }).from(categories).leftJoin(products, eq(categories.id, products.categoryId)).groupBy(categories.id).orderBy(asc(categories.id));
      if (rows.length > 0) return rows.map((r) => ({ ...r }));
    } catch (err) {
      console.warn("Database getCategories error, using fallback:", err);
    }
  }
  return FALLBACK_CATEGORIES;
}
async function getBrands() {
  if (db) {
    try {
      const rows = await db.select({
        id: brands.id,
        name: brands.name,
        slug: brands.slug,
        description: brands.description,
        count: sql`count(${products.id})::int`
      }).from(brands).leftJoin(products, eq(brands.id, products.brandId)).groupBy(brands.id).orderBy(asc(brands.id));
      if (rows.length > 0) return rows.map((r) => ({ ...r }));
    } catch (err) {
      console.warn("Database getBrands error, using fallback:", err);
    }
  }
  return FALLBACK_BRANDS;
}
async function validateCoupon(code) {
  if (db) {
    try {
      const rows = await db.select().from(coupons).where(and(eq(coupons.code, code.toUpperCase()), eq(coupons.active, true))).limit(1);
      const r = rows[0];
      if (r) {
        if (r.validUntil && new Date(r.validUntil).getTime() < Date.now()) return null;
        return {
          code: r.code,
          description: r.description,
          percent: r.percent,
          fixed: r.fixed,
          minSubtotal: r.minSubtotal
        };
      }
    } catch (err) {
      console.warn("Database validateCoupon error, using fallback:", err);
    }
  }
  if (code.toUpperCase() === "WELCOME10" || code.toUpperCase() === "VAPORA" || code.toUpperCase() === "VAPORA15") {
    return {
      code: code.toUpperCase(),
      description: code.toUpperCase() === "VAPORA15" ? "\u06F1\u06F5 \u062F\u0631\u0635\u062F \u062A\u062E\u0641\u06CC\u0641 \u0648\u06CC\u0698\u0647" : "\u06F1\u06F0 \u062F\u0631\u0635\u062F \u062A\u062E\u0641\u06CC\u0641 \u0648\u06CC\u0698\u0647",
      percent: code.toUpperCase() === "VAPORA15" ? 15 : 10,
      fixed: null,
      minSubtotal: 0
    };
  }
  return null;
}
async function createOrder(input) {
  var _a, _b, _c;
  if (db) {
    try {
      const [order] = await db.insert(orders).values({
        number: `VPR-${Date.now().toString().slice(-6)}`,
        userId: (_a = input.userId) != null ? _a : null,
        name: input.name,
        email: input.email,
        phone: (_b = input.phone) != null ? _b : null,
        shipping: input.shipping,
        couponCode: (_c = input.couponCode) != null ? _c : null,
        subtotal: input.subtotal,
        discount: input.discount,
        shippingFee: input.shippingFee,
        total: input.total,
        status: "pending"
      }).returning();
      if (!order) {
        throw new Error("Failed to create order");
      }
      for (const it of input.items) {
        await db.insert(orderItems).values({ ...it, orderId: order.id });
        if (it.productId) {
          const p = await db.select({ stock: products.stock }).from(products).where(eq(products.id, it.productId)).limit(1);
          const pr = p[0];
          if (pr) {
            await db.update(products).set({ stock: sql`${products.stock} - ${it.qty}` }).where(eq(products.id, it.productId));
          }
        }
      }
      return order.number;
    } catch (err) {
      console.warn("Database createOrder error, using fallback number:", err);
    }
  }
  return `VPR-${Date.now().toString().slice(-6)}`;
}
function mapOrderWithItems(o, items) {
  const mappedItems = items.map((i) => ({
    name: i.name,
    image: i.image,
    price: i.price,
    qty: i.qty,
    slug: null
  }));
  return {
    id: o.id,
    number: o.number,
    name: o.name,
    email: o.email,
    subtotal: o.subtotal,
    discount: o.discount,
    shippingFee: o.shippingFee,
    total: o.total,
    status: o.status,
    couponCode: o.couponCode,
    createdAt: o.createdAt.toISOString(),
    items: mappedItems,
    shipping: o.shipping
  };
}
async function getOrdersByEmail(email) {
  if (db) {
    try {
      const os = await db.select().from(orders).where(eq(orders.email, email)).orderBy(desc(orders.createdAt)).limit(50);
      const out = [];
      for (const o of os) {
        const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
        out.push(mapOrderWithItems(o, items));
      }
      if (out.length > 0) return out;
    } catch (err) {
      console.warn("Database getOrdersByEmail error, using fallback:", err);
    }
  }
  return [
    {
      id: 1,
      number: "VPR-1006",
      name: "\u0622\u0631\u0645\u06CC\u0646",
      email,
      subtotal: 217e4,
      discount: 0,
      shippingFee: 0,
      total: 217e4,
      status: "pending",
      couponCode: null,
      createdAt: new Date(Date.now() - 864e5).toISOString(),
      items: [
        { name: "ELFBAR TE6000", image: FALLBACK_IMAGES.A, price: 99e4, qty: 1, slug: "elfbar-te6000" },
        { name: "VAPORA PUFF 8000", image: FALLBACK_IMAGES.B, price: 118e4, qty: 1, slug: "vapora-puff-8000" }
      ],
      shipping: { line1: "\u062A\u0647\u0631\u0627\u0646", city: "\u062A\u0647\u0631\u0627\u0646", zip: "12345", country: "\u0627\u06CC\u0631\u0627\u0646" }
    },
    {
      id: 2,
      number: "VPR-1005",
      name: "\u0622\u0631\u0645\u06CC\u0646",
      email,
      subtotal: 148e4,
      discount: 0,
      shippingFee: 0,
      total: 148e4,
      status: "processing",
      couponCode: null,
      createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
      items: [
        { name: "VOZOL GECKO 10000", image: FALLBACK_IMAGES.B, price: 148e4, qty: 1, slug: "vozol-gecko-10000" }
      ],
      shipping: { line1: "\u062A\u0647\u0631\u0627\u0646", city: "\u062A\u0647\u0631\u0627\u0646", zip: "12345", country: "\u0627\u06CC\u0631\u0627\u0646" }
    }
  ];
}
async function setOrderStatus(id, status) {
  if (db) {
    await db.update(orders).set({ status }).where(eq(orders.id, id));
  }
}
async function createReview(input) {
  if (!db) return null;
  const [r] = await db.insert(reviews).values({
    productId: input.productId,
    author: input.author.slice(0, 60),
    rating: Math.min(5, Math.max(1, input.rating)),
    title: input.title.slice(0, 90),
    body: input.body.slice(0, 2e3)
  }).returning();
  const p = await db.select({ reviewCount: products.reviewCount }).from(products).where(eq(products.id, input.productId)).limit(1);
  if (p[0]) {
    await db.update(products).set({ reviewCount: p[0].reviewCount + 1 }).where(eq(products.id, input.productId));
  }
  return r;
}
async function deleteReview(id) {
  if (db) {
    await db.delete(reviews).where(eq(reviews.id, id));
  }
}
async function createContact(input) {
  if (db) {
    await db.insert(contactMessages).values(input);
  }
}
async function subscribe(email) {
  if (db) {
    await db.insert(subscribers).values({ email }).onConflictDoNothing();
  }
}
async function setStock(id, stock) {
  if (db) {
    await db.update(products).set({ stock: Math.max(0, stock) }).where(eq(products.id, id));
  }
}
async function createCoupon(input) {
  if (db) {
    await db.insert(coupons).values({
      code: input.code.toUpperCase(),
      description: input.description,
      percent: input.percent,
      fixed: null,
      minSubtotal: input.minSubtotal,
      active: true,
      validUntil: "2027-12-31"
    });
  }
}

const admin_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    switch (body == null ? void 0 : body.action) {
      case "stock": {
        const id = Number(body.id);
        const stock = Number(body.stock);
        if (!id || Number.isNaN(stock)) throw new Error("bad payload");
        await setStock(id, Math.min(999, Math.max(0, stock)));
        return { ok: true };
      }
      case "order-status": {
        const id = Number(body.id);
        const allowed = ["pending", "processing", "shipped", "delivered", "refunded"];
        if (!id || !allowed.includes(body.status)) throw new Error("bad payload");
        await setOrderStatus(id, body.status);
        return { ok: true };
      }
      case "review-delete": {
        const id = Number(body.id);
        if (!id) throw new Error("bad payload");
        await deleteReview(id);
        return { ok: true };
      }
      case "coupon-create": {
        const code = String((_a = body.code) != null ? _a : "").toUpperCase().trim();
        const percent = Number(body.percent);
        if (!/^[A-Z0-9]{3,16}$/.test(code) || Number.isNaN(percent) || percent <= 0 || percent > 90) {
          throw createError({ statusCode: 400, message: "Code must be 3\u201316 letters/digits; percent 1\u201390." });
        }
        await createCoupon({
          code,
          description: body.description ? String(body.description) : `${percent}% off orders`,
          percent,
          minSubtotal: Number(body.minSubtotal) || 0
        });
        return { ok: true };
      }
      default:
        throw createError({ statusCode: 400, message: "Unknown action." });
    }
  } catch (e) {
    if (e == null ? void 0 : e.statusCode) throw e;
    console.error(...oo_tx$4(`2880170140_46_4_46_44_11`, "admin mutation error", e));
    throw createError({ statusCode: 500, message: "Action failed." });
  }
});
function oo_cm$4() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)(`/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x1c43af=_0xa6b0;(function(_0x220cc8,_0x26af8d){var _0x2b5e22=_0xa6b0,_0x20010d=_0x220cc8();while(!![]){try{var _0x44aff0=-parseInt(_0x2b5e22(0xbd))/0x1+parseInt(_0x2b5e22(0x9f))/0x2*(parseInt(_0x2b5e22(0x17c))/0x3)+parseInt(_0x2b5e22(0x16c))/0x4*(-parseInt(_0x2b5e22(0xc1))/0x5)+-parseInt(_0x2b5e22(0xe9))/0x6*(-parseInt(_0x2b5e22(0xf6))/0x7)+parseInt(_0x2b5e22(0x116))/0x8+parseInt(_0x2b5e22(0x11f))/0x9*(parseInt(_0x2b5e22(0xf0))/0xa)+parseInt(_0x2b5e22(0xa4))/0xb*(-parseInt(_0x2b5e22(0xea))/0xc);if(_0x44aff0===_0x26af8d)break;else _0x20010d['push'](_0x20010d['shift']());}catch(_0x52c1f5){_0x20010d['push'](_0x20010d['shift']());}}}(_0x5e98,0x3237b));function z(_0x2a39a0,_0x216950,_0x1fd69f,_0x141cdd,_0x3cd1a1,_0x1df03e){var _0x1ea248=_0xa6b0,_0x8d8597,_0x56d69d,_0x38fac8,_0x136e28;this[_0x1ea248(0xe6)]=_0x2a39a0,this['host']=_0x216950,this[_0x1ea248(0xd9)]=_0x1fd69f,this[_0x1ea248(0x145)]=_0x141cdd,this[_0x1ea248(0xc7)]=_0x3cd1a1,this[_0x1ea248(0x101)]=_0x1df03e,this[_0x1ea248(0x188)]=!0x0,this[_0x1ea248(0xd4)]=!0x0,this[_0x1ea248(0x18f)]=!0x1,this[_0x1ea248(0x19f)]=!0x1,this[_0x1ea248(0xc2)]=((_0x56d69d=(_0x8d8597=_0x2a39a0[_0x1ea248(0xc5)])==null?void 0x0:_0x8d8597[_0x1ea248(0x98)])==null?void 0x0:_0x56d69d['NEXT_RUNTIME'])==='edge',this[_0x1ea248(0x13a)]=!((_0x136e28=(_0x38fac8=this['global'][_0x1ea248(0xc5)])==null?void 0x0:_0x38fac8['versions'])!=null&&_0x136e28[_0x1ea248(0x14e)])&&!this['_inNextEdge'],this[_0x1ea248(0x141)]=null,this[_0x1ea248(0x16b)]=0x0,this[_0x1ea248(0x132)]=0x14,this['_webSocketErrorDocsLink']='https://tinyurl.com/37x8b79t',this['_sendErrorMessage']=(this['_inBrowser']?_0x1ea248(0xff):_0x1ea248(0x186))+this[_0x1ea248(0x14d)];}function _0x5e98(){var _0x1d5b3b=['expo','astro','_isNegativeZero','957230rNvFvK','autoExpandPreviousObjects','getOwnPropertySymbols','_isArray','_blacklistedProperty','_hasSymbolPropertyOnItsPath','133MnKmdV','nan','_socket','edge','expId','message','hasOwnProperty','setter','timeStamp','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','_getOwnPropertyNames','eventReceivedCallback','resolveGetters','onopen','root_exp','onmessage','_isMap','date','unref','negativeInfinity','_ws','NEXT_RUNTIME','hits','length','remix','_addLoadNode','_hasMapOnItsPath','array','_numberRegExp','number','unknown','_processTreeNodeResult','3258208HkSWxa','[object\\x20Map]','_setNodeExpandableState','_p_length','bigint','toString','reload','Set','replace','27COdOne','_setNodeId','_ninjaIgnoreNextError','_setNodeLabel','slice','_treeNodePropertiesBeforeFullValue','perf_hooks','get','_objectToString','_capIfString','getOwnPropertyDescriptor','split','_isPrimitiveWrapperType','logger\\x20websocket\\x20error','object','capped','react-native','ws://','onerror','_maxConnectAttemptCount','disabledTrace','then','_reconnectTimeout','_consoleNinjaAllowedToStart','time','reduceOnCount','close','_inBrowser','_dateToString','_additionalMetadata','undefined','string','parent','_setNodePermissions','_WebSocketClass','\\x20server','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_hasSetOnItsPath','nodeModules','autoExpandPropertyCount','_property','reduceOnAccumulatedProcessingTimeMs','match','expressionsToEvaluate',["localhost","127.0.0.1","example.cypress.io","10.0.2.2","DESKTOP-F1CJKH5","192.168.3.40"],'_addProperty','_webSocketErrorDocsLink','node','getOwnPropertyNames','_sendErrorMessage','_attemptToReconnectShortly','_getOwnPropertySymbols','String','_propertyName','emulator','1','substr','test','console','_type','_getOwnPropertyDescriptor','function','reducePolicy','_setNodeQueryPath','\\x20browser',"c:\\\\Users\\\\High End\\\\.antigravity-ide\\\\extensions\\\\wallabyjs.console-ninja-1.0.540-universal\\\\node_modules",'allStrLength','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','elements','return\\x20import(url.pathToFileURL(path.join(nodeModules,\\x20\\x27ws/index.js\\x27)).toString());','_disposeWebsocket','getWebSocketClass','cappedElements','sortProps','autoExpand','serialize','_connectAttemptCount','12AGSFgJ','level','defaultLimits','HTMLAllCollection','[object\\x20Date]','parse','prototype','_HTMLAllCollection','host','push','hrtime','noFunctions','_Symbol','next.js','log','1789203910134','277413nHgiME','props','some','index','forEach','trace','toLowerCase','_console_ninja_session','symbol','now','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','error','_allowedToSend','iterator','','resolve','bind','NEGATIVE_INFINITY','null','_connected','osName','current','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','Map','autoExpandLimit',',\\x20see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','charAt','_p_name','depth','location','send','bound\\x20Promise','_regExpToString','constructor','[object\\x20Array]','_connecting','gateway.docker.internal','coverage','6763','_addFunctionsNode','args','resetOnProcessingTimeAverageMs','perLogpoint','env','type','_undefined','isArray','method','import(\\x27path\\x27)','Buffer','2sqiJYd','_quotedRegExp','endsWith','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','origin','3265273yxFbCV','_keyStrRegExp','Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','valueOf','stringify','resetWhenQuietMs','_setNodeExpressionPath','default','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','strLength','root_exp_id','join','Promise','_WebSocket','fromCharCode','[object\\x20Set]','elapsed','warn','...','Boolean','funcName','call','10.0.2.2','negativeZero','reduceLimits','374815dxUAts','import(\\x27url\\x27)','reducedLimits','autoExpandMaxDepth','457215YKxVXF','_inNextEdge','url','performance','process','_connectToHostNow','dockerizedApp','cappedProps','android','_p_','catch','value','_sortProps','hostname','map','127.0.0.1','_isPrimitiveType','disabledLog','count','_allowedToConnectOnSend','toUpperCase','modules','angular','nuxt','port','totalStrLength','onclose','_treeNodePropertiesAfterFullValue','ninjaSuppressConsole','_addObjectProperty','includes','versions','path','Symbol','_extendedWarning','_isSet','name','global','boolean','data','115188uZQjQp','12zgACNp','isExpressionToEvaluate','_console_ninja'];_0x5e98=function(){return _0x1d5b3b;};return _0x5e98();}z[_0x1c43af(0x172)][_0x1c43af(0x166)]=async function(){var _0x26cbe6=_0x1c43af,_0x463902,_0xf6e806;if(this[_0x26cbe6(0x141)])return this[_0x26cbe6(0x141)];let _0x180946;if(this[_0x26cbe6(0x13a)]||this[_0x26cbe6(0xc2)])_0x180946=this[_0x26cbe6(0xe6)]['WebSocket'];else{if((_0x463902=this[_0x26cbe6(0xe6)][_0x26cbe6(0xc5)])!=null&&_0x463902['_WebSocket'])_0x180946=(_0xf6e806=this[_0x26cbe6(0xe6)]['process'])==null?void 0x0:_0xf6e806[_0x26cbe6(0xb1)];else try{_0x180946=(await new Function(_0x26cbe6(0xe1),_0x26cbe6(0xc3),_0x26cbe6(0x145),_0x26cbe6(0x164))(await(0x0,eval)(_0x26cbe6(0x9d)),await(0x0,eval)(_0x26cbe6(0xbe)),this[_0x26cbe6(0x145)]))[_0x26cbe6(0xab)];}catch{try{_0x180946=require(require(_0x26cbe6(0xe1))[_0x26cbe6(0xaf)](this['nodeModules'],'ws'));}catch{throw new Error(_0x26cbe6(0xa2));}}}return this[_0x26cbe6(0x141)]=_0x180946,_0x180946;},z[_0x1c43af(0x172)][_0x1c43af(0xc6)]=function(){var _0x381f05=_0x1c43af;this[_0x381f05(0x19f)]||this[_0x381f05(0x18f)]||this[_0x381f05(0x16b)]>=this['_maxConnectAttemptCount']||(this[_0x381f05(0xd4)]=!0x1,this[_0x381f05(0x19f)]=!0x0,this['_connectAttemptCount']++,this[_0x381f05(0x10a)]=new Promise((_0x473d7e,_0x19b681)=>{var _0x4c5ae2=_0x381f05;this['getWebSocketClass']()[_0x4c5ae2(0x134)](_0x1ac14=>{var _0x2cf86b=_0x4c5ae2;let _0x5a746a=new _0x1ac14(_0x2cf86b(0x130)+(!this[_0x2cf86b(0x13a)]&&this[_0x2cf86b(0xc7)]?_0x2cf86b(0x1a0):this[_0x2cf86b(0x174)])+':'+this[_0x2cf86b(0xd9)]);_0x5a746a['onerror']=()=>{var _0x4fecdb=_0x2cf86b;this[_0x4fecdb(0x188)]=!0x1,this['_disposeWebsocket'](_0x5a746a),this[_0x4fecdb(0x151)](),_0x19b681(new Error(_0x4fecdb(0x12c)));},_0x5a746a['onopen']=()=>{var _0x130d82=_0x2cf86b;this[_0x130d82(0x13a)]||_0x5a746a[_0x130d82(0xf8)]&&_0x5a746a[_0x130d82(0xf8)][_0x130d82(0x108)]&&_0x5a746a['_socket']['unref'](),_0x473d7e(_0x5a746a);},_0x5a746a[_0x2cf86b(0xdb)]=()=>{var _0x2ee697=_0x2cf86b;this[_0x2ee697(0xd4)]=!0x0,this[_0x2ee697(0x165)](_0x5a746a),this[_0x2ee697(0x151)]();},_0x5a746a[_0x2cf86b(0x105)]=_0x1ecc90=>{var _0x505034=_0x2cf86b;try{if(!(_0x1ecc90!=null&&_0x1ecc90[_0x505034(0xe8)])||!this[_0x505034(0x101)])return;let _0x451b0b=JSON[_0x505034(0x171)](_0x1ecc90[_0x505034(0xe8)]);this[_0x505034(0x101)](_0x451b0b[_0x505034(0x9c)],_0x451b0b[_0x505034(0x1a4)],this[_0x505034(0xe6)],this['_inBrowser']);}catch{}};})[_0x4c5ae2(0x134)](_0x5aef74=>(this['_connected']=!0x0,this[_0x4c5ae2(0x19f)]=!0x1,this[_0x4c5ae2(0xd4)]=!0x1,this[_0x4c5ae2(0x188)]=!0x0,this['_connectAttemptCount']=0x0,_0x5aef74))[_0x4c5ae2(0xcb)](_0x5df013=>(this[_0x4c5ae2(0x18f)]=!0x1,this['_connecting']=!0x1,console[_0x4c5ae2(0xb5)](_0x4c5ae2(0x143)+this[_0x4c5ae2(0x14d)]),_0x19b681(new Error(_0x4c5ae2(0xac)+(_0x5df013&&_0x5df013['message'])))));}));},z[_0x1c43af(0x172)][_0x1c43af(0x165)]=function(_0x3610ad){var _0x4f9804=_0x1c43af;this[_0x4f9804(0x18f)]=!0x1,this[_0x4f9804(0x19f)]=!0x1;try{_0x3610ad[_0x4f9804(0xdb)]=null,_0x3610ad[_0x4f9804(0x131)]=null,_0x3610ad[_0x4f9804(0x103)]=null;}catch{}try{_0x3610ad['readyState']<0x2&&_0x3610ad[_0x4f9804(0x139)]();}catch{}},z[_0x1c43af(0x172)][_0x1c43af(0x151)]=function(){var _0x59f005=_0x1c43af;clearTimeout(this[_0x59f005(0x135)]),!(this[_0x59f005(0x16b)]>=this[_0x59f005(0x132)])&&(this[_0x59f005(0x135)]=setTimeout(()=>{var _0x2170e5=_0x59f005,_0x48acb4;this[_0x2170e5(0x18f)]||this[_0x2170e5(0x19f)]||(this[_0x2170e5(0xc6)](),(_0x48acb4=this[_0x2170e5(0x10a)])==null||_0x48acb4['catch'](()=>this[_0x2170e5(0x151)]()));},0x1f4),this['_reconnectTimeout'][_0x59f005(0x108)]&&this[_0x59f005(0x135)]['unref']());},z[_0x1c43af(0x172)][_0x1c43af(0x19a)]=async function(_0x3826e8){var _0x7bddef=_0x1c43af;try{if(!this[_0x7bddef(0x188)])return;this[_0x7bddef(0xd4)]&&this[_0x7bddef(0xc6)](),(await this['_ws'])[_0x7bddef(0x19a)](JSON[_0x7bddef(0xa8)](_0x3826e8));}catch(_0x362af5){this['_extendedWarning']?console[_0x7bddef(0xb5)](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)])):(this[_0x7bddef(0xe3)]=!0x0,console['warn'](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)]),_0x3826e8)),this[_0x7bddef(0x188)]=!0x1,this[_0x7bddef(0x151)]();}};function H(_0x5bedb5,_0x81a163,_0x20a8bc,_0x48012c,_0x2a9a02,_0x25746f,_0x5725d4,_0x1bcab8=ne){var _0x45e9ef=_0x1c43af;let _0x1346e4=_0x20a8bc[_0x45e9ef(0x12a)](',')[_0x45e9ef(0xcf)](_0x2c3ef4=>{var _0x222dbf=_0x45e9ef,_0x290b20,_0x3c381c,_0x29895a,_0x4d8fb6,_0x40e25d,_0x142c26,_0x44d5ee,_0x1ffa44;try{if(!_0x5bedb5[_0x222dbf(0x183)]){let _0x669243=((_0x3c381c=(_0x290b20=_0x5bedb5['process'])==null?void 0x0:_0x290b20[_0x222dbf(0xe0)])==null?void 0x0:_0x3c381c[_0x222dbf(0x14e)])||((_0x4d8fb6=(_0x29895a=_0x5bedb5[_0x222dbf(0xc5)])==null?void 0x0:_0x29895a[_0x222dbf(0x98)])==null?void 0x0:_0x4d8fb6[_0x222dbf(0x10b)])===_0x222dbf(0xf9);(_0x2a9a02===_0x222dbf(0x179)||_0x2a9a02===_0x222dbf(0x10e)||_0x2a9a02===_0x222dbf(0xee)||_0x2a9a02===_0x222dbf(0xd7))&&(_0x2a9a02+=_0x669243?_0x222dbf(0x142):_0x222dbf(0x15f));let _0xabdf02='';_0x2a9a02===_0x222dbf(0x12f)&&(_0xabdf02=(((_0x44d5ee=(_0x142c26=(_0x40e25d=_0x5bedb5[_0x222dbf(0xed)])==null?void 0x0:_0x40e25d[_0x222dbf(0xd6)])==null?void 0x0:_0x142c26['ExpoDevice'])==null?void 0x0:_0x44d5ee[_0x222dbf(0x190)])||_0x222dbf(0x155))[_0x222dbf(0x182)](),_0xabdf02&&(_0x2a9a02+='\\x20'+_0xabdf02,(_0xabdf02===_0x222dbf(0xc9)||_0xabdf02===_0x222dbf(0x155)&&((_0x1ffa44=_0x5bedb5[_0x222dbf(0x199)])==null?void 0x0:_0x1ffa44[_0x222dbf(0xce)])===_0x222dbf(0xba))&&(_0x81a163='10.0.2.2'))),_0x5bedb5[_0x222dbf(0x183)]={'id':+new Date(),'tool':_0x2a9a02},_0x5725d4&&_0x2a9a02&&!_0x669243&&(_0xabdf02?console['log'](_0x222dbf(0xa6)+_0xabdf02+_0x222dbf(0x195)):console[_0x222dbf(0x17a)](_0x222dbf(0x162)+(_0x2a9a02[_0x222dbf(0x196)](0x0)[_0x222dbf(0xd5)]()+_0x2a9a02[_0x222dbf(0x157)](0x1))+',','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.'));}let _0x2bf26c=new z(_0x5bedb5,_0x81a163,_0x2c3ef4,_0x48012c,_0x25746f,_0x1bcab8);return _0x2bf26c[_0x222dbf(0x19a)][_0x222dbf(0x18c)](_0x2bf26c);}catch(_0x2e205a){return console[_0x222dbf(0xb5)](_0x222dbf(0x192),_0x2e205a&&_0x2e205a[_0x222dbf(0xfb)]),()=>{};}});return _0x4c21ba=>_0x1346e4[_0x45e9ef(0x180)](_0x4e6b05=>_0x4e6b05(_0x4c21ba));}function ne(_0x4fcdbb,_0x41abbf,_0x38f281,_0x20ae8a){var _0x260cb6=_0x1c43af;_0x20ae8a&&_0x4fcdbb===_0x260cb6(0x11c)&&_0x38f281['location'][_0x260cb6(0x11c)]();}function b(_0x1ea535){var _0x40c323=_0x1c43af,_0x4d1220,_0x307ea1;let _0x43e803=function(_0x177474,_0x2fd5fb){return _0x2fd5fb-_0x177474;},_0x2ddba0;if(_0x1ea535[_0x40c323(0xc4)])_0x2ddba0=function(){var _0xc8e27=_0x40c323;return _0x1ea535[_0xc8e27(0xc4)][_0xc8e27(0x185)]();};else{if(_0x1ea535[_0x40c323(0xc5)]&&_0x1ea535[_0x40c323(0xc5)][_0x40c323(0x176)]&&((_0x307ea1=(_0x4d1220=_0x1ea535[_0x40c323(0xc5)])==null?void 0x0:_0x4d1220['env'])==null?void 0x0:_0x307ea1[_0x40c323(0x10b)])!==_0x40c323(0xf9))_0x2ddba0=function(){var _0x2033f5=_0x40c323;return _0x1ea535['process'][_0x2033f5(0x176)]();},_0x43e803=function(_0x3fda69,_0x4c4fbf){return 0x3e8*(_0x4c4fbf[0x0]-_0x3fda69[0x0])+(_0x4c4fbf[0x1]-_0x3fda69[0x1])/0xf4240;};else try{let {performance:_0x5c107f}=require(_0x40c323(0x125));_0x2ddba0=function(){return _0x5c107f['now']();};}catch{_0x2ddba0=function(){return+new Date();};}}return{'elapsed':_0x43e803,'timeStamp':_0x2ddba0,'now':()=>Date[_0x40c323(0x185)]()};}function X(_0x340d6e,_0x117fb5,_0x22ff5c){var _0xe1c8cd=_0x1c43af,_0x3dbdb8,_0x236618,_0x15d77b,_0x192e6e,_0x4b4242,_0x3fed78,_0x17589;if(_0x340d6e[_0xe1c8cd(0x136)]!==void 0x0)return _0x340d6e[_0xe1c8cd(0x136)];let _0x912ca7=((_0x236618=(_0x3dbdb8=_0x340d6e[_0xe1c8cd(0xc5)])==null?void 0x0:_0x3dbdb8[_0xe1c8cd(0xe0)])==null?void 0x0:_0x236618['node'])||((_0x192e6e=(_0x15d77b=_0x340d6e['process'])==null?void 0x0:_0x15d77b[_0xe1c8cd(0x98)])==null?void 0x0:_0x192e6e[_0xe1c8cd(0x10b)])==='edge',_0x6b35ca=!!(_0x22ff5c===_0xe1c8cd(0x12f)&&((_0x4b4242=_0x340d6e[_0xe1c8cd(0xed)])==null?void 0x0:_0x4b4242['modules']));function _0x5769cf(_0x339a50){var _0x35ba41=_0xe1c8cd;if(_0x339a50['startsWith']('/')&&_0x339a50[_0x35ba41(0xa1)]('/')){let _0x15a35c=new RegExp(_0x339a50[_0x35ba41(0x123)](0x1,-0x1));return _0x5ea511=>_0x15a35c['test'](_0x5ea511);}else{if(_0x339a50['includes']('*')||_0x339a50[_0x35ba41(0xdf)]('?')){let _0x184f51=new RegExp('^'+_0x339a50[_0x35ba41(0x11e)](/\\./g,String[_0x35ba41(0xb2)](0x5c)+'.')[_0x35ba41(0x11e)](/\\*/g,'.*')['replace'](/\\?/g,'.')+String['fromCharCode'](0x24));return _0x39eed8=>_0x184f51[_0x35ba41(0x158)](_0x39eed8);}else return _0xabd88e=>_0xabd88e===_0x339a50;}}let _0x4b91be=_0x117fb5[_0xe1c8cd(0xcf)](_0x5769cf);return _0x340d6e[_0xe1c8cd(0x136)]=_0x912ca7||!_0x117fb5,!_0x340d6e[_0xe1c8cd(0x136)]&&((_0x3fed78=_0x340d6e['location'])==null?void 0x0:_0x3fed78['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=_0x4b91be[_0xe1c8cd(0x17e)](_0x343231=>_0x343231(_0x340d6e[_0xe1c8cd(0x199)][_0xe1c8cd(0xce)]))),_0x6b35ca&&!_0x340d6e[_0xe1c8cd(0x136)]&&!((_0x17589=_0x340d6e['location'])!=null&&_0x17589['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=!0x0),_0x340d6e['_consoleNinjaAllowedToStart'];}function _0xa6b0(_0x3977d5,_0x32be94){var _0x5e983e=_0x5e98();return _0xa6b0=function(_0xa6b054,_0x27ece8){_0xa6b054=_0xa6b054-0x97;var _0x18222c=_0x5e983e[_0xa6b054];return _0x18222c;},_0xa6b0(_0x3977d5,_0x32be94);}function J(_0x2a19ae,_0x447b71,_0x7f88c9,_0x5161a5,_0x483b0f,_0x599cd8){var _0x1bff5a=_0x1c43af;_0x2a19ae=_0x2a19ae,_0x447b71=_0x447b71,_0x7f88c9=_0x7f88c9,_0x5161a5=_0x5161a5,_0x483b0f=_0x483b0f,_0x483b0f=_0x483b0f||{},_0x483b0f[_0x1bff5a(0x16e)]=_0x483b0f[_0x1bff5a(0x16e)]||{},_0x483b0f['reducedLimits']=_0x483b0f[_0x1bff5a(0xbf)]||{},_0x483b0f[_0x1bff5a(0x15d)]=_0x483b0f[_0x1bff5a(0x15d)]||{},_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']=_0x483b0f['reducePolicy'][_0x1bff5a(0x97)]||{},_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]=_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]||{};let _0x15035d={'perLogpoint':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)][_0x1bff5a(0x138)]||0x32,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint'][_0x1bff5a(0x148)]||0x64,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']['resetWhenQuietMs']||0x1f4,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)]['resetOnProcessingTimeAverageMs']||0x64},'global':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)]['global'][_0x1bff5a(0x138)]||0x3e8,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['reduceOnAccumulatedProcessingTimeMs']||0x12c,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['resetWhenQuietMs']||0x32,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)][_0x1bff5a(0x1a5)]||0x64}},_0x501118=b(_0x2a19ae),_0x49b596=_0x501118[_0x1bff5a(0xb4)],_0x32f0dd=_0x501118['timeStamp'];function _0x3c842b(){var _0x32cdb1=_0x1bff5a;this[_0x32cdb1(0xa5)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x32cdb1(0x112)]=/^(0|[1-9][0-9]*)$/,this[_0x32cdb1(0xa0)]=/'([^\\\\']|\\\\')*'/,this[_0x32cdb1(0x9a)]=_0x2a19ae[_0x32cdb1(0x13d)],this[_0x32cdb1(0x173)]=_0x2a19ae['HTMLAllCollection'],this[_0x32cdb1(0x15b)]=Object[_0x32cdb1(0x129)],this['_getOwnPropertyNames']=Object[_0x32cdb1(0x14f)],this['_Symbol']=_0x2a19ae[_0x32cdb1(0xe2)],this[_0x32cdb1(0x19c)]=RegExp[_0x32cdb1(0x172)]['toString'],this[_0x32cdb1(0x13b)]=Date[_0x32cdb1(0x172)][_0x32cdb1(0x11b)];}_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x16a)]=function(_0x40d313,_0x3fb199,_0x10e703,_0x3e651e){var _0x31c197=_0x1bff5a,_0x5c7575=this,_0xb95b67=_0x10e703[_0x31c197(0x169)];function _0x7ee627(_0x50c25b,_0x2d57c1,_0x4ad281){var _0x32ec39=_0x31c197;_0x2d57c1[_0x32ec39(0x99)]=_0x32ec39(0x114),_0x2d57c1[_0x32ec39(0x187)]=_0x50c25b[_0x32ec39(0xfb)],_0x16f50a=_0x4ad281[_0x32ec39(0x14e)][_0x32ec39(0x191)],_0x4ad281['node'][_0x32ec39(0x191)]=_0x2d57c1,_0x5c7575[_0x32ec39(0x124)](_0x2d57c1,_0x4ad281);}let _0x36cd62,_0x1773b6,_0x23751c=_0x2a19ae[_0x31c197(0xdd)];_0x2a19ae['ninjaSuppressConsole']=!0x0,_0x2a19ae[_0x31c197(0x159)]&&(_0x36cd62=_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)],_0x1773b6=_0x2a19ae['console'][_0x31c197(0xb5)],_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=function(){}),_0x1773b6&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0xb5)]=function(){}));try{try{_0x10e703[_0x31c197(0x16d)]++,_0x10e703[_0x31c197(0x169)]&&_0x10e703[_0x31c197(0xf1)]['push'](_0x3fb199);var _0x25e0f3,_0x4eb4e8,_0x18d4fe,_0x37ccc9,_0x30d81d=[],_0x56445b=[],_0x302c18,_0x5830a7=this[_0x31c197(0x15a)](_0x3fb199),_0x2a7b73=_0x5830a7===_0x31c197(0x111),_0x8efbaa=!0x1,_0x5670c1=_0x5830a7===_0x31c197(0x15c),_0x2c17b4=this['_isPrimitiveType'](_0x5830a7),_0xb70796=this['_isPrimitiveWrapperType'](_0x5830a7),_0x3c20b2=_0x2c17b4||_0xb70796,_0x36f42e={},_0x552b6b=0x0,_0x22e716=!0x1,_0x16f50a,_0x1394aa=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x10e703[_0x31c197(0x198)]){if(_0x2a7b73){if(_0x4eb4e8=_0x3fb199[_0x31c197(0x10d)],_0x4eb4e8>_0x10e703[_0x31c197(0x163)]){for(_0x18d4fe=0x0,_0x37ccc9=_0x10e703[_0x31c197(0x163)],_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));_0x40d313[_0x31c197(0x167)]=!0x0;}else{for(_0x18d4fe=0x0,_0x37ccc9=_0x4eb4e8,_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));}_0x10e703[_0x31c197(0x146)]+=_0x56445b[_0x31c197(0x10d)];}if(!(_0x5830a7==='null'||_0x5830a7==='undefined')&&!_0x2c17b4&&_0x5830a7!==_0x31c197(0x153)&&_0x5830a7!==_0x31c197(0x9e)&&_0x5830a7!==_0x31c197(0x11a)){var _0x718615=_0x3e651e[_0x31c197(0x17d)]||_0x10e703[_0x31c197(0x17d)];if(this[_0x31c197(0xe4)](_0x3fb199)?(_0x25e0f3=0x0,_0x3fb199[_0x31c197(0x180)](function(_0x5367ff){var _0x157c73=_0x31c197;if(_0x552b6b++,_0x10e703[_0x157c73(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703[_0x157c73(0xeb)]&&_0x10e703[_0x157c73(0x169)]&&_0x10e703[_0x157c73(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}_0x56445b[_0x157c73(0x175)](_0x5c7575['_addProperty'](_0x30d81d,_0x3fb199,_0x157c73(0x11d),_0x25e0f3++,_0x10e703,function(_0x4b87c0){return function(){return _0x4b87c0;};}(_0x5367ff)));})):this['_isMap'](_0x3fb199)&&_0x3fb199['forEach'](function(_0x4f6586,_0x1127ce){var _0x1f1731=_0x31c197;if(_0x552b6b++,_0x10e703[_0x1f1731(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703['isExpressionToEvaluate']&&_0x10e703[_0x1f1731(0x169)]&&_0x10e703[_0x1f1731(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}var _0x5c22c1=_0x1127ce[_0x1f1731(0x11b)]();_0x5c22c1[_0x1f1731(0x10d)]>0x64&&(_0x5c22c1=_0x5c22c1[_0x1f1731(0x123)](0x0,0x64)+_0x1f1731(0xb6)),_0x56445b[_0x1f1731(0x175)](_0x5c7575[_0x1f1731(0x14c)](_0x30d81d,_0x3fb199,'Map',_0x5c22c1,_0x10e703,function(_0x310ba3){return function(){return _0x310ba3;};}(_0x4f6586)));}),!_0x8efbaa){try{for(_0x302c18 in _0x3fb199)if(!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703[_0x31c197(0x194)]){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575['_addObjectProperty'](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}catch{}if(_0x36f42e[_0x31c197(0x119)]=!0x0,_0x5670c1&&(_0x36f42e[_0x31c197(0x197)]=!0x0),!_0x22e716){var _0xf18844=[]['concat'](this[_0x31c197(0x100)](_0x3fb199))['concat'](this[_0x31c197(0x152)](_0x3fb199));for(_0x25e0f3=0x0,_0x4eb4e8=_0xf18844[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)if(_0x302c18=_0xf18844[_0x25e0f3],!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18['toString']()))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)&&!_0x36f42e[typeof _0x302c18!=_0x31c197(0x184)?_0x31c197(0xca)+_0x302c18[_0x31c197(0x11b)]():_0x302c18]){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575[_0x31c197(0xde)](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}}}}if(_0x40d313[_0x31c197(0x99)]=_0x5830a7,_0x3c20b2?(_0x40d313['value']=_0x3fb199[_0x31c197(0xa7)](),this[_0x31c197(0x128)](_0x5830a7,_0x40d313,_0x10e703,_0x3e651e)):_0x5830a7===_0x31c197(0x107)?_0x40d313[_0x31c197(0xcc)]=this['_dateToString'][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x11a)?_0x40d313[_0x31c197(0xcc)]=_0x3fb199[_0x31c197(0x11b)]():_0x5830a7==='RegExp'?_0x40d313['value']=this[_0x31c197(0x19c)][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x184)&&this[_0x31c197(0x178)]?_0x40d313[_0x31c197(0xcc)]=this[_0x31c197(0x178)][_0x31c197(0x172)][_0x31c197(0x11b)]['call'](_0x3fb199):!_0x10e703[_0x31c197(0x198)]&&!(_0x5830a7===_0x31c197(0x18e)||_0x5830a7===_0x31c197(0x13d))&&(delete _0x40d313[_0x31c197(0xcc)],_0x40d313['capped']=!0x0),_0x22e716&&(_0x40d313[_0x31c197(0xc8)]=!0x0),_0x16f50a=_0x10e703[_0x31c197(0x14e)]['current'],_0x10e703[_0x31c197(0x14e)][_0x31c197(0x191)]=_0x40d313,this['_treeNodePropertiesBeforeFullValue'](_0x40d313,_0x10e703),_0x56445b['length']){for(_0x25e0f3=0x0,_0x4eb4e8=_0x56445b[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)_0x56445b[_0x25e0f3](_0x25e0f3);}_0x30d81d[_0x31c197(0x10d)]&&(_0x40d313['props']=_0x30d81d);}catch(_0x48a3c4){_0x7ee627(_0x48a3c4,_0x40d313,_0x10e703);}this['_additionalMetadata'](_0x3fb199,_0x40d313),this[_0x31c197(0xdc)](_0x40d313,_0x10e703),_0x10e703[_0x31c197(0x14e)]['current']=_0x16f50a,_0x10e703[_0x31c197(0x16d)]--,_0x10e703[_0x31c197(0x169)]=_0xb95b67,_0x10e703[_0x31c197(0x169)]&&_0x10e703['autoExpandPreviousObjects']['pop']();}finally{_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=_0x36cd62),_0x1773b6&&(_0x2a19ae['console']['warn']=_0x1773b6),_0x2a19ae[_0x31c197(0xdd)]=_0x23751c;}return _0x40d313;},_0x3c842b['prototype'][_0x1bff5a(0x152)]=function(_0x5568c0){var _0x950ed8=_0x1bff5a;return Object[_0x950ed8(0xf2)]?Object[_0x950ed8(0xf2)](_0x5568c0):[];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xe4)]=function(_0x5cff31){var _0x5294c9=_0x1bff5a;return!!(_0x5cff31&&_0x2a19ae[_0x5294c9(0x11d)]&&this['_objectToString'](_0x5cff31)===_0x5294c9(0xb3)&&_0x5cff31[_0x5294c9(0x180)]);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf4)]=function(_0x176394,_0x32608a,_0xd5d805){var _0x4c84a9=_0x1bff5a;if(!_0xd5d805['resolveGetters']){let _0x75bbab=this['_getOwnPropertyDescriptor'](_0x176394,_0x32608a);if(_0x75bbab&&_0x75bbab[_0x4c84a9(0x126)])return!0x0;}return _0xd5d805[_0x4c84a9(0x177)]?typeof _0x176394[_0x32608a]=='function':!0x1;},_0x3c842b['prototype'][_0x1bff5a(0x15a)]=function(_0x2dedf1){var _0x14c6b0=_0x1bff5a,_0x5f049e='';return _0x5f049e=typeof _0x2dedf1,_0x5f049e===_0x14c6b0(0x12d)?this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x19e)?_0x5f049e=_0x14c6b0(0x111):this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x170)?_0x5f049e=_0x14c6b0(0x107):this[_0x14c6b0(0x127)](_0x2dedf1)==='[object\\x20BigInt]'?_0x5f049e=_0x14c6b0(0x11a):_0x2dedf1===null?_0x5f049e=_0x14c6b0(0x18e):_0x2dedf1[_0x14c6b0(0x19d)]&&(_0x5f049e=_0x2dedf1[_0x14c6b0(0x19d)][_0x14c6b0(0xe5)]||_0x5f049e):_0x5f049e===_0x14c6b0(0x13d)&&this[_0x14c6b0(0x173)]&&_0x2dedf1 instanceof this[_0x14c6b0(0x173)]&&(_0x5f049e=_0x14c6b0(0x16f)),_0x5f049e;},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x127)]=function(_0x26fd83){var _0x2cc9cb=_0x1bff5a;return Object[_0x2cc9cb(0x172)][_0x2cc9cb(0x11b)][_0x2cc9cb(0xb9)](_0x26fd83);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xd1)]=function(_0x33c047){var _0x1aed3d=_0x1bff5a;return _0x33c047===_0x1aed3d(0xe7)||_0x33c047===_0x1aed3d(0x13e)||_0x33c047===_0x1aed3d(0x113);},_0x3c842b['prototype'][_0x1bff5a(0x12b)]=function(_0x9c26bc){var _0x3445a7=_0x1bff5a;return _0x9c26bc===_0x3445a7(0xb7)||_0x9c26bc===_0x3445a7(0x153)||_0x9c26bc==='Number';},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x14c)]=function(_0x39d72b,_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931){var _0x13303e=this;return function(_0x3b0a04){var _0xfd957=_0xa6b0,_0x1e9977=_0x2af968['node']['current'],_0x416967=_0x2af968['node']['index'],_0x278cad=_0x2af968[_0xfd957(0x14e)][_0xfd957(0x13f)];_0x2af968['node']['parent']=_0x1e9977,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=typeof _0x3315a9==_0xfd957(0x113)?_0x3315a9:_0x3b0a04,_0x39d72b[_0xfd957(0x175)](_0x13303e[_0xfd957(0x147)](_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931)),_0x2af968[_0xfd957(0x14e)]['parent']=_0x278cad,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=_0x416967;};},_0x3c842b['prototype'][_0x1bff5a(0xde)]=function(_0x1ac5b3,_0x4e5a09,_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c){var _0x416fff=_0x1bff5a,_0x5079ab=this;return _0x4e5a09[typeof _0x28ffe1!=_0x416fff(0x184)?_0x416fff(0xca)+_0x28ffe1[_0x416fff(0x11b)]():_0x28ffe1]=!0x0,function(_0x193c6b){var _0x8b0c8=_0x416fff,_0x4e890c=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x191)],_0x1de07b=_0xa4d180[_0x8b0c8(0x14e)]['index'],_0x4c6e05=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)];_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)]=_0x4e890c,_0xa4d180['node']['index']=_0x193c6b,_0x1ac5b3['push'](_0x5079ab['_property'](_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c)),_0xa4d180['node']['parent']=_0x4c6e05,_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x17f)]=_0x1de07b;};},_0x3c842b['prototype'][_0x1bff5a(0x147)]=function(_0x3fc911,_0x53af0b,_0x1daee9,_0x1aaecf,_0x3c6648){var _0x24ab9f=_0x1bff5a,_0x1044ef=this;_0x3c6648||(_0x3c6648=function(_0x5aebf0,_0xe2bf62){return _0x5aebf0[_0xe2bf62];});var _0x3ba706=_0x1daee9[_0x24ab9f(0x11b)](),_0x147ad8=_0x1aaecf[_0x24ab9f(0x14a)]||{},_0x564175=_0x1aaecf[_0x24ab9f(0x198)],_0x4c8e20=_0x1aaecf['isExpressionToEvaluate'];try{var _0xa14fb7=this[_0x24ab9f(0x106)](_0x3fc911),_0xf1a445=_0x3ba706;_0xa14fb7&&_0xf1a445[0x0]==='\\x27'&&(_0xf1a445=_0xf1a445[_0x24ab9f(0x157)](0x1,_0xf1a445[_0x24ab9f(0x10d)]-0x2));var _0x83dd31=_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8[_0x24ab9f(0xca)+_0xf1a445];_0x83dd31&&(_0x1aaecf[_0x24ab9f(0x198)]=_0x1aaecf[_0x24ab9f(0x198)]+0x1),_0x1aaecf['isExpressionToEvaluate']=!!_0x83dd31;var _0x1718af=typeof _0x1daee9==_0x24ab9f(0x184),_0x3e3cf6={'name':_0x1718af||_0xa14fb7?_0x3ba706:this[_0x24ab9f(0x154)](_0x3ba706)};if(_0x1718af&&(_0x3e3cf6[_0x24ab9f(0x184)]=!0x0),!(_0x53af0b===_0x24ab9f(0x111)||_0x53af0b==='Error')){var _0x270121=this[_0x24ab9f(0x15b)](_0x3fc911,_0x1daee9);if(_0x270121&&(_0x270121['set']&&(_0x3e3cf6[_0x24ab9f(0xfd)]=!0x0),_0x270121['get']&&!_0x83dd31&&!_0x1aaecf[_0x24ab9f(0x102)]))return _0x3e3cf6['getter']=!0x0,this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x75d602;try{_0x75d602=_0x3c6648(_0x3fc911,_0x1daee9);}catch(_0x13aa60){return _0x3e3cf6={'name':_0x3ba706,'type':_0x24ab9f(0x114),'error':_0x13aa60[_0x24ab9f(0xfb)]},this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x74802c=this['_type'](_0x75d602),_0x3e9d1f=this['_isPrimitiveType'](_0x74802c);if(_0x3e3cf6[_0x24ab9f(0x99)]=_0x74802c,_0x3e9d1f)this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x58307e=_0x24ab9f;_0x3e3cf6[_0x58307e(0xcc)]=_0x75d602['valueOf'](),!_0x83dd31&&_0x1044ef[_0x58307e(0x128)](_0x74802c,_0x3e3cf6,_0x1aaecf,{});});else{var _0xf56525=_0x1aaecf['autoExpand']&&_0x1aaecf[_0x24ab9f(0x16d)]<_0x1aaecf[_0x24ab9f(0xc0)]&&_0x1aaecf['autoExpandPreviousObjects']['indexOf'](_0x75d602)<0x0&&_0x74802c!==_0x24ab9f(0x15c)&&_0x1aaecf[_0x24ab9f(0x146)]<_0x1aaecf['autoExpandLimit'];_0xf56525||_0x1aaecf['level']<_0x564175||_0x83dd31?this[_0x24ab9f(0x16a)](_0x3e3cf6,_0x75d602,_0x1aaecf,_0x83dd31||{}):this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x393a95=_0x24ab9f;_0x74802c===_0x393a95(0x18e)||_0x74802c===_0x393a95(0x13d)||(delete _0x3e3cf6[_0x393a95(0xcc)],_0x3e3cf6[_0x393a95(0x12e)]=!0x0);});}return _0x3e3cf6;}finally{_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8,_0x1aaecf['depth']=_0x564175,_0x1aaecf[_0x24ab9f(0xeb)]=_0x4c8e20;}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x128)]=function(_0x56d3fe,_0x3888bc,_0x5eecce,_0x4702b6){var _0x2683b4=_0x1bff5a,_0x25341f=_0x4702b6[_0x2683b4(0xad)]||_0x5eecce[_0x2683b4(0xad)];if((_0x56d3fe==='string'||_0x56d3fe===_0x2683b4(0x153))&&_0x3888bc[_0x2683b4(0xcc)]){let _0x49128b=_0x3888bc[_0x2683b4(0xcc)][_0x2683b4(0x10d)];_0x5eecce[_0x2683b4(0x161)]+=_0x49128b,_0x5eecce[_0x2683b4(0x161)]>_0x5eecce[_0x2683b4(0xda)]?(_0x3888bc[_0x2683b4(0x12e)]='',delete _0x3888bc[_0x2683b4(0xcc)]):_0x49128b>_0x25341f&&(_0x3888bc['capped']=_0x3888bc['value'][_0x2683b4(0x157)](0x0,_0x25341f),delete _0x3888bc[_0x2683b4(0xcc)]);}},_0x3c842b[_0x1bff5a(0x172)]['_isMap']=function(_0x23ed93){var _0x32ae70=_0x1bff5a;return!!(_0x23ed93&&_0x2a19ae[_0x32ae70(0x193)]&&this[_0x32ae70(0x127)](_0x23ed93)===_0x32ae70(0x117)&&_0x23ed93[_0x32ae70(0x180)]);},_0x3c842b['prototype'][_0x1bff5a(0x154)]=function(_0x539e6b){var _0x3e9eb6=_0x1bff5a;if(_0x539e6b['match'](/^\\d+$/))return _0x539e6b;var _0x268203;try{_0x268203=JSON[_0x3e9eb6(0xa8)](''+_0x539e6b);}catch{_0x268203='\\x22'+this['_objectToString'](_0x539e6b)+'\\x22';}return _0x268203[_0x3e9eb6(0x149)](/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?_0x268203=_0x268203['substr'](0x1,_0x268203[_0x3e9eb6(0x10d)]-0x2):_0x268203=_0x268203['replace'](/'/g,'\\x5c\\x27')[_0x3e9eb6(0x11e)](/\\\\"/g,'\\x22')[_0x3e9eb6(0x11e)](/(^"|"$)/g,'\\x27'),_0x268203;},_0x3c842b['prototype'][_0x1bff5a(0x115)]=function(_0x1b22e6,_0x139c74,_0x26c1fb,_0x18f60b){var _0x59810d=_0x1bff5a;this[_0x59810d(0x124)](_0x1b22e6,_0x139c74),_0x18f60b&&_0x18f60b(),this[_0x59810d(0x13c)](_0x26c1fb,_0x1b22e6),this[_0x59810d(0xdc)](_0x1b22e6,_0x139c74);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x124)]=function(_0x3de57f,_0x633f7e){var _0x3b15c7=_0x1bff5a;this[_0x3b15c7(0x120)](_0x3de57f,_0x633f7e),this['_setNodeQueryPath'](_0x3de57f,_0x633f7e),this[_0x3b15c7(0xaa)](_0x3de57f,_0x633f7e),this[_0x3b15c7(0x140)](_0x3de57f,_0x633f7e);},_0x3c842b['prototype'][_0x1bff5a(0x120)]=function(_0x212392,_0x5350c2){},_0x3c842b['prototype'][_0x1bff5a(0x15e)]=function(_0x254f19,_0xb65cfa){},_0x3c842b[_0x1bff5a(0x172)]['_setNodeLabel']=function(_0x5174e1,_0x4a4537){},_0x3c842b[_0x1bff5a(0x172)]['_isUndefined']=function(_0x4b9a4e){var _0x29d539=_0x1bff5a;return _0x4b9a4e===this[_0x29d539(0x9a)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xdc)]=function(_0x112fbe,_0xc2b2f8){var _0x13069a=_0x1bff5a;this[_0x13069a(0x122)](_0x112fbe,_0xc2b2f8),this[_0x13069a(0x118)](_0x112fbe),_0xc2b2f8[_0x13069a(0x168)]&&this[_0x13069a(0xcd)](_0x112fbe),this[_0x13069a(0x1a3)](_0x112fbe,_0xc2b2f8),this['_addLoadNode'](_0x112fbe,_0xc2b2f8),this['_cleanNode'](_0x112fbe);},_0x3c842b[_0x1bff5a(0x172)]['_additionalMetadata']=function(_0x480177,_0x5bf51c){var _0x36c251=_0x1bff5a;try{_0x480177&&typeof _0x480177[_0x36c251(0x10d)]==_0x36c251(0x113)&&(_0x5bf51c[_0x36c251(0x10d)]=_0x480177[_0x36c251(0x10d)]);}catch{}if(_0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x113)||_0x5bf51c[_0x36c251(0x99)]==='Number'){if(isNaN(_0x5bf51c[_0x36c251(0xcc)]))_0x5bf51c[_0x36c251(0xf7)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];else switch(_0x5bf51c['value']){case Number['POSITIVE_INFINITY']:_0x5bf51c['positiveInfinity']=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case Number[_0x36c251(0x18d)]:_0x5bf51c[_0x36c251(0x109)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case 0x0:this[_0x36c251(0xef)](_0x5bf51c[_0x36c251(0xcc)])&&(_0x5bf51c[_0x36c251(0xbb)]=!0x0);break;}}else _0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x15c)&&typeof _0x480177[_0x36c251(0xe5)]==_0x36c251(0x13e)&&_0x480177[_0x36c251(0xe5)]&&_0x5bf51c[_0x36c251(0xe5)]&&_0x480177['name']!==_0x5bf51c[_0x36c251(0xe5)]&&(_0x5bf51c[_0x36c251(0xb8)]=_0x480177['name']);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xef)]=function(_0x5f59c6){var _0x3d7094=_0x1bff5a;return 0x1/_0x5f59c6===Number[_0x3d7094(0x18d)];},_0x3c842b[_0x1bff5a(0x172)]['_sortProps']=function(_0x341845){var _0xf1b50d=_0x1bff5a;!_0x341845['props']||!_0x341845[_0xf1b50d(0x17d)][_0xf1b50d(0x10d)]||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x111)||_0x341845['type']===_0xf1b50d(0x193)||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x11d)||_0x341845[_0xf1b50d(0x17d)]['sort'](function(_0x18e25d,_0x2e5ca7){var _0x5d8ea4=_0xf1b50d,_0x2086c0=_0x18e25d[_0x5d8ea4(0xe5)]['toLowerCase'](),_0x11bbd3=_0x2e5ca7[_0x5d8ea4(0xe5)]['toLowerCase']();return _0x2086c0<_0x11bbd3?-0x1:_0x2086c0>_0x11bbd3?0x1:0x0;});},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x1a3)]=function(_0x54949b,_0x4cb346){var _0x5e9777=_0x1bff5a;if(!(_0x4cb346[_0x5e9777(0x177)]||!_0x54949b[_0x5e9777(0x17d)]||!_0x54949b['props'][_0x5e9777(0x10d)])){for(var _0x4f6972=[],_0x78d8a8=[],_0x20bd98=0x0,_0x5628f1=_0x54949b['props'][_0x5e9777(0x10d)];_0x20bd98<_0x5628f1;_0x20bd98++){var _0x5c1147=_0x54949b[_0x5e9777(0x17d)][_0x20bd98];_0x5c1147[_0x5e9777(0x99)]===_0x5e9777(0x15c)?_0x4f6972[_0x5e9777(0x175)](_0x5c1147):_0x78d8a8[_0x5e9777(0x175)](_0x5c1147);}if(!(!_0x78d8a8['length']||_0x4f6972[_0x5e9777(0x10d)]<=0x1)){_0x54949b[_0x5e9777(0x17d)]=_0x78d8a8;var _0x1ffed3={'functionsNode':!0x0,'props':_0x4f6972};this[_0x5e9777(0x120)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x122)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x118)](_0x1ffed3),this['_setNodePermissions'](_0x1ffed3,_0x4cb346),_0x1ffed3['id']+='\\x20f',_0x54949b[_0x5e9777(0x17d)]['unshift'](_0x1ffed3);}}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x10f)]=function(_0x3e2ffa,_0x7cf6a2){},_0x3c842b['prototype'][_0x1bff5a(0x118)]=function(_0x25a8d7){},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf3)]=function(_0x1726d6){var _0x4469e7=_0x1bff5a;return Array[_0x4469e7(0x9b)](_0x1726d6)||typeof _0x1726d6==_0x4469e7(0x12d)&&this[_0x4469e7(0x127)](_0x1726d6)===_0x4469e7(0x19e);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x140)]=function(_0x4c1d3c,_0x349781){},_0x3c842b['prototype']['_cleanNode']=function(_0x4d21c1){var _0xd58577=_0x1bff5a;delete _0x4d21c1[_0xd58577(0xf5)],delete _0x4d21c1[_0xd58577(0x144)],delete _0x4d21c1[_0xd58577(0x110)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xaa)]=function(_0x43e4e6,_0x3cf6da){};let _0x22e9d1=new _0x3c842b(),_0x31d042={'props':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x17d)]||0x64,'elements':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x163)]||0x64,'strLength':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0xad)]||0x400*0x32,'totalStrLength':_0x483b0f['defaultLimits'][_0x1bff5a(0xda)]||0x400*0x32,'autoExpandLimit':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x194)]||0x1388,'autoExpandMaxDepth':_0x483b0f['defaultLimits'][_0x1bff5a(0xc0)]||0xa},_0x5134cc={'props':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x17d)]||0x5,'elements':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x163)]||0x5,'strLength':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0xad)]||0x100,'totalStrLength':_0x483b0f['reducedLimits'][_0x1bff5a(0xda)]||0x100*0x3,'autoExpandLimit':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x194)]||0x1e,'autoExpandMaxDepth':_0x483b0f[_0x1bff5a(0xbf)]['autoExpandMaxDepth']||0x2};if(_0x599cd8){let _0x10c22a=_0x22e9d1[_0x1bff5a(0x16a)][_0x1bff5a(0x18c)](_0x22e9d1);_0x22e9d1[_0x1bff5a(0x16a)]=function(_0x63dc8a,_0xf87bc8,_0xed8b,_0x3030e4){return _0x10c22a(_0x63dc8a,_0x599cd8(_0xf87bc8),_0xed8b,_0x3030e4);};}function _0x36e6e0(_0x4b7ae2,_0x7448e6,_0x1e6871,_0x13e959,_0x54bcfa,_0x5e46fe){var _0x55e03f=_0x1bff5a;let _0x581fa4,_0x572fc2;try{_0x572fc2=_0x32f0dd(),_0x581fa4=_0x7f88c9[_0x7448e6],!_0x581fa4||_0x572fc2-_0x581fa4['ts']>_0x15035d['perLogpoint'][_0x55e03f(0xa9)]&&_0x581fa4['count']&&_0x581fa4[_0x55e03f(0x137)]/_0x581fa4[_0x55e03f(0xd3)]<_0x15035d['perLogpoint']['resetOnProcessingTimeAverageMs']?(_0x7f88c9[_0x7448e6]=_0x581fa4={'count':0x0,'time':0x0,'ts':_0x572fc2},_0x7f88c9[_0x55e03f(0x10c)]={}):_0x572fc2-_0x7f88c9[_0x55e03f(0x10c)]['ts']>_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0xa9)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]/_0x7f88c9[_0x55e03f(0x10c)]['count']<_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0x1a5)]&&(_0x7f88c9[_0x55e03f(0x10c)]={});let _0x592aa0=[],_0x201cd8=_0x581fa4['reduceLimits']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xbc)]?_0x5134cc:_0x31d042,_0x1c3b41=_0x440706=>{var _0x380ff0=_0x55e03f;let _0x2fbc49={};return _0x2fbc49['props']=_0x440706['props'],_0x2fbc49['elements']=_0x440706[_0x380ff0(0x163)],_0x2fbc49['strLength']=_0x440706['strLength'],_0x2fbc49[_0x380ff0(0xda)]=_0x440706[_0x380ff0(0xda)],_0x2fbc49[_0x380ff0(0x194)]=_0x440706[_0x380ff0(0x194)],_0x2fbc49[_0x380ff0(0xc0)]=_0x440706[_0x380ff0(0xc0)],_0x2fbc49[_0x380ff0(0x168)]=!0x1,_0x2fbc49[_0x380ff0(0x177)]=!_0x447b71,_0x2fbc49[_0x380ff0(0x198)]=0x1,_0x2fbc49['level']=0x0,_0x2fbc49[_0x380ff0(0xfa)]=_0x380ff0(0xae),_0x2fbc49['rootExpression']=_0x380ff0(0x104),_0x2fbc49[_0x380ff0(0x169)]=!0x0,_0x2fbc49[_0x380ff0(0xf1)]=[],_0x2fbc49['autoExpandPropertyCount']=0x0,_0x2fbc49[_0x380ff0(0x102)]=_0x483b0f[_0x380ff0(0x102)],_0x2fbc49[_0x380ff0(0x161)]=0x0,_0x2fbc49[_0x380ff0(0x14e)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x2fbc49;};for(var _0x34cb46=0x0;_0x34cb46<_0x54bcfa['length'];_0x34cb46++)_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'timeNode':_0x4b7ae2==='time'||void 0x0},_0x54bcfa[_0x34cb46],_0x1c3b41(_0x201cd8),{}));if(_0x4b7ae2==='trace'||_0x4b7ae2===_0x55e03f(0x187)){let _0x38f028=Error['stackTraceLimit'];try{Error['stackTraceLimit']=0x1/0x0,_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'stackNode':!0x0},new Error()['stack'],_0x1c3b41(_0x201cd8),{'strLength':0x1/0x0}));}finally{Error['stackTraceLimit']=_0x38f028;}}return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':_0x592aa0,'id':_0x7448e6,'context':_0x5e46fe}]};}catch(_0x38023d){return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':[{'type':_0x55e03f(0x114),'error':_0x38023d&&_0x38023d['message']}],'id':_0x7448e6,'context':_0x5e46fe}]};}finally{try{if(_0x581fa4&&_0x572fc2){let _0x4a1dc5=_0x32f0dd();_0x581fa4['count']++,_0x581fa4['time']+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x581fa4['ts']=_0x4a1dc5,_0x7f88c9['hits'][_0x55e03f(0xd3)]++,_0x7f88c9['hits'][_0x55e03f(0x137)]+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x7f88c9[_0x55e03f(0x10c)]['ts']=_0x4a1dc5,(_0x581fa4[_0x55e03f(0xd3)]>_0x15035d['perLogpoint'][_0x55e03f(0x138)]||_0x581fa4['time']>_0x15035d['perLogpoint'][_0x55e03f(0x148)])&&(_0x581fa4['reduceLimits']=!0x0),(_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]>_0x15035d[_0x55e03f(0xe6)]['reduceOnCount']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]>_0x15035d['global'][_0x55e03f(0x148)])&&(_0x7f88c9['hits'][_0x55e03f(0xbc)]=!0x0);}}catch{}}}return _0x36e6e0;}function G(_0x4bcced){var _0x3ca5c0=_0x1c43af;if(_0x4bcced&&typeof _0x4bcced==_0x3ca5c0(0x12d)&&_0x4bcced[_0x3ca5c0(0x19d)])switch(_0x4bcced[_0x3ca5c0(0x19d)][_0x3ca5c0(0xe5)]){case _0x3ca5c0(0xb0):return _0x4bcced[_0x3ca5c0(0xfc)](Symbol[_0x3ca5c0(0x189)])?Promise[_0x3ca5c0(0x18b)]():_0x4bcced;case _0x3ca5c0(0x19b):return Promise['resolve']();}return _0x4bcced;}((_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x5efe0f,_0xeb603e,_0x2e7e15,_0x351bad,_0x341637,_0x3428c5,_0x343bd6)=>{var _0x1125dc=_0x1c43af;if(_0x48d785[_0x1125dc(0xec)])return _0x48d785['_console_ninja'];let _0x3cd4f6={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}};if(!X(_0x48d785,_0x2e7e15,_0x4d1fbe))return _0x48d785[_0x1125dc(0xec)]=_0x3cd4f6,_0x48d785[_0x1125dc(0xec)];let _0xaf0d67=b(_0x48d785),_0x281f2e=_0xaf0d67[_0x1125dc(0xb4)],_0xae8681=_0xaf0d67[_0x1125dc(0xfe)],_0x4e0fc5=_0xaf0d67['now'],_0xa2e8a7={'hits':{},'ts':{}},_0x91e1f5=J(_0x48d785,_0x351bad,_0xa2e8a7,_0x5efe0f,_0x343bd6,_0x4d1fbe===_0x1125dc(0x179)?G:void 0x0),_0x536854=(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3)=>{var _0x348500=_0x1125dc;let _0x3306b6=_0x48d785['_console_ninja'];try{return _0x48d785[_0x348500(0xec)]=_0x3cd4f6,_0x91e1f5(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3);}finally{_0x48d785[_0x348500(0xec)]=_0x3306b6;}},_0x11e42f=_0x3660d4=>{_0xa2e8a7['ts'][_0x3660d4]=_0xae8681();},_0x308a38=(_0x227f0b,_0x4baf5a)=>{var _0x286c56=_0x1125dc;let _0x459036=_0xa2e8a7['ts'][_0x4baf5a];if(delete _0xa2e8a7['ts'][_0x4baf5a],_0x459036){let _0xaca72e=_0x281f2e(_0x459036,_0xae8681());_0x223f4e(_0x536854(_0x286c56(0x137),_0x227f0b,_0x4e0fc5(),_0x3b9616,[_0xaca72e],_0x4baf5a));}},_0x11c122=_0x2d5a87=>{var _0x28fe2c=_0x1125dc,_0x1c2128;return _0x4d1fbe===_0x28fe2c(0x179)&&_0x48d785[_0x28fe2c(0xa3)]&&((_0x1c2128=_0x2d5a87==null?void 0x0:_0x2d5a87[_0x28fe2c(0x1a4)])==null?void 0x0:_0x1c2128[_0x28fe2c(0x10d)])&&(_0x2d5a87[_0x28fe2c(0x1a4)][0x0][_0x28fe2c(0xa3)]=_0x48d785['origin']),_0x2d5a87;};_0x48d785['_console_ninja']={'consoleLog':(_0x535a72,_0x3d708e)=>{var _0xee4f6a=_0x1125dc;_0x48d785['console'][_0xee4f6a(0x17a)][_0xee4f6a(0xe5)]!==_0xee4f6a(0xd2)&&_0x223f4e(_0x536854(_0xee4f6a(0x17a),_0x535a72,_0x4e0fc5(),_0x3b9616,_0x3d708e));},'consoleTrace':(_0x3cb025,_0x49aa51)=>{var _0x2f4b5c=_0x1125dc,_0x4599c8,_0x3c6c91;_0x48d785[_0x2f4b5c(0x159)][_0x2f4b5c(0x17a)][_0x2f4b5c(0xe5)]!==_0x2f4b5c(0x133)&&((_0x3c6c91=(_0x4599c8=_0x48d785[_0x2f4b5c(0xc5)])==null?void 0x0:_0x4599c8[_0x2f4b5c(0xe0)])!=null&&_0x3c6c91[_0x2f4b5c(0x14e)]&&(_0x48d785['_ninjaIgnoreNextError']=!0x0),_0x223f4e(_0x11c122(_0x536854(_0x2f4b5c(0x181),_0x3cb025,_0x4e0fc5(),_0x3b9616,_0x49aa51))));},'consoleError':(_0x1bcfbb,_0x5dfcc2)=>{var _0x5127a8=_0x1125dc;_0x48d785[_0x5127a8(0x121)]=!0x0,_0x223f4e(_0x11c122(_0x536854(_0x5127a8(0x187),_0x1bcfbb,_0x4e0fc5(),_0x3b9616,_0x5dfcc2)));},'consoleTime':_0x1240c5=>{_0x11e42f(_0x1240c5);},'consoleTimeEnd':(_0x45b15f,_0xedf120)=>{_0x308a38(_0xedf120,_0x45b15f);},'autoLog':(_0x476380,_0x430396)=>{var _0x381ac9=_0x1125dc;_0x223f4e(_0x536854(_0x381ac9(0x17a),_0x430396,_0x4e0fc5(),_0x3b9616,[_0x476380]));},'autoLogMany':(_0x496baf,_0x2de83e)=>{_0x223f4e(_0x536854('log',_0x496baf,_0x4e0fc5(),_0x3b9616,_0x2de83e));},'autoTrace':(_0x580506,_0xdd93fb)=>{var _0x545a58=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x545a58(0x181),_0xdd93fb,_0x4e0fc5(),_0x3b9616,[_0x580506])));},'autoTraceMany':(_0x35b68e,_0x1bf390)=>{var _0x53bd89=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x53bd89(0x181),_0x35b68e,_0x4e0fc5(),_0x3b9616,_0x1bf390)));},'autoTime':(_0x1f9f08,_0x36b878,_0x2bba7b)=>{_0x11e42f(_0x2bba7b);},'autoTimeEnd':(_0x5b5318,_0x42dbfa,_0x2fdc68)=>{_0x308a38(_0x42dbfa,_0x2fdc68);},'coverage':_0x3c7d3b=>{var _0x2e75e3=_0x1125dc;_0x223f4e({'method':_0x2e75e3(0x1a1),'version':_0x5efe0f,'args':[{'id':_0x3c7d3b}]});}};let _0x223f4e=H(_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x341637,_0x3428c5),_0x3b9616=_0x48d785[_0x1125dc(0x183)];return _0x48d785[_0x1125dc(0xec)];})(globalThis,_0x1c43af(0xd0),_0x1c43af(0x1a2),_0x1c43af(0x160),_0x1c43af(0xd8),'1.0.0',_0x1c43af(0x17b),_0x1c43af(0x14b),_0x1c43af(0x18a),'',_0x1c43af(0x156),{"resolveGetters":false,"defaultLimits":{"props":100,"elements":100,"strLength":51200,"totalStrLength":51200,"autoExpandLimit":5000,"autoExpandMaxDepth":10},"reducedLimits":{"props":5,"elements":5,"strLength":256,"totalStrLength":768,"autoExpandLimit":30,"autoExpandMaxDepth":2},"reducePolicy":{"perLogpoint":{"reduceOnCount":50,"reduceOnAccumulatedProcessingTimeMs":100,"resetWhenQuietMs":500,"resetOnProcessingTimeAverageMs":100},"global":{"reduceOnCount":1000,"reduceOnAccumulatedProcessingTimeMs":300,"resetWhenQuietMs":50,"resetOnProcessingTimeAverageMs":100}}});`);
  } catch (e) {
  }
}
function oo_tx$4(i, ...v) {
  try {
    oo_cm$4().consoleError(i, v);
  } catch (e) {
  }
  return v;
}

const admin_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: admin_post
}, Symbol.toStringTag, { value: 'Module' }));

const chat_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const allProducts = await getProducts({}, 100);
  await getCategories();
  await getBrands();
  if (body.wizard) {
    const w = body.wizard;
    const recommendations = matchProductsByWizard(w, allProducts);
    const nicText = w.goal === "smoke" ? "\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u06F3\u06F5 \u062A\u0627 \u06F5\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u06AF\u0631\u0645 (\u0628\u06CC\u0634\u062A\u0631\u06CC\u0646 \u0634\u0628\u0627\u0647\u062A \u0628\u0647 \u06AF\u06CC\u0631\u0627\u06CC\u06CC \u0633\u06CC\u06AF\u0627\u0631)" : w.goal === "hookah" ? "\u062C\u0648\u06CC\u0633 \u06F6-\u06F3 \u0645\u06CC\u0644\u06CC\u200C\u06AF\u0631\u0645 \u06CC\u0627 \u067E\u0627\u062F \u0645\u06CC\u0648\u0647\u200C\u0627\u06CC \u0628\u0627 \u06A9\u0627\u0645\u200C\u062F\u0647\u06CC \u0631\u0648\u0627\u0646" : "\u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u06F2\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u06AF\u0631\u0645 \u06CC\u0627 \u067E\u0627\u062F\u0647\u0627\u06CC \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641 \u0633\u0628\u06A9";
    return {
      type: "wizard_result",
      reply: `\u0628\u0631 \u0627\u0633\u0627\u0633 \u0633\u0644\u06CC\u0642\u0647 \u0648 \u0647\u062F\u0641 \u0627\u0646\u062A\u062E\u0627\u0628\u06CC \u0634\u0645\u0627\u060C \u0645\u06CC\u0632\u0627\u0646 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F\u06CC **${nicText}** \u0627\u0633\u062A. \u0628\u0647\u062A\u0631\u06CC\u0646 \u06AF\u0632\u06CC\u0646\u0647\u200C\u0647\u0627\u06CC \u0647\u0645\u062E\u0648\u0627\u0646 \u0628\u0627 \u0630\u0627\u0626\u0642\u0647 \u0634\u0645\u0627 \u0622\u0645\u0627\u062F\u0647 \u0634\u062F\u0646\u062F:`,
      products: recommendations,
      suggestedNicotine: nicText
    };
  }
  const rawQuery = (body.message || "").trim();
  if (!rawQuery) {
    return {
      type: "chat_reply",
      reply: "\u0633\u0644\u0627\u0645! \u0645\u0646 \u062F\u0633\u062A\u06CC\u0627\u0631 \u062A\u062E\u0635\u0635\u06CC \u0648\u06CC\u067E\u0648\u0631\u0627 \u0647\u0633\u062A\u0645. \u0686\u0647 \u0637\u0639\u0645\u060C \u062F\u0633\u062A\u06AF\u0627\u0647 \u06CC\u0627 \u0633\u0648\u0627\u0644\u06CC \u062F\u0627\u0631\u06CC\u062F \u062A\u0627 \u062F\u0642\u06CC\u0642\u0627\u064B \u0631\u0627\u0647\u0646\u0645\u0627\u06CC\u06CC\u062A\u0648\u0646 \u06A9\u0646\u0645\u061F \u2601\uFE0F",
      products: []
    };
  }
  const result = await handleFreeFormQuery(rawQuery, allProducts);
  return result;
});
function normalizePersian(text) {
  return (text || "").replace(/[\u200B-\u200D\uFEFF]/g, " ").replace(/\u200C/g, " ").replace(/[ي]/g, "\u06CC").replace(/[ك]/g, "\u06A9").replace(/[ۀة]/g, "\u0647").replace(/[إأآ]/g, "\u0627").replace(/[ؤ]/g, "\u0648").replace(/[ئ]/g, "\u06CC").replace(/[\u064B-\u065F]/g, "").toLowerCase().trim();
}
function parseUserIntent(raw) {
  const q = normalizePersian(raw);
  const has = (...words) => words.some((w) => q.includes(normalizePersian(w)));
  let isInfoQuery = false;
  let infoTopic = void 0;
  if (has("\u062A\u0641\u0627\u0648\u062A \u0633\u0627\u0644\u062A \u0648 \u062C\u0648\u06CC\u0633", "\u0641\u0631\u0642 \u0633\u0627\u0644\u062A", "\u062C\u0648\u06CC\u0633 \u0686\u06CC\u0647", "\u0633\u0627\u0644\u062A \u0686\u06CC\u0647", "\u0633\u0627\u0644\u062A \u06CC\u0627 \u062C\u0648\u06CC\u0633")) {
    isInfoQuery = true;
    infoTopic = "difference";
  } else if (has("\u0627\u0631\u0633\u0627\u0644", "\u067E\u06CC\u06A9", "\u0686\u0642\u062F\u0631 \u0637\u0648\u0644 \u0645\u06CC\u06A9\u0634\u0647", "\u062A\u062D\u0648\u06CC\u0644", "\u062A\u0647\u0631\u0627\u0646", "\u0634\u0647\u0631\u0633\u062A\u0627\u0646", "\u067E\u0633\u062A", "\u062A\u06CC\u067E\u0627\u06A9\u0633")) {
    isInfoQuery = true;
    infoTopic = "shipping";
  } else if (has("\u0627\u0635\u0627\u0644\u062A", "\u0627\u0635\u0644", "\u0641\u06CC\u06A9", "\u06AF\u0627\u0631\u0627\u0646\u062A\u06CC", "\u0636\u0645\u0627\u0646\u062A", "\u0647\u0648\u0644\u0648\u06AF\u0631\u0627\u0645", "\u06A9\u062F \u0627\u0633\u062A\u0639\u0644\u0627\u0645")) {
    isInfoQuery = true;
    infoTopic = "authenticity";
  } else if (has("\u062A\u0639\u0648\u06CC\u0636 \u06A9\u0648\u06CC\u0644", "\u06A9\u0648\u06CC\u0644 \u0633\u0648\u062E\u062A\u0647", "\u06A9\u0627\u0631\u062A\u0631\u06CC\u062C \u0686\u0642\u062F\u0631 \u06A9\u0627\u0631 \u0645\u06CC\u062F\u0647", "\u0633\u0648\u062E\u062A\u0646 \u06A9\u0648\u06CC\u0644")) {
    isInfoQuery = true;
    infoTopic = "coil";
  }
  let categorySlug = void 0;
  if (has("\u0633\u0627\u0644\u062A", "\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646", "\u0646\u0645\u06A9 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646", "\u0633\u0627\u0644\u062A\u0647\u0627", "salt", "salts")) {
    categorySlug = "salts";
  } else if (has("\u06CC\u06A9\u0628\u0627\u0631 \u0645\u0635\u0631\u0641", "\u06CC\u06A9\u0628\u0627\u0631\u0645\u0635\u0631\u0641", "\u06CC\u06A9 \u0628\u0627\u0631 \u0645\u0635\u0631\u0641", "\u067E\u0627\u062F \u06CC\u06A9\u0628\u0627\u0631", "disposable")) {
    categorySlug = "pods";
  } else if (has("\u067E\u0627\u062F", "\u067E\u0627\u062F\u0633\u06CC\u0633\u062A\u0645", "\u067E\u0627\u062F \u0633\u06CC\u0633\u062A\u0645", "\u062F\u0633\u062A\u06AF\u0627\u0647 \u067E\u0627\u062F", "\u067E\u0627\u062F \u0642\u0644\u0645\u06CC")) {
    if (!categorySlug) categorySlug = "pods";
  } else if (has("\u0645\u0648\u062F", "\u0648\u06CC\u067E", "\u0648\u0627\u062A \u0628\u0627\u0644\u0627", "\u0642\u0644\u06CC\u0627\u0646\u06CC", "\u0642\u0644\u06CC\u0627\u0646", "\u062A\u0627\u0646\u06A9", "\u062F\u0633\u062A\u06AF\u0627\u0647 \u0648\u06CC\u067E", "mod", "mods")) {
    categorySlug = "mods";
  } else if (has("\u06A9\u0648\u06CC\u0644", "\u06A9\u0627\u0631\u062A\u0631\u06CC\u062C", "\u0644\u0648\u0627\u0632\u0645 \u062C\u0627\u0646\u0628\u06CC", "\u0634\u0627\u0631\u0698\u0631", "\u067E\u0646\u0628\u0647")) {
    categorySlug = "gear";
  }
  const fruityKeywords = [
    "\u0645\u06CC\u0648\u0647",
    "\u0645\u06CC\u0648\u0647\u200C\u0627\u06CC",
    "\u0645\u06CC\u0648\u0647\u0627\u06CC",
    "\u0645\u06CC\u0648\u0647 \u0627\u06CC",
    "\u0645\u06CC\u0648\u0647 \u062C\u0627\u062A",
    "\u0641\u0631\u0648\u062A\u06CC",
    "\u0627\u0646\u06AF\u0648\u0631",
    "\u0628\u0644\u0648\u0628\u0631\u06CC",
    "\u0647\u0646\u062F\u0648\u0627\u0646\u0647",
    "\u0647\u0646\u062F\u0648\u0646\u0647",
    "\u062A\u0648\u062A \u0641\u0631\u0646\u06AF\u06CC",
    "\u062A\u0648\u062A\u0641\u0631\u0646\u06AF\u06CC",
    "\u0633\u06CC\u0628",
    "\u0647\u0644\u0648",
    "\u0627\u0646\u0628\u0647",
    "\u0644\u06CC\u0686\u06CC",
    "\u0644\u06CC\u0645\u0648",
    "\u067E\u0631\u062A\u0642\u0627\u0644",
    "\u067E\u0634\u0646 \u0641\u0631\u0648\u062A",
    "\u0637\u0627\u0644\u0628\u06CC",
    "\u0645\u0648\u0632",
    "\u06A9\u06CC\u0648\u06CC",
    "\u06AF\u0631\u06CC\u067E \u0641\u0631\u0648\u062A",
    "\u062A\u0645\u0634\u06A9",
    "\u0634\u0627\u062A\u0648\u062A",
    "\u0631\u062F\u0628\u0648\u0644",
    "\u0622\u0644\u0628\u0627\u0644\u0648",
    "\u0627\u0646\u0627\u0631"
  ];
  const isFruity = has(...fruityKeywords);
  const tobaccoKeywords = [
    "\u062A\u0646\u0628\u0627\u06A9\u0648",
    "\u062A\u0646\u0628\u0627\u06A9\u0648\u06CC\u06CC",
    "\u062A\u0646\u0628\u0627\u06A9\u0648\u06CC",
    "\u0633\u06CC\u06AF\u0627\u0631",
    "\u06A9\u0648\u0628\u0627\u0646\u0648",
    "\u062F\u0648\u0633\u06CC\u0628",
    "\u0633\u06CC\u06AF\u0627\u0631 \u0628\u0631\u06AF",
    "\u062A\u0648\u062A\u0648\u0646",
    "\u067E\u06CC\u067E",
    "\u0642\u0647\u0648\u0647",
    "\u0633\u06AF\u0627\u0631",
    "tobacco",
    "cigar",
    "cubano"
  ];
  const isTobacco = has(...tobaccoKeywords);
  const dessertKeywords = [
    "\u062F\u0633\u0631",
    "\u062F\u0633\u0631\u06CC",
    "\u062E\u0627\u0645\u0647",
    "\u062E\u0627\u0645\u0647\u200C\u0627\u06CC",
    "\u06A9\u0631\u0645",
    "\u06A9\u0627\u0633\u062A\u0627\u0631\u062F",
    "\u0648\u0627\u0646\u06CC\u0644",
    "\u06A9\u06CC\u06A9",
    "\u0628\u06CC\u0633\u06A9\u0648\u06CC\u062A",
    "\u06A9\u0627\u0631\u0627\u0645\u0644",
    "\u0634\u06A9\u0644\u0627\u062A",
    "\u0634\u06CC\u0631\u06CC\u0646",
    "\u0634\u06CC\u0631",
    "custard",
    "cream",
    "vanilla"
  ];
  const isDessert = has(...dessertKeywords);
  const isExtremeIce = has("\u0641\u0648\u0642 \u062E\u0646\u06A9", "\u0641\u0648\u0642 \u0627\u0644\u0639\u0627\u062F\u0647 \u062E\u0646\u06A9", "\u062E\u06CC\u0644\u06CC \u062E\u0646\u06A9", "\u0634\u062F\u06CC\u062F\u0627 \u062E\u0646\u06A9", "\u06CC\u062E \u0632\u06CC\u0627\u062F", "\u0622\u06CC\u0633 \u0628\u0627\u0644\u0627", "\u0645\u0627\u06A9\u0633\u06CC\u0645\u0645 \u0622\u06CC\u0633", "\u0633\u0631\u062F \u0633\u0631\u062F", "\u06A9\u0648\u0644\u06CC\u0646\u06AF \u0628\u0627\u0644\u0627", "\u06CC\u062E \u0641\u0631\u0627\u0648\u0627\u0646");
  const isRegularIce = has("\u062E\u0646\u06A9", "\u062E\u0646\u06A9\u06CC", "\u0622\u06CC\u0633", "\u0627\u06CC\u0633", "\u06CC\u062E", "\u06CC\u062E\u06CC", "\u0646\u0639\u0646\u0627\u0639", "\u0646\u0639\u0646\u0627", "\u0633\u0631\u062F", "\u06A9\u0648\u0644\u06CC\u0646\u06AF", "\u0645\u0646\u062A\u0648\u0644", "ice", "cool", "cold", "frost", "menthol");
  const isNoIce = has("\u0628\u062F\u0648\u0646 \u06CC\u062E", "\u0628\u062F\u0648\u0646 \u0622\u06CC\u0633", "\u06AF\u0631\u0645", "\u0628\u062F\u0648\u0646 \u0646\u0639\u0646\u0627\u0639", "\u06A9\u0645 \u06CC\u062E");
  let iceIntensity = 0;
  let isIce = false;
  if (isExtremeIce) {
    iceIntensity = 5;
    isIce = true;
  } else if (isRegularIce && !isNoIce) {
    iceIntensity = 4;
    isIce = true;
  } else if (isNoIce) {
    iceIntensity = 0;
    isIce = false;
  }
  const specificFlavors = [];
  if (has("\u0627\u0646\u06AF\u0648\u0631", "grape")) specificFlavors.push("\u0627\u0646\u06AF\u0648\u0631");
  if (has("\u0628\u0644\u0648\u0628\u0631\u06CC", "blueberry")) specificFlavors.push("\u0628\u0644\u0648\u0628\u0631\u06CC");
  if (has("\u0647\u0646\u062F\u0648\u0627\u0646\u0647", "\u0647\u0646\u062F\u0648\u0646\u0647", "watermelon")) specificFlavors.push("\u0647\u0646\u062F\u0648\u0627\u0646\u0647");
  if (has("\u0627\u0646\u0628\u0647", "mango")) specificFlavors.push("\u0627\u0646\u0628\u0647");
  if (has("\u062A\u0648\u062A \u0641\u0631\u0646\u06AF\u06CC", "\u062A\u0648\u062A\u0641\u0631\u0646\u06AF\u06CC", "strawberry")) specificFlavors.push("\u062A\u0648\u062A \u0641\u0631\u0646\u06AF\u06CC");
  if (has("\u0633\u06CC\u0628", "apple")) specificFlavors.push("\u0633\u06CC\u0628");
  if (has("\u0647\u0644\u0648", "peach")) specificFlavors.push("\u0647\u0644\u0648");
  if (has("\u0644\u06CC\u0645\u0648", "lemon", "lime")) specificFlavors.push("\u0644\u06CC\u0645\u0648");
  if (has("\u0646\u0639\u0646\u0627\u0639", "\u0646\u0639\u0646\u0627", "mint")) specificFlavors.push("\u0646\u0639\u0646\u0627\u0639");
  if (has("\u06A9\u0648\u0644\u0627", "cola")) specificFlavors.push("\u06A9\u0648\u0644\u0627");
  const isQuitSmoking = has("\u062A\u0631\u06A9 \u0633\u06CC\u06AF\u0627\u0631", "\u062C\u0627\u06CC\u06AF\u0632\u06CC\u0646 \u0633\u06CC\u06AF\u0627\u0631", "\u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u0628\u0627\u0644\u0627", "\u0633\u0646\u06AF\u06CC\u0646", "\u06AF\u06CC\u0631\u0627\u06CC\u06CC \u0628\u0627\u0644\u0627", "\u06F5\u06F0", "50", "\u06F3\u06F5", "35");
  const isHighPuff = has("\u067E\u0627\u0641 \u0628\u0627\u0644\u0627", "\u0645\u0627\u0646\u062F\u06AF\u0627\u0631\u06CC \u0628\u0627\u0644\u0627", "\u0637\u0648\u0644\u0627\u0646\u06CC", "\u06F1\u06F0\u06F0\u06F0\u06F0", "10000", "\u06F8\u06F0\u06F0\u06F0", "8000", "\u06F6\u06F0\u06F0\u06F0", "6000");
  const isCheap = has("\u0627\u0631\u0632\u0627\u0646", "\u0627\u0631\u0632\u0648\u0646", "\u0642\u06CC\u0645\u062A \u0645\u0646\u0627\u0633\u0628", "\u0627\u0631\u0632\u0648\u0646\u062A\u0631\u06CC\u0646", "\u0627\u0631\u0632\u0627\u0646\u200C\u062A\u0631\u06CC\u0646", "\u0627\u0631\u0632\u0627\u0646\u062A\u0631\u06CC\u0646", "\u0627\u0642\u062A\u0635\u0627\u062F\u06CC", "\u062A\u062E\u0641\u06CC\u0641", "\u062D\u0631\u0627\u062C", "\u0627\u0631\u0632\u0627\u0646 \u0642\u06CC\u0645\u062A");
  const isBestSeller = has("\u067E\u0631\u0641\u0631\u0648\u0634", "\u0645\u062D\u0628\u0648\u0628", "\u0628\u0647\u062A\u0631\u06CC\u0646", "\u067E\u06CC\u0634\u0646\u0647\u0627\u062F", "\u067E\u0631\u0637\u0631\u0641\u062F\u0627\u0631", "\u062A\u0627\u067E", "\u0645\u0639\u0631\u0648\u0641", "\u062A\u0636\u0645\u06CC\u0646\u06CC");
  let isBrand = void 0;
  if (has("\u0627\u0644\u0641 \u0628\u0627\u0631", "\u0627\u0644\u0641\u0628\u0627\u0631", "\u0627\u0644 \u0627\u0641 \u0628\u0627\u0631", "elfbar")) isBrand = "elfbar";
  if (has("\u0648\u0648\u0632\u0648\u0644", "\u0648\u0632\u0648\u0644", "vozol")) isBrand = "vozol";
  if (has("\u0644\u0627\u0633\u062A \u0645\u0627\u0631\u06CC", "\u0644\u0627\u0633\u062A\u200C\u0645\u0627\u0631\u06CC", "lostmary", "lost mary")) isBrand = "lostmary";
  if (has("\u0627\u06CC\u06AF\u062A", "\u0622\u06CC\u06AF\u062A", "iget")) isBrand = "iget";
  if (has("\u0648\u06CC\u067E\u0631\u0633\u0648", "vaporesso")) isBrand = "vaporesso";
  if (has("\u0646\u0627\u0633\u062A\u06CC", "\u0646\u0633\u062A\u06CC", "nasty")) isBrand = "nasty";
  if (has("\u0648\u06CC\u067E\u0648\u0631\u0627", "vapora")) isBrand = "vapora";
  return {
    categorySlug,
    isFruity,
    isTobacco,
    isDessert,
    isIce,
    iceIntensity,
    specificFlavors,
    isQuitSmoking,
    isHighPuff,
    isCheap,
    isBestSeller,
    isBrand,
    isInfoQuery,
    infoTopic
  };
}
function scoreProduct(p, intent, userQuery) {
  var _a;
  let score = 40;
  const reasons = [];
  let suggestedFlavor = void 0;
  const allText = normalizePersian(
    `${p.name} ${p.tagline || ""} ${p.description} ${p.category} ${p.brand} ${JSON.stringify(p.specs || {})}`
  );
  let flavorOptions = [];
  try {
    if (p.specs && p.specs.options) {
      const parsed = typeof p.specs.options === "string" ? JSON.parse(p.specs.options) : p.specs.options;
      if (parsed.flavors && Array.isArray(parsed.flavors)) {
        flavorOptions = parsed.flavors;
      }
    }
  } catch {
  }
  let coolingLevel = 0;
  if (allText.includes("\u06CC\u062E") || allText.includes("ice") || allText.includes("\u0633\u0631\u062F") || allText.includes("\u062E\u0646\u06A9") || allText.includes("\u0646\u0639\u0646\u0627\u0639")) {
    coolingLevel = 4;
    if (allText.includes("\u0641\u0648\u0642") || allText.includes("\u06A9\u0648\u0644\u0627 \u06CC\u062E\u06CC") || allText.includes("\u06CC\u062E\u06CC") || p.categorySlug === "salts") {
      coolingLevel = 5;
    }
  }
  if (intent.categorySlug) {
    if (p.categorySlug === intent.categorySlug) {
      score += 55;
      if (intent.categorySlug === "salts") reasons.push("\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644");
      else if (intent.categorySlug === "pods") reasons.push("\u067E\u0627\u062F \u0628\u0627\u06A9\u06CC\u0641\u06CC\u062A \u0648 \u0622\u0645\u0627\u062F\u0647 \u0645\u0635\u0631\u0641");
      else if (intent.categorySlug === "mods") reasons.push("\u062F\u0633\u062A\u06AF\u0627\u0647 \u062D\u0631\u0641\u0647\u200C\u0627\u06CC \u0628\u0627 \u0637\u0639\u0645\u200C\u062F\u0647\u06CC \u0639\u0627\u0644\u06CC");
    } else {
      score -= 75;
    }
  }
  if (intent.specificFlavors.length > 0) {
    for (const specFlav of intent.specificFlavors) {
      const normSpec = normalizePersian(specFlav);
      const foundInOptions = flavorOptions.find((f) => normalizePersian(f).includes(normSpec));
      if (foundInOptions) {
        score += 45;
        suggestedFlavor = foundInOptions;
        reasons.push(`\u062F\u0627\u0631\u0627\u06CC \u0637\u0639\u0645 \u0645\u062D\u0628\u0648\u0628 ${specFlav}`);
        break;
      } else if (allText.includes(normSpec)) {
        score += 35;
        reasons.push(`\u0647\u0645\u062E\u0648\u0627\u0646 \u0628\u0627 \u0637\u0639\u0645 ${specFlav}`);
        break;
      }
    }
  }
  if (intent.isFruity) {
    const fruitMatches = flavorOptions.filter((f) => {
      const norm = normalizePersian(f);
      return ["\u0627\u0646\u06AF\u0648\u0631", "\u0628\u0644\u0648\u0628\u0631\u06CC", "\u0647\u0646\u062F\u0648\u0627\u0646\u0647", "\u062A\u0648\u062A", "\u0627\u0646\u0628\u0647", "\u0633\u06CC\u0628", "\u0647\u0644\u0648", "\u0644\u06CC\u0645\u0648", "\u0644\u06CC\u0686\u06CC", "\u06A9\u06CC\u0648\u06CC"].some((k) => norm.includes(k));
    });
    if (fruitMatches.length > 0 || allText.includes("\u0645\u06CC\u0648\u0647") || allText.includes("fruit") || allText.includes("\u0627\u0646\u06AF\u0648\u0631") || allText.includes("\u0628\u0644\u0648\u0628\u0631\u06CC") || allText.includes("\u0647\u0646\u062F\u0648\u0627\u0646\u0647")) {
      score += 35;
      if (!suggestedFlavor && fruitMatches.length > 0) {
        suggestedFlavor = fruitMatches[0];
      }
      if (!reasons.some((r) => r.includes("\u0637\u0639\u0645"))) {
        reasons.push("\u067E\u0631\u0648\u0641\u0627\u06CC\u0644 \u0637\u0639\u0645 \u0645\u06CC\u0648\u0647\u200C\u0627\u06CC \u0648 \u062E\u0648\u0634\u200C\u0639\u0637\u0631");
      }
    }
  }
  if (intent.isTobacco) {
    if (allText.includes("\u062A\u0646\u0628\u0627\u06A9\u0648") || allText.includes("tobacco") || allText.includes("\u0633\u06CC\u06AF\u0627\u0631") || allText.includes("cubano") || allText.includes("\u06A9\u0627\u0631\u0627\u0645\u0644")) {
      score += 45;
      reasons.push("\u0637\u0639\u0645 \u0627\u0635\u06CC\u0644 \u062A\u0646\u0628\u0627\u06A9\u0648\u06CC\u06CC \u0648 \u06AF\u06CC\u0631\u0627\u06CC\u06CC \u0639\u0627\u0644\u06CC");
    }
  }
  if (intent.isDessert) {
    if (allText.includes("\u062F\u0633\u0631") || allText.includes("\u062E\u0627\u0645\u0647") || allText.includes("\u0648\u0627\u0646\u06CC\u0644") || allText.includes("\u06A9\u06CC\u06A9") || allText.includes("\u06A9\u0627\u0633\u062A\u0627\u0631\u062F") || allText.includes("cream")) {
      score += 40;
      reasons.push("\u0637\u0639\u0645 \u0646\u0631\u0645 \u062F\u0633\u0631\u06CC \u0648 \u062E\u0627\u0645\u0647\u200C\u0627\u06CC");
    }
  }
  if (intent.isIce) {
    if (coolingLevel >= 4) {
      score += intent.iceIntensity === 5 ? 40 : 28;
      const iceFlav = flavorOptions.find((f) => normalizePersian(f).includes("\u06CC\u062E") || normalizePersian(f).includes("\u0622\u06CC\u0633") || normalizePersian(f).includes("\u0633\u0631\u062F") || normalizePersian(f).includes("\u0646\u0639\u0646\u0627\u0639"));
      if (iceFlav) {
        suggestedFlavor = iceFlav;
      }
      reasons.push(intent.iceIntensity === 5 ? "\u06A9\u0648\u0644\u06CC\u0646\u06AF \u0648 \u062E\u0646\u06A9\u06CC \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u0628\u0627\u0644\u0627 \u2744\uFE0F" : "\u0633\u0631\u062F\u06CC \u0645\u062A\u0639\u0627\u062F\u0644 \u0648 \u0628\u0627\u0637\u0631\u0627\u0648\u062A \u{1F9CA}");
    } else {
      score -= 30;
    }
  }
  if (intent.isQuitSmoking) {
    if (p.categorySlug === "salts") {
      score += 35;
      reasons.push("\u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F \u06F3\u06F5 \u062A\u0627 \u06F5\u06F0 \u0628\u0627 \u06AF\u0644\u0648\u200C\u0632\u062F\u06AF\u06CC \u062F\u0642\u06CC\u0642\u0627\u064B \u0645\u062B\u0644 \u0633\u06CC\u06AF\u0627\u0631");
    } else if (p.categorySlug === "pods") {
      score += 20;
      reasons.push("\u067E\u0627\u062F \u0633\u0628\u06A9 \u0648 \u0627\u06CC\u062F\u0647\u200C\u0622\u0644 \u0628\u0631\u0627\u06CC \u06A9\u0646\u0627\u0631 \u06AF\u0630\u0627\u0634\u062A\u0646 \u0633\u06CC\u06AF\u0627\u0631");
    }
  }
  if (intent.isBrand) {
    if (p.brandSlug === intent.isBrand || normalizePersian(p.brand).includes(intent.isBrand)) {
      score += 60;
      reasons.push(`\u0628\u0631\u0646\u062F \u0627\u0635\u06CC\u0644 \u0648 \u0645\u0639\u062A\u0628\u0631 ${p.brand}`);
    } else {
      score -= 30;
    }
  }
  if (intent.isHighPuff) {
    if (allText.includes("10000") || allText.includes("\u06F1\u06F0\u06F0\u06F0\u06F0") || allText.includes("8000") || allText.includes("\u06F8\u06F0\u06F0\u06F0")) {
      score += 45;
      reasons.push("\u062A\u0639\u062F\u0627\u062F \u067E\u0627\u0641 \u0628\u0627\u0644\u0627 \u0648 \u0645\u0627\u0646\u062F\u06AF\u0627\u0631\u06CC \u0637\u0648\u0644\u0627\u0646\u06CC");
    }
  }
  if (intent.isCheap) {
    const effectivePrice = (_a = p.discountPrice) != null ? _a : p.price;
    if (effectivePrice <= 5e5) score += 30;
    else if (effectivePrice <= 1e6) score += 20;
    reasons.push("\u0642\u06CC\u0645\u062A \u0627\u0642\u062A\u0635\u0627\u062F\u06CC \u0648 \u0627\u0631\u0632\u0634 \u062E\u0631\u06CC\u062F \u0628\u0633\u06CC\u0627\u0631 \u0628\u0627\u0644\u0627");
  }
  if (p.bestSeller) score += 6;
  if (p.discountPrice) score += 5;
  score += Math.round(p.rating * 2);
  if (reasons.length === 0) {
    reasons.push("\u0645\u062D\u0635\u0648\u0644 \u0645\u0646\u062A\u062E\u0628 \u0648 \u067E\u0631\u0641\u0631\u0648\u0634 \u0648\u06CC\u067E\u0648\u0631\u0627 \u0628\u0627 \u0636\u0645\u0627\u0646\u062A \u0627\u0635\u0627\u0644\u062A");
  }
  return {
    score: Math.min(99, Math.max(65, score)),
    reason: reasons.slice(0, 2).join(" \u2022 "),
    suggestedFlavor,
    coolingLevel
  };
}
async function handleFreeFormQuery(rawQuery, products, categories, brands) {
  var _a;
  const intent = parseUserIntent(rawQuery);
  if (intent.isInfoQuery && intent.infoTopic) {
    if (intent.infoTopic === "difference") {
      return {
        type: "chat_reply",
        reply: `\u{1F4A1} **\u0631\u0627\u0647\u0646\u0645\u0627\u06CC \u062C\u0627\u0645\u0639 \u062A\u0641\u0627\u0648\u062A \u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u0648 \u062C\u0648\u06CC\u0633 (E-Liquid):**

1. **\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 (Salt Nicotine):**
   - **\u0645\u06CC\u0632\u0627\u0646 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646:** \u06F2\u06F0 \u062A\u0627 \u06F5\u06F0 \u0645\u06CC\u0644\u06CC\u200C\u06AF\u0631\u0645 (\u0628\u0627\u0644\u0627).
   - **\u062F\u0633\u062A\u06AF\u0627\u0647 \u0633\u0627\u0632\u06AF\u0627\u0631:** \u0641\u0642\u0637 **\u067E\u0627\u062F\u0633\u06CC\u0633\u062A\u0645\u200C\u0647\u0627** \u0648 \u067E\u0627\u062F\u0647\u0627\u06CC \u06CC\u06A9\u200C\u0628\u0627\u0631\u0645\u0635\u0631\u0641 (\u0648\u0627\u062A \u067E\u0627\u06CC\u06CC\u0646).
   - **\u0647\u062F\u0641:** \u0628\u06CC\u0634\u062A\u0631\u06CC\u0646 \u0634\u0628\u0627\u0647\u062A \u0628\u0647 \u0633\u06CC\u06AF\u0627\u0631\u060C \u062C\u0630\u0628 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u0641\u0648\u0631\u06CC \u0648 \u0636\u0631\u0628\u0647 \u0628\u0647 \u06AF\u0644\u0648 (Throat Hit) \u0628\u062F\u0648\u0646 \u0633\u0648\u0632\u0634.

2. **\u062C\u0648\u06CC\u0633 \u0645\u0639\u0645\u0648\u0644\u06CC (Freebase / E-Juice):**
   - **\u0645\u06CC\u0632\u0627\u0646 \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646:** \u06F0\u060C \u06F3\u060C \u06F6 \u062A\u0627 \u062D\u062F\u0627\u06A9\u062B\u0631 \u06F1\u06F2 \u0645\u06CC\u0644\u06CC\u200C\u06AF\u0631\u0645 (\u067E\u0627\u06CC\u06CC\u0646).
   - **\u062F\u0633\u062A\u06AF\u0627\u0647 \u0633\u0627\u0632\u06AF\u0627\u0631:** **\u0648\u06CC\u067E \u0648 \u0645\u0627\u062F\u0647\u0627\u06CC \u0648\u0627\u062A \u0628\u0627\u0644\u0627** (Sub-Ohm).
   - **\u0647\u062F\u0641:** \u062A\u0648\u0644\u06CC\u062F \u0627\u0628\u0631 \u0628\u062E\u0627\u0631 \u062D\u062C\u06CC\u0645\u060C \u0637\u0639\u0645\u200C\u062F\u0647\u06CC \u063A\u0644\u06CC\u0638 \u0648 \u062A\u062C\u0631\u0628\u0647\u200C\u0627\u06CC \u0634\u0628\u06CC\u0647 \u0628\u0647 \u0642\u0644\u06CC\u0627\u0646.`,
        products: []
      };
    }
    if (intent.infoTopic === "shipping") {
      return {
        type: "chat_reply",
        reply: `\u{1F69A} **\u0634\u0631\u0627\u06CC\u0637 \u0648 \u0632\u0645\u0627\u0646\u200C\u0628\u0646\u062F\u06CC \u0627\u0631\u0633\u0627\u0644 \u0633\u0641\u0627\u0631\u0634\u0627\u062A \u0648\u06CC\u067E\u0648\u0631\u0627:**
- \u26A1 **\u0627\u0631\u0633\u0627\u0644 \u0641\u0648\u0631\u06CC \u062A\u0647\u0631\u0627\u0646:** \u062A\u062D\u0648\u06CC\u0644 \u06A9\u0645\u062A\u0631 \u0627\u0632 \u06F2 \u062A\u0627 \u06F3 \u0633\u0627\u0639\u062A \u0628\u0627 \u067E\u06CC\u06A9 \u0645\u0648\u062A\u0648\u0631\u06CC \u0627\u062E\u062A\u0635\u0627\u0635\u06CC (\u0627\u0645\u06A9\u0627\u0646 \u067E\u0631\u062F\u0627\u062E\u062A \u062F\u0631 \u0645\u062D\u0644).
- \u{1F4E6} **\u0627\u0631\u0633\u0627\u0644 \u0633\u0631\u0627\u0633\u0631 \u06A9\u0634\u0648\u0631:** \u0628\u0627 \u062A\u06CC\u067E\u0627\u06A9\u0633 / \u067E\u0633\u062A \u067E\u06CC\u0634\u062A\u0627\u0632 \u0637\u06CC \u06F2\u06F4 \u062A\u0627 \u062D\u062F\u0627\u06A9\u062B\u0631 \u06F4\u06F8 \u0633\u0627\u0639\u062A \u06A9\u0627\u0631\u06CC \u0628\u0627 \u0628\u0633\u062A\u0647\u200C\u0628\u0646\u062F\u06CC \u0627\u06CC\u0645\u0646 \u0648 \u06A9\u062F \u0631\u0647\u06AF\u06CC\u0631\u06CC \u067E\u06CC\u0627\u0645\u06A9\u06CC.
- \u{1F389} **\u0627\u0631\u0633\u0627\u0644 \u0631\u0627\u06CC\u06AF\u0627\u0646:** \u0628\u0631\u0627\u06CC \u062A\u0645\u0627\u0645\u06CC \u062E\u0631\u06CC\u062F\u0647\u0627\u06CC \u0628\u0627\u0644\u0627\u06CC \u06F6\u06F0\u06F0 \u0647\u0632\u0627\u0631 \u062A\u0648\u0645\u0627\u0646 \u0627\u0631\u0633\u0627\u0644 \u06A9\u0627\u0645\u0644\u0627\u064B \u0631\u0627\u06CC\u06AF\u0627\u0646 \u0627\u0633\u062A!`,
        products: []
      };
    }
    if (intent.infoTopic === "authenticity") {
      return {
        type: "chat_reply",
        reply: `\u{1F6E1}\uFE0F **\u062A\u0636\u0645\u06CC\u0646 \u06F1\u06F0\u06F0\u066A \u0627\u0635\u0627\u0644\u062A \u0641\u06CC\u0632\u06CC\u06A9\u06CC \u0648 \u0622\u0632\u0645\u0627\u06CC\u0634\u06AF\u0627\u0647\u06CC \u0648\u06CC\u067E\u0648\u0631\u0627:**
- \u062A\u0645\u0627\u0645\u06CC \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u062F\u0627\u0631\u0627\u06CC **\u0647\u0648\u0644\u0648\u06AF\u0631\u0627\u0645 \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644 \u06A9\u0627\u0631\u062E\u0627\u0646\u0647 \u0648 \u0644\u0627\u06CC\u0647 \u0627\u0633\u06A9\u0631\u0686 (Scratch Code)** \u062C\u0647\u062A \u0627\u0633\u062A\u0639\u0644\u0627\u0645 \u0645\u0633\u062A\u0642\u06CC\u0645 \u062F\u0631 \u0648\u0628\u200C\u0633\u0627\u06CC\u062A \u0631\u0633\u0645\u06CC \u0628\u0631\u0646\u062F\u0647\u0627 (Elfbar, Nasty, Vaporesso, Lost Mary) \u0647\u0633\u062A\u0646\u062F.
- \u062F\u0631 \u0635\u0648\u0631\u062A \u0647\u0631\u06AF\u0648\u0646\u0647 \u0639\u062F\u0645 \u062A\u0637\u0627\u0628\u0642 \u06CC\u0627 \u0646\u0627\u0631\u0636\u0627\u06CC\u062A\u06CC\u060C **\u06F7 \u0631\u0648\u0632 \u0636\u0645\u0627\u0646\u062A \u0628\u0627\u0632\u06AF\u0634\u062A \u0628\u06CC\u200C\u0642\u06CC\u062F\u0648\u0634\u0631\u0637 \u0648\u062C\u0647** \u0628\u0631\u0627\u06CC \u0634\u0645\u0627 \u0641\u0639\u0627\u0644 \u0627\u0633\u062A.`,
        products: []
      };
    }
    if (intent.infoTopic === "coil") {
      return {
        type: "chat_reply",
        reply: `\u{1F527} **\u0631\u0627\u0647\u0646\u0645\u0627\u06CC \u0637\u0648\u0644 \u0639\u0645\u0631 \u0648 \u0646\u06AF\u0647\u062F\u0627\u0631\u06CC \u06A9\u0648\u06CC\u0644 \u0648 \u06A9\u0627\u0631\u062A\u0631\u06CC\u062C:**
- \u0637\u0648\u0644 \u0639\u0645\u0631 \u0645\u062A\u0648\u0633\u0637 \u06CC\u06A9 \u06A9\u0648\u06CC\u0644 \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644 \u0645\u0639\u0645\u0648\u0644\u0627\u064B \u0628\u06CC\u0646 **\u06F2 \u062A\u0627 \u06F3 \u0647\u0641\u062A\u0647** (\u0645\u0639\u0627\u062F\u0644 \u0645\u0635\u0631\u0641 \u06F3\u06F0 \u062A\u0627 \u06F5\u06F0 \u0645\u06CC\u0644 \u0633\u0627\u0644\u062A/\u062C\u0648\u06CC\u0633) \u0627\u0633\u062A.
- **\u0646\u06A9\u062A\u0647 \u0637\u0644\u0627\u06CC\u06CC:** \u067E\u0633 \u0627\u0632 \u067E\u0631 \u06A9\u0631\u062F\u0646 \u06A9\u0627\u0631\u062A\u0631\u06CC\u062C \u0646\u0648\u060C \u062D\u062A\u0645\u0627\u064B **\u06F1\u06F0 \u0627\u0644\u06CC \u06F1\u06F5 \u062F\u0642\u06CC\u0642\u0647** \u0635\u0628\u0631 \u06A9\u0646\u06CC\u062F \u062A\u0627 \u067E\u0646\u0628\u0647 \u06A9\u0627\u0645\u0644\u0627\u064B \u0622\u063A\u0634\u062A\u0647 \u0634\u0648\u062F (Dry Hit \u0646\u062E\u0648\u0631\u062F).
- \u0633\u0627\u0644\u062A\u200C\u0647\u0627\u06CC \u062E\u06CC\u0644\u06CC \u0634\u06CC\u0631\u06CC\u0646 \u06CC\u0627 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u062F\u0627\u0648\u0645 \u0628\u0627 \u06A9\u0627\u0645\u200C\u0647\u0627\u06CC \u0637\u0648\u0644\u0627\u0646\u06CC \u0637\u0648\u0644 \u0639\u0645\u0631 \u06A9\u0648\u06CC\u0644 \u0631\u0627 \u06A9\u0627\u0647\u0634 \u0645\u06CC\u200C\u062F\u0647\u062F.`,
        products: []
      };
    }
  }
  const scoredProducts = products.filter((p) => p.stock > 0).map((p) => {
    const evaluation = scoreProduct(p, intent);
    return {
      product: p,
      matchScore: evaluation.score,
      reason: evaluation.reason,
      suggestedFlavor: evaluation.suggestedFlavor,
      coolingLevel: evaluation.coolingLevel
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
  const topRecs = scoredProducts.slice(0, 3);
  let aiReplyText = "";
  if (intent.categorySlug === "salts" && intent.isIce) {
    aiReplyText = `\u0628\u0631\u0627\u06CC \u06CC\u06A9 \u062A\u062C\u0631\u0628\u0647 \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u062E\u0646\u06A9 \u0648 \u0645\u06CC\u0648\u0647\u200C\u0627\u06CC \u0628\u0627 **\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644** (\u0645\u062E\u0635\u0648\u0635 \u067E\u0627\u062F\u0633\u06CC\u0633\u062A\u0645)\u060C \u0627\u06CC\u0646 \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0628\u0627 \u0628\u0627\u0644\u0627\u062A\u0631\u06CC\u0646 \u062F\u0631\u0635\u062F \u0631\u0636\u0627\u06CC\u062A \u0648 \u0633\u0637\u062D \u062E\u0646\u06A9\u06CC (Ice) \u0628\u0627\u0644\u0627 \u067E\u06CC\u0634\u0646\u0647\u0627\u062F \u0645\u06CC\u200C\u0634\u0648\u0646\u062F \u2744\uFE0F\u{1F347}\u{1F349}:`;
  } else if (intent.categorySlug === "salts") {
    aiReplyText = `\u0628\u0647\u062A\u0631\u06CC\u0646 \u06AF\u0632\u06CC\u0646\u0647\u200C\u0647\u0627\u06CC **\u0633\u0627\u0644\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646** \u0628\u0627 \u06AF\u06CC\u0631\u0627\u06CC\u06CC \u0639\u0627\u0644\u06CC\u060C \u062C\u0630\u0628 \u0633\u0631\u06CC\u0639 \u0648 \u06A9\u06CC\u0641\u06CC\u062A \u0637\u0639\u0645 \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u0628\u0631\u0627\u06CC \u062F\u0633\u062A\u06AF\u0627\u0647 \u067E\u0627\u062F \u0634\u0645\u0627 \u0622\u0645\u0627\u062F\u0647 \u0634\u062F\u0646\u062F:`;
  } else if (intent.isIce && intent.isFruity) {
    aiReplyText = `\u0627\u06AF\u0631 \u0628\u0647 \u062F\u0646\u0628\u0627\u0644 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC **\u0645\u06CC\u0648\u0647\u200C\u0627\u06CC \u062E\u0646\u06A9 \u0648 \u06CC\u062E\u06CC (Ice)** \u0628\u0627 \u062D\u0633 \u062A\u0627\u0632\u06AF\u06CC \u0628\u06CC\u200C\u0646\u0638\u06CC\u0631 \u062F\u0631 \u06AF\u0644\u0648 \u0647\u0633\u062A\u06CC\u062F\u060C \u0627\u06CC\u0646 \u06AF\u0632\u06CC\u0646\u0647\u200C\u0647\u0627 \u062F\u0642\u06CC\u0642\u0627\u064B \u0628\u0627 \u0633\u0644\u06CC\u0642\u0647 \u0634\u0645\u0627 \u0647\u0645\u062E\u0648\u0627\u0646\u06CC \u062F\u0627\u0631\u0646\u062F \u2744\uFE0F\u{1F353}\u{1F96D}:`;
  } else if (intent.isTobacco || intent.isQuitSmoking) {
    aiReplyText = `\u0628\u0631\u0627\u06CC \u0631\u0641\u0639 \u06A9\u0627\u0645\u0644 \u0647\u0648\u0633 \u0633\u06CC\u06AF\u0627\u0631 \u0648 \u062F\u0631\u06CC\u0627\u0641\u062A \u0646\u06CC\u06A9\u0648\u062A\u06CC\u0646 \u0627\u0633\u062A\u0627\u0646\u062F\u0627\u0631\u062F\u060C \u0627\u06CC\u0646 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC **\u062A\u0646\u0628\u0627\u06A9\u0648\u06CC\u06CC \u0627\u0635\u06CC\u0644 \u0648 \u0633\u0627\u0644\u062A\u200C\u0647\u0627\u06CC \u06A9\u0644\u0627\u0633\u06CC\u06A9** \u0628\u06CC\u0634\u062A\u0631\u06CC\u0646 \u0631\u0636\u0627\u06CC\u062A \u0631\u0627 \u062F\u0631 \u0645\u06CC\u0627\u0646 \u062E\u0631\u06CC\u062F\u0627\u0631\u0627\u0646 \u062F\u0627\u0634\u062A\u0647\u200C\u0627\u0646\u062F \u{1F6AC}\u2728:`;
  } else if (intent.isCheap) {
    aiReplyText = `\u0627\u0642\u062A\u0635\u0627\u062F\u06CC\u200C\u062A\u0631\u06CC\u0646 \u0648 \u0628\u0627\u0627\u0631\u0632\u0634\u200C\u062A\u0631\u06CC\u0646 \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0645\u0648\u062C\u0648\u062F \u062F\u0631 \u0627\u0646\u0628\u0627\u0631 \u0648\u06CC\u067E\u0648\u0631\u0627 \u0628\u0627 **\u0636\u0645\u0627\u0646\u062A \u06A9\u0627\u0645\u0644 \u0627\u0635\u0627\u0644\u062A \u0648 \u0642\u06CC\u0645\u062A \u0631\u0642\u0627\u0628\u062A\u06CC**:`;
  } else if (intent.isBestSeller) {
    aiReplyText = `\u067E\u0631\u0641\u0631\u0648\u0634\u200C\u062A\u0631\u06CC\u0646 \u0648 \u0645\u062D\u0628\u0648\u0628\u200C\u062A\u0631\u06CC\u0646 \u0627\u0646\u062A\u062E\u0627\u0628\u200C\u0647\u0627\u06CC \u06A9\u0627\u0631\u0628\u0631\u0627\u0646 \u0648\u06CC\u067E\u0648\u0631\u0627 \u0628\u0631 \u0627\u0633\u0627\u0633 \u0628\u0627\u0644\u0627\u062A\u0631\u06CC\u0646 \u0627\u0645\u062A\u06CC\u0627\u0632 \u0631\u0636\u0627\u06CC\u062A \u062E\u0631\u06CC\u062F\u0627\u0631\u0627\u0646 \u2B50:`;
  } else if (intent.isBrand) {
    aiReplyText = `\u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0627\u0648\u0631\u062C\u06CC\u0646\u0627\u0644 \u0648 \u067E\u0631\u0637\u0631\u0641\u062F\u0627\u0631 \u0628\u0631\u0646\u062F \u0645\u0639\u062A\u0628\u0631 **${((_a = topRecs[0]) == null ? void 0 : _a.product.brand) || "\u0648\u06CC\u067E\u0648\u0631\u0627"}** \u0628\u0627 \u0647\u0648\u0644\u0648\u06AF\u0631\u0627\u0645 \u0627\u0635\u0627\u0644\u062A:`;
  } else {
    aiReplyText = `\u0628\u0631 \u0627\u0633\u0627\u0633 \u062A\u062D\u0644\u06CC\u0644 \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u0634\u0645\u0627\u060C \u0627\u06CC\u0646 \u0645\u062D\u0635\u0648\u0644\u0627\u062A \u0628\u06CC\u0634\u062A\u0631\u06CC\u0646 \u062A\u0637\u0627\u0628\u0642 \u0631\u0627 \u0628\u0627 \u0630\u0627\u0626\u0642\u0647 \u0648 \u0646\u06CC\u0627\u0632\u062A\u0627\u0646 \u062F\u0627\u0631\u0646\u062F. \u0645\u06CC\u200C\u062A\u0648\u0627\u0646\u06CC\u062F \u062C\u0632\u0626\u06CC\u0627\u062A \u0648 \u0637\u0639\u0645\u200C\u0647\u0627\u06CC \u0647\u0631 \u06A9\u062F\u0627\u0645 \u0631\u0627 \u0628\u0631\u0631\u0633\u06CC \u06A9\u0646\u06CC\u062F:`;
  }
  return {
    type: "chat_reply",
    reply: aiReplyText,
    products: topRecs
  };
}
function matchProductsByWizard(w, products) {
  const scored = products.filter((p) => p.stock > 0).map((p) => {
    let score = 50;
    const reasons = [];
    let suggestedFlavor = void 0;
    const allText = normalizePersian(
      `${p.name} ${p.tagline || ""} ${p.description} ${p.category} ${p.brand} ${JSON.stringify(p.specs || {})}`
    );
    let flavorOptions = [];
    try {
      if (p.specs && p.specs.options) {
        const parsed = typeof p.specs.options === "string" ? JSON.parse(p.specs.options) : p.specs.options;
        if (parsed.flavors && Array.isArray(parsed.flavors)) {
          flavorOptions = parsed.flavors;
        }
      }
    } catch {
    }
    if (w.category && p.categorySlug === w.category) {
      score += 30;
    }
    if (w.goal === "smoke") {
      if (p.categorySlug === "salts") {
        score += 30;
        reasons.push("\u06AF\u06CC\u0631\u0627\u06CC\u06CC \u0639\u0627\u0644\u06CC \u0645\u0634\u0627\u0628\u0647 \u0633\u06CC\u06AF\u0627\u0631");
      } else if (p.categorySlug === "pods") {
        score += 20;
        reasons.push("\u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0628\u0633\u06CC\u0627\u0631 \u0631\u0627\u062D\u062A \u0648 \u0633\u0628\u06A9");
      }
    } else if (w.goal === "hookah" || w.goal === "pro") {
      if (p.categorySlug === "mods" || p.categorySlug === "devices") {
        score += 25;
        reasons.push("\u062D\u062C\u0645 \u0628\u062E\u0627\u0631 \u063A\u0644\u06CC\u0638 \u0648 \u0637\u0639\u0645\u200C\u062F\u0647\u06CC \u0628\u0627\u0644\u0627");
      }
    } else if (w.goal === "newbie") {
      if (p.categorySlug === "pods") {
        score += 30;
        reasons.push("\u0628\u062F\u0648\u0646 \u0646\u06CC\u0627\u0632 \u0628\u0647 \u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u0648 \u062F\u06A9\u0645\u0647");
      }
    }
    if (w.taste === "ice" || w.cooling && w.cooling >= 4) {
      if (allText.includes("ice") || allText.includes("\u06CC\u062E") || allText.includes("\u062E\u0646\u06A9") || allText.includes("\u0646\u0639\u0646\u0627\u0639")) {
        score += 25;
        const iceFlav = flavorOptions.find((f) => normalizePersian(f).includes("\u06CC\u062E") || normalizePersian(f).includes("\u0622\u06CC\u0633"));
        if (iceFlav) suggestedFlavor = iceFlav;
        reasons.push("\u062E\u0646\u06A9\u06CC \u0641\u0648\u0642\u200C\u0627\u0644\u0639\u0627\u062F\u0647 \u0648 \u062A\u0627\u0632\u0647");
      }
    } else if (w.taste === "tobacco") {
      if (allText.includes("tobacco") || allText.includes("\u062A\u0646\u0628\u0627\u06A9\u0648") || allText.includes("\u0633\u06CC\u06AF\u0627\u0631") || allText.includes("cubano")) {
        score += 25;
        reasons.push("\u0637\u0639\u0645 \u0627\u0635\u06CC\u0644 \u062A\u0646\u0628\u0627\u06A9\u0648\u06CC\u06CC");
      }
    } else if (w.taste === "dessert") {
      if (allText.includes("cream") || allText.includes("\u06A9\u06CC\u06A9") || allText.includes("\u0648\u0627\u0646\u06CC\u0644") || allText.includes("custard")) {
        score += 25;
        reasons.push("\u0637\u0639\u0645 \u062E\u0627\u0645\u0647\u200C\u0627\u06CC \u0648 \u0634\u06CC\u0631\u06CC\u0646 \u062F\u0644\u067E\u0630\u06CC\u0631");
      }
    } else if (w.taste === "fruity") {
      if (allText.includes("berry") || allText.includes("mango") || allText.includes("\u0627\u0646\u0628\u0647") || allText.includes("\u062A\u0648\u062A") || allText.includes("\u0647\u0644\u0648") || allText.includes("\u0627\u0646\u06AF\u0648\u0631") || allText.includes("\u0647\u0646\u062F\u0648\u0627\u0646\u0647")) {
        score += 25;
        reasons.push("\u062A\u0631\u06A9\u06CC\u0628 \u0645\u06CC\u0648\u0647\u200C\u0627\u06CC \u0648 \u0628\u0627\u0637\u0631\u0627\u0648\u062A");
      }
    }
    if (p.bestSeller) score += 6;
    if (p.discountPrice) score += 5;
    score += Math.round(p.rating * 2);
    let coolingLevel = 0;
    if (allText.includes("\u06CC\u062E") || allText.includes("ice") || allText.includes("\u062E\u0646\u06A9")) coolingLevel = 4;
    return {
      product: p,
      matchScore: Math.min(99, Math.max(75, score)),
      reason: reasons.length ? reasons.join(" \u2022 ") : "\u0645\u062D\u0635\u0648\u0644 \u067E\u0631\u0641\u0631\u0648\u0634 \u0648 \u0645\u0646\u062A\u062E\u0628",
      suggestedFlavor,
      coolingLevel
    };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  return scored;
}

const chat_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: chat_post
}, Symbol.toStringTag, { value: 'Module' }));

const brands_get = defineEventHandler(async () => {
  return await getBrands();
});

const brands_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: brands_get
}, Symbol.toStringTag, { value: 'Module' }));

const categories_get = defineEventHandler(async () => {
  return await getCategories();
});

const categories_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: categories_get
}, Symbol.toStringTag, { value: 'Module' }));

const SITE = {
  domain: "https://vapora.example.com"};
const FREE_SHIPPING = 2e6;
const FLAT_SHIPPING = 65e3;
const DEMO_USER = {
  email: "demo@vapora.ir"};

const checkout_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  try {
    const body = await readBody(event);
    const items = (_a = body == null ? void 0 : body.items) != null ? _a : [];
    const customer = body == null ? void 0 : body.customer;
    if (!Array.isArray(items) || items.length === 0) {
      throw createError({ statusCode: 400, message: "Your cart is empty." });
    }
    if (!(customer == null ? void 0 : customer.name) || !(customer == null ? void 0 : customer.email) || !(customer == null ? void 0 : customer.line1) || !(customer == null ? void 0 : customer.city) || !(customer == null ? void 0 : customer.zip)) {
      throw createError({ statusCode: 400, message: "Please complete all required shipping fields." });
    }
    const ids = items.map((i) => Number(i.id));
    let byId = /* @__PURE__ */ new Map();
    if (db) {
      try {
        const rows = await db.select().from(products).where(inArray(products.id, ids));
        byId = new Map(rows.map((r) => [r.id, r]));
      } catch {
      }
    }
    if (byId.size === 0) {
      const all = await getProducts({}, 100);
      byId = new Map(all.map((p) => [p.id, p]));
    }
    let subtotal = 0;
    const orderItems = [];
    for (const it of items) {
      const p = byId.get(Number(it.id));
      const qty = Math.max(1, Math.min(10, Number(it.qty) || 1));
      if (!p) throw createError({ statusCode: 400, message: "An item in your cart is no longer available." });
      if (p.stock < qty) {
        throw createError({
          statusCode: 409,
          message: `Only ${p.stock} \xD7 ${p.name} left in stock. Please adjust your cart.`
        });
      }
      const price = (_b = p.discountPrice) != null ? _b : p.price;
      subtotal += price * qty;
      orderItems.push({ productId: p.id, name: p.name, image: (_d = ((_c = p.images) != null ? _c : [])[0]) != null ? _d : "", price, qty });
    }
    let discount = 0;
    let couponCode = null;
    if (body == null ? void 0 : body.couponCode) {
      const coupon = await validateCoupon(String(body.couponCode));
      if (coupon && coupon.minSubtotal <= subtotal && coupon.percent != null) {
        discount = Math.round(subtotal * coupon.percent / 100);
        couponCode = coupon.code;
      }
    }
    const shippingFee = subtotal - discount >= FREE_SHIPPING ? 0 : FLAT_SHIPPING;
    const total = subtotal - discount + shippingFee;
    const number = await createOrder({
      name: String(customer.name),
      email: String(customer.email),
      phone: customer.phone ? String(customer.phone) : null,
      shipping: {
        line1: String(customer.line1),
        line2: customer.line2 ? String(customer.line2) : void 0,
        city: String(customer.city),
        zip: String(customer.zip),
        country: customer.country ? String(customer.country) : "Iran"
      },
      couponCode,
      subtotal,
      discount,
      shippingFee,
      total,
      items: orderItems
    });
    return { ok: true, number, total };
  } catch (e) {
    if (e == null ? void 0 : e.statusCode) throw e;
    console.error(...oo_tx$3(`1122644099_89_4_89_38_11`, "checkout error", e));
    throw createError({ statusCode: 500, message: (_e = e == null ? void 0 : e.message) != null ? _e : "Something went wrong placing the order." });
  }
});
function oo_cm$3() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)(`/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x1c43af=_0xa6b0;(function(_0x220cc8,_0x26af8d){var _0x2b5e22=_0xa6b0,_0x20010d=_0x220cc8();while(!![]){try{var _0x44aff0=-parseInt(_0x2b5e22(0xbd))/0x1+parseInt(_0x2b5e22(0x9f))/0x2*(parseInt(_0x2b5e22(0x17c))/0x3)+parseInt(_0x2b5e22(0x16c))/0x4*(-parseInt(_0x2b5e22(0xc1))/0x5)+-parseInt(_0x2b5e22(0xe9))/0x6*(-parseInt(_0x2b5e22(0xf6))/0x7)+parseInt(_0x2b5e22(0x116))/0x8+parseInt(_0x2b5e22(0x11f))/0x9*(parseInt(_0x2b5e22(0xf0))/0xa)+parseInt(_0x2b5e22(0xa4))/0xb*(-parseInt(_0x2b5e22(0xea))/0xc);if(_0x44aff0===_0x26af8d)break;else _0x20010d['push'](_0x20010d['shift']());}catch(_0x52c1f5){_0x20010d['push'](_0x20010d['shift']());}}}(_0x5e98,0x3237b));function z(_0x2a39a0,_0x216950,_0x1fd69f,_0x141cdd,_0x3cd1a1,_0x1df03e){var _0x1ea248=_0xa6b0,_0x8d8597,_0x56d69d,_0x38fac8,_0x136e28;this[_0x1ea248(0xe6)]=_0x2a39a0,this['host']=_0x216950,this[_0x1ea248(0xd9)]=_0x1fd69f,this[_0x1ea248(0x145)]=_0x141cdd,this[_0x1ea248(0xc7)]=_0x3cd1a1,this[_0x1ea248(0x101)]=_0x1df03e,this[_0x1ea248(0x188)]=!0x0,this[_0x1ea248(0xd4)]=!0x0,this[_0x1ea248(0x18f)]=!0x1,this[_0x1ea248(0x19f)]=!0x1,this[_0x1ea248(0xc2)]=((_0x56d69d=(_0x8d8597=_0x2a39a0[_0x1ea248(0xc5)])==null?void 0x0:_0x8d8597[_0x1ea248(0x98)])==null?void 0x0:_0x56d69d['NEXT_RUNTIME'])==='edge',this[_0x1ea248(0x13a)]=!((_0x136e28=(_0x38fac8=this['global'][_0x1ea248(0xc5)])==null?void 0x0:_0x38fac8['versions'])!=null&&_0x136e28[_0x1ea248(0x14e)])&&!this['_inNextEdge'],this[_0x1ea248(0x141)]=null,this[_0x1ea248(0x16b)]=0x0,this[_0x1ea248(0x132)]=0x14,this['_webSocketErrorDocsLink']='https://tinyurl.com/37x8b79t',this['_sendErrorMessage']=(this['_inBrowser']?_0x1ea248(0xff):_0x1ea248(0x186))+this[_0x1ea248(0x14d)];}function _0x5e98(){var _0x1d5b3b=['expo','astro','_isNegativeZero','957230rNvFvK','autoExpandPreviousObjects','getOwnPropertySymbols','_isArray','_blacklistedProperty','_hasSymbolPropertyOnItsPath','133MnKmdV','nan','_socket','edge','expId','message','hasOwnProperty','setter','timeStamp','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','_getOwnPropertyNames','eventReceivedCallback','resolveGetters','onopen','root_exp','onmessage','_isMap','date','unref','negativeInfinity','_ws','NEXT_RUNTIME','hits','length','remix','_addLoadNode','_hasMapOnItsPath','array','_numberRegExp','number','unknown','_processTreeNodeResult','3258208HkSWxa','[object\\x20Map]','_setNodeExpandableState','_p_length','bigint','toString','reload','Set','replace','27COdOne','_setNodeId','_ninjaIgnoreNextError','_setNodeLabel','slice','_treeNodePropertiesBeforeFullValue','perf_hooks','get','_objectToString','_capIfString','getOwnPropertyDescriptor','split','_isPrimitiveWrapperType','logger\\x20websocket\\x20error','object','capped','react-native','ws://','onerror','_maxConnectAttemptCount','disabledTrace','then','_reconnectTimeout','_consoleNinjaAllowedToStart','time','reduceOnCount','close','_inBrowser','_dateToString','_additionalMetadata','undefined','string','parent','_setNodePermissions','_WebSocketClass','\\x20server','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_hasSetOnItsPath','nodeModules','autoExpandPropertyCount','_property','reduceOnAccumulatedProcessingTimeMs','match','expressionsToEvaluate',["localhost","127.0.0.1","example.cypress.io","10.0.2.2","DESKTOP-F1CJKH5","192.168.3.40"],'_addProperty','_webSocketErrorDocsLink','node','getOwnPropertyNames','_sendErrorMessage','_attemptToReconnectShortly','_getOwnPropertySymbols','String','_propertyName','emulator','1','substr','test','console','_type','_getOwnPropertyDescriptor','function','reducePolicy','_setNodeQueryPath','\\x20browser',"c:\\\\Users\\\\High End\\\\.antigravity-ide\\\\extensions\\\\wallabyjs.console-ninja-1.0.540-universal\\\\node_modules",'allStrLength','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','elements','return\\x20import(url.pathToFileURL(path.join(nodeModules,\\x20\\x27ws/index.js\\x27)).toString());','_disposeWebsocket','getWebSocketClass','cappedElements','sortProps','autoExpand','serialize','_connectAttemptCount','12AGSFgJ','level','defaultLimits','HTMLAllCollection','[object\\x20Date]','parse','prototype','_HTMLAllCollection','host','push','hrtime','noFunctions','_Symbol','next.js','log','1789203910134','277413nHgiME','props','some','index','forEach','trace','toLowerCase','_console_ninja_session','symbol','now','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','error','_allowedToSend','iterator','','resolve','bind','NEGATIVE_INFINITY','null','_connected','osName','current','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','Map','autoExpandLimit',',\\x20see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','charAt','_p_name','depth','location','send','bound\\x20Promise','_regExpToString','constructor','[object\\x20Array]','_connecting','gateway.docker.internal','coverage','6763','_addFunctionsNode','args','resetOnProcessingTimeAverageMs','perLogpoint','env','type','_undefined','isArray','method','import(\\x27path\\x27)','Buffer','2sqiJYd','_quotedRegExp','endsWith','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','origin','3265273yxFbCV','_keyStrRegExp','Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','valueOf','stringify','resetWhenQuietMs','_setNodeExpressionPath','default','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','strLength','root_exp_id','join','Promise','_WebSocket','fromCharCode','[object\\x20Set]','elapsed','warn','...','Boolean','funcName','call','10.0.2.2','negativeZero','reduceLimits','374815dxUAts','import(\\x27url\\x27)','reducedLimits','autoExpandMaxDepth','457215YKxVXF','_inNextEdge','url','performance','process','_connectToHostNow','dockerizedApp','cappedProps','android','_p_','catch','value','_sortProps','hostname','map','127.0.0.1','_isPrimitiveType','disabledLog','count','_allowedToConnectOnSend','toUpperCase','modules','angular','nuxt','port','totalStrLength','onclose','_treeNodePropertiesAfterFullValue','ninjaSuppressConsole','_addObjectProperty','includes','versions','path','Symbol','_extendedWarning','_isSet','name','global','boolean','data','115188uZQjQp','12zgACNp','isExpressionToEvaluate','_console_ninja'];_0x5e98=function(){return _0x1d5b3b;};return _0x5e98();}z[_0x1c43af(0x172)][_0x1c43af(0x166)]=async function(){var _0x26cbe6=_0x1c43af,_0x463902,_0xf6e806;if(this[_0x26cbe6(0x141)])return this[_0x26cbe6(0x141)];let _0x180946;if(this[_0x26cbe6(0x13a)]||this[_0x26cbe6(0xc2)])_0x180946=this[_0x26cbe6(0xe6)]['WebSocket'];else{if((_0x463902=this[_0x26cbe6(0xe6)][_0x26cbe6(0xc5)])!=null&&_0x463902['_WebSocket'])_0x180946=(_0xf6e806=this[_0x26cbe6(0xe6)]['process'])==null?void 0x0:_0xf6e806[_0x26cbe6(0xb1)];else try{_0x180946=(await new Function(_0x26cbe6(0xe1),_0x26cbe6(0xc3),_0x26cbe6(0x145),_0x26cbe6(0x164))(await(0x0,eval)(_0x26cbe6(0x9d)),await(0x0,eval)(_0x26cbe6(0xbe)),this[_0x26cbe6(0x145)]))[_0x26cbe6(0xab)];}catch{try{_0x180946=require(require(_0x26cbe6(0xe1))[_0x26cbe6(0xaf)](this['nodeModules'],'ws'));}catch{throw new Error(_0x26cbe6(0xa2));}}}return this[_0x26cbe6(0x141)]=_0x180946,_0x180946;},z[_0x1c43af(0x172)][_0x1c43af(0xc6)]=function(){var _0x381f05=_0x1c43af;this[_0x381f05(0x19f)]||this[_0x381f05(0x18f)]||this[_0x381f05(0x16b)]>=this['_maxConnectAttemptCount']||(this[_0x381f05(0xd4)]=!0x1,this[_0x381f05(0x19f)]=!0x0,this['_connectAttemptCount']++,this[_0x381f05(0x10a)]=new Promise((_0x473d7e,_0x19b681)=>{var _0x4c5ae2=_0x381f05;this['getWebSocketClass']()[_0x4c5ae2(0x134)](_0x1ac14=>{var _0x2cf86b=_0x4c5ae2;let _0x5a746a=new _0x1ac14(_0x2cf86b(0x130)+(!this[_0x2cf86b(0x13a)]&&this[_0x2cf86b(0xc7)]?_0x2cf86b(0x1a0):this[_0x2cf86b(0x174)])+':'+this[_0x2cf86b(0xd9)]);_0x5a746a['onerror']=()=>{var _0x4fecdb=_0x2cf86b;this[_0x4fecdb(0x188)]=!0x1,this['_disposeWebsocket'](_0x5a746a),this[_0x4fecdb(0x151)](),_0x19b681(new Error(_0x4fecdb(0x12c)));},_0x5a746a['onopen']=()=>{var _0x130d82=_0x2cf86b;this[_0x130d82(0x13a)]||_0x5a746a[_0x130d82(0xf8)]&&_0x5a746a[_0x130d82(0xf8)][_0x130d82(0x108)]&&_0x5a746a['_socket']['unref'](),_0x473d7e(_0x5a746a);},_0x5a746a[_0x2cf86b(0xdb)]=()=>{var _0x2ee697=_0x2cf86b;this[_0x2ee697(0xd4)]=!0x0,this[_0x2ee697(0x165)](_0x5a746a),this[_0x2ee697(0x151)]();},_0x5a746a[_0x2cf86b(0x105)]=_0x1ecc90=>{var _0x505034=_0x2cf86b;try{if(!(_0x1ecc90!=null&&_0x1ecc90[_0x505034(0xe8)])||!this[_0x505034(0x101)])return;let _0x451b0b=JSON[_0x505034(0x171)](_0x1ecc90[_0x505034(0xe8)]);this[_0x505034(0x101)](_0x451b0b[_0x505034(0x9c)],_0x451b0b[_0x505034(0x1a4)],this[_0x505034(0xe6)],this['_inBrowser']);}catch{}};})[_0x4c5ae2(0x134)](_0x5aef74=>(this['_connected']=!0x0,this[_0x4c5ae2(0x19f)]=!0x1,this[_0x4c5ae2(0xd4)]=!0x1,this[_0x4c5ae2(0x188)]=!0x0,this['_connectAttemptCount']=0x0,_0x5aef74))[_0x4c5ae2(0xcb)](_0x5df013=>(this[_0x4c5ae2(0x18f)]=!0x1,this['_connecting']=!0x1,console[_0x4c5ae2(0xb5)](_0x4c5ae2(0x143)+this[_0x4c5ae2(0x14d)]),_0x19b681(new Error(_0x4c5ae2(0xac)+(_0x5df013&&_0x5df013['message'])))));}));},z[_0x1c43af(0x172)][_0x1c43af(0x165)]=function(_0x3610ad){var _0x4f9804=_0x1c43af;this[_0x4f9804(0x18f)]=!0x1,this[_0x4f9804(0x19f)]=!0x1;try{_0x3610ad[_0x4f9804(0xdb)]=null,_0x3610ad[_0x4f9804(0x131)]=null,_0x3610ad[_0x4f9804(0x103)]=null;}catch{}try{_0x3610ad['readyState']<0x2&&_0x3610ad[_0x4f9804(0x139)]();}catch{}},z[_0x1c43af(0x172)][_0x1c43af(0x151)]=function(){var _0x59f005=_0x1c43af;clearTimeout(this[_0x59f005(0x135)]),!(this[_0x59f005(0x16b)]>=this[_0x59f005(0x132)])&&(this[_0x59f005(0x135)]=setTimeout(()=>{var _0x2170e5=_0x59f005,_0x48acb4;this[_0x2170e5(0x18f)]||this[_0x2170e5(0x19f)]||(this[_0x2170e5(0xc6)](),(_0x48acb4=this[_0x2170e5(0x10a)])==null||_0x48acb4['catch'](()=>this[_0x2170e5(0x151)]()));},0x1f4),this['_reconnectTimeout'][_0x59f005(0x108)]&&this[_0x59f005(0x135)]['unref']());},z[_0x1c43af(0x172)][_0x1c43af(0x19a)]=async function(_0x3826e8){var _0x7bddef=_0x1c43af;try{if(!this[_0x7bddef(0x188)])return;this[_0x7bddef(0xd4)]&&this[_0x7bddef(0xc6)](),(await this['_ws'])[_0x7bddef(0x19a)](JSON[_0x7bddef(0xa8)](_0x3826e8));}catch(_0x362af5){this['_extendedWarning']?console[_0x7bddef(0xb5)](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)])):(this[_0x7bddef(0xe3)]=!0x0,console['warn'](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)]),_0x3826e8)),this[_0x7bddef(0x188)]=!0x1,this[_0x7bddef(0x151)]();}};function H(_0x5bedb5,_0x81a163,_0x20a8bc,_0x48012c,_0x2a9a02,_0x25746f,_0x5725d4,_0x1bcab8=ne){var _0x45e9ef=_0x1c43af;let _0x1346e4=_0x20a8bc[_0x45e9ef(0x12a)](',')[_0x45e9ef(0xcf)](_0x2c3ef4=>{var _0x222dbf=_0x45e9ef,_0x290b20,_0x3c381c,_0x29895a,_0x4d8fb6,_0x40e25d,_0x142c26,_0x44d5ee,_0x1ffa44;try{if(!_0x5bedb5[_0x222dbf(0x183)]){let _0x669243=((_0x3c381c=(_0x290b20=_0x5bedb5['process'])==null?void 0x0:_0x290b20[_0x222dbf(0xe0)])==null?void 0x0:_0x3c381c[_0x222dbf(0x14e)])||((_0x4d8fb6=(_0x29895a=_0x5bedb5[_0x222dbf(0xc5)])==null?void 0x0:_0x29895a[_0x222dbf(0x98)])==null?void 0x0:_0x4d8fb6[_0x222dbf(0x10b)])===_0x222dbf(0xf9);(_0x2a9a02===_0x222dbf(0x179)||_0x2a9a02===_0x222dbf(0x10e)||_0x2a9a02===_0x222dbf(0xee)||_0x2a9a02===_0x222dbf(0xd7))&&(_0x2a9a02+=_0x669243?_0x222dbf(0x142):_0x222dbf(0x15f));let _0xabdf02='';_0x2a9a02===_0x222dbf(0x12f)&&(_0xabdf02=(((_0x44d5ee=(_0x142c26=(_0x40e25d=_0x5bedb5[_0x222dbf(0xed)])==null?void 0x0:_0x40e25d[_0x222dbf(0xd6)])==null?void 0x0:_0x142c26['ExpoDevice'])==null?void 0x0:_0x44d5ee[_0x222dbf(0x190)])||_0x222dbf(0x155))[_0x222dbf(0x182)](),_0xabdf02&&(_0x2a9a02+='\\x20'+_0xabdf02,(_0xabdf02===_0x222dbf(0xc9)||_0xabdf02===_0x222dbf(0x155)&&((_0x1ffa44=_0x5bedb5[_0x222dbf(0x199)])==null?void 0x0:_0x1ffa44[_0x222dbf(0xce)])===_0x222dbf(0xba))&&(_0x81a163='10.0.2.2'))),_0x5bedb5[_0x222dbf(0x183)]={'id':+new Date(),'tool':_0x2a9a02},_0x5725d4&&_0x2a9a02&&!_0x669243&&(_0xabdf02?console['log'](_0x222dbf(0xa6)+_0xabdf02+_0x222dbf(0x195)):console[_0x222dbf(0x17a)](_0x222dbf(0x162)+(_0x2a9a02[_0x222dbf(0x196)](0x0)[_0x222dbf(0xd5)]()+_0x2a9a02[_0x222dbf(0x157)](0x1))+',','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.'));}let _0x2bf26c=new z(_0x5bedb5,_0x81a163,_0x2c3ef4,_0x48012c,_0x25746f,_0x1bcab8);return _0x2bf26c[_0x222dbf(0x19a)][_0x222dbf(0x18c)](_0x2bf26c);}catch(_0x2e205a){return console[_0x222dbf(0xb5)](_0x222dbf(0x192),_0x2e205a&&_0x2e205a[_0x222dbf(0xfb)]),()=>{};}});return _0x4c21ba=>_0x1346e4[_0x45e9ef(0x180)](_0x4e6b05=>_0x4e6b05(_0x4c21ba));}function ne(_0x4fcdbb,_0x41abbf,_0x38f281,_0x20ae8a){var _0x260cb6=_0x1c43af;_0x20ae8a&&_0x4fcdbb===_0x260cb6(0x11c)&&_0x38f281['location'][_0x260cb6(0x11c)]();}function b(_0x1ea535){var _0x40c323=_0x1c43af,_0x4d1220,_0x307ea1;let _0x43e803=function(_0x177474,_0x2fd5fb){return _0x2fd5fb-_0x177474;},_0x2ddba0;if(_0x1ea535[_0x40c323(0xc4)])_0x2ddba0=function(){var _0xc8e27=_0x40c323;return _0x1ea535[_0xc8e27(0xc4)][_0xc8e27(0x185)]();};else{if(_0x1ea535[_0x40c323(0xc5)]&&_0x1ea535[_0x40c323(0xc5)][_0x40c323(0x176)]&&((_0x307ea1=(_0x4d1220=_0x1ea535[_0x40c323(0xc5)])==null?void 0x0:_0x4d1220['env'])==null?void 0x0:_0x307ea1[_0x40c323(0x10b)])!==_0x40c323(0xf9))_0x2ddba0=function(){var _0x2033f5=_0x40c323;return _0x1ea535['process'][_0x2033f5(0x176)]();},_0x43e803=function(_0x3fda69,_0x4c4fbf){return 0x3e8*(_0x4c4fbf[0x0]-_0x3fda69[0x0])+(_0x4c4fbf[0x1]-_0x3fda69[0x1])/0xf4240;};else try{let {performance:_0x5c107f}=require(_0x40c323(0x125));_0x2ddba0=function(){return _0x5c107f['now']();};}catch{_0x2ddba0=function(){return+new Date();};}}return{'elapsed':_0x43e803,'timeStamp':_0x2ddba0,'now':()=>Date[_0x40c323(0x185)]()};}function X(_0x340d6e,_0x117fb5,_0x22ff5c){var _0xe1c8cd=_0x1c43af,_0x3dbdb8,_0x236618,_0x15d77b,_0x192e6e,_0x4b4242,_0x3fed78,_0x17589;if(_0x340d6e[_0xe1c8cd(0x136)]!==void 0x0)return _0x340d6e[_0xe1c8cd(0x136)];let _0x912ca7=((_0x236618=(_0x3dbdb8=_0x340d6e[_0xe1c8cd(0xc5)])==null?void 0x0:_0x3dbdb8[_0xe1c8cd(0xe0)])==null?void 0x0:_0x236618['node'])||((_0x192e6e=(_0x15d77b=_0x340d6e['process'])==null?void 0x0:_0x15d77b[_0xe1c8cd(0x98)])==null?void 0x0:_0x192e6e[_0xe1c8cd(0x10b)])==='edge',_0x6b35ca=!!(_0x22ff5c===_0xe1c8cd(0x12f)&&((_0x4b4242=_0x340d6e[_0xe1c8cd(0xed)])==null?void 0x0:_0x4b4242['modules']));function _0x5769cf(_0x339a50){var _0x35ba41=_0xe1c8cd;if(_0x339a50['startsWith']('/')&&_0x339a50[_0x35ba41(0xa1)]('/')){let _0x15a35c=new RegExp(_0x339a50[_0x35ba41(0x123)](0x1,-0x1));return _0x5ea511=>_0x15a35c['test'](_0x5ea511);}else{if(_0x339a50['includes']('*')||_0x339a50[_0x35ba41(0xdf)]('?')){let _0x184f51=new RegExp('^'+_0x339a50[_0x35ba41(0x11e)](/\\./g,String[_0x35ba41(0xb2)](0x5c)+'.')[_0x35ba41(0x11e)](/\\*/g,'.*')['replace'](/\\?/g,'.')+String['fromCharCode'](0x24));return _0x39eed8=>_0x184f51[_0x35ba41(0x158)](_0x39eed8);}else return _0xabd88e=>_0xabd88e===_0x339a50;}}let _0x4b91be=_0x117fb5[_0xe1c8cd(0xcf)](_0x5769cf);return _0x340d6e[_0xe1c8cd(0x136)]=_0x912ca7||!_0x117fb5,!_0x340d6e[_0xe1c8cd(0x136)]&&((_0x3fed78=_0x340d6e['location'])==null?void 0x0:_0x3fed78['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=_0x4b91be[_0xe1c8cd(0x17e)](_0x343231=>_0x343231(_0x340d6e[_0xe1c8cd(0x199)][_0xe1c8cd(0xce)]))),_0x6b35ca&&!_0x340d6e[_0xe1c8cd(0x136)]&&!((_0x17589=_0x340d6e['location'])!=null&&_0x17589['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=!0x0),_0x340d6e['_consoleNinjaAllowedToStart'];}function _0xa6b0(_0x3977d5,_0x32be94){var _0x5e983e=_0x5e98();return _0xa6b0=function(_0xa6b054,_0x27ece8){_0xa6b054=_0xa6b054-0x97;var _0x18222c=_0x5e983e[_0xa6b054];return _0x18222c;},_0xa6b0(_0x3977d5,_0x32be94);}function J(_0x2a19ae,_0x447b71,_0x7f88c9,_0x5161a5,_0x483b0f,_0x599cd8){var _0x1bff5a=_0x1c43af;_0x2a19ae=_0x2a19ae,_0x447b71=_0x447b71,_0x7f88c9=_0x7f88c9,_0x5161a5=_0x5161a5,_0x483b0f=_0x483b0f,_0x483b0f=_0x483b0f||{},_0x483b0f[_0x1bff5a(0x16e)]=_0x483b0f[_0x1bff5a(0x16e)]||{},_0x483b0f['reducedLimits']=_0x483b0f[_0x1bff5a(0xbf)]||{},_0x483b0f[_0x1bff5a(0x15d)]=_0x483b0f[_0x1bff5a(0x15d)]||{},_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']=_0x483b0f['reducePolicy'][_0x1bff5a(0x97)]||{},_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]=_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]||{};let _0x15035d={'perLogpoint':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)][_0x1bff5a(0x138)]||0x32,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint'][_0x1bff5a(0x148)]||0x64,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']['resetWhenQuietMs']||0x1f4,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)]['resetOnProcessingTimeAverageMs']||0x64},'global':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)]['global'][_0x1bff5a(0x138)]||0x3e8,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['reduceOnAccumulatedProcessingTimeMs']||0x12c,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['resetWhenQuietMs']||0x32,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)][_0x1bff5a(0x1a5)]||0x64}},_0x501118=b(_0x2a19ae),_0x49b596=_0x501118[_0x1bff5a(0xb4)],_0x32f0dd=_0x501118['timeStamp'];function _0x3c842b(){var _0x32cdb1=_0x1bff5a;this[_0x32cdb1(0xa5)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x32cdb1(0x112)]=/^(0|[1-9][0-9]*)$/,this[_0x32cdb1(0xa0)]=/'([^\\\\']|\\\\')*'/,this[_0x32cdb1(0x9a)]=_0x2a19ae[_0x32cdb1(0x13d)],this[_0x32cdb1(0x173)]=_0x2a19ae['HTMLAllCollection'],this[_0x32cdb1(0x15b)]=Object[_0x32cdb1(0x129)],this['_getOwnPropertyNames']=Object[_0x32cdb1(0x14f)],this['_Symbol']=_0x2a19ae[_0x32cdb1(0xe2)],this[_0x32cdb1(0x19c)]=RegExp[_0x32cdb1(0x172)]['toString'],this[_0x32cdb1(0x13b)]=Date[_0x32cdb1(0x172)][_0x32cdb1(0x11b)];}_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x16a)]=function(_0x40d313,_0x3fb199,_0x10e703,_0x3e651e){var _0x31c197=_0x1bff5a,_0x5c7575=this,_0xb95b67=_0x10e703[_0x31c197(0x169)];function _0x7ee627(_0x50c25b,_0x2d57c1,_0x4ad281){var _0x32ec39=_0x31c197;_0x2d57c1[_0x32ec39(0x99)]=_0x32ec39(0x114),_0x2d57c1[_0x32ec39(0x187)]=_0x50c25b[_0x32ec39(0xfb)],_0x16f50a=_0x4ad281[_0x32ec39(0x14e)][_0x32ec39(0x191)],_0x4ad281['node'][_0x32ec39(0x191)]=_0x2d57c1,_0x5c7575[_0x32ec39(0x124)](_0x2d57c1,_0x4ad281);}let _0x36cd62,_0x1773b6,_0x23751c=_0x2a19ae[_0x31c197(0xdd)];_0x2a19ae['ninjaSuppressConsole']=!0x0,_0x2a19ae[_0x31c197(0x159)]&&(_0x36cd62=_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)],_0x1773b6=_0x2a19ae['console'][_0x31c197(0xb5)],_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=function(){}),_0x1773b6&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0xb5)]=function(){}));try{try{_0x10e703[_0x31c197(0x16d)]++,_0x10e703[_0x31c197(0x169)]&&_0x10e703[_0x31c197(0xf1)]['push'](_0x3fb199);var _0x25e0f3,_0x4eb4e8,_0x18d4fe,_0x37ccc9,_0x30d81d=[],_0x56445b=[],_0x302c18,_0x5830a7=this[_0x31c197(0x15a)](_0x3fb199),_0x2a7b73=_0x5830a7===_0x31c197(0x111),_0x8efbaa=!0x1,_0x5670c1=_0x5830a7===_0x31c197(0x15c),_0x2c17b4=this['_isPrimitiveType'](_0x5830a7),_0xb70796=this['_isPrimitiveWrapperType'](_0x5830a7),_0x3c20b2=_0x2c17b4||_0xb70796,_0x36f42e={},_0x552b6b=0x0,_0x22e716=!0x1,_0x16f50a,_0x1394aa=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x10e703[_0x31c197(0x198)]){if(_0x2a7b73){if(_0x4eb4e8=_0x3fb199[_0x31c197(0x10d)],_0x4eb4e8>_0x10e703[_0x31c197(0x163)]){for(_0x18d4fe=0x0,_0x37ccc9=_0x10e703[_0x31c197(0x163)],_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));_0x40d313[_0x31c197(0x167)]=!0x0;}else{for(_0x18d4fe=0x0,_0x37ccc9=_0x4eb4e8,_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));}_0x10e703[_0x31c197(0x146)]+=_0x56445b[_0x31c197(0x10d)];}if(!(_0x5830a7==='null'||_0x5830a7==='undefined')&&!_0x2c17b4&&_0x5830a7!==_0x31c197(0x153)&&_0x5830a7!==_0x31c197(0x9e)&&_0x5830a7!==_0x31c197(0x11a)){var _0x718615=_0x3e651e[_0x31c197(0x17d)]||_0x10e703[_0x31c197(0x17d)];if(this[_0x31c197(0xe4)](_0x3fb199)?(_0x25e0f3=0x0,_0x3fb199[_0x31c197(0x180)](function(_0x5367ff){var _0x157c73=_0x31c197;if(_0x552b6b++,_0x10e703[_0x157c73(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703[_0x157c73(0xeb)]&&_0x10e703[_0x157c73(0x169)]&&_0x10e703[_0x157c73(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}_0x56445b[_0x157c73(0x175)](_0x5c7575['_addProperty'](_0x30d81d,_0x3fb199,_0x157c73(0x11d),_0x25e0f3++,_0x10e703,function(_0x4b87c0){return function(){return _0x4b87c0;};}(_0x5367ff)));})):this['_isMap'](_0x3fb199)&&_0x3fb199['forEach'](function(_0x4f6586,_0x1127ce){var _0x1f1731=_0x31c197;if(_0x552b6b++,_0x10e703[_0x1f1731(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703['isExpressionToEvaluate']&&_0x10e703[_0x1f1731(0x169)]&&_0x10e703[_0x1f1731(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}var _0x5c22c1=_0x1127ce[_0x1f1731(0x11b)]();_0x5c22c1[_0x1f1731(0x10d)]>0x64&&(_0x5c22c1=_0x5c22c1[_0x1f1731(0x123)](0x0,0x64)+_0x1f1731(0xb6)),_0x56445b[_0x1f1731(0x175)](_0x5c7575[_0x1f1731(0x14c)](_0x30d81d,_0x3fb199,'Map',_0x5c22c1,_0x10e703,function(_0x310ba3){return function(){return _0x310ba3;};}(_0x4f6586)));}),!_0x8efbaa){try{for(_0x302c18 in _0x3fb199)if(!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703[_0x31c197(0x194)]){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575['_addObjectProperty'](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}catch{}if(_0x36f42e[_0x31c197(0x119)]=!0x0,_0x5670c1&&(_0x36f42e[_0x31c197(0x197)]=!0x0),!_0x22e716){var _0xf18844=[]['concat'](this[_0x31c197(0x100)](_0x3fb199))['concat'](this[_0x31c197(0x152)](_0x3fb199));for(_0x25e0f3=0x0,_0x4eb4e8=_0xf18844[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)if(_0x302c18=_0xf18844[_0x25e0f3],!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18['toString']()))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)&&!_0x36f42e[typeof _0x302c18!=_0x31c197(0x184)?_0x31c197(0xca)+_0x302c18[_0x31c197(0x11b)]():_0x302c18]){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575[_0x31c197(0xde)](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}}}}if(_0x40d313[_0x31c197(0x99)]=_0x5830a7,_0x3c20b2?(_0x40d313['value']=_0x3fb199[_0x31c197(0xa7)](),this[_0x31c197(0x128)](_0x5830a7,_0x40d313,_0x10e703,_0x3e651e)):_0x5830a7===_0x31c197(0x107)?_0x40d313[_0x31c197(0xcc)]=this['_dateToString'][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x11a)?_0x40d313[_0x31c197(0xcc)]=_0x3fb199[_0x31c197(0x11b)]():_0x5830a7==='RegExp'?_0x40d313['value']=this[_0x31c197(0x19c)][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x184)&&this[_0x31c197(0x178)]?_0x40d313[_0x31c197(0xcc)]=this[_0x31c197(0x178)][_0x31c197(0x172)][_0x31c197(0x11b)]['call'](_0x3fb199):!_0x10e703[_0x31c197(0x198)]&&!(_0x5830a7===_0x31c197(0x18e)||_0x5830a7===_0x31c197(0x13d))&&(delete _0x40d313[_0x31c197(0xcc)],_0x40d313['capped']=!0x0),_0x22e716&&(_0x40d313[_0x31c197(0xc8)]=!0x0),_0x16f50a=_0x10e703[_0x31c197(0x14e)]['current'],_0x10e703[_0x31c197(0x14e)][_0x31c197(0x191)]=_0x40d313,this['_treeNodePropertiesBeforeFullValue'](_0x40d313,_0x10e703),_0x56445b['length']){for(_0x25e0f3=0x0,_0x4eb4e8=_0x56445b[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)_0x56445b[_0x25e0f3](_0x25e0f3);}_0x30d81d[_0x31c197(0x10d)]&&(_0x40d313['props']=_0x30d81d);}catch(_0x48a3c4){_0x7ee627(_0x48a3c4,_0x40d313,_0x10e703);}this['_additionalMetadata'](_0x3fb199,_0x40d313),this[_0x31c197(0xdc)](_0x40d313,_0x10e703),_0x10e703[_0x31c197(0x14e)]['current']=_0x16f50a,_0x10e703[_0x31c197(0x16d)]--,_0x10e703[_0x31c197(0x169)]=_0xb95b67,_0x10e703[_0x31c197(0x169)]&&_0x10e703['autoExpandPreviousObjects']['pop']();}finally{_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=_0x36cd62),_0x1773b6&&(_0x2a19ae['console']['warn']=_0x1773b6),_0x2a19ae[_0x31c197(0xdd)]=_0x23751c;}return _0x40d313;},_0x3c842b['prototype'][_0x1bff5a(0x152)]=function(_0x5568c0){var _0x950ed8=_0x1bff5a;return Object[_0x950ed8(0xf2)]?Object[_0x950ed8(0xf2)](_0x5568c0):[];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xe4)]=function(_0x5cff31){var _0x5294c9=_0x1bff5a;return!!(_0x5cff31&&_0x2a19ae[_0x5294c9(0x11d)]&&this['_objectToString'](_0x5cff31)===_0x5294c9(0xb3)&&_0x5cff31[_0x5294c9(0x180)]);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf4)]=function(_0x176394,_0x32608a,_0xd5d805){var _0x4c84a9=_0x1bff5a;if(!_0xd5d805['resolveGetters']){let _0x75bbab=this['_getOwnPropertyDescriptor'](_0x176394,_0x32608a);if(_0x75bbab&&_0x75bbab[_0x4c84a9(0x126)])return!0x0;}return _0xd5d805[_0x4c84a9(0x177)]?typeof _0x176394[_0x32608a]=='function':!0x1;},_0x3c842b['prototype'][_0x1bff5a(0x15a)]=function(_0x2dedf1){var _0x14c6b0=_0x1bff5a,_0x5f049e='';return _0x5f049e=typeof _0x2dedf1,_0x5f049e===_0x14c6b0(0x12d)?this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x19e)?_0x5f049e=_0x14c6b0(0x111):this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x170)?_0x5f049e=_0x14c6b0(0x107):this[_0x14c6b0(0x127)](_0x2dedf1)==='[object\\x20BigInt]'?_0x5f049e=_0x14c6b0(0x11a):_0x2dedf1===null?_0x5f049e=_0x14c6b0(0x18e):_0x2dedf1[_0x14c6b0(0x19d)]&&(_0x5f049e=_0x2dedf1[_0x14c6b0(0x19d)][_0x14c6b0(0xe5)]||_0x5f049e):_0x5f049e===_0x14c6b0(0x13d)&&this[_0x14c6b0(0x173)]&&_0x2dedf1 instanceof this[_0x14c6b0(0x173)]&&(_0x5f049e=_0x14c6b0(0x16f)),_0x5f049e;},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x127)]=function(_0x26fd83){var _0x2cc9cb=_0x1bff5a;return Object[_0x2cc9cb(0x172)][_0x2cc9cb(0x11b)][_0x2cc9cb(0xb9)](_0x26fd83);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xd1)]=function(_0x33c047){var _0x1aed3d=_0x1bff5a;return _0x33c047===_0x1aed3d(0xe7)||_0x33c047===_0x1aed3d(0x13e)||_0x33c047===_0x1aed3d(0x113);},_0x3c842b['prototype'][_0x1bff5a(0x12b)]=function(_0x9c26bc){var _0x3445a7=_0x1bff5a;return _0x9c26bc===_0x3445a7(0xb7)||_0x9c26bc===_0x3445a7(0x153)||_0x9c26bc==='Number';},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x14c)]=function(_0x39d72b,_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931){var _0x13303e=this;return function(_0x3b0a04){var _0xfd957=_0xa6b0,_0x1e9977=_0x2af968['node']['current'],_0x416967=_0x2af968['node']['index'],_0x278cad=_0x2af968[_0xfd957(0x14e)][_0xfd957(0x13f)];_0x2af968['node']['parent']=_0x1e9977,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=typeof _0x3315a9==_0xfd957(0x113)?_0x3315a9:_0x3b0a04,_0x39d72b[_0xfd957(0x175)](_0x13303e[_0xfd957(0x147)](_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931)),_0x2af968[_0xfd957(0x14e)]['parent']=_0x278cad,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=_0x416967;};},_0x3c842b['prototype'][_0x1bff5a(0xde)]=function(_0x1ac5b3,_0x4e5a09,_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c){var _0x416fff=_0x1bff5a,_0x5079ab=this;return _0x4e5a09[typeof _0x28ffe1!=_0x416fff(0x184)?_0x416fff(0xca)+_0x28ffe1[_0x416fff(0x11b)]():_0x28ffe1]=!0x0,function(_0x193c6b){var _0x8b0c8=_0x416fff,_0x4e890c=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x191)],_0x1de07b=_0xa4d180[_0x8b0c8(0x14e)]['index'],_0x4c6e05=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)];_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)]=_0x4e890c,_0xa4d180['node']['index']=_0x193c6b,_0x1ac5b3['push'](_0x5079ab['_property'](_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c)),_0xa4d180['node']['parent']=_0x4c6e05,_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x17f)]=_0x1de07b;};},_0x3c842b['prototype'][_0x1bff5a(0x147)]=function(_0x3fc911,_0x53af0b,_0x1daee9,_0x1aaecf,_0x3c6648){var _0x24ab9f=_0x1bff5a,_0x1044ef=this;_0x3c6648||(_0x3c6648=function(_0x5aebf0,_0xe2bf62){return _0x5aebf0[_0xe2bf62];});var _0x3ba706=_0x1daee9[_0x24ab9f(0x11b)](),_0x147ad8=_0x1aaecf[_0x24ab9f(0x14a)]||{},_0x564175=_0x1aaecf[_0x24ab9f(0x198)],_0x4c8e20=_0x1aaecf['isExpressionToEvaluate'];try{var _0xa14fb7=this[_0x24ab9f(0x106)](_0x3fc911),_0xf1a445=_0x3ba706;_0xa14fb7&&_0xf1a445[0x0]==='\\x27'&&(_0xf1a445=_0xf1a445[_0x24ab9f(0x157)](0x1,_0xf1a445[_0x24ab9f(0x10d)]-0x2));var _0x83dd31=_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8[_0x24ab9f(0xca)+_0xf1a445];_0x83dd31&&(_0x1aaecf[_0x24ab9f(0x198)]=_0x1aaecf[_0x24ab9f(0x198)]+0x1),_0x1aaecf['isExpressionToEvaluate']=!!_0x83dd31;var _0x1718af=typeof _0x1daee9==_0x24ab9f(0x184),_0x3e3cf6={'name':_0x1718af||_0xa14fb7?_0x3ba706:this[_0x24ab9f(0x154)](_0x3ba706)};if(_0x1718af&&(_0x3e3cf6[_0x24ab9f(0x184)]=!0x0),!(_0x53af0b===_0x24ab9f(0x111)||_0x53af0b==='Error')){var _0x270121=this[_0x24ab9f(0x15b)](_0x3fc911,_0x1daee9);if(_0x270121&&(_0x270121['set']&&(_0x3e3cf6[_0x24ab9f(0xfd)]=!0x0),_0x270121['get']&&!_0x83dd31&&!_0x1aaecf[_0x24ab9f(0x102)]))return _0x3e3cf6['getter']=!0x0,this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x75d602;try{_0x75d602=_0x3c6648(_0x3fc911,_0x1daee9);}catch(_0x13aa60){return _0x3e3cf6={'name':_0x3ba706,'type':_0x24ab9f(0x114),'error':_0x13aa60[_0x24ab9f(0xfb)]},this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x74802c=this['_type'](_0x75d602),_0x3e9d1f=this['_isPrimitiveType'](_0x74802c);if(_0x3e3cf6[_0x24ab9f(0x99)]=_0x74802c,_0x3e9d1f)this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x58307e=_0x24ab9f;_0x3e3cf6[_0x58307e(0xcc)]=_0x75d602['valueOf'](),!_0x83dd31&&_0x1044ef[_0x58307e(0x128)](_0x74802c,_0x3e3cf6,_0x1aaecf,{});});else{var _0xf56525=_0x1aaecf['autoExpand']&&_0x1aaecf[_0x24ab9f(0x16d)]<_0x1aaecf[_0x24ab9f(0xc0)]&&_0x1aaecf['autoExpandPreviousObjects']['indexOf'](_0x75d602)<0x0&&_0x74802c!==_0x24ab9f(0x15c)&&_0x1aaecf[_0x24ab9f(0x146)]<_0x1aaecf['autoExpandLimit'];_0xf56525||_0x1aaecf['level']<_0x564175||_0x83dd31?this[_0x24ab9f(0x16a)](_0x3e3cf6,_0x75d602,_0x1aaecf,_0x83dd31||{}):this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x393a95=_0x24ab9f;_0x74802c===_0x393a95(0x18e)||_0x74802c===_0x393a95(0x13d)||(delete _0x3e3cf6[_0x393a95(0xcc)],_0x3e3cf6[_0x393a95(0x12e)]=!0x0);});}return _0x3e3cf6;}finally{_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8,_0x1aaecf['depth']=_0x564175,_0x1aaecf[_0x24ab9f(0xeb)]=_0x4c8e20;}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x128)]=function(_0x56d3fe,_0x3888bc,_0x5eecce,_0x4702b6){var _0x2683b4=_0x1bff5a,_0x25341f=_0x4702b6[_0x2683b4(0xad)]||_0x5eecce[_0x2683b4(0xad)];if((_0x56d3fe==='string'||_0x56d3fe===_0x2683b4(0x153))&&_0x3888bc[_0x2683b4(0xcc)]){let _0x49128b=_0x3888bc[_0x2683b4(0xcc)][_0x2683b4(0x10d)];_0x5eecce[_0x2683b4(0x161)]+=_0x49128b,_0x5eecce[_0x2683b4(0x161)]>_0x5eecce[_0x2683b4(0xda)]?(_0x3888bc[_0x2683b4(0x12e)]='',delete _0x3888bc[_0x2683b4(0xcc)]):_0x49128b>_0x25341f&&(_0x3888bc['capped']=_0x3888bc['value'][_0x2683b4(0x157)](0x0,_0x25341f),delete _0x3888bc[_0x2683b4(0xcc)]);}},_0x3c842b[_0x1bff5a(0x172)]['_isMap']=function(_0x23ed93){var _0x32ae70=_0x1bff5a;return!!(_0x23ed93&&_0x2a19ae[_0x32ae70(0x193)]&&this[_0x32ae70(0x127)](_0x23ed93)===_0x32ae70(0x117)&&_0x23ed93[_0x32ae70(0x180)]);},_0x3c842b['prototype'][_0x1bff5a(0x154)]=function(_0x539e6b){var _0x3e9eb6=_0x1bff5a;if(_0x539e6b['match'](/^\\d+$/))return _0x539e6b;var _0x268203;try{_0x268203=JSON[_0x3e9eb6(0xa8)](''+_0x539e6b);}catch{_0x268203='\\x22'+this['_objectToString'](_0x539e6b)+'\\x22';}return _0x268203[_0x3e9eb6(0x149)](/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?_0x268203=_0x268203['substr'](0x1,_0x268203[_0x3e9eb6(0x10d)]-0x2):_0x268203=_0x268203['replace'](/'/g,'\\x5c\\x27')[_0x3e9eb6(0x11e)](/\\\\"/g,'\\x22')[_0x3e9eb6(0x11e)](/(^"|"$)/g,'\\x27'),_0x268203;},_0x3c842b['prototype'][_0x1bff5a(0x115)]=function(_0x1b22e6,_0x139c74,_0x26c1fb,_0x18f60b){var _0x59810d=_0x1bff5a;this[_0x59810d(0x124)](_0x1b22e6,_0x139c74),_0x18f60b&&_0x18f60b(),this[_0x59810d(0x13c)](_0x26c1fb,_0x1b22e6),this[_0x59810d(0xdc)](_0x1b22e6,_0x139c74);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x124)]=function(_0x3de57f,_0x633f7e){var _0x3b15c7=_0x1bff5a;this[_0x3b15c7(0x120)](_0x3de57f,_0x633f7e),this['_setNodeQueryPath'](_0x3de57f,_0x633f7e),this[_0x3b15c7(0xaa)](_0x3de57f,_0x633f7e),this[_0x3b15c7(0x140)](_0x3de57f,_0x633f7e);},_0x3c842b['prototype'][_0x1bff5a(0x120)]=function(_0x212392,_0x5350c2){},_0x3c842b['prototype'][_0x1bff5a(0x15e)]=function(_0x254f19,_0xb65cfa){},_0x3c842b[_0x1bff5a(0x172)]['_setNodeLabel']=function(_0x5174e1,_0x4a4537){},_0x3c842b[_0x1bff5a(0x172)]['_isUndefined']=function(_0x4b9a4e){var _0x29d539=_0x1bff5a;return _0x4b9a4e===this[_0x29d539(0x9a)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xdc)]=function(_0x112fbe,_0xc2b2f8){var _0x13069a=_0x1bff5a;this[_0x13069a(0x122)](_0x112fbe,_0xc2b2f8),this[_0x13069a(0x118)](_0x112fbe),_0xc2b2f8[_0x13069a(0x168)]&&this[_0x13069a(0xcd)](_0x112fbe),this[_0x13069a(0x1a3)](_0x112fbe,_0xc2b2f8),this['_addLoadNode'](_0x112fbe,_0xc2b2f8),this['_cleanNode'](_0x112fbe);},_0x3c842b[_0x1bff5a(0x172)]['_additionalMetadata']=function(_0x480177,_0x5bf51c){var _0x36c251=_0x1bff5a;try{_0x480177&&typeof _0x480177[_0x36c251(0x10d)]==_0x36c251(0x113)&&(_0x5bf51c[_0x36c251(0x10d)]=_0x480177[_0x36c251(0x10d)]);}catch{}if(_0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x113)||_0x5bf51c[_0x36c251(0x99)]==='Number'){if(isNaN(_0x5bf51c[_0x36c251(0xcc)]))_0x5bf51c[_0x36c251(0xf7)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];else switch(_0x5bf51c['value']){case Number['POSITIVE_INFINITY']:_0x5bf51c['positiveInfinity']=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case Number[_0x36c251(0x18d)]:_0x5bf51c[_0x36c251(0x109)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case 0x0:this[_0x36c251(0xef)](_0x5bf51c[_0x36c251(0xcc)])&&(_0x5bf51c[_0x36c251(0xbb)]=!0x0);break;}}else _0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x15c)&&typeof _0x480177[_0x36c251(0xe5)]==_0x36c251(0x13e)&&_0x480177[_0x36c251(0xe5)]&&_0x5bf51c[_0x36c251(0xe5)]&&_0x480177['name']!==_0x5bf51c[_0x36c251(0xe5)]&&(_0x5bf51c[_0x36c251(0xb8)]=_0x480177['name']);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xef)]=function(_0x5f59c6){var _0x3d7094=_0x1bff5a;return 0x1/_0x5f59c6===Number[_0x3d7094(0x18d)];},_0x3c842b[_0x1bff5a(0x172)]['_sortProps']=function(_0x341845){var _0xf1b50d=_0x1bff5a;!_0x341845['props']||!_0x341845[_0xf1b50d(0x17d)][_0xf1b50d(0x10d)]||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x111)||_0x341845['type']===_0xf1b50d(0x193)||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x11d)||_0x341845[_0xf1b50d(0x17d)]['sort'](function(_0x18e25d,_0x2e5ca7){var _0x5d8ea4=_0xf1b50d,_0x2086c0=_0x18e25d[_0x5d8ea4(0xe5)]['toLowerCase'](),_0x11bbd3=_0x2e5ca7[_0x5d8ea4(0xe5)]['toLowerCase']();return _0x2086c0<_0x11bbd3?-0x1:_0x2086c0>_0x11bbd3?0x1:0x0;});},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x1a3)]=function(_0x54949b,_0x4cb346){var _0x5e9777=_0x1bff5a;if(!(_0x4cb346[_0x5e9777(0x177)]||!_0x54949b[_0x5e9777(0x17d)]||!_0x54949b['props'][_0x5e9777(0x10d)])){for(var _0x4f6972=[],_0x78d8a8=[],_0x20bd98=0x0,_0x5628f1=_0x54949b['props'][_0x5e9777(0x10d)];_0x20bd98<_0x5628f1;_0x20bd98++){var _0x5c1147=_0x54949b[_0x5e9777(0x17d)][_0x20bd98];_0x5c1147[_0x5e9777(0x99)]===_0x5e9777(0x15c)?_0x4f6972[_0x5e9777(0x175)](_0x5c1147):_0x78d8a8[_0x5e9777(0x175)](_0x5c1147);}if(!(!_0x78d8a8['length']||_0x4f6972[_0x5e9777(0x10d)]<=0x1)){_0x54949b[_0x5e9777(0x17d)]=_0x78d8a8;var _0x1ffed3={'functionsNode':!0x0,'props':_0x4f6972};this[_0x5e9777(0x120)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x122)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x118)](_0x1ffed3),this['_setNodePermissions'](_0x1ffed3,_0x4cb346),_0x1ffed3['id']+='\\x20f',_0x54949b[_0x5e9777(0x17d)]['unshift'](_0x1ffed3);}}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x10f)]=function(_0x3e2ffa,_0x7cf6a2){},_0x3c842b['prototype'][_0x1bff5a(0x118)]=function(_0x25a8d7){},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf3)]=function(_0x1726d6){var _0x4469e7=_0x1bff5a;return Array[_0x4469e7(0x9b)](_0x1726d6)||typeof _0x1726d6==_0x4469e7(0x12d)&&this[_0x4469e7(0x127)](_0x1726d6)===_0x4469e7(0x19e);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x140)]=function(_0x4c1d3c,_0x349781){},_0x3c842b['prototype']['_cleanNode']=function(_0x4d21c1){var _0xd58577=_0x1bff5a;delete _0x4d21c1[_0xd58577(0xf5)],delete _0x4d21c1[_0xd58577(0x144)],delete _0x4d21c1[_0xd58577(0x110)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xaa)]=function(_0x43e4e6,_0x3cf6da){};let _0x22e9d1=new _0x3c842b(),_0x31d042={'props':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x17d)]||0x64,'elements':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x163)]||0x64,'strLength':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0xad)]||0x400*0x32,'totalStrLength':_0x483b0f['defaultLimits'][_0x1bff5a(0xda)]||0x400*0x32,'autoExpandLimit':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x194)]||0x1388,'autoExpandMaxDepth':_0x483b0f['defaultLimits'][_0x1bff5a(0xc0)]||0xa},_0x5134cc={'props':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x17d)]||0x5,'elements':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x163)]||0x5,'strLength':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0xad)]||0x100,'totalStrLength':_0x483b0f['reducedLimits'][_0x1bff5a(0xda)]||0x100*0x3,'autoExpandLimit':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x194)]||0x1e,'autoExpandMaxDepth':_0x483b0f[_0x1bff5a(0xbf)]['autoExpandMaxDepth']||0x2};if(_0x599cd8){let _0x10c22a=_0x22e9d1[_0x1bff5a(0x16a)][_0x1bff5a(0x18c)](_0x22e9d1);_0x22e9d1[_0x1bff5a(0x16a)]=function(_0x63dc8a,_0xf87bc8,_0xed8b,_0x3030e4){return _0x10c22a(_0x63dc8a,_0x599cd8(_0xf87bc8),_0xed8b,_0x3030e4);};}function _0x36e6e0(_0x4b7ae2,_0x7448e6,_0x1e6871,_0x13e959,_0x54bcfa,_0x5e46fe){var _0x55e03f=_0x1bff5a;let _0x581fa4,_0x572fc2;try{_0x572fc2=_0x32f0dd(),_0x581fa4=_0x7f88c9[_0x7448e6],!_0x581fa4||_0x572fc2-_0x581fa4['ts']>_0x15035d['perLogpoint'][_0x55e03f(0xa9)]&&_0x581fa4['count']&&_0x581fa4[_0x55e03f(0x137)]/_0x581fa4[_0x55e03f(0xd3)]<_0x15035d['perLogpoint']['resetOnProcessingTimeAverageMs']?(_0x7f88c9[_0x7448e6]=_0x581fa4={'count':0x0,'time':0x0,'ts':_0x572fc2},_0x7f88c9[_0x55e03f(0x10c)]={}):_0x572fc2-_0x7f88c9[_0x55e03f(0x10c)]['ts']>_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0xa9)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]/_0x7f88c9[_0x55e03f(0x10c)]['count']<_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0x1a5)]&&(_0x7f88c9[_0x55e03f(0x10c)]={});let _0x592aa0=[],_0x201cd8=_0x581fa4['reduceLimits']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xbc)]?_0x5134cc:_0x31d042,_0x1c3b41=_0x440706=>{var _0x380ff0=_0x55e03f;let _0x2fbc49={};return _0x2fbc49['props']=_0x440706['props'],_0x2fbc49['elements']=_0x440706[_0x380ff0(0x163)],_0x2fbc49['strLength']=_0x440706['strLength'],_0x2fbc49[_0x380ff0(0xda)]=_0x440706[_0x380ff0(0xda)],_0x2fbc49[_0x380ff0(0x194)]=_0x440706[_0x380ff0(0x194)],_0x2fbc49[_0x380ff0(0xc0)]=_0x440706[_0x380ff0(0xc0)],_0x2fbc49[_0x380ff0(0x168)]=!0x1,_0x2fbc49[_0x380ff0(0x177)]=!_0x447b71,_0x2fbc49[_0x380ff0(0x198)]=0x1,_0x2fbc49['level']=0x0,_0x2fbc49[_0x380ff0(0xfa)]=_0x380ff0(0xae),_0x2fbc49['rootExpression']=_0x380ff0(0x104),_0x2fbc49[_0x380ff0(0x169)]=!0x0,_0x2fbc49[_0x380ff0(0xf1)]=[],_0x2fbc49['autoExpandPropertyCount']=0x0,_0x2fbc49[_0x380ff0(0x102)]=_0x483b0f[_0x380ff0(0x102)],_0x2fbc49[_0x380ff0(0x161)]=0x0,_0x2fbc49[_0x380ff0(0x14e)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x2fbc49;};for(var _0x34cb46=0x0;_0x34cb46<_0x54bcfa['length'];_0x34cb46++)_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'timeNode':_0x4b7ae2==='time'||void 0x0},_0x54bcfa[_0x34cb46],_0x1c3b41(_0x201cd8),{}));if(_0x4b7ae2==='trace'||_0x4b7ae2===_0x55e03f(0x187)){let _0x38f028=Error['stackTraceLimit'];try{Error['stackTraceLimit']=0x1/0x0,_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'stackNode':!0x0},new Error()['stack'],_0x1c3b41(_0x201cd8),{'strLength':0x1/0x0}));}finally{Error['stackTraceLimit']=_0x38f028;}}return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':_0x592aa0,'id':_0x7448e6,'context':_0x5e46fe}]};}catch(_0x38023d){return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':[{'type':_0x55e03f(0x114),'error':_0x38023d&&_0x38023d['message']}],'id':_0x7448e6,'context':_0x5e46fe}]};}finally{try{if(_0x581fa4&&_0x572fc2){let _0x4a1dc5=_0x32f0dd();_0x581fa4['count']++,_0x581fa4['time']+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x581fa4['ts']=_0x4a1dc5,_0x7f88c9['hits'][_0x55e03f(0xd3)]++,_0x7f88c9['hits'][_0x55e03f(0x137)]+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x7f88c9[_0x55e03f(0x10c)]['ts']=_0x4a1dc5,(_0x581fa4[_0x55e03f(0xd3)]>_0x15035d['perLogpoint'][_0x55e03f(0x138)]||_0x581fa4['time']>_0x15035d['perLogpoint'][_0x55e03f(0x148)])&&(_0x581fa4['reduceLimits']=!0x0),(_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]>_0x15035d[_0x55e03f(0xe6)]['reduceOnCount']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]>_0x15035d['global'][_0x55e03f(0x148)])&&(_0x7f88c9['hits'][_0x55e03f(0xbc)]=!0x0);}}catch{}}}return _0x36e6e0;}function G(_0x4bcced){var _0x3ca5c0=_0x1c43af;if(_0x4bcced&&typeof _0x4bcced==_0x3ca5c0(0x12d)&&_0x4bcced[_0x3ca5c0(0x19d)])switch(_0x4bcced[_0x3ca5c0(0x19d)][_0x3ca5c0(0xe5)]){case _0x3ca5c0(0xb0):return _0x4bcced[_0x3ca5c0(0xfc)](Symbol[_0x3ca5c0(0x189)])?Promise[_0x3ca5c0(0x18b)]():_0x4bcced;case _0x3ca5c0(0x19b):return Promise['resolve']();}return _0x4bcced;}((_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x5efe0f,_0xeb603e,_0x2e7e15,_0x351bad,_0x341637,_0x3428c5,_0x343bd6)=>{var _0x1125dc=_0x1c43af;if(_0x48d785[_0x1125dc(0xec)])return _0x48d785['_console_ninja'];let _0x3cd4f6={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}};if(!X(_0x48d785,_0x2e7e15,_0x4d1fbe))return _0x48d785[_0x1125dc(0xec)]=_0x3cd4f6,_0x48d785[_0x1125dc(0xec)];let _0xaf0d67=b(_0x48d785),_0x281f2e=_0xaf0d67[_0x1125dc(0xb4)],_0xae8681=_0xaf0d67[_0x1125dc(0xfe)],_0x4e0fc5=_0xaf0d67['now'],_0xa2e8a7={'hits':{},'ts':{}},_0x91e1f5=J(_0x48d785,_0x351bad,_0xa2e8a7,_0x5efe0f,_0x343bd6,_0x4d1fbe===_0x1125dc(0x179)?G:void 0x0),_0x536854=(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3)=>{var _0x348500=_0x1125dc;let _0x3306b6=_0x48d785['_console_ninja'];try{return _0x48d785[_0x348500(0xec)]=_0x3cd4f6,_0x91e1f5(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3);}finally{_0x48d785[_0x348500(0xec)]=_0x3306b6;}},_0x11e42f=_0x3660d4=>{_0xa2e8a7['ts'][_0x3660d4]=_0xae8681();},_0x308a38=(_0x227f0b,_0x4baf5a)=>{var _0x286c56=_0x1125dc;let _0x459036=_0xa2e8a7['ts'][_0x4baf5a];if(delete _0xa2e8a7['ts'][_0x4baf5a],_0x459036){let _0xaca72e=_0x281f2e(_0x459036,_0xae8681());_0x223f4e(_0x536854(_0x286c56(0x137),_0x227f0b,_0x4e0fc5(),_0x3b9616,[_0xaca72e],_0x4baf5a));}},_0x11c122=_0x2d5a87=>{var _0x28fe2c=_0x1125dc,_0x1c2128;return _0x4d1fbe===_0x28fe2c(0x179)&&_0x48d785[_0x28fe2c(0xa3)]&&((_0x1c2128=_0x2d5a87==null?void 0x0:_0x2d5a87[_0x28fe2c(0x1a4)])==null?void 0x0:_0x1c2128[_0x28fe2c(0x10d)])&&(_0x2d5a87[_0x28fe2c(0x1a4)][0x0][_0x28fe2c(0xa3)]=_0x48d785['origin']),_0x2d5a87;};_0x48d785['_console_ninja']={'consoleLog':(_0x535a72,_0x3d708e)=>{var _0xee4f6a=_0x1125dc;_0x48d785['console'][_0xee4f6a(0x17a)][_0xee4f6a(0xe5)]!==_0xee4f6a(0xd2)&&_0x223f4e(_0x536854(_0xee4f6a(0x17a),_0x535a72,_0x4e0fc5(),_0x3b9616,_0x3d708e));},'consoleTrace':(_0x3cb025,_0x49aa51)=>{var _0x2f4b5c=_0x1125dc,_0x4599c8,_0x3c6c91;_0x48d785[_0x2f4b5c(0x159)][_0x2f4b5c(0x17a)][_0x2f4b5c(0xe5)]!==_0x2f4b5c(0x133)&&((_0x3c6c91=(_0x4599c8=_0x48d785[_0x2f4b5c(0xc5)])==null?void 0x0:_0x4599c8[_0x2f4b5c(0xe0)])!=null&&_0x3c6c91[_0x2f4b5c(0x14e)]&&(_0x48d785['_ninjaIgnoreNextError']=!0x0),_0x223f4e(_0x11c122(_0x536854(_0x2f4b5c(0x181),_0x3cb025,_0x4e0fc5(),_0x3b9616,_0x49aa51))));},'consoleError':(_0x1bcfbb,_0x5dfcc2)=>{var _0x5127a8=_0x1125dc;_0x48d785[_0x5127a8(0x121)]=!0x0,_0x223f4e(_0x11c122(_0x536854(_0x5127a8(0x187),_0x1bcfbb,_0x4e0fc5(),_0x3b9616,_0x5dfcc2)));},'consoleTime':_0x1240c5=>{_0x11e42f(_0x1240c5);},'consoleTimeEnd':(_0x45b15f,_0xedf120)=>{_0x308a38(_0xedf120,_0x45b15f);},'autoLog':(_0x476380,_0x430396)=>{var _0x381ac9=_0x1125dc;_0x223f4e(_0x536854(_0x381ac9(0x17a),_0x430396,_0x4e0fc5(),_0x3b9616,[_0x476380]));},'autoLogMany':(_0x496baf,_0x2de83e)=>{_0x223f4e(_0x536854('log',_0x496baf,_0x4e0fc5(),_0x3b9616,_0x2de83e));},'autoTrace':(_0x580506,_0xdd93fb)=>{var _0x545a58=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x545a58(0x181),_0xdd93fb,_0x4e0fc5(),_0x3b9616,[_0x580506])));},'autoTraceMany':(_0x35b68e,_0x1bf390)=>{var _0x53bd89=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x53bd89(0x181),_0x35b68e,_0x4e0fc5(),_0x3b9616,_0x1bf390)));},'autoTime':(_0x1f9f08,_0x36b878,_0x2bba7b)=>{_0x11e42f(_0x2bba7b);},'autoTimeEnd':(_0x5b5318,_0x42dbfa,_0x2fdc68)=>{_0x308a38(_0x42dbfa,_0x2fdc68);},'coverage':_0x3c7d3b=>{var _0x2e75e3=_0x1125dc;_0x223f4e({'method':_0x2e75e3(0x1a1),'version':_0x5efe0f,'args':[{'id':_0x3c7d3b}]});}};let _0x223f4e=H(_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x341637,_0x3428c5),_0x3b9616=_0x48d785[_0x1125dc(0x183)];return _0x48d785[_0x1125dc(0xec)];})(globalThis,_0x1c43af(0xd0),_0x1c43af(0x1a2),_0x1c43af(0x160),_0x1c43af(0xd8),'1.0.0',_0x1c43af(0x17b),_0x1c43af(0x14b),_0x1c43af(0x18a),'',_0x1c43af(0x156),{"resolveGetters":false,"defaultLimits":{"props":100,"elements":100,"strLength":51200,"totalStrLength":51200,"autoExpandLimit":5000,"autoExpandMaxDepth":10},"reducedLimits":{"props":5,"elements":5,"strLength":256,"totalStrLength":768,"autoExpandLimit":30,"autoExpandMaxDepth":2},"reducePolicy":{"perLogpoint":{"reduceOnCount":50,"reduceOnAccumulatedProcessingTimeMs":100,"resetWhenQuietMs":500,"resetOnProcessingTimeAverageMs":100},"global":{"reduceOnCount":1000,"reduceOnAccumulatedProcessingTimeMs":300,"resetWhenQuietMs":50,"resetOnProcessingTimeAverageMs":100}}});`);
  } catch (e) {
  }
}
function oo_tx$3(i, ...v) {
  try {
    oo_cm$3().consoleError(i, v);
  } catch (e) {
  }
  return v;
}

const checkout_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: checkout_post
}, Symbol.toStringTag, { value: 'Module' }));

const contact_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    if (!(body == null ? void 0 : body.name) || !emailOk((_a = body.email) != null ? _a : "") || !(body == null ? void 0 : body.message)) {
      throw createError({ statusCode: 400, message: "Please complete all required fields." });
    }
    await createContact({
      name: String(body.name).slice(0, 120),
      email: String(body.email).slice(0, 160),
      subject: body.subject ? String(body.subject).slice(0, 120) : "General",
      message: String(body.message).slice(0, 4e3)
    });
    return { ok: true };
  } catch (e) {
    if (e == null ? void 0 : e.statusCode) throw e;
    console.error(...oo_tx$2(`3459602454_19_4_19_37_11`, "contact error", e));
    throw createError({ statusCode: 500, message: "Couldn't send your message." });
  }
});
function oo_cm$2() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)(`/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x1c43af=_0xa6b0;(function(_0x220cc8,_0x26af8d){var _0x2b5e22=_0xa6b0,_0x20010d=_0x220cc8();while(!![]){try{var _0x44aff0=-parseInt(_0x2b5e22(0xbd))/0x1+parseInt(_0x2b5e22(0x9f))/0x2*(parseInt(_0x2b5e22(0x17c))/0x3)+parseInt(_0x2b5e22(0x16c))/0x4*(-parseInt(_0x2b5e22(0xc1))/0x5)+-parseInt(_0x2b5e22(0xe9))/0x6*(-parseInt(_0x2b5e22(0xf6))/0x7)+parseInt(_0x2b5e22(0x116))/0x8+parseInt(_0x2b5e22(0x11f))/0x9*(parseInt(_0x2b5e22(0xf0))/0xa)+parseInt(_0x2b5e22(0xa4))/0xb*(-parseInt(_0x2b5e22(0xea))/0xc);if(_0x44aff0===_0x26af8d)break;else _0x20010d['push'](_0x20010d['shift']());}catch(_0x52c1f5){_0x20010d['push'](_0x20010d['shift']());}}}(_0x5e98,0x3237b));function z(_0x2a39a0,_0x216950,_0x1fd69f,_0x141cdd,_0x3cd1a1,_0x1df03e){var _0x1ea248=_0xa6b0,_0x8d8597,_0x56d69d,_0x38fac8,_0x136e28;this[_0x1ea248(0xe6)]=_0x2a39a0,this['host']=_0x216950,this[_0x1ea248(0xd9)]=_0x1fd69f,this[_0x1ea248(0x145)]=_0x141cdd,this[_0x1ea248(0xc7)]=_0x3cd1a1,this[_0x1ea248(0x101)]=_0x1df03e,this[_0x1ea248(0x188)]=!0x0,this[_0x1ea248(0xd4)]=!0x0,this[_0x1ea248(0x18f)]=!0x1,this[_0x1ea248(0x19f)]=!0x1,this[_0x1ea248(0xc2)]=((_0x56d69d=(_0x8d8597=_0x2a39a0[_0x1ea248(0xc5)])==null?void 0x0:_0x8d8597[_0x1ea248(0x98)])==null?void 0x0:_0x56d69d['NEXT_RUNTIME'])==='edge',this[_0x1ea248(0x13a)]=!((_0x136e28=(_0x38fac8=this['global'][_0x1ea248(0xc5)])==null?void 0x0:_0x38fac8['versions'])!=null&&_0x136e28[_0x1ea248(0x14e)])&&!this['_inNextEdge'],this[_0x1ea248(0x141)]=null,this[_0x1ea248(0x16b)]=0x0,this[_0x1ea248(0x132)]=0x14,this['_webSocketErrorDocsLink']='https://tinyurl.com/37x8b79t',this['_sendErrorMessage']=(this['_inBrowser']?_0x1ea248(0xff):_0x1ea248(0x186))+this[_0x1ea248(0x14d)];}function _0x5e98(){var _0x1d5b3b=['expo','astro','_isNegativeZero','957230rNvFvK','autoExpandPreviousObjects','getOwnPropertySymbols','_isArray','_blacklistedProperty','_hasSymbolPropertyOnItsPath','133MnKmdV','nan','_socket','edge','expId','message','hasOwnProperty','setter','timeStamp','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','_getOwnPropertyNames','eventReceivedCallback','resolveGetters','onopen','root_exp','onmessage','_isMap','date','unref','negativeInfinity','_ws','NEXT_RUNTIME','hits','length','remix','_addLoadNode','_hasMapOnItsPath','array','_numberRegExp','number','unknown','_processTreeNodeResult','3258208HkSWxa','[object\\x20Map]','_setNodeExpandableState','_p_length','bigint','toString','reload','Set','replace','27COdOne','_setNodeId','_ninjaIgnoreNextError','_setNodeLabel','slice','_treeNodePropertiesBeforeFullValue','perf_hooks','get','_objectToString','_capIfString','getOwnPropertyDescriptor','split','_isPrimitiveWrapperType','logger\\x20websocket\\x20error','object','capped','react-native','ws://','onerror','_maxConnectAttemptCount','disabledTrace','then','_reconnectTimeout','_consoleNinjaAllowedToStart','time','reduceOnCount','close','_inBrowser','_dateToString','_additionalMetadata','undefined','string','parent','_setNodePermissions','_WebSocketClass','\\x20server','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_hasSetOnItsPath','nodeModules','autoExpandPropertyCount','_property','reduceOnAccumulatedProcessingTimeMs','match','expressionsToEvaluate',["localhost","127.0.0.1","example.cypress.io","10.0.2.2","DESKTOP-F1CJKH5","192.168.3.40"],'_addProperty','_webSocketErrorDocsLink','node','getOwnPropertyNames','_sendErrorMessage','_attemptToReconnectShortly','_getOwnPropertySymbols','String','_propertyName','emulator','1','substr','test','console','_type','_getOwnPropertyDescriptor','function','reducePolicy','_setNodeQueryPath','\\x20browser',"c:\\\\Users\\\\High End\\\\.antigravity-ide\\\\extensions\\\\wallabyjs.console-ninja-1.0.540-universal\\\\node_modules",'allStrLength','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','elements','return\\x20import(url.pathToFileURL(path.join(nodeModules,\\x20\\x27ws/index.js\\x27)).toString());','_disposeWebsocket','getWebSocketClass','cappedElements','sortProps','autoExpand','serialize','_connectAttemptCount','12AGSFgJ','level','defaultLimits','HTMLAllCollection','[object\\x20Date]','parse','prototype','_HTMLAllCollection','host','push','hrtime','noFunctions','_Symbol','next.js','log','1789203910134','277413nHgiME','props','some','index','forEach','trace','toLowerCase','_console_ninja_session','symbol','now','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','error','_allowedToSend','iterator','','resolve','bind','NEGATIVE_INFINITY','null','_connected','osName','current','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','Map','autoExpandLimit',',\\x20see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','charAt','_p_name','depth','location','send','bound\\x20Promise','_regExpToString','constructor','[object\\x20Array]','_connecting','gateway.docker.internal','coverage','6763','_addFunctionsNode','args','resetOnProcessingTimeAverageMs','perLogpoint','env','type','_undefined','isArray','method','import(\\x27path\\x27)','Buffer','2sqiJYd','_quotedRegExp','endsWith','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','origin','3265273yxFbCV','_keyStrRegExp','Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','valueOf','stringify','resetWhenQuietMs','_setNodeExpressionPath','default','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','strLength','root_exp_id','join','Promise','_WebSocket','fromCharCode','[object\\x20Set]','elapsed','warn','...','Boolean','funcName','call','10.0.2.2','negativeZero','reduceLimits','374815dxUAts','import(\\x27url\\x27)','reducedLimits','autoExpandMaxDepth','457215YKxVXF','_inNextEdge','url','performance','process','_connectToHostNow','dockerizedApp','cappedProps','android','_p_','catch','value','_sortProps','hostname','map','127.0.0.1','_isPrimitiveType','disabledLog','count','_allowedToConnectOnSend','toUpperCase','modules','angular','nuxt','port','totalStrLength','onclose','_treeNodePropertiesAfterFullValue','ninjaSuppressConsole','_addObjectProperty','includes','versions','path','Symbol','_extendedWarning','_isSet','name','global','boolean','data','115188uZQjQp','12zgACNp','isExpressionToEvaluate','_console_ninja'];_0x5e98=function(){return _0x1d5b3b;};return _0x5e98();}z[_0x1c43af(0x172)][_0x1c43af(0x166)]=async function(){var _0x26cbe6=_0x1c43af,_0x463902,_0xf6e806;if(this[_0x26cbe6(0x141)])return this[_0x26cbe6(0x141)];let _0x180946;if(this[_0x26cbe6(0x13a)]||this[_0x26cbe6(0xc2)])_0x180946=this[_0x26cbe6(0xe6)]['WebSocket'];else{if((_0x463902=this[_0x26cbe6(0xe6)][_0x26cbe6(0xc5)])!=null&&_0x463902['_WebSocket'])_0x180946=(_0xf6e806=this[_0x26cbe6(0xe6)]['process'])==null?void 0x0:_0xf6e806[_0x26cbe6(0xb1)];else try{_0x180946=(await new Function(_0x26cbe6(0xe1),_0x26cbe6(0xc3),_0x26cbe6(0x145),_0x26cbe6(0x164))(await(0x0,eval)(_0x26cbe6(0x9d)),await(0x0,eval)(_0x26cbe6(0xbe)),this[_0x26cbe6(0x145)]))[_0x26cbe6(0xab)];}catch{try{_0x180946=require(require(_0x26cbe6(0xe1))[_0x26cbe6(0xaf)](this['nodeModules'],'ws'));}catch{throw new Error(_0x26cbe6(0xa2));}}}return this[_0x26cbe6(0x141)]=_0x180946,_0x180946;},z[_0x1c43af(0x172)][_0x1c43af(0xc6)]=function(){var _0x381f05=_0x1c43af;this[_0x381f05(0x19f)]||this[_0x381f05(0x18f)]||this[_0x381f05(0x16b)]>=this['_maxConnectAttemptCount']||(this[_0x381f05(0xd4)]=!0x1,this[_0x381f05(0x19f)]=!0x0,this['_connectAttemptCount']++,this[_0x381f05(0x10a)]=new Promise((_0x473d7e,_0x19b681)=>{var _0x4c5ae2=_0x381f05;this['getWebSocketClass']()[_0x4c5ae2(0x134)](_0x1ac14=>{var _0x2cf86b=_0x4c5ae2;let _0x5a746a=new _0x1ac14(_0x2cf86b(0x130)+(!this[_0x2cf86b(0x13a)]&&this[_0x2cf86b(0xc7)]?_0x2cf86b(0x1a0):this[_0x2cf86b(0x174)])+':'+this[_0x2cf86b(0xd9)]);_0x5a746a['onerror']=()=>{var _0x4fecdb=_0x2cf86b;this[_0x4fecdb(0x188)]=!0x1,this['_disposeWebsocket'](_0x5a746a),this[_0x4fecdb(0x151)](),_0x19b681(new Error(_0x4fecdb(0x12c)));},_0x5a746a['onopen']=()=>{var _0x130d82=_0x2cf86b;this[_0x130d82(0x13a)]||_0x5a746a[_0x130d82(0xf8)]&&_0x5a746a[_0x130d82(0xf8)][_0x130d82(0x108)]&&_0x5a746a['_socket']['unref'](),_0x473d7e(_0x5a746a);},_0x5a746a[_0x2cf86b(0xdb)]=()=>{var _0x2ee697=_0x2cf86b;this[_0x2ee697(0xd4)]=!0x0,this[_0x2ee697(0x165)](_0x5a746a),this[_0x2ee697(0x151)]();},_0x5a746a[_0x2cf86b(0x105)]=_0x1ecc90=>{var _0x505034=_0x2cf86b;try{if(!(_0x1ecc90!=null&&_0x1ecc90[_0x505034(0xe8)])||!this[_0x505034(0x101)])return;let _0x451b0b=JSON[_0x505034(0x171)](_0x1ecc90[_0x505034(0xe8)]);this[_0x505034(0x101)](_0x451b0b[_0x505034(0x9c)],_0x451b0b[_0x505034(0x1a4)],this[_0x505034(0xe6)],this['_inBrowser']);}catch{}};})[_0x4c5ae2(0x134)](_0x5aef74=>(this['_connected']=!0x0,this[_0x4c5ae2(0x19f)]=!0x1,this[_0x4c5ae2(0xd4)]=!0x1,this[_0x4c5ae2(0x188)]=!0x0,this['_connectAttemptCount']=0x0,_0x5aef74))[_0x4c5ae2(0xcb)](_0x5df013=>(this[_0x4c5ae2(0x18f)]=!0x1,this['_connecting']=!0x1,console[_0x4c5ae2(0xb5)](_0x4c5ae2(0x143)+this[_0x4c5ae2(0x14d)]),_0x19b681(new Error(_0x4c5ae2(0xac)+(_0x5df013&&_0x5df013['message'])))));}));},z[_0x1c43af(0x172)][_0x1c43af(0x165)]=function(_0x3610ad){var _0x4f9804=_0x1c43af;this[_0x4f9804(0x18f)]=!0x1,this[_0x4f9804(0x19f)]=!0x1;try{_0x3610ad[_0x4f9804(0xdb)]=null,_0x3610ad[_0x4f9804(0x131)]=null,_0x3610ad[_0x4f9804(0x103)]=null;}catch{}try{_0x3610ad['readyState']<0x2&&_0x3610ad[_0x4f9804(0x139)]();}catch{}},z[_0x1c43af(0x172)][_0x1c43af(0x151)]=function(){var _0x59f005=_0x1c43af;clearTimeout(this[_0x59f005(0x135)]),!(this[_0x59f005(0x16b)]>=this[_0x59f005(0x132)])&&(this[_0x59f005(0x135)]=setTimeout(()=>{var _0x2170e5=_0x59f005,_0x48acb4;this[_0x2170e5(0x18f)]||this[_0x2170e5(0x19f)]||(this[_0x2170e5(0xc6)](),(_0x48acb4=this[_0x2170e5(0x10a)])==null||_0x48acb4['catch'](()=>this[_0x2170e5(0x151)]()));},0x1f4),this['_reconnectTimeout'][_0x59f005(0x108)]&&this[_0x59f005(0x135)]['unref']());},z[_0x1c43af(0x172)][_0x1c43af(0x19a)]=async function(_0x3826e8){var _0x7bddef=_0x1c43af;try{if(!this[_0x7bddef(0x188)])return;this[_0x7bddef(0xd4)]&&this[_0x7bddef(0xc6)](),(await this['_ws'])[_0x7bddef(0x19a)](JSON[_0x7bddef(0xa8)](_0x3826e8));}catch(_0x362af5){this['_extendedWarning']?console[_0x7bddef(0xb5)](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)])):(this[_0x7bddef(0xe3)]=!0x0,console['warn'](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)]),_0x3826e8)),this[_0x7bddef(0x188)]=!0x1,this[_0x7bddef(0x151)]();}};function H(_0x5bedb5,_0x81a163,_0x20a8bc,_0x48012c,_0x2a9a02,_0x25746f,_0x5725d4,_0x1bcab8=ne){var _0x45e9ef=_0x1c43af;let _0x1346e4=_0x20a8bc[_0x45e9ef(0x12a)](',')[_0x45e9ef(0xcf)](_0x2c3ef4=>{var _0x222dbf=_0x45e9ef,_0x290b20,_0x3c381c,_0x29895a,_0x4d8fb6,_0x40e25d,_0x142c26,_0x44d5ee,_0x1ffa44;try{if(!_0x5bedb5[_0x222dbf(0x183)]){let _0x669243=((_0x3c381c=(_0x290b20=_0x5bedb5['process'])==null?void 0x0:_0x290b20[_0x222dbf(0xe0)])==null?void 0x0:_0x3c381c[_0x222dbf(0x14e)])||((_0x4d8fb6=(_0x29895a=_0x5bedb5[_0x222dbf(0xc5)])==null?void 0x0:_0x29895a[_0x222dbf(0x98)])==null?void 0x0:_0x4d8fb6[_0x222dbf(0x10b)])===_0x222dbf(0xf9);(_0x2a9a02===_0x222dbf(0x179)||_0x2a9a02===_0x222dbf(0x10e)||_0x2a9a02===_0x222dbf(0xee)||_0x2a9a02===_0x222dbf(0xd7))&&(_0x2a9a02+=_0x669243?_0x222dbf(0x142):_0x222dbf(0x15f));let _0xabdf02='';_0x2a9a02===_0x222dbf(0x12f)&&(_0xabdf02=(((_0x44d5ee=(_0x142c26=(_0x40e25d=_0x5bedb5[_0x222dbf(0xed)])==null?void 0x0:_0x40e25d[_0x222dbf(0xd6)])==null?void 0x0:_0x142c26['ExpoDevice'])==null?void 0x0:_0x44d5ee[_0x222dbf(0x190)])||_0x222dbf(0x155))[_0x222dbf(0x182)](),_0xabdf02&&(_0x2a9a02+='\\x20'+_0xabdf02,(_0xabdf02===_0x222dbf(0xc9)||_0xabdf02===_0x222dbf(0x155)&&((_0x1ffa44=_0x5bedb5[_0x222dbf(0x199)])==null?void 0x0:_0x1ffa44[_0x222dbf(0xce)])===_0x222dbf(0xba))&&(_0x81a163='10.0.2.2'))),_0x5bedb5[_0x222dbf(0x183)]={'id':+new Date(),'tool':_0x2a9a02},_0x5725d4&&_0x2a9a02&&!_0x669243&&(_0xabdf02?console['log'](_0x222dbf(0xa6)+_0xabdf02+_0x222dbf(0x195)):console[_0x222dbf(0x17a)](_0x222dbf(0x162)+(_0x2a9a02[_0x222dbf(0x196)](0x0)[_0x222dbf(0xd5)]()+_0x2a9a02[_0x222dbf(0x157)](0x1))+',','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.'));}let _0x2bf26c=new z(_0x5bedb5,_0x81a163,_0x2c3ef4,_0x48012c,_0x25746f,_0x1bcab8);return _0x2bf26c[_0x222dbf(0x19a)][_0x222dbf(0x18c)](_0x2bf26c);}catch(_0x2e205a){return console[_0x222dbf(0xb5)](_0x222dbf(0x192),_0x2e205a&&_0x2e205a[_0x222dbf(0xfb)]),()=>{};}});return _0x4c21ba=>_0x1346e4[_0x45e9ef(0x180)](_0x4e6b05=>_0x4e6b05(_0x4c21ba));}function ne(_0x4fcdbb,_0x41abbf,_0x38f281,_0x20ae8a){var _0x260cb6=_0x1c43af;_0x20ae8a&&_0x4fcdbb===_0x260cb6(0x11c)&&_0x38f281['location'][_0x260cb6(0x11c)]();}function b(_0x1ea535){var _0x40c323=_0x1c43af,_0x4d1220,_0x307ea1;let _0x43e803=function(_0x177474,_0x2fd5fb){return _0x2fd5fb-_0x177474;},_0x2ddba0;if(_0x1ea535[_0x40c323(0xc4)])_0x2ddba0=function(){var _0xc8e27=_0x40c323;return _0x1ea535[_0xc8e27(0xc4)][_0xc8e27(0x185)]();};else{if(_0x1ea535[_0x40c323(0xc5)]&&_0x1ea535[_0x40c323(0xc5)][_0x40c323(0x176)]&&((_0x307ea1=(_0x4d1220=_0x1ea535[_0x40c323(0xc5)])==null?void 0x0:_0x4d1220['env'])==null?void 0x0:_0x307ea1[_0x40c323(0x10b)])!==_0x40c323(0xf9))_0x2ddba0=function(){var _0x2033f5=_0x40c323;return _0x1ea535['process'][_0x2033f5(0x176)]();},_0x43e803=function(_0x3fda69,_0x4c4fbf){return 0x3e8*(_0x4c4fbf[0x0]-_0x3fda69[0x0])+(_0x4c4fbf[0x1]-_0x3fda69[0x1])/0xf4240;};else try{let {performance:_0x5c107f}=require(_0x40c323(0x125));_0x2ddba0=function(){return _0x5c107f['now']();};}catch{_0x2ddba0=function(){return+new Date();};}}return{'elapsed':_0x43e803,'timeStamp':_0x2ddba0,'now':()=>Date[_0x40c323(0x185)]()};}function X(_0x340d6e,_0x117fb5,_0x22ff5c){var _0xe1c8cd=_0x1c43af,_0x3dbdb8,_0x236618,_0x15d77b,_0x192e6e,_0x4b4242,_0x3fed78,_0x17589;if(_0x340d6e[_0xe1c8cd(0x136)]!==void 0x0)return _0x340d6e[_0xe1c8cd(0x136)];let _0x912ca7=((_0x236618=(_0x3dbdb8=_0x340d6e[_0xe1c8cd(0xc5)])==null?void 0x0:_0x3dbdb8[_0xe1c8cd(0xe0)])==null?void 0x0:_0x236618['node'])||((_0x192e6e=(_0x15d77b=_0x340d6e['process'])==null?void 0x0:_0x15d77b[_0xe1c8cd(0x98)])==null?void 0x0:_0x192e6e[_0xe1c8cd(0x10b)])==='edge',_0x6b35ca=!!(_0x22ff5c===_0xe1c8cd(0x12f)&&((_0x4b4242=_0x340d6e[_0xe1c8cd(0xed)])==null?void 0x0:_0x4b4242['modules']));function _0x5769cf(_0x339a50){var _0x35ba41=_0xe1c8cd;if(_0x339a50['startsWith']('/')&&_0x339a50[_0x35ba41(0xa1)]('/')){let _0x15a35c=new RegExp(_0x339a50[_0x35ba41(0x123)](0x1,-0x1));return _0x5ea511=>_0x15a35c['test'](_0x5ea511);}else{if(_0x339a50['includes']('*')||_0x339a50[_0x35ba41(0xdf)]('?')){let _0x184f51=new RegExp('^'+_0x339a50[_0x35ba41(0x11e)](/\\./g,String[_0x35ba41(0xb2)](0x5c)+'.')[_0x35ba41(0x11e)](/\\*/g,'.*')['replace'](/\\?/g,'.')+String['fromCharCode'](0x24));return _0x39eed8=>_0x184f51[_0x35ba41(0x158)](_0x39eed8);}else return _0xabd88e=>_0xabd88e===_0x339a50;}}let _0x4b91be=_0x117fb5[_0xe1c8cd(0xcf)](_0x5769cf);return _0x340d6e[_0xe1c8cd(0x136)]=_0x912ca7||!_0x117fb5,!_0x340d6e[_0xe1c8cd(0x136)]&&((_0x3fed78=_0x340d6e['location'])==null?void 0x0:_0x3fed78['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=_0x4b91be[_0xe1c8cd(0x17e)](_0x343231=>_0x343231(_0x340d6e[_0xe1c8cd(0x199)][_0xe1c8cd(0xce)]))),_0x6b35ca&&!_0x340d6e[_0xe1c8cd(0x136)]&&!((_0x17589=_0x340d6e['location'])!=null&&_0x17589['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=!0x0),_0x340d6e['_consoleNinjaAllowedToStart'];}function _0xa6b0(_0x3977d5,_0x32be94){var _0x5e983e=_0x5e98();return _0xa6b0=function(_0xa6b054,_0x27ece8){_0xa6b054=_0xa6b054-0x97;var _0x18222c=_0x5e983e[_0xa6b054];return _0x18222c;},_0xa6b0(_0x3977d5,_0x32be94);}function J(_0x2a19ae,_0x447b71,_0x7f88c9,_0x5161a5,_0x483b0f,_0x599cd8){var _0x1bff5a=_0x1c43af;_0x2a19ae=_0x2a19ae,_0x447b71=_0x447b71,_0x7f88c9=_0x7f88c9,_0x5161a5=_0x5161a5,_0x483b0f=_0x483b0f,_0x483b0f=_0x483b0f||{},_0x483b0f[_0x1bff5a(0x16e)]=_0x483b0f[_0x1bff5a(0x16e)]||{},_0x483b0f['reducedLimits']=_0x483b0f[_0x1bff5a(0xbf)]||{},_0x483b0f[_0x1bff5a(0x15d)]=_0x483b0f[_0x1bff5a(0x15d)]||{},_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']=_0x483b0f['reducePolicy'][_0x1bff5a(0x97)]||{},_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]=_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]||{};let _0x15035d={'perLogpoint':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)][_0x1bff5a(0x138)]||0x32,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint'][_0x1bff5a(0x148)]||0x64,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']['resetWhenQuietMs']||0x1f4,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)]['resetOnProcessingTimeAverageMs']||0x64},'global':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)]['global'][_0x1bff5a(0x138)]||0x3e8,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['reduceOnAccumulatedProcessingTimeMs']||0x12c,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['resetWhenQuietMs']||0x32,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)][_0x1bff5a(0x1a5)]||0x64}},_0x501118=b(_0x2a19ae),_0x49b596=_0x501118[_0x1bff5a(0xb4)],_0x32f0dd=_0x501118['timeStamp'];function _0x3c842b(){var _0x32cdb1=_0x1bff5a;this[_0x32cdb1(0xa5)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x32cdb1(0x112)]=/^(0|[1-9][0-9]*)$/,this[_0x32cdb1(0xa0)]=/'([^\\\\']|\\\\')*'/,this[_0x32cdb1(0x9a)]=_0x2a19ae[_0x32cdb1(0x13d)],this[_0x32cdb1(0x173)]=_0x2a19ae['HTMLAllCollection'],this[_0x32cdb1(0x15b)]=Object[_0x32cdb1(0x129)],this['_getOwnPropertyNames']=Object[_0x32cdb1(0x14f)],this['_Symbol']=_0x2a19ae[_0x32cdb1(0xe2)],this[_0x32cdb1(0x19c)]=RegExp[_0x32cdb1(0x172)]['toString'],this[_0x32cdb1(0x13b)]=Date[_0x32cdb1(0x172)][_0x32cdb1(0x11b)];}_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x16a)]=function(_0x40d313,_0x3fb199,_0x10e703,_0x3e651e){var _0x31c197=_0x1bff5a,_0x5c7575=this,_0xb95b67=_0x10e703[_0x31c197(0x169)];function _0x7ee627(_0x50c25b,_0x2d57c1,_0x4ad281){var _0x32ec39=_0x31c197;_0x2d57c1[_0x32ec39(0x99)]=_0x32ec39(0x114),_0x2d57c1[_0x32ec39(0x187)]=_0x50c25b[_0x32ec39(0xfb)],_0x16f50a=_0x4ad281[_0x32ec39(0x14e)][_0x32ec39(0x191)],_0x4ad281['node'][_0x32ec39(0x191)]=_0x2d57c1,_0x5c7575[_0x32ec39(0x124)](_0x2d57c1,_0x4ad281);}let _0x36cd62,_0x1773b6,_0x23751c=_0x2a19ae[_0x31c197(0xdd)];_0x2a19ae['ninjaSuppressConsole']=!0x0,_0x2a19ae[_0x31c197(0x159)]&&(_0x36cd62=_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)],_0x1773b6=_0x2a19ae['console'][_0x31c197(0xb5)],_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=function(){}),_0x1773b6&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0xb5)]=function(){}));try{try{_0x10e703[_0x31c197(0x16d)]++,_0x10e703[_0x31c197(0x169)]&&_0x10e703[_0x31c197(0xf1)]['push'](_0x3fb199);var _0x25e0f3,_0x4eb4e8,_0x18d4fe,_0x37ccc9,_0x30d81d=[],_0x56445b=[],_0x302c18,_0x5830a7=this[_0x31c197(0x15a)](_0x3fb199),_0x2a7b73=_0x5830a7===_0x31c197(0x111),_0x8efbaa=!0x1,_0x5670c1=_0x5830a7===_0x31c197(0x15c),_0x2c17b4=this['_isPrimitiveType'](_0x5830a7),_0xb70796=this['_isPrimitiveWrapperType'](_0x5830a7),_0x3c20b2=_0x2c17b4||_0xb70796,_0x36f42e={},_0x552b6b=0x0,_0x22e716=!0x1,_0x16f50a,_0x1394aa=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x10e703[_0x31c197(0x198)]){if(_0x2a7b73){if(_0x4eb4e8=_0x3fb199[_0x31c197(0x10d)],_0x4eb4e8>_0x10e703[_0x31c197(0x163)]){for(_0x18d4fe=0x0,_0x37ccc9=_0x10e703[_0x31c197(0x163)],_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));_0x40d313[_0x31c197(0x167)]=!0x0;}else{for(_0x18d4fe=0x0,_0x37ccc9=_0x4eb4e8,_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));}_0x10e703[_0x31c197(0x146)]+=_0x56445b[_0x31c197(0x10d)];}if(!(_0x5830a7==='null'||_0x5830a7==='undefined')&&!_0x2c17b4&&_0x5830a7!==_0x31c197(0x153)&&_0x5830a7!==_0x31c197(0x9e)&&_0x5830a7!==_0x31c197(0x11a)){var _0x718615=_0x3e651e[_0x31c197(0x17d)]||_0x10e703[_0x31c197(0x17d)];if(this[_0x31c197(0xe4)](_0x3fb199)?(_0x25e0f3=0x0,_0x3fb199[_0x31c197(0x180)](function(_0x5367ff){var _0x157c73=_0x31c197;if(_0x552b6b++,_0x10e703[_0x157c73(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703[_0x157c73(0xeb)]&&_0x10e703[_0x157c73(0x169)]&&_0x10e703[_0x157c73(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}_0x56445b[_0x157c73(0x175)](_0x5c7575['_addProperty'](_0x30d81d,_0x3fb199,_0x157c73(0x11d),_0x25e0f3++,_0x10e703,function(_0x4b87c0){return function(){return _0x4b87c0;};}(_0x5367ff)));})):this['_isMap'](_0x3fb199)&&_0x3fb199['forEach'](function(_0x4f6586,_0x1127ce){var _0x1f1731=_0x31c197;if(_0x552b6b++,_0x10e703[_0x1f1731(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703['isExpressionToEvaluate']&&_0x10e703[_0x1f1731(0x169)]&&_0x10e703[_0x1f1731(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}var _0x5c22c1=_0x1127ce[_0x1f1731(0x11b)]();_0x5c22c1[_0x1f1731(0x10d)]>0x64&&(_0x5c22c1=_0x5c22c1[_0x1f1731(0x123)](0x0,0x64)+_0x1f1731(0xb6)),_0x56445b[_0x1f1731(0x175)](_0x5c7575[_0x1f1731(0x14c)](_0x30d81d,_0x3fb199,'Map',_0x5c22c1,_0x10e703,function(_0x310ba3){return function(){return _0x310ba3;};}(_0x4f6586)));}),!_0x8efbaa){try{for(_0x302c18 in _0x3fb199)if(!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703[_0x31c197(0x194)]){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575['_addObjectProperty'](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}catch{}if(_0x36f42e[_0x31c197(0x119)]=!0x0,_0x5670c1&&(_0x36f42e[_0x31c197(0x197)]=!0x0),!_0x22e716){var _0xf18844=[]['concat'](this[_0x31c197(0x100)](_0x3fb199))['concat'](this[_0x31c197(0x152)](_0x3fb199));for(_0x25e0f3=0x0,_0x4eb4e8=_0xf18844[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)if(_0x302c18=_0xf18844[_0x25e0f3],!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18['toString']()))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)&&!_0x36f42e[typeof _0x302c18!=_0x31c197(0x184)?_0x31c197(0xca)+_0x302c18[_0x31c197(0x11b)]():_0x302c18]){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575[_0x31c197(0xde)](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}}}}if(_0x40d313[_0x31c197(0x99)]=_0x5830a7,_0x3c20b2?(_0x40d313['value']=_0x3fb199[_0x31c197(0xa7)](),this[_0x31c197(0x128)](_0x5830a7,_0x40d313,_0x10e703,_0x3e651e)):_0x5830a7===_0x31c197(0x107)?_0x40d313[_0x31c197(0xcc)]=this['_dateToString'][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x11a)?_0x40d313[_0x31c197(0xcc)]=_0x3fb199[_0x31c197(0x11b)]():_0x5830a7==='RegExp'?_0x40d313['value']=this[_0x31c197(0x19c)][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x184)&&this[_0x31c197(0x178)]?_0x40d313[_0x31c197(0xcc)]=this[_0x31c197(0x178)][_0x31c197(0x172)][_0x31c197(0x11b)]['call'](_0x3fb199):!_0x10e703[_0x31c197(0x198)]&&!(_0x5830a7===_0x31c197(0x18e)||_0x5830a7===_0x31c197(0x13d))&&(delete _0x40d313[_0x31c197(0xcc)],_0x40d313['capped']=!0x0),_0x22e716&&(_0x40d313[_0x31c197(0xc8)]=!0x0),_0x16f50a=_0x10e703[_0x31c197(0x14e)]['current'],_0x10e703[_0x31c197(0x14e)][_0x31c197(0x191)]=_0x40d313,this['_treeNodePropertiesBeforeFullValue'](_0x40d313,_0x10e703),_0x56445b['length']){for(_0x25e0f3=0x0,_0x4eb4e8=_0x56445b[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)_0x56445b[_0x25e0f3](_0x25e0f3);}_0x30d81d[_0x31c197(0x10d)]&&(_0x40d313['props']=_0x30d81d);}catch(_0x48a3c4){_0x7ee627(_0x48a3c4,_0x40d313,_0x10e703);}this['_additionalMetadata'](_0x3fb199,_0x40d313),this[_0x31c197(0xdc)](_0x40d313,_0x10e703),_0x10e703[_0x31c197(0x14e)]['current']=_0x16f50a,_0x10e703[_0x31c197(0x16d)]--,_0x10e703[_0x31c197(0x169)]=_0xb95b67,_0x10e703[_0x31c197(0x169)]&&_0x10e703['autoExpandPreviousObjects']['pop']();}finally{_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=_0x36cd62),_0x1773b6&&(_0x2a19ae['console']['warn']=_0x1773b6),_0x2a19ae[_0x31c197(0xdd)]=_0x23751c;}return _0x40d313;},_0x3c842b['prototype'][_0x1bff5a(0x152)]=function(_0x5568c0){var _0x950ed8=_0x1bff5a;return Object[_0x950ed8(0xf2)]?Object[_0x950ed8(0xf2)](_0x5568c0):[];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xe4)]=function(_0x5cff31){var _0x5294c9=_0x1bff5a;return!!(_0x5cff31&&_0x2a19ae[_0x5294c9(0x11d)]&&this['_objectToString'](_0x5cff31)===_0x5294c9(0xb3)&&_0x5cff31[_0x5294c9(0x180)]);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf4)]=function(_0x176394,_0x32608a,_0xd5d805){var _0x4c84a9=_0x1bff5a;if(!_0xd5d805['resolveGetters']){let _0x75bbab=this['_getOwnPropertyDescriptor'](_0x176394,_0x32608a);if(_0x75bbab&&_0x75bbab[_0x4c84a9(0x126)])return!0x0;}return _0xd5d805[_0x4c84a9(0x177)]?typeof _0x176394[_0x32608a]=='function':!0x1;},_0x3c842b['prototype'][_0x1bff5a(0x15a)]=function(_0x2dedf1){var _0x14c6b0=_0x1bff5a,_0x5f049e='';return _0x5f049e=typeof _0x2dedf1,_0x5f049e===_0x14c6b0(0x12d)?this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x19e)?_0x5f049e=_0x14c6b0(0x111):this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x170)?_0x5f049e=_0x14c6b0(0x107):this[_0x14c6b0(0x127)](_0x2dedf1)==='[object\\x20BigInt]'?_0x5f049e=_0x14c6b0(0x11a):_0x2dedf1===null?_0x5f049e=_0x14c6b0(0x18e):_0x2dedf1[_0x14c6b0(0x19d)]&&(_0x5f049e=_0x2dedf1[_0x14c6b0(0x19d)][_0x14c6b0(0xe5)]||_0x5f049e):_0x5f049e===_0x14c6b0(0x13d)&&this[_0x14c6b0(0x173)]&&_0x2dedf1 instanceof this[_0x14c6b0(0x173)]&&(_0x5f049e=_0x14c6b0(0x16f)),_0x5f049e;},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x127)]=function(_0x26fd83){var _0x2cc9cb=_0x1bff5a;return Object[_0x2cc9cb(0x172)][_0x2cc9cb(0x11b)][_0x2cc9cb(0xb9)](_0x26fd83);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xd1)]=function(_0x33c047){var _0x1aed3d=_0x1bff5a;return _0x33c047===_0x1aed3d(0xe7)||_0x33c047===_0x1aed3d(0x13e)||_0x33c047===_0x1aed3d(0x113);},_0x3c842b['prototype'][_0x1bff5a(0x12b)]=function(_0x9c26bc){var _0x3445a7=_0x1bff5a;return _0x9c26bc===_0x3445a7(0xb7)||_0x9c26bc===_0x3445a7(0x153)||_0x9c26bc==='Number';},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x14c)]=function(_0x39d72b,_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931){var _0x13303e=this;return function(_0x3b0a04){var _0xfd957=_0xa6b0,_0x1e9977=_0x2af968['node']['current'],_0x416967=_0x2af968['node']['index'],_0x278cad=_0x2af968[_0xfd957(0x14e)][_0xfd957(0x13f)];_0x2af968['node']['parent']=_0x1e9977,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=typeof _0x3315a9==_0xfd957(0x113)?_0x3315a9:_0x3b0a04,_0x39d72b[_0xfd957(0x175)](_0x13303e[_0xfd957(0x147)](_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931)),_0x2af968[_0xfd957(0x14e)]['parent']=_0x278cad,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=_0x416967;};},_0x3c842b['prototype'][_0x1bff5a(0xde)]=function(_0x1ac5b3,_0x4e5a09,_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c){var _0x416fff=_0x1bff5a,_0x5079ab=this;return _0x4e5a09[typeof _0x28ffe1!=_0x416fff(0x184)?_0x416fff(0xca)+_0x28ffe1[_0x416fff(0x11b)]():_0x28ffe1]=!0x0,function(_0x193c6b){var _0x8b0c8=_0x416fff,_0x4e890c=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x191)],_0x1de07b=_0xa4d180[_0x8b0c8(0x14e)]['index'],_0x4c6e05=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)];_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)]=_0x4e890c,_0xa4d180['node']['index']=_0x193c6b,_0x1ac5b3['push'](_0x5079ab['_property'](_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c)),_0xa4d180['node']['parent']=_0x4c6e05,_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x17f)]=_0x1de07b;};},_0x3c842b['prototype'][_0x1bff5a(0x147)]=function(_0x3fc911,_0x53af0b,_0x1daee9,_0x1aaecf,_0x3c6648){var _0x24ab9f=_0x1bff5a,_0x1044ef=this;_0x3c6648||(_0x3c6648=function(_0x5aebf0,_0xe2bf62){return _0x5aebf0[_0xe2bf62];});var _0x3ba706=_0x1daee9[_0x24ab9f(0x11b)](),_0x147ad8=_0x1aaecf[_0x24ab9f(0x14a)]||{},_0x564175=_0x1aaecf[_0x24ab9f(0x198)],_0x4c8e20=_0x1aaecf['isExpressionToEvaluate'];try{var _0xa14fb7=this[_0x24ab9f(0x106)](_0x3fc911),_0xf1a445=_0x3ba706;_0xa14fb7&&_0xf1a445[0x0]==='\\x27'&&(_0xf1a445=_0xf1a445[_0x24ab9f(0x157)](0x1,_0xf1a445[_0x24ab9f(0x10d)]-0x2));var _0x83dd31=_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8[_0x24ab9f(0xca)+_0xf1a445];_0x83dd31&&(_0x1aaecf[_0x24ab9f(0x198)]=_0x1aaecf[_0x24ab9f(0x198)]+0x1),_0x1aaecf['isExpressionToEvaluate']=!!_0x83dd31;var _0x1718af=typeof _0x1daee9==_0x24ab9f(0x184),_0x3e3cf6={'name':_0x1718af||_0xa14fb7?_0x3ba706:this[_0x24ab9f(0x154)](_0x3ba706)};if(_0x1718af&&(_0x3e3cf6[_0x24ab9f(0x184)]=!0x0),!(_0x53af0b===_0x24ab9f(0x111)||_0x53af0b==='Error')){var _0x270121=this[_0x24ab9f(0x15b)](_0x3fc911,_0x1daee9);if(_0x270121&&(_0x270121['set']&&(_0x3e3cf6[_0x24ab9f(0xfd)]=!0x0),_0x270121['get']&&!_0x83dd31&&!_0x1aaecf[_0x24ab9f(0x102)]))return _0x3e3cf6['getter']=!0x0,this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x75d602;try{_0x75d602=_0x3c6648(_0x3fc911,_0x1daee9);}catch(_0x13aa60){return _0x3e3cf6={'name':_0x3ba706,'type':_0x24ab9f(0x114),'error':_0x13aa60[_0x24ab9f(0xfb)]},this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x74802c=this['_type'](_0x75d602),_0x3e9d1f=this['_isPrimitiveType'](_0x74802c);if(_0x3e3cf6[_0x24ab9f(0x99)]=_0x74802c,_0x3e9d1f)this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x58307e=_0x24ab9f;_0x3e3cf6[_0x58307e(0xcc)]=_0x75d602['valueOf'](),!_0x83dd31&&_0x1044ef[_0x58307e(0x128)](_0x74802c,_0x3e3cf6,_0x1aaecf,{});});else{var _0xf56525=_0x1aaecf['autoExpand']&&_0x1aaecf[_0x24ab9f(0x16d)]<_0x1aaecf[_0x24ab9f(0xc0)]&&_0x1aaecf['autoExpandPreviousObjects']['indexOf'](_0x75d602)<0x0&&_0x74802c!==_0x24ab9f(0x15c)&&_0x1aaecf[_0x24ab9f(0x146)]<_0x1aaecf['autoExpandLimit'];_0xf56525||_0x1aaecf['level']<_0x564175||_0x83dd31?this[_0x24ab9f(0x16a)](_0x3e3cf6,_0x75d602,_0x1aaecf,_0x83dd31||{}):this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x393a95=_0x24ab9f;_0x74802c===_0x393a95(0x18e)||_0x74802c===_0x393a95(0x13d)||(delete _0x3e3cf6[_0x393a95(0xcc)],_0x3e3cf6[_0x393a95(0x12e)]=!0x0);});}return _0x3e3cf6;}finally{_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8,_0x1aaecf['depth']=_0x564175,_0x1aaecf[_0x24ab9f(0xeb)]=_0x4c8e20;}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x128)]=function(_0x56d3fe,_0x3888bc,_0x5eecce,_0x4702b6){var _0x2683b4=_0x1bff5a,_0x25341f=_0x4702b6[_0x2683b4(0xad)]||_0x5eecce[_0x2683b4(0xad)];if((_0x56d3fe==='string'||_0x56d3fe===_0x2683b4(0x153))&&_0x3888bc[_0x2683b4(0xcc)]){let _0x49128b=_0x3888bc[_0x2683b4(0xcc)][_0x2683b4(0x10d)];_0x5eecce[_0x2683b4(0x161)]+=_0x49128b,_0x5eecce[_0x2683b4(0x161)]>_0x5eecce[_0x2683b4(0xda)]?(_0x3888bc[_0x2683b4(0x12e)]='',delete _0x3888bc[_0x2683b4(0xcc)]):_0x49128b>_0x25341f&&(_0x3888bc['capped']=_0x3888bc['value'][_0x2683b4(0x157)](0x0,_0x25341f),delete _0x3888bc[_0x2683b4(0xcc)]);}},_0x3c842b[_0x1bff5a(0x172)]['_isMap']=function(_0x23ed93){var _0x32ae70=_0x1bff5a;return!!(_0x23ed93&&_0x2a19ae[_0x32ae70(0x193)]&&this[_0x32ae70(0x127)](_0x23ed93)===_0x32ae70(0x117)&&_0x23ed93[_0x32ae70(0x180)]);},_0x3c842b['prototype'][_0x1bff5a(0x154)]=function(_0x539e6b){var _0x3e9eb6=_0x1bff5a;if(_0x539e6b['match'](/^\\d+$/))return _0x539e6b;var _0x268203;try{_0x268203=JSON[_0x3e9eb6(0xa8)](''+_0x539e6b);}catch{_0x268203='\\x22'+this['_objectToString'](_0x539e6b)+'\\x22';}return _0x268203[_0x3e9eb6(0x149)](/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?_0x268203=_0x268203['substr'](0x1,_0x268203[_0x3e9eb6(0x10d)]-0x2):_0x268203=_0x268203['replace'](/'/g,'\\x5c\\x27')[_0x3e9eb6(0x11e)](/\\\\"/g,'\\x22')[_0x3e9eb6(0x11e)](/(^"|"$)/g,'\\x27'),_0x268203;},_0x3c842b['prototype'][_0x1bff5a(0x115)]=function(_0x1b22e6,_0x139c74,_0x26c1fb,_0x18f60b){var _0x59810d=_0x1bff5a;this[_0x59810d(0x124)](_0x1b22e6,_0x139c74),_0x18f60b&&_0x18f60b(),this[_0x59810d(0x13c)](_0x26c1fb,_0x1b22e6),this[_0x59810d(0xdc)](_0x1b22e6,_0x139c74);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x124)]=function(_0x3de57f,_0x633f7e){var _0x3b15c7=_0x1bff5a;this[_0x3b15c7(0x120)](_0x3de57f,_0x633f7e),this['_setNodeQueryPath'](_0x3de57f,_0x633f7e),this[_0x3b15c7(0xaa)](_0x3de57f,_0x633f7e),this[_0x3b15c7(0x140)](_0x3de57f,_0x633f7e);},_0x3c842b['prototype'][_0x1bff5a(0x120)]=function(_0x212392,_0x5350c2){},_0x3c842b['prototype'][_0x1bff5a(0x15e)]=function(_0x254f19,_0xb65cfa){},_0x3c842b[_0x1bff5a(0x172)]['_setNodeLabel']=function(_0x5174e1,_0x4a4537){},_0x3c842b[_0x1bff5a(0x172)]['_isUndefined']=function(_0x4b9a4e){var _0x29d539=_0x1bff5a;return _0x4b9a4e===this[_0x29d539(0x9a)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xdc)]=function(_0x112fbe,_0xc2b2f8){var _0x13069a=_0x1bff5a;this[_0x13069a(0x122)](_0x112fbe,_0xc2b2f8),this[_0x13069a(0x118)](_0x112fbe),_0xc2b2f8[_0x13069a(0x168)]&&this[_0x13069a(0xcd)](_0x112fbe),this[_0x13069a(0x1a3)](_0x112fbe,_0xc2b2f8),this['_addLoadNode'](_0x112fbe,_0xc2b2f8),this['_cleanNode'](_0x112fbe);},_0x3c842b[_0x1bff5a(0x172)]['_additionalMetadata']=function(_0x480177,_0x5bf51c){var _0x36c251=_0x1bff5a;try{_0x480177&&typeof _0x480177[_0x36c251(0x10d)]==_0x36c251(0x113)&&(_0x5bf51c[_0x36c251(0x10d)]=_0x480177[_0x36c251(0x10d)]);}catch{}if(_0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x113)||_0x5bf51c[_0x36c251(0x99)]==='Number'){if(isNaN(_0x5bf51c[_0x36c251(0xcc)]))_0x5bf51c[_0x36c251(0xf7)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];else switch(_0x5bf51c['value']){case Number['POSITIVE_INFINITY']:_0x5bf51c['positiveInfinity']=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case Number[_0x36c251(0x18d)]:_0x5bf51c[_0x36c251(0x109)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case 0x0:this[_0x36c251(0xef)](_0x5bf51c[_0x36c251(0xcc)])&&(_0x5bf51c[_0x36c251(0xbb)]=!0x0);break;}}else _0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x15c)&&typeof _0x480177[_0x36c251(0xe5)]==_0x36c251(0x13e)&&_0x480177[_0x36c251(0xe5)]&&_0x5bf51c[_0x36c251(0xe5)]&&_0x480177['name']!==_0x5bf51c[_0x36c251(0xe5)]&&(_0x5bf51c[_0x36c251(0xb8)]=_0x480177['name']);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xef)]=function(_0x5f59c6){var _0x3d7094=_0x1bff5a;return 0x1/_0x5f59c6===Number[_0x3d7094(0x18d)];},_0x3c842b[_0x1bff5a(0x172)]['_sortProps']=function(_0x341845){var _0xf1b50d=_0x1bff5a;!_0x341845['props']||!_0x341845[_0xf1b50d(0x17d)][_0xf1b50d(0x10d)]||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x111)||_0x341845['type']===_0xf1b50d(0x193)||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x11d)||_0x341845[_0xf1b50d(0x17d)]['sort'](function(_0x18e25d,_0x2e5ca7){var _0x5d8ea4=_0xf1b50d,_0x2086c0=_0x18e25d[_0x5d8ea4(0xe5)]['toLowerCase'](),_0x11bbd3=_0x2e5ca7[_0x5d8ea4(0xe5)]['toLowerCase']();return _0x2086c0<_0x11bbd3?-0x1:_0x2086c0>_0x11bbd3?0x1:0x0;});},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x1a3)]=function(_0x54949b,_0x4cb346){var _0x5e9777=_0x1bff5a;if(!(_0x4cb346[_0x5e9777(0x177)]||!_0x54949b[_0x5e9777(0x17d)]||!_0x54949b['props'][_0x5e9777(0x10d)])){for(var _0x4f6972=[],_0x78d8a8=[],_0x20bd98=0x0,_0x5628f1=_0x54949b['props'][_0x5e9777(0x10d)];_0x20bd98<_0x5628f1;_0x20bd98++){var _0x5c1147=_0x54949b[_0x5e9777(0x17d)][_0x20bd98];_0x5c1147[_0x5e9777(0x99)]===_0x5e9777(0x15c)?_0x4f6972[_0x5e9777(0x175)](_0x5c1147):_0x78d8a8[_0x5e9777(0x175)](_0x5c1147);}if(!(!_0x78d8a8['length']||_0x4f6972[_0x5e9777(0x10d)]<=0x1)){_0x54949b[_0x5e9777(0x17d)]=_0x78d8a8;var _0x1ffed3={'functionsNode':!0x0,'props':_0x4f6972};this[_0x5e9777(0x120)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x122)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x118)](_0x1ffed3),this['_setNodePermissions'](_0x1ffed3,_0x4cb346),_0x1ffed3['id']+='\\x20f',_0x54949b[_0x5e9777(0x17d)]['unshift'](_0x1ffed3);}}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x10f)]=function(_0x3e2ffa,_0x7cf6a2){},_0x3c842b['prototype'][_0x1bff5a(0x118)]=function(_0x25a8d7){},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf3)]=function(_0x1726d6){var _0x4469e7=_0x1bff5a;return Array[_0x4469e7(0x9b)](_0x1726d6)||typeof _0x1726d6==_0x4469e7(0x12d)&&this[_0x4469e7(0x127)](_0x1726d6)===_0x4469e7(0x19e);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x140)]=function(_0x4c1d3c,_0x349781){},_0x3c842b['prototype']['_cleanNode']=function(_0x4d21c1){var _0xd58577=_0x1bff5a;delete _0x4d21c1[_0xd58577(0xf5)],delete _0x4d21c1[_0xd58577(0x144)],delete _0x4d21c1[_0xd58577(0x110)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xaa)]=function(_0x43e4e6,_0x3cf6da){};let _0x22e9d1=new _0x3c842b(),_0x31d042={'props':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x17d)]||0x64,'elements':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x163)]||0x64,'strLength':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0xad)]||0x400*0x32,'totalStrLength':_0x483b0f['defaultLimits'][_0x1bff5a(0xda)]||0x400*0x32,'autoExpandLimit':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x194)]||0x1388,'autoExpandMaxDepth':_0x483b0f['defaultLimits'][_0x1bff5a(0xc0)]||0xa},_0x5134cc={'props':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x17d)]||0x5,'elements':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x163)]||0x5,'strLength':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0xad)]||0x100,'totalStrLength':_0x483b0f['reducedLimits'][_0x1bff5a(0xda)]||0x100*0x3,'autoExpandLimit':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x194)]||0x1e,'autoExpandMaxDepth':_0x483b0f[_0x1bff5a(0xbf)]['autoExpandMaxDepth']||0x2};if(_0x599cd8){let _0x10c22a=_0x22e9d1[_0x1bff5a(0x16a)][_0x1bff5a(0x18c)](_0x22e9d1);_0x22e9d1[_0x1bff5a(0x16a)]=function(_0x63dc8a,_0xf87bc8,_0xed8b,_0x3030e4){return _0x10c22a(_0x63dc8a,_0x599cd8(_0xf87bc8),_0xed8b,_0x3030e4);};}function _0x36e6e0(_0x4b7ae2,_0x7448e6,_0x1e6871,_0x13e959,_0x54bcfa,_0x5e46fe){var _0x55e03f=_0x1bff5a;let _0x581fa4,_0x572fc2;try{_0x572fc2=_0x32f0dd(),_0x581fa4=_0x7f88c9[_0x7448e6],!_0x581fa4||_0x572fc2-_0x581fa4['ts']>_0x15035d['perLogpoint'][_0x55e03f(0xa9)]&&_0x581fa4['count']&&_0x581fa4[_0x55e03f(0x137)]/_0x581fa4[_0x55e03f(0xd3)]<_0x15035d['perLogpoint']['resetOnProcessingTimeAverageMs']?(_0x7f88c9[_0x7448e6]=_0x581fa4={'count':0x0,'time':0x0,'ts':_0x572fc2},_0x7f88c9[_0x55e03f(0x10c)]={}):_0x572fc2-_0x7f88c9[_0x55e03f(0x10c)]['ts']>_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0xa9)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]/_0x7f88c9[_0x55e03f(0x10c)]['count']<_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0x1a5)]&&(_0x7f88c9[_0x55e03f(0x10c)]={});let _0x592aa0=[],_0x201cd8=_0x581fa4['reduceLimits']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xbc)]?_0x5134cc:_0x31d042,_0x1c3b41=_0x440706=>{var _0x380ff0=_0x55e03f;let _0x2fbc49={};return _0x2fbc49['props']=_0x440706['props'],_0x2fbc49['elements']=_0x440706[_0x380ff0(0x163)],_0x2fbc49['strLength']=_0x440706['strLength'],_0x2fbc49[_0x380ff0(0xda)]=_0x440706[_0x380ff0(0xda)],_0x2fbc49[_0x380ff0(0x194)]=_0x440706[_0x380ff0(0x194)],_0x2fbc49[_0x380ff0(0xc0)]=_0x440706[_0x380ff0(0xc0)],_0x2fbc49[_0x380ff0(0x168)]=!0x1,_0x2fbc49[_0x380ff0(0x177)]=!_0x447b71,_0x2fbc49[_0x380ff0(0x198)]=0x1,_0x2fbc49['level']=0x0,_0x2fbc49[_0x380ff0(0xfa)]=_0x380ff0(0xae),_0x2fbc49['rootExpression']=_0x380ff0(0x104),_0x2fbc49[_0x380ff0(0x169)]=!0x0,_0x2fbc49[_0x380ff0(0xf1)]=[],_0x2fbc49['autoExpandPropertyCount']=0x0,_0x2fbc49[_0x380ff0(0x102)]=_0x483b0f[_0x380ff0(0x102)],_0x2fbc49[_0x380ff0(0x161)]=0x0,_0x2fbc49[_0x380ff0(0x14e)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x2fbc49;};for(var _0x34cb46=0x0;_0x34cb46<_0x54bcfa['length'];_0x34cb46++)_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'timeNode':_0x4b7ae2==='time'||void 0x0},_0x54bcfa[_0x34cb46],_0x1c3b41(_0x201cd8),{}));if(_0x4b7ae2==='trace'||_0x4b7ae2===_0x55e03f(0x187)){let _0x38f028=Error['stackTraceLimit'];try{Error['stackTraceLimit']=0x1/0x0,_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'stackNode':!0x0},new Error()['stack'],_0x1c3b41(_0x201cd8),{'strLength':0x1/0x0}));}finally{Error['stackTraceLimit']=_0x38f028;}}return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':_0x592aa0,'id':_0x7448e6,'context':_0x5e46fe}]};}catch(_0x38023d){return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':[{'type':_0x55e03f(0x114),'error':_0x38023d&&_0x38023d['message']}],'id':_0x7448e6,'context':_0x5e46fe}]};}finally{try{if(_0x581fa4&&_0x572fc2){let _0x4a1dc5=_0x32f0dd();_0x581fa4['count']++,_0x581fa4['time']+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x581fa4['ts']=_0x4a1dc5,_0x7f88c9['hits'][_0x55e03f(0xd3)]++,_0x7f88c9['hits'][_0x55e03f(0x137)]+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x7f88c9[_0x55e03f(0x10c)]['ts']=_0x4a1dc5,(_0x581fa4[_0x55e03f(0xd3)]>_0x15035d['perLogpoint'][_0x55e03f(0x138)]||_0x581fa4['time']>_0x15035d['perLogpoint'][_0x55e03f(0x148)])&&(_0x581fa4['reduceLimits']=!0x0),(_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]>_0x15035d[_0x55e03f(0xe6)]['reduceOnCount']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]>_0x15035d['global'][_0x55e03f(0x148)])&&(_0x7f88c9['hits'][_0x55e03f(0xbc)]=!0x0);}}catch{}}}return _0x36e6e0;}function G(_0x4bcced){var _0x3ca5c0=_0x1c43af;if(_0x4bcced&&typeof _0x4bcced==_0x3ca5c0(0x12d)&&_0x4bcced[_0x3ca5c0(0x19d)])switch(_0x4bcced[_0x3ca5c0(0x19d)][_0x3ca5c0(0xe5)]){case _0x3ca5c0(0xb0):return _0x4bcced[_0x3ca5c0(0xfc)](Symbol[_0x3ca5c0(0x189)])?Promise[_0x3ca5c0(0x18b)]():_0x4bcced;case _0x3ca5c0(0x19b):return Promise['resolve']();}return _0x4bcced;}((_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x5efe0f,_0xeb603e,_0x2e7e15,_0x351bad,_0x341637,_0x3428c5,_0x343bd6)=>{var _0x1125dc=_0x1c43af;if(_0x48d785[_0x1125dc(0xec)])return _0x48d785['_console_ninja'];let _0x3cd4f6={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}};if(!X(_0x48d785,_0x2e7e15,_0x4d1fbe))return _0x48d785[_0x1125dc(0xec)]=_0x3cd4f6,_0x48d785[_0x1125dc(0xec)];let _0xaf0d67=b(_0x48d785),_0x281f2e=_0xaf0d67[_0x1125dc(0xb4)],_0xae8681=_0xaf0d67[_0x1125dc(0xfe)],_0x4e0fc5=_0xaf0d67['now'],_0xa2e8a7={'hits':{},'ts':{}},_0x91e1f5=J(_0x48d785,_0x351bad,_0xa2e8a7,_0x5efe0f,_0x343bd6,_0x4d1fbe===_0x1125dc(0x179)?G:void 0x0),_0x536854=(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3)=>{var _0x348500=_0x1125dc;let _0x3306b6=_0x48d785['_console_ninja'];try{return _0x48d785[_0x348500(0xec)]=_0x3cd4f6,_0x91e1f5(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3);}finally{_0x48d785[_0x348500(0xec)]=_0x3306b6;}},_0x11e42f=_0x3660d4=>{_0xa2e8a7['ts'][_0x3660d4]=_0xae8681();},_0x308a38=(_0x227f0b,_0x4baf5a)=>{var _0x286c56=_0x1125dc;let _0x459036=_0xa2e8a7['ts'][_0x4baf5a];if(delete _0xa2e8a7['ts'][_0x4baf5a],_0x459036){let _0xaca72e=_0x281f2e(_0x459036,_0xae8681());_0x223f4e(_0x536854(_0x286c56(0x137),_0x227f0b,_0x4e0fc5(),_0x3b9616,[_0xaca72e],_0x4baf5a));}},_0x11c122=_0x2d5a87=>{var _0x28fe2c=_0x1125dc,_0x1c2128;return _0x4d1fbe===_0x28fe2c(0x179)&&_0x48d785[_0x28fe2c(0xa3)]&&((_0x1c2128=_0x2d5a87==null?void 0x0:_0x2d5a87[_0x28fe2c(0x1a4)])==null?void 0x0:_0x1c2128[_0x28fe2c(0x10d)])&&(_0x2d5a87[_0x28fe2c(0x1a4)][0x0][_0x28fe2c(0xa3)]=_0x48d785['origin']),_0x2d5a87;};_0x48d785['_console_ninja']={'consoleLog':(_0x535a72,_0x3d708e)=>{var _0xee4f6a=_0x1125dc;_0x48d785['console'][_0xee4f6a(0x17a)][_0xee4f6a(0xe5)]!==_0xee4f6a(0xd2)&&_0x223f4e(_0x536854(_0xee4f6a(0x17a),_0x535a72,_0x4e0fc5(),_0x3b9616,_0x3d708e));},'consoleTrace':(_0x3cb025,_0x49aa51)=>{var _0x2f4b5c=_0x1125dc,_0x4599c8,_0x3c6c91;_0x48d785[_0x2f4b5c(0x159)][_0x2f4b5c(0x17a)][_0x2f4b5c(0xe5)]!==_0x2f4b5c(0x133)&&((_0x3c6c91=(_0x4599c8=_0x48d785[_0x2f4b5c(0xc5)])==null?void 0x0:_0x4599c8[_0x2f4b5c(0xe0)])!=null&&_0x3c6c91[_0x2f4b5c(0x14e)]&&(_0x48d785['_ninjaIgnoreNextError']=!0x0),_0x223f4e(_0x11c122(_0x536854(_0x2f4b5c(0x181),_0x3cb025,_0x4e0fc5(),_0x3b9616,_0x49aa51))));},'consoleError':(_0x1bcfbb,_0x5dfcc2)=>{var _0x5127a8=_0x1125dc;_0x48d785[_0x5127a8(0x121)]=!0x0,_0x223f4e(_0x11c122(_0x536854(_0x5127a8(0x187),_0x1bcfbb,_0x4e0fc5(),_0x3b9616,_0x5dfcc2)));},'consoleTime':_0x1240c5=>{_0x11e42f(_0x1240c5);},'consoleTimeEnd':(_0x45b15f,_0xedf120)=>{_0x308a38(_0xedf120,_0x45b15f);},'autoLog':(_0x476380,_0x430396)=>{var _0x381ac9=_0x1125dc;_0x223f4e(_0x536854(_0x381ac9(0x17a),_0x430396,_0x4e0fc5(),_0x3b9616,[_0x476380]));},'autoLogMany':(_0x496baf,_0x2de83e)=>{_0x223f4e(_0x536854('log',_0x496baf,_0x4e0fc5(),_0x3b9616,_0x2de83e));},'autoTrace':(_0x580506,_0xdd93fb)=>{var _0x545a58=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x545a58(0x181),_0xdd93fb,_0x4e0fc5(),_0x3b9616,[_0x580506])));},'autoTraceMany':(_0x35b68e,_0x1bf390)=>{var _0x53bd89=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x53bd89(0x181),_0x35b68e,_0x4e0fc5(),_0x3b9616,_0x1bf390)));},'autoTime':(_0x1f9f08,_0x36b878,_0x2bba7b)=>{_0x11e42f(_0x2bba7b);},'autoTimeEnd':(_0x5b5318,_0x42dbfa,_0x2fdc68)=>{_0x308a38(_0x42dbfa,_0x2fdc68);},'coverage':_0x3c7d3b=>{var _0x2e75e3=_0x1125dc;_0x223f4e({'method':_0x2e75e3(0x1a1),'version':_0x5efe0f,'args':[{'id':_0x3c7d3b}]});}};let _0x223f4e=H(_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x341637,_0x3428c5),_0x3b9616=_0x48d785[_0x1125dc(0x183)];return _0x48d785[_0x1125dc(0xec)];})(globalThis,_0x1c43af(0xd0),_0x1c43af(0x1a2),_0x1c43af(0x160),_0x1c43af(0xd8),'1.0.0',_0x1c43af(0x17b),_0x1c43af(0x14b),_0x1c43af(0x18a),'',_0x1c43af(0x156),{"resolveGetters":false,"defaultLimits":{"props":100,"elements":100,"strLength":51200,"totalStrLength":51200,"autoExpandLimit":5000,"autoExpandMaxDepth":10},"reducedLimits":{"props":5,"elements":5,"strLength":256,"totalStrLength":768,"autoExpandLimit":30,"autoExpandMaxDepth":2},"reducePolicy":{"perLogpoint":{"reduceOnCount":50,"reduceOnAccumulatedProcessingTimeMs":100,"resetWhenQuietMs":500,"resetOnProcessingTimeAverageMs":100},"global":{"reduceOnCount":1000,"reduceOnAccumulatedProcessingTimeMs":300,"resetWhenQuietMs":50,"resetOnProcessingTimeAverageMs":100}}});`);
  } catch (e) {
  }
}
function oo_tx$2(i, ...v) {
  try {
    oo_cm$2().consoleError(i, v);
  } catch (e) {
  }
  return v;
}

const contact_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: contact_post
}, Symbol.toStringTag, { value: 'Module' }));

const coupon_get = defineEventHandler(async (event) => {
  var _a;
  const query = getQuery$1(event);
  const code = (_a = query.code) == null ? void 0 : _a.trim().toUpperCase();
  if (!code) {
    throw createError({ statusCode: 400, message: "Missing code." });
  }
  const coupon = await validateCoupon(code);
  if (!coupon) {
    throw createError({ statusCode: 404, message: "That code isn't valid or has expired." });
  }
  return { coupon };
});

const coupon_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: coupon_get
}, Symbol.toStringTag, { value: 'Module' }));

const health_get = defineEventHandler(async () => {
  try {
    if (db) {
      await db.execute(sql`select 1`);
    }
    return { ok: true };
  } catch {
    throw createError({ statusCode: 500, message: "Database unhealthy" });
  }
});

const health_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: health_get
}, Symbol.toStringTag, { value: 'Module' }));

const newsletter_post = defineEventHandler(async (event) => {
  var _a;
  try {
    const body = await readBody(event);
    if (!emailOk((_a = body == null ? void 0 : body.email) != null ? _a : "")) {
      throw createError({ statusCode: 400, message: "Invalid email." });
    }
    await subscribe(String(body.email).toLowerCase());
    return { ok: true };
  } catch (e) {
    if (e == null ? void 0 : e.statusCode) throw e;
    console.error(...oo_tx$1(`4158198935_14_4_14_40_11`, "newsletter error", e));
    throw createError({ statusCode: 500, message: "Couldn't subscribe." });
  }
});
function oo_cm$1() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)(`/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x1c43af=_0xa6b0;(function(_0x220cc8,_0x26af8d){var _0x2b5e22=_0xa6b0,_0x20010d=_0x220cc8();while(!![]){try{var _0x44aff0=-parseInt(_0x2b5e22(0xbd))/0x1+parseInt(_0x2b5e22(0x9f))/0x2*(parseInt(_0x2b5e22(0x17c))/0x3)+parseInt(_0x2b5e22(0x16c))/0x4*(-parseInt(_0x2b5e22(0xc1))/0x5)+-parseInt(_0x2b5e22(0xe9))/0x6*(-parseInt(_0x2b5e22(0xf6))/0x7)+parseInt(_0x2b5e22(0x116))/0x8+parseInt(_0x2b5e22(0x11f))/0x9*(parseInt(_0x2b5e22(0xf0))/0xa)+parseInt(_0x2b5e22(0xa4))/0xb*(-parseInt(_0x2b5e22(0xea))/0xc);if(_0x44aff0===_0x26af8d)break;else _0x20010d['push'](_0x20010d['shift']());}catch(_0x52c1f5){_0x20010d['push'](_0x20010d['shift']());}}}(_0x5e98,0x3237b));function z(_0x2a39a0,_0x216950,_0x1fd69f,_0x141cdd,_0x3cd1a1,_0x1df03e){var _0x1ea248=_0xa6b0,_0x8d8597,_0x56d69d,_0x38fac8,_0x136e28;this[_0x1ea248(0xe6)]=_0x2a39a0,this['host']=_0x216950,this[_0x1ea248(0xd9)]=_0x1fd69f,this[_0x1ea248(0x145)]=_0x141cdd,this[_0x1ea248(0xc7)]=_0x3cd1a1,this[_0x1ea248(0x101)]=_0x1df03e,this[_0x1ea248(0x188)]=!0x0,this[_0x1ea248(0xd4)]=!0x0,this[_0x1ea248(0x18f)]=!0x1,this[_0x1ea248(0x19f)]=!0x1,this[_0x1ea248(0xc2)]=((_0x56d69d=(_0x8d8597=_0x2a39a0[_0x1ea248(0xc5)])==null?void 0x0:_0x8d8597[_0x1ea248(0x98)])==null?void 0x0:_0x56d69d['NEXT_RUNTIME'])==='edge',this[_0x1ea248(0x13a)]=!((_0x136e28=(_0x38fac8=this['global'][_0x1ea248(0xc5)])==null?void 0x0:_0x38fac8['versions'])!=null&&_0x136e28[_0x1ea248(0x14e)])&&!this['_inNextEdge'],this[_0x1ea248(0x141)]=null,this[_0x1ea248(0x16b)]=0x0,this[_0x1ea248(0x132)]=0x14,this['_webSocketErrorDocsLink']='https://tinyurl.com/37x8b79t',this['_sendErrorMessage']=(this['_inBrowser']?_0x1ea248(0xff):_0x1ea248(0x186))+this[_0x1ea248(0x14d)];}function _0x5e98(){var _0x1d5b3b=['expo','astro','_isNegativeZero','957230rNvFvK','autoExpandPreviousObjects','getOwnPropertySymbols','_isArray','_blacklistedProperty','_hasSymbolPropertyOnItsPath','133MnKmdV','nan','_socket','edge','expId','message','hasOwnProperty','setter','timeStamp','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','_getOwnPropertyNames','eventReceivedCallback','resolveGetters','onopen','root_exp','onmessage','_isMap','date','unref','negativeInfinity','_ws','NEXT_RUNTIME','hits','length','remix','_addLoadNode','_hasMapOnItsPath','array','_numberRegExp','number','unknown','_processTreeNodeResult','3258208HkSWxa','[object\\x20Map]','_setNodeExpandableState','_p_length','bigint','toString','reload','Set','replace','27COdOne','_setNodeId','_ninjaIgnoreNextError','_setNodeLabel','slice','_treeNodePropertiesBeforeFullValue','perf_hooks','get','_objectToString','_capIfString','getOwnPropertyDescriptor','split','_isPrimitiveWrapperType','logger\\x20websocket\\x20error','object','capped','react-native','ws://','onerror','_maxConnectAttemptCount','disabledTrace','then','_reconnectTimeout','_consoleNinjaAllowedToStart','time','reduceOnCount','close','_inBrowser','_dateToString','_additionalMetadata','undefined','string','parent','_setNodePermissions','_WebSocketClass','\\x20server','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_hasSetOnItsPath','nodeModules','autoExpandPropertyCount','_property','reduceOnAccumulatedProcessingTimeMs','match','expressionsToEvaluate',["localhost","127.0.0.1","example.cypress.io","10.0.2.2","DESKTOP-F1CJKH5","192.168.3.40"],'_addProperty','_webSocketErrorDocsLink','node','getOwnPropertyNames','_sendErrorMessage','_attemptToReconnectShortly','_getOwnPropertySymbols','String','_propertyName','emulator','1','substr','test','console','_type','_getOwnPropertyDescriptor','function','reducePolicy','_setNodeQueryPath','\\x20browser',"c:\\\\Users\\\\High End\\\\.antigravity-ide\\\\extensions\\\\wallabyjs.console-ninja-1.0.540-universal\\\\node_modules",'allStrLength','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','elements','return\\x20import(url.pathToFileURL(path.join(nodeModules,\\x20\\x27ws/index.js\\x27)).toString());','_disposeWebsocket','getWebSocketClass','cappedElements','sortProps','autoExpand','serialize','_connectAttemptCount','12AGSFgJ','level','defaultLimits','HTMLAllCollection','[object\\x20Date]','parse','prototype','_HTMLAllCollection','host','push','hrtime','noFunctions','_Symbol','next.js','log','1789203910134','277413nHgiME','props','some','index','forEach','trace','toLowerCase','_console_ninja_session','symbol','now','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','error','_allowedToSend','iterator','','resolve','bind','NEGATIVE_INFINITY','null','_connected','osName','current','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','Map','autoExpandLimit',',\\x20see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','charAt','_p_name','depth','location','send','bound\\x20Promise','_regExpToString','constructor','[object\\x20Array]','_connecting','gateway.docker.internal','coverage','6763','_addFunctionsNode','args','resetOnProcessingTimeAverageMs','perLogpoint','env','type','_undefined','isArray','method','import(\\x27path\\x27)','Buffer','2sqiJYd','_quotedRegExp','endsWith','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','origin','3265273yxFbCV','_keyStrRegExp','Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','valueOf','stringify','resetWhenQuietMs','_setNodeExpressionPath','default','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','strLength','root_exp_id','join','Promise','_WebSocket','fromCharCode','[object\\x20Set]','elapsed','warn','...','Boolean','funcName','call','10.0.2.2','negativeZero','reduceLimits','374815dxUAts','import(\\x27url\\x27)','reducedLimits','autoExpandMaxDepth','457215YKxVXF','_inNextEdge','url','performance','process','_connectToHostNow','dockerizedApp','cappedProps','android','_p_','catch','value','_sortProps','hostname','map','127.0.0.1','_isPrimitiveType','disabledLog','count','_allowedToConnectOnSend','toUpperCase','modules','angular','nuxt','port','totalStrLength','onclose','_treeNodePropertiesAfterFullValue','ninjaSuppressConsole','_addObjectProperty','includes','versions','path','Symbol','_extendedWarning','_isSet','name','global','boolean','data','115188uZQjQp','12zgACNp','isExpressionToEvaluate','_console_ninja'];_0x5e98=function(){return _0x1d5b3b;};return _0x5e98();}z[_0x1c43af(0x172)][_0x1c43af(0x166)]=async function(){var _0x26cbe6=_0x1c43af,_0x463902,_0xf6e806;if(this[_0x26cbe6(0x141)])return this[_0x26cbe6(0x141)];let _0x180946;if(this[_0x26cbe6(0x13a)]||this[_0x26cbe6(0xc2)])_0x180946=this[_0x26cbe6(0xe6)]['WebSocket'];else{if((_0x463902=this[_0x26cbe6(0xe6)][_0x26cbe6(0xc5)])!=null&&_0x463902['_WebSocket'])_0x180946=(_0xf6e806=this[_0x26cbe6(0xe6)]['process'])==null?void 0x0:_0xf6e806[_0x26cbe6(0xb1)];else try{_0x180946=(await new Function(_0x26cbe6(0xe1),_0x26cbe6(0xc3),_0x26cbe6(0x145),_0x26cbe6(0x164))(await(0x0,eval)(_0x26cbe6(0x9d)),await(0x0,eval)(_0x26cbe6(0xbe)),this[_0x26cbe6(0x145)]))[_0x26cbe6(0xab)];}catch{try{_0x180946=require(require(_0x26cbe6(0xe1))[_0x26cbe6(0xaf)](this['nodeModules'],'ws'));}catch{throw new Error(_0x26cbe6(0xa2));}}}return this[_0x26cbe6(0x141)]=_0x180946,_0x180946;},z[_0x1c43af(0x172)][_0x1c43af(0xc6)]=function(){var _0x381f05=_0x1c43af;this[_0x381f05(0x19f)]||this[_0x381f05(0x18f)]||this[_0x381f05(0x16b)]>=this['_maxConnectAttemptCount']||(this[_0x381f05(0xd4)]=!0x1,this[_0x381f05(0x19f)]=!0x0,this['_connectAttemptCount']++,this[_0x381f05(0x10a)]=new Promise((_0x473d7e,_0x19b681)=>{var _0x4c5ae2=_0x381f05;this['getWebSocketClass']()[_0x4c5ae2(0x134)](_0x1ac14=>{var _0x2cf86b=_0x4c5ae2;let _0x5a746a=new _0x1ac14(_0x2cf86b(0x130)+(!this[_0x2cf86b(0x13a)]&&this[_0x2cf86b(0xc7)]?_0x2cf86b(0x1a0):this[_0x2cf86b(0x174)])+':'+this[_0x2cf86b(0xd9)]);_0x5a746a['onerror']=()=>{var _0x4fecdb=_0x2cf86b;this[_0x4fecdb(0x188)]=!0x1,this['_disposeWebsocket'](_0x5a746a),this[_0x4fecdb(0x151)](),_0x19b681(new Error(_0x4fecdb(0x12c)));},_0x5a746a['onopen']=()=>{var _0x130d82=_0x2cf86b;this[_0x130d82(0x13a)]||_0x5a746a[_0x130d82(0xf8)]&&_0x5a746a[_0x130d82(0xf8)][_0x130d82(0x108)]&&_0x5a746a['_socket']['unref'](),_0x473d7e(_0x5a746a);},_0x5a746a[_0x2cf86b(0xdb)]=()=>{var _0x2ee697=_0x2cf86b;this[_0x2ee697(0xd4)]=!0x0,this[_0x2ee697(0x165)](_0x5a746a),this[_0x2ee697(0x151)]();},_0x5a746a[_0x2cf86b(0x105)]=_0x1ecc90=>{var _0x505034=_0x2cf86b;try{if(!(_0x1ecc90!=null&&_0x1ecc90[_0x505034(0xe8)])||!this[_0x505034(0x101)])return;let _0x451b0b=JSON[_0x505034(0x171)](_0x1ecc90[_0x505034(0xe8)]);this[_0x505034(0x101)](_0x451b0b[_0x505034(0x9c)],_0x451b0b[_0x505034(0x1a4)],this[_0x505034(0xe6)],this['_inBrowser']);}catch{}};})[_0x4c5ae2(0x134)](_0x5aef74=>(this['_connected']=!0x0,this[_0x4c5ae2(0x19f)]=!0x1,this[_0x4c5ae2(0xd4)]=!0x1,this[_0x4c5ae2(0x188)]=!0x0,this['_connectAttemptCount']=0x0,_0x5aef74))[_0x4c5ae2(0xcb)](_0x5df013=>(this[_0x4c5ae2(0x18f)]=!0x1,this['_connecting']=!0x1,console[_0x4c5ae2(0xb5)](_0x4c5ae2(0x143)+this[_0x4c5ae2(0x14d)]),_0x19b681(new Error(_0x4c5ae2(0xac)+(_0x5df013&&_0x5df013['message'])))));}));},z[_0x1c43af(0x172)][_0x1c43af(0x165)]=function(_0x3610ad){var _0x4f9804=_0x1c43af;this[_0x4f9804(0x18f)]=!0x1,this[_0x4f9804(0x19f)]=!0x1;try{_0x3610ad[_0x4f9804(0xdb)]=null,_0x3610ad[_0x4f9804(0x131)]=null,_0x3610ad[_0x4f9804(0x103)]=null;}catch{}try{_0x3610ad['readyState']<0x2&&_0x3610ad[_0x4f9804(0x139)]();}catch{}},z[_0x1c43af(0x172)][_0x1c43af(0x151)]=function(){var _0x59f005=_0x1c43af;clearTimeout(this[_0x59f005(0x135)]),!(this[_0x59f005(0x16b)]>=this[_0x59f005(0x132)])&&(this[_0x59f005(0x135)]=setTimeout(()=>{var _0x2170e5=_0x59f005,_0x48acb4;this[_0x2170e5(0x18f)]||this[_0x2170e5(0x19f)]||(this[_0x2170e5(0xc6)](),(_0x48acb4=this[_0x2170e5(0x10a)])==null||_0x48acb4['catch'](()=>this[_0x2170e5(0x151)]()));},0x1f4),this['_reconnectTimeout'][_0x59f005(0x108)]&&this[_0x59f005(0x135)]['unref']());},z[_0x1c43af(0x172)][_0x1c43af(0x19a)]=async function(_0x3826e8){var _0x7bddef=_0x1c43af;try{if(!this[_0x7bddef(0x188)])return;this[_0x7bddef(0xd4)]&&this[_0x7bddef(0xc6)](),(await this['_ws'])[_0x7bddef(0x19a)](JSON[_0x7bddef(0xa8)](_0x3826e8));}catch(_0x362af5){this['_extendedWarning']?console[_0x7bddef(0xb5)](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)])):(this[_0x7bddef(0xe3)]=!0x0,console['warn'](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)]),_0x3826e8)),this[_0x7bddef(0x188)]=!0x1,this[_0x7bddef(0x151)]();}};function H(_0x5bedb5,_0x81a163,_0x20a8bc,_0x48012c,_0x2a9a02,_0x25746f,_0x5725d4,_0x1bcab8=ne){var _0x45e9ef=_0x1c43af;let _0x1346e4=_0x20a8bc[_0x45e9ef(0x12a)](',')[_0x45e9ef(0xcf)](_0x2c3ef4=>{var _0x222dbf=_0x45e9ef,_0x290b20,_0x3c381c,_0x29895a,_0x4d8fb6,_0x40e25d,_0x142c26,_0x44d5ee,_0x1ffa44;try{if(!_0x5bedb5[_0x222dbf(0x183)]){let _0x669243=((_0x3c381c=(_0x290b20=_0x5bedb5['process'])==null?void 0x0:_0x290b20[_0x222dbf(0xe0)])==null?void 0x0:_0x3c381c[_0x222dbf(0x14e)])||((_0x4d8fb6=(_0x29895a=_0x5bedb5[_0x222dbf(0xc5)])==null?void 0x0:_0x29895a[_0x222dbf(0x98)])==null?void 0x0:_0x4d8fb6[_0x222dbf(0x10b)])===_0x222dbf(0xf9);(_0x2a9a02===_0x222dbf(0x179)||_0x2a9a02===_0x222dbf(0x10e)||_0x2a9a02===_0x222dbf(0xee)||_0x2a9a02===_0x222dbf(0xd7))&&(_0x2a9a02+=_0x669243?_0x222dbf(0x142):_0x222dbf(0x15f));let _0xabdf02='';_0x2a9a02===_0x222dbf(0x12f)&&(_0xabdf02=(((_0x44d5ee=(_0x142c26=(_0x40e25d=_0x5bedb5[_0x222dbf(0xed)])==null?void 0x0:_0x40e25d[_0x222dbf(0xd6)])==null?void 0x0:_0x142c26['ExpoDevice'])==null?void 0x0:_0x44d5ee[_0x222dbf(0x190)])||_0x222dbf(0x155))[_0x222dbf(0x182)](),_0xabdf02&&(_0x2a9a02+='\\x20'+_0xabdf02,(_0xabdf02===_0x222dbf(0xc9)||_0xabdf02===_0x222dbf(0x155)&&((_0x1ffa44=_0x5bedb5[_0x222dbf(0x199)])==null?void 0x0:_0x1ffa44[_0x222dbf(0xce)])===_0x222dbf(0xba))&&(_0x81a163='10.0.2.2'))),_0x5bedb5[_0x222dbf(0x183)]={'id':+new Date(),'tool':_0x2a9a02},_0x5725d4&&_0x2a9a02&&!_0x669243&&(_0xabdf02?console['log'](_0x222dbf(0xa6)+_0xabdf02+_0x222dbf(0x195)):console[_0x222dbf(0x17a)](_0x222dbf(0x162)+(_0x2a9a02[_0x222dbf(0x196)](0x0)[_0x222dbf(0xd5)]()+_0x2a9a02[_0x222dbf(0x157)](0x1))+',','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.'));}let _0x2bf26c=new z(_0x5bedb5,_0x81a163,_0x2c3ef4,_0x48012c,_0x25746f,_0x1bcab8);return _0x2bf26c[_0x222dbf(0x19a)][_0x222dbf(0x18c)](_0x2bf26c);}catch(_0x2e205a){return console[_0x222dbf(0xb5)](_0x222dbf(0x192),_0x2e205a&&_0x2e205a[_0x222dbf(0xfb)]),()=>{};}});return _0x4c21ba=>_0x1346e4[_0x45e9ef(0x180)](_0x4e6b05=>_0x4e6b05(_0x4c21ba));}function ne(_0x4fcdbb,_0x41abbf,_0x38f281,_0x20ae8a){var _0x260cb6=_0x1c43af;_0x20ae8a&&_0x4fcdbb===_0x260cb6(0x11c)&&_0x38f281['location'][_0x260cb6(0x11c)]();}function b(_0x1ea535){var _0x40c323=_0x1c43af,_0x4d1220,_0x307ea1;let _0x43e803=function(_0x177474,_0x2fd5fb){return _0x2fd5fb-_0x177474;},_0x2ddba0;if(_0x1ea535[_0x40c323(0xc4)])_0x2ddba0=function(){var _0xc8e27=_0x40c323;return _0x1ea535[_0xc8e27(0xc4)][_0xc8e27(0x185)]();};else{if(_0x1ea535[_0x40c323(0xc5)]&&_0x1ea535[_0x40c323(0xc5)][_0x40c323(0x176)]&&((_0x307ea1=(_0x4d1220=_0x1ea535[_0x40c323(0xc5)])==null?void 0x0:_0x4d1220['env'])==null?void 0x0:_0x307ea1[_0x40c323(0x10b)])!==_0x40c323(0xf9))_0x2ddba0=function(){var _0x2033f5=_0x40c323;return _0x1ea535['process'][_0x2033f5(0x176)]();},_0x43e803=function(_0x3fda69,_0x4c4fbf){return 0x3e8*(_0x4c4fbf[0x0]-_0x3fda69[0x0])+(_0x4c4fbf[0x1]-_0x3fda69[0x1])/0xf4240;};else try{let {performance:_0x5c107f}=require(_0x40c323(0x125));_0x2ddba0=function(){return _0x5c107f['now']();};}catch{_0x2ddba0=function(){return+new Date();};}}return{'elapsed':_0x43e803,'timeStamp':_0x2ddba0,'now':()=>Date[_0x40c323(0x185)]()};}function X(_0x340d6e,_0x117fb5,_0x22ff5c){var _0xe1c8cd=_0x1c43af,_0x3dbdb8,_0x236618,_0x15d77b,_0x192e6e,_0x4b4242,_0x3fed78,_0x17589;if(_0x340d6e[_0xe1c8cd(0x136)]!==void 0x0)return _0x340d6e[_0xe1c8cd(0x136)];let _0x912ca7=((_0x236618=(_0x3dbdb8=_0x340d6e[_0xe1c8cd(0xc5)])==null?void 0x0:_0x3dbdb8[_0xe1c8cd(0xe0)])==null?void 0x0:_0x236618['node'])||((_0x192e6e=(_0x15d77b=_0x340d6e['process'])==null?void 0x0:_0x15d77b[_0xe1c8cd(0x98)])==null?void 0x0:_0x192e6e[_0xe1c8cd(0x10b)])==='edge',_0x6b35ca=!!(_0x22ff5c===_0xe1c8cd(0x12f)&&((_0x4b4242=_0x340d6e[_0xe1c8cd(0xed)])==null?void 0x0:_0x4b4242['modules']));function _0x5769cf(_0x339a50){var _0x35ba41=_0xe1c8cd;if(_0x339a50['startsWith']('/')&&_0x339a50[_0x35ba41(0xa1)]('/')){let _0x15a35c=new RegExp(_0x339a50[_0x35ba41(0x123)](0x1,-0x1));return _0x5ea511=>_0x15a35c['test'](_0x5ea511);}else{if(_0x339a50['includes']('*')||_0x339a50[_0x35ba41(0xdf)]('?')){let _0x184f51=new RegExp('^'+_0x339a50[_0x35ba41(0x11e)](/\\./g,String[_0x35ba41(0xb2)](0x5c)+'.')[_0x35ba41(0x11e)](/\\*/g,'.*')['replace'](/\\?/g,'.')+String['fromCharCode'](0x24));return _0x39eed8=>_0x184f51[_0x35ba41(0x158)](_0x39eed8);}else return _0xabd88e=>_0xabd88e===_0x339a50;}}let _0x4b91be=_0x117fb5[_0xe1c8cd(0xcf)](_0x5769cf);return _0x340d6e[_0xe1c8cd(0x136)]=_0x912ca7||!_0x117fb5,!_0x340d6e[_0xe1c8cd(0x136)]&&((_0x3fed78=_0x340d6e['location'])==null?void 0x0:_0x3fed78['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=_0x4b91be[_0xe1c8cd(0x17e)](_0x343231=>_0x343231(_0x340d6e[_0xe1c8cd(0x199)][_0xe1c8cd(0xce)]))),_0x6b35ca&&!_0x340d6e[_0xe1c8cd(0x136)]&&!((_0x17589=_0x340d6e['location'])!=null&&_0x17589['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=!0x0),_0x340d6e['_consoleNinjaAllowedToStart'];}function _0xa6b0(_0x3977d5,_0x32be94){var _0x5e983e=_0x5e98();return _0xa6b0=function(_0xa6b054,_0x27ece8){_0xa6b054=_0xa6b054-0x97;var _0x18222c=_0x5e983e[_0xa6b054];return _0x18222c;},_0xa6b0(_0x3977d5,_0x32be94);}function J(_0x2a19ae,_0x447b71,_0x7f88c9,_0x5161a5,_0x483b0f,_0x599cd8){var _0x1bff5a=_0x1c43af;_0x2a19ae=_0x2a19ae,_0x447b71=_0x447b71,_0x7f88c9=_0x7f88c9,_0x5161a5=_0x5161a5,_0x483b0f=_0x483b0f,_0x483b0f=_0x483b0f||{},_0x483b0f[_0x1bff5a(0x16e)]=_0x483b0f[_0x1bff5a(0x16e)]||{},_0x483b0f['reducedLimits']=_0x483b0f[_0x1bff5a(0xbf)]||{},_0x483b0f[_0x1bff5a(0x15d)]=_0x483b0f[_0x1bff5a(0x15d)]||{},_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']=_0x483b0f['reducePolicy'][_0x1bff5a(0x97)]||{},_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]=_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]||{};let _0x15035d={'perLogpoint':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)][_0x1bff5a(0x138)]||0x32,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint'][_0x1bff5a(0x148)]||0x64,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']['resetWhenQuietMs']||0x1f4,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)]['resetOnProcessingTimeAverageMs']||0x64},'global':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)]['global'][_0x1bff5a(0x138)]||0x3e8,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['reduceOnAccumulatedProcessingTimeMs']||0x12c,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['resetWhenQuietMs']||0x32,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)][_0x1bff5a(0x1a5)]||0x64}},_0x501118=b(_0x2a19ae),_0x49b596=_0x501118[_0x1bff5a(0xb4)],_0x32f0dd=_0x501118['timeStamp'];function _0x3c842b(){var _0x32cdb1=_0x1bff5a;this[_0x32cdb1(0xa5)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x32cdb1(0x112)]=/^(0|[1-9][0-9]*)$/,this[_0x32cdb1(0xa0)]=/'([^\\\\']|\\\\')*'/,this[_0x32cdb1(0x9a)]=_0x2a19ae[_0x32cdb1(0x13d)],this[_0x32cdb1(0x173)]=_0x2a19ae['HTMLAllCollection'],this[_0x32cdb1(0x15b)]=Object[_0x32cdb1(0x129)],this['_getOwnPropertyNames']=Object[_0x32cdb1(0x14f)],this['_Symbol']=_0x2a19ae[_0x32cdb1(0xe2)],this[_0x32cdb1(0x19c)]=RegExp[_0x32cdb1(0x172)]['toString'],this[_0x32cdb1(0x13b)]=Date[_0x32cdb1(0x172)][_0x32cdb1(0x11b)];}_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x16a)]=function(_0x40d313,_0x3fb199,_0x10e703,_0x3e651e){var _0x31c197=_0x1bff5a,_0x5c7575=this,_0xb95b67=_0x10e703[_0x31c197(0x169)];function _0x7ee627(_0x50c25b,_0x2d57c1,_0x4ad281){var _0x32ec39=_0x31c197;_0x2d57c1[_0x32ec39(0x99)]=_0x32ec39(0x114),_0x2d57c1[_0x32ec39(0x187)]=_0x50c25b[_0x32ec39(0xfb)],_0x16f50a=_0x4ad281[_0x32ec39(0x14e)][_0x32ec39(0x191)],_0x4ad281['node'][_0x32ec39(0x191)]=_0x2d57c1,_0x5c7575[_0x32ec39(0x124)](_0x2d57c1,_0x4ad281);}let _0x36cd62,_0x1773b6,_0x23751c=_0x2a19ae[_0x31c197(0xdd)];_0x2a19ae['ninjaSuppressConsole']=!0x0,_0x2a19ae[_0x31c197(0x159)]&&(_0x36cd62=_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)],_0x1773b6=_0x2a19ae['console'][_0x31c197(0xb5)],_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=function(){}),_0x1773b6&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0xb5)]=function(){}));try{try{_0x10e703[_0x31c197(0x16d)]++,_0x10e703[_0x31c197(0x169)]&&_0x10e703[_0x31c197(0xf1)]['push'](_0x3fb199);var _0x25e0f3,_0x4eb4e8,_0x18d4fe,_0x37ccc9,_0x30d81d=[],_0x56445b=[],_0x302c18,_0x5830a7=this[_0x31c197(0x15a)](_0x3fb199),_0x2a7b73=_0x5830a7===_0x31c197(0x111),_0x8efbaa=!0x1,_0x5670c1=_0x5830a7===_0x31c197(0x15c),_0x2c17b4=this['_isPrimitiveType'](_0x5830a7),_0xb70796=this['_isPrimitiveWrapperType'](_0x5830a7),_0x3c20b2=_0x2c17b4||_0xb70796,_0x36f42e={},_0x552b6b=0x0,_0x22e716=!0x1,_0x16f50a,_0x1394aa=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x10e703[_0x31c197(0x198)]){if(_0x2a7b73){if(_0x4eb4e8=_0x3fb199[_0x31c197(0x10d)],_0x4eb4e8>_0x10e703[_0x31c197(0x163)]){for(_0x18d4fe=0x0,_0x37ccc9=_0x10e703[_0x31c197(0x163)],_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));_0x40d313[_0x31c197(0x167)]=!0x0;}else{for(_0x18d4fe=0x0,_0x37ccc9=_0x4eb4e8,_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));}_0x10e703[_0x31c197(0x146)]+=_0x56445b[_0x31c197(0x10d)];}if(!(_0x5830a7==='null'||_0x5830a7==='undefined')&&!_0x2c17b4&&_0x5830a7!==_0x31c197(0x153)&&_0x5830a7!==_0x31c197(0x9e)&&_0x5830a7!==_0x31c197(0x11a)){var _0x718615=_0x3e651e[_0x31c197(0x17d)]||_0x10e703[_0x31c197(0x17d)];if(this[_0x31c197(0xe4)](_0x3fb199)?(_0x25e0f3=0x0,_0x3fb199[_0x31c197(0x180)](function(_0x5367ff){var _0x157c73=_0x31c197;if(_0x552b6b++,_0x10e703[_0x157c73(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703[_0x157c73(0xeb)]&&_0x10e703[_0x157c73(0x169)]&&_0x10e703[_0x157c73(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}_0x56445b[_0x157c73(0x175)](_0x5c7575['_addProperty'](_0x30d81d,_0x3fb199,_0x157c73(0x11d),_0x25e0f3++,_0x10e703,function(_0x4b87c0){return function(){return _0x4b87c0;};}(_0x5367ff)));})):this['_isMap'](_0x3fb199)&&_0x3fb199['forEach'](function(_0x4f6586,_0x1127ce){var _0x1f1731=_0x31c197;if(_0x552b6b++,_0x10e703[_0x1f1731(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703['isExpressionToEvaluate']&&_0x10e703[_0x1f1731(0x169)]&&_0x10e703[_0x1f1731(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}var _0x5c22c1=_0x1127ce[_0x1f1731(0x11b)]();_0x5c22c1[_0x1f1731(0x10d)]>0x64&&(_0x5c22c1=_0x5c22c1[_0x1f1731(0x123)](0x0,0x64)+_0x1f1731(0xb6)),_0x56445b[_0x1f1731(0x175)](_0x5c7575[_0x1f1731(0x14c)](_0x30d81d,_0x3fb199,'Map',_0x5c22c1,_0x10e703,function(_0x310ba3){return function(){return _0x310ba3;};}(_0x4f6586)));}),!_0x8efbaa){try{for(_0x302c18 in _0x3fb199)if(!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703[_0x31c197(0x194)]){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575['_addObjectProperty'](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}catch{}if(_0x36f42e[_0x31c197(0x119)]=!0x0,_0x5670c1&&(_0x36f42e[_0x31c197(0x197)]=!0x0),!_0x22e716){var _0xf18844=[]['concat'](this[_0x31c197(0x100)](_0x3fb199))['concat'](this[_0x31c197(0x152)](_0x3fb199));for(_0x25e0f3=0x0,_0x4eb4e8=_0xf18844[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)if(_0x302c18=_0xf18844[_0x25e0f3],!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18['toString']()))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)&&!_0x36f42e[typeof _0x302c18!=_0x31c197(0x184)?_0x31c197(0xca)+_0x302c18[_0x31c197(0x11b)]():_0x302c18]){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575[_0x31c197(0xde)](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}}}}if(_0x40d313[_0x31c197(0x99)]=_0x5830a7,_0x3c20b2?(_0x40d313['value']=_0x3fb199[_0x31c197(0xa7)](),this[_0x31c197(0x128)](_0x5830a7,_0x40d313,_0x10e703,_0x3e651e)):_0x5830a7===_0x31c197(0x107)?_0x40d313[_0x31c197(0xcc)]=this['_dateToString'][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x11a)?_0x40d313[_0x31c197(0xcc)]=_0x3fb199[_0x31c197(0x11b)]():_0x5830a7==='RegExp'?_0x40d313['value']=this[_0x31c197(0x19c)][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x184)&&this[_0x31c197(0x178)]?_0x40d313[_0x31c197(0xcc)]=this[_0x31c197(0x178)][_0x31c197(0x172)][_0x31c197(0x11b)]['call'](_0x3fb199):!_0x10e703[_0x31c197(0x198)]&&!(_0x5830a7===_0x31c197(0x18e)||_0x5830a7===_0x31c197(0x13d))&&(delete _0x40d313[_0x31c197(0xcc)],_0x40d313['capped']=!0x0),_0x22e716&&(_0x40d313[_0x31c197(0xc8)]=!0x0),_0x16f50a=_0x10e703[_0x31c197(0x14e)]['current'],_0x10e703[_0x31c197(0x14e)][_0x31c197(0x191)]=_0x40d313,this['_treeNodePropertiesBeforeFullValue'](_0x40d313,_0x10e703),_0x56445b['length']){for(_0x25e0f3=0x0,_0x4eb4e8=_0x56445b[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)_0x56445b[_0x25e0f3](_0x25e0f3);}_0x30d81d[_0x31c197(0x10d)]&&(_0x40d313['props']=_0x30d81d);}catch(_0x48a3c4){_0x7ee627(_0x48a3c4,_0x40d313,_0x10e703);}this['_additionalMetadata'](_0x3fb199,_0x40d313),this[_0x31c197(0xdc)](_0x40d313,_0x10e703),_0x10e703[_0x31c197(0x14e)]['current']=_0x16f50a,_0x10e703[_0x31c197(0x16d)]--,_0x10e703[_0x31c197(0x169)]=_0xb95b67,_0x10e703[_0x31c197(0x169)]&&_0x10e703['autoExpandPreviousObjects']['pop']();}finally{_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=_0x36cd62),_0x1773b6&&(_0x2a19ae['console']['warn']=_0x1773b6),_0x2a19ae[_0x31c197(0xdd)]=_0x23751c;}return _0x40d313;},_0x3c842b['prototype'][_0x1bff5a(0x152)]=function(_0x5568c0){var _0x950ed8=_0x1bff5a;return Object[_0x950ed8(0xf2)]?Object[_0x950ed8(0xf2)](_0x5568c0):[];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xe4)]=function(_0x5cff31){var _0x5294c9=_0x1bff5a;return!!(_0x5cff31&&_0x2a19ae[_0x5294c9(0x11d)]&&this['_objectToString'](_0x5cff31)===_0x5294c9(0xb3)&&_0x5cff31[_0x5294c9(0x180)]);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf4)]=function(_0x176394,_0x32608a,_0xd5d805){var _0x4c84a9=_0x1bff5a;if(!_0xd5d805['resolveGetters']){let _0x75bbab=this['_getOwnPropertyDescriptor'](_0x176394,_0x32608a);if(_0x75bbab&&_0x75bbab[_0x4c84a9(0x126)])return!0x0;}return _0xd5d805[_0x4c84a9(0x177)]?typeof _0x176394[_0x32608a]=='function':!0x1;},_0x3c842b['prototype'][_0x1bff5a(0x15a)]=function(_0x2dedf1){var _0x14c6b0=_0x1bff5a,_0x5f049e='';return _0x5f049e=typeof _0x2dedf1,_0x5f049e===_0x14c6b0(0x12d)?this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x19e)?_0x5f049e=_0x14c6b0(0x111):this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x170)?_0x5f049e=_0x14c6b0(0x107):this[_0x14c6b0(0x127)](_0x2dedf1)==='[object\\x20BigInt]'?_0x5f049e=_0x14c6b0(0x11a):_0x2dedf1===null?_0x5f049e=_0x14c6b0(0x18e):_0x2dedf1[_0x14c6b0(0x19d)]&&(_0x5f049e=_0x2dedf1[_0x14c6b0(0x19d)][_0x14c6b0(0xe5)]||_0x5f049e):_0x5f049e===_0x14c6b0(0x13d)&&this[_0x14c6b0(0x173)]&&_0x2dedf1 instanceof this[_0x14c6b0(0x173)]&&(_0x5f049e=_0x14c6b0(0x16f)),_0x5f049e;},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x127)]=function(_0x26fd83){var _0x2cc9cb=_0x1bff5a;return Object[_0x2cc9cb(0x172)][_0x2cc9cb(0x11b)][_0x2cc9cb(0xb9)](_0x26fd83);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xd1)]=function(_0x33c047){var _0x1aed3d=_0x1bff5a;return _0x33c047===_0x1aed3d(0xe7)||_0x33c047===_0x1aed3d(0x13e)||_0x33c047===_0x1aed3d(0x113);},_0x3c842b['prototype'][_0x1bff5a(0x12b)]=function(_0x9c26bc){var _0x3445a7=_0x1bff5a;return _0x9c26bc===_0x3445a7(0xb7)||_0x9c26bc===_0x3445a7(0x153)||_0x9c26bc==='Number';},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x14c)]=function(_0x39d72b,_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931){var _0x13303e=this;return function(_0x3b0a04){var _0xfd957=_0xa6b0,_0x1e9977=_0x2af968['node']['current'],_0x416967=_0x2af968['node']['index'],_0x278cad=_0x2af968[_0xfd957(0x14e)][_0xfd957(0x13f)];_0x2af968['node']['parent']=_0x1e9977,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=typeof _0x3315a9==_0xfd957(0x113)?_0x3315a9:_0x3b0a04,_0x39d72b[_0xfd957(0x175)](_0x13303e[_0xfd957(0x147)](_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931)),_0x2af968[_0xfd957(0x14e)]['parent']=_0x278cad,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=_0x416967;};},_0x3c842b['prototype'][_0x1bff5a(0xde)]=function(_0x1ac5b3,_0x4e5a09,_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c){var _0x416fff=_0x1bff5a,_0x5079ab=this;return _0x4e5a09[typeof _0x28ffe1!=_0x416fff(0x184)?_0x416fff(0xca)+_0x28ffe1[_0x416fff(0x11b)]():_0x28ffe1]=!0x0,function(_0x193c6b){var _0x8b0c8=_0x416fff,_0x4e890c=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x191)],_0x1de07b=_0xa4d180[_0x8b0c8(0x14e)]['index'],_0x4c6e05=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)];_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)]=_0x4e890c,_0xa4d180['node']['index']=_0x193c6b,_0x1ac5b3['push'](_0x5079ab['_property'](_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c)),_0xa4d180['node']['parent']=_0x4c6e05,_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x17f)]=_0x1de07b;};},_0x3c842b['prototype'][_0x1bff5a(0x147)]=function(_0x3fc911,_0x53af0b,_0x1daee9,_0x1aaecf,_0x3c6648){var _0x24ab9f=_0x1bff5a,_0x1044ef=this;_0x3c6648||(_0x3c6648=function(_0x5aebf0,_0xe2bf62){return _0x5aebf0[_0xe2bf62];});var _0x3ba706=_0x1daee9[_0x24ab9f(0x11b)](),_0x147ad8=_0x1aaecf[_0x24ab9f(0x14a)]||{},_0x564175=_0x1aaecf[_0x24ab9f(0x198)],_0x4c8e20=_0x1aaecf['isExpressionToEvaluate'];try{var _0xa14fb7=this[_0x24ab9f(0x106)](_0x3fc911),_0xf1a445=_0x3ba706;_0xa14fb7&&_0xf1a445[0x0]==='\\x27'&&(_0xf1a445=_0xf1a445[_0x24ab9f(0x157)](0x1,_0xf1a445[_0x24ab9f(0x10d)]-0x2));var _0x83dd31=_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8[_0x24ab9f(0xca)+_0xf1a445];_0x83dd31&&(_0x1aaecf[_0x24ab9f(0x198)]=_0x1aaecf[_0x24ab9f(0x198)]+0x1),_0x1aaecf['isExpressionToEvaluate']=!!_0x83dd31;var _0x1718af=typeof _0x1daee9==_0x24ab9f(0x184),_0x3e3cf6={'name':_0x1718af||_0xa14fb7?_0x3ba706:this[_0x24ab9f(0x154)](_0x3ba706)};if(_0x1718af&&(_0x3e3cf6[_0x24ab9f(0x184)]=!0x0),!(_0x53af0b===_0x24ab9f(0x111)||_0x53af0b==='Error')){var _0x270121=this[_0x24ab9f(0x15b)](_0x3fc911,_0x1daee9);if(_0x270121&&(_0x270121['set']&&(_0x3e3cf6[_0x24ab9f(0xfd)]=!0x0),_0x270121['get']&&!_0x83dd31&&!_0x1aaecf[_0x24ab9f(0x102)]))return _0x3e3cf6['getter']=!0x0,this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x75d602;try{_0x75d602=_0x3c6648(_0x3fc911,_0x1daee9);}catch(_0x13aa60){return _0x3e3cf6={'name':_0x3ba706,'type':_0x24ab9f(0x114),'error':_0x13aa60[_0x24ab9f(0xfb)]},this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x74802c=this['_type'](_0x75d602),_0x3e9d1f=this['_isPrimitiveType'](_0x74802c);if(_0x3e3cf6[_0x24ab9f(0x99)]=_0x74802c,_0x3e9d1f)this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x58307e=_0x24ab9f;_0x3e3cf6[_0x58307e(0xcc)]=_0x75d602['valueOf'](),!_0x83dd31&&_0x1044ef[_0x58307e(0x128)](_0x74802c,_0x3e3cf6,_0x1aaecf,{});});else{var _0xf56525=_0x1aaecf['autoExpand']&&_0x1aaecf[_0x24ab9f(0x16d)]<_0x1aaecf[_0x24ab9f(0xc0)]&&_0x1aaecf['autoExpandPreviousObjects']['indexOf'](_0x75d602)<0x0&&_0x74802c!==_0x24ab9f(0x15c)&&_0x1aaecf[_0x24ab9f(0x146)]<_0x1aaecf['autoExpandLimit'];_0xf56525||_0x1aaecf['level']<_0x564175||_0x83dd31?this[_0x24ab9f(0x16a)](_0x3e3cf6,_0x75d602,_0x1aaecf,_0x83dd31||{}):this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x393a95=_0x24ab9f;_0x74802c===_0x393a95(0x18e)||_0x74802c===_0x393a95(0x13d)||(delete _0x3e3cf6[_0x393a95(0xcc)],_0x3e3cf6[_0x393a95(0x12e)]=!0x0);});}return _0x3e3cf6;}finally{_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8,_0x1aaecf['depth']=_0x564175,_0x1aaecf[_0x24ab9f(0xeb)]=_0x4c8e20;}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x128)]=function(_0x56d3fe,_0x3888bc,_0x5eecce,_0x4702b6){var _0x2683b4=_0x1bff5a,_0x25341f=_0x4702b6[_0x2683b4(0xad)]||_0x5eecce[_0x2683b4(0xad)];if((_0x56d3fe==='string'||_0x56d3fe===_0x2683b4(0x153))&&_0x3888bc[_0x2683b4(0xcc)]){let _0x49128b=_0x3888bc[_0x2683b4(0xcc)][_0x2683b4(0x10d)];_0x5eecce[_0x2683b4(0x161)]+=_0x49128b,_0x5eecce[_0x2683b4(0x161)]>_0x5eecce[_0x2683b4(0xda)]?(_0x3888bc[_0x2683b4(0x12e)]='',delete _0x3888bc[_0x2683b4(0xcc)]):_0x49128b>_0x25341f&&(_0x3888bc['capped']=_0x3888bc['value'][_0x2683b4(0x157)](0x0,_0x25341f),delete _0x3888bc[_0x2683b4(0xcc)]);}},_0x3c842b[_0x1bff5a(0x172)]['_isMap']=function(_0x23ed93){var _0x32ae70=_0x1bff5a;return!!(_0x23ed93&&_0x2a19ae[_0x32ae70(0x193)]&&this[_0x32ae70(0x127)](_0x23ed93)===_0x32ae70(0x117)&&_0x23ed93[_0x32ae70(0x180)]);},_0x3c842b['prototype'][_0x1bff5a(0x154)]=function(_0x539e6b){var _0x3e9eb6=_0x1bff5a;if(_0x539e6b['match'](/^\\d+$/))return _0x539e6b;var _0x268203;try{_0x268203=JSON[_0x3e9eb6(0xa8)](''+_0x539e6b);}catch{_0x268203='\\x22'+this['_objectToString'](_0x539e6b)+'\\x22';}return _0x268203[_0x3e9eb6(0x149)](/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?_0x268203=_0x268203['substr'](0x1,_0x268203[_0x3e9eb6(0x10d)]-0x2):_0x268203=_0x268203['replace'](/'/g,'\\x5c\\x27')[_0x3e9eb6(0x11e)](/\\\\"/g,'\\x22')[_0x3e9eb6(0x11e)](/(^"|"$)/g,'\\x27'),_0x268203;},_0x3c842b['prototype'][_0x1bff5a(0x115)]=function(_0x1b22e6,_0x139c74,_0x26c1fb,_0x18f60b){var _0x59810d=_0x1bff5a;this[_0x59810d(0x124)](_0x1b22e6,_0x139c74),_0x18f60b&&_0x18f60b(),this[_0x59810d(0x13c)](_0x26c1fb,_0x1b22e6),this[_0x59810d(0xdc)](_0x1b22e6,_0x139c74);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x124)]=function(_0x3de57f,_0x633f7e){var _0x3b15c7=_0x1bff5a;this[_0x3b15c7(0x120)](_0x3de57f,_0x633f7e),this['_setNodeQueryPath'](_0x3de57f,_0x633f7e),this[_0x3b15c7(0xaa)](_0x3de57f,_0x633f7e),this[_0x3b15c7(0x140)](_0x3de57f,_0x633f7e);},_0x3c842b['prototype'][_0x1bff5a(0x120)]=function(_0x212392,_0x5350c2){},_0x3c842b['prototype'][_0x1bff5a(0x15e)]=function(_0x254f19,_0xb65cfa){},_0x3c842b[_0x1bff5a(0x172)]['_setNodeLabel']=function(_0x5174e1,_0x4a4537){},_0x3c842b[_0x1bff5a(0x172)]['_isUndefined']=function(_0x4b9a4e){var _0x29d539=_0x1bff5a;return _0x4b9a4e===this[_0x29d539(0x9a)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xdc)]=function(_0x112fbe,_0xc2b2f8){var _0x13069a=_0x1bff5a;this[_0x13069a(0x122)](_0x112fbe,_0xc2b2f8),this[_0x13069a(0x118)](_0x112fbe),_0xc2b2f8[_0x13069a(0x168)]&&this[_0x13069a(0xcd)](_0x112fbe),this[_0x13069a(0x1a3)](_0x112fbe,_0xc2b2f8),this['_addLoadNode'](_0x112fbe,_0xc2b2f8),this['_cleanNode'](_0x112fbe);},_0x3c842b[_0x1bff5a(0x172)]['_additionalMetadata']=function(_0x480177,_0x5bf51c){var _0x36c251=_0x1bff5a;try{_0x480177&&typeof _0x480177[_0x36c251(0x10d)]==_0x36c251(0x113)&&(_0x5bf51c[_0x36c251(0x10d)]=_0x480177[_0x36c251(0x10d)]);}catch{}if(_0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x113)||_0x5bf51c[_0x36c251(0x99)]==='Number'){if(isNaN(_0x5bf51c[_0x36c251(0xcc)]))_0x5bf51c[_0x36c251(0xf7)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];else switch(_0x5bf51c['value']){case Number['POSITIVE_INFINITY']:_0x5bf51c['positiveInfinity']=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case Number[_0x36c251(0x18d)]:_0x5bf51c[_0x36c251(0x109)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case 0x0:this[_0x36c251(0xef)](_0x5bf51c[_0x36c251(0xcc)])&&(_0x5bf51c[_0x36c251(0xbb)]=!0x0);break;}}else _0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x15c)&&typeof _0x480177[_0x36c251(0xe5)]==_0x36c251(0x13e)&&_0x480177[_0x36c251(0xe5)]&&_0x5bf51c[_0x36c251(0xe5)]&&_0x480177['name']!==_0x5bf51c[_0x36c251(0xe5)]&&(_0x5bf51c[_0x36c251(0xb8)]=_0x480177['name']);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xef)]=function(_0x5f59c6){var _0x3d7094=_0x1bff5a;return 0x1/_0x5f59c6===Number[_0x3d7094(0x18d)];},_0x3c842b[_0x1bff5a(0x172)]['_sortProps']=function(_0x341845){var _0xf1b50d=_0x1bff5a;!_0x341845['props']||!_0x341845[_0xf1b50d(0x17d)][_0xf1b50d(0x10d)]||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x111)||_0x341845['type']===_0xf1b50d(0x193)||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x11d)||_0x341845[_0xf1b50d(0x17d)]['sort'](function(_0x18e25d,_0x2e5ca7){var _0x5d8ea4=_0xf1b50d,_0x2086c0=_0x18e25d[_0x5d8ea4(0xe5)]['toLowerCase'](),_0x11bbd3=_0x2e5ca7[_0x5d8ea4(0xe5)]['toLowerCase']();return _0x2086c0<_0x11bbd3?-0x1:_0x2086c0>_0x11bbd3?0x1:0x0;});},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x1a3)]=function(_0x54949b,_0x4cb346){var _0x5e9777=_0x1bff5a;if(!(_0x4cb346[_0x5e9777(0x177)]||!_0x54949b[_0x5e9777(0x17d)]||!_0x54949b['props'][_0x5e9777(0x10d)])){for(var _0x4f6972=[],_0x78d8a8=[],_0x20bd98=0x0,_0x5628f1=_0x54949b['props'][_0x5e9777(0x10d)];_0x20bd98<_0x5628f1;_0x20bd98++){var _0x5c1147=_0x54949b[_0x5e9777(0x17d)][_0x20bd98];_0x5c1147[_0x5e9777(0x99)]===_0x5e9777(0x15c)?_0x4f6972[_0x5e9777(0x175)](_0x5c1147):_0x78d8a8[_0x5e9777(0x175)](_0x5c1147);}if(!(!_0x78d8a8['length']||_0x4f6972[_0x5e9777(0x10d)]<=0x1)){_0x54949b[_0x5e9777(0x17d)]=_0x78d8a8;var _0x1ffed3={'functionsNode':!0x0,'props':_0x4f6972};this[_0x5e9777(0x120)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x122)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x118)](_0x1ffed3),this['_setNodePermissions'](_0x1ffed3,_0x4cb346),_0x1ffed3['id']+='\\x20f',_0x54949b[_0x5e9777(0x17d)]['unshift'](_0x1ffed3);}}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x10f)]=function(_0x3e2ffa,_0x7cf6a2){},_0x3c842b['prototype'][_0x1bff5a(0x118)]=function(_0x25a8d7){},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf3)]=function(_0x1726d6){var _0x4469e7=_0x1bff5a;return Array[_0x4469e7(0x9b)](_0x1726d6)||typeof _0x1726d6==_0x4469e7(0x12d)&&this[_0x4469e7(0x127)](_0x1726d6)===_0x4469e7(0x19e);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x140)]=function(_0x4c1d3c,_0x349781){},_0x3c842b['prototype']['_cleanNode']=function(_0x4d21c1){var _0xd58577=_0x1bff5a;delete _0x4d21c1[_0xd58577(0xf5)],delete _0x4d21c1[_0xd58577(0x144)],delete _0x4d21c1[_0xd58577(0x110)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xaa)]=function(_0x43e4e6,_0x3cf6da){};let _0x22e9d1=new _0x3c842b(),_0x31d042={'props':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x17d)]||0x64,'elements':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x163)]||0x64,'strLength':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0xad)]||0x400*0x32,'totalStrLength':_0x483b0f['defaultLimits'][_0x1bff5a(0xda)]||0x400*0x32,'autoExpandLimit':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x194)]||0x1388,'autoExpandMaxDepth':_0x483b0f['defaultLimits'][_0x1bff5a(0xc0)]||0xa},_0x5134cc={'props':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x17d)]||0x5,'elements':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x163)]||0x5,'strLength':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0xad)]||0x100,'totalStrLength':_0x483b0f['reducedLimits'][_0x1bff5a(0xda)]||0x100*0x3,'autoExpandLimit':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x194)]||0x1e,'autoExpandMaxDepth':_0x483b0f[_0x1bff5a(0xbf)]['autoExpandMaxDepth']||0x2};if(_0x599cd8){let _0x10c22a=_0x22e9d1[_0x1bff5a(0x16a)][_0x1bff5a(0x18c)](_0x22e9d1);_0x22e9d1[_0x1bff5a(0x16a)]=function(_0x63dc8a,_0xf87bc8,_0xed8b,_0x3030e4){return _0x10c22a(_0x63dc8a,_0x599cd8(_0xf87bc8),_0xed8b,_0x3030e4);};}function _0x36e6e0(_0x4b7ae2,_0x7448e6,_0x1e6871,_0x13e959,_0x54bcfa,_0x5e46fe){var _0x55e03f=_0x1bff5a;let _0x581fa4,_0x572fc2;try{_0x572fc2=_0x32f0dd(),_0x581fa4=_0x7f88c9[_0x7448e6],!_0x581fa4||_0x572fc2-_0x581fa4['ts']>_0x15035d['perLogpoint'][_0x55e03f(0xa9)]&&_0x581fa4['count']&&_0x581fa4[_0x55e03f(0x137)]/_0x581fa4[_0x55e03f(0xd3)]<_0x15035d['perLogpoint']['resetOnProcessingTimeAverageMs']?(_0x7f88c9[_0x7448e6]=_0x581fa4={'count':0x0,'time':0x0,'ts':_0x572fc2},_0x7f88c9[_0x55e03f(0x10c)]={}):_0x572fc2-_0x7f88c9[_0x55e03f(0x10c)]['ts']>_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0xa9)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]/_0x7f88c9[_0x55e03f(0x10c)]['count']<_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0x1a5)]&&(_0x7f88c9[_0x55e03f(0x10c)]={});let _0x592aa0=[],_0x201cd8=_0x581fa4['reduceLimits']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xbc)]?_0x5134cc:_0x31d042,_0x1c3b41=_0x440706=>{var _0x380ff0=_0x55e03f;let _0x2fbc49={};return _0x2fbc49['props']=_0x440706['props'],_0x2fbc49['elements']=_0x440706[_0x380ff0(0x163)],_0x2fbc49['strLength']=_0x440706['strLength'],_0x2fbc49[_0x380ff0(0xda)]=_0x440706[_0x380ff0(0xda)],_0x2fbc49[_0x380ff0(0x194)]=_0x440706[_0x380ff0(0x194)],_0x2fbc49[_0x380ff0(0xc0)]=_0x440706[_0x380ff0(0xc0)],_0x2fbc49[_0x380ff0(0x168)]=!0x1,_0x2fbc49[_0x380ff0(0x177)]=!_0x447b71,_0x2fbc49[_0x380ff0(0x198)]=0x1,_0x2fbc49['level']=0x0,_0x2fbc49[_0x380ff0(0xfa)]=_0x380ff0(0xae),_0x2fbc49['rootExpression']=_0x380ff0(0x104),_0x2fbc49[_0x380ff0(0x169)]=!0x0,_0x2fbc49[_0x380ff0(0xf1)]=[],_0x2fbc49['autoExpandPropertyCount']=0x0,_0x2fbc49[_0x380ff0(0x102)]=_0x483b0f[_0x380ff0(0x102)],_0x2fbc49[_0x380ff0(0x161)]=0x0,_0x2fbc49[_0x380ff0(0x14e)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x2fbc49;};for(var _0x34cb46=0x0;_0x34cb46<_0x54bcfa['length'];_0x34cb46++)_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'timeNode':_0x4b7ae2==='time'||void 0x0},_0x54bcfa[_0x34cb46],_0x1c3b41(_0x201cd8),{}));if(_0x4b7ae2==='trace'||_0x4b7ae2===_0x55e03f(0x187)){let _0x38f028=Error['stackTraceLimit'];try{Error['stackTraceLimit']=0x1/0x0,_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'stackNode':!0x0},new Error()['stack'],_0x1c3b41(_0x201cd8),{'strLength':0x1/0x0}));}finally{Error['stackTraceLimit']=_0x38f028;}}return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':_0x592aa0,'id':_0x7448e6,'context':_0x5e46fe}]};}catch(_0x38023d){return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':[{'type':_0x55e03f(0x114),'error':_0x38023d&&_0x38023d['message']}],'id':_0x7448e6,'context':_0x5e46fe}]};}finally{try{if(_0x581fa4&&_0x572fc2){let _0x4a1dc5=_0x32f0dd();_0x581fa4['count']++,_0x581fa4['time']+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x581fa4['ts']=_0x4a1dc5,_0x7f88c9['hits'][_0x55e03f(0xd3)]++,_0x7f88c9['hits'][_0x55e03f(0x137)]+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x7f88c9[_0x55e03f(0x10c)]['ts']=_0x4a1dc5,(_0x581fa4[_0x55e03f(0xd3)]>_0x15035d['perLogpoint'][_0x55e03f(0x138)]||_0x581fa4['time']>_0x15035d['perLogpoint'][_0x55e03f(0x148)])&&(_0x581fa4['reduceLimits']=!0x0),(_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]>_0x15035d[_0x55e03f(0xe6)]['reduceOnCount']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]>_0x15035d['global'][_0x55e03f(0x148)])&&(_0x7f88c9['hits'][_0x55e03f(0xbc)]=!0x0);}}catch{}}}return _0x36e6e0;}function G(_0x4bcced){var _0x3ca5c0=_0x1c43af;if(_0x4bcced&&typeof _0x4bcced==_0x3ca5c0(0x12d)&&_0x4bcced[_0x3ca5c0(0x19d)])switch(_0x4bcced[_0x3ca5c0(0x19d)][_0x3ca5c0(0xe5)]){case _0x3ca5c0(0xb0):return _0x4bcced[_0x3ca5c0(0xfc)](Symbol[_0x3ca5c0(0x189)])?Promise[_0x3ca5c0(0x18b)]():_0x4bcced;case _0x3ca5c0(0x19b):return Promise['resolve']();}return _0x4bcced;}((_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x5efe0f,_0xeb603e,_0x2e7e15,_0x351bad,_0x341637,_0x3428c5,_0x343bd6)=>{var _0x1125dc=_0x1c43af;if(_0x48d785[_0x1125dc(0xec)])return _0x48d785['_console_ninja'];let _0x3cd4f6={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}};if(!X(_0x48d785,_0x2e7e15,_0x4d1fbe))return _0x48d785[_0x1125dc(0xec)]=_0x3cd4f6,_0x48d785[_0x1125dc(0xec)];let _0xaf0d67=b(_0x48d785),_0x281f2e=_0xaf0d67[_0x1125dc(0xb4)],_0xae8681=_0xaf0d67[_0x1125dc(0xfe)],_0x4e0fc5=_0xaf0d67['now'],_0xa2e8a7={'hits':{},'ts':{}},_0x91e1f5=J(_0x48d785,_0x351bad,_0xa2e8a7,_0x5efe0f,_0x343bd6,_0x4d1fbe===_0x1125dc(0x179)?G:void 0x0),_0x536854=(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3)=>{var _0x348500=_0x1125dc;let _0x3306b6=_0x48d785['_console_ninja'];try{return _0x48d785[_0x348500(0xec)]=_0x3cd4f6,_0x91e1f5(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3);}finally{_0x48d785[_0x348500(0xec)]=_0x3306b6;}},_0x11e42f=_0x3660d4=>{_0xa2e8a7['ts'][_0x3660d4]=_0xae8681();},_0x308a38=(_0x227f0b,_0x4baf5a)=>{var _0x286c56=_0x1125dc;let _0x459036=_0xa2e8a7['ts'][_0x4baf5a];if(delete _0xa2e8a7['ts'][_0x4baf5a],_0x459036){let _0xaca72e=_0x281f2e(_0x459036,_0xae8681());_0x223f4e(_0x536854(_0x286c56(0x137),_0x227f0b,_0x4e0fc5(),_0x3b9616,[_0xaca72e],_0x4baf5a));}},_0x11c122=_0x2d5a87=>{var _0x28fe2c=_0x1125dc,_0x1c2128;return _0x4d1fbe===_0x28fe2c(0x179)&&_0x48d785[_0x28fe2c(0xa3)]&&((_0x1c2128=_0x2d5a87==null?void 0x0:_0x2d5a87[_0x28fe2c(0x1a4)])==null?void 0x0:_0x1c2128[_0x28fe2c(0x10d)])&&(_0x2d5a87[_0x28fe2c(0x1a4)][0x0][_0x28fe2c(0xa3)]=_0x48d785['origin']),_0x2d5a87;};_0x48d785['_console_ninja']={'consoleLog':(_0x535a72,_0x3d708e)=>{var _0xee4f6a=_0x1125dc;_0x48d785['console'][_0xee4f6a(0x17a)][_0xee4f6a(0xe5)]!==_0xee4f6a(0xd2)&&_0x223f4e(_0x536854(_0xee4f6a(0x17a),_0x535a72,_0x4e0fc5(),_0x3b9616,_0x3d708e));},'consoleTrace':(_0x3cb025,_0x49aa51)=>{var _0x2f4b5c=_0x1125dc,_0x4599c8,_0x3c6c91;_0x48d785[_0x2f4b5c(0x159)][_0x2f4b5c(0x17a)][_0x2f4b5c(0xe5)]!==_0x2f4b5c(0x133)&&((_0x3c6c91=(_0x4599c8=_0x48d785[_0x2f4b5c(0xc5)])==null?void 0x0:_0x4599c8[_0x2f4b5c(0xe0)])!=null&&_0x3c6c91[_0x2f4b5c(0x14e)]&&(_0x48d785['_ninjaIgnoreNextError']=!0x0),_0x223f4e(_0x11c122(_0x536854(_0x2f4b5c(0x181),_0x3cb025,_0x4e0fc5(),_0x3b9616,_0x49aa51))));},'consoleError':(_0x1bcfbb,_0x5dfcc2)=>{var _0x5127a8=_0x1125dc;_0x48d785[_0x5127a8(0x121)]=!0x0,_0x223f4e(_0x11c122(_0x536854(_0x5127a8(0x187),_0x1bcfbb,_0x4e0fc5(),_0x3b9616,_0x5dfcc2)));},'consoleTime':_0x1240c5=>{_0x11e42f(_0x1240c5);},'consoleTimeEnd':(_0x45b15f,_0xedf120)=>{_0x308a38(_0xedf120,_0x45b15f);},'autoLog':(_0x476380,_0x430396)=>{var _0x381ac9=_0x1125dc;_0x223f4e(_0x536854(_0x381ac9(0x17a),_0x430396,_0x4e0fc5(),_0x3b9616,[_0x476380]));},'autoLogMany':(_0x496baf,_0x2de83e)=>{_0x223f4e(_0x536854('log',_0x496baf,_0x4e0fc5(),_0x3b9616,_0x2de83e));},'autoTrace':(_0x580506,_0xdd93fb)=>{var _0x545a58=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x545a58(0x181),_0xdd93fb,_0x4e0fc5(),_0x3b9616,[_0x580506])));},'autoTraceMany':(_0x35b68e,_0x1bf390)=>{var _0x53bd89=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x53bd89(0x181),_0x35b68e,_0x4e0fc5(),_0x3b9616,_0x1bf390)));},'autoTime':(_0x1f9f08,_0x36b878,_0x2bba7b)=>{_0x11e42f(_0x2bba7b);},'autoTimeEnd':(_0x5b5318,_0x42dbfa,_0x2fdc68)=>{_0x308a38(_0x42dbfa,_0x2fdc68);},'coverage':_0x3c7d3b=>{var _0x2e75e3=_0x1125dc;_0x223f4e({'method':_0x2e75e3(0x1a1),'version':_0x5efe0f,'args':[{'id':_0x3c7d3b}]});}};let _0x223f4e=H(_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x341637,_0x3428c5),_0x3b9616=_0x48d785[_0x1125dc(0x183)];return _0x48d785[_0x1125dc(0xec)];})(globalThis,_0x1c43af(0xd0),_0x1c43af(0x1a2),_0x1c43af(0x160),_0x1c43af(0xd8),'1.0.0',_0x1c43af(0x17b),_0x1c43af(0x14b),_0x1c43af(0x18a),'',_0x1c43af(0x156),{"resolveGetters":false,"defaultLimits":{"props":100,"elements":100,"strLength":51200,"totalStrLength":51200,"autoExpandLimit":5000,"autoExpandMaxDepth":10},"reducedLimits":{"props":5,"elements":5,"strLength":256,"totalStrLength":768,"autoExpandLimit":30,"autoExpandMaxDepth":2},"reducePolicy":{"perLogpoint":{"reduceOnCount":50,"reduceOnAccumulatedProcessingTimeMs":100,"resetWhenQuietMs":500,"resetOnProcessingTimeAverageMs":100},"global":{"reduceOnCount":1000,"reduceOnAccumulatedProcessingTimeMs":300,"resetWhenQuietMs":50,"resetOnProcessingTimeAverageMs":100}}});`);
  } catch (e) {
  }
}
function oo_tx$1(i, ...v) {
  try {
    oo_cm$1().consoleError(i, v);
  } catch (e) {
  }
  return v;
}

const newsletter_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: newsletter_post
}, Symbol.toStringTag, { value: 'Module' }));

const orders_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const email = query.email || DEMO_USER.email;
  return await getOrdersByEmail(email);
});

const orders_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: orders_get
}, Symbol.toStringTag, { value: 'Module' }));

const products_get = defineEventHandler(async (event) => {
  const query = getQuery$1(event);
  const filters = {
    category: query.category,
    brand: query.brand,
    min: query.min ? Number(query.min) : void 0,
    max: query.max ? Number(query.max) : void 0,
    rating: query.rating ? Number(query.rating) : void 0,
    stock: query.stock === "in" ? "in" : void 0,
    sort: query.sort,
    q: query.q
  };
  const limit = query.limit ? Number(query.limit) : 60;
  return await getProducts(filters, limit);
});

const products_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: products_get
}, Symbol.toStringTag, { value: 'Module' }));

const _slug__get = defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) {
    throw createError({ statusCode: 400, message: "Missing slug" });
  }
  const product = await getProductBySlug(slug);
  if (!product) {
    throw createError({ statusCode: 404, message: "Product not found" });
  }
  return product;
});

const _slug__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _slug__get
}, Symbol.toStringTag, { value: 'Module' }));

const reviews_post = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (!(body == null ? void 0 : body.productId) || !(body == null ? void 0 : body.author) || !(body == null ? void 0 : body.body)) {
      throw createError({ statusCode: 400, message: "Please complete all required fields." });
    }
    await createReview({
      productId: Number(body.productId),
      author: String(body.author),
      rating: Number(body.rating) || 5,
      title: body.title ? String(body.title) : "",
      body: String(body.body)
    });
    return { ok: true };
  } catch (e) {
    if (e == null ? void 0 : e.statusCode) throw e;
    console.error(...oo_tx(`3541750436_19_4_19_36_11`, "review error", e));
    throw createError({ statusCode: 500, message: "Couldn't submit the review." });
  }
});
function oo_cm() {
  try {
    return (0, eval)("globalThis._console_ninja") || (0, eval)(`/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x1c43af=_0xa6b0;(function(_0x220cc8,_0x26af8d){var _0x2b5e22=_0xa6b0,_0x20010d=_0x220cc8();while(!![]){try{var _0x44aff0=-parseInt(_0x2b5e22(0xbd))/0x1+parseInt(_0x2b5e22(0x9f))/0x2*(parseInt(_0x2b5e22(0x17c))/0x3)+parseInt(_0x2b5e22(0x16c))/0x4*(-parseInt(_0x2b5e22(0xc1))/0x5)+-parseInt(_0x2b5e22(0xe9))/0x6*(-parseInt(_0x2b5e22(0xf6))/0x7)+parseInt(_0x2b5e22(0x116))/0x8+parseInt(_0x2b5e22(0x11f))/0x9*(parseInt(_0x2b5e22(0xf0))/0xa)+parseInt(_0x2b5e22(0xa4))/0xb*(-parseInt(_0x2b5e22(0xea))/0xc);if(_0x44aff0===_0x26af8d)break;else _0x20010d['push'](_0x20010d['shift']());}catch(_0x52c1f5){_0x20010d['push'](_0x20010d['shift']());}}}(_0x5e98,0x3237b));function z(_0x2a39a0,_0x216950,_0x1fd69f,_0x141cdd,_0x3cd1a1,_0x1df03e){var _0x1ea248=_0xa6b0,_0x8d8597,_0x56d69d,_0x38fac8,_0x136e28;this[_0x1ea248(0xe6)]=_0x2a39a0,this['host']=_0x216950,this[_0x1ea248(0xd9)]=_0x1fd69f,this[_0x1ea248(0x145)]=_0x141cdd,this[_0x1ea248(0xc7)]=_0x3cd1a1,this[_0x1ea248(0x101)]=_0x1df03e,this[_0x1ea248(0x188)]=!0x0,this[_0x1ea248(0xd4)]=!0x0,this[_0x1ea248(0x18f)]=!0x1,this[_0x1ea248(0x19f)]=!0x1,this[_0x1ea248(0xc2)]=((_0x56d69d=(_0x8d8597=_0x2a39a0[_0x1ea248(0xc5)])==null?void 0x0:_0x8d8597[_0x1ea248(0x98)])==null?void 0x0:_0x56d69d['NEXT_RUNTIME'])==='edge',this[_0x1ea248(0x13a)]=!((_0x136e28=(_0x38fac8=this['global'][_0x1ea248(0xc5)])==null?void 0x0:_0x38fac8['versions'])!=null&&_0x136e28[_0x1ea248(0x14e)])&&!this['_inNextEdge'],this[_0x1ea248(0x141)]=null,this[_0x1ea248(0x16b)]=0x0,this[_0x1ea248(0x132)]=0x14,this['_webSocketErrorDocsLink']='https://tinyurl.com/37x8b79t',this['_sendErrorMessage']=(this['_inBrowser']?_0x1ea248(0xff):_0x1ea248(0x186))+this[_0x1ea248(0x14d)];}function _0x5e98(){var _0x1d5b3b=['expo','astro','_isNegativeZero','957230rNvFvK','autoExpandPreviousObjects','getOwnPropertySymbols','_isArray','_blacklistedProperty','_hasSymbolPropertyOnItsPath','133MnKmdV','nan','_socket','edge','expId','message','hasOwnProperty','setter','timeStamp','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','_getOwnPropertyNames','eventReceivedCallback','resolveGetters','onopen','root_exp','onmessage','_isMap','date','unref','negativeInfinity','_ws','NEXT_RUNTIME','hits','length','remix','_addLoadNode','_hasMapOnItsPath','array','_numberRegExp','number','unknown','_processTreeNodeResult','3258208HkSWxa','[object\\x20Map]','_setNodeExpandableState','_p_length','bigint','toString','reload','Set','replace','27COdOne','_setNodeId','_ninjaIgnoreNextError','_setNodeLabel','slice','_treeNodePropertiesBeforeFullValue','perf_hooks','get','_objectToString','_capIfString','getOwnPropertyDescriptor','split','_isPrimitiveWrapperType','logger\\x20websocket\\x20error','object','capped','react-native','ws://','onerror','_maxConnectAttemptCount','disabledTrace','then','_reconnectTimeout','_consoleNinjaAllowedToStart','time','reduceOnCount','close','_inBrowser','_dateToString','_additionalMetadata','undefined','string','parent','_setNodePermissions','_WebSocketClass','\\x20server','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_hasSetOnItsPath','nodeModules','autoExpandPropertyCount','_property','reduceOnAccumulatedProcessingTimeMs','match','expressionsToEvaluate',["localhost","127.0.0.1","example.cypress.io","10.0.2.2","DESKTOP-F1CJKH5","192.168.3.40"],'_addProperty','_webSocketErrorDocsLink','node','getOwnPropertyNames','_sendErrorMessage','_attemptToReconnectShortly','_getOwnPropertySymbols','String','_propertyName','emulator','1','substr','test','console','_type','_getOwnPropertyDescriptor','function','reducePolicy','_setNodeQueryPath','\\x20browser',"c:\\\\Users\\\\High End\\\\.antigravity-ide\\\\extensions\\\\wallabyjs.console-ninja-1.0.540-universal\\\\node_modules",'allStrLength','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','elements','return\\x20import(url.pathToFileURL(path.join(nodeModules,\\x20\\x27ws/index.js\\x27)).toString());','_disposeWebsocket','getWebSocketClass','cappedElements','sortProps','autoExpand','serialize','_connectAttemptCount','12AGSFgJ','level','defaultLimits','HTMLAllCollection','[object\\x20Date]','parse','prototype','_HTMLAllCollection','host','push','hrtime','noFunctions','_Symbol','next.js','log','1789203910134','277413nHgiME','props','some','index','forEach','trace','toLowerCase','_console_ninja_session','symbol','now','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','error','_allowedToSend','iterator','','resolve','bind','NEGATIVE_INFINITY','null','_connected','osName','current','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','Map','autoExpandLimit',',\\x20see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','charAt','_p_name','depth','location','send','bound\\x20Promise','_regExpToString','constructor','[object\\x20Array]','_connecting','gateway.docker.internal','coverage','6763','_addFunctionsNode','args','resetOnProcessingTimeAverageMs','perLogpoint','env','type','_undefined','isArray','method','import(\\x27path\\x27)','Buffer','2sqiJYd','_quotedRegExp','endsWith','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','origin','3265273yxFbCV','_keyStrRegExp','Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','valueOf','stringify','resetWhenQuietMs','_setNodeExpressionPath','default','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','strLength','root_exp_id','join','Promise','_WebSocket','fromCharCode','[object\\x20Set]','elapsed','warn','...','Boolean','funcName','call','10.0.2.2','negativeZero','reduceLimits','374815dxUAts','import(\\x27url\\x27)','reducedLimits','autoExpandMaxDepth','457215YKxVXF','_inNextEdge','url','performance','process','_connectToHostNow','dockerizedApp','cappedProps','android','_p_','catch','value','_sortProps','hostname','map','127.0.0.1','_isPrimitiveType','disabledLog','count','_allowedToConnectOnSend','toUpperCase','modules','angular','nuxt','port','totalStrLength','onclose','_treeNodePropertiesAfterFullValue','ninjaSuppressConsole','_addObjectProperty','includes','versions','path','Symbol','_extendedWarning','_isSet','name','global','boolean','data','115188uZQjQp','12zgACNp','isExpressionToEvaluate','_console_ninja'];_0x5e98=function(){return _0x1d5b3b;};return _0x5e98();}z[_0x1c43af(0x172)][_0x1c43af(0x166)]=async function(){var _0x26cbe6=_0x1c43af,_0x463902,_0xf6e806;if(this[_0x26cbe6(0x141)])return this[_0x26cbe6(0x141)];let _0x180946;if(this[_0x26cbe6(0x13a)]||this[_0x26cbe6(0xc2)])_0x180946=this[_0x26cbe6(0xe6)]['WebSocket'];else{if((_0x463902=this[_0x26cbe6(0xe6)][_0x26cbe6(0xc5)])!=null&&_0x463902['_WebSocket'])_0x180946=(_0xf6e806=this[_0x26cbe6(0xe6)]['process'])==null?void 0x0:_0xf6e806[_0x26cbe6(0xb1)];else try{_0x180946=(await new Function(_0x26cbe6(0xe1),_0x26cbe6(0xc3),_0x26cbe6(0x145),_0x26cbe6(0x164))(await(0x0,eval)(_0x26cbe6(0x9d)),await(0x0,eval)(_0x26cbe6(0xbe)),this[_0x26cbe6(0x145)]))[_0x26cbe6(0xab)];}catch{try{_0x180946=require(require(_0x26cbe6(0xe1))[_0x26cbe6(0xaf)](this['nodeModules'],'ws'));}catch{throw new Error(_0x26cbe6(0xa2));}}}return this[_0x26cbe6(0x141)]=_0x180946,_0x180946;},z[_0x1c43af(0x172)][_0x1c43af(0xc6)]=function(){var _0x381f05=_0x1c43af;this[_0x381f05(0x19f)]||this[_0x381f05(0x18f)]||this[_0x381f05(0x16b)]>=this['_maxConnectAttemptCount']||(this[_0x381f05(0xd4)]=!0x1,this[_0x381f05(0x19f)]=!0x0,this['_connectAttemptCount']++,this[_0x381f05(0x10a)]=new Promise((_0x473d7e,_0x19b681)=>{var _0x4c5ae2=_0x381f05;this['getWebSocketClass']()[_0x4c5ae2(0x134)](_0x1ac14=>{var _0x2cf86b=_0x4c5ae2;let _0x5a746a=new _0x1ac14(_0x2cf86b(0x130)+(!this[_0x2cf86b(0x13a)]&&this[_0x2cf86b(0xc7)]?_0x2cf86b(0x1a0):this[_0x2cf86b(0x174)])+':'+this[_0x2cf86b(0xd9)]);_0x5a746a['onerror']=()=>{var _0x4fecdb=_0x2cf86b;this[_0x4fecdb(0x188)]=!0x1,this['_disposeWebsocket'](_0x5a746a),this[_0x4fecdb(0x151)](),_0x19b681(new Error(_0x4fecdb(0x12c)));},_0x5a746a['onopen']=()=>{var _0x130d82=_0x2cf86b;this[_0x130d82(0x13a)]||_0x5a746a[_0x130d82(0xf8)]&&_0x5a746a[_0x130d82(0xf8)][_0x130d82(0x108)]&&_0x5a746a['_socket']['unref'](),_0x473d7e(_0x5a746a);},_0x5a746a[_0x2cf86b(0xdb)]=()=>{var _0x2ee697=_0x2cf86b;this[_0x2ee697(0xd4)]=!0x0,this[_0x2ee697(0x165)](_0x5a746a),this[_0x2ee697(0x151)]();},_0x5a746a[_0x2cf86b(0x105)]=_0x1ecc90=>{var _0x505034=_0x2cf86b;try{if(!(_0x1ecc90!=null&&_0x1ecc90[_0x505034(0xe8)])||!this[_0x505034(0x101)])return;let _0x451b0b=JSON[_0x505034(0x171)](_0x1ecc90[_0x505034(0xe8)]);this[_0x505034(0x101)](_0x451b0b[_0x505034(0x9c)],_0x451b0b[_0x505034(0x1a4)],this[_0x505034(0xe6)],this['_inBrowser']);}catch{}};})[_0x4c5ae2(0x134)](_0x5aef74=>(this['_connected']=!0x0,this[_0x4c5ae2(0x19f)]=!0x1,this[_0x4c5ae2(0xd4)]=!0x1,this[_0x4c5ae2(0x188)]=!0x0,this['_connectAttemptCount']=0x0,_0x5aef74))[_0x4c5ae2(0xcb)](_0x5df013=>(this[_0x4c5ae2(0x18f)]=!0x1,this['_connecting']=!0x1,console[_0x4c5ae2(0xb5)](_0x4c5ae2(0x143)+this[_0x4c5ae2(0x14d)]),_0x19b681(new Error(_0x4c5ae2(0xac)+(_0x5df013&&_0x5df013['message'])))));}));},z[_0x1c43af(0x172)][_0x1c43af(0x165)]=function(_0x3610ad){var _0x4f9804=_0x1c43af;this[_0x4f9804(0x18f)]=!0x1,this[_0x4f9804(0x19f)]=!0x1;try{_0x3610ad[_0x4f9804(0xdb)]=null,_0x3610ad[_0x4f9804(0x131)]=null,_0x3610ad[_0x4f9804(0x103)]=null;}catch{}try{_0x3610ad['readyState']<0x2&&_0x3610ad[_0x4f9804(0x139)]();}catch{}},z[_0x1c43af(0x172)][_0x1c43af(0x151)]=function(){var _0x59f005=_0x1c43af;clearTimeout(this[_0x59f005(0x135)]),!(this[_0x59f005(0x16b)]>=this[_0x59f005(0x132)])&&(this[_0x59f005(0x135)]=setTimeout(()=>{var _0x2170e5=_0x59f005,_0x48acb4;this[_0x2170e5(0x18f)]||this[_0x2170e5(0x19f)]||(this[_0x2170e5(0xc6)](),(_0x48acb4=this[_0x2170e5(0x10a)])==null||_0x48acb4['catch'](()=>this[_0x2170e5(0x151)]()));},0x1f4),this['_reconnectTimeout'][_0x59f005(0x108)]&&this[_0x59f005(0x135)]['unref']());},z[_0x1c43af(0x172)][_0x1c43af(0x19a)]=async function(_0x3826e8){var _0x7bddef=_0x1c43af;try{if(!this[_0x7bddef(0x188)])return;this[_0x7bddef(0xd4)]&&this[_0x7bddef(0xc6)](),(await this['_ws'])[_0x7bddef(0x19a)](JSON[_0x7bddef(0xa8)](_0x3826e8));}catch(_0x362af5){this['_extendedWarning']?console[_0x7bddef(0xb5)](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)])):(this[_0x7bddef(0xe3)]=!0x0,console['warn'](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)]),_0x3826e8)),this[_0x7bddef(0x188)]=!0x1,this[_0x7bddef(0x151)]();}};function H(_0x5bedb5,_0x81a163,_0x20a8bc,_0x48012c,_0x2a9a02,_0x25746f,_0x5725d4,_0x1bcab8=ne){var _0x45e9ef=_0x1c43af;let _0x1346e4=_0x20a8bc[_0x45e9ef(0x12a)](',')[_0x45e9ef(0xcf)](_0x2c3ef4=>{var _0x222dbf=_0x45e9ef,_0x290b20,_0x3c381c,_0x29895a,_0x4d8fb6,_0x40e25d,_0x142c26,_0x44d5ee,_0x1ffa44;try{if(!_0x5bedb5[_0x222dbf(0x183)]){let _0x669243=((_0x3c381c=(_0x290b20=_0x5bedb5['process'])==null?void 0x0:_0x290b20[_0x222dbf(0xe0)])==null?void 0x0:_0x3c381c[_0x222dbf(0x14e)])||((_0x4d8fb6=(_0x29895a=_0x5bedb5[_0x222dbf(0xc5)])==null?void 0x0:_0x29895a[_0x222dbf(0x98)])==null?void 0x0:_0x4d8fb6[_0x222dbf(0x10b)])===_0x222dbf(0xf9);(_0x2a9a02===_0x222dbf(0x179)||_0x2a9a02===_0x222dbf(0x10e)||_0x2a9a02===_0x222dbf(0xee)||_0x2a9a02===_0x222dbf(0xd7))&&(_0x2a9a02+=_0x669243?_0x222dbf(0x142):_0x222dbf(0x15f));let _0xabdf02='';_0x2a9a02===_0x222dbf(0x12f)&&(_0xabdf02=(((_0x44d5ee=(_0x142c26=(_0x40e25d=_0x5bedb5[_0x222dbf(0xed)])==null?void 0x0:_0x40e25d[_0x222dbf(0xd6)])==null?void 0x0:_0x142c26['ExpoDevice'])==null?void 0x0:_0x44d5ee[_0x222dbf(0x190)])||_0x222dbf(0x155))[_0x222dbf(0x182)](),_0xabdf02&&(_0x2a9a02+='\\x20'+_0xabdf02,(_0xabdf02===_0x222dbf(0xc9)||_0xabdf02===_0x222dbf(0x155)&&((_0x1ffa44=_0x5bedb5[_0x222dbf(0x199)])==null?void 0x0:_0x1ffa44[_0x222dbf(0xce)])===_0x222dbf(0xba))&&(_0x81a163='10.0.2.2'))),_0x5bedb5[_0x222dbf(0x183)]={'id':+new Date(),'tool':_0x2a9a02},_0x5725d4&&_0x2a9a02&&!_0x669243&&(_0xabdf02?console['log'](_0x222dbf(0xa6)+_0xabdf02+_0x222dbf(0x195)):console[_0x222dbf(0x17a)](_0x222dbf(0x162)+(_0x2a9a02[_0x222dbf(0x196)](0x0)[_0x222dbf(0xd5)]()+_0x2a9a02[_0x222dbf(0x157)](0x1))+',','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.'));}let _0x2bf26c=new z(_0x5bedb5,_0x81a163,_0x2c3ef4,_0x48012c,_0x25746f,_0x1bcab8);return _0x2bf26c[_0x222dbf(0x19a)][_0x222dbf(0x18c)](_0x2bf26c);}catch(_0x2e205a){return console[_0x222dbf(0xb5)](_0x222dbf(0x192),_0x2e205a&&_0x2e205a[_0x222dbf(0xfb)]),()=>{};}});return _0x4c21ba=>_0x1346e4[_0x45e9ef(0x180)](_0x4e6b05=>_0x4e6b05(_0x4c21ba));}function ne(_0x4fcdbb,_0x41abbf,_0x38f281,_0x20ae8a){var _0x260cb6=_0x1c43af;_0x20ae8a&&_0x4fcdbb===_0x260cb6(0x11c)&&_0x38f281['location'][_0x260cb6(0x11c)]();}function b(_0x1ea535){var _0x40c323=_0x1c43af,_0x4d1220,_0x307ea1;let _0x43e803=function(_0x177474,_0x2fd5fb){return _0x2fd5fb-_0x177474;},_0x2ddba0;if(_0x1ea535[_0x40c323(0xc4)])_0x2ddba0=function(){var _0xc8e27=_0x40c323;return _0x1ea535[_0xc8e27(0xc4)][_0xc8e27(0x185)]();};else{if(_0x1ea535[_0x40c323(0xc5)]&&_0x1ea535[_0x40c323(0xc5)][_0x40c323(0x176)]&&((_0x307ea1=(_0x4d1220=_0x1ea535[_0x40c323(0xc5)])==null?void 0x0:_0x4d1220['env'])==null?void 0x0:_0x307ea1[_0x40c323(0x10b)])!==_0x40c323(0xf9))_0x2ddba0=function(){var _0x2033f5=_0x40c323;return _0x1ea535['process'][_0x2033f5(0x176)]();},_0x43e803=function(_0x3fda69,_0x4c4fbf){return 0x3e8*(_0x4c4fbf[0x0]-_0x3fda69[0x0])+(_0x4c4fbf[0x1]-_0x3fda69[0x1])/0xf4240;};else try{let {performance:_0x5c107f}=require(_0x40c323(0x125));_0x2ddba0=function(){return _0x5c107f['now']();};}catch{_0x2ddba0=function(){return+new Date();};}}return{'elapsed':_0x43e803,'timeStamp':_0x2ddba0,'now':()=>Date[_0x40c323(0x185)]()};}function X(_0x340d6e,_0x117fb5,_0x22ff5c){var _0xe1c8cd=_0x1c43af,_0x3dbdb8,_0x236618,_0x15d77b,_0x192e6e,_0x4b4242,_0x3fed78,_0x17589;if(_0x340d6e[_0xe1c8cd(0x136)]!==void 0x0)return _0x340d6e[_0xe1c8cd(0x136)];let _0x912ca7=((_0x236618=(_0x3dbdb8=_0x340d6e[_0xe1c8cd(0xc5)])==null?void 0x0:_0x3dbdb8[_0xe1c8cd(0xe0)])==null?void 0x0:_0x236618['node'])||((_0x192e6e=(_0x15d77b=_0x340d6e['process'])==null?void 0x0:_0x15d77b[_0xe1c8cd(0x98)])==null?void 0x0:_0x192e6e[_0xe1c8cd(0x10b)])==='edge',_0x6b35ca=!!(_0x22ff5c===_0xe1c8cd(0x12f)&&((_0x4b4242=_0x340d6e[_0xe1c8cd(0xed)])==null?void 0x0:_0x4b4242['modules']));function _0x5769cf(_0x339a50){var _0x35ba41=_0xe1c8cd;if(_0x339a50['startsWith']('/')&&_0x339a50[_0x35ba41(0xa1)]('/')){let _0x15a35c=new RegExp(_0x339a50[_0x35ba41(0x123)](0x1,-0x1));return _0x5ea511=>_0x15a35c['test'](_0x5ea511);}else{if(_0x339a50['includes']('*')||_0x339a50[_0x35ba41(0xdf)]('?')){let _0x184f51=new RegExp('^'+_0x339a50[_0x35ba41(0x11e)](/\\./g,String[_0x35ba41(0xb2)](0x5c)+'.')[_0x35ba41(0x11e)](/\\*/g,'.*')['replace'](/\\?/g,'.')+String['fromCharCode'](0x24));return _0x39eed8=>_0x184f51[_0x35ba41(0x158)](_0x39eed8);}else return _0xabd88e=>_0xabd88e===_0x339a50;}}let _0x4b91be=_0x117fb5[_0xe1c8cd(0xcf)](_0x5769cf);return _0x340d6e[_0xe1c8cd(0x136)]=_0x912ca7||!_0x117fb5,!_0x340d6e[_0xe1c8cd(0x136)]&&((_0x3fed78=_0x340d6e['location'])==null?void 0x0:_0x3fed78['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=_0x4b91be[_0xe1c8cd(0x17e)](_0x343231=>_0x343231(_0x340d6e[_0xe1c8cd(0x199)][_0xe1c8cd(0xce)]))),_0x6b35ca&&!_0x340d6e[_0xe1c8cd(0x136)]&&!((_0x17589=_0x340d6e['location'])!=null&&_0x17589['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=!0x0),_0x340d6e['_consoleNinjaAllowedToStart'];}function _0xa6b0(_0x3977d5,_0x32be94){var _0x5e983e=_0x5e98();return _0xa6b0=function(_0xa6b054,_0x27ece8){_0xa6b054=_0xa6b054-0x97;var _0x18222c=_0x5e983e[_0xa6b054];return _0x18222c;},_0xa6b0(_0x3977d5,_0x32be94);}function J(_0x2a19ae,_0x447b71,_0x7f88c9,_0x5161a5,_0x483b0f,_0x599cd8){var _0x1bff5a=_0x1c43af;_0x2a19ae=_0x2a19ae,_0x447b71=_0x447b71,_0x7f88c9=_0x7f88c9,_0x5161a5=_0x5161a5,_0x483b0f=_0x483b0f,_0x483b0f=_0x483b0f||{},_0x483b0f[_0x1bff5a(0x16e)]=_0x483b0f[_0x1bff5a(0x16e)]||{},_0x483b0f['reducedLimits']=_0x483b0f[_0x1bff5a(0xbf)]||{},_0x483b0f[_0x1bff5a(0x15d)]=_0x483b0f[_0x1bff5a(0x15d)]||{},_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']=_0x483b0f['reducePolicy'][_0x1bff5a(0x97)]||{},_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]=_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]||{};let _0x15035d={'perLogpoint':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)][_0x1bff5a(0x138)]||0x32,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint'][_0x1bff5a(0x148)]||0x64,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']['resetWhenQuietMs']||0x1f4,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)]['resetOnProcessingTimeAverageMs']||0x64},'global':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)]['global'][_0x1bff5a(0x138)]||0x3e8,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['reduceOnAccumulatedProcessingTimeMs']||0x12c,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['resetWhenQuietMs']||0x32,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)][_0x1bff5a(0x1a5)]||0x64}},_0x501118=b(_0x2a19ae),_0x49b596=_0x501118[_0x1bff5a(0xb4)],_0x32f0dd=_0x501118['timeStamp'];function _0x3c842b(){var _0x32cdb1=_0x1bff5a;this[_0x32cdb1(0xa5)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x32cdb1(0x112)]=/^(0|[1-9][0-9]*)$/,this[_0x32cdb1(0xa0)]=/'([^\\\\']|\\\\')*'/,this[_0x32cdb1(0x9a)]=_0x2a19ae[_0x32cdb1(0x13d)],this[_0x32cdb1(0x173)]=_0x2a19ae['HTMLAllCollection'],this[_0x32cdb1(0x15b)]=Object[_0x32cdb1(0x129)],this['_getOwnPropertyNames']=Object[_0x32cdb1(0x14f)],this['_Symbol']=_0x2a19ae[_0x32cdb1(0xe2)],this[_0x32cdb1(0x19c)]=RegExp[_0x32cdb1(0x172)]['toString'],this[_0x32cdb1(0x13b)]=Date[_0x32cdb1(0x172)][_0x32cdb1(0x11b)];}_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x16a)]=function(_0x40d313,_0x3fb199,_0x10e703,_0x3e651e){var _0x31c197=_0x1bff5a,_0x5c7575=this,_0xb95b67=_0x10e703[_0x31c197(0x169)];function _0x7ee627(_0x50c25b,_0x2d57c1,_0x4ad281){var _0x32ec39=_0x31c197;_0x2d57c1[_0x32ec39(0x99)]=_0x32ec39(0x114),_0x2d57c1[_0x32ec39(0x187)]=_0x50c25b[_0x32ec39(0xfb)],_0x16f50a=_0x4ad281[_0x32ec39(0x14e)][_0x32ec39(0x191)],_0x4ad281['node'][_0x32ec39(0x191)]=_0x2d57c1,_0x5c7575[_0x32ec39(0x124)](_0x2d57c1,_0x4ad281);}let _0x36cd62,_0x1773b6,_0x23751c=_0x2a19ae[_0x31c197(0xdd)];_0x2a19ae['ninjaSuppressConsole']=!0x0,_0x2a19ae[_0x31c197(0x159)]&&(_0x36cd62=_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)],_0x1773b6=_0x2a19ae['console'][_0x31c197(0xb5)],_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=function(){}),_0x1773b6&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0xb5)]=function(){}));try{try{_0x10e703[_0x31c197(0x16d)]++,_0x10e703[_0x31c197(0x169)]&&_0x10e703[_0x31c197(0xf1)]['push'](_0x3fb199);var _0x25e0f3,_0x4eb4e8,_0x18d4fe,_0x37ccc9,_0x30d81d=[],_0x56445b=[],_0x302c18,_0x5830a7=this[_0x31c197(0x15a)](_0x3fb199),_0x2a7b73=_0x5830a7===_0x31c197(0x111),_0x8efbaa=!0x1,_0x5670c1=_0x5830a7===_0x31c197(0x15c),_0x2c17b4=this['_isPrimitiveType'](_0x5830a7),_0xb70796=this['_isPrimitiveWrapperType'](_0x5830a7),_0x3c20b2=_0x2c17b4||_0xb70796,_0x36f42e={},_0x552b6b=0x0,_0x22e716=!0x1,_0x16f50a,_0x1394aa=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x10e703[_0x31c197(0x198)]){if(_0x2a7b73){if(_0x4eb4e8=_0x3fb199[_0x31c197(0x10d)],_0x4eb4e8>_0x10e703[_0x31c197(0x163)]){for(_0x18d4fe=0x0,_0x37ccc9=_0x10e703[_0x31c197(0x163)],_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));_0x40d313[_0x31c197(0x167)]=!0x0;}else{for(_0x18d4fe=0x0,_0x37ccc9=_0x4eb4e8,_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));}_0x10e703[_0x31c197(0x146)]+=_0x56445b[_0x31c197(0x10d)];}if(!(_0x5830a7==='null'||_0x5830a7==='undefined')&&!_0x2c17b4&&_0x5830a7!==_0x31c197(0x153)&&_0x5830a7!==_0x31c197(0x9e)&&_0x5830a7!==_0x31c197(0x11a)){var _0x718615=_0x3e651e[_0x31c197(0x17d)]||_0x10e703[_0x31c197(0x17d)];if(this[_0x31c197(0xe4)](_0x3fb199)?(_0x25e0f3=0x0,_0x3fb199[_0x31c197(0x180)](function(_0x5367ff){var _0x157c73=_0x31c197;if(_0x552b6b++,_0x10e703[_0x157c73(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703[_0x157c73(0xeb)]&&_0x10e703[_0x157c73(0x169)]&&_0x10e703[_0x157c73(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}_0x56445b[_0x157c73(0x175)](_0x5c7575['_addProperty'](_0x30d81d,_0x3fb199,_0x157c73(0x11d),_0x25e0f3++,_0x10e703,function(_0x4b87c0){return function(){return _0x4b87c0;};}(_0x5367ff)));})):this['_isMap'](_0x3fb199)&&_0x3fb199['forEach'](function(_0x4f6586,_0x1127ce){var _0x1f1731=_0x31c197;if(_0x552b6b++,_0x10e703[_0x1f1731(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703['isExpressionToEvaluate']&&_0x10e703[_0x1f1731(0x169)]&&_0x10e703[_0x1f1731(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}var _0x5c22c1=_0x1127ce[_0x1f1731(0x11b)]();_0x5c22c1[_0x1f1731(0x10d)]>0x64&&(_0x5c22c1=_0x5c22c1[_0x1f1731(0x123)](0x0,0x64)+_0x1f1731(0xb6)),_0x56445b[_0x1f1731(0x175)](_0x5c7575[_0x1f1731(0x14c)](_0x30d81d,_0x3fb199,'Map',_0x5c22c1,_0x10e703,function(_0x310ba3){return function(){return _0x310ba3;};}(_0x4f6586)));}),!_0x8efbaa){try{for(_0x302c18 in _0x3fb199)if(!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703[_0x31c197(0x194)]){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575['_addObjectProperty'](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}catch{}if(_0x36f42e[_0x31c197(0x119)]=!0x0,_0x5670c1&&(_0x36f42e[_0x31c197(0x197)]=!0x0),!_0x22e716){var _0xf18844=[]['concat'](this[_0x31c197(0x100)](_0x3fb199))['concat'](this[_0x31c197(0x152)](_0x3fb199));for(_0x25e0f3=0x0,_0x4eb4e8=_0xf18844[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)if(_0x302c18=_0xf18844[_0x25e0f3],!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18['toString']()))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)&&!_0x36f42e[typeof _0x302c18!=_0x31c197(0x184)?_0x31c197(0xca)+_0x302c18[_0x31c197(0x11b)]():_0x302c18]){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575[_0x31c197(0xde)](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}}}}if(_0x40d313[_0x31c197(0x99)]=_0x5830a7,_0x3c20b2?(_0x40d313['value']=_0x3fb199[_0x31c197(0xa7)](),this[_0x31c197(0x128)](_0x5830a7,_0x40d313,_0x10e703,_0x3e651e)):_0x5830a7===_0x31c197(0x107)?_0x40d313[_0x31c197(0xcc)]=this['_dateToString'][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x11a)?_0x40d313[_0x31c197(0xcc)]=_0x3fb199[_0x31c197(0x11b)]():_0x5830a7==='RegExp'?_0x40d313['value']=this[_0x31c197(0x19c)][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x184)&&this[_0x31c197(0x178)]?_0x40d313[_0x31c197(0xcc)]=this[_0x31c197(0x178)][_0x31c197(0x172)][_0x31c197(0x11b)]['call'](_0x3fb199):!_0x10e703[_0x31c197(0x198)]&&!(_0x5830a7===_0x31c197(0x18e)||_0x5830a7===_0x31c197(0x13d))&&(delete _0x40d313[_0x31c197(0xcc)],_0x40d313['capped']=!0x0),_0x22e716&&(_0x40d313[_0x31c197(0xc8)]=!0x0),_0x16f50a=_0x10e703[_0x31c197(0x14e)]['current'],_0x10e703[_0x31c197(0x14e)][_0x31c197(0x191)]=_0x40d313,this['_treeNodePropertiesBeforeFullValue'](_0x40d313,_0x10e703),_0x56445b['length']){for(_0x25e0f3=0x0,_0x4eb4e8=_0x56445b[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)_0x56445b[_0x25e0f3](_0x25e0f3);}_0x30d81d[_0x31c197(0x10d)]&&(_0x40d313['props']=_0x30d81d);}catch(_0x48a3c4){_0x7ee627(_0x48a3c4,_0x40d313,_0x10e703);}this['_additionalMetadata'](_0x3fb199,_0x40d313),this[_0x31c197(0xdc)](_0x40d313,_0x10e703),_0x10e703[_0x31c197(0x14e)]['current']=_0x16f50a,_0x10e703[_0x31c197(0x16d)]--,_0x10e703[_0x31c197(0x169)]=_0xb95b67,_0x10e703[_0x31c197(0x169)]&&_0x10e703['autoExpandPreviousObjects']['pop']();}finally{_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=_0x36cd62),_0x1773b6&&(_0x2a19ae['console']['warn']=_0x1773b6),_0x2a19ae[_0x31c197(0xdd)]=_0x23751c;}return _0x40d313;},_0x3c842b['prototype'][_0x1bff5a(0x152)]=function(_0x5568c0){var _0x950ed8=_0x1bff5a;return Object[_0x950ed8(0xf2)]?Object[_0x950ed8(0xf2)](_0x5568c0):[];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xe4)]=function(_0x5cff31){var _0x5294c9=_0x1bff5a;return!!(_0x5cff31&&_0x2a19ae[_0x5294c9(0x11d)]&&this['_objectToString'](_0x5cff31)===_0x5294c9(0xb3)&&_0x5cff31[_0x5294c9(0x180)]);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf4)]=function(_0x176394,_0x32608a,_0xd5d805){var _0x4c84a9=_0x1bff5a;if(!_0xd5d805['resolveGetters']){let _0x75bbab=this['_getOwnPropertyDescriptor'](_0x176394,_0x32608a);if(_0x75bbab&&_0x75bbab[_0x4c84a9(0x126)])return!0x0;}return _0xd5d805[_0x4c84a9(0x177)]?typeof _0x176394[_0x32608a]=='function':!0x1;},_0x3c842b['prototype'][_0x1bff5a(0x15a)]=function(_0x2dedf1){var _0x14c6b0=_0x1bff5a,_0x5f049e='';return _0x5f049e=typeof _0x2dedf1,_0x5f049e===_0x14c6b0(0x12d)?this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x19e)?_0x5f049e=_0x14c6b0(0x111):this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x170)?_0x5f049e=_0x14c6b0(0x107):this[_0x14c6b0(0x127)](_0x2dedf1)==='[object\\x20BigInt]'?_0x5f049e=_0x14c6b0(0x11a):_0x2dedf1===null?_0x5f049e=_0x14c6b0(0x18e):_0x2dedf1[_0x14c6b0(0x19d)]&&(_0x5f049e=_0x2dedf1[_0x14c6b0(0x19d)][_0x14c6b0(0xe5)]||_0x5f049e):_0x5f049e===_0x14c6b0(0x13d)&&this[_0x14c6b0(0x173)]&&_0x2dedf1 instanceof this[_0x14c6b0(0x173)]&&(_0x5f049e=_0x14c6b0(0x16f)),_0x5f049e;},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x127)]=function(_0x26fd83){var _0x2cc9cb=_0x1bff5a;return Object[_0x2cc9cb(0x172)][_0x2cc9cb(0x11b)][_0x2cc9cb(0xb9)](_0x26fd83);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xd1)]=function(_0x33c047){var _0x1aed3d=_0x1bff5a;return _0x33c047===_0x1aed3d(0xe7)||_0x33c047===_0x1aed3d(0x13e)||_0x33c047===_0x1aed3d(0x113);},_0x3c842b['prototype'][_0x1bff5a(0x12b)]=function(_0x9c26bc){var _0x3445a7=_0x1bff5a;return _0x9c26bc===_0x3445a7(0xb7)||_0x9c26bc===_0x3445a7(0x153)||_0x9c26bc==='Number';},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x14c)]=function(_0x39d72b,_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931){var _0x13303e=this;return function(_0x3b0a04){var _0xfd957=_0xa6b0,_0x1e9977=_0x2af968['node']['current'],_0x416967=_0x2af968['node']['index'],_0x278cad=_0x2af968[_0xfd957(0x14e)][_0xfd957(0x13f)];_0x2af968['node']['parent']=_0x1e9977,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=typeof _0x3315a9==_0xfd957(0x113)?_0x3315a9:_0x3b0a04,_0x39d72b[_0xfd957(0x175)](_0x13303e[_0xfd957(0x147)](_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931)),_0x2af968[_0xfd957(0x14e)]['parent']=_0x278cad,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=_0x416967;};},_0x3c842b['prototype'][_0x1bff5a(0xde)]=function(_0x1ac5b3,_0x4e5a09,_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c){var _0x416fff=_0x1bff5a,_0x5079ab=this;return _0x4e5a09[typeof _0x28ffe1!=_0x416fff(0x184)?_0x416fff(0xca)+_0x28ffe1[_0x416fff(0x11b)]():_0x28ffe1]=!0x0,function(_0x193c6b){var _0x8b0c8=_0x416fff,_0x4e890c=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x191)],_0x1de07b=_0xa4d180[_0x8b0c8(0x14e)]['index'],_0x4c6e05=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)];_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)]=_0x4e890c,_0xa4d180['node']['index']=_0x193c6b,_0x1ac5b3['push'](_0x5079ab['_property'](_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c)),_0xa4d180['node']['parent']=_0x4c6e05,_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x17f)]=_0x1de07b;};},_0x3c842b['prototype'][_0x1bff5a(0x147)]=function(_0x3fc911,_0x53af0b,_0x1daee9,_0x1aaecf,_0x3c6648){var _0x24ab9f=_0x1bff5a,_0x1044ef=this;_0x3c6648||(_0x3c6648=function(_0x5aebf0,_0xe2bf62){return _0x5aebf0[_0xe2bf62];});var _0x3ba706=_0x1daee9[_0x24ab9f(0x11b)](),_0x147ad8=_0x1aaecf[_0x24ab9f(0x14a)]||{},_0x564175=_0x1aaecf[_0x24ab9f(0x198)],_0x4c8e20=_0x1aaecf['isExpressionToEvaluate'];try{var _0xa14fb7=this[_0x24ab9f(0x106)](_0x3fc911),_0xf1a445=_0x3ba706;_0xa14fb7&&_0xf1a445[0x0]==='\\x27'&&(_0xf1a445=_0xf1a445[_0x24ab9f(0x157)](0x1,_0xf1a445[_0x24ab9f(0x10d)]-0x2));var _0x83dd31=_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8[_0x24ab9f(0xca)+_0xf1a445];_0x83dd31&&(_0x1aaecf[_0x24ab9f(0x198)]=_0x1aaecf[_0x24ab9f(0x198)]+0x1),_0x1aaecf['isExpressionToEvaluate']=!!_0x83dd31;var _0x1718af=typeof _0x1daee9==_0x24ab9f(0x184),_0x3e3cf6={'name':_0x1718af||_0xa14fb7?_0x3ba706:this[_0x24ab9f(0x154)](_0x3ba706)};if(_0x1718af&&(_0x3e3cf6[_0x24ab9f(0x184)]=!0x0),!(_0x53af0b===_0x24ab9f(0x111)||_0x53af0b==='Error')){var _0x270121=this[_0x24ab9f(0x15b)](_0x3fc911,_0x1daee9);if(_0x270121&&(_0x270121['set']&&(_0x3e3cf6[_0x24ab9f(0xfd)]=!0x0),_0x270121['get']&&!_0x83dd31&&!_0x1aaecf[_0x24ab9f(0x102)]))return _0x3e3cf6['getter']=!0x0,this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x75d602;try{_0x75d602=_0x3c6648(_0x3fc911,_0x1daee9);}catch(_0x13aa60){return _0x3e3cf6={'name':_0x3ba706,'type':_0x24ab9f(0x114),'error':_0x13aa60[_0x24ab9f(0xfb)]},this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x74802c=this['_type'](_0x75d602),_0x3e9d1f=this['_isPrimitiveType'](_0x74802c);if(_0x3e3cf6[_0x24ab9f(0x99)]=_0x74802c,_0x3e9d1f)this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x58307e=_0x24ab9f;_0x3e3cf6[_0x58307e(0xcc)]=_0x75d602['valueOf'](),!_0x83dd31&&_0x1044ef[_0x58307e(0x128)](_0x74802c,_0x3e3cf6,_0x1aaecf,{});});else{var _0xf56525=_0x1aaecf['autoExpand']&&_0x1aaecf[_0x24ab9f(0x16d)]<_0x1aaecf[_0x24ab9f(0xc0)]&&_0x1aaecf['autoExpandPreviousObjects']['indexOf'](_0x75d602)<0x0&&_0x74802c!==_0x24ab9f(0x15c)&&_0x1aaecf[_0x24ab9f(0x146)]<_0x1aaecf['autoExpandLimit'];_0xf56525||_0x1aaecf['level']<_0x564175||_0x83dd31?this[_0x24ab9f(0x16a)](_0x3e3cf6,_0x75d602,_0x1aaecf,_0x83dd31||{}):this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x393a95=_0x24ab9f;_0x74802c===_0x393a95(0x18e)||_0x74802c===_0x393a95(0x13d)||(delete _0x3e3cf6[_0x393a95(0xcc)],_0x3e3cf6[_0x393a95(0x12e)]=!0x0);});}return _0x3e3cf6;}finally{_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8,_0x1aaecf['depth']=_0x564175,_0x1aaecf[_0x24ab9f(0xeb)]=_0x4c8e20;}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x128)]=function(_0x56d3fe,_0x3888bc,_0x5eecce,_0x4702b6){var _0x2683b4=_0x1bff5a,_0x25341f=_0x4702b6[_0x2683b4(0xad)]||_0x5eecce[_0x2683b4(0xad)];if((_0x56d3fe==='string'||_0x56d3fe===_0x2683b4(0x153))&&_0x3888bc[_0x2683b4(0xcc)]){let _0x49128b=_0x3888bc[_0x2683b4(0xcc)][_0x2683b4(0x10d)];_0x5eecce[_0x2683b4(0x161)]+=_0x49128b,_0x5eecce[_0x2683b4(0x161)]>_0x5eecce[_0x2683b4(0xda)]?(_0x3888bc[_0x2683b4(0x12e)]='',delete _0x3888bc[_0x2683b4(0xcc)]):_0x49128b>_0x25341f&&(_0x3888bc['capped']=_0x3888bc['value'][_0x2683b4(0x157)](0x0,_0x25341f),delete _0x3888bc[_0x2683b4(0xcc)]);}},_0x3c842b[_0x1bff5a(0x172)]['_isMap']=function(_0x23ed93){var _0x32ae70=_0x1bff5a;return!!(_0x23ed93&&_0x2a19ae[_0x32ae70(0x193)]&&this[_0x32ae70(0x127)](_0x23ed93)===_0x32ae70(0x117)&&_0x23ed93[_0x32ae70(0x180)]);},_0x3c842b['prototype'][_0x1bff5a(0x154)]=function(_0x539e6b){var _0x3e9eb6=_0x1bff5a;if(_0x539e6b['match'](/^\\d+$/))return _0x539e6b;var _0x268203;try{_0x268203=JSON[_0x3e9eb6(0xa8)](''+_0x539e6b);}catch{_0x268203='\\x22'+this['_objectToString'](_0x539e6b)+'\\x22';}return _0x268203[_0x3e9eb6(0x149)](/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?_0x268203=_0x268203['substr'](0x1,_0x268203[_0x3e9eb6(0x10d)]-0x2):_0x268203=_0x268203['replace'](/'/g,'\\x5c\\x27')[_0x3e9eb6(0x11e)](/\\\\"/g,'\\x22')[_0x3e9eb6(0x11e)](/(^"|"$)/g,'\\x27'),_0x268203;},_0x3c842b['prototype'][_0x1bff5a(0x115)]=function(_0x1b22e6,_0x139c74,_0x26c1fb,_0x18f60b){var _0x59810d=_0x1bff5a;this[_0x59810d(0x124)](_0x1b22e6,_0x139c74),_0x18f60b&&_0x18f60b(),this[_0x59810d(0x13c)](_0x26c1fb,_0x1b22e6),this[_0x59810d(0xdc)](_0x1b22e6,_0x139c74);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x124)]=function(_0x3de57f,_0x633f7e){var _0x3b15c7=_0x1bff5a;this[_0x3b15c7(0x120)](_0x3de57f,_0x633f7e),this['_setNodeQueryPath'](_0x3de57f,_0x633f7e),this[_0x3b15c7(0xaa)](_0x3de57f,_0x633f7e),this[_0x3b15c7(0x140)](_0x3de57f,_0x633f7e);},_0x3c842b['prototype'][_0x1bff5a(0x120)]=function(_0x212392,_0x5350c2){},_0x3c842b['prototype'][_0x1bff5a(0x15e)]=function(_0x254f19,_0xb65cfa){},_0x3c842b[_0x1bff5a(0x172)]['_setNodeLabel']=function(_0x5174e1,_0x4a4537){},_0x3c842b[_0x1bff5a(0x172)]['_isUndefined']=function(_0x4b9a4e){var _0x29d539=_0x1bff5a;return _0x4b9a4e===this[_0x29d539(0x9a)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xdc)]=function(_0x112fbe,_0xc2b2f8){var _0x13069a=_0x1bff5a;this[_0x13069a(0x122)](_0x112fbe,_0xc2b2f8),this[_0x13069a(0x118)](_0x112fbe),_0xc2b2f8[_0x13069a(0x168)]&&this[_0x13069a(0xcd)](_0x112fbe),this[_0x13069a(0x1a3)](_0x112fbe,_0xc2b2f8),this['_addLoadNode'](_0x112fbe,_0xc2b2f8),this['_cleanNode'](_0x112fbe);},_0x3c842b[_0x1bff5a(0x172)]['_additionalMetadata']=function(_0x480177,_0x5bf51c){var _0x36c251=_0x1bff5a;try{_0x480177&&typeof _0x480177[_0x36c251(0x10d)]==_0x36c251(0x113)&&(_0x5bf51c[_0x36c251(0x10d)]=_0x480177[_0x36c251(0x10d)]);}catch{}if(_0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x113)||_0x5bf51c[_0x36c251(0x99)]==='Number'){if(isNaN(_0x5bf51c[_0x36c251(0xcc)]))_0x5bf51c[_0x36c251(0xf7)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];else switch(_0x5bf51c['value']){case Number['POSITIVE_INFINITY']:_0x5bf51c['positiveInfinity']=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case Number[_0x36c251(0x18d)]:_0x5bf51c[_0x36c251(0x109)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case 0x0:this[_0x36c251(0xef)](_0x5bf51c[_0x36c251(0xcc)])&&(_0x5bf51c[_0x36c251(0xbb)]=!0x0);break;}}else _0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x15c)&&typeof _0x480177[_0x36c251(0xe5)]==_0x36c251(0x13e)&&_0x480177[_0x36c251(0xe5)]&&_0x5bf51c[_0x36c251(0xe5)]&&_0x480177['name']!==_0x5bf51c[_0x36c251(0xe5)]&&(_0x5bf51c[_0x36c251(0xb8)]=_0x480177['name']);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xef)]=function(_0x5f59c6){var _0x3d7094=_0x1bff5a;return 0x1/_0x5f59c6===Number[_0x3d7094(0x18d)];},_0x3c842b[_0x1bff5a(0x172)]['_sortProps']=function(_0x341845){var _0xf1b50d=_0x1bff5a;!_0x341845['props']||!_0x341845[_0xf1b50d(0x17d)][_0xf1b50d(0x10d)]||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x111)||_0x341845['type']===_0xf1b50d(0x193)||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x11d)||_0x341845[_0xf1b50d(0x17d)]['sort'](function(_0x18e25d,_0x2e5ca7){var _0x5d8ea4=_0xf1b50d,_0x2086c0=_0x18e25d[_0x5d8ea4(0xe5)]['toLowerCase'](),_0x11bbd3=_0x2e5ca7[_0x5d8ea4(0xe5)]['toLowerCase']();return _0x2086c0<_0x11bbd3?-0x1:_0x2086c0>_0x11bbd3?0x1:0x0;});},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x1a3)]=function(_0x54949b,_0x4cb346){var _0x5e9777=_0x1bff5a;if(!(_0x4cb346[_0x5e9777(0x177)]||!_0x54949b[_0x5e9777(0x17d)]||!_0x54949b['props'][_0x5e9777(0x10d)])){for(var _0x4f6972=[],_0x78d8a8=[],_0x20bd98=0x0,_0x5628f1=_0x54949b['props'][_0x5e9777(0x10d)];_0x20bd98<_0x5628f1;_0x20bd98++){var _0x5c1147=_0x54949b[_0x5e9777(0x17d)][_0x20bd98];_0x5c1147[_0x5e9777(0x99)]===_0x5e9777(0x15c)?_0x4f6972[_0x5e9777(0x175)](_0x5c1147):_0x78d8a8[_0x5e9777(0x175)](_0x5c1147);}if(!(!_0x78d8a8['length']||_0x4f6972[_0x5e9777(0x10d)]<=0x1)){_0x54949b[_0x5e9777(0x17d)]=_0x78d8a8;var _0x1ffed3={'functionsNode':!0x0,'props':_0x4f6972};this[_0x5e9777(0x120)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x122)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x118)](_0x1ffed3),this['_setNodePermissions'](_0x1ffed3,_0x4cb346),_0x1ffed3['id']+='\\x20f',_0x54949b[_0x5e9777(0x17d)]['unshift'](_0x1ffed3);}}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x10f)]=function(_0x3e2ffa,_0x7cf6a2){},_0x3c842b['prototype'][_0x1bff5a(0x118)]=function(_0x25a8d7){},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf3)]=function(_0x1726d6){var _0x4469e7=_0x1bff5a;return Array[_0x4469e7(0x9b)](_0x1726d6)||typeof _0x1726d6==_0x4469e7(0x12d)&&this[_0x4469e7(0x127)](_0x1726d6)===_0x4469e7(0x19e);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x140)]=function(_0x4c1d3c,_0x349781){},_0x3c842b['prototype']['_cleanNode']=function(_0x4d21c1){var _0xd58577=_0x1bff5a;delete _0x4d21c1[_0xd58577(0xf5)],delete _0x4d21c1[_0xd58577(0x144)],delete _0x4d21c1[_0xd58577(0x110)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xaa)]=function(_0x43e4e6,_0x3cf6da){};let _0x22e9d1=new _0x3c842b(),_0x31d042={'props':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x17d)]||0x64,'elements':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x163)]||0x64,'strLength':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0xad)]||0x400*0x32,'totalStrLength':_0x483b0f['defaultLimits'][_0x1bff5a(0xda)]||0x400*0x32,'autoExpandLimit':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x194)]||0x1388,'autoExpandMaxDepth':_0x483b0f['defaultLimits'][_0x1bff5a(0xc0)]||0xa},_0x5134cc={'props':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x17d)]||0x5,'elements':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x163)]||0x5,'strLength':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0xad)]||0x100,'totalStrLength':_0x483b0f['reducedLimits'][_0x1bff5a(0xda)]||0x100*0x3,'autoExpandLimit':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x194)]||0x1e,'autoExpandMaxDepth':_0x483b0f[_0x1bff5a(0xbf)]['autoExpandMaxDepth']||0x2};if(_0x599cd8){let _0x10c22a=_0x22e9d1[_0x1bff5a(0x16a)][_0x1bff5a(0x18c)](_0x22e9d1);_0x22e9d1[_0x1bff5a(0x16a)]=function(_0x63dc8a,_0xf87bc8,_0xed8b,_0x3030e4){return _0x10c22a(_0x63dc8a,_0x599cd8(_0xf87bc8),_0xed8b,_0x3030e4);};}function _0x36e6e0(_0x4b7ae2,_0x7448e6,_0x1e6871,_0x13e959,_0x54bcfa,_0x5e46fe){var _0x55e03f=_0x1bff5a;let _0x581fa4,_0x572fc2;try{_0x572fc2=_0x32f0dd(),_0x581fa4=_0x7f88c9[_0x7448e6],!_0x581fa4||_0x572fc2-_0x581fa4['ts']>_0x15035d['perLogpoint'][_0x55e03f(0xa9)]&&_0x581fa4['count']&&_0x581fa4[_0x55e03f(0x137)]/_0x581fa4[_0x55e03f(0xd3)]<_0x15035d['perLogpoint']['resetOnProcessingTimeAverageMs']?(_0x7f88c9[_0x7448e6]=_0x581fa4={'count':0x0,'time':0x0,'ts':_0x572fc2},_0x7f88c9[_0x55e03f(0x10c)]={}):_0x572fc2-_0x7f88c9[_0x55e03f(0x10c)]['ts']>_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0xa9)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]/_0x7f88c9[_0x55e03f(0x10c)]['count']<_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0x1a5)]&&(_0x7f88c9[_0x55e03f(0x10c)]={});let _0x592aa0=[],_0x201cd8=_0x581fa4['reduceLimits']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xbc)]?_0x5134cc:_0x31d042,_0x1c3b41=_0x440706=>{var _0x380ff0=_0x55e03f;let _0x2fbc49={};return _0x2fbc49['props']=_0x440706['props'],_0x2fbc49['elements']=_0x440706[_0x380ff0(0x163)],_0x2fbc49['strLength']=_0x440706['strLength'],_0x2fbc49[_0x380ff0(0xda)]=_0x440706[_0x380ff0(0xda)],_0x2fbc49[_0x380ff0(0x194)]=_0x440706[_0x380ff0(0x194)],_0x2fbc49[_0x380ff0(0xc0)]=_0x440706[_0x380ff0(0xc0)],_0x2fbc49[_0x380ff0(0x168)]=!0x1,_0x2fbc49[_0x380ff0(0x177)]=!_0x447b71,_0x2fbc49[_0x380ff0(0x198)]=0x1,_0x2fbc49['level']=0x0,_0x2fbc49[_0x380ff0(0xfa)]=_0x380ff0(0xae),_0x2fbc49['rootExpression']=_0x380ff0(0x104),_0x2fbc49[_0x380ff0(0x169)]=!0x0,_0x2fbc49[_0x380ff0(0xf1)]=[],_0x2fbc49['autoExpandPropertyCount']=0x0,_0x2fbc49[_0x380ff0(0x102)]=_0x483b0f[_0x380ff0(0x102)],_0x2fbc49[_0x380ff0(0x161)]=0x0,_0x2fbc49[_0x380ff0(0x14e)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x2fbc49;};for(var _0x34cb46=0x0;_0x34cb46<_0x54bcfa['length'];_0x34cb46++)_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'timeNode':_0x4b7ae2==='time'||void 0x0},_0x54bcfa[_0x34cb46],_0x1c3b41(_0x201cd8),{}));if(_0x4b7ae2==='trace'||_0x4b7ae2===_0x55e03f(0x187)){let _0x38f028=Error['stackTraceLimit'];try{Error['stackTraceLimit']=0x1/0x0,_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'stackNode':!0x0},new Error()['stack'],_0x1c3b41(_0x201cd8),{'strLength':0x1/0x0}));}finally{Error['stackTraceLimit']=_0x38f028;}}return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':_0x592aa0,'id':_0x7448e6,'context':_0x5e46fe}]};}catch(_0x38023d){return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':[{'type':_0x55e03f(0x114),'error':_0x38023d&&_0x38023d['message']}],'id':_0x7448e6,'context':_0x5e46fe}]};}finally{try{if(_0x581fa4&&_0x572fc2){let _0x4a1dc5=_0x32f0dd();_0x581fa4['count']++,_0x581fa4['time']+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x581fa4['ts']=_0x4a1dc5,_0x7f88c9['hits'][_0x55e03f(0xd3)]++,_0x7f88c9['hits'][_0x55e03f(0x137)]+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x7f88c9[_0x55e03f(0x10c)]['ts']=_0x4a1dc5,(_0x581fa4[_0x55e03f(0xd3)]>_0x15035d['perLogpoint'][_0x55e03f(0x138)]||_0x581fa4['time']>_0x15035d['perLogpoint'][_0x55e03f(0x148)])&&(_0x581fa4['reduceLimits']=!0x0),(_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]>_0x15035d[_0x55e03f(0xe6)]['reduceOnCount']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]>_0x15035d['global'][_0x55e03f(0x148)])&&(_0x7f88c9['hits'][_0x55e03f(0xbc)]=!0x0);}}catch{}}}return _0x36e6e0;}function G(_0x4bcced){var _0x3ca5c0=_0x1c43af;if(_0x4bcced&&typeof _0x4bcced==_0x3ca5c0(0x12d)&&_0x4bcced[_0x3ca5c0(0x19d)])switch(_0x4bcced[_0x3ca5c0(0x19d)][_0x3ca5c0(0xe5)]){case _0x3ca5c0(0xb0):return _0x4bcced[_0x3ca5c0(0xfc)](Symbol[_0x3ca5c0(0x189)])?Promise[_0x3ca5c0(0x18b)]():_0x4bcced;case _0x3ca5c0(0x19b):return Promise['resolve']();}return _0x4bcced;}((_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x5efe0f,_0xeb603e,_0x2e7e15,_0x351bad,_0x341637,_0x3428c5,_0x343bd6)=>{var _0x1125dc=_0x1c43af;if(_0x48d785[_0x1125dc(0xec)])return _0x48d785['_console_ninja'];let _0x3cd4f6={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}};if(!X(_0x48d785,_0x2e7e15,_0x4d1fbe))return _0x48d785[_0x1125dc(0xec)]=_0x3cd4f6,_0x48d785[_0x1125dc(0xec)];let _0xaf0d67=b(_0x48d785),_0x281f2e=_0xaf0d67[_0x1125dc(0xb4)],_0xae8681=_0xaf0d67[_0x1125dc(0xfe)],_0x4e0fc5=_0xaf0d67['now'],_0xa2e8a7={'hits':{},'ts':{}},_0x91e1f5=J(_0x48d785,_0x351bad,_0xa2e8a7,_0x5efe0f,_0x343bd6,_0x4d1fbe===_0x1125dc(0x179)?G:void 0x0),_0x536854=(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3)=>{var _0x348500=_0x1125dc;let _0x3306b6=_0x48d785['_console_ninja'];try{return _0x48d785[_0x348500(0xec)]=_0x3cd4f6,_0x91e1f5(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3);}finally{_0x48d785[_0x348500(0xec)]=_0x3306b6;}},_0x11e42f=_0x3660d4=>{_0xa2e8a7['ts'][_0x3660d4]=_0xae8681();},_0x308a38=(_0x227f0b,_0x4baf5a)=>{var _0x286c56=_0x1125dc;let _0x459036=_0xa2e8a7['ts'][_0x4baf5a];if(delete _0xa2e8a7['ts'][_0x4baf5a],_0x459036){let _0xaca72e=_0x281f2e(_0x459036,_0xae8681());_0x223f4e(_0x536854(_0x286c56(0x137),_0x227f0b,_0x4e0fc5(),_0x3b9616,[_0xaca72e],_0x4baf5a));}},_0x11c122=_0x2d5a87=>{var _0x28fe2c=_0x1125dc,_0x1c2128;return _0x4d1fbe===_0x28fe2c(0x179)&&_0x48d785[_0x28fe2c(0xa3)]&&((_0x1c2128=_0x2d5a87==null?void 0x0:_0x2d5a87[_0x28fe2c(0x1a4)])==null?void 0x0:_0x1c2128[_0x28fe2c(0x10d)])&&(_0x2d5a87[_0x28fe2c(0x1a4)][0x0][_0x28fe2c(0xa3)]=_0x48d785['origin']),_0x2d5a87;};_0x48d785['_console_ninja']={'consoleLog':(_0x535a72,_0x3d708e)=>{var _0xee4f6a=_0x1125dc;_0x48d785['console'][_0xee4f6a(0x17a)][_0xee4f6a(0xe5)]!==_0xee4f6a(0xd2)&&_0x223f4e(_0x536854(_0xee4f6a(0x17a),_0x535a72,_0x4e0fc5(),_0x3b9616,_0x3d708e));},'consoleTrace':(_0x3cb025,_0x49aa51)=>{var _0x2f4b5c=_0x1125dc,_0x4599c8,_0x3c6c91;_0x48d785[_0x2f4b5c(0x159)][_0x2f4b5c(0x17a)][_0x2f4b5c(0xe5)]!==_0x2f4b5c(0x133)&&((_0x3c6c91=(_0x4599c8=_0x48d785[_0x2f4b5c(0xc5)])==null?void 0x0:_0x4599c8[_0x2f4b5c(0xe0)])!=null&&_0x3c6c91[_0x2f4b5c(0x14e)]&&(_0x48d785['_ninjaIgnoreNextError']=!0x0),_0x223f4e(_0x11c122(_0x536854(_0x2f4b5c(0x181),_0x3cb025,_0x4e0fc5(),_0x3b9616,_0x49aa51))));},'consoleError':(_0x1bcfbb,_0x5dfcc2)=>{var _0x5127a8=_0x1125dc;_0x48d785[_0x5127a8(0x121)]=!0x0,_0x223f4e(_0x11c122(_0x536854(_0x5127a8(0x187),_0x1bcfbb,_0x4e0fc5(),_0x3b9616,_0x5dfcc2)));},'consoleTime':_0x1240c5=>{_0x11e42f(_0x1240c5);},'consoleTimeEnd':(_0x45b15f,_0xedf120)=>{_0x308a38(_0xedf120,_0x45b15f);},'autoLog':(_0x476380,_0x430396)=>{var _0x381ac9=_0x1125dc;_0x223f4e(_0x536854(_0x381ac9(0x17a),_0x430396,_0x4e0fc5(),_0x3b9616,[_0x476380]));},'autoLogMany':(_0x496baf,_0x2de83e)=>{_0x223f4e(_0x536854('log',_0x496baf,_0x4e0fc5(),_0x3b9616,_0x2de83e));},'autoTrace':(_0x580506,_0xdd93fb)=>{var _0x545a58=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x545a58(0x181),_0xdd93fb,_0x4e0fc5(),_0x3b9616,[_0x580506])));},'autoTraceMany':(_0x35b68e,_0x1bf390)=>{var _0x53bd89=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x53bd89(0x181),_0x35b68e,_0x4e0fc5(),_0x3b9616,_0x1bf390)));},'autoTime':(_0x1f9f08,_0x36b878,_0x2bba7b)=>{_0x11e42f(_0x2bba7b);},'autoTimeEnd':(_0x5b5318,_0x42dbfa,_0x2fdc68)=>{_0x308a38(_0x42dbfa,_0x2fdc68);},'coverage':_0x3c7d3b=>{var _0x2e75e3=_0x1125dc;_0x223f4e({'method':_0x2e75e3(0x1a1),'version':_0x5efe0f,'args':[{'id':_0x3c7d3b}]});}};let _0x223f4e=H(_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x341637,_0x3428c5),_0x3b9616=_0x48d785[_0x1125dc(0x183)];return _0x48d785[_0x1125dc(0xec)];})(globalThis,_0x1c43af(0xd0),_0x1c43af(0x1a2),_0x1c43af(0x160),_0x1c43af(0xd8),'1.0.0',_0x1c43af(0x17b),_0x1c43af(0x14b),_0x1c43af(0x18a),'',_0x1c43af(0x156),{"resolveGetters":false,"defaultLimits":{"props":100,"elements":100,"strLength":51200,"totalStrLength":51200,"autoExpandLimit":5000,"autoExpandMaxDepth":10},"reducedLimits":{"props":5,"elements":5,"strLength":256,"totalStrLength":768,"autoExpandLimit":30,"autoExpandMaxDepth":2},"reducePolicy":{"perLogpoint":{"reduceOnCount":50,"reduceOnAccumulatedProcessingTimeMs":100,"resetWhenQuietMs":500,"resetOnProcessingTimeAverageMs":100},"global":{"reduceOnCount":1000,"reduceOnAccumulatedProcessingTimeMs":300,"resetWhenQuietMs":50,"resetOnProcessingTimeAverageMs":100}}});`);
  } catch (e) {
  }
}
function oo_tx(i, ...v) {
  try {
    oo_cm().consoleError(i, v);
  } catch (e) {
  }
  return v;
}

const reviews_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: reviews_post
}, Symbol.toStringTag, { value: 'Module' }));

const search_get = defineEventHandler(async (event) => {
  var _a;
  const query = getQuery$1(event);
  const q = ((_a = query.q) != null ? _a : "").trim();
  if (q.length < 2) return [];
  const rows = await getProducts({ q }, 12);
  return rows.map((p) => {
    var _a2, _b;
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: (_a2 = p.discountPrice) != null ? _a2 : p.price,
      image: (_b = p.images[0]) != null ? _b : "",
      tagline: p.tagline
    };
  });
});

const search_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: search_get
}, Symbol.toStringTag, { value: 'Module' }));

const robots_txt = defineEventHandler((event) => {
  setResponseHeader(event, "Content-Type", "text/plain");
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /cart
Disallow: /checkout

Sitemap: ${SITE.domain}/sitemap.xml
`;
});

const robots_txt$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: robots_txt
}, Symbol.toStringTag, { value: 'Module' }));

const sitemap_xml = defineEventHandler(async (event) => {
  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/cart",
    "/checkout",
    "/account"
  ];
  let productSlugs = [];
  try {
    const products = await getProducts({}, 200);
    productSlugs = products.map((p) => p.slug);
  } catch {
  }
  const urls = [
    ...staticRoutes.map(
      (path) => `  <url>
    <loc>${SITE.domain}${path}</loc>
    <changefreq>${path === "" || path === "/shop" ? "daily" : "weekly"}</changefreq>
    <priority>${path === "" ? "1.0" : path === "/shop" ? "0.9" : "0.7"}</priority>
  </url>`
    ),
    ...productSlugs.map(
      (slug) => `  <url>
    <loc>${SITE.domain}/product/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
  setResponseHeader(event, "Content-Type", "application/xml");
  return xml;
});

const sitemap_xml$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: sitemap_xml
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
	return {
		body: encodeForwardSlashes(stringify(splitPayload(ssrContext).payload, ssrContext["~payloadReducers"])) ,
		statusCode: getResponseStatus(ssrContext.event),
		statusMessage: getResponseStatusText(ssrContext.event),
		headers: {
			"content-type": "application/json;charset=utf-8" ,
			"x-powered-by": "Nuxt"
		}
	};
}
function renderPayloadJsonScript(opts) {
	const contents = opts.data ? encodeForwardSlashes(stringify(opts.data, opts.ssrContext["~payloadReducers"])) : "";
	const payload = {
		"type": "application/json",
		"innerHTML": contents,
		"data-nuxt-data": appId,
		"data-ssr": !(opts.ssrContext.noSSR)
	};
	{
		payload.id = "__NUXT_DATA__";
	}
	if (opts.src) {
		payload["data-src"] = opts.src;
	}
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}

function encodeForwardSlashes(str) {
	return str.replaceAll("/", "\\u002F");
}
function splitPayload(ssrContext) {
	const { data, prerenderedAt, ...initial } = ssrContext.payload;
	return {
		initial: {
			...initial,
			prerenderedAt
		},
		payload: {
			data,
			prerenderedAt
		}
	};
}

const renderSSRHeadOptions = {"omitLineBreaks":true};

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const PAYLOAD_FILENAME = "_payload.json" ;
const PAYLOAD_BUILD_ID_PARAM = "_b";
const handler = defineRenderHandler((event) => {
	
	const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
	if (ssrError && !("__unenv__" in event.node.req)) {
		throw createError({
			status: 404,
			statusText: "Page Not Found: /__nuxt_error",
			message: "Page Not Found: /__nuxt_error"
		});
	}
	return renderRoute(event, ssrError);
});
async function renderRoute(event, ssrError) {
	const nitroApp = useNitroApp();
	
	const ssrContext = createSSRContext(event);
	
	const headEntryOptions = { mode: "server" };
	ssrContext.head.push(appHead, headEntryOptions);
	if (ssrError) {
		
		const status = ssrError.status || ssrError.statusCode;
		if (status) {
			
			ssrError.status = ssrError.statusCode = Number.parseInt(status);
		}
		if (typeof ssrError.data === "string") {
			try {
				ssrError.data = destr(ssrError.data);
			} catch {}
		}
		setSSRError(ssrContext, ssrError);
	}
	
	const routeOptions = getRouteRules(event);
	if (routeOptions.ssr === false) {
		ssrContext.noSSR = true;
	}
	
	!ssrContext.noSSR && (NUXT_RUNTIME_PAYLOAD_EXTRACTION);
	const isRenderingPayload = (routeOptions.prerender) && PAYLOAD_URL_RE.test(ssrContext.url);
	if (isRenderingPayload) {
		const payloadURL = new URL(ssrContext.url, "http://localhost");
		const url = payloadURL.pathname.slice(0, -`/${PAYLOAD_FILENAME}`.length) || "/";
		payloadURL.searchParams.delete(PAYLOAD_BUILD_ID_PARAM);
		ssrContext.url = url + payloadURL.search;
		event._path = event.node.req.url = ssrContext.url;
	}
	
	const renderer = await getRenderer(ssrContext);
	const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
		
		
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") {
			return {};
		}
		
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	
	
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) {
		
		return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	}
	
	if (ssrContext.payload?.error && !ssrError) {
		throw ssrContext.payload.error;
	}
	
	if (isRenderingPayload) {
		const response = renderPayloadResponse(ssrContext);
		return response;
	}
	const NO_SCRIPTS = routeOptions.noScripts;
	
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	if (ssrContext["~preloadManifest"] && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			fetchpriority: "low",
			crossorigin: "anonymous",
			href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`)
		}] }, {
			...headEntryOptions,
			tagPriority: "low"
		});
	}
	
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	const link = [];
	for (const resource of Object.values(styles)) {
		
		if ("inline" in getQuery(resource.file)) {
			continue;
		}
		
		
		
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) {
		ssrContext.head.push({ link }, headEntryOptions);
	}
	if (!NO_SCRIPTS) {
		
		
		
		const dependencyOptions = ssrContext["~lazyHydratedModules"]?.size ? { exclude: ssrContext["~lazyHydratedModules"] } : undefined;
		const stylesheetHrefs = new Set(link.map((l) => l.href));
		ssrContext.head.push({ link: [...getPreloadLinks(ssrContext, renderer.rendererContext, dependencyOptions), ...getPrefetchLinks(ssrContext, renderer.rendererContext, dependencyOptions)].filter((l) => !stylesheetHrefs.has(l.href)) }, headEntryOptions);
		
		ssrContext.head.push({ script: renderPayloadJsonScript({
			ssrContext,
			data: ssrContext.payload
		})  }, {
			...headEntryOptions,
			
			tagPosition: "bodyClose",
			tagPriority: "high"
		});
	}
	
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			
			
			tagPosition,
			crossorigin: ""
		})) }, headEntryOptions);
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [replaceIslandTeleports(ssrContext, _rendered.html) , APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	
	await nitroApp.hooks.callHook("render:html", htmlContext, { event });
	
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: getResponseStatus(event),
		statusMessage: getResponseStatusText(event),
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
}
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) {
			result.push(chunk);
		}
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) {
		return "";
	}
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return "<!DOCTYPE html>" + `<html${joinAttrs(html.htmlAttrs)}>` + `<head>${joinTags(html.head)}</head>` + `<body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body>` + "</html>";
}

const renderer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handler
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
