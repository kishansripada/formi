import { jsx as A, Fragment as De, jsxs as be } from "react/jsx-runtime";
import { useState as Ne, useEffect as Fe } from "react";
const Xe = (n) => {
   let e;
   return (
      n
         ? (e = n)
         : typeof fetch > "u"
         ? (e = (...t) =>
              Promise.resolve()
                 .then(() => Q)
                 .then(({ default: s }) => s(...t)))
         : (e = fetch),
      (...t) => e(...t)
   );
};
class pe extends Error {
   constructor(e, t = "FunctionsError", s) {
      super(e), (this.name = t), (this.context = s);
   }
}
class Qe extends pe {
   constructor(e) {
      super("Failed to send a request to the Edge Function", "FunctionsFetchError", e);
   }
}
class Ze extends pe {
   constructor(e) {
      super("Relay Error invoking the Edge Function", "FunctionsRelayError", e);
   }
}
class et extends pe {
   constructor(e) {
      super("Edge Function returned a non-2xx status code", "FunctionsHttpError", e);
   }
}
var tt = function (n, e, t, s) {
   function r(i) {
      return i instanceof t
         ? i
         : new t(function (o) {
              o(i);
           });
   }
   return new (t || (t = Promise))(function (i, o) {
      function a(h) {
         try {
            l(s.next(h));
         } catch (u) {
            o(u);
         }
      }
      function c(h) {
         try {
            l(s.throw(h));
         } catch (u) {
            o(u);
         }
      }
      function l(h) {
         h.done ? i(h.value) : r(h.value).then(a, c);
      }
      l((s = s.apply(n, e || [])).next());
   });
};
class st {
   constructor(e, { headers: t = {}, customFetch: s } = {}) {
      (this.url = e), (this.headers = t), (this.fetch = Xe(s));
   }
   /**
    * Updates the authorization header
    * @param token - the new jwt token sent in the authorisation header
    */
   setAuth(e) {
      this.headers.Authorization = `Bearer ${e}`;
   }
   /**
    * Invokes a function
    * @param functionName - The name of the Function to invoke.
    * @param options - Options for invoking the Function.
    */
   invoke(e, t = {}) {
      var s;
      return tt(this, void 0, void 0, function* () {
         try {
            const { headers: r, method: i, body: o } = t;
            let a = {},
               c;
            o &&
               ((r && !Object.prototype.hasOwnProperty.call(r, "Content-Type")) || !r) &&
               ((typeof Blob < "u" && o instanceof Blob) || o instanceof ArrayBuffer
                  ? ((a["Content-Type"] = "application/octet-stream"), (c = o))
                  : typeof o == "string"
                  ? ((a["Content-Type"] = "text/plain"), (c = o))
                  : typeof FormData < "u" && o instanceof FormData
                  ? (c = o)
                  : ((a["Content-Type"] = "application/json"), (c = JSON.stringify(o))));
            const l = yield this.fetch(`${this.url}/${e}`, {
                  method: i || "POST",
                  // headers priority is (high to low):
                  // 1. invoke-level headers
                  // 2. client-level headers
                  // 3. default Content-Type header
                  headers: Object.assign(Object.assign(Object.assign({}, a), this.headers), r),
                  body: c,
               }).catch((f) => {
                  throw new Qe(f);
               }),
               h = l.headers.get("x-relay-error");
            if (h && h === "true") throw new Ze(l);
            if (!l.ok) throw new et(l);
            let u = ((s = l.headers.get("Content-Type")) !== null && s !== void 0 ? s : "text/plain").split(";")[0].trim(),
               d;
            return (
               u === "application/json"
                  ? (d = yield l.json())
                  : u === "application/octet-stream"
                  ? (d = yield l.blob())
                  : u === "multipart/form-data"
                  ? (d = yield l.formData())
                  : (d = yield l.text()),
               { data: d, error: null }
            );
         } catch (r) {
            return { data: null, error: r };
         }
      });
   }
}
var rt = function () {
      if (typeof self < "u") return self;
      if (typeof window < "u") return window;
      if (typeof global < "u") return global;
      throw new Error("unable to locate global object");
   },
   H = rt();
const it = H.fetch,
   _e = H.fetch.bind(H),
   qe = H.Headers,
   nt = H.Request,
   ot = H.Response,
   Q = /* @__PURE__ */ Object.freeze(
      /* @__PURE__ */ Object.defineProperty(
         {
            __proto__: null,
            Headers: qe,
            Request: nt,
            Response: ot,
            default: _e,
            fetch: it,
         },
         Symbol.toStringTag,
         { value: "Module" }
      )
   );
class at extends Error {
   constructor(e) {
      super(e.message), (this.name = "PostgrestError"), (this.details = e.details), (this.hint = e.hint), (this.code = e.code);
   }
}
class ct {
   constructor(e) {
      (this.shouldThrowOnError = !1),
         (this.method = e.method),
         (this.url = e.url),
         (this.headers = e.headers),
         (this.schema = e.schema),
         (this.body = e.body),
         (this.shouldThrowOnError = e.shouldThrowOnError),
         (this.signal = e.signal),
         (this.isMaybeSingle = e.isMaybeSingle),
         e.fetch ? (this.fetch = e.fetch) : typeof fetch > "u" ? (this.fetch = _e) : (this.fetch = fetch);
   }
   /**
    * If there's an error with the query, throwOnError will reject the promise by
    * throwing the error instead of returning it as part of a successful response.
    *
    * {@link https://github.com/supabase/supabase-js/issues/92}
    */
   throwOnError() {
      return (this.shouldThrowOnError = !0), this;
   }
   then(e, t) {
      this.schema === void 0 ||
         (["GET", "HEAD"].includes(this.method) ? (this.headers["Accept-Profile"] = this.schema) : (this.headers["Content-Profile"] = this.schema)),
         this.method !== "GET" && this.method !== "HEAD" && (this.headers["Content-Type"] = "application/json");
      const s = this.fetch;
      let r = s(this.url.toString(), {
         method: this.method,
         headers: this.headers,
         body: JSON.stringify(this.body),
         signal: this.signal,
      }).then(async (i) => {
         var o, a, c;
         let l = null,
            h = null,
            u = null,
            d = i.status,
            f = i.statusText;
         if (i.ok) {
            if (this.method !== "HEAD") {
               const w = await i.text();
               w === "" ||
                  (this.headers.Accept === "text/csv" || (this.headers.Accept && this.headers.Accept.includes("application/vnd.pgrst.plan+text"))
                     ? (h = w)
                     : (h = JSON.parse(w)));
            }
            const g = (o = this.headers.Prefer) === null || o === void 0 ? void 0 : o.match(/count=(exact|planned|estimated)/),
               _ = (a = i.headers.get("content-range")) === null || a === void 0 ? void 0 : a.split("/");
            g && _ && _.length > 1 && (u = parseInt(_[1])),
               this.isMaybeSingle &&
                  this.method === "GET" &&
                  Array.isArray(h) &&
                  (h.length > 1
                     ? ((l = {
                          // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
                          code: "PGRST116",
                          details: `Results contain ${h.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                          hint: null,
                          message: "JSON object requested, multiple (or no) rows returned",
                       }),
                       (h = null),
                       (u = null),
                       (d = 406),
                       (f = "Not Acceptable"))
                     : h.length === 1
                     ? (h = h[0])
                     : (h = null));
         } else {
            const g = await i.text();
            try {
               (l = JSON.parse(g)), Array.isArray(l) && i.status === 404 && ((h = []), (l = null), (d = 200), (f = "OK"));
            } catch {
               i.status === 404 && g === ""
                  ? ((d = 204), (f = "No Content"))
                  : (l = {
                       message: g,
                    });
            }
            if (
               (l &&
                  this.isMaybeSingle &&
                  !((c = l == null ? void 0 : l.details) === null || c === void 0) &&
                  c.includes("0 rows") &&
                  ((l = null), (d = 200), (f = "OK")),
               l && this.shouldThrowOnError)
            )
               throw new at(l);
         }
         return {
            error: l,
            data: h,
            count: u,
            status: d,
            statusText: f,
         };
      });
      return (
         this.shouldThrowOnError ||
            (r = r.catch((i) => {
               var o, a, c;
               return {
                  error: {
                     message: `${(o = i == null ? void 0 : i.name) !== null && o !== void 0 ? o : "FetchError"}: ${i == null ? void 0 : i.message}`,
                     details: `${(a = i == null ? void 0 : i.stack) !== null && a !== void 0 ? a : ""}`,
                     hint: "",
                     code: `${(c = i == null ? void 0 : i.code) !== null && c !== void 0 ? c : ""}`,
                  },
                  data: null,
                  count: null,
                  status: 0,
                  statusText: "",
               };
            })),
         r.then(e, t)
      );
   }
}
class lt extends ct {
   /**
    * Perform a SELECT on the query result.
    *
    * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
    * return modified rows. By calling this method, modified rows are returned in
    * `data`.
    *
    * @param columns - The columns to retrieve, separated by commas
    */
   select(e) {
      let t = !1;
      const s = (e ?? "*")
         .split("")
         .map((r) => (/\s/.test(r) && !t ? "" : (r === '"' && (t = !t), r)))
         .join("");
      return (
         this.url.searchParams.set("select", s),
         this.headers.Prefer && (this.headers.Prefer += ","),
         (this.headers.Prefer += "return=representation"),
         this
      );
   }
   /**
    * Order the query result by `column`.
    *
    * You can call this method multiple times to order by multiple columns.
    *
    * You can order referenced tables, but it only affects the ordering of the
    * parent table if you use `!inner` in the query.
    *
    * @param column - The column to order by
    * @param options - Named parameters
    * @param options.ascending - If `true`, the result will be in ascending order
    * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
    * `null`s appear last.
    * @param options.referencedTable - Set this to order a referenced table by
    * its columns
    * @param options.foreignTable - Deprecated, use `options.referencedTable`
    * instead
    */
   order(e, { ascending: t = !0, nullsFirst: s, foreignTable: r, referencedTable: i = r } = {}) {
      const o = i ? `${i}.order` : "order",
         a = this.url.searchParams.get(o);
      return (
         this.url.searchParams.set(o, `${a ? `${a},` : ""}${e}.${t ? "asc" : "desc"}${s === void 0 ? "" : s ? ".nullsfirst" : ".nullslast"}`), this
      );
   }
   /**
    * Limit the query result by `count`.
    *
    * @param count - The maximum number of rows to return
    * @param options - Named parameters
    * @param options.referencedTable - Set this to limit rows of referenced
    * tables instead of the parent table
    * @param options.foreignTable - Deprecated, use `options.referencedTable`
    * instead
    */
   limit(e, { foreignTable: t, referencedTable: s = t } = {}) {
      const r = typeof s > "u" ? "limit" : `${s}.limit`;
      return this.url.searchParams.set(r, `${e}`), this;
   }
   /**
    * Limit the query result by starting at an offset (`from`) and ending at the offset (`from + to`).
    * Only records within this range are returned.
    * This respects the query order and if there is no order clause the range could behave unexpectedly.
    * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
    * and fourth rows of the query.
    *
    * @param from - The starting index from which to limit the result
    * @param to - The last index to which to limit the result
    * @param options - Named parameters
    * @param options.referencedTable - Set this to limit rows of referenced
    * tables instead of the parent table
    * @param options.foreignTable - Deprecated, use `options.referencedTable`
    * instead
    */
   range(e, t, { foreignTable: s, referencedTable: r = s } = {}) {
      const i = typeof r > "u" ? "offset" : `${r}.offset`,
         o = typeof r > "u" ? "limit" : `${r}.limit`;
      return this.url.searchParams.set(i, `${e}`), this.url.searchParams.set(o, `${t - e + 1}`), this;
   }
   /**
    * Set the AbortSignal for the fetch request.
    *
    * @param signal - The AbortSignal to use for the fetch request
    */
   abortSignal(e) {
      return (this.signal = e), this;
   }
   /**
    * Return `data` as a single object instead of an array of objects.
    *
    * Query result must be one row (e.g. using `.limit(1)`), otherwise this
    * returns an error.
    */
   single() {
      return (this.headers.Accept = "application/vnd.pgrst.object+json"), this;
   }
   /**
    * Return `data` as a single object instead of an array of objects.
    *
    * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
    * this returns an error.
    */
   maybeSingle() {
      return (
         this.method === "GET" ? (this.headers.Accept = "application/json") : (this.headers.Accept = "application/vnd.pgrst.object+json"),
         (this.isMaybeSingle = !0),
         this
      );
   }
   /**
    * Return `data` as a string in CSV format.
    */
   csv() {
      return (this.headers.Accept = "text/csv"), this;
   }
   /**
    * Return `data` as an object in [GeoJSON](https://geojson.org) format.
    */
   geojson() {
      return (this.headers.Accept = "application/geo+json"), this;
   }
   /**
    * Return `data` as the EXPLAIN plan for the query.
    *
    * You need to enable the
    * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
    * setting before using this method.
    *
    * @param options - Named parameters
    *
    * @param options.analyze - If `true`, the query will be executed and the
    * actual run time will be returned
    *
    * @param options.verbose - If `true`, the query identifier will be returned
    * and `data` will include the output columns of the query
    *
    * @param options.settings - If `true`, include information on configuration
    * parameters that affect query planning
    *
    * @param options.buffers - If `true`, include information on buffer usage
    *
    * @param options.wal - If `true`, include information on WAL record generation
    *
    * @param options.format - The format of the output, can be `"text"` (default)
    * or `"json"`
    */
   explain({ analyze: e = !1, verbose: t = !1, settings: s = !1, buffers: r = !1, wal: i = !1, format: o = "text" } = {}) {
      var a;
      const c = [e ? "analyze" : null, t ? "verbose" : null, s ? "settings" : null, r ? "buffers" : null, i ? "wal" : null].filter(Boolean).join("|"),
         l = (a = this.headers.Accept) !== null && a !== void 0 ? a : "application/json";
      return (this.headers.Accept = `application/vnd.pgrst.plan+${o}; for="${l}"; options=${c};`), o === "json" ? this : this;
   }
   /**
    * Rollback the query.
    *
    * `data` will still be returned, but the query is not committed.
    */
   rollback() {
      var e;
      return (
         ((e = this.headers.Prefer) !== null && e !== void 0 ? e : "").trim().length > 0
            ? (this.headers.Prefer += ",tx=rollback")
            : (this.headers.Prefer = "tx=rollback"),
         this
      );
   }
   /**
    * Override the type of the returned `data`.
    *
    * @typeParam NewResult - The new result type to override with
    */
   returns() {
      return this;
   }
}
class z extends lt {
   /**
    * Match only rows where `column` is equal to `value`.
    *
    * To check if the value of `column` is NULL, you should use `.is()` instead.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
   eq(e, t) {
      return this.url.searchParams.append(e, `eq.${t}`), this;
   }
   /**
    * Match only rows where `column` is not equal to `value`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
   neq(e, t) {
      return this.url.searchParams.append(e, `neq.${t}`), this;
   }
   /**
    * Match only rows where `column` is greater than `value`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
   gt(e, t) {
      return this.url.searchParams.append(e, `gt.${t}`), this;
   }
   /**
    * Match only rows where `column` is greater than or equal to `value`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
   gte(e, t) {
      return this.url.searchParams.append(e, `gte.${t}`), this;
   }
   /**
    * Match only rows where `column` is less than `value`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
   lt(e, t) {
      return this.url.searchParams.append(e, `lt.${t}`), this;
   }
   /**
    * Match only rows where `column` is less than or equal to `value`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
   lte(e, t) {
      return this.url.searchParams.append(e, `lte.${t}`), this;
   }
   /**
    * Match only rows where `column` matches `pattern` case-sensitively.
    *
    * @param column - The column to filter on
    * @param pattern - The pattern to match with
    */
   like(e, t) {
      return this.url.searchParams.append(e, `like.${t}`), this;
   }
   /**
    * Match only rows where `column` matches all of `patterns` case-sensitively.
    *
    * @param column - The column to filter on
    * @param patterns - The patterns to match with
    */
   likeAllOf(e, t) {
      return this.url.searchParams.append(e, `like(all).{${t.join(",")}}`), this;
   }
   /**
    * Match only rows where `column` matches any of `patterns` case-sensitively.
    *
    * @param column - The column to filter on
    * @param patterns - The patterns to match with
    */
   likeAnyOf(e, t) {
      return this.url.searchParams.append(e, `like(any).{${t.join(",")}}`), this;
   }
   /**
    * Match only rows where `column` matches `pattern` case-insensitively.
    *
    * @param column - The column to filter on
    * @param pattern - The pattern to match with
    */
   ilike(e, t) {
      return this.url.searchParams.append(e, `ilike.${t}`), this;
   }
   /**
    * Match only rows where `column` matches all of `patterns` case-insensitively.
    *
    * @param column - The column to filter on
    * @param patterns - The patterns to match with
    */
   ilikeAllOf(e, t) {
      return this.url.searchParams.append(e, `ilike(all).{${t.join(",")}}`), this;
   }
   /**
    * Match only rows where `column` matches any of `patterns` case-insensitively.
    *
    * @param column - The column to filter on
    * @param patterns - The patterns to match with
    */
   ilikeAnyOf(e, t) {
      return this.url.searchParams.append(e, `ilike(any).{${t.join(",")}}`), this;
   }
   /**
    * Match only rows where `column` IS `value`.
    *
    * For non-boolean columns, this is only relevant for checking if the value of
    * `column` is NULL by setting `value` to `null`.
    *
    * For boolean columns, you can also set `value` to `true` or `false` and it
    * will behave the same way as `.eq()`.
    *
    * @param column - The column to filter on
    * @param value - The value to filter with
    */
   is(e, t) {
      return this.url.searchParams.append(e, `is.${t}`), this;
   }
   /**
    * Match only rows where `column` is included in the `values` array.
    *
    * @param column - The column to filter on
    * @param values - The values array to filter with
    */
   in(e, t) {
      const s = t.map((r) => (typeof r == "string" && new RegExp("[,()]").test(r) ? `"${r}"` : `${r}`)).join(",");
      return this.url.searchParams.append(e, `in.(${s})`), this;
   }
   /**
    * Only relevant for jsonb, array, and range columns. Match only rows where
    * `column` contains every element appearing in `value`.
    *
    * @param column - The jsonb, array, or range column to filter on
    * @param value - The jsonb, array, or range value to filter with
    */
   contains(e, t) {
      return (
         typeof t == "string"
            ? this.url.searchParams.append(e, `cs.${t}`)
            : Array.isArray(t)
            ? this.url.searchParams.append(e, `cs.{${t.join(",")}}`)
            : this.url.searchParams.append(e, `cs.${JSON.stringify(t)}`),
         this
      );
   }
   /**
    * Only relevant for jsonb, array, and range columns. Match only rows where
    * every element appearing in `column` is contained by `value`.
    *
    * @param column - The jsonb, array, or range column to filter on
    * @param value - The jsonb, array, or range value to filter with
    */
   containedBy(e, t) {
      return (
         typeof t == "string"
            ? this.url.searchParams.append(e, `cd.${t}`)
            : Array.isArray(t)
            ? this.url.searchParams.append(e, `cd.{${t.join(",")}}`)
            : this.url.searchParams.append(e, `cd.${JSON.stringify(t)}`),
         this
      );
   }
   /**
    * Only relevant for range columns. Match only rows where every element in
    * `column` is greater than any element in `range`.
    *
    * @param column - The range column to filter on
    * @param range - The range to filter with
    */
   rangeGt(e, t) {
      return this.url.searchParams.append(e, `sr.${t}`), this;
   }
   /**
    * Only relevant for range columns. Match only rows where every element in
    * `column` is either contained in `range` or greater than any element in
    * `range`.
    *
    * @param column - The range column to filter on
    * @param range - The range to filter with
    */
   rangeGte(e, t) {
      return this.url.searchParams.append(e, `nxl.${t}`), this;
   }
   /**
    * Only relevant for range columns. Match only rows where every element in
    * `column` is less than any element in `range`.
    *
    * @param column - The range column to filter on
    * @param range - The range to filter with
    */
   rangeLt(e, t) {
      return this.url.searchParams.append(e, `sl.${t}`), this;
   }
   /**
    * Only relevant for range columns. Match only rows where every element in
    * `column` is either contained in `range` or less than any element in
    * `range`.
    *
    * @param column - The range column to filter on
    * @param range - The range to filter with
    */
   rangeLte(e, t) {
      return this.url.searchParams.append(e, `nxr.${t}`), this;
   }
   /**
    * Only relevant for range columns. Match only rows where `column` is
    * mutually exclusive to `range` and there can be no element between the two
    * ranges.
    *
    * @param column - The range column to filter on
    * @param range - The range to filter with
    */
   rangeAdjacent(e, t) {
      return this.url.searchParams.append(e, `adj.${t}`), this;
   }
   /**
    * Only relevant for array and range columns. Match only rows where
    * `column` and `value` have an element in common.
    *
    * @param column - The array or range column to filter on
    * @param value - The array or range value to filter with
    */
   overlaps(e, t) {
      return typeof t == "string" ? this.url.searchParams.append(e, `ov.${t}`) : this.url.searchParams.append(e, `ov.{${t.join(",")}}`), this;
   }
   /**
    * Only relevant for text and tsvector columns. Match only rows where
    * `column` matches the query string in `query`.
    *
    * @param column - The text or tsvector column to filter on
    * @param query - The query text to match with
    * @param options - Named parameters
    * @param options.config - The text search configuration to use
    * @param options.type - Change how the `query` text is interpreted
    */
   textSearch(e, t, { config: s, type: r } = {}) {
      let i = "";
      r === "plain" ? (i = "pl") : r === "phrase" ? (i = "ph") : r === "websearch" && (i = "w");
      const o = s === void 0 ? "" : `(${s})`;
      return this.url.searchParams.append(e, `${i}fts${o}.${t}`), this;
   }
   /**
    * Match only rows where each column in `query` keys is equal to its
    * associated value. Shorthand for multiple `.eq()`s.
    *
    * @param query - The object to filter with, with column names as keys mapped
    * to their filter values
    */
   match(e) {
      return (
         Object.entries(e).forEach(([t, s]) => {
            this.url.searchParams.append(t, `eq.${s}`);
         }),
         this
      );
   }
   /**
    * Match only rows which doesn't satisfy the filter.
    *
    * Unlike most filters, `opearator` and `value` are used as-is and need to
    * follow [PostgREST
    * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
    * to make sure they are properly sanitized.
    *
    * @param column - The column to filter on
    * @param operator - The operator to be negated to filter with, following
    * PostgREST syntax
    * @param value - The value to filter with, following PostgREST syntax
    */
   not(e, t, s) {
      return this.url.searchParams.append(e, `not.${t}.${s}`), this;
   }
   /**
    * Match only rows which satisfy at least one of the filters.
    *
    * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
    * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
    * to make sure it's properly sanitized.
    *
    * It's currently not possible to do an `.or()` filter across multiple tables.
    *
    * @param filters - The filters to use, following PostgREST syntax
    * @param options - Named parameters
    * @param options.referencedTable - Set this to filter on referenced tables
    * instead of the parent table
    * @param options.foreignTable - Deprecated, use `referencedTable` instead
    */
   or(e, { foreignTable: t, referencedTable: s = t } = {}) {
      const r = s ? `${s}.or` : "or";
      return this.url.searchParams.append(r, `(${e})`), this;
   }
   /**
    * Match only rows which satisfy the filter. This is an escape hatch - you
    * should use the specific filter methods wherever possible.
    *
    * Unlike most filters, `opearator` and `value` are used as-is and need to
    * follow [PostgREST
    * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
    * to make sure they are properly sanitized.
    *
    * @param column - The column to filter on
    * @param operator - The operator to filter with, following PostgREST syntax
    * @param value - The value to filter with, following PostgREST syntax
    */
   filter(e, t, s) {
      return this.url.searchParams.append(e, `${t}.${s}`), this;
   }
}
class ht {
   constructor(e, { headers: t = {}, schema: s, fetch: r }) {
      (this.url = e), (this.headers = t), (this.schema = s), (this.fetch = r);
   }
   /**
    * Perform a SELECT query on the table or view.
    *
    * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
    *
    * @param options - Named parameters
    *
    * @param options.head - When set to `true`, `data` will not be returned.
    * Useful if you only need the count.
    *
    * @param options.count - Count algorithm to use to count rows in the table or view.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    */
   select(e, { head: t = !1, count: s } = {}) {
      const r = t ? "HEAD" : "GET";
      let i = !1;
      const o = (e ?? "*")
         .split("")
         .map((a) => (/\s/.test(a) && !i ? "" : (a === '"' && (i = !i), a)))
         .join("");
      return (
         this.url.searchParams.set("select", o),
         s && (this.headers.Prefer = `count=${s}`),
         new z({
            method: r,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            fetch: this.fetch,
            allowEmpty: !1,
         })
      );
   }
   /**
    * Perform an INSERT into the table or view.
    *
    * By default, inserted rows are not returned. To return it, chain the call
    * with `.select()`.
    *
    * @param values - The values to insert. Pass an object to insert a single row
    * or an array to insert multiple rows.
    *
    * @param options - Named parameters
    *
    * @param options.count - Count algorithm to use to count inserted rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    *
    * @param options.defaultToNull - Make missing fields default to `null`.
    * Otherwise, use the default value for the column. Only applies for bulk
    * inserts.
    */
   insert(e, { count: t, defaultToNull: s = !0 } = {}) {
      const r = "POST",
         i = [];
      if (
         (this.headers.Prefer && i.push(this.headers.Prefer),
         t && i.push(`count=${t}`),
         s || i.push("missing=default"),
         (this.headers.Prefer = i.join(",")),
         Array.isArray(e))
      ) {
         const o = e.reduce((a, c) => a.concat(Object.keys(c)), []);
         if (o.length > 0) {
            const a = [...new Set(o)].map((c) => `"${c}"`);
            this.url.searchParams.set("columns", a.join(","));
         }
      }
      return new z({
         method: r,
         url: this.url,
         headers: this.headers,
         schema: this.schema,
         body: e,
         fetch: this.fetch,
         allowEmpty: !1,
      });
   }
   /**
    * Perform an UPSERT on the table or view. Depending on the column(s) passed
    * to `onConflict`, `.upsert()` allows you to perform the equivalent of
    * `.insert()` if a row with the corresponding `onConflict` columns doesn't
    * exist, or if it does exist, perform an alternative action depending on
    * `ignoreDuplicates`.
    *
    * By default, upserted rows are not returned. To return it, chain the call
    * with `.select()`.
    *
    * @param values - The values to upsert with. Pass an object to upsert a
    * single row or an array to upsert multiple rows.
    *
    * @param options - Named parameters
    *
    * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
    * duplicate rows are determined. Two rows are duplicates if all the
    * `onConflict` columns are equal.
    *
    * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
    * `false`, duplicate rows are merged with existing rows.
    *
    * @param options.count - Count algorithm to use to count upserted rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    *
    * @param options.defaultToNull - Make missing fields default to `null`.
    * Otherwise, use the default value for the column. This only applies when
    * inserting new rows, not when merging with existing rows under
    * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
    */
   upsert(e, { onConflict: t, ignoreDuplicates: s = !1, count: r, defaultToNull: i = !0 } = {}) {
      const o = "POST",
         a = [`resolution=${s ? "ignore" : "merge"}-duplicates`];
      if (
         (t !== void 0 && this.url.searchParams.set("on_conflict", t),
         this.headers.Prefer && a.push(this.headers.Prefer),
         r && a.push(`count=${r}`),
         i || a.push("missing=default"),
         (this.headers.Prefer = a.join(",")),
         Array.isArray(e))
      ) {
         const c = e.reduce((l, h) => l.concat(Object.keys(h)), []);
         if (c.length > 0) {
            const l = [...new Set(c)].map((h) => `"${h}"`);
            this.url.searchParams.set("columns", l.join(","));
         }
      }
      return new z({
         method: o,
         url: this.url,
         headers: this.headers,
         schema: this.schema,
         body: e,
         fetch: this.fetch,
         allowEmpty: !1,
      });
   }
   /**
    * Perform an UPDATE on the table or view.
    *
    * By default, updated rows are not returned. To return it, chain the call
    * with `.select()` after filters.
    *
    * @param values - The values to update with
    *
    * @param options - Named parameters
    *
    * @param options.count - Count algorithm to use to count updated rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    */
   update(e, { count: t } = {}) {
      const s = "PATCH",
         r = [];
      return (
         this.headers.Prefer && r.push(this.headers.Prefer),
         t && r.push(`count=${t}`),
         (this.headers.Prefer = r.join(",")),
         new z({
            method: s,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            body: e,
            fetch: this.fetch,
            allowEmpty: !1,
         })
      );
   }
   /**
    * Perform a DELETE on the table or view.
    *
    * By default, deleted rows are not returned. To return it, chain the call
    * with `.select()` after filters.
    *
    * @param options - Named parameters
    *
    * @param options.count - Count algorithm to use to count deleted rows.
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    */
   delete({ count: e } = {}) {
      const t = "DELETE",
         s = [];
      return (
         e && s.push(`count=${e}`),
         this.headers.Prefer && s.unshift(this.headers.Prefer),
         (this.headers.Prefer = s.join(",")),
         new z({
            method: t,
            url: this.url,
            headers: this.headers,
            schema: this.schema,
            fetch: this.fetch,
            allowEmpty: !1,
         })
      );
   }
}
const ut = "1.9.2",
   dt = { "X-Client-Info": `postgrest-js/${ut}` };
class ve {
   // TODO: Add back shouldThrowOnError once we figure out the typings
   /**
    * Creates a PostgREST client.
    *
    * @param url - URL of the PostgREST endpoint
    * @param options - Named parameters
    * @param options.headers - Custom headers
    * @param options.schema - Postgres schema to switch to
    * @param options.fetch - Custom fetch
    */
   constructor(e, { headers: t = {}, schema: s, fetch: r } = {}) {
      (this.url = e), (this.headers = Object.assign(Object.assign({}, dt), t)), (this.schemaName = s), (this.fetch = r);
   }
   /**
    * Perform a query on a table or a view.
    *
    * @param relation - The table or view name to query
    */
   from(e) {
      const t = new URL(`${this.url}/${e}`);
      return new ht(t, {
         headers: Object.assign({}, this.headers),
         schema: this.schemaName,
         fetch: this.fetch,
      });
   }
   /**
    * Select a schema to query or perform an function (rpc) call.
    *
    * The schema needs to be on the list of exposed schemas inside Supabase.
    *
    * @param schema - The schema to query
    */
   schema(e) {
      return new ve(this.url, {
         headers: this.headers,
         schema: e,
         fetch: this.fetch,
      });
   }
   /**
    * Perform a function call.
    *
    * @param fn - The function name to call
    * @param args - The arguments to pass to the function call
    * @param options - Named parameters
    * @param options.head - When set to `true`, `data` will not be returned.
    * Useful if you only need the count.
    * @param options.count - Count algorithm to use to count rows returned by the
    * function. Only applicable for [set-returning
    * functions](https://www.postgresql.org/docs/current/functions-srf.html).
    *
    * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
    * hood.
    *
    * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
    * statistics under the hood.
    *
    * `"estimated"`: Uses exact count for low numbers and planned count for high
    * numbers.
    */
   rpc(e, t = {}, { head: s = !1, count: r } = {}) {
      let i;
      const o = new URL(`${this.url}/rpc/${e}`);
      let a;
      s
         ? ((i = "HEAD"),
           Object.entries(t).forEach(([l, h]) => {
              o.searchParams.append(l, `${h}`);
           }))
         : ((i = "POST"), (a = t));
      const c = Object.assign({}, this.headers);
      return (
         r && (c.Prefer = `count=${r}`),
         new z({
            method: i,
            url: o,
            headers: c,
            schema: this.schemaName,
            body: a,
            fetch: this.fetch,
            allowEmpty: !1,
         })
      );
   }
}
const ft = "2.9.3",
   gt = { "X-Client-Info": `realtime-js/${ft}` },
   pt = "1.0.0",
   Me = 1e4,
   _t = 1e3;
var B;
(function (n) {
   (n[(n.connecting = 0)] = "connecting"), (n[(n.open = 1)] = "open"), (n[(n.closing = 2)] = "closing"), (n[(n.closed = 3)] = "closed");
})(B || (B = {}));
var S;
(function (n) {
   (n.closed = "closed"), (n.errored = "errored"), (n.joined = "joined"), (n.joining = "joining"), (n.leaving = "leaving");
})(S || (S = {}));
var j;
(function (n) {
   (n.close = "phx_close"),
      (n.error = "phx_error"),
      (n.join = "phx_join"),
      (n.reply = "phx_reply"),
      (n.leave = "phx_leave"),
      (n.access_token = "access_token");
})(j || (j = {}));
var ue;
(function (n) {
   n.websocket = "websocket";
})(ue || (ue = {}));
var L;
(function (n) {
   (n.Connecting = "connecting"), (n.Open = "open"), (n.Closing = "closing"), (n.Closed = "closed");
})(L || (L = {}));
class ze {
   constructor(e, t) {
      (this.callback = e), (this.timerCalc = t), (this.timer = void 0), (this.tries = 0), (this.callback = e), (this.timerCalc = t);
   }
   reset() {
      (this.tries = 0), clearTimeout(this.timer);
   }
   // Cancels any previous scheduleTimeout and schedules callback
   scheduleTimeout() {
      clearTimeout(this.timer),
         (this.timer = setTimeout(() => {
            (this.tries = this.tries + 1), this.callback();
         }, this.timerCalc(this.tries + 1)));
   }
}
class vt {
   constructor() {
      this.HEADER_LENGTH = 1;
   }
   decode(e, t) {
      return e.constructor === ArrayBuffer ? t(this._binaryDecode(e)) : t(typeof e == "string" ? JSON.parse(e) : {});
   }
   _binaryDecode(e) {
      const t = new DataView(e),
         s = new TextDecoder();
      return this._decodeBroadcast(e, t, s);
   }
   _decodeBroadcast(e, t, s) {
      const r = t.getUint8(1),
         i = t.getUint8(2);
      let o = this.HEADER_LENGTH + 2;
      const a = s.decode(e.slice(o, o + r));
      o = o + r;
      const c = s.decode(e.slice(o, o + i));
      o = o + i;
      const l = JSON.parse(s.decode(e.slice(o, e.byteLength)));
      return { ref: null, topic: a, event: c, payload: l };
   }
}
class ne {
   /**
    * Initializes the Push
    *
    * @param channel The Channel
    * @param event The event, for example `"phx_join"`
    * @param payload The payload, for example `{user_id: 123}`
    * @param timeout The push timeout in milliseconds
    */
   constructor(e, t, s = {}, r = Me) {
      (this.channel = e),
         (this.event = t),
         (this.payload = s),
         (this.timeout = r),
         (this.sent = !1),
         (this.timeoutTimer = void 0),
         (this.ref = ""),
         (this.receivedResp = null),
         (this.recHooks = []),
         (this.refEvent = null);
   }
   resend(e) {
      (this.timeout = e), this._cancelRefEvent(), (this.ref = ""), (this.refEvent = null), (this.receivedResp = null), (this.sent = !1), this.send();
   }
   send() {
      this._hasReceived("timeout") ||
         (this.startTimeout(),
         (this.sent = !0),
         this.channel.socket.push({
            topic: this.channel.topic,
            event: this.event,
            payload: this.payload,
            ref: this.ref,
            join_ref: this.channel._joinRef(),
         }));
   }
   updatePayload(e) {
      this.payload = Object.assign(Object.assign({}, this.payload), e);
   }
   receive(e, t) {
      var s;
      return (
         this._hasReceived(e) && t((s = this.receivedResp) === null || s === void 0 ? void 0 : s.response),
         this.recHooks.push({ status: e, callback: t }),
         this
      );
   }
   startTimeout() {
      if (this.timeoutTimer) return;
      (this.ref = this.channel.socket._makeRef()), (this.refEvent = this.channel._replyEventName(this.ref));
      const e = (t) => {
         this._cancelRefEvent(), this._cancelTimeout(), (this.receivedResp = t), this._matchReceive(t);
      };
      this.channel._on(this.refEvent, {}, e),
         (this.timeoutTimer = setTimeout(() => {
            this.trigger("timeout", {});
         }, this.timeout));
   }
   trigger(e, t) {
      this.refEvent && this.channel._trigger(this.refEvent, { status: e, response: t });
   }
   destroy() {
      this._cancelRefEvent(), this._cancelTimeout();
   }
   _cancelRefEvent() {
      this.refEvent && this.channel._off(this.refEvent, {});
   }
   _cancelTimeout() {
      clearTimeout(this.timeoutTimer), (this.timeoutTimer = void 0);
   }
   _matchReceive({ status: e, response: t }) {
      this.recHooks.filter((s) => s.status === e).forEach((s) => s.callback(t));
   }
   _hasReceived(e) {
      return this.receivedResp && this.receivedResp.status === e;
   }
}
var ke;
(function (n) {
   (n.SYNC = "sync"), (n.JOIN = "join"), (n.LEAVE = "leave");
})(ke || (ke = {}));
class W {
   /**
    * Initializes the Presence.
    *
    * @param channel - The RealtimeChannel
    * @param opts - The options,
    *        for example `{events: {state: 'state', diff: 'diff'}}`
    */
   constructor(e, t) {
      (this.channel = e),
         (this.state = {}),
         (this.pendingDiffs = []),
         (this.joinRef = null),
         (this.caller = {
            onJoin: () => {},
            onLeave: () => {},
            onSync: () => {},
         });
      const s = (t == null ? void 0 : t.events) || {
         state: "presence_state",
         diff: "presence_diff",
      };
      this.channel._on(s.state, {}, (r) => {
         const { onJoin: i, onLeave: o, onSync: a } = this.caller;
         (this.joinRef = this.channel._joinRef()),
            (this.state = W.syncState(this.state, r, i, o)),
            this.pendingDiffs.forEach((c) => {
               this.state = W.syncDiff(this.state, c, i, o);
            }),
            (this.pendingDiffs = []),
            a();
      }),
         this.channel._on(s.diff, {}, (r) => {
            const { onJoin: i, onLeave: o, onSync: a } = this.caller;
            this.inPendingSyncState() ? this.pendingDiffs.push(r) : ((this.state = W.syncDiff(this.state, r, i, o)), a());
         }),
         this.onJoin((r, i, o) => {
            this.channel._trigger("presence", {
               event: "join",
               key: r,
               currentPresences: i,
               newPresences: o,
            });
         }),
         this.onLeave((r, i, o) => {
            this.channel._trigger("presence", {
               event: "leave",
               key: r,
               currentPresences: i,
               leftPresences: o,
            });
         }),
         this.onSync(() => {
            this.channel._trigger("presence", { event: "sync" });
         });
   }
   /**
    * Used to sync the list of presences on the server with the
    * client's state.
    *
    * An optional `onJoin` and `onLeave` callback can be provided to
    * react to changes in the client's local presences across
    * disconnects and reconnects with the server.
    *
    * @internal
    */
   static syncState(e, t, s, r) {
      const i = this.cloneDeep(e),
         o = this.transformState(t),
         a = {},
         c = {};
      return (
         this.map(i, (l, h) => {
            o[l] || (c[l] = h);
         }),
         this.map(o, (l, h) => {
            const u = i[l];
            if (u) {
               const d = h.map((_) => _.presence_ref),
                  f = u.map((_) => _.presence_ref),
                  m = h.filter((_) => f.indexOf(_.presence_ref) < 0),
                  g = u.filter((_) => d.indexOf(_.presence_ref) < 0);
               m.length > 0 && (a[l] = m), g.length > 0 && (c[l] = g);
            } else a[l] = h;
         }),
         this.syncDiff(i, { joins: a, leaves: c }, s, r)
      );
   }
   /**
    * Used to sync a diff of presence join and leave events from the
    * server, as they happen.
    *
    * Like `syncState`, `syncDiff` accepts optional `onJoin` and
    * `onLeave` callbacks to react to a user joining or leaving from a
    * device.
    *
    * @internal
    */
   static syncDiff(e, t, s, r) {
      const { joins: i, leaves: o } = {
         joins: this.transformState(t.joins),
         leaves: this.transformState(t.leaves),
      };
      return (
         s || (s = () => {}),
         r || (r = () => {}),
         this.map(i, (a, c) => {
            var l;
            const h = (l = e[a]) !== null && l !== void 0 ? l : [];
            if (((e[a] = this.cloneDeep(c)), h.length > 0)) {
               const u = e[a].map((f) => f.presence_ref),
                  d = h.filter((f) => u.indexOf(f.presence_ref) < 0);
               e[a].unshift(...d);
            }
            s(a, h, c);
         }),
         this.map(o, (a, c) => {
            let l = e[a];
            if (!l) return;
            const h = c.map((u) => u.presence_ref);
            (l = l.filter((u) => h.indexOf(u.presence_ref) < 0)), (e[a] = l), r(a, l, c), l.length === 0 && delete e[a];
         }),
         e
      );
   }
   /** @internal */
   static map(e, t) {
      return Object.getOwnPropertyNames(e).map((s) => t(s, e[s]));
   }
   /**
    * Remove 'metas' key
    * Change 'phx_ref' to 'presence_ref'
    * Remove 'phx_ref' and 'phx_ref_prev'
    *
    * @example
    * // returns {
    *  abc123: [
    *    { presence_ref: '2', user_id: 1 },
    *    { presence_ref: '3', user_id: 2 }
    *  ]
    * }
    * RealtimePresence.transformState({
    *  abc123: {
    *    metas: [
    *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
    *      { phx_ref: '3', user_id: 2 }
    *    ]
    *  }
    * })
    *
    * @internal
    */
   static transformState(e) {
      return (
         (e = this.cloneDeep(e)),
         Object.getOwnPropertyNames(e).reduce((t, s) => {
            const r = e[s];
            return (
               "metas" in r ? (t[s] = r.metas.map((i) => ((i.presence_ref = i.phx_ref), delete i.phx_ref, delete i.phx_ref_prev, i))) : (t[s] = r), t
            );
         }, {})
      );
   }
   /** @internal */
   static cloneDeep(e) {
      return JSON.parse(JSON.stringify(e));
   }
   /** @internal */
   onJoin(e) {
      this.caller.onJoin = e;
   }
   /** @internal */
   onLeave(e) {
      this.caller.onLeave = e;
   }
   /** @internal */
   onSync(e) {
      this.caller.onSync = e;
   }
   /** @internal */
   inPendingSyncState() {
      return !this.joinRef || this.joinRef !== this.channel._joinRef();
   }
}
var y;
(function (n) {
   (n.abstime = "abstime"),
      (n.bool = "bool"),
      (n.date = "date"),
      (n.daterange = "daterange"),
      (n.float4 = "float4"),
      (n.float8 = "float8"),
      (n.int2 = "int2"),
      (n.int4 = "int4"),
      (n.int4range = "int4range"),
      (n.int8 = "int8"),
      (n.int8range = "int8range"),
      (n.json = "json"),
      (n.jsonb = "jsonb"),
      (n.money = "money"),
      (n.numeric = "numeric"),
      (n.oid = "oid"),
      (n.reltime = "reltime"),
      (n.text = "text"),
      (n.time = "time"),
      (n.timestamp = "timestamp"),
      (n.timestamptz = "timestamptz"),
      (n.timetz = "timetz"),
      (n.tsrange = "tsrange"),
      (n.tstzrange = "tstzrange");
})(y || (y = {}));
const Se = (n, e, t = {}) => {
      var s;
      const r = (s = t.skipTypes) !== null && s !== void 0 ? s : [];
      return Object.keys(e).reduce((i, o) => ((i[o] = mt(o, n, e, r)), i), {});
   },
   mt = (n, e, t, s) => {
      const r = e.find((a) => a.name === n),
         i = r == null ? void 0 : r.type,
         o = t[n];
      return i && !s.includes(i) ? Je(i, o) : de(o);
   },
   Je = (n, e) => {
      if (n.charAt(0) === "_") {
         const t = n.slice(1, n.length);
         return kt(e, t);
      }
      switch (n) {
         case y.bool:
            return yt(e);
         case y.float4:
         case y.float8:
         case y.int2:
         case y.int4:
         case y.int8:
         case y.numeric:
         case y.oid:
            return wt(e);
         case y.json:
         case y.jsonb:
            return bt(e);
         case y.timestamp:
            return St(e);
         case y.abstime:
         case y.date:
         case y.daterange:
         case y.int4range:
         case y.int8range:
         case y.money:
         case y.reltime:
         case y.text:
         case y.time:
         case y.timestamptz:
         case y.timetz:
         case y.tsrange:
         case y.tstzrange:
            return de(e);
         default:
            return de(e);
      }
   },
   de = (n) => n,
   yt = (n) => {
      switch (n) {
         case "t":
            return !0;
         case "f":
            return !1;
         default:
            return n;
      }
   },
   wt = (n) => {
      if (typeof n == "string") {
         const e = parseFloat(n);
         if (!Number.isNaN(e)) return e;
      }
      return n;
   },
   bt = (n) => {
      if (typeof n == "string")
         try {
            return JSON.parse(n);
         } catch (e) {
            return console.log(`JSON parse error: ${e}`), n;
         }
      return n;
   },
   kt = (n, e) => {
      if (typeof n != "string") return n;
      const t = n.length - 1,
         s = n[t];
      if (n[0] === "{" && s === "}") {
         let i;
         const o = n.slice(1, t);
         try {
            i = JSON.parse("[" + o + "]");
         } catch {
            i = o ? o.split(",") : [];
         }
         return i.map((a) => Je(e, a));
      }
      return n;
   },
   St = (n) => (typeof n == "string" ? n.replace(" ", "T") : n);
var Te;
(function (n) {
   (n.ALL = "*"), (n.INSERT = "INSERT"), (n.UPDATE = "UPDATE"), (n.DELETE = "DELETE");
})(Te || (Te = {}));
var Oe;
(function (n) {
   (n.BROADCAST = "broadcast"), (n.PRESENCE = "presence"), (n.POSTGRES_CHANGES = "postgres_changes");
})(Oe || (Oe = {}));
var Ee;
(function (n) {
   (n.SUBSCRIBED = "SUBSCRIBED"), (n.TIMED_OUT = "TIMED_OUT"), (n.CLOSED = "CLOSED"), (n.CHANNEL_ERROR = "CHANNEL_ERROR");
})(Ee || (Ee = {}));
class me {
   constructor(e, t = { config: {} }, s) {
      (this.topic = e),
         (this.params = t),
         (this.socket = s),
         (this.bindings = {}),
         (this.state = S.closed),
         (this.joinedOnce = !1),
         (this.pushBuffer = []),
         (this.subTopic = e.replace(/^realtime:/i, "")),
         (this.params.config = Object.assign(
            {
               broadcast: { ack: !1, self: !1 },
               presence: { key: "" },
            },
            t.config
         )),
         (this.timeout = this.socket.timeout),
         (this.joinPush = new ne(this, j.join, this.params, this.timeout)),
         (this.rejoinTimer = new ze(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs)),
         this.joinPush.receive("ok", () => {
            (this.state = S.joined), this.rejoinTimer.reset(), this.pushBuffer.forEach((r) => r.send()), (this.pushBuffer = []);
         }),
         this._onClose(() => {
            this.rejoinTimer.reset(),
               this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`),
               (this.state = S.closed),
               this.socket._remove(this);
         }),
         this._onError((r) => {
            this._isLeaving() ||
               this._isClosed() ||
               (this.socket.log("channel", `error ${this.topic}`, r), (this.state = S.errored), this.rejoinTimer.scheduleTimeout());
         }),
         this.joinPush.receive("timeout", () => {
            this._isJoining() &&
               (this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout),
               (this.state = S.errored),
               this.rejoinTimer.scheduleTimeout());
         }),
         this._on(j.reply, {}, (r, i) => {
            this._trigger(this._replyEventName(i), r);
         }),
         (this.presence = new W(this)),
         (this.broadcastEndpointURL = this._broadcastEndpointURL());
   }
   /** Subscribe registers your client with the server */
   subscribe(e, t = this.timeout) {
      var s, r;
      if ((this.socket.isConnected() || this.socket.connect(), this.joinedOnce))
         throw "tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance";
      {
         const {
            config: { broadcast: i, presence: o },
         } = this.params;
         this._onError((l) => e && e("CHANNEL_ERROR", l)), this._onClose(() => e && e("CLOSED"));
         const a = {},
            c = {
               broadcast: i,
               presence: o,
               postgres_changes:
                  (r = (s = this.bindings.postgres_changes) === null || s === void 0 ? void 0 : s.map((l) => l.filter)) !== null && r !== void 0
                     ? r
                     : [],
            };
         this.socket.accessToken && (a.access_token = this.socket.accessToken),
            this.updateJoinPayload(Object.assign({ config: c }, a)),
            (this.joinedOnce = !0),
            this._rejoin(t),
            this.joinPush
               .receive("ok", ({ postgres_changes: l }) => {
                  var h;
                  if ((this.socket.accessToken && this.socket.setAuth(this.socket.accessToken), l === void 0)) {
                     e && e("SUBSCRIBED");
                     return;
                  } else {
                     const u = this.bindings.postgres_changes,
                        d = (h = u == null ? void 0 : u.length) !== null && h !== void 0 ? h : 0,
                        f = [];
                     for (let m = 0; m < d; m++) {
                        const g = u[m],
                           {
                              filter: { event: _, schema: w, table: O, filter: $ },
                           } = g,
                           b = l && l[m];
                        if (b && b.event === _ && b.schema === w && b.table === O && b.filter === $)
                           f.push(Object.assign(Object.assign({}, g), { id: b.id }));
                        else {
                           this.unsubscribe(), e && e("CHANNEL_ERROR", new Error("mismatch between server and client bindings for postgres changes"));
                           return;
                        }
                     }
                     (this.bindings.postgres_changes = f), e && e("SUBSCRIBED");
                     return;
                  }
               })
               .receive("error", (l) => {
                  e && e("CHANNEL_ERROR", new Error(JSON.stringify(Object.values(l).join(", ") || "error")));
               })
               .receive("timeout", () => {
                  e && e("TIMED_OUT");
               });
      }
      return this;
   }
   presenceState() {
      return this.presence.state;
   }
   async track(e, t = {}) {
      return await this.send(
         {
            type: "presence",
            event: "track",
            payload: e,
         },
         t.timeout || this.timeout
      );
   }
   async untrack(e = {}) {
      return await this.send(
         {
            type: "presence",
            event: "untrack",
         },
         e
      );
   }
   on(e, t, s) {
      return this._on(e, t, s);
   }
   /**
    * Sends a message into the channel.
    *
    * @param args Arguments to send to channel
    * @param args.type The type of event to send
    * @param args.event The name of the event being sent
    * @param args.payload Payload to be sent
    * @param opts Options to be used during the send process
    */
   async send(e, t = {}) {
      var s, r;
      if (!this._canPush() && e.type === "broadcast") {
         const { event: i, payload: o } = e,
            a = {
               method: "POST",
               headers: {
                  apikey: (s = this.socket.apiKey) !== null && s !== void 0 ? s : "",
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({
                  messages: [{ topic: this.subTopic, event: i, payload: o }],
               }),
            };
         try {
            return (await this._fetchWithTimeout(this.broadcastEndpointURL, a, (r = t.timeout) !== null && r !== void 0 ? r : this.timeout)).ok
               ? "ok"
               : "error";
         } catch (c) {
            return c.name === "AbortError" ? "timed out" : "error";
         }
      } else
         return new Promise((i) => {
            var o, a, c;
            const l = this._push(e.type, e, t.timeout || this.timeout);
            e.type === "broadcast" &&
               !(
                  !(
                     (c = (a = (o = this.params) === null || o === void 0 ? void 0 : o.config) === null || a === void 0 ? void 0 : a.broadcast) ===
                        null || c === void 0
                  ) && c.ack
               ) &&
               i("ok"),
               l.receive("ok", () => i("ok")),
               l.receive("timeout", () => i("timed out"));
         });
   }
   updateJoinPayload(e) {
      this.joinPush.updatePayload(e);
   }
   /**
    * Leaves the channel.
    *
    * Unsubscribes from server events, and instructs channel to terminate on server.
    * Triggers onClose() hooks.
    *
    * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
    * channel.unsubscribe().receive("ok", () => alert("left!") )
    */
   unsubscribe(e = this.timeout) {
      this.state = S.leaving;
      const t = () => {
         this.socket.log("channel", `leave ${this.topic}`), this._trigger(j.close, "leave", this._joinRef());
      };
      return (
         this.rejoinTimer.reset(),
         this.joinPush.destroy(),
         new Promise((s) => {
            const r = new ne(this, j.leave, {}, e);
            r
               .receive("ok", () => {
                  t(), s("ok");
               })
               .receive("timeout", () => {
                  t(), s("timed out");
               })
               .receive("error", () => {
                  s("error");
               }),
               r.send(),
               this._canPush() || r.trigger("ok", {});
         })
      );
   }
   /** @internal */
   _broadcastEndpointURL() {
      let e = this.socket.endPoint;
      return (
         (e = e.replace(/^ws/i, "http")),
         (e = e.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, "")),
         e.replace(/\/+$/, "") + "/api/broadcast"
      );
   }
   async _fetchWithTimeout(e, t, s) {
      const r = new AbortController(),
         i = setTimeout(() => r.abort(), s),
         o = await this.socket.fetch(e, Object.assign(Object.assign({}, t), { signal: r.signal }));
      return clearTimeout(i), o;
   }
   /** @internal */
   _push(e, t, s = this.timeout) {
      if (!this.joinedOnce) throw `tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
      let r = new ne(this, e, t, s);
      return this._canPush() ? r.send() : (r.startTimeout(), this.pushBuffer.push(r)), r;
   }
   /**
    * Overridable message hook
    *
    * Receives all events for specialized message handling before dispatching to the channel callbacks.
    * Must return the payload, modified or unmodified.
    *
    * @internal
    */
   _onMessage(e, t, s) {
      return t;
   }
   /** @internal */
   _isMember(e) {
      return this.topic === e;
   }
   /** @internal */
   _joinRef() {
      return this.joinPush.ref;
   }
   /** @internal */
   _trigger(e, t, s) {
      var r, i;
      const o = e.toLocaleLowerCase(),
         { close: a, error: c, leave: l, join: h } = j;
      if (s && [a, c, l, h].indexOf(o) >= 0 && s !== this._joinRef()) return;
      let d = this._onMessage(o, t, s);
      if (t && !d) throw "channel onMessage callbacks must return the payload, modified or unmodified";
      ["insert", "update", "delete"].includes(o)
         ? (r = this.bindings.postgres_changes) === null ||
           r === void 0 ||
           r
              .filter((f) => {
                 var m, g, _;
                 return (
                    ((m = f.filter) === null || m === void 0 ? void 0 : m.event) === "*" ||
                    ((_ = (g = f.filter) === null || g === void 0 ? void 0 : g.event) === null || _ === void 0 ? void 0 : _.toLocaleLowerCase()) === o
                 );
              })
              .map((f) => f.callback(d, s))
         : (i = this.bindings[o]) === null ||
           i === void 0 ||
           i
              .filter((f) => {
                 var m, g, _, w, O, $;
                 if (["broadcast", "presence", "postgres_changes"].includes(o))
                    if ("id" in f) {
                       const b = f.id,
                          Z = (m = f.filter) === null || m === void 0 ? void 0 : m.event;
                       return (
                          b &&
                          ((g = t.ids) === null || g === void 0 ? void 0 : g.includes(b)) &&
                          (Z === "*" ||
                             (Z == null ? void 0 : Z.toLocaleLowerCase()) ===
                                ((_ = t.data) === null || _ === void 0 ? void 0 : _.type.toLocaleLowerCase()))
                       );
                    } else {
                       const b =
                          (O = (w = f == null ? void 0 : f.filter) === null || w === void 0 ? void 0 : w.event) === null || O === void 0
                             ? void 0
                             : O.toLocaleLowerCase();
                       return b === "*" || b === (($ = t == null ? void 0 : t.event) === null || $ === void 0 ? void 0 : $.toLocaleLowerCase());
                    }
                 else return f.type.toLocaleLowerCase() === o;
              })
              .map((f) => {
                 if (typeof d == "object" && "ids" in d) {
                    const m = d.data,
                       { schema: g, table: _, commit_timestamp: w, type: O, errors: $ } = m;
                    d = Object.assign(
                       Object.assign(
                          {},
                          {
                             schema: g,
                             table: _,
                             commit_timestamp: w,
                             eventType: O,
                             new: {},
                             old: {},
                             errors: $,
                          }
                       ),
                       this._getPayloadRecords(m)
                    );
                 }
                 f.callback(d, s);
              });
   }
   /** @internal */
   _isClosed() {
      return this.state === S.closed;
   }
   /** @internal */
   _isJoined() {
      return this.state === S.joined;
   }
   /** @internal */
   _isJoining() {
      return this.state === S.joining;
   }
   /** @internal */
   _isLeaving() {
      return this.state === S.leaving;
   }
   /** @internal */
   _replyEventName(e) {
      return `chan_reply_${e}`;
   }
   /** @internal */
   _on(e, t, s) {
      const r = e.toLocaleLowerCase(),
         i = {
            type: r,
            filter: t,
            callback: s,
         };
      return this.bindings[r] ? this.bindings[r].push(i) : (this.bindings[r] = [i]), this;
   }
   /** @internal */
   _off(e, t) {
      const s = e.toLocaleLowerCase();
      return (
         (this.bindings[s] = this.bindings[s].filter((r) => {
            var i;
            return !(((i = r.type) === null || i === void 0 ? void 0 : i.toLocaleLowerCase()) === s && me.isEqual(r.filter, t));
         })),
         this
      );
   }
   /** @internal */
   static isEqual(e, t) {
      if (Object.keys(e).length !== Object.keys(t).length) return !1;
      for (const s in e) if (e[s] !== t[s]) return !1;
      return !0;
   }
   /** @internal */
   _rejoinUntilConnected() {
      this.rejoinTimer.scheduleTimeout(), this.socket.isConnected() && this._rejoin();
   }
   /**
    * Registers a callback that will be executed when the channel closes.
    *
    * @internal
    */
   _onClose(e) {
      this._on(j.close, {}, e);
   }
   /**
    * Registers a callback that will be executed when the channel encounteres an error.
    *
    * @internal
    */
   _onError(e) {
      this._on(j.error, {}, (t) => e(t));
   }
   /**
    * Returns `true` if the socket is connected and the channel has been joined.
    *
    * @internal
    */
   _canPush() {
      return this.socket.isConnected() && this._isJoined();
   }
   /** @internal */
   _rejoin(e = this.timeout) {
      this._isLeaving() || (this.socket._leaveOpenTopic(this.topic), (this.state = S.joining), this.joinPush.resend(e));
   }
   /** @internal */
   _getPayloadRecords(e) {
      const t = {
         new: {},
         old: {},
      };
      return (
         (e.type === "INSERT" || e.type === "UPDATE") && (t.new = Se(e.columns, e.record)),
         (e.type === "UPDATE" || e.type === "DELETE") && (t.old = Se(e.columns, e.old_record)),
         t
      );
   }
}
const Tt = () => {},
   Ot = typeof WebSocket < "u";
class Et {
   /**
    * Initializes the Socket.
    *
    * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
    * @param options.transport The Websocket Transport, for example WebSocket.
    * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
    * @param options.params The optional params to pass when connecting.
    * @param options.headers The optional headers to pass when connecting.
    * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
    * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
    * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
    * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
    * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
    */
   constructor(e, t) {
      var s;
      (this.accessToken = null),
         (this.apiKey = null),
         (this.channels = []),
         (this.endPoint = ""),
         (this.headers = gt),
         (this.params = {}),
         (this.timeout = Me),
         (this.heartbeatIntervalMs = 3e4),
         (this.heartbeatTimer = void 0),
         (this.pendingHeartbeatRef = null),
         (this.ref = 0),
         (this.logger = Tt),
         (this.conn = null),
         (this.sendBuffer = []),
         (this.serializer = new vt()),
         (this.stateChangeCallbacks = {
            open: [],
            close: [],
            error: [],
            message: [],
         }),
         (this._resolveFetch = (i) => {
            let o;
            return (
               i
                  ? (o = i)
                  : typeof fetch > "u"
                  ? (o = (...a) =>
                       Promise.resolve()
                          .then(() => Q)
                          .then(({ default: c }) => c(...a)))
                  : (o = fetch),
               (...a) => o(...a)
            );
         }),
         (this.endPoint = `${e}/${ue.websocket}`),
         t != null && t.transport ? (this.transport = t.transport) : (this.transport = null),
         t != null && t.params && (this.params = t.params),
         t != null && t.headers && (this.headers = Object.assign(Object.assign({}, this.headers), t.headers)),
         t != null && t.timeout && (this.timeout = t.timeout),
         t != null && t.logger && (this.logger = t.logger),
         t != null && t.heartbeatIntervalMs && (this.heartbeatIntervalMs = t.heartbeatIntervalMs);
      const r = (s = t == null ? void 0 : t.params) === null || s === void 0 ? void 0 : s.apikey;
      r && ((this.accessToken = r), (this.apiKey = r)),
         (this.reconnectAfterMs = t != null && t.reconnectAfterMs ? t.reconnectAfterMs : (i) => [1e3, 2e3, 5e3, 1e4][i - 1] || 1e4),
         (this.encode = t != null && t.encode ? t.encode : (i, o) => o(JSON.stringify(i))),
         (this.decode = t != null && t.decode ? t.decode : this.serializer.decode.bind(this.serializer)),
         (this.reconnectTimer = new ze(async () => {
            this.disconnect(), this.connect();
         }, this.reconnectAfterMs)),
         (this.fetch = this._resolveFetch(t == null ? void 0 : t.fetch));
   }
   /**
    * Connects the socket, unless already connected.
    */
   connect() {
      if (!this.conn) {
         if (this.transport) {
            this.conn = new this.transport(this._endPointURL(), void 0, {
               headers: this.headers,
            });
            return;
         }
         if (Ot) {
            (this.conn = new WebSocket(this._endPointURL())), this.setupConnection();
            return;
         }
         (this.conn = new jt(this._endPointURL(), void 0, {
            close: () => {
               this.conn = null;
            },
         })),
            import("./browser-VE8b5Mrx.js")
               .then((e) => e.b)
               .then(({ default: e }) => {
                  (this.conn = new e(this._endPointURL(), void 0, {
                     headers: this.headers,
                  })),
                     this.setupConnection();
               });
      }
   }
   /**
    * Disconnects the socket.
    *
    * @param code A numeric status code to send on disconnect.
    * @param reason A custom reason for the disconnect.
    */
   disconnect(e, t) {
      this.conn &&
         ((this.conn.onclose = function () {}),
         e ? this.conn.close(e, t ?? "") : this.conn.close(),
         (this.conn = null),
         this.heartbeatTimer && clearInterval(this.heartbeatTimer),
         this.reconnectTimer.reset());
   }
   /**
    * Returns all created channels
    */
   getChannels() {
      return this.channels;
   }
   /**
    * Unsubscribes and removes a single channel
    * @param channel A RealtimeChannel instance
    */
   async removeChannel(e) {
      const t = await e.unsubscribe();
      return this.channels.length === 0 && this.disconnect(), t;
   }
   /**
    * Unsubscribes and removes all channels
    */
   async removeAllChannels() {
      const e = await Promise.all(this.channels.map((t) => t.unsubscribe()));
      return this.disconnect(), e;
   }
   /**
    * Logs the message.
    *
    * For customized logging, `this.logger` can be overridden.
    */
   log(e, t, s) {
      this.logger(e, t, s);
   }
   /**
    * Returns the current state of the socket.
    */
   connectionState() {
      switch (this.conn && this.conn.readyState) {
         case B.connecting:
            return L.Connecting;
         case B.open:
            return L.Open;
         case B.closing:
            return L.Closing;
         default:
            return L.Closed;
      }
   }
   /**
    * Returns `true` is the connection is open.
    */
   isConnected() {
      return this.connectionState() === L.Open;
   }
   channel(e, t = { config: {} }) {
      const s = new me(`realtime:${e}`, t, this);
      return this.channels.push(s), s;
   }
   /**
    * Push out a message if the socket is connected.
    *
    * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
    */
   push(e) {
      const { topic: t, event: s, payload: r, ref: i } = e,
         o = () => {
            this.encode(e, (a) => {
               var c;
               (c = this.conn) === null || c === void 0 || c.send(a);
            });
         };
      this.log("push", `${t} ${s} (${i})`, r), this.isConnected() ? o() : this.sendBuffer.push(o);
   }
   /**
    * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
    *
    * @param token A JWT string.
    */
   setAuth(e) {
      (this.accessToken = e),
         this.channels.forEach((t) => {
            e && t.updateJoinPayload({ access_token: e }), t.joinedOnce && t._isJoined() && t._push(j.access_token, { access_token: e });
         });
   }
   /**
    * Return the next message ref, accounting for overflows
    *
    * @internal
    */
   _makeRef() {
      let e = this.ref + 1;
      return e === this.ref ? (this.ref = 0) : (this.ref = e), this.ref.toString();
   }
   /**
    * Unsubscribe from channels with the specified topic.
    *
    * @internal
    */
   _leaveOpenTopic(e) {
      let t = this.channels.find((s) => s.topic === e && (s._isJoined() || s._isJoining()));
      t && (this.log("transport", `leaving duplicate topic "${e}"`), t.unsubscribe());
   }
   /**
    * Removes a subscription from the socket.
    *
    * @param channel An open subscription.
    *
    * @internal
    */
   _remove(e) {
      this.channels = this.channels.filter((t) => t._joinRef() !== e._joinRef());
   }
   /**
    * Sets up connection handlers.
    *
    * @internal
    */
   setupConnection() {
      this.conn &&
         ((this.conn.binaryType = "arraybuffer"),
         (this.conn.onopen = () => this._onConnOpen()),
         (this.conn.onerror = (e) => this._onConnError(e)),
         (this.conn.onmessage = (e) => this._onConnMessage(e)),
         (this.conn.onclose = (e) => this._onConnClose(e)));
   }
   /**
    * Returns the URL of the websocket.
    *
    * @internal
    */
   _endPointURL() {
      return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: pt }));
   }
   /** @internal */
   _onConnMessage(e) {
      this.decode(e.data, (t) => {
         let { topic: s, event: r, payload: i, ref: o } = t;
         ((o && o === this.pendingHeartbeatRef) || r === (i == null ? void 0 : i.type)) && (this.pendingHeartbeatRef = null),
            this.log("receive", `${i.status || ""} ${s} ${r} ${(o && "(" + o + ")") || ""}`, i),
            this.channels.filter((a) => a._isMember(s)).forEach((a) => a._trigger(r, i, o)),
            this.stateChangeCallbacks.message.forEach((a) => a(t));
      });
   }
   /** @internal */
   _onConnOpen() {
      this.log("transport", `connected to ${this._endPointURL()}`),
         this._flushSendBuffer(),
         this.reconnectTimer.reset(),
         this.heartbeatTimer && clearInterval(this.heartbeatTimer),
         (this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs)),
         this.stateChangeCallbacks.open.forEach((e) => e());
   }
   /** @internal */
   _onConnClose(e) {
      this.log("transport", "close", e),
         this._triggerChanError(),
         this.heartbeatTimer && clearInterval(this.heartbeatTimer),
         this.reconnectTimer.scheduleTimeout(),
         this.stateChangeCallbacks.close.forEach((t) => t(e));
   }
   /** @internal */
   _onConnError(e) {
      this.log("transport", e.message), this._triggerChanError(), this.stateChangeCallbacks.error.forEach((t) => t(e));
   }
   /** @internal */
   _triggerChanError() {
      this.channels.forEach((e) => e._trigger(j.error));
   }
   /** @internal */
   _appendParams(e, t) {
      if (Object.keys(t).length === 0) return e;
      const s = e.match(/\?/) ? "&" : "?",
         r = new URLSearchParams(t);
      return `${e}${s}${r}`;
   }
   /** @internal */
   _flushSendBuffer() {
      this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((e) => e()), (this.sendBuffer = []));
   }
   /** @internal */
   _sendHeartbeat() {
      var e;
      if (this.isConnected()) {
         if (this.pendingHeartbeatRef) {
            (this.pendingHeartbeatRef = null),
               this.log("transport", "heartbeat timeout. Attempting to re-establish connection"),
               (e = this.conn) === null || e === void 0 || e.close(_t, "hearbeat timeout");
            return;
         }
         (this.pendingHeartbeatRef = this._makeRef()),
            this.push({
               topic: "phoenix",
               event: "heartbeat",
               payload: {},
               ref: this.pendingHeartbeatRef,
            }),
            this.setAuth(this.accessToken);
      }
   }
}
class jt {
   constructor(e, t, s) {
      (this.binaryType = "arraybuffer"),
         (this.onclose = () => {}),
         (this.onerror = () => {}),
         (this.onmessage = () => {}),
         (this.onopen = () => {}),
         (this.readyState = B.connecting),
         (this.send = () => {}),
         (this.url = null),
         (this.url = e),
         (this.close = s.close);
   }
}
class ye extends Error {
   constructor(e) {
      super(e), (this.__isStorageError = !0), (this.name = "StorageError");
   }
}
function k(n) {
   return typeof n == "object" && n !== null && "__isStorageError" in n;
}
class $t extends ye {
   constructor(e, t) {
      super(e), (this.name = "StorageApiError"), (this.status = t);
   }
   toJSON() {
      return {
         name: this.name,
         message: this.message,
         status: this.status,
      };
   }
}
class je extends ye {
   constructor(e, t) {
      super(e), (this.name = "StorageUnknownError"), (this.originalError = t);
   }
}
var At = function (n, e, t, s) {
   function r(i) {
      return i instanceof t
         ? i
         : new t(function (o) {
              o(i);
           });
   }
   return new (t || (t = Promise))(function (i, o) {
      function a(h) {
         try {
            l(s.next(h));
         } catch (u) {
            o(u);
         }
      }
      function c(h) {
         try {
            l(s.throw(h));
         } catch (u) {
            o(u);
         }
      }
      function l(h) {
         h.done ? i(h.value) : r(h.value).then(a, c);
      }
      l((s = s.apply(n, e || [])).next());
   });
};
const Be = (n) => {
      let e;
      return (
         n
            ? (e = n)
            : typeof fetch > "u"
            ? (e = (...t) =>
                 Promise.resolve()
                    .then(() => Q)
                    .then(({ default: s }) => s(...t)))
            : (e = fetch),
         (...t) => e(...t)
      );
   },
   Rt = () =>
      At(void 0, void 0, void 0, function* () {
         return typeof Response > "u" ? (yield Promise.resolve().then(() => Q)).Response : Response;
      });
var K = function (n, e, t, s) {
   function r(i) {
      return i instanceof t
         ? i
         : new t(function (o) {
              o(i);
           });
   }
   return new (t || (t = Promise))(function (i, o) {
      function a(h) {
         try {
            l(s.next(h));
         } catch (u) {
            o(u);
         }
      }
      function c(h) {
         try {
            l(s.throw(h));
         } catch (u) {
            o(u);
         }
      }
      function l(h) {
         h.done ? i(h.value) : r(h.value).then(a, c);
      }
      l((s = s.apply(n, e || [])).next());
   });
};
const oe = (n) => n.msg || n.message || n.error_description || n.error || JSON.stringify(n),
   Pt = (n, e) =>
      K(void 0, void 0, void 0, function* () {
         const t = yield Rt();
         n instanceof t
            ? n
                 .json()
                 .then((s) => {
                    e(new $t(oe(s), n.status || 500));
                 })
                 .catch((s) => {
                    e(new je(oe(s), s));
                 })
            : e(new je(oe(n), n));
      }),
   xt = (n, e, t, s) => {
      const r = { method: n, headers: (e == null ? void 0 : e.headers) || {} };
      return n === "GET"
         ? r
         : ((r.headers = Object.assign({ "Content-Type": "application/json" }, e == null ? void 0 : e.headers)),
           (r.body = JSON.stringify(s)),
           Object.assign(Object.assign({}, r), t));
   };
function re(n, e, t, s, r, i) {
   return K(this, void 0, void 0, function* () {
      return new Promise((o, a) => {
         n(t, xt(e, s, r, i))
            .then((c) => {
               if (!c.ok) throw c;
               return s != null && s.noResolveJson ? c : c.json();
            })
            .then((c) => o(c))
            .catch((c) => Pt(c, a));
      });
   });
}
function fe(n, e, t, s) {
   return K(this, void 0, void 0, function* () {
      return re(n, "GET", e, t, s);
   });
}
function R(n, e, t, s, r) {
   return K(this, void 0, void 0, function* () {
      return re(n, "POST", e, s, r, t);
   });
}
function It(n, e, t, s, r) {
   return K(this, void 0, void 0, function* () {
      return re(n, "PUT", e, s, r, t);
   });
}
function He(n, e, t, s, r) {
   return K(this, void 0, void 0, function* () {
      return re(n, "DELETE", e, s, r, t);
   });
}
var T = function (n, e, t, s) {
   function r(i) {
      return i instanceof t
         ? i
         : new t(function (o) {
              o(i);
           });
   }
   return new (t || (t = Promise))(function (i, o) {
      function a(h) {
         try {
            l(s.next(h));
         } catch (u) {
            o(u);
         }
      }
      function c(h) {
         try {
            l(s.throw(h));
         } catch (u) {
            o(u);
         }
      }
      function l(h) {
         h.done ? i(h.value) : r(h.value).then(a, c);
      }
      l((s = s.apply(n, e || [])).next());
   });
};
const Ct = {
      limit: 100,
      offset: 0,
      sortBy: {
         column: "name",
         order: "asc",
      },
   },
   $e = {
      cacheControl: "3600",
      contentType: "text/plain;charset=UTF-8",
      upsert: !1,
   };
class Lt {
   constructor(e, t = {}, s, r) {
      (this.url = e), (this.headers = t), (this.bucketId = s), (this.fetch = Be(r));
   }
   /**
    * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
    *
    * @param method HTTP method.
    * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
    * @param fileBody The body of the file to be stored in the bucket.
    */
   uploadOrUpdate(e, t, s, r) {
      return T(this, void 0, void 0, function* () {
         try {
            let i;
            const o = Object.assign(Object.assign({}, $e), r),
               a = Object.assign(Object.assign({}, this.headers), e === "POST" && { "x-upsert": String(o.upsert) });
            typeof Blob < "u" && s instanceof Blob
               ? ((i = new FormData()), i.append("cacheControl", o.cacheControl), i.append("", s))
               : typeof FormData < "u" && s instanceof FormData
               ? ((i = s), i.append("cacheControl", o.cacheControl))
               : ((i = s), (a["cache-control"] = `max-age=${o.cacheControl}`), (a["content-type"] = o.contentType));
            const c = this._removeEmptyFolders(t),
               l = this._getFinalPath(c),
               h = yield this.fetch(
                  `${this.url}/object/${l}`,
                  Object.assign({ method: e, body: i, headers: a }, o != null && o.duplex ? { duplex: o.duplex } : {})
               ),
               u = yield h.json();
            return h.ok
               ? {
                    data: { path: c, id: u.Id, fullPath: u.Key },
                    error: null,
                 }
               : { data: null, error: u };
         } catch (i) {
            if (k(i)) return { data: null, error: i };
            throw i;
         }
      });
   }
   /**
    * Uploads a file to an existing bucket.
    *
    * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
    * @param fileBody The body of the file to be stored in the bucket.
    */
   upload(e, t, s) {
      return T(this, void 0, void 0, function* () {
         return this.uploadOrUpdate("POST", e, t, s);
      });
   }
   /**
    * Upload a file with a token generated from `createSignedUploadUrl`.
    * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
    * @param token The token generated from `createSignedUploadUrl`
    * @param fileBody The body of the file to be stored in the bucket.
    */
   uploadToSignedUrl(e, t, s, r) {
      return T(this, void 0, void 0, function* () {
         const i = this._removeEmptyFolders(e),
            o = this._getFinalPath(i),
            a = new URL(this.url + `/object/upload/sign/${o}`);
         a.searchParams.set("token", t);
         try {
            let c;
            const l = Object.assign({ upsert: $e.upsert }, r),
               h = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(l.upsert) });
            typeof Blob < "u" && s instanceof Blob
               ? ((c = new FormData()), c.append("cacheControl", l.cacheControl), c.append("", s))
               : typeof FormData < "u" && s instanceof FormData
               ? ((c = s), c.append("cacheControl", l.cacheControl))
               : ((c = s), (h["cache-control"] = `max-age=${l.cacheControl}`), (h["content-type"] = l.contentType));
            const u = yield this.fetch(a.toString(), {
                  method: "PUT",
                  body: c,
                  headers: h,
               }),
               d = yield u.json();
            return u.ok
               ? {
                    data: { path: i, fullPath: d.Key },
                    error: null,
                 }
               : { data: null, error: d };
         } catch (c) {
            if (k(c)) return { data: null, error: c };
            throw c;
         }
      });
   }
   /**
    * Creates a signed upload URL.
    * Signed upload URLs can be used to upload files to the bucket without further authentication.
    * They are valid for 2 hours.
    * @param path The file path, including the current file name. For example `folder/image.png`.
    */
   createSignedUploadUrl(e) {
      return T(this, void 0, void 0, function* () {
         try {
            let t = this._getFinalPath(e);
            const s = yield R(this.fetch, `${this.url}/object/upload/sign/${t}`, {}, { headers: this.headers }),
               r = new URL(this.url + s.url),
               i = r.searchParams.get("token");
            if (!i) throw new ye("No token returned by API");
            return { data: { signedUrl: r.toString(), path: e, token: i }, error: null };
         } catch (t) {
            if (k(t)) return { data: null, error: t };
            throw t;
         }
      });
   }
   /**
    * Replaces an existing file at the specified path with a new one.
    *
    * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
    * @param fileBody The body of the file to be stored in the bucket.
    */
   update(e, t, s) {
      return T(this, void 0, void 0, function* () {
         return this.uploadOrUpdate("PUT", e, t, s);
      });
   }
   /**
    * Moves an existing file to a new path in the same bucket.
    *
    * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
    * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
    */
   move(e, t) {
      return T(this, void 0, void 0, function* () {
         try {
            return {
               data: yield R(
                  this.fetch,
                  `${this.url}/object/move`,
                  { bucketId: this.bucketId, sourceKey: e, destinationKey: t },
                  { headers: this.headers }
               ),
               error: null,
            };
         } catch (s) {
            if (k(s)) return { data: null, error: s };
            throw s;
         }
      });
   }
   /**
    * Copies an existing file to a new path in the same bucket.
    *
    * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
    * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
    */
   copy(e, t) {
      return T(this, void 0, void 0, function* () {
         try {
            return {
               data: {
                  path: (yield R(
                     this.fetch,
                     `${this.url}/object/copy`,
                     { bucketId: this.bucketId, sourceKey: e, destinationKey: t },
                     { headers: this.headers }
                  )).Key,
               },
               error: null,
            };
         } catch (s) {
            if (k(s)) return { data: null, error: s };
            throw s;
         }
      });
   }
   /**
    * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
    *
    * @param path The file path, including the current file name. For example `folder/image.png`.
    * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
    * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
    * @param options.transform Transform the asset before serving it to the client.
    */
   createSignedUrl(e, t, s) {
      return T(this, void 0, void 0, function* () {
         try {
            let r = this._getFinalPath(e),
               i = yield R(
                  this.fetch,
                  `${this.url}/object/sign/${r}`,
                  Object.assign({ expiresIn: t }, s != null && s.transform ? { transform: s.transform } : {}),
                  { headers: this.headers }
               );
            const o = s != null && s.download ? `&download=${s.download === !0 ? "" : s.download}` : "";
            return (i = { signedUrl: encodeURI(`${this.url}${i.signedURL}${o}`) }), { data: i, error: null };
         } catch (r) {
            if (k(r)) return { data: null, error: r };
            throw r;
         }
      });
   }
   /**
    * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
    *
    * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
    * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
    * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
    */
   createSignedUrls(e, t, s) {
      return T(this, void 0, void 0, function* () {
         try {
            const r = yield R(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn: t, paths: e }, { headers: this.headers }),
               i = s != null && s.download ? `&download=${s.download === !0 ? "" : s.download}` : "";
            return {
               data: r.map((o) =>
                  Object.assign(Object.assign({}, o), { signedUrl: o.signedURL ? encodeURI(`${this.url}${o.signedURL}${i}`) : null })
               ),
               error: null,
            };
         } catch (r) {
            if (k(r)) return { data: null, error: r };
            throw r;
         }
      });
   }
   /**
    * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
    *
    * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
    * @param options.transform Transform the asset before serving it to the client.
    */
   download(e, t) {
      return T(this, void 0, void 0, function* () {
         const r = typeof (t == null ? void 0 : t.transform) < "u" ? "render/image/authenticated" : "object",
            i = this.transformOptsToQueryString((t == null ? void 0 : t.transform) || {}),
            o = i ? `?${i}` : "";
         try {
            const a = this._getFinalPath(e);
            return {
               data: yield (yield fe(this.fetch, `${this.url}/${r}/${a}${o}`, {
                  headers: this.headers,
                  noResolveJson: !0,
               })).blob(),
               error: null,
            };
         } catch (a) {
            if (k(a)) return { data: null, error: a };
            throw a;
         }
      });
   }
   /**
    * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
    * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
    *
    * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
    * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
    * @param options.transform Transform the asset before serving it to the client.
    */
   getPublicUrl(e, t) {
      const s = this._getFinalPath(e),
         r = [],
         i = t != null && t.download ? `download=${t.download === !0 ? "" : t.download}` : "";
      i !== "" && r.push(i);
      const a = typeof (t == null ? void 0 : t.transform) < "u" ? "render/image" : "object",
         c = this.transformOptsToQueryString((t == null ? void 0 : t.transform) || {});
      c !== "" && r.push(c);
      let l = r.join("&");
      return (
         l !== "" && (l = `?${l}`),
         {
            data: { publicUrl: encodeURI(`${this.url}/${a}/public/${s}${l}`) },
         }
      );
   }
   /**
    * Deletes files within the same bucket
    *
    * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
    */
   remove(e) {
      return T(this, void 0, void 0, function* () {
         try {
            return { data: yield He(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: e }, { headers: this.headers }), error: null };
         } catch (t) {
            if (k(t)) return { data: null, error: t };
            throw t;
         }
      });
   }
   /**
    * Get file metadata
    * @param id the file id to retrieve metadata
    */
   // async getMetadata(
   //   id: string
   // ): Promise<
   //   | {
   //       data: Metadata
   //       error: null
   //     }
   //   | {
   //       data: null
   //       error: StorageError
   //     }
   // > {
   //   try {
   //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
   //     return { data, error: null }
   //   } catch (error) {
   //     if (isStorageError(error)) {
   //       return { data: null, error }
   //     }
   //     throw error
   //   }
   // }
   /**
    * Update file metadata
    * @param id the file id to update metadata
    * @param meta the new file metadata
    */
   // async updateMetadata(
   //   id: string,
   //   meta: Metadata
   // ): Promise<
   //   | {
   //       data: Metadata
   //       error: null
   //     }
   //   | {
   //       data: null
   //       error: StorageError
   //     }
   // > {
   //   try {
   //     const data = await post(
   //       this.fetch,
   //       `${this.url}/metadata/${id}`,
   //       { ...meta },
   //       { headers: this.headers }
   //     )
   //     return { data, error: null }
   //   } catch (error) {
   //     if (isStorageError(error)) {
   //       return { data: null, error }
   //     }
   //     throw error
   //   }
   // }
   /**
    * Lists all the files within a bucket.
    * @param path The folder path.
    */
   list(e, t, s) {
      return T(this, void 0, void 0, function* () {
         try {
            const r = Object.assign(Object.assign(Object.assign({}, Ct), t), { prefix: e || "" });
            return { data: yield R(this.fetch, `${this.url}/object/list/${this.bucketId}`, r, { headers: this.headers }, s), error: null };
         } catch (r) {
            if (k(r)) return { data: null, error: r };
            throw r;
         }
      });
   }
   _getFinalPath(e) {
      return `${this.bucketId}/${e}`;
   }
   _removeEmptyFolders(e) {
      return e.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
   }
   transformOptsToQueryString(e) {
      const t = [];
      return (
         e.width && t.push(`width=${e.width}`),
         e.height && t.push(`height=${e.height}`),
         e.resize && t.push(`resize=${e.resize}`),
         e.format && t.push(`format=${e.format}`),
         e.quality && t.push(`quality=${e.quality}`),
         t.join("&")
      );
   }
}
const Ut = "2.5.5",
   Dt = { "X-Client-Info": `storage-js/${Ut}` };
var D = function (n, e, t, s) {
   function r(i) {
      return i instanceof t
         ? i
         : new t(function (o) {
              o(i);
           });
   }
   return new (t || (t = Promise))(function (i, o) {
      function a(h) {
         try {
            l(s.next(h));
         } catch (u) {
            o(u);
         }
      }
      function c(h) {
         try {
            l(s.throw(h));
         } catch (u) {
            o(u);
         }
      }
      function l(h) {
         h.done ? i(h.value) : r(h.value).then(a, c);
      }
      l((s = s.apply(n, e || [])).next());
   });
};
class Nt {
   constructor(e, t = {}, s) {
      (this.url = e), (this.headers = Object.assign(Object.assign({}, Dt), t)), (this.fetch = Be(s));
   }
   /**
    * Retrieves the details of all Storage buckets within an existing project.
    */
   listBuckets() {
      return D(this, void 0, void 0, function* () {
         try {
            return { data: yield fe(this.fetch, `${this.url}/bucket`, { headers: this.headers }), error: null };
         } catch (e) {
            if (k(e)) return { data: null, error: e };
            throw e;
         }
      });
   }
   /**
    * Retrieves the details of an existing Storage bucket.
    *
    * @param id The unique identifier of the bucket you would like to retrieve.
    */
   getBucket(e) {
      return D(this, void 0, void 0, function* () {
         try {
            return { data: yield fe(this.fetch, `${this.url}/bucket/${e}`, { headers: this.headers }), error: null };
         } catch (t) {
            if (k(t)) return { data: null, error: t };
            throw t;
         }
      });
   }
   /**
    * Creates a new Storage bucket
    *
    * @param id A unique identifier for the bucket you are creating.
    * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
    * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
    * The global file size limit takes precedence over this value.
    * The default value is null, which doesn't set a per bucket file size limit.
    * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
    * The default value is null, which allows files with all mime types to be uploaded.
    * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
    * @returns newly created bucket id
    */
   createBucket(
      e,
      t = {
         public: !1,
      }
   ) {
      return D(this, void 0, void 0, function* () {
         try {
            return {
               data: yield R(
                  this.fetch,
                  `${this.url}/bucket`,
                  {
                     id: e,
                     name: e,
                     public: t.public,
                     file_size_limit: t.fileSizeLimit,
                     allowed_mime_types: t.allowedMimeTypes,
                  },
                  { headers: this.headers }
               ),
               error: null,
            };
         } catch (s) {
            if (k(s)) return { data: null, error: s };
            throw s;
         }
      });
   }
   /**
    * Updates a Storage bucket
    *
    * @param id A unique identifier for the bucket you are updating.
    * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
    * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
    * The global file size limit takes precedence over this value.
    * The default value is null, which doesn't set a per bucket file size limit.
    * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
    * The default value is null, which allows files with all mime types to be uploaded.
    * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
    */
   updateBucket(e, t) {
      return D(this, void 0, void 0, function* () {
         try {
            return {
               data: yield It(
                  this.fetch,
                  `${this.url}/bucket/${e}`,
                  {
                     id: e,
                     name: e,
                     public: t.public,
                     file_size_limit: t.fileSizeLimit,
                     allowed_mime_types: t.allowedMimeTypes,
                  },
                  { headers: this.headers }
               ),
               error: null,
            };
         } catch (s) {
            if (k(s)) return { data: null, error: s };
            throw s;
         }
      });
   }
   /**
    * Removes all objects inside a single bucket.
    *
    * @param id The unique identifier of the bucket you would like to empty.
    */
   emptyBucket(e) {
      return D(this, void 0, void 0, function* () {
         try {
            return { data: yield R(this.fetch, `${this.url}/bucket/${e}/empty`, {}, { headers: this.headers }), error: null };
         } catch (t) {
            if (k(t)) return { data: null, error: t };
            throw t;
         }
      });
   }
   /**
    * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
    * You must first `empty()` the bucket.
    *
    * @param id The unique identifier of the bucket you would like to delete.
    */
   deleteBucket(e) {
      return D(this, void 0, void 0, function* () {
         try {
            return { data: yield He(this.fetch, `${this.url}/bucket/${e}`, {}, { headers: this.headers }), error: null };
         } catch (t) {
            if (k(t)) return { data: null, error: t };
            throw t;
         }
      });
   }
}
class Ft extends Nt {
   constructor(e, t = {}, s) {
      super(e, t, s);
   }
   /**
    * Perform file operation in a bucket.
    *
    * @param id The bucket id to operate on.
    */
   from(e) {
      return new Lt(this.url, this.headers, e, this.fetch);
   }
}
const qt = "2.39.3";
let V = "";
typeof Deno < "u"
   ? (V = "deno")
   : typeof document < "u"
   ? (V = "web")
   : typeof navigator < "u" && navigator.product === "ReactNative"
   ? (V = "react-native")
   : (V = "node");
const Mt = { "X-Client-Info": `supabase-js-${V}/${qt}` };
var zt = function (n, e, t, s) {
   function r(i) {
      return i instanceof t
         ? i
         : new t(function (o) {
              o(i);
           });
   }
   return new (t || (t = Promise))(function (i, o) {
      function a(h) {
         try {
            l(s.next(h));
         } catch (u) {
            o(u);
         }
      }
      function c(h) {
         try {
            l(s.throw(h));
         } catch (u) {
            o(u);
         }
      }
      function l(h) {
         h.done ? i(h.value) : r(h.value).then(a, c);
      }
      l((s = s.apply(n, e || [])).next());
   });
};
const Jt = (n) => {
      let e;
      return n ? (e = n) : typeof fetch > "u" ? (e = _e) : (e = fetch), (...t) => e(...t);
   },
   Bt = () => (typeof Headers > "u" ? qe : Headers),
   Ht = (n, e, t) => {
      const s = Jt(t),
         r = Bt();
      return (i, o) =>
         zt(void 0, void 0, void 0, function* () {
            var a;
            const c = (a = yield e()) !== null && a !== void 0 ? a : n;
            let l = new r(o == null ? void 0 : o.headers);
            return (
               l.has("apikey") || l.set("apikey", n),
               l.has("Authorization") || l.set("Authorization", `Bearer ${c}`),
               s(i, Object.assign(Object.assign({}, o), { headers: l }))
            );
         });
   };
function Kt(n) {
   return n.replace(/\/$/, "");
}
function Gt(n, e) {
   const { db: t, auth: s, realtime: r, global: i } = n,
      { db: o, auth: a, realtime: c, global: l } = e;
   return {
      db: Object.assign(Object.assign({}, o), t),
      auth: Object.assign(Object.assign({}, a), s),
      realtime: Object.assign(Object.assign({}, c), r),
      global: Object.assign(Object.assign({}, l), i),
   };
}
function Vt(n) {
   return Math.round(Date.now() / 1e3) + n;
}
function Wt() {
   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (n) {
      const e = (Math.random() * 16) | 0;
      return (n == "x" ? e : (e & 3) | 8).toString(16);
   });
}
const E = () => typeof document < "u",
   x = {
      tested: !1,
      writable: !1,
   },
   Y = () => {
      if (!E()) return !1;
      try {
         if (typeof globalThis.localStorage != "object") return !1;
      } catch {
         return !1;
      }
      if (x.tested) return x.writable;
      const n = `lswt-${Math.random()}${Math.random()}`;
      try {
         globalThis.localStorage.setItem(n, n), globalThis.localStorage.removeItem(n), (x.tested = !0), (x.writable = !0);
      } catch {
         (x.tested = !0), (x.writable = !1);
      }
      return x.writable;
   };
function ae(n) {
   const e = {},
      t = new URL(n);
   if (t.hash && t.hash[0] === "#")
      try {
         new URLSearchParams(t.hash.substring(1)).forEach((r, i) => {
            e[i] = r;
         });
      } catch {}
   return (
      t.searchParams.forEach((s, r) => {
         e[r] = s;
      }),
      e
   );
}
const Ke = (n) => {
      let e;
      return (
         n
            ? (e = n)
            : typeof fetch > "u"
            ? (e = (...t) =>
                 Promise.resolve()
                    .then(() => Q)
                    .then(({ default: s }) => s(...t)))
            : (e = fetch),
         (...t) => e(...t)
      );
   },
   Yt = (n) => typeof n == "object" && n !== null && "status" in n && "ok" in n && "json" in n && typeof n.json == "function",
   I = async (n, e, t) => {
      await n.setItem(e, JSON.stringify(t));
   },
   ee = async (n, e) => {
      const t = await n.getItem(e);
      if (!t) return null;
      try {
         return JSON.parse(t);
      } catch {
         return t;
      }
   },
   ce = async (n, e) => {
      await n.removeItem(e);
   };
function Xt(n) {
   const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   let t = "",
      s,
      r,
      i,
      o,
      a,
      c,
      l,
      h = 0;
   for (n = n.replace("-", "+").replace("_", "/"); h < n.length; )
      (o = e.indexOf(n.charAt(h++))),
         (a = e.indexOf(n.charAt(h++))),
         (c = e.indexOf(n.charAt(h++))),
         (l = e.indexOf(n.charAt(h++))),
         (s = (o << 2) | (a >> 4)),
         (r = ((a & 15) << 4) | (c >> 2)),
         (i = ((c & 3) << 6) | l),
         (t = t + String.fromCharCode(s)),
         c != 64 && r != 0 && (t = t + String.fromCharCode(r)),
         l != 64 && i != 0 && (t = t + String.fromCharCode(i));
   return t;
}
class ie {
   constructor() {
      this.promise = new ie.promiseConstructor((e, t) => {
         (this.resolve = e), (this.reject = t);
      });
   }
}
ie.promiseConstructor = Promise;
function Ae(n) {
   const e = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}=?$|[a-z0-9_-]{2}(==)?$)$/i,
      t = n.split(".");
   if (t.length !== 3) throw new Error("JWT is not valid: not a JWT structure");
   if (!e.test(t[1])) throw new Error("JWT is not valid: payload is not in base64url format");
   const s = t[1];
   return JSON.parse(Xt(s));
}
async function Qt(n) {
   return await new Promise((e) => {
      setTimeout(() => e(null), n);
   });
}
function Zt(n, e) {
   return new Promise((s, r) => {
      (async () => {
         for (let i = 0; i < 1 / 0; i++)
            try {
               const o = await n(i);
               if (!e(i, null, o)) {
                  s(o);
                  return;
               }
            } catch (o) {
               if (!e(i, o)) {
                  r(o);
                  return;
               }
            }
      })();
   });
}
function es(n) {
   return ("0" + n.toString(16)).substr(-2);
}
function N() {
   const e = new Uint32Array(56);
   if (typeof crypto > "u") {
      const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",
         s = t.length;
      let r = "";
      for (let i = 0; i < 56; i++) r += t.charAt(Math.floor(Math.random() * s));
      return r;
   }
   return crypto.getRandomValues(e), Array.from(e, es).join("");
}
async function ts(n) {
   const t = new TextEncoder().encode(n),
      s = await crypto.subtle.digest("SHA-256", t),
      r = new Uint8Array(s);
   return Array.from(r)
      .map((i) => String.fromCharCode(i))
      .join("");
}
function ss(n) {
   return btoa(n).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function F(n) {
   if (!(typeof crypto < "u" && typeof crypto.subtle < "u" && typeof TextEncoder < "u"))
      return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), n;
   const t = await ts(n);
   return ss(t);
}
class we extends Error {
   constructor(e, t) {
      super(e), (this.__isAuthError = !0), (this.name = "AuthError"), (this.status = t);
   }
}
function p(n) {
   return typeof n == "object" && n !== null && "__isAuthError" in n;
}
class rs extends we {
   constructor(e, t) {
      super(e, t), (this.name = "AuthApiError"), (this.status = t);
   }
   toJSON() {
      return {
         name: this.name,
         message: this.message,
         status: this.status,
      };
   }
}
function is(n) {
   return p(n) && n.name === "AuthApiError";
}
class Ge extends we {
   constructor(e, t) {
      super(e), (this.name = "AuthUnknownError"), (this.originalError = t);
   }
}
class U extends we {
   constructor(e, t, s) {
      super(e), (this.name = t), (this.status = s);
   }
   toJSON() {
      return {
         name: this.name,
         message: this.message,
         status: this.status,
      };
   }
}
class q extends U {
   constructor() {
      super("Auth session missing!", "AuthSessionMissingError", 400);
   }
}
class le extends U {
   constructor() {
      super("Auth session or user missing", "AuthInvalidTokenResponseError", 500);
   }
}
class te extends U {
   constructor(e) {
      super(e, "AuthInvalidCredentialsError", 400);
   }
}
class se extends U {
   constructor(e, t = null) {
      super(e, "AuthImplicitGrantRedirectError", 500), (this.details = null), (this.details = t);
   }
   toJSON() {
      return {
         name: this.name,
         message: this.message,
         status: this.status,
         details: this.details,
      };
   }
}
class Re extends U {
   constructor(e, t = null) {
      super(e, "AuthPKCEGrantCodeExchangeError", 500), (this.details = null), (this.details = t);
   }
   toJSON() {
      return {
         name: this.name,
         message: this.message,
         status: this.status,
         details: this.details,
      };
   }
}
class ge extends U {
   constructor(e, t) {
      super(e, "AuthRetryableFetchError", t);
   }
}
function he(n) {
   return p(n) && n.name === "AuthRetryableFetchError";
}
class ns extends U {
   constructor(e, t, s) {
      super(e, "AuthWeakPasswordError", t), (this.reasons = s);
   }
}
var os = function (n, e) {
   var t = {};
   for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && e.indexOf(s) < 0 && (t[s] = n[s]);
   if (n != null && typeof Object.getOwnPropertySymbols == "function")
      for (var r = 0, s = Object.getOwnPropertySymbols(n); r < s.length; r++)
         e.indexOf(s[r]) < 0 && Object.prototype.propertyIsEnumerable.call(n, s[r]) && (t[s[r]] = n[s[r]]);
   return t;
};
const J = (n) => n.msg || n.message || n.error_description || n.error || JSON.stringify(n),
   as = [502, 503, 504];
async function Pe(n) {
   if (!Yt(n)) throw new ge(J(n), 0);
   if (as.includes(n.status)) throw new ge(J(n), n.status);
   let e;
   try {
      e = await n.json();
   } catch (t) {
      throw new Ge(J(t), t);
   }
   throw typeof e == "object" &&
      e &&
      typeof e.weak_password == "object" &&
      e.weak_password &&
      Array.isArray(e.weak_password.reasons) &&
      e.weak_password.reasons.length &&
      e.weak_password.reasons.reduce((t, s) => t && typeof s == "string", !0)
      ? new ns(J(e), n.status, e.weak_password.reasons)
      : new rs(J(e), n.status || 500);
}
const cs = (n, e, t, s) => {
   const r = { method: n, headers: (e == null ? void 0 : e.headers) || {} };
   return n === "GET"
      ? r
      : ((r.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, e == null ? void 0 : e.headers)),
        (r.body = JSON.stringify(s)),
        Object.assign(Object.assign({}, r), t));
};
async function v(n, e, t, s) {
   var r;
   const i = Object.assign({}, s == null ? void 0 : s.headers);
   s != null && s.jwt && (i.Authorization = `Bearer ${s.jwt}`);
   const o = (r = s == null ? void 0 : s.query) !== null && r !== void 0 ? r : {};
   s != null && s.redirectTo && (o.redirect_to = s.redirectTo);
   const a = Object.keys(o).length ? "?" + new URLSearchParams(o).toString() : "",
      c = await ls(n, e, t + a, { headers: i, noResolveJson: s == null ? void 0 : s.noResolveJson }, {}, s == null ? void 0 : s.body);
   return s != null && s.xform ? (s == null ? void 0 : s.xform(c)) : { data: Object.assign({}, c), error: null };
}
async function ls(n, e, t, s, r, i) {
   const o = cs(e, s, r, i);
   let a;
   try {
      a = await n(t, o);
   } catch (c) {
      throw (console.error(c), new ge(J(c), 0));
   }
   if ((a.ok || (await Pe(a)), s != null && s.noResolveJson)) return a;
   try {
      return await a.json();
   } catch (c) {
      await Pe(c);
   }
}
function C(n) {
   var e;
   let t = null;
   fs(n) && ((t = Object.assign({}, n)), n.expires_at || (t.expires_at = Vt(n.expires_in)));
   const s = (e = n.user) !== null && e !== void 0 ? e : n;
   return { data: { session: t, user: s }, error: null };
}
function xe(n) {
   const e = C(n);
   return (
      !e.error &&
         n.weak_password &&
         typeof n.weak_password == "object" &&
         Array.isArray(n.weak_password.reasons) &&
         n.weak_password.reasons.length &&
         n.weak_password.message &&
         typeof n.weak_password.message == "string" &&
         n.weak_password.reasons.reduce((t, s) => t && typeof s == "string", !0) &&
         (e.data.weak_password = n.weak_password),
      e
   );
}
function P(n) {
   var e;
   return { data: { user: (e = n.user) !== null && e !== void 0 ? e : n }, error: null };
}
function hs(n) {
   return { data: n, error: null };
}
function us(n) {
   const { action_link: e, email_otp: t, hashed_token: s, redirect_to: r, verification_type: i } = n,
      o = os(n, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]),
      a = {
         action_link: e,
         email_otp: t,
         hashed_token: s,
         redirect_to: r,
         verification_type: i,
      },
      c = Object.assign({}, o);
   return {
      data: {
         properties: a,
         user: c,
      },
      error: null,
   };
}
function ds(n) {
   return n;
}
function fs(n) {
   return n.access_token && n.refresh_token && n.expires_in;
}
var gs = function (n, e) {
   var t = {};
   for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && e.indexOf(s) < 0 && (t[s] = n[s]);
   if (n != null && typeof Object.getOwnPropertySymbols == "function")
      for (var r = 0, s = Object.getOwnPropertySymbols(n); r < s.length; r++)
         e.indexOf(s[r]) < 0 && Object.prototype.propertyIsEnumerable.call(n, s[r]) && (t[s[r]] = n[s[r]]);
   return t;
};
class ps {
   constructor({ url: e = "", headers: t = {}, fetch: s }) {
      (this.url = e),
         (this.headers = t),
         (this.fetch = Ke(s)),
         (this.mfa = {
            listFactors: this._listFactors.bind(this),
            deleteFactor: this._deleteFactor.bind(this),
         });
   }
   /**
    * Removes a logged-in session.
    * @param jwt A valid, logged-in JWT.
    * @param scope The logout sope.
    */
   async signOut(e, t = "global") {
      try {
         return (
            await v(this.fetch, "POST", `${this.url}/logout?scope=${t}`, {
               headers: this.headers,
               jwt: e,
               noResolveJson: !0,
            }),
            { data: null, error: null }
         );
      } catch (s) {
         if (p(s)) return { data: null, error: s };
         throw s;
      }
   }
   /**
    * Sends an invite link to an email address.
    * @param email The email address of the user.
    * @param options Additional options to be included when inviting.
    */
   async inviteUserByEmail(e, t = {}) {
      try {
         return await v(this.fetch, "POST", `${this.url}/invite`, {
            body: { email: e, data: t.data },
            headers: this.headers,
            redirectTo: t.redirectTo,
            xform: P,
         });
      } catch (s) {
         if (p(s)) return { data: { user: null }, error: s };
         throw s;
      }
   }
   /**
    * Generates email links and OTPs to be sent via a custom email provider.
    * @param email The user's email.
    * @param options.password User password. For signup only.
    * @param options.data Optional user metadata. For signup only.
    * @param options.redirectTo The redirect url which should be appended to the generated link
    */
   async generateLink(e) {
      try {
         const { options: t } = e,
            s = gs(e, ["options"]),
            r = Object.assign(Object.assign({}, s), t);
         return (
            "newEmail" in s && ((r.new_email = s == null ? void 0 : s.newEmail), delete r.newEmail),
            await v(this.fetch, "POST", `${this.url}/admin/generate_link`, {
               body: r,
               headers: this.headers,
               xform: us,
               redirectTo: t == null ? void 0 : t.redirectTo,
            })
         );
      } catch (t) {
         if (p(t))
            return {
               data: {
                  properties: null,
                  user: null,
               },
               error: t,
            };
         throw t;
      }
   }
   // User Admin API
   /**
    * Creates a new user.
    * This function should only be called on a server. Never expose your `service_role` key in the browser.
    */
   async createUser(e) {
      try {
         return await v(this.fetch, "POST", `${this.url}/admin/users`, {
            body: e,
            headers: this.headers,
            xform: P,
         });
      } catch (t) {
         if (p(t)) return { data: { user: null }, error: t };
         throw t;
      }
   }
   /**
    * Get a list of users.
    *
    * This function should only be called on a server. Never expose your `service_role` key in the browser.
    * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
    */
   async listUsers(e) {
      var t, s, r, i, o, a, c;
      try {
         const l = { nextPage: null, lastPage: 0, total: 0 },
            h = await v(this.fetch, "GET", `${this.url}/admin/users`, {
               headers: this.headers,
               noResolveJson: !0,
               query: {
                  page: (s = (t = e == null ? void 0 : e.page) === null || t === void 0 ? void 0 : t.toString()) !== null && s !== void 0 ? s : "",
                  per_page:
                     (i = (r = e == null ? void 0 : e.perPage) === null || r === void 0 ? void 0 : r.toString()) !== null && i !== void 0 ? i : "",
               },
               xform: ds,
            });
         if (h.error) throw h.error;
         const u = await h.json(),
            d = (o = h.headers.get("x-total-count")) !== null && o !== void 0 ? o : 0,
            f = (c = (a = h.headers.get("link")) === null || a === void 0 ? void 0 : a.split(",")) !== null && c !== void 0 ? c : [];
         return (
            f.length > 0 &&
               (f.forEach((m) => {
                  const g = parseInt(m.split(";")[0].split("=")[1].substring(0, 1)),
                     _ = JSON.parse(m.split(";")[1].split("=")[1]);
                  l[`${_}Page`] = g;
               }),
               (l.total = parseInt(d))),
            { data: Object.assign(Object.assign({}, u), l), error: null }
         );
      } catch (l) {
         if (p(l)) return { data: { users: [] }, error: l };
         throw l;
      }
   }
   /**
    * Get user by id.
    *
    * @param uid The user's unique identifier
    *
    * This function should only be called on a server. Never expose your `service_role` key in the browser.
    */
   async getUserById(e) {
      try {
         return await v(this.fetch, "GET", `${this.url}/admin/users/${e}`, {
            headers: this.headers,
            xform: P,
         });
      } catch (t) {
         if (p(t)) return { data: { user: null }, error: t };
         throw t;
      }
   }
   /**
    * Updates the user data.
    *
    * @param attributes The data you want to update.
    *
    * This function should only be called on a server. Never expose your `service_role` key in the browser.
    */
   async updateUserById(e, t) {
      try {
         return await v(this.fetch, "PUT", `${this.url}/admin/users/${e}`, {
            body: t,
            headers: this.headers,
            xform: P,
         });
      } catch (s) {
         if (p(s)) return { data: { user: null }, error: s };
         throw s;
      }
   }
   /**
    * Delete a user. Requires a `service_role` key.
    *
    * @param id The user id you want to remove.
    * @param shouldSoftDelete If true, then the user will be soft-deleted (setting `deleted_at` to the current timestamp and disabling their account while preserving their data) from the auth schema.
    * Defaults to false for backward compatibility.
    *
    * This function should only be called on a server. Never expose your `service_role` key in the browser.
    */
   async deleteUser(e, t = !1) {
      try {
         return await v(this.fetch, "DELETE", `${this.url}/admin/users/${e}`, {
            headers: this.headers,
            body: {
               should_soft_delete: t,
            },
            xform: P,
         });
      } catch (s) {
         if (p(s)) return { data: { user: null }, error: s };
         throw s;
      }
   }
   async _listFactors(e) {
      try {
         const { data: t, error: s } = await v(this.fetch, "GET", `${this.url}/admin/users/${e.userId}/factors`, {
            headers: this.headers,
            xform: (r) => ({ data: { factors: r }, error: null }),
         });
         return { data: t, error: s };
      } catch (t) {
         if (p(t)) return { data: null, error: t };
         throw t;
      }
   }
   async _deleteFactor(e) {
      try {
         return {
            data: await v(this.fetch, "DELETE", `${this.url}/admin/users/${e.userId}/factors/${e.id}`, {
               headers: this.headers,
            }),
            error: null,
         };
      } catch (t) {
         if (p(t)) return { data: null, error: t };
         throw t;
      }
   }
}
const Ve = "0.0.0",
   _s = "http://localhost:9999",
   vs = "supabase.auth.token",
   ms = { "X-Client-Info": `gotrue-js/${Ve}` },
   Ie = 10,
   ys = {
      getItem: (n) => (Y() ? globalThis.localStorage.getItem(n) : null),
      setItem: (n, e) => {
         Y() && globalThis.localStorage.setItem(n, e);
      },
      removeItem: (n) => {
         Y() && globalThis.localStorage.removeItem(n);
      },
   };
function Ce(n = {}) {
   return {
      getItem: (e) => n[e] || null,
      setItem: (e, t) => {
         n[e] = t;
      },
      removeItem: (e) => {
         delete n[e];
      },
   };
}
function ws() {
   if (typeof globalThis != "object")
      try {
         Object.defineProperty(Object.prototype, "__magic__", {
            get: function () {
               return this;
            },
            configurable: !0,
         }),
            (__magic__.globalThis = __magic__),
            delete Object.prototype.__magic__;
      } catch {
         typeof self < "u" && (self.globalThis = self);
      }
}
const M = {
   /**
    * @experimental
    */
   debug: !!(globalThis && Y() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true"),
};
class We extends Error {
   constructor(e) {
      super(e), (this.isAcquireTimeout = !0);
   }
}
class bs extends We {}
async function ks(n, e, t) {
   M.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire lock", n, e);
   const s = new globalThis.AbortController();
   return (
      e > 0 &&
         setTimeout(() => {
            s.abort(), M.debug && console.log("@supabase/gotrue-js: navigatorLock acquire timed out", n);
         }, e),
      await globalThis.navigator.locks.request(
         n,
         e === 0
            ? {
                 mode: "exclusive",
                 ifAvailable: !0,
              }
            : {
                 mode: "exclusive",
                 signal: s.signal,
              },
         async (r) => {
            if (r) {
               M.debug && console.log("@supabase/gotrue-js: navigatorLock: acquired", n, r.name);
               try {
                  return await t();
               } finally {
                  M.debug && console.log("@supabase/gotrue-js: navigatorLock: released", n, r.name);
               }
            } else {
               if (e === 0)
                  throw (
                     (M.debug && console.log("@supabase/gotrue-js: navigatorLock: not immediately available", n),
                     new bs(`Acquiring an exclusive Navigator LockManager lock "${n}" immediately failed`))
                  );
               if (M.debug)
                  try {
                     const i = await globalThis.navigator.locks.query();
                     console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(i, null, "  "));
                  } catch (i) {
                     console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", i);
                  }
               return (
                  console.warn(
                     "@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"
                  ),
                  await t()
               );
            }
         }
      )
   );
}
ws();
const Ss = {
      url: _s,
      storageKey: vs,
      autoRefreshToken: !0,
      persistSession: !0,
      detectSessionInUrl: !0,
      headers: ms,
      flowType: "implicit",
      debug: !1,
   },
   G = 30 * 1e3,
   Le = 3;
async function Ue(n, e, t) {
   return await t();
}
class X {
   /**
    * Create a new client for use in the browser.
    */
   constructor(e) {
      var t, s;
      (this.memoryStorage = null),
         (this.stateChangeEmitters = /* @__PURE__ */ new Map()),
         (this.autoRefreshTicker = null),
         (this.visibilityChangedCallback = null),
         (this.refreshingDeferred = null),
         (this.initializePromise = null),
         (this.detectSessionInUrl = !0),
         (this.lockAcquired = !1),
         (this.pendingInLock = []),
         (this.broadcastChannel = null),
         (this.logger = console.log),
         (this.instanceID = X.nextInstanceID),
         (X.nextInstanceID += 1),
         this.instanceID > 0 &&
            E() &&
            console.warn(
               "Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key."
            );
      const r = Object.assign(Object.assign({}, Ss), e);
      if (
         ((this.logDebugMessages = !!r.debug),
         typeof r.debug == "function" && (this.logger = r.debug),
         (this.persistSession = r.persistSession),
         (this.storageKey = r.storageKey),
         (this.autoRefreshToken = r.autoRefreshToken),
         (this.admin = new ps({
            url: r.url,
            headers: r.headers,
            fetch: r.fetch,
         })),
         (this.url = r.url),
         (this.headers = r.headers),
         (this.fetch = Ke(r.fetch)),
         (this.lock = r.lock || Ue),
         (this.detectSessionInUrl = r.detectSessionInUrl),
         (this.flowType = r.flowType),
         r.lock
            ? (this.lock = r.lock)
            : E() && !((t = globalThis == null ? void 0 : globalThis.navigator) === null || t === void 0) && t.locks
            ? (this.lock = ks)
            : (this.lock = Ue),
         (this.mfa = {
            verify: this._verify.bind(this),
            enroll: this._enroll.bind(this),
            unenroll: this._unenroll.bind(this),
            challenge: this._challenge.bind(this),
            listFactors: this._listFactors.bind(this),
            challengeAndVerify: this._challengeAndVerify.bind(this),
            getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this),
         }),
         this.persistSession
            ? r.storage
               ? (this.storage = r.storage)
               : Y()
               ? (this.storage = ys)
               : ((this.memoryStorage = {}), (this.storage = Ce(this.memoryStorage)))
            : ((this.memoryStorage = {}), (this.storage = Ce(this.memoryStorage))),
         E() && globalThis.BroadcastChannel && this.persistSession && this.storageKey)
      ) {
         try {
            this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
         } catch (i) {
            console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", i);
         }
         (s = this.broadcastChannel) === null ||
            s === void 0 ||
            s.addEventListener("message", async (i) => {
               this._debug("received broadcast notification from other tab or client", i),
                  await this._notifyAllSubscribers(i.data.event, i.data.session, !1);
            });
      }
      this.initialize();
   }
   _debug(...e) {
      return this.logDebugMessages && this.logger(`GoTrueClient@${this.instanceID} (${Ve}) ${/* @__PURE__ */ new Date().toISOString()}`, ...e), this;
   }
   /**
    * Initializes the client session either from the url or from storage.
    * This method is automatically called when instantiating the client, but should also be called
    * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
    */
   async initialize() {
      return this.initializePromise
         ? await this.initializePromise
         : ((this.initializePromise = (async () => await this._acquireLock(-1, async () => await this._initialize()))()),
           await this.initializePromise);
   }
   /**
    * IMPORTANT:
    * 1. Never throw in this method, as it is called from the constructor
    * 2. Never return a session from this method as it would be cached over
    *    the whole lifetime of the client
    */
   async _initialize() {
      try {
         const e = E() ? await this._isPKCEFlow() : !1;
         if ((this._debug("#_initialize()", "begin", "is PKCE flow", e), e || (this.detectSessionInUrl && this._isImplicitGrantFlow()))) {
            const { data: t, error: s } = await this._getSessionFromURL(e);
            if (s)
               return (
                  this._debug("#_initialize()", "error detecting session from URL", s),
                  (s == null ? void 0 : s.message) === "Identity is already linked" ||
                  (s == null ? void 0 : s.message) === "Identity is already linked to another user"
                     ? { error: s }
                     : (await this._removeSession(), { error: s })
               );
            const { session: r, redirectType: i } = t;
            return (
               this._debug("#_initialize()", "detected session in URL", r, "redirect type", i),
               await this._saveSession(r),
               setTimeout(async () => {
                  i === "recovery" ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", r) : await this._notifyAllSubscribers("SIGNED_IN", r);
               }, 0),
               { error: null }
            );
         }
         return await this._recoverAndRefresh(), { error: null };
      } catch (e) {
         return p(e)
            ? { error: e }
            : {
                 error: new Ge("Unexpected error during initialization", e),
              };
      } finally {
         await this._handleVisibilityChange(), this._debug("#_initialize()", "end");
      }
   }
   /**
    * Creates a new user.
    *
    * Be aware that if a user account exists in the system you may get back an
    * error message that attempts to hide this information from the user.
    * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
    *
    * @returns A logged-in session if the server has "autoconfirm" ON
    * @returns A user if the server has "autoconfirm" OFF
    */
   async signUp(e) {
      var t, s, r;
      try {
         await this._removeSession();
         let i;
         if ("email" in e) {
            const { email: h, password: u, options: d } = e;
            let f = null,
               m = null;
            if (this.flowType === "pkce") {
               const g = N();
               await I(this.storage, `${this.storageKey}-code-verifier`, g), (f = await F(g)), (m = g === f ? "plain" : "s256");
            }
            i = await v(this.fetch, "POST", `${this.url}/signup`, {
               headers: this.headers,
               redirectTo: d == null ? void 0 : d.emailRedirectTo,
               body: {
                  email: h,
                  password: u,
                  data: (t = d == null ? void 0 : d.data) !== null && t !== void 0 ? t : {},
                  gotrue_meta_security: { captcha_token: d == null ? void 0 : d.captchaToken },
                  code_challenge: f,
                  code_challenge_method: m,
               },
               xform: C,
            });
         } else if ("phone" in e) {
            const { phone: h, password: u, options: d } = e;
            i = await v(this.fetch, "POST", `${this.url}/signup`, {
               headers: this.headers,
               body: {
                  phone: h,
                  password: u,
                  data: (s = d == null ? void 0 : d.data) !== null && s !== void 0 ? s : {},
                  channel: (r = d == null ? void 0 : d.channel) !== null && r !== void 0 ? r : "sms",
                  gotrue_meta_security: { captcha_token: d == null ? void 0 : d.captchaToken },
               },
               xform: C,
            });
         } else throw new te("You must provide either an email or phone number and a password");
         const { data: o, error: a } = i;
         if (a || !o) return { data: { user: null, session: null }, error: a };
         const c = o.session,
            l = o.user;
         return (
            o.session && (await this._saveSession(o.session), await this._notifyAllSubscribers("SIGNED_IN", c)),
            { data: { user: l, session: c }, error: null }
         );
      } catch (i) {
         if (p(i)) return { data: { user: null, session: null }, error: i };
         throw i;
      }
   }
   /**
    * Log in an existing user with an email and password or phone and password.
    *
    * Be aware that you may get back an error message that will not distinguish
    * between the cases where the account does not exist or that the
    * email/phone and password combination is wrong or that the account can only
    * be accessed via social login.
    */
   async signInWithPassword(e) {
      try {
         await this._removeSession();
         let t;
         if ("email" in e) {
            const { email: i, password: o, options: a } = e;
            t = await v(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
               headers: this.headers,
               body: {
                  email: i,
                  password: o,
                  gotrue_meta_security: { captcha_token: a == null ? void 0 : a.captchaToken },
               },
               xform: xe,
            });
         } else if ("phone" in e) {
            const { phone: i, password: o, options: a } = e;
            t = await v(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
               headers: this.headers,
               body: {
                  phone: i,
                  password: o,
                  gotrue_meta_security: { captcha_token: a == null ? void 0 : a.captchaToken },
               },
               xform: xe,
            });
         } else throw new te("You must provide either an email or phone number and a password");
         const { data: s, error: r } = t;
         return r
            ? { data: { user: null, session: null }, error: r }
            : !s || !s.session || !s.user
            ? { data: { user: null, session: null }, error: new le() }
            : (s.session && (await this._saveSession(s.session), await this._notifyAllSubscribers("SIGNED_IN", s.session)),
              {
                 data: Object.assign({ user: s.user, session: s.session }, s.weak_password ? { weakPassword: s.weak_password } : null),
                 error: r,
              });
      } catch (t) {
         if (p(t)) return { data: { user: null, session: null }, error: t };
         throw t;
      }
   }
   /**
    * Log in an existing user via a third-party provider.
    * This method supports the PKCE flow.
    */
   async signInWithOAuth(e) {
      var t, s, r, i;
      return (
         await this._removeSession(),
         await this._handleProviderSignIn(e.provider, {
            redirectTo: (t = e.options) === null || t === void 0 ? void 0 : t.redirectTo,
            scopes: (s = e.options) === null || s === void 0 ? void 0 : s.scopes,
            queryParams: (r = e.options) === null || r === void 0 ? void 0 : r.queryParams,
            skipBrowserRedirect: (i = e.options) === null || i === void 0 ? void 0 : i.skipBrowserRedirect,
         })
      );
   }
   /**
    * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
    */
   async exchangeCodeForSession(e) {
      return await this.initializePromise, this._acquireLock(-1, async () => this._exchangeCodeForSession(e));
   }
   async _exchangeCodeForSession(e) {
      const t = await ee(this.storage, `${this.storageKey}-code-verifier`),
         [s, r] = (t ?? "").split("/"),
         { data: i, error: o } = await v(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
            headers: this.headers,
            body: {
               auth_code: e,
               code_verifier: s,
            },
            xform: C,
         });
      return (
         await ce(this.storage, `${this.storageKey}-code-verifier`),
         o
            ? { data: { user: null, session: null, redirectType: null }, error: o }
            : !i || !i.session || !i.user
            ? {
                 data: { user: null, session: null, redirectType: null },
                 error: new le(),
              }
            : (i.session && (await this._saveSession(i.session), await this._notifyAllSubscribers("SIGNED_IN", i.session)),
              { data: Object.assign(Object.assign({}, i), { redirectType: r ?? null }), error: o })
      );
   }
   /**
    * Allows signing in with an OIDC ID token. The authentication provider used
    * should be enabled and configured.
    */
   async signInWithIdToken(e) {
      await this._removeSession();
      try {
         const { options: t, provider: s, token: r, access_token: i, nonce: o } = e,
            a = await v(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
               headers: this.headers,
               body: {
                  provider: s,
                  id_token: r,
                  access_token: i,
                  nonce: o,
                  gotrue_meta_security: { captcha_token: t == null ? void 0 : t.captchaToken },
               },
               xform: C,
            }),
            { data: c, error: l } = a;
         return l
            ? { data: { user: null, session: null }, error: l }
            : !c || !c.session || !c.user
            ? {
                 data: { user: null, session: null },
                 error: new le(),
              }
            : (c.session && (await this._saveSession(c.session), await this._notifyAllSubscribers("SIGNED_IN", c.session)), { data: c, error: l });
      } catch (t) {
         if (p(t)) return { data: { user: null, session: null }, error: t };
         throw t;
      }
   }
   /**
    * Log in a user using magiclink or a one-time password (OTP).
    *
    * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
    * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
    * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
    *
    * Be aware that you may get back an error message that will not distinguish
    * between the cases where the account does not exist or, that the account
    * can only be accessed via social login.
    *
    * Do note that you will need to configure a Whatsapp sender on Twilio
    * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
    * channel is not supported on other providers
    * at this time.
    * This method supports PKCE when an email is passed.
    */
   async signInWithOtp(e) {
      var t, s, r, i, o;
      try {
         if ((await this._removeSession(), "email" in e)) {
            const { email: a, options: c } = e;
            let l = null,
               h = null;
            if (this.flowType === "pkce") {
               const d = N();
               await I(this.storage, `${this.storageKey}-code-verifier`, d), (l = await F(d)), (h = d === l ? "plain" : "s256");
            }
            const { error: u } = await v(this.fetch, "POST", `${this.url}/otp`, {
               headers: this.headers,
               body: {
                  email: a,
                  data: (t = c == null ? void 0 : c.data) !== null && t !== void 0 ? t : {},
                  create_user: (s = c == null ? void 0 : c.shouldCreateUser) !== null && s !== void 0 ? s : !0,
                  gotrue_meta_security: { captcha_token: c == null ? void 0 : c.captchaToken },
                  code_challenge: l,
                  code_challenge_method: h,
               },
               redirectTo: c == null ? void 0 : c.emailRedirectTo,
            });
            return { data: { user: null, session: null }, error: u };
         }
         if ("phone" in e) {
            const { phone: a, options: c } = e,
               { data: l, error: h } = await v(this.fetch, "POST", `${this.url}/otp`, {
                  headers: this.headers,
                  body: {
                     phone: a,
                     data: (r = c == null ? void 0 : c.data) !== null && r !== void 0 ? r : {},
                     create_user: (i = c == null ? void 0 : c.shouldCreateUser) !== null && i !== void 0 ? i : !0,
                     gotrue_meta_security: { captcha_token: c == null ? void 0 : c.captchaToken },
                     channel: (o = c == null ? void 0 : c.channel) !== null && o !== void 0 ? o : "sms",
                  },
               });
            return { data: { user: null, session: null, messageId: l == null ? void 0 : l.message_id }, error: h };
         }
         throw new te("You must provide either an email or phone number.");
      } catch (a) {
         if (p(a)) return { data: { user: null, session: null }, error: a };
         throw a;
      }
   }
   /**
    * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
    */
   async verifyOtp(e) {
      var t, s;
      try {
         e.type !== "email_change" && e.type !== "phone_change" && (await this._removeSession());
         let r, i;
         "options" in e &&
            ((r = (t = e.options) === null || t === void 0 ? void 0 : t.redirectTo),
            (i = (s = e.options) === null || s === void 0 ? void 0 : s.captchaToken));
         const { data: o, error: a } = await v(this.fetch, "POST", `${this.url}/verify`, {
            headers: this.headers,
            body: Object.assign(Object.assign({}, e), { gotrue_meta_security: { captcha_token: i } }),
            redirectTo: r,
            xform: C,
         });
         if (a) throw a;
         if (!o) throw new Error("An error occurred on token verification.");
         const c = o.session,
            l = o.user;
         return (
            c != null &&
               c.access_token &&
               (await this._saveSession(c), await this._notifyAllSubscribers(e.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", c)),
            { data: { user: l, session: c }, error: null }
         );
      } catch (r) {
         if (p(r)) return { data: { user: null, session: null }, error: r };
         throw r;
      }
   }
   /**
    * Attempts a single-sign on using an enterprise Identity Provider. A
    * successful SSO attempt will redirect the current page to the identity
    * provider authorization page. The redirect URL is implementation and SSO
    * protocol specific.
    *
    * You can use it by providing a SSO domain. Typically you can extract this
    * domain by asking users for their email address. If this domain is
    * registered on the Auth instance the redirect will use that organization's
    * currently active SSO Identity Provider for the login.
    *
    * If you have built an organization-specific login page, you can use the
    * organization's SSO Identity Provider UUID directly instead.
    */
   async signInWithSSO(e) {
      var t, s, r;
      try {
         await this._removeSession();
         let i = null,
            o = null;
         if (this.flowType === "pkce") {
            const a = N();
            await I(this.storage, `${this.storageKey}-code-verifier`, a), (i = await F(a)), (o = a === i ? "plain" : "s256");
         }
         return await v(this.fetch, "POST", `${this.url}/sso`, {
            body: Object.assign(
               Object.assign(
                  Object.assign(
                     Object.assign(
                        Object.assign({}, "providerId" in e ? { provider_id: e.providerId } : null),
                        "domain" in e ? { domain: e.domain } : null
                     ),
                     { redirect_to: (s = (t = e.options) === null || t === void 0 ? void 0 : t.redirectTo) !== null && s !== void 0 ? s : void 0 }
                  ),
                  !((r = e == null ? void 0 : e.options) === null || r === void 0) && r.captchaToken
                     ? { gotrue_meta_security: { captcha_token: e.options.captchaToken } }
                     : null
               ),
               { skip_http_redirect: !0, code_challenge: i, code_challenge_method: o }
            ),
            headers: this.headers,
            xform: hs,
         });
      } catch (i) {
         if (p(i)) return { data: null, error: i };
         throw i;
      }
   }
   /**
    * Sends a reauthentication OTP to the user's email or phone number.
    * Requires the user to be signed-in.
    */
   async reauthenticate() {
      return await this.initializePromise, await this._acquireLock(-1, async () => await this._reauthenticate());
   }
   async _reauthenticate() {
      try {
         return await this._useSession(async (e) => {
            const {
               data: { session: t },
               error: s,
            } = e;
            if (s) throw s;
            if (!t) throw new q();
            const { error: r } = await v(this.fetch, "GET", `${this.url}/reauthenticate`, {
               headers: this.headers,
               jwt: t.access_token,
            });
            return { data: { user: null, session: null }, error: r };
         });
      } catch (e) {
         if (p(e)) return { data: { user: null, session: null }, error: e };
         throw e;
      }
   }
   /**
    * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
    */
   async resend(e) {
      try {
         e.type != "email_change" && e.type != "phone_change" && (await this._removeSession());
         const t = `${this.url}/resend`;
         if ("email" in e) {
            const { email: s, type: r, options: i } = e,
               { error: o } = await v(this.fetch, "POST", t, {
                  headers: this.headers,
                  body: {
                     email: s,
                     type: r,
                     gotrue_meta_security: { captcha_token: i == null ? void 0 : i.captchaToken },
                  },
                  redirectTo: i == null ? void 0 : i.emailRedirectTo,
               });
            return { data: { user: null, session: null }, error: o };
         } else if ("phone" in e) {
            const { phone: s, type: r, options: i } = e,
               { data: o, error: a } = await v(this.fetch, "POST", t, {
                  headers: this.headers,
                  body: {
                     phone: s,
                     type: r,
                     gotrue_meta_security: { captcha_token: i == null ? void 0 : i.captchaToken },
                  },
               });
            return { data: { user: null, session: null, messageId: o == null ? void 0 : o.message_id }, error: a };
         }
         throw new te("You must provide either an email or phone number and a type");
      } catch (t) {
         if (p(t)) return { data: { user: null, session: null }, error: t };
         throw t;
      }
   }
   /**
    * Returns the session, refreshing it if necessary.
    * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
    */
   async getSession() {
      return await this.initializePromise, this._acquireLock(-1, async () => this._useSession(async (e) => e));
   }
   /**
    * Acquires a global lock based on the storage key.
    */
   async _acquireLock(e, t) {
      this._debug("#_acquireLock", "begin", e);
      try {
         if (this.lockAcquired) {
            const s = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve(),
               r = (async () => (await s, await t()))();
            return (
               this.pendingInLock.push(
                  (async () => {
                     try {
                        await r;
                     } catch {}
                  })()
               ),
               r
            );
         }
         return await this.lock(`lock:${this.storageKey}`, e, async () => {
            this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
            try {
               this.lockAcquired = !0;
               const s = t();
               for (
                  this.pendingInLock.push(
                     (async () => {
                        try {
                           await s;
                        } catch {}
                     })()
                  ),
                     await s;
                  this.pendingInLock.length;

               ) {
                  const r = [...this.pendingInLock];
                  await Promise.all(r), this.pendingInLock.splice(0, r.length);
               }
               return await s;
            } finally {
               this._debug("#_acquireLock", "lock released for storage key", this.storageKey), (this.lockAcquired = !1);
            }
         });
      } finally {
         this._debug("#_acquireLock", "end");
      }
   }
   /**
    * Use instead of {@link #getSession} inside the library. It is
    * semantically usually what you want, as getting a session involves some
    * processing afterwards that requires only one client operating on the
    * session at once across multiple tabs or processes.
    */
   async _useSession(e) {
      this._debug("#_useSession", "begin");
      try {
         const t = await this.__loadSession();
         return await e(t);
      } finally {
         this._debug("#_useSession", "end");
      }
   }
   /**
    * NEVER USE DIRECTLY!
    *
    * Always use {@link #_useSession}.
    */
   async __loadSession() {
      this._debug("#__loadSession()", "begin"),
         this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
      try {
         let e = null;
         const t = await ee(this.storage, this.storageKey);
         if (
            (this._debug("#getSession()", "session from storage", t),
            t !== null &&
               (this._isValidSession(t) ? (e = t) : (this._debug("#getSession()", "session from storage is not valid"), await this._removeSession())),
            !e)
         )
            return { data: { session: null }, error: null };
         const s = e.expires_at ? e.expires_at <= Date.now() / 1e3 : !1;
         if ((this._debug("#__loadSession()", `session has${s ? "" : " not"} expired`, "expires_at", e.expires_at), !s))
            return { data: { session: e }, error: null };
         const { session: r, error: i } = await this._callRefreshToken(e.refresh_token);
         return i ? { data: { session: null }, error: i } : { data: { session: r }, error: null };
      } finally {
         this._debug("#__loadSession()", "end");
      }
   }
   /**
    * Gets the current user details if there is an existing session.
    * @param jwt Takes in an optional access token jwt. If no jwt is provided, getUser() will attempt to get the jwt from the current session.
    */
   async getUser(e) {
      return e ? await this._getUser(e) : (await this.initializePromise, this._acquireLock(-1, async () => await this._getUser()));
   }
   async _getUser(e) {
      try {
         return e
            ? await v(this.fetch, "GET", `${this.url}/user`, {
                 headers: this.headers,
                 jwt: e,
                 xform: P,
              })
            : await this._useSession(async (t) => {
                 var s, r;
                 const { data: i, error: o } = t;
                 if (o) throw o;
                 return await v(this.fetch, "GET", `${this.url}/user`, {
                    headers: this.headers,
                    jwt: (r = (s = i.session) === null || s === void 0 ? void 0 : s.access_token) !== null && r !== void 0 ? r : void 0,
                    xform: P,
                 });
              });
      } catch (t) {
         if (p(t)) return { data: { user: null }, error: t };
         throw t;
      }
   }
   /**
    * Updates user data for a logged in user.
    */
   async updateUser(e, t = {}) {
      return await this.initializePromise, await this._acquireLock(-1, async () => await this._updateUser(e, t));
   }
   async _updateUser(e, t = {}) {
      try {
         return await this._useSession(async (s) => {
            const { data: r, error: i } = s;
            if (i) throw i;
            if (!r.session) throw new q();
            const o = r.session;
            let a = null,
               c = null;
            if (this.flowType === "pkce" && e.email != null) {
               const u = N();
               await I(this.storage, `${this.storageKey}-code-verifier`, u), (a = await F(u)), (c = u === a ? "plain" : "s256");
            }
            const { data: l, error: h } = await v(this.fetch, "PUT", `${this.url}/user`, {
               headers: this.headers,
               redirectTo: t == null ? void 0 : t.emailRedirectTo,
               body: Object.assign(Object.assign({}, e), { code_challenge: a, code_challenge_method: c }),
               jwt: o.access_token,
               xform: P,
            });
            if (h) throw h;
            return (
               (o.user = l.user),
               await this._saveSession(o),
               await this._notifyAllSubscribers("USER_UPDATED", o),
               { data: { user: o.user }, error: null }
            );
         });
      } catch (s) {
         if (p(s)) return { data: { user: null }, error: s };
         throw s;
      }
   }
   /**
    * Decodes a JWT (without performing any validation).
    */
   _decodeJWT(e) {
      return Ae(e);
   }
   /**
    * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
    * If the refresh token or access token in the current session is invalid, an error will be thrown.
    * @param currentSession The current session that minimally contains an access token and refresh token.
    */
   async setSession(e) {
      return await this.initializePromise, await this._acquireLock(-1, async () => await this._setSession(e));
   }
   async _setSession(e) {
      try {
         if (!e.access_token || !e.refresh_token) throw new q();
         const t = Date.now() / 1e3;
         let s = t,
            r = !0,
            i = null;
         const o = Ae(e.access_token);
         if ((o.exp && ((s = o.exp), (r = s <= t)), r)) {
            const { session: a, error: c } = await this._callRefreshToken(e.refresh_token);
            if (c) return { data: { user: null, session: null }, error: c };
            if (!a) return { data: { user: null, session: null }, error: null };
            i = a;
         } else {
            const { data: a, error: c } = await this._getUser(e.access_token);
            if (c) throw c;
            (i = {
               access_token: e.access_token,
               refresh_token: e.refresh_token,
               user: a.user,
               token_type: "bearer",
               expires_in: s - t,
               expires_at: s,
            }),
               await this._saveSession(i),
               await this._notifyAllSubscribers("SIGNED_IN", i);
         }
         return { data: { user: i.user, session: i }, error: null };
      } catch (t) {
         if (p(t)) return { data: { session: null, user: null }, error: t };
         throw t;
      }
   }
   /**
    * Returns a new session, regardless of expiry status.
    * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
    * If the current session's refresh token is invalid, an error will be thrown.
    * @param currentSession The current session. If passed in, it must contain a refresh token.
    */
   async refreshSession(e) {
      return await this.initializePromise, await this._acquireLock(-1, async () => await this._refreshSession(e));
   }
   async _refreshSession(e) {
      try {
         return await this._useSession(async (t) => {
            var s;
            if (!e) {
               const { data: o, error: a } = t;
               if (a) throw a;
               e = (s = o.session) !== null && s !== void 0 ? s : void 0;
            }
            if (!(e != null && e.refresh_token)) throw new q();
            const { session: r, error: i } = await this._callRefreshToken(e.refresh_token);
            return i
               ? { data: { user: null, session: null }, error: i }
               : r
               ? { data: { user: r.user, session: r }, error: null }
               : { data: { user: null, session: null }, error: null };
         });
      } catch (t) {
         if (p(t)) return { data: { user: null, session: null }, error: t };
         throw t;
      }
   }
   /**
    * Gets the session data from a URL string
    */
   async _getSessionFromURL(e) {
      try {
         if (!E()) throw new se("No browser detected.");
         if (this.flowType === "implicit" && !this._isImplicitGrantFlow()) throw new se("Not a valid implicit grant flow url.");
         if (this.flowType == "pkce" && !e) throw new Re("Not a valid PKCE flow url.");
         const t = ae(window.location.href);
         if (e) {
            if (!t.code) throw new Re("No code detected.");
            const { data: O, error: $ } = await this._exchangeCodeForSession(t.code);
            if ($) throw $;
            const b = new URL(window.location.href);
            return (
               b.searchParams.delete("code"),
               window.history.replaceState(window.history.state, "", b.toString()),
               { data: { session: O.session, redirectType: null }, error: null }
            );
         }
         if (t.error || t.error_description || t.error_code)
            throw new se(t.error_description || "Error in URL with unspecified error_description", {
               error: t.error || "unspecified_error",
               code: t.error_code || "unspecified_code",
            });
         const { provider_token: s, provider_refresh_token: r, access_token: i, refresh_token: o, expires_in: a, expires_at: c, token_type: l } = t;
         if (!i || !a || !o || !l) throw new se("No session defined in URL");
         const h = Math.round(Date.now() / 1e3),
            u = parseInt(a);
         let d = h + u;
         c && (d = parseInt(c));
         const f = d - h;
         f * 1e3 <= G && console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${f}s, should have been closer to ${u}s`);
         const m = d - u;
         h - m >= 120
            ? console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", m, d, h)
            : h - m < 0 &&
              console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clok for skew", m, d, h);
         const { data: g, error: _ } = await this._getUser(i);
         if (_) throw _;
         const w = {
            provider_token: s,
            provider_refresh_token: r,
            access_token: i,
            expires_in: u,
            expires_at: d,
            refresh_token: o,
            token_type: l,
            user: g.user,
         };
         return (
            (window.location.hash = ""),
            this._debug("#_getSessionFromURL()", "clearing window.location.hash"),
            { data: { session: w, redirectType: t.type }, error: null }
         );
      } catch (t) {
         if (p(t)) return { data: { session: null, redirectType: null }, error: t };
         throw t;
      }
   }
   /**
    * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
    */
   _isImplicitGrantFlow() {
      const e = ae(window.location.href);
      return !!(E() && (e.access_token || e.error_description));
   }
   /**
    * Checks if the current URL and backing storage contain parameters given by a PKCE flow
    */
   async _isPKCEFlow() {
      const e = ae(window.location.href),
         t = await ee(this.storage, `${this.storageKey}-code-verifier`);
      return !!(e.code && t);
   }
   /**
    * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
    *
    * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
    * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
    *
    * If using `others` scope, no `SIGNED_OUT` event is fired!
    */
   async signOut(e = { scope: "global" }) {
      return await this.initializePromise, await this._acquireLock(-1, async () => await this._signOut(e));
   }
   async _signOut({ scope: e } = { scope: "global" }) {
      return await this._useSession(async (t) => {
         var s;
         const { data: r, error: i } = t;
         if (i) return { error: i };
         const o = (s = r.session) === null || s === void 0 ? void 0 : s.access_token;
         if (o) {
            const { error: a } = await this.admin.signOut(o, e);
            if (a && !(is(a) && (a.status === 404 || a.status === 401))) return { error: a };
         }
         return (
            e !== "others" &&
               (await this._removeSession(),
               await ce(this.storage, `${this.storageKey}-code-verifier`),
               await this._notifyAllSubscribers("SIGNED_OUT", null)),
            { error: null }
         );
      });
   }
   /**
    * Receive a notification every time an auth event happens.
    * @param callback A callback function to be invoked when an auth event happens.
    */
   onAuthStateChange(e) {
      const t = Wt(),
         s = {
            id: t,
            callback: e,
            unsubscribe: () => {
               this._debug("#unsubscribe()", "state change callback with id removed", t), this.stateChangeEmitters.delete(t);
            },
         };
      return (
         this._debug("#onAuthStateChange()", "registered callback with id", t),
         this.stateChangeEmitters.set(t, s),
         (async () => (
            await this.initializePromise,
            await this._acquireLock(-1, async () => {
               this._emitInitialSession(t);
            })
         ))(),
         { data: { subscription: s } }
      );
   }
   async _emitInitialSession(e) {
      return await this._useSession(async (t) => {
         var s, r;
         try {
            const {
               data: { session: i },
               error: o,
            } = t;
            if (o) throw o;
            await ((s = this.stateChangeEmitters.get(e)) === null || s === void 0 ? void 0 : s.callback("INITIAL_SESSION", i)),
               this._debug("INITIAL_SESSION", "callback id", e, "session", i);
         } catch (i) {
            await ((r = this.stateChangeEmitters.get(e)) === null || r === void 0 ? void 0 : r.callback("INITIAL_SESSION", null)),
               this._debug("INITIAL_SESSION", "callback id", e, "error", i),
               console.error(i);
         }
      });
   }
   /**
    * Sends a password reset request to an email address. This method supports the PKCE flow.
    *
    * @param email The email address of the user.
    * @param options.redirectTo The URL to send the user to after they click the password reset link.
    * @param options.captchaToken Verification token received when the user completes the captcha on the site.
    */
   async resetPasswordForEmail(e, t = {}) {
      let s = null,
         r = null;
      if (this.flowType === "pkce") {
         const i = N();
         await I(this.storage, `${this.storageKey}-code-verifier`, `${i}/PASSWORD_RECOVERY`), (s = await F(i)), (r = i === s ? "plain" : "s256");
      }
      try {
         return await v(this.fetch, "POST", `${this.url}/recover`, {
            body: {
               email: e,
               code_challenge: s,
               code_challenge_method: r,
               gotrue_meta_security: { captcha_token: t.captchaToken },
            },
            headers: this.headers,
            redirectTo: t.redirectTo,
         });
      } catch (i) {
         if (p(i)) return { data: null, error: i };
         throw i;
      }
   }
   /**
    * Gets all the identities linked to a user.
    */
   async getUserIdentities() {
      var e;
      try {
         const { data: t, error: s } = await this.getUser();
         if (s) throw s;
         return { data: { identities: (e = t.user.identities) !== null && e !== void 0 ? e : [] }, error: null };
      } catch (t) {
         if (p(t)) return { data: null, error: t };
         throw t;
      }
   }
   /**
    * Links an oauth identity to an existing user.
    * This method supports the PKCE flow.
    */
   async linkIdentity(e) {
      var t;
      try {
         const { data: s, error: r } = await this._useSession(async (i) => {
            var o, a, c, l, h;
            const { data: u, error: d } = i;
            if (d) throw d;
            const f = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, e.provider, {
               redirectTo: (o = e.options) === null || o === void 0 ? void 0 : o.redirectTo,
               scopes: (a = e.options) === null || a === void 0 ? void 0 : a.scopes,
               queryParams: (c = e.options) === null || c === void 0 ? void 0 : c.queryParams,
               skipBrowserRedirect: !0,
            });
            return await v(this.fetch, "GET", f, {
               headers: this.headers,
               jwt: (h = (l = u.session) === null || l === void 0 ? void 0 : l.access_token) !== null && h !== void 0 ? h : void 0,
            });
         });
         if (r) throw r;
         return (
            E() && !(!((t = e.options) === null || t === void 0) && t.skipBrowserRedirect) && window.location.assign(s == null ? void 0 : s.url),
            { data: { provider: e.provider, url: s == null ? void 0 : s.url }, error: null }
         );
      } catch (s) {
         if (p(s)) return { data: { provider: e.provider, url: null }, error: s };
         throw s;
      }
   }
   /**
    * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
    */
   async unlinkIdentity(e) {
      try {
         return await this._useSession(async (t) => {
            var s, r;
            const { data: i, error: o } = t;
            if (o) throw o;
            return await v(this.fetch, "DELETE", `${this.url}/user/identities/${e.identity_id}`, {
               headers: this.headers,
               jwt: (r = (s = i.session) === null || s === void 0 ? void 0 : s.access_token) !== null && r !== void 0 ? r : void 0,
            });
         });
      } catch (t) {
         if (p(t)) return { data: null, error: t };
         throw t;
      }
   }
   /**
    * Generates a new JWT.
    * @param refreshToken A valid refresh token that was returned on login.
    */
   async _refreshAccessToken(e) {
      const t = `#_refreshAccessToken(${e.substring(0, 5)}...)`;
      this._debug(t, "begin");
      try {
         const s = Date.now();
         return await Zt(
            async (r) => (
               await Qt(r * 200),
               this._debug(t, "refreshing attempt", r),
               await v(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
                  body: { refresh_token: e },
                  headers: this.headers,
                  xform: C,
               })
            ),
            (r, i, o) =>
               o &&
               o.error &&
               he(o.error) && // retryable only if the request can be sent before the backoff overflows the tick duration
               Date.now() + (r + 1) * 200 - s < G
         );
      } catch (s) {
         if ((this._debug(t, "error", s), p(s))) return { data: { session: null, user: null }, error: s };
         throw s;
      } finally {
         this._debug(t, "end");
      }
   }
   _isValidSession(e) {
      return typeof e == "object" && e !== null && "access_token" in e && "refresh_token" in e && "expires_at" in e;
   }
   async _handleProviderSignIn(e, t) {
      const s = await this._getUrlForProvider(`${this.url}/authorize`, e, {
         redirectTo: t.redirectTo,
         scopes: t.scopes,
         queryParams: t.queryParams,
      });
      return (
         this._debug("#_handleProviderSignIn()", "provider", e, "options", t, "url", s),
         E() && !t.skipBrowserRedirect && window.location.assign(s),
         { data: { provider: e, url: s }, error: null }
      );
   }
   /**
    * Recovers the session from LocalStorage and refreshes
    * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
    */
   async _recoverAndRefresh() {
      var e;
      const t = "#_recoverAndRefresh()";
      this._debug(t, "begin");
      try {
         const s = await ee(this.storage, this.storageKey);
         if ((this._debug(t, "session from storage", s), !this._isValidSession(s))) {
            this._debug(t, "session is not valid"), s !== null && (await this._removeSession());
            return;
         }
         const r = Math.round(Date.now() / 1e3),
            i = ((e = s.expires_at) !== null && e !== void 0 ? e : 1 / 0) < r + Ie;
         if ((this._debug(t, `session has${i ? "" : " not"} expired with margin of ${Ie}s`), i)) {
            if (this.autoRefreshToken && s.refresh_token) {
               const { error: o } = await this._callRefreshToken(s.refresh_token);
               o &&
                  (console.error(o),
                  he(o) || (this._debug(t, "refresh failed with a non-retryable error, removing the session", o), await this._removeSession()));
            }
         } else await this._notifyAllSubscribers("SIGNED_IN", s);
      } catch (s) {
         this._debug(t, "error", s), console.error(s);
         return;
      } finally {
         this._debug(t, "end");
      }
   }
   async _callRefreshToken(e) {
      var t, s;
      if (!e) throw new q();
      if (this.refreshingDeferred) return this.refreshingDeferred.promise;
      const r = `#_callRefreshToken(${e.substring(0, 5)}...)`;
      this._debug(r, "begin");
      try {
         this.refreshingDeferred = new ie();
         const { data: i, error: o } = await this._refreshAccessToken(e);
         if (o) throw o;
         if (!i.session) throw new q();
         await this._saveSession(i.session), await this._notifyAllSubscribers("TOKEN_REFRESHED", i.session);
         const a = { session: i.session, error: null };
         return this.refreshingDeferred.resolve(a), a;
      } catch (i) {
         if ((this._debug(r, "error", i), p(i))) {
            const o = { session: null, error: i };
            return (
               he(i) || (await this._removeSession(), await this._notifyAllSubscribers("SIGNED_OUT", null)),
               (t = this.refreshingDeferred) === null || t === void 0 || t.resolve(o),
               o
            );
         }
         throw ((s = this.refreshingDeferred) === null || s === void 0 || s.reject(i), i);
      } finally {
         (this.refreshingDeferred = null), this._debug(r, "end");
      }
   }
   async _notifyAllSubscribers(e, t, s = !0) {
      const r = `#_notifyAllSubscribers(${e})`;
      this._debug(r, "begin", t, `broadcast = ${s}`);
      try {
         this.broadcastChannel && s && this.broadcastChannel.postMessage({ event: e, session: t });
         const i = [],
            o = Array.from(this.stateChangeEmitters.values()).map(async (a) => {
               try {
                  await a.callback(e, t);
               } catch (c) {
                  i.push(c);
               }
            });
         if ((await Promise.all(o), i.length > 0)) {
            for (let a = 0; a < i.length; a += 1) console.error(i[a]);
            throw i[0];
         }
      } finally {
         this._debug(r, "end");
      }
   }
   /**
    * set currentSession and currentUser
    * process to _startAutoRefreshToken if possible
    */
   async _saveSession(e) {
      this._debug("#_saveSession()", e), await I(this.storage, this.storageKey, e);
   }
   async _removeSession() {
      this._debug("#_removeSession()"), await ce(this.storage, this.storageKey);
   }
   /**
    * Removes any registered visibilitychange callback.
    *
    * {@see #startAutoRefresh}
    * {@see #stopAutoRefresh}
    */
   _removeVisibilityChangedCallback() {
      this._debug("#_removeVisibilityChangedCallback()");
      const e = this.visibilityChangedCallback;
      this.visibilityChangedCallback = null;
      try {
         e && E() && window != null && window.removeEventListener && window.removeEventListener("visibilitychange", e);
      } catch (t) {
         console.error("removing visibilitychange callback failed", t);
      }
   }
   /**
    * This is the private implementation of {@link #startAutoRefresh}. Use this
    * within the library.
    */
   async _startAutoRefresh() {
      await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
      const e = setInterval(() => this._autoRefreshTokenTick(), G);
      (this.autoRefreshTicker = e),
         e && typeof e == "object" && typeof e.unref == "function"
            ? e.unref()
            : typeof Deno < "u" && typeof Deno.unrefTimer == "function" && Deno.unrefTimer(e),
         setTimeout(async () => {
            await this.initializePromise, await this._autoRefreshTokenTick();
         }, 0);
   }
   /**
    * This is the private implementation of {@link #stopAutoRefresh}. Use this
    * within the library.
    */
   async _stopAutoRefresh() {
      this._debug("#_stopAutoRefresh()");
      const e = this.autoRefreshTicker;
      (this.autoRefreshTicker = null), e && clearInterval(e);
   }
   /**
    * Starts an auto-refresh process in the background. The session is checked
    * every few seconds. Close to the time of expiration a process is started to
    * refresh the session. If refreshing fails it will be retried for as long as
    * necessary.
    *
    * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
    * to call this function, it will be called for you.
    *
    * On browsers the refresh process works only when the tab/window is in the
    * foreground to conserve resources as well as prevent race conditions and
    * flooding auth with requests. If you call this method any managed
    * visibility change callback will be removed and you must manage visibility
    * changes on your own.
    *
    * On non-browser platforms the refresh process works *continuously* in the
    * background, which may not be desirable. You should hook into your
    * platform's foreground indication mechanism and call these methods
    * appropriately to conserve resources.
    *
    * {@see #stopAutoRefresh}
    */
   async startAutoRefresh() {
      this._removeVisibilityChangedCallback(), await this._startAutoRefresh();
   }
   /**
    * Stops an active auto refresh process running in the background (if any).
    *
    * If you call this method any managed visibility change callback will be
    * removed and you must manage visibility changes on your own.
    *
    * See {@link #startAutoRefresh} for more details.
    */
   async stopAutoRefresh() {
      this._removeVisibilityChangedCallback(), await this._stopAutoRefresh();
   }
   /**
    * Runs the auto refresh token tick.
    */
   async _autoRefreshTokenTick() {
      this._debug("#_autoRefreshTokenTick()", "begin");
      try {
         await this._acquireLock(0, async () => {
            try {
               const e = Date.now();
               try {
                  return await this._useSession(async (t) => {
                     const {
                        data: { session: s },
                     } = t;
                     if (!s || !s.refresh_token || !s.expires_at) {
                        this._debug("#_autoRefreshTokenTick()", "no session");
                        return;
                     }
                     const r = Math.floor((s.expires_at * 1e3 - e) / G);
                     this._debug(
                        "#_autoRefreshTokenTick()",
                        `access token expires in ${r} ticks, a tick lasts ${G}ms, refresh threshold is ${Le} ticks`
                     ),
                        r <= Le && (await this._callRefreshToken(s.refresh_token));
                  });
               } catch (t) {
                  console.error("Auto refresh tick failed with error. This is likely a transient error.", t);
               }
            } finally {
               this._debug("#_autoRefreshTokenTick()", "end");
            }
         });
      } catch (e) {
         if (e.isAcquireTimeout || e instanceof We) this._debug("auto refresh token tick lock not available");
         else throw e;
      }
   }
   /**
    * Registers callbacks on the browser / platform, which in-turn run
    * algorithms when the browser window/tab are in foreground. On non-browser
    * platforms it assumes always foreground.
    */
   async _handleVisibilityChange() {
      if ((this._debug("#_handleVisibilityChange()"), !E() || !(window != null && window.addEventListener)))
         return this.autoRefreshToken && this.startAutoRefresh(), !1;
      try {
         (this.visibilityChangedCallback = async () => await this._onVisibilityChanged(!1)),
            window == null || window.addEventListener("visibilitychange", this.visibilityChangedCallback),
            await this._onVisibilityChanged(!0);
      } catch (e) {
         console.error("_handleVisibilityChange", e);
      }
   }
   /**
    * Callback registered with `window.addEventListener('visibilitychange')`.
    */
   async _onVisibilityChanged(e) {
      const t = `#_onVisibilityChanged(${e})`;
      this._debug(t, "visibilityState", document.visibilityState),
         document.visibilityState === "visible"
            ? (this.autoRefreshToken && this._startAutoRefresh(),
              e ||
                 (await this.initializePromise,
                 await this._acquireLock(-1, async () => {
                    if (document.visibilityState !== "visible") {
                       this._debug(t, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
                       return;
                    }
                    await this._recoverAndRefresh();
                 })))
            : document.visibilityState === "hidden" && this.autoRefreshToken && this._stopAutoRefresh();
   }
   /**
    * Generates the relevant login URL for a third-party provider.
    * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
    * @param options.scopes A space-separated list of scopes granted to the OAuth application.
    * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
    */
   async _getUrlForProvider(e, t, s) {
      const r = [`provider=${encodeURIComponent(t)}`];
      if (
         (s != null && s.redirectTo && r.push(`redirect_to=${encodeURIComponent(s.redirectTo)}`),
         s != null && s.scopes && r.push(`scopes=${encodeURIComponent(s.scopes)}`),
         this.flowType === "pkce")
      ) {
         const i = N();
         await I(this.storage, `${this.storageKey}-code-verifier`, i);
         const o = await F(i),
            a = i === o ? "plain" : "s256";
         this._debug("PKCE", "code verifier", `${i.substring(0, 5)}...`, "code challenge", o, "method", a);
         const c = new URLSearchParams({
            code_challenge: `${encodeURIComponent(o)}`,
            code_challenge_method: `${encodeURIComponent(a)}`,
         });
         r.push(c.toString());
      }
      if (s != null && s.queryParams) {
         const i = new URLSearchParams(s.queryParams);
         r.push(i.toString());
      }
      return s != null && s.skipBrowserRedirect && r.push(`skip_http_redirect=${s.skipBrowserRedirect}`), `${e}?${r.join("&")}`;
   }
   async _unenroll(e) {
      try {
         return await this._useSession(async (t) => {
            var s;
            const { data: r, error: i } = t;
            return i
               ? { data: null, error: i }
               : await v(this.fetch, "DELETE", `${this.url}/factors/${e.factorId}`, {
                    headers: this.headers,
                    jwt: (s = r == null ? void 0 : r.session) === null || s === void 0 ? void 0 : s.access_token,
                 });
         });
      } catch (t) {
         if (p(t)) return { data: null, error: t };
         throw t;
      }
   }
   /**
    * {@see GoTrueMFAApi#enroll}
    */
   async _enroll(e) {
      try {
         return await this._useSession(async (t) => {
            var s, r;
            const { data: i, error: o } = t;
            if (o) return { data: null, error: o };
            const { data: a, error: c } = await v(this.fetch, "POST", `${this.url}/factors`, {
               body: {
                  friendly_name: e.friendlyName,
                  factor_type: e.factorType,
                  issuer: e.issuer,
               },
               headers: this.headers,
               jwt: (s = i == null ? void 0 : i.session) === null || s === void 0 ? void 0 : s.access_token,
            });
            return c
               ? { data: null, error: c }
               : (!((r = a == null ? void 0 : a.totp) === null || r === void 0) &&
                    r.qr_code &&
                    (a.totp.qr_code = `data:image/svg+xml;utf-8,${a.totp.qr_code}`),
                 { data: a, error: null });
         });
      } catch (t) {
         if (p(t)) return { data: null, error: t };
         throw t;
      }
   }
   /**
    * {@see GoTrueMFAApi#verify}
    */
   async _verify(e) {
      return this._acquireLock(-1, async () => {
         try {
            return await this._useSession(async (t) => {
               var s;
               const { data: r, error: i } = t;
               if (i) return { data: null, error: i };
               const { data: o, error: a } = await v(this.fetch, "POST", `${this.url}/factors/${e.factorId}/verify`, {
                  body: { code: e.code, challenge_id: e.challengeId },
                  headers: this.headers,
                  jwt: (s = r == null ? void 0 : r.session) === null || s === void 0 ? void 0 : s.access_token,
               });
               return a
                  ? { data: null, error: a }
                  : (await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + o.expires_in }, o)),
                    await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", o),
                    { data: o, error: a });
            });
         } catch (t) {
            if (p(t)) return { data: null, error: t };
            throw t;
         }
      });
   }
   /**
    * {@see GoTrueMFAApi#challenge}
    */
   async _challenge(e) {
      return this._acquireLock(-1, async () => {
         try {
            return await this._useSession(async (t) => {
               var s;
               const { data: r, error: i } = t;
               return i
                  ? { data: null, error: i }
                  : await v(this.fetch, "POST", `${this.url}/factors/${e.factorId}/challenge`, {
                       headers: this.headers,
                       jwt: (s = r == null ? void 0 : r.session) === null || s === void 0 ? void 0 : s.access_token,
                    });
            });
         } catch (t) {
            if (p(t)) return { data: null, error: t };
            throw t;
         }
      });
   }
   /**
    * {@see GoTrueMFAApi#challengeAndVerify}
    */
   async _challengeAndVerify(e) {
      const { data: t, error: s } = await this._challenge({
         factorId: e.factorId,
      });
      return s
         ? { data: null, error: s }
         : await this._verify({
              factorId: e.factorId,
              challengeId: t.id,
              code: e.code,
           });
   }
   /**
    * {@see GoTrueMFAApi#listFactors}
    */
   async _listFactors() {
      const {
         data: { user: e },
         error: t,
      } = await this.getUser();
      if (t) return { data: null, error: t };
      const s = (e == null ? void 0 : e.factors) || [],
         r = s.filter((i) => i.factor_type === "totp" && i.status === "verified");
      return {
         data: {
            all: s,
            totp: r,
         },
         error: null,
      };
   }
   /**
    * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
    */
   async _getAuthenticatorAssuranceLevel() {
      return this._acquireLock(
         -1,
         async () =>
            await this._useSession(async (e) => {
               var t, s;
               const {
                  data: { session: r },
                  error: i,
               } = e;
               if (i) return { data: null, error: i };
               if (!r)
                  return {
                     data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
                     error: null,
                  };
               const o = this._decodeJWT(r.access_token);
               let a = null;
               o.aal && (a = o.aal);
               let c = a;
               ((s = (t = r.user.factors) === null || t === void 0 ? void 0 : t.filter((u) => u.status === "verified")) !== null && s !== void 0
                  ? s
                  : []
               ).length > 0 && (c = "aal2");
               const h = o.amr || [];
               return { data: { currentLevel: a, nextLevel: c, currentAuthenticationMethods: h }, error: null };
            })
      );
   }
}
X.nextInstanceID = 0;
class Ts extends X {
   constructor(e) {
      super(e);
   }
}
var Os = function (n, e, t, s) {
   function r(i) {
      return i instanceof t
         ? i
         : new t(function (o) {
              o(i);
           });
   }
   return new (t || (t = Promise))(function (i, o) {
      function a(h) {
         try {
            l(s.next(h));
         } catch (u) {
            o(u);
         }
      }
      function c(h) {
         try {
            l(s.throw(h));
         } catch (u) {
            o(u);
         }
      }
      function l(h) {
         h.done ? i(h.value) : r(h.value).then(a, c);
      }
      l((s = s.apply(n, e || [])).next());
   });
};
const Es = {
      headers: Mt,
   },
   js = {
      schema: "public",
   },
   $s = {
      autoRefreshToken: !0,
      persistSession: !0,
      detectSessionInUrl: !0,
      flowType: "implicit",
   },
   As = {};
class Rs {
   /**
    * Create a new client for use in the browser.
    * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
    * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
    * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
    * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
    * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
    * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
    * @param options.realtime Options passed along to realtime-js constructor.
    * @param options.global.fetch A custom fetch implementation.
    * @param options.global.headers Any additional headers to send with each network request.
    */
   constructor(e, t, s) {
      var r, i, o, a, c, l, h, u;
      if (
         ((this.supabaseUrl = e),
         (this.supabaseKey = t),
         (this.from = (_) => this.rest.from(_)),
         (this.schema = (_) => this.rest.schema(_)),
         (this.rpc = (_, w = {}, O) => this.rest.rpc(_, w, O)),
         !e)
      )
         throw new Error("supabaseUrl is required.");
      if (!t) throw new Error("supabaseKey is required.");
      const d = Kt(e);
      (this.realtimeUrl = `${d}/realtime/v1`.replace(/^http/i, "ws")),
         (this.authUrl = `${d}/auth/v1`),
         (this.storageUrl = `${d}/storage/v1`),
         (this.functionsUrl = `${d}/functions/v1`);
      const f = `sb-${new URL(this.authUrl).hostname.split(".")[0]}-auth-token`,
         m = {
            db: js,
            realtime: As,
            auth: Object.assign(Object.assign({}, $s), { storageKey: f }),
            global: Es,
         },
         g = Gt(s ?? {}, m);
      (this.storageKey = (i = (r = g.auth) === null || r === void 0 ? void 0 : r.storageKey) !== null && i !== void 0 ? i : ""),
         (this.headers = (a = (o = g.global) === null || o === void 0 ? void 0 : o.headers) !== null && a !== void 0 ? a : {}),
         (this.auth = this._initSupabaseAuthClient(
            (c = g.auth) !== null && c !== void 0 ? c : {},
            this.headers,
            (l = g.global) === null || l === void 0 ? void 0 : l.fetch
         )),
         (this.fetch = Ht(t, this._getAccessToken.bind(this), (h = g.global) === null || h === void 0 ? void 0 : h.fetch)),
         (this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers }, g.realtime))),
         (this.rest = new ve(`${d}/rest/v1`, {
            headers: this.headers,
            schema: (u = g.db) === null || u === void 0 ? void 0 : u.schema,
            fetch: this.fetch,
         })),
         this._listenForAuthEvents();
   }
   /**
    * Supabase Functions allows you to deploy and invoke edge functions.
    */
   get functions() {
      return new st(this.functionsUrl, {
         headers: this.headers,
         customFetch: this.fetch,
      });
   }
   /**
    * Supabase Storage allows you to manage user-generated content, such as photos or videos.
    */
   get storage() {
      return new Ft(this.storageUrl, this.headers, this.fetch);
   }
   /**
    * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
    *
    * @param {string} name - The name of the Realtime channel.
    * @param {Object} opts - The options to pass to the Realtime channel.
    *
    */
   channel(e, t = { config: {} }) {
      return this.realtime.channel(e, t);
   }
   /**
    * Returns all Realtime channels.
    */
   getChannels() {
      return this.realtime.getChannels();
   }
   /**
    * Unsubscribes and removes Realtime channel from Realtime client.
    *
    * @param {RealtimeChannel} channel - The name of the Realtime channel.
    *
    */
   removeChannel(e) {
      return this.realtime.removeChannel(e);
   }
   /**
    * Unsubscribes and removes all Realtime channels from Realtime client.
    */
   removeAllChannels() {
      return this.realtime.removeAllChannels();
   }
   _getAccessToken() {
      var e, t;
      return Os(this, void 0, void 0, function* () {
         const { data: s } = yield this.auth.getSession();
         return (t = (e = s.session) === null || e === void 0 ? void 0 : e.access_token) !== null && t !== void 0 ? t : null;
      });
   }
   _initSupabaseAuthClient(
      { autoRefreshToken: e, persistSession: t, detectSessionInUrl: s, storage: r, storageKey: i, flowType: o, debug: a },
      c,
      l
   ) {
      const h = {
         Authorization: `Bearer ${this.supabaseKey}`,
         apikey: `${this.supabaseKey}`,
      };
      return new Ts({
         url: this.authUrl,
         headers: Object.assign(Object.assign({}, h), c),
         storageKey: i,
         autoRefreshToken: e,
         persistSession: t,
         detectSessionInUrl: s,
         storage: r,
         flowType: o,
         debug: a,
         fetch: l,
      });
   }
   _initRealtimeClient(e) {
      return new Et(
         this.realtimeUrl,
         Object.assign(Object.assign({}, e), { params: Object.assign({ apikey: this.supabaseKey }, e == null ? void 0 : e.params) })
      );
   }
   _listenForAuthEvents() {
      return this.auth.onAuthStateChange((t, s) => {
         this._handleTokenChanged(t, "CLIENT", s == null ? void 0 : s.access_token);
      });
   }
   _handleTokenChanged(e, t, s) {
      (e === "TOKEN_REFRESHED" || e === "SIGNED_IN") && this.changedAccessToken !== s
         ? (this.realtime.setAuth(s ?? null), (this.changedAccessToken = s))
         : e === "SIGNED_OUT" && (this.realtime.setAuth(this.supabaseKey), t == "STORAGE" && this.auth.signOut(), (this.changedAccessToken = void 0));
   }
}
const Ye = (n, e, t) => new Rs(n, e, t);
function Ps({ poll: n, user: e }) {
   const t = Ye(
         "https://cmdpjhmqoqpkfwxqdekb.supabase.co",
         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZHBqaG1xb3Fwa2Z3eHFkZWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzMTY5MTAsImV4cCI6MjAyMTg5MjkxMH0.YhScL14jXQKyzFIAsIh9y3tujE0metKzw_N4Gwhnezg"
      ),
      [s, r] = Ne(!1),
      i = 9999,
      o = async () => {
         let { data: c, error: l } = await t.from("responses").select("*").eq("user_id", e.id).eq("poll_id", n.id);
         return c;
      };
   Fe(() => {
      var c = new Date(/* @__PURE__ */ new Date().getTime() - 6048e5);
      n.active &&
         ((e.created_at && new Date(e.created_at) > c) ||
            new Date(n.active_until) < /* @__PURE__ */ new Date() ||
            o().then((l) => {
               if (l.length) return;
               const h = setTimeout(() => {
                  r(!0);
               }, n.time_delay_ms);
               return () => clearTimeout(h);
            }));
   }, []);
   const a = async (c) => {
      await t.from("responses").insert({ user_id: e.id, poll_id: n.id, response_data: c });
   };
   return /* @__PURE__ */ A(De, {
      children: /* @__PURE__ */ be("div", {
         style: {
            opacity: s ? 1 : 0,
            pointerEvents: s ? "all" : "none",
         },
         className: "transition duration-150 ease-in-out",
         children: [
            /* @__PURE__ */ A("div", {
               onClick: () => {
                  r(!1), a({});
               },
               style: {
                  zIndex: i - 1,
               },
               className: "fixed inset-0 z-50 bg-white/80 w-full h-full dark:bg-neutral-950/60",
            }),
            /* @__PURE__ */ be("div", {
               style: {
                  zIndex: i,
               },
               className:
                  "flex bg-white dark:bg-neutral-900 select-none flex-col gap-3 w-[500px] min-h-[100px] rounded-lg border  dark:border-neutral-700 border-neutral-300 absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 p-6",
               children: [
                  /* @__PURE__ */ A("p", {
                     className: "font-bold tracking-tight text-neutral-900 text-lg dark:text-neutral-100",
                     children: n.poll_data.title,
                  }),
                  /* @__PURE__ */ A("p", { className: "text-neutral-600 dark:text-neutral-400 text-sm", children: n.poll_data.subtitle }),
                  /* @__PURE__ */ A("div", {
                     className: "w-full  text-sm gap-2.5 grid grid-cols-2  ",
                     children: n.poll_data.options.map((c, l) =>
                        /* @__PURE__ */ A(
                           "button",
                           {
                              onClick: () => {
                                 a({ option_id: c.id }), r(!1);
                              },
                              className:
                                 "w-full h-10  py-2 rounded-md border dark:hover:bg-neutral-700 dark:border-neutral-700 border-neutral-300 justify-start items-center p-3 flex hover:bg-neutral-100 transition",
                              children: /* @__PURE__ */ A("div", { className: "dark:text-white text-black", children: c.title }),
                           },
                           l
                        )
                     ),
                  }),
               ],
            }),
         ],
      }),
   });
}
function Cs({ user: n }) {
   const [e, t] = Ne([]),
      s = Ye(
         "https://cmdpjhmqoqpkfwxqdekb.supabase.co",
         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZHBqaG1xb3Fwa2Z3eHFkZWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzMTY5MTAsImV4cCI6MjAyMTg5MjkxMH0.YhScL14jXQKyzFIAsIh9y3tujE0metKzw_N4Gwhnezg"
      );
   return (
      Fe(() => {
         s.from("polls")
            .select("*")
            .then((r) => {
               t(r.data);
            });
      }, []),
      /* @__PURE__ */ A("div", {
         className: "dark",
         children: /* @__PURE__ */ A(De, { children: e.length ? /* @__PURE__ */ A(Ps, { user: n, poll: e[0] }) : null }),
      })
   );
}
function Ls(n) {
   return `Hello ${n}!`;
}
export { Cs as Index, Ls as helloAnything };
