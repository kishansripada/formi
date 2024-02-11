import { jsx as au, Fragment as hO, jsxs as pO } from "react/jsx-runtime";
import tC, { useState as vO, useEffect as nC, useRef as mO } from "react";
const yO = (d) => {
  let u;
  return d ? u = d : typeof fetch > "u" ? u = (...s) => Promise.resolve().then(() => sp).then(({ default: h }) => h(...s)) : u = fetch, (...s) => u(...s);
};
class Lw extends Error {
  constructor(u, s = "FunctionsError", h) {
    super(u), this.name = s, this.context = h;
  }
}
class gO extends Lw {
  constructor(u) {
    super("Failed to send a request to the Edge Function", "FunctionsFetchError", u);
  }
}
class SO extends Lw {
  constructor(u) {
    super("Relay Error invoking the Edge Function", "FunctionsRelayError", u);
  }
}
class wO extends Lw {
  constructor(u) {
    super("Edge Function returned a non-2xx status code", "FunctionsHttpError", u);
  }
}
var bO = function (d, u, s, h) {
  function g(w) {
    return w instanceof s ? w : new s(function (m) {
      m(w);
    });
  }
  return new (s || (s = Promise))(function (w, m) {
    function _(O) {
      try {
        R(h.next(O));
      } catch (U) {
        m(U);
      }
    }
    function C(O) {
      try {
        R(h.throw(O));
      } catch (U) {
        m(U);
      }
    }
    function R(O) {
      O.done ? w(O.value) : g(O.value).then(_, C);
    }
    R((h = h.apply(d, u || [])).next());
  });
};
class EO {
  constructor(u, { headers: s = {}, customFetch: h } = {}) {
    this.url = u, this.headers = s, this.fetch = yO(h);
  }
  /**
   * Updates the authorization header
   * @param token - the new jwt token sent in the authorisation header
   */
  setAuth(u) {
    this.headers.Authorization = `Bearer ${u}`;
  }
  /**
   * Invokes a function
   * @param functionName - The name of the Function to invoke.
   * @param options - Options for invoking the Function.
   */
  invoke(u, s = {}) {
    var h;
    return bO(this, void 0, void 0, function* () {
      try {
        const { headers: g, method: w, body: m } = s;
        let _ = {}, C;
        m && (g && !Object.prototype.hasOwnProperty.call(g, "Content-Type") || !g) && (typeof Blob < "u" && m instanceof Blob || m instanceof ArrayBuffer ? (_["Content-Type"] = "application/octet-stream", C = m) : typeof m == "string" ? (_["Content-Type"] = "text/plain", C = m) : typeof FormData < "u" && m instanceof FormData ? C = m : (_["Content-Type"] = "application/json", C = JSON.stringify(m)));
        const R = yield this.fetch(`${this.url}/${u}`, {
          method: w || "POST",
          // headers priority is (high to low):
          // 1. invoke-level headers
          // 2. client-level headers
          // 3. default Content-Type header
          headers: Object.assign(Object.assign(Object.assign({}, _), this.headers), g),
          body: C
        }).catch((B) => {
          throw new gO(B);
        }), O = R.headers.get("x-relay-error");
        if (O && O === "true")
          throw new SO(R);
        if (!R.ok)
          throw new wO(R);
        let U = ((h = R.headers.get("Content-Type")) !== null && h !== void 0 ? h : "text/plain").split(";")[0].trim(), $;
        return U === "application/json" ? $ = yield R.json() : U === "application/octet-stream" ? $ = yield R.blob() : U === "multipart/form-data" ? $ = yield R.formData() : $ = yield R.text(), { data: $, error: null };
      } catch (g) {
        return { data: null, error: g };
      }
    });
  }
}
var _O = function () {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("unable to locate global object");
}, Uf = _O();
const CO = Uf.fetch, Aw = Uf.fetch.bind(Uf), rC = Uf.Headers, xO = Uf.Request, TO = Uf.Response, sp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Headers: rC,
  Request: xO,
  Response: TO,
  default: Aw,
  fetch: CO
}, Symbol.toStringTag, { value: "Module" }));
class RO extends Error {
  constructor(u) {
    super(u.message), this.name = "PostgrestError", this.details = u.details, this.hint = u.hint, this.code = u.code;
  }
}
class kO {
  constructor(u) {
    this.shouldThrowOnError = !1, this.method = u.method, this.url = u.url, this.headers = u.headers, this.schema = u.schema, this.body = u.body, this.shouldThrowOnError = u.shouldThrowOnError, this.signal = u.signal, this.isMaybeSingle = u.isMaybeSingle, u.fetch ? this.fetch = u.fetch : typeof fetch > "u" ? this.fetch = Aw : this.fetch = fetch;
  }
  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   *
   * {@link https://github.com/supabase/supabase-js/issues/92}
   */
  throwOnError() {
    return this.shouldThrowOnError = !0, this;
  }
  then(u, s) {
    this.schema === void 0 || (["GET", "HEAD"].includes(this.method) ? this.headers["Accept-Profile"] = this.schema : this.headers["Content-Profile"] = this.schema), this.method !== "GET" && this.method !== "HEAD" && (this.headers["Content-Type"] = "application/json");
    const h = this.fetch;
    let g = h(this.url.toString(), {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
      signal: this.signal
    }).then(async (w) => {
      var m, _, C;
      let R = null, O = null, U = null, $ = w.status, B = w.statusText;
      if (w.ok) {
        if (this.method !== "HEAD") {
          const Je = await w.text();
          Je === "" || (this.headers.Accept === "text/csv" || this.headers.Accept && this.headers.Accept.includes("application/vnd.pgrst.plan+text") ? O = Je : O = JSON.parse(Je));
        }
        const ee = (m = this.headers.Prefer) === null || m === void 0 ? void 0 : m.match(/count=(exact|planned|estimated)/), re = (_ = w.headers.get("content-range")) === null || _ === void 0 ? void 0 : _.split("/");
        ee && re && re.length > 1 && (U = parseInt(re[1])), this.isMaybeSingle && this.method === "GET" && Array.isArray(O) && (O.length > 1 ? (R = {
          // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
          code: "PGRST116",
          details: `Results contain ${O.length} rows, application/vnd.pgrst.object+json requires 1 row`,
          hint: null,
          message: "JSON object requested, multiple (or no) rows returned"
        }, O = null, U = null, $ = 406, B = "Not Acceptable") : O.length === 1 ? O = O[0] : O = null);
      } else {
        const ee = await w.text();
        try {
          R = JSON.parse(ee), Array.isArray(R) && w.status === 404 && (O = [], R = null, $ = 200, B = "OK");
        } catch {
          w.status === 404 && ee === "" ? ($ = 204, B = "No Content") : R = {
            message: ee
          };
        }
        if (R && this.isMaybeSingle && (!((C = R == null ? void 0 : R.details) === null || C === void 0) && C.includes("0 rows")) && (R = null, $ = 200, B = "OK"), R && this.shouldThrowOnError)
          throw new RO(R);
      }
      return {
        error: R,
        data: O,
        count: U,
        status: $,
        statusText: B
      };
    });
    return this.shouldThrowOnError || (g = g.catch((w) => {
      var m, _, C;
      return {
        error: {
          message: `${(m = w == null ? void 0 : w.name) !== null && m !== void 0 ? m : "FetchError"}: ${w == null ? void 0 : w.message}`,
          details: `${(_ = w == null ? void 0 : w.stack) !== null && _ !== void 0 ? _ : ""}`,
          hint: "",
          code: `${(C = w == null ? void 0 : w.code) !== null && C !== void 0 ? C : ""}`
        },
        data: null,
        count: null,
        status: 0,
        statusText: ""
      };
    })), g.then(u, s);
  }
}
class DO extends kO {
  /**
   * Perform a SELECT on the query result.
   *
   * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
   * return modified rows. By calling this method, modified rows are returned in
   * `data`.
   *
   * @param columns - The columns to retrieve, separated by commas
   */
  select(u) {
    let s = !1;
    const h = (u ?? "*").split("").map((g) => /\s/.test(g) && !s ? "" : (g === '"' && (s = !s), g)).join("");
    return this.url.searchParams.set("select", h), this.headers.Prefer && (this.headers.Prefer += ","), this.headers.Prefer += "return=representation", this;
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
  order(u, { ascending: s = !0, nullsFirst: h, foreignTable: g, referencedTable: w = g } = {}) {
    const m = w ? `${w}.order` : "order", _ = this.url.searchParams.get(m);
    return this.url.searchParams.set(m, `${_ ? `${_},` : ""}${u}.${s ? "asc" : "desc"}${h === void 0 ? "" : h ? ".nullsfirst" : ".nullslast"}`), this;
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
  limit(u, { foreignTable: s, referencedTable: h = s } = {}) {
    const g = typeof h > "u" ? "limit" : `${h}.limit`;
    return this.url.searchParams.set(g, `${u}`), this;
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
  range(u, s, { foreignTable: h, referencedTable: g = h } = {}) {
    const w = typeof g > "u" ? "offset" : `${g}.offset`, m = typeof g > "u" ? "limit" : `${g}.limit`;
    return this.url.searchParams.set(w, `${u}`), this.url.searchParams.set(m, `${s - u + 1}`), this;
  }
  /**
   * Set the AbortSignal for the fetch request.
   *
   * @param signal - The AbortSignal to use for the fetch request
   */
  abortSignal(u) {
    return this.signal = u, this;
  }
  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be one row (e.g. using `.limit(1)`), otherwise this
   * returns an error.
   */
  single() {
    return this.headers.Accept = "application/vnd.pgrst.object+json", this;
  }
  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
   * this returns an error.
   */
  maybeSingle() {
    return this.method === "GET" ? this.headers.Accept = "application/json" : this.headers.Accept = "application/vnd.pgrst.object+json", this.isMaybeSingle = !0, this;
  }
  /**
   * Return `data` as a string in CSV format.
   */
  csv() {
    return this.headers.Accept = "text/csv", this;
  }
  /**
   * Return `data` as an object in [GeoJSON](https://geojson.org) format.
   */
  geojson() {
    return this.headers.Accept = "application/geo+json", this;
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
  explain({ analyze: u = !1, verbose: s = !1, settings: h = !1, buffers: g = !1, wal: w = !1, format: m = "text" } = {}) {
    var _;
    const C = [
      u ? "analyze" : null,
      s ? "verbose" : null,
      h ? "settings" : null,
      g ? "buffers" : null,
      w ? "wal" : null
    ].filter(Boolean).join("|"), R = (_ = this.headers.Accept) !== null && _ !== void 0 ? _ : "application/json";
    return this.headers.Accept = `application/vnd.pgrst.plan+${m}; for="${R}"; options=${C};`, m === "json" ? this : this;
  }
  /**
   * Rollback the query.
   *
   * `data` will still be returned, but the query is not committed.
   */
  rollback() {
    var u;
    return ((u = this.headers.Prefer) !== null && u !== void 0 ? u : "").trim().length > 0 ? this.headers.Prefer += ",tx=rollback" : this.headers.Prefer = "tx=rollback", this;
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
class Lf extends DO {
  /**
   * Match only rows where `column` is equal to `value`.
   *
   * To check if the value of `column` is NULL, you should use `.is()` instead.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  eq(u, s) {
    return this.url.searchParams.append(u, `eq.${s}`), this;
  }
  /**
   * Match only rows where `column` is not equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  neq(u, s) {
    return this.url.searchParams.append(u, `neq.${s}`), this;
  }
  /**
   * Match only rows where `column` is greater than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gt(u, s) {
    return this.url.searchParams.append(u, `gt.${s}`), this;
  }
  /**
   * Match only rows where `column` is greater than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gte(u, s) {
    return this.url.searchParams.append(u, `gte.${s}`), this;
  }
  /**
   * Match only rows where `column` is less than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lt(u, s) {
    return this.url.searchParams.append(u, `lt.${s}`), this;
  }
  /**
   * Match only rows where `column` is less than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lte(u, s) {
    return this.url.searchParams.append(u, `lte.${s}`), this;
  }
  /**
   * Match only rows where `column` matches `pattern` case-sensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  like(u, s) {
    return this.url.searchParams.append(u, `like.${s}`), this;
  }
  /**
   * Match only rows where `column` matches all of `patterns` case-sensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  likeAllOf(u, s) {
    return this.url.searchParams.append(u, `like(all).{${s.join(",")}}`), this;
  }
  /**
   * Match only rows where `column` matches any of `patterns` case-sensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  likeAnyOf(u, s) {
    return this.url.searchParams.append(u, `like(any).{${s.join(",")}}`), this;
  }
  /**
   * Match only rows where `column` matches `pattern` case-insensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  ilike(u, s) {
    return this.url.searchParams.append(u, `ilike.${s}`), this;
  }
  /**
   * Match only rows where `column` matches all of `patterns` case-insensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  ilikeAllOf(u, s) {
    return this.url.searchParams.append(u, `ilike(all).{${s.join(",")}}`), this;
  }
  /**
   * Match only rows where `column` matches any of `patterns` case-insensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  ilikeAnyOf(u, s) {
    return this.url.searchParams.append(u, `ilike(any).{${s.join(",")}}`), this;
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
  is(u, s) {
    return this.url.searchParams.append(u, `is.${s}`), this;
  }
  /**
   * Match only rows where `column` is included in the `values` array.
   *
   * @param column - The column to filter on
   * @param values - The values array to filter with
   */
  in(u, s) {
    const h = s.map((g) => typeof g == "string" && new RegExp("[,()]").test(g) ? `"${g}"` : `${g}`).join(",");
    return this.url.searchParams.append(u, `in.(${h})`), this;
  }
  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * `column` contains every element appearing in `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  contains(u, s) {
    return typeof s == "string" ? this.url.searchParams.append(u, `cs.${s}`) : Array.isArray(s) ? this.url.searchParams.append(u, `cs.{${s.join(",")}}`) : this.url.searchParams.append(u, `cs.${JSON.stringify(s)}`), this;
  }
  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * every element appearing in `column` is contained by `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  containedBy(u, s) {
    return typeof s == "string" ? this.url.searchParams.append(u, `cd.${s}`) : Array.isArray(s) ? this.url.searchParams.append(u, `cd.{${s.join(",")}}`) : this.url.searchParams.append(u, `cd.${JSON.stringify(s)}`), this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is greater than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGt(u, s) {
    return this.url.searchParams.append(u, `sr.${s}`), this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or greater than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGte(u, s) {
    return this.url.searchParams.append(u, `nxl.${s}`), this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is less than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLt(u, s) {
    return this.url.searchParams.append(u, `sl.${s}`), this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or less than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLte(u, s) {
    return this.url.searchParams.append(u, `nxr.${s}`), this;
  }
  /**
   * Only relevant for range columns. Match only rows where `column` is
   * mutually exclusive to `range` and there can be no element between the two
   * ranges.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeAdjacent(u, s) {
    return this.url.searchParams.append(u, `adj.${s}`), this;
  }
  /**
   * Only relevant for array and range columns. Match only rows where
   * `column` and `value` have an element in common.
   *
   * @param column - The array or range column to filter on
   * @param value - The array or range value to filter with
   */
  overlaps(u, s) {
    return typeof s == "string" ? this.url.searchParams.append(u, `ov.${s}`) : this.url.searchParams.append(u, `ov.{${s.join(",")}}`), this;
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
  textSearch(u, s, { config: h, type: g } = {}) {
    let w = "";
    g === "plain" ? w = "pl" : g === "phrase" ? w = "ph" : g === "websearch" && (w = "w");
    const m = h === void 0 ? "" : `(${h})`;
    return this.url.searchParams.append(u, `${w}fts${m}.${s}`), this;
  }
  /**
   * Match only rows where each column in `query` keys is equal to its
   * associated value. Shorthand for multiple `.eq()`s.
   *
   * @param query - The object to filter with, with column names as keys mapped
   * to their filter values
   */
  match(u) {
    return Object.entries(u).forEach(([s, h]) => {
      this.url.searchParams.append(s, `eq.${h}`);
    }), this;
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
  not(u, s, h) {
    return this.url.searchParams.append(u, `not.${s}.${h}`), this;
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
  or(u, { foreignTable: s, referencedTable: h = s } = {}) {
    const g = h ? `${h}.or` : "or";
    return this.url.searchParams.append(g, `(${u})`), this;
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
  filter(u, s, h) {
    return this.url.searchParams.append(u, `${s}.${h}`), this;
  }
}
class OO {
  constructor(u, { headers: s = {}, schema: h, fetch: g }) {
    this.url = u, this.headers = s, this.schema = h, this.fetch = g;
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
  select(u, { head: s = !1, count: h } = {}) {
    const g = s ? "HEAD" : "GET";
    let w = !1;
    const m = (u ?? "*").split("").map((_) => /\s/.test(_) && !w ? "" : (_ === '"' && (w = !w), _)).join("");
    return this.url.searchParams.set("select", m), h && (this.headers.Prefer = `count=${h}`), new Lf({
      method: g,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: !1
    });
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
  insert(u, { count: s, defaultToNull: h = !0 } = {}) {
    const g = "POST", w = [];
    if (this.headers.Prefer && w.push(this.headers.Prefer), s && w.push(`count=${s}`), h || w.push("missing=default"), this.headers.Prefer = w.join(","), Array.isArray(u)) {
      const m = u.reduce((_, C) => _.concat(Object.keys(C)), []);
      if (m.length > 0) {
        const _ = [...new Set(m)].map((C) => `"${C}"`);
        this.url.searchParams.set("columns", _.join(","));
      }
    }
    return new Lf({
      method: g,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: u,
      fetch: this.fetch,
      allowEmpty: !1
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
  upsert(u, { onConflict: s, ignoreDuplicates: h = !1, count: g, defaultToNull: w = !0 } = {}) {
    const m = "POST", _ = [`resolution=${h ? "ignore" : "merge"}-duplicates`];
    if (s !== void 0 && this.url.searchParams.set("on_conflict", s), this.headers.Prefer && _.push(this.headers.Prefer), g && _.push(`count=${g}`), w || _.push("missing=default"), this.headers.Prefer = _.join(","), Array.isArray(u)) {
      const C = u.reduce((R, O) => R.concat(Object.keys(O)), []);
      if (C.length > 0) {
        const R = [...new Set(C)].map((O) => `"${O}"`);
        this.url.searchParams.set("columns", R.join(","));
      }
    }
    return new Lf({
      method: m,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: u,
      fetch: this.fetch,
      allowEmpty: !1
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
  update(u, { count: s } = {}) {
    const h = "PATCH", g = [];
    return this.headers.Prefer && g.push(this.headers.Prefer), s && g.push(`count=${s}`), this.headers.Prefer = g.join(","), new Lf({
      method: h,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: u,
      fetch: this.fetch,
      allowEmpty: !1
    });
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
  delete({ count: u } = {}) {
    const s = "DELETE", h = [];
    return u && h.push(`count=${u}`), this.headers.Prefer && h.unshift(this.headers.Prefer), this.headers.Prefer = h.join(","), new Lf({
      method: s,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: !1
    });
  }
}
const LO = "1.9.2", AO = { "X-Client-Info": `postgrest-js/${LO}` };
class Mw {
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
  constructor(u, { headers: s = {}, schema: h, fetch: g } = {}) {
    this.url = u, this.headers = Object.assign(Object.assign({}, AO), s), this.schemaName = h, this.fetch = g;
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(u) {
    const s = new URL(`${this.url}/${u}`);
    return new OO(s, {
      headers: Object.assign({}, this.headers),
      schema: this.schemaName,
      fetch: this.fetch
    });
  }
  /**
   * Select a schema to query or perform an function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema(u) {
    return new Mw(this.url, {
      headers: this.headers,
      schema: u,
      fetch: this.fetch
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
  rpc(u, s = {}, { head: h = !1, count: g } = {}) {
    let w;
    const m = new URL(`${this.url}/rpc/${u}`);
    let _;
    h ? (w = "HEAD", Object.entries(s).forEach(([R, O]) => {
      m.searchParams.append(R, `${O}`);
    })) : (w = "POST", _ = s);
    const C = Object.assign({}, this.headers);
    return g && (C.Prefer = `count=${g}`), new Lf({
      method: w,
      url: m,
      headers: C,
      schema: this.schemaName,
      body: _,
      fetch: this.fetch,
      allowEmpty: !1
    });
  }
}
const MO = "2.9.3", UO = { "X-Client-Info": `realtime-js/${MO}` }, NO = "1.0.0", iC = 1e4, zO = 1e3;
var Mf;
(function (d) {
  d[d.connecting = 0] = "connecting", d[d.open = 1] = "open", d[d.closing = 2] = "closing", d[d.closed = 3] = "closed";
})(Mf || (Mf = {}));
var wi;
(function (d) {
  d.closed = "closed", d.errored = "errored", d.joined = "joined", d.joining = "joining", d.leaving = "leaving";
})(wi || (wi = {}));
var wa;
(function (d) {
  d.close = "phx_close", d.error = "phx_error", d.join = "phx_join", d.reply = "phx_reply", d.leave = "phx_leave", d.access_token = "access_token";
})(wa || (wa = {}));
var Sw;
(function (d) {
  d.websocket = "websocket";
})(Sw || (Sw = {}));
var xs;
(function (d) {
  d.Connecting = "connecting", d.Open = "open", d.Closing = "closing", d.Closed = "closed";
})(xs || (xs = {}));
class aC {
  constructor(u, s) {
    this.callback = u, this.timerCalc = s, this.timer = void 0, this.tries = 0, this.callback = u, this.timerCalc = s;
  }
  reset() {
    this.tries = 0, clearTimeout(this.timer);
  }
  // Cancels any previous scheduleTimeout and schedules callback
  scheduleTimeout() {
    clearTimeout(this.timer), this.timer = setTimeout(() => {
      this.tries = this.tries + 1, this.callback();
    }, this.timerCalc(this.tries + 1));
  }
}
class jO {
  constructor() {
    this.HEADER_LENGTH = 1;
  }
  decode(u, s) {
    return u.constructor === ArrayBuffer ? s(this._binaryDecode(u)) : s(typeof u == "string" ? JSON.parse(u) : {});
  }
  _binaryDecode(u) {
    const s = new DataView(u), h = new TextDecoder();
    return this._decodeBroadcast(u, s, h);
  }
  _decodeBroadcast(u, s, h) {
    const g = s.getUint8(1), w = s.getUint8(2);
    let m = this.HEADER_LENGTH + 2;
    const _ = h.decode(u.slice(m, m + g));
    m = m + g;
    const C = h.decode(u.slice(m, m + w));
    m = m + w;
    const R = JSON.parse(h.decode(u.slice(m, u.byteLength)));
    return { ref: null, topic: _, event: C, payload: R };
  }
}
class aw {
  /**
   * Initializes the Push
   *
   * @param channel The Channel
   * @param event The event, for example `"phx_join"`
   * @param payload The payload, for example `{user_id: 123}`
   * @param timeout The push timeout in milliseconds
   */
  constructor(u, s, h = {}, g = iC) {
    this.channel = u, this.event = s, this.payload = h, this.timeout = g, this.sent = !1, this.timeoutTimer = void 0, this.ref = "", this.receivedResp = null, this.recHooks = [], this.refEvent = null;
  }
  resend(u) {
    this.timeout = u, this._cancelRefEvent(), this.ref = "", this.refEvent = null, this.receivedResp = null, this.sent = !1, this.send();
  }
  send() {
    this._hasReceived("timeout") || (this.startTimeout(), this.sent = !0, this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload,
      ref: this.ref,
      join_ref: this.channel._joinRef()
    }));
  }
  updatePayload(u) {
    this.payload = Object.assign(Object.assign({}, this.payload), u);
  }
  receive(u, s) {
    var h;
    return this._hasReceived(u) && s((h = this.receivedResp) === null || h === void 0 ? void 0 : h.response), this.recHooks.push({ status: u, callback: s }), this;
  }
  startTimeout() {
    if (this.timeoutTimer)
      return;
    this.ref = this.channel.socket._makeRef(), this.refEvent = this.channel._replyEventName(this.ref);
    const u = (s) => {
      this._cancelRefEvent(), this._cancelTimeout(), this.receivedResp = s, this._matchReceive(s);
    };
    this.channel._on(this.refEvent, {}, u), this.timeoutTimer = setTimeout(() => {
      this.trigger("timeout", {});
    }, this.timeout);
  }
  trigger(u, s) {
    this.refEvent && this.channel._trigger(this.refEvent, { status: u, response: s });
  }
  destroy() {
    this._cancelRefEvent(), this._cancelTimeout();
  }
  _cancelRefEvent() {
    this.refEvent && this.channel._off(this.refEvent, {});
  }
  _cancelTimeout() {
    clearTimeout(this.timeoutTimer), this.timeoutTimer = void 0;
  }
  _matchReceive({ status: u, response: s }) {
    this.recHooks.filter((h) => h.status === u).forEach((h) => h.callback(s));
  }
  _hasReceived(u) {
    return this.receivedResp && this.receivedResp.status === u;
  }
}
var __;
(function (d) {
  d.SYNC = "sync", d.JOIN = "join", d.LEAVE = "leave";
})(__ || (__ = {}));
class ap {
  /**
   * Initializes the Presence.
   *
   * @param channel - The RealtimeChannel
   * @param opts - The options,
   *        for example `{events: {state: 'state', diff: 'diff'}}`
   */
  constructor(u, s) {
    this.channel = u, this.state = {}, this.pendingDiffs = [], this.joinRef = null, this.caller = {
      onJoin: () => {
      },
      onLeave: () => {
      },
      onSync: () => {
      }
    };
    const h = (s == null ? void 0 : s.events) || {
      state: "presence_state",
      diff: "presence_diff"
    };
    this.channel._on(h.state, {}, (g) => {
      const { onJoin: w, onLeave: m, onSync: _ } = this.caller;
      this.joinRef = this.channel._joinRef(), this.state = ap.syncState(this.state, g, w, m), this.pendingDiffs.forEach((C) => {
        this.state = ap.syncDiff(this.state, C, w, m);
      }), this.pendingDiffs = [], _();
    }), this.channel._on(h.diff, {}, (g) => {
      const { onJoin: w, onLeave: m, onSync: _ } = this.caller;
      this.inPendingSyncState() ? this.pendingDiffs.push(g) : (this.state = ap.syncDiff(this.state, g, w, m), _());
    }), this.onJoin((g, w, m) => {
      this.channel._trigger("presence", {
        event: "join",
        key: g,
        currentPresences: w,
        newPresences: m
      });
    }), this.onLeave((g, w, m) => {
      this.channel._trigger("presence", {
        event: "leave",
        key: g,
        currentPresences: w,
        leftPresences: m
      });
    }), this.onSync(() => {
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
  static syncState(u, s, h, g) {
    const w = this.cloneDeep(u), m = this.transformState(s), _ = {}, C = {};
    return this.map(w, (R, O) => {
      m[R] || (C[R] = O);
    }), this.map(m, (R, O) => {
      const U = w[R];
      if (U) {
        const $ = O.map((re) => re.presence_ref), B = U.map((re) => re.presence_ref), X = O.filter((re) => B.indexOf(re.presence_ref) < 0), ee = U.filter((re) => $.indexOf(re.presence_ref) < 0);
        X.length > 0 && (_[R] = X), ee.length > 0 && (C[R] = ee);
      } else
        _[R] = O;
    }), this.syncDiff(w, { joins: _, leaves: C }, h, g);
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
  static syncDiff(u, s, h, g) {
    const { joins: w, leaves: m } = {
      joins: this.transformState(s.joins),
      leaves: this.transformState(s.leaves)
    };
    return h || (h = () => {
    }), g || (g = () => {
    }), this.map(w, (_, C) => {
      var R;
      const O = (R = u[_]) !== null && R !== void 0 ? R : [];
      if (u[_] = this.cloneDeep(C), O.length > 0) {
        const U = u[_].map((B) => B.presence_ref), $ = O.filter((B) => U.indexOf(B.presence_ref) < 0);
        u[_].unshift(...$);
      }
      h(_, O, C);
    }), this.map(m, (_, C) => {
      let R = u[_];
      if (!R)
        return;
      const O = C.map((U) => U.presence_ref);
      R = R.filter((U) => O.indexOf(U.presence_ref) < 0), u[_] = R, g(_, R, C), R.length === 0 && delete u[_];
    }), u;
  }
  /** @internal */
  static map(u, s) {
    return Object.getOwnPropertyNames(u).map((h) => s(h, u[h]));
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
  static transformState(u) {
    return u = this.cloneDeep(u), Object.getOwnPropertyNames(u).reduce((s, h) => {
      const g = u[h];
      return "metas" in g ? s[h] = g.metas.map((w) => (w.presence_ref = w.phx_ref, delete w.phx_ref, delete w.phx_ref_prev, w)) : s[h] = g, s;
    }, {});
  }
  /** @internal */
  static cloneDeep(u) {
    return JSON.parse(JSON.stringify(u));
  }
  /** @internal */
  onJoin(u) {
    this.caller.onJoin = u;
  }
  /** @internal */
  onLeave(u) {
    this.caller.onLeave = u;
  }
  /** @internal */
  onSync(u) {
    this.caller.onSync = u;
  }
  /** @internal */
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel._joinRef();
  }
}
var At;
(function (d) {
  d.abstime = "abstime", d.bool = "bool", d.date = "date", d.daterange = "daterange", d.float4 = "float4", d.float8 = "float8", d.int2 = "int2", d.int4 = "int4", d.int4range = "int4range", d.int8 = "int8", d.int8range = "int8range", d.json = "json", d.jsonb = "jsonb", d.money = "money", d.numeric = "numeric", d.oid = "oid", d.reltime = "reltime", d.text = "text", d.time = "time", d.timestamp = "timestamp", d.timestamptz = "timestamptz", d.timetz = "timetz", d.tsrange = "tsrange", d.tstzrange = "tstzrange";
})(At || (At = {}));
const C_ = (d, u, s = {}) => {
  var h;
  const g = (h = s.skipTypes) !== null && h !== void 0 ? h : [];
  return Object.keys(u).reduce((w, m) => (w[m] = FO(m, d, u, g), w), {});
}, FO = (d, u, s, h) => {
  const g = u.find((_) => _.name === d), w = g == null ? void 0 : g.type, m = s[d];
  return w && !h.includes(w) ? oC(w, m) : ww(m);
}, oC = (d, u) => {
  if (d.charAt(0) === "_") {
    const s = d.slice(1, d.length);
    return VO(u, s);
  }
  switch (d) {
    case At.bool:
      return $O(u);
    case At.float4:
    case At.float8:
    case At.int2:
    case At.int4:
    case At.int8:
    case At.numeric:
    case At.oid:
      return HO(u);
    case At.json:
    case At.jsonb:
      return PO(u);
    case At.timestamp:
      return BO(u);
    case At.abstime:
    case At.date:
    case At.daterange:
    case At.int4range:
    case At.int8range:
    case At.money:
    case At.reltime:
    case At.text:
    case At.time:
    case At.timestamptz:
    case At.timetz:
    case At.tsrange:
    case At.tstzrange:
      return ww(u);
    default:
      return ww(u);
  }
}, ww = (d) => d, $O = (d) => {
  switch (d) {
    case "t":
      return !0;
    case "f":
      return !1;
    default:
      return d;
  }
}, HO = (d) => {
  if (typeof d == "string") {
    const u = parseFloat(d);
    if (!Number.isNaN(u))
      return u;
  }
  return d;
}, PO = (d) => {
  if (typeof d == "string")
    try {
      return JSON.parse(d);
    } catch (u) {
      return console.log(`JSON parse error: ${u}`), d;
    }
  return d;
}, VO = (d, u) => {
  if (typeof d != "string")
    return d;
  const s = d.length - 1, h = d[s];
  if (d[0] === "{" && h === "}") {
    let w;
    const m = d.slice(1, s);
    try {
      w = JSON.parse("[" + m + "]");
    } catch {
      w = m ? m.split(",") : [];
    }
    return w.map((_) => oC(u, _));
  }
  return d;
}, BO = (d) => typeof d == "string" ? d.replace(" ", "T") : d;
var x_;
(function (d) {
  d.ALL = "*", d.INSERT = "INSERT", d.UPDATE = "UPDATE", d.DELETE = "DELETE";
})(x_ || (x_ = {}));
var T_;
(function (d) {
  d.BROADCAST = "broadcast", d.PRESENCE = "presence", d.POSTGRES_CHANGES = "postgres_changes";
})(T_ || (T_ = {}));
var R_;
(function (d) {
  d.SUBSCRIBED = "SUBSCRIBED", d.TIMED_OUT = "TIMED_OUT", d.CLOSED = "CLOSED", d.CHANNEL_ERROR = "CHANNEL_ERROR";
})(R_ || (R_ = {}));
class Uw {
  constructor(u, s = { config: {} }, h) {
    this.topic = u, this.params = s, this.socket = h, this.bindings = {}, this.state = wi.closed, this.joinedOnce = !1, this.pushBuffer = [], this.subTopic = u.replace(/^realtime:/i, ""), this.params.config = Object.assign({
      broadcast: { ack: !1, self: !1 },
      presence: { key: "" }
    }, s.config), this.timeout = this.socket.timeout, this.joinPush = new aw(this, wa.join, this.params, this.timeout), this.rejoinTimer = new aC(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs), this.joinPush.receive("ok", () => {
      this.state = wi.joined, this.rejoinTimer.reset(), this.pushBuffer.forEach((g) => g.send()), this.pushBuffer = [];
    }), this._onClose(() => {
      this.rejoinTimer.reset(), this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`), this.state = wi.closed, this.socket._remove(this);
    }), this._onError((g) => {
      this._isLeaving() || this._isClosed() || (this.socket.log("channel", `error ${this.topic}`, g), this.state = wi.errored, this.rejoinTimer.scheduleTimeout());
    }), this.joinPush.receive("timeout", () => {
      this._isJoining() && (this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout), this.state = wi.errored, this.rejoinTimer.scheduleTimeout());
    }), this._on(wa.reply, {}, (g, w) => {
      this._trigger(this._replyEventName(w), g);
    }), this.presence = new ap(this), this.broadcastEndpointURL = this._broadcastEndpointURL();
  }
  /** Subscribe registers your client with the server */
  subscribe(u, s = this.timeout) {
    var h, g;
    if (this.socket.isConnected() || this.socket.connect(), this.joinedOnce)
      throw "tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance";
    {
      const { config: { broadcast: w, presence: m } } = this.params;
      this._onError((R) => u && u("CHANNEL_ERROR", R)), this._onClose(() => u && u("CLOSED"));
      const _ = {}, C = {
        broadcast: w,
        presence: m,
        postgres_changes: (g = (h = this.bindings.postgres_changes) === null || h === void 0 ? void 0 : h.map((R) => R.filter)) !== null && g !== void 0 ? g : []
      };
      this.socket.accessToken && (_.access_token = this.socket.accessToken), this.updateJoinPayload(Object.assign({ config: C }, _)), this.joinedOnce = !0, this._rejoin(s), this.joinPush.receive("ok", ({ postgres_changes: R }) => {
        var O;
        if (this.socket.accessToken && this.socket.setAuth(this.socket.accessToken), R === void 0) {
          u && u("SUBSCRIBED");
          return;
        } else {
          const U = this.bindings.postgres_changes, $ = (O = U == null ? void 0 : U.length) !== null && O !== void 0 ? O : 0, B = [];
          for (let X = 0; X < $; X++) {
            const ee = U[X], { filter: { event: re, schema: Je, table: Ce, filter: pe } } = ee, _e = R && R[X];
            if (_e && _e.event === re && _e.schema === Je && _e.table === Ce && _e.filter === pe)
              B.push(Object.assign(Object.assign({}, ee), { id: _e.id }));
            else {
              this.unsubscribe(), u && u("CHANNEL_ERROR", new Error("mismatch between server and client bindings for postgres changes"));
              return;
            }
          }
          this.bindings.postgres_changes = B, u && u("SUBSCRIBED");
          return;
        }
      }).receive("error", (R) => {
        u && u("CHANNEL_ERROR", new Error(JSON.stringify(Object.values(R).join(", ") || "error")));
      }).receive("timeout", () => {
        u && u("TIMED_OUT");
      });
    }
    return this;
  }
  presenceState() {
    return this.presence.state;
  }
  async track(u, s = {}) {
    return await this.send({
      type: "presence",
      event: "track",
      payload: u
    }, s.timeout || this.timeout);
  }
  async untrack(u = {}) {
    return await this.send({
      type: "presence",
      event: "untrack"
    }, u);
  }
  on(u, s, h) {
    return this._on(u, s, h);
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
  async send(u, s = {}) {
    var h, g;
    if (!this._canPush() && u.type === "broadcast") {
      const { event: w, payload: m } = u, _ = {
        method: "POST",
        headers: {
          apikey: (h = this.socket.apiKey) !== null && h !== void 0 ? h : "",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            { topic: this.subTopic, event: w, payload: m }
          ]
        })
      };
      try {
        return (await this._fetchWithTimeout(this.broadcastEndpointURL, _, (g = s.timeout) !== null && g !== void 0 ? g : this.timeout)).ok ? "ok" : "error";
      } catch (C) {
        return C.name === "AbortError" ? "timed out" : "error";
      }
    } else
      return new Promise((w) => {
        var m, _, C;
        const R = this._push(u.type, u, s.timeout || this.timeout);
        u.type === "broadcast" && !(!((C = (_ = (m = this.params) === null || m === void 0 ? void 0 : m.config) === null || _ === void 0 ? void 0 : _.broadcast) === null || C === void 0) && C.ack) && w("ok"), R.receive("ok", () => w("ok")), R.receive("timeout", () => w("timed out"));
      });
  }
  updateJoinPayload(u) {
    this.joinPush.updatePayload(u);
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
  unsubscribe(u = this.timeout) {
    this.state = wi.leaving;
    const s = () => {
      this.socket.log("channel", `leave ${this.topic}`), this._trigger(wa.close, "leave", this._joinRef());
    };
    return this.rejoinTimer.reset(), this.joinPush.destroy(), new Promise((h) => {
      const g = new aw(this, wa.leave, {}, u);
      g.receive("ok", () => {
        s(), h("ok");
      }).receive("timeout", () => {
        s(), h("timed out");
      }).receive("error", () => {
        h("error");
      }), g.send(), this._canPush() || g.trigger("ok", {});
    });
  }
  /** @internal */
  _broadcastEndpointURL() {
    let u = this.socket.endPoint;
    return u = u.replace(/^ws/i, "http"), u = u.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, ""), u.replace(/\/+$/, "") + "/api/broadcast";
  }
  async _fetchWithTimeout(u, s, h) {
    const g = new AbortController(), w = setTimeout(() => g.abort(), h), m = await this.socket.fetch(u, Object.assign(Object.assign({}, s), { signal: g.signal }));
    return clearTimeout(w), m;
  }
  /** @internal */
  _push(u, s, h = this.timeout) {
    if (!this.joinedOnce)
      throw `tried to push '${u}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    let g = new aw(this, u, s, h);
    return this._canPush() ? g.send() : (g.startTimeout(), this.pushBuffer.push(g)), g;
  }
  /**
   * Overridable message hook
   *
   * Receives all events for specialized message handling before dispatching to the channel callbacks.
   * Must return the payload, modified or unmodified.
   *
   * @internal
   */
  _onMessage(u, s, h) {
    return s;
  }
  /** @internal */
  _isMember(u) {
    return this.topic === u;
  }
  /** @internal */
  _joinRef() {
    return this.joinPush.ref;
  }
  /** @internal */
  _trigger(u, s, h) {
    var g, w;
    const m = u.toLocaleLowerCase(), { close: _, error: C, leave: R, join: O } = wa;
    if (h && [_, C, R, O].indexOf(m) >= 0 && h !== this._joinRef())
      return;
    let $ = this._onMessage(m, s, h);
    if (s && !$)
      throw "channel onMessage callbacks must return the payload, modified or unmodified";
    ["insert", "update", "delete"].includes(m) ? (g = this.bindings.postgres_changes) === null || g === void 0 || g.filter((B) => {
      var X, ee, re;
      return ((X = B.filter) === null || X === void 0 ? void 0 : X.event) === "*" || ((re = (ee = B.filter) === null || ee === void 0 ? void 0 : ee.event) === null || re === void 0 ? void 0 : re.toLocaleLowerCase()) === m;
    }).map((B) => B.callback($, h)) : (w = this.bindings[m]) === null || w === void 0 || w.filter((B) => {
      var X, ee, re, Je, Ce, pe;
      if (["broadcast", "presence", "postgres_changes"].includes(m))
        if ("id" in B) {
          const _e = B.id, $e = (X = B.filter) === null || X === void 0 ? void 0 : X.event;
          return _e && ((ee = s.ids) === null || ee === void 0 ? void 0 : ee.includes(_e)) && ($e === "*" || ($e == null ? void 0 : $e.toLocaleLowerCase()) === ((re = s.data) === null || re === void 0 ? void 0 : re.type.toLocaleLowerCase()));
        } else {
          const _e = (Ce = (Je = B == null ? void 0 : B.filter) === null || Je === void 0 ? void 0 : Je.event) === null || Ce === void 0 ? void 0 : Ce.toLocaleLowerCase();
          return _e === "*" || _e === ((pe = s == null ? void 0 : s.event) === null || pe === void 0 ? void 0 : pe.toLocaleLowerCase());
        }
      else
        return B.type.toLocaleLowerCase() === m;
    }).map((B) => {
      if (typeof $ == "object" && "ids" in $) {
        const X = $.data, { schema: ee, table: re, commit_timestamp: Je, type: Ce, errors: pe } = X;
        $ = Object.assign(Object.assign({}, {
          schema: ee,
          table: re,
          commit_timestamp: Je,
          eventType: Ce,
          new: {},
          old: {},
          errors: pe
        }), this._getPayloadRecords(X));
      }
      B.callback($, h);
    });
  }
  /** @internal */
  _isClosed() {
    return this.state === wi.closed;
  }
  /** @internal */
  _isJoined() {
    return this.state === wi.joined;
  }
  /** @internal */
  _isJoining() {
    return this.state === wi.joining;
  }
  /** @internal */
  _isLeaving() {
    return this.state === wi.leaving;
  }
  /** @internal */
  _replyEventName(u) {
    return `chan_reply_${u}`;
  }
  /** @internal */
  _on(u, s, h) {
    const g = u.toLocaleLowerCase(), w = {
      type: g,
      filter: s,
      callback: h
    };
    return this.bindings[g] ? this.bindings[g].push(w) : this.bindings[g] = [w], this;
  }
  /** @internal */
  _off(u, s) {
    const h = u.toLocaleLowerCase();
    return this.bindings[h] = this.bindings[h].filter((g) => {
      var w;
      return !(((w = g.type) === null || w === void 0 ? void 0 : w.toLocaleLowerCase()) === h && Uw.isEqual(g.filter, s));
    }), this;
  }
  /** @internal */
  static isEqual(u, s) {
    if (Object.keys(u).length !== Object.keys(s).length)
      return !1;
    for (const h in u)
      if (u[h] !== s[h])
        return !1;
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
  _onClose(u) {
    this._on(wa.close, {}, u);
  }
  /**
   * Registers a callback that will be executed when the channel encounteres an error.
   *
   * @internal
   */
  _onError(u) {
    this._on(wa.error, {}, (s) => u(s));
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
  _rejoin(u = this.timeout) {
    this._isLeaving() || (this.socket._leaveOpenTopic(this.topic), this.state = wi.joining, this.joinPush.resend(u));
  }
  /** @internal */
  _getPayloadRecords(u) {
    const s = {
      new: {},
      old: {}
    };
    return (u.type === "INSERT" || u.type === "UPDATE") && (s.new = C_(u.columns, u.record)), (u.type === "UPDATE" || u.type === "DELETE") && (s.old = C_(u.columns, u.old_record)), s;
  }
}
const IO = () => {
}, YO = typeof WebSocket < "u";
class qO {
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
  constructor(u, s) {
    var h;
    this.accessToken = null, this.apiKey = null, this.channels = [], this.endPoint = "", this.headers = UO, this.params = {}, this.timeout = iC, this.heartbeatIntervalMs = 3e4, this.heartbeatTimer = void 0, this.pendingHeartbeatRef = null, this.ref = 0, this.logger = IO, this.conn = null, this.sendBuffer = [], this.serializer = new jO(), this.stateChangeCallbacks = {
      open: [],
      close: [],
      error: [],
      message: []
    }, this._resolveFetch = (w) => {
      let m;
      return w ? m = w : typeof fetch > "u" ? m = (..._) => Promise.resolve().then(() => sp).then(({ default: C }) => C(..._)) : m = fetch, (..._) => m(..._);
    }, this.endPoint = `${u}/${Sw.websocket}`, s != null && s.transport ? this.transport = s.transport : this.transport = null, s != null && s.params && (this.params = s.params), s != null && s.headers && (this.headers = Object.assign(Object.assign({}, this.headers), s.headers)), s != null && s.timeout && (this.timeout = s.timeout), s != null && s.logger && (this.logger = s.logger), s != null && s.heartbeatIntervalMs && (this.heartbeatIntervalMs = s.heartbeatIntervalMs);
    const g = (h = s == null ? void 0 : s.params) === null || h === void 0 ? void 0 : h.apikey;
    g && (this.accessToken = g, this.apiKey = g), this.reconnectAfterMs = s != null && s.reconnectAfterMs ? s.reconnectAfterMs : (w) => [1e3, 2e3, 5e3, 1e4][w - 1] || 1e4, this.encode = s != null && s.encode ? s.encode : (w, m) => m(JSON.stringify(w)), this.decode = s != null && s.decode ? s.decode : this.serializer.decode.bind(this.serializer), this.reconnectTimer = new aC(async () => {
      this.disconnect(), this.connect();
    }, this.reconnectAfterMs), this.fetch = this._resolveFetch(s == null ? void 0 : s.fetch);
  }
  /**
   * Connects the socket, unless already connected.
   */
  connect() {
    if (!this.conn) {
      if (this.transport) {
        this.conn = new this.transport(this._endPointURL(), void 0, {
          headers: this.headers
        });
        return;
      }
      if (YO) {
        this.conn = new WebSocket(this._endPointURL()), this.setupConnection();
        return;
      }
      this.conn = new QO(this._endPointURL(), void 0, {
        close: () => {
          this.conn = null;
        }
      }), import("./browser-x2fyYKdr.js").then((u) => u.b).then(({ default: u }) => {
        this.conn = new u(this._endPointURL(), void 0, {
          headers: this.headers
        }), this.setupConnection();
      });
    }
  }
  /**
   * Disconnects the socket.
   *
   * @param code A numeric status code to send on disconnect.
   * @param reason A custom reason for the disconnect.
   */
  disconnect(u, s) {
    this.conn && (this.conn.onclose = function () {
    }, u ? this.conn.close(u, s ?? "") : this.conn.close(), this.conn = null, this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.reconnectTimer.reset());
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
  async removeChannel(u) {
    const s = await u.unsubscribe();
    return this.channels.length === 0 && this.disconnect(), s;
  }
  /**
   * Unsubscribes and removes all channels
   */
  async removeAllChannels() {
    const u = await Promise.all(this.channels.map((s) => s.unsubscribe()));
    return this.disconnect(), u;
  }
  /**
   * Logs the message.
   *
   * For customized logging, `this.logger` can be overridden.
   */
  log(u, s, h) {
    this.logger(u, s, h);
  }
  /**
   * Returns the current state of the socket.
   */
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case Mf.connecting:
        return xs.Connecting;
      case Mf.open:
        return xs.Open;
      case Mf.closing:
        return xs.Closing;
      default:
        return xs.Closed;
    }
  }
  /**
   * Returns `true` is the connection is open.
   */
  isConnected() {
    return this.connectionState() === xs.Open;
  }
  channel(u, s = { config: {} }) {
    const h = new Uw(`realtime:${u}`, s, this);
    return this.channels.push(h), h;
  }
  /**
   * Push out a message if the socket is connected.
   *
   * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
   */
  push(u) {
    const { topic: s, event: h, payload: g, ref: w } = u, m = () => {
      this.encode(u, (_) => {
        var C;
        (C = this.conn) === null || C === void 0 || C.send(_);
      });
    };
    this.log("push", `${s} ${h} (${w})`, g), this.isConnected() ? m() : this.sendBuffer.push(m);
  }
  /**
   * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
   *
   * @param token A JWT string.
   */
  setAuth(u) {
    this.accessToken = u, this.channels.forEach((s) => {
      u && s.updateJoinPayload({ access_token: u }), s.joinedOnce && s._isJoined() && s._push(wa.access_token, { access_token: u });
    });
  }
  /**
   * Return the next message ref, accounting for overflows
   *
   * @internal
   */
  _makeRef() {
    let u = this.ref + 1;
    return u === this.ref ? this.ref = 0 : this.ref = u, this.ref.toString();
  }
  /**
   * Unsubscribe from channels with the specified topic.
   *
   * @internal
   */
  _leaveOpenTopic(u) {
    let s = this.channels.find((h) => h.topic === u && (h._isJoined() || h._isJoining()));
    s && (this.log("transport", `leaving duplicate topic "${u}"`), s.unsubscribe());
  }
  /**
   * Removes a subscription from the socket.
   *
   * @param channel An open subscription.
   *
   * @internal
   */
  _remove(u) {
    this.channels = this.channels.filter((s) => s._joinRef() !== u._joinRef());
  }
  /**
   * Sets up connection handlers.
   *
   * @internal
   */
  setupConnection() {
    this.conn && (this.conn.binaryType = "arraybuffer", this.conn.onopen = () => this._onConnOpen(), this.conn.onerror = (u) => this._onConnError(u), this.conn.onmessage = (u) => this._onConnMessage(u), this.conn.onclose = (u) => this._onConnClose(u));
  }
  /**
   * Returns the URL of the websocket.
   *
   * @internal
   */
  _endPointURL() {
    return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: NO }));
  }
  /** @internal */
  _onConnMessage(u) {
    this.decode(u.data, (s) => {
      let { topic: h, event: g, payload: w, ref: m } = s;
      (m && m === this.pendingHeartbeatRef || g === (w == null ? void 0 : w.type)) && (this.pendingHeartbeatRef = null), this.log("receive", `${w.status || ""} ${h} ${g} ${m && "(" + m + ")" || ""}`, w), this.channels.filter((_) => _._isMember(h)).forEach((_) => _._trigger(g, w, m)), this.stateChangeCallbacks.message.forEach((_) => _(s));
    });
  }
  /** @internal */
  _onConnOpen() {
    this.log("transport", `connected to ${this._endPointURL()}`), this._flushSendBuffer(), this.reconnectTimer.reset(), this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs), this.stateChangeCallbacks.open.forEach((u) => u());
  }
  /** @internal */
  _onConnClose(u) {
    this.log("transport", "close", u), this._triggerChanError(), this.heartbeatTimer && clearInterval(this.heartbeatTimer), this.reconnectTimer.scheduleTimeout(), this.stateChangeCallbacks.close.forEach((s) => s(u));
  }
  /** @internal */
  _onConnError(u) {
    this.log("transport", u.message), this._triggerChanError(), this.stateChangeCallbacks.error.forEach((s) => s(u));
  }
  /** @internal */
  _triggerChanError() {
    this.channels.forEach((u) => u._trigger(wa.error));
  }
  /** @internal */
  _appendParams(u, s) {
    if (Object.keys(s).length === 0)
      return u;
    const h = u.match(/\?/) ? "&" : "?", g = new URLSearchParams(s);
    return `${u}${h}${g}`;
  }
  /** @internal */
  _flushSendBuffer() {
    this.isConnected() && this.sendBuffer.length > 0 && (this.sendBuffer.forEach((u) => u()), this.sendBuffer = []);
  }
  /** @internal */
  _sendHeartbeat() {
    var u;
    if (this.isConnected()) {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null, this.log("transport", "heartbeat timeout. Attempting to re-establish connection"), (u = this.conn) === null || u === void 0 || u.close(zO, "hearbeat timeout");
        return;
      }
      this.pendingHeartbeatRef = this._makeRef(), this.push({
        topic: "phoenix",
        event: "heartbeat",
        payload: {},
        ref: this.pendingHeartbeatRef
      }), this.setAuth(this.accessToken);
    }
  }
}
class QO {
  constructor(u, s, h) {
    this.binaryType = "arraybuffer", this.onclose = () => {
    }, this.onerror = () => {
    }, this.onmessage = () => {
    }, this.onopen = () => {
    }, this.readyState = Mf.connecting, this.send = () => {
    }, this.url = null, this.url = u, this.close = h.close;
  }
}
class Nw extends Error {
  constructor(u) {
    super(u), this.__isStorageError = !0, this.name = "StorageError";
  }
}
function gr(d) {
  return typeof d == "object" && d !== null && "__isStorageError" in d;
}
class GO extends Nw {
  constructor(u, s) {
    super(u), this.name = "StorageApiError", this.status = s;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
}
class k_ extends Nw {
  constructor(u, s) {
    super(u), this.name = "StorageUnknownError", this.originalError = s;
  }
}
var WO = function (d, u, s, h) {
  function g(w) {
    return w instanceof s ? w : new s(function (m) {
      m(w);
    });
  }
  return new (s || (s = Promise))(function (w, m) {
    function _(O) {
      try {
        R(h.next(O));
      } catch (U) {
        m(U);
      }
    }
    function C(O) {
      try {
        R(h.throw(O));
      } catch (U) {
        m(U);
      }
    }
    function R(O) {
      O.done ? w(O.value) : g(O.value).then(_, C);
    }
    R((h = h.apply(d, u || [])).next());
  });
};
const lC = (d) => {
  let u;
  return d ? u = d : typeof fetch > "u" ? u = (...s) => Promise.resolve().then(() => sp).then(({ default: h }) => h(...s)) : u = fetch, (...s) => u(...s);
}, KO = () => WO(void 0, void 0, void 0, function* () {
  return typeof Response > "u" ? (yield Promise.resolve().then(() => sp)).Response : Response;
});
var Nf = function (d, u, s, h) {
  function g(w) {
    return w instanceof s ? w : new s(function (m) {
      m(w);
    });
  }
  return new (s || (s = Promise))(function (w, m) {
    function _(O) {
      try {
        R(h.next(O));
      } catch (U) {
        m(U);
      }
    }
    function C(O) {
      try {
        R(h.throw(O));
      } catch (U) {
        m(U);
      }
    }
    function R(O) {
      O.done ? w(O.value) : g(O.value).then(_, C);
    }
    R((h = h.apply(d, u || [])).next());
  });
};
const ow = (d) => d.msg || d.message || d.error_description || d.error || JSON.stringify(d), JO = (d, u) => Nf(void 0, void 0, void 0, function* () {
  const s = yield KO();
  d instanceof s ? d.json().then((h) => {
    u(new GO(ow(h), d.status || 500));
  }).catch((h) => {
    u(new k_(ow(h), h));
  }) : u(new k_(ow(d), d));
}), XO = (d, u, s, h) => {
  const g = { method: d, headers: (u == null ? void 0 : u.headers) || {} };
  return d === "GET" ? g : (g.headers = Object.assign({ "Content-Type": "application/json" }, u == null ? void 0 : u.headers), g.body = JSON.stringify(h), Object.assign(Object.assign({}, g), s));
};
function Cy(d, u, s, h, g, w) {
  return Nf(this, void 0, void 0, function* () {
    return new Promise((m, _) => {
      d(s, XO(u, h, g, w)).then((C) => {
        if (!C.ok)
          throw C;
        return h != null && h.noResolveJson ? C : C.json();
      }).then((C) => m(C)).catch((C) => JO(C, _));
    });
  });
}
function bw(d, u, s, h) {
  return Nf(this, void 0, void 0, function* () {
    return Cy(d, "GET", u, s, h);
  });
}
function ru(d, u, s, h, g) {
  return Nf(this, void 0, void 0, function* () {
    return Cy(d, "POST", u, h, g, s);
  });
}
function ZO(d, u, s, h, g) {
  return Nf(this, void 0, void 0, function* () {
    return Cy(d, "PUT", u, h, g, s);
  });
}
function uC(d, u, s, h, g) {
  return Nf(this, void 0, void 0, function* () {
    return Cy(d, "DELETE", u, h, g, s);
  });
}
var $i = function (d, u, s, h) {
  function g(w) {
    return w instanceof s ? w : new s(function (m) {
      m(w);
    });
  }
  return new (s || (s = Promise))(function (w, m) {
    function _(O) {
      try {
        R(h.next(O));
      } catch (U) {
        m(U);
      }
    }
    function C(O) {
      try {
        R(h.throw(O));
      } catch (U) {
        m(U);
      }
    }
    function R(O) {
      O.done ? w(O.value) : g(O.value).then(_, C);
    }
    R((h = h.apply(d, u || [])).next());
  });
};
const eL = {
  limit: 100,
  offset: 0,
  sortBy: {
    column: "name",
    order: "asc"
  }
}, D_ = {
  cacheControl: "3600",
  contentType: "text/plain;charset=UTF-8",
  upsert: !1
};
class tL {
  constructor(u, s = {}, h, g) {
    this.url = u, this.headers = s, this.bucketId = h, this.fetch = lC(g);
  }
  /**
   * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
   *
   * @param method HTTP method.
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadOrUpdate(u, s, h, g) {
    return $i(this, void 0, void 0, function* () {
      try {
        let w;
        const m = Object.assign(Object.assign({}, D_), g), _ = Object.assign(Object.assign({}, this.headers), u === "POST" && { "x-upsert": String(m.upsert) });
        typeof Blob < "u" && h instanceof Blob ? (w = new FormData(), w.append("cacheControl", m.cacheControl), w.append("", h)) : typeof FormData < "u" && h instanceof FormData ? (w = h, w.append("cacheControl", m.cacheControl)) : (w = h, _["cache-control"] = `max-age=${m.cacheControl}`, _["content-type"] = m.contentType);
        const C = this._removeEmptyFolders(s), R = this._getFinalPath(C), O = yield this.fetch(`${this.url}/object/${R}`, Object.assign({ method: u, body: w, headers: _ }, m != null && m.duplex ? { duplex: m.duplex } : {})), U = yield O.json();
        return O.ok ? {
          data: { path: C, id: U.Id, fullPath: U.Key },
          error: null
        } : { data: null, error: U };
      } catch (w) {
        if (gr(w))
          return { data: null, error: w };
        throw w;
      }
    });
  }
  /**
   * Uploads a file to an existing bucket.
   *
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  upload(u, s, h) {
    return $i(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("POST", u, s, h);
    });
  }
  /**
   * Upload a file with a token generated from `createSignedUploadUrl`.
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param token The token generated from `createSignedUploadUrl`
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadToSignedUrl(u, s, h, g) {
    return $i(this, void 0, void 0, function* () {
      const w = this._removeEmptyFolders(u), m = this._getFinalPath(w), _ = new URL(this.url + `/object/upload/sign/${m}`);
      _.searchParams.set("token", s);
      try {
        let C;
        const R = Object.assign({ upsert: D_.upsert }, g), O = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(R.upsert) });
        typeof Blob < "u" && h instanceof Blob ? (C = new FormData(), C.append("cacheControl", R.cacheControl), C.append("", h)) : typeof FormData < "u" && h instanceof FormData ? (C = h, C.append("cacheControl", R.cacheControl)) : (C = h, O["cache-control"] = `max-age=${R.cacheControl}`, O["content-type"] = R.contentType);
        const U = yield this.fetch(_.toString(), {
          method: "PUT",
          body: C,
          headers: O
        }), $ = yield U.json();
        return U.ok ? {
          data: { path: w, fullPath: $.Key },
          error: null
        } : { data: null, error: $ };
      } catch (C) {
        if (gr(C))
          return { data: null, error: C };
        throw C;
      }
    });
  }
  /**
   * Creates a signed upload URL.
   * Signed upload URLs can be used to upload files to the bucket without further authentication.
   * They are valid for 2 hours.
   * @param path The file path, including the current file name. For example `folder/image.png`.
   */
  createSignedUploadUrl(u) {
    return $i(this, void 0, void 0, function* () {
      try {
        let s = this._getFinalPath(u);
        const h = yield ru(this.fetch, `${this.url}/object/upload/sign/${s}`, {}, { headers: this.headers }), g = new URL(this.url + h.url), w = g.searchParams.get("token");
        if (!w)
          throw new Nw("No token returned by API");
        return { data: { signedUrl: g.toString(), path: u, token: w }, error: null };
      } catch (s) {
        if (gr(s))
          return { data: null, error: s };
        throw s;
      }
    });
  }
  /**
   * Replaces an existing file at the specified path with a new one.
   *
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  update(u, s, h) {
    return $i(this, void 0, void 0, function* () {
      return this.uploadOrUpdate("PUT", u, s, h);
    });
  }
  /**
   * Moves an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
   */
  move(u, s) {
    return $i(this, void 0, void 0, function* () {
      try {
        return { data: yield ru(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: u, destinationKey: s }, { headers: this.headers }), error: null };
      } catch (h) {
        if (gr(h))
          return { data: null, error: h };
        throw h;
      }
    });
  }
  /**
   * Copies an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
   */
  copy(u, s) {
    return $i(this, void 0, void 0, function* () {
      try {
        return { data: { path: (yield ru(this.fetch, `${this.url}/object/copy`, { bucketId: this.bucketId, sourceKey: u, destinationKey: s }, { headers: this.headers })).Key }, error: null };
      } catch (h) {
        if (gr(h))
          return { data: null, error: h };
        throw h;
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
  createSignedUrl(u, s, h) {
    return $i(this, void 0, void 0, function* () {
      try {
        let g = this._getFinalPath(u), w = yield ru(this.fetch, `${this.url}/object/sign/${g}`, Object.assign({ expiresIn: s }, h != null && h.transform ? { transform: h.transform } : {}), { headers: this.headers });
        const m = h != null && h.download ? `&download=${h.download === !0 ? "" : h.download}` : "";
        return w = { signedUrl: encodeURI(`${this.url}${w.signedURL}${m}`) }, { data: w, error: null };
      } catch (g) {
        if (gr(g))
          return { data: null, error: g };
        throw g;
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
  createSignedUrls(u, s, h) {
    return $i(this, void 0, void 0, function* () {
      try {
        const g = yield ru(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn: s, paths: u }, { headers: this.headers }), w = h != null && h.download ? `&download=${h.download === !0 ? "" : h.download}` : "";
        return {
          data: g.map((m) => Object.assign(Object.assign({}, m), { signedUrl: m.signedURL ? encodeURI(`${this.url}${m.signedURL}${w}`) : null })),
          error: null
        };
      } catch (g) {
        if (gr(g))
          return { data: null, error: g };
        throw g;
      }
    });
  }
  /**
   * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
   *
   * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
   * @param options.transform Transform the asset before serving it to the client.
   */
  download(u, s) {
    return $i(this, void 0, void 0, function* () {
      const g = typeof (s == null ? void 0 : s.transform) < "u" ? "render/image/authenticated" : "object", w = this.transformOptsToQueryString((s == null ? void 0 : s.transform) || {}), m = w ? `?${w}` : "";
      try {
        const _ = this._getFinalPath(u);
        return {
          data: yield (yield bw(this.fetch, `${this.url}/${g}/${_}${m}`, {
            headers: this.headers,
            noResolveJson: !0
          })).blob(), error: null
        };
      } catch (_) {
        if (gr(_))
          return { data: null, error: _ };
        throw _;
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
  getPublicUrl(u, s) {
    const h = this._getFinalPath(u), g = [], w = s != null && s.download ? `download=${s.download === !0 ? "" : s.download}` : "";
    w !== "" && g.push(w);
    const _ = typeof (s == null ? void 0 : s.transform) < "u" ? "render/image" : "object", C = this.transformOptsToQueryString((s == null ? void 0 : s.transform) || {});
    C !== "" && g.push(C);
    let R = g.join("&");
    return R !== "" && (R = `?${R}`), {
      data: { publicUrl: encodeURI(`${this.url}/${_}/public/${h}${R}`) }
    };
  }
  /**
   * Deletes files within the same bucket
   *
   * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
   */
  remove(u) {
    return $i(this, void 0, void 0, function* () {
      try {
        return { data: yield uC(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: u }, { headers: this.headers }), error: null };
      } catch (s) {
        if (gr(s))
          return { data: null, error: s };
        throw s;
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
  list(u, s, h) {
    return $i(this, void 0, void 0, function* () {
      try {
        const g = Object.assign(Object.assign(Object.assign({}, eL), s), { prefix: u || "" });
        return { data: yield ru(this.fetch, `${this.url}/object/list/${this.bucketId}`, g, { headers: this.headers }, h), error: null };
      } catch (g) {
        if (gr(g))
          return { data: null, error: g };
        throw g;
      }
    });
  }
  _getFinalPath(u) {
    return `${this.bucketId}/${u}`;
  }
  _removeEmptyFolders(u) {
    return u.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
  }
  transformOptsToQueryString(u) {
    const s = [];
    return u.width && s.push(`width=${u.width}`), u.height && s.push(`height=${u.height}`), u.resize && s.push(`resize=${u.resize}`), u.format && s.push(`format=${u.format}`), u.quality && s.push(`quality=${u.quality}`), s.join("&");
  }
}
const nL = "2.5.5", rL = { "X-Client-Info": `storage-js/${nL}` };
var xf = function (d, u, s, h) {
  function g(w) {
    return w instanceof s ? w : new s(function (m) {
      m(w);
    });
  }
  return new (s || (s = Promise))(function (w, m) {
    function _(O) {
      try {
        R(h.next(O));
      } catch (U) {
        m(U);
      }
    }
    function C(O) {
      try {
        R(h.throw(O));
      } catch (U) {
        m(U);
      }
    }
    function R(O) {
      O.done ? w(O.value) : g(O.value).then(_, C);
    }
    R((h = h.apply(d, u || [])).next());
  });
};
class iL {
  constructor(u, s = {}, h) {
    this.url = u, this.headers = Object.assign(Object.assign({}, rL), s), this.fetch = lC(h);
  }
  /**
   * Retrieves the details of all Storage buckets within an existing project.
   */
  listBuckets() {
    return xf(this, void 0, void 0, function* () {
      try {
        return { data: yield bw(this.fetch, `${this.url}/bucket`, { headers: this.headers }), error: null };
      } catch (u) {
        if (gr(u))
          return { data: null, error: u };
        throw u;
      }
    });
  }
  /**
   * Retrieves the details of an existing Storage bucket.
   *
   * @param id The unique identifier of the bucket you would like to retrieve.
   */
  getBucket(u) {
    return xf(this, void 0, void 0, function* () {
      try {
        return { data: yield bw(this.fetch, `${this.url}/bucket/${u}`, { headers: this.headers }), error: null };
      } catch (s) {
        if (gr(s))
          return { data: null, error: s };
        throw s;
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
  createBucket(u, s = {
    public: !1
  }) {
    return xf(this, void 0, void 0, function* () {
      try {
        return {
          data: yield ru(this.fetch, `${this.url}/bucket`, {
            id: u,
            name: u,
            public: s.public,
            file_size_limit: s.fileSizeLimit,
            allowed_mime_types: s.allowedMimeTypes
          }, { headers: this.headers }), error: null
        };
      } catch (h) {
        if (gr(h))
          return { data: null, error: h };
        throw h;
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
  updateBucket(u, s) {
    return xf(this, void 0, void 0, function* () {
      try {
        return {
          data: yield ZO(this.fetch, `${this.url}/bucket/${u}`, {
            id: u,
            name: u,
            public: s.public,
            file_size_limit: s.fileSizeLimit,
            allowed_mime_types: s.allowedMimeTypes
          }, { headers: this.headers }), error: null
        };
      } catch (h) {
        if (gr(h))
          return { data: null, error: h };
        throw h;
      }
    });
  }
  /**
   * Removes all objects inside a single bucket.
   *
   * @param id The unique identifier of the bucket you would like to empty.
   */
  emptyBucket(u) {
    return xf(this, void 0, void 0, function* () {
      try {
        return { data: yield ru(this.fetch, `${this.url}/bucket/${u}/empty`, {}, { headers: this.headers }), error: null };
      } catch (s) {
        if (gr(s))
          return { data: null, error: s };
        throw s;
      }
    });
  }
  /**
   * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
   * You must first `empty()` the bucket.
   *
   * @param id The unique identifier of the bucket you would like to delete.
   */
  deleteBucket(u) {
    return xf(this, void 0, void 0, function* () {
      try {
        return { data: yield uC(this.fetch, `${this.url}/bucket/${u}`, {}, { headers: this.headers }), error: null };
      } catch (s) {
        if (gr(s))
          return { data: null, error: s };
        throw s;
      }
    });
  }
}
class aL extends iL {
  constructor(u, s = {}, h) {
    super(u, s, h);
  }
  /**
   * Perform file operation in a bucket.
   *
   * @param id The bucket id to operate on.
   */
  from(u) {
    return new tL(this.url, this.headers, u, this.fetch);
  }
}
const oL = "2.39.3";
let ip = "";
typeof Deno < "u" ? ip = "deno" : typeof document < "u" ? ip = "web" : typeof navigator < "u" && navigator.product === "ReactNative" ? ip = "react-native" : ip = "node";
const lL = { "X-Client-Info": `supabase-js-${ip}/${oL}` };
var uL = function (d, u, s, h) {
  function g(w) {
    return w instanceof s ? w : new s(function (m) {
      m(w);
    });
  }
  return new (s || (s = Promise))(function (w, m) {
    function _(O) {
      try {
        R(h.next(O));
      } catch (U) {
        m(U);
      }
    }
    function C(O) {
      try {
        R(h.throw(O));
      } catch (U) {
        m(U);
      }
    }
    function R(O) {
      O.done ? w(O.value) : g(O.value).then(_, C);
    }
    R((h = h.apply(d, u || [])).next());
  });
};
const sL = (d) => {
  let u;
  return d ? u = d : typeof fetch > "u" ? u = Aw : u = fetch, (...s) => u(...s);
}, cL = () => typeof Headers > "u" ? rC : Headers, fL = (d, u, s) => {
  const h = sL(s), g = cL();
  return (w, m) => uL(void 0, void 0, void 0, function* () {
    var _;
    const C = (_ = yield u()) !== null && _ !== void 0 ? _ : d;
    let R = new g(m == null ? void 0 : m.headers);
    return R.has("apikey") || R.set("apikey", d), R.has("Authorization") || R.set("Authorization", `Bearer ${C}`), h(w, Object.assign(Object.assign({}, m), { headers: R }));
  });
};
function dL(d) {
  return d.replace(/\/$/, "");
}
function hL(d, u) {
  const { db: s, auth: h, realtime: g, global: w } = d, { db: m, auth: _, realtime: C, global: R } = u;
  return {
    db: Object.assign(Object.assign({}, m), s),
    auth: Object.assign(Object.assign({}, _), h),
    realtime: Object.assign(Object.assign({}, C), g),
    global: Object.assign(Object.assign({}, R), w)
  };
}
function pL(d) {
  return Math.round(Date.now() / 1e3) + d;
}
function vL() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (d) {
    const u = Math.random() * 16 | 0;
    return (d == "x" ? u : u & 3 | 8).toString(16);
  });
}
const Sa = () => typeof document < "u", Es = {
  tested: !1,
  writable: !1
}, op = () => {
  if (!Sa())
    return !1;
  try {
    if (typeof globalThis.localStorage != "object")
      return !1;
  } catch {
    return !1;
  }
  if (Es.tested)
    return Es.writable;
  const d = `lswt-${Math.random()}${Math.random()}`;
  try {
    globalThis.localStorage.setItem(d, d), globalThis.localStorage.removeItem(d), Es.tested = !0, Es.writable = !0;
  } catch {
    Es.tested = !0, Es.writable = !1;
  }
  return Es.writable;
};
function lw(d) {
  const u = {}, s = new URL(d);
  if (s.hash && s.hash[0] === "#")
    try {
      new URLSearchParams(s.hash.substring(1)).forEach((g, w) => {
        u[w] = g;
      });
    } catch {
    }
  return s.searchParams.forEach((h, g) => {
    u[g] = h;
  }), u;
}
const sC = (d) => {
  let u;
  return d ? u = d : typeof fetch > "u" ? u = (...s) => Promise.resolve().then(() => sp).then(({ default: h }) => h(...s)) : u = fetch, (...s) => u(...s);
}, mL = (d) => typeof d == "object" && d !== null && "status" in d && "ok" in d && "json" in d && typeof d.json == "function", _s = async (d, u, s) => {
  await d.setItem(u, JSON.stringify(s));
}, vy = async (d, u) => {
  const s = await d.getItem(u);
  if (!s)
    return null;
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}, uw = async (d, u) => {
  await d.removeItem(u);
};
function yL(d) {
  const u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let s = "", h, g, w, m, _, C, R, O = 0;
  for (d = d.replace("-", "+").replace("_", "/"); O < d.length;)
    m = u.indexOf(d.charAt(O++)), _ = u.indexOf(d.charAt(O++)), C = u.indexOf(d.charAt(O++)), R = u.indexOf(d.charAt(O++)), h = m << 2 | _ >> 4, g = (_ & 15) << 4 | C >> 2, w = (C & 3) << 6 | R, s = s + String.fromCharCode(h), C != 64 && g != 0 && (s = s + String.fromCharCode(g)), R != 64 && w != 0 && (s = s + String.fromCharCode(w));
  return s;
}
class xy {
  constructor() {
    this.promise = new xy.promiseConstructor((u, s) => {
      this.resolve = u, this.reject = s;
    });
  }
}
xy.promiseConstructor = Promise;
function O_(d) {
  const u = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}=?$|[a-z0-9_-]{2}(==)?$)$/i, s = d.split(".");
  if (s.length !== 3)
    throw new Error("JWT is not valid: not a JWT structure");
  if (!u.test(s[1]))
    throw new Error("JWT is not valid: payload is not in base64url format");
  const h = s[1];
  return JSON.parse(yL(h));
}
async function gL(d) {
  return await new Promise((u) => {
    setTimeout(() => u(null), d);
  });
}
function SL(d, u) {
  return new Promise((h, g) => {
    (async () => {
      for (let w = 0; w < 1 / 0; w++)
        try {
          const m = await d(w);
          if (!u(w, null, m)) {
            h(m);
            return;
          }
        } catch (m) {
          if (!u(w, m)) {
            g(m);
            return;
          }
        }
    })();
  });
}
function wL(d) {
  return ("0" + d.toString(16)).substr(-2);
}
function Tf() {
  const u = new Uint32Array(56);
  if (typeof crypto > "u") {
    const s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~", h = s.length;
    let g = "";
    for (let w = 0; w < 56; w++)
      g += s.charAt(Math.floor(Math.random() * h));
    return g;
  }
  return crypto.getRandomValues(u), Array.from(u, wL).join("");
}
async function bL(d) {
  const s = new TextEncoder().encode(d), h = await crypto.subtle.digest("SHA-256", s), g = new Uint8Array(h);
  return Array.from(g).map((w) => String.fromCharCode(w)).join("");
}
function EL(d) {
  return btoa(d).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function Rf(d) {
  if (!(typeof crypto < "u" && typeof crypto.subtle < "u" && typeof TextEncoder < "u"))
    return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."), d;
  const s = await bL(d);
  return EL(s);
}
class zw extends Error {
  constructor(u, s) {
    super(u), this.__isAuthError = !0, this.name = "AuthError", this.status = s;
  }
}
function rt(d) {
  return typeof d == "object" && d !== null && "__isAuthError" in d;
}
class _L extends zw {
  constructor(u, s) {
    super(u, s), this.name = "AuthApiError", this.status = s;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
}
function CL(d) {
  return rt(d) && d.name === "AuthApiError";
}
class cC extends zw {
  constructor(u, s) {
    super(u), this.name = "AuthUnknownError", this.originalError = s;
  }
}
class Rs extends zw {
  constructor(u, s, h) {
    super(u), this.name = s, this.status = h;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
}
class kf extends Rs {
  constructor() {
    super("Auth session missing!", "AuthSessionMissingError", 400);
  }
}
class sw extends Rs {
  constructor() {
    super("Auth session or user missing", "AuthInvalidTokenResponseError", 500);
  }
}
class my extends Rs {
  constructor(u) {
    super(u, "AuthInvalidCredentialsError", 400);
  }
}
class yy extends Rs {
  constructor(u, s = null) {
    super(u, "AuthImplicitGrantRedirectError", 500), this.details = null, this.details = s;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}
class L_ extends Rs {
  constructor(u, s = null) {
    super(u, "AuthPKCEGrantCodeExchangeError", 500), this.details = null, this.details = s;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}
class Ew extends Rs {
  constructor(u, s) {
    super(u, "AuthRetryableFetchError", s);
  }
}
function cw(d) {
  return rt(d) && d.name === "AuthRetryableFetchError";
}
class xL extends Rs {
  constructor(u, s, h) {
    super(u, "AuthWeakPasswordError", s), this.reasons = h;
  }
}
var TL = function (d, u) {
  var s = {};
  for (var h in d)
    Object.prototype.hasOwnProperty.call(d, h) && u.indexOf(h) < 0 && (s[h] = d[h]);
  if (d != null && typeof Object.getOwnPropertySymbols == "function")
    for (var g = 0, h = Object.getOwnPropertySymbols(d); g < h.length; g++)
      u.indexOf(h[g]) < 0 && Object.prototype.propertyIsEnumerable.call(d, h[g]) && (s[h[g]] = d[h[g]]);
  return s;
};
const Af = (d) => d.msg || d.message || d.error_description || d.error || JSON.stringify(d), RL = [502, 503, 504];
async function A_(d) {
  if (!mL(d))
    throw new Ew(Af(d), 0);
  if (RL.includes(d.status))
    throw new Ew(Af(d), d.status);
  let u;
  try {
    u = await d.json();
  } catch (s) {
    throw new cC(Af(s), s);
  }
  throw typeof u == "object" && u && typeof u.weak_password == "object" && u.weak_password && Array.isArray(u.weak_password.reasons) && u.weak_password.reasons.length && u.weak_password.reasons.reduce((s, h) => s && typeof h == "string", !0) ? new xL(Af(u), d.status, u.weak_password.reasons) : new _L(Af(u), d.status || 500);
}
const kL = (d, u, s, h) => {
  const g = { method: d, headers: (u == null ? void 0 : u.headers) || {} };
  return d === "GET" ? g : (g.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, u == null ? void 0 : u.headers), g.body = JSON.stringify(h), Object.assign(Object.assign({}, g), s));
};
async function ut(d, u, s, h) {
  var g;
  const w = Object.assign({}, h == null ? void 0 : h.headers);
  h != null && h.jwt && (w.Authorization = `Bearer ${h.jwt}`);
  const m = (g = h == null ? void 0 : h.query) !== null && g !== void 0 ? g : {};
  h != null && h.redirectTo && (m.redirect_to = h.redirectTo);
  const _ = Object.keys(m).length ? "?" + new URLSearchParams(m).toString() : "", C = await DL(d, u, s + _, { headers: w, noResolveJson: h == null ? void 0 : h.noResolveJson }, {}, h == null ? void 0 : h.body);
  return h != null && h.xform ? h == null ? void 0 : h.xform(C) : { data: Object.assign({}, C), error: null };
}
async function DL(d, u, s, h, g, w) {
  const m = kL(u, h, g, w);
  let _;
  try {
    _ = await d(s, m);
  } catch (C) {
    throw console.error(C), new Ew(Af(C), 0);
  }
  if (_.ok || await A_(_), h != null && h.noResolveJson)
    return _;
  try {
    return await _.json();
  } catch (C) {
    await A_(C);
  }
}
function Cs(d) {
  var u;
  let s = null;
  ML(d) && (s = Object.assign({}, d), d.expires_at || (s.expires_at = pL(d.expires_in)));
  const h = (u = d.user) !== null && u !== void 0 ? u : d;
  return { data: { session: s, user: h }, error: null };
}
function M_(d) {
  const u = Cs(d);
  return !u.error && d.weak_password && typeof d.weak_password == "object" && Array.isArray(d.weak_password.reasons) && d.weak_password.reasons.length && d.weak_password.message && typeof d.weak_password.message == "string" && d.weak_password.reasons.reduce((s, h) => s && typeof h == "string", !0) && (u.data.weak_password = d.weak_password), u;
}
function ou(d) {
  var u;
  return { data: { user: (u = d.user) !== null && u !== void 0 ? u : d }, error: null };
}
function OL(d) {
  return { data: d, error: null };
}
function LL(d) {
  const { action_link: u, email_otp: s, hashed_token: h, redirect_to: g, verification_type: w } = d, m = TL(d, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]), _ = {
    action_link: u,
    email_otp: s,
    hashed_token: h,
    redirect_to: g,
    verification_type: w
  }, C = Object.assign({}, m);
  return {
    data: {
      properties: _,
      user: C
    },
    error: null
  };
}
function AL(d) {
  return d;
}
function ML(d) {
  return d.access_token && d.refresh_token && d.expires_in;
}
var UL = function (d, u) {
  var s = {};
  for (var h in d)
    Object.prototype.hasOwnProperty.call(d, h) && u.indexOf(h) < 0 && (s[h] = d[h]);
  if (d != null && typeof Object.getOwnPropertySymbols == "function")
    for (var g = 0, h = Object.getOwnPropertySymbols(d); g < h.length; g++)
      u.indexOf(h[g]) < 0 && Object.prototype.propertyIsEnumerable.call(d, h[g]) && (s[h[g]] = d[h[g]]);
  return s;
};
class NL {
  constructor({ url: u = "", headers: s = {}, fetch: h }) {
    this.url = u, this.headers = s, this.fetch = sC(h), this.mfa = {
      listFactors: this._listFactors.bind(this),
      deleteFactor: this._deleteFactor.bind(this)
    };
  }
  /**
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   * @param scope The logout sope.
   */
  async signOut(u, s = "global") {
    try {
      return await ut(this.fetch, "POST", `${this.url}/logout?scope=${s}`, {
        headers: this.headers,
        jwt: u,
        noResolveJson: !0
      }), { data: null, error: null };
    } catch (h) {
      if (rt(h))
        return { data: null, error: h };
      throw h;
    }
  }
  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param options Additional options to be included when inviting.
   */
  async inviteUserByEmail(u, s = {}) {
    try {
      return await ut(this.fetch, "POST", `${this.url}/invite`, {
        body: { email: u, data: s.data },
        headers: this.headers,
        redirectTo: s.redirectTo,
        xform: ou
      });
    } catch (h) {
      if (rt(h))
        return { data: { user: null }, error: h };
      throw h;
    }
  }
  /**
   * Generates email links and OTPs to be sent via a custom email provider.
   * @param email The user's email.
   * @param options.password User password. For signup only.
   * @param options.data Optional user metadata. For signup only.
   * @param options.redirectTo The redirect url which should be appended to the generated link
   */
  async generateLink(u) {
    try {
      const { options: s } = u, h = UL(u, ["options"]), g = Object.assign(Object.assign({}, h), s);
      return "newEmail" in h && (g.new_email = h == null ? void 0 : h.newEmail, delete g.newEmail), await ut(this.fetch, "POST", `${this.url}/admin/generate_link`, {
        body: g,
        headers: this.headers,
        xform: LL,
        redirectTo: s == null ? void 0 : s.redirectTo
      });
    } catch (s) {
      if (rt(s))
        return {
          data: {
            properties: null,
            user: null
          },
          error: s
        };
      throw s;
    }
  }
  // User Admin API
  /**
   * Creates a new user.
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async createUser(u) {
    try {
      return await ut(this.fetch, "POST", `${this.url}/admin/users`, {
        body: u,
        headers: this.headers,
        xform: ou
      });
    } catch (s) {
      if (rt(s))
        return { data: { user: null }, error: s };
      throw s;
    }
  }
  /**
   * Get a list of users.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
   */
  async listUsers(u) {
    var s, h, g, w, m, _, C;
    try {
      const R = { nextPage: null, lastPage: 0, total: 0 }, O = await ut(this.fetch, "GET", `${this.url}/admin/users`, {
        headers: this.headers,
        noResolveJson: !0,
        query: {
          page: (h = (s = u == null ? void 0 : u.page) === null || s === void 0 ? void 0 : s.toString()) !== null && h !== void 0 ? h : "",
          per_page: (w = (g = u == null ? void 0 : u.perPage) === null || g === void 0 ? void 0 : g.toString()) !== null && w !== void 0 ? w : ""
        },
        xform: AL
      });
      if (O.error)
        throw O.error;
      const U = await O.json(), $ = (m = O.headers.get("x-total-count")) !== null && m !== void 0 ? m : 0, B = (C = (_ = O.headers.get("link")) === null || _ === void 0 ? void 0 : _.split(",")) !== null && C !== void 0 ? C : [];
      return B.length > 0 && (B.forEach((X) => {
        const ee = parseInt(X.split(";")[0].split("=")[1].substring(0, 1)), re = JSON.parse(X.split(";")[1].split("=")[1]);
        R[`${re}Page`] = ee;
      }), R.total = parseInt($)), { data: Object.assign(Object.assign({}, U), R), error: null };
    } catch (R) {
      if (rt(R))
        return { data: { users: [] }, error: R };
      throw R;
    }
  }
  /**
   * Get user by id.
   *
   * @param uid The user's unique identifier
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async getUserById(u) {
    try {
      return await ut(this.fetch, "GET", `${this.url}/admin/users/${u}`, {
        headers: this.headers,
        xform: ou
      });
    } catch (s) {
      if (rt(s))
        return { data: { user: null }, error: s };
      throw s;
    }
  }
  /**
   * Updates the user data.
   *
   * @param attributes The data you want to update.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async updateUserById(u, s) {
    try {
      return await ut(this.fetch, "PUT", `${this.url}/admin/users/${u}`, {
        body: s,
        headers: this.headers,
        xform: ou
      });
    } catch (h) {
      if (rt(h))
        return { data: { user: null }, error: h };
      throw h;
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
  async deleteUser(u, s = !1) {
    try {
      return await ut(this.fetch, "DELETE", `${this.url}/admin/users/${u}`, {
        headers: this.headers,
        body: {
          should_soft_delete: s
        },
        xform: ou
      });
    } catch (h) {
      if (rt(h))
        return { data: { user: null }, error: h };
      throw h;
    }
  }
  async _listFactors(u) {
    try {
      const { data: s, error: h } = await ut(this.fetch, "GET", `${this.url}/admin/users/${u.userId}/factors`, {
        headers: this.headers,
        xform: (g) => ({ data: { factors: g }, error: null })
      });
      return { data: s, error: h };
    } catch (s) {
      if (rt(s))
        return { data: null, error: s };
      throw s;
    }
  }
  async _deleteFactor(u) {
    try {
      return {
        data: await ut(this.fetch, "DELETE", `${this.url}/admin/users/${u.userId}/factors/${u.id}`, {
          headers: this.headers
        }), error: null
      };
    } catch (s) {
      if (rt(s))
        return { data: null, error: s };
      throw s;
    }
  }
}
const fC = "0.0.0", zL = "http://localhost:9999", jL = "supabase.auth.token", FL = { "X-Client-Info": `gotrue-js/${fC}` }, U_ = 10, $L = {
  getItem: (d) => op() ? globalThis.localStorage.getItem(d) : null,
  setItem: (d, u) => {
    op() && globalThis.localStorage.setItem(d, u);
  },
  removeItem: (d) => {
    op() && globalThis.localStorage.removeItem(d);
  }
};
function N_(d = {}) {
  return {
    getItem: (u) => d[u] || null,
    setItem: (u, s) => {
      d[u] = s;
    },
    removeItem: (u) => {
      delete d[u];
    }
  };
}
function HL() {
  if (typeof globalThis != "object")
    try {
      Object.defineProperty(Object.prototype, "__magic__", {
        get: function () {
          return this;
        },
        configurable: !0
      }), __magic__.globalThis = __magic__, delete Object.prototype.__magic__;
    } catch {
      typeof self < "u" && (self.globalThis = self);
    }
}
const Df = {
  /**
   * @experimental
   */
  debug: !!(globalThis && op() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
};
class dC extends Error {
  constructor(u) {
    super(u), this.isAcquireTimeout = !0;
  }
}
class PL extends dC {
}
async function VL(d, u, s) {
  Df.debug && console.log("@supabase/gotrue-js: navigatorLock: acquire lock", d, u);
  const h = new globalThis.AbortController();
  return u > 0 && setTimeout(() => {
    h.abort(), Df.debug && console.log("@supabase/gotrue-js: navigatorLock acquire timed out", d);
  }, u), await globalThis.navigator.locks.request(d, u === 0 ? {
    mode: "exclusive",
    ifAvailable: !0
  } : {
    mode: "exclusive",
    signal: h.signal
  }, async (g) => {
    if (g) {
      Df.debug && console.log("@supabase/gotrue-js: navigatorLock: acquired", d, g.name);
      try {
        return await s();
      } finally {
        Df.debug && console.log("@supabase/gotrue-js: navigatorLock: released", d, g.name);
      }
    } else {
      if (u === 0)
        throw Df.debug && console.log("@supabase/gotrue-js: navigatorLock: not immediately available", d), new PL(`Acquiring an exclusive Navigator LockManager lock "${d}" immediately failed`);
      if (Df.debug)
        try {
          const w = await globalThis.navigator.locks.query();
          console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(w, null, "  "));
        } catch (w) {
          console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", w);
        }
      return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"), await s();
    }
  });
}
HL();
const BL = {
  url: zL,
  storageKey: jL,
  autoRefreshToken: !0,
  persistSession: !0,
  detectSessionInUrl: !0,
  headers: FL,
  flowType: "implicit",
  debug: !1
}, np = 30 * 1e3, z_ = 3;
async function j_(d, u, s) {
  return await s();
}
class lp {
  /**
   * Create a new client for use in the browser.
   */
  constructor(u) {
    var s, h;
    this.memoryStorage = null, this.stateChangeEmitters = /* @__PURE__ */ new Map(), this.autoRefreshTicker = null, this.visibilityChangedCallback = null, this.refreshingDeferred = null, this.initializePromise = null, this.detectSessionInUrl = !0, this.lockAcquired = !1, this.pendingInLock = [], this.broadcastChannel = null, this.logger = console.log, this.instanceID = lp.nextInstanceID, lp.nextInstanceID += 1, this.instanceID > 0 && Sa() && console.warn("Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.");
    const g = Object.assign(Object.assign({}, BL), u);
    if (this.logDebugMessages = !!g.debug, typeof g.debug == "function" && (this.logger = g.debug), this.persistSession = g.persistSession, this.storageKey = g.storageKey, this.autoRefreshToken = g.autoRefreshToken, this.admin = new NL({
      url: g.url,
      headers: g.headers,
      fetch: g.fetch
    }), this.url = g.url, this.headers = g.headers, this.fetch = sC(g.fetch), this.lock = g.lock || j_, this.detectSessionInUrl = g.detectSessionInUrl, this.flowType = g.flowType, g.lock ? this.lock = g.lock : Sa() && (!((s = globalThis == null ? void 0 : globalThis.navigator) === null || s === void 0) && s.locks) ? this.lock = VL : this.lock = j_, this.mfa = {
      verify: this._verify.bind(this),
      enroll: this._enroll.bind(this),
      unenroll: this._unenroll.bind(this),
      challenge: this._challenge.bind(this),
      listFactors: this._listFactors.bind(this),
      challengeAndVerify: this._challengeAndVerify.bind(this),
      getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this)
    }, this.persistSession ? g.storage ? this.storage = g.storage : op() ? this.storage = $L : (this.memoryStorage = {}, this.storage = N_(this.memoryStorage)) : (this.memoryStorage = {}, this.storage = N_(this.memoryStorage)), Sa() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
      } catch (w) {
        console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", w);
      }
      (h = this.broadcastChannel) === null || h === void 0 || h.addEventListener("message", async (w) => {
        this._debug("received broadcast notification from other tab or client", w), await this._notifyAllSubscribers(w.data.event, w.data.session, !1);
      });
    }
    this.initialize();
  }
  _debug(...u) {
    return this.logDebugMessages && this.logger(`GoTrueClient@${this.instanceID} (${fC}) ${(/* @__PURE__ */ new Date()).toISOString()}`, ...u), this;
  }
  /**
   * Initializes the client session either from the url or from storage.
   * This method is automatically called when instantiating the client, but should also be called
   * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
   */
  async initialize() {
    return this.initializePromise ? await this.initializePromise : (this.initializePromise = (async () => await this._acquireLock(-1, async () => await this._initialize()))(), await this.initializePromise);
  }
  /**
   * IMPORTANT:
   * 1. Never throw in this method, as it is called from the constructor
   * 2. Never return a session from this method as it would be cached over
   *    the whole lifetime of the client
   */
  async _initialize() {
    try {
      const u = Sa() ? await this._isPKCEFlow() : !1;
      if (this._debug("#_initialize()", "begin", "is PKCE flow", u), u || this.detectSessionInUrl && this._isImplicitGrantFlow()) {
        const { data: s, error: h } = await this._getSessionFromURL(u);
        if (h)
          return this._debug("#_initialize()", "error detecting session from URL", h), (h == null ? void 0 : h.message) === "Identity is already linked" || (h == null ? void 0 : h.message) === "Identity is already linked to another user" ? { error: h } : (await this._removeSession(), { error: h });
        const { session: g, redirectType: w } = s;
        return this._debug("#_initialize()", "detected session in URL", g, "redirect type", w), await this._saveSession(g), setTimeout(async () => {
          w === "recovery" ? await this._notifyAllSubscribers("PASSWORD_RECOVERY", g) : await this._notifyAllSubscribers("SIGNED_IN", g);
        }, 0), { error: null };
      }
      return await this._recoverAndRefresh(), { error: null };
    } catch (u) {
      return rt(u) ? { error: u } : {
        error: new cC("Unexpected error during initialization", u)
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
  async signUp(u) {
    var s, h, g;
    try {
      await this._removeSession();
      let w;
      if ("email" in u) {
        const { email: O, password: U, options: $ } = u;
        let B = null, X = null;
        if (this.flowType === "pkce") {
          const ee = Tf();
          await _s(this.storage, `${this.storageKey}-code-verifier`, ee), B = await Rf(ee), X = ee === B ? "plain" : "s256";
        }
        w = await ut(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          redirectTo: $ == null ? void 0 : $.emailRedirectTo,
          body: {
            email: O,
            password: U,
            data: (s = $ == null ? void 0 : $.data) !== null && s !== void 0 ? s : {},
            gotrue_meta_security: { captcha_token: $ == null ? void 0 : $.captchaToken },
            code_challenge: B,
            code_challenge_method: X
          },
          xform: Cs
        });
      } else if ("phone" in u) {
        const { phone: O, password: U, options: $ } = u;
        w = await ut(this.fetch, "POST", `${this.url}/signup`, {
          headers: this.headers,
          body: {
            phone: O,
            password: U,
            data: (h = $ == null ? void 0 : $.data) !== null && h !== void 0 ? h : {},
            channel: (g = $ == null ? void 0 : $.channel) !== null && g !== void 0 ? g : "sms",
            gotrue_meta_security: { captcha_token: $ == null ? void 0 : $.captchaToken }
          },
          xform: Cs
        });
      } else
        throw new my("You must provide either an email or phone number and a password");
      const { data: m, error: _ } = w;
      if (_ || !m)
        return { data: { user: null, session: null }, error: _ };
      const C = m.session, R = m.user;
      return m.session && (await this._saveSession(m.session), await this._notifyAllSubscribers("SIGNED_IN", C)), { data: { user: R, session: C }, error: null };
    } catch (w) {
      if (rt(w))
        return { data: { user: null, session: null }, error: w };
      throw w;
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
  async signInWithPassword(u) {
    try {
      await this._removeSession();
      let s;
      if ("email" in u) {
        const { email: w, password: m, options: _ } = u;
        s = await ut(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            email: w,
            password: m,
            gotrue_meta_security: { captcha_token: _ == null ? void 0 : _.captchaToken }
          },
          xform: M_
        });
      } else if ("phone" in u) {
        const { phone: w, password: m, options: _ } = u;
        s = await ut(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            phone: w,
            password: m,
            gotrue_meta_security: { captcha_token: _ == null ? void 0 : _.captchaToken }
          },
          xform: M_
        });
      } else
        throw new my("You must provide either an email or phone number and a password");
      const { data: h, error: g } = s;
      return g ? { data: { user: null, session: null }, error: g } : !h || !h.session || !h.user ? { data: { user: null, session: null }, error: new sw() } : (h.session && (await this._saveSession(h.session), await this._notifyAllSubscribers("SIGNED_IN", h.session)), {
        data: Object.assign({ user: h.user, session: h.session }, h.weak_password ? { weakPassword: h.weak_password } : null),
        error: g
      });
    } catch (s) {
      if (rt(s))
        return { data: { user: null, session: null }, error: s };
      throw s;
    }
  }
  /**
   * Log in an existing user via a third-party provider.
   * This method supports the PKCE flow.
   */
  async signInWithOAuth(u) {
    var s, h, g, w;
    return await this._removeSession(), await this._handleProviderSignIn(u.provider, {
      redirectTo: (s = u.options) === null || s === void 0 ? void 0 : s.redirectTo,
      scopes: (h = u.options) === null || h === void 0 ? void 0 : h.scopes,
      queryParams: (g = u.options) === null || g === void 0 ? void 0 : g.queryParams,
      skipBrowserRedirect: (w = u.options) === null || w === void 0 ? void 0 : w.skipBrowserRedirect
    });
  }
  /**
   * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
   */
  async exchangeCodeForSession(u) {
    return await this.initializePromise, this._acquireLock(-1, async () => this._exchangeCodeForSession(u));
  }
  async _exchangeCodeForSession(u) {
    const s = await vy(this.storage, `${this.storageKey}-code-verifier`), [h, g] = (s ?? "").split("/"), { data: w, error: m } = await ut(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
      headers: this.headers,
      body: {
        auth_code: u,
        code_verifier: h
      },
      xform: Cs
    });
    return await uw(this.storage, `${this.storageKey}-code-verifier`), m ? { data: { user: null, session: null, redirectType: null }, error: m } : !w || !w.session || !w.user ? {
      data: { user: null, session: null, redirectType: null },
      error: new sw()
    } : (w.session && (await this._saveSession(w.session), await this._notifyAllSubscribers("SIGNED_IN", w.session)), { data: Object.assign(Object.assign({}, w), { redirectType: g ?? null }), error: m });
  }
  /**
   * Allows signing in with an OIDC ID token. The authentication provider used
   * should be enabled and configured.
   */
  async signInWithIdToken(u) {
    await this._removeSession();
    try {
      const { options: s, provider: h, token: g, access_token: w, nonce: m } = u, _ = await ut(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
        headers: this.headers,
        body: {
          provider: h,
          id_token: g,
          access_token: w,
          nonce: m,
          gotrue_meta_security: { captcha_token: s == null ? void 0 : s.captchaToken }
        },
        xform: Cs
      }), { data: C, error: R } = _;
      return R ? { data: { user: null, session: null }, error: R } : !C || !C.session || !C.user ? {
        data: { user: null, session: null },
        error: new sw()
      } : (C.session && (await this._saveSession(C.session), await this._notifyAllSubscribers("SIGNED_IN", C.session)), { data: C, error: R });
    } catch (s) {
      if (rt(s))
        return { data: { user: null, session: null }, error: s };
      throw s;
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
  async signInWithOtp(u) {
    var s, h, g, w, m;
    try {
      if (await this._removeSession(), "email" in u) {
        const { email: _, options: C } = u;
        let R = null, O = null;
        if (this.flowType === "pkce") {
          const $ = Tf();
          await _s(this.storage, `${this.storageKey}-code-verifier`, $), R = await Rf($), O = $ === R ? "plain" : "s256";
        }
        const { error: U } = await ut(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            email: _,
            data: (s = C == null ? void 0 : C.data) !== null && s !== void 0 ? s : {},
            create_user: (h = C == null ? void 0 : C.shouldCreateUser) !== null && h !== void 0 ? h : !0,
            gotrue_meta_security: { captcha_token: C == null ? void 0 : C.captchaToken },
            code_challenge: R,
            code_challenge_method: O
          },
          redirectTo: C == null ? void 0 : C.emailRedirectTo
        });
        return { data: { user: null, session: null }, error: U };
      }
      if ("phone" in u) {
        const { phone: _, options: C } = u, { data: R, error: O } = await ut(this.fetch, "POST", `${this.url}/otp`, {
          headers: this.headers,
          body: {
            phone: _,
            data: (g = C == null ? void 0 : C.data) !== null && g !== void 0 ? g : {},
            create_user: (w = C == null ? void 0 : C.shouldCreateUser) !== null && w !== void 0 ? w : !0,
            gotrue_meta_security: { captcha_token: C == null ? void 0 : C.captchaToken },
            channel: (m = C == null ? void 0 : C.channel) !== null && m !== void 0 ? m : "sms"
          }
        });
        return { data: { user: null, session: null, messageId: R == null ? void 0 : R.message_id }, error: O };
      }
      throw new my("You must provide either an email or phone number.");
    } catch (_) {
      if (rt(_))
        return { data: { user: null, session: null }, error: _ };
      throw _;
    }
  }
  /**
   * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
   */
  async verifyOtp(u) {
    var s, h;
    try {
      u.type !== "email_change" && u.type !== "phone_change" && await this._removeSession();
      let g, w;
      "options" in u && (g = (s = u.options) === null || s === void 0 ? void 0 : s.redirectTo, w = (h = u.options) === null || h === void 0 ? void 0 : h.captchaToken);
      const { data: m, error: _ } = await ut(this.fetch, "POST", `${this.url}/verify`, {
        headers: this.headers,
        body: Object.assign(Object.assign({}, u), { gotrue_meta_security: { captcha_token: w } }),
        redirectTo: g,
        xform: Cs
      });
      if (_)
        throw _;
      if (!m)
        throw new Error("An error occurred on token verification.");
      const C = m.session, R = m.user;
      return C != null && C.access_token && (await this._saveSession(C), await this._notifyAllSubscribers(u.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", C)), { data: { user: R, session: C }, error: null };
    } catch (g) {
      if (rt(g))
        return { data: { user: null, session: null }, error: g };
      throw g;
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
  async signInWithSSO(u) {
    var s, h, g;
    try {
      await this._removeSession();
      let w = null, m = null;
      if (this.flowType === "pkce") {
        const _ = Tf();
        await _s(this.storage, `${this.storageKey}-code-verifier`, _), w = await Rf(_), m = _ === w ? "plain" : "s256";
      }
      return await ut(this.fetch, "POST", `${this.url}/sso`, {
        body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in u ? { provider_id: u.providerId } : null), "domain" in u ? { domain: u.domain } : null), { redirect_to: (h = (s = u.options) === null || s === void 0 ? void 0 : s.redirectTo) !== null && h !== void 0 ? h : void 0 }), !((g = u == null ? void 0 : u.options) === null || g === void 0) && g.captchaToken ? { gotrue_meta_security: { captcha_token: u.options.captchaToken } } : null), { skip_http_redirect: !0, code_challenge: w, code_challenge_method: m }),
        headers: this.headers,
        xform: OL
      });
    } catch (w) {
      if (rt(w))
        return { data: null, error: w };
      throw w;
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
      return await this._useSession(async (u) => {
        const { data: { session: s }, error: h } = u;
        if (h)
          throw h;
        if (!s)
          throw new kf();
        const { error: g } = await ut(this.fetch, "GET", `${this.url}/reauthenticate`, {
          headers: this.headers,
          jwt: s.access_token
        });
        return { data: { user: null, session: null }, error: g };
      });
    } catch (u) {
      if (rt(u))
        return { data: { user: null, session: null }, error: u };
      throw u;
    }
  }
  /**
   * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
   */
  async resend(u) {
    try {
      u.type != "email_change" && u.type != "phone_change" && await this._removeSession();
      const s = `${this.url}/resend`;
      if ("email" in u) {
        const { email: h, type: g, options: w } = u, { error: m } = await ut(this.fetch, "POST", s, {
          headers: this.headers,
          body: {
            email: h,
            type: g,
            gotrue_meta_security: { captcha_token: w == null ? void 0 : w.captchaToken }
          },
          redirectTo: w == null ? void 0 : w.emailRedirectTo
        });
        return { data: { user: null, session: null }, error: m };
      } else if ("phone" in u) {
        const { phone: h, type: g, options: w } = u, { data: m, error: _ } = await ut(this.fetch, "POST", s, {
          headers: this.headers,
          body: {
            phone: h,
            type: g,
            gotrue_meta_security: { captcha_token: w == null ? void 0 : w.captchaToken }
          }
        });
        return { data: { user: null, session: null, messageId: m == null ? void 0 : m.message_id }, error: _ };
      }
      throw new my("You must provide either an email or phone number and a type");
    } catch (s) {
      if (rt(s))
        return { data: { user: null, session: null }, error: s };
      throw s;
    }
  }
  /**
   * Returns the session, refreshing it if necessary.
   * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
   */
  async getSession() {
    return await this.initializePromise, this._acquireLock(-1, async () => this._useSession(async (u) => u));
  }
  /**
   * Acquires a global lock based on the storage key.
   */
  async _acquireLock(u, s) {
    this._debug("#_acquireLock", "begin", u);
    try {
      if (this.lockAcquired) {
        const h = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve(), g = (async () => (await h, await s()))();
        return this.pendingInLock.push((async () => {
          try {
            await g;
          } catch {
          }
        })()), g;
      }
      return await this.lock(`lock:${this.storageKey}`, u, async () => {
        this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
        try {
          this.lockAcquired = !0;
          const h = s();
          for (this.pendingInLock.push((async () => {
            try {
              await h;
            } catch {
            }
          })()), await h; this.pendingInLock.length;) {
            const g = [...this.pendingInLock];
            await Promise.all(g), this.pendingInLock.splice(0, g.length);
          }
          return await h;
        } finally {
          this._debug("#_acquireLock", "lock released for storage key", this.storageKey), this.lockAcquired = !1;
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
  async _useSession(u) {
    this._debug("#_useSession", "begin");
    try {
      const s = await this.__loadSession();
      return await u(s);
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
    this._debug("#__loadSession()", "begin"), this.lockAcquired || this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
    try {
      let u = null;
      const s = await vy(this.storage, this.storageKey);
      if (this._debug("#getSession()", "session from storage", s), s !== null && (this._isValidSession(s) ? u = s : (this._debug("#getSession()", "session from storage is not valid"), await this._removeSession())), !u)
        return { data: { session: null }, error: null };
      const h = u.expires_at ? u.expires_at <= Date.now() / 1e3 : !1;
      if (this._debug("#__loadSession()", `session has${h ? "" : " not"} expired`, "expires_at", u.expires_at), !h)
        return { data: { session: u }, error: null };
      const { session: g, error: w } = await this._callRefreshToken(u.refresh_token);
      return w ? { data: { session: null }, error: w } : { data: { session: g }, error: null };
    } finally {
      this._debug("#__loadSession()", "end");
    }
  }
  /**
   * Gets the current user details if there is an existing session.
   * @param jwt Takes in an optional access token jwt. If no jwt is provided, getUser() will attempt to get the jwt from the current session.
   */
  async getUser(u) {
    return u ? await this._getUser(u) : (await this.initializePromise, this._acquireLock(-1, async () => await this._getUser()));
  }
  async _getUser(u) {
    try {
      return u ? await ut(this.fetch, "GET", `${this.url}/user`, {
        headers: this.headers,
        jwt: u,
        xform: ou
      }) : await this._useSession(async (s) => {
        var h, g;
        const { data: w, error: m } = s;
        if (m)
          throw m;
        return await ut(this.fetch, "GET", `${this.url}/user`, {
          headers: this.headers,
          jwt: (g = (h = w.session) === null || h === void 0 ? void 0 : h.access_token) !== null && g !== void 0 ? g : void 0,
          xform: ou
        });
      });
    } catch (s) {
      if (rt(s))
        return { data: { user: null }, error: s };
      throw s;
    }
  }
  /**
   * Updates user data for a logged in user.
   */
  async updateUser(u, s = {}) {
    return await this.initializePromise, await this._acquireLock(-1, async () => await this._updateUser(u, s));
  }
  async _updateUser(u, s = {}) {
    try {
      return await this._useSession(async (h) => {
        const { data: g, error: w } = h;
        if (w)
          throw w;
        if (!g.session)
          throw new kf();
        const m = g.session;
        let _ = null, C = null;
        if (this.flowType === "pkce" && u.email != null) {
          const U = Tf();
          await _s(this.storage, `${this.storageKey}-code-verifier`, U), _ = await Rf(U), C = U === _ ? "plain" : "s256";
        }
        const { data: R, error: O } = await ut(this.fetch, "PUT", `${this.url}/user`, {
          headers: this.headers,
          redirectTo: s == null ? void 0 : s.emailRedirectTo,
          body: Object.assign(Object.assign({}, u), { code_challenge: _, code_challenge_method: C }),
          jwt: m.access_token,
          xform: ou
        });
        if (O)
          throw O;
        return m.user = R.user, await this._saveSession(m), await this._notifyAllSubscribers("USER_UPDATED", m), { data: { user: m.user }, error: null };
      });
    } catch (h) {
      if (rt(h))
        return { data: { user: null }, error: h };
      throw h;
    }
  }
  /**
   * Decodes a JWT (without performing any validation).
   */
  _decodeJWT(u) {
    return O_(u);
  }
  /**
   * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
   * If the refresh token or access token in the current session is invalid, an error will be thrown.
   * @param currentSession The current session that minimally contains an access token and refresh token.
   */
  async setSession(u) {
    return await this.initializePromise, await this._acquireLock(-1, async () => await this._setSession(u));
  }
  async _setSession(u) {
    try {
      if (!u.access_token || !u.refresh_token)
        throw new kf();
      const s = Date.now() / 1e3;
      let h = s, g = !0, w = null;
      const m = O_(u.access_token);
      if (m.exp && (h = m.exp, g = h <= s), g) {
        const { session: _, error: C } = await this._callRefreshToken(u.refresh_token);
        if (C)
          return { data: { user: null, session: null }, error: C };
        if (!_)
          return { data: { user: null, session: null }, error: null };
        w = _;
      } else {
        const { data: _, error: C } = await this._getUser(u.access_token);
        if (C)
          throw C;
        w = {
          access_token: u.access_token,
          refresh_token: u.refresh_token,
          user: _.user,
          token_type: "bearer",
          expires_in: h - s,
          expires_at: h
        }, await this._saveSession(w), await this._notifyAllSubscribers("SIGNED_IN", w);
      }
      return { data: { user: w.user, session: w }, error: null };
    } catch (s) {
      if (rt(s))
        return { data: { session: null, user: null }, error: s };
      throw s;
    }
  }
  /**
   * Returns a new session, regardless of expiry status.
   * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
   * If the current session's refresh token is invalid, an error will be thrown.
   * @param currentSession The current session. If passed in, it must contain a refresh token.
   */
  async refreshSession(u) {
    return await this.initializePromise, await this._acquireLock(-1, async () => await this._refreshSession(u));
  }
  async _refreshSession(u) {
    try {
      return await this._useSession(async (s) => {
        var h;
        if (!u) {
          const { data: m, error: _ } = s;
          if (_)
            throw _;
          u = (h = m.session) !== null && h !== void 0 ? h : void 0;
        }
        if (!(u != null && u.refresh_token))
          throw new kf();
        const { session: g, error: w } = await this._callRefreshToken(u.refresh_token);
        return w ? { data: { user: null, session: null }, error: w } : g ? { data: { user: g.user, session: g }, error: null } : { data: { user: null, session: null }, error: null };
      });
    } catch (s) {
      if (rt(s))
        return { data: { user: null, session: null }, error: s };
      throw s;
    }
  }
  /**
   * Gets the session data from a URL string
   */
  async _getSessionFromURL(u) {
    try {
      if (!Sa())
        throw new yy("No browser detected.");
      if (this.flowType === "implicit" && !this._isImplicitGrantFlow())
        throw new yy("Not a valid implicit grant flow url.");
      if (this.flowType == "pkce" && !u)
        throw new L_("Not a valid PKCE flow url.");
      const s = lw(window.location.href);
      if (u) {
        if (!s.code)
          throw new L_("No code detected.");
        const { data: Ce, error: pe } = await this._exchangeCodeForSession(s.code);
        if (pe)
          throw pe;
        const _e = new URL(window.location.href);
        return _e.searchParams.delete("code"), window.history.replaceState(window.history.state, "", _e.toString()), { data: { session: Ce.session, redirectType: null }, error: null };
      }
      if (s.error || s.error_description || s.error_code)
        throw new yy(s.error_description || "Error in URL with unspecified error_description", {
          error: s.error || "unspecified_error",
          code: s.error_code || "unspecified_code"
        });
      const { provider_token: h, provider_refresh_token: g, access_token: w, refresh_token: m, expires_in: _, expires_at: C, token_type: R } = s;
      if (!w || !_ || !m || !R)
        throw new yy("No session defined in URL");
      const O = Math.round(Date.now() / 1e3), U = parseInt(_);
      let $ = O + U;
      C && ($ = parseInt(C));
      const B = $ - O;
      B * 1e3 <= np && console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${B}s, should have been closer to ${U}s`);
      const X = $ - U;
      O - X >= 120 ? console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", X, $, O) : O - X < 0 && console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clok for skew", X, $, O);
      const { data: ee, error: re } = await this._getUser(w);
      if (re)
        throw re;
      const Je = {
        provider_token: h,
        provider_refresh_token: g,
        access_token: w,
        expires_in: U,
        expires_at: $,
        refresh_token: m,
        token_type: R,
        user: ee.user
      };
      return window.location.hash = "", this._debug("#_getSessionFromURL()", "clearing window.location.hash"), { data: { session: Je, redirectType: s.type }, error: null };
    } catch (s) {
      if (rt(s))
        return { data: { session: null, redirectType: null }, error: s };
      throw s;
    }
  }
  /**
   * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
   */
  _isImplicitGrantFlow() {
    const u = lw(window.location.href);
    return !!(Sa() && (u.access_token || u.error_description));
  }
  /**
   * Checks if the current URL and backing storage contain parameters given by a PKCE flow
   */
  async _isPKCEFlow() {
    const u = lw(window.location.href), s = await vy(this.storage, `${this.storageKey}-code-verifier`);
    return !!(u.code && s);
  }
  /**
   * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
   *
   * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
   * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
   *
   * If using `others` scope, no `SIGNED_OUT` event is fired!
   */
  async signOut(u = { scope: "global" }) {
    return await this.initializePromise, await this._acquireLock(-1, async () => await this._signOut(u));
  }
  async _signOut({ scope: u } = { scope: "global" }) {
    return await this._useSession(async (s) => {
      var h;
      const { data: g, error: w } = s;
      if (w)
        return { error: w };
      const m = (h = g.session) === null || h === void 0 ? void 0 : h.access_token;
      if (m) {
        const { error: _ } = await this.admin.signOut(m, u);
        if (_ && !(CL(_) && (_.status === 404 || _.status === 401)))
          return { error: _ };
      }
      return u !== "others" && (await this._removeSession(), await uw(this.storage, `${this.storageKey}-code-verifier`), await this._notifyAllSubscribers("SIGNED_OUT", null)), { error: null };
    });
  }
  /**
   * Receive a notification every time an auth event happens.
   * @param callback A callback function to be invoked when an auth event happens.
   */
  onAuthStateChange(u) {
    const s = vL(), h = {
      id: s,
      callback: u,
      unsubscribe: () => {
        this._debug("#unsubscribe()", "state change callback with id removed", s), this.stateChangeEmitters.delete(s);
      }
    };
    return this._debug("#onAuthStateChange()", "registered callback with id", s), this.stateChangeEmitters.set(s, h), (async () => (await this.initializePromise, await this._acquireLock(-1, async () => {
      this._emitInitialSession(s);
    })))(), { data: { subscription: h } };
  }
  async _emitInitialSession(u) {
    return await this._useSession(async (s) => {
      var h, g;
      try {
        const { data: { session: w }, error: m } = s;
        if (m)
          throw m;
        await ((h = this.stateChangeEmitters.get(u)) === null || h === void 0 ? void 0 : h.callback("INITIAL_SESSION", w)), this._debug("INITIAL_SESSION", "callback id", u, "session", w);
      } catch (w) {
        await ((g = this.stateChangeEmitters.get(u)) === null || g === void 0 ? void 0 : g.callback("INITIAL_SESSION", null)), this._debug("INITIAL_SESSION", "callback id", u, "error", w), console.error(w);
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
  async resetPasswordForEmail(u, s = {}) {
    let h = null, g = null;
    if (this.flowType === "pkce") {
      const w = Tf();
      await _s(this.storage, `${this.storageKey}-code-verifier`, `${w}/PASSWORD_RECOVERY`), h = await Rf(w), g = w === h ? "plain" : "s256";
    }
    try {
      return await ut(this.fetch, "POST", `${this.url}/recover`, {
        body: {
          email: u,
          code_challenge: h,
          code_challenge_method: g,
          gotrue_meta_security: { captcha_token: s.captchaToken }
        },
        headers: this.headers,
        redirectTo: s.redirectTo
      });
    } catch (w) {
      if (rt(w))
        return { data: null, error: w };
      throw w;
    }
  }
  /**
   * Gets all the identities linked to a user.
   */
  async getUserIdentities() {
    var u;
    try {
      const { data: s, error: h } = await this.getUser();
      if (h)
        throw h;
      return { data: { identities: (u = s.user.identities) !== null && u !== void 0 ? u : [] }, error: null };
    } catch (s) {
      if (rt(s))
        return { data: null, error: s };
      throw s;
    }
  }
  /**
   * Links an oauth identity to an existing user.
   * This method supports the PKCE flow.
   */
  async linkIdentity(u) {
    var s;
    try {
      const { data: h, error: g } = await this._useSession(async (w) => {
        var m, _, C, R, O;
        const { data: U, error: $ } = w;
        if ($)
          throw $;
        const B = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, u.provider, {
          redirectTo: (m = u.options) === null || m === void 0 ? void 0 : m.redirectTo,
          scopes: (_ = u.options) === null || _ === void 0 ? void 0 : _.scopes,
          queryParams: (C = u.options) === null || C === void 0 ? void 0 : C.queryParams,
          skipBrowserRedirect: !0
        });
        return await ut(this.fetch, "GET", B, {
          headers: this.headers,
          jwt: (O = (R = U.session) === null || R === void 0 ? void 0 : R.access_token) !== null && O !== void 0 ? O : void 0
        });
      });
      if (g)
        throw g;
      return Sa() && !(!((s = u.options) === null || s === void 0) && s.skipBrowserRedirect) && window.location.assign(h == null ? void 0 : h.url), { data: { provider: u.provider, url: h == null ? void 0 : h.url }, error: null };
    } catch (h) {
      if (rt(h))
        return { data: { provider: u.provider, url: null }, error: h };
      throw h;
    }
  }
  /**
   * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
   */
  async unlinkIdentity(u) {
    try {
      return await this._useSession(async (s) => {
        var h, g;
        const { data: w, error: m } = s;
        if (m)
          throw m;
        return await ut(this.fetch, "DELETE", `${this.url}/user/identities/${u.identity_id}`, {
          headers: this.headers,
          jwt: (g = (h = w.session) === null || h === void 0 ? void 0 : h.access_token) !== null && g !== void 0 ? g : void 0
        });
      });
    } catch (s) {
      if (rt(s))
        return { data: null, error: s };
      throw s;
    }
  }
  /**
   * Generates a new JWT.
   * @param refreshToken A valid refresh token that was returned on login.
   */
  async _refreshAccessToken(u) {
    const s = `#_refreshAccessToken(${u.substring(0, 5)}...)`;
    this._debug(s, "begin");
    try {
      const h = Date.now();
      return await SL(async (g) => (await gL(g * 200), this._debug(s, "refreshing attempt", g), await ut(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
        body: { refresh_token: u },
        headers: this.headers,
        xform: Cs
      })), (g, w, m) => m && m.error && cw(m.error) && // retryable only if the request can be sent before the backoff overflows the tick duration
        Date.now() + (g + 1) * 200 - h < np);
    } catch (h) {
      if (this._debug(s, "error", h), rt(h))
        return { data: { session: null, user: null }, error: h };
      throw h;
    } finally {
      this._debug(s, "end");
    }
  }
  _isValidSession(u) {
    return typeof u == "object" && u !== null && "access_token" in u && "refresh_token" in u && "expires_at" in u;
  }
  async _handleProviderSignIn(u, s) {
    const h = await this._getUrlForProvider(`${this.url}/authorize`, u, {
      redirectTo: s.redirectTo,
      scopes: s.scopes,
      queryParams: s.queryParams
    });
    return this._debug("#_handleProviderSignIn()", "provider", u, "options", s, "url", h), Sa() && !s.skipBrowserRedirect && window.location.assign(h), { data: { provider: u, url: h }, error: null };
  }
  /**
   * Recovers the session from LocalStorage and refreshes
   * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
   */
  async _recoverAndRefresh() {
    var u;
    const s = "#_recoverAndRefresh()";
    this._debug(s, "begin");
    try {
      const h = await vy(this.storage, this.storageKey);
      if (this._debug(s, "session from storage", h), !this._isValidSession(h)) {
        this._debug(s, "session is not valid"), h !== null && await this._removeSession();
        return;
      }
      const g = Math.round(Date.now() / 1e3), w = ((u = h.expires_at) !== null && u !== void 0 ? u : 1 / 0) < g + U_;
      if (this._debug(s, `session has${w ? "" : " not"} expired with margin of ${U_}s`), w) {
        if (this.autoRefreshToken && h.refresh_token) {
          const { error: m } = await this._callRefreshToken(h.refresh_token);
          m && (console.error(m), cw(m) || (this._debug(s, "refresh failed with a non-retryable error, removing the session", m), await this._removeSession()));
        }
      } else
        await this._notifyAllSubscribers("SIGNED_IN", h);
    } catch (h) {
      this._debug(s, "error", h), console.error(h);
      return;
    } finally {
      this._debug(s, "end");
    }
  }
  async _callRefreshToken(u) {
    var s, h;
    if (!u)
      throw new kf();
    if (this.refreshingDeferred)
      return this.refreshingDeferred.promise;
    const g = `#_callRefreshToken(${u.substring(0, 5)}...)`;
    this._debug(g, "begin");
    try {
      this.refreshingDeferred = new xy();
      const { data: w, error: m } = await this._refreshAccessToken(u);
      if (m)
        throw m;
      if (!w.session)
        throw new kf();
      await this._saveSession(w.session), await this._notifyAllSubscribers("TOKEN_REFRESHED", w.session);
      const _ = { session: w.session, error: null };
      return this.refreshingDeferred.resolve(_), _;
    } catch (w) {
      if (this._debug(g, "error", w), rt(w)) {
        const m = { session: null, error: w };
        return cw(w) || (await this._removeSession(), await this._notifyAllSubscribers("SIGNED_OUT", null)), (s = this.refreshingDeferred) === null || s === void 0 || s.resolve(m), m;
      }
      throw (h = this.refreshingDeferred) === null || h === void 0 || h.reject(w), w;
    } finally {
      this.refreshingDeferred = null, this._debug(g, "end");
    }
  }
  async _notifyAllSubscribers(u, s, h = !0) {
    const g = `#_notifyAllSubscribers(${u})`;
    this._debug(g, "begin", s, `broadcast = ${h}`);
    try {
      this.broadcastChannel && h && this.broadcastChannel.postMessage({ event: u, session: s });
      const w = [], m = Array.from(this.stateChangeEmitters.values()).map(async (_) => {
        try {
          await _.callback(u, s);
        } catch (C) {
          w.push(C);
        }
      });
      if (await Promise.all(m), w.length > 0) {
        for (let _ = 0; _ < w.length; _ += 1)
          console.error(w[_]);
        throw w[0];
      }
    } finally {
      this._debug(g, "end");
    }
  }
  /**
   * set currentSession and currentUser
   * process to _startAutoRefreshToken if possible
   */
  async _saveSession(u) {
    this._debug("#_saveSession()", u), await _s(this.storage, this.storageKey, u);
  }
  async _removeSession() {
    this._debug("#_removeSession()"), await uw(this.storage, this.storageKey);
  }
  /**
   * Removes any registered visibilitychange callback.
   *
   * {@see #startAutoRefresh}
   * {@see #stopAutoRefresh}
   */
  _removeVisibilityChangedCallback() {
    this._debug("#_removeVisibilityChangedCallback()");
    const u = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;
    try {
      u && Sa() && (window != null && window.removeEventListener) && window.removeEventListener("visibilitychange", u);
    } catch (s) {
      console.error("removing visibilitychange callback failed", s);
    }
  }
  /**
   * This is the private implementation of {@link #startAutoRefresh}. Use this
   * within the library.
   */
  async _startAutoRefresh() {
    await this._stopAutoRefresh(), this._debug("#_startAutoRefresh()");
    const u = setInterval(() => this._autoRefreshTokenTick(), np);
    this.autoRefreshTicker = u, u && typeof u == "object" && typeof u.unref == "function" ? u.unref() : typeof Deno < "u" && typeof Deno.unrefTimer == "function" && Deno.unrefTimer(u), setTimeout(async () => {
      await this.initializePromise, await this._autoRefreshTokenTick();
    }, 0);
  }
  /**
   * This is the private implementation of {@link #stopAutoRefresh}. Use this
   * within the library.
   */
  async _stopAutoRefresh() {
    this._debug("#_stopAutoRefresh()");
    const u = this.autoRefreshTicker;
    this.autoRefreshTicker = null, u && clearInterval(u);
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
          const u = Date.now();
          try {
            return await this._useSession(async (s) => {
              const { data: { session: h } } = s;
              if (!h || !h.refresh_token || !h.expires_at) {
                this._debug("#_autoRefreshTokenTick()", "no session");
                return;
              }
              const g = Math.floor((h.expires_at * 1e3 - u) / np);
              this._debug("#_autoRefreshTokenTick()", `access token expires in ${g} ticks, a tick lasts ${np}ms, refresh threshold is ${z_} ticks`), g <= z_ && await this._callRefreshToken(h.refresh_token);
            });
          } catch (s) {
            console.error("Auto refresh tick failed with error. This is likely a transient error.", s);
          }
        } finally {
          this._debug("#_autoRefreshTokenTick()", "end");
        }
      });
    } catch (u) {
      if (u.isAcquireTimeout || u instanceof dC)
        this._debug("auto refresh token tick lock not available");
      else
        throw u;
    }
  }
  /**
   * Registers callbacks on the browser / platform, which in-turn run
   * algorithms when the browser window/tab are in foreground. On non-browser
   * platforms it assumes always foreground.
   */
  async _handleVisibilityChange() {
    if (this._debug("#_handleVisibilityChange()"), !Sa() || !(window != null && window.addEventListener))
      return this.autoRefreshToken && this.startAutoRefresh(), !1;
    try {
      this.visibilityChangedCallback = async () => await this._onVisibilityChanged(!1), window == null || window.addEventListener("visibilitychange", this.visibilityChangedCallback), await this._onVisibilityChanged(!0);
    } catch (u) {
      console.error("_handleVisibilityChange", u);
    }
  }
  /**
   * Callback registered with `window.addEventListener('visibilitychange')`.
   */
  async _onVisibilityChanged(u) {
    const s = `#_onVisibilityChanged(${u})`;
    this._debug(s, "visibilityState", document.visibilityState), document.visibilityState === "visible" ? (this.autoRefreshToken && this._startAutoRefresh(), u || (await this.initializePromise, await this._acquireLock(-1, async () => {
      if (document.visibilityState !== "visible") {
        this._debug(s, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
        return;
      }
      await this._recoverAndRefresh();
    }))) : document.visibilityState === "hidden" && this.autoRefreshToken && this._stopAutoRefresh();
  }
  /**
   * Generates the relevant login URL for a third-party provider.
   * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param options.scopes A space-separated list of scopes granted to the OAuth application.
   * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
   */
  async _getUrlForProvider(u, s, h) {
    const g = [`provider=${encodeURIComponent(s)}`];
    if (h != null && h.redirectTo && g.push(`redirect_to=${encodeURIComponent(h.redirectTo)}`), h != null && h.scopes && g.push(`scopes=${encodeURIComponent(h.scopes)}`), this.flowType === "pkce") {
      const w = Tf();
      await _s(this.storage, `${this.storageKey}-code-verifier`, w);
      const m = await Rf(w), _ = w === m ? "plain" : "s256";
      this._debug("PKCE", "code verifier", `${w.substring(0, 5)}...`, "code challenge", m, "method", _);
      const C = new URLSearchParams({
        code_challenge: `${encodeURIComponent(m)}`,
        code_challenge_method: `${encodeURIComponent(_)}`
      });
      g.push(C.toString());
    }
    if (h != null && h.queryParams) {
      const w = new URLSearchParams(h.queryParams);
      g.push(w.toString());
    }
    return h != null && h.skipBrowserRedirect && g.push(`skip_http_redirect=${h.skipBrowserRedirect}`), `${u}?${g.join("&")}`;
  }
  async _unenroll(u) {
    try {
      return await this._useSession(async (s) => {
        var h;
        const { data: g, error: w } = s;
        return w ? { data: null, error: w } : await ut(this.fetch, "DELETE", `${this.url}/factors/${u.factorId}`, {
          headers: this.headers,
          jwt: (h = g == null ? void 0 : g.session) === null || h === void 0 ? void 0 : h.access_token
        });
      });
    } catch (s) {
      if (rt(s))
        return { data: null, error: s };
      throw s;
    }
  }
  /**
   * {@see GoTrueMFAApi#enroll}
   */
  async _enroll(u) {
    try {
      return await this._useSession(async (s) => {
        var h, g;
        const { data: w, error: m } = s;
        if (m)
          return { data: null, error: m };
        const { data: _, error: C } = await ut(this.fetch, "POST", `${this.url}/factors`, {
          body: {
            friendly_name: u.friendlyName,
            factor_type: u.factorType,
            issuer: u.issuer
          },
          headers: this.headers,
          jwt: (h = w == null ? void 0 : w.session) === null || h === void 0 ? void 0 : h.access_token
        });
        return C ? { data: null, error: C } : (!((g = _ == null ? void 0 : _.totp) === null || g === void 0) && g.qr_code && (_.totp.qr_code = `data:image/svg+xml;utf-8,${_.totp.qr_code}`), { data: _, error: null });
      });
    } catch (s) {
      if (rt(s))
        return { data: null, error: s };
      throw s;
    }
  }
  /**
   * {@see GoTrueMFAApi#verify}
   */
  async _verify(u) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (s) => {
          var h;
          const { data: g, error: w } = s;
          if (w)
            return { data: null, error: w };
          const { data: m, error: _ } = await ut(this.fetch, "POST", `${this.url}/factors/${u.factorId}/verify`, {
            body: { code: u.code, challenge_id: u.challengeId },
            headers: this.headers,
            jwt: (h = g == null ? void 0 : g.session) === null || h === void 0 ? void 0 : h.access_token
          });
          return _ ? { data: null, error: _ } : (await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + m.expires_in }, m)), await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", m), { data: m, error: _ });
        });
      } catch (s) {
        if (rt(s))
          return { data: null, error: s };
        throw s;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challenge}
   */
  async _challenge(u) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async (s) => {
          var h;
          const { data: g, error: w } = s;
          return w ? { data: null, error: w } : await ut(this.fetch, "POST", `${this.url}/factors/${u.factorId}/challenge`, {
            headers: this.headers,
            jwt: (h = g == null ? void 0 : g.session) === null || h === void 0 ? void 0 : h.access_token
          });
        });
      } catch (s) {
        if (rt(s))
          return { data: null, error: s };
        throw s;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challengeAndVerify}
   */
  async _challengeAndVerify(u) {
    const { data: s, error: h } = await this._challenge({
      factorId: u.factorId
    });
    return h ? { data: null, error: h } : await this._verify({
      factorId: u.factorId,
      challengeId: s.id,
      code: u.code
    });
  }
  /**
   * {@see GoTrueMFAApi#listFactors}
   */
  async _listFactors() {
    const { data: { user: u }, error: s } = await this.getUser();
    if (s)
      return { data: null, error: s };
    const h = (u == null ? void 0 : u.factors) || [], g = h.filter((w) => w.factor_type === "totp" && w.status === "verified");
    return {
      data: {
        all: h,
        totp: g
      },
      error: null
    };
  }
  /**
   * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
   */
  async _getAuthenticatorAssuranceLevel() {
    return this._acquireLock(-1, async () => await this._useSession(async (u) => {
      var s, h;
      const { data: { session: g }, error: w } = u;
      if (w)
        return { data: null, error: w };
      if (!g)
        return {
          data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
          error: null
        };
      const m = this._decodeJWT(g.access_token);
      let _ = null;
      m.aal && (_ = m.aal);
      let C = _;
      ((h = (s = g.user.factors) === null || s === void 0 ? void 0 : s.filter((U) => U.status === "verified")) !== null && h !== void 0 ? h : []).length > 0 && (C = "aal2");
      const O = m.amr || [];
      return { data: { currentLevel: _, nextLevel: C, currentAuthenticationMethods: O }, error: null };
    }));
  }
}
lp.nextInstanceID = 0;
class IL extends lp {
  constructor(u) {
    super(u);
  }
}
var YL = function (d, u, s, h) {
  function g(w) {
    return w instanceof s ? w : new s(function (m) {
      m(w);
    });
  }
  return new (s || (s = Promise))(function (w, m) {
    function _(O) {
      try {
        R(h.next(O));
      } catch (U) {
        m(U);
      }
    }
    function C(O) {
      try {
        R(h.throw(O));
      } catch (U) {
        m(U);
      }
    }
    function R(O) {
      O.done ? w(O.value) : g(O.value).then(_, C);
    }
    R((h = h.apply(d, u || [])).next());
  });
};
const qL = {
  headers: lL
}, QL = {
  schema: "public"
}, GL = {
  autoRefreshToken: !0,
  persistSession: !0,
  detectSessionInUrl: !0,
  flowType: "implicit"
}, WL = {};
class KL {
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
  constructor(u, s, h) {
    var g, w, m, _, C, R, O, U;
    if (this.supabaseUrl = u, this.supabaseKey = s, this.from = (re) => this.rest.from(re), this.schema = (re) => this.rest.schema(re), this.rpc = (re, Je = {}, Ce) => this.rest.rpc(re, Je, Ce), !u)
      throw new Error("supabaseUrl is required.");
    if (!s)
      throw new Error("supabaseKey is required.");
    const $ = dL(u);
    this.realtimeUrl = `${$}/realtime/v1`.replace(/^http/i, "ws"), this.authUrl = `${$}/auth/v1`, this.storageUrl = `${$}/storage/v1`, this.functionsUrl = `${$}/functions/v1`;
    const B = `sb-${new URL(this.authUrl).hostname.split(".")[0]}-auth-token`, X = {
      db: QL,
      realtime: WL,
      auth: Object.assign(Object.assign({}, GL), { storageKey: B }),
      global: qL
    }, ee = hL(h ?? {}, X);
    this.storageKey = (w = (g = ee.auth) === null || g === void 0 ? void 0 : g.storageKey) !== null && w !== void 0 ? w : "", this.headers = (_ = (m = ee.global) === null || m === void 0 ? void 0 : m.headers) !== null && _ !== void 0 ? _ : {}, this.auth = this._initSupabaseAuthClient((C = ee.auth) !== null && C !== void 0 ? C : {}, this.headers, (R = ee.global) === null || R === void 0 ? void 0 : R.fetch), this.fetch = fL(s, this._getAccessToken.bind(this), (O = ee.global) === null || O === void 0 ? void 0 : O.fetch), this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers }, ee.realtime)), this.rest = new Mw(`${$}/rest/v1`, {
      headers: this.headers,
      schema: (U = ee.db) === null || U === void 0 ? void 0 : U.schema,
      fetch: this.fetch
    }), this._listenForAuthEvents();
  }
  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */
  get functions() {
    return new EO(this.functionsUrl, {
      headers: this.headers,
      customFetch: this.fetch
    });
  }
  /**
   * Supabase Storage allows you to manage user-generated content, such as photos or videos.
   */
  get storage() {
    return new aL(this.storageUrl, this.headers, this.fetch);
  }
  /**
   * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
   *
   * @param {string} name - The name of the Realtime channel.
   * @param {Object} opts - The options to pass to the Realtime channel.
   *
   */
  channel(u, s = { config: {} }) {
    return this.realtime.channel(u, s);
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
  removeChannel(u) {
    return this.realtime.removeChannel(u);
  }
  /**
   * Unsubscribes and removes all Realtime channels from Realtime client.
   */
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  _getAccessToken() {
    var u, s;
    return YL(this, void 0, void 0, function* () {
      const { data: h } = yield this.auth.getSession();
      return (s = (u = h.session) === null || u === void 0 ? void 0 : u.access_token) !== null && s !== void 0 ? s : null;
    });
  }
  _initSupabaseAuthClient({ autoRefreshToken: u, persistSession: s, detectSessionInUrl: h, storage: g, storageKey: w, flowType: m, debug: _ }, C, R) {
    const O = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new IL({
      url: this.authUrl,
      headers: Object.assign(Object.assign({}, O), C),
      storageKey: w,
      autoRefreshToken: u,
      persistSession: s,
      detectSessionInUrl: h,
      storage: g,
      flowType: m,
      debug: _,
      fetch: R
    });
  }
  _initRealtimeClient(u) {
    return new qO(this.realtimeUrl, Object.assign(Object.assign({}, u), { params: Object.assign({ apikey: this.supabaseKey }, u == null ? void 0 : u.params) }));
  }
  _listenForAuthEvents() {
    return this.auth.onAuthStateChange((s, h) => {
      this._handleTokenChanged(s, "CLIENT", h == null ? void 0 : h.access_token);
    });
  }
  _handleTokenChanged(u, s, h) {
    (u === "TOKEN_REFRESHED" || u === "SIGNED_IN") && this.changedAccessToken !== h ? (this.realtime.setAuth(h ?? null), this.changedAccessToken = h) : u === "SIGNED_OUT" && (this.realtime.setAuth(this.supabaseKey), s == "STORAGE" && this.auth.signOut(), this.changedAccessToken = void 0);
  }
}
const JL = (d, u, s) => new KL(d, u, s);
function XL({ user: d, userId: u, apiKey: s }) {
  const [h, g] = vO([]), w = JL(
    "https://cmdpjhmqoqpkfwxqdekb.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZHBqaG1xb3Fwa2Z3eHFkZWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYzMTY5MTAsImV4cCI6MjAyMTg5MjkxMH0.YhScL14jXQKyzFIAsIh9y3tujE0metKzw_N4Gwhnezg"
  ), m = async () => {
    const { data: R } = await w.from("polls").select("*").eq("app_id", s);
    return R;
  }, _ = async () => {
    const { count: R } = await w.from("sample_data").select("*", { count: "exact" }).eq("app_id", s);
    return R;
  }, C = async () => {
    await w.from("sample_data").upsert([{ app_id: s, user_id: u, user: d }]);
  };
  return nC(() => {
    _().then((R) => {
      (R || 0) < 50 && C(), m().then((O) => {
        g(O);
      });
    });
  }, []), /* @__PURE__ */ au(hO, {});
}
function sM({ poll: d, sendResponse: u }) {
  return /* @__PURE__ */ pO("div", {
    className: "flex bg-white dark:bg-neutral-900 flex-col gap-3 p-6 w-full h-full", children: [
    /* @__PURE__ */ au("p", { className: "font-bold tracking-tight text-neutral-900 text-lg dark:text-neutral-100", children: d.poll_data.title }),
    /* @__PURE__ */ au("p", { className: "text-neutral-600 dark:text-neutral-400 text-sm", children: d.poll_data.subtitle }),
    /* @__PURE__ */ au("div", {
      className: "w-full  text-sm gap-2.5 grid grid-cols-2  ", children: d.poll_data.options.map((s, h) => /* @__PURE__ */ au(
        "button",
        {
          onClick: () => {
            u({ option_id: s.id });
          },
          className: "w-full h-10  py-2 rounded-md border dark:hover:bg-neutral-700 dark:border-neutral-700 border-neutral-300 justify-start items-center p-3 flex hover:bg-neutral-100 transition",
          children: /* @__PURE__ */ au("div", { className: "dark:text-white text-black", children: s.title })
        },
        h
      ))
    })
    ]
  });
}
function ZL(d) {
  return d && d.__esModule && Object.prototype.hasOwnProperty.call(d, "default") ? d.default : d;
}
var _w = { exports: {} }, ti = {}, gy = { exports: {} }, fw = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var F_;
function eA() {
  return F_ || (F_ = 1, function (d) {
    function u(te, we) {
      var le = te.length;
      te.push(we);
      e:
      for (; 0 < le;) {
        var Ie = le - 1 >>> 1, Ze = te[Ie];
        if (0 < g(Ze, we))
          te[Ie] = we, te[le] = Ze, le = Ie;
        else
          break e;
      }
    }
    function s(te) {
      return te.length === 0 ? null : te[0];
    }
    function h(te) {
      if (te.length === 0)
        return null;
      var we = te[0], le = te.pop();
      if (le !== we) {
        te[0] = le;
        e:
        for (var Ie = 0, Ze = te.length, Wt = Ze >>> 1; Ie < Wt;) {
          var Bn = 2 * (Ie + 1) - 1, ba = te[Bn], In = Bn + 1, Ea = te[In];
          if (0 > g(ba, le))
            In < Ze && 0 > g(Ea, ba) ? (te[Ie] = Ea, te[In] = le, Ie = In) : (te[Ie] = ba, te[Bn] = le, Ie = Bn);
          else if (In < Ze && 0 > g(Ea, le))
            te[Ie] = Ea, te[In] = le, Ie = In;
          else
            break e;
        }
      }
      return we;
    }
    function g(te, we) {
      var le = te.sortIndex - we.sortIndex;
      return le !== 0 ? le : te.id - we.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var w = performance;
      d.unstable_now = function () {
        return w.now();
      };
    } else {
      var m = Date, _ = m.now();
      d.unstable_now = function () {
        return m.now() - _;
      };
    }
    var C = [], R = [], O = 1, U = null, $ = 3, B = !1, X = !1, ee = !1, re = typeof setTimeout == "function" ? setTimeout : null, Je = typeof clearTimeout == "function" ? clearTimeout : null, Ce = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function pe(te) {
      for (var we = s(R); we !== null;) {
        if (we.callback === null)
          h(R);
        else if (we.startTime <= te)
          h(R), we.sortIndex = we.expirationTime, u(C, we);
        else
          break;
        we = s(R);
      }
    }
    function _e(te) {
      if (ee = !1, pe(te), !X)
        if (s(C) !== null)
          X = !0, Xe($e);
        else {
          var we = s(R);
          we !== null && fn(_e, we.startTime - te);
        }
    }
    function $e(te, we) {
      X = !1, ee && (ee = !1, Je(Pe), Pe = -1), B = !0;
      var le = $;
      try {
        for (pe(we), U = s(C); U !== null && (!(U.expirationTime > we) || te && !ht());) {
          var Ie = U.callback;
          if (typeof Ie == "function") {
            U.callback = null, $ = U.priorityLevel;
            var Ze = Ie(U.expirationTime <= we);
            we = d.unstable_now(), typeof Ze == "function" ? U.callback = Ze : U === s(C) && h(C), pe(we);
          } else
            h(C);
          U = s(C);
        }
        if (U !== null)
          var Wt = !0;
        else {
          var Bn = s(R);
          Bn !== null && fn(_e, Bn.startTime - we), Wt = !1;
        }
        return Wt;
      } finally {
        U = null, $ = le, B = !1;
      }
    }
    var ft = !1, Ae = null, Pe = -1, dt = 5, at = -1;
    function ht() {
      return !(d.unstable_now() - at < dt);
    }
    function Gt() {
      if (Ae !== null) {
        var te = d.unstable_now();
        at = te;
        var we = !0;
        try {
          we = Ae(!0, te);
        } finally {
          we ? qe() : (ft = !1, Ae = null);
        }
      } else
        ft = !1;
    }
    var qe;
    if (typeof Ce == "function")
      qe = function () {
        Ce(Gt);
      };
    else if (typeof MessageChannel < "u") {
      var ze = new MessageChannel(), Ct = ze.port2;
      ze.port1.onmessage = Gt, qe = function () {
        Ct.postMessage(null);
      };
    } else
      qe = function () {
        re(Gt, 0);
      };
    function Xe(te) {
      Ae = te, ft || (ft = !0, qe());
    }
    function fn(te, we) {
      Pe = re(function () {
        te(d.unstable_now());
      }, we);
    }
    d.unstable_IdlePriority = 5, d.unstable_ImmediatePriority = 1, d.unstable_LowPriority = 4, d.unstable_NormalPriority = 3, d.unstable_Profiling = null, d.unstable_UserBlockingPriority = 2, d.unstable_cancelCallback = function (te) {
      te.callback = null;
    }, d.unstable_continueExecution = function () {
      X || B || (X = !0, Xe($e));
    }, d.unstable_forceFrameRate = function (te) {
      0 > te || 125 < te ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : dt = 0 < te ? Math.floor(1e3 / te) : 5;
    }, d.unstable_getCurrentPriorityLevel = function () {
      return $;
    }, d.unstable_getFirstCallbackNode = function () {
      return s(C);
    }, d.unstable_next = function (te) {
      switch ($) {
        case 1:
        case 2:
        case 3:
          var we = 3;
          break;
        default:
          we = $;
      }
      var le = $;
      $ = we;
      try {
        return te();
      } finally {
        $ = le;
      }
    }, d.unstable_pauseExecution = function () {
    }, d.unstable_requestPaint = function () {
    }, d.unstable_runWithPriority = function (te, we) {
      switch (te) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          te = 3;
      }
      var le = $;
      $ = te;
      try {
        return we();
      } finally {
        $ = le;
      }
    }, d.unstable_scheduleCallback = function (te, we, le) {
      var Ie = d.unstable_now();
      switch (typeof le == "object" && le !== null ? (le = le.delay, le = typeof le == "number" && 0 < le ? Ie + le : Ie) : le = Ie, te) {
        case 1:
          var Ze = -1;
          break;
        case 2:
          Ze = 250;
          break;
        case 5:
          Ze = 1073741823;
          break;
        case 4:
          Ze = 1e4;
          break;
        default:
          Ze = 5e3;
      }
      return Ze = le + Ze, te = { id: O++, callback: we, priorityLevel: te, startTime: le, expirationTime: Ze, sortIndex: -1 }, le > Ie ? (te.sortIndex = le, u(R, te), s(C) === null && te === s(R) && (ee ? (Je(Pe), Pe = -1) : ee = !0, fn(_e, le - Ie))) : (te.sortIndex = Ze, u(C, te), X || B || (X = !0, Xe($e))), te;
    }, d.unstable_shouldYield = ht, d.unstable_wrapCallback = function (te) {
      var we = $;
      return function () {
        var le = $;
        $ = we;
        try {
          return te.apply(this, arguments);
        } finally {
          $ = le;
        }
      };
    };
  }(fw)), fw;
}
var dw = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var $_;
function tA() {
  return $_ || ($_ = 1, function (d) {
    process.env.NODE_ENV !== "production" && function () {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var u = !1, s = !1, h = 5;
      function g(ue, ke) {
        var Qe = ue.length;
        ue.push(ke), _(ue, ke, Qe);
      }
      function w(ue) {
        return ue.length === 0 ? null : ue[0];
      }
      function m(ue) {
        if (ue.length === 0)
          return null;
        var ke = ue[0], Qe = ue.pop();
        return Qe !== ke && (ue[0] = Qe, C(ue, Qe, 0)), ke;
      }
      function _(ue, ke, Qe) {
        for (var wt = Qe; wt > 0;) {
          var It = wt - 1 >>> 1, Mn = ue[It];
          if (R(Mn, ke) > 0)
            ue[It] = ke, ue[wt] = Mn, wt = It;
          else
            return;
        }
      }
      function C(ue, ke, Qe) {
        for (var wt = Qe, It = ue.length, Mn = It >>> 1; wt < Mn;) {
          var nn = (wt + 1) * 2 - 1, Ur = ue[nn], Ft = nn + 1, _i = ue[Ft];
          if (R(Ur, ke) < 0)
            Ft < It && R(_i, Ur) < 0 ? (ue[wt] = _i, ue[Ft] = ke, wt = Ft) : (ue[wt] = Ur, ue[nn] = ke, wt = nn);
          else if (Ft < It && R(_i, ke) < 0)
            ue[wt] = _i, ue[Ft] = ke, wt = Ft;
          else
            return;
        }
      }
      function R(ue, ke) {
        var Qe = ue.sortIndex - ke.sortIndex;
        return Qe !== 0 ? Qe : ue.id - ke.id;
      }
      var O = 1, U = 2, $ = 3, B = 4, X = 5;
      function ee(ue, ke) {
      }
      var re = typeof performance == "object" && typeof performance.now == "function";
      if (re) {
        var Je = performance;
        d.unstable_now = function () {
          return Je.now();
        };
      } else {
        var Ce = Date, pe = Ce.now();
        d.unstable_now = function () {
          return Ce.now() - pe;
        };
      }
      var _e = 1073741823, $e = -1, ft = 250, Ae = 5e3, Pe = 1e4, dt = _e, at = [], ht = [], Gt = 1, qe = null, ze = $, Ct = !1, Xe = !1, fn = !1, te = typeof setTimeout == "function" ? setTimeout : null, we = typeof clearTimeout == "function" ? clearTimeout : null, le = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function Ie(ue) {
        for (var ke = w(ht); ke !== null;) {
          if (ke.callback === null)
            m(ht);
          else if (ke.startTime <= ue)
            m(ht), ke.sortIndex = ke.expirationTime, g(at, ke);
          else
            return;
          ke = w(ht);
        }
      }
      function Ze(ue) {
        if (fn = !1, Ie(ue), !Xe)
          if (w(at) !== null)
            Xe = !0, xa(Wt);
          else {
            var ke = w(ht);
            ke !== null && rr(Ze, ke.startTime - ue);
          }
      }
      function Wt(ue, ke) {
        Xe = !1, fn && (fn = !1, oi()), Ct = !0;
        var Qe = ze;
        try {
          var wt;
          if (!s)
            return Bn(ue, ke);
        } finally {
          qe = null, ze = Qe, Ct = !1;
        }
      }
      function Bn(ue, ke) {
        var Qe = ke;
        for (Ie(Qe), qe = w(at); qe !== null && !u && !(qe.expirationTime > Qe && (!ue || el()));) {
          var wt = qe.callback;
          if (typeof wt == "function") {
            qe.callback = null, ze = qe.priorityLevel;
            var It = qe.expirationTime <= Qe, Mn = wt(It);
            Qe = d.unstable_now(), typeof Mn == "function" ? qe.callback = Mn : qe === w(at) && m(at), Ie(Qe);
          } else
            m(at);
          qe = w(at);
        }
        if (qe !== null)
          return !0;
        var nn = w(ht);
        return nn !== null && rr(Ze, nn.startTime - Qe), !1;
      }
      function ba(ue, ke) {
        switch (ue) {
          case O:
          case U:
          case $:
          case B:
          case X:
            break;
          default:
            ue = $;
        }
        var Qe = ze;
        ze = ue;
        try {
          return ke();
        } finally {
          ze = Qe;
        }
      }
      function In(ue) {
        var ke;
        switch (ze) {
          case O:
          case U:
          case $:
            ke = $;
            break;
          default:
            ke = ze;
            break;
        }
        var Qe = ze;
        ze = ke;
        try {
          return ue();
        } finally {
          ze = Qe;
        }
      }
      function Ea(ue) {
        var ke = ze;
        return function () {
          var Qe = ze;
          ze = ke;
          try {
            return ue.apply(this, arguments);
          } finally {
            ze = Qe;
          }
        };
      }
      function ri(ue, ke, Qe) {
        var wt = d.unstable_now(), It;
        if (typeof Qe == "object" && Qe !== null) {
          var Mn = Qe.delay;
          typeof Mn == "number" && Mn > 0 ? It = wt + Mn : It = wt;
        } else
          It = wt;
        var nn;
        switch (ue) {
          case O:
            nn = $e;
            break;
          case U:
            nn = ft;
            break;
          case X:
            nn = dt;
            break;
          case B:
            nn = Pe;
            break;
          case $:
          default:
            nn = Ae;
            break;
        }
        var Ur = It + nn, Ft = {
          id: Gt++,
          callback: ke,
          priorityLevel: ue,
          startTime: It,
          expirationTime: Ur,
          sortIndex: -1
        };
        return It > wt ? (Ft.sortIndex = It, g(ht, Ft), w(at) === null && Ft === w(ht) && (fn ? oi() : fn = !0, rr(Ze, It - wt))) : (Ft.sortIndex = Ur, g(at, Ft), !Xe && !Ct && (Xe = !0, xa(Wt))), Ft;
      }
      function bi() {
      }
      function su() {
        !Xe && !Ct && (Xe = !0, xa(Wt));
      }
      function Ar() {
        return w(at);
      }
      function Pi(ue) {
        ue.callback = null;
      }
      function An() {
        return ze;
      }
      var nr = !1, Mr = null, ii = -1, Sr = h, Vi = -1;
      function el() {
        var ue = d.unstable_now() - Vi;
        return !(ue < Sr);
      }
      function lo() {
      }
      function _a(ue) {
        if (ue < 0 || ue > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        ue > 0 ? Sr = Math.floor(1e3 / ue) : Sr = h;
      }
      var uo = function () {
        if (Mr !== null) {
          var ue = d.unstable_now();
          Vi = ue;
          var ke = !0, Qe = !0;
          try {
            Qe = Mr(ke, ue);
          } finally {
            Qe ? ai() : (nr = !1, Mr = null);
          }
        } else
          nr = !1;
      }, ai;
      if (typeof le == "function")
        ai = function () {
          le(uo);
        };
      else if (typeof MessageChannel < "u") {
        var Ca = new MessageChannel(), Ei = Ca.port2;
        Ca.port1.onmessage = uo, ai = function () {
          Ei.postMessage(null);
        };
      } else
        ai = function () {
          te(uo, 0);
        };
      function xa(ue) {
        Mr = ue, nr || (nr = !0, ai());
      }
      function rr(ue, ke) {
        ii = te(function () {
          ue(d.unstable_now());
        }, ke);
      }
      function oi() {
        we(ii), ii = -1;
      }
      var cu = lo, Ta = null;
      d.unstable_IdlePriority = X, d.unstable_ImmediatePriority = O, d.unstable_LowPriority = B, d.unstable_NormalPriority = $, d.unstable_Profiling = Ta, d.unstable_UserBlockingPriority = U, d.unstable_cancelCallback = Pi, d.unstable_continueExecution = su, d.unstable_forceFrameRate = _a, d.unstable_getCurrentPriorityLevel = An, d.unstable_getFirstCallbackNode = Ar, d.unstable_next = In, d.unstable_pauseExecution = bi, d.unstable_requestPaint = cu, d.unstable_runWithPriority = ba, d.unstable_scheduleCallback = ri, d.unstable_shouldYield = el, d.unstable_wrapCallback = Ea, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(dw)), dw;
}
var H_;
function hC() {
  return H_ || (H_ = 1, process.env.NODE_ENV === "production" ? gy.exports = eA() : gy.exports = tA()), gy.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var P_;
function nA() {
  if (P_)
    return ti;
  P_ = 1;
  var d = tC, u = hC();
  function s(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, o = 1; o < arguments.length; o++)
      r += "&args[]=" + encodeURIComponent(arguments[o]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var h = /* @__PURE__ */ new Set(), g = {};
  function w(n, r) {
    m(n, r), m(n + "Capture", r);
  }
  function m(n, r) {
    for (g[n] = r, n = 0; n < r.length; n++)
      h.add(r[n]);
  }
  var _ = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), C = Object.prototype.hasOwnProperty, R = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, O = {}, U = {};
  function $(n) {
    return C.call(U, n) ? !0 : C.call(O, n) ? !1 : R.test(n) ? U[n] = !0 : (O[n] = !0, !1);
  }
  function B(n, r, o, c) {
    if (o !== null && o.type === 0)
      return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return c ? !1 : o !== null ? !o.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function X(n, r, o, c) {
    if (r === null || typeof r > "u" || B(n, r, o, c))
      return !0;
    if (c)
      return !1;
    if (o !== null)
      switch (o.type) {
        case 3:
          return !r;
        case 4:
          return r === !1;
        case 5:
          return isNaN(r);
        case 6:
          return isNaN(r) || 1 > r;
      }
    return !1;
  }
  function ee(n, r, o, c, p, y, E) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = c, this.attributeNamespace = p, this.mustUseProperty = o, this.propertyName = n, this.type = r, this.sanitizeURL = y, this.removeEmptyString = E;
  }
  var re = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function (n) {
    re[n] = new ee(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function (n) {
    var r = n[0];
    re[r] = new ee(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function (n) {
    re[n] = new ee(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (n) {
    re[n] = new ee(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function (n) {
    re[n] = new ee(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function (n) {
    re[n] = new ee(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function (n) {
    re[n] = new ee(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function (n) {
    re[n] = new ee(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function (n) {
    re[n] = new ee(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Je = /[\-:]([a-z])/g;
  function Ce(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function (n) {
    var r = n.replace(
      Je,
      Ce
    );
    re[r] = new ee(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function (n) {
    var r = n.replace(Je, Ce);
    re[r] = new ee(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function (n) {
    var r = n.replace(Je, Ce);
    re[r] = new ee(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function (n) {
    re[n] = new ee(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), re.xlinkHref = new ee("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function (n) {
    re[n] = new ee(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function pe(n, r, o, c) {
    var p = re.hasOwnProperty(r) ? re[r] : null;
    (p !== null ? p.type !== 0 : c || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (X(r, o, p, c) && (o = null), c || p === null ? $(r) && (o === null ? n.removeAttribute(r) : n.setAttribute(r, "" + o)) : p.mustUseProperty ? n[p.propertyName] = o === null ? p.type === 3 ? !1 : "" : o : (r = p.attributeName, c = p.attributeNamespace, o === null ? n.removeAttribute(r) : (p = p.type, o = p === 3 || p === 4 && o === !0 ? "" : "" + o, c ? n.setAttributeNS(c, r, o) : n.setAttribute(r, o))));
  }
  var _e = d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, $e = Symbol.for("react.element"), ft = Symbol.for("react.portal"), Ae = Symbol.for("react.fragment"), Pe = Symbol.for("react.strict_mode"), dt = Symbol.for("react.profiler"), at = Symbol.for("react.provider"), ht = Symbol.for("react.context"), Gt = Symbol.for("react.forward_ref"), qe = Symbol.for("react.suspense"), ze = Symbol.for("react.suspense_list"), Ct = Symbol.for("react.memo"), Xe = Symbol.for("react.lazy"), fn = Symbol.for("react.offscreen"), te = Symbol.iterator;
  function we(n) {
    return n === null || typeof n != "object" ? null : (n = te && n[te] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var le = Object.assign, Ie;
  function Ze(n) {
    if (Ie === void 0)
      try {
        throw Error();
      } catch (o) {
        var r = o.stack.trim().match(/\n( *(at )?)/);
        Ie = r && r[1] || "";
      }
    return `
` + Ie + n;
  }
  var Wt = !1;
  function Bn(n, r) {
    if (!n || Wt)
      return "";
    Wt = !0;
    var o = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r)
        if (r = function () {
          throw Error();
        }, Object.defineProperty(r.prototype, "props", {
          set: function () {
            throw Error();
          }
        }), typeof Reflect == "object" && Reflect.construct) {
          try {
            Reflect.construct(r, []);
          } catch (V) {
            var c = V;
          }
          Reflect.construct(n, [], r);
        } else {
          try {
            r.call();
          } catch (V) {
            c = V;
          }
          n.call(r.prototype);
        }
      else {
        try {
          throw Error();
        } catch (V) {
          c = V;
        }
        n();
      }
    } catch (V) {
      if (V && c && typeof V.stack == "string") {
        for (var p = V.stack.split(`
`), y = c.stack.split(`
`), E = p.length - 1, k = y.length - 1; 1 <= E && 0 <= k && p[E] !== y[k];)
          k--;
        for (; 1 <= E && 0 <= k; E--, k--)
          if (p[E] !== y[k]) {
            if (E !== 1 || k !== 1)
              do
                if (E--, k--, 0 > k || p[E] !== y[k]) {
                  var D = `
` + p[E].replace(" at new ", " at ");
                  return n.displayName && D.includes("<anonymous>") && (D = D.replace("<anonymous>", n.displayName)), D;
                }
              while (1 <= E && 0 <= k);
            break;
          }
      }
    } finally {
      Wt = !1, Error.prepareStackTrace = o;
    }
    return (n = n ? n.displayName || n.name : "") ? Ze(n) : "";
  }
  function ba(n) {
    switch (n.tag) {
      case 5:
        return Ze(n.type);
      case 16:
        return Ze("Lazy");
      case 13:
        return Ze("Suspense");
      case 19:
        return Ze("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Bn(n.type, !1), n;
      case 11:
        return n = Bn(n.type.render, !1), n;
      case 1:
        return n = Bn(n.type, !0), n;
      default:
        return "";
    }
  }
  function In(n) {
    if (n == null)
      return null;
    if (typeof n == "function")
      return n.displayName || n.name || null;
    if (typeof n == "string")
      return n;
    switch (n) {
      case Ae:
        return "Fragment";
      case ft:
        return "Portal";
      case dt:
        return "Profiler";
      case Pe:
        return "StrictMode";
      case qe:
        return "Suspense";
      case ze:
        return "SuspenseList";
    }
    if (typeof n == "object")
      switch (n.$$typeof) {
        case ht:
          return (n.displayName || "Context") + ".Consumer";
        case at:
          return (n._context.displayName || "Context") + ".Provider";
        case Gt:
          var r = n.render;
          return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
        case Ct:
          return r = n.displayName || null, r !== null ? r : In(n.type) || "Memo";
        case Xe:
          r = n._payload, n = n._init;
          try {
            return In(n(r));
          } catch {
          }
      }
    return null;
  }
  function Ea(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return In(r);
      case 8:
        return r === Pe ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function")
          return r.displayName || r.name || null;
        if (typeof r == "string")
          return r;
    }
    return null;
  }
  function ri(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function bi(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function su(n) {
    var r = bi(n) ? "checked" : "value", o = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), c = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof o < "u" && typeof o.get == "function" && typeof o.set == "function") {
      var p = o.get, y = o.set;
      return Object.defineProperty(n, r, {
        configurable: !0, get: function () {
          return p.call(this);
        }, set: function (E) {
          c = "" + E, y.call(this, E);
        }
      }), Object.defineProperty(n, r, { enumerable: o.enumerable }), {
        getValue: function () {
          return c;
        }, setValue: function (E) {
          c = "" + E;
        }, stopTracking: function () {
          n._valueTracker = null, delete n[r];
        }
      };
    }
  }
  function Ar(n) {
    n._valueTracker || (n._valueTracker = su(n));
  }
  function Pi(n) {
    if (!n)
      return !1;
    var r = n._valueTracker;
    if (!r)
      return !0;
    var o = r.getValue(), c = "";
    return n && (c = bi(n) ? n.checked ? "true" : "false" : n.value), n = c, n !== o ? (r.setValue(n), !0) : !1;
  }
  function An(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u")
      return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function nr(n, r) {
    var o = r.checked;
    return le({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: o ?? n._wrapperState.initialChecked });
  }
  function Mr(n, r) {
    var o = r.defaultValue == null ? "" : r.defaultValue, c = r.checked != null ? r.checked : r.defaultChecked;
    o = ri(r.value != null ? r.value : o), n._wrapperState = { initialChecked: c, initialValue: o, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function ii(n, r) {
    r = r.checked, r != null && pe(n, "checked", r, !1);
  }
  function Sr(n, r) {
    ii(n, r);
    var o = ri(r.value), c = r.type;
    if (o != null)
      c === "number" ? (o === 0 && n.value === "" || n.value != o) && (n.value = "" + o) : n.value !== "" + o && (n.value = "" + o);
    else if (c === "submit" || c === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? el(n, r.type, o) : r.hasOwnProperty("defaultValue") && el(n, r.type, ri(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Vi(n, r, o) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var c = r.type;
      if (!(c !== "submit" && c !== "reset" || r.value !== void 0 && r.value !== null))
        return;
      r = "" + n._wrapperState.initialValue, o || r === n.value || (n.value = r), n.defaultValue = r;
    }
    o = n.name, o !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, o !== "" && (n.name = o);
  }
  function el(n, r, o) {
    (r !== "number" || An(n.ownerDocument) !== n) && (o == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + o && (n.defaultValue = "" + o));
  }
  var lo = Array.isArray;
  function _a(n, r, o, c) {
    if (n = n.options, r) {
      r = {};
      for (var p = 0; p < o.length; p++)
        r["$" + o[p]] = !0;
      for (o = 0; o < n.length; o++)
        p = r.hasOwnProperty("$" + n[o].value), n[o].selected !== p && (n[o].selected = p), p && c && (n[o].defaultSelected = !0);
    } else {
      for (o = "" + ri(o), r = null, p = 0; p < n.length; p++) {
        if (n[p].value === o) {
          n[p].selected = !0, c && (n[p].defaultSelected = !0);
          return;
        }
        r !== null || n[p].disabled || (r = n[p]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function uo(n, r) {
    if (r.dangerouslySetInnerHTML != null)
      throw Error(s(91));
    return le({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function ai(n, r) {
    var o = r.value;
    if (o == null) {
      if (o = r.children, r = r.defaultValue, o != null) {
        if (r != null)
          throw Error(s(92));
        if (lo(o)) {
          if (1 < o.length)
            throw Error(s(93));
          o = o[0];
        }
        r = o;
      }
      r == null && (r = ""), o = r;
    }
    n._wrapperState = { initialValue: ri(o) };
  }
  function Ca(n, r) {
    var o = ri(r.value), c = ri(r.defaultValue);
    o != null && (o = "" + o, o !== n.value && (n.value = o), r.defaultValue == null && n.defaultValue !== o && (n.defaultValue = o)), c != null && (n.defaultValue = "" + c);
  }
  function Ei(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function xa(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function rr(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? xa(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var oi, cu = function (n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function (r, o, c, p) {
      MSApp.execUnsafeLocalFunction(function () {
        return n(r, o, c, p);
      });
    } : n;
  }(function (n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n)
      n.innerHTML = r;
    else {
      for (oi = oi || document.createElement("div"), oi.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = oi.firstChild; n.firstChild;)
        n.removeChild(n.firstChild);
      for (; r.firstChild;)
        n.appendChild(r.firstChild);
    }
  });
  function Ta(n, r) {
    if (r) {
      var o = n.firstChild;
      if (o && o === n.lastChild && o.nodeType === 3) {
        o.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var ue = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, ke = ["Webkit", "ms", "Moz", "O"];
  Object.keys(ue).forEach(function (n) {
    ke.forEach(function (r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), ue[r] = ue[n];
    });
  });
  function Qe(n, r, o) {
    return r == null || typeof r == "boolean" || r === "" ? "" : o || typeof r != "number" || r === 0 || ue.hasOwnProperty(n) && ue[n] ? ("" + r).trim() : r + "px";
  }
  function wt(n, r) {
    n = n.style;
    for (var o in r)
      if (r.hasOwnProperty(o)) {
        var c = o.indexOf("--") === 0, p = Qe(o, r[o], c);
        o === "float" && (o = "cssFloat"), c ? n.setProperty(o, p) : n[o] = p;
      }
  }
  var It = le({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Mn(n, r) {
    if (r) {
      if (It[n] && (r.children != null || r.dangerouslySetInnerHTML != null))
        throw Error(s(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null)
          throw Error(s(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML))
          throw Error(s(61));
      }
      if (r.style != null && typeof r.style != "object")
        throw Error(s(62));
    }
  }
  function nn(n, r) {
    if (n.indexOf("-") === -1)
      return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Ur = null;
  function Ft(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var _i = null, Kt = null, $t = null;
  function cp(n) {
    if (n = Nu(n)) {
      if (typeof _i != "function")
        throw Error(s(280));
      var r = n.stateNode;
      r && (r = Te(r), _i(n.stateNode, n.type, r));
    }
  }
  function ks(n) {
    Kt ? $t ? $t.push(n) : $t = [n] : Kt = n;
  }
  function Ds() {
    if (Kt) {
      var n = Kt, r = $t;
      if ($t = Kt = null, cp(n), r)
        for (n = 0; n < r.length; n++)
          cp(r[n]);
    }
  }
  function fp(n, r) {
    return n(r);
  }
  function dp() {
  }
  var Os = !1;
  function zf(n, r, o) {
    if (Os)
      return n(r, o);
    Os = !0;
    try {
      return fp(n, r, o);
    } finally {
      Os = !1, (Kt !== null || $t !== null) && (dp(), Ds());
    }
  }
  function fu(n, r) {
    var o = n.stateNode;
    if (o === null)
      return null;
    var c = Te(o);
    if (c === null)
      return null;
    o = c[r];
    e:
    switch (r) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (c = !c.disabled) || (n = n.type, c = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !c;
        break e;
      default:
        n = !1;
    }
    if (n)
      return null;
    if (o && typeof o != "function")
      throw Error(s(231, r, typeof o));
    return o;
  }
  var Ls = !1;
  if (_)
    try {
      var so = {};
      Object.defineProperty(so, "passive", {
        get: function () {
          Ls = !0;
        }
      }), window.addEventListener("test", so, so), window.removeEventListener("test", so, so);
    } catch {
      Ls = !1;
    }
  function tl(n, r, o, c, p, y, E, k, D) {
    var V = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(o, V);
    } catch (W) {
      this.onError(W);
    }
  }
  var li = !1, Bi = null, nl = !1, du = null, jf = {
    onError: function (n) {
      li = !0, Bi = n;
    }
  };
  function Ff(n, r, o, c, p, y, E, k, D) {
    li = !1, Bi = null, tl.apply(jf, arguments);
  }
  function rl(n, r, o, c, p, y, E, k, D) {
    if (Ff.apply(this, arguments), li) {
      if (li) {
        var V = Bi;
        li = !1, Bi = null;
      } else
        throw Error(s(198));
      nl || (nl = !0, du = V);
    }
  }
  function Ci(n) {
    var r = n, o = n;
    if (n.alternate)
      for (; r.return;)
        r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (o = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? o : null;
  }
  function hu(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null)
        return r.dehydrated;
    }
    return null;
  }
  function il(n) {
    if (Ci(n) !== n)
      throw Error(s(188));
  }
  function Yn(n) {
    var r = n.alternate;
    if (!r) {
      if (r = Ci(n), r === null)
        throw Error(s(188));
      return r !== n ? null : n;
    }
    for (var o = n, c = r; ;) {
      var p = o.return;
      if (p === null)
        break;
      var y = p.alternate;
      if (y === null) {
        if (c = p.return, c !== null) {
          o = c;
          continue;
        }
        break;
      }
      if (p.child === y.child) {
        for (y = p.child; y;) {
          if (y === o)
            return il(p), n;
          if (y === c)
            return il(p), r;
          y = y.sibling;
        }
        throw Error(s(188));
      }
      if (o.return !== c.return)
        o = p, c = y;
      else {
        for (var E = !1, k = p.child; k;) {
          if (k === o) {
            E = !0, o = p, c = y;
            break;
          }
          if (k === c) {
            E = !0, c = p, o = y;
            break;
          }
          k = k.sibling;
        }
        if (!E) {
          for (k = y.child; k;) {
            if (k === o) {
              E = !0, o = y, c = p;
              break;
            }
            if (k === c) {
              E = !0, c = y, o = p;
              break;
            }
            k = k.sibling;
          }
          if (!E)
            throw Error(s(189));
        }
      }
      if (o.alternate !== c)
        throw Error(s(190));
    }
    if (o.tag !== 3)
      throw Error(s(188));
    return o.stateNode.current === o ? n : r;
  }
  function hp(n) {
    return n = Yn(n), n !== null ? pp(n) : null;
  }
  function pp(n) {
    if (n.tag === 5 || n.tag === 6)
      return n;
    for (n = n.child; n !== null;) {
      var r = pp(n);
      if (r !== null)
        return r;
      n = n.sibling;
    }
    return null;
  }
  var $f = u.unstable_scheduleCallback, vp = u.unstable_cancelCallback, Ty = u.unstable_shouldYield, Ry = u.unstable_requestPaint, Ht = u.unstable_now, ky = u.unstable_getCurrentPriorityLevel, Ii = u.unstable_ImmediatePriority, Ge = u.unstable_UserBlockingPriority, Ra = u.unstable_NormalPriority, mp = u.unstable_LowPriority, Hf = u.unstable_IdlePriority, pu = null, ui = null;
  function yp(n) {
    if (ui && typeof ui.onCommitFiberRoot == "function")
      try {
        ui.onCommitFiberRoot(pu, n, void 0, (n.current.flags & 128) === 128);
      } catch {
      }
  }
  var Nr = Math.clz32 ? Math.clz32 : Dy, gp = Math.log, Sp = Math.LN2;
  function Dy(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (gp(n) / Sp | 0) | 0;
  }
  var As = 64, al = 4194304;
  function co(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function si(n, r) {
    var o = n.pendingLanes;
    if (o === 0)
      return 0;
    var c = 0, p = n.suspendedLanes, y = n.pingedLanes, E = o & 268435455;
    if (E !== 0) {
      var k = E & ~p;
      k !== 0 ? c = co(k) : (y &= E, y !== 0 && (c = co(y)));
    } else
      E = o & ~p, E !== 0 ? c = co(E) : y !== 0 && (c = co(y));
    if (c === 0)
      return 0;
    if (r !== 0 && r !== c && !(r & p) && (p = c & -c, y = r & -r, p >= y || p === 16 && (y & 4194240) !== 0))
      return r;
    if (c & 4 && (c |= o & 16), r = n.entangledLanes, r !== 0)
      for (n = n.entanglements, r &= c; 0 < r;)
        o = 31 - Nr(r), p = 1 << o, c |= n[o], r &= ~p;
    return c;
  }
  function Pf(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Ms(n, r) {
    for (var o = n.suspendedLanes, c = n.pingedLanes, p = n.expirationTimes, y = n.pendingLanes; 0 < y;) {
      var E = 31 - Nr(y), k = 1 << E, D = p[E];
      D === -1 ? (!(k & o) || k & c) && (p[E] = Pf(k, r)) : D <= r && (n.expiredLanes |= k), y &= ~k;
    }
  }
  function Vf(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Us() {
    var n = As;
    return As <<= 1, !(As & 4194240) && (As = 64), n;
  }
  function Bf(n) {
    for (var r = [], o = 0; 31 > o; o++)
      r.push(n);
    return r;
  }
  function fo(n, r, o) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Nr(r), n[r] = o;
  }
  function Oy(n, r) {
    var o = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var c = n.eventTimes;
    for (n = n.expirationTimes; 0 < o;) {
      var p = 31 - Nr(o), y = 1 << p;
      r[p] = 0, c[p] = -1, n[p] = -1, o &= ~y;
    }
  }
  function vu(n, r) {
    var o = n.entangledLanes |= r;
    for (n = n.entanglements; o;) {
      var c = 31 - Nr(o), p = 1 << c;
      p & r | n[c] & r && (n[c] |= r), o &= ~p;
    }
  }
  var mt = 0;
  function If(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var wp, Ns, bt, bp, Yf, He = !1, mu = [], Jt = null, zr = null, jr = null, yu = /* @__PURE__ */ new Map(), rn = /* @__PURE__ */ new Map(), yt = [], Ly = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function ci(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        Jt = null;
        break;
      case "dragenter":
      case "dragleave":
        zr = null;
        break;
      case "mouseover":
      case "mouseout":
        jr = null;
        break;
      case "pointerover":
      case "pointerout":
        yu.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        rn.delete(r.pointerId);
    }
  }
  function Un(n, r, o, c, p, y) {
    return n === null || n.nativeEvent !== y ? (n = { blockedOn: r, domEventName: o, eventSystemFlags: c, nativeEvent: y, targetContainers: [p] }, r !== null && (r = Nu(r), r !== null && Ns(r)), n) : (n.eventSystemFlags |= c, r = n.targetContainers, p !== null && r.indexOf(p) === -1 && r.push(p), n);
  }
  function ka(n, r, o, c, p) {
    switch (r) {
      case "focusin":
        return Jt = Un(Jt, n, r, o, c, p), !0;
      case "dragenter":
        return zr = Un(zr, n, r, o, c, p), !0;
      case "mouseover":
        return jr = Un(jr, n, r, o, c, p), !0;
      case "pointerover":
        var y = p.pointerId;
        return yu.set(y, Un(yu.get(y) || null, n, r, o, c, p)), !0;
      case "gotpointercapture":
        return y = p.pointerId, rn.set(y, Un(rn.get(y) || null, n, r, o, c, p)), !0;
    }
    return !1;
  }
  function Ep(n) {
    var r = $r(n.target);
    if (r !== null) {
      var o = Ci(r);
      if (o !== null) {
        if (r = o.tag, r === 13) {
          if (r = hu(o), r !== null) {
            n.blockedOn = r, Yf(n.priority, function () {
              bt(o);
            });
            return;
          }
        } else if (r === 3 && o.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = o.tag === 3 ? o.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function ol(n) {
    if (n.blockedOn !== null)
      return !1;
    for (var r = n.targetContainers; 0 < r.length;) {
      var o = Fs(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (o === null) {
        o = n.nativeEvent;
        var c = new o.constructor(o.type, o);
        Ur = c, o.target.dispatchEvent(c), Ur = null;
      } else
        return r = Nu(o), r !== null && Ns(r), n.blockedOn = o, !1;
      r.shift();
    }
    return !0;
  }
  function qf(n, r, o) {
    ol(n) && o.delete(r);
  }
  function _p() {
    He = !1, Jt !== null && ol(Jt) && (Jt = null), zr !== null && ol(zr) && (zr = null), jr !== null && ol(jr) && (jr = null), yu.forEach(qf), rn.forEach(qf);
  }
  function gu(n, r) {
    n.blockedOn === r && (n.blockedOn = null, He || (He = !0, u.unstable_scheduleCallback(u.unstable_NormalPriority, _p)));
  }
  function Su(n) {
    function r(p) {
      return gu(p, n);
    }
    if (0 < mu.length) {
      gu(mu[0], n);
      for (var o = 1; o < mu.length; o++) {
        var c = mu[o];
        c.blockedOn === n && (c.blockedOn = null);
      }
    }
    for (Jt !== null && gu(Jt, n), zr !== null && gu(zr, n), jr !== null && gu(jr, n), yu.forEach(r), rn.forEach(r), o = 0; o < yt.length; o++)
      c = yt[o], c.blockedOn === n && (c.blockedOn = null);
    for (; 0 < yt.length && (o = yt[0], o.blockedOn === null);)
      Ep(o), o.blockedOn === null && yt.shift();
  }
  var ll = _e.ReactCurrentBatchConfig, ho = !0;
  function Cp(n, r, o, c) {
    var p = mt, y = ll.transition;
    ll.transition = null;
    try {
      mt = 1, js(n, r, o, c);
    } finally {
      mt = p, ll.transition = y;
    }
  }
  function zs(n, r, o, c) {
    var p = mt, y = ll.transition;
    ll.transition = null;
    try {
      mt = 4, js(n, r, o, c);
    } finally {
      mt = p, ll.transition = y;
    }
  }
  function js(n, r, o, c) {
    if (ho) {
      var p = Fs(n, r, o, c);
      if (p === null)
        Ks(n, r, c, wu, o), ci(n, c);
      else if (ka(p, n, r, o, c))
        c.stopPropagation();
      else if (ci(n, c), r & 4 && -1 < Ly.indexOf(n)) {
        for (; p !== null;) {
          var y = Nu(p);
          if (y !== null && wp(y), y = Fs(n, r, o, c), y === null && Ks(n, r, c, wu, o), y === p)
            break;
          p = y;
        }
        p !== null && c.stopPropagation();
      } else
        Ks(n, r, c, null, o);
    }
  }
  var wu = null;
  function Fs(n, r, o, c) {
    if (wu = null, n = Ft(c), n = $r(n), n !== null)
      if (r = Ci(n), r === null)
        n = null;
      else if (o = r.tag, o === 13) {
        if (n = hu(r), n !== null)
          return n;
        n = null;
      } else if (o === 3) {
        if (r.stateNode.current.memoizedState.isDehydrated)
          return r.tag === 3 ? r.stateNode.containerInfo : null;
        n = null;
      } else
        r !== n && (n = null);
    return wu = n, null;
  }
  function Qf(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (ky()) {
          case Ii:
            return 1;
          case Ge:
            return 4;
          case Ra:
          case mp:
            return 16;
          case Hf:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Yi = null, bu = null, Eu = null;
  function Gf() {
    if (Eu)
      return Eu;
    var n, r = bu, o = r.length, c, p = "value" in Yi ? Yi.value : Yi.textContent, y = p.length;
    for (n = 0; n < o && r[n] === p[n]; n++)
      ;
    var E = o - n;
    for (c = 1; c <= E && r[o - c] === p[y - c]; c++)
      ;
    return Eu = p.slice(n, 1 < c ? 1 - c : void 0);
  }
  function ul(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function _u() {
    return !0;
  }
  function xp() {
    return !1;
  }
  function wr(n) {
    function r(o, c, p, y, E) {
      this._reactName = o, this._targetInst = p, this.type = c, this.nativeEvent = y, this.target = E, this.currentTarget = null;
      for (var k in n)
        n.hasOwnProperty(k) && (o = n[k], this[k] = o ? o(y) : y[k]);
      return this.isDefaultPrevented = (y.defaultPrevented != null ? y.defaultPrevented : y.returnValue === !1) ? _u : xp, this.isPropagationStopped = xp, this;
    }
    return le(r.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var o = this.nativeEvent;
        o && (o.preventDefault ? o.preventDefault() : typeof o.returnValue != "unknown" && (o.returnValue = !1), this.isDefaultPrevented = _u);
      }, stopPropagation: function () {
        var o = this.nativeEvent;
        o && (o.stopPropagation ? o.stopPropagation() : typeof o.cancelBubble != "unknown" && (o.cancelBubble = !0), this.isPropagationStopped = _u);
      }, persist: function () {
      }, isPersistent: _u
    }), r;
  }
  var Da = {
    eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function (n) {
      return n.timeStamp || Date.now();
    }, defaultPrevented: 0, isTrusted: 0
  }, $s = wr(Da), sl = le({}, Da, { view: 0, detail: 0 }), Tp = wr(sl), Hs, Wf, Cu, dn = le({}, sl, {
    screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Zf, button: 0, buttons: 0, relatedTarget: function (n) {
      return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
    }, movementX: function (n) {
      return "movementX" in n ? n.movementX : (n !== Cu && (Cu && n.type === "mousemove" ? (Hs = n.screenX - Cu.screenX, Wf = n.screenY - Cu.screenY) : Wf = Hs = 0, Cu = n), Hs);
    }, movementY: function (n) {
      return "movementY" in n ? n.movementY : Wf;
    }
  }), Ps = wr(dn), Rp = le({}, dn, { dataTransfer: 0 }), kp = wr(Rp), Ay = le({}, sl, { relatedTarget: 0 }), Oa = wr(Ay), Kf = le({}, Da, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Dp = wr(Kf), My = le({}, Da, {
    clipboardData: function (n) {
      return "clipboardData" in n ? n.clipboardData : window.clipboardData;
    }
  }), Uy = wr(My), Ny = le({}, Da, { data: 0 }), Jf = wr(Ny), Xf = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Op = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Lp = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Ap(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = Lp[n]) ? !!r[n] : !1;
  }
  function Zf() {
    return Ap;
  }
  var qi = le({}, sl, {
    key: function (n) {
      if (n.key) {
        var r = Xf[n.key] || n.key;
        if (r !== "Unidentified")
          return r;
      }
      return n.type === "keypress" ? (n = ul(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? Op[n.keyCode] || "Unidentified" : "";
    }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Zf, charCode: function (n) {
      return n.type === "keypress" ? ul(n) : 0;
    }, keyCode: function (n) {
      return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
    }, which: function (n) {
      return n.type === "keypress" ? ul(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
    }
  }), zy = wr(qi), ed = le({}, dn, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Vs = wr(ed), td = le({}, sl, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Zf }), jy = wr(td), Bs = le({}, Da, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Mp = wr(Bs), ir = le({}, dn, {
    deltaX: function (n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function (n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Qi = wr(ir), Xt = [9, 13, 27, 32], fi = _ && "CompositionEvent" in window, po = null;
  _ && "documentMode" in document && (po = document.documentMode);
  var Is = _ && "TextEvent" in window && !po, Up = _ && (!fi || po && 8 < po && 11 >= po), cl = " ", Np = !1;
  function zp(n, r) {
    switch (n) {
      case "keyup":
        return Xt.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Ys(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var fl = !1;
  function Fy(n, r) {
    switch (n) {
      case "compositionend":
        return Ys(r);
      case "keypress":
        return r.which !== 32 ? null : (Np = !0, cl);
      case "textInput":
        return n = r.data, n === cl && Np ? null : n;
      default:
        return null;
    }
  }
  function $y(n, r) {
    if (fl)
      return n === "compositionend" || !fi && zp(n, r) ? (n = Gf(), Eu = bu = Yi = null, fl = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length)
            return r.char;
          if (r.which)
            return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return Up && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var jp = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Fp(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!jp[n.type] : r === "textarea";
  }
  function $p(n, r, o, c) {
    ks(c), r = Au(r, "onChange"), 0 < r.length && (o = new $s("onChange", "change", null, o, c), n.push({ event: o, listeners: r }));
  }
  var xu = null, dl = null;
  function hl(n) {
    Ws(n, 0);
  }
  function pl(n) {
    var r = ml(n);
    if (Pi(r))
      return n;
  }
  function Hp(n, r) {
    if (n === "change")
      return r;
  }
  var nd = !1;
  if (_) {
    var rd;
    if (_) {
      var id = "oninput" in document;
      if (!id) {
        var Pp = document.createElement("div");
        Pp.setAttribute("oninput", "return;"), id = typeof Pp.oninput == "function";
      }
      rd = id;
    } else
      rd = !1;
    nd = rd && (!document.documentMode || 9 < document.documentMode);
  }
  function Vp() {
    xu && (xu.detachEvent("onpropertychange", Bp), dl = xu = null);
  }
  function Bp(n) {
    if (n.propertyName === "value" && pl(dl)) {
      var r = [];
      $p(r, dl, n, Ft(n)), zf(hl, r);
    }
  }
  function Hy(n, r, o) {
    n === "focusin" ? (Vp(), xu = r, dl = o, xu.attachEvent("onpropertychange", Bp)) : n === "focusout" && Vp();
  }
  function Py(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown")
      return pl(dl);
  }
  function Vy(n, r) {
    if (n === "click")
      return pl(r);
  }
  function Ip(n, r) {
    if (n === "input" || n === "change")
      return pl(r);
  }
  function By(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var Fr = typeof Object.is == "function" ? Object.is : By;
  function Tu(n, r) {
    if (Fr(n, r))
      return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null)
      return !1;
    var o = Object.keys(n), c = Object.keys(r);
    if (o.length !== c.length)
      return !1;
    for (c = 0; c < o.length; c++) {
      var p = o[c];
      if (!C.call(r, p) || !Fr(n[p], r[p]))
        return !1;
    }
    return !0;
  }
  function Yp(n) {
    for (; n && n.firstChild;)
      n = n.firstChild;
    return n;
  }
  function qp(n, r) {
    var o = Yp(n);
    n = 0;
    for (var c; o;) {
      if (o.nodeType === 3) {
        if (c = n + o.textContent.length, n <= r && c >= r)
          return { node: o, offset: r - n };
        n = c;
      }
      e: {
        for (; o;) {
          if (o.nextSibling) {
            o = o.nextSibling;
            break e;
          }
          o = o.parentNode;
        }
        o = void 0;
      }
      o = Yp(o);
    }
  }
  function Qp(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? Qp(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function qs() {
    for (var n = window, r = An(); r instanceof n.HTMLIFrameElement;) {
      try {
        var o = typeof r.contentWindow.location.href == "string";
      } catch {
        o = !1;
      }
      if (o)
        n = r.contentWindow;
      else
        break;
      r = An(n.document);
    }
    return r;
  }
  function Gi(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function Qs(n) {
    var r = qs(), o = n.focusedElem, c = n.selectionRange;
    if (r !== o && o && o.ownerDocument && Qp(o.ownerDocument.documentElement, o)) {
      if (c !== null && Gi(o)) {
        if (r = c.start, n = c.end, n === void 0 && (n = r), "selectionStart" in o)
          o.selectionStart = r, o.selectionEnd = Math.min(n, o.value.length);
        else if (n = (r = o.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var p = o.textContent.length, y = Math.min(c.start, p);
          c = c.end === void 0 ? y : Math.min(c.end, p), !n.extend && y > c && (p = c, c = y, y = p), p = qp(o, y);
          var E = qp(
            o,
            c
          );
          p && E && (n.rangeCount !== 1 || n.anchorNode !== p.node || n.anchorOffset !== p.offset || n.focusNode !== E.node || n.focusOffset !== E.offset) && (r = r.createRange(), r.setStart(p.node, p.offset), n.removeAllRanges(), y > c ? (n.addRange(r), n.extend(E.node, E.offset)) : (r.setEnd(E.node, E.offset), n.addRange(r)));
        }
      }
      for (r = [], n = o; n = n.parentNode;)
        n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof o.focus == "function" && o.focus(), o = 0; o < r.length; o++)
        n = r[o], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var Gp = _ && "documentMode" in document && 11 >= document.documentMode, di = null, ad = null, Ru = null, od = !1;
  function Wp(n, r, o) {
    var c = o.window === o ? o.document : o.nodeType === 9 ? o : o.ownerDocument;
    od || di == null || di !== An(c) || (c = di, "selectionStart" in c && Gi(c) ? c = { start: c.selectionStart, end: c.selectionEnd } : (c = (c.ownerDocument && c.ownerDocument.defaultView || window).getSelection(), c = { anchorNode: c.anchorNode, anchorOffset: c.anchorOffset, focusNode: c.focusNode, focusOffset: c.focusOffset }), Ru && Tu(Ru, c) || (Ru = c, c = Au(ad, "onSelect"), 0 < c.length && (r = new $s("onSelect", "select", null, r, o), n.push({ event: r, listeners: c }), r.target = di)));
  }
  function Gs(n, r) {
    var o = {};
    return o[n.toLowerCase()] = r.toLowerCase(), o["Webkit" + n] = "webkit" + r, o["Moz" + n] = "moz" + r, o;
  }
  var vo = { animationend: Gs("Animation", "AnimationEnd"), animationiteration: Gs("Animation", "AnimationIteration"), animationstart: Gs("Animation", "AnimationStart"), transitionend: Gs("Transition", "TransitionEnd") }, ld = {}, ud = {};
  _ && (ud = document.createElement("div").style, "AnimationEvent" in window || (delete vo.animationend.animation, delete vo.animationiteration.animation, delete vo.animationstart.animation), "TransitionEvent" in window || delete vo.transitionend.transition);
  function hn(n) {
    if (ld[n])
      return ld[n];
    if (!vo[n])
      return n;
    var r = vo[n], o;
    for (o in r)
      if (r.hasOwnProperty(o) && o in ud)
        return ld[n] = r[o];
    return n;
  }
  var sd = hn("animationend"), Kp = hn("animationiteration"), Jp = hn("animationstart"), Xp = hn("transitionend"), Zp = /* @__PURE__ */ new Map(), ev = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Wi(n, r) {
    Zp.set(n, r), w(r, [n]);
  }
  for (var ku = 0; ku < ev.length; ku++) {
    var mo = ev[ku], Iy = mo.toLowerCase(), Du = mo[0].toUpperCase() + mo.slice(1);
    Wi(Iy, "on" + Du);
  }
  Wi(sd, "onAnimationEnd"), Wi(Kp, "onAnimationIteration"), Wi(Jp, "onAnimationStart"), Wi("dblclick", "onDoubleClick"), Wi("focusin", "onFocus"), Wi("focusout", "onBlur"), Wi(Xp, "onTransitionEnd"), m("onMouseEnter", ["mouseout", "mouseover"]), m("onMouseLeave", ["mouseout", "mouseover"]), m("onPointerEnter", ["pointerout", "pointerover"]), m("onPointerLeave", ["pointerout", "pointerover"]), w("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), w("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), w("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), w("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), w("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), w("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Ou = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Yy = new Set("cancel close invalid load scroll toggle".split(" ").concat(Ou));
  function tv(n, r, o) {
    var c = n.type || "unknown-event";
    n.currentTarget = o, rl(c, r, void 0, n), n.currentTarget = null;
  }
  function Ws(n, r) {
    r = (r & 4) !== 0;
    for (var o = 0; o < n.length; o++) {
      var c = n[o], p = c.event;
      c = c.listeners;
      e: {
        var y = void 0;
        if (r)
          for (var E = c.length - 1; 0 <= E; E--) {
            var k = c[E], D = k.instance, V = k.currentTarget;
            if (k = k.listener, D !== y && p.isPropagationStopped())
              break e;
            tv(p, k, V), y = D;
          }
        else
          for (E = 0; E < c.length; E++) {
            if (k = c[E], D = k.instance, V = k.currentTarget, k = k.listener, D !== y && p.isPropagationStopped())
              break e;
            tv(p, k, V), y = D;
          }
      }
    }
    if (nl)
      throw n = du, nl = !1, du = null, n;
  }
  function Et(n, r) {
    var o = r[md];
    o === void 0 && (o = r[md] = /* @__PURE__ */ new Set());
    var c = n + "__bubble";
    o.has(c) || (nv(r, n, 2, !1), o.add(c));
  }
  function La(n, r, o) {
    var c = 0;
    r && (c |= 4), nv(o, n, c, r);
  }
  var Ki = "_reactListening" + Math.random().toString(36).slice(2);
  function vl(n) {
    if (!n[Ki]) {
      n[Ki] = !0, h.forEach(function (o) {
        o !== "selectionchange" && (Yy.has(o) || La(o, !1, n), La(o, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Ki] || (r[Ki] = !0, La("selectionchange", !1, r));
    }
  }
  function nv(n, r, o, c) {
    switch (Qf(r)) {
      case 1:
        var p = Cp;
        break;
      case 4:
        p = zs;
        break;
      default:
        p = js;
    }
    o = p.bind(null, r, o, n), p = void 0, !Ls || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (p = !0), c ? p !== void 0 ? n.addEventListener(r, o, { capture: !0, passive: p }) : n.addEventListener(r, o, !0) : p !== void 0 ? n.addEventListener(r, o, { passive: p }) : n.addEventListener(r, o, !1);
  }
  function Ks(n, r, o, c, p) {
    var y = c;
    if (!(r & 1) && !(r & 2) && c !== null)
      e:
      for (; ;) {
        if (c === null)
          return;
        var E = c.tag;
        if (E === 3 || E === 4) {
          var k = c.stateNode.containerInfo;
          if (k === p || k.nodeType === 8 && k.parentNode === p)
            break;
          if (E === 4)
            for (E = c.return; E !== null;) {
              var D = E.tag;
              if ((D === 3 || D === 4) && (D = E.stateNode.containerInfo, D === p || D.nodeType === 8 && D.parentNode === p))
                return;
              E = E.return;
            }
          for (; k !== null;) {
            if (E = $r(k), E === null)
              return;
            if (D = E.tag, D === 5 || D === 6) {
              c = y = E;
              continue e;
            }
            k = k.parentNode;
          }
        }
        c = c.return;
      }
    zf(function () {
      var V = y, W = Ft(o), K = [];
      e: {
        var G = Zp.get(n);
        if (G !== void 0) {
          var ce = $s, me = n;
          switch (n) {
            case "keypress":
              if (ul(o) === 0)
                break e;
            case "keydown":
            case "keyup":
              ce = zy;
              break;
            case "focusin":
              me = "focus", ce = Oa;
              break;
            case "focusout":
              me = "blur", ce = Oa;
              break;
            case "beforeblur":
            case "afterblur":
              ce = Oa;
              break;
            case "click":
              if (o.button === 2)
                break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              ce = Ps;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              ce = kp;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              ce = jy;
              break;
            case sd:
            case Kp:
            case Jp:
              ce = Dp;
              break;
            case Xp:
              ce = Mp;
              break;
            case "scroll":
              ce = Tp;
              break;
            case "wheel":
              ce = Qi;
              break;
            case "copy":
            case "cut":
            case "paste":
              ce = Uy;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              ce = Vs;
          }
          var Se = (r & 4) !== 0, qt = !Se && n === "scroll", N = Se ? G !== null ? G + "Capture" : null : G;
          Se = [];
          for (var A = V, F; A !== null;) {
            F = A;
            var Z = F.stateNode;
            if (F.tag === 5 && Z !== null && (F = Z, N !== null && (Z = fu(A, N), Z != null && Se.push(Lu(A, Z, F)))), qt)
              break;
            A = A.return;
          }
          0 < Se.length && (G = new ce(G, me, null, o, W), K.push({ event: G, listeners: Se }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (G = n === "mouseover" || n === "pointerover", ce = n === "mouseout" || n === "pointerout", G && o !== Ur && (me = o.relatedTarget || o.fromElement) && ($r(me) || me[Ji]))
            break e;
          if ((ce || G) && (G = W.window === W ? W : (G = W.ownerDocument) ? G.defaultView || G.parentWindow : window, ce ? (me = o.relatedTarget || o.toElement, ce = V, me = me ? $r(me) : null, me !== null && (qt = Ci(me), me !== qt || me.tag !== 5 && me.tag !== 6) && (me = null)) : (ce = null, me = V), ce !== me)) {
            if (Se = Ps, Z = "onMouseLeave", N = "onMouseEnter", A = "mouse", (n === "pointerout" || n === "pointerover") && (Se = Vs, Z = "onPointerLeave", N = "onPointerEnter", A = "pointer"), qt = ce == null ? G : ml(ce), F = me == null ? G : ml(me), G = new Se(Z, A + "leave", ce, o, W), G.target = qt, G.relatedTarget = F, Z = null, $r(W) === V && (Se = new Se(N, A + "enter", me, o, W), Se.target = F, Se.relatedTarget = qt, Z = Se), qt = Z, ce && me)
              t: {
                for (Se = ce, N = me, A = 0, F = Se; F; F = yo(F))
                  A++;
                for (F = 0, Z = N; Z; Z = yo(Z))
                  F++;
                for (; 0 < A - F;)
                  Se = yo(Se), A--;
                for (; 0 < F - A;)
                  N = yo(N), F--;
                for (; A--;) {
                  if (Se === N || N !== null && Se === N.alternate)
                    break t;
                  Se = yo(Se), N = yo(N);
                }
                Se = null;
              }
            else
              Se = null;
            ce !== null && cd(K, G, ce, Se, !1), me !== null && qt !== null && cd(K, qt, me, Se, !0);
          }
        }
        e: {
          if (G = V ? ml(V) : window, ce = G.nodeName && G.nodeName.toLowerCase(), ce === "select" || ce === "input" && G.type === "file")
            var be = Hp;
          else if (Fp(G))
            if (nd)
              be = Ip;
            else {
              be = Py;
              var ye = Hy;
            }
          else
            (ce = G.nodeName) && ce.toLowerCase() === "input" && (G.type === "checkbox" || G.type === "radio") && (be = Vy);
          if (be && (be = be(n, V))) {
            $p(K, be, o, W);
            break e;
          }
          ye && ye(n, G, V), n === "focusout" && (ye = G._wrapperState) && ye.controlled && G.type === "number" && el(G, "number", G.value);
        }
        switch (ye = V ? ml(V) : window, n) {
          case "focusin":
            (Fp(ye) || ye.contentEditable === "true") && (di = ye, ad = V, Ru = null);
            break;
          case "focusout":
            Ru = ad = di = null;
            break;
          case "mousedown":
            od = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            od = !1, Wp(K, o, W);
            break;
          case "selectionchange":
            if (Gp)
              break;
          case "keydown":
          case "keyup":
            Wp(K, o, W);
        }
        var xe;
        if (fi)
          e: {
            switch (n) {
              case "compositionstart":
                var Ne = "onCompositionStart";
                break e;
              case "compositionend":
                Ne = "onCompositionEnd";
                break e;
              case "compositionupdate":
                Ne = "onCompositionUpdate";
                break e;
            }
            Ne = void 0;
          }
        else
          fl ? zp(n, o) && (Ne = "onCompositionEnd") : n === "keydown" && o.keyCode === 229 && (Ne = "onCompositionStart");
        Ne && (Up && o.locale !== "ko" && (fl || Ne !== "onCompositionStart" ? Ne === "onCompositionEnd" && fl && (xe = Gf()) : (Yi = W, bu = "value" in Yi ? Yi.value : Yi.textContent, fl = !0)), ye = Au(V, Ne), 0 < ye.length && (Ne = new Jf(Ne, n, null, o, W), K.push({ event: Ne, listeners: ye }), xe ? Ne.data = xe : (xe = Ys(o), xe !== null && (Ne.data = xe)))), (xe = Is ? Fy(n, o) : $y(n, o)) && (V = Au(V, "onBeforeInput"), 0 < V.length && (W = new Jf("onBeforeInput", "beforeinput", null, o, W), K.push({ event: W, listeners: V }), W.data = xe));
      }
      Ws(K, r);
    });
  }
  function Lu(n, r, o) {
    return { instance: n, listener: r, currentTarget: o };
  }
  function Au(n, r) {
    for (var o = r + "Capture", c = []; n !== null;) {
      var p = n, y = p.stateNode;
      p.tag === 5 && y !== null && (p = y, y = fu(n, o), y != null && c.unshift(Lu(n, y, p)), y = fu(n, r), y != null && c.push(Lu(n, y, p))), n = n.return;
    }
    return c;
  }
  function yo(n) {
    if (n === null)
      return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function cd(n, r, o, c, p) {
    for (var y = r._reactName, E = []; o !== null && o !== c;) {
      var k = o, D = k.alternate, V = k.stateNode;
      if (D !== null && D === c)
        break;
      k.tag === 5 && V !== null && (k = V, p ? (D = fu(o, y), D != null && E.unshift(Lu(o, D, k))) : p || (D = fu(o, y), D != null && E.push(Lu(o, D, k)))), o = o.return;
    }
    E.length !== 0 && n.push({ event: r, listeners: E });
  }
  var fd = /\r\n?/g, qy = /\u0000|\uFFFD/g;
  function dd(n) {
    return (typeof n == "string" ? n : "" + n).replace(fd, `
`).replace(qy, "");
  }
  function Js(n, r, o) {
    if (r = dd(r), dd(n) !== r && o)
      throw Error(s(425));
  }
  function Xs() {
  }
  var hd = null, go = null;
  function Mu(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var So = typeof setTimeout == "function" ? setTimeout : void 0, rv = typeof clearTimeout == "function" ? clearTimeout : void 0, pd = typeof Promise == "function" ? Promise : void 0, vd = typeof queueMicrotask == "function" ? queueMicrotask : typeof pd < "u" ? function (n) {
    return pd.resolve(null).then(n).catch(Qy);
  } : So;
  function Qy(n) {
    setTimeout(function () {
      throw n;
    });
  }
  function Aa(n, r) {
    var o = r, c = 0;
    do {
      var p = o.nextSibling;
      if (n.removeChild(o), p && p.nodeType === 8)
        if (o = p.data, o === "/$") {
          if (c === 0) {
            n.removeChild(p), Su(r);
            return;
          }
          c--;
        } else
          o !== "$" && o !== "$?" && o !== "$!" || c++;
      o = p;
    } while (o);
    Su(r);
  }
  function hi(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3)
        break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?")
          break;
        if (r === "/$")
          return null;
      }
    }
    return n;
  }
  function Uu(n) {
    n = n.previousSibling;
    for (var r = 0; n;) {
      if (n.nodeType === 8) {
        var o = n.data;
        if (o === "$" || o === "$!" || o === "$?") {
          if (r === 0)
            return n;
          r--;
        } else
          o === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var Ma = Math.random().toString(36).slice(2), xi = "__reactFiber$" + Ma, wo = "__reactProps$" + Ma, Ji = "__reactContainer$" + Ma, md = "__reactEvents$" + Ma, Gy = "__reactListeners$" + Ma, yd = "__reactHandles$" + Ma;
  function $r(n) {
    var r = n[xi];
    if (r)
      return r;
    for (var o = n.parentNode; o;) {
      if (r = o[Ji] || o[xi]) {
        if (o = r.alternate, r.child !== null || o !== null && o.child !== null)
          for (n = Uu(n); n !== null;) {
            if (o = n[xi])
              return o;
            n = Uu(n);
          }
        return r;
      }
      n = o, o = n.parentNode;
    }
    return null;
  }
  function Nu(n) {
    return n = n[xi] || n[Ji], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function ml(n) {
    if (n.tag === 5 || n.tag === 6)
      return n.stateNode;
    throw Error(s(33));
  }
  function Te(n) {
    return n[wo] || null;
  }
  var Ua = [], xt = -1;
  function Ve(n) {
    return { current: n };
  }
  function st(n) {
    0 > xt || (n.current = Ua[xt], Ua[xt] = null, xt--);
  }
  function pt(n, r) {
    xt++, Ua[xt] = n.current, n.current = r;
  }
  var Ti = {}, Ue = Ve(Ti), Pt = Ve(!1), ar = Ti;
  function Hr(n, r) {
    var o = n.type.contextTypes;
    if (!o)
      return Ti;
    var c = n.stateNode;
    if (c && c.__reactInternalMemoizedUnmaskedChildContext === r)
      return c.__reactInternalMemoizedMaskedChildContext;
    var p = {}, y;
    for (y in o)
      p[y] = r[y];
    return c && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = p), p;
  }
  function Ot(n) {
    return n = n.childContextTypes, n != null;
  }
  function Pr() {
    st(Pt), st(Ue);
  }
  function Na(n, r, o) {
    if (Ue.current !== Ti)
      throw Error(s(168));
    pt(Ue, r), pt(Pt, o);
  }
  function zu(n, r, o) {
    var c = n.stateNode;
    if (r = r.childContextTypes, typeof c.getChildContext != "function")
      return o;
    c = c.getChildContext();
    for (var p in c)
      if (!(p in r))
        throw Error(s(108, Ea(n) || "Unknown", p));
    return le({}, o, c);
  }
  function Zs(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Ti, ar = Ue.current, pt(Ue, n), pt(Pt, Pt.current), !0;
  }
  function iv(n, r, o) {
    var c = n.stateNode;
    if (!c)
      throw Error(s(169));
    o ? (n = zu(n, r, ar), c.__reactInternalMemoizedMergedChildContext = n, st(Pt), st(Ue), pt(Ue, n)) : st(Pt), pt(Pt, o);
  }
  var br = null, pn = !1, ju = !1;
  function gd(n) {
    br === null ? br = [n] : br.push(n);
  }
  function Sd(n) {
    pn = !0, gd(n);
  }
  function or() {
    if (!ju && br !== null) {
      ju = !0;
      var n = 0, r = mt;
      try {
        var o = br;
        for (mt = 1; n < o.length; n++) {
          var c = o[n];
          do
            c = c(!0);
          while (c !== null);
        }
        br = null, pn = !1;
      } catch (p) {
        throw br !== null && (br = br.slice(n + 1)), $f(Ii, or), p;
      } finally {
        mt = r, ju = !1;
      }
    }
    return null;
  }
  var za = [], lr = 0, bo = null, yl = 0, ur = [], Nn = 0, Vr = null, wn = 1, Xi = "";
  function Er(n, r) {
    za[lr++] = yl, za[lr++] = bo, bo = n, yl = r;
  }
  function wd(n, r, o) {
    ur[Nn++] = wn, ur[Nn++] = Xi, ur[Nn++] = Vr, Vr = n;
    var c = wn;
    n = Xi;
    var p = 32 - Nr(c) - 1;
    c &= ~(1 << p), o += 1;
    var y = 32 - Nr(r) + p;
    if (30 < y) {
      var E = p - p % 5;
      y = (c & (1 << E) - 1).toString(32), c >>= E, p -= E, wn = 1 << 32 - Nr(r) + p | o << p | c, Xi = y + n;
    } else
      wn = 1 << y | o << p | c, Xi = n;
  }
  function ec(n) {
    n.return !== null && (Er(n, 1), wd(n, 1, 0));
  }
  function bd(n) {
    for (; n === bo;)
      bo = za[--lr], za[lr] = null, yl = za[--lr], za[lr] = null;
    for (; n === Vr;)
      Vr = ur[--Nn], ur[Nn] = null, Xi = ur[--Nn], ur[Nn] = null, wn = ur[--Nn], ur[Nn] = null;
  }
  var _r = null, sr = null, Tt = !1, Br = null;
  function Ed(n, r) {
    var o = Wr(5, null, null, 0);
    o.elementType = "DELETED", o.stateNode = r, o.return = n, r = n.deletions, r === null ? (n.deletions = [o], n.flags |= 16) : r.push(o);
  }
  function av(n, r) {
    switch (n.tag) {
      case 5:
        var o = n.type;
        return r = r.nodeType !== 1 || o.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, _r = n, sr = hi(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, _r = n, sr = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (o = Vr !== null ? { id: wn, overflow: Xi } : null, n.memoizedState = { dehydrated: r, treeContext: o, retryLane: 1073741824 }, o = Wr(18, null, null, 0), o.stateNode = r, o.return = n, n.child = o, _r = n, sr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function tc(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function nc(n) {
    if (Tt) {
      var r = sr;
      if (r) {
        var o = r;
        if (!av(n, r)) {
          if (tc(n))
            throw Error(s(418));
          r = hi(o.nextSibling);
          var c = _r;
          r && av(n, r) ? Ed(c, o) : (n.flags = n.flags & -4097 | 2, Tt = !1, _r = n);
        }
      } else {
        if (tc(n))
          throw Error(s(418));
        n.flags = n.flags & -4097 | 2, Tt = !1, _r = n;
      }
    }
  }
  function ov(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13;)
      n = n.return;
    _r = n;
  }
  function rc(n) {
    if (n !== _r)
      return !1;
    if (!Tt)
      return ov(n), Tt = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Mu(n.type, n.memoizedProps)), r && (r = sr)) {
      if (tc(n))
        throw lv(), Error(s(418));
      for (; r;)
        Ed(n, r), r = hi(r.nextSibling);
    }
    if (ov(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n)
        throw Error(s(317));
      e: {
        for (n = n.nextSibling, r = 0; n;) {
          if (n.nodeType === 8) {
            var o = n.data;
            if (o === "/$") {
              if (r === 0) {
                sr = hi(n.nextSibling);
                break e;
              }
              r--;
            } else
              o !== "$" && o !== "$!" && o !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        sr = null;
      }
    } else
      sr = _r ? hi(n.stateNode.nextSibling) : null;
    return !0;
  }
  function lv() {
    for (var n = sr; n;)
      n = hi(n.nextSibling);
  }
  function Mt() {
    sr = _r = null, Tt = !1;
  }
  function _d(n) {
    Br === null ? Br = [n] : Br.push(n);
  }
  var ic = _e.ReactCurrentBatchConfig;
  function Cr(n, r) {
    if (n && n.defaultProps) {
      r = le({}, r), n = n.defaultProps;
      for (var o in n)
        r[o] === void 0 && (r[o] = n[o]);
      return r;
    }
    return r;
  }
  var Ri = Ve(null), ac = null, ja = null, Cd = null;
  function xd() {
    Cd = ja = ac = null;
  }
  function Fa(n) {
    var r = Ri.current;
    st(Ri), n._currentValue = r;
  }
  function vn(n, r, o) {
    for (; n !== null;) {
      var c = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, c !== null && (c.childLanes |= r)) : c !== null && (c.childLanes & r) !== r && (c.childLanes |= r), n === o)
        break;
      n = n.return;
    }
  }
  function ie(n, r) {
    ac = n, Cd = ja = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (Zt = !0), n.firstContext = null);
  }
  function Yt(n) {
    var r = n._currentValue;
    if (Cd !== n)
      if (n = { context: n, memoizedValue: r, next: null }, ja === null) {
        if (ac === null)
          throw Error(s(308));
        ja = n, ac.dependencies = { lanes: 0, firstContext: n };
      } else
        ja = ja.next = n;
    return r;
  }
  var bn = null;
  function Td(n) {
    bn === null ? bn = [n] : bn.push(n);
  }
  function uv(n, r, o, c) {
    var p = r.interleaved;
    return p === null ? (o.next = o, Td(r)) : (o.next = p.next, p.next = o), r.interleaved = o, Zi(n, c);
  }
  function Zi(n, r) {
    n.lanes |= r;
    var o = n.alternate;
    for (o !== null && (o.lanes |= r), o = n, n = n.return; n !== null;)
      n.childLanes |= r, o = n.alternate, o !== null && (o.childLanes |= r), o = n, n = n.return;
    return o.tag === 3 ? o.stateNode : null;
  }
  var $a = !1;
  function Rd(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function an(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function ea(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Ha(n, r, o) {
    var c = n.updateQueue;
    if (c === null)
      return null;
    if (c = c.shared, We & 2) {
      var p = c.pending;
      return p === null ? r.next = r : (r.next = p.next, p.next = r), c.pending = r, Zi(n, o);
    }
    return p = c.interleaved, p === null ? (r.next = r, Td(c)) : (r.next = p.next, p.next = r), c.interleaved = r, Zi(n, o);
  }
  function oc(n, r, o) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (o & 4194240) !== 0)) {
      var c = r.lanes;
      c &= n.pendingLanes, o |= c, r.lanes = o, vu(n, o);
    }
  }
  function kd(n, r) {
    var o = n.updateQueue, c = n.alternate;
    if (c !== null && (c = c.updateQueue, o === c)) {
      var p = null, y = null;
      if (o = o.firstBaseUpdate, o !== null) {
        do {
          var E = { eventTime: o.eventTime, lane: o.lane, tag: o.tag, payload: o.payload, callback: o.callback, next: null };
          y === null ? p = y = E : y = y.next = E, o = o.next;
        } while (o !== null);
        y === null ? p = y = r : y = y.next = r;
      } else
        p = y = r;
      o = { baseState: c.baseState, firstBaseUpdate: p, lastBaseUpdate: y, shared: c.shared, effects: c.effects }, n.updateQueue = o;
      return;
    }
    n = o.lastBaseUpdate, n === null ? o.firstBaseUpdate = r : n.next = r, o.lastBaseUpdate = r;
  }
  function Pa(n, r, o, c) {
    var p = n.updateQueue;
    $a = !1;
    var y = p.firstBaseUpdate, E = p.lastBaseUpdate, k = p.shared.pending;
    if (k !== null) {
      p.shared.pending = null;
      var D = k, V = D.next;
      D.next = null, E === null ? y = V : E.next = V, E = D;
      var W = n.alternate;
      W !== null && (W = W.updateQueue, k = W.lastBaseUpdate, k !== E && (k === null ? W.firstBaseUpdate = V : k.next = V, W.lastBaseUpdate = D));
    }
    if (y !== null) {
      var K = p.baseState;
      E = 0, W = V = D = null, k = y;
      do {
        var G = k.lane, ce = k.eventTime;
        if ((c & G) === G) {
          W !== null && (W = W.next = {
            eventTime: ce,
            lane: 0,
            tag: k.tag,
            payload: k.payload,
            callback: k.callback,
            next: null
          });
          e: {
            var me = n, Se = k;
            switch (G = r, ce = o, Se.tag) {
              case 1:
                if (me = Se.payload, typeof me == "function") {
                  K = me.call(ce, K, G);
                  break e;
                }
                K = me;
                break e;
              case 3:
                me.flags = me.flags & -65537 | 128;
              case 0:
                if (me = Se.payload, G = typeof me == "function" ? me.call(ce, K, G) : me, G == null)
                  break e;
                K = le({}, K, G);
                break e;
              case 2:
                $a = !0;
            }
          }
          k.callback !== null && k.lane !== 0 && (n.flags |= 64, G = p.effects, G === null ? p.effects = [k] : G.push(k));
        } else
          ce = { eventTime: ce, lane: G, tag: k.tag, payload: k.payload, callback: k.callback, next: null }, W === null ? (V = W = ce, D = K) : W = W.next = ce, E |= G;
        if (k = k.next, k === null) {
          if (k = p.shared.pending, k === null)
            break;
          G = k, k = G.next, G.next = null, p.lastBaseUpdate = G, p.shared.pending = null;
        }
      } while (!0);
      if (W === null && (D = K), p.baseState = D, p.firstBaseUpdate = V, p.lastBaseUpdate = W, r = p.shared.interleaved, r !== null) {
        p = r;
        do
          E |= p.lane, p = p.next;
        while (p !== r);
      } else
        y === null && (p.shared.lanes = 0);
      ia |= E, n.lanes = E, n.memoizedState = K;
    }
  }
  function Eo(n, r, o) {
    if (n = r.effects, r.effects = null, n !== null)
      for (r = 0; r < n.length; r++) {
        var c = n[r], p = c.callback;
        if (p !== null) {
          if (c.callback = null, c = o, typeof p != "function")
            throw Error(s(191, p));
          p.call(c);
        }
      }
  }
  var sv = new d.Component().refs;
  function Dd(n, r, o, c) {
    r = n.memoizedState, o = o(c, r), o = o == null ? r : le({}, r, o), n.memoizedState = o, n.lanes === 0 && (n.updateQueue.baseState = o);
  }
  var lc = {
    isMounted: function (n) {
      return (n = n._reactInternals) ? Ci(n) === n : !1;
    }, enqueueSetState: function (n, r, o) {
      n = n._reactInternals;
      var c = $n(), p = en(n), y = ea(c, p);
      y.payload = r, o != null && (y.callback = o), r = Ha(n, y, p), r !== null && (Hn(r, n, p, c), oc(r, n, p));
    }, enqueueReplaceState: function (n, r, o) {
      n = n._reactInternals;
      var c = $n(), p = en(n), y = ea(c, p);
      y.tag = 1, y.payload = r, o != null && (y.callback = o), r = Ha(n, y, p), r !== null && (Hn(r, n, p, c), oc(r, n, p));
    }, enqueueForceUpdate: function (n, r) {
      n = n._reactInternals;
      var o = $n(), c = en(n), p = ea(o, c);
      p.tag = 2, r != null && (p.callback = r), r = Ha(n, p, c), r !== null && (Hn(r, n, c, o), oc(r, n, c));
    }
  };
  function cv(n, r, o, c, p, y, E) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(c, y, E) : r.prototype && r.prototype.isPureReactComponent ? !Tu(o, c) || !Tu(p, y) : !0;
  }
  function fv(n, r, o) {
    var c = !1, p = Ti, y = r.contextType;
    return typeof y == "object" && y !== null ? y = Yt(y) : (p = Ot(r) ? ar : Ue.current, c = r.contextTypes, y = (c = c != null) ? Hr(n, p) : Ti), r = new r(o, y), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = lc, n.stateNode = r, r._reactInternals = n, c && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = p, n.__reactInternalMemoizedMaskedChildContext = y), r;
  }
  function dv(n, r, o, c) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(o, c), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(o, c), r.state !== n && lc.enqueueReplaceState(r, r.state, null);
  }
  function uc(n, r, o, c) {
    var p = n.stateNode;
    p.props = o, p.state = n.memoizedState, p.refs = sv, Rd(n);
    var y = r.contextType;
    typeof y == "object" && y !== null ? p.context = Yt(y) : (y = Ot(r) ? ar : Ue.current, p.context = Hr(n, y)), p.state = n.memoizedState, y = r.getDerivedStateFromProps, typeof y == "function" && (Dd(n, r, y, o), p.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof p.getSnapshotBeforeUpdate == "function" || typeof p.UNSAFE_componentWillMount != "function" && typeof p.componentWillMount != "function" || (r = p.state, typeof p.componentWillMount == "function" && p.componentWillMount(), typeof p.UNSAFE_componentWillMount == "function" && p.UNSAFE_componentWillMount(), r !== p.state && lc.enqueueReplaceState(p, p.state, null), Pa(n, o, p, c), p.state = n.memoizedState), typeof p.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function gl(n, r, o) {
    if (n = o.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (o._owner) {
        if (o = o._owner, o) {
          if (o.tag !== 1)
            throw Error(s(309));
          var c = o.stateNode;
        }
        if (!c)
          throw Error(s(147, n));
        var p = c, y = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === y ? r.ref : (r = function (E) {
          var k = p.refs;
          k === sv && (k = p.refs = {}), E === null ? delete k[y] : k[y] = E;
        }, r._stringRef = y, r);
      }
      if (typeof n != "string")
        throw Error(s(284));
      if (!o._owner)
        throw Error(s(290, n));
    }
    return n;
  }
  function sc(n, r) {
    throw n = Object.prototype.toString.call(r), Error(s(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function hv(n) {
    var r = n._init;
    return r(n._payload);
  }
  function pv(n) {
    function r(N, A) {
      if (n) {
        var F = N.deletions;
        F === null ? (N.deletions = [A], N.flags |= 16) : F.push(A);
      }
    }
    function o(N, A) {
      if (!n)
        return null;
      for (; A !== null;)
        r(N, A), A = A.sibling;
      return null;
    }
    function c(N, A) {
      for (N = /* @__PURE__ */ new Map(); A !== null;)
        A.key !== null ? N.set(A.key, A) : N.set(A.index, A), A = A.sibling;
      return N;
    }
    function p(N, A) {
      return N = Wa(N, A), N.index = 0, N.sibling = null, N;
    }
    function y(N, A, F) {
      return N.index = F, n ? (F = N.alternate, F !== null ? (F = F.index, F < A ? (N.flags |= 2, A) : F) : (N.flags |= 2, A)) : (N.flags |= 1048576, A);
    }
    function E(N) {
      return n && N.alternate === null && (N.flags |= 2), N;
    }
    function k(N, A, F, Z) {
      return A === null || A.tag !== 6 ? (A = ns(F, N.mode, Z), A.return = N, A) : (A = p(A, F), A.return = N, A);
    }
    function D(N, A, F, Z) {
      var be = F.type;
      return be === Ae ? W(N, A, F.props.children, Z, F.key) : A !== null && (A.elementType === be || typeof be == "object" && be !== null && be.$$typeof === Xe && hv(be) === A.type) ? (Z = p(A, F.props), Z.ref = gl(N, A, F), Z.return = N, Z) : (Z = Pc(F.type, F.key, F.props, null, N.mode, Z), Z.ref = gl(N, A, F), Z.return = N, Z);
    }
    function V(N, A, F, Z) {
      return A === null || A.tag !== 4 || A.stateNode.containerInfo !== F.containerInfo || A.stateNode.implementation !== F.implementation ? (A = Po(F, N.mode, Z), A.return = N, A) : (A = p(A, F.children || []), A.return = N, A);
    }
    function W(N, A, F, Z, be) {
      return A === null || A.tag !== 7 ? (A = Ho(F, N.mode, Z, be), A.return = N, A) : (A = p(A, F), A.return = N, A);
    }
    function K(N, A, F) {
      if (typeof A == "string" && A !== "" || typeof A == "number")
        return A = ns("" + A, N.mode, F), A.return = N, A;
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case $e:
            return F = Pc(A.type, A.key, A.props, null, N.mode, F), F.ref = gl(N, null, A), F.return = N, F;
          case ft:
            return A = Po(A, N.mode, F), A.return = N, A;
          case Xe:
            var Z = A._init;
            return K(N, Z(A._payload), F);
        }
        if (lo(A) || we(A))
          return A = Ho(A, N.mode, F, null), A.return = N, A;
        sc(N, A);
      }
      return null;
    }
    function G(N, A, F, Z) {
      var be = A !== null ? A.key : null;
      if (typeof F == "string" && F !== "" || typeof F == "number")
        return be !== null ? null : k(N, A, "" + F, Z);
      if (typeof F == "object" && F !== null) {
        switch (F.$$typeof) {
          case $e:
            return F.key === be ? D(N, A, F, Z) : null;
          case ft:
            return F.key === be ? V(N, A, F, Z) : null;
          case Xe:
            return be = F._init, G(
              N,
              A,
              be(F._payload),
              Z
            );
        }
        if (lo(F) || we(F))
          return be !== null ? null : W(N, A, F, Z, null);
        sc(N, F);
      }
      return null;
    }
    function ce(N, A, F, Z, be) {
      if (typeof Z == "string" && Z !== "" || typeof Z == "number")
        return N = N.get(F) || null, k(A, N, "" + Z, be);
      if (typeof Z == "object" && Z !== null) {
        switch (Z.$$typeof) {
          case $e:
            return N = N.get(Z.key === null ? F : Z.key) || null, D(A, N, Z, be);
          case ft:
            return N = N.get(Z.key === null ? F : Z.key) || null, V(A, N, Z, be);
          case Xe:
            var ye = Z._init;
            return ce(N, A, F, ye(Z._payload), be);
        }
        if (lo(Z) || we(Z))
          return N = N.get(F) || null, W(A, N, Z, be, null);
        sc(A, Z);
      }
      return null;
    }
    function me(N, A, F, Z) {
      for (var be = null, ye = null, xe = A, Ne = A = 0, gn = null; xe !== null && Ne < F.length; Ne++) {
        xe.index > Ne ? (gn = xe, xe = null) : gn = xe.sibling;
        var it = G(N, xe, F[Ne], Z);
        if (it === null) {
          xe === null && (xe = gn);
          break;
        }
        n && xe && it.alternate === null && r(N, xe), A = y(it, A, Ne), ye === null ? be = it : ye.sibling = it, ye = it, xe = gn;
      }
      if (Ne === F.length)
        return o(N, xe), Tt && Er(N, Ne), be;
      if (xe === null) {
        for (; Ne < F.length; Ne++)
          xe = K(N, F[Ne], Z), xe !== null && (A = y(xe, A, Ne), ye === null ? be = xe : ye.sibling = xe, ye = xe);
        return Tt && Er(N, Ne), be;
      }
      for (xe = c(N, xe); Ne < F.length; Ne++)
        gn = ce(xe, N, Ne, F[Ne], Z), gn !== null && (n && gn.alternate !== null && xe.delete(gn.key === null ? Ne : gn.key), A = y(gn, A, Ne), ye === null ? be = gn : ye.sibling = gn, ye = gn);
      return n && xe.forEach(function (Ka) {
        return r(N, Ka);
      }), Tt && Er(N, Ne), be;
    }
    function Se(N, A, F, Z) {
      var be = we(F);
      if (typeof be != "function")
        throw Error(s(150));
      if (F = be.call(F), F == null)
        throw Error(s(151));
      for (var ye = be = null, xe = A, Ne = A = 0, gn = null, it = F.next(); xe !== null && !it.done; Ne++, it = F.next()) {
        xe.index > Ne ? (gn = xe, xe = null) : gn = xe.sibling;
        var Ka = G(N, xe, it.value, Z);
        if (Ka === null) {
          xe === null && (xe = gn);
          break;
        }
        n && xe && Ka.alternate === null && r(N, xe), A = y(Ka, A, Ne), ye === null ? be = Ka : ye.sibling = Ka, ye = Ka, xe = gn;
      }
      if (it.done)
        return o(
          N,
          xe
        ), Tt && Er(N, Ne), be;
      if (xe === null) {
        for (; !it.done; Ne++, it = F.next())
          it = K(N, it.value, Z), it !== null && (A = y(it, A, Ne), ye === null ? be = it : ye.sibling = it, ye = it);
        return Tt && Er(N, Ne), be;
      }
      for (xe = c(N, xe); !it.done; Ne++, it = F.next())
        it = ce(xe, N, Ne, it.value, Z), it !== null && (n && it.alternate !== null && xe.delete(it.key === null ? Ne : it.key), A = y(it, A, Ne), ye === null ? be = it : ye.sibling = it, ye = it);
      return n && xe.forEach(function (pg) {
        return r(N, pg);
      }), Tt && Er(N, Ne), be;
    }
    function qt(N, A, F, Z) {
      if (typeof F == "object" && F !== null && F.type === Ae && F.key === null && (F = F.props.children), typeof F == "object" && F !== null) {
        switch (F.$$typeof) {
          case $e:
            e: {
              for (var be = F.key, ye = A; ye !== null;) {
                if (ye.key === be) {
                  if (be = F.type, be === Ae) {
                    if (ye.tag === 7) {
                      o(N, ye.sibling), A = p(ye, F.props.children), A.return = N, N = A;
                      break e;
                    }
                  } else if (ye.elementType === be || typeof be == "object" && be !== null && be.$$typeof === Xe && hv(be) === ye.type) {
                    o(N, ye.sibling), A = p(ye, F.props), A.ref = gl(N, ye, F), A.return = N, N = A;
                    break e;
                  }
                  o(N, ye);
                  break;
                } else
                  r(N, ye);
                ye = ye.sibling;
              }
              F.type === Ae ? (A = Ho(F.props.children, N.mode, Z, F.key), A.return = N, N = A) : (Z = Pc(F.type, F.key, F.props, null, N.mode, Z), Z.ref = gl(N, A, F), Z.return = N, N = Z);
            }
            return E(N);
          case ft:
            e: {
              for (ye = F.key; A !== null;) {
                if (A.key === ye)
                  if (A.tag === 4 && A.stateNode.containerInfo === F.containerInfo && A.stateNode.implementation === F.implementation) {
                    o(N, A.sibling), A = p(A, F.children || []), A.return = N, N = A;
                    break e;
                  } else {
                    o(N, A);
                    break;
                  }
                else
                  r(N, A);
                A = A.sibling;
              }
              A = Po(F, N.mode, Z), A.return = N, N = A;
            }
            return E(N);
          case Xe:
            return ye = F._init, qt(N, A, ye(F._payload), Z);
        }
        if (lo(F))
          return me(N, A, F, Z);
        if (we(F))
          return Se(N, A, F, Z);
        sc(N, F);
      }
      return typeof F == "string" && F !== "" || typeof F == "number" ? (F = "" + F, A !== null && A.tag === 6 ? (o(N, A.sibling), A = p(A, F), A.return = N, N = A) : (o(N, A), A = ns(F, N.mode, Z), A.return = N, N = A), E(N)) : o(N, A);
    }
    return qt;
  }
  var Sl = pv(!0), vv = pv(!1), Fu = {}, pi = Ve(Fu), $u = Ve(Fu), wl = Ve(Fu);
  function _o(n) {
    if (n === Fu)
      throw Error(s(174));
    return n;
  }
  function Od(n, r) {
    switch (pt(wl, r), pt($u, n), pt(pi, Fu), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : rr(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = rr(r, n);
    }
    st(pi), pt(pi, r);
  }
  function Va() {
    st(pi), st($u), st(wl);
  }
  function De(n) {
    _o(wl.current);
    var r = _o(pi.current), o = rr(r, n.type);
    r !== o && (pt($u, n), pt(pi, o));
  }
  function Ye(n) {
    $u.current === n && (st(pi), st($u));
  }
  var Oe = Ve(0);
  function Ut(n) {
    for (var r = n; r !== null;) {
      if (r.tag === 13) {
        var o = r.memoizedState;
        if (o !== null && (o = o.dehydrated, o === null || o.data === "$?" || o.data === "$!"))
          return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128)
          return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n)
        break;
      for (; r.sibling === null;) {
        if (r.return === null || r.return === n)
          return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var Ir = [];
  function cc() {
    for (var n = 0; n < Ir.length; n++)
      Ir[n]._workInProgressVersionPrimary = null;
    Ir.length = 0;
  }
  var fc = _e.ReactCurrentDispatcher, Ld = _e.ReactCurrentBatchConfig, Co = 0, Rt = null, q = null, et = null, Le = !1, ki = !1, xr = 0, xo = 0;
  function kt() {
    throw Error(s(321));
  }
  function To(n, r) {
    if (r === null)
      return !1;
    for (var o = 0; o < r.length && o < n.length; o++)
      if (!Fr(n[o], r[o]))
        return !1;
    return !0;
  }
  function Ba(n, r, o, c, p, y) {
    if (Co = y, Rt = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, fc.current = n === null || n.memoizedState === null ? Ky : Jy, n = o(c, p), ki) {
      y = 0;
      do {
        if (ki = !1, xr = 0, 25 <= y)
          throw Error(s(301));
        y += 1, et = q = null, r.updateQueue = null, fc.current = Md, n = o(c, p);
      } while (ki);
    }
    if (fc.current = Rc, r = q !== null && q.next !== null, Co = 0, et = q = Rt = null, Le = !1, r)
      throw Error(s(300));
    return n;
  }
  function Ro() {
    var n = xr !== 0;
    return xr = 0, n;
  }
  function Yr() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return et === null ? Rt.memoizedState = et = n : et = et.next = n, et;
  }
  function cr() {
    if (q === null) {
      var n = Rt.alternate;
      n = n !== null ? n.memoizedState : null;
    } else
      n = q.next;
    var r = et === null ? Rt.memoizedState : et.next;
    if (r !== null)
      et = r, q = n;
    else {
      if (n === null)
        throw Error(s(310));
      q = n, n = { memoizedState: q.memoizedState, baseState: q.baseState, baseQueue: q.baseQueue, queue: q.queue, next: null }, et === null ? Rt.memoizedState = et = n : et = et.next = n;
    }
    return et;
  }
  function ko(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Hu(n) {
    var r = cr(), o = r.queue;
    if (o === null)
      throw Error(s(311));
    o.lastRenderedReducer = n;
    var c = q, p = c.baseQueue, y = o.pending;
    if (y !== null) {
      if (p !== null) {
        var E = p.next;
        p.next = y.next, y.next = E;
      }
      c.baseQueue = p = y, o.pending = null;
    }
    if (p !== null) {
      y = p.next, c = c.baseState;
      var k = E = null, D = null, V = y;
      do {
        var W = V.lane;
        if ((Co & W) === W)
          D !== null && (D = D.next = { lane: 0, action: V.action, hasEagerState: V.hasEagerState, eagerState: V.eagerState, next: null }), c = V.hasEagerState ? V.eagerState : n(c, V.action);
        else {
          var K = {
            lane: W,
            action: V.action,
            hasEagerState: V.hasEagerState,
            eagerState: V.eagerState,
            next: null
          };
          D === null ? (k = D = K, E = c) : D = D.next = K, Rt.lanes |= W, ia |= W;
        }
        V = V.next;
      } while (V !== null && V !== y);
      D === null ? E = c : D.next = k, Fr(c, r.memoizedState) || (Zt = !0), r.memoizedState = c, r.baseState = E, r.baseQueue = D, o.lastRenderedState = c;
    }
    if (n = o.interleaved, n !== null) {
      p = n;
      do
        y = p.lane, Rt.lanes |= y, ia |= y, p = p.next;
      while (p !== n);
    } else
      p === null && (o.lanes = 0);
    return [r.memoizedState, o.dispatch];
  }
  function Pu(n) {
    var r = cr(), o = r.queue;
    if (o === null)
      throw Error(s(311));
    o.lastRenderedReducer = n;
    var c = o.dispatch, p = o.pending, y = r.memoizedState;
    if (p !== null) {
      o.pending = null;
      var E = p = p.next;
      do
        y = n(y, E.action), E = E.next;
      while (E !== p);
      Fr(y, r.memoizedState) || (Zt = !0), r.memoizedState = y, r.baseQueue === null && (r.baseState = y), o.lastRenderedState = y;
    }
    return [y, c];
  }
  function dc() {
  }
  function hc(n, r) {
    var o = Rt, c = cr(), p = r(), y = !Fr(c.memoizedState, p);
    if (y && (c.memoizedState = p, Zt = !0), c = c.queue, Vu(mc.bind(null, o, c, n), [n]), c.getSnapshot !== r || y || et !== null && et.memoizedState.tag & 1) {
      if (o.flags |= 2048, Do(9, vc.bind(null, o, c, p, r), void 0, null), Nt === null)
        throw Error(s(349));
      Co & 30 || pc(o, r, p);
    }
    return p;
  }
  function pc(n, r, o) {
    n.flags |= 16384, n = { getSnapshot: r, value: o }, r = Rt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Rt.updateQueue = r, r.stores = [n]) : (o = r.stores, o === null ? r.stores = [n] : o.push(n));
  }
  function vc(n, r, o, c) {
    r.value = o, r.getSnapshot = c, yc(r) && gc(n);
  }
  function mc(n, r, o) {
    return o(function () {
      yc(r) && gc(n);
    });
  }
  function yc(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var o = r();
      return !Fr(n, o);
    } catch {
      return !0;
    }
  }
  function gc(n) {
    var r = Zi(n, 1);
    r !== null && Hn(r, n, 1, -1);
  }
  function Sc(n) {
    var r = Yr();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ko, lastRenderedState: n }, r.queue = n, n = n.dispatch = Tc.bind(null, Rt, n), [r.memoizedState, n];
  }
  function Do(n, r, o, c) {
    return n = { tag: n, create: r, destroy: o, deps: c, next: null }, r = Rt.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Rt.updateQueue = r, r.lastEffect = n.next = n) : (o = r.lastEffect, o === null ? r.lastEffect = n.next = n : (c = o.next, o.next = n, n.next = c, r.lastEffect = n)), n;
  }
  function wc() {
    return cr().memoizedState;
  }
  function Oo(n, r, o, c) {
    var p = Yr();
    Rt.flags |= n, p.memoizedState = Do(1 | r, o, void 0, c === void 0 ? null : c);
  }
  function ta(n, r, o, c) {
    var p = cr();
    c = c === void 0 ? null : c;
    var y = void 0;
    if (q !== null) {
      var E = q.memoizedState;
      if (y = E.destroy, c !== null && To(c, E.deps)) {
        p.memoizedState = Do(r, o, y, c);
        return;
      }
    }
    Rt.flags |= n, p.memoizedState = Do(1 | r, o, y, c);
  }
  function bc(n, r) {
    return Oo(8390656, 8, n, r);
  }
  function Vu(n, r) {
    return ta(2048, 8, n, r);
  }
  function Ec(n, r) {
    return ta(4, 2, n, r);
  }
  function _c(n, r) {
    return ta(4, 4, n, r);
  }
  function Ad(n, r) {
    if (typeof r == "function")
      return n = n(), r(n), function () {
        r(null);
      };
    if (r != null)
      return n = n(), r.current = n, function () {
        r.current = null;
      };
  }
  function bl(n, r, o) {
    return o = o != null ? o.concat([n]) : null, ta(4, 4, Ad.bind(null, r, n), o);
  }
  function Cc() {
  }
  function El(n, r) {
    var o = cr();
    r = r === void 0 ? null : r;
    var c = o.memoizedState;
    return c !== null && r !== null && To(r, c[1]) ? c[0] : (o.memoizedState = [n, r], n);
  }
  function Ia(n, r) {
    var o = cr();
    r = r === void 0 ? null : r;
    var c = o.memoizedState;
    return c !== null && r !== null && To(r, c[1]) ? c[0] : (n = n(), o.memoizedState = [n, r], n);
  }
  function fr(n, r, o) {
    return Co & 21 ? (Fr(o, r) || (o = Us(), Rt.lanes |= o, ia |= o, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, Zt = !0), n.memoizedState = o);
  }
  function Wy(n, r) {
    var o = mt;
    mt = o !== 0 && 4 > o ? o : 4, n(!0);
    var c = Ld.transition;
    Ld.transition = {};
    try {
      n(!1), r();
    } finally {
      mt = o, Ld.transition = c;
    }
  }
  function _t() {
    return cr().memoizedState;
  }
  function xc(n, r, o) {
    var c = en(n);
    if (o = { lane: c, action: o, hasEagerState: !1, eagerState: null, next: null }, _l(n))
      Bu(r, o);
    else if (o = uv(n, r, o, c), o !== null) {
      var p = $n();
      Hn(o, n, c, p), mv(o, r, c);
    }
  }
  function Tc(n, r, o) {
    var c = en(n), p = { lane: c, action: o, hasEagerState: !1, eagerState: null, next: null };
    if (_l(n))
      Bu(r, p);
    else {
      var y = n.alternate;
      if (n.lanes === 0 && (y === null || y.lanes === 0) && (y = r.lastRenderedReducer, y !== null))
        try {
          var E = r.lastRenderedState, k = y(E, o);
          if (p.hasEagerState = !0, p.eagerState = k, Fr(k, E)) {
            var D = r.interleaved;
            D === null ? (p.next = p, Td(r)) : (p.next = D.next, D.next = p), r.interleaved = p;
            return;
          }
        } catch {
        } finally {
        }
      o = uv(n, r, p, c), o !== null && (p = $n(), Hn(o, n, c, p), mv(o, r, c));
    }
  }
  function _l(n) {
    var r = n.alternate;
    return n === Rt || r !== null && r === Rt;
  }
  function Bu(n, r) {
    ki = Le = !0;
    var o = n.pending;
    o === null ? r.next = r : (r.next = o.next, o.next = r), n.pending = r;
  }
  function mv(n, r, o) {
    if (o & 4194240) {
      var c = r.lanes;
      c &= n.pendingLanes, o |= c, r.lanes = o, vu(n, o);
    }
  }
  var Rc = { readContext: Yt, useCallback: kt, useContext: kt, useEffect: kt, useImperativeHandle: kt, useInsertionEffect: kt, useLayoutEffect: kt, useMemo: kt, useReducer: kt, useRef: kt, useState: kt, useDebugValue: kt, useDeferredValue: kt, useTransition: kt, useMutableSource: kt, useSyncExternalStore: kt, useId: kt, unstable_isNewReconciler: !1 }, Ky = {
    readContext: Yt, useCallback: function (n, r) {
      return Yr().memoizedState = [n, r === void 0 ? null : r], n;
    }, useContext: Yt, useEffect: bc, useImperativeHandle: function (n, r, o) {
      return o = o != null ? o.concat([n]) : null, Oo(
        4194308,
        4,
        Ad.bind(null, r, n),
        o
      );
    }, useLayoutEffect: function (n, r) {
      return Oo(4194308, 4, n, r);
    }, useInsertionEffect: function (n, r) {
      return Oo(4, 2, n, r);
    }, useMemo: function (n, r) {
      var o = Yr();
      return r = r === void 0 ? null : r, n = n(), o.memoizedState = [n, r], n;
    }, useReducer: function (n, r, o) {
      var c = Yr();
      return r = o !== void 0 ? o(r) : r, c.memoizedState = c.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, c.queue = n, n = n.dispatch = xc.bind(null, Rt, n), [c.memoizedState, n];
    }, useRef: function (n) {
      var r = Yr();
      return n = { current: n }, r.memoizedState = n;
    }, useState: Sc, useDebugValue: Cc, useDeferredValue: function (n) {
      return Yr().memoizedState = n;
    }, useTransition: function () {
      var n = Sc(!1), r = n[0];
      return n = Wy.bind(null, n[1]), Yr().memoizedState = n, [r, n];
    }, useMutableSource: function () {
    }, useSyncExternalStore: function (n, r, o) {
      var c = Rt, p = Yr();
      if (Tt) {
        if (o === void 0)
          throw Error(s(407));
        o = o();
      } else {
        if (o = r(), Nt === null)
          throw Error(s(349));
        Co & 30 || pc(c, r, o);
      }
      p.memoizedState = o;
      var y = { value: o, getSnapshot: r };
      return p.queue = y, bc(mc.bind(
        null,
        c,
        y,
        n
      ), [n]), c.flags |= 2048, Do(9, vc.bind(null, c, y, o, r), void 0, null), o;
    }, useId: function () {
      var n = Yr(), r = Nt.identifierPrefix;
      if (Tt) {
        var o = Xi, c = wn;
        o = (c & ~(1 << 32 - Nr(c) - 1)).toString(32) + o, r = ":" + r + "R" + o, o = xr++, 0 < o && (r += "H" + o.toString(32)), r += ":";
      } else
        o = xo++, r = ":" + r + "r" + o.toString(32) + ":";
      return n.memoizedState = r;
    }, unstable_isNewReconciler: !1
  }, Jy = {
    readContext: Yt,
    useCallback: El,
    useContext: Yt,
    useEffect: Vu,
    useImperativeHandle: bl,
    useInsertionEffect: Ec,
    useLayoutEffect: _c,
    useMemo: Ia,
    useReducer: Hu,
    useRef: wc,
    useState: function () {
      return Hu(ko);
    },
    useDebugValue: Cc,
    useDeferredValue: function (n) {
      var r = cr();
      return fr(r, q.memoizedState, n);
    },
    useTransition: function () {
      var n = Hu(ko)[0], r = cr().memoizedState;
      return [n, r];
    },
    useMutableSource: dc,
    useSyncExternalStore: hc,
    useId: _t,
    unstable_isNewReconciler: !1
  }, Md = {
    readContext: Yt, useCallback: El, useContext: Yt, useEffect: Vu, useImperativeHandle: bl, useInsertionEffect: Ec, useLayoutEffect: _c, useMemo: Ia, useReducer: Pu, useRef: wc, useState: function () {
      return Pu(ko);
    }, useDebugValue: Cc, useDeferredValue: function (n) {
      var r = cr();
      return q === null ? r.memoizedState = n : fr(r, q.memoizedState, n);
    }, useTransition: function () {
      var n = Pu(ko)[0], r = cr().memoizedState;
      return [n, r];
    }, useMutableSource: dc, useSyncExternalStore: hc, useId: _t, unstable_isNewReconciler: !1
  };
  function Cl(n, r) {
    try {
      var o = "", c = r;
      do
        o += ba(c), c = c.return;
      while (c);
      var p = o;
    } catch (y) {
      p = `
Error generating stack: ` + y.message + `
` + y.stack;
    }
    return { value: n, source: r, stack: p, digest: null };
  }
  function Iu(n, r, o) {
    return { value: n, source: null, stack: o ?? null, digest: r ?? null };
  }
  function kc(n, r) {
    try {
      console.error(r.value);
    } catch (o) {
      setTimeout(function () {
        throw o;
      });
    }
  }
  var Xy = typeof WeakMap == "function" ? WeakMap : Map;
  function yv(n, r, o) {
    o = ea(-1, o), o.tag = 3, o.payload = { element: null };
    var c = r.value;
    return o.callback = function () {
      Nc || (Nc = !0, No = c), kc(n, r);
    }, o;
  }
  function Yu(n, r, o) {
    o = ea(-1, o), o.tag = 3;
    var c = n.type.getDerivedStateFromError;
    if (typeof c == "function") {
      var p = r.value;
      o.payload = function () {
        return c(p);
      }, o.callback = function () {
        kc(n, r);
      };
    }
    var y = n.stateNode;
    return y !== null && typeof y.componentDidCatch == "function" && (o.callback = function () {
      kc(n, r), typeof c != "function" && (Li === null ? Li = /* @__PURE__ */ new Set([this]) : Li.add(this));
      var E = r.stack;
      this.componentDidCatch(r.value, { componentStack: E !== null ? E : "" });
    }), o;
  }
  function gv(n, r, o) {
    var c = n.pingCache;
    if (c === null) {
      c = n.pingCache = new Xy();
      var p = /* @__PURE__ */ new Set();
      c.set(r, p);
    } else
      p = c.get(r), p === void 0 && (p = /* @__PURE__ */ new Set(), c.set(r, p));
    p.has(o) || (p.add(o), n = ag.bind(null, n, r, o), r.then(n, n));
  }
  function Ud(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r)
        return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Nd(n, r, o, c, p) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = p, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, o.flags |= 131072, o.flags &= -52805, o.tag === 1 && (o.alternate === null ? o.tag = 17 : (r = ea(-1, 1), r.tag = 2, Ha(o, r, 1))), o.lanes |= 1), n);
  }
  var Zy = _e.ReactCurrentOwner, Zt = !1;
  function on(n, r, o, c) {
    r.child = n === null ? vv(r, null, o, c) : Sl(r, n.child, o, c);
  }
  function Ya(n, r, o, c, p) {
    o = o.render;
    var y = r.ref;
    return ie(r, p), c = Ba(n, r, o, c, y, p), o = Ro(), n !== null && !Zt ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~p, En(n, r, p)) : (Tt && o && ec(r), r.flags |= 1, on(n, r, c, p), r.child);
  }
  function Dc(n, r, o, c, p) {
    if (n === null) {
      var y = o.type;
      return typeof y == "function" && !eh(y) && y.defaultProps === void 0 && o.compare === null && o.defaultProps === void 0 ? (r.tag = 15, r.type = y, dr(n, r, y, c, p)) : (n = Pc(o.type, null, c, r, r.mode, p), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (y = n.child, !(n.lanes & p)) {
      var E = y.memoizedProps;
      if (o = o.compare, o = o !== null ? o : Tu, o(E, c) && n.ref === r.ref)
        return En(n, r, p);
    }
    return r.flags |= 1, n = Wa(y, c), n.ref = r.ref, n.return = r, r.child = n;
  }
  function dr(n, r, o, c, p) {
    if (n !== null) {
      var y = n.memoizedProps;
      if (Tu(y, c) && n.ref === r.ref)
        if (Zt = !1, r.pendingProps = c = y, (n.lanes & p) !== 0)
          n.flags & 131072 && (Zt = !0);
        else
          return r.lanes = n.lanes, En(n, r, p);
    }
    return xl(n, r, o, c, p);
  }
  function Lo(n, r, o) {
    var c = r.pendingProps, p = c.children, y = n !== null ? n.memoizedState : null;
    if (c.mode === "hidden")
      if (!(r.mode & 1))
        r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, pt(Ll, Tr), Tr |= o;
      else {
        if (!(o & 1073741824))
          return n = y !== null ? y.baseLanes | o : o, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, pt(Ll, Tr), Tr |= n, null;
        r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, c = y !== null ? y.baseLanes : o, pt(Ll, Tr), Tr |= c;
      }
    else
      y !== null ? (c = y.baseLanes | o, r.memoizedState = null) : c = o, pt(Ll, Tr), Tr |= c;
    return on(n, r, p, o), r.child;
  }
  function Be(n, r) {
    var o = r.ref;
    (n === null && o !== null || n !== null && n.ref !== o) && (r.flags |= 512, r.flags |= 2097152);
  }
  function xl(n, r, o, c, p) {
    var y = Ot(o) ? ar : Ue.current;
    return y = Hr(r, y), ie(r, p), o = Ba(n, r, o, c, y, p), c = Ro(), n !== null && !Zt ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~p, En(n, r, p)) : (Tt && c && ec(r), r.flags |= 1, on(n, r, o, p), r.child);
  }
  function zd(n, r, o, c, p) {
    if (Ot(o)) {
      var y = !0;
      Zs(r);
    } else
      y = !1;
    if (ie(r, p), r.stateNode === null)
      zn(n, r), fv(r, o, c), uc(r, o, c, p), c = !0;
    else if (n === null) {
      var E = r.stateNode, k = r.memoizedProps;
      E.props = k;
      var D = E.context, V = o.contextType;
      typeof V == "object" && V !== null ? V = Yt(V) : (V = Ot(o) ? ar : Ue.current, V = Hr(r, V));
      var W = o.getDerivedStateFromProps, K = typeof W == "function" || typeof E.getSnapshotBeforeUpdate == "function";
      K || typeof E.UNSAFE_componentWillReceiveProps != "function" && typeof E.componentWillReceiveProps != "function" || (k !== c || D !== V) && dv(r, E, c, V), $a = !1;
      var G = r.memoizedState;
      E.state = G, Pa(r, c, E, p), D = r.memoizedState, k !== c || G !== D || Pt.current || $a ? (typeof W == "function" && (Dd(r, o, W, c), D = r.memoizedState), (k = $a || cv(r, o, k, c, G, D, V)) ? (K || typeof E.UNSAFE_componentWillMount != "function" && typeof E.componentWillMount != "function" || (typeof E.componentWillMount == "function" && E.componentWillMount(), typeof E.UNSAFE_componentWillMount == "function" && E.UNSAFE_componentWillMount()), typeof E.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof E.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = c, r.memoizedState = D), E.props = c, E.state = D, E.context = V, c = k) : (typeof E.componentDidMount == "function" && (r.flags |= 4194308), c = !1);
    } else {
      E = r.stateNode, an(n, r), k = r.memoizedProps, V = r.type === r.elementType ? k : Cr(r.type, k), E.props = V, K = r.pendingProps, G = E.context, D = o.contextType, typeof D == "object" && D !== null ? D = Yt(D) : (D = Ot(o) ? ar : Ue.current, D = Hr(r, D));
      var ce = o.getDerivedStateFromProps;
      (W = typeof ce == "function" || typeof E.getSnapshotBeforeUpdate == "function") || typeof E.UNSAFE_componentWillReceiveProps != "function" && typeof E.componentWillReceiveProps != "function" || (k !== K || G !== D) && dv(r, E, c, D), $a = !1, G = r.memoizedState, E.state = G, Pa(r, c, E, p);
      var me = r.memoizedState;
      k !== K || G !== me || Pt.current || $a ? (typeof ce == "function" && (Dd(r, o, ce, c), me = r.memoizedState), (V = $a || cv(r, o, V, c, G, me, D) || !1) ? (W || typeof E.UNSAFE_componentWillUpdate != "function" && typeof E.componentWillUpdate != "function" || (typeof E.componentWillUpdate == "function" && E.componentWillUpdate(c, me, D), typeof E.UNSAFE_componentWillUpdate == "function" && E.UNSAFE_componentWillUpdate(c, me, D)), typeof E.componentDidUpdate == "function" && (r.flags |= 4), typeof E.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof E.componentDidUpdate != "function" || k === n.memoizedProps && G === n.memoizedState || (r.flags |= 4), typeof E.getSnapshotBeforeUpdate != "function" || k === n.memoizedProps && G === n.memoizedState || (r.flags |= 1024), r.memoizedProps = c, r.memoizedState = me), E.props = c, E.state = me, E.context = D, c = V) : (typeof E.componentDidUpdate != "function" || k === n.memoizedProps && G === n.memoizedState || (r.flags |= 4), typeof E.getSnapshotBeforeUpdate != "function" || k === n.memoizedProps && G === n.memoizedState || (r.flags |= 1024), c = !1);
    }
    return Sv(n, r, o, c, y, p);
  }
  function Sv(n, r, o, c, p, y) {
    Be(n, r);
    var E = (r.flags & 128) !== 0;
    if (!c && !E)
      return p && iv(r, o, !1), En(n, r, y);
    c = r.stateNode, Zy.current = r;
    var k = E && typeof o.getDerivedStateFromError != "function" ? null : c.render();
    return r.flags |= 1, n !== null && E ? (r.child = Sl(r, n.child, null, y), r.child = Sl(r, null, k, y)) : on(n, r, k, y), r.memoizedState = c.state, p && iv(r, o, !0), r.child;
  }
  function wv(n) {
    var r = n.stateNode;
    r.pendingContext ? Na(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Na(n, r.context, !1), Od(n, r.containerInfo);
  }
  function Oc(n, r, o, c, p) {
    return Mt(), _d(p), r.flags |= 256, on(n, r, o, c), r.child;
  }
  var Ao = { dehydrated: null, treeContext: null, retryLane: 0 };
  function jd(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function Fd(n, r, o) {
    var c = r.pendingProps, p = Oe.current, y = !1, E = (r.flags & 128) !== 0, k;
    if ((k = E) || (k = n !== null && n.memoizedState === null ? !1 : (p & 2) !== 0), k ? (y = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (p |= 1), pt(Oe, p & 1), n === null)
      return nc(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (E = c.children, n = c.fallback, y ? (c = r.mode, y = r.child, E = { mode: "hidden", children: E }, !(c & 1) && y !== null ? (y.childLanes = 0, y.pendingProps = E) : y = ts(E, c, 0, null), n = Ho(n, c, o, null), y.return = r, n.return = r, y.sibling = n, r.child = y, r.child.memoizedState = jd(o), r.memoizedState = Ao, n) : $d(r, E));
    if (p = n.memoizedState, p !== null && (k = p.dehydrated, k !== null))
      return eg(n, r, E, c, k, p, o);
    if (y) {
      y = c.fallback, E = r.mode, p = n.child, k = p.sibling;
      var D = { mode: "hidden", children: c.children };
      return !(E & 1) && r.child !== p ? (c = r.child, c.childLanes = 0, c.pendingProps = D, r.deletions = null) : (c = Wa(p, D), c.subtreeFlags = p.subtreeFlags & 14680064), k !== null ? y = Wa(k, y) : (y = Ho(y, E, o, null), y.flags |= 2), y.return = r, c.return = r, c.sibling = y, r.child = c, c = y, y = r.child, E = n.child.memoizedState, E = E === null ? jd(o) : { baseLanes: E.baseLanes | o, cachePool: null, transitions: E.transitions }, y.memoizedState = E, y.childLanes = n.childLanes & ~o, r.memoizedState = Ao, c;
    }
    return y = n.child, n = y.sibling, c = Wa(y, { mode: "visible", children: c.children }), !(r.mode & 1) && (c.lanes = o), c.return = r, c.sibling = null, n !== null && (o = r.deletions, o === null ? (r.deletions = [n], r.flags |= 16) : o.push(n)), r.child = c, r.memoizedState = null, c;
  }
  function $d(n, r) {
    return r = ts({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function Tl(n, r, o, c) {
    return c !== null && _d(c), Sl(r, n.child, null, o), n = $d(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function eg(n, r, o, c, p, y, E) {
    if (o)
      return r.flags & 256 ? (r.flags &= -257, c = Iu(Error(s(422))), Tl(n, r, E, c)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (y = c.fallback, p = r.mode, c = ts({ mode: "visible", children: c.children }, p, 0, null), y = Ho(y, p, E, null), y.flags |= 2, c.return = r, y.return = r, c.sibling = y, r.child = c, r.mode & 1 && Sl(r, n.child, null, E), r.child.memoizedState = jd(E), r.memoizedState = Ao, y);
    if (!(r.mode & 1))
      return Tl(n, r, E, null);
    if (p.data === "$!") {
      if (c = p.nextSibling && p.nextSibling.dataset, c)
        var k = c.dgst;
      return c = k, y = Error(s(419)), c = Iu(y, c, void 0), Tl(n, r, E, c);
    }
    if (k = (E & n.childLanes) !== 0, Zt || k) {
      if (c = Nt, c !== null) {
        switch (E & -E) {
          case 4:
            p = 2;
            break;
          case 16:
            p = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            p = 32;
            break;
          case 536870912:
            p = 268435456;
            break;
          default:
            p = 0;
        }
        p = p & (c.suspendedLanes | E) ? 0 : p, p !== 0 && p !== y.retryLane && (y.retryLane = p, Zi(n, p), Hn(c, n, p, -1));
      }
      return Jd(), c = Iu(Error(s(421))), Tl(n, r, E, c);
    }
    return p.data === "$?" ? (r.flags |= 128, r.child = n.child, r = og.bind(null, n), p._reactRetry = r, null) : (n = y.treeContext, sr = hi(p.nextSibling), _r = r, Tt = !0, Br = null, n !== null && (ur[Nn++] = wn, ur[Nn++] = Xi, ur[Nn++] = Vr, wn = n.id, Xi = n.overflow, Vr = r), r = $d(r, c.children), r.flags |= 4096, r);
  }
  function Hd(n, r, o) {
    n.lanes |= r;
    var c = n.alternate;
    c !== null && (c.lanes |= r), vn(n.return, r, o);
  }
  function Lc(n, r, o, c, p) {
    var y = n.memoizedState;
    y === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: c, tail: o, tailMode: p } : (y.isBackwards = r, y.rendering = null, y.renderingStartTime = 0, y.last = c, y.tail = o, y.tailMode = p);
  }
  function Pd(n, r, o) {
    var c = r.pendingProps, p = c.revealOrder, y = c.tail;
    if (on(n, r, c.children, o), c = Oe.current, c & 2)
      c = c & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128)
        e:
        for (n = r.child; n !== null;) {
          if (n.tag === 13)
            n.memoizedState !== null && Hd(n, o, r);
          else if (n.tag === 19)
            Hd(n, o, r);
          else if (n.child !== null) {
            n.child.return = n, n = n.child;
            continue;
          }
          if (n === r)
            break e;
          for (; n.sibling === null;) {
            if (n.return === null || n.return === r)
              break e;
            n = n.return;
          }
          n.sibling.return = n.return, n = n.sibling;
        }
      c &= 1;
    }
    if (pt(Oe, c), !(r.mode & 1))
      r.memoizedState = null;
    else
      switch (p) {
        case "forwards":
          for (o = r.child, p = null; o !== null;)
            n = o.alternate, n !== null && Ut(n) === null && (p = o), o = o.sibling;
          o = p, o === null ? (p = r.child, r.child = null) : (p = o.sibling, o.sibling = null), Lc(r, !1, p, o, y);
          break;
        case "backwards":
          for (o = null, p = r.child, r.child = null; p !== null;) {
            if (n = p.alternate, n !== null && Ut(n) === null) {
              r.child = p;
              break;
            }
            n = p.sibling, p.sibling = o, o = p, p = n;
          }
          Lc(r, !0, o, null, y);
          break;
        case "together":
          Lc(r, !1, null, null, void 0);
          break;
        default:
          r.memoizedState = null;
      }
    return r.child;
  }
  function zn(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function En(n, r, o) {
    if (n !== null && (r.dependencies = n.dependencies), ia |= r.lanes, !(o & r.childLanes))
      return null;
    if (n !== null && r.child !== n.child)
      throw Error(s(153));
    if (r.child !== null) {
      for (n = r.child, o = Wa(n, n.pendingProps), r.child = o, o.return = r; n.sibling !== null;)
        n = n.sibling, o = o.sibling = Wa(n, n.pendingProps), o.return = r;
      o.sibling = null;
    }
    return r.child;
  }
  function na(n, r, o) {
    switch (r.tag) {
      case 3:
        wv(r), Mt();
        break;
      case 5:
        De(r);
        break;
      case 1:
        Ot(r.type) && Zs(r);
        break;
      case 4:
        Od(r, r.stateNode.containerInfo);
        break;
      case 10:
        var c = r.type._context, p = r.memoizedProps.value;
        pt(Ri, c._currentValue), c._currentValue = p;
        break;
      case 13:
        if (c = r.memoizedState, c !== null)
          return c.dehydrated !== null ? (pt(Oe, Oe.current & 1), r.flags |= 128, null) : o & r.child.childLanes ? Fd(n, r, o) : (pt(Oe, Oe.current & 1), n = En(n, r, o), n !== null ? n.sibling : null);
        pt(Oe, Oe.current & 1);
        break;
      case 19:
        if (c = (o & r.childLanes) !== 0, n.flags & 128) {
          if (c)
            return Pd(n, r, o);
          r.flags |= 128;
        }
        if (p = r.memoizedState, p !== null && (p.rendering = null, p.tail = null, p.lastEffect = null), pt(Oe, Oe.current), c)
          break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, Lo(n, r, o);
    }
    return En(n, r, o);
  }
  var qu, Mo, qr, ln;
  qu = function (n, r) {
    for (var o = r.child; o !== null;) {
      if (o.tag === 5 || o.tag === 6)
        n.appendChild(o.stateNode);
      else if (o.tag !== 4 && o.child !== null) {
        o.child.return = o, o = o.child;
        continue;
      }
      if (o === r)
        break;
      for (; o.sibling === null;) {
        if (o.return === null || o.return === r)
          return;
        o = o.return;
      }
      o.sibling.return = o.return, o = o.sibling;
    }
  }, Mo = function () {
  }, qr = function (n, r, o, c) {
    var p = n.memoizedProps;
    if (p !== c) {
      n = r.stateNode, _o(pi.current);
      var y = null;
      switch (o) {
        case "input":
          p = nr(n, p), c = nr(n, c), y = [];
          break;
        case "select":
          p = le({}, p, { value: void 0 }), c = le({}, c, { value: void 0 }), y = [];
          break;
        case "textarea":
          p = uo(n, p), c = uo(n, c), y = [];
          break;
        default:
          typeof p.onClick != "function" && typeof c.onClick == "function" && (n.onclick = Xs);
      }
      Mn(o, c);
      var E;
      o = null;
      for (V in p)
        if (!c.hasOwnProperty(V) && p.hasOwnProperty(V) && p[V] != null)
          if (V === "style") {
            var k = p[V];
            for (E in k)
              k.hasOwnProperty(E) && (o || (o = {}), o[E] = "");
          } else
            V !== "dangerouslySetInnerHTML" && V !== "children" && V !== "suppressContentEditableWarning" && V !== "suppressHydrationWarning" && V !== "autoFocus" && (g.hasOwnProperty(V) ? y || (y = []) : (y = y || []).push(V, null));
      for (V in c) {
        var D = c[V];
        if (k = p != null ? p[V] : void 0, c.hasOwnProperty(V) && D !== k && (D != null || k != null))
          if (V === "style")
            if (k) {
              for (E in k)
                !k.hasOwnProperty(E) || D && D.hasOwnProperty(E) || (o || (o = {}), o[E] = "");
              for (E in D)
                D.hasOwnProperty(E) && k[E] !== D[E] && (o || (o = {}), o[E] = D[E]);
            } else
              o || (y || (y = []), y.push(
                V,
                o
              )), o = D;
          else
            V === "dangerouslySetInnerHTML" ? (D = D ? D.__html : void 0, k = k ? k.__html : void 0, D != null && k !== D && (y = y || []).push(V, D)) : V === "children" ? typeof D != "string" && typeof D != "number" || (y = y || []).push(V, "" + D) : V !== "suppressContentEditableWarning" && V !== "suppressHydrationWarning" && (g.hasOwnProperty(V) ? (D != null && V === "onScroll" && Et("scroll", n), y || k === D || (y = [])) : (y = y || []).push(V, D));
      }
      o && (y = y || []).push("style", o);
      var V = y;
      (r.updateQueue = V) && (r.flags |= 4);
    }
  }, ln = function (n, r, o, c) {
    o !== c && (r.flags |= 4);
  };
  function Qu(n, r) {
    if (!Tt)
      switch (n.tailMode) {
        case "hidden":
          r = n.tail;
          for (var o = null; r !== null;)
            r.alternate !== null && (o = r), r = r.sibling;
          o === null ? n.tail = null : o.sibling = null;
          break;
        case "collapsed":
          o = n.tail;
          for (var c = null; o !== null;)
            o.alternate !== null && (c = o), o = o.sibling;
          c === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : c.sibling = null;
      }
  }
  function jn(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, o = 0, c = 0;
    if (r)
      for (var p = n.child; p !== null;)
        o |= p.lanes | p.childLanes, c |= p.subtreeFlags & 14680064, c |= p.flags & 14680064, p.return = n, p = p.sibling;
    else
      for (p = n.child; p !== null;)
        o |= p.lanes | p.childLanes, c |= p.subtreeFlags, c |= p.flags, p.return = n, p = p.sibling;
    return n.subtreeFlags |= c, n.childLanes = o, r;
  }
  function tg(n, r, o) {
    var c = r.pendingProps;
    switch (bd(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return jn(r), null;
      case 1:
        return Ot(r.type) && Pr(), jn(r), null;
      case 3:
        return c = r.stateNode, Va(), st(Pt), st(Ue), cc(), c.pendingContext && (c.context = c.pendingContext, c.pendingContext = null), (n === null || n.child === null) && (rc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, Br !== null && (es(Br), Br = null))), Mo(n, r), jn(r), null;
      case 5:
        Ye(r);
        var p = _o(wl.current);
        if (o = r.type, n !== null && r.stateNode != null)
          qr(n, r, o, c, p), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!c) {
            if (r.stateNode === null)
              throw Error(s(166));
            return jn(r), null;
          }
          if (n = _o(pi.current), rc(r)) {
            c = r.stateNode, o = r.type;
            var y = r.memoizedProps;
            switch (c[xi] = r, c[wo] = y, n = (r.mode & 1) !== 0, o) {
              case "dialog":
                Et("cancel", c), Et("close", c);
                break;
              case "iframe":
              case "object":
              case "embed":
                Et("load", c);
                break;
              case "video":
              case "audio":
                for (p = 0; p < Ou.length; p++)
                  Et(Ou[p], c);
                break;
              case "source":
                Et("error", c);
                break;
              case "img":
              case "image":
              case "link":
                Et(
                  "error",
                  c
                ), Et("load", c);
                break;
              case "details":
                Et("toggle", c);
                break;
              case "input":
                Mr(c, y), Et("invalid", c);
                break;
              case "select":
                c._wrapperState = { wasMultiple: !!y.multiple }, Et("invalid", c);
                break;
              case "textarea":
                ai(c, y), Et("invalid", c);
            }
            Mn(o, y), p = null;
            for (var E in y)
              if (y.hasOwnProperty(E)) {
                var k = y[E];
                E === "children" ? typeof k == "string" ? c.textContent !== k && (y.suppressHydrationWarning !== !0 && Js(c.textContent, k, n), p = ["children", k]) : typeof k == "number" && c.textContent !== "" + k && (y.suppressHydrationWarning !== !0 && Js(
                  c.textContent,
                  k,
                  n
                ), p = ["children", "" + k]) : g.hasOwnProperty(E) && k != null && E === "onScroll" && Et("scroll", c);
              }
            switch (o) {
              case "input":
                Ar(c), Vi(c, y, !0);
                break;
              case "textarea":
                Ar(c), Ei(c);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof y.onClick == "function" && (c.onclick = Xs);
            }
            c = p, r.updateQueue = c, c !== null && (r.flags |= 4);
          } else {
            E = p.nodeType === 9 ? p : p.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = xa(o)), n === "http://www.w3.org/1999/xhtml" ? o === "script" ? (n = E.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof c.is == "string" ? n = E.createElement(o, { is: c.is }) : (n = E.createElement(o), o === "select" && (E = n, c.multiple ? E.multiple = !0 : c.size && (E.size = c.size))) : n = E.createElementNS(n, o), n[xi] = r, n[wo] = c, qu(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (E = nn(o, c), o) {
                case "dialog":
                  Et("cancel", n), Et("close", n), p = c;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  Et("load", n), p = c;
                  break;
                case "video":
                case "audio":
                  for (p = 0; p < Ou.length; p++)
                    Et(Ou[p], n);
                  p = c;
                  break;
                case "source":
                  Et("error", n), p = c;
                  break;
                case "img":
                case "image":
                case "link":
                  Et(
                    "error",
                    n
                  ), Et("load", n), p = c;
                  break;
                case "details":
                  Et("toggle", n), p = c;
                  break;
                case "input":
                  Mr(n, c), p = nr(n, c), Et("invalid", n);
                  break;
                case "option":
                  p = c;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!c.multiple }, p = le({}, c, { value: void 0 }), Et("invalid", n);
                  break;
                case "textarea":
                  ai(n, c), p = uo(n, c), Et("invalid", n);
                  break;
                default:
                  p = c;
              }
              Mn(o, p), k = p;
              for (y in k)
                if (k.hasOwnProperty(y)) {
                  var D = k[y];
                  y === "style" ? wt(n, D) : y === "dangerouslySetInnerHTML" ? (D = D ? D.__html : void 0, D != null && cu(n, D)) : y === "children" ? typeof D == "string" ? (o !== "textarea" || D !== "") && Ta(n, D) : typeof D == "number" && Ta(n, "" + D) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (g.hasOwnProperty(y) ? D != null && y === "onScroll" && Et("scroll", n) : D != null && pe(n, y, D, E));
                }
              switch (o) {
                case "input":
                  Ar(n), Vi(n, c, !1);
                  break;
                case "textarea":
                  Ar(n), Ei(n);
                  break;
                case "option":
                  c.value != null && n.setAttribute("value", "" + ri(c.value));
                  break;
                case "select":
                  n.multiple = !!c.multiple, y = c.value, y != null ? _a(n, !!c.multiple, y, !1) : c.defaultValue != null && _a(
                    n,
                    !!c.multiple,
                    c.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof p.onClick == "function" && (n.onclick = Xs);
              }
              switch (o) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  c = !!c.autoFocus;
                  break e;
                case "img":
                  c = !0;
                  break e;
                default:
                  c = !1;
              }
            }
            c && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return jn(r), null;
      case 6:
        if (n && r.stateNode != null)
          ln(n, r, n.memoizedProps, c);
        else {
          if (typeof c != "string" && r.stateNode === null)
            throw Error(s(166));
          if (o = _o(wl.current), _o(pi.current), rc(r)) {
            if (c = r.stateNode, o = r.memoizedProps, c[xi] = r, (y = c.nodeValue !== o) && (n = _r, n !== null))
              switch (n.tag) {
                case 3:
                  Js(c.nodeValue, o, (n.mode & 1) !== 0);
                  break;
                case 5:
                  n.memoizedProps.suppressHydrationWarning !== !0 && Js(c.nodeValue, o, (n.mode & 1) !== 0);
              }
            y && (r.flags |= 4);
          } else
            c = (o.nodeType === 9 ? o : o.ownerDocument).createTextNode(c), c[xi] = r, r.stateNode = c;
        }
        return jn(r), null;
      case 13:
        if (st(Oe), c = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (Tt && sr !== null && r.mode & 1 && !(r.flags & 128))
            lv(), Mt(), r.flags |= 98560, y = !1;
          else if (y = rc(r), c !== null && c.dehydrated !== null) {
            if (n === null) {
              if (!y)
                throw Error(s(318));
              if (y = r.memoizedState, y = y !== null ? y.dehydrated : null, !y)
                throw Error(s(317));
              y[xi] = r;
            } else
              Mt(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            jn(r), y = !1;
          } else
            Br !== null && (es(Br), Br = null), y = !0;
          if (!y)
            return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = o, r) : (c = c !== null, c !== (n !== null && n.memoizedState !== null) && c && (r.child.flags |= 8192, r.mode & 1 && (n === null || Oe.current & 1 ? sn === 0 && (sn = 3) : Jd())), r.updateQueue !== null && (r.flags |= 4), jn(r), null);
      case 4:
        return Va(), Mo(n, r), n === null && vl(r.stateNode.containerInfo), jn(r), null;
      case 10:
        return Fa(r.type._context), jn(r), null;
      case 17:
        return Ot(r.type) && Pr(), jn(r), null;
      case 19:
        if (st(Oe), y = r.memoizedState, y === null)
          return jn(r), null;
        if (c = (r.flags & 128) !== 0, E = y.rendering, E === null)
          if (c)
            Qu(y, !1);
          else {
            if (sn !== 0 || n !== null && n.flags & 128)
              for (n = r.child; n !== null;) {
                if (E = Ut(n), E !== null) {
                  for (r.flags |= 128, Qu(y, !1), c = E.updateQueue, c !== null && (r.updateQueue = c, r.flags |= 4), r.subtreeFlags = 0, c = o, o = r.child; o !== null;)
                    y = o, n = c, y.flags &= 14680066, E = y.alternate, E === null ? (y.childLanes = 0, y.lanes = n, y.child = null, y.subtreeFlags = 0, y.memoizedProps = null, y.memoizedState = null, y.updateQueue = null, y.dependencies = null, y.stateNode = null) : (y.childLanes = E.childLanes, y.lanes = E.lanes, y.child = E.child, y.subtreeFlags = 0, y.deletions = null, y.memoizedProps = E.memoizedProps, y.memoizedState = E.memoizedState, y.updateQueue = E.updateQueue, y.type = E.type, n = E.dependencies, y.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), o = o.sibling;
                  return pt(Oe, Oe.current & 1 | 2), r.child;
                }
                n = n.sibling;
              }
            y.tail !== null && Ht() > Ml && (r.flags |= 128, c = !0, Qu(y, !1), r.lanes = 4194304);
          }
        else {
          if (!c)
            if (n = Ut(E), n !== null) {
              if (r.flags |= 128, c = !0, o = n.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), Qu(y, !0), y.tail === null && y.tailMode === "hidden" && !E.alternate && !Tt)
                return jn(r), null;
            } else
              2 * Ht() - y.renderingStartTime > Ml && o !== 1073741824 && (r.flags |= 128, c = !0, Qu(y, !1), r.lanes = 4194304);
          y.isBackwards ? (E.sibling = r.child, r.child = E) : (o = y.last, o !== null ? o.sibling = E : r.child = E, y.last = E);
        }
        return y.tail !== null ? (r = y.tail, y.rendering = r, y.tail = r.sibling, y.renderingStartTime = Ht(), r.sibling = null, o = Oe.current, pt(Oe, c ? o & 1 | 2 : o & 1), r) : (jn(r), null);
      case 22:
      case 23:
        return Kd(), c = r.memoizedState !== null, n !== null && n.memoizedState !== null !== c && (r.flags |= 8192), c && r.mode & 1 ? Tr & 1073741824 && (jn(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : jn(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(s(156, r.tag));
  }
  function Vd(n, r) {
    switch (bd(r), r.tag) {
      case 1:
        return Ot(r.type) && Pr(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return Va(), st(Pt), st(Ue), cc(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return Ye(r), null;
      case 13:
        if (st(Oe), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null)
            throw Error(s(340));
          Mt();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return st(Oe), null;
      case 4:
        return Va(), null;
      case 10:
        return Fa(r.type._context), null;
      case 22:
      case 23:
        return Kd(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Gu = !1, un = !1, bv = typeof WeakSet == "function" ? WeakSet : Set, ve = null;
  function Rl(n, r) {
    var o = n.ref;
    if (o !== null)
      if (typeof o == "function")
        try {
          o(null);
        } catch (c) {
          Bt(n, r, c);
        }
      else
        o.current = null;
  }
  function Wu(n, r, o) {
    try {
      o();
    } catch (c) {
      Bt(n, r, c);
    }
  }
  var Ev = !1;
  function _v(n, r) {
    if (hd = ho, n = qs(), Gi(n)) {
      if ("selectionStart" in n)
        var o = { start: n.selectionStart, end: n.selectionEnd };
      else
        e: {
          o = (o = n.ownerDocument) && o.defaultView || window;
          var c = o.getSelection && o.getSelection();
          if (c && c.rangeCount !== 0) {
            o = c.anchorNode;
            var p = c.anchorOffset, y = c.focusNode;
            c = c.focusOffset;
            try {
              o.nodeType, y.nodeType;
            } catch {
              o = null;
              break e;
            }
            var E = 0, k = -1, D = -1, V = 0, W = 0, K = n, G = null;
            t:
            for (; ;) {
              for (var ce; K !== o || p !== 0 && K.nodeType !== 3 || (k = E + p), K !== y || c !== 0 && K.nodeType !== 3 || (D = E + c), K.nodeType === 3 && (E += K.nodeValue.length), (ce = K.firstChild) !== null;)
                G = K, K = ce;
              for (; ;) {
                if (K === n)
                  break t;
                if (G === o && ++V === p && (k = E), G === y && ++W === c && (D = E), (ce = K.nextSibling) !== null)
                  break;
                K = G, G = K.parentNode;
              }
              K = ce;
            }
            o = k === -1 || D === -1 ? null : { start: k, end: D };
          } else
            o = null;
        }
      o = o || { start: 0, end: 0 };
    } else
      o = null;
    for (go = { focusedElem: n, selectionRange: o }, ho = !1, ve = r; ve !== null;)
      if (r = ve, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null)
        n.return = r, ve = n;
      else
        for (; ve !== null;) {
          r = ve;
          try {
            var me = r.alternate;
            if (r.flags & 1024)
              switch (r.tag) {
                case 0:
                case 11:
                case 15:
                  break;
                case 1:
                  if (me !== null) {
                    var Se = me.memoizedProps, qt = me.memoizedState, N = r.stateNode, A = N.getSnapshotBeforeUpdate(r.elementType === r.type ? Se : Cr(r.type, Se), qt);
                    N.__reactInternalSnapshotBeforeUpdate = A;
                  }
                  break;
                case 3:
                  var F = r.stateNode.containerInfo;
                  F.nodeType === 1 ? F.textContent = "" : F.nodeType === 9 && F.documentElement && F.removeChild(F.documentElement);
                  break;
                case 5:
                case 6:
                case 4:
                case 17:
                  break;
                default:
                  throw Error(s(163));
              }
          } catch (Z) {
            Bt(r, r.return, Z);
          }
          if (n = r.sibling, n !== null) {
            n.return = r.return, ve = n;
            break;
          }
          ve = r.return;
        }
    return me = Ev, Ev = !1, me;
  }
  function Ku(n, r, o) {
    var c = r.updateQueue;
    if (c = c !== null ? c.lastEffect : null, c !== null) {
      var p = c = c.next;
      do {
        if ((p.tag & n) === n) {
          var y = p.destroy;
          p.destroy = void 0, y !== void 0 && Wu(r, o, y);
        }
        p = p.next;
      } while (p !== c);
    }
  }
  function Ju(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var o = r = r.next;
      do {
        if ((o.tag & n) === n) {
          var c = o.create;
          o.destroy = c();
        }
        o = o.next;
      } while (o !== r);
    }
  }
  function Bd(n) {
    var r = n.ref;
    if (r !== null) {
      var o = n.stateNode;
      switch (n.tag) {
        case 5:
          n = o;
          break;
        default:
          n = o;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function Id(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, Id(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[xi], delete r[wo], delete r[md], delete r[Gy], delete r[yd])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Cv(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Ac(n) {
    e:
    for (; ;) {
      for (; n.sibling === null;) {
        if (n.return === null || Cv(n.return))
          return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18;) {
        if (n.flags & 2 || n.child === null || n.tag === 4)
          continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2))
        return n.stateNode;
    }
  }
  function kl(n, r, o) {
    var c = n.tag;
    if (c === 5 || c === 6)
      n = n.stateNode, r ? o.nodeType === 8 ? o.parentNode.insertBefore(n, r) : o.insertBefore(n, r) : (o.nodeType === 8 ? (r = o.parentNode, r.insertBefore(n, o)) : (r = o, r.appendChild(n)), o = o._reactRootContainer, o != null || r.onclick !== null || (r.onclick = Xs));
    else if (c !== 4 && (n = n.child, n !== null))
      for (kl(n, r, o), n = n.sibling; n !== null;)
        kl(n, r, o), n = n.sibling;
  }
  function Di(n, r, o) {
    var c = n.tag;
    if (c === 5 || c === 6)
      n = n.stateNode, r ? o.insertBefore(n, r) : o.appendChild(n);
    else if (c !== 4 && (n = n.child, n !== null))
      for (Di(n, r, o), n = n.sibling; n !== null;)
        Di(n, r, o), n = n.sibling;
  }
  var Lt = null, mn = !1;
  function Qr(n, r, o) {
    for (o = o.child; o !== null;)
      Dl(n, r, o), o = o.sibling;
  }
  function Dl(n, r, o) {
    if (ui && typeof ui.onCommitFiberUnmount == "function")
      try {
        ui.onCommitFiberUnmount(pu, o);
      } catch {
      }
    switch (o.tag) {
      case 5:
        un || Rl(o, r);
      case 6:
        var c = Lt, p = mn;
        Lt = null, Qr(n, r, o), Lt = c, mn = p, Lt !== null && (mn ? (n = Lt, o = o.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(o) : n.removeChild(o)) : Lt.removeChild(o.stateNode));
        break;
      case 18:
        Lt !== null && (mn ? (n = Lt, o = o.stateNode, n.nodeType === 8 ? Aa(n.parentNode, o) : n.nodeType === 1 && Aa(n, o), Su(n)) : Aa(Lt, o.stateNode));
        break;
      case 4:
        c = Lt, p = mn, Lt = o.stateNode.containerInfo, mn = !0, Qr(n, r, o), Lt = c, mn = p;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!un && (c = o.updateQueue, c !== null && (c = c.lastEffect, c !== null))) {
          p = c = c.next;
          do {
            var y = p, E = y.destroy;
            y = y.tag, E !== void 0 && (y & 2 || y & 4) && Wu(o, r, E), p = p.next;
          } while (p !== c);
        }
        Qr(n, r, o);
        break;
      case 1:
        if (!un && (Rl(o, r), c = o.stateNode, typeof c.componentWillUnmount == "function"))
          try {
            c.props = o.memoizedProps, c.state = o.memoizedState, c.componentWillUnmount();
          } catch (k) {
            Bt(o, r, k);
          }
        Qr(n, r, o);
        break;
      case 21:
        Qr(n, r, o);
        break;
      case 22:
        o.mode & 1 ? (un = (c = un) || o.memoizedState !== null, Qr(n, r, o), un = c) : Qr(n, r, o);
        break;
      default:
        Qr(n, r, o);
    }
  }
  function ra(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var o = n.stateNode;
      o === null && (o = n.stateNode = new bv()), r.forEach(function (c) {
        var p = lg.bind(null, n, c);
        o.has(c) || (o.add(c), c.then(p, p));
      });
    }
  }
  function vi(n, r) {
    var o = r.deletions;
    if (o !== null)
      for (var c = 0; c < o.length; c++) {
        var p = o[c];
        try {
          var y = n, E = r, k = E;
          e:
          for (; k !== null;) {
            switch (k.tag) {
              case 5:
                Lt = k.stateNode, mn = !1;
                break e;
              case 3:
                Lt = k.stateNode.containerInfo, mn = !0;
                break e;
              case 4:
                Lt = k.stateNode.containerInfo, mn = !0;
                break e;
            }
            k = k.return;
          }
          if (Lt === null)
            throw Error(s(160));
          Dl(y, E, p), Lt = null, mn = !1;
          var D = p.alternate;
          D !== null && (D.return = null), p.return = null;
        } catch (V) {
          Bt(p, r, V);
        }
      }
    if (r.subtreeFlags & 12854)
      for (r = r.child; r !== null;)
        xv(r, n), r = r.sibling;
  }
  function xv(n, r) {
    var o = n.alternate, c = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (vi(r, n), Oi(n), c & 4) {
          try {
            Ku(3, n, n.return), Ju(3, n);
          } catch (Se) {
            Bt(n, n.return, Se);
          }
          try {
            Ku(5, n, n.return);
          } catch (Se) {
            Bt(n, n.return, Se);
          }
        }
        break;
      case 1:
        vi(r, n), Oi(n), c & 512 && o !== null && Rl(o, o.return);
        break;
      case 5:
        if (vi(r, n), Oi(n), c & 512 && o !== null && Rl(o, o.return), n.flags & 32) {
          var p = n.stateNode;
          try {
            Ta(p, "");
          } catch (Se) {
            Bt(n, n.return, Se);
          }
        }
        if (c & 4 && (p = n.stateNode, p != null)) {
          var y = n.memoizedProps, E = o !== null ? o.memoizedProps : y, k = n.type, D = n.updateQueue;
          if (n.updateQueue = null, D !== null)
            try {
              k === "input" && y.type === "radio" && y.name != null && ii(p, y), nn(k, E);
              var V = nn(k, y);
              for (E = 0; E < D.length; E += 2) {
                var W = D[E], K = D[E + 1];
                W === "style" ? wt(p, K) : W === "dangerouslySetInnerHTML" ? cu(p, K) : W === "children" ? Ta(p, K) : pe(p, W, K, V);
              }
              switch (k) {
                case "input":
                  Sr(p, y);
                  break;
                case "textarea":
                  Ca(p, y);
                  break;
                case "select":
                  var G = p._wrapperState.wasMultiple;
                  p._wrapperState.wasMultiple = !!y.multiple;
                  var ce = y.value;
                  ce != null ? _a(p, !!y.multiple, ce, !1) : G !== !!y.multiple && (y.defaultValue != null ? _a(
                    p,
                    !!y.multiple,
                    y.defaultValue,
                    !0
                  ) : _a(p, !!y.multiple, y.multiple ? [] : "", !1));
              }
              p[wo] = y;
            } catch (Se) {
              Bt(n, n.return, Se);
            }
        }
        break;
      case 6:
        if (vi(r, n), Oi(n), c & 4) {
          if (n.stateNode === null)
            throw Error(s(162));
          p = n.stateNode, y = n.memoizedProps;
          try {
            p.nodeValue = y;
          } catch (Se) {
            Bt(n, n.return, Se);
          }
        }
        break;
      case 3:
        if (vi(r, n), Oi(n), c & 4 && o !== null && o.memoizedState.isDehydrated)
          try {
            Su(r.containerInfo);
          } catch (Se) {
            Bt(n, n.return, Se);
          }
        break;
      case 4:
        vi(r, n), Oi(n);
        break;
      case 13:
        vi(r, n), Oi(n), p = n.child, p.flags & 8192 && (y = p.memoizedState !== null, p.stateNode.isHidden = y, !y || p.alternate !== null && p.alternate.memoizedState !== null || (Qd = Ht())), c & 4 && ra(n);
        break;
      case 22:
        if (W = o !== null && o.memoizedState !== null, n.mode & 1 ? (un = (V = un) || W, vi(r, n), un = V) : vi(r, n), Oi(n), c & 8192) {
          if (V = n.memoizedState !== null, (n.stateNode.isHidden = V) && !W && n.mode & 1)
            for (ve = n, W = n.child; W !== null;) {
              for (K = ve = W; ve !== null;) {
                switch (G = ve, ce = G.child, G.tag) {
                  case 0:
                  case 11:
                  case 14:
                  case 15:
                    Ku(4, G, G.return);
                    break;
                  case 1:
                    Rl(G, G.return);
                    var me = G.stateNode;
                    if (typeof me.componentWillUnmount == "function") {
                      c = G, o = G.return;
                      try {
                        r = c, me.props = r.memoizedProps, me.state = r.memoizedState, me.componentWillUnmount();
                      } catch (Se) {
                        Bt(c, o, Se);
                      }
                    }
                    break;
                  case 5:
                    Rl(G, G.return);
                    break;
                  case 22:
                    if (G.memoizedState !== null) {
                      Yd(K);
                      continue;
                    }
                }
                ce !== null ? (ce.return = G, ve = ce) : Yd(K);
              }
              W = W.sibling;
            }
          e:
          for (W = null, K = n; ;) {
            if (K.tag === 5) {
              if (W === null) {
                W = K;
                try {
                  p = K.stateNode, V ? (y = p.style, typeof y.setProperty == "function" ? y.setProperty("display", "none", "important") : y.display = "none") : (k = K.stateNode, D = K.memoizedProps.style, E = D != null && D.hasOwnProperty("display") ? D.display : null, k.style.display = Qe("display", E));
                } catch (Se) {
                  Bt(n, n.return, Se);
                }
              }
            } else if (K.tag === 6) {
              if (W === null)
                try {
                  K.stateNode.nodeValue = V ? "" : K.memoizedProps;
                } catch (Se) {
                  Bt(n, n.return, Se);
                }
            } else if ((K.tag !== 22 && K.tag !== 23 || K.memoizedState === null || K === n) && K.child !== null) {
              K.child.return = K, K = K.child;
              continue;
            }
            if (K === n)
              break e;
            for (; K.sibling === null;) {
              if (K.return === null || K.return === n)
                break e;
              W === K && (W = null), K = K.return;
            }
            W === K && (W = null), K.sibling.return = K.return, K = K.sibling;
          }
        }
        break;
      case 19:
        vi(r, n), Oi(n), c & 4 && ra(n);
        break;
      case 21:
        break;
      default:
        vi(
          r,
          n
        ), Oi(n);
    }
  }
  function Oi(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var o = n.return; o !== null;) {
            if (Cv(o)) {
              var c = o;
              break e;
            }
            o = o.return;
          }
          throw Error(s(160));
        }
        switch (c.tag) {
          case 5:
            var p = c.stateNode;
            c.flags & 32 && (Ta(p, ""), c.flags &= -33);
            var y = Ac(n);
            Di(n, y, p);
            break;
          case 3:
          case 4:
            var E = c.stateNode.containerInfo, k = Ac(n);
            kl(n, k, E);
            break;
          default:
            throw Error(s(161));
        }
      } catch (D) {
        Bt(n, n.return, D);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function Tv(n, r, o) {
    ve = n, Ol(n);
  }
  function Ol(n, r, o) {
    for (var c = (n.mode & 1) !== 0; ve !== null;) {
      var p = ve, y = p.child;
      if (p.tag === 22 && c) {
        var E = p.memoizedState !== null || Gu;
        if (!E) {
          var k = p.alternate, D = k !== null && k.memoizedState !== null || un;
          k = Gu;
          var V = un;
          if (Gu = E, (un = D) && !V)
            for (ve = p; ve !== null;)
              E = ve, D = E.child, E.tag === 22 && E.memoizedState !== null ? kv(p) : D !== null ? (D.return = E, ve = D) : kv(p);
          for (; y !== null;)
            ve = y, Ol(y), y = y.sibling;
          ve = p, Gu = k, un = V;
        }
        Rv(n);
      } else
        p.subtreeFlags & 8772 && y !== null ? (y.return = p, ve = y) : Rv(n);
    }
  }
  function Rv(n) {
    for (; ve !== null;) {
      var r = ve;
      if (r.flags & 8772) {
        var o = r.alternate;
        try {
          if (r.flags & 8772)
            switch (r.tag) {
              case 0:
              case 11:
              case 15:
                un || Ju(5, r);
                break;
              case 1:
                var c = r.stateNode;
                if (r.flags & 4 && !un)
                  if (o === null)
                    c.componentDidMount();
                  else {
                    var p = r.elementType === r.type ? o.memoizedProps : Cr(r.type, o.memoizedProps);
                    c.componentDidUpdate(p, o.memoizedState, c.__reactInternalSnapshotBeforeUpdate);
                  }
                var y = r.updateQueue;
                y !== null && Eo(r, y, c);
                break;
              case 3:
                var E = r.updateQueue;
                if (E !== null) {
                  if (o = null, r.child !== null)
                    switch (r.child.tag) {
                      case 5:
                        o = r.child.stateNode;
                        break;
                      case 1:
                        o = r.child.stateNode;
                    }
                  Eo(r, E, o);
                }
                break;
              case 5:
                var k = r.stateNode;
                if (o === null && r.flags & 4) {
                  o = k;
                  var D = r.memoizedProps;
                  switch (r.type) {
                    case "button":
                    case "input":
                    case "select":
                    case "textarea":
                      D.autoFocus && o.focus();
                      break;
                    case "img":
                      D.src && (o.src = D.src);
                  }
                }
                break;
              case 6:
                break;
              case 4:
                break;
              case 12:
                break;
              case 13:
                if (r.memoizedState === null) {
                  var V = r.alternate;
                  if (V !== null) {
                    var W = V.memoizedState;
                    if (W !== null) {
                      var K = W.dehydrated;
                      K !== null && Su(K);
                    }
                  }
                }
                break;
              case 19:
              case 17:
              case 21:
              case 22:
              case 23:
              case 25:
                break;
              default:
                throw Error(s(163));
            }
          un || r.flags & 512 && Bd(r);
        } catch (G) {
          Bt(r, r.return, G);
        }
      }
      if (r === n) {
        ve = null;
        break;
      }
      if (o = r.sibling, o !== null) {
        o.return = r.return, ve = o;
        break;
      }
      ve = r.return;
    }
  }
  function Yd(n) {
    for (; ve !== null;) {
      var r = ve;
      if (r === n) {
        ve = null;
        break;
      }
      var o = r.sibling;
      if (o !== null) {
        o.return = r.return, ve = o;
        break;
      }
      ve = r.return;
    }
  }
  function kv(n) {
    for (; ve !== null;) {
      var r = ve;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var o = r.return;
            try {
              Ju(4, r);
            } catch (D) {
              Bt(r, o, D);
            }
            break;
          case 1:
            var c = r.stateNode;
            if (typeof c.componentDidMount == "function") {
              var p = r.return;
              try {
                c.componentDidMount();
              } catch (D) {
                Bt(r, p, D);
              }
            }
            var y = r.return;
            try {
              Bd(r);
            } catch (D) {
              Bt(r, y, D);
            }
            break;
          case 5:
            var E = r.return;
            try {
              Bd(r);
            } catch (D) {
              Bt(r, E, D);
            }
        }
      } catch (D) {
        Bt(r, r.return, D);
      }
      if (r === n) {
        ve = null;
        break;
      }
      var k = r.sibling;
      if (k !== null) {
        k.return = r.return, ve = k;
        break;
      }
      ve = r.return;
    }
  }
  var Mc = Math.ceil, Xu = _e.ReactCurrentDispatcher, qd = _e.ReactCurrentOwner, Fn = _e.ReactCurrentBatchConfig, We = 0, Nt = null, Vt = null, yn = 0, Tr = 0, Ll = Ve(0), sn = 0, Zu = null, ia = 0, Uc = 0, Al = 0, Uo = null, qn = null, Qd = 0, Ml = 1 / 0, aa = null, Nc = !1, No = null, Li = null, qa = !1, Qa = null, zc = 0, Ul = 0, jc = null, zo = -1, jo = 0;
  function $n() {
    return We & 6 ? Ht() : zo !== -1 ? zo : zo = Ht();
  }
  function en(n) {
    return n.mode & 1 ? We & 2 && yn !== 0 ? yn & -yn : ic.transition !== null ? (jo === 0 && (jo = Us()), jo) : (n = mt, n !== 0 || (n = window.event, n = n === void 0 ? 16 : Qf(n.type)), n) : 1;
  }
  function Hn(n, r, o, c) {
    if (50 < Ul)
      throw Ul = 0, jc = null, Error(s(185));
    fo(n, o, c), (!(We & 2) || n !== Nt) && (n === Nt && (!(We & 2) && (Uc |= o), sn === 4 && Gr(n, yn)), Pn(n, c), o === 1 && We === 0 && !(r.mode & 1) && (Ml = Ht() + 500, pn && or()));
  }
  function Pn(n, r) {
    var o = n.callbackNode;
    Ms(n, r);
    var c = si(n, n === Nt ? yn : 0);
    if (c === 0)
      o !== null && vp(o), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = c & -c, n.callbackPriority !== r) {
      if (o != null && vp(o), r === 1)
        n.tag === 0 ? Sd(Dv.bind(null, n)) : gd(Dv.bind(null, n)), vd(function () {
          !(We & 6) && or();
        }), o = null;
      else {
        switch (If(c)) {
          case 1:
            o = Ii;
            break;
          case 4:
            o = Ge;
            break;
          case 16:
            o = Ra;
            break;
          case 536870912:
            o = Hf;
            break;
          default:
            o = Ra;
        }
        o = Zd(o, Nl.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = o;
    }
  }
  function Nl(n, r) {
    if (zo = -1, jo = 0, We & 6)
      throw Error(s(327));
    var o = n.callbackNode;
    if (jl() && n.callbackNode !== o)
      return null;
    var c = si(n, n === Nt ? yn : 0);
    if (c === 0)
      return null;
    if (c & 30 || c & n.expiredLanes || r)
      r = $c(n, c);
    else {
      r = c;
      var p = We;
      We |= 2;
      var y = Fc();
      (Nt !== n || yn !== r) && (aa = null, Ml = Ht() + 500, Fo(n, r));
      do
        try {
          rg();
          break;
        } catch (k) {
          Ov(n, k);
        }
      while (!0);
      xd(), Xu.current = y, We = p, Vt !== null ? r = 0 : (Nt = null, yn = 0, r = sn);
    }
    if (r !== 0) {
      if (r === 2 && (p = Vf(n), p !== 0 && (c = p, r = Gd(n, p))), r === 1)
        throw o = Zu, Fo(n, 0), Gr(n, c), Pn(n, Ht()), o;
      if (r === 6)
        Gr(n, c);
      else {
        if (p = n.current.alternate, !(c & 30) && !Wd(p) && (r = $c(n, c), r === 2 && (y = Vf(n), y !== 0 && (c = y, r = Gd(n, y))), r === 1))
          throw o = Zu, Fo(n, 0), Gr(n, c), Pn(n, Ht()), o;
        switch (n.finishedWork = p, n.finishedLanes = c, r) {
          case 0:
          case 1:
            throw Error(s(345));
          case 2:
            $o(n, qn, aa);
            break;
          case 3:
            if (Gr(n, c), (c & 130023424) === c && (r = Qd + 500 - Ht(), 10 < r)) {
              if (si(n, 0) !== 0)
                break;
              if (p = n.suspendedLanes, (p & c) !== c) {
                $n(), n.pingedLanes |= n.suspendedLanes & p;
                break;
              }
              n.timeoutHandle = So($o.bind(null, n, qn, aa), r);
              break;
            }
            $o(n, qn, aa);
            break;
          case 4:
            if (Gr(n, c), (c & 4194240) === c)
              break;
            for (r = n.eventTimes, p = -1; 0 < c;) {
              var E = 31 - Nr(c);
              y = 1 << E, E = r[E], E > p && (p = E), c &= ~y;
            }
            if (c = p, c = Ht() - c, c = (120 > c ? 120 : 480 > c ? 480 : 1080 > c ? 1080 : 1920 > c ? 1920 : 3e3 > c ? 3e3 : 4320 > c ? 4320 : 1960 * Mc(c / 1960)) - c, 10 < c) {
              n.timeoutHandle = So($o.bind(null, n, qn, aa), c);
              break;
            }
            $o(n, qn, aa);
            break;
          case 5:
            $o(n, qn, aa);
            break;
          default:
            throw Error(s(329));
        }
      }
    }
    return Pn(n, Ht()), n.callbackNode === o ? Nl.bind(null, n) : null;
  }
  function Gd(n, r) {
    var o = Uo;
    return n.current.memoizedState.isDehydrated && (Fo(n, r).flags |= 256), n = $c(n, r), n !== 2 && (r = qn, qn = o, r !== null && es(r)), n;
  }
  function es(n) {
    qn === null ? qn = n : qn.push.apply(qn, n);
  }
  function Wd(n) {
    for (var r = n; ;) {
      if (r.flags & 16384) {
        var o = r.updateQueue;
        if (o !== null && (o = o.stores, o !== null))
          for (var c = 0; c < o.length; c++) {
            var p = o[c], y = p.getSnapshot;
            p = p.value;
            try {
              if (!Fr(y(), p))
                return !1;
            } catch {
              return !1;
            }
          }
      }
      if (o = r.child, r.subtreeFlags & 16384 && o !== null)
        o.return = r, r = o;
      else {
        if (r === n)
          break;
        for (; r.sibling === null;) {
          if (r.return === null || r.return === n)
            return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function Gr(n, r) {
    for (r &= ~Al, r &= ~Uc, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r;) {
      var o = 31 - Nr(r), c = 1 << o;
      n[o] = -1, r &= ~c;
    }
  }
  function Dv(n) {
    if (We & 6)
      throw Error(s(327));
    jl();
    var r = si(n, 0);
    if (!(r & 1))
      return Pn(n, Ht()), null;
    var o = $c(n, r);
    if (n.tag !== 0 && o === 2) {
      var c = Vf(n);
      c !== 0 && (r = c, o = Gd(n, c));
    }
    if (o === 1)
      throw o = Zu, Fo(n, 0), Gr(n, r), Pn(n, Ht()), o;
    if (o === 6)
      throw Error(s(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, $o(n, qn, aa), Pn(n, Ht()), null;
  }
  function zl(n, r) {
    var o = We;
    We |= 1;
    try {
      return n(r);
    } finally {
      We = o, We === 0 && (Ml = Ht() + 500, pn && or());
    }
  }
  function Ga(n) {
    Qa !== null && Qa.tag === 0 && !(We & 6) && jl();
    var r = We;
    We |= 1;
    var o = Fn.transition, c = mt;
    try {
      if (Fn.transition = null, mt = 1, n)
        return n();
    } finally {
      mt = c, Fn.transition = o, We = r, !(We & 6) && or();
    }
  }
  function Kd() {
    Tr = Ll.current, st(Ll);
  }
  function Fo(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var o = n.timeoutHandle;
    if (o !== -1 && (n.timeoutHandle = -1, rv(o)), Vt !== null)
      for (o = Vt.return; o !== null;) {
        var c = o;
        switch (bd(c), c.tag) {
          case 1:
            c = c.type.childContextTypes, c != null && Pr();
            break;
          case 3:
            Va(), st(Pt), st(Ue), cc();
            break;
          case 5:
            Ye(c);
            break;
          case 4:
            Va();
            break;
          case 13:
            st(Oe);
            break;
          case 19:
            st(Oe);
            break;
          case 10:
            Fa(c.type._context);
            break;
          case 22:
          case 23:
            Kd();
        }
        o = o.return;
      }
    if (Nt = n, Vt = n = Wa(n.current, null), yn = Tr = r, sn = 0, Zu = null, Al = Uc = ia = 0, qn = Uo = null, bn !== null) {
      for (r = 0; r < bn.length; r++)
        if (o = bn[r], c = o.interleaved, c !== null) {
          o.interleaved = null;
          var p = c.next, y = o.pending;
          if (y !== null) {
            var E = y.next;
            y.next = p, c.next = E;
          }
          o.pending = c;
        }
      bn = null;
    }
    return n;
  }
  function Ov(n, r) {
    do {
      var o = Vt;
      try {
        if (xd(), fc.current = Rc, Le) {
          for (var c = Rt.memoizedState; c !== null;) {
            var p = c.queue;
            p !== null && (p.pending = null), c = c.next;
          }
          Le = !1;
        }
        if (Co = 0, et = q = Rt = null, ki = !1, xr = 0, qd.current = null, o === null || o.return === null) {
          sn = 1, Zu = r, Vt = null;
          break;
        }
        e: {
          var y = n, E = o.return, k = o, D = r;
          if (r = yn, k.flags |= 32768, D !== null && typeof D == "object" && typeof D.then == "function") {
            var V = D, W = k, K = W.tag;
            if (!(W.mode & 1) && (K === 0 || K === 11 || K === 15)) {
              var G = W.alternate;
              G ? (W.updateQueue = G.updateQueue, W.memoizedState = G.memoizedState, W.lanes = G.lanes) : (W.updateQueue = null, W.memoizedState = null);
            }
            var ce = Ud(E);
            if (ce !== null) {
              ce.flags &= -257, Nd(ce, E, k, y, r), ce.mode & 1 && gv(y, V, r), r = ce, D = V;
              var me = r.updateQueue;
              if (me === null) {
                var Se = /* @__PURE__ */ new Set();
                Se.add(D), r.updateQueue = Se;
              } else
                me.add(D);
              break e;
            } else {
              if (!(r & 1)) {
                gv(y, V, r), Jd();
                break e;
              }
              D = Error(s(426));
            }
          } else if (Tt && k.mode & 1) {
            var qt = Ud(E);
            if (qt !== null) {
              !(qt.flags & 65536) && (qt.flags |= 256), Nd(qt, E, k, y, r), _d(Cl(D, k));
              break e;
            }
          }
          y = D = Cl(D, k), sn !== 4 && (sn = 2), Uo === null ? Uo = [y] : Uo.push(y), y = E;
          do {
            switch (y.tag) {
              case 3:
                y.flags |= 65536, r &= -r, y.lanes |= r;
                var N = yv(y, D, r);
                kd(y, N);
                break e;
              case 1:
                k = D;
                var A = y.type, F = y.stateNode;
                if (!(y.flags & 128) && (typeof A.getDerivedStateFromError == "function" || F !== null && typeof F.componentDidCatch == "function" && (Li === null || !Li.has(F)))) {
                  y.flags |= 65536, r &= -r, y.lanes |= r;
                  var Z = Yu(y, k, r);
                  kd(y, Z);
                  break e;
                }
            }
            y = y.return;
          } while (y !== null);
        }
        Xd(o);
      } catch (be) {
        r = be, Vt === o && o !== null && (Vt = o = o.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Fc() {
    var n = Xu.current;
    return Xu.current = Rc, n === null ? Rc : n;
  }
  function Jd() {
    (sn === 0 || sn === 3 || sn === 2) && (sn = 4), Nt === null || !(ia & 268435455) && !(Uc & 268435455) || Gr(Nt, yn);
  }
  function $c(n, r) {
    var o = We;
    We |= 2;
    var c = Fc();
    (Nt !== n || yn !== r) && (aa = null, Fo(n, r));
    do
      try {
        ng();
        break;
      } catch (p) {
        Ov(n, p);
      }
    while (!0);
    if (xd(), We = o, Xu.current = c, Vt !== null)
      throw Error(s(261));
    return Nt = null, yn = 0, sn;
  }
  function ng() {
    for (; Vt !== null;)
      Lv(Vt);
  }
  function rg() {
    for (; Vt !== null && !Ty();)
      Lv(Vt);
  }
  function Lv(n) {
    var r = Mv(n.alternate, n, Tr);
    n.memoizedProps = n.pendingProps, r === null ? Xd(n) : Vt = r, qd.current = null;
  }
  function Xd(n) {
    var r = n;
    do {
      var o = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (o = Vd(o, r), o !== null) {
          o.flags &= 32767, Vt = o;
          return;
        }
        if (n !== null)
          n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          sn = 6, Vt = null;
          return;
        }
      } else if (o = tg(o, r, Tr), o !== null) {
        Vt = o;
        return;
      }
      if (r = r.sibling, r !== null) {
        Vt = r;
        return;
      }
      Vt = r = n;
    } while (r !== null);
    sn === 0 && (sn = 5);
  }
  function $o(n, r, o) {
    var c = mt, p = Fn.transition;
    try {
      Fn.transition = null, mt = 1, ig(n, r, o, c);
    } finally {
      Fn.transition = p, mt = c;
    }
    return null;
  }
  function ig(n, r, o, c) {
    do
      jl();
    while (Qa !== null);
    if (We & 6)
      throw Error(s(327));
    o = n.finishedWork;
    var p = n.finishedLanes;
    if (o === null)
      return null;
    if (n.finishedWork = null, n.finishedLanes = 0, o === n.current)
      throw Error(s(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var y = o.lanes | o.childLanes;
    if (Oy(n, y), n === Nt && (Vt = Nt = null, yn = 0), !(o.subtreeFlags & 2064) && !(o.flags & 2064) || qa || (qa = !0, Zd(Ra, function () {
      return jl(), null;
    })), y = (o.flags & 15990) !== 0, o.subtreeFlags & 15990 || y) {
      y = Fn.transition, Fn.transition = null;
      var E = mt;
      mt = 1;
      var k = We;
      We |= 4, qd.current = null, _v(n, o), xv(o, n), Qs(go), ho = !!hd, go = hd = null, n.current = o, Tv(o), Ry(), We = k, mt = E, Fn.transition = y;
    } else
      n.current = o;
    if (qa && (qa = !1, Qa = n, zc = p), y = n.pendingLanes, y === 0 && (Li = null), yp(o.stateNode), Pn(n, Ht()), r !== null)
      for (c = n.onRecoverableError, o = 0; o < r.length; o++)
        p = r[o], c(p.value, { componentStack: p.stack, digest: p.digest });
    if (Nc)
      throw Nc = !1, n = No, No = null, n;
    return zc & 1 && n.tag !== 0 && jl(), y = n.pendingLanes, y & 1 ? n === jc ? Ul++ : (Ul = 0, jc = n) : Ul = 0, or(), null;
  }
  function jl() {
    if (Qa !== null) {
      var n = If(zc), r = Fn.transition, o = mt;
      try {
        if (Fn.transition = null, mt = 16 > n ? 16 : n, Qa === null)
          var c = !1;
        else {
          if (n = Qa, Qa = null, zc = 0, We & 6)
            throw Error(s(331));
          var p = We;
          for (We |= 4, ve = n.current; ve !== null;) {
            var y = ve, E = y.child;
            if (ve.flags & 16) {
              var k = y.deletions;
              if (k !== null) {
                for (var D = 0; D < k.length; D++) {
                  var V = k[D];
                  for (ve = V; ve !== null;) {
                    var W = ve;
                    switch (W.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Ku(8, W, y);
                    }
                    var K = W.child;
                    if (K !== null)
                      K.return = W, ve = K;
                    else
                      for (; ve !== null;) {
                        W = ve;
                        var G = W.sibling, ce = W.return;
                        if (Id(W), W === V) {
                          ve = null;
                          break;
                        }
                        if (G !== null) {
                          G.return = ce, ve = G;
                          break;
                        }
                        ve = ce;
                      }
                  }
                }
                var me = y.alternate;
                if (me !== null) {
                  var Se = me.child;
                  if (Se !== null) {
                    me.child = null;
                    do {
                      var qt = Se.sibling;
                      Se.sibling = null, Se = qt;
                    } while (Se !== null);
                  }
                }
                ve = y;
              }
            }
            if (y.subtreeFlags & 2064 && E !== null)
              E.return = y, ve = E;
            else
              e:
              for (; ve !== null;) {
                if (y = ve, y.flags & 2048)
                  switch (y.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Ku(9, y, y.return);
                  }
                var N = y.sibling;
                if (N !== null) {
                  N.return = y.return, ve = N;
                  break e;
                }
                ve = y.return;
              }
          }
          var A = n.current;
          for (ve = A; ve !== null;) {
            E = ve;
            var F = E.child;
            if (E.subtreeFlags & 2064 && F !== null)
              F.return = E, ve = F;
            else
              e:
              for (E = A; ve !== null;) {
                if (k = ve, k.flags & 2048)
                  try {
                    switch (k.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Ju(9, k);
                    }
                  } catch (be) {
                    Bt(k, k.return, be);
                  }
                if (k === E) {
                  ve = null;
                  break e;
                }
                var Z = k.sibling;
                if (Z !== null) {
                  Z.return = k.return, ve = Z;
                  break e;
                }
                ve = k.return;
              }
          }
          if (We = p, or(), ui && typeof ui.onPostCommitFiberRoot == "function")
            try {
              ui.onPostCommitFiberRoot(pu, n);
            } catch {
            }
          c = !0;
        }
        return c;
      } finally {
        mt = o, Fn.transition = r;
      }
    }
    return !1;
  }
  function Av(n, r, o) {
    r = Cl(o, r), r = yv(n, r, 1), n = Ha(n, r, 1), r = $n(), n !== null && (fo(n, 1, r), Pn(n, r));
  }
  function Bt(n, r, o) {
    if (n.tag === 3)
      Av(n, n, o);
    else
      for (; r !== null;) {
        if (r.tag === 3) {
          Av(r, n, o);
          break;
        } else if (r.tag === 1) {
          var c = r.stateNode;
          if (typeof r.type.getDerivedStateFromError == "function" || typeof c.componentDidCatch == "function" && (Li === null || !Li.has(c))) {
            n = Cl(o, n), n = Yu(r, n, 1), r = Ha(r, n, 1), n = $n(), r !== null && (fo(r, 1, n), Pn(r, n));
            break;
          }
        }
        r = r.return;
      }
  }
  function ag(n, r, o) {
    var c = n.pingCache;
    c !== null && c.delete(r), r = $n(), n.pingedLanes |= n.suspendedLanes & o, Nt === n && (yn & o) === o && (sn === 4 || sn === 3 && (yn & 130023424) === yn && 500 > Ht() - Qd ? Fo(n, 0) : Al |= o), Pn(n, r);
  }
  function Hc(n, r) {
    r === 0 && (n.mode & 1 ? (r = al, al <<= 1, !(al & 130023424) && (al = 4194304)) : r = 1);
    var o = $n();
    n = Zi(n, r), n !== null && (fo(n, r, o), Pn(n, o));
  }
  function og(n) {
    var r = n.memoizedState, o = 0;
    r !== null && (o = r.retryLane), Hc(n, o);
  }
  function lg(n, r) {
    var o = 0;
    switch (n.tag) {
      case 13:
        var c = n.stateNode, p = n.memoizedState;
        p !== null && (o = p.retryLane);
        break;
      case 19:
        c = n.stateNode;
        break;
      default:
        throw Error(s(314));
    }
    c !== null && c.delete(r), Hc(n, o);
  }
  var Mv;
  Mv = function (n, r, o) {
    if (n !== null)
      if (n.memoizedProps !== r.pendingProps || Pt.current)
        Zt = !0;
      else {
        if (!(n.lanes & o) && !(r.flags & 128))
          return Zt = !1, na(n, r, o);
        Zt = !!(n.flags & 131072);
      }
    else
      Zt = !1, Tt && r.flags & 1048576 && wd(r, yl, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var c = r.type;
        zn(n, r), n = r.pendingProps;
        var p = Hr(r, Ue.current);
        ie(r, o), p = Ba(null, r, c, n, p, o);
        var y = Ro();
        return r.flags |= 1, typeof p == "object" && p !== null && typeof p.render == "function" && p.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, Ot(c) ? (y = !0, Zs(r)) : y = !1, r.memoizedState = p.state !== null && p.state !== void 0 ? p.state : null, Rd(r), p.updater = lc, r.stateNode = p, p._reactInternals = r, uc(r, c, n, o), r = Sv(null, r, c, !0, y, o)) : (r.tag = 0, Tt && y && ec(r), on(null, r, p, o), r = r.child), r;
      case 16:
        c = r.elementType;
        e: {
          switch (zn(n, r), n = r.pendingProps, p = c._init, c = p(c._payload), r.type = c, p = r.tag = sg(c), n = Cr(c, n), p) {
            case 0:
              r = xl(null, r, c, n, o);
              break e;
            case 1:
              r = zd(null, r, c, n, o);
              break e;
            case 11:
              r = Ya(null, r, c, n, o);
              break e;
            case 14:
              r = Dc(null, r, c, Cr(c.type, n), o);
              break e;
          }
          throw Error(s(
            306,
            c,
            ""
          ));
        }
        return r;
      case 0:
        return c = r.type, p = r.pendingProps, p = r.elementType === c ? p : Cr(c, p), xl(n, r, c, p, o);
      case 1:
        return c = r.type, p = r.pendingProps, p = r.elementType === c ? p : Cr(c, p), zd(n, r, c, p, o);
      case 3:
        e: {
          if (wv(r), n === null)
            throw Error(s(387));
          c = r.pendingProps, y = r.memoizedState, p = y.element, an(n, r), Pa(r, c, null, o);
          var E = r.memoizedState;
          if (c = E.element, y.isDehydrated)
            if (y = { element: c, isDehydrated: !1, cache: E.cache, pendingSuspenseBoundaries: E.pendingSuspenseBoundaries, transitions: E.transitions }, r.updateQueue.baseState = y, r.memoizedState = y, r.flags & 256) {
              p = Cl(Error(s(423)), r), r = Oc(n, r, c, o, p);
              break e;
            } else if (c !== p) {
              p = Cl(Error(s(424)), r), r = Oc(n, r, c, o, p);
              break e;
            } else
              for (sr = hi(r.stateNode.containerInfo.firstChild), _r = r, Tt = !0, Br = null, o = vv(r, null, c, o), r.child = o; o;)
                o.flags = o.flags & -3 | 4096, o = o.sibling;
          else {
            if (Mt(), c === p) {
              r = En(n, r, o);
              break e;
            }
            on(n, r, c, o);
          }
          r = r.child;
        }
        return r;
      case 5:
        return De(r), n === null && nc(r), c = r.type, p = r.pendingProps, y = n !== null ? n.memoizedProps : null, E = p.children, Mu(c, p) ? E = null : y !== null && Mu(c, y) && (r.flags |= 32), Be(n, r), on(n, r, E, o), r.child;
      case 6:
        return n === null && nc(r), null;
      case 13:
        return Fd(n, r, o);
      case 4:
        return Od(r, r.stateNode.containerInfo), c = r.pendingProps, n === null ? r.child = Sl(r, null, c, o) : on(n, r, c, o), r.child;
      case 11:
        return c = r.type, p = r.pendingProps, p = r.elementType === c ? p : Cr(c, p), Ya(n, r, c, p, o);
      case 7:
        return on(n, r, r.pendingProps, o), r.child;
      case 8:
        return on(n, r, r.pendingProps.children, o), r.child;
      case 12:
        return on(n, r, r.pendingProps.children, o), r.child;
      case 10:
        e: {
          if (c = r.type._context, p = r.pendingProps, y = r.memoizedProps, E = p.value, pt(Ri, c._currentValue), c._currentValue = E, y !== null)
            if (Fr(y.value, E)) {
              if (y.children === p.children && !Pt.current) {
                r = En(n, r, o);
                break e;
              }
            } else
              for (y = r.child, y !== null && (y.return = r); y !== null;) {
                var k = y.dependencies;
                if (k !== null) {
                  E = y.child;
                  for (var D = k.firstContext; D !== null;) {
                    if (D.context === c) {
                      if (y.tag === 1) {
                        D = ea(-1, o & -o), D.tag = 2;
                        var V = y.updateQueue;
                        if (V !== null) {
                          V = V.shared;
                          var W = V.pending;
                          W === null ? D.next = D : (D.next = W.next, W.next = D), V.pending = D;
                        }
                      }
                      y.lanes |= o, D = y.alternate, D !== null && (D.lanes |= o), vn(
                        y.return,
                        o,
                        r
                      ), k.lanes |= o;
                      break;
                    }
                    D = D.next;
                  }
                } else if (y.tag === 10)
                  E = y.type === r.type ? null : y.child;
                else if (y.tag === 18) {
                  if (E = y.return, E === null)
                    throw Error(s(341));
                  E.lanes |= o, k = E.alternate, k !== null && (k.lanes |= o), vn(E, o, r), E = y.sibling;
                } else
                  E = y.child;
                if (E !== null)
                  E.return = y;
                else
                  for (E = y; E !== null;) {
                    if (E === r) {
                      E = null;
                      break;
                    }
                    if (y = E.sibling, y !== null) {
                      y.return = E.return, E = y;
                      break;
                    }
                    E = E.return;
                  }
                y = E;
              }
          on(n, r, p.children, o), r = r.child;
        }
        return r;
      case 9:
        return p = r.type, c = r.pendingProps.children, ie(r, o), p = Yt(p), c = c(p), r.flags |= 1, on(n, r, c, o), r.child;
      case 14:
        return c = r.type, p = Cr(c, r.pendingProps), p = Cr(c.type, p), Dc(n, r, c, p, o);
      case 15:
        return dr(n, r, r.type, r.pendingProps, o);
      case 17:
        return c = r.type, p = r.pendingProps, p = r.elementType === c ? p : Cr(c, p), zn(n, r), r.tag = 1, Ot(c) ? (n = !0, Zs(r)) : n = !1, ie(r, o), fv(r, c, p), uc(r, c, p, o), Sv(null, r, c, !0, n, o);
      case 19:
        return Pd(n, r, o);
      case 22:
        return Lo(n, r, o);
    }
    throw Error(s(156, r.tag));
  };
  function Zd(n, r) {
    return $f(n, r);
  }
  function ug(n, r, o, c) {
    this.tag = n, this.key = o, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = c, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Wr(n, r, o, c) {
    return new ug(n, r, o, c);
  }
  function eh(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function sg(n) {
    if (typeof n == "function")
      return eh(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === Gt)
        return 11;
      if (n === Ct)
        return 14;
    }
    return 2;
  }
  function Wa(n, r) {
    var o = n.alternate;
    return o === null ? (o = Wr(n.tag, r, n.key, n.mode), o.elementType = n.elementType, o.type = n.type, o.stateNode = n.stateNode, o.alternate = n, n.alternate = o) : (o.pendingProps = r, o.type = n.type, o.flags = 0, o.subtreeFlags = 0, o.deletions = null), o.flags = n.flags & 14680064, o.childLanes = n.childLanes, o.lanes = n.lanes, o.child = n.child, o.memoizedProps = n.memoizedProps, o.memoizedState = n.memoizedState, o.updateQueue = n.updateQueue, r = n.dependencies, o.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, o.sibling = n.sibling, o.index = n.index, o.ref = n.ref, o;
  }
  function Pc(n, r, o, c, p, y) {
    var E = 2;
    if (c = n, typeof n == "function")
      eh(n) && (E = 1);
    else if (typeof n == "string")
      E = 5;
    else
      e:
      switch (n) {
        case Ae:
          return Ho(o.children, p, y, r);
        case Pe:
          E = 8, p |= 8;
          break;
        case dt:
          return n = Wr(12, o, r, p | 2), n.elementType = dt, n.lanes = y, n;
        case qe:
          return n = Wr(13, o, r, p), n.elementType = qe, n.lanes = y, n;
        case ze:
          return n = Wr(19, o, r, p), n.elementType = ze, n.lanes = y, n;
        case fn:
          return ts(o, p, y, r);
        default:
          if (typeof n == "object" && n !== null)
            switch (n.$$typeof) {
              case at:
                E = 10;
                break e;
              case ht:
                E = 9;
                break e;
              case Gt:
                E = 11;
                break e;
              case Ct:
                E = 14;
                break e;
              case Xe:
                E = 16, c = null;
                break e;
            }
          throw Error(s(130, n == null ? n : typeof n, ""));
      }
    return r = Wr(E, o, r, p), r.elementType = n, r.type = c, r.lanes = y, r;
  }
  function Ho(n, r, o, c) {
    return n = Wr(7, n, c, r), n.lanes = o, n;
  }
  function ts(n, r, o, c) {
    return n = Wr(22, n, c, r), n.elementType = fn, n.lanes = o, n.stateNode = { isHidden: !1 }, n;
  }
  function ns(n, r, o) {
    return n = Wr(6, n, null, r), n.lanes = o, n;
  }
  function Po(n, r, o) {
    return r = Wr(4, n.children !== null ? n.children : [], n.key, r), r.lanes = o, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function cg(n, r, o, c, p) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Bf(0), this.expirationTimes = Bf(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Bf(0), this.identifierPrefix = c, this.onRecoverableError = p, this.mutableSourceEagerHydrationData = null;
  }
  function Vc(n, r, o, c, p, y, E, k, D) {
    return n = new cg(n, r, o, k, D), r === 1 ? (r = 1, y === !0 && (r |= 8)) : r = 0, y = Wr(3, null, null, r), n.current = y, y.stateNode = n, y.memoizedState = { element: c, isDehydrated: o, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Rd(y), n;
  }
  function Uv(n, r, o) {
    var c = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ft, key: c == null ? null : "" + c, children: n, containerInfo: r, implementation: o };
  }
  function th(n) {
    if (!n)
      return Ti;
    n = n._reactInternals;
    e: {
      if (Ci(n) !== n || n.tag !== 1)
        throw Error(s(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (Ot(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(s(171));
    }
    if (n.tag === 1) {
      var o = n.type;
      if (Ot(o))
        return zu(n, o, r);
    }
    return r;
  }
  function Nv(n, r, o, c, p, y, E, k, D) {
    return n = Vc(o, c, !0, n, p, y, E, k, D), n.context = th(null), o = n.current, c = $n(), p = en(o), y = ea(c, p), y.callback = r ?? null, Ha(o, y, p), n.current.lanes = p, fo(n, p, c), Pn(n, c), n;
  }
  function rs(n, r, o, c) {
    var p = r.current, y = $n(), E = en(p);
    return o = th(o), r.context === null ? r.context = o : r.pendingContext = o, r = ea(y, E), r.payload = { element: n }, c = c === void 0 ? null : c, c !== null && (r.callback = c), n = Ha(p, r, E), n !== null && (Hn(n, p, E, y), oc(n, p, E)), E;
  }
  function Bc(n) {
    if (n = n.current, !n.child)
      return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function zv(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var o = n.retryLane;
      n.retryLane = o !== 0 && o < r ? o : r;
    }
  }
  function nh(n, r) {
    zv(n, r), (n = n.alternate) && zv(n, r);
  }
  function jv() {
    return null;
  }
  var rh = typeof reportError == "function" ? reportError : function (n) {
    console.error(n);
  };
  function Ic(n) {
    this._internalRoot = n;
  }
  oa.prototype.render = Ic.prototype.render = function (n) {
    var r = this._internalRoot;
    if (r === null)
      throw Error(s(409));
    rs(n, r, null, null);
  }, oa.prototype.unmount = Ic.prototype.unmount = function () {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Ga(function () {
        rs(null, n, null, null);
      }), r[Ji] = null;
    }
  };
  function oa(n) {
    this._internalRoot = n;
  }
  oa.prototype.unstable_scheduleHydration = function (n) {
    if (n) {
      var r = bp();
      n = { blockedOn: null, target: n, priority: r };
      for (var o = 0; o < yt.length && r !== 0 && r < yt[o].priority; o++)
        ;
      yt.splice(o, 0, n), o === 0 && Ep(n);
    }
  };
  function ih(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function Yc(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function Fv() {
  }
  function fg(n, r, o, c, p) {
    if (p) {
      if (typeof c == "function") {
        var y = c;
        c = function () {
          var V = Bc(E);
          y.call(V);
        };
      }
      var E = Nv(r, c, n, 0, null, !1, !1, "", Fv);
      return n._reactRootContainer = E, n[Ji] = E.current, vl(n.nodeType === 8 ? n.parentNode : n), Ga(), E;
    }
    for (; p = n.lastChild;)
      n.removeChild(p);
    if (typeof c == "function") {
      var k = c;
      c = function () {
        var V = Bc(D);
        k.call(V);
      };
    }
    var D = Vc(n, 0, !1, null, null, !1, !1, "", Fv);
    return n._reactRootContainer = D, n[Ji] = D.current, vl(n.nodeType === 8 ? n.parentNode : n), Ga(function () {
      rs(r, D, o, c);
    }), D;
  }
  function qc(n, r, o, c, p) {
    var y = o._reactRootContainer;
    if (y) {
      var E = y;
      if (typeof p == "function") {
        var k = p;
        p = function () {
          var D = Bc(E);
          k.call(D);
        };
      }
      rs(r, E, n, p);
    } else
      E = fg(o, r, n, p, c);
    return Bc(E);
  }
  wp = function (n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var o = co(r.pendingLanes);
          o !== 0 && (vu(r, o | 1), Pn(r, Ht()), !(We & 6) && (Ml = Ht() + 500, or()));
        }
        break;
      case 13:
        Ga(function () {
          var c = Zi(n, 1);
          if (c !== null) {
            var p = $n();
            Hn(c, n, 1, p);
          }
        }), nh(n, 1);
    }
  }, Ns = function (n) {
    if (n.tag === 13) {
      var r = Zi(n, 134217728);
      if (r !== null) {
        var o = $n();
        Hn(r, n, 134217728, o);
      }
      nh(n, 134217728);
    }
  }, bt = function (n) {
    if (n.tag === 13) {
      var r = en(n), o = Zi(n, r);
      if (o !== null) {
        var c = $n();
        Hn(o, n, r, c);
      }
      nh(n, r);
    }
  }, bp = function () {
    return mt;
  }, Yf = function (n, r) {
    var o = mt;
    try {
      return mt = n, r();
    } finally {
      mt = o;
    }
  }, _i = function (n, r, o) {
    switch (r) {
      case "input":
        if (Sr(n, o), r = o.name, o.type === "radio" && r != null) {
          for (o = n; o.parentNode;)
            o = o.parentNode;
          for (o = o.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < o.length; r++) {
            var c = o[r];
            if (c !== n && c.form === n.form) {
              var p = Te(c);
              if (!p)
                throw Error(s(90));
              Pi(c), Sr(c, p);
            }
          }
        }
        break;
      case "textarea":
        Ca(n, o);
        break;
      case "select":
        r = o.value, r != null && _a(n, !!o.multiple, r, !1);
    }
  }, fp = zl, dp = Ga;
  var dg = { usingClientEntryPoint: !1, Events: [Nu, ml, Te, ks, Ds, zl] }, Fl = { findFiberByHostInstance: $r, bundleType: 0, version: "18.2.0", rendererPackageName: "react-dom" }, hg = {
    bundleType: Fl.bundleType, version: Fl.version, rendererPackageName: Fl.rendererPackageName, rendererConfig: Fl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: _e.ReactCurrentDispatcher, findHostInstanceByFiber: function (n) {
      return n = hp(n), n === null ? null : n.stateNode;
    }, findFiberByHostInstance: Fl.findFiberByHostInstance || jv, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.2.0-next-9e3b772b8-20220608"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Qc = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Qc.isDisabled && Qc.supportsFiber)
      try {
        pu = Qc.inject(hg), ui = Qc;
      } catch {
      }
  }
  return ti.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = dg, ti.createPortal = function (n, r) {
    var o = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ih(r))
      throw Error(s(200));
    return Uv(n, r, null, o);
  }, ti.createRoot = function (n, r) {
    if (!ih(n))
      throw Error(s(299));
    var o = !1, c = "", p = rh;
    return r != null && (r.unstable_strictMode === !0 && (o = !0), r.identifierPrefix !== void 0 && (c = r.identifierPrefix), r.onRecoverableError !== void 0 && (p = r.onRecoverableError)), r = Vc(n, 1, !1, null, null, o, !1, c, p), n[Ji] = r.current, vl(n.nodeType === 8 ? n.parentNode : n), new Ic(r);
  }, ti.findDOMNode = function (n) {
    if (n == null)
      return null;
    if (n.nodeType === 1)
      return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(s(188)) : (n = Object.keys(n).join(","), Error(s(268, n)));
    return n = hp(r), n = n === null ? null : n.stateNode, n;
  }, ti.flushSync = function (n) {
    return Ga(n);
  }, ti.hydrate = function (n, r, o) {
    if (!Yc(r))
      throw Error(s(200));
    return qc(null, n, r, !0, o);
  }, ti.hydrateRoot = function (n, r, o) {
    if (!ih(n))
      throw Error(s(405));
    var c = o != null && o.hydratedSources || null, p = !1, y = "", E = rh;
    if (o != null && (o.unstable_strictMode === !0 && (p = !0), o.identifierPrefix !== void 0 && (y = o.identifierPrefix), o.onRecoverableError !== void 0 && (E = o.onRecoverableError)), r = Nv(r, null, n, 1, o ?? null, p, !1, y, E), n[Ji] = r.current, vl(n), c)
      for (n = 0; n < c.length; n++)
        o = c[n], p = o._getVersion, p = p(o._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [o, p] : r.mutableSourceEagerHydrationData.push(
          o,
          p
        );
    return new oa(r);
  }, ti.render = function (n, r, o) {
    if (!Yc(r))
      throw Error(s(200));
    return qc(null, n, r, !1, o);
  }, ti.unmountComponentAtNode = function (n) {
    if (!Yc(n))
      throw Error(s(40));
    return n._reactRootContainer ? (Ga(function () {
      qc(null, null, n, !1, function () {
        n._reactRootContainer = null, n[Ji] = null;
      });
    }), !0) : !1;
  }, ti.unstable_batchedUpdates = zl, ti.unstable_renderSubtreeIntoContainer = function (n, r, o, c) {
    if (!Yc(o))
      throw Error(s(200));
    if (n == null || n._reactInternals === void 0)
      throw Error(s(38));
    return qc(n, r, o, !1, c);
  }, ti.version = "18.2.0-next-9e3b772b8-20220608", ti;
}
var ni = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var V_;
function rA() {
  return V_ || (V_ = 1, process.env.NODE_ENV !== "production" && function () {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var d = tC, u = hC(), s = d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, h = !1;
    function g(e) {
      h = e;
    }
    function w(e) {
      if (!h) {
        for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++)
          i[a - 1] = arguments[a];
        _("warn", e, i);
      }
    }
    function m(e) {
      if (!h) {
        for (var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++)
          i[a - 1] = arguments[a];
        _("error", e, i);
      }
    }
    function _(e, t, i) {
      {
        var a = s.ReactDebugCurrentFrame, l = a.getStackAddendum();
        l !== "" && (t += "%s", i = i.concat([l]));
        var f = i.map(function (v) {
          return String(v);
        });
        f.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, f);
      }
    }
    var C = 0, R = 1, O = 2, U = 3, $ = 4, B = 5, X = 6, ee = 7, re = 8, Je = 9, Ce = 10, pe = 11, _e = 12, $e = 13, ft = 14, Ae = 15, Pe = 16, dt = 17, at = 18, ht = 19, Gt = 21, qe = 22, ze = 23, Ct = 24, Xe = 25, fn = !0, te = !1, we = !1, le = !1, Ie = !1, Ze = !0, Wt = !1, Bn = !1, ba = !0, In = !0, Ea = !0, ri = /* @__PURE__ */ new Set(), bi = {}, su = {};
    function Ar(e, t) {
      Pi(e, t), Pi(e + "Capture", t);
    }
    function Pi(e, t) {
      bi[e] && m("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), bi[e] = t;
      {
        var i = e.toLowerCase();
        su[i] = e, e === "onDoubleClick" && (su.ondblclick = e);
      }
      for (var a = 0; a < t.length; a++)
        ri.add(t[a]);
    }
    var An = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", nr = Object.prototype.hasOwnProperty;
    function Mr(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, i = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return i;
      }
    }
    function ii(e) {
      try {
        return Sr(e), !1;
      } catch {
        return !0;
      }
    }
    function Sr(e) {
      return "" + e;
    }
    function Vi(e, t) {
      if (ii(e))
        return m("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Mr(e)), Sr(e);
    }
    function el(e) {
      if (ii(e))
        return m("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Mr(e)), Sr(e);
    }
    function lo(e, t) {
      if (ii(e))
        return m("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Mr(e)), Sr(e);
    }
    function _a(e, t) {
      if (ii(e))
        return m("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Mr(e)), Sr(e);
    }
    function uo(e) {
      if (ii(e))
        return m("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", Mr(e)), Sr(e);
    }
    function ai(e) {
      if (ii(e))
        return m("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", Mr(e)), Sr(e);
    }
    var Ca = 0, Ei = 1, xa = 2, rr = 3, oi = 4, cu = 5, Ta = 6, ue = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", ke = ue + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", Qe = new RegExp("^[" + ue + "][" + ke + "]*$"), wt = {}, It = {};
    function Mn(e) {
      return nr.call(It, e) ? !0 : nr.call(wt, e) ? !1 : Qe.test(e) ? (It[e] = !0, !0) : (wt[e] = !0, m("Invalid attribute name: `%s`", e), !1);
    }
    function nn(e, t, i) {
      return t !== null ? t.type === Ca : i ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function Ur(e, t, i, a) {
      if (i !== null && i.type === Ca)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (a)
            return !1;
          if (i !== null)
            return !i.acceptsBooleans;
          var l = e.toLowerCase().slice(0, 5);
          return l !== "data-" && l !== "aria-";
        }
        default:
          return !1;
      }
    }
    function Ft(e, t, i, a) {
      if (t === null || typeof t > "u" || Ur(e, t, i, a))
        return !0;
      if (a)
        return !1;
      if (i !== null)
        switch (i.type) {
          case rr:
            return !t;
          case oi:
            return t === !1;
          case cu:
            return isNaN(t);
          case Ta:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function _i(e) {
      return $t.hasOwnProperty(e) ? $t[e] : null;
    }
    function Kt(e, t, i, a, l, f, v) {
      this.acceptsBooleans = t === xa || t === rr || t === oi, this.attributeName = a, this.attributeNamespace = l, this.mustUseProperty = i, this.propertyName = e, this.type = t, this.sanitizeURL = f, this.removeEmptyString = v;
    }
    var $t = {}, cp = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    cp.forEach(function (e) {
      $t[e] = new Kt(
        e,
        Ca,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function (e) {
      var t = e[0], i = e[1];
      $t[t] = new Kt(
        t,
        Ei,
        !1,
        // mustUseProperty
        i,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
      $t[e] = new Kt(
        e,
        xa,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (e) {
      $t[e] = new Kt(
        e,
        xa,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function (e) {
      $t[e] = new Kt(
        e,
        rr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function (e) {
      $t[e] = new Kt(
        e,
        rr,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function (e) {
      $t[e] = new Kt(
        e,
        oi,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function (e) {
      $t[e] = new Kt(
        e,
        Ta,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function (e) {
      $t[e] = new Kt(
        e,
        cu,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var ks = /[\-\:]([a-z])/g, Ds = function (e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function (e) {
      var t = e.replace(ks, Ds);
      $t[t] = new Kt(
        t,
        Ei,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function (e) {
      var t = e.replace(ks, Ds);
      $t[t] = new Kt(
        t,
        Ei,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function (e) {
      var t = e.replace(ks, Ds);
      $t[t] = new Kt(
        t,
        Ei,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function (e) {
      $t[e] = new Kt(
        e,
        Ei,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var fp = "xlinkHref";
    $t[fp] = new Kt(
      "xlinkHref",
      Ei,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function (e) {
      $t[e] = new Kt(
        e,
        Ei,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var dp = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, Os = !1;
    function zf(e) {
      !Os && dp.test(e) && (Os = !0, m("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function fu(e, t, i, a) {
      if (a.mustUseProperty) {
        var l = a.propertyName;
        return e[l];
      } else {
        Vi(i, t), a.sanitizeURL && zf("" + i);
        var f = a.attributeName, v = null;
        if (a.type === oi) {
          if (e.hasAttribute(f)) {
            var S = e.getAttribute(f);
            return S === "" ? !0 : Ft(t, i, a, !1) ? S : S === "" + i ? i : S;
          }
        } else if (e.hasAttribute(f)) {
          if (Ft(t, i, a, !1))
            return e.getAttribute(f);
          if (a.type === rr)
            return i;
          v = e.getAttribute(f);
        }
        return Ft(t, i, a, !1) ? v === null ? i : v : v === "" + i ? i : v;
      }
    }
    function Ls(e, t, i, a) {
      {
        if (!Mn(t))
          return;
        if (!e.hasAttribute(t))
          return i === void 0 ? void 0 : null;
        var l = e.getAttribute(t);
        return Vi(i, t), l === "" + i ? i : l;
      }
    }
    function so(e, t, i, a) {
      var l = _i(t);
      if (!nn(t, l, a)) {
        if (Ft(t, i, l, a) && (i = null), a || l === null) {
          if (Mn(t)) {
            var f = t;
            i === null ? e.removeAttribute(f) : (Vi(i, t), e.setAttribute(f, "" + i));
          }
          return;
        }
        var v = l.mustUseProperty;
        if (v) {
          var S = l.propertyName;
          if (i === null) {
            var b = l.type;
            e[S] = b === rr ? !1 : "";
          } else
            e[S] = i;
          return;
        }
        var x = l.attributeName, T = l.attributeNamespace;
        if (i === null)
          e.removeAttribute(x);
        else {
          var M = l.type, L;
          M === rr || M === oi && i === !0 ? L = "" : (Vi(i, x), L = "" + i, l.sanitizeURL && zf(L.toString())), T ? e.setAttributeNS(T, x, L) : e.setAttribute(x, L);
        }
      }
    }
    var tl = Symbol.for("react.element"), li = Symbol.for("react.portal"), Bi = Symbol.for("react.fragment"), nl = Symbol.for("react.strict_mode"), du = Symbol.for("react.profiler"), jf = Symbol.for("react.provider"), Ff = Symbol.for("react.context"), rl = Symbol.for("react.forward_ref"), Ci = Symbol.for("react.suspense"), hu = Symbol.for("react.suspense_list"), il = Symbol.for("react.memo"), Yn = Symbol.for("react.lazy"), hp = Symbol.for("react.scope"), pp = Symbol.for("react.debug_trace_mode"), $f = Symbol.for("react.offscreen"), vp = Symbol.for("react.legacy_hidden"), Ty = Symbol.for("react.cache"), Ry = Symbol.for("react.tracing_marker"), Ht = Symbol.iterator, ky = "@@iterator";
    function Ii(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ht && e[Ht] || e[ky];
      return typeof t == "function" ? t : null;
    }
    var Ge = Object.assign, Ra = 0, mp, Hf, pu, ui, yp, Nr, gp;
    function Sp() {
    }
    Sp.__reactDisabledLog = !0;
    function Dy() {
      {
        if (Ra === 0) {
          mp = console.log, Hf = console.info, pu = console.warn, ui = console.error, yp = console.group, Nr = console.groupCollapsed, gp = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Sp,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        Ra++;
      }
    }
    function As() {
      {
        if (Ra--, Ra === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Ge({}, e, {
              value: mp
            }),
            info: Ge({}, e, {
              value: Hf
            }),
            warn: Ge({}, e, {
              value: pu
            }),
            error: Ge({}, e, {
              value: ui
            }),
            group: Ge({}, e, {
              value: yp
            }),
            groupCollapsed: Ge({}, e, {
              value: Nr
            }),
            groupEnd: Ge({}, e, {
              value: gp
            })
          });
        }
        Ra < 0 && m("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var al = s.ReactCurrentDispatcher, co;
    function si(e, t, i) {
      {
        if (co === void 0)
          try {
            throw Error();
          } catch (l) {
            var a = l.stack.trim().match(/\n( *(at )?)/);
            co = a && a[1] || "";
          }
        return `
` + co + e;
      }
    }
    var Pf = !1, Ms;
    {
      var Vf = typeof WeakMap == "function" ? WeakMap : Map;
      Ms = new Vf();
    }
    function Us(e, t) {
      if (!e || Pf)
        return "";
      {
        var i = Ms.get(e);
        if (i !== void 0)
          return i;
      }
      var a;
      Pf = !0;
      var l = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var f;
      f = al.current, al.current = null, Dy();
      try {
        if (t) {
          var v = function () {
            throw Error();
          };
          if (Object.defineProperty(v.prototype, "props", {
            set: function () {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(v, []);
            } catch (P) {
              a = P;
            }
            Reflect.construct(e, [], v);
          } else {
            try {
              v.call();
            } catch (P) {
              a = P;
            }
            e.call(v.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (P) {
            a = P;
          }
          e();
        }
      } catch (P) {
        if (P && a && typeof P.stack == "string") {
          for (var S = P.stack.split(`
`), b = a.stack.split(`
`), x = S.length - 1, T = b.length - 1; x >= 1 && T >= 0 && S[x] !== b[T];)
            T--;
          for (; x >= 1 && T >= 0; x--, T--)
            if (S[x] !== b[T]) {
              if (x !== 1 || T !== 1)
                do
                  if (x--, T--, T < 0 || S[x] !== b[T]) {
                    var M = `
` + S[x].replace(" at new ", " at ");
                    return e.displayName && M.includes("<anonymous>") && (M = M.replace("<anonymous>", e.displayName)), typeof e == "function" && Ms.set(e, M), M;
                  }
                while (x >= 1 && T >= 0);
              break;
            }
        }
      } finally {
        Pf = !1, al.current = f, As(), Error.prepareStackTrace = l;
      }
      var L = e ? e.displayName || e.name : "", H = L ? si(L) : "";
      return typeof e == "function" && Ms.set(e, H), H;
    }
    function Bf(e, t, i) {
      return Us(e, !0);
    }
    function fo(e, t, i) {
      return Us(e, !1);
    }
    function Oy(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function vu(e, t, i) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return Us(e, Oy(e));
      if (typeof e == "string")
        return si(e);
      switch (e) {
        case Ci:
          return si("Suspense");
        case hu:
          return si("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case rl:
            return fo(e.render);
          case il:
            return vu(e.type, t, i);
          case Yn: {
            var a = e, l = a._payload, f = a._init;
            try {
              return vu(f(l), t, i);
            } catch {
            }
          }
        }
      return "";
    }
    function mt(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case B:
          return si(e.type);
        case Pe:
          return si("Lazy");
        case $e:
          return si("Suspense");
        case ht:
          return si("SuspenseList");
        case C:
        case O:
        case Ae:
          return fo(e.type);
        case pe:
          return fo(e.type.render);
        case R:
          return Bf(e.type);
        default:
          return "";
      }
    }
    function If(e) {
      try {
        var t = "", i = e;
        do
          t += mt(i), i = i.return;
        while (i);
        return t;
      } catch (a) {
        return `
Error generating stack: ` + a.message + `
` + a.stack;
      }
    }
    function wp(e, t, i) {
      var a = e.displayName;
      if (a)
        return a;
      var l = t.displayName || t.name || "";
      return l !== "" ? i + "(" + l + ")" : i;
    }
    function Ns(e) {
      return e.displayName || "Context";
    }
    function bt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && m("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case Bi:
          return "Fragment";
        case li:
          return "Portal";
        case du:
          return "Profiler";
        case nl:
          return "StrictMode";
        case Ci:
          return "Suspense";
        case hu:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case Ff:
            var t = e;
            return Ns(t) + ".Consumer";
          case jf:
            var i = e;
            return Ns(i._context) + ".Provider";
          case rl:
            return wp(e, e.render, "ForwardRef");
          case il:
            var a = e.displayName || null;
            return a !== null ? a : bt(e.type) || "Memo";
          case Yn: {
            var l = e, f = l._payload, v = l._init;
            try {
              return bt(v(f));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function bp(e, t, i) {
      var a = t.displayName || t.name || "";
      return e.displayName || (a !== "" ? i + "(" + a + ")" : i);
    }
    function Yf(e) {
      return e.displayName || "Context";
    }
    function He(e) {
      var t = e.tag, i = e.type;
      switch (t) {
        case Ct:
          return "Cache";
        case Je:
          var a = i;
          return Yf(a) + ".Consumer";
        case Ce:
          var l = i;
          return Yf(l._context) + ".Provider";
        case at:
          return "DehydratedFragment";
        case pe:
          return bp(i, i.render, "ForwardRef");
        case ee:
          return "Fragment";
        case B:
          return i;
        case $:
          return "Portal";
        case U:
          return "Root";
        case X:
          return "Text";
        case Pe:
          return bt(i);
        case re:
          return i === nl ? "StrictMode" : "Mode";
        case qe:
          return "Offscreen";
        case _e:
          return "Profiler";
        case Gt:
          return "Scope";
        case $e:
          return "Suspense";
        case ht:
          return "SuspenseList";
        case Xe:
          return "TracingMarker";
        case R:
        case C:
        case dt:
        case O:
        case ft:
        case Ae:
          if (typeof i == "function")
            return i.displayName || i.name || null;
          if (typeof i == "string")
            return i;
          break;
      }
      return null;
    }
    var mu = s.ReactDebugCurrentFrame, Jt = null, zr = !1;
    function jr() {
      {
        if (Jt === null)
          return null;
        var e = Jt._debugOwner;
        if (e !== null && typeof e < "u")
          return He(e);
      }
      return null;
    }
    function yu() {
      return Jt === null ? "" : If(Jt);
    }
    function rn() {
      mu.getCurrentStack = null, Jt = null, zr = !1;
    }
    function yt(e) {
      mu.getCurrentStack = e === null ? null : yu, Jt = e, zr = !1;
    }
    function Ly() {
      return Jt;
    }
    function ci(e) {
      zr = e;
    }
    function Un(e) {
      return "" + e;
    }
    function ka(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return ai(e), e;
        default:
          return "";
      }
    }
    var Ep = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function ol(e, t) {
      Ep[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || m("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || m("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function qf(e) {
      var t = e.type, i = e.nodeName;
      return i && i.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function _p(e) {
      return e._valueTracker;
    }
    function gu(e) {
      e._valueTracker = null;
    }
    function Su(e) {
      var t = "";
      return e && (qf(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function ll(e) {
      var t = qf(e) ? "checked" : "value", i = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      ai(e[t]);
      var a = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof i > "u" || typeof i.get != "function" || typeof i.set != "function")) {
        var l = i.get, f = i.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return l.call(this);
          },
          set: function (S) {
            ai(S), a = "" + S, f.call(this, S);
          }
        }), Object.defineProperty(e, t, {
          enumerable: i.enumerable
        });
        var v = {
          getValue: function () {
            return a;
          },
          setValue: function (S) {
            ai(S), a = "" + S;
          },
          stopTracking: function () {
            gu(e), delete e[t];
          }
        };
        return v;
      }
    }
    function ho(e) {
      _p(e) || (e._valueTracker = ll(e));
    }
    function Cp(e) {
      if (!e)
        return !1;
      var t = _p(e);
      if (!t)
        return !0;
      var i = t.getValue(), a = Su(e);
      return a !== i ? (t.setValue(a), !0) : !1;
    }
    function zs(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var js = !1, wu = !1, Fs = !1, Qf = !1;
    function Yi(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function bu(e, t) {
      var i = e, a = t.checked, l = Ge({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: a ?? i._wrapperState.initialChecked
      });
      return l;
    }
    function Eu(e, t) {
      ol("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !wu && (m("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", jr() || "A component", t.type), wu = !0), t.value !== void 0 && t.defaultValue !== void 0 && !js && (m("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", jr() || "A component", t.type), js = !0);
      var i = e, a = t.defaultValue == null ? "" : t.defaultValue;
      i._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: ka(t.value != null ? t.value : a),
        controlled: Yi(t)
      };
    }
    function Gf(e, t) {
      var i = e, a = t.checked;
      a != null && so(i, "checked", a, !1);
    }
    function ul(e, t) {
      var i = e;
      {
        var a = Yi(t);
        !i._wrapperState.controlled && a && !Qf && (m("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Qf = !0), i._wrapperState.controlled && !a && !Fs && (m("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Fs = !0);
      }
      Gf(e, t);
      var l = ka(t.value), f = t.type;
      if (l != null)
        f === "number" ? (l === 0 && i.value === "" || // We explicitly want to coerce to number here if possible.
          // eslint-disable-next-line
          i.value != l) && (i.value = Un(l)) : i.value !== Un(l) && (i.value = Un(l));
      else if (f === "submit" || f === "reset") {
        i.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Da(i, t.type, l) : t.hasOwnProperty("defaultValue") && Da(i, t.type, ka(t.defaultValue)), t.checked == null && t.defaultChecked != null && (i.defaultChecked = !!t.defaultChecked);
    }
    function _u(e, t, i) {
      var a = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var l = t.type, f = l === "submit" || l === "reset";
        if (f && (t.value === void 0 || t.value === null))
          return;
        var v = Un(a._wrapperState.initialValue);
        i || v !== a.value && (a.value = v), a.defaultValue = v;
      }
      var S = a.name;
      S !== "" && (a.name = ""), a.defaultChecked = !a.defaultChecked, a.defaultChecked = !!a._wrapperState.initialChecked, S !== "" && (a.name = S);
    }
    function xp(e, t) {
      var i = e;
      ul(i, t), wr(i, t);
    }
    function wr(e, t) {
      var i = t.name;
      if (t.type === "radio" && i != null) {
        for (var a = e; a.parentNode;)
          a = a.parentNode;
        Vi(i, "name");
        for (var l = a.querySelectorAll("input[name=" + JSON.stringify("" + i) + '][type="radio"]'), f = 0; f < l.length; f++) {
          var v = l[f];
          if (!(v === e || v.form !== e.form)) {
            var S = tm(v);
            if (!S)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            Cp(v), ul(v, S);
          }
        }
      }
    }
    function Da(e, t, i) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || zs(e.ownerDocument) !== e) && (i == null ? e.defaultValue = Un(e._wrapperState.initialValue) : e.defaultValue !== Un(i) && (e.defaultValue = Un(i)));
    }
    var $s = !1, sl = !1, Tp = !1;
    function Hs(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? d.Children.forEach(t.children, function (i) {
        i != null && (typeof i == "string" || typeof i == "number" || sl || (sl = !0, m("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Tp || (Tp = !0, m("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !$s && (m("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), $s = !0);
    }
    function Wf(e, t) {
      t.value != null && e.setAttribute("value", Un(ka(t.value)));
    }
    var Cu = Array.isArray;
    function dn(e) {
      return Cu(e);
    }
    var Ps;
    Ps = !1;
    function Rp() {
      var e = jr();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var kp = ["value", "defaultValue"];
    function Ay(e) {
      {
        ol("select", e);
        for (var t = 0; t < kp.length; t++) {
          var i = kp[t];
          if (e[i] != null) {
            var a = dn(e[i]);
            e.multiple && !a ? m("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", i, Rp()) : !e.multiple && a && m("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", i, Rp());
          }
        }
      }
    }
    function Oa(e, t, i, a) {
      var l = e.options;
      if (t) {
        for (var f = i, v = {}, S = 0; S < f.length; S++)
          v["$" + f[S]] = !0;
        for (var b = 0; b < l.length; b++) {
          var x = v.hasOwnProperty("$" + l[b].value);
          l[b].selected !== x && (l[b].selected = x), x && a && (l[b].defaultSelected = !0);
        }
      } else {
        for (var T = Un(ka(i)), M = null, L = 0; L < l.length; L++) {
          if (l[L].value === T) {
            l[L].selected = !0, a && (l[L].defaultSelected = !0);
            return;
          }
          M === null && !l[L].disabled && (M = l[L]);
        }
        M !== null && (M.selected = !0);
      }
    }
    function Kf(e, t) {
      return Ge({}, t, {
        value: void 0
      });
    }
    function Dp(e, t) {
      var i = e;
      Ay(t), i._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !Ps && (m("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), Ps = !0);
    }
    function My(e, t) {
      var i = e;
      i.multiple = !!t.multiple;
      var a = t.value;
      a != null ? Oa(i, !!t.multiple, a, !1) : t.defaultValue != null && Oa(i, !!t.multiple, t.defaultValue, !0);
    }
    function Uy(e, t) {
      var i = e, a = i._wrapperState.wasMultiple;
      i._wrapperState.wasMultiple = !!t.multiple;
      var l = t.value;
      l != null ? Oa(i, !!t.multiple, l, !1) : a !== !!t.multiple && (t.defaultValue != null ? Oa(i, !!t.multiple, t.defaultValue, !0) : Oa(i, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function Ny(e, t) {
      var i = e, a = t.value;
      a != null && Oa(i, !!t.multiple, a, !1);
    }
    var Jf = !1;
    function Xf(e, t) {
      var i = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var a = Ge({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Un(i._wrapperState.initialValue)
      });
      return a;
    }
    function Op(e, t) {
      var i = e;
      ol("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !Jf && (m("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", jr() || "A component"), Jf = !0);
      var a = t.value;
      if (a == null) {
        var l = t.children, f = t.defaultValue;
        if (l != null) {
          m("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (f != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (dn(l)) {
              if (l.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              l = l[0];
            }
            f = l;
          }
        }
        f == null && (f = ""), a = f;
      }
      i._wrapperState = {
        initialValue: ka(a)
      };
    }
    function Lp(e, t) {
      var i = e, a = ka(t.value), l = ka(t.defaultValue);
      if (a != null) {
        var f = Un(a);
        f !== i.value && (i.value = f), t.defaultValue == null && i.defaultValue !== f && (i.defaultValue = f);
      }
      l != null && (i.defaultValue = Un(l));
    }
    function Ap(e, t) {
      var i = e, a = i.textContent;
      a === i._wrapperState.initialValue && a !== "" && a !== null && (i.value = a);
    }
    function Zf(e, t) {
      Lp(e, t);
    }
    var qi = "http://www.w3.org/1999/xhtml", zy = "http://www.w3.org/1998/Math/MathML", ed = "http://www.w3.org/2000/svg";
    function Vs(e) {
      switch (e) {
        case "svg":
          return ed;
        case "math":
          return zy;
        default:
          return qi;
      }
    }
    function td(e, t) {
      return e == null || e === qi ? Vs(t) : e === ed && t === "foreignObject" ? qi : e;
    }
    var jy = function (e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function (t, i, a, l) {
        MSApp.execUnsafeLocalFunction(function () {
          return e(t, i, a, l);
        });
      } : e;
    }, Bs, Mp = jy(function (e, t) {
      if (e.namespaceURI === ed && !("innerHTML" in e)) {
        Bs = Bs || document.createElement("div"), Bs.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var i = Bs.firstChild; e.firstChild;)
          e.removeChild(e.firstChild);
        for (; i.firstChild;)
          e.appendChild(i.firstChild);
        return;
      }
      e.innerHTML = t;
    }), ir = 1, Qi = 3, Xt = 8, fi = 9, po = 11, Is = function (e, t) {
      if (t) {
        var i = e.firstChild;
        if (i && i === e.lastChild && i.nodeType === Qi) {
          i.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Up = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, cl = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function Np(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var zp = ["Webkit", "ms", "Moz", "O"];
    Object.keys(cl).forEach(function (e) {
      zp.forEach(function (t) {
        cl[Np(t, e)] = cl[e];
      });
    });
    function Ys(e, t, i) {
      var a = t == null || typeof t == "boolean" || t === "";
      return a ? "" : !i && typeof t == "number" && t !== 0 && !(cl.hasOwnProperty(e) && cl[e]) ? t + "px" : (_a(t, e), ("" + t).trim());
    }
    var fl = /([A-Z])/g, Fy = /^ms-/;
    function $y(e) {
      return e.replace(fl, "-$1").toLowerCase().replace(Fy, "-ms-");
    }
    var jp = function () {
    };
    {
      var Fp = /^(?:webkit|moz|o)[A-Z]/, $p = /^-ms-/, xu = /-(.)/g, dl = /;\s*$/, hl = {}, pl = {}, Hp = !1, nd = !1, rd = function (e) {
        return e.replace(xu, function (t, i) {
          return i.toUpperCase();
        });
      }, id = function (e) {
        hl.hasOwnProperty(e) && hl[e] || (hl[e] = !0, m(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          rd(e.replace($p, "ms-"))
        ));
      }, Pp = function (e) {
        hl.hasOwnProperty(e) && hl[e] || (hl[e] = !0, m("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, Vp = function (e, t) {
        pl.hasOwnProperty(t) && pl[t] || (pl[t] = !0, m(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(dl, "")));
      }, Bp = function (e, t) {
        Hp || (Hp = !0, m("`NaN` is an invalid value for the `%s` css style property.", e));
      }, Hy = function (e, t) {
        nd || (nd = !0, m("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      jp = function (e, t) {
        e.indexOf("-") > -1 ? id(e) : Fp.test(e) ? Pp(e) : dl.test(t) && Vp(e, t), typeof t == "number" && (isNaN(t) ? Bp(e, t) : isFinite(t) || Hy(e, t));
      };
    }
    var Py = jp;
    function Vy(e) {
      {
        var t = "", i = "";
        for (var a in e)
          if (e.hasOwnProperty(a)) {
            var l = e[a];
            if (l != null) {
              var f = a.indexOf("--") === 0;
              t += i + (f ? a : $y(a)) + ":", t += Ys(a, l, f), i = ";";
            }
          }
        return t || null;
      }
    }
    function Ip(e, t) {
      var i = e.style;
      for (var a in t)
        if (t.hasOwnProperty(a)) {
          var l = a.indexOf("--") === 0;
          l || Py(a, t[a]);
          var f = Ys(a, t[a], l);
          a === "float" && (a = "cssFloat"), l ? i.setProperty(a, f) : i[a] = f;
        }
    }
    function By(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Fr(e) {
      var t = {};
      for (var i in e)
        for (var a = Up[i] || [i], l = 0; l < a.length; l++)
          t[a[l]] = i;
      return t;
    }
    function Tu(e, t) {
      {
        if (!t)
          return;
        var i = Fr(e), a = Fr(t), l = {};
        for (var f in i) {
          var v = i[f], S = a[f];
          if (S && v !== S) {
            var b = v + "," + S;
            if (l[b])
              continue;
            l[b] = !0, m("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", By(e[v]) ? "Removing" : "Updating", v, S);
          }
        }
      }
    }
    var Yp = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, qp = Ge({
      menuitem: !0
    }, Yp), Qp = "__html";
    function qs(e, t) {
      if (t) {
        if (qp[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(Qp in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && m("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function Gi(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var Qs = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, Gp = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, di = {}, ad = new RegExp("^(aria)-[" + ke + "]*$"), Ru = new RegExp("^(aria)[A-Z][" + ke + "]*$");
    function od(e, t) {
      {
        if (nr.call(di, t) && di[t])
          return !0;
        if (Ru.test(t)) {
          var i = "aria-" + t.slice(4).toLowerCase(), a = Gp.hasOwnProperty(i) ? i : null;
          if (a == null)
            return m("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), di[t] = !0, !0;
          if (t !== a)
            return m("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, a), di[t] = !0, !0;
        }
        if (ad.test(t)) {
          var l = t.toLowerCase(), f = Gp.hasOwnProperty(l) ? l : null;
          if (f == null)
            return di[t] = !0, !1;
          if (t !== f)
            return m("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, f), di[t] = !0, !0;
        }
      }
      return !0;
    }
    function Wp(e, t) {
      {
        var i = [];
        for (var a in t) {
          var l = od(e, a);
          l || i.push(a);
        }
        var f = i.map(function (v) {
          return "`" + v + "`";
        }).join(", ");
        i.length === 1 ? m("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", f, e) : i.length > 1 && m("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", f, e);
      }
    }
    function Gs(e, t) {
      Gi(e, t) || Wp(e, t);
    }
    var vo = !1;
    function ld(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !vo && (vo = !0, e === "select" && t.multiple ? m("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : m("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var ud = function () {
    };
    {
      var hn = {}, sd = /^on./, Kp = /^on[^A-Z]/, Jp = new RegExp("^(aria)-[" + ke + "]*$"), Xp = new RegExp("^(aria)[A-Z][" + ke + "]*$");
      ud = function (e, t, i, a) {
        if (nr.call(hn, t) && hn[t])
          return !0;
        var l = t.toLowerCase();
        if (l === "onfocusin" || l === "onfocusout")
          return m("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), hn[t] = !0, !0;
        if (a != null) {
          var f = a.registrationNameDependencies, v = a.possibleRegistrationNames;
          if (f.hasOwnProperty(t))
            return !0;
          var S = v.hasOwnProperty(l) ? v[l] : null;
          if (S != null)
            return m("Invalid event handler property `%s`. Did you mean `%s`?", t, S), hn[t] = !0, !0;
          if (sd.test(t))
            return m("Unknown event handler property `%s`. It will be ignored.", t), hn[t] = !0, !0;
        } else if (sd.test(t))
          return Kp.test(t) && m("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), hn[t] = !0, !0;
        if (Jp.test(t) || Xp.test(t))
          return !0;
        if (l === "innerhtml")
          return m("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), hn[t] = !0, !0;
        if (l === "aria")
          return m("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), hn[t] = !0, !0;
        if (l === "is" && i !== null && i !== void 0 && typeof i != "string")
          return m("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof i), hn[t] = !0, !0;
        if (typeof i == "number" && isNaN(i))
          return m("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), hn[t] = !0, !0;
        var b = _i(t), x = b !== null && b.type === Ca;
        if (Qs.hasOwnProperty(l)) {
          var T = Qs[l];
          if (T !== t)
            return m("Invalid DOM property `%s`. Did you mean `%s`?", t, T), hn[t] = !0, !0;
        } else if (!x && t !== l)
          return m("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, l), hn[t] = !0, !0;
        return typeof i == "boolean" && Ur(t, i, b, !1) ? (i ? m('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', i, t, t, i, t) : m('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', i, t, t, i, t, t, t), hn[t] = !0, !0) : x ? !0 : Ur(t, i, b, !1) ? (hn[t] = !0, !1) : ((i === "false" || i === "true") && b !== null && b.type === rr && (m("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", i, t, i === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, i), hn[t] = !0), !0);
      };
    }
    var Zp = function (e, t, i) {
      {
        var a = [];
        for (var l in t) {
          var f = ud(e, l, t[l], i);
          f || a.push(l);
        }
        var v = a.map(function (S) {
          return "`" + S + "`";
        }).join(", ");
        a.length === 1 ? m("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", v, e) : a.length > 1 && m("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", v, e);
      }
    };
    function ev(e, t, i) {
      Gi(e, t) || Zp(e, t, i);
    }
    var Wi = 1, ku = 2, mo = 4, Iy = Wi | ku | mo, Du = null;
    function Ou(e) {
      Du !== null && m("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), Du = e;
    }
    function Yy() {
      Du === null && m("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), Du = null;
    }
    function tv(e) {
      return e === Du;
    }
    function Ws(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Qi ? t.parentNode : t;
    }
    var Et = null, La = null, Ki = null;
    function vl(e) {
      var t = Pl(e);
      if (t) {
        if (typeof Et != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var i = t.stateNode;
        if (i) {
          var a = tm(i);
          Et(t.stateNode, t.type, a);
        }
      }
    }
    function nv(e) {
      Et = e;
    }
    function Ks(e) {
      La ? Ki ? Ki.push(e) : Ki = [e] : La = e;
    }
    function Lu() {
      return La !== null || Ki !== null;
    }
    function Au() {
      if (La) {
        var e = La, t = Ki;
        if (La = null, Ki = null, vl(e), t)
          for (var i = 0; i < t.length; i++)
            vl(t[i]);
      }
    }
    var yo = function (e, t) {
      return e(t);
    }, cd = function () {
    }, fd = !1;
    function qy() {
      var e = Lu();
      e && (cd(), Au());
    }
    function dd(e, t, i) {
      if (fd)
        return e(t, i);
      fd = !0;
      try {
        return yo(e, t, i);
      } finally {
        fd = !1, qy();
      }
    }
    function Js(e, t, i) {
      yo = e, cd = i;
    }
    function Xs(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function hd(e, t, i) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(i.disabled && Xs(t));
        default:
          return !1;
      }
    }
    function go(e, t) {
      var i = e.stateNode;
      if (i === null)
        return null;
      var a = tm(i);
      if (a === null)
        return null;
      var l = a[t];
      if (hd(t, e.type, a))
        return null;
      if (l && typeof l != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof l + "` type.");
      return l;
    }
    var Mu = !1;
    if (An)
      try {
        var So = {};
        Object.defineProperty(So, "passive", {
          get: function () {
            Mu = !0;
          }
        }), window.addEventListener("test", So, So), window.removeEventListener("test", So, So);
      } catch {
        Mu = !1;
      }
    function rv(e, t, i, a, l, f, v, S, b) {
      var x = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(i, x);
      } catch (T) {
        this.onError(T);
      }
    }
    var pd = rv;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var vd = document.createElement("react");
      pd = function (t, i, a, l, f, v, S, b, x) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var T = document.createEvent("Event"), M = !1, L = !0, H = window.event, P = Object.getOwnPropertyDescriptor(window, "event");
        function I() {
          vd.removeEventListener(Y, Re, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = H);
        }
        var de = Array.prototype.slice.call(arguments, 3);
        function Re() {
          M = !0, I(), i.apply(a, de), L = !1;
        }
        var Ee, nt = !1, Ke = !1;
        function z(j) {
          if (Ee = j.error, nt = !0, Ee === null && j.colno === 0 && j.lineno === 0 && (Ke = !0), j.defaultPrevented && Ee != null && typeof Ee == "object")
            try {
              Ee._suppressLogging = !0;
            } catch {
            }
        }
        var Y = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", z), vd.addEventListener(Y, Re, !1), T.initEvent(Y, !1, !1), vd.dispatchEvent(T), P && Object.defineProperty(window, "event", P), M && L && (nt ? Ke && (Ee = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : Ee = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(Ee)), window.removeEventListener("error", z), !M)
          return I(), rv.apply(this, arguments);
      };
    }
    var Qy = pd, Aa = !1, hi = null, Uu = !1, Ma = null, xi = {
      onError: function (e) {
        Aa = !0, hi = e;
      }
    };
    function wo(e, t, i, a, l, f, v, S, b) {
      Aa = !1, hi = null, Qy.apply(xi, arguments);
    }
    function Ji(e, t, i, a, l, f, v, S, b) {
      if (wo.apply(this, arguments), Aa) {
        var x = yd();
        Uu || (Uu = !0, Ma = x);
      }
    }
    function md() {
      if (Uu) {
        var e = Ma;
        throw Uu = !1, Ma = null, e;
      }
    }
    function Gy() {
      return Aa;
    }
    function yd() {
      if (Aa) {
        var e = hi;
        return Aa = !1, hi = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function $r(e) {
      return e._reactInternals;
    }
    function Nu(e) {
      return e._reactInternals !== void 0;
    }
    function ml(e, t) {
      e._reactInternals = t;
    }
    var Te = (
      /*                      */
      0
    ), Ua = (
      /*                */
      1
    ), xt = (
      /*                    */
      2
    ), Ve = (
      /*                       */
      4
    ), st = (
      /*                */
      16
    ), pt = (
      /*                 */
      32
    ), Ti = (
      /*                     */
      64
    ), Ue = (
      /*                   */
      128
    ), Pt = (
      /*            */
      256
    ), ar = (
      /*                          */
      512
    ), Hr = (
      /*                     */
      1024
    ), Ot = (
      /*                      */
      2048
    ), Pr = (
      /*                    */
      4096
    ), Na = (
      /*                   */
      8192
    ), zu = (
      /*             */
      16384
    ), Zs = Ot | Ve | Ti | ar | Hr | zu, iv = (
      /*               */
      32767
    ), br = (
      /*                   */
      32768
    ), pn = (
      /*                */
      65536
    ), ju = (
      /* */
      131072
    ), gd = (
      /*                       */
      1048576
    ), Sd = (
      /*                    */
      2097152
    ), or = (
      /*                 */
      4194304
    ), za = (
      /*                */
      8388608
    ), lr = (
      /*               */
      16777216
    ), bo = (
      /*              */
      33554432
    ), yl = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      Ve | Hr | 0
    ), ur = xt | Ve | st | pt | ar | Pr | Na, Nn = Ve | Ti | ar | Na, Vr = Ot | st, wn = or | za | Sd, Xi = s.ReactCurrentOwner;
    function Er(e) {
      var t = e, i = e;
      if (e.alternate)
        for (; t.return;)
          t = t.return;
      else {
        var a = t;
        do
          t = a, (t.flags & (xt | Pr)) !== Te && (i = t.return), a = t.return;
        while (a);
      }
      return t.tag === U ? i : null;
    }
    function wd(e) {
      if (e.tag === $e) {
        var t = e.memoizedState;
        if (t === null) {
          var i = e.alternate;
          i !== null && (t = i.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function ec(e) {
      return e.tag === U ? e.stateNode.containerInfo : null;
    }
    function bd(e) {
      return Er(e) === e;
    }
    function _r(e) {
      {
        var t = Xi.current;
        if (t !== null && t.tag === R) {
          var i = t, a = i.stateNode;
          a._warnedAboutRefsInRender || m("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", He(i) || "A component"), a._warnedAboutRefsInRender = !0;
        }
      }
      var l = $r(e);
      return l ? Er(l) === l : !1;
    }
    function sr(e) {
      if (Er(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function Tt(e) {
      var t = e.alternate;
      if (!t) {
        var i = Er(e);
        if (i === null)
          throw new Error("Unable to find node on an unmounted component.");
        return i !== e ? null : e;
      }
      for (var a = e, l = t; ;) {
        var f = a.return;
        if (f === null)
          break;
        var v = f.alternate;
        if (v === null) {
          var S = f.return;
          if (S !== null) {
            a = l = S;
            continue;
          }
          break;
        }
        if (f.child === v.child) {
          for (var b = f.child; b;) {
            if (b === a)
              return sr(f), e;
            if (b === l)
              return sr(f), t;
            b = b.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (a.return !== l.return)
          a = f, l = v;
        else {
          for (var x = !1, T = f.child; T;) {
            if (T === a) {
              x = !0, a = f, l = v;
              break;
            }
            if (T === l) {
              x = !0, l = f, a = v;
              break;
            }
            T = T.sibling;
          }
          if (!x) {
            for (T = v.child; T;) {
              if (T === a) {
                x = !0, a = v, l = f;
                break;
              }
              if (T === l) {
                x = !0, l = v, a = f;
                break;
              }
              T = T.sibling;
            }
            if (!x)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (a.alternate !== l)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (a.tag !== U)
        throw new Error("Unable to find node on an unmounted component.");
      return a.stateNode.current === a ? e : t;
    }
    function Br(e) {
      var t = Tt(e);
      return t !== null ? Ed(t) : null;
    }
    function Ed(e) {
      if (e.tag === B || e.tag === X)
        return e;
      for (var t = e.child; t !== null;) {
        var i = Ed(t);
        if (i !== null)
          return i;
        t = t.sibling;
      }
      return null;
    }
    function av(e) {
      var t = Tt(e);
      return t !== null ? tc(t) : null;
    }
    function tc(e) {
      if (e.tag === B || e.tag === X)
        return e;
      for (var t = e.child; t !== null;) {
        if (t.tag !== $) {
          var i = tc(t);
          if (i !== null)
            return i;
        }
        t = t.sibling;
      }
      return null;
    }
    var nc = u.unstable_scheduleCallback, ov = u.unstable_cancelCallback, rc = u.unstable_shouldYield, lv = u.unstable_requestPaint, Mt = u.unstable_now, _d = u.unstable_getCurrentPriorityLevel, ic = u.unstable_ImmediatePriority, Cr = u.unstable_UserBlockingPriority, Ri = u.unstable_NormalPriority, ac = u.unstable_LowPriority, ja = u.unstable_IdlePriority, Cd = u.unstable_yieldValue, xd = u.unstable_setDisableYieldValue, Fa = null, vn = null, ie = null, Yt = !1, bn = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function Td(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return m("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        ba && (e = Ge({}, e, {
          getLaneLabelMap: Ha,
          injectProfilingHooks: ea
        })), Fa = t.inject(e), vn = t;
      } catch (i) {
        m("React instrumentation encountered an error: %s.", i);
      }
      return !!t.checkDCE;
    }
    function uv(e, t) {
      if (vn && typeof vn.onScheduleFiberRoot == "function")
        try {
          vn.onScheduleFiberRoot(Fa, e, t);
        } catch (i) {
          Yt || (Yt = !0, m("React instrumentation encountered an error: %s", i));
        }
    }
    function Zi(e, t) {
      if (vn && typeof vn.onCommitFiberRoot == "function")
        try {
          var i = (e.current.flags & Ue) === Ue;
          if (In) {
            var a;
            switch (t) {
              case zn:
                a = ic;
                break;
              case En:
                a = Cr;
                break;
              case na:
                a = Ri;
                break;
              case qu:
                a = ja;
                break;
              default:
                a = Ri;
                break;
            }
            vn.onCommitFiberRoot(Fa, e, a, i);
          }
        } catch (l) {
          Yt || (Yt = !0, m("React instrumentation encountered an error: %s", l));
        }
    }
    function $a(e) {
      if (vn && typeof vn.onPostCommitFiberRoot == "function")
        try {
          vn.onPostCommitFiberRoot(Fa, e);
        } catch (t) {
          Yt || (Yt = !0, m("React instrumentation encountered an error: %s", t));
        }
    }
    function Rd(e) {
      if (vn && typeof vn.onCommitFiberUnmount == "function")
        try {
          vn.onCommitFiberUnmount(Fa, e);
        } catch (t) {
          Yt || (Yt = !0, m("React instrumentation encountered an error: %s", t));
        }
    }
    function an(e) {
      if (typeof Cd == "function" && (xd(e), g(e)), vn && typeof vn.setStrictMode == "function")
        try {
          vn.setStrictMode(Fa, e);
        } catch (t) {
          Yt || (Yt = !0, m("React instrumentation encountered an error: %s", t));
        }
    }
    function ea(e) {
      ie = e;
    }
    function Ha() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, i = 0; i < Rt; i++) {
          var a = Wy(t);
          e.set(t, a), t *= 2;
        }
        return e;
      }
    }
    function oc(e) {
      ie !== null && typeof ie.markCommitStarted == "function" && ie.markCommitStarted(e);
    }
    function kd() {
      ie !== null && typeof ie.markCommitStopped == "function" && ie.markCommitStopped();
    }
    function Pa(e) {
      ie !== null && typeof ie.markComponentRenderStarted == "function" && ie.markComponentRenderStarted(e);
    }
    function Eo() {
      ie !== null && typeof ie.markComponentRenderStopped == "function" && ie.markComponentRenderStopped();
    }
    function sv(e) {
      ie !== null && typeof ie.markComponentPassiveEffectMountStarted == "function" && ie.markComponentPassiveEffectMountStarted(e);
    }
    function Dd() {
      ie !== null && typeof ie.markComponentPassiveEffectMountStopped == "function" && ie.markComponentPassiveEffectMountStopped();
    }
    function lc(e) {
      ie !== null && typeof ie.markComponentPassiveEffectUnmountStarted == "function" && ie.markComponentPassiveEffectUnmountStarted(e);
    }
    function cv() {
      ie !== null && typeof ie.markComponentPassiveEffectUnmountStopped == "function" && ie.markComponentPassiveEffectUnmountStopped();
    }
    function fv(e) {
      ie !== null && typeof ie.markComponentLayoutEffectMountStarted == "function" && ie.markComponentLayoutEffectMountStarted(e);
    }
    function dv() {
      ie !== null && typeof ie.markComponentLayoutEffectMountStopped == "function" && ie.markComponentLayoutEffectMountStopped();
    }
    function uc(e) {
      ie !== null && typeof ie.markComponentLayoutEffectUnmountStarted == "function" && ie.markComponentLayoutEffectUnmountStarted(e);
    }
    function gl() {
      ie !== null && typeof ie.markComponentLayoutEffectUnmountStopped == "function" && ie.markComponentLayoutEffectUnmountStopped();
    }
    function sc(e, t, i) {
      ie !== null && typeof ie.markComponentErrored == "function" && ie.markComponentErrored(e, t, i);
    }
    function hv(e, t, i) {
      ie !== null && typeof ie.markComponentSuspended == "function" && ie.markComponentSuspended(e, t, i);
    }
    function pv(e) {
      ie !== null && typeof ie.markLayoutEffectsStarted == "function" && ie.markLayoutEffectsStarted(e);
    }
    function Sl() {
      ie !== null && typeof ie.markLayoutEffectsStopped == "function" && ie.markLayoutEffectsStopped();
    }
    function vv(e) {
      ie !== null && typeof ie.markPassiveEffectsStarted == "function" && ie.markPassiveEffectsStarted(e);
    }
    function Fu() {
      ie !== null && typeof ie.markPassiveEffectsStopped == "function" && ie.markPassiveEffectsStopped();
    }
    function pi(e) {
      ie !== null && typeof ie.markRenderStarted == "function" && ie.markRenderStarted(e);
    }
    function $u() {
      ie !== null && typeof ie.markRenderYielded == "function" && ie.markRenderYielded();
    }
    function wl() {
      ie !== null && typeof ie.markRenderStopped == "function" && ie.markRenderStopped();
    }
    function _o(e) {
      ie !== null && typeof ie.markRenderScheduled == "function" && ie.markRenderScheduled(e);
    }
    function Od(e, t) {
      ie !== null && typeof ie.markForceUpdateScheduled == "function" && ie.markForceUpdateScheduled(e, t);
    }
    function Va(e, t) {
      ie !== null && typeof ie.markStateUpdateScheduled == "function" && ie.markStateUpdateScheduled(e, t);
    }
    var De = (
      /*                         */
      0
    ), Ye = (
      /*                 */
      1
    ), Oe = (
      /*                    */
      2
    ), Ut = (
      /*               */
      8
    ), Ir = (
      /*              */
      16
    ), cc = Math.clz32 ? Math.clz32 : Co, fc = Math.log, Ld = Math.LN2;
    function Co(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (fc(t) / Ld | 0) | 0;
    }
    var Rt = 31, q = (
      /*                        */
      0
    ), et = (
      /*                          */
      0
    ), Le = (
      /*                        */
      1
    ), ki = (
      /*    */
      2
    ), xr = (
      /*             */
      4
    ), xo = (
      /*            */
      8
    ), kt = (
      /*                     */
      16
    ), To = (
      /*                */
      32
    ), Ba = (
      /*                       */
      4194240
    ), Ro = (
      /*                        */
      64
    ), Yr = (
      /*                        */
      128
    ), cr = (
      /*                        */
      256
    ), ko = (
      /*                        */
      512
    ), Hu = (
      /*                        */
      1024
    ), Pu = (
      /*                        */
      2048
    ), dc = (
      /*                        */
      4096
    ), hc = (
      /*                        */
      8192
    ), pc = (
      /*                        */
      16384
    ), vc = (
      /*                       */
      32768
    ), mc = (
      /*                       */
      65536
    ), yc = (
      /*                       */
      131072
    ), gc = (
      /*                       */
      262144
    ), Sc = (
      /*                       */
      524288
    ), Do = (
      /*                       */
      1048576
    ), wc = (
      /*                       */
      2097152
    ), Oo = (
      /*                            */
      130023424
    ), ta = (
      /*                             */
      4194304
    ), bc = (
      /*                             */
      8388608
    ), Vu = (
      /*                             */
      16777216
    ), Ec = (
      /*                             */
      33554432
    ), _c = (
      /*                             */
      67108864
    ), Ad = ta, bl = (
      /*          */
      134217728
    ), Cc = (
      /*                          */
      268435455
    ), El = (
      /*               */
      268435456
    ), Ia = (
      /*                        */
      536870912
    ), fr = (
      /*                   */
      1073741824
    );
    function Wy(e) {
      {
        if (e & Le)
          return "Sync";
        if (e & ki)
          return "InputContinuousHydration";
        if (e & xr)
          return "InputContinuous";
        if (e & xo)
          return "DefaultHydration";
        if (e & kt)
          return "Default";
        if (e & To)
          return "TransitionHydration";
        if (e & Ba)
          return "Transition";
        if (e & Oo)
          return "Retry";
        if (e & bl)
          return "SelectiveHydration";
        if (e & El)
          return "IdleHydration";
        if (e & Ia)
          return "Idle";
        if (e & fr)
          return "Offscreen";
      }
    }
    var _t = -1, xc = Ro, Tc = ta;
    function _l(e) {
      switch (Zt(e)) {
        case Le:
          return Le;
        case ki:
          return ki;
        case xr:
          return xr;
        case xo:
          return xo;
        case kt:
          return kt;
        case To:
          return To;
        case Ro:
        case Yr:
        case cr:
        case ko:
        case Hu:
        case Pu:
        case dc:
        case hc:
        case pc:
        case vc:
        case mc:
        case yc:
        case gc:
        case Sc:
        case Do:
        case wc:
          return e & Ba;
        case ta:
        case bc:
        case Vu:
        case Ec:
        case _c:
          return e & Oo;
        case bl:
          return bl;
        case El:
          return El;
        case Ia:
          return Ia;
        case fr:
          return fr;
        default:
          return m("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Bu(e, t) {
      var i = e.pendingLanes;
      if (i === q)
        return q;
      var a = q, l = e.suspendedLanes, f = e.pingedLanes, v = i & Cc;
      if (v !== q) {
        var S = v & ~l;
        if (S !== q)
          a = _l(S);
        else {
          var b = v & f;
          b !== q && (a = _l(b));
        }
      } else {
        var x = i & ~l;
        x !== q ? a = _l(x) : f !== q && (a = _l(f));
      }
      if (a === q)
        return q;
      if (t !== q && t !== a && // If we already suspended with a delay, then interrupting is fine. Don't
        // bother waiting until the root is complete.
        (t & l) === q) {
        var T = Zt(a), M = Zt(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          T >= M || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          T === kt && (M & Ba) !== q
        )
          return t;
      }
      (a & xr) !== q && (a |= i & kt);
      var L = e.entangledLanes;
      if (L !== q)
        for (var H = e.entanglements, P = a & L; P > 0;) {
          var I = Ya(P), de = 1 << I;
          a |= H[I], P &= ~de;
        }
      return a;
    }
    function mv(e, t) {
      for (var i = e.eventTimes, a = _t; t > 0;) {
        var l = Ya(t), f = 1 << l, v = i[l];
        v > a && (a = v), t &= ~f;
      }
      return a;
    }
    function Rc(e, t) {
      switch (e) {
        case Le:
        case ki:
        case xr:
          return t + 250;
        case xo:
        case kt:
        case To:
        case Ro:
        case Yr:
        case cr:
        case ko:
        case Hu:
        case Pu:
        case dc:
        case hc:
        case pc:
        case vc:
        case mc:
        case yc:
        case gc:
        case Sc:
        case Do:
        case wc:
          return t + 5e3;
        case ta:
        case bc:
        case Vu:
        case Ec:
        case _c:
          return _t;
        case bl:
        case El:
        case Ia:
        case fr:
          return _t;
        default:
          return m("Should have found matching lanes. This is a bug in React."), _t;
      }
    }
    function Ky(e, t) {
      for (var i = e.pendingLanes, a = e.suspendedLanes, l = e.pingedLanes, f = e.expirationTimes, v = i; v > 0;) {
        var S = Ya(v), b = 1 << S, x = f[S];
        x === _t ? ((b & a) === q || (b & l) !== q) && (f[S] = Rc(b, t)) : x <= t && (e.expiredLanes |= b), v &= ~b;
      }
    }
    function Jy(e) {
      return _l(e.pendingLanes);
    }
    function Md(e) {
      var t = e.pendingLanes & ~fr;
      return t !== q ? t : t & fr ? fr : q;
    }
    function Cl(e) {
      return (e & Le) !== q;
    }
    function Iu(e) {
      return (e & Cc) !== q;
    }
    function kc(e) {
      return (e & Oo) === e;
    }
    function Xy(e) {
      var t = Le | xr | kt;
      return (e & t) === q;
    }
    function yv(e) {
      return (e & Ba) === e;
    }
    function Yu(e, t) {
      var i = ki | xr | xo | kt;
      return (t & i) !== q;
    }
    function gv(e, t) {
      return (t & e.expiredLanes) !== q;
    }
    function Ud(e) {
      return (e & Ba) !== q;
    }
    function Nd() {
      var e = xc;
      return xc <<= 1, (xc & Ba) === q && (xc = Ro), e;
    }
    function Zy() {
      var e = Tc;
      return Tc <<= 1, (Tc & Oo) === q && (Tc = ta), e;
    }
    function Zt(e) {
      return e & -e;
    }
    function on(e) {
      return Zt(e);
    }
    function Ya(e) {
      return 31 - cc(e);
    }
    function Dc(e) {
      return Ya(e);
    }
    function dr(e, t) {
      return (e & t) !== q;
    }
    function Lo(e, t) {
      return (e & t) === t;
    }
    function Be(e, t) {
      return e | t;
    }
    function xl(e, t) {
      return e & ~t;
    }
    function zd(e, t) {
      return e & t;
    }
    function Sv(e) {
      return e;
    }
    function wv(e, t) {
      return e !== et && e < t ? e : t;
    }
    function Oc(e) {
      for (var t = [], i = 0; i < Rt; i++)
        t.push(e);
      return t;
    }
    function Ao(e, t, i) {
      e.pendingLanes |= t, t !== Ia && (e.suspendedLanes = q, e.pingedLanes = q);
      var a = e.eventTimes, l = Dc(t);
      a[l] = i;
    }
    function jd(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var i = e.expirationTimes, a = t; a > 0;) {
        var l = Ya(a), f = 1 << l;
        i[l] = _t, a &= ~f;
      }
    }
    function Fd(e, t, i) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function $d(e, t) {
      var i = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = q, e.pingedLanes = q, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var a = e.entanglements, l = e.eventTimes, f = e.expirationTimes, v = i; v > 0;) {
        var S = Ya(v), b = 1 << S;
        a[S] = q, l[S] = _t, f[S] = _t, v &= ~b;
      }
    }
    function Tl(e, t) {
      for (var i = e.entangledLanes |= t, a = e.entanglements, l = i; l;) {
        var f = Ya(l), v = 1 << f;
        // Is this one of the newly entangled lanes?
        v & t | // Is this lane transitively entangled with the newly entangled lanes?
          a[f] & t && (a[f] |= t), l &= ~v;
      }
    }
    function eg(e, t) {
      var i = Zt(t), a;
      switch (i) {
        case xr:
          a = ki;
          break;
        case kt:
          a = xo;
          break;
        case Ro:
        case Yr:
        case cr:
        case ko:
        case Hu:
        case Pu:
        case dc:
        case hc:
        case pc:
        case vc:
        case mc:
        case yc:
        case gc:
        case Sc:
        case Do:
        case wc:
        case ta:
        case bc:
        case Vu:
        case Ec:
        case _c:
          a = To;
          break;
        case Ia:
          a = El;
          break;
        default:
          a = et;
          break;
      }
      return (a & (e.suspendedLanes | t)) !== et ? et : a;
    }
    function Hd(e, t, i) {
      if (bn)
        for (var a = e.pendingUpdatersLaneMap; i > 0;) {
          var l = Dc(i), f = 1 << l, v = a[l];
          v.add(t), i &= ~f;
        }
    }
    function Lc(e, t) {
      if (bn)
        for (var i = e.pendingUpdatersLaneMap, a = e.memoizedUpdaters; t > 0;) {
          var l = Dc(t), f = 1 << l, v = i[l];
          v.size > 0 && (v.forEach(function (S) {
            var b = S.alternate;
            (b === null || !a.has(b)) && a.add(S);
          }), v.clear()), t &= ~f;
        }
    }
    function Pd(e, t) {
      return null;
    }
    var zn = Le, En = xr, na = kt, qu = Ia, Mo = et;
    function qr() {
      return Mo;
    }
    function ln(e) {
      Mo = e;
    }
    function Qu(e, t) {
      var i = Mo;
      try {
        return Mo = e, t();
      } finally {
        Mo = i;
      }
    }
    function jn(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function tg(e, t) {
      return e === 0 || e > t ? e : t;
    }
    function Vd(e, t) {
      return e !== 0 && e < t;
    }
    function Gu(e) {
      var t = Zt(e);
      return Vd(zn, t) ? Vd(En, t) ? Iu(t) ? na : qu : En : zn;
    }
    function un(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var bv;
    function ve(e) {
      bv = e;
    }
    function Rl(e) {
      bv(e);
    }
    var Wu;
    function Ev(e) {
      Wu = e;
    }
    var _v;
    function Ku(e) {
      _v = e;
    }
    var Ju;
    function Bd(e) {
      Ju = e;
    }
    var Id;
    function Cv(e) {
      Id = e;
    }
    var Ac = !1, kl = [], Di = null, Lt = null, mn = null, Qr = /* @__PURE__ */ new Map(), Dl = /* @__PURE__ */ new Map(), ra = [], vi = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function xv(e) {
      return vi.indexOf(e) > -1;
    }
    function Oi(e, t, i, a, l) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: i,
        nativeEvent: l,
        targetContainers: [a]
      };
    }
    function Tv(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          Di = null;
          break;
        case "dragenter":
        case "dragleave":
          Lt = null;
          break;
        case "mouseover":
        case "mouseout":
          mn = null;
          break;
        case "pointerover":
        case "pointerout": {
          var i = t.pointerId;
          Qr.delete(i);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var a = t.pointerId;
          Dl.delete(a);
          break;
        }
      }
    }
    function Ol(e, t, i, a, l, f) {
      if (e === null || e.nativeEvent !== f) {
        var v = Oi(t, i, a, l, f);
        if (t !== null) {
          var S = Pl(t);
          S !== null && Wu(S);
        }
        return v;
      }
      e.eventSystemFlags |= a;
      var b = e.targetContainers;
      return l !== null && b.indexOf(l) === -1 && b.push(l), e;
    }
    function Rv(e, t, i, a, l) {
      switch (t) {
        case "focusin": {
          var f = l;
          return Di = Ol(Di, e, t, i, a, f), !0;
        }
        case "dragenter": {
          var v = l;
          return Lt = Ol(Lt, e, t, i, a, v), !0;
        }
        case "mouseover": {
          var S = l;
          return mn = Ol(mn, e, t, i, a, S), !0;
        }
        case "pointerover": {
          var b = l, x = b.pointerId;
          return Qr.set(x, Ol(Qr.get(x) || null, e, t, i, a, b)), !0;
        }
        case "gotpointercapture": {
          var T = l, M = T.pointerId;
          return Dl.set(M, Ol(Dl.get(M) || null, e, t, i, a, T)), !0;
        }
      }
      return !1;
    }
    function Yd(e) {
      var t = os(e.target);
      if (t !== null) {
        var i = Er(t);
        if (i !== null) {
          var a = i.tag;
          if (a === $e) {
            var l = wd(i);
            if (l !== null) {
              e.blockedOn = l, Id(e.priority, function () {
                _v(i);
              });
              return;
            }
          } else if (a === U) {
            var f = i.stateNode;
            if (un(f)) {
              e.blockedOn = ec(i);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function kv(e) {
      for (var t = Ju(), i = {
        blockedOn: null,
        target: e,
        priority: t
      }, a = 0; a < ra.length && Vd(t, ra[a].priority); a++)
        ;
      ra.splice(a, 0, i), a === 0 && Yd(i);
    }
    function Mc(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0;) {
        var i = t[0], a = Uo(e.domEventName, e.eventSystemFlags, i, e.nativeEvent);
        if (a === null) {
          var l = e.nativeEvent, f = new l.constructor(l.type, l);
          Ou(f), l.target.dispatchEvent(f), Yy();
        } else {
          var v = Pl(a);
          return v !== null && Wu(v), e.blockedOn = a, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Xu(e, t, i) {
      Mc(e) && i.delete(t);
    }
    function qd() {
      Ac = !1, Di !== null && Mc(Di) && (Di = null), Lt !== null && Mc(Lt) && (Lt = null), mn !== null && Mc(mn) && (mn = null), Qr.forEach(Xu), Dl.forEach(Xu);
    }
    function Fn(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Ac || (Ac = !0, u.unstable_scheduleCallback(u.unstable_NormalPriority, qd)));
    }
    function We(e) {
      if (kl.length > 0) {
        Fn(kl[0], e);
        for (var t = 1; t < kl.length; t++) {
          var i = kl[t];
          i.blockedOn === e && (i.blockedOn = null);
        }
      }
      Di !== null && Fn(Di, e), Lt !== null && Fn(Lt, e), mn !== null && Fn(mn, e);
      var a = function (S) {
        return Fn(S, e);
      };
      Qr.forEach(a), Dl.forEach(a);
      for (var l = 0; l < ra.length; l++) {
        var f = ra[l];
        f.blockedOn === e && (f.blockedOn = null);
      }
      for (; ra.length > 0;) {
        var v = ra[0];
        if (v.blockedOn !== null)
          break;
        Yd(v), v.blockedOn === null && ra.shift();
      }
    }
    var Nt = s.ReactCurrentBatchConfig, Vt = !0;
    function yn(e) {
      Vt = !!e;
    }
    function Tr() {
      return Vt;
    }
    function Ll(e, t, i) {
      var a = qn(t), l;
      switch (a) {
        case zn:
          l = sn;
          break;
        case En:
          l = Zu;
          break;
        case na:
        default:
          l = ia;
          break;
      }
      return l.bind(null, t, i, e);
    }
    function sn(e, t, i, a) {
      var l = qr(), f = Nt.transition;
      Nt.transition = null;
      try {
        ln(zn), ia(e, t, i, a);
      } finally {
        ln(l), Nt.transition = f;
      }
    }
    function Zu(e, t, i, a) {
      var l = qr(), f = Nt.transition;
      Nt.transition = null;
      try {
        ln(En), ia(e, t, i, a);
      } finally {
        ln(l), Nt.transition = f;
      }
    }
    function ia(e, t, i, a) {
      Vt && Uc(e, t, i, a);
    }
    function Uc(e, t, i, a) {
      var l = Uo(e, t, i, a);
      if (l === null) {
        bg(e, t, a, Al, i), Tv(e, a);
        return;
      }
      if (Rv(l, e, t, i, a)) {
        a.stopPropagation();
        return;
      }
      if (Tv(e, a), t & mo && xv(e)) {
        for (; l !== null;) {
          var f = Pl(l);
          f !== null && Rl(f);
          var v = Uo(e, t, i, a);
          if (v === null && bg(e, t, a, Al, i), v === l)
            break;
          l = v;
        }
        l !== null && a.stopPropagation();
        return;
      }
      bg(e, t, a, null, i);
    }
    var Al = null;
    function Uo(e, t, i, a) {
      Al = null;
      var l = Ws(a), f = os(l);
      if (f !== null) {
        var v = Er(f);
        if (v === null)
          f = null;
        else {
          var S = v.tag;
          if (S === $e) {
            var b = wd(v);
            if (b !== null)
              return b;
            f = null;
          } else if (S === U) {
            var x = v.stateNode;
            if (un(x))
              return ec(v);
            f = null;
          } else
            v !== f && (f = null);
        }
      }
      return Al = f, null;
    }
    function qn(e) {
      switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return zn;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return En;
        case "message": {
          var t = _d();
          switch (t) {
            case ic:
              return zn;
            case Cr:
              return En;
            case Ri:
            case ac:
              return na;
            case ja:
              return qu;
            default:
              return na;
          }
        }
        default:
          return na;
      }
    }
    function Qd(e, t, i) {
      return e.addEventListener(t, i, !1), i;
    }
    function Ml(e, t, i) {
      return e.addEventListener(t, i, !0), i;
    }
    function aa(e, t, i, a) {
      return e.addEventListener(t, i, {
        capture: !0,
        passive: a
      }), i;
    }
    function Nc(e, t, i, a) {
      return e.addEventListener(t, i, {
        passive: a
      }), i;
    }
    var No = null, Li = null, qa = null;
    function Qa(e) {
      return No = e, Li = jc(), !0;
    }
    function zc() {
      No = null, Li = null, qa = null;
    }
    function Ul() {
      if (qa)
        return qa;
      var e, t = Li, i = t.length, a, l = jc(), f = l.length;
      for (e = 0; e < i && t[e] === l[e]; e++)
        ;
      var v = i - e;
      for (a = 1; a <= v && t[i - a] === l[f - a]; a++)
        ;
      var S = a > 1 ? 1 - a : void 0;
      return qa = l.slice(e, S), qa;
    }
    function jc() {
      return "value" in No ? No.value : No.textContent;
    }
    function zo(e) {
      var t, i = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && i === 13 && (t = 13)) : t = i, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function jo() {
      return !0;
    }
    function $n() {
      return !1;
    }
    function en(e) {
      function t(i, a, l, f, v) {
        this._reactName = i, this._targetInst = l, this.type = a, this.nativeEvent = f, this.target = v, this.currentTarget = null;
        for (var S in e)
          if (e.hasOwnProperty(S)) {
            var b = e[S];
            b ? this[S] = b(f) : this[S] = f[S];
          }
        var x = f.defaultPrevented != null ? f.defaultPrevented : f.returnValue === !1;
        return x ? this.isDefaultPrevented = jo : this.isDefaultPrevented = $n, this.isPropagationStopped = $n, this;
      }
      return Ge(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var i = this.nativeEvent;
          i && (i.preventDefault ? i.preventDefault() : typeof i.returnValue != "unknown" && (i.returnValue = !1), this.isDefaultPrevented = jo);
        },
        stopPropagation: function () {
          var i = this.nativeEvent;
          i && (i.stopPropagation ? i.stopPropagation() : typeof i.cancelBubble != "unknown" && (i.cancelBubble = !0), this.isPropagationStopped = jo);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function () {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: jo
      }), t;
    }
    var Hn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Pn = en(Hn), Nl = Ge({}, Hn, {
      view: 0,
      detail: 0
    }), Gd = en(Nl), es, Wd, Gr;
    function Dv(e) {
      e !== Gr && (Gr && e.type === "mousemove" ? (es = e.screenX - Gr.screenX, Wd = e.screenY - Gr.screenY) : (es = 0, Wd = 0), Gr = e);
    }
    var zl = Ge({}, Nl, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Hc,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function (e) {
        return "movementX" in e ? e.movementX : (Dv(e), es);
      },
      movementY: function (e) {
        return "movementY" in e ? e.movementY : Wd;
      }
    }), Ga = en(zl), Kd = Ge({}, zl, {
      dataTransfer: 0
    }), Fo = en(Kd), Ov = Ge({}, Nl, {
      relatedTarget: 0
    }), Fc = en(Ov), Jd = Ge({}, Hn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), $c = en(Jd), ng = Ge({}, Hn, {
      clipboardData: function (e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), rg = en(ng), Lv = Ge({}, Hn, {
      data: 0
    }), Xd = en(Lv), $o = Xd, ig = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, jl = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function Av(e) {
      if (e.key) {
        var t = ig[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var i = zo(e);
        return i === 13 ? "Enter" : String.fromCharCode(i);
      }
      return e.type === "keydown" || e.type === "keyup" ? jl[e.keyCode] || "Unidentified" : "";
    }
    var Bt = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function ag(e) {
      var t = this, i = t.nativeEvent;
      if (i.getModifierState)
        return i.getModifierState(e);
      var a = Bt[e];
      return a ? !!i[a] : !1;
    }
    function Hc(e) {
      return ag;
    }
    var og = Ge({}, Nl, {
      key: Av,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Hc,
      // Legacy Interface
      charCode: function (e) {
        return e.type === "keypress" ? zo(e) : 0;
      },
      keyCode: function (e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === "keypress" ? zo(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), lg = en(og), Mv = Ge({}, zl, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), Zd = en(Mv), ug = Ge({}, Nl, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Hc
    }), Wr = en(ug), eh = Ge({}, Hn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), sg = en(eh), Wa = Ge({}, zl, {
      deltaX: function (e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function (e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), Pc = en(Wa), Ho = [9, 13, 27, 32], ts = 229, ns = An && "CompositionEvent" in window, Po = null;
    An && "documentMode" in document && (Po = document.documentMode);
    var cg = An && "TextEvent" in window && !Po, Vc = An && (!ns || Po && Po > 8 && Po <= 11), Uv = 32, th = String.fromCharCode(Uv);
    function Nv() {
      Ar("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Ar("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), Ar("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), Ar("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var rs = !1;
    function Bc(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
        !(e.ctrlKey && e.altKey);
    }
    function zv(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function nh(e, t) {
      return e === "keydown" && t.keyCode === ts;
    }
    function jv(e, t) {
      switch (e) {
        case "keyup":
          return Ho.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== ts;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function rh(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function Ic(e) {
      return e.locale === "ko";
    }
    var oa = !1;
    function ih(e, t, i, a, l) {
      var f, v;
      if (ns ? f = zv(t) : oa ? jv(t, a) && (f = "onCompositionEnd") : nh(t, a) && (f = "onCompositionStart"), !f)
        return null;
      Vc && !Ic(a) && (!oa && f === "onCompositionStart" ? oa = Qa(l) : f === "onCompositionEnd" && oa && (v = Ul()));
      var S = Vv(i, f);
      if (S.length > 0) {
        var b = new Xd(f, t, null, a, l);
        if (e.push({
          event: b,
          listeners: S
        }), v)
          b.data = v;
        else {
          var x = rh(a);
          x !== null && (b.data = x);
        }
      }
    }
    function Yc(e, t) {
      switch (e) {
        case "compositionend":
          return rh(t);
        case "keypress":
          var i = t.which;
          return i !== Uv ? null : (rs = !0, th);
        case "textInput":
          var a = t.data;
          return a === th && rs ? null : a;
        default:
          return null;
      }
    }
    function Fv(e, t) {
      if (oa) {
        if (e === "compositionend" || !ns && jv(e, t)) {
          var i = Ul();
          return zc(), oa = !1, i;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!Bc(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return Vc && !Ic(t) ? null : t.data;
        default:
          return null;
      }
    }
    function fg(e, t, i, a, l) {
      var f;
      if (cg ? f = Yc(t, a) : f = Fv(t, a), !f)
        return null;
      var v = Vv(i, "onBeforeInput");
      if (v.length > 0) {
        var S = new $o("onBeforeInput", "beforeinput", null, a, l);
        e.push({
          event: S,
          listeners: v
        }), S.data = f;
      }
    }
    function qc(e, t, i, a, l, f, v) {
      ih(e, t, i, a, l), fg(e, t, i, a, l);
    }
    var dg = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function Fl(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!dg[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function hg(e) {
      if (!An)
        return !1;
      var t = "on" + e, i = t in document;
      if (!i) {
        var a = document.createElement("div");
        a.setAttribute(t, "return;"), i = typeof a[t] == "function";
      }
      return i;
    }
    function Qc() {
      Ar("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function n(e, t, i, a) {
      Ks(a);
      var l = Vv(t, "onChange");
      if (l.length > 0) {
        var f = new Pn("onChange", "change", null, i, a);
        e.push({
          event: f,
          listeners: l
        });
      }
    }
    var r = null, o = null;
    function c(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function p(e) {
      var t = [];
      n(t, o, e, Ws(e)), dd(y, t);
    }
    function y(e) {
      tb(e, 0);
    }
    function E(e) {
      var t = Zc(e);
      if (Cp(t))
        return e;
    }
    function k(e, t) {
      if (e === "change")
        return t;
    }
    var D = !1;
    An && (D = hg("input") && (!document.documentMode || document.documentMode > 9));
    function V(e, t) {
      r = e, o = t, r.attachEvent("onpropertychange", K);
    }
    function W() {
      r && (r.detachEvent("onpropertychange", K), r = null, o = null);
    }
    function K(e) {
      e.propertyName === "value" && E(o) && p(e);
    }
    function G(e, t, i) {
      e === "focusin" ? (W(), V(t, i)) : e === "focusout" && W();
    }
    function ce(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return E(o);
    }
    function me(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function Se(e, t) {
      if (e === "click")
        return E(t);
    }
    function qt(e, t) {
      if (e === "input" || e === "change")
        return E(t);
    }
    function N(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Da(e, "number", e.value);
    }
    function A(e, t, i, a, l, f, v) {
      var S = i ? Zc(i) : window, b, x;
      if (c(S) ? b = k : Fl(S) ? D ? b = qt : (b = ce, x = G) : me(S) && (b = Se), b) {
        var T = b(t, i);
        if (T) {
          n(e, T, a, l);
          return;
        }
      }
      x && x(t, S, i), t === "focusout" && N(S);
    }
    function F() {
      Pi("onMouseEnter", ["mouseout", "mouseover"]), Pi("onMouseLeave", ["mouseout", "mouseover"]), Pi("onPointerEnter", ["pointerout", "pointerover"]), Pi("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function Z(e, t, i, a, l, f, v) {
      var S = t === "mouseover" || t === "pointerover", b = t === "mouseout" || t === "pointerout";
      if (S && !tv(a)) {
        var x = a.relatedTarget || a.fromElement;
        if (x && (os(x) || gh(x)))
          return;
      }
      if (!(!b && !S)) {
        var T;
        if (l.window === l)
          T = l;
        else {
          var M = l.ownerDocument;
          M ? T = M.defaultView || M.parentWindow : T = window;
        }
        var L, H;
        if (b) {
          var P = a.relatedTarget || a.toElement;
          if (L = i, H = P ? os(P) : null, H !== null) {
            var I = Er(H);
            (H !== I || H.tag !== B && H.tag !== X) && (H = null);
          }
        } else
          L = null, H = i;
        if (L !== H) {
          var de = Ga, Re = "onMouseLeave", Ee = "onMouseEnter", nt = "mouse";
          (t === "pointerout" || t === "pointerover") && (de = Zd, Re = "onPointerLeave", Ee = "onPointerEnter", nt = "pointer");
          var Ke = L == null ? T : Zc(L), z = H == null ? T : Zc(H), Y = new de(Re, nt + "leave", L, a, l);
          Y.target = Ke, Y.relatedTarget = z;
          var j = null, J = os(l);
          if (J === i) {
            var he = new de(Ee, nt + "enter", H, a, l);
            he.target = z, he.relatedTarget = Ke, j = he;
          }
          qC(e, Y, j, L, H);
        }
      }
    }
    function be(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var ye = typeof Object.is == "function" ? Object.is : be;
    function xe(e, t) {
      if (ye(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var i = Object.keys(e), a = Object.keys(t);
      if (i.length !== a.length)
        return !1;
      for (var l = 0; l < i.length; l++) {
        var f = i[l];
        if (!nr.call(t, f) || !ye(e[f], t[f]))
          return !1;
      }
      return !0;
    }
    function Ne(e) {
      for (; e && e.firstChild;)
        e = e.firstChild;
      return e;
    }
    function gn(e) {
      for (; e;) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function it(e, t) {
      for (var i = Ne(e), a = 0, l = 0; i;) {
        if (i.nodeType === Qi) {
          if (l = a + i.textContent.length, a <= t && l >= t)
            return {
              node: i,
              offset: t - a
            };
          a = l;
        }
        i = Ne(gn(i));
      }
    }
    function Ka(e) {
      var t = e.ownerDocument, i = t && t.defaultView || window, a = i.getSelection && i.getSelection();
      if (!a || a.rangeCount === 0)
        return null;
      var l = a.anchorNode, f = a.anchorOffset, v = a.focusNode, S = a.focusOffset;
      try {
        l.nodeType, v.nodeType;
      } catch {
        return null;
      }
      return pg(e, l, f, v, S);
    }
    function pg(e, t, i, a, l) {
      var f = 0, v = -1, S = -1, b = 0, x = 0, T = e, M = null;
      e:
      for (; ;) {
        for (var L = null; T === t && (i === 0 || T.nodeType === Qi) && (v = f + i), T === a && (l === 0 || T.nodeType === Qi) && (S = f + l), T.nodeType === Qi && (f += T.nodeValue.length), (L = T.firstChild) !== null;)
          M = T, T = L;
        for (; ;) {
          if (T === e)
            break e;
          if (M === t && ++b === i && (v = f), M === a && ++x === l && (S = f), (L = T.nextSibling) !== null)
            break;
          T = M, M = T.parentNode;
        }
        T = L;
      }
      return v === -1 || S === -1 ? null : {
        start: v,
        end: S
      };
    }
    function RC(e, t) {
      var i = e.ownerDocument || document, a = i && i.defaultView || window;
      if (a.getSelection) {
        var l = a.getSelection(), f = e.textContent.length, v = Math.min(t.start, f), S = t.end === void 0 ? v : Math.min(t.end, f);
        if (!l.extend && v > S) {
          var b = S;
          S = v, v = b;
        }
        var x = it(e, v), T = it(e, S);
        if (x && T) {
          if (l.rangeCount === 1 && l.anchorNode === x.node && l.anchorOffset === x.offset && l.focusNode === T.node && l.focusOffset === T.offset)
            return;
          var M = i.createRange();
          M.setStart(x.node, x.offset), l.removeAllRanges(), v > S ? (l.addRange(M), l.extend(T.node, T.offset)) : (M.setEnd(T.node, T.offset), l.addRange(M));
        }
      }
    }
    function Bw(e) {
      return e && e.nodeType === Qi;
    }
    function Iw(e, t) {
      return !e || !t ? !1 : e === t ? !0 : Bw(e) ? !1 : Bw(t) ? Iw(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function kC(e) {
      return e && e.ownerDocument && Iw(e.ownerDocument.documentElement, e);
    }
    function DC(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function Yw() {
      for (var e = window, t = zs(); t instanceof e.HTMLIFrameElement;) {
        if (DC(t))
          e = t.contentWindow;
        else
          return t;
        t = zs(e.document);
      }
      return t;
    }
    function vg(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function OC() {
      var e = Yw();
      return {
        focusedElem: e,
        selectionRange: vg(e) ? AC(e) : null
      };
    }
    function LC(e) {
      var t = Yw(), i = e.focusedElem, a = e.selectionRange;
      if (t !== i && kC(i)) {
        a !== null && vg(i) && MC(i, a);
        for (var l = [], f = i; f = f.parentNode;)
          f.nodeType === ir && l.push({
            element: f,
            left: f.scrollLeft,
            top: f.scrollTop
          });
        typeof i.focus == "function" && i.focus();
        for (var v = 0; v < l.length; v++) {
          var S = l[v];
          S.element.scrollLeft = S.left, S.element.scrollTop = S.top;
        }
      }
    }
    function AC(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = Ka(e), t || {
        start: 0,
        end: 0
      };
    }
    function MC(e, t) {
      var i = t.start, a = t.end;
      a === void 0 && (a = i), "selectionStart" in e ? (e.selectionStart = i, e.selectionEnd = Math.min(a, e.value.length)) : RC(e, t);
    }
    var UC = An && "documentMode" in document && document.documentMode <= 11;
    function NC() {
      Ar("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var Gc = null, mg = null, ah = null, yg = !1;
    function zC(e) {
      if ("selectionStart" in e && vg(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, i = t.getSelection();
      return {
        anchorNode: i.anchorNode,
        anchorOffset: i.anchorOffset,
        focusNode: i.focusNode,
        focusOffset: i.focusOffset
      };
    }
    function jC(e) {
      return e.window === e ? e.document : e.nodeType === fi ? e : e.ownerDocument;
    }
    function qw(e, t, i) {
      var a = jC(i);
      if (!(yg || Gc == null || Gc !== zs(a))) {
        var l = zC(Gc);
        if (!ah || !xe(ah, l)) {
          ah = l;
          var f = Vv(mg, "onSelect");
          if (f.length > 0) {
            var v = new Pn("onSelect", "select", null, t, i);
            e.push({
              event: v,
              listeners: f
            }), v.target = Gc;
          }
        }
      }
    }
    function FC(e, t, i, a, l, f, v) {
      var S = i ? Zc(i) : window;
      switch (t) {
        case "focusin":
          (Fl(S) || S.contentEditable === "true") && (Gc = S, mg = i, ah = null);
          break;
        case "focusout":
          Gc = null, mg = null, ah = null;
          break;
        case "mousedown":
          yg = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          yg = !1, qw(e, a, l);
          break;
        case "selectionchange":
          if (UC)
            break;
        case "keydown":
        case "keyup":
          qw(e, a, l);
      }
    }
    function $v(e, t) {
      var i = {};
      return i[e.toLowerCase()] = t.toLowerCase(), i["Webkit" + e] = "webkit" + t, i["Moz" + e] = "moz" + t, i;
    }
    var Wc = {
      animationend: $v("Animation", "AnimationEnd"),
      animationiteration: $v("Animation", "AnimationIteration"),
      animationstart: $v("Animation", "AnimationStart"),
      transitionend: $v("Transition", "TransitionEnd")
    }, gg = {}, Qw = {};
    An && (Qw = document.createElement("div").style, "AnimationEvent" in window || (delete Wc.animationend.animation, delete Wc.animationiteration.animation, delete Wc.animationstart.animation), "TransitionEvent" in window || delete Wc.transitionend.transition);
    function Hv(e) {
      if (gg[e])
        return gg[e];
      if (!Wc[e])
        return e;
      var t = Wc[e];
      for (var i in t)
        if (t.hasOwnProperty(i) && i in Qw)
          return gg[e] = t[i];
      return e;
    }
    var Gw = Hv("animationend"), Ww = Hv("animationiteration"), Kw = Hv("animationstart"), Jw = Hv("transitionend"), Xw = /* @__PURE__ */ new Map(), Zw = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function $l(e, t) {
      Xw.set(e, t), Ar(t, [e]);
    }
    function $C() {
      for (var e = 0; e < Zw.length; e++) {
        var t = Zw[e], i = t.toLowerCase(), a = t[0].toUpperCase() + t.slice(1);
        $l(i, "on" + a);
      }
      $l(Gw, "onAnimationEnd"), $l(Ww, "onAnimationIteration"), $l(Kw, "onAnimationStart"), $l("dblclick", "onDoubleClick"), $l("focusin", "onFocus"), $l("focusout", "onBlur"), $l(Jw, "onTransitionEnd");
    }
    function HC(e, t, i, a, l, f, v) {
      var S = Xw.get(t);
      if (S !== void 0) {
        var b = Pn, x = t;
        switch (t) {
          case "keypress":
            if (zo(a) === 0)
              return;
          case "keydown":
          case "keyup":
            b = lg;
            break;
          case "focusin":
            x = "focus", b = Fc;
            break;
          case "focusout":
            x = "blur", b = Fc;
            break;
          case "beforeblur":
          case "afterblur":
            b = Fc;
            break;
          case "click":
            if (a.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            b = Ga;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            b = Fo;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            b = Wr;
            break;
          case Gw:
          case Ww:
          case Kw:
            b = $c;
            break;
          case Jw:
            b = sg;
            break;
          case "scroll":
            b = Gd;
            break;
          case "wheel":
            b = Pc;
            break;
          case "copy":
          case "cut":
          case "paste":
            b = rg;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            b = Zd;
            break;
        }
        var T = (f & mo) !== 0;
        {
          var M = !T && // TODO: ideally, we'd eventually add all events from
            // nonDelegatedEvents list in DOMPluginEventSystem.
            // Then we can remove this special list.
            // This is a breaking change that can wait until React 18.
            t === "scroll", L = IC(i, S, a.type, T, M);
          if (L.length > 0) {
            var H = new b(S, x, null, a, l);
            e.push({
              event: H,
              listeners: L
            });
          }
        }
      }
    }
    $C(), F(), Qc(), NC(), Nv();
    function PC(e, t, i, a, l, f, v) {
      HC(e, t, i, a, l, f);
      var S = (f & Iy) === 0;
      S && (Z(e, t, i, a, l), A(e, t, i, a, l), FC(e, t, i, a, l), qc(e, t, i, a, l));
    }
    var oh = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], Sg = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(oh));
    function eb(e, t, i) {
      var a = e.type || "unknown-event";
      e.currentTarget = i, Ji(a, t, void 0, e), e.currentTarget = null;
    }
    function VC(e, t, i) {
      var a;
      if (i)
        for (var l = t.length - 1; l >= 0; l--) {
          var f = t[l], v = f.instance, S = f.currentTarget, b = f.listener;
          if (v !== a && e.isPropagationStopped())
            return;
          eb(e, b, S), a = v;
        }
      else
        for (var x = 0; x < t.length; x++) {
          var T = t[x], M = T.instance, L = T.currentTarget, H = T.listener;
          if (M !== a && e.isPropagationStopped())
            return;
          eb(e, H, L), a = M;
        }
    }
    function tb(e, t) {
      for (var i = (t & mo) !== 0, a = 0; a < e.length; a++) {
        var l = e[a], f = l.event, v = l.listeners;
        VC(f, v, i);
      }
      md();
    }
    function BC(e, t, i, a, l) {
      var f = Ws(i), v = [];
      PC(v, e, a, i, f, t), tb(v, t);
    }
    function zt(e, t) {
      Sg.has(e) || m('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var i = !1, a = ST(t), l = QC(e, i);
      a.has(l) || (nb(t, e, ku, i), a.add(l));
    }
    function wg(e, t, i) {
      Sg.has(e) && !t && m('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var a = 0;
      t && (a |= mo), nb(i, e, a, t);
    }
    var Pv = "_reactListening" + Math.random().toString(36).slice(2);
    function lh(e) {
      if (!e[Pv]) {
        e[Pv] = !0, ri.forEach(function (i) {
          i !== "selectionchange" && (Sg.has(i) || wg(i, !1, e), wg(i, !0, e));
        });
        var t = e.nodeType === fi ? e : e.ownerDocument;
        t !== null && (t[Pv] || (t[Pv] = !0, wg("selectionchange", !1, t)));
      }
    }
    function nb(e, t, i, a, l) {
      var f = Ll(e, t, i), v = void 0;
      Mu && (t === "touchstart" || t === "touchmove" || t === "wheel") && (v = !0), e = e, a ? v !== void 0 ? aa(e, t, f, v) : Ml(e, t, f) : v !== void 0 ? Nc(e, t, f, v) : Qd(e, t, f);
    }
    function rb(e, t) {
      return e === t || e.nodeType === Xt && e.parentNode === t;
    }
    function bg(e, t, i, a, l) {
      var f = a;
      if (!(t & Wi) && !(t & ku)) {
        var v = l;
        if (a !== null) {
          var S = a;
          e:
          for (; ;) {
            if (S === null)
              return;
            var b = S.tag;
            if (b === U || b === $) {
              var x = S.stateNode.containerInfo;
              if (rb(x, v))
                break;
              if (b === $)
                for (var T = S.return; T !== null;) {
                  var M = T.tag;
                  if (M === U || M === $) {
                    var L = T.stateNode.containerInfo;
                    if (rb(L, v))
                      return;
                  }
                  T = T.return;
                }
              for (; x !== null;) {
                var H = os(x);
                if (H === null)
                  return;
                var P = H.tag;
                if (P === B || P === X) {
                  S = f = H;
                  continue e;
                }
                x = x.parentNode;
              }
            }
            S = S.return;
          }
        }
      }
      dd(function () {
        return BC(e, t, i, f);
      });
    }
    function uh(e, t, i) {
      return {
        instance: e,
        listener: t,
        currentTarget: i
      };
    }
    function IC(e, t, i, a, l, f) {
      for (var v = t !== null ? t + "Capture" : null, S = a ? v : t, b = [], x = e, T = null; x !== null;) {
        var M = x, L = M.stateNode, H = M.tag;
        if (H === B && L !== null && (T = L, S !== null)) {
          var P = go(x, S);
          P != null && b.push(uh(x, P, T));
        }
        if (l)
          break;
        x = x.return;
      }
      return b;
    }
    function Vv(e, t) {
      for (var i = t + "Capture", a = [], l = e; l !== null;) {
        var f = l, v = f.stateNode, S = f.tag;
        if (S === B && v !== null) {
          var b = v, x = go(l, i);
          x != null && a.unshift(uh(l, x, b));
          var T = go(l, t);
          T != null && a.push(uh(l, T, b));
        }
        l = l.return;
      }
      return a;
    }
    function Kc(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== B);
      return e || null;
    }
    function YC(e, t) {
      for (var i = e, a = t, l = 0, f = i; f; f = Kc(f))
        l++;
      for (var v = 0, S = a; S; S = Kc(S))
        v++;
      for (; l - v > 0;)
        i = Kc(i), l--;
      for (; v - l > 0;)
        a = Kc(a), v--;
      for (var b = l; b--;) {
        if (i === a || a !== null && i === a.alternate)
          return i;
        i = Kc(i), a = Kc(a);
      }
      return null;
    }
    function ib(e, t, i, a, l) {
      for (var f = t._reactName, v = [], S = i; S !== null && S !== a;) {
        var b = S, x = b.alternate, T = b.stateNode, M = b.tag;
        if (x !== null && x === a)
          break;
        if (M === B && T !== null) {
          var L = T;
          if (l) {
            var H = go(S, f);
            H != null && v.unshift(uh(S, H, L));
          } else if (!l) {
            var P = go(S, f);
            P != null && v.push(uh(S, P, L));
          }
        }
        S = S.return;
      }
      v.length !== 0 && e.push({
        event: t,
        listeners: v
      });
    }
    function qC(e, t, i, a, l) {
      var f = a && l ? YC(a, l) : null;
      a !== null && ib(e, t, a, f, !1), l !== null && i !== null && ib(e, i, l, f, !0);
    }
    function QC(e, t) {
      return e + "__" + (t ? "capture" : "bubble");
    }
    var Kr = !1, sh = "dangerouslySetInnerHTML", Bv = "suppressContentEditableWarning", Hl = "suppressHydrationWarning", ab = "autoFocus", is = "children", as = "style", Iv = "__html", Eg, Yv, ch, ob, qv, lb, ub;
    Eg = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, Yv = function (e, t) {
      Gs(e, t), ld(e, t), ev(e, t, {
        registrationNameDependencies: bi,
        possibleRegistrationNames: su
      });
    }, lb = An && !document.documentMode, ch = function (e, t, i) {
      if (!Kr) {
        var a = Qv(i), l = Qv(t);
        l !== a && (Kr = !0, m("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(l), JSON.stringify(a)));
      }
    }, ob = function (e) {
      if (!Kr) {
        Kr = !0;
        var t = [];
        e.forEach(function (i) {
          t.push(i);
        }), m("Extra attributes from the server: %s", t);
      }
    }, qv = function (e, t) {
      t === !1 ? m("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : m("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, ub = function (e, t) {
      var i = e.namespaceURI === qi ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return i.innerHTML = t, i.innerHTML;
    };
    var GC = /\r\n?/g, WC = /\u0000|\uFFFD/g;
    function Qv(e) {
      uo(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(GC, `
`).replace(WC, "");
    }
    function Gv(e, t, i, a) {
      var l = Qv(t), f = Qv(e);
      if (f !== l && (a && (Kr || (Kr = !0, m('Text content did not match. Server: "%s" Client: "%s"', f, l))), i && fn))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function sb(e) {
      return e.nodeType === fi ? e : e.ownerDocument;
    }
    function KC() {
    }
    function Wv(e) {
      e.onclick = KC;
    }
    function JC(e, t, i, a, l) {
      for (var f in a)
        if (a.hasOwnProperty(f)) {
          var v = a[f];
          if (f === as)
            v && Object.freeze(v), Ip(t, v);
          else if (f === sh) {
            var S = v ? v[Iv] : void 0;
            S != null && Mp(t, S);
          } else if (f === is)
            if (typeof v == "string") {
              var b = e !== "textarea" || v !== "";
              b && Is(t, v);
            } else
              typeof v == "number" && Is(t, "" + v);
          else
            f === Bv || f === Hl || f === ab || (bi.hasOwnProperty(f) ? v != null && (typeof v != "function" && qv(f, v), f === "onScroll" && zt("scroll", t)) : v != null && so(t, f, v, l));
        }
    }
    function XC(e, t, i, a) {
      for (var l = 0; l < t.length; l += 2) {
        var f = t[l], v = t[l + 1];
        f === as ? Ip(e, v) : f === sh ? Mp(e, v) : f === is ? Is(e, v) : so(e, f, v, a);
      }
    }
    function ZC(e, t, i, a) {
      var l, f = sb(i), v, S = a;
      if (S === qi && (S = Vs(e)), S === qi) {
        if (l = Gi(e, t), !l && e !== e.toLowerCase() && m("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var b = f.createElement("div");
          b.innerHTML = "<script><\/script>";
          var x = b.firstChild;
          v = b.removeChild(x);
        } else if (typeof t.is == "string")
          v = f.createElement(e, {
            is: t.is
          });
        else if (v = f.createElement(e), e === "select") {
          var T = v;
          t.multiple ? T.multiple = !0 : t.size && (T.size = t.size);
        }
      } else
        v = f.createElementNS(S, e);
      return S === qi && !l && Object.prototype.toString.call(v) === "[object HTMLUnknownElement]" && !nr.call(Eg, e) && (Eg[e] = !0, m("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), v;
    }
    function ex(e, t) {
      return sb(t).createTextNode(e);
    }
    function tx(e, t, i, a) {
      var l = Gi(t, i);
      Yv(t, i);
      var f;
      switch (t) {
        case "dialog":
          zt("cancel", e), zt("close", e), f = i;
          break;
        case "iframe":
        case "object":
        case "embed":
          zt("load", e), f = i;
          break;
        case "video":
        case "audio":
          for (var v = 0; v < oh.length; v++)
            zt(oh[v], e);
          f = i;
          break;
        case "source":
          zt("error", e), f = i;
          break;
        case "img":
        case "image":
        case "link":
          zt("error", e), zt("load", e), f = i;
          break;
        case "details":
          zt("toggle", e), f = i;
          break;
        case "input":
          Eu(e, i), f = bu(e, i), zt("invalid", e);
          break;
        case "option":
          Hs(e, i), f = i;
          break;
        case "select":
          Dp(e, i), f = Kf(e, i), zt("invalid", e);
          break;
        case "textarea":
          Op(e, i), f = Xf(e, i), zt("invalid", e);
          break;
        default:
          f = i;
      }
      switch (qs(t, f), JC(t, e, a, f, l), t) {
        case "input":
          ho(e), _u(e, i, !1);
          break;
        case "textarea":
          ho(e), Ap(e);
          break;
        case "option":
          Wf(e, i);
          break;
        case "select":
          My(e, i);
          break;
        default:
          typeof f.onClick == "function" && Wv(e);
          break;
      }
    }
    function nx(e, t, i, a, l) {
      Yv(t, a);
      var f = null, v, S;
      switch (t) {
        case "input":
          v = bu(e, i), S = bu(e, a), f = [];
          break;
        case "select":
          v = Kf(e, i), S = Kf(e, a), f = [];
          break;
        case "textarea":
          v = Xf(e, i), S = Xf(e, a), f = [];
          break;
        default:
          v = i, S = a, typeof v.onClick != "function" && typeof S.onClick == "function" && Wv(e);
          break;
      }
      qs(t, S);
      var b, x, T = null;
      for (b in v)
        if (!(S.hasOwnProperty(b) || !v.hasOwnProperty(b) || v[b] == null))
          if (b === as) {
            var M = v[b];
            for (x in M)
              M.hasOwnProperty(x) && (T || (T = {}), T[x] = "");
          } else
            b === sh || b === is || b === Bv || b === Hl || b === ab || (bi.hasOwnProperty(b) ? f || (f = []) : (f = f || []).push(b, null));
      for (b in S) {
        var L = S[b], H = v != null ? v[b] : void 0;
        if (!(!S.hasOwnProperty(b) || L === H || L == null && H == null))
          if (b === as)
            if (L && Object.freeze(L), H) {
              for (x in H)
                H.hasOwnProperty(x) && (!L || !L.hasOwnProperty(x)) && (T || (T = {}), T[x] = "");
              for (x in L)
                L.hasOwnProperty(x) && H[x] !== L[x] && (T || (T = {}), T[x] = L[x]);
            } else
              T || (f || (f = []), f.push(b, T)), T = L;
          else if (b === sh) {
            var P = L ? L[Iv] : void 0, I = H ? H[Iv] : void 0;
            P != null && I !== P && (f = f || []).push(b, P);
          } else
            b === is ? (typeof L == "string" || typeof L == "number") && (f = f || []).push(b, "" + L) : b === Bv || b === Hl || (bi.hasOwnProperty(b) ? (L != null && (typeof L != "function" && qv(b, L), b === "onScroll" && zt("scroll", e)), !f && H !== L && (f = [])) : (f = f || []).push(b, L));
      }
      return T && (Tu(T, S[as]), (f = f || []).push(as, T)), f;
    }
    function rx(e, t, i, a, l) {
      i === "input" && l.type === "radio" && l.name != null && Gf(e, l);
      var f = Gi(i, a), v = Gi(i, l);
      switch (XC(e, t, f, v), i) {
        case "input":
          ul(e, l);
          break;
        case "textarea":
          Lp(e, l);
          break;
        case "select":
          Uy(e, l);
          break;
      }
    }
    function ix(e) {
      {
        var t = e.toLowerCase();
        return Qs.hasOwnProperty(t) && Qs[t] || null;
      }
    }
    function ax(e, t, i, a, l, f, v) {
      var S, b;
      switch (S = Gi(t, i), Yv(t, i), t) {
        case "dialog":
          zt("cancel", e), zt("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          zt("load", e);
          break;
        case "video":
        case "audio":
          for (var x = 0; x < oh.length; x++)
            zt(oh[x], e);
          break;
        case "source":
          zt("error", e);
          break;
        case "img":
        case "image":
        case "link":
          zt("error", e), zt("load", e);
          break;
        case "details":
          zt("toggle", e);
          break;
        case "input":
          Eu(e, i), zt("invalid", e);
          break;
        case "option":
          Hs(e, i);
          break;
        case "select":
          Dp(e, i), zt("invalid", e);
          break;
        case "textarea":
          Op(e, i), zt("invalid", e);
          break;
      }
      qs(t, i);
      {
        b = /* @__PURE__ */ new Set();
        for (var T = e.attributes, M = 0; M < T.length; M++) {
          var L = T[M].name.toLowerCase();
          switch (L) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              b.add(T[M].name);
          }
        }
      }
      var H = null;
      for (var P in i)
        if (i.hasOwnProperty(P)) {
          var I = i[P];
          if (P === is)
            typeof I == "string" ? e.textContent !== I && (i[Hl] !== !0 && Gv(e.textContent, I, f, v), H = [is, I]) : typeof I == "number" && e.textContent !== "" + I && (i[Hl] !== !0 && Gv(e.textContent, I, f, v), H = [is, "" + I]);
          else if (bi.hasOwnProperty(P))
            I != null && (typeof I != "function" && qv(P, I), P === "onScroll" && zt("scroll", e));
          else if (v && // Convince Flow we've calculated it (it's DEV-only in this method.)
            typeof S == "boolean") {
            var de = void 0, Re = S && Wt ? null : _i(P);
            if (i[Hl] !== !0) {
              if (!(P === Bv || P === Hl || // Controlled attributes are not validated
                // TODO: Only ignore them on controlled tags.
                P === "value" || P === "checked" || P === "selected")) {
                if (P === sh) {
                  var Ee = e.innerHTML, nt = I ? I[Iv] : void 0;
                  if (nt != null) {
                    var Ke = ub(e, nt);
                    Ke !== Ee && ch(P, Ee, Ke);
                  }
                } else if (P === as) {
                  if (b.delete(P), lb) {
                    var z = Vy(I);
                    de = e.getAttribute("style"), z !== de && ch(P, de, z);
                  }
                } else if (S && !Wt)
                  b.delete(P.toLowerCase()), de = Ls(e, P, I), I !== de && ch(P, de, I);
                else if (!nn(P, Re, S) && !Ft(P, I, Re, S)) {
                  var Y = !1;
                  if (Re !== null)
                    b.delete(Re.attributeName), de = fu(e, P, I, Re);
                  else {
                    var j = a;
                    if (j === qi && (j = Vs(t)), j === qi)
                      b.delete(P.toLowerCase());
                    else {
                      var J = ix(P);
                      J !== null && J !== P && (Y = !0, b.delete(J)), b.delete(P);
                    }
                    de = Ls(e, P, I);
                  }
                  var he = Wt;
                  !he && I !== de && !Y && ch(P, de, I);
                }
              }
            }
          }
        }
      switch (v && // $FlowFixMe - Should be inferred as not undefined.
      b.size > 0 && i[Hl] !== !0 && ob(b), t) {
        case "input":
          ho(e), _u(e, i, !0);
          break;
        case "textarea":
          ho(e), Ap(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof i.onClick == "function" && Wv(e);
          break;
      }
      return H;
    }
    function ox(e, t, i) {
      var a = e.nodeValue !== t;
      return a;
    }
    function _g(e, t) {
      {
        if (Kr)
          return;
        Kr = !0, m("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function Cg(e, t) {
      {
        if (Kr)
          return;
        Kr = !0, m('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function xg(e, t, i) {
      {
        if (Kr)
          return;
        Kr = !0, m("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function Tg(e, t) {
      {
        if (t === "" || Kr)
          return;
        Kr = !0, m('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function lx(e, t, i) {
      switch (t) {
        case "input":
          xp(e, i);
          return;
        case "textarea":
          Zf(e, i);
          return;
        case "select":
          Ny(e, i);
          return;
      }
    }
    var fh = function () {
    }, dh = function () {
    };
    {
      var ux = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], cb = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], sx = cb.concat(["button"]), cx = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], fb = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      dh = function (e, t) {
        var i = Ge({}, e || fb), a = {
          tag: t
        };
        return cb.indexOf(t) !== -1 && (i.aTagInScope = null, i.buttonTagInScope = null, i.nobrTagInScope = null), sx.indexOf(t) !== -1 && (i.pTagInButtonScope = null), ux.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (i.listItemTagAutoclosing = null, i.dlItemTagAutoclosing = null), i.current = a, t === "form" && (i.formTag = a), t === "a" && (i.aTagInScope = a), t === "button" && (i.buttonTagInScope = a), t === "nobr" && (i.nobrTagInScope = a), t === "p" && (i.pTagInButtonScope = a), t === "li" && (i.listItemTagAutoclosing = a), (t === "dd" || t === "dt") && (i.dlItemTagAutoclosing = a), i;
      };
      var fx = function (e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return cx.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, dx = function (e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, db = {};
      fh = function (e, t, i) {
        i = i || fb;
        var a = i.current, l = a && a.tag;
        t != null && (e != null && m("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var f = fx(e, l) ? null : a, v = f ? null : dx(e, i), S = f || v;
        if (S) {
          var b = S.tag, x = !!f + "|" + e + "|" + b;
          if (!db[x]) {
            db[x] = !0;
            var T = e, M = "";
            if (e === "#text" ? /\S/.test(t) ? T = "Text nodes" : (T = "Whitespace text nodes", M = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : T = "<" + e + ">", f) {
              var L = "";
              b === "table" && e === "tr" && (L += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), m("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", T, b, M, L);
            } else
              m("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", T, b);
          }
        }
      };
    }
    var Kv = "suppressHydrationWarning", Jv = "$", Xv = "/$", hh = "$?", ph = "$!", hx = "style", Rg = null, kg = null;
    function px(e) {
      var t, i, a = e.nodeType;
      switch (a) {
        case fi:
        case po: {
          t = a === fi ? "#document" : "#fragment";
          var l = e.documentElement;
          i = l ? l.namespaceURI : td(null, "");
          break;
        }
        default: {
          var f = a === Xt ? e.parentNode : e, v = f.namespaceURI || null;
          t = f.tagName, i = td(v, t);
          break;
        }
      }
      {
        var S = t.toLowerCase(), b = dh(null, S);
        return {
          namespace: i,
          ancestorInfo: b
        };
      }
    }
    function vx(e, t, i) {
      {
        var a = e, l = td(a.namespace, t), f = dh(a.ancestorInfo, t);
        return {
          namespace: l,
          ancestorInfo: f
        };
      }
    }
    function iM(e) {
      return e;
    }
    function mx(e) {
      Rg = Tr(), kg = OC();
      var t = null;
      return yn(!1), t;
    }
    function yx(e) {
      LC(kg), yn(Rg), Rg = null, kg = null;
    }
    function gx(e, t, i, a, l) {
      var f;
      {
        var v = a;
        if (fh(e, null, v.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var S = "" + t.children, b = dh(v.ancestorInfo, e);
          fh(null, S, b);
        }
        f = v.namespace;
      }
      var x = ZC(e, t, i, f);
      return yh(l, x), zg(x, t), x;
    }
    function Sx(e, t) {
      e.appendChild(t);
    }
    function wx(e, t, i, a, l) {
      switch (tx(e, t, i, a), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!i.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function bx(e, t, i, a, l, f) {
      {
        var v = f;
        if (typeof a.children != typeof i.children && (typeof a.children == "string" || typeof a.children == "number")) {
          var S = "" + a.children, b = dh(v.ancestorInfo, t);
          fh(null, S, b);
        }
      }
      return nx(e, t, i, a);
    }
    function Dg(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function Ex(e, t, i, a) {
      {
        var l = i;
        fh(null, e, l.ancestorInfo);
      }
      var f = ex(e, t);
      return yh(a, f), f;
    }
    function _x() {
      var e = window.event;
      return e === void 0 ? na : qn(e.type);
    }
    var Og = typeof setTimeout == "function" ? setTimeout : void 0, Cx = typeof clearTimeout == "function" ? clearTimeout : void 0, Lg = -1, hb = typeof Promise == "function" ? Promise : void 0, xx = typeof queueMicrotask == "function" ? queueMicrotask : typeof hb < "u" ? function (e) {
      return hb.resolve(null).then(e).catch(Tx);
    } : Og;
    function Tx(e) {
      setTimeout(function () {
        throw e;
      });
    }
    function Rx(e, t, i, a) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          i.autoFocus && e.focus();
          return;
        case "img": {
          i.src && (e.src = i.src);
          return;
        }
      }
    }
    function kx(e, t, i, a, l, f) {
      rx(e, t, i, a, l), zg(e, l);
    }
    function pb(e) {
      Is(e, "");
    }
    function Dx(e, t, i) {
      e.nodeValue = i;
    }
    function Ox(e, t) {
      e.appendChild(t);
    }
    function Lx(e, t) {
      var i;
      e.nodeType === Xt ? (i = e.parentNode, i.insertBefore(t, e)) : (i = e, i.appendChild(t));
      var a = e._reactRootContainer;
      a == null && i.onclick === null && Wv(i);
    }
    function Ax(e, t, i) {
      e.insertBefore(t, i);
    }
    function Mx(e, t, i) {
      e.nodeType === Xt ? e.parentNode.insertBefore(t, i) : e.insertBefore(t, i);
    }
    function Ux(e, t) {
      e.removeChild(t);
    }
    function Nx(e, t) {
      e.nodeType === Xt ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function Ag(e, t) {
      var i = t, a = 0;
      do {
        var l = i.nextSibling;
        if (e.removeChild(i), l && l.nodeType === Xt) {
          var f = l.data;
          if (f === Xv)
            if (a === 0) {
              e.removeChild(l), We(t);
              return;
            } else
              a--;
          else
            (f === Jv || f === hh || f === ph) && a++;
        }
        i = l;
      } while (i);
      We(t);
    }
    function zx(e, t) {
      e.nodeType === Xt ? Ag(e.parentNode, t) : e.nodeType === ir && Ag(e, t), We(e);
    }
    function jx(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function Fx(e) {
      e.nodeValue = "";
    }
    function $x(e, t) {
      e = e;
      var i = t[hx], a = i != null && i.hasOwnProperty("display") ? i.display : null;
      e.style.display = Ys("display", a);
    }
    function Hx(e, t) {
      e.nodeValue = t;
    }
    function Px(e) {
      e.nodeType === ir ? e.textContent = "" : e.nodeType === fi && e.documentElement && e.removeChild(e.documentElement);
    }
    function Vx(e, t, i) {
      return e.nodeType !== ir || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function Bx(e, t) {
      return t === "" || e.nodeType !== Qi ? null : e;
    }
    function Ix(e) {
      return e.nodeType !== Xt ? null : e;
    }
    function vb(e) {
      return e.data === hh;
    }
    function Mg(e) {
      return e.data === ph;
    }
    function Yx(e) {
      var t = e.nextSibling && e.nextSibling.dataset, i, a, l;
      return t && (i = t.dgst, a = t.msg, l = t.stck), {
        message: a,
        digest: i,
        stack: l
      };
    }
    function qx(e, t) {
      e._reactRetry = t;
    }
    function Zv(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === ir || t === Qi)
          break;
        if (t === Xt) {
          var i = e.data;
          if (i === Jv || i === ph || i === hh)
            break;
          if (i === Xv)
            return null;
        }
      }
      return e;
    }
    function vh(e) {
      return Zv(e.nextSibling);
    }
    function Qx(e) {
      return Zv(e.firstChild);
    }
    function Gx(e) {
      return Zv(e.firstChild);
    }
    function Wx(e) {
      return Zv(e.nextSibling);
    }
    function Kx(e, t, i, a, l, f, v) {
      yh(f, e), zg(e, i);
      var S;
      {
        var b = l;
        S = b.namespace;
      }
      var x = (f.mode & Ye) !== De;
      return ax(e, t, i, S, a, x, v);
    }
    function Jx(e, t, i, a) {
      return yh(i, e), i.mode & Ye, ox(e, t);
    }
    function Xx(e, t) {
      yh(t, e);
    }
    function Zx(e) {
      for (var t = e.nextSibling, i = 0; t;) {
        if (t.nodeType === Xt) {
          var a = t.data;
          if (a === Xv) {
            if (i === 0)
              return vh(t);
            i--;
          } else
            (a === Jv || a === ph || a === hh) && i++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function mb(e) {
      for (var t = e.previousSibling, i = 0; t;) {
        if (t.nodeType === Xt) {
          var a = t.data;
          if (a === Jv || a === ph || a === hh) {
            if (i === 0)
              return t;
            i--;
          } else
            a === Xv && i++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function eT(e) {
      We(e);
    }
    function tT(e) {
      We(e);
    }
    function nT(e) {
      return e !== "head" && e !== "body";
    }
    function rT(e, t, i, a) {
      var l = !0;
      Gv(t.nodeValue, i, a, l);
    }
    function iT(e, t, i, a, l, f) {
      if (t[Kv] !== !0) {
        var v = !0;
        Gv(a.nodeValue, l, f, v);
      }
    }
    function aT(e, t) {
      t.nodeType === ir ? _g(e, t) : t.nodeType === Xt || Cg(e, t);
    }
    function oT(e, t) {
      {
        var i = e.parentNode;
        i !== null && (t.nodeType === ir ? _g(i, t) : t.nodeType === Xt || Cg(i, t));
      }
    }
    function lT(e, t, i, a, l) {
      (l || t[Kv] !== !0) && (a.nodeType === ir ? _g(i, a) : a.nodeType === Xt || Cg(i, a));
    }
    function uT(e, t, i) {
      xg(e, t);
    }
    function sT(e, t) {
      Tg(e, t);
    }
    function cT(e, t, i) {
      {
        var a = e.parentNode;
        a !== null && xg(a, t);
      }
    }
    function fT(e, t) {
      {
        var i = e.parentNode;
        i !== null && Tg(i, t);
      }
    }
    function dT(e, t, i, a, l, f) {
      (f || t[Kv] !== !0) && xg(i, a);
    }
    function hT(e, t, i, a, l) {
      (l || t[Kv] !== !0) && Tg(i, a);
    }
    function pT(e) {
      m("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function vT(e) {
      lh(e);
    }
    var Jc = Math.random().toString(36).slice(2), Xc = "__reactFiber$" + Jc, Ug = "__reactProps$" + Jc, mh = "__reactContainer$" + Jc, Ng = "__reactEvents$" + Jc, mT = "__reactListeners$" + Jc, yT = "__reactHandles$" + Jc;
    function gT(e) {
      delete e[Xc], delete e[Ug], delete e[Ng], delete e[mT], delete e[yT];
    }
    function yh(e, t) {
      t[Xc] = e;
    }
    function em(e, t) {
      t[mh] = e;
    }
    function yb(e) {
      e[mh] = null;
    }
    function gh(e) {
      return !!e[mh];
    }
    function os(e) {
      var t = e[Xc];
      if (t)
        return t;
      for (var i = e.parentNode; i;) {
        if (t = i[mh] || i[Xc], t) {
          var a = t.alternate;
          if (t.child !== null || a !== null && a.child !== null)
            for (var l = mb(e); l !== null;) {
              var f = l[Xc];
              if (f)
                return f;
              l = mb(l);
            }
          return t;
        }
        e = i, i = e.parentNode;
      }
      return null;
    }
    function Pl(e) {
      var t = e[Xc] || e[mh];
      return t && (t.tag === B || t.tag === X || t.tag === $e || t.tag === U) ? t : null;
    }
    function Zc(e) {
      if (e.tag === B || e.tag === X)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function tm(e) {
      return e[Ug] || null;
    }
    function zg(e, t) {
      e[Ug] = t;
    }
    function ST(e) {
      var t = e[Ng];
      return t === void 0 && (t = e[Ng] = /* @__PURE__ */ new Set()), t;
    }
    var gb = {}, Sb = s.ReactDebugCurrentFrame;
    function nm(e) {
      if (e) {
        var t = e._owner, i = vu(e.type, e._source, t ? t.type : null);
        Sb.setExtraStackFrame(i);
      } else
        Sb.setExtraStackFrame(null);
    }
    function la(e, t, i, a, l) {
      {
        var f = Function.call.bind(nr);
        for (var v in e)
          if (f(e, v)) {
            var S = void 0;
            try {
              if (typeof e[v] != "function") {
                var b = Error((a || "React class") + ": " + i + " type `" + v + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[v] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw b.name = "Invariant Violation", b;
              }
              S = e[v](t, v, a, i, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (x) {
              S = x;
            }
            S && !(S instanceof Error) && (nm(l), m("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", a || "React class", i, v, typeof S), nm(null)), S instanceof Error && !(S.message in gb) && (gb[S.message] = !0, nm(l), m("Failed %s type: %s", i, S.message), nm(null));
          }
      }
    }
    var jg = [], rm;
    rm = [];
    var Vo = -1;
    function Vl(e) {
      return {
        current: e
      };
    }
    function hr(e, t) {
      if (Vo < 0) {
        m("Unexpected pop.");
        return;
      }
      t !== rm[Vo] && m("Unexpected Fiber popped."), e.current = jg[Vo], jg[Vo] = null, rm[Vo] = null, Vo--;
    }
    function pr(e, t, i) {
      Vo++, jg[Vo] = e.current, rm[Vo] = i, e.current = t;
    }
    var Fg;
    Fg = {};
    var mi = {};
    Object.freeze(mi);
    var Bo = Vl(mi), Ja = Vl(!1), $g = mi;
    function ef(e, t, i) {
      return i && Xa(t) ? $g : Bo.current;
    }
    function wb(e, t, i) {
      {
        var a = e.stateNode;
        a.__reactInternalMemoizedUnmaskedChildContext = t, a.__reactInternalMemoizedMaskedChildContext = i;
      }
    }
    function tf(e, t) {
      {
        var i = e.type, a = i.contextTypes;
        if (!a)
          return mi;
        var l = e.stateNode;
        if (l && l.__reactInternalMemoizedUnmaskedChildContext === t)
          return l.__reactInternalMemoizedMaskedChildContext;
        var f = {};
        for (var v in a)
          f[v] = t[v];
        {
          var S = He(e) || "Unknown";
          la(a, f, "context", S);
        }
        return l && wb(e, t, f), f;
      }
    }
    function im() {
      return Ja.current;
    }
    function Xa(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function am(e) {
      hr(Ja, e), hr(Bo, e);
    }
    function Hg(e) {
      hr(Ja, e), hr(Bo, e);
    }
    function bb(e, t, i) {
      {
        if (Bo.current !== mi)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        pr(Bo, t, e), pr(Ja, i, e);
      }
    }
    function Eb(e, t, i) {
      {
        var a = e.stateNode, l = t.childContextTypes;
        if (typeof a.getChildContext != "function") {
          {
            var f = He(e) || "Unknown";
            Fg[f] || (Fg[f] = !0, m("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", f, f));
          }
          return i;
        }
        var v = a.getChildContext();
        for (var S in v)
          if (!(S in l))
            throw new Error((He(e) || "Unknown") + '.getChildContext(): key "' + S + '" is not defined in childContextTypes.');
        {
          var b = He(e) || "Unknown";
          la(l, v, "child context", b);
        }
        return Ge({}, i, v);
      }
    }
    function om(e) {
      {
        var t = e.stateNode, i = t && t.__reactInternalMemoizedMergedChildContext || mi;
        return $g = Bo.current, pr(Bo, i, e), pr(Ja, Ja.current, e), !0;
      }
    }
    function _b(e, t, i) {
      {
        var a = e.stateNode;
        if (!a)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (i) {
          var l = Eb(e, t, $g);
          a.__reactInternalMemoizedMergedChildContext = l, hr(Ja, e), hr(Bo, e), pr(Bo, l, e), pr(Ja, i, e);
        } else
          hr(Ja, e), pr(Ja, i, e);
      }
    }
    function wT(e) {
      {
        if (!bd(e) || e.tag !== R)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case U:
              return t.stateNode.context;
            case R: {
              var i = t.type;
              if (Xa(i))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var Bl = 0, lm = 1, Io = null, Pg = !1, Vg = !1;
    function Cb(e) {
      Io === null ? Io = [e] : Io.push(e);
    }
    function bT(e) {
      Pg = !0, Cb(e);
    }
    function xb() {
      Pg && Il();
    }
    function Il() {
      if (!Vg && Io !== null) {
        Vg = !0;
        var e = 0, t = qr();
        try {
          var i = !0, a = Io;
          for (ln(zn); e < a.length; e++) {
            var l = a[e];
            do
              l = l(i);
            while (l !== null);
          }
          Io = null, Pg = !1;
        } catch (f) {
          throw Io !== null && (Io = Io.slice(e + 1)), nc(ic, Il), f;
        } finally {
          ln(t), Vg = !1;
        }
      }
      return null;
    }
    var nf = [], rf = 0, um = null, sm = 0, Ai = [], Mi = 0, ls = null, Yo = 1, qo = "";
    function ET(e) {
      return ss(), (e.flags & gd) !== Te;
    }
    function _T(e) {
      return ss(), sm;
    }
    function CT() {
      var e = qo, t = Yo, i = t & ~xT(t);
      return i.toString(32) + e;
    }
    function us(e, t) {
      ss(), nf[rf++] = sm, nf[rf++] = um, um = e, sm = t;
    }
    function Tb(e, t, i) {
      ss(), Ai[Mi++] = Yo, Ai[Mi++] = qo, Ai[Mi++] = ls, ls = e;
      var a = Yo, l = qo, f = cm(a) - 1, v = a & ~(1 << f), S = i + 1, b = cm(t) + f;
      if (b > 30) {
        var x = f - f % 5, T = (1 << x) - 1, M = (v & T).toString(32), L = v >> x, H = f - x, P = cm(t) + H, I = S << H, de = I | L, Re = M + l;
        Yo = 1 << P | de, qo = Re;
      } else {
        var Ee = S << f, nt = Ee | v, Ke = l;
        Yo = 1 << b | nt, qo = Ke;
      }
    }
    function Bg(e) {
      ss();
      var t = e.return;
      if (t !== null) {
        var i = 1, a = 0;
        us(e, i), Tb(e, i, a);
      }
    }
    function cm(e) {
      return 32 - cc(e);
    }
    function xT(e) {
      return 1 << cm(e) - 1;
    }
    function Ig(e) {
      for (; e === um;)
        um = nf[--rf], nf[rf] = null, sm = nf[--rf], nf[rf] = null;
      for (; e === ls;)
        ls = Ai[--Mi], Ai[Mi] = null, qo = Ai[--Mi], Ai[Mi] = null, Yo = Ai[--Mi], Ai[Mi] = null;
    }
    function TT() {
      return ss(), ls !== null ? {
        id: Yo,
        overflow: qo
      } : null;
    }
    function RT(e, t) {
      ss(), Ai[Mi++] = Yo, Ai[Mi++] = qo, Ai[Mi++] = ls, Yo = t.id, qo = t.overflow, ls = e;
    }
    function ss() {
      Gn() || m("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Qn = null, Ui = null, ua = !1, cs = !1, Yl = null;
    function kT() {
      ua && m("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function Rb() {
      cs = !0;
    }
    function DT() {
      return cs;
    }
    function OT(e) {
      var t = e.stateNode.containerInfo;
      return Ui = Gx(t), Qn = e, ua = !0, Yl = null, cs = !1, !0;
    }
    function LT(e, t, i) {
      return Ui = Wx(t), Qn = e, ua = !0, Yl = null, cs = !1, i !== null && RT(e, i), !0;
    }
    function kb(e, t) {
      switch (e.tag) {
        case U: {
          aT(e.stateNode.containerInfo, t);
          break;
        }
        case B: {
          var i = (e.mode & Ye) !== De;
          lT(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            i
          );
          break;
        }
        case $e: {
          var a = e.memoizedState;
          a.dehydrated !== null && oT(a.dehydrated, t);
          break;
        }
      }
    }
    function Db(e, t) {
      kb(e, t);
      var i = UD();
      i.stateNode = t, i.return = e;
      var a = e.deletions;
      a === null ? (e.deletions = [i], e.flags |= st) : a.push(i);
    }
    function Yg(e, t) {
      {
        if (cs)
          return;
        switch (e.tag) {
          case U: {
            var i = e.stateNode.containerInfo;
            switch (t.tag) {
              case B:
                var a = t.type;
                t.pendingProps, uT(i, a);
                break;
              case X:
                var l = t.pendingProps;
                sT(i, l);
                break;
            }
            break;
          }
          case B: {
            var f = e.type, v = e.memoizedProps, S = e.stateNode;
            switch (t.tag) {
              case B: {
                var b = t.type, x = t.pendingProps, T = (e.mode & Ye) !== De;
                dT(
                  f,
                  v,
                  S,
                  b,
                  x,
                  // TODO: Delete this argument when we remove the legacy root API.
                  T
                );
                break;
              }
              case X: {
                var M = t.pendingProps, L = (e.mode & Ye) !== De;
                hT(
                  f,
                  v,
                  S,
                  M,
                  // TODO: Delete this argument when we remove the legacy root API.
                  L
                );
                break;
              }
            }
            break;
          }
          case $e: {
            var H = e.memoizedState, P = H.dehydrated;
            if (P !== null)
              switch (t.tag) {
                case B:
                  var I = t.type;
                  t.pendingProps, cT(P, I);
                  break;
                case X:
                  var de = t.pendingProps;
                  fT(P, de);
                  break;
              }
            break;
          }
          default:
            return;
        }
      }
    }
    function Ob(e, t) {
      t.flags = t.flags & ~Pr | xt, Yg(e, t);
    }
    function Lb(e, t) {
      switch (e.tag) {
        case B: {
          var i = e.type;
          e.pendingProps;
          var a = Vx(t, i);
          return a !== null ? (e.stateNode = a, Qn = e, Ui = Qx(a), !0) : !1;
        }
        case X: {
          var l = e.pendingProps, f = Bx(t, l);
          return f !== null ? (e.stateNode = f, Qn = e, Ui = null, !0) : !1;
        }
        case $e: {
          var v = Ix(t);
          if (v !== null) {
            var S = {
              dehydrated: v,
              treeContext: TT(),
              retryLane: fr
            };
            e.memoizedState = S;
            var b = ND(v);
            return b.return = e, e.child = b, Qn = e, Ui = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function qg(e) {
      return (e.mode & Ye) !== De && (e.flags & Ue) === Te;
    }
    function Qg(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function Gg(e) {
      if (ua) {
        var t = Ui;
        if (!t) {
          qg(e) && (Yg(Qn, e), Qg()), Ob(Qn, e), ua = !1, Qn = e;
          return;
        }
        var i = t;
        if (!Lb(e, t)) {
          qg(e) && (Yg(Qn, e), Qg()), t = vh(i);
          var a = Qn;
          if (!t || !Lb(e, t)) {
            Ob(Qn, e), ua = !1, Qn = e;
            return;
          }
          Db(a, i);
        }
      }
    }
    function AT(e, t, i) {
      var a = e.stateNode, l = !cs, f = Kx(a, e.type, e.memoizedProps, t, i, e, l);
      return e.updateQueue = f, f !== null;
    }
    function MT(e) {
      var t = e.stateNode, i = e.memoizedProps, a = Jx(t, i, e);
      if (a) {
        var l = Qn;
        if (l !== null)
          switch (l.tag) {
            case U: {
              var f = l.stateNode.containerInfo, v = (l.mode & Ye) !== De;
              rT(
                f,
                t,
                i,
                // TODO: Delete this argument when we remove the legacy root API.
                v
              );
              break;
            }
            case B: {
              var S = l.type, b = l.memoizedProps, x = l.stateNode, T = (l.mode & Ye) !== De;
              iT(
                S,
                b,
                x,
                t,
                i,
                // TODO: Delete this argument when we remove the legacy root API.
                T
              );
              break;
            }
          }
      }
      return a;
    }
    function UT(e) {
      var t = e.memoizedState, i = t !== null ? t.dehydrated : null;
      if (!i)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      Xx(i, e);
    }
    function NT(e) {
      var t = e.memoizedState, i = t !== null ? t.dehydrated : null;
      if (!i)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return Zx(i);
    }
    function Ab(e) {
      for (var t = e.return; t !== null && t.tag !== B && t.tag !== U && t.tag !== $e;)
        t = t.return;
      Qn = t;
    }
    function fm(e) {
      if (e !== Qn)
        return !1;
      if (!ua)
        return Ab(e), ua = !0, !1;
      if (e.tag !== U && (e.tag !== B || nT(e.type) && !Dg(e.type, e.memoizedProps))) {
        var t = Ui;
        if (t)
          if (qg(e))
            Mb(e), Qg();
          else
            for (; t;)
              Db(e, t), t = vh(t);
      }
      return Ab(e), e.tag === $e ? Ui = NT(e) : Ui = Qn ? vh(e.stateNode) : null, !0;
    }
    function zT() {
      return ua && Ui !== null;
    }
    function Mb(e) {
      for (var t = Ui; t;)
        kb(e, t), t = vh(t);
    }
    function af() {
      Qn = null, Ui = null, ua = !1, cs = !1;
    }
    function Ub() {
      Yl !== null && (kE(Yl), Yl = null);
    }
    function Gn() {
      return ua;
    }
    function Wg(e) {
      Yl === null ? Yl = [e] : Yl.push(e);
    }
    var jT = s.ReactCurrentBatchConfig, FT = null;
    function $T() {
      return jT.transition;
    }
    var sa = {
      recordUnsafeLifecycleWarnings: function (e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function () {
      },
      recordLegacyContextWarning: function (e, t) {
      },
      flushLegacyContextWarning: function () {
      },
      discardPendingWarnings: function () {
      }
    };
    {
      var HT = function (e) {
        for (var t = null, i = e; i !== null;)
          i.mode & Ut && (t = i), i = i.return;
        return t;
      }, fs = function (e) {
        var t = [];
        return e.forEach(function (i) {
          t.push(i);
        }), t.sort().join(", ");
      }, Sh = [], wh = [], bh = [], Eh = [], _h = [], Ch = [], ds = /* @__PURE__ */ new Set();
      sa.recordUnsafeLifecycleWarnings = function (e, t) {
        ds.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
          t.componentWillMount.__suppressDeprecationWarning !== !0 && Sh.push(e), e.mode & Ut && typeof t.UNSAFE_componentWillMount == "function" && wh.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && bh.push(e), e.mode & Ut && typeof t.UNSAFE_componentWillReceiveProps == "function" && Eh.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && _h.push(e), e.mode & Ut && typeof t.UNSAFE_componentWillUpdate == "function" && Ch.push(e));
      }, sa.flushPendingUnsafeLifecycleWarnings = function () {
        var e = /* @__PURE__ */ new Set();
        Sh.length > 0 && (Sh.forEach(function (L) {
          e.add(He(L) || "Component"), ds.add(L.type);
        }), Sh = []);
        var t = /* @__PURE__ */ new Set();
        wh.length > 0 && (wh.forEach(function (L) {
          t.add(He(L) || "Component"), ds.add(L.type);
        }), wh = []);
        var i = /* @__PURE__ */ new Set();
        bh.length > 0 && (bh.forEach(function (L) {
          i.add(He(L) || "Component"), ds.add(L.type);
        }), bh = []);
        var a = /* @__PURE__ */ new Set();
        Eh.length > 0 && (Eh.forEach(function (L) {
          a.add(He(L) || "Component"), ds.add(L.type);
        }), Eh = []);
        var l = /* @__PURE__ */ new Set();
        _h.length > 0 && (_h.forEach(function (L) {
          l.add(He(L) || "Component"), ds.add(L.type);
        }), _h = []);
        var f = /* @__PURE__ */ new Set();
        if (Ch.length > 0 && (Ch.forEach(function (L) {
          f.add(He(L) || "Component"), ds.add(L.type);
        }), Ch = []), t.size > 0) {
          var v = fs(t);
          m(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, v);
        }
        if (a.size > 0) {
          var S = fs(a);
          m(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, S);
        }
        if (f.size > 0) {
          var b = fs(f);
          m(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, b);
        }
        if (e.size > 0) {
          var x = fs(e);
          w(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, x);
        }
        if (i.size > 0) {
          var T = fs(i);
          w(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, T);
        }
        if (l.size > 0) {
          var M = fs(l);
          w(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, M);
        }
      };
      var dm = /* @__PURE__ */ new Map(), Nb = /* @__PURE__ */ new Set();
      sa.recordLegacyContextWarning = function (e, t) {
        var i = HT(e);
        if (i === null) {
          m("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!Nb.has(e.type)) {
          var a = dm.get(i);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (a === void 0 && (a = [], dm.set(i, a)), a.push(e));
        }
      }, sa.flushLegacyContextWarning = function () {
        dm.forEach(function (e, t) {
          if (e.length !== 0) {
            var i = e[0], a = /* @__PURE__ */ new Set();
            e.forEach(function (f) {
              a.add(He(f) || "Component"), Nb.add(f.type);
            });
            var l = fs(a);
            try {
              yt(i), m(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, l);
            } finally {
              rn();
            }
          }
        });
      }, sa.discardPendingWarnings = function () {
        Sh = [], wh = [], bh = [], Eh = [], _h = [], Ch = [], dm = /* @__PURE__ */ new Map();
      };
    }
    function ca(e, t) {
      if (e && e.defaultProps) {
        var i = Ge({}, t), a = e.defaultProps;
        for (var l in a)
          i[l] === void 0 && (i[l] = a[l]);
        return i;
      }
      return t;
    }
    var Kg = Vl(null), Jg;
    Jg = {};
    var hm = null, of = null, Xg = null, pm = !1;
    function vm() {
      hm = null, of = null, Xg = null, pm = !1;
    }
    function zb() {
      pm = !0;
    }
    function jb() {
      pm = !1;
    }
    function Fb(e, t, i) {
      pr(Kg, t._currentValue, e), t._currentValue = i, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== Jg && m("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = Jg;
    }
    function Zg(e, t) {
      var i = Kg.current;
      hr(Kg, t), e._currentValue = i;
    }
    function e0(e, t, i) {
      for (var a = e; a !== null;) {
        var l = a.alternate;
        if (Lo(a.childLanes, t) ? l !== null && !Lo(l.childLanes, t) && (l.childLanes = Be(l.childLanes, t)) : (a.childLanes = Be(a.childLanes, t), l !== null && (l.childLanes = Be(l.childLanes, t))), a === i)
          break;
        a = a.return;
      }
      a !== i && m("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function PT(e, t, i) {
      VT(e, t, i);
    }
    function VT(e, t, i) {
      var a = e.child;
      for (a !== null && (a.return = e); a !== null;) {
        var l = void 0, f = a.dependencies;
        if (f !== null) {
          l = a.child;
          for (var v = f.firstContext; v !== null;) {
            if (v.context === t) {
              if (a.tag === R) {
                var S = on(i), b = Qo(_t, S);
                b.tag = ym;
                var x = a.updateQueue;
                if (x !== null) {
                  var T = x.shared, M = T.pending;
                  M === null ? b.next = b : (b.next = M.next, M.next = b), T.pending = b;
                }
              }
              a.lanes = Be(a.lanes, i);
              var L = a.alternate;
              L !== null && (L.lanes = Be(L.lanes, i)), e0(a.return, i, e), f.lanes = Be(f.lanes, i);
              break;
            }
            v = v.next;
          }
        } else if (a.tag === Ce)
          l = a.type === e.type ? null : a.child;
        else if (a.tag === at) {
          var H = a.return;
          if (H === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          H.lanes = Be(H.lanes, i);
          var P = H.alternate;
          P !== null && (P.lanes = Be(P.lanes, i)), e0(H, i, e), l = a.sibling;
        } else
          l = a.child;
        if (l !== null)
          l.return = a;
        else
          for (l = a; l !== null;) {
            if (l === e) {
              l = null;
              break;
            }
            var I = l.sibling;
            if (I !== null) {
              I.return = l.return, l = I;
              break;
            }
            l = l.return;
          }
        a = l;
      }
    }
    function lf(e, t) {
      hm = e, of = null, Xg = null;
      var i = e.dependencies;
      if (i !== null) {
        var a = i.firstContext;
        a !== null && (dr(i.lanes, t) && Fh(), i.firstContext = null);
      }
    }
    function Sn(e) {
      pm && m("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (Xg !== e) {
        var i = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (of === null) {
          if (hm === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          of = i, hm.dependencies = {
            lanes: q,
            firstContext: i
          };
        } else
          of = of.next = i;
      }
      return t;
    }
    var hs = null;
    function t0(e) {
      hs === null ? hs = [e] : hs.push(e);
    }
    function BT() {
      if (hs !== null) {
        for (var e = 0; e < hs.length; e++) {
          var t = hs[e], i = t.interleaved;
          if (i !== null) {
            t.interleaved = null;
            var a = i.next, l = t.pending;
            if (l !== null) {
              var f = l.next;
              l.next = a, i.next = f;
            }
            t.pending = i;
          }
        }
        hs = null;
      }
    }
    function $b(e, t, i, a) {
      var l = t.interleaved;
      return l === null ? (i.next = i, t0(t)) : (i.next = l.next, l.next = i), t.interleaved = i, mm(e, a);
    }
    function IT(e, t, i, a) {
      var l = t.interleaved;
      l === null ? (i.next = i, t0(t)) : (i.next = l.next, l.next = i), t.interleaved = i;
    }
    function YT(e, t, i, a) {
      var l = t.interleaved;
      return l === null ? (i.next = i, t0(t)) : (i.next = l.next, l.next = i), t.interleaved = i, mm(e, a);
    }
    function Jr(e, t) {
      return mm(e, t);
    }
    var qT = mm;
    function mm(e, t) {
      e.lanes = Be(e.lanes, t);
      var i = e.alternate;
      i !== null && (i.lanes = Be(i.lanes, t)), i === null && (e.flags & (xt | Pr)) !== Te && HE(e);
      for (var a = e, l = e.return; l !== null;)
        l.childLanes = Be(l.childLanes, t), i = l.alternate, i !== null ? i.childLanes = Be(i.childLanes, t) : (l.flags & (xt | Pr)) !== Te && HE(e), a = l, l = l.return;
      if (a.tag === U) {
        var f = a.stateNode;
        return f;
      } else
        return null;
    }
    var Hb = 0, Pb = 1, ym = 2, n0 = 3, gm = !1, r0, Sm;
    r0 = !1, Sm = null;
    function i0(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: q
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function Vb(e, t) {
      var i = t.updateQueue, a = e.updateQueue;
      if (i === a) {
        var l = {
          baseState: a.baseState,
          firstBaseUpdate: a.firstBaseUpdate,
          lastBaseUpdate: a.lastBaseUpdate,
          shared: a.shared,
          effects: a.effects
        };
        t.updateQueue = l;
      }
    }
    function Qo(e, t) {
      var i = {
        eventTime: e,
        lane: t,
        tag: Hb,
        payload: null,
        callback: null,
        next: null
      };
      return i;
    }
    function ql(e, t, i) {
      var a = e.updateQueue;
      if (a === null)
        return null;
      var l = a.shared;
      if (Sm === l && !r0 && (m("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), r0 = !0), qk()) {
        var f = l.pending;
        return f === null ? t.next = t : (t.next = f.next, f.next = t), l.pending = t, qT(e, i);
      } else
        return YT(e, l, t, i);
    }
    function wm(e, t, i) {
      var a = t.updateQueue;
      if (a !== null) {
        var l = a.shared;
        if (Ud(i)) {
          var f = l.lanes;
          f = zd(f, e.pendingLanes);
          var v = Be(f, i);
          l.lanes = v, Tl(e, v);
        }
      }
    }
    function a0(e, t) {
      var i = e.updateQueue, a = e.alternate;
      if (a !== null) {
        var l = a.updateQueue;
        if (i === l) {
          var f = null, v = null, S = i.firstBaseUpdate;
          if (S !== null) {
            var b = S;
            do {
              var x = {
                eventTime: b.eventTime,
                lane: b.lane,
                tag: b.tag,
                payload: b.payload,
                callback: b.callback,
                next: null
              };
              v === null ? f = v = x : (v.next = x, v = x), b = b.next;
            } while (b !== null);
            v === null ? f = v = t : (v.next = t, v = t);
          } else
            f = v = t;
          i = {
            baseState: l.baseState,
            firstBaseUpdate: f,
            lastBaseUpdate: v,
            shared: l.shared,
            effects: l.effects
          }, e.updateQueue = i;
          return;
        }
      }
      var T = i.lastBaseUpdate;
      T === null ? i.firstBaseUpdate = t : T.next = t, i.lastBaseUpdate = t;
    }
    function QT(e, t, i, a, l, f) {
      switch (i.tag) {
        case Pb: {
          var v = i.payload;
          if (typeof v == "function") {
            zb();
            var S = v.call(f, a, l);
            {
              if (e.mode & Ut) {
                an(!0);
                try {
                  v.call(f, a, l);
                } finally {
                  an(!1);
                }
              }
              jb();
            }
            return S;
          }
          return v;
        }
        case n0:
          e.flags = e.flags & ~pn | Ue;
        case Hb: {
          var b = i.payload, x;
          if (typeof b == "function") {
            zb(), x = b.call(f, a, l);
            {
              if (e.mode & Ut) {
                an(!0);
                try {
                  b.call(f, a, l);
                } finally {
                  an(!1);
                }
              }
              jb();
            }
          } else
            x = b;
          return x == null ? a : Ge({}, a, x);
        }
        case ym:
          return gm = !0, a;
      }
      return a;
    }
    function bm(e, t, i, a) {
      var l = e.updateQueue;
      gm = !1, Sm = l.shared;
      var f = l.firstBaseUpdate, v = l.lastBaseUpdate, S = l.shared.pending;
      if (S !== null) {
        l.shared.pending = null;
        var b = S, x = b.next;
        b.next = null, v === null ? f = x : v.next = x, v = b;
        var T = e.alternate;
        if (T !== null) {
          var M = T.updateQueue, L = M.lastBaseUpdate;
          L !== v && (L === null ? M.firstBaseUpdate = x : L.next = x, M.lastBaseUpdate = b);
        }
      }
      if (f !== null) {
        var H = l.baseState, P = q, I = null, de = null, Re = null, Ee = f;
        do {
          var nt = Ee.lane, Ke = Ee.eventTime;
          if (Lo(a, nt)) {
            if (Re !== null) {
              var Y = {
                eventTime: Ke,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: et,
                tag: Ee.tag,
                payload: Ee.payload,
                callback: Ee.callback,
                next: null
              };
              Re = Re.next = Y;
            }
            H = QT(e, l, Ee, H, t, i);
            var j = Ee.callback;
            if (j !== null && // If the update was already committed, we should not queue its
              // callback again.
              Ee.lane !== et) {
              e.flags |= Ti;
              var J = l.effects;
              J === null ? l.effects = [Ee] : J.push(Ee);
            }
          } else {
            var z = {
              eventTime: Ke,
              lane: nt,
              tag: Ee.tag,
              payload: Ee.payload,
              callback: Ee.callback,
              next: null
            };
            Re === null ? (de = Re = z, I = H) : Re = Re.next = z, P = Be(P, nt);
          }
          if (Ee = Ee.next, Ee === null) {
            if (S = l.shared.pending, S === null)
              break;
            var he = S, se = he.next;
            he.next = null, Ee = se, l.lastBaseUpdate = he, l.shared.pending = null;
          }
        } while (!0);
        Re === null && (I = H), l.baseState = I, l.firstBaseUpdate = de, l.lastBaseUpdate = Re;
        var Me = l.shared.interleaved;
        if (Me !== null) {
          var Fe = Me;
          do
            P = Be(P, Fe.lane), Fe = Fe.next;
          while (Fe !== Me);
        } else
          f === null && (l.shared.lanes = q);
        Kh(P), e.lanes = P, e.memoizedState = H;
      }
      Sm = null;
    }
    function GT(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function Bb() {
      gm = !1;
    }
    function Em() {
      return gm;
    }
    function Ib(e, t, i) {
      var a = t.effects;
      if (t.effects = null, a !== null)
        for (var l = 0; l < a.length; l++) {
          var f = a[l], v = f.callback;
          v !== null && (f.callback = null, GT(v, i));
        }
    }
    var o0 = {}, Yb = new d.Component().refs, l0, u0, s0, c0, f0, qb, _m, d0, h0, p0;
    {
      l0 = /* @__PURE__ */ new Set(), u0 = /* @__PURE__ */ new Set(), s0 = /* @__PURE__ */ new Set(), c0 = /* @__PURE__ */ new Set(), d0 = /* @__PURE__ */ new Set(), f0 = /* @__PURE__ */ new Set(), h0 = /* @__PURE__ */ new Set(), p0 = /* @__PURE__ */ new Set();
      var Qb = /* @__PURE__ */ new Set();
      _m = function (e, t) {
        if (!(e === null || typeof e == "function")) {
          var i = t + "_" + e;
          Qb.has(i) || (Qb.add(i), m("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, qb = function (e, t) {
        if (t === void 0) {
          var i = bt(e) || "Component";
          f0.has(i) || (f0.add(i), m("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", i));
        }
      }, Object.defineProperty(o0, "_processChildContext", {
        enumerable: !1,
        value: function () {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(o0);
    }
    function v0(e, t, i, a) {
      var l = e.memoizedState, f = i(a, l);
      {
        if (e.mode & Ut) {
          an(!0);
          try {
            f = i(a, l);
          } finally {
            an(!1);
          }
        }
        qb(t, f);
      }
      var v = f == null ? l : Ge({}, l, f);
      if (e.memoizedState = v, e.lanes === q) {
        var S = e.updateQueue;
        S.baseState = v;
      }
    }
    var m0 = {
      isMounted: _r,
      enqueueSetState: function (e, t, i) {
        var a = $r(e), l = Dr(), f = eu(a), v = Qo(l, f);
        v.payload = t, i != null && (_m(i, "setState"), v.callback = i);
        var S = ql(a, v, f);
        S !== null && (On(S, a, f, l), wm(S, a, f)), Va(a, f);
      },
      enqueueReplaceState: function (e, t, i) {
        var a = $r(e), l = Dr(), f = eu(a), v = Qo(l, f);
        v.tag = Pb, v.payload = t, i != null && (_m(i, "replaceState"), v.callback = i);
        var S = ql(a, v, f);
        S !== null && (On(S, a, f, l), wm(S, a, f)), Va(a, f);
      },
      enqueueForceUpdate: function (e, t) {
        var i = $r(e), a = Dr(), l = eu(i), f = Qo(a, l);
        f.tag = ym, t != null && (_m(t, "forceUpdate"), f.callback = t);
        var v = ql(i, f, l);
        v !== null && (On(v, i, l, a), wm(v, i, l)), Od(i, l);
      }
    };
    function Gb(e, t, i, a, l, f, v) {
      var S = e.stateNode;
      if (typeof S.shouldComponentUpdate == "function") {
        var b = S.shouldComponentUpdate(a, f, v);
        {
          if (e.mode & Ut) {
            an(!0);
            try {
              b = S.shouldComponentUpdate(a, f, v);
            } finally {
              an(!1);
            }
          }
          b === void 0 && m("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", bt(t) || "Component");
        }
        return b;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !xe(i, a) || !xe(l, f) : !0;
    }
    function WT(e, t, i) {
      var a = e.stateNode;
      {
        var l = bt(t) || "Component", f = a.render;
        f || (t.prototype && typeof t.prototype.render == "function" ? m("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", l) : m("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", l)), a.getInitialState && !a.getInitialState.isReactClassApproved && !a.state && m("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", l), a.getDefaultProps && !a.getDefaultProps.isReactClassApproved && m("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", l), a.propTypes && m("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", l), a.contextType && m("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", l), a.contextTypes && m("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", l), t.contextType && t.contextTypes && !h0.has(t) && (h0.add(t), m("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", l)), typeof a.componentShouldUpdate == "function" && m("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", l), t.prototype && t.prototype.isPureReactComponent && typeof a.shouldComponentUpdate < "u" && m("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", bt(t) || "A pure component"), typeof a.componentDidUnmount == "function" && m("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", l), typeof a.componentDidReceiveProps == "function" && m("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", l), typeof a.componentWillRecieveProps == "function" && m("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", l), typeof a.UNSAFE_componentWillRecieveProps == "function" && m("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", l);
        var v = a.props !== i;
        a.props !== void 0 && v && m("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", l, l), a.defaultProps && m("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", l, l), typeof a.getSnapshotBeforeUpdate == "function" && typeof a.componentDidUpdate != "function" && !s0.has(t) && (s0.add(t), m("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", bt(t))), typeof a.getDerivedStateFromProps == "function" && m("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", l), typeof a.getDerivedStateFromError == "function" && m("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", l), typeof t.getSnapshotBeforeUpdate == "function" && m("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", l);
        var S = a.state;
        S && (typeof S != "object" || dn(S)) && m("%s.state: must be set to an object or null", l), typeof a.getChildContext == "function" && typeof t.childContextTypes != "object" && m("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", l);
      }
    }
    function Wb(e, t) {
      t.updater = m0, e.stateNode = t, ml(t, e), t._reactInternalInstance = o0;
    }
    function Kb(e, t, i) {
      var a = !1, l = mi, f = mi, v = t.contextType;
      if ("contextType" in t) {
        var S = (
          // Allow null for conditional declaration
          v === null || v !== void 0 && v.$$typeof === Ff && v._context === void 0
        );
        if (!S && !p0.has(t)) {
          p0.add(t);
          var b = "";
          v === void 0 ? b = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof v != "object" ? b = " However, it is set to a " + typeof v + "." : v.$$typeof === jf ? b = " Did you accidentally pass the Context.Provider instead?" : v._context !== void 0 ? b = " Did you accidentally pass the Context.Consumer instead?" : b = " However, it is set to an object with keys {" + Object.keys(v).join(", ") + "}.", m("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", bt(t) || "Component", b);
        }
      }
      if (typeof v == "object" && v !== null)
        f = Sn(v);
      else {
        l = ef(e, t, !0);
        var x = t.contextTypes;
        a = x != null, f = a ? tf(e, l) : mi;
      }
      var T = new t(i, f);
      if (e.mode & Ut) {
        an(!0);
        try {
          T = new t(i, f);
        } finally {
          an(!1);
        }
      }
      var M = e.memoizedState = T.state !== null && T.state !== void 0 ? T.state : null;
      Wb(e, T);
      {
        if (typeof t.getDerivedStateFromProps == "function" && M === null) {
          var L = bt(t) || "Component";
          u0.has(L) || (u0.add(L), m("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", L, T.state === null ? "null" : "undefined", L));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof T.getSnapshotBeforeUpdate == "function") {
          var H = null, P = null, I = null;
          if (typeof T.componentWillMount == "function" && T.componentWillMount.__suppressDeprecationWarning !== !0 ? H = "componentWillMount" : typeof T.UNSAFE_componentWillMount == "function" && (H = "UNSAFE_componentWillMount"), typeof T.componentWillReceiveProps == "function" && T.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? P = "componentWillReceiveProps" : typeof T.UNSAFE_componentWillReceiveProps == "function" && (P = "UNSAFE_componentWillReceiveProps"), typeof T.componentWillUpdate == "function" && T.componentWillUpdate.__suppressDeprecationWarning !== !0 ? I = "componentWillUpdate" : typeof T.UNSAFE_componentWillUpdate == "function" && (I = "UNSAFE_componentWillUpdate"), H !== null || P !== null || I !== null) {
            var de = bt(t) || "Component", Re = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            c0.has(de) || (c0.add(de), m(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, de, Re, H !== null ? `
  ` + H : "", P !== null ? `
  ` + P : "", I !== null ? `
  ` + I : ""));
          }
        }
      }
      return a && wb(e, l, f), T;
    }
    function KT(e, t) {
      var i = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), i !== t.state && (m("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", He(e) || "Component"), m0.enqueueReplaceState(t, t.state, null));
    }
    function Jb(e, t, i, a) {
      var l = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(i, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(i, a), t.state !== l) {
        {
          var f = He(e) || "Component";
          l0.has(f) || (l0.add(f), m("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", f));
        }
        m0.enqueueReplaceState(t, t.state, null);
      }
    }
    function y0(e, t, i, a) {
      WT(e, t, i);
      var l = e.stateNode;
      l.props = i, l.state = e.memoizedState, l.refs = Yb, i0(e);
      var f = t.contextType;
      if (typeof f == "object" && f !== null)
        l.context = Sn(f);
      else {
        var v = ef(e, t, !0);
        l.context = tf(e, v);
      }
      {
        if (l.state === i) {
          var S = bt(t) || "Component";
          d0.has(S) || (d0.add(S), m("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", S));
        }
        e.mode & Ut && sa.recordLegacyContextWarning(e, l), sa.recordUnsafeLifecycleWarnings(e, l);
      }
      l.state = e.memoizedState;
      var b = t.getDerivedStateFromProps;
      if (typeof b == "function" && (v0(e, t, b, i), l.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof l.getSnapshotBeforeUpdate != "function" && (typeof l.UNSAFE_componentWillMount == "function" || typeof l.componentWillMount == "function") && (KT(e, l), bm(e, i, l, a), l.state = e.memoizedState), typeof l.componentDidMount == "function") {
        var x = Ve;
        x |= or, (e.mode & Ir) !== De && (x |= lr), e.flags |= x;
      }
    }
    function JT(e, t, i, a) {
      var l = e.stateNode, f = e.memoizedProps;
      l.props = f;
      var v = l.context, S = t.contextType, b = mi;
      if (typeof S == "object" && S !== null)
        b = Sn(S);
      else {
        var x = ef(e, t, !0);
        b = tf(e, x);
      }
      var T = t.getDerivedStateFromProps, M = typeof T == "function" || typeof l.getSnapshotBeforeUpdate == "function";
      !M && (typeof l.UNSAFE_componentWillReceiveProps == "function" || typeof l.componentWillReceiveProps == "function") && (f !== i || v !== b) && Jb(e, l, i, b), Bb();
      var L = e.memoizedState, H = l.state = L;
      if (bm(e, i, l, a), H = e.memoizedState, f === i && L === H && !im() && !Em()) {
        if (typeof l.componentDidMount == "function") {
          var P = Ve;
          P |= or, (e.mode & Ir) !== De && (P |= lr), e.flags |= P;
        }
        return !1;
      }
      typeof T == "function" && (v0(e, t, T, i), H = e.memoizedState);
      var I = Em() || Gb(e, t, f, i, L, H, b);
      if (I) {
        if (!M && (typeof l.UNSAFE_componentWillMount == "function" || typeof l.componentWillMount == "function") && (typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount()), typeof l.componentDidMount == "function") {
          var de = Ve;
          de |= or, (e.mode & Ir) !== De && (de |= lr), e.flags |= de;
        }
      } else {
        if (typeof l.componentDidMount == "function") {
          var Re = Ve;
          Re |= or, (e.mode & Ir) !== De && (Re |= lr), e.flags |= Re;
        }
        e.memoizedProps = i, e.memoizedState = H;
      }
      return l.props = i, l.state = H, l.context = b, I;
    }
    function XT(e, t, i, a, l) {
      var f = t.stateNode;
      Vb(e, t);
      var v = t.memoizedProps, S = t.type === t.elementType ? v : ca(t.type, v);
      f.props = S;
      var b = t.pendingProps, x = f.context, T = i.contextType, M = mi;
      if (typeof T == "object" && T !== null)
        M = Sn(T);
      else {
        var L = ef(t, i, !0);
        M = tf(t, L);
      }
      var H = i.getDerivedStateFromProps, P = typeof H == "function" || typeof f.getSnapshotBeforeUpdate == "function";
      !P && (typeof f.UNSAFE_componentWillReceiveProps == "function" || typeof f.componentWillReceiveProps == "function") && (v !== b || x !== M) && Jb(t, f, a, M), Bb();
      var I = t.memoizedState, de = f.state = I;
      if (bm(t, a, f, l), de = t.memoizedState, v === b && I === de && !im() && !Em() && !we)
        return typeof f.componentDidUpdate == "function" && (v !== e.memoizedProps || I !== e.memoizedState) && (t.flags |= Ve), typeof f.getSnapshotBeforeUpdate == "function" && (v !== e.memoizedProps || I !== e.memoizedState) && (t.flags |= Hr), !1;
      typeof H == "function" && (v0(t, i, H, a), de = t.memoizedState);
      var Re = Em() || Gb(t, i, S, a, I, de, M) || // TODO: In some cases, we'll end up checking if context has changed twice,
        // both before and after `shouldComponentUpdate` has been called. Not ideal,
        // but I'm loath to refactor this function. This only happens for memoized
        // components so it's not that common.
        we;
      return Re ? (!P && (typeof f.UNSAFE_componentWillUpdate == "function" || typeof f.componentWillUpdate == "function") && (typeof f.componentWillUpdate == "function" && f.componentWillUpdate(a, de, M), typeof f.UNSAFE_componentWillUpdate == "function" && f.UNSAFE_componentWillUpdate(a, de, M)), typeof f.componentDidUpdate == "function" && (t.flags |= Ve), typeof f.getSnapshotBeforeUpdate == "function" && (t.flags |= Hr)) : (typeof f.componentDidUpdate == "function" && (v !== e.memoizedProps || I !== e.memoizedState) && (t.flags |= Ve), typeof f.getSnapshotBeforeUpdate == "function" && (v !== e.memoizedProps || I !== e.memoizedState) && (t.flags |= Hr), t.memoizedProps = a, t.memoizedState = de), f.props = a, f.state = de, f.context = M, Re;
    }
    var g0, S0, w0, b0, E0, Xb = function (e, t) {
    };
    g0 = !1, S0 = !1, w0 = {}, b0 = {}, E0 = {}, Xb = function (e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var i = He(t) || "Component";
        b0[i] || (b0[i] = !0, m('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function xh(e, t, i) {
      var a = i.ref;
      if (a !== null && typeof a != "function" && typeof a != "object") {
        if ((e.mode & Ut || Bn) && // We warn in ReactElement.js if owner and self are equal for string refs
          // because these cannot be automatically converted to an arrow function
          // using a codemod. Therefore, we don't have to warn about string refs again.
          !(i._owner && i._self && i._owner.stateNode !== i._self)) {
          var l = He(e) || "Component";
          w0[l] || (m('A string ref, "%s", has been found within a strict mode tree. String refs are a source of potential bugs and should be avoided. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', a), w0[l] = !0);
        }
        if (i._owner) {
          var f = i._owner, v;
          if (f) {
            var S = f;
            if (S.tag !== R)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            v = S.stateNode;
          }
          if (!v)
            throw new Error("Missing owner for string ref " + a + ". This error is likely caused by a bug in React. Please file an issue.");
          var b = v;
          lo(a, "ref");
          var x = "" + a;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === x)
            return t.ref;
          var T = function (M) {
            var L = b.refs;
            L === Yb && (L = b.refs = {}), M === null ? delete L[x] : L[x] = M;
          };
          return T._stringRef = x, T;
        } else {
          if (typeof a != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!i._owner)
            throw new Error("Element ref was specified as a string (" + a + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return a;
    }
    function Cm(e, t) {
      var i = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (i === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : i) + "). If you meant to render a collection of children, use an array instead.");
    }
    function xm(e) {
      {
        var t = He(e) || "Component";
        if (E0[t])
          return;
        E0[t] = !0, m("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function Zb(e) {
      var t = e._payload, i = e._init;
      return i(t);
    }
    function e1(e) {
      function t(z, Y) {
        if (e) {
          var j = z.deletions;
          j === null ? (z.deletions = [Y], z.flags |= st) : j.push(Y);
        }
      }
      function i(z, Y) {
        if (!e)
          return null;
        for (var j = Y; j !== null;)
          t(z, j), j = j.sibling;
        return null;
      }
      function a(z, Y) {
        for (var j = /* @__PURE__ */ new Map(), J = Y; J !== null;)
          J.key !== null ? j.set(J.key, J) : j.set(J.index, J), J = J.sibling;
        return j;
      }
      function l(z, Y) {
        var j = bs(z, Y);
        return j.index = 0, j.sibling = null, j;
      }
      function f(z, Y, j) {
        if (z.index = j, !e)
          return z.flags |= gd, Y;
        var J = z.alternate;
        if (J !== null) {
          var he = J.index;
          return he < Y ? (z.flags |= xt, Y) : he;
        } else
          return z.flags |= xt, Y;
      }
      function v(z) {
        return e && z.alternate === null && (z.flags |= xt), z;
      }
      function S(z, Y, j, J) {
        if (Y === null || Y.tag !== X) {
          var he = WS(j, z.mode, J);
          return he.return = z, he;
        } else {
          var se = l(Y, j);
          return se.return = z, se;
        }
      }
      function b(z, Y, j, J) {
        var he = j.type;
        if (he === Bi)
          return T(z, Y, j.props.children, J, j.key);
        if (Y !== null && (Y.elementType === he || // Keep this check inline so it only runs on the false path:
          IE(Y, j) || // Lazy types should reconcile their resolved type.
          // We need to do this after the Hot Reloading check above,
          // because hot reloading has different semantics than prod because
          // it doesn't resuspend. So we can't let the call below suspend.
          typeof he == "object" && he !== null && he.$$typeof === Yn && Zb(he) === Y.type)) {
          var se = l(Y, j.props);
          return se.ref = xh(z, Y, j), se.return = z, se._debugSource = j._source, se._debugOwner = j._owner, se;
        }
        var Me = GS(j, z.mode, J);
        return Me.ref = xh(z, Y, j), Me.return = z, Me;
      }
      function x(z, Y, j, J) {
        if (Y === null || Y.tag !== $ || Y.stateNode.containerInfo !== j.containerInfo || Y.stateNode.implementation !== j.implementation) {
          var he = KS(j, z.mode, J);
          return he.return = z, he;
        } else {
          var se = l(Y, j.children || []);
          return se.return = z, se;
        }
      }
      function T(z, Y, j, J, he) {
        if (Y === null || Y.tag !== ee) {
          var se = nu(j, z.mode, J, he);
          return se.return = z, se;
        } else {
          var Me = l(Y, j);
          return Me.return = z, Me;
        }
      }
      function M(z, Y, j) {
        if (typeof Y == "string" && Y !== "" || typeof Y == "number") {
          var J = WS("" + Y, z.mode, j);
          return J.return = z, J;
        }
        if (typeof Y == "object" && Y !== null) {
          switch (Y.$$typeof) {
            case tl: {
              var he = GS(Y, z.mode, j);
              return he.ref = xh(z, null, Y), he.return = z, he;
            }
            case li: {
              var se = KS(Y, z.mode, j);
              return se.return = z, se;
            }
            case Yn: {
              var Me = Y._payload, Fe = Y._init;
              return M(z, Fe(Me), j);
            }
          }
          if (dn(Y) || Ii(Y)) {
            var St = nu(Y, z.mode, j, null);
            return St.return = z, St;
          }
          Cm(z, Y);
        }
        return typeof Y == "function" && xm(z), null;
      }
      function L(z, Y, j, J) {
        var he = Y !== null ? Y.key : null;
        if (typeof j == "string" && j !== "" || typeof j == "number")
          return he !== null ? null : S(z, Y, "" + j, J);
        if (typeof j == "object" && j !== null) {
          switch (j.$$typeof) {
            case tl:
              return j.key === he ? b(z, Y, j, J) : null;
            case li:
              return j.key === he ? x(z, Y, j, J) : null;
            case Yn: {
              var se = j._payload, Me = j._init;
              return L(z, Y, Me(se), J);
            }
          }
          if (dn(j) || Ii(j))
            return he !== null ? null : T(z, Y, j, J, null);
          Cm(z, j);
        }
        return typeof j == "function" && xm(z), null;
      }
      function H(z, Y, j, J, he) {
        if (typeof J == "string" && J !== "" || typeof J == "number") {
          var se = z.get(j) || null;
          return S(Y, se, "" + J, he);
        }
        if (typeof J == "object" && J !== null) {
          switch (J.$$typeof) {
            case tl: {
              var Me = z.get(J.key === null ? j : J.key) || null;
              return b(Y, Me, J, he);
            }
            case li: {
              var Fe = z.get(J.key === null ? j : J.key) || null;
              return x(Y, Fe, J, he);
            }
            case Yn:
              var St = J._payload, ot = J._init;
              return H(z, Y, j, ot(St), he);
          }
          if (dn(J) || Ii(J)) {
            var cn = z.get(j) || null;
            return T(Y, cn, J, he, null);
          }
          Cm(Y, J);
        }
        return typeof J == "function" && xm(Y), null;
      }
      function P(z, Y, j) {
        {
          if (typeof z != "object" || z === null)
            return Y;
          switch (z.$$typeof) {
            case tl:
            case li:
              Xb(z, j);
              var J = z.key;
              if (typeof J != "string")
                break;
              if (Y === null) {
                Y = /* @__PURE__ */ new Set(), Y.add(J);
                break;
              }
              if (!Y.has(J)) {
                Y.add(J);
                break;
              }
              m("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", J);
              break;
            case Yn:
              var he = z._payload, se = z._init;
              P(se(he), Y, j);
              break;
          }
        }
        return Y;
      }
      function I(z, Y, j, J) {
        for (var he = null, se = 0; se < j.length; se++) {
          var Me = j[se];
          he = P(Me, he, z);
        }
        for (var Fe = null, St = null, ot = Y, cn = 0, lt = 0, tn = null; ot !== null && lt < j.length; lt++) {
          ot.index > lt ? (tn = ot, ot = null) : tn = ot.sibling;
          var mr = L(z, ot, j[lt], J);
          if (mr === null) {
            ot === null && (ot = tn);
            break;
          }
          e && ot && mr.alternate === null && t(z, ot), cn = f(mr, cn, lt), St === null ? Fe = mr : St.sibling = mr, St = mr, ot = tn;
        }
        if (lt === j.length) {
          if (i(z, ot), Gn()) {
            var tr = lt;
            us(z, tr);
          }
          return Fe;
        }
        if (ot === null) {
          for (; lt < j.length; lt++) {
            var gi = M(z, j[lt], J);
            gi !== null && (cn = f(gi, cn, lt), St === null ? Fe = gi : St.sibling = gi, St = gi);
          }
          if (Gn()) {
            var Or = lt;
            us(z, Or);
          }
          return Fe;
        }
        for (var Lr = a(z, ot); lt < j.length; lt++) {
          var yr = H(Lr, z, lt, j[lt], J);
          yr !== null && (e && yr.alternate !== null && Lr.delete(yr.key === null ? lt : yr.key), cn = f(yr, cn, lt), St === null ? Fe = yr : St.sibling = yr, St = yr);
        }
        if (e && Lr.forEach(function (Cf) {
          return t(z, Cf);
        }), Gn()) {
          var Zo = lt;
          us(z, Zo);
        }
        return Fe;
      }
      function de(z, Y, j, J) {
        var he = Ii(j);
        if (typeof he != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
            j[Symbol.toStringTag] === "Generator" && (S0 || m("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), S0 = !0), j.entries === he && (g0 || m("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), g0 = !0);
          var se = he.call(j);
          if (se)
            for (var Me = null, Fe = se.next(); !Fe.done; Fe = se.next()) {
              var St = Fe.value;
              Me = P(St, Me, z);
            }
        }
        var ot = he.call(j);
        if (ot == null)
          throw new Error("An iterable object provided no iterator.");
        for (var cn = null, lt = null, tn = Y, mr = 0, tr = 0, gi = null, Or = ot.next(); tn !== null && !Or.done; tr++, Or = ot.next()) {
          tn.index > tr ? (gi = tn, tn = null) : gi = tn.sibling;
          var Lr = L(z, tn, Or.value, J);
          if (Lr === null) {
            tn === null && (tn = gi);
            break;
          }
          e && tn && Lr.alternate === null && t(z, tn), mr = f(Lr, mr, tr), lt === null ? cn = Lr : lt.sibling = Lr, lt = Lr, tn = gi;
        }
        if (Or.done) {
          if (i(z, tn), Gn()) {
            var yr = tr;
            us(z, yr);
          }
          return cn;
        }
        if (tn === null) {
          for (; !Or.done; tr++, Or = ot.next()) {
            var Zo = M(z, Or.value, J);
            Zo !== null && (mr = f(Zo, mr, tr), lt === null ? cn = Zo : lt.sibling = Zo, lt = Zo);
          }
          if (Gn()) {
            var Cf = tr;
            us(z, Cf);
          }
          return cn;
        }
        for (var tp = a(z, tn); !Or.done; tr++, Or = ot.next()) {
          var oo = H(tp, z, tr, Or.value, J);
          oo !== null && (e && oo.alternate !== null && tp.delete(oo.key === null ? tr : oo.key), mr = f(oo, mr, tr), lt === null ? cn = oo : lt.sibling = oo, lt = oo);
        }
        if (e && tp.forEach(function (dO) {
          return t(z, dO);
        }), Gn()) {
          var fO = tr;
          us(z, fO);
        }
        return cn;
      }
      function Re(z, Y, j, J) {
        if (Y !== null && Y.tag === X) {
          i(z, Y.sibling);
          var he = l(Y, j);
          return he.return = z, he;
        }
        i(z, Y);
        var se = WS(j, z.mode, J);
        return se.return = z, se;
      }
      function Ee(z, Y, j, J) {
        for (var he = j.key, se = Y; se !== null;) {
          if (se.key === he) {
            var Me = j.type;
            if (Me === Bi) {
              if (se.tag === ee) {
                i(z, se.sibling);
                var Fe = l(se, j.props.children);
                return Fe.return = z, Fe._debugSource = j._source, Fe._debugOwner = j._owner, Fe;
              }
            } else if (se.elementType === Me || // Keep this check inline so it only runs on the false path:
              IE(se, j) || // Lazy types should reconcile their resolved type.
              // We need to do this after the Hot Reloading check above,
              // because hot reloading has different semantics than prod because
              // it doesn't resuspend. So we can't let the call below suspend.
              typeof Me == "object" && Me !== null && Me.$$typeof === Yn && Zb(Me) === se.type) {
              i(z, se.sibling);
              var St = l(se, j.props);
              return St.ref = xh(z, se, j), St.return = z, St._debugSource = j._source, St._debugOwner = j._owner, St;
            }
            i(z, se);
            break;
          } else
            t(z, se);
          se = se.sibling;
        }
        if (j.type === Bi) {
          var ot = nu(j.props.children, z.mode, J, j.key);
          return ot.return = z, ot;
        } else {
          var cn = GS(j, z.mode, J);
          return cn.ref = xh(z, Y, j), cn.return = z, cn;
        }
      }
      function nt(z, Y, j, J) {
        for (var he = j.key, se = Y; se !== null;) {
          if (se.key === he)
            if (se.tag === $ && se.stateNode.containerInfo === j.containerInfo && se.stateNode.implementation === j.implementation) {
              i(z, se.sibling);
              var Me = l(se, j.children || []);
              return Me.return = z, Me;
            } else {
              i(z, se);
              break;
            }
          else
            t(z, se);
          se = se.sibling;
        }
        var Fe = KS(j, z.mode, J);
        return Fe.return = z, Fe;
      }
      function Ke(z, Y, j, J) {
        var he = typeof j == "object" && j !== null && j.type === Bi && j.key === null;
        if (he && (j = j.props.children), typeof j == "object" && j !== null) {
          switch (j.$$typeof) {
            case tl:
              return v(Ee(z, Y, j, J));
            case li:
              return v(nt(z, Y, j, J));
            case Yn:
              var se = j._payload, Me = j._init;
              return Ke(z, Y, Me(se), J);
          }
          if (dn(j))
            return I(z, Y, j, J);
          if (Ii(j))
            return de(z, Y, j, J);
          Cm(z, j);
        }
        return typeof j == "string" && j !== "" || typeof j == "number" ? v(Re(z, Y, "" + j, J)) : (typeof j == "function" && xm(z), i(z, Y));
      }
      return Ke;
    }
    var uf = e1(!0), t1 = e1(!1);
    function ZT(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var i = t.child, a = bs(i, i.pendingProps);
        for (t.child = a, a.return = t; i.sibling !== null;)
          i = i.sibling, a = a.sibling = bs(i, i.pendingProps), a.return = t;
        a.sibling = null;
      }
    }
    function eR(e, t) {
      for (var i = e.child; i !== null;)
        DD(i, t), i = i.sibling;
    }
    var Th = {}, Ql = Vl(Th), Rh = Vl(Th), Tm = Vl(Th);
    function Rm(e) {
      if (e === Th)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function n1() {
      var e = Rm(Tm.current);
      return e;
    }
    function _0(e, t) {
      pr(Tm, t, e), pr(Rh, e, e), pr(Ql, Th, e);
      var i = px(t);
      hr(Ql, e), pr(Ql, i, e);
    }
    function sf(e) {
      hr(Ql, e), hr(Rh, e), hr(Tm, e);
    }
    function C0() {
      var e = Rm(Ql.current);
      return e;
    }
    function r1(e) {
      Rm(Tm.current);
      var t = Rm(Ql.current), i = vx(t, e.type);
      t !== i && (pr(Rh, e, e), pr(Ql, i, e));
    }
    function x0(e) {
      Rh.current === e && (hr(Ql, e), hr(Rh, e));
    }
    var tR = 0, i1 = 1, a1 = 1, kh = 2, fa = Vl(tR);
    function T0(e, t) {
      return (e & t) !== 0;
    }
    function cf(e) {
      return e & i1;
    }
    function R0(e, t) {
      return e & i1 | t;
    }
    function nR(e, t) {
      return e | t;
    }
    function Gl(e, t) {
      pr(fa, t, e);
    }
    function ff(e) {
      hr(fa, e);
    }
    function rR(e, t) {
      var i = e.memoizedState;
      return i !== null ? i.dehydrated !== null : (e.memoizedProps, !0);
    }
    function km(e) {
      for (var t = e; t !== null;) {
        if (t.tag === $e) {
          var i = t.memoizedState;
          if (i !== null) {
            var a = i.dehydrated;
            if (a === null || vb(a) || Mg(a))
              return t;
          }
        } else if (t.tag === ht && // revealOrder undefined can't be trusted because it don't
          // keep track of whether it suspended or not.
          t.memoizedProps.revealOrder !== void 0) {
          var l = (t.flags & Ue) !== Te;
          if (l)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null;) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var Xr = (
      /*   */
      0
    ), _n = (
      /* */
      1
    ), Za = (
      /*  */
      2
    ), Cn = (
      /*    */
      4
    ), Wn = (
      /*   */
      8
    ), k0 = [];
    function D0() {
      for (var e = 0; e < k0.length; e++) {
        var t = k0[e];
        t._workInProgressVersionPrimary = null;
      }
      k0.length = 0;
    }
    function iR(e, t) {
      var i = t._getVersion, a = i(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, a] : e.mutableSourceEagerHydrationData.push(t, a);
    }
    var fe = s.ReactCurrentDispatcher, Dh = s.ReactCurrentBatchConfig, O0, df;
    O0 = /* @__PURE__ */ new Set();
    var ps = q, gt = null, xn = null, Tn = null, Dm = !1, Oh = !1, Lh = 0, aR = 0, oR = 25, Q = null, Ni = null, Wl = -1, L0 = !1;
    function vt() {
      {
        var e = Q;
        Ni === null ? Ni = [e] : Ni.push(e);
      }
    }
    function ae() {
      {
        var e = Q;
        Ni !== null && (Wl++, Ni[Wl] !== e && lR(e));
      }
    }
    function hf(e) {
      e != null && !dn(e) && m("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", Q, typeof e);
    }
    function lR(e) {
      {
        var t = He(gt);
        if (!O0.has(t) && (O0.add(t), Ni !== null)) {
          for (var i = "", a = 30, l = 0; l <= Wl; l++) {
            for (var f = Ni[l], v = l === Wl ? e : f, S = l + 1 + ". " + f; S.length < a;)
              S += " ";
            S += v + `
`, i += S;
          }
          m(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, i);
        }
      }
    }
    function vr() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function A0(e, t) {
      if (L0)
        return !1;
      if (t === null)
        return m("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", Q), !1;
      e.length !== t.length && m(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, Q, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var i = 0; i < t.length && i < e.length; i++)
        if (!ye(e[i], t[i]))
          return !1;
      return !0;
    }
    function pf(e, t, i, a, l, f) {
      ps = f, gt = t, Ni = e !== null ? e._debugHookTypes : null, Wl = -1, L0 = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = q, e !== null && e.memoizedState !== null ? fe.current = R1 : Ni !== null ? fe.current = T1 : fe.current = x1;
      var v = i(a, l);
      if (Oh) {
        var S = 0;
        do {
          if (Oh = !1, Lh = 0, S >= oR)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          S += 1, L0 = !1, xn = null, Tn = null, t.updateQueue = null, Wl = -1, fe.current = k1, v = i(a, l);
        } while (Oh);
      }
      fe.current = Vm, t._debugHookTypes = Ni;
      var b = xn !== null && xn.next !== null;
      if (ps = q, gt = null, xn = null, Tn = null, Q = null, Ni = null, Wl = -1, e !== null && (e.flags & wn) !== (t.flags & wn) && // Disable this warning in legacy mode, because legacy Suspense is weird
        // and creates false positives. To make this work in legacy mode, we'd
        // need to mark fibers that commit in an incomplete state, somehow. For
        // now I'll disable the warning that most of the bugs that would trigger
        // it are either exclusive to concurrent mode or exist in both.
        (e.mode & Ye) !== De && m("Internal React error: Expected static flag was missing. Please notify the React team."), Dm = !1, b)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return v;
    }
    function vf() {
      var e = Lh !== 0;
      return Lh = 0, e;
    }
    function o1(e, t, i) {
      t.updateQueue = e.updateQueue, (t.mode & Ir) !== De ? t.flags &= ~(bo | lr | Ot | Ve) : t.flags &= ~(Ot | Ve), e.lanes = xl(e.lanes, i);
    }
    function l1() {
      if (fe.current = Vm, Dm) {
        for (var e = gt.memoizedState; e !== null;) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        Dm = !1;
      }
      ps = q, gt = null, xn = null, Tn = null, Ni = null, Wl = -1, Q = null, w1 = !1, Oh = !1, Lh = 0;
    }
    function eo() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return Tn === null ? gt.memoizedState = Tn = e : Tn = Tn.next = e, Tn;
    }
    function zi() {
      var e;
      if (xn === null) {
        var t = gt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = xn.next;
      var i;
      if (Tn === null ? i = gt.memoizedState : i = Tn.next, i !== null)
        Tn = i, i = Tn.next, xn = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        xn = e;
        var a = {
          memoizedState: xn.memoizedState,
          baseState: xn.baseState,
          baseQueue: xn.baseQueue,
          queue: xn.queue,
          next: null
        };
        Tn === null ? gt.memoizedState = Tn = a : Tn = Tn.next = a;
      }
      return Tn;
    }
    function u1() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function M0(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function U0(e, t, i) {
      var a = eo(), l;
      i !== void 0 ? l = i(t) : l = t, a.memoizedState = a.baseState = l;
      var f = {
        pending: null,
        interleaved: null,
        lanes: q,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: l
      };
      a.queue = f;
      var v = f.dispatch = fR.bind(null, gt, f);
      return [a.memoizedState, v];
    }
    function N0(e, t, i) {
      var a = zi(), l = a.queue;
      if (l === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      l.lastRenderedReducer = e;
      var f = xn, v = f.baseQueue, S = l.pending;
      if (S !== null) {
        if (v !== null) {
          var b = v.next, x = S.next;
          v.next = x, S.next = b;
        }
        f.baseQueue !== v && m("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), f.baseQueue = v = S, l.pending = null;
      }
      if (v !== null) {
        var T = v.next, M = f.baseState, L = null, H = null, P = null, I = T;
        do {
          var de = I.lane;
          if (Lo(ps, de)) {
            if (P !== null) {
              var Ee = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: et,
                action: I.action,
                hasEagerState: I.hasEagerState,
                eagerState: I.eagerState,
                next: null
              };
              P = P.next = Ee;
            }
            if (I.hasEagerState)
              M = I.eagerState;
            else {
              var nt = I.action;
              M = e(M, nt);
            }
          } else {
            var Re = {
              lane: de,
              action: I.action,
              hasEagerState: I.hasEagerState,
              eagerState: I.eagerState,
              next: null
            };
            P === null ? (H = P = Re, L = M) : P = P.next = Re, gt.lanes = Be(gt.lanes, de), Kh(de);
          }
          I = I.next;
        } while (I !== null && I !== T);
        P === null ? L = M : P.next = H, ye(M, a.memoizedState) || Fh(), a.memoizedState = M, a.baseState = L, a.baseQueue = P, l.lastRenderedState = M;
      }
      var Ke = l.interleaved;
      if (Ke !== null) {
        var z = Ke;
        do {
          var Y = z.lane;
          gt.lanes = Be(gt.lanes, Y), Kh(Y), z = z.next;
        } while (z !== Ke);
      } else
        v === null && (l.lanes = q);
      var j = l.dispatch;
      return [a.memoizedState, j];
    }
    function z0(e, t, i) {
      var a = zi(), l = a.queue;
      if (l === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      l.lastRenderedReducer = e;
      var f = l.dispatch, v = l.pending, S = a.memoizedState;
      if (v !== null) {
        l.pending = null;
        var b = v.next, x = b;
        do {
          var T = x.action;
          S = e(S, T), x = x.next;
        } while (x !== b);
        ye(S, a.memoizedState) || Fh(), a.memoizedState = S, a.baseQueue === null && (a.baseState = S), l.lastRenderedState = S;
      }
      return [S, f];
    }
    function aM(e, t, i) {
    }
    function oM(e, t, i) {
    }
    function j0(e, t, i) {
      var a = gt, l = eo(), f, v = Gn();
      if (v) {
        if (i === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        f = i(), df || f !== i() && (m("The result of getServerSnapshot should be cached to avoid an infinite loop"), df = !0);
      } else {
        if (f = t(), !df) {
          var S = t();
          ye(f, S) || (m("The result of getSnapshot should be cached to avoid an infinite loop"), df = !0);
        }
        var b = oy();
        if (b === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Yu(b, ps) || s1(a, t, f);
      }
      l.memoizedState = f;
      var x = {
        value: f,
        getSnapshot: t
      };
      return l.queue = x, Um(f1.bind(null, a, x, e), [e]), a.flags |= Ot, Ah(_n | Wn, c1.bind(null, a, x, f, t), void 0, null), f;
    }
    function Om(e, t, i) {
      var a = gt, l = zi(), f = t();
      if (!df) {
        var v = t();
        ye(f, v) || (m("The result of getSnapshot should be cached to avoid an infinite loop"), df = !0);
      }
      var S = l.memoizedState, b = !ye(S, f);
      b && (l.memoizedState = f, Fh());
      var x = l.queue;
      if (Uh(f1.bind(null, a, x, e), [e]), x.getSnapshot !== t || b || // Check if the susbcribe function changed. We can save some memory by
        // checking whether we scheduled a subscription effect above.
        Tn !== null && Tn.memoizedState.tag & _n) {
        a.flags |= Ot, Ah(_n | Wn, c1.bind(null, a, x, f, t), void 0, null);
        var T = oy();
        if (T === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Yu(T, ps) || s1(a, t, f);
      }
      return f;
    }
    function s1(e, t, i) {
      e.flags |= zu;
      var a = {
        getSnapshot: t,
        value: i
      }, l = gt.updateQueue;
      if (l === null)
        l = u1(), gt.updateQueue = l, l.stores = [a];
      else {
        var f = l.stores;
        f === null ? l.stores = [a] : f.push(a);
      }
    }
    function c1(e, t, i, a) {
      t.value = i, t.getSnapshot = a, d1(t) && h1(e);
    }
    function f1(e, t, i) {
      var a = function () {
        d1(t) && h1(e);
      };
      return i(a);
    }
    function d1(e) {
      var t = e.getSnapshot, i = e.value;
      try {
        var a = t();
        return !ye(i, a);
      } catch {
        return !0;
      }
    }
    function h1(e) {
      var t = Jr(e, Le);
      t !== null && On(t, e, Le, _t);
    }
    function Lm(e) {
      var t = eo();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var i = {
        pending: null,
        interleaved: null,
        lanes: q,
        dispatch: null,
        lastRenderedReducer: M0,
        lastRenderedState: e
      };
      t.queue = i;
      var a = i.dispatch = dR.bind(null, gt, i);
      return [t.memoizedState, a];
    }
    function F0(e) {
      return N0(M0);
    }
    function $0(e) {
      return z0(M0);
    }
    function Ah(e, t, i, a) {
      var l = {
        tag: e,
        create: t,
        destroy: i,
        deps: a,
        // Circular
        next: null
      }, f = gt.updateQueue;
      if (f === null)
        f = u1(), gt.updateQueue = f, f.lastEffect = l.next = l;
      else {
        var v = f.lastEffect;
        if (v === null)
          f.lastEffect = l.next = l;
        else {
          var S = v.next;
          v.next = l, l.next = S, f.lastEffect = l;
        }
      }
      return l;
    }
    function H0(e) {
      var t = eo();
      {
        var i = {
          current: e
        };
        return t.memoizedState = i, i;
      }
    }
    function Am(e) {
      var t = zi();
      return t.memoizedState;
    }
    function Mh(e, t, i, a) {
      var l = eo(), f = a === void 0 ? null : a;
      gt.flags |= e, l.memoizedState = Ah(_n | t, i, void 0, f);
    }
    function Mm(e, t, i, a) {
      var l = zi(), f = a === void 0 ? null : a, v = void 0;
      if (xn !== null) {
        var S = xn.memoizedState;
        if (v = S.destroy, f !== null) {
          var b = S.deps;
          if (A0(f, b)) {
            l.memoizedState = Ah(t, i, v, f);
            return;
          }
        }
      }
      gt.flags |= e, l.memoizedState = Ah(_n | t, i, v, f);
    }
    function Um(e, t) {
      return (gt.mode & Ir) !== De ? Mh(bo | Ot | za, Wn, e, t) : Mh(Ot | za, Wn, e, t);
    }
    function Uh(e, t) {
      return Mm(Ot, Wn, e, t);
    }
    function P0(e, t) {
      return Mh(Ve, Za, e, t);
    }
    function Nm(e, t) {
      return Mm(Ve, Za, e, t);
    }
    function V0(e, t) {
      var i = Ve;
      return i |= or, (gt.mode & Ir) !== De && (i |= lr), Mh(i, Cn, e, t);
    }
    function zm(e, t) {
      return Mm(Ve, Cn, e, t);
    }
    function p1(e, t) {
      if (typeof t == "function") {
        var i = t, a = e();
        return i(a), function () {
          i(null);
        };
      } else if (t != null) {
        var l = t;
        l.hasOwnProperty("current") || m("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(l).join(", ") + "}");
        var f = e();
        return l.current = f, function () {
          l.current = null;
        };
      }
    }
    function B0(e, t, i) {
      typeof t != "function" && m("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var a = i != null ? i.concat([e]) : null, l = Ve;
      return l |= or, (gt.mode & Ir) !== De && (l |= lr), Mh(l, Cn, p1.bind(null, t, e), a);
    }
    function jm(e, t, i) {
      typeof t != "function" && m("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var a = i != null ? i.concat([e]) : null;
      return Mm(Ve, Cn, p1.bind(null, t, e), a);
    }
    function uR(e, t) {
    }
    var Fm = uR;
    function I0(e, t) {
      var i = eo(), a = t === void 0 ? null : t;
      return i.memoizedState = [e, a], e;
    }
    function $m(e, t) {
      var i = zi(), a = t === void 0 ? null : t, l = i.memoizedState;
      if (l !== null && a !== null) {
        var f = l[1];
        if (A0(a, f))
          return l[0];
      }
      return i.memoizedState = [e, a], e;
    }
    function Y0(e, t) {
      var i = eo(), a = t === void 0 ? null : t, l = e();
      return i.memoizedState = [l, a], l;
    }
    function Hm(e, t) {
      var i = zi(), a = t === void 0 ? null : t, l = i.memoizedState;
      if (l !== null && a !== null) {
        var f = l[1];
        if (A0(a, f))
          return l[0];
      }
      var v = e();
      return i.memoizedState = [v, a], v;
    }
    function q0(e) {
      var t = eo();
      return t.memoizedState = e, e;
    }
    function v1(e) {
      var t = zi(), i = xn, a = i.memoizedState;
      return y1(t, a, e);
    }
    function m1(e) {
      var t = zi();
      if (xn === null)
        return t.memoizedState = e, e;
      var i = xn.memoizedState;
      return y1(t, i, e);
    }
    function y1(e, t, i) {
      var a = !Xy(ps);
      if (a) {
        if (!ye(i, t)) {
          var l = Nd();
          gt.lanes = Be(gt.lanes, l), Kh(l), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Fh()), e.memoizedState = i, i;
    }
    function sR(e, t, i) {
      var a = qr();
      ln(jn(a, En)), e(!0);
      var l = Dh.transition;
      Dh.transition = {};
      var f = Dh.transition;
      Dh.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (ln(a), Dh.transition = l, l === null && f._updatedFibers) {
          var v = f._updatedFibers.size;
          v > 10 && w("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), f._updatedFibers.clear();
        }
      }
    }
    function Q0() {
      var e = Lm(!1), t = e[0], i = e[1], a = sR.bind(null, i), l = eo();
      return l.memoizedState = a, [t, a];
    }
    function g1() {
      var e = F0(), t = e[0], i = zi(), a = i.memoizedState;
      return [t, a];
    }
    function S1() {
      var e = $0(), t = e[0], i = zi(), a = i.memoizedState;
      return [t, a];
    }
    var w1 = !1;
    function cR() {
      return w1;
    }
    function G0() {
      var e = eo(), t = oy(), i = t.identifierPrefix, a;
      if (Gn()) {
        var l = CT();
        a = ":" + i + "R" + l;
        var f = Lh++;
        f > 0 && (a += "H" + f.toString(32)), a += ":";
      } else {
        var v = aR++;
        a = ":" + i + "r" + v.toString(32) + ":";
      }
      return e.memoizedState = a, a;
    }
    function Pm() {
      var e = zi(), t = e.memoizedState;
      return t;
    }
    function fR(e, t, i) {
      typeof arguments[3] == "function" && m("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var a = eu(e), l = {
        lane: a,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (b1(e))
        E1(t, l);
      else {
        var f = $b(e, t, l, a);
        if (f !== null) {
          var v = Dr();
          On(f, e, a, v), _1(f, t, a);
        }
      }
      C1(e, a);
    }
    function dR(e, t, i) {
      typeof arguments[3] == "function" && m("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var a = eu(e), l = {
        lane: a,
        action: i,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (b1(e))
        E1(t, l);
      else {
        var f = e.alternate;
        if (e.lanes === q && (f === null || f.lanes === q)) {
          var v = t.lastRenderedReducer;
          if (v !== null) {
            var S;
            S = fe.current, fe.current = da;
            try {
              var b = t.lastRenderedState, x = v(b, i);
              if (l.hasEagerState = !0, l.eagerState = x, ye(x, b)) {
                IT(e, t, l, a);
                return;
              }
            } catch {
            } finally {
              fe.current = S;
            }
          }
        }
        var T = $b(e, t, l, a);
        if (T !== null) {
          var M = Dr();
          On(T, e, a, M), _1(T, t, a);
        }
      }
      C1(e, a);
    }
    function b1(e) {
      var t = e.alternate;
      return e === gt || t !== null && t === gt;
    }
    function E1(e, t) {
      Oh = Dm = !0;
      var i = e.pending;
      i === null ? t.next = t : (t.next = i.next, i.next = t), e.pending = t;
    }
    function _1(e, t, i) {
      if (Ud(i)) {
        var a = t.lanes;
        a = zd(a, e.pendingLanes);
        var l = Be(a, i);
        t.lanes = l, Tl(e, l);
      }
    }
    function C1(e, t, i) {
      Va(e, t);
    }
    var Vm = {
      readContext: Sn,
      useCallback: vr,
      useContext: vr,
      useEffect: vr,
      useImperativeHandle: vr,
      useInsertionEffect: vr,
      useLayoutEffect: vr,
      useMemo: vr,
      useReducer: vr,
      useRef: vr,
      useState: vr,
      useDebugValue: vr,
      useDeferredValue: vr,
      useTransition: vr,
      useMutableSource: vr,
      useSyncExternalStore: vr,
      useId: vr,
      unstable_isNewReconciler: te
    }, x1 = null, T1 = null, R1 = null, k1 = null, to = null, da = null, Bm = null;
    {
      var W0 = function () {
        m("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, je = function () {
        m("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      x1 = {
        readContext: function (e) {
          return Sn(e);
        },
        useCallback: function (e, t) {
          return Q = "useCallback", vt(), hf(t), I0(e, t);
        },
        useContext: function (e) {
          return Q = "useContext", vt(), Sn(e);
        },
        useEffect: function (e, t) {
          return Q = "useEffect", vt(), hf(t), Um(e, t);
        },
        useImperativeHandle: function (e, t, i) {
          return Q = "useImperativeHandle", vt(), hf(i), B0(e, t, i);
        },
        useInsertionEffect: function (e, t) {
          return Q = "useInsertionEffect", vt(), hf(t), P0(e, t);
        },
        useLayoutEffect: function (e, t) {
          return Q = "useLayoutEffect", vt(), hf(t), V0(e, t);
        },
        useMemo: function (e, t) {
          Q = "useMemo", vt(), hf(t);
          var i = fe.current;
          fe.current = to;
          try {
            return Y0(e, t);
          } finally {
            fe.current = i;
          }
        },
        useReducer: function (e, t, i) {
          Q = "useReducer", vt();
          var a = fe.current;
          fe.current = to;
          try {
            return U0(e, t, i);
          } finally {
            fe.current = a;
          }
        },
        useRef: function (e) {
          return Q = "useRef", vt(), H0(e);
        },
        useState: function (e) {
          Q = "useState", vt();
          var t = fe.current;
          fe.current = to;
          try {
            return Lm(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function (e, t) {
          return Q = "useDebugValue", vt(), void 0;
        },
        useDeferredValue: function (e) {
          return Q = "useDeferredValue", vt(), q0(e);
        },
        useTransition: function () {
          return Q = "useTransition", vt(), Q0();
        },
        useMutableSource: function (e, t, i) {
          return Q = "useMutableSource", vt(), void 0;
        },
        useSyncExternalStore: function (e, t, i) {
          return Q = "useSyncExternalStore", vt(), j0(e, t, i);
        },
        useId: function () {
          return Q = "useId", vt(), G0();
        },
        unstable_isNewReconciler: te
      }, T1 = {
        readContext: function (e) {
          return Sn(e);
        },
        useCallback: function (e, t) {
          return Q = "useCallback", ae(), I0(e, t);
        },
        useContext: function (e) {
          return Q = "useContext", ae(), Sn(e);
        },
        useEffect: function (e, t) {
          return Q = "useEffect", ae(), Um(e, t);
        },
        useImperativeHandle: function (e, t, i) {
          return Q = "useImperativeHandle", ae(), B0(e, t, i);
        },
        useInsertionEffect: function (e, t) {
          return Q = "useInsertionEffect", ae(), P0(e, t);
        },
        useLayoutEffect: function (e, t) {
          return Q = "useLayoutEffect", ae(), V0(e, t);
        },
        useMemo: function (e, t) {
          Q = "useMemo", ae();
          var i = fe.current;
          fe.current = to;
          try {
            return Y0(e, t);
          } finally {
            fe.current = i;
          }
        },
        useReducer: function (e, t, i) {
          Q = "useReducer", ae();
          var a = fe.current;
          fe.current = to;
          try {
            return U0(e, t, i);
          } finally {
            fe.current = a;
          }
        },
        useRef: function (e) {
          return Q = "useRef", ae(), H0(e);
        },
        useState: function (e) {
          Q = "useState", ae();
          var t = fe.current;
          fe.current = to;
          try {
            return Lm(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function (e, t) {
          return Q = "useDebugValue", ae(), void 0;
        },
        useDeferredValue: function (e) {
          return Q = "useDeferredValue", ae(), q0(e);
        },
        useTransition: function () {
          return Q = "useTransition", ae(), Q0();
        },
        useMutableSource: function (e, t, i) {
          return Q = "useMutableSource", ae(), void 0;
        },
        useSyncExternalStore: function (e, t, i) {
          return Q = "useSyncExternalStore", ae(), j0(e, t, i);
        },
        useId: function () {
          return Q = "useId", ae(), G0();
        },
        unstable_isNewReconciler: te
      }, R1 = {
        readContext: function (e) {
          return Sn(e);
        },
        useCallback: function (e, t) {
          return Q = "useCallback", ae(), $m(e, t);
        },
        useContext: function (e) {
          return Q = "useContext", ae(), Sn(e);
        },
        useEffect: function (e, t) {
          return Q = "useEffect", ae(), Uh(e, t);
        },
        useImperativeHandle: function (e, t, i) {
          return Q = "useImperativeHandle", ae(), jm(e, t, i);
        },
        useInsertionEffect: function (e, t) {
          return Q = "useInsertionEffect", ae(), Nm(e, t);
        },
        useLayoutEffect: function (e, t) {
          return Q = "useLayoutEffect", ae(), zm(e, t);
        },
        useMemo: function (e, t) {
          Q = "useMemo", ae();
          var i = fe.current;
          fe.current = da;
          try {
            return Hm(e, t);
          } finally {
            fe.current = i;
          }
        },
        useReducer: function (e, t, i) {
          Q = "useReducer", ae();
          var a = fe.current;
          fe.current = da;
          try {
            return N0(e, t, i);
          } finally {
            fe.current = a;
          }
        },
        useRef: function (e) {
          return Q = "useRef", ae(), Am();
        },
        useState: function (e) {
          Q = "useState", ae();
          var t = fe.current;
          fe.current = da;
          try {
            return F0(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function (e, t) {
          return Q = "useDebugValue", ae(), Fm();
        },
        useDeferredValue: function (e) {
          return Q = "useDeferredValue", ae(), v1(e);
        },
        useTransition: function () {
          return Q = "useTransition", ae(), g1();
        },
        useMutableSource: function (e, t, i) {
          return Q = "useMutableSource", ae(), void 0;
        },
        useSyncExternalStore: function (e, t, i) {
          return Q = "useSyncExternalStore", ae(), Om(e, t);
        },
        useId: function () {
          return Q = "useId", ae(), Pm();
        },
        unstable_isNewReconciler: te
      }, k1 = {
        readContext: function (e) {
          return Sn(e);
        },
        useCallback: function (e, t) {
          return Q = "useCallback", ae(), $m(e, t);
        },
        useContext: function (e) {
          return Q = "useContext", ae(), Sn(e);
        },
        useEffect: function (e, t) {
          return Q = "useEffect", ae(), Uh(e, t);
        },
        useImperativeHandle: function (e, t, i) {
          return Q = "useImperativeHandle", ae(), jm(e, t, i);
        },
        useInsertionEffect: function (e, t) {
          return Q = "useInsertionEffect", ae(), Nm(e, t);
        },
        useLayoutEffect: function (e, t) {
          return Q = "useLayoutEffect", ae(), zm(e, t);
        },
        useMemo: function (e, t) {
          Q = "useMemo", ae();
          var i = fe.current;
          fe.current = Bm;
          try {
            return Hm(e, t);
          } finally {
            fe.current = i;
          }
        },
        useReducer: function (e, t, i) {
          Q = "useReducer", ae();
          var a = fe.current;
          fe.current = Bm;
          try {
            return z0(e, t, i);
          } finally {
            fe.current = a;
          }
        },
        useRef: function (e) {
          return Q = "useRef", ae(), Am();
        },
        useState: function (e) {
          Q = "useState", ae();
          var t = fe.current;
          fe.current = Bm;
          try {
            return $0(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function (e, t) {
          return Q = "useDebugValue", ae(), Fm();
        },
        useDeferredValue: function (e) {
          return Q = "useDeferredValue", ae(), m1(e);
        },
        useTransition: function () {
          return Q = "useTransition", ae(), S1();
        },
        useMutableSource: function (e, t, i) {
          return Q = "useMutableSource", ae(), void 0;
        },
        useSyncExternalStore: function (e, t, i) {
          return Q = "useSyncExternalStore", ae(), Om(e, t);
        },
        useId: function () {
          return Q = "useId", ae(), Pm();
        },
        unstable_isNewReconciler: te
      }, to = {
        readContext: function (e) {
          return W0(), Sn(e);
        },
        useCallback: function (e, t) {
          return Q = "useCallback", je(), vt(), I0(e, t);
        },
        useContext: function (e) {
          return Q = "useContext", je(), vt(), Sn(e);
        },
        useEffect: function (e, t) {
          return Q = "useEffect", je(), vt(), Um(e, t);
        },
        useImperativeHandle: function (e, t, i) {
          return Q = "useImperativeHandle", je(), vt(), B0(e, t, i);
        },
        useInsertionEffect: function (e, t) {
          return Q = "useInsertionEffect", je(), vt(), P0(e, t);
        },
        useLayoutEffect: function (e, t) {
          return Q = "useLayoutEffect", je(), vt(), V0(e, t);
        },
        useMemo: function (e, t) {
          Q = "useMemo", je(), vt();
          var i = fe.current;
          fe.current = to;
          try {
            return Y0(e, t);
          } finally {
            fe.current = i;
          }
        },
        useReducer: function (e, t, i) {
          Q = "useReducer", je(), vt();
          var a = fe.current;
          fe.current = to;
          try {
            return U0(e, t, i);
          } finally {
            fe.current = a;
          }
        },
        useRef: function (e) {
          return Q = "useRef", je(), vt(), H0(e);
        },
        useState: function (e) {
          Q = "useState", je(), vt();
          var t = fe.current;
          fe.current = to;
          try {
            return Lm(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function (e, t) {
          return Q = "useDebugValue", je(), vt(), void 0;
        },
        useDeferredValue: function (e) {
          return Q = "useDeferredValue", je(), vt(), q0(e);
        },
        useTransition: function () {
          return Q = "useTransition", je(), vt(), Q0();
        },
        useMutableSource: function (e, t, i) {
          return Q = "useMutableSource", je(), vt(), void 0;
        },
        useSyncExternalStore: function (e, t, i) {
          return Q = "useSyncExternalStore", je(), vt(), j0(e, t, i);
        },
        useId: function () {
          return Q = "useId", je(), vt(), G0();
        },
        unstable_isNewReconciler: te
      }, da = {
        readContext: function (e) {
          return W0(), Sn(e);
        },
        useCallback: function (e, t) {
          return Q = "useCallback", je(), ae(), $m(e, t);
        },
        useContext: function (e) {
          return Q = "useContext", je(), ae(), Sn(e);
        },
        useEffect: function (e, t) {
          return Q = "useEffect", je(), ae(), Uh(e, t);
        },
        useImperativeHandle: function (e, t, i) {
          return Q = "useImperativeHandle", je(), ae(), jm(e, t, i);
        },
        useInsertionEffect: function (e, t) {
          return Q = "useInsertionEffect", je(), ae(), Nm(e, t);
        },
        useLayoutEffect: function (e, t) {
          return Q = "useLayoutEffect", je(), ae(), zm(e, t);
        },
        useMemo: function (e, t) {
          Q = "useMemo", je(), ae();
          var i = fe.current;
          fe.current = da;
          try {
            return Hm(e, t);
          } finally {
            fe.current = i;
          }
        },
        useReducer: function (e, t, i) {
          Q = "useReducer", je(), ae();
          var a = fe.current;
          fe.current = da;
          try {
            return N0(e, t, i);
          } finally {
            fe.current = a;
          }
        },
        useRef: function (e) {
          return Q = "useRef", je(), ae(), Am();
        },
        useState: function (e) {
          Q = "useState", je(), ae();
          var t = fe.current;
          fe.current = da;
          try {
            return F0(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function (e, t) {
          return Q = "useDebugValue", je(), ae(), Fm();
        },
        useDeferredValue: function (e) {
          return Q = "useDeferredValue", je(), ae(), v1(e);
        },
        useTransition: function () {
          return Q = "useTransition", je(), ae(), g1();
        },
        useMutableSource: function (e, t, i) {
          return Q = "useMutableSource", je(), ae(), void 0;
        },
        useSyncExternalStore: function (e, t, i) {
          return Q = "useSyncExternalStore", je(), ae(), Om(e, t);
        },
        useId: function () {
          return Q = "useId", je(), ae(), Pm();
        },
        unstable_isNewReconciler: te
      }, Bm = {
        readContext: function (e) {
          return W0(), Sn(e);
        },
        useCallback: function (e, t) {
          return Q = "useCallback", je(), ae(), $m(e, t);
        },
        useContext: function (e) {
          return Q = "useContext", je(), ae(), Sn(e);
        },
        useEffect: function (e, t) {
          return Q = "useEffect", je(), ae(), Uh(e, t);
        },
        useImperativeHandle: function (e, t, i) {
          return Q = "useImperativeHandle", je(), ae(), jm(e, t, i);
        },
        useInsertionEffect: function (e, t) {
          return Q = "useInsertionEffect", je(), ae(), Nm(e, t);
        },
        useLayoutEffect: function (e, t) {
          return Q = "useLayoutEffect", je(), ae(), zm(e, t);
        },
        useMemo: function (e, t) {
          Q = "useMemo", je(), ae();
          var i = fe.current;
          fe.current = da;
          try {
            return Hm(e, t);
          } finally {
            fe.current = i;
          }
        },
        useReducer: function (e, t, i) {
          Q = "useReducer", je(), ae();
          var a = fe.current;
          fe.current = da;
          try {
            return z0(e, t, i);
          } finally {
            fe.current = a;
          }
        },
        useRef: function (e) {
          return Q = "useRef", je(), ae(), Am();
        },
        useState: function (e) {
          Q = "useState", je(), ae();
          var t = fe.current;
          fe.current = da;
          try {
            return $0(e);
          } finally {
            fe.current = t;
          }
        },
        useDebugValue: function (e, t) {
          return Q = "useDebugValue", je(), ae(), Fm();
        },
        useDeferredValue: function (e) {
          return Q = "useDeferredValue", je(), ae(), m1(e);
        },
        useTransition: function () {
          return Q = "useTransition", je(), ae(), S1();
        },
        useMutableSource: function (e, t, i) {
          return Q = "useMutableSource", je(), ae(), void 0;
        },
        useSyncExternalStore: function (e, t, i) {
          return Q = "useSyncExternalStore", je(), ae(), Om(e, t);
        },
        useId: function () {
          return Q = "useId", je(), ae(), Pm();
        },
        unstable_isNewReconciler: te
      };
    }
    var Kl = u.unstable_now, D1 = 0, Im = -1, Nh = -1, Ym = -1, K0 = !1, qm = !1;
    function O1() {
      return K0;
    }
    function hR() {
      qm = !0;
    }
    function pR() {
      K0 = !1, qm = !1;
    }
    function vR() {
      K0 = qm, qm = !1;
    }
    function L1() {
      return D1;
    }
    function A1() {
      D1 = Kl();
    }
    function J0(e) {
      Nh = Kl(), e.actualStartTime < 0 && (e.actualStartTime = Kl());
    }
    function M1(e) {
      Nh = -1;
    }
    function Qm(e, t) {
      if (Nh >= 0) {
        var i = Kl() - Nh;
        e.actualDuration += i, t && (e.selfBaseDuration = i), Nh = -1;
      }
    }
    function no(e) {
      if (Im >= 0) {
        var t = Kl() - Im;
        Im = -1;
        for (var i = e.return; i !== null;) {
          switch (i.tag) {
            case U:
              var a = i.stateNode;
              a.effectDuration += t;
              return;
            case _e:
              var l = i.stateNode;
              l.effectDuration += t;
              return;
          }
          i = i.return;
        }
      }
    }
    function X0(e) {
      if (Ym >= 0) {
        var t = Kl() - Ym;
        Ym = -1;
        for (var i = e.return; i !== null;) {
          switch (i.tag) {
            case U:
              var a = i.stateNode;
              a !== null && (a.passiveEffectDuration += t);
              return;
            case _e:
              var l = i.stateNode;
              l !== null && (l.passiveEffectDuration += t);
              return;
          }
          i = i.return;
        }
      }
    }
    function ro() {
      Im = Kl();
    }
    function Z0() {
      Ym = Kl();
    }
    function eS(e) {
      for (var t = e.child; t;)
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function vs(e, t) {
      return {
        value: e,
        source: t,
        stack: If(t),
        digest: null
      };
    }
    function tS(e, t, i) {
      return {
        value: e,
        source: null,
        stack: i ?? null,
        digest: t ?? null
      };
    }
    function mR(e, t) {
      return !0;
    }
    function nS(e, t) {
      try {
        var i = mR(e, t);
        if (i === !1)
          return;
        var a = t.value, l = t.source, f = t.stack, v = f !== null ? f : "";
        if (a != null && a._suppressLogging) {
          if (e.tag === R)
            return;
          console.error(a);
        }
        var S = l ? He(l) : null, b = S ? "The above error occurred in the <" + S + "> component:" : "The above error occurred in one of your React components:", x;
        if (e.tag === U)
          x = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var T = He(e) || "Anonymous";
          x = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + T + ".");
        }
        var M = b + `
` + v + `

` + ("" + x);
        console.error(M);
      } catch (L) {
        setTimeout(function () {
          throw L;
        });
      }
    }
    var yR = typeof WeakMap == "function" ? WeakMap : Map;
    function U1(e, t, i) {
      var a = Qo(_t, i);
      a.tag = n0, a.payload = {
        element: null
      };
      var l = t.value;
      return a.callback = function () {
        sD(l), nS(e, t);
      }, a;
    }
    function rS(e, t, i) {
      var a = Qo(_t, i);
      a.tag = n0;
      var l = e.type.getDerivedStateFromError;
      if (typeof l == "function") {
        var f = t.value;
        a.payload = function () {
          return l(f);
        }, a.callback = function () {
          YE(e), nS(e, t);
        };
      }
      var v = e.stateNode;
      return v !== null && typeof v.componentDidCatch == "function" && (a.callback = function () {
        YE(e), nS(e, t), typeof l != "function" && lD(this);
        var b = t.value, x = t.stack;
        this.componentDidCatch(b, {
          componentStack: x !== null ? x : ""
        }), typeof l != "function" && (dr(e.lanes, Le) || m("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", He(e) || "Unknown"));
      }), a;
    }
    function N1(e, t, i) {
      var a = e.pingCache, l;
      if (a === null ? (a = e.pingCache = new yR(), l = /* @__PURE__ */ new Set(), a.set(t, l)) : (l = a.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), a.set(t, l))), !l.has(i)) {
        l.add(i);
        var f = cD.bind(null, e, t, i);
        bn && Jh(e, i), t.then(f, f);
      }
    }
    function gR(e, t, i, a) {
      var l = e.updateQueue;
      if (l === null) {
        var f = /* @__PURE__ */ new Set();
        f.add(i), e.updateQueue = f;
      } else
        l.add(i);
    }
    function SR(e, t) {
      var i = e.tag;
      if ((e.mode & Ye) === De && (i === C || i === pe || i === Ae)) {
        var a = e.alternate;
        a ? (e.updateQueue = a.updateQueue, e.memoizedState = a.memoizedState, e.lanes = a.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function z1(e) {
      var t = e;
      do {
        if (t.tag === $e && rR(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function j1(e, t, i, a, l) {
      if ((e.mode & Ye) === De) {
        if (e === t)
          e.flags |= pn;
        else {
          if (e.flags |= Ue, i.flags |= ju, i.flags &= ~(Zs | br), i.tag === R) {
            var f = i.alternate;
            if (f === null)
              i.tag = dt;
            else {
              var v = Qo(_t, Le);
              v.tag = ym, ql(i, v, Le);
            }
          }
          i.lanes = Be(i.lanes, Le);
        }
        return e;
      }
      return e.flags |= pn, e.lanes = l, e;
    }
    function wR(e, t, i, a, l) {
      if (i.flags |= br, bn && Jh(e, l), a !== null && typeof a == "object" && typeof a.then == "function") {
        var f = a;
        SR(i), Gn() && i.mode & Ye && Rb();
        var v = z1(t);
        if (v !== null) {
          v.flags &= ~Pt, j1(v, t, i, e, l), v.mode & Ye && N1(e, f, l), gR(v, e, f);
          return;
        } else {
          if (!Cl(l)) {
            N1(e, f, l), zS();
            return;
          }
          var S = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          a = S;
        }
      } else if (Gn() && i.mode & Ye) {
        Rb();
        var b = z1(t);
        if (b !== null) {
          (b.flags & pn) === Te && (b.flags |= Pt), j1(b, t, i, e, l), Wg(vs(a, i));
          return;
        }
      }
      a = vs(a, i), Zk(a);
      var x = t;
      do {
        switch (x.tag) {
          case U: {
            var T = a;
            x.flags |= pn;
            var M = on(l);
            x.lanes = Be(x.lanes, M);
            var L = U1(x, T, M);
            a0(x, L);
            return;
          }
          case R:
            var H = a, P = x.type, I = x.stateNode;
            if ((x.flags & Ue) === Te && (typeof P.getDerivedStateFromError == "function" || I !== null && typeof I.componentDidCatch == "function" && !zE(I))) {
              x.flags |= pn;
              var de = on(l);
              x.lanes = Be(x.lanes, de);
              var Re = rS(x, H, de);
              a0(x, Re);
              return;
            }
            break;
        }
        x = x.return;
      } while (x !== null);
    }
    function bR() {
      return null;
    }
    var zh = s.ReactCurrentOwner, ha = !1, iS, jh, aS, oS, lS, ms, uS, Gm;
    iS = {}, jh = {}, aS = {}, oS = {}, lS = {}, ms = !1, uS = {}, Gm = {};
    function Rr(e, t, i, a) {
      e === null ? t.child = t1(t, null, i, a) : t.child = uf(t, e.child, i, a);
    }
    function ER(e, t, i, a) {
      t.child = uf(t, e.child, null, a), t.child = uf(t, null, i, a);
    }
    function F1(e, t, i, a, l) {
      if (t.type !== t.elementType) {
        var f = i.propTypes;
        f && la(
          f,
          a,
          // Resolved props
          "prop",
          bt(i)
        );
      }
      var v = i.render, S = t.ref, b, x;
      lf(t, l), Pa(t);
      {
        if (zh.current = t, ci(!0), b = pf(e, t, v, a, S, l), x = vf(), t.mode & Ut) {
          an(!0);
          try {
            b = pf(e, t, v, a, S, l), x = vf();
          } finally {
            an(!1);
          }
        }
        ci(!1);
      }
      return Eo(), e !== null && !ha ? (o1(e, t, l), Go(e, t, l)) : (Gn() && x && Bg(t), t.flags |= Ua, Rr(e, t, b, l), t.child);
    }
    function $1(e, t, i, a, l) {
      if (e === null) {
        var f = i.type;
        if (RD(f) && i.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
          i.defaultProps === void 0) {
          var v = f;
          return v = _f(f), t.tag = Ae, t.type = v, fS(t, f), H1(e, t, v, a, l);
        }
        {
          var S = f.propTypes;
          S && la(
            S,
            a,
            // Resolved props
            "prop",
            bt(f)
          );
        }
        var b = QS(i.type, null, a, t, t.mode, l);
        return b.ref = t.ref, b.return = t, t.child = b, b;
      }
      {
        var x = i.type, T = x.propTypes;
        T && la(
          T,
          a,
          // Resolved props
          "prop",
          bt(x)
        );
      }
      var M = e.child, L = yS(e, l);
      if (!L) {
        var H = M.memoizedProps, P = i.compare;
        if (P = P !== null ? P : xe, P(H, a) && e.ref === t.ref)
          return Go(e, t, l);
      }
      t.flags |= Ua;
      var I = bs(M, a);
      return I.ref = t.ref, I.return = t, t.child = I, I;
    }
    function H1(e, t, i, a, l) {
      if (t.type !== t.elementType) {
        var f = t.elementType;
        if (f.$$typeof === Yn) {
          var v = f, S = v._payload, b = v._init;
          try {
            f = b(S);
          } catch {
            f = null;
          }
          var x = f && f.propTypes;
          x && la(
            x,
            a,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            bt(f)
          );
        }
      }
      if (e !== null) {
        var T = e.memoizedProps;
        if (xe(T, a) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
          t.type === e.type)
          if (ha = !1, t.pendingProps = a = T, yS(e, l))
            (e.flags & ju) !== Te && (ha = !0);
          else
            return t.lanes = e.lanes, Go(e, t, l);
      }
      return sS(e, t, i, a, l);
    }
    function P1(e, t, i) {
      var a = t.pendingProps, l = a.children, f = e !== null ? e.memoizedState : null;
      if (a.mode === "hidden" || le)
        if ((t.mode & Ye) === De) {
          var v = {
            baseLanes: q,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = v, ly(t, i);
        } else if (dr(i, fr)) {
          var M = {
            baseLanes: q,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = M;
          var L = f !== null ? f.baseLanes : i;
          ly(t, L);
        } else {
          var S = null, b;
          if (f !== null) {
            var x = f.baseLanes;
            b = Be(x, i);
          } else
            b = i;
          t.lanes = t.childLanes = fr;
          var T = {
            baseLanes: b,
            cachePool: S,
            transitions: null
          };
          return t.memoizedState = T, t.updateQueue = null, ly(t, b), null;
        }
      else {
        var H;
        f !== null ? (H = Be(f.baseLanes, i), t.memoizedState = null) : H = i, ly(t, H);
      }
      return Rr(e, t, l, i), t.child;
    }
    function _R(e, t, i) {
      var a = t.pendingProps;
      return Rr(e, t, a, i), t.child;
    }
    function CR(e, t, i) {
      var a = t.pendingProps.children;
      return Rr(e, t, a, i), t.child;
    }
    function xR(e, t, i) {
      {
        t.flags |= Ve;
        {
          var a = t.stateNode;
          a.effectDuration = 0, a.passiveEffectDuration = 0;
        }
      }
      var l = t.pendingProps, f = l.children;
      return Rr(e, t, f, i), t.child;
    }
    function V1(e, t) {
      var i = t.ref;
      (e === null && i !== null || e !== null && e.ref !== i) && (t.flags |= ar, t.flags |= Sd);
    }
    function sS(e, t, i, a, l) {
      if (t.type !== t.elementType) {
        var f = i.propTypes;
        f && la(
          f,
          a,
          // Resolved props
          "prop",
          bt(i)
        );
      }
      var v;
      {
        var S = ef(t, i, !0);
        v = tf(t, S);
      }
      var b, x;
      lf(t, l), Pa(t);
      {
        if (zh.current = t, ci(!0), b = pf(e, t, i, a, v, l), x = vf(), t.mode & Ut) {
          an(!0);
          try {
            b = pf(e, t, i, a, v, l), x = vf();
          } finally {
            an(!1);
          }
        }
        ci(!1);
      }
      return Eo(), e !== null && !ha ? (o1(e, t, l), Go(e, t, l)) : (Gn() && x && Bg(t), t.flags |= Ua, Rr(e, t, b, l), t.child);
    }
    function B1(e, t, i, a, l) {
      {
        switch (VD(t)) {
          case !1: {
            var f = t.stateNode, v = t.type, S = new v(t.memoizedProps, f.context), b = S.state;
            f.updater.enqueueSetState(f, b, null);
            break;
          }
          case !0: {
            t.flags |= Ue, t.flags |= pn;
            var x = new Error("Simulated error coming from DevTools"), T = on(l);
            t.lanes = Be(t.lanes, T);
            var M = rS(t, vs(x, t), T);
            a0(t, M);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var L = i.propTypes;
          L && la(
            L,
            a,
            // Resolved props
            "prop",
            bt(i)
          );
        }
      }
      var H;
      Xa(i) ? (H = !0, om(t)) : H = !1, lf(t, l);
      var P = t.stateNode, I;
      P === null ? (Km(e, t), Kb(t, i, a), y0(t, i, a, l), I = !0) : e === null ? I = JT(t, i, a, l) : I = XT(e, t, i, a, l);
      var de = cS(e, t, i, I, H, l);
      {
        var Re = t.stateNode;
        I && Re.props !== a && (ms || m("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", He(t) || "a component"), ms = !0);
      }
      return de;
    }
    function cS(e, t, i, a, l, f) {
      V1(e, t);
      var v = (t.flags & Ue) !== Te;
      if (!a && !v)
        return l && _b(t, i, !1), Go(e, t, f);
      var S = t.stateNode;
      zh.current = t;
      var b;
      if (v && typeof i.getDerivedStateFromError != "function")
        b = null, M1();
      else {
        Pa(t);
        {
          if (ci(!0), b = S.render(), t.mode & Ut) {
            an(!0);
            try {
              S.render();
            } finally {
              an(!1);
            }
          }
          ci(!1);
        }
        Eo();
      }
      return t.flags |= Ua, e !== null && v ? ER(e, t, b, f) : Rr(e, t, b, f), t.memoizedState = S.state, l && _b(t, i, !0), t.child;
    }
    function I1(e) {
      var t = e.stateNode;
      t.pendingContext ? bb(e, t.pendingContext, t.pendingContext !== t.context) : t.context && bb(e, t.context, !1), _0(e, t.containerInfo);
    }
    function TR(e, t, i) {
      if (I1(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var a = t.pendingProps, l = t.memoizedState, f = l.element;
      Vb(e, t), bm(t, a, null, i);
      var v = t.memoizedState;
      t.stateNode;
      var S = v.element;
      if (l.isDehydrated) {
        var b = {
          element: S,
          isDehydrated: !1,
          cache: v.cache,
          pendingSuspenseBoundaries: v.pendingSuspenseBoundaries,
          transitions: v.transitions
        }, x = t.updateQueue;
        if (x.baseState = b, t.memoizedState = b, t.flags & Pt) {
          var T = vs(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return Y1(e, t, S, i, T);
        } else if (S !== f) {
          var M = vs(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return Y1(e, t, S, i, M);
        } else {
          OT(t);
          var L = t1(t, null, S, i);
          t.child = L;
          for (var H = L; H;)
            H.flags = H.flags & ~xt | Pr, H = H.sibling;
        }
      } else {
        if (af(), S === f)
          return Go(e, t, i);
        Rr(e, t, S, i);
      }
      return t.child;
    }
    function Y1(e, t, i, a, l) {
      return af(), Wg(l), t.flags |= Pt, Rr(e, t, i, a), t.child;
    }
    function RR(e, t, i) {
      r1(t), e === null && Gg(t);
      var a = t.type, l = t.pendingProps, f = e !== null ? e.memoizedProps : null, v = l.children, S = Dg(a, l);
      return S ? v = null : f !== null && Dg(a, f) && (t.flags |= pt), V1(e, t), Rr(e, t, v, i), t.child;
    }
    function kR(e, t) {
      return e === null && Gg(t), null;
    }
    function DR(e, t, i, a) {
      Km(e, t);
      var l = t.pendingProps, f = i, v = f._payload, S = f._init, b = S(v);
      t.type = b;
      var x = t.tag = kD(b), T = ca(b, l), M;
      switch (x) {
        case C:
          return fS(t, b), t.type = b = _f(b), M = sS(null, t, b, T, a), M;
        case R:
          return t.type = b = PS(b), M = B1(null, t, b, T, a), M;
        case pe:
          return t.type = b = VS(b), M = F1(null, t, b, T, a), M;
        case ft: {
          if (t.type !== t.elementType) {
            var L = b.propTypes;
            L && la(
              L,
              T,
              // Resolved for outer only
              "prop",
              bt(b)
            );
          }
          return M = $1(
            null,
            t,
            b,
            ca(b.type, T),
            // The inner type can have defaults too
            a
          ), M;
        }
      }
      var H = "";
      throw b !== null && typeof b == "object" && b.$$typeof === Yn && (H = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + b + ". " + ("Lazy element type must resolve to a class or function." + H));
    }
    function OR(e, t, i, a, l) {
      Km(e, t), t.tag = R;
      var f;
      return Xa(i) ? (f = !0, om(t)) : f = !1, lf(t, l), Kb(t, i, a), y0(t, i, a, l), cS(null, t, i, !0, f, l);
    }
    function LR(e, t, i, a) {
      Km(e, t);
      var l = t.pendingProps, f;
      {
        var v = ef(t, i, !1);
        f = tf(t, v);
      }
      lf(t, a);
      var S, b;
      Pa(t);
      {
        if (i.prototype && typeof i.prototype.render == "function") {
          var x = bt(i) || "Unknown";
          iS[x] || (m("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", x, x), iS[x] = !0);
        }
        t.mode & Ut && sa.recordLegacyContextWarning(t, null), ci(!0), zh.current = t, S = pf(null, t, i, l, f, a), b = vf(), ci(!1);
      }
      if (Eo(), t.flags |= Ua, typeof S == "object" && S !== null && typeof S.render == "function" && S.$$typeof === void 0) {
        var T = bt(i) || "Unknown";
        jh[T] || (m("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", T, T, T), jh[T] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof S == "object" && S !== null && typeof S.render == "function" && S.$$typeof === void 0
      ) {
        {
          var M = bt(i) || "Unknown";
          jh[M] || (m("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", M, M, M), jh[M] = !0);
        }
        t.tag = R, t.memoizedState = null, t.updateQueue = null;
        var L = !1;
        return Xa(i) ? (L = !0, om(t)) : L = !1, t.memoizedState = S.state !== null && S.state !== void 0 ? S.state : null, i0(t), Wb(t, S), y0(t, i, l, a), cS(null, t, i, !0, L, a);
      } else {
        if (t.tag = C, t.mode & Ut) {
          an(!0);
          try {
            S = pf(null, t, i, l, f, a), b = vf();
          } finally {
            an(!1);
          }
        }
        return Gn() && b && Bg(t), Rr(null, t, S, a), fS(t, i), t.child;
      }
    }
    function fS(e, t) {
      {
        if (t && t.childContextTypes && m("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var i = "", a = jr();
          a && (i += `

Check the render method of \`` + a + "`.");
          var l = a || "", f = e._debugSource;
          f && (l = f.fileName + ":" + f.lineNumber), lS[l] || (lS[l] = !0, m("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", i));
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var v = bt(t) || "Unknown";
          oS[v] || (m("%s: Function components do not support getDerivedStateFromProps.", v), oS[v] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var S = bt(t) || "Unknown";
          aS[S] || (m("%s: Function components do not support contextType.", S), aS[S] = !0);
        }
      }
    }
    var dS = {
      dehydrated: null,
      treeContext: null,
      retryLane: et
    };
    function hS(e) {
      return {
        baseLanes: e,
        cachePool: bR(),
        transitions: null
      };
    }
    function AR(e, t) {
      var i = null;
      return {
        baseLanes: Be(e.baseLanes, t),
        cachePool: i,
        transitions: e.transitions
      };
    }
    function MR(e, t, i, a) {
      if (t !== null) {
        var l = t.memoizedState;
        if (l === null)
          return !1;
      }
      return T0(e, kh);
    }
    function UR(e, t) {
      return xl(e.childLanes, t);
    }
    function q1(e, t, i) {
      var a = t.pendingProps;
      BD(t) && (t.flags |= Ue);
      var l = fa.current, f = !1, v = (t.flags & Ue) !== Te;
      if (v || MR(l, e) ? (f = !0, t.flags &= ~Ue) : (e === null || e.memoizedState !== null) && (l = nR(l, a1)), l = cf(l), Gl(t, l), e === null) {
        Gg(t);
        var S = t.memoizedState;
        if (S !== null) {
          var b = S.dehydrated;
          if (b !== null)
            return $R(t, b);
        }
        var x = a.children, T = a.fallback;
        if (f) {
          var M = NR(t, x, T, i), L = t.child;
          return L.memoizedState = hS(i), t.memoizedState = dS, M;
        } else
          return pS(t, x);
      } else {
        var H = e.memoizedState;
        if (H !== null) {
          var P = H.dehydrated;
          if (P !== null)
            return HR(e, t, v, a, P, H, i);
        }
        if (f) {
          var I = a.fallback, de = a.children, Re = jR(e, t, de, I, i), Ee = t.child, nt = e.child.memoizedState;
          return Ee.memoizedState = nt === null ? hS(i) : AR(nt, i), Ee.childLanes = UR(e, i), t.memoizedState = dS, Re;
        } else {
          var Ke = a.children, z = zR(e, t, Ke, i);
          return t.memoizedState = null, z;
        }
      }
    }
    function pS(e, t, i) {
      var a = e.mode, l = {
        mode: "visible",
        children: t
      }, f = vS(l, a);
      return f.return = e, e.child = f, f;
    }
    function NR(e, t, i, a) {
      var l = e.mode, f = e.child, v = {
        mode: "hidden",
        children: t
      }, S, b;
      return (l & Ye) === De && f !== null ? (S = f, S.childLanes = q, S.pendingProps = v, e.mode & Oe && (S.actualDuration = 0, S.actualStartTime = -1, S.selfBaseDuration = 0, S.treeBaseDuration = 0), b = nu(i, l, a, null)) : (S = vS(v, l), b = nu(i, l, a, null)), S.return = e, b.return = e, S.sibling = b, e.child = S, b;
    }
    function vS(e, t, i) {
      return QE(e, t, q, null);
    }
    function Q1(e, t) {
      return bs(e, t);
    }
    function zR(e, t, i, a) {
      var l = e.child, f = l.sibling, v = Q1(l, {
        mode: "visible",
        children: i
      });
      if ((t.mode & Ye) === De && (v.lanes = a), v.return = t, v.sibling = null, f !== null) {
        var S = t.deletions;
        S === null ? (t.deletions = [f], t.flags |= st) : S.push(f);
      }
      return t.child = v, v;
    }
    function jR(e, t, i, a, l) {
      var f = t.mode, v = e.child, S = v.sibling, b = {
        mode: "hidden",
        children: i
      }, x;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (f & Ye) === De && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== v
      ) {
        var T = t.child;
        x = T, x.childLanes = q, x.pendingProps = b, t.mode & Oe && (x.actualDuration = 0, x.actualStartTime = -1, x.selfBaseDuration = v.selfBaseDuration, x.treeBaseDuration = v.treeBaseDuration), t.deletions = null;
      } else
        x = Q1(v, b), x.subtreeFlags = v.subtreeFlags & wn;
      var M;
      return S !== null ? M = bs(S, a) : (M = nu(a, f, l, null), M.flags |= xt), M.return = t, x.return = t, x.sibling = M, t.child = x, M;
    }
    function Wm(e, t, i, a) {
      a !== null && Wg(a), uf(t, e.child, null, i);
      var l = t.pendingProps, f = l.children, v = pS(t, f);
      return v.flags |= xt, t.memoizedState = null, v;
    }
    function FR(e, t, i, a, l) {
      var f = t.mode, v = {
        mode: "visible",
        children: i
      }, S = vS(v, f), b = nu(a, f, l, null);
      return b.flags |= xt, S.return = t, b.return = t, S.sibling = b, t.child = S, (t.mode & Ye) !== De && uf(t, e.child, null, l), b;
    }
    function $R(e, t, i) {
      return (e.mode & Ye) === De ? (m("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = Le) : Mg(t) ? e.lanes = xo : e.lanes = fr, null;
    }
    function HR(e, t, i, a, l, f, v) {
      if (i)
        if (t.flags & Pt) {
          t.flags &= ~Pt;
          var z = tS(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return Wm(e, t, v, z);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= Ue, null;
          var Y = a.children, j = a.fallback, J = FR(e, t, Y, j, v), he = t.child;
          return he.memoizedState = hS(v), t.memoizedState = dS, J;
        }
      else {
        if (kT(), (t.mode & Ye) === De)
          return Wm(
            e,
            t,
            v,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (Mg(l)) {
          var S, b, x;
          {
            var T = Yx(l);
            S = T.digest, b = T.message, x = T.stack;
          }
          var M;
          b ? M = new Error(b) : M = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var L = tS(M, S, x);
          return Wm(e, t, v, L);
        }
        var H = dr(v, e.childLanes);
        if (ha || H) {
          var P = oy();
          if (P !== null) {
            var I = eg(P, v);
            if (I !== et && I !== f.retryLane) {
              f.retryLane = I;
              var de = _t;
              Jr(e, I), On(P, e, I, de);
            }
          }
          zS();
          var Re = tS(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return Wm(e, t, v, Re);
        } else if (vb(l)) {
          t.flags |= Ue, t.child = e.child;
          var Ee = fD.bind(null, e);
          return qx(l, Ee), null;
        } else {
          LT(t, l, f.treeContext);
          var nt = a.children, Ke = pS(t, nt);
          return Ke.flags |= Pr, Ke;
        }
      }
    }
    function G1(e, t, i) {
      e.lanes = Be(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = Be(a.lanes, t)), e0(e.return, t, i);
    }
    function PR(e, t, i) {
      for (var a = t; a !== null;) {
        if (a.tag === $e) {
          var l = a.memoizedState;
          l !== null && G1(a, i, e);
        } else if (a.tag === ht)
          G1(a, i, e);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return;
        for (; a.sibling === null;) {
          if (a.return === null || a.return === e)
            return;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
    }
    function VR(e) {
      for (var t = e, i = null; t !== null;) {
        var a = t.alternate;
        a !== null && km(a) === null && (i = t), t = t.sibling;
      }
      return i;
    }
    function BR(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !uS[e])
        if (uS[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              m('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              m('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              m('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          m('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function IR(e, t) {
      e !== void 0 && !Gm[e] && (e !== "collapsed" && e !== "hidden" ? (Gm[e] = !0, m('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (Gm[e] = !0, m('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function W1(e, t) {
      {
        var i = dn(e), a = !i && typeof Ii(e) == "function";
        if (i || a) {
          var l = i ? "array" : "iterable";
          return m("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", l, t, l), !1;
        }
      }
      return !0;
    }
    function YR(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (dn(e)) {
          for (var i = 0; i < e.length; i++)
            if (!W1(e[i], i))
              return;
        } else {
          var a = Ii(e);
          if (typeof a == "function") {
            var l = a.call(e);
            if (l)
              for (var f = l.next(), v = 0; !f.done; f = l.next()) {
                if (!W1(f.value, v))
                  return;
                v++;
              }
          } else
            m('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function mS(e, t, i, a, l) {
      var f = e.memoizedState;
      f === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: a,
        tail: i,
        tailMode: l
      } : (f.isBackwards = t, f.rendering = null, f.renderingStartTime = 0, f.last = a, f.tail = i, f.tailMode = l);
    }
    function K1(e, t, i) {
      var a = t.pendingProps, l = a.revealOrder, f = a.tail, v = a.children;
      BR(l), IR(f, l), YR(v, l), Rr(e, t, v, i);
      var S = fa.current, b = T0(S, kh);
      if (b)
        S = R0(S, kh), t.flags |= Ue;
      else {
        var x = e !== null && (e.flags & Ue) !== Te;
        x && PR(t, t.child, i), S = cf(S);
      }
      if (Gl(t, S), (t.mode & Ye) === De)
        t.memoizedState = null;
      else
        switch (l) {
          case "forwards": {
            var T = VR(t.child), M;
            T === null ? (M = t.child, t.child = null) : (M = T.sibling, T.sibling = null), mS(
              t,
              !1,
              // isBackwards
              M,
              T,
              f
            );
            break;
          }
          case "backwards": {
            var L = null, H = t.child;
            for (t.child = null; H !== null;) {
              var P = H.alternate;
              if (P !== null && km(P) === null) {
                t.child = H;
                break;
              }
              var I = H.sibling;
              H.sibling = L, L = H, H = I;
            }
            mS(
              t,
              !0,
              // isBackwards
              L,
              null,
              // last
              f
            );
            break;
          }
          case "together": {
            mS(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function qR(e, t, i) {
      _0(t, t.stateNode.containerInfo);
      var a = t.pendingProps;
      return e === null ? t.child = uf(t, null, a, i) : Rr(e, t, a, i), t.child;
    }
    var J1 = !1;
    function QR(e, t, i) {
      var a = t.type, l = a._context, f = t.pendingProps, v = t.memoizedProps, S = f.value;
      {
        "value" in f || J1 || (J1 = !0, m("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var b = t.type.propTypes;
        b && la(b, f, "prop", "Context.Provider");
      }
      if (Fb(t, l, S), v !== null) {
        var x = v.value;
        if (ye(x, S)) {
          if (v.children === f.children && !im())
            return Go(e, t, i);
        } else
          PT(t, l, i);
      }
      var T = f.children;
      return Rr(e, t, T, i), t.child;
    }
    var X1 = !1;
    function GR(e, t, i) {
      var a = t.type;
      a._context === void 0 ? a !== a.Consumer && (X1 || (X1 = !0, m("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : a = a._context;
      var l = t.pendingProps, f = l.children;
      typeof f != "function" && m("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), lf(t, i);
      var v = Sn(a);
      Pa(t);
      var S;
      return zh.current = t, ci(!0), S = f(v), ci(!1), Eo(), t.flags |= Ua, Rr(e, t, S, i), t.child;
    }
    function Fh() {
      ha = !0;
    }
    function Km(e, t) {
      (t.mode & Ye) === De && e !== null && (e.alternate = null, t.alternate = null, t.flags |= xt);
    }
    function Go(e, t, i) {
      return e !== null && (t.dependencies = e.dependencies), M1(), Kh(t.lanes), dr(i, t.childLanes) ? (ZT(e, t), t.child) : null;
    }
    function WR(e, t, i) {
      {
        var a = t.return;
        if (a === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, i.index = t.index, i.sibling = t.sibling, i.return = t.return, i.ref = t.ref, t === a.child)
          a.child = i;
        else {
          var l = a.child;
          if (l === null)
            throw new Error("Expected parent to have a child.");
          for (; l.sibling !== t;)
            if (l = l.sibling, l === null)
              throw new Error("Expected to find the previous sibling.");
          l.sibling = i;
        }
        var f = a.deletions;
        return f === null ? (a.deletions = [e], a.flags |= st) : f.push(e), i.flags |= xt, i;
      }
    }
    function yS(e, t) {
      var i = e.lanes;
      return !!dr(i, t);
    }
    function KR(e, t, i) {
      switch (t.tag) {
        case U:
          I1(t), t.stateNode, af();
          break;
        case B:
          r1(t);
          break;
        case R: {
          var a = t.type;
          Xa(a) && om(t);
          break;
        }
        case $:
          _0(t, t.stateNode.containerInfo);
          break;
        case Ce: {
          var l = t.memoizedProps.value, f = t.type._context;
          Fb(t, f, l);
          break;
        }
        case _e:
          {
            var v = dr(i, t.childLanes);
            v && (t.flags |= Ve);
            {
              var S = t.stateNode;
              S.effectDuration = 0, S.passiveEffectDuration = 0;
            }
          }
          break;
        case $e: {
          var b = t.memoizedState;
          if (b !== null) {
            if (b.dehydrated !== null)
              return Gl(t, cf(fa.current)), t.flags |= Ue, null;
            var x = t.child, T = x.childLanes;
            if (dr(i, T))
              return q1(e, t, i);
            Gl(t, cf(fa.current));
            var M = Go(e, t, i);
            return M !== null ? M.sibling : null;
          } else
            Gl(t, cf(fa.current));
          break;
        }
        case ht: {
          var L = (e.flags & Ue) !== Te, H = dr(i, t.childLanes);
          if (L) {
            if (H)
              return K1(e, t, i);
            t.flags |= Ue;
          }
          var P = t.memoizedState;
          if (P !== null && (P.rendering = null, P.tail = null, P.lastEffect = null), Gl(t, fa.current), H)
            break;
          return null;
        }
        case qe:
        case ze:
          return t.lanes = q, P1(e, t, i);
      }
      return Go(e, t, i);
    }
    function Z1(e, t, i) {
      if (t._debugNeedsRemount && e !== null)
        return WR(e, t, QS(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var a = e.memoizedProps, l = t.pendingProps;
        if (a !== l || im() || // Force a re-render if the implementation changed due to hot reload:
          t.type !== e.type)
          ha = !0;
        else {
          var f = yS(e, i);
          if (!f && // If this is the second pass of an error or suspense boundary, there
            // may not be work scheduled on `current`, so we check for this flag.
            (t.flags & Ue) === Te)
            return ha = !1, KR(e, t, i);
          (e.flags & ju) !== Te ? ha = !0 : ha = !1;
        }
      } else if (ha = !1, Gn() && ET(t)) {
        var v = t.index, S = _T();
        Tb(t, S, v);
      }
      switch (t.lanes = q, t.tag) {
        case O:
          return LR(e, t, t.type, i);
        case Pe: {
          var b = t.elementType;
          return DR(e, t, b, i);
        }
        case C: {
          var x = t.type, T = t.pendingProps, M = t.elementType === x ? T : ca(x, T);
          return sS(e, t, x, M, i);
        }
        case R: {
          var L = t.type, H = t.pendingProps, P = t.elementType === L ? H : ca(L, H);
          return B1(e, t, L, P, i);
        }
        case U:
          return TR(e, t, i);
        case B:
          return RR(e, t, i);
        case X:
          return kR(e, t);
        case $e:
          return q1(e, t, i);
        case $:
          return qR(e, t, i);
        case pe: {
          var I = t.type, de = t.pendingProps, Re = t.elementType === I ? de : ca(I, de);
          return F1(e, t, I, Re, i);
        }
        case ee:
          return _R(e, t, i);
        case re:
          return CR(e, t, i);
        case _e:
          return xR(e, t, i);
        case Ce:
          return QR(e, t, i);
        case Je:
          return GR(e, t, i);
        case ft: {
          var Ee = t.type, nt = t.pendingProps, Ke = ca(Ee, nt);
          if (t.type !== t.elementType) {
            var z = Ee.propTypes;
            z && la(
              z,
              Ke,
              // Resolved for outer only
              "prop",
              bt(Ee)
            );
          }
          return Ke = ca(Ee.type, Ke), $1(e, t, Ee, Ke, i);
        }
        case Ae:
          return H1(e, t, t.type, t.pendingProps, i);
        case dt: {
          var Y = t.type, j = t.pendingProps, J = t.elementType === Y ? j : ca(Y, j);
          return OR(e, t, Y, J, i);
        }
        case ht:
          return K1(e, t, i);
        case Gt:
          break;
        case qe:
          return P1(e, t, i);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function mf(e) {
      e.flags |= Ve;
    }
    function eE(e) {
      e.flags |= ar, e.flags |= Sd;
    }
    var tE, gS, nE, rE;
    tE = function (e, t, i, a) {
      for (var l = t.child; l !== null;) {
        if (l.tag === B || l.tag === X)
          Sx(e, l.stateNode);
        else if (l.tag !== $) {
          if (l.child !== null) {
            l.child.return = l, l = l.child;
            continue;
          }
        }
        if (l === t)
          return;
        for (; l.sibling === null;) {
          if (l.return === null || l.return === t)
            return;
          l = l.return;
        }
        l.sibling.return = l.return, l = l.sibling;
      }
    }, gS = function (e, t) {
    }, nE = function (e, t, i, a, l) {
      var f = e.memoizedProps;
      if (f !== a) {
        var v = t.stateNode, S = C0(), b = bx(v, i, f, a, l, S);
        t.updateQueue = b, b && mf(t);
      }
    }, rE = function (e, t, i, a) {
      i !== a && mf(t);
    };
    function $h(e, t) {
      if (!Gn())
        switch (e.tailMode) {
          case "hidden": {
            for (var i = e.tail, a = null; i !== null;)
              i.alternate !== null && (a = i), i = i.sibling;
            a === null ? e.tail = null : a.sibling = null;
            break;
          }
          case "collapsed": {
            for (var l = e.tail, f = null; l !== null;)
              l.alternate !== null && (f = l), l = l.sibling;
            f === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : f.sibling = null;
            break;
          }
        }
    }
    function Kn(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, i = q, a = Te;
      if (t) {
        if ((e.mode & Oe) !== De) {
          for (var b = e.selfBaseDuration, x = e.child; x !== null;)
            i = Be(i, Be(x.lanes, x.childLanes)), a |= x.subtreeFlags & wn, a |= x.flags & wn, b += x.treeBaseDuration, x = x.sibling;
          e.treeBaseDuration = b;
        } else
          for (var T = e.child; T !== null;)
            i = Be(i, Be(T.lanes, T.childLanes)), a |= T.subtreeFlags & wn, a |= T.flags & wn, T.return = e, T = T.sibling;
        e.subtreeFlags |= a;
      } else {
        if ((e.mode & Oe) !== De) {
          for (var l = e.actualDuration, f = e.selfBaseDuration, v = e.child; v !== null;)
            i = Be(i, Be(v.lanes, v.childLanes)), a |= v.subtreeFlags, a |= v.flags, l += v.actualDuration, f += v.treeBaseDuration, v = v.sibling;
          e.actualDuration = l, e.treeBaseDuration = f;
        } else
          for (var S = e.child; S !== null;)
            i = Be(i, Be(S.lanes, S.childLanes)), a |= S.subtreeFlags, a |= S.flags, S.return = e, S = S.sibling;
        e.subtreeFlags |= a;
      }
      return e.childLanes = i, t;
    }
    function JR(e, t, i) {
      if (zT() && (t.mode & Ye) !== De && (t.flags & Ue) === Te)
        return Mb(t), af(), t.flags |= Pt | br | pn, !1;
      var a = fm(t);
      if (i !== null && i.dehydrated !== null)
        if (e === null) {
          if (!a)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (UT(t), Kn(t), (t.mode & Oe) !== De) {
            var l = i !== null;
            if (l) {
              var f = t.child;
              f !== null && (t.treeBaseDuration -= f.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (af(), (t.flags & Ue) === Te && (t.memoizedState = null), t.flags |= Ve, Kn(t), (t.mode & Oe) !== De) {
            var v = i !== null;
            if (v) {
              var S = t.child;
              S !== null && (t.treeBaseDuration -= S.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return Ub(), !0;
    }
    function iE(e, t, i) {
      var a = t.pendingProps;
      switch (Ig(t), t.tag) {
        case O:
        case Pe:
        case Ae:
        case C:
        case pe:
        case ee:
        case re:
        case _e:
        case Je:
        case ft:
          return Kn(t), null;
        case R: {
          var l = t.type;
          return Xa(l) && am(t), Kn(t), null;
        }
        case U: {
          var f = t.stateNode;
          if (sf(t), Hg(t), D0(), f.pendingContext && (f.context = f.pendingContext, f.pendingContext = null), e === null || e.child === null) {
            var v = fm(t);
            if (v)
              mf(t);
            else if (e !== null) {
              var S = e.memoizedState;
              // Check if this is a client root
              (!S.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
                (t.flags & Pt) !== Te) && (t.flags |= Hr, Ub());
            }
          }
          return gS(e, t), Kn(t), null;
        }
        case B: {
          x0(t);
          var b = n1(), x = t.type;
          if (e !== null && t.stateNode != null)
            nE(e, t, x, a, b), e.ref !== t.ref && eE(t);
          else {
            if (!a) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return Kn(t), null;
            }
            var T = C0(), M = fm(t);
            if (M)
              AT(t, b, T) && mf(t);
            else {
              var L = gx(x, a, b, T, t);
              tE(L, t, !1, !1), t.stateNode = L, wx(L, x, a, b) && mf(t);
            }
            t.ref !== null && eE(t);
          }
          return Kn(t), null;
        }
        case X: {
          var H = a;
          if (e && t.stateNode != null) {
            var P = e.memoizedProps;
            rE(e, t, P, H);
          } else {
            if (typeof H != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var I = n1(), de = C0(), Re = fm(t);
            Re ? MT(t) && mf(t) : t.stateNode = Ex(H, I, de, t);
          }
          return Kn(t), null;
        }
        case $e: {
          ff(t);
          var Ee = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var nt = JR(e, t, Ee);
            if (!nt)
              return t.flags & pn ? t : null;
          }
          if ((t.flags & Ue) !== Te)
            return t.lanes = i, (t.mode & Oe) !== De && eS(t), t;
          var Ke = Ee !== null, z = e !== null && e.memoizedState !== null;
          if (Ke !== z && Ke) {
            var Y = t.child;
            if (Y.flags |= Na, (t.mode & Ye) !== De) {
              var j = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !Ie);
              j || T0(fa.current, a1) ? Xk() : zS();
            }
          }
          var J = t.updateQueue;
          if (J !== null && (t.flags |= Ve), Kn(t), (t.mode & Oe) !== De && Ke) {
            var he = t.child;
            he !== null && (t.treeBaseDuration -= he.treeBaseDuration);
          }
          return null;
        }
        case $:
          return sf(t), gS(e, t), e === null && vT(t.stateNode.containerInfo), Kn(t), null;
        case Ce:
          var se = t.type._context;
          return Zg(se, t), Kn(t), null;
        case dt: {
          var Me = t.type;
          return Xa(Me) && am(t), Kn(t), null;
        }
        case ht: {
          ff(t);
          var Fe = t.memoizedState;
          if (Fe === null)
            return Kn(t), null;
          var St = (t.flags & Ue) !== Te, ot = Fe.rendering;
          if (ot === null)
            if (St)
              $h(Fe, !1);
            else {
              var cn = eD() && (e === null || (e.flags & Ue) === Te);
              if (!cn)
                for (var lt = t.child; lt !== null;) {
                  var tn = km(lt);
                  if (tn !== null) {
                    St = !0, t.flags |= Ue, $h(Fe, !1);
                    var mr = tn.updateQueue;
                    return mr !== null && (t.updateQueue = mr, t.flags |= Ve), t.subtreeFlags = Te, eR(t, i), Gl(t, R0(fa.current, kh)), t.child;
                  }
                  lt = lt.sibling;
                }
              Fe.tail !== null && Mt() > xE() && (t.flags |= Ue, St = !0, $h(Fe, !1), t.lanes = Ad);
            }
          else {
            if (!St) {
              var tr = km(ot);
              if (tr !== null) {
                t.flags |= Ue, St = !0;
                var gi = tr.updateQueue;
                if (gi !== null && (t.updateQueue = gi, t.flags |= Ve), $h(Fe, !0), Fe.tail === null && Fe.tailMode === "hidden" && !ot.alternate && !Gn())
                  return Kn(t), null;
              } else
                // The time it took to render last row is greater than the remaining
                // time we have to render. So rendering one more row would likely
                // exceed it.
                Mt() * 2 - Fe.renderingStartTime > xE() && i !== fr && (t.flags |= Ue, St = !0, $h(Fe, !1), t.lanes = Ad);
            }
            if (Fe.isBackwards)
              ot.sibling = t.child, t.child = ot;
            else {
              var Or = Fe.last;
              Or !== null ? Or.sibling = ot : t.child = ot, Fe.last = ot;
            }
          }
          if (Fe.tail !== null) {
            var Lr = Fe.tail;
            Fe.rendering = Lr, Fe.tail = Lr.sibling, Fe.renderingStartTime = Mt(), Lr.sibling = null;
            var yr = fa.current;
            return St ? yr = R0(yr, kh) : yr = cf(yr), Gl(t, yr), Lr;
          }
          return Kn(t), null;
        }
        case Gt:
          break;
        case qe:
        case ze: {
          NS(t);
          var Zo = t.memoizedState, Cf = Zo !== null;
          if (e !== null) {
            var tp = e.memoizedState, oo = tp !== null;
            oo !== Cf && // LegacyHidden doesn't do any hiding — it only pre-renders.
              !le && (t.flags |= Na);
          }
          return !Cf || (t.mode & Ye) === De ? Kn(t) : dr(ao, fr) && (Kn(t), t.subtreeFlags & (xt | Ve) && (t.flags |= Na)), null;
        }
        case Ct:
          return null;
        case Xe:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function XR(e, t, i) {
      switch (Ig(t), t.tag) {
        case R: {
          var a = t.type;
          Xa(a) && am(t);
          var l = t.flags;
          return l & pn ? (t.flags = l & ~pn | Ue, (t.mode & Oe) !== De && eS(t), t) : null;
        }
        case U: {
          t.stateNode, sf(t), Hg(t), D0();
          var f = t.flags;
          return (f & pn) !== Te && (f & Ue) === Te ? (t.flags = f & ~pn | Ue, t) : null;
        }
        case B:
          return x0(t), null;
        case $e: {
          ff(t);
          var v = t.memoizedState;
          if (v !== null && v.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            af();
          }
          var S = t.flags;
          return S & pn ? (t.flags = S & ~pn | Ue, (t.mode & Oe) !== De && eS(t), t) : null;
        }
        case ht:
          return ff(t), null;
        case $:
          return sf(t), null;
        case Ce:
          var b = t.type._context;
          return Zg(b, t), null;
        case qe:
        case ze:
          return NS(t), null;
        case Ct:
          return null;
        default:
          return null;
      }
    }
    function aE(e, t, i) {
      switch (Ig(t), t.tag) {
        case R: {
          var a = t.type.childContextTypes;
          a != null && am(t);
          break;
        }
        case U: {
          t.stateNode, sf(t), Hg(t), D0();
          break;
        }
        case B: {
          x0(t);
          break;
        }
        case $:
          sf(t);
          break;
        case $e:
          ff(t);
          break;
        case ht:
          ff(t);
          break;
        case Ce:
          var l = t.type._context;
          Zg(l, t);
          break;
        case qe:
        case ze:
          NS(t);
          break;
      }
    }
    var oE = null;
    oE = /* @__PURE__ */ new Set();
    var Jm = !1, Jn = !1, ZR = typeof WeakSet == "function" ? WeakSet : Set, ge = null, yf = null, gf = null;
    function ek(e) {
      wo(null, function () {
        throw e;
      }), yd();
    }
    var tk = function (e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & Oe)
        try {
          ro(), t.componentWillUnmount();
        } finally {
          no(e);
        }
      else
        t.componentWillUnmount();
    };
    function lE(e, t) {
      try {
        Jl(Cn, e);
      } catch (i) {
        Dt(e, t, i);
      }
    }
    function SS(e, t, i) {
      try {
        tk(e, i);
      } catch (a) {
        Dt(e, t, a);
      }
    }
    function nk(e, t, i) {
      try {
        i.componentDidMount();
      } catch (a) {
        Dt(e, t, a);
      }
    }
    function uE(e, t) {
      try {
        cE(e);
      } catch (i) {
        Dt(e, t, i);
      }
    }
    function Sf(e, t) {
      var i = e.ref;
      if (i !== null)
        if (typeof i == "function") {
          var a;
          try {
            if (In && Ea && e.mode & Oe)
              try {
                ro(), a = i(null);
              } finally {
                no(e);
              }
            else
              a = i(null);
          } catch (l) {
            Dt(e, t, l);
          }
          typeof a == "function" && m("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", He(e));
        } else
          i.current = null;
    }
    function Xm(e, t, i) {
      try {
        i();
      } catch (a) {
        Dt(e, t, a);
      }
    }
    var sE = !1;
    function rk(e, t) {
      mx(e.containerInfo), ge = t, ik();
      var i = sE;
      return sE = !1, i;
    }
    function ik() {
      for (; ge !== null;) {
        var e = ge, t = e.child;
        (e.subtreeFlags & yl) !== Te && t !== null ? (t.return = e, ge = t) : ak();
      }
    }
    function ak() {
      for (; ge !== null;) {
        var e = ge;
        yt(e);
        try {
          ok(e);
        } catch (i) {
          Dt(e, e.return, i);
        }
        rn();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ge = t;
          return;
        }
        ge = e.return;
      }
    }
    function ok(e) {
      var t = e.alternate, i = e.flags;
      if ((i & Hr) !== Te) {
        switch (yt(e), e.tag) {
          case C:
          case pe:
          case Ae:
            break;
          case R: {
            if (t !== null) {
              var a = t.memoizedProps, l = t.memoizedState, f = e.stateNode;
              e.type === e.elementType && !ms && (f.props !== e.memoizedProps && m("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", He(e) || "instance"), f.state !== e.memoizedState && m("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", He(e) || "instance"));
              var v = f.getSnapshotBeforeUpdate(e.elementType === e.type ? a : ca(e.type, a), l);
              {
                var S = oE;
                v === void 0 && !S.has(e.type) && (S.add(e.type), m("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", He(e)));
              }
              f.__reactInternalSnapshotBeforeUpdate = v;
            }
            break;
          }
          case U: {
            {
              var b = e.stateNode;
              Px(b.containerInfo);
            }
            break;
          }
          case B:
          case X:
          case $:
          case dt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        rn();
      }
    }
    function pa(e, t, i) {
      var a = t.updateQueue, l = a !== null ? a.lastEffect : null;
      if (l !== null) {
        var f = l.next, v = f;
        do {
          if ((v.tag & e) === e) {
            var S = v.destroy;
            v.destroy = void 0, S !== void 0 && ((e & Wn) !== Xr ? lc(t) : (e & Cn) !== Xr && uc(t), (e & Za) !== Xr && Xh(!0), Xm(t, i, S), (e & Za) !== Xr && Xh(!1), (e & Wn) !== Xr ? cv() : (e & Cn) !== Xr && gl());
          }
          v = v.next;
        } while (v !== f);
      }
    }
    function Jl(e, t) {
      var i = t.updateQueue, a = i !== null ? i.lastEffect : null;
      if (a !== null) {
        var l = a.next, f = l;
        do {
          if ((f.tag & e) === e) {
            (e & Wn) !== Xr ? sv(t) : (e & Cn) !== Xr && fv(t);
            var v = f.create;
            (e & Za) !== Xr && Xh(!0), f.destroy = v(), (e & Za) !== Xr && Xh(!1), (e & Wn) !== Xr ? Dd() : (e & Cn) !== Xr && dv();
            {
              var S = f.destroy;
              if (S !== void 0 && typeof S != "function") {
                var b = void 0;
                (f.tag & Cn) !== Te ? b = "useLayoutEffect" : (f.tag & Za) !== Te ? b = "useInsertionEffect" : b = "useEffect";
                var x = void 0;
                S === null ? x = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof S.then == "function" ? x = `

It looks like you wrote ` + b + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + b + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : x = " You returned: " + S, m("%s must not return anything besides a function, which is used for clean-up.%s", b, x);
              }
            }
          }
          f = f.next;
        } while (f !== l);
      }
    }
    function lk(e, t) {
      if ((t.flags & Ve) !== Te)
        switch (t.tag) {
          case _e: {
            var i = t.stateNode.passiveEffectDuration, a = t.memoizedProps, l = a.id, f = a.onPostCommit, v = L1(), S = t.alternate === null ? "mount" : "update";
            O1() && (S = "nested-update"), typeof f == "function" && f(l, S, i, v);
            var b = t.return;
            e:
            for (; b !== null;) {
              switch (b.tag) {
                case U:
                  var x = b.stateNode;
                  x.passiveEffectDuration += i;
                  break e;
                case _e:
                  var T = b.stateNode;
                  T.passiveEffectDuration += i;
                  break e;
              }
              b = b.return;
            }
            break;
          }
        }
    }
    function uk(e, t, i, a) {
      if ((i.flags & Nn) !== Te)
        switch (i.tag) {
          case C:
          case pe:
          case Ae: {
            if (!Jn)
              if (i.mode & Oe)
                try {
                  ro(), Jl(Cn | _n, i);
                } finally {
                  no(i);
                }
              else
                Jl(Cn | _n, i);
            break;
          }
          case R: {
            var l = i.stateNode;
            if (i.flags & Ve && !Jn)
              if (t === null)
                if (i.type === i.elementType && !ms && (l.props !== i.memoizedProps && m("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", He(i) || "instance"), l.state !== i.memoizedState && m("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", He(i) || "instance")), i.mode & Oe)
                  try {
                    ro(), l.componentDidMount();
                  } finally {
                    no(i);
                  }
                else
                  l.componentDidMount();
              else {
                var f = i.elementType === i.type ? t.memoizedProps : ca(i.type, t.memoizedProps), v = t.memoizedState;
                if (i.type === i.elementType && !ms && (l.props !== i.memoizedProps && m("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", He(i) || "instance"), l.state !== i.memoizedState && m("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", He(i) || "instance")), i.mode & Oe)
                  try {
                    ro(), l.componentDidUpdate(f, v, l.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    no(i);
                  }
                else
                  l.componentDidUpdate(f, v, l.__reactInternalSnapshotBeforeUpdate);
              }
            var S = i.updateQueue;
            S !== null && (i.type === i.elementType && !ms && (l.props !== i.memoizedProps && m("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", He(i) || "instance"), l.state !== i.memoizedState && m("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", He(i) || "instance")), Ib(i, S, l));
            break;
          }
          case U: {
            var b = i.updateQueue;
            if (b !== null) {
              var x = null;
              if (i.child !== null)
                switch (i.child.tag) {
                  case B:
                    x = i.child.stateNode;
                    break;
                  case R:
                    x = i.child.stateNode;
                    break;
                }
              Ib(i, b, x);
            }
            break;
          }
          case B: {
            var T = i.stateNode;
            if (t === null && i.flags & Ve) {
              var M = i.type, L = i.memoizedProps;
              Rx(T, M, L);
            }
            break;
          }
          case X:
            break;
          case $:
            break;
          case _e: {
            {
              var H = i.memoizedProps, P = H.onCommit, I = H.onRender, de = i.stateNode.effectDuration, Re = L1(), Ee = t === null ? "mount" : "update";
              O1() && (Ee = "nested-update"), typeof I == "function" && I(i.memoizedProps.id, Ee, i.actualDuration, i.treeBaseDuration, i.actualStartTime, Re);
              {
                typeof P == "function" && P(i.memoizedProps.id, Ee, de, Re), aD(i);
                var nt = i.return;
                e:
                for (; nt !== null;) {
                  switch (nt.tag) {
                    case U:
                      var Ke = nt.stateNode;
                      Ke.effectDuration += de;
                      break e;
                    case _e:
                      var z = nt.stateNode;
                      z.effectDuration += de;
                      break e;
                  }
                  nt = nt.return;
                }
              }
            }
            break;
          }
          case $e: {
            mk(e, i);
            break;
          }
          case ht:
          case dt:
          case Gt:
          case qe:
          case ze:
          case Xe:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Jn || i.flags & ar && cE(i);
    }
    function sk(e) {
      switch (e.tag) {
        case C:
        case pe:
        case Ae: {
          if (e.mode & Oe)
            try {
              ro(), lE(e, e.return);
            } finally {
              no(e);
            }
          else
            lE(e, e.return);
          break;
        }
        case R: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && nk(e, e.return, t), uE(e, e.return);
          break;
        }
        case B: {
          uE(e, e.return);
          break;
        }
      }
    }
    function ck(e, t) {
      for (var i = null, a = e; ;) {
        if (a.tag === B) {
          if (i === null) {
            i = a;
            try {
              var l = a.stateNode;
              t ? jx(l) : $x(a.stateNode, a.memoizedProps);
            } catch (v) {
              Dt(e, e.return, v);
            }
          }
        } else if (a.tag === X) {
          if (i === null)
            try {
              var f = a.stateNode;
              t ? Fx(f) : Hx(f, a.memoizedProps);
            } catch (v) {
              Dt(e, e.return, v);
            }
        } else if (!((a.tag === qe || a.tag === ze) && a.memoizedState !== null && a !== e)) {
          if (a.child !== null) {
            a.child.return = a, a = a.child;
            continue;
          }
        }
        if (a === e)
          return;
        for (; a.sibling === null;) {
          if (a.return === null || a.return === e)
            return;
          i === a && (i = null), a = a.return;
        }
        i === a && (i = null), a.sibling.return = a.return, a = a.sibling;
      }
    }
    function cE(e) {
      var t = e.ref;
      if (t !== null) {
        var i = e.stateNode, a;
        switch (e.tag) {
          case B:
            a = i;
            break;
          default:
            a = i;
        }
        if (typeof t == "function") {
          var l;
          if (e.mode & Oe)
            try {
              ro(), l = t(a);
            } finally {
              no(e);
            }
          else
            l = t(a);
          typeof l == "function" && m("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", He(e));
        } else
          t.hasOwnProperty("current") || m("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", He(e)), t.current = a;
      }
    }
    function fk(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function fE(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, fE(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === B) {
          var i = e.stateNode;
          i !== null && gT(i);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function dk(e) {
      for (var t = e.return; t !== null;) {
        if (dE(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function dE(e) {
      return e.tag === B || e.tag === U || e.tag === $;
    }
    function hE(e) {
      var t = e;
      e:
      for (; ;) {
        for (; t.sibling === null;) {
          if (t.return === null || dE(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== B && t.tag !== X && t.tag !== at;) {
          if (t.flags & xt || t.child === null || t.tag === $)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & xt))
          return t.stateNode;
      }
    }
    function hk(e) {
      var t = dk(e);
      switch (t.tag) {
        case B: {
          var i = t.stateNode;
          t.flags & pt && (pb(i), t.flags &= ~pt);
          var a = hE(e);
          bS(e, a, i);
          break;
        }
        case U:
        case $: {
          var l = t.stateNode.containerInfo, f = hE(e);
          wS(e, f, l);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function wS(e, t, i) {
      var a = e.tag, l = a === B || a === X;
      if (l) {
        var f = e.stateNode;
        t ? Mx(i, f, t) : Lx(i, f);
      } else if (a !== $) {
        var v = e.child;
        if (v !== null) {
          wS(v, t, i);
          for (var S = v.sibling; S !== null;)
            wS(S, t, i), S = S.sibling;
        }
      }
    }
    function bS(e, t, i) {
      var a = e.tag, l = a === B || a === X;
      if (l) {
        var f = e.stateNode;
        t ? Ax(i, f, t) : Ox(i, f);
      } else if (a !== $) {
        var v = e.child;
        if (v !== null) {
          bS(v, t, i);
          for (var S = v.sibling; S !== null;)
            bS(S, t, i), S = S.sibling;
        }
      }
    }
    var Xn = null, va = !1;
    function pk(e, t, i) {
      {
        var a = t;
        e:
        for (; a !== null;) {
          switch (a.tag) {
            case B: {
              Xn = a.stateNode, va = !1;
              break e;
            }
            case U: {
              Xn = a.stateNode.containerInfo, va = !0;
              break e;
            }
            case $: {
              Xn = a.stateNode.containerInfo, va = !0;
              break e;
            }
          }
          a = a.return;
        }
        if (Xn === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        pE(e, t, i), Xn = null, va = !1;
      }
      fk(i);
    }
    function Xl(e, t, i) {
      for (var a = i.child; a !== null;)
        pE(e, t, a), a = a.sibling;
    }
    function pE(e, t, i) {
      switch (Rd(i), i.tag) {
        case B:
          Jn || Sf(i, t);
        case X: {
          {
            var a = Xn, l = va;
            Xn = null, Xl(e, t, i), Xn = a, va = l, Xn !== null && (va ? Nx(Xn, i.stateNode) : Ux(Xn, i.stateNode));
          }
          return;
        }
        case at: {
          Xn !== null && (va ? zx(Xn, i.stateNode) : Ag(Xn, i.stateNode));
          return;
        }
        case $: {
          {
            var f = Xn, v = va;
            Xn = i.stateNode.containerInfo, va = !0, Xl(e, t, i), Xn = f, va = v;
          }
          return;
        }
        case C:
        case pe:
        case ft:
        case Ae: {
          if (!Jn) {
            var S = i.updateQueue;
            if (S !== null) {
              var b = S.lastEffect;
              if (b !== null) {
                var x = b.next, T = x;
                do {
                  var M = T, L = M.destroy, H = M.tag;
                  L !== void 0 && ((H & Za) !== Xr ? Xm(i, t, L) : (H & Cn) !== Xr && (uc(i), i.mode & Oe ? (ro(), Xm(i, t, L), no(i)) : Xm(i, t, L), gl())), T = T.next;
                } while (T !== x);
              }
            }
          }
          Xl(e, t, i);
          return;
        }
        case R: {
          if (!Jn) {
            Sf(i, t);
            var P = i.stateNode;
            typeof P.componentWillUnmount == "function" && SS(i, t, P);
          }
          Xl(e, t, i);
          return;
        }
        case Gt: {
          Xl(e, t, i);
          return;
        }
        case qe: {
          if (
            // TODO: Remove this dead flag
            i.mode & Ye
          ) {
            var I = Jn;
            Jn = I || i.memoizedState !== null, Xl(e, t, i), Jn = I;
          } else
            Xl(e, t, i);
          break;
        }
        default: {
          Xl(e, t, i);
          return;
        }
      }
    }
    function vk(e) {
      e.memoizedState;
    }
    function mk(e, t) {
      var i = t.memoizedState;
      if (i === null) {
        var a = t.alternate;
        if (a !== null) {
          var l = a.memoizedState;
          if (l !== null) {
            var f = l.dehydrated;
            f !== null && tT(f);
          }
        }
      }
    }
    function vE(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var i = e.stateNode;
        i === null && (i = e.stateNode = new ZR()), t.forEach(function (a) {
          var l = dD.bind(null, e, a);
          if (!i.has(a)) {
            if (i.add(a), bn)
              if (yf !== null && gf !== null)
                Jh(gf, yf);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            a.then(l, l);
          }
        });
      }
    }
    function yk(e, t, i) {
      yf = i, gf = e, yt(t), mE(t, e), yt(t), yf = null, gf = null;
    }
    function ma(e, t, i) {
      var a = t.deletions;
      if (a !== null)
        for (var l = 0; l < a.length; l++) {
          var f = a[l];
          try {
            pk(e, t, f);
          } catch (b) {
            Dt(f, t, b);
          }
        }
      var v = Ly();
      if (t.subtreeFlags & ur)
        for (var S = t.child; S !== null;)
          yt(S), mE(S, e), S = S.sibling;
      yt(v);
    }
    function mE(e, t, i) {
      var a = e.alternate, l = e.flags;
      switch (e.tag) {
        case C:
        case pe:
        case ft:
        case Ae: {
          if (ma(t, e), io(e), l & Ve) {
            try {
              pa(Za | _n, e, e.return), Jl(Za | _n, e);
            } catch (Me) {
              Dt(e, e.return, Me);
            }
            if (e.mode & Oe) {
              try {
                ro(), pa(Cn | _n, e, e.return);
              } catch (Me) {
                Dt(e, e.return, Me);
              }
              no(e);
            } else
              try {
                pa(Cn | _n, e, e.return);
              } catch (Me) {
                Dt(e, e.return, Me);
              }
          }
          return;
        }
        case R: {
          ma(t, e), io(e), l & ar && a !== null && Sf(a, a.return);
          return;
        }
        case B: {
          ma(t, e), io(e), l & ar && a !== null && Sf(a, a.return);
          {
            if (e.flags & pt) {
              var f = e.stateNode;
              try {
                pb(f);
              } catch (Me) {
                Dt(e, e.return, Me);
              }
            }
            if (l & Ve) {
              var v = e.stateNode;
              if (v != null) {
                var S = e.memoizedProps, b = a !== null ? a.memoizedProps : S, x = e.type, T = e.updateQueue;
                if (e.updateQueue = null, T !== null)
                  try {
                    kx(v, T, x, b, S, e);
                  } catch (Me) {
                    Dt(e, e.return, Me);
                  }
              }
            }
          }
          return;
        }
        case X: {
          if (ma(t, e), io(e), l & Ve) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var M = e.stateNode, L = e.memoizedProps, H = a !== null ? a.memoizedProps : L;
            try {
              Dx(M, H, L);
            } catch (Me) {
              Dt(e, e.return, Me);
            }
          }
          return;
        }
        case U: {
          if (ma(t, e), io(e), l & Ve && a !== null) {
            var P = a.memoizedState;
            if (P.isDehydrated)
              try {
                eT(t.containerInfo);
              } catch (Me) {
                Dt(e, e.return, Me);
              }
          }
          return;
        }
        case $: {
          ma(t, e), io(e);
          return;
        }
        case $e: {
          ma(t, e), io(e);
          var I = e.child;
          if (I.flags & Na) {
            var de = I.stateNode, Re = I.memoizedState, Ee = Re !== null;
            if (de.isHidden = Ee, Ee) {
              var nt = I.alternate !== null && I.alternate.memoizedState !== null;
              nt || Jk();
            }
          }
          if (l & Ve) {
            try {
              vk(e);
            } catch (Me) {
              Dt(e, e.return, Me);
            }
            vE(e);
          }
          return;
        }
        case qe: {
          var Ke = a !== null && a.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & Ye
          ) {
            var z = Jn;
            Jn = z || Ke, ma(t, e), Jn = z;
          } else
            ma(t, e);
          if (io(e), l & Na) {
            var Y = e.stateNode, j = e.memoizedState, J = j !== null, he = e;
            if (Y.isHidden = J, J && !Ke && (he.mode & Ye) !== De) {
              ge = he;
              for (var se = he.child; se !== null;)
                ge = se, Sk(se), se = se.sibling;
            }
            ck(he, J);
          }
          return;
        }
        case ht: {
          ma(t, e), io(e), l & Ve && vE(e);
          return;
        }
        case Gt:
          return;
        default: {
          ma(t, e), io(e);
          return;
        }
      }
    }
    function io(e) {
      var t = e.flags;
      if (t & xt) {
        try {
          hk(e);
        } catch (i) {
          Dt(e, e.return, i);
        }
        e.flags &= ~xt;
      }
      t & Pr && (e.flags &= ~Pr);
    }
    function gk(e, t, i) {
      yf = i, gf = t, ge = e, yE(e, t, i), yf = null, gf = null;
    }
    function yE(e, t, i) {
      for (var a = (e.mode & Ye) !== De; ge !== null;) {
        var l = ge, f = l.child;
        if (l.tag === qe && a) {
          var v = l.memoizedState !== null, S = v || Jm;
          if (S) {
            ES(e, t, i);
            continue;
          } else {
            var b = l.alternate, x = b !== null && b.memoizedState !== null, T = x || Jn, M = Jm, L = Jn;
            Jm = S, Jn = T, Jn && !L && (ge = l, wk(l));
            for (var H = f; H !== null;)
              ge = H, yE(
                H,
                // New root; bubble back up to here and stop.
                t,
                i
              ), H = H.sibling;
            ge = l, Jm = M, Jn = L, ES(e, t, i);
            continue;
          }
        }
        (l.subtreeFlags & Nn) !== Te && f !== null ? (f.return = l, ge = f) : ES(e, t, i);
      }
    }
    function ES(e, t, i) {
      for (; ge !== null;) {
        var a = ge;
        if ((a.flags & Nn) !== Te) {
          var l = a.alternate;
          yt(a);
          try {
            uk(t, l, a, i);
          } catch (v) {
            Dt(a, a.return, v);
          }
          rn();
        }
        if (a === e) {
          ge = null;
          return;
        }
        var f = a.sibling;
        if (f !== null) {
          f.return = a.return, ge = f;
          return;
        }
        ge = a.return;
      }
    }
    function Sk(e) {
      for (; ge !== null;) {
        var t = ge, i = t.child;
        switch (t.tag) {
          case C:
          case pe:
          case ft:
          case Ae: {
            if (t.mode & Oe)
              try {
                ro(), pa(Cn, t, t.return);
              } finally {
                no(t);
              }
            else
              pa(Cn, t, t.return);
            break;
          }
          case R: {
            Sf(t, t.return);
            var a = t.stateNode;
            typeof a.componentWillUnmount == "function" && SS(t, t.return, a);
            break;
          }
          case B: {
            Sf(t, t.return);
            break;
          }
          case qe: {
            var l = t.memoizedState !== null;
            if (l) {
              gE(e);
              continue;
            }
            break;
          }
        }
        i !== null ? (i.return = t, ge = i) : gE(e);
      }
    }
    function gE(e) {
      for (; ge !== null;) {
        var t = ge;
        if (t === e) {
          ge = null;
          return;
        }
        var i = t.sibling;
        if (i !== null) {
          i.return = t.return, ge = i;
          return;
        }
        ge = t.return;
      }
    }
    function wk(e) {
      for (; ge !== null;) {
        var t = ge, i = t.child;
        if (t.tag === qe) {
          var a = t.memoizedState !== null;
          if (a) {
            SE(e);
            continue;
          }
        }
        i !== null ? (i.return = t, ge = i) : SE(e);
      }
    }
    function SE(e) {
      for (; ge !== null;) {
        var t = ge;
        yt(t);
        try {
          sk(t);
        } catch (a) {
          Dt(t, t.return, a);
        }
        if (rn(), t === e) {
          ge = null;
          return;
        }
        var i = t.sibling;
        if (i !== null) {
          i.return = t.return, ge = i;
          return;
        }
        ge = t.return;
      }
    }
    function bk(e, t, i, a) {
      ge = t, Ek(t, e, i, a);
    }
    function Ek(e, t, i, a) {
      for (; ge !== null;) {
        var l = ge, f = l.child;
        (l.subtreeFlags & Vr) !== Te && f !== null ? (f.return = l, ge = f) : _k(e, t, i, a);
      }
    }
    function _k(e, t, i, a) {
      for (; ge !== null;) {
        var l = ge;
        if ((l.flags & Ot) !== Te) {
          yt(l);
          try {
            Ck(t, l, i, a);
          } catch (v) {
            Dt(l, l.return, v);
          }
          rn();
        }
        if (l === e) {
          ge = null;
          return;
        }
        var f = l.sibling;
        if (f !== null) {
          f.return = l.return, ge = f;
          return;
        }
        ge = l.return;
      }
    }
    function Ck(e, t, i, a) {
      switch (t.tag) {
        case C:
        case pe:
        case Ae: {
          if (t.mode & Oe) {
            Z0();
            try {
              Jl(Wn | _n, t);
            } finally {
              X0(t);
            }
          } else
            Jl(Wn | _n, t);
          break;
        }
      }
    }
    function xk(e) {
      ge = e, Tk();
    }
    function Tk() {
      for (; ge !== null;) {
        var e = ge, t = e.child;
        if ((ge.flags & st) !== Te) {
          var i = e.deletions;
          if (i !== null) {
            for (var a = 0; a < i.length; a++) {
              var l = i[a];
              ge = l, Dk(l, e);
            }
            {
              var f = e.alternate;
              if (f !== null) {
                var v = f.child;
                if (v !== null) {
                  f.child = null;
                  do {
                    var S = v.sibling;
                    v.sibling = null, v = S;
                  } while (v !== null);
                }
              }
            }
            ge = e;
          }
        }
        (e.subtreeFlags & Vr) !== Te && t !== null ? (t.return = e, ge = t) : Rk();
      }
    }
    function Rk() {
      for (; ge !== null;) {
        var e = ge;
        (e.flags & Ot) !== Te && (yt(e), kk(e), rn());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, ge = t;
          return;
        }
        ge = e.return;
      }
    }
    function kk(e) {
      switch (e.tag) {
        case C:
        case pe:
        case Ae: {
          e.mode & Oe ? (Z0(), pa(Wn | _n, e, e.return), X0(e)) : pa(Wn | _n, e, e.return);
          break;
        }
      }
    }
    function Dk(e, t) {
      for (; ge !== null;) {
        var i = ge;
        yt(i), Lk(i, t), rn();
        var a = i.child;
        a !== null ? (a.return = i, ge = a) : Ok(e);
      }
    }
    function Ok(e) {
      for (; ge !== null;) {
        var t = ge, i = t.sibling, a = t.return;
        if (fE(t), t === e) {
          ge = null;
          return;
        }
        if (i !== null) {
          i.return = a, ge = i;
          return;
        }
        ge = a;
      }
    }
    function Lk(e, t) {
      switch (e.tag) {
        case C:
        case pe:
        case Ae: {
          e.mode & Oe ? (Z0(), pa(Wn, e, t), X0(e)) : pa(Wn, e, t);
          break;
        }
      }
    }
    function Ak(e) {
      switch (e.tag) {
        case C:
        case pe:
        case Ae: {
          try {
            Jl(Cn | _n, e);
          } catch (i) {
            Dt(e, e.return, i);
          }
          break;
        }
        case R: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (i) {
            Dt(e, e.return, i);
          }
          break;
        }
      }
    }
    function Mk(e) {
      switch (e.tag) {
        case C:
        case pe:
        case Ae: {
          try {
            Jl(Wn | _n, e);
          } catch (t) {
            Dt(e, e.return, t);
          }
          break;
        }
      }
    }
    function Uk(e) {
      switch (e.tag) {
        case C:
        case pe:
        case Ae: {
          try {
            pa(Cn | _n, e, e.return);
          } catch (i) {
            Dt(e, e.return, i);
          }
          break;
        }
        case R: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && SS(e, e.return, t);
          break;
        }
      }
    }
    function Nk(e) {
      switch (e.tag) {
        case C:
        case pe:
        case Ae:
          try {
            pa(Wn | _n, e, e.return);
          } catch (t) {
            Dt(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var Hh = Symbol.for;
      Hh("selector.component"), Hh("selector.has_pseudo_class"), Hh("selector.role"), Hh("selector.test_id"), Hh("selector.text");
    }
    var zk = [];
    function jk() {
      zk.forEach(function (e) {
        return e();
      });
    }
    var Fk = s.ReactCurrentActQueue;
    function $k(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), i = typeof jest < "u";
        return i && t !== !1;
      }
    }
    function wE() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && Fk.current !== null && m("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var Hk = Math.ceil, _S = s.ReactCurrentDispatcher, CS = s.ReactCurrentOwner, Zn = s.ReactCurrentBatchConfig, ya = s.ReactCurrentActQueue, Rn = (
      /*             */
      0
    ), bE = (
      /*               */
      1
    ), er = (
      /*                */
      2
    ), ji = (
      /*                */
      4
    ), Wo = 0, Ph = 1, ys = 2, Zm = 3, Vh = 4, EE = 5, xS = 6, tt = Rn, kr = null, Qt = null, kn = q, ao = q, TS = Vl(q), Dn = Wo, Bh = null, ey = q, Ih = q, ty = q, Yh = null, Zr = null, RS = 0, _E = 500, CE = 1 / 0, Pk = 500, Ko = null;
    function qh() {
      CE = Mt() + Pk;
    }
    function xE() {
      return CE;
    }
    var ny = !1, kS = null, wf = null, gs = !1, Zl = null, Qh = q, DS = [], OS = null, Vk = 50, Gh = 0, LS = null, AS = !1, ry = !1, Bk = 50, bf = 0, iy = null, Wh = _t, ay = q, TE = !1;
    function oy() {
      return kr;
    }
    function Dr() {
      return (tt & (er | ji)) !== Rn ? Mt() : (Wh !== _t || (Wh = Mt()), Wh);
    }
    function eu(e) {
      var t = e.mode;
      if ((t & Ye) === De)
        return Le;
      if ((tt & er) !== Rn && kn !== q)
        return on(kn);
      var i = $T() !== FT;
      if (i) {
        if (Zn.transition !== null) {
          var a = Zn.transition;
          a._updatedFibers || (a._updatedFibers = /* @__PURE__ */ new Set()), a._updatedFibers.add(e);
        }
        return ay === et && (ay = Nd()), ay;
      }
      var l = qr();
      if (l !== et)
        return l;
      var f = _x();
      return f;
    }
    function Ik(e) {
      var t = e.mode;
      return (t & Ye) === De ? Le : Zy();
    }
    function On(e, t, i, a) {
      pD(), TE && m("useInsertionEffect must not schedule updates."), AS && (ry = !0), Ao(e, i, a), (tt & er) !== q && e === kr ? yD(t) : (bn && Hd(e, t, i), gD(t), e === kr && ((tt & er) === Rn && (Ih = Be(Ih, i)), Dn === Vh && tu(e, kn)), ei(e, a), i === Le && tt === Rn && (t.mode & Ye) === De && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !ya.isBatchingLegacy && (qh(), xb()));
    }
    function Yk(e, t, i) {
      var a = e.current;
      a.lanes = t, Ao(e, t, i), ei(e, i);
    }
    function qk(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (tt & er) !== Rn
      );
    }
    function ei(e, t) {
      var i = e.callbackNode;
      Ky(e, t);
      var a = Bu(e, e === kr ? kn : q);
      if (a === q) {
        i !== null && VE(i), e.callbackNode = null, e.callbackPriority = et;
        return;
      }
      var l = Zt(a), f = e.callbackPriority;
      if (f === l && // Special case related to `act`. If the currently scheduled task is a
        // Scheduler task, rather than an `act` task, cancel it and re-scheduled
        // on the `act` queue.
        !(ya.current !== null && i !== $S)) {
        i == null && f !== Le && m("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      i != null && VE(i);
      var v;
      if (l === Le)
        e.tag === Bl ? (ya.isBatchingLegacy !== null && (ya.didScheduleLegacyUpdate = !0), bT(DE.bind(null, e))) : Cb(DE.bind(null, e)), ya.current !== null ? ya.current.push(Il) : xx(function () {
          (tt & (er | ji)) === Rn && Il();
        }), v = null;
      else {
        var S;
        switch (Gu(a)) {
          case zn:
            S = ic;
            break;
          case En:
            S = Cr;
            break;
          case na:
            S = Ri;
            break;
          case qu:
            S = ja;
            break;
          default:
            S = Ri;
            break;
        }
        v = HS(S, RE.bind(null, e));
      }
      e.callbackPriority = l, e.callbackNode = v;
    }
    function RE(e, t) {
      if (pR(), Wh = _t, ay = q, (tt & (er | ji)) !== Rn)
        throw new Error("Should not already be working.");
      var i = e.callbackNode, a = Xo();
      if (a && e.callbackNode !== i)
        return null;
      var l = Bu(e, e === kr ? kn : q);
      if (l === q)
        return null;
      var f = !Yu(e, l) && !gv(e, l) && !t, v = f ? nD(e, l) : uy(e, l);
      if (v !== Wo) {
        if (v === ys) {
          var S = Md(e);
          S !== q && (l = S, v = MS(e, S));
        }
        if (v === Ph) {
          var b = Bh;
          throw Ss(e, q), tu(e, l), ei(e, Mt()), b;
        }
        if (v === xS)
          tu(e, l);
        else {
          var x = !Yu(e, l), T = e.current.alternate;
          if (x && !Gk(T)) {
            if (v = uy(e, l), v === ys) {
              var M = Md(e);
              M !== q && (l = M, v = MS(e, M));
            }
            if (v === Ph) {
              var L = Bh;
              throw Ss(e, q), tu(e, l), ei(e, Mt()), L;
            }
          }
          e.finishedWork = T, e.finishedLanes = l, Qk(e, v, l);
        }
      }
      return ei(e, Mt()), e.callbackNode === i ? RE.bind(null, e) : null;
    }
    function MS(e, t) {
      var i = Yh;
      if (un(e)) {
        var a = Ss(e, t);
        a.flags |= Pt, pT(e.containerInfo);
      }
      var l = uy(e, t);
      if (l !== ys) {
        var f = Zr;
        Zr = i, f !== null && kE(f);
      }
      return l;
    }
    function kE(e) {
      Zr === null ? Zr = e : Zr.push.apply(Zr, e);
    }
    function Qk(e, t, i) {
      switch (t) {
        case Wo:
        case Ph:
          throw new Error("Root did not complete. This is a bug in React.");
        case ys: {
          ws(e, Zr, Ko);
          break;
        }
        case Zm: {
          if (tu(e, i), kc(i) && // do not delay if we're inside an act() scope
            !BE()) {
            var a = RS + _E - Mt();
            if (a > 10) {
              var l = Bu(e, q);
              if (l !== q)
                break;
              var f = e.suspendedLanes;
              if (!Lo(f, i)) {
                Dr(), Fd(e, f);
                break;
              }
              e.timeoutHandle = Og(ws.bind(null, e, Zr, Ko), a);
              break;
            }
          }
          ws(e, Zr, Ko);
          break;
        }
        case Vh: {
          if (tu(e, i), yv(i))
            break;
          if (!BE()) {
            var v = mv(e, i), S = v, b = Mt() - S, x = hD(b) - b;
            if (x > 10) {
              e.timeoutHandle = Og(ws.bind(null, e, Zr, Ko), x);
              break;
            }
          }
          ws(e, Zr, Ko);
          break;
        }
        case EE: {
          ws(e, Zr, Ko);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function Gk(e) {
      for (var t = e; ;) {
        if (t.flags & zu) {
          var i = t.updateQueue;
          if (i !== null) {
            var a = i.stores;
            if (a !== null)
              for (var l = 0; l < a.length; l++) {
                var f = a[l], v = f.getSnapshot, S = f.value;
                try {
                  if (!ye(v(), S))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var b = t.child;
        if (t.subtreeFlags & zu && b !== null) {
          b.return = t, t = b;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null;) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function tu(e, t) {
      t = xl(t, ty), t = xl(t, Ih), jd(e, t);
    }
    function DE(e) {
      if (vR(), (tt & (er | ji)) !== Rn)
        throw new Error("Should not already be working.");
      Xo();
      var t = Bu(e, q);
      if (!dr(t, Le))
        return ei(e, Mt()), null;
      var i = uy(e, t);
      if (e.tag !== Bl && i === ys) {
        var a = Md(e);
        a !== q && (t = a, i = MS(e, a));
      }
      if (i === Ph) {
        var l = Bh;
        throw Ss(e, q), tu(e, t), ei(e, Mt()), l;
      }
      if (i === xS)
        throw new Error("Root did not complete. This is a bug in React.");
      var f = e.current.alternate;
      return e.finishedWork = f, e.finishedLanes = t, ws(e, Zr, Ko), ei(e, Mt()), null;
    }
    function Wk(e, t) {
      t !== q && (Tl(e, Be(t, Le)), ei(e, Mt()), (tt & (er | ji)) === Rn && (qh(), Il()));
    }
    function US(e, t) {
      var i = tt;
      tt |= bE;
      try {
        return e(t);
      } finally {
        tt = i, tt === Rn && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
          !ya.isBatchingLegacy && (qh(), xb());
      }
    }
    function Kk(e, t, i, a, l) {
      var f = qr(), v = Zn.transition;
      try {
        return Zn.transition = null, ln(zn), e(t, i, a, l);
      } finally {
        ln(f), Zn.transition = v, tt === Rn && qh();
      }
    }
    function Jo(e) {
      Zl !== null && Zl.tag === Bl && (tt & (er | ji)) === Rn && Xo();
      var t = tt;
      tt |= bE;
      var i = Zn.transition, a = qr();
      try {
        return Zn.transition = null, ln(zn), e ? e() : void 0;
      } finally {
        ln(a), Zn.transition = i, tt = t, (tt & (er | ji)) === Rn && Il();
      }
    }
    function OE() {
      return (tt & (er | ji)) !== Rn;
    }
    function ly(e, t) {
      pr(TS, ao, e), ao = Be(ao, t);
    }
    function NS(e) {
      ao = TS.current, hr(TS, e);
    }
    function Ss(e, t) {
      e.finishedWork = null, e.finishedLanes = q;
      var i = e.timeoutHandle;
      if (i !== Lg && (e.timeoutHandle = Lg, Cx(i)), Qt !== null)
        for (var a = Qt.return; a !== null;) {
          var l = a.alternate;
          aE(l, a), a = a.return;
        }
      kr = e;
      var f = bs(e.current, null);
      return Qt = f, kn = ao = t, Dn = Wo, Bh = null, ey = q, Ih = q, ty = q, Yh = null, Zr = null, BT(), sa.discardPendingWarnings(), f;
    }
    function LE(e, t) {
      do {
        var i = Qt;
        try {
          if (vm(), l1(), rn(), CS.current = null, i === null || i.return === null) {
            Dn = Ph, Bh = t, Qt = null;
            return;
          }
          if (In && i.mode & Oe && Qm(i, !0), ba)
            if (Eo(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var a = t;
              hv(i, a, kn);
            } else
              sc(i, t, kn);
          wR(e, i.return, i, t, kn), NE(i);
        } catch (l) {
          t = l, Qt === i && i !== null ? (i = i.return, Qt = i) : i = Qt;
          continue;
        }
        return;
      } while (!0);
    }
    function AE() {
      var e = _S.current;
      return _S.current = Vm, e === null ? Vm : e;
    }
    function ME(e) {
      _S.current = e;
    }
    function Jk() {
      RS = Mt();
    }
    function Kh(e) {
      ey = Be(e, ey);
    }
    function Xk() {
      Dn === Wo && (Dn = Zm);
    }
    function zS() {
      (Dn === Wo || Dn === Zm || Dn === ys) && (Dn = Vh), kr !== null && (Iu(ey) || Iu(Ih)) && tu(kr, kn);
    }
    function Zk(e) {
      Dn !== Vh && (Dn = ys), Yh === null ? Yh = [e] : Yh.push(e);
    }
    function eD() {
      return Dn === Wo;
    }
    function uy(e, t) {
      var i = tt;
      tt |= er;
      var a = AE();
      if (kr !== e || kn !== t) {
        if (bn) {
          var l = e.memoizedUpdaters;
          l.size > 0 && (Jh(e, kn), l.clear()), Lc(e, t);
        }
        Ko = Pd(), Ss(e, t);
      }
      pi(t);
      do
        try {
          tD();
          break;
        } catch (f) {
          LE(e, f);
        }
      while (!0);
      if (vm(), tt = i, ME(a), Qt !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return wl(), kr = null, kn = q, Dn;
    }
    function tD() {
      for (; Qt !== null;)
        UE(Qt);
    }
    function nD(e, t) {
      var i = tt;
      tt |= er;
      var a = AE();
      if (kr !== e || kn !== t) {
        if (bn) {
          var l = e.memoizedUpdaters;
          l.size > 0 && (Jh(e, kn), l.clear()), Lc(e, t);
        }
        Ko = Pd(), qh(), Ss(e, t);
      }
      pi(t);
      do
        try {
          rD();
          break;
        } catch (f) {
          LE(e, f);
        }
      while (!0);
      return vm(), ME(a), tt = i, Qt !== null ? ($u(), Wo) : (wl(), kr = null, kn = q, Dn);
    }
    function rD() {
      for (; Qt !== null && !rc();)
        UE(Qt);
    }
    function UE(e) {
      var t = e.alternate;
      yt(e);
      var i;
      (e.mode & Oe) !== De ? (J0(e), i = jS(t, e, ao), Qm(e, !0)) : i = jS(t, e, ao), rn(), e.memoizedProps = e.pendingProps, i === null ? NE(e) : Qt = i, CS.current = null;
    }
    function NE(e) {
      var t = e;
      do {
        var i = t.alternate, a = t.return;
        if ((t.flags & br) === Te) {
          yt(t);
          var l = void 0;
          if ((t.mode & Oe) === De ? l = iE(i, t, ao) : (J0(t), l = iE(i, t, ao), Qm(t, !1)), rn(), l !== null) {
            Qt = l;
            return;
          }
        } else {
          var f = XR(i, t);
          if (f !== null) {
            f.flags &= iv, Qt = f;
            return;
          }
          if ((t.mode & Oe) !== De) {
            Qm(t, !1);
            for (var v = t.actualDuration, S = t.child; S !== null;)
              v += S.actualDuration, S = S.sibling;
            t.actualDuration = v;
          }
          if (a !== null)
            a.flags |= br, a.subtreeFlags = Te, a.deletions = null;
          else {
            Dn = xS, Qt = null;
            return;
          }
        }
        var b = t.sibling;
        if (b !== null) {
          Qt = b;
          return;
        }
        t = a, Qt = t;
      } while (t !== null);
      Dn === Wo && (Dn = EE);
    }
    function ws(e, t, i) {
      var a = qr(), l = Zn.transition;
      try {
        Zn.transition = null, ln(zn), iD(e, t, i, a);
      } finally {
        Zn.transition = l, ln(a);
      }
      return null;
    }
    function iD(e, t, i, a) {
      do
        Xo();
      while (Zl !== null);
      if (vD(), (tt & (er | ji)) !== Rn)
        throw new Error("Should not already be working.");
      var l = e.finishedWork, f = e.finishedLanes;
      if (oc(f), l === null)
        return kd(), null;
      if (f === q && m("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = q, l === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = et;
      var v = Be(l.lanes, l.childLanes);
      $d(e, v), e === kr && (kr = null, Qt = null, kn = q), ((l.subtreeFlags & Vr) !== Te || (l.flags & Vr) !== Te) && (gs || (gs = !0, OS = i, HS(Ri, function () {
        return Xo(), null;
      })));
      var S = (l.subtreeFlags & (yl | ur | Nn | Vr)) !== Te, b = (l.flags & (yl | ur | Nn | Vr)) !== Te;
      if (S || b) {
        var x = Zn.transition;
        Zn.transition = null;
        var T = qr();
        ln(zn);
        var M = tt;
        tt |= ji, CS.current = null, rk(e, l), A1(), yk(e, l, f), yx(e.containerInfo), e.current = l, pv(f), gk(l, e, f), Sl(), lv(), tt = M, ln(T), Zn.transition = x;
      } else
        e.current = l, A1();
      var L = gs;
      if (gs ? (gs = !1, Zl = e, Qh = f) : (bf = 0, iy = null), v = e.pendingLanes, v === q && (wf = null), L || $E(e.current, !1), Zi(l.stateNode, a), bn && e.memoizedUpdaters.clear(), jk(), ei(e, Mt()), t !== null)
        for (var H = e.onRecoverableError, P = 0; P < t.length; P++) {
          var I = t[P], de = I.stack, Re = I.digest;
          H(I.value, {
            componentStack: de,
            digest: Re
          });
        }
      if (ny) {
        ny = !1;
        var Ee = kS;
        throw kS = null, Ee;
      }
      return dr(Qh, Le) && e.tag !== Bl && Xo(), v = e.pendingLanes, dr(v, Le) ? (hR(), e === LS ? Gh++ : (Gh = 0, LS = e)) : Gh = 0, Il(), kd(), null;
    }
    function Xo() {
      if (Zl !== null) {
        var e = Gu(Qh), t = tg(na, e), i = Zn.transition, a = qr();
        try {
          return Zn.transition = null, ln(t), oD();
        } finally {
          ln(a), Zn.transition = i;
        }
      }
      return !1;
    }
    function aD(e) {
      DS.push(e), gs || (gs = !0, HS(Ri, function () {
        return Xo(), null;
      }));
    }
    function oD() {
      if (Zl === null)
        return !1;
      var e = OS;
      OS = null;
      var t = Zl, i = Qh;
      if (Zl = null, Qh = q, (tt & (er | ji)) !== Rn)
        throw new Error("Cannot flush passive effects while already rendering.");
      AS = !0, ry = !1, vv(i);
      var a = tt;
      tt |= ji, xk(t.current), bk(t, t.current, i, e);
      {
        var l = DS;
        DS = [];
        for (var f = 0; f < l.length; f++) {
          var v = l[f];
          lk(t, v);
        }
      }
      Fu(), $E(t.current, !0), tt = a, Il(), ry ? t === iy ? bf++ : (bf = 0, iy = t) : bf = 0, AS = !1, ry = !1, $a(t);
      {
        var S = t.current.stateNode;
        S.effectDuration = 0, S.passiveEffectDuration = 0;
      }
      return !0;
    }
    function zE(e) {
      return wf !== null && wf.has(e);
    }
    function lD(e) {
      wf === null ? wf = /* @__PURE__ */ new Set([e]) : wf.add(e);
    }
    function uD(e) {
      ny || (ny = !0, kS = e);
    }
    var sD = uD;
    function jE(e, t, i) {
      var a = vs(i, t), l = U1(e, a, Le), f = ql(e, l, Le), v = Dr();
      f !== null && (Ao(f, Le, v), ei(f, v));
    }
    function Dt(e, t, i) {
      if (ek(i), Xh(!1), e.tag === U) {
        jE(e, e, i);
        return;
      }
      var a = null;
      for (a = t; a !== null;) {
        if (a.tag === U) {
          jE(a, e, i);
          return;
        } else if (a.tag === R) {
          var l = a.type, f = a.stateNode;
          if (typeof l.getDerivedStateFromError == "function" || typeof f.componentDidCatch == "function" && !zE(f)) {
            var v = vs(i, e), S = rS(a, v, Le), b = ql(a, S, Le), x = Dr();
            b !== null && (Ao(b, Le, x), ei(b, x));
            return;
          }
        }
        a = a.return;
      }
      m(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, i);
    }
    function cD(e, t, i) {
      var a = e.pingCache;
      a !== null && a.delete(t);
      var l = Dr();
      Fd(e, i), SD(e), kr === e && Lo(kn, i) && (Dn === Vh || Dn === Zm && kc(kn) && Mt() - RS < _E ? Ss(e, q) : ty = Be(ty, i)), ei(e, l);
    }
    function FE(e, t) {
      t === et && (t = Ik(e));
      var i = Dr(), a = Jr(e, t);
      a !== null && (Ao(a, t, i), ei(a, i));
    }
    function fD(e) {
      var t = e.memoizedState, i = et;
      t !== null && (i = t.retryLane), FE(e, i);
    }
    function dD(e, t) {
      var i = et, a;
      switch (e.tag) {
        case $e:
          a = e.stateNode;
          var l = e.memoizedState;
          l !== null && (i = l.retryLane);
          break;
        case ht:
          a = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      a !== null && a.delete(t), FE(e, i);
    }
    function hD(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : Hk(e / 1960) * 1960;
    }
    function pD() {
      if (Gh > Vk)
        throw Gh = 0, LS = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      bf > Bk && (bf = 0, iy = null, m("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function vD() {
      sa.flushLegacyContextWarning(), sa.flushPendingUnsafeLifecycleWarnings();
    }
    function $E(e, t) {
      yt(e), sy(e, lr, Uk), t && sy(e, bo, Nk), sy(e, lr, Ak), t && sy(e, bo, Mk), rn();
    }
    function sy(e, t, i) {
      for (var a = e, l = null; a !== null;) {
        var f = a.subtreeFlags & t;
        a !== l && a.child !== null && f !== Te ? a = a.child : ((a.flags & t) !== Te && i(a), a.sibling !== null ? a = a.sibling : a = l = a.return);
      }
    }
    var cy = null;
    function HE(e) {
      {
        if ((tt & er) !== Rn || !(e.mode & Ye))
          return;
        var t = e.tag;
        if (t !== O && t !== U && t !== R && t !== C && t !== pe && t !== ft && t !== Ae)
          return;
        var i = He(e) || "ReactComponent";
        if (cy !== null) {
          if (cy.has(i))
            return;
          cy.add(i);
        } else
          cy = /* @__PURE__ */ new Set([i]);
        var a = Jt;
        try {
          yt(e), m("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          a ? yt(e) : rn();
        }
      }
    }
    var jS;
    {
      var mD = null;
      jS = function (e, t, i) {
        var a = GE(mD, t);
        try {
          return Z1(e, t, i);
        } catch (f) {
          if (DT() || f !== null && typeof f == "object" && typeof f.then == "function")
            throw f;
          if (vm(), l1(), aE(e, t), GE(t, a), t.mode & Oe && J0(t), wo(null, Z1, null, e, t, i), Gy()) {
            var l = yd();
            typeof l == "object" && l !== null && l._suppressLogging && typeof f == "object" && f !== null && !f._suppressLogging && (f._suppressLogging = !0);
          }
          throw f;
        }
      };
    }
    var PE = !1, FS;
    FS = /* @__PURE__ */ new Set();
    function yD(e) {
      if (zr && !cR())
        switch (e.tag) {
          case C:
          case pe:
          case Ae: {
            var t = Qt && He(Qt) || "Unknown", i = t;
            if (!FS.has(i)) {
              FS.add(i);
              var a = He(e) || "Unknown";
              m("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", a, t, t);
            }
            break;
          }
          case R: {
            PE || (m("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), PE = !0);
            break;
          }
        }
    }
    function Jh(e, t) {
      if (bn) {
        var i = e.memoizedUpdaters;
        i.forEach(function (a) {
          Hd(e, a, t);
        });
      }
    }
    var $S = {};
    function HS(e, t) {
      {
        var i = ya.current;
        return i !== null ? (i.push(t), $S) : nc(e, t);
      }
    }
    function VE(e) {
      if (e !== $S)
        return ov(e);
    }
    function BE() {
      return ya.current !== null;
    }
    function gD(e) {
      {
        if (e.mode & Ye) {
          if (!wE())
            return;
        } else if (!$k() || tt !== Rn || e.tag !== C && e.tag !== pe && e.tag !== Ae)
          return;
        if (ya.current === null) {
          var t = Jt;
          try {
            yt(e), m(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, He(e));
          } finally {
            t ? yt(e) : rn();
          }
        }
      }
    }
    function SD(e) {
      e.tag !== Bl && wE() && ya.current === null && m(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function Xh(e) {
      TE = e;
    }
    var Fi = null, Ef = null, wD = function (e) {
      Fi = e;
    };
    function _f(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        return t === void 0 ? e : t.current;
      }
    }
    function PS(e) {
      return _f(e);
    }
    function VS(e) {
      {
        if (Fi === null)
          return e;
        var t = Fi(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var i = _f(e.render);
            if (e.render !== i) {
              var a = {
                $$typeof: rl,
                render: i
              };
              return e.displayName !== void 0 && (a.displayName = e.displayName), a;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function IE(e, t) {
      {
        if (Fi === null)
          return !1;
        var i = e.elementType, a = t.type, l = !1, f = typeof a == "object" && a !== null ? a.$$typeof : null;
        switch (e.tag) {
          case R: {
            typeof a == "function" && (l = !0);
            break;
          }
          case C: {
            (typeof a == "function" || f === Yn) && (l = !0);
            break;
          }
          case pe: {
            (f === rl || f === Yn) && (l = !0);
            break;
          }
          case ft:
          case Ae: {
            (f === il || f === Yn) && (l = !0);
            break;
          }
          default:
            return !1;
        }
        if (l) {
          var v = Fi(i);
          if (v !== void 0 && v === Fi(a))
            return !0;
        }
        return !1;
      }
    }
    function YE(e) {
      {
        if (Fi === null || typeof WeakSet != "function")
          return;
        Ef === null && (Ef = /* @__PURE__ */ new WeakSet()), Ef.add(e);
      }
    }
    var bD = function (e, t) {
      {
        if (Fi === null)
          return;
        var i = t.staleFamilies, a = t.updatedFamilies;
        Xo(), Jo(function () {
          BS(e.current, a, i);
        });
      }
    }, ED = function (e, t) {
      {
        if (e.context !== mi)
          return;
        Xo(), Jo(function () {
          Zh(t, e, null, null);
        });
      }
    };
    function BS(e, t, i) {
      {
        var a = e.alternate, l = e.child, f = e.sibling, v = e.tag, S = e.type, b = null;
        switch (v) {
          case C:
          case Ae:
          case R:
            b = S;
            break;
          case pe:
            b = S.render;
            break;
        }
        if (Fi === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var x = !1, T = !1;
        if (b !== null) {
          var M = Fi(b);
          M !== void 0 && (i.has(M) ? T = !0 : t.has(M) && (v === R ? T = !0 : x = !0));
        }
        if (Ef !== null && (Ef.has(e) || a !== null && Ef.has(a)) && (T = !0), T && (e._debugNeedsRemount = !0), T || x) {
          var L = Jr(e, Le);
          L !== null && On(L, e, Le, _t);
        }
        l !== null && !T && BS(l, t, i), f !== null && BS(f, t, i);
      }
    }
    var _D = function (e, t) {
      {
        var i = /* @__PURE__ */ new Set(), a = new Set(t.map(function (l) {
          return l.current;
        }));
        return IS(e.current, a, i), i;
      }
    };
    function IS(e, t, i) {
      {
        var a = e.child, l = e.sibling, f = e.tag, v = e.type, S = null;
        switch (f) {
          case C:
          case Ae:
          case R:
            S = v;
            break;
          case pe:
            S = v.render;
            break;
        }
        var b = !1;
        S !== null && t.has(S) && (b = !0), b ? CD(e, i) : a !== null && IS(a, t, i), l !== null && IS(l, t, i);
      }
    }
    function CD(e, t) {
      {
        var i = xD(e, t);
        if (i)
          return;
        for (var a = e; ;) {
          switch (a.tag) {
            case B:
              t.add(a.stateNode);
              return;
            case $:
              t.add(a.stateNode.containerInfo);
              return;
            case U:
              t.add(a.stateNode.containerInfo);
              return;
          }
          if (a.return === null)
            throw new Error("Expected to reach root first.");
          a = a.return;
        }
      }
    }
    function xD(e, t) {
      for (var i = e, a = !1; ;) {
        if (i.tag === B)
          a = !0, t.add(i.stateNode);
        else if (i.child !== null) {
          i.child.return = i, i = i.child;
          continue;
        }
        if (i === e)
          return a;
        for (; i.sibling === null;) {
          if (i.return === null || i.return === e)
            return a;
          i = i.return;
        }
        i.sibling.return = i.return, i = i.sibling;
      }
      return !1;
    }
    var YS;
    {
      YS = !1;
      try {
        var qE = Object.preventExtensions({});
      } catch {
        YS = !0;
      }
    }
    function TD(e, t, i, a) {
      this.tag = e, this.key = i, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = a, this.flags = Te, this.subtreeFlags = Te, this.deletions = null, this.lanes = q, this.childLanes = q, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !YS && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var yi = function (e, t, i, a) {
      return new TD(e, t, i, a);
    };
    function qS(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function RD(e) {
      return typeof e == "function" && !qS(e) && e.defaultProps === void 0;
    }
    function kD(e) {
      if (typeof e == "function")
        return qS(e) ? R : C;
      if (e != null) {
        var t = e.$$typeof;
        if (t === rl)
          return pe;
        if (t === il)
          return ft;
      }
      return O;
    }
    function bs(e, t) {
      var i = e.alternate;
      i === null ? (i = yi(e.tag, t, e.key, e.mode), i.elementType = e.elementType, i.type = e.type, i.stateNode = e.stateNode, i._debugSource = e._debugSource, i._debugOwner = e._debugOwner, i._debugHookTypes = e._debugHookTypes, i.alternate = e, e.alternate = i) : (i.pendingProps = t, i.type = e.type, i.flags = Te, i.subtreeFlags = Te, i.deletions = null, i.actualDuration = 0, i.actualStartTime = -1), i.flags = e.flags & wn, i.childLanes = e.childLanes, i.lanes = e.lanes, i.child = e.child, i.memoizedProps = e.memoizedProps, i.memoizedState = e.memoizedState, i.updateQueue = e.updateQueue;
      var a = e.dependencies;
      switch (i.dependencies = a === null ? null : {
        lanes: a.lanes,
        firstContext: a.firstContext
      }, i.sibling = e.sibling, i.index = e.index, i.ref = e.ref, i.selfBaseDuration = e.selfBaseDuration, i.treeBaseDuration = e.treeBaseDuration, i._debugNeedsRemount = e._debugNeedsRemount, i.tag) {
        case O:
        case C:
        case Ae:
          i.type = _f(e.type);
          break;
        case R:
          i.type = PS(e.type);
          break;
        case pe:
          i.type = VS(e.type);
          break;
      }
      return i;
    }
    function DD(e, t) {
      e.flags &= wn | xt;
      var i = e.alternate;
      if (i === null)
        e.childLanes = q, e.lanes = t, e.child = null, e.subtreeFlags = Te, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = i.childLanes, e.lanes = i.lanes, e.child = i.child, e.subtreeFlags = Te, e.deletions = null, e.memoizedProps = i.memoizedProps, e.memoizedState = i.memoizedState, e.updateQueue = i.updateQueue, e.type = i.type;
        var a = i.dependencies;
        e.dependencies = a === null ? null : {
          lanes: a.lanes,
          firstContext: a.firstContext
        }, e.selfBaseDuration = i.selfBaseDuration, e.treeBaseDuration = i.treeBaseDuration;
      }
      return e;
    }
    function OD(e, t, i) {
      var a;
      return e === lm ? (a = Ye, t === !0 && (a |= Ut, a |= Ir)) : a = De, bn && (a |= Oe), yi(U, null, null, a);
    }
    function QS(e, t, i, a, l, f) {
      var v = O, S = e;
      if (typeof e == "function")
        qS(e) ? (v = R, S = PS(S)) : S = _f(S);
      else if (typeof e == "string")
        v = B;
      else
        e:
        switch (e) {
          case Bi:
            return nu(i.children, l, f, t);
          case nl:
            v = re, l |= Ut, (l & Ye) !== De && (l |= Ir);
            break;
          case du:
            return LD(i, l, f, t);
          case Ci:
            return AD(i, l, f, t);
          case hu:
            return MD(i, l, f, t);
          case $f:
            return QE(i, l, f, t);
          case vp:
          case hp:
          case Ty:
          case Ry:
          case pp:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case jf:
                  v = Ce;
                  break e;
                case Ff:
                  v = Je;
                  break e;
                case rl:
                  v = pe, S = VS(S);
                  break e;
                case il:
                  v = ft;
                  break e;
                case Yn:
                  v = Pe, S = null;
                  break e;
              }
            var b = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (b += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var x = a ? He(a) : null;
              x && (b += `

Check the render method of \`` + x + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + b));
          }
        }
      var T = yi(v, i, t, l);
      return T.elementType = e, T.type = S, T.lanes = f, T._debugOwner = a, T;
    }
    function GS(e, t, i) {
      var a = null;
      a = e._owner;
      var l = e.type, f = e.key, v = e.props, S = QS(l, f, v, a, t, i);
      return S._debugSource = e._source, S._debugOwner = e._owner, S;
    }
    function nu(e, t, i, a) {
      var l = yi(ee, e, a, t);
      return l.lanes = i, l;
    }
    function LD(e, t, i, a) {
      typeof e.id != "string" && m('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var l = yi(_e, e, a, t | Oe);
      return l.elementType = du, l.lanes = i, l.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, l;
    }
    function AD(e, t, i, a) {
      var l = yi($e, e, a, t);
      return l.elementType = Ci, l.lanes = i, l;
    }
    function MD(e, t, i, a) {
      var l = yi(ht, e, a, t);
      return l.elementType = hu, l.lanes = i, l;
    }
    function QE(e, t, i, a) {
      var l = yi(qe, e, a, t);
      l.elementType = $f, l.lanes = i;
      var f = {
        isHidden: !1
      };
      return l.stateNode = f, l;
    }
    function WS(e, t, i) {
      var a = yi(X, e, null, t);
      return a.lanes = i, a;
    }
    function UD() {
      var e = yi(B, null, null, De);
      return e.elementType = "DELETED", e;
    }
    function ND(e) {
      var t = yi(at, null, null, De);
      return t.stateNode = e, t;
    }
    function KS(e, t, i) {
      var a = e.children !== null ? e.children : [], l = yi($, a, e.key, t);
      return l.lanes = i, l.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, l;
    }
    function GE(e, t) {
      return e === null && (e = yi(O, null, null, De)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function zD(e, t, i, a, l) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = Lg, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = et, this.eventTimes = Oc(q), this.expirationTimes = Oc(_t), this.pendingLanes = q, this.suspendedLanes = q, this.pingedLanes = q, this.expiredLanes = q, this.mutableReadLanes = q, this.finishedLanes = q, this.entangledLanes = q, this.entanglements = Oc(q), this.identifierPrefix = a, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var f = this.pendingUpdatersLaneMap = [], v = 0; v < Rt; v++)
          f.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case lm:
          this._debugRootType = i ? "hydrateRoot()" : "createRoot()";
          break;
        case Bl:
          this._debugRootType = i ? "hydrate()" : "render()";
          break;
      }
    }
    function WE(e, t, i, a, l, f, v, S, b, x) {
      var T = new zD(e, t, i, S, b), M = OD(t, f);
      T.current = M, M.stateNode = T;
      {
        var L = {
          element: a,
          isDehydrated: i,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        M.memoizedState = L;
      }
      return i0(M), T;
    }
    var JS = "18.2.0";
    function jD(e, t, i) {
      var a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return el(a), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: li,
        key: a == null ? null : "" + a,
        children: e,
        containerInfo: t,
        implementation: i
      };
    }
    var XS, ZS;
    XS = !1, ZS = {};
    function KE(e) {
      if (!e)
        return mi;
      var t = $r(e), i = wT(t);
      if (t.tag === R) {
        var a = t.type;
        if (Xa(a))
          return Eb(t, a, i);
      }
      return i;
    }
    function FD(e, t) {
      {
        var i = $r(e);
        if (i === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var a = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + a);
        }
        var l = Br(i);
        if (l === null)
          return null;
        if (l.mode & Ut) {
          var f = He(i) || "Component";
          if (!ZS[f]) {
            ZS[f] = !0;
            var v = Jt;
            try {
              yt(l), i.mode & Ut ? m("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, f) : m("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, f);
            } finally {
              v ? yt(v) : rn();
            }
          }
        }
        return l.stateNode;
      }
    }
    function JE(e, t, i, a, l, f, v, S) {
      var b = !1, x = null;
      return WE(e, t, b, x, i, a, l, f, v);
    }
    function XE(e, t, i, a, l, f, v, S, b, x) {
      var T = !0, M = WE(i, a, T, e, l, f, v, S, b);
      M.context = KE(null);
      var L = M.current, H = Dr(), P = eu(L), I = Qo(H, P);
      return I.callback = t ?? null, ql(L, I, P), Yk(M, P, H), M;
    }
    function Zh(e, t, i, a) {
      uv(t, e);
      var l = t.current, f = Dr(), v = eu(l);
      _o(v);
      var S = KE(i);
      t.context === null ? t.context = S : t.pendingContext = S, zr && Jt !== null && !XS && (XS = !0, m(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, He(Jt) || "Unknown"));
      var b = Qo(f, v);
      b.payload = {
        element: e
      }, a = a === void 0 ? null : a, a !== null && (typeof a != "function" && m("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", a), b.callback = a);
      var x = ql(l, b, v);
      return x !== null && (On(x, l, v, f), wm(x, l, v)), v;
    }
    function fy(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case B:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function $D(e) {
      switch (e.tag) {
        case U: {
          var t = e.stateNode;
          if (un(t)) {
            var i = Jy(t);
            Wk(t, i);
          }
          break;
        }
        case $e: {
          Jo(function () {
            var l = Jr(e, Le);
            if (l !== null) {
              var f = Dr();
              On(l, e, Le, f);
            }
          });
          var a = Le;
          ew(e, a);
          break;
        }
      }
    }
    function ZE(e, t) {
      var i = e.memoizedState;
      i !== null && i.dehydrated !== null && (i.retryLane = wv(i.retryLane, t));
    }
    function ew(e, t) {
      ZE(e, t);
      var i = e.alternate;
      i && ZE(i, t);
    }
    function HD(e) {
      if (e.tag === $e) {
        var t = bl, i = Jr(e, t);
        if (i !== null) {
          var a = Dr();
          On(i, e, t, a);
        }
        ew(e, t);
      }
    }
    function PD(e) {
      if (e.tag === $e) {
        var t = eu(e), i = Jr(e, t);
        if (i !== null) {
          var a = Dr();
          On(i, e, t, a);
        }
        ew(e, t);
      }
    }
    function e_(e) {
      var t = av(e);
      return t === null ? null : t.stateNode;
    }
    var t_ = function (e) {
      return null;
    };
    function VD(e) {
      return t_(e);
    }
    var n_ = function (e) {
      return !1;
    };
    function BD(e) {
      return n_(e);
    }
    var r_ = null, i_ = null, a_ = null, o_ = null, l_ = null, u_ = null, s_ = null, c_ = null, f_ = null;
    {
      var d_ = function (e, t, i) {
        var a = t[i], l = dn(e) ? e.slice() : Ge({}, e);
        return i + 1 === t.length ? (dn(l) ? l.splice(a, 1) : delete l[a], l) : (l[a] = d_(e[a], t, i + 1), l);
      }, h_ = function (e, t) {
        return d_(e, t, 0);
      }, p_ = function (e, t, i, a) {
        var l = t[a], f = dn(e) ? e.slice() : Ge({}, e);
        if (a + 1 === t.length) {
          var v = i[a];
          f[v] = f[l], dn(f) ? f.splice(l, 1) : delete f[l];
        } else
          f[l] = p_(
            // $FlowFixMe number or string is fine here
            e[l],
            t,
            i,
            a + 1
          );
        return f;
      }, v_ = function (e, t, i) {
        if (t.length !== i.length) {
          w("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var a = 0; a < i.length - 1; a++)
            if (t[a] !== i[a]) {
              w("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return p_(e, t, i, 0);
      }, m_ = function (e, t, i, a) {
        if (i >= t.length)
          return a;
        var l = t[i], f = dn(e) ? e.slice() : Ge({}, e);
        return f[l] = m_(e[l], t, i + 1, a), f;
      }, y_ = function (e, t, i) {
        return m_(e, t, 0, i);
      }, tw = function (e, t) {
        for (var i = e.memoizedState; i !== null && t > 0;)
          i = i.next, t--;
        return i;
      };
      r_ = function (e, t, i, a) {
        var l = tw(e, t);
        if (l !== null) {
          var f = y_(l.memoizedState, i, a);
          l.memoizedState = f, l.baseState = f, e.memoizedProps = Ge({}, e.memoizedProps);
          var v = Jr(e, Le);
          v !== null && On(v, e, Le, _t);
        }
      }, i_ = function (e, t, i) {
        var a = tw(e, t);
        if (a !== null) {
          var l = h_(a.memoizedState, i);
          a.memoizedState = l, a.baseState = l, e.memoizedProps = Ge({}, e.memoizedProps);
          var f = Jr(e, Le);
          f !== null && On(f, e, Le, _t);
        }
      }, a_ = function (e, t, i, a) {
        var l = tw(e, t);
        if (l !== null) {
          var f = v_(l.memoizedState, i, a);
          l.memoizedState = f, l.baseState = f, e.memoizedProps = Ge({}, e.memoizedProps);
          var v = Jr(e, Le);
          v !== null && On(v, e, Le, _t);
        }
      }, o_ = function (e, t, i) {
        e.pendingProps = y_(e.memoizedProps, t, i), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Jr(e, Le);
        a !== null && On(a, e, Le, _t);
      }, l_ = function (e, t) {
        e.pendingProps = h_(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var i = Jr(e, Le);
        i !== null && On(i, e, Le, _t);
      }, u_ = function (e, t, i) {
        e.pendingProps = v_(e.memoizedProps, t, i), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Jr(e, Le);
        a !== null && On(a, e, Le, _t);
      }, s_ = function (e) {
        var t = Jr(e, Le);
        t !== null && On(t, e, Le, _t);
      }, c_ = function (e) {
        t_ = e;
      }, f_ = function (e) {
        n_ = e;
      };
    }
    function ID(e) {
      var t = Br(e);
      return t === null ? null : t.stateNode;
    }
    function YD(e) {
      return null;
    }
    function qD() {
      return Jt;
    }
    function QD(e) {
      var t = e.findFiberByHostInstance, i = s.ReactCurrentDispatcher;
      return Td({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: r_,
        overrideHookStateDeletePath: i_,
        overrideHookStateRenamePath: a_,
        overrideProps: o_,
        overridePropsDeletePath: l_,
        overridePropsRenamePath: u_,
        setErrorHandler: c_,
        setSuspenseHandler: f_,
        scheduleUpdate: s_,
        currentDispatcherRef: i,
        findHostInstanceByFiber: ID,
        findFiberByHostInstance: t || YD,
        // React Refresh
        findHostInstancesForRefresh: _D,
        scheduleRefresh: bD,
        scheduleRoot: ED,
        setRefreshHandler: wD,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: qD,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: JS
      });
    }
    var g_ = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function (e) {
      console.error(e);
    };
    function nw(e) {
      this._internalRoot = e;
    }
    dy.prototype.render = nw.prototype.render = function (e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? m("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : hy(arguments[1]) ? m("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && m("You passed a second argument to root.render(...) but it only accepts one argument.");
        var i = t.containerInfo;
        if (i.nodeType !== Xt) {
          var a = e_(t.current);
          a && a.parentNode !== i && m("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Zh(e, t, null, null);
    }, dy.prototype.unmount = nw.prototype.unmount = function () {
      typeof arguments[0] == "function" && m("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        OE() && m("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Jo(function () {
          Zh(null, e, null, null);
        }), yb(t);
      }
    };
    function GD(e, t) {
      if (!hy(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      S_(e);
      var i = !1, a = !1, l = "", f = g_;
      t != null && (t.hydrate ? w("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === tl && m(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (i = !0), t.identifierPrefix !== void 0 && (l = t.identifierPrefix), t.onRecoverableError !== void 0 && (f = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var v = JE(e, lm, null, i, a, l, f);
      em(v.current, e);
      var S = e.nodeType === Xt ? e.parentNode : e;
      return lh(S), new nw(v);
    }
    function dy(e) {
      this._internalRoot = e;
    }
    function WD(e) {
      e && kv(e);
    }
    dy.prototype.unstable_scheduleHydration = WD;
    function KD(e, t, i) {
      if (!hy(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      S_(e), t === void 0 && m("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var a = i ?? null, l = i != null && i.hydratedSources || null, f = !1, v = !1, S = "", b = g_;
      i != null && (i.unstable_strictMode === !0 && (f = !0), i.identifierPrefix !== void 0 && (S = i.identifierPrefix), i.onRecoverableError !== void 0 && (b = i.onRecoverableError));
      var x = XE(t, null, e, lm, a, f, v, S, b);
      if (em(x.current, e), lh(e), l)
        for (var T = 0; T < l.length; T++) {
          var M = l[T];
          iR(x, M);
        }
      return new dy(x);
    }
    function hy(e) {
      return !!(e && (e.nodeType === ir || e.nodeType === fi || e.nodeType === po || !Ze));
    }
    function ep(e) {
      return !!(e && (e.nodeType === ir || e.nodeType === fi || e.nodeType === po || e.nodeType === Xt && e.nodeValue === " react-mount-point-unstable "));
    }
    function S_(e) {
      e.nodeType === ir && e.tagName && e.tagName.toUpperCase() === "BODY" && m("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), gh(e) && (e._reactRootContainer ? m("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : m("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var JD = s.ReactCurrentOwner, w_;
    w_ = function (e) {
      if (e._reactRootContainer && e.nodeType !== Xt) {
        var t = e_(e._reactRootContainer.current);
        t && t.parentNode !== e && m("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var i = !!e._reactRootContainer, a = rw(e), l = !!(a && Pl(a));
      l && !i && m("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === ir && e.tagName && e.tagName.toUpperCase() === "BODY" && m("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function rw(e) {
      return e ? e.nodeType === fi ? e.documentElement : e.firstChild : null;
    }
    function b_() {
    }
    function XD(e, t, i, a, l) {
      if (l) {
        if (typeof a == "function") {
          var f = a;
          a = function () {
            var L = fy(v);
            f.call(L);
          };
        }
        var v = XE(
          t,
          a,
          e,
          Bl,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          b_
        );
        e._reactRootContainer = v, em(v.current, e);
        var S = e.nodeType === Xt ? e.parentNode : e;
        return lh(S), Jo(), v;
      } else {
        for (var b; b = e.lastChild;)
          e.removeChild(b);
        if (typeof a == "function") {
          var x = a;
          a = function () {
            var L = fy(T);
            x.call(L);
          };
        }
        var T = JE(
          e,
          Bl,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          b_
        );
        e._reactRootContainer = T, em(T.current, e);
        var M = e.nodeType === Xt ? e.parentNode : e;
        return lh(M), Jo(function () {
          Zh(t, T, i, a);
        }), T;
      }
    }
    function ZD(e, t) {
      e !== null && typeof e != "function" && m("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function py(e, t, i, a, l) {
      w_(i), ZD(l === void 0 ? null : l, "render");
      var f = i._reactRootContainer, v;
      if (!f)
        v = XD(i, t, e, l, a);
      else {
        if (v = f, typeof l == "function") {
          var S = l;
          l = function () {
            var b = fy(v);
            S.call(b);
          };
        }
        Zh(t, v, e, l);
      }
      return fy(v);
    }
    function eO(e) {
      {
        var t = JD.current;
        if (t !== null && t.stateNode !== null) {
          var i = t.stateNode._warnedAboutRefsInRender;
          i || m("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", bt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === ir ? e : FD(e, "findDOMNode");
    }
    function tO(e, t, i) {
      if (m("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !ep(t))
        throw new Error("Target container is not a DOM element.");
      {
        var a = gh(t) && t._reactRootContainer === void 0;
        a && m("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return py(null, e, t, !0, i);
    }
    function nO(e, t, i) {
      if (m("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !ep(t))
        throw new Error("Target container is not a DOM element.");
      {
        var a = gh(t) && t._reactRootContainer === void 0;
        a && m("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return py(null, e, t, !1, i);
    }
    function rO(e, t, i, a) {
      if (m("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !ep(i))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !Nu(e))
        throw new Error("parentComponent must be a valid React Component");
      return py(e, t, i, !1, a);
    }
    function iO(e) {
      if (!ep(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = gh(e) && e._reactRootContainer === void 0;
        t && m("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var i = rw(e), a = i && !Pl(i);
          a && m("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Jo(function () {
          py(null, null, e, !1, function () {
            e._reactRootContainer = null, yb(e);
          });
        }), !0;
      } else {
        {
          var l = rw(e), f = !!(l && Pl(l)), v = e.nodeType === ir && ep(e.parentNode) && !!e.parentNode._reactRootContainer;
          f && m("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", v ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    ve($D), Ev(HD), Ku(PD), Bd(qr), Cv(Qu), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
      Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
      Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && m("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), nv(lx), Js(US, Kk, Jo);
    function aO(e, t) {
      var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!hy(t))
        throw new Error("Target container is not a DOM element.");
      return jD(e, t, null, i);
    }
    function oO(e, t, i, a) {
      return rO(e, t, i, a);
    }
    var iw = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Pl, Zc, tm, Ks, Au, US]
    };
    function lO(e, t) {
      return iw.usingClientEntryPoint || m('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), GD(e, t);
    }
    function uO(e, t, i) {
      return iw.usingClientEntryPoint || m('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), KD(e, t, i);
    }
    function sO(e) {
      return OE() && m("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Jo(e);
    }
    var cO = QD({
      findFiberByHostInstance: os,
      bundleType: 1,
      version: JS,
      rendererPackageName: "react-dom"
    });
    if (!cO && An && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var E_ = window.location.protocol;
      /^(https?|file):$/.test(E_) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (E_ === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    ni.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = iw, ni.createPortal = aO, ni.createRoot = lO, ni.findDOMNode = eO, ni.flushSync = sO, ni.hydrate = tO, ni.hydrateRoot = uO, ni.render = nO, ni.unmountComponentAtNode = iO, ni.unstable_batchedUpdates = US, ni.unstable_renderSubtreeIntoContainer = oO, ni.version = JS, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), ni;
}
function pC() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(pC);
    } catch (d) {
      console.error(d);
    }
  }
}
process.env.NODE_ENV === "production" ? (pC(), _w.exports = nA()) : _w.exports = rA();
var iA = _w.exports;
const B_ = /* @__PURE__ */ ZL(iA);
let hw;
function jw(d) {
  return [
    ...d.v,
    (d.i ? "!" : "") + d.n
  ].join(":");
}
function aA(d, u = ",") {
  return d.map(jw).join(u);
}
let vC = typeof CSS < "u" && CSS.escape || // Simplified: escaping only special characters
  // Needed for NodeJS and Edge <79 (https://caniuse.com/mdn-api_css_escape)
  ((d) => d.replace(/[!"'`*+.,;:\\/<=>?@#$%&^|~()[\]{}]/g, "\\$&").replace(/^\d/, "\\3$& "));
function by(d) {
  for (var u = 9, s = d.length; s--;)
    u = Math.imul(u ^ d.charCodeAt(s), 1597334677);
  return "#" + ((u ^ u >>> 9) >>> 0).toString(36);
}
function Fw(d, u = "@media ") {
  return u + jt(d).map((s) => (typeof s == "string" && (s = {
    min: s
  }), s.raw || Object.keys(s).map((h) => `(${h}-width:${s[h]})`).join(" and "))).join(",");
}
function jt(d = []) {
  return Array.isArray(d) ? d : d == null ? [] : [
    d
  ];
}
function I_(d) {
  return d;
}
function $w() {
}
let Ln = {
  /**
  * 1. `default` (public)
  */
  d: (
    /* efaults */
    0
  ),
  /* Shifts.layer */
  /**
  * 2. `base` (public) — for things like reset rules or default styles applied to plain HTML elements.
  */
  b: (
    /* ase */
    134217728
  ),
  /* Shifts.layer */
  /**
  * 3. `components` (public, used by `style()`) — is for class-based styles that you want to be able to override with utilities.
  */
  c: (
    /* omponents */
    268435456
  ),
  /* Shifts.layer */
  // reserved for style():
  // - props: 0b011
  // - when: 0b100
  /**
  * 6. `aliases` (public, used by `apply()`) — `~(...)`
  */
  a: (
    /* liases */
    671088640
  ),
  /* Shifts.layer */
  /**
  * 6. `utilities` (public) — for small, single-purpose classes
  */
  u: (
    /* tilities */
    805306368
  ),
  /* Shifts.layer */
  /**
  * 7. `overrides` (public, used by `css()`)
  */
  o: (
    /* verrides */
    939524096
  )
};
function mC(d) {
  var u;
  return ((u = d.match(/[-=:;]/g)) == null ? void 0 : u.length) || 0;
}
function Cw(d) {
  return Math.min(/(?:^|width[^\d]+)(\d+(?:.\d+)?)(p)?/.test(d) ? Math.max(0, 29.63 * (+RegExp.$1 / (RegExp.$2 ? 15 : 1)) ** 0.137 - 43) : 0, 15) << 22 | /* Shifts.responsive */
    Math.min(mC(d), 15) << 18;
}
let oA = [
  /* fi */
  "rst-c",
  /* hild: 0 */
  /* la */
  "st-ch",
  /* ild: 1 */
  // even and odd use: nth-child
  /* nt */
  "h-chi",
  /* ld: 2 */
  /* an */
  "y-lin",
  /* k: 3 */
  /* li */
  "nk",
  /* : 4 */
  /* vi */
  "sited",
  /* : 5 */
  /* ch */
  "ecked",
  /* : 6 */
  /* em */
  "pty",
  /* : 7 */
  /* re */
  "ad-on",
  /* ly: 8 */
  /* fo */
  "cus-w",
  /* ithin : 9 */
  /* ho */
  "ver",
  /* : 10 */
  /* fo */
  "cus",
  /* : 11 */
  /* fo */
  "cus-v",
  /* isible : 12 */
  /* ac */
  "tive",
  /* : 13 */
  /* di */
  "sable",
  /* d : 14 */
  /* op */
  "tiona",
  /* l: 15 */
  /* re */
  "quire"
];
function Hw({ n: d, i: u, v: s = [] }, h, g, w) {
  d && (d = jw({
    n: d,
    i: u,
    v: s
  })), w = [
    ...jt(w)
  ];
  for (let _ of s) {
    let C = h.theme("screens", _);
    for (let R of jt(C && Fw(C) || h.v(_))) {
      var m;
      w.push(R), g |= C ? 67108864 | /* Shifts.screens */
        Cw(R) : _ == "dark" ? 1073741824 : (
          /* Shifts.darkMode */
          R[0] == "@" ? Cw(R) : (m = R, // use first found pseudo-class
            1 << ~(/:([a-z-]+)/.test(m) && ~oA.indexOf(RegExp.$1.slice(2, 7)) || -18))
        );
    }
  }
  return {
    n: d,
    p: g,
    r: w,
    i: u
  };
}
let yC = /* @__PURE__ */ new Map();
function xw(d) {
  if (d.d) {
    let u = [], s = pw(
      // merge all conditions into a selector string
      d.r.reduce((h, g) => g[0] == "@" ? (u.push(g), h) : (
        // Go over the selector and replace the matching multiple selectors if any
        g ? pw(h, (w) => pw(
          g,
          // If the current condition has a nested selector replace it
          (m) => {
            let _ = /(:merge\(.+?\))(:[a-z-]+|\\[.+])/.exec(m);
            if (_) {
              let C = w.indexOf(_[1]);
              return ~C ? (
                // [':merge(.group):hover .rule', ':merge(.group):focus &'] -> ':merge(.group):focus:hover .rule'
                // ':merge(.group)' + ':focus' + ':hover .rule'
                w.slice(0, C) + _[0] + w.slice(C + _[1].length)
              ) : (
                // [':merge(.peer):focus~&', ':merge(.group):hover &'] -> ':merge(.peer):focus~:merge(.group):hover &'
                vw(w, m)
              );
            }
            return vw(m, w);
          }
        )) : h
      ), "&"),
      // replace '&' with rule name or an empty string
      (h) => vw(h, d.n ? "." + vC(d.n) : "")
    );
    return s && u.push(s.replace(/:merge\((.+?)\)/g, "$1")), u.reduceRight((h, g) => g + "{" + h + "}", d.d);
  }
}
function pw(d, u) {
  return d.replace(/ *((?:\(.+?\)|\[.+?\]|[^,])+) *(,|$)/g, (s, h, g) => u(h) + g);
}
function vw(d, u) {
  return d.replace(/&/g, u);
}
let Y_ = new Intl.Collator("en", {
  numeric: !0
});
function gC(d, u) {
  for (var s = 0, h = d.length; s < h;) {
    let g = h + s >> 1;
    0 >= SC(d[g], u) ? s = g + 1 : h = g;
  }
  return h;
}
function SC(d, u) {
  let s = d.p & Ln.o;
  return s == (u.p & Ln.o) && (s == Ln.b || s == Ln.o) ? 0 : d.p - u.p || d.o - u.o || Y_.compare(q_(d.n), q_(u.n)) || Y_.compare(Q_(d.n), Q_(u.n));
}
function q_(d) {
  return (d || "").split(/:/).pop().split("/").pop() || "\0";
}
function Q_(d) {
  return (d || "").replace(/\W/g, (u) => String.fromCharCode(127 + u.charCodeAt(0))) + "\0";
}
function mw(d, u) {
  return Math.round(parseInt(d, 16) * u);
}
function lu(d, u = {}) {
  if (typeof d == "function")
    return d(u);
  let { opacityValue: s = "1", opacityVariable: h } = u, g = h ? `var(${h})` : s;
  if (d.includes("<alpha-value>"))
    return d.replace("<alpha-value>", g);
  if (d[0] == "#" && (d.length == 4 || d.length == 7)) {
    let w = (d.length - 1) / 3, m = [
      17,
      1,
      0.062272
    ][w - 1];
    return `rgba(${[
      mw(d.substr(1, w), m),
      mw(d.substr(1 + w, w), m),
      mw(d.substr(1 + 2 * w, w), m),
      g
    ]})`;
  }
  return g == "1" ? d : g == "0" ? "#0000" : (
    // convert rgb and hsl to alpha variant
    d.replace(/^(rgb|hsl)(\([^)]+)\)$/, `$1a$2,${g})`)
  );
}
function wC(d, u, s, h, g = []) {
  return function w(m, { n: _, p: C, r: R = [], i: O }, U) {
    let $ = [], B = "", X = 0, ee = 0;
    for (let Ce in m || {}) {
      var re, Je;
      let pe = m[Ce];
      if (Ce[0] == "@") {
        if (!pe)
          continue;
        if (Ce[1] == "a") {
          $.push(...Vw(_, C, _y("" + pe), U, C, R, O, !0));
          continue;
        }
        if (Ce[1] == "l") {
          for (let _e of jt(pe))
            $.push(...w(_e, {
              n: _,
              p: (re = Ln[Ce[7]], // Set layer (first reset, than set)
                C & ~Ln.o | re),
              r: Ce[7] == "d" ? [] : R,
              i: O
            }, U));
          continue;
        }
        if (Ce[1] == "i") {
          $.push(...jt(pe).map((_e) => ({
            // before all layers
            p: -1,
            o: 0,
            r: [],
            d: Ce + " " + _e
          })));
          continue;
        }
        if (Ce[1] == "k") {
          $.push({
            p: Ln.d,
            o: 0,
            r: [
              Ce
            ],
            d: w(pe, {
              p: Ln.d
            }, U).map(xw).join("")
          });
          continue;
        }
        if (Ce[1] == "f") {
          $.push(...jt(pe).map((_e) => ({
            p: Ln.d,
            o: 0,
            r: [
              Ce
            ],
            d: w(_e, {
              p: Ln.d
            }, U).map(xw).join("")
          })));
          continue;
        }
      }
      if (typeof pe != "object" || Array.isArray(pe))
        Ce == "label" && pe ? _ = pe + by(JSON.stringify([
          C,
          O,
          m
        ])) : (pe || pe === 0) && (Ce = Ce.replace(/[A-Z]/g, (_e) => "-" + _e.toLowerCase()), ee += 1, X = Math.max(X, (Je = Ce)[0] == "-" ? 0 : mC(Je) + (/^(?:(border-(?!w|c|sty)|[tlbr].{2,4}m?$|c.{7,8}$)|([fl].{5}l|g.{8}$|pl))/.test(Je) ? +!!RegExp.$1 || /* +1 */
          -!!RegExp.$2 : (
          /* -1 */
          0
        )) + 1), B += (B ? ";" : "") + jt(pe).map((_e) => U.s(
          Ce,
          // support theme(...) function in values
          // calc(100vh - theme('spacing.12'))
          Pw("" + _e, U.theme) + (O ? " !important" : "")
        )).join(";"));
      else if (Ce[0] == "@" || Ce.includes("&")) {
        let _e = C;
        Ce[0] == "@" && (Ce = Ce.replace(/\bscreen\(([^)]+)\)/g, ($e, ft) => {
          let Ae = U.theme("screens", ft);
          return Ae ? (_e |= 67108864, /* Shifts.screens */
            Fw(Ae, "")) : $e;
        }), _e |= Cw(Ce)), $.push(...w(pe, {
          n: _,
          p: _e,
          r: [
            ...R,
            Ce
          ],
          i: O
        }, U));
      } else
        $.push(...w(pe, {
          p: C,
          r: [
            ...R,
            Ce
          ]
        }, U));
    }
    return (
      // PERF: prevent unshift using `rules = [{}]` above and then `rules[0] = {...}`
      $.unshift({
        n: _,
        p: C,
        o: (
          // number of declarations (descending)
          Math.max(0, 15 - ee) + // greatest precedence of properties
          // if there is no property precedence this is most likely a custom property only declaration
          // these have the highest precedence
          1.5 * Math.min(X || 15, 15)
        ),
        r: R,
        // stringified declarations
        d: B
      }), $.sort(SC)
    );
  }(d, Hw(u, s, h, g), s);
}
function Pw(d, u) {
  return d.replace(/theme\((["'`])?(.+?)\1(?:\s*,\s*(["'`])?(.+?)\3)?\)/g, (s, h, g, w, m = "") => {
    let _ = u(g, m);
    return typeof _ == "function" && /color|fill|stroke/i.test(g) ? lu(_) : "" + jt(_).filter((C) => Object(C) !== C);
  });
}
function bC(d, u) {
  let s, h = [];
  for (let g of d)
    g.d && g.n ? (s == null ? void 0 : s.p) == g.p && "" + s.r == "" + g.r ? (s.c = [
      s.c,
      g.c
    ].filter(Boolean).join(" "), s.d = s.d + ";" + g.d) : h.push(s = {
      ...g,
      n: g.n && u
    }) : h.push({
      ...g,
      n: g.n && u
    });
  return h;
}
function Ey(d, u, s = Ln.u, h, g) {
  let w = [];
  for (let m of d)
    for (let _ of function (C, R, O, U, $) {
      C = {
        ...C,
        i: C.i || $
      };
      let B = function (X, ee) {
        let re = yC.get(X.n);
        return re ? re(X, ee) : ee.r(X.n, X.v[0] == "dark");
      }(C, R);
      return B ? (
        // a list of class names
        typeof B == "string" ? ({ r: U, p: O } = Hw(C, R, O, U), bC(Ey(_y(B), R, O, U, C.i), C.n)) : Array.isArray(B) ? B.map((X) => {
          var ee, re;
          return {
            o: 0,
            ...X,
            r: [
              ...jt(U),
              ...jt(X.r)
            ],
            p: (ee = O, re = X.p ?? O, ee & ~Ln.o | re)
          };
        }) : wC(B, C, R, O, U)
      ) : (
        // propagate className as is
        [
          {
            c: jw(C),
            p: 0,
            o: 0,
            r: []
          }
        ]
      );
    }(m, u, s, h, g))
      w.splice(gC(w, _), 0, _);
  return w;
}
function Vw(d, u, s, h, g, w, m, _) {
  return bC((_ ? s.flatMap((C) => Ey([
    C
  ], h, g, w, m)) : Ey(s, h, g, w, m)).map((C) => (
    // do not move defaults
    // move only rules with a name unless they are in the base layer
    C.p & Ln.o && (C.n || u == Ln.b) ? {
      ...C,
      p: C.p & ~Ln.o | u,
      o: 0
    } : C
  )), d);
}
function lA(d, u, s, h) {
  var g;
  return g = (w, m) => {
    let { n: _, p: C, r: R, i: O } = Hw(w, m, u);
    return s && Vw(_, u, s, m, C, R, O, h);
  }, yC.set(d, g), d;
}
function yw(d, u, s) {
  if (d[d.length - 1] != "(") {
    let h = [], g = !1, w = !1, m = "";
    for (let _ of d)
      if (!(_ == "(" || /[~@]$/.test(_))) {
        if (_[0] == "!" && (_ = _.slice(1), g = !g), _.endsWith(":")) {
          h[_ == "dark:" ? "unshift" : "push"](_.slice(0, -1));
          continue;
        }
        _[0] == "-" && (_ = _.slice(1), w = !w), _.endsWith("-") && (_ = _.slice(0, -1)), _ && _ != "&" && (m += (m && "-") + _);
      }
    m && (w && (m = "-" + m), u[0].push({
      n: m,
      v: h.filter(uA),
      i: g
    }));
  }
}
function uA(d, u, s) {
  return s.indexOf(d) == u;
}
let G_ = /* @__PURE__ */ new Map();
function _y(d) {
  let u = G_.get(d);
  if (!u) {
    let s = [], h = [
      []
    ], g = 0, w = 0, m = null, _ = 0, C = (R, O = 0) => {
      g != _ && (s.push(d.slice(g, _ + O)), R && yw(s, h)), g = _ + 1;
    };
    for (; _ < d.length; _++) {
      let R = d[_];
      if (w)
        d[_ - 1] != "\\" && (w += +(R == "[") || -(R == "]"));
      else if (R == "[")
        w += 1;
      else if (m)
        d[_ - 1] != "\\" && m.test(d.slice(_)) && (m = null, g = _ + RegExp.lastMatch.length);
      else if (R == "/" && d[_ - 1] != "\\" && (d[_ + 1] == "*" || d[_ + 1] == "/"))
        m = d[_ + 1] == "*" ? /^\*\// : /^[\r\n]/;
      else if (R == "(")
        C(), s.push(R);
      else if (R == ":")
        d[_ + 1] != ":" && C(!1, 1);
      else if (/[\s,)]/.test(R)) {
        C(!0);
        let O = s.lastIndexOf("(");
        if (R == ")") {
          let U = s[O - 1];
          if (/[~@]$/.test(U)) {
            let $ = h.shift();
            s.length = O, yw([
              ...s,
              "#"
            ], h);
            let { v: B } = h[0].pop();
            for (let X of $)
              X.v.splice(+(X.v[0] == "dark") - +(B[0] == "dark"), B.length);
            yw([
              ...s,
              lA(
                // named nested
                U.length > 1 ? U.slice(0, -1) + by(JSON.stringify([
                  U,
                  $
                ])) : U + "(" + aA($) + ")",
                Ln.a,
                $,
                /@$/.test(U)
              )
            ], h);
          }
          O = s.lastIndexOf("(", O - 1);
        }
        s.length = O + 1;
      } else
        /[~@]/.test(R) && d[_ + 1] == "(" && // start nested block
          // ~(...) or button~(...)
          // @(...) or button@(...)
          h.unshift([]);
    }
    C(!0), G_.set(d, u = h[0]);
  }
  return u;
}
function ne(d, u, s) {
  return [
    d,
    Tw(u, s)
  ];
}
function Tw(d, u) {
  return typeof d == "function" ? d : typeof d == "string" && /^[\w-]+$/.test(d) ? (
    // a CSS property alias
    (s, h) => ({
      [d]: u ? u(s, h) : Rw(s, 1)
    })
  ) : (s) => (
    // CSSObject, shortcut or apply
    d || {
      [s[1]]: Rw(s, 2)
    }
  );
}
function Rw(d, u, s = d.slice(u).find(Boolean) || d.$$ || d.input) {
  return d.input[0] == "-" ? `calc(${s} * -1)` : s;
}
function oe(d, u, s, h) {
  return [
    d,
    sA(u, s, h)
  ];
}
function sA(d, u, s) {
  let h = typeof u == "string" ? (g, w) => ({
    [u]: s ? s(g, w) : g._
  }) : u || (({ 1: g, _: w }, m, _) => ({
    [g || _]: w
  }));
  return (g, w) => {
    let m = EC(d || g[1]), _ = w.theme(m, g.$$) ?? uu(g.$$, m, w);
    if (_ != null)
      return g._ = Rw(g, 0, _), h(g, w, m);
  };
}
function Vn(d, u = {}, s) {
  return [
    d,
    cA(u, s)
  ];
}
function cA(d = {}, u) {
  return (s, h) => {
    let { section: g = EC(s[0]).replace("-", "") + "Color" } = d, [w, m] = fA(s.$$);
    if (!w)
      return;
    let _ = h.theme(g, w) || uu(w, g, h);
    if (!_ || typeof _ == "object")
      return;
    let {
      // text- -> --tw-text-opacity
      // ring-offset(?:-|$) -> --tw-ring-offset-opacity
      // TODO move this default into preset-tailwind?
      opacityVariable: C = `--tw-${s[0].replace(/-$/, "")}-opacity`,
      opacitySection: R = g.replace("Color", "Opacity"),
      property: O = g,
      selector: U
    } = d, $ = h.theme(R, m || "DEFAULT") || m && uu(m, R, h), B = u || (({ _: ee }) => {
      let re = wy(O, ee);
      return U ? {
        [U]: re
      } : re;
    });
    s._ = {
      value: lu(_, {
        opacityVariable: C || void 0,
        opacityValue: $ || void 0
      }),
      color: (ee) => lu(_, ee),
      opacityVariable: C || void 0,
      opacityValue: $ || void 0
    };
    let X = B(s, h);
    if (!s.dark) {
      let ee = h.d(g, w, _);
      ee && ee !== _ && (s._ = {
        value: lu(ee, {
          opacityVariable: C || void 0,
          opacityValue: $ || "1"
        }),
        color: (re) => lu(ee, re),
        opacityVariable: C || void 0,
        opacityValue: $ || void 0
      }, X = {
        "&": X,
        [h.v("dark")]: B(s, h)
      });
    }
    return X;
  };
}
function fA(d) {
  return (d.match(/^(\[[^\]]+]|[^/]+?)(?:\/(.+))?$/) || []).slice(1);
}
function wy(d, u) {
  let s = {};
  return typeof u == "string" ? s[d] = u : (u.opacityVariable && u.value.includes(u.opacityVariable) && (s[u.opacityVariable] = u.opacityValue || "1"), s[d] = u.value), s;
}
function uu(d, u, s) {
  if (d[0] == "[" && d.slice(-1) == "]") {
    if (d = up(Pw(d.slice(1, -1), s.theme)), !u)
      return d;
    if (
      // Respect type hints from the user on ambiguous arbitrary values - https://tailwindcss.com/docs/adding-custom-styles#resolving-ambiguities
      !// If this is a color section and the value is a hex color, color function or color name
      (/color|fill|stroke/i.test(u) && !(/^color:/.test(d) || /^(#|((hsl|rgb)a?|hwb|lab|lch|color)\(|[a-z]+$)/.test(d)) || // url(, [a-z]-gradient(, image(, cross-fade(, image-set(
        /image/i.test(u) && !(/^image:/.test(d) || /^[a-z-]+\(/.test(d)) || // font-*
        // - fontWeight (type: ['lookup', 'number', 'any'])
        // - fontFamily (type: ['lookup', 'generic-name', 'family-name'])
        /weight/i.test(u) && !(/^(number|any):/.test(d) || /^\d+$/.test(d)) || // bg-*
        // - backgroundPosition (type: ['lookup', ['position', { preferOnConflict: true }]])
        // - backgroundSize (type: ['lookup', 'length', 'percentage', 'size'])
        /position/i.test(u) && /^(length|size):/.test(d))
    )
      return d.replace(/^[a-z-]+:/, "");
  }
}
function EC(d) {
  return d.replace(/-./g, (u) => u[1].toUpperCase());
}
function up(d) {
  return (
    // Keep raw strings if it starts with `url(`
    d.includes("url(") ? d.replace(/(.*?)(url\(.*?\))(.*?)/g, (u, s = "", h, g = "") => up(s) + h + up(g)) : d.replace(/(^|[^\\])_+/g, (u, s) => s + " ".repeat(u.length - s.length)).replace(/\\_/g, "_").replace(/(calc|min|max|clamp)\(.+\)/g, (u) => u.replace(/(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g, "$1 $2 "))
  );
}
function _C({ presets: d = [], ...u }) {
  let s = {
    darkMode: void 0,
    darkColor: void 0,
    preflight: u.preflight !== !1 && [],
    theme: {},
    variants: jt(u.variants),
    rules: jt(u.rules),
    ignorelist: jt(u.ignorelist),
    hash: void 0,
    stringify: (h, g) => h + ":" + g,
    finalize: []
  };
  for (let h of jt([
    ...d,
    {
      darkMode: u.darkMode,
      darkColor: u.darkColor,
      preflight: u.preflight !== !1 && jt(u.preflight),
      theme: u.theme,
      hash: u.hash,
      stringify: u.stringify,
      finalize: u.finalize
    }
  ])) {
    let { preflight: g, darkMode: w = s.darkMode, darkColor: m = s.darkColor, theme: _, variants: C, rules: R, ignorelist: O, hash: U = s.hash, stringify: $ = s.stringify, finalize: B } = typeof h == "function" ? h(s) : h;
    s = {
      // values defined by user or previous presets take precedence
      preflight: s.preflight !== !1 && g !== !1 && [
        ...s.preflight,
        ...jt(g)
      ],
      darkMode: w,
      darkColor: m,
      theme: {
        ...s.theme,
        ..._,
        extend: {
          ...s.theme.extend,
          ..._ == null ? void 0 : _.extend
        }
      },
      variants: [
        ...s.variants,
        ...jt(C)
      ],
      rules: [
        ...s.rules,
        ...jt(R)
      ],
      ignorelist: [
        ...s.ignorelist,
        ...jt(O)
      ],
      hash: U,
      stringify: $,
      finalize: [
        ...s.finalize,
        ...jt(B)
      ]
    };
  }
  return s;
}
function W_(d, u, s, h, g, w) {
  for (let m of u) {
    let _ = s.get(m);
    _ || s.set(m, _ = h(m));
    let C = _(d, g, w);
    if (C)
      return C;
  }
}
function dA(d) {
  var u;
  return kw(d[0], typeof (u = d[1]) == "function" ? u : () => u);
}
function hA(d) {
  var u, s;
  return Array.isArray(d) ? kw(d[0], Tw(d[1], d[2])) : kw(d, Tw(u, s));
}
function kw(d, u) {
  return CC(d, (s, h, g, w) => {
    let m = h.exec(s);
    if (m)
      return (
        // MATCH.$_ = value
        m.$$ = s.slice(m[0].length), m.dark = w, u(m, g)
      );
  });
}
function CC(d, u) {
  let s = jt(d).map(pA);
  return (h, g, w) => {
    for (let m of s) {
      let _ = u(h, m, g, w);
      if (_)
        return _;
    }
  };
}
function pA(d) {
  return typeof d == "string" ? RegExp("^" + d + (d.includes("$") || d.slice(-1) == "-" ? "" : "$")) : d;
}
function vA(d, u) {
  let s = _C(d), h = function ({ theme: C, darkMode: R, darkColor: O = $w, variants: U, rules: $, hash: B, stringify: X, ignorelist: ee, finalize: re }) {
    let Je = /* @__PURE__ */ new Map(), Ce = /* @__PURE__ */ new Map(), pe = /* @__PURE__ */ new Map(), _e = /* @__PURE__ */ new Map(), $e = CC(ee, (Pe, dt) => dt.test(Pe));
    U.push([
      "dark",
      Array.isArray(R) || R == "class" ? `${jt(R)[1] || ".dark"} &` : typeof R == "string" && R != "media" ? R : (
        // a custom selector
        "@media (prefers-color-scheme:dark)"
      )
    ]);
    let ft = typeof B == "function" ? (Pe) => B(Pe, by) : B ? by : I_;
    ft !== I_ && re.push((Pe) => {
      var dt;
      return {
        ...Pe,
        n: Pe.n && ft(Pe.n),
        d: (dt = Pe.d) == null ? void 0 : dt.replace(/--(tw(?:-[\w-]+)?)\b/g, (at, ht) => "--" + ft(ht).replace("#", ""))
      };
    });
    let Ae = {
      theme: function ({ extend: Pe = {}, ...dt }) {
        let at = {}, ht = {
          get colors() {
            return Gt("colors");
          },
          theme: Gt,
          // Stub implementation as negated values are automatically infered and do _not_ need to be in the theme
          negative() {
            return {};
          },
          breakpoints(ze) {
            let Ct = {};
            for (let Xe in ze)
              typeof ze[Xe] == "string" && (Ct["screen-" + Xe] = ze[Xe]);
            return Ct;
          }
        };
        return Gt;
        function Gt(ze, Ct, Xe, fn) {
          if (ze) {
            if ({ 1: ze, 2: fn } = // eslint-disable-next-line no-sparse-arrays
              /^(\S+?)(?:\s*\/\s*([^/]+))?$/.exec(ze) || [
                ,
                ze
              ], /[.[]/.test(ze)) {
              let Ie = [];
              ze.replace(/\[([^\]]+)\]|([^.[]+)/g, (Ze, Wt, Bn = Wt) => Ie.push(Bn)), ze = Ie.shift(), Xe = Ct, Ct = Ie.join("-");
            }
            let we = at[ze] || // two-step deref to allow extend section to reference base section
              Object.assign(Object.assign(
                // Make sure to not get into recursive calls
                at[ze] = {},
                qe(dt, ze)
              ), qe(Pe, ze));
            if (Ct == null)
              return we;
            Ct || (Ct = "DEFAULT");
            let le = we[Ct] ?? Ct.split("-").reduce((Ie, Ze) => Ie == null ? void 0 : Ie[Ze], we) ?? Xe;
            return fn ? lu(le, {
              opacityValue: Pw(fn, Gt)
            }) : le;
          }
          let te = {};
          for (let we of [
            ...Object.keys(dt),
            ...Object.keys(Pe)
          ])
            te[we] = Gt(we);
          return te;
        }
        function qe(ze, Ct) {
          let Xe = ze[Ct];
          return typeof Xe == "function" && (Xe = Xe(ht)), Xe && /color|fill|stroke/i.test(Ct) ? function fn(te, we = []) {
            let le = {};
            for (let Ie in te) {
              let Ze = te[Ie], Wt = [
                ...we,
                Ie
              ];
              le[Wt.join("-")] = Ze, Ie == "DEFAULT" && (Wt = we, le[we.join("-")] = Ze), typeof Ze == "object" && Object.assign(le, fn(Ze, Wt));
            }
            return le;
          }(Xe) : Xe;
        }
      }(C),
      e: vC,
      h: ft,
      s(Pe, dt) {
        return X(Pe, dt, Ae);
      },
      d(Pe, dt, at) {
        return O(Pe, dt, Ae, at);
      },
      v(Pe) {
        return Je.has(Pe) || Je.set(Pe, W_(Pe, U, Ce, dA, Ae) || "&:" + Pe), Je.get(Pe);
      },
      r(Pe, dt) {
        let at = JSON.stringify([
          Pe,
          dt
        ]);
        return pe.has(at) || pe.set(at, !$e(Pe, Ae) && W_(Pe, $, _e, hA, Ae, dt)), pe.get(at);
      },
      f(Pe) {
        return re.reduce((dt, at) => at(dt, Ae), Pe);
      }
    };
    return Ae;
  }(s), g = /* @__PURE__ */ new Map(), w = [], m = /* @__PURE__ */ new Set();
  u.resume((C) => g.set(C, C), (C, R) => {
    u.insert(C, w.length, R), w.push(R), m.add(C);
  });
  function _(C) {
    let R = h.f(C), O = xw(R);
    if (O && !m.has(O)) {
      m.add(O);
      let U = gC(w, C);
      u.insert(O, U, C), w.splice(U, 0, C);
    }
    return R.n;
  }
  return Object.defineProperties(function (R) {
    if (!g.size)
      for (let U of jt(s.preflight))
        typeof U == "function" && (U = U(h)), U && (typeof U == "string" ? Vw("", Ln.b, _y(U), h, Ln.b, [], !1, !0) : wC(U, {}, h, Ln.b)).forEach(_);
    R = "" + R;
    let O = g.get(R);
    if (!O) {
      let U = /* @__PURE__ */ new Set();
      for (let $ of Ey(_y(R), h))
        U.add($.c).add(_($));
      O = [
        ...U
      ].filter(Boolean).join(" "), g.set(R, O).set(O, O);
    }
    return O;
  }, Object.getOwnPropertyDescriptors({
    get target() {
      return u.target;
    },
    theme: h.theme,
    config: s,
    snapshot() {
      let C = u.snapshot(), R = new Set(m), O = new Map(g), U = [
        ...w
      ];
      return () => {
        C(), m = R, g = O, w = U;
      };
    },
    clear() {
      u.clear(), m = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Map(), w = [];
    },
    destroy() {
      this.clear(), u.destroy();
    }
  }));
}
function mA(d, u) {
  return d != u && "" + d.split(" ").sort() != "" + u.split(" ").sort();
}
function yA(d) {
  let u = new MutationObserver(s);
  return {
    observe(g) {
      u.observe(g, {
        attributeFilter: [
          "class"
        ],
        subtree: !0,
        childList: !0
      }), h(g), s([
        {
          target: g,
          type: ""
        }
      ]);
    },
    disconnect() {
      u.disconnect();
    }
  };
  function s(g) {
    for (let { type: w, target: m } of g)
      if (w[0] == "a")
        h(m);
      else
        for (let _ of m.querySelectorAll("[class]"))
          h(_);
    u.takeRecords();
  }
  function h(g) {
    var _;
    let w, m = (_ = g.getAttribute) == null ? void 0 : _.call(g, "class");
    m && mA(m, w = d(m)) && // Not using `target.className = ...` as that is read-only for SVGElements
      g.setAttribute("class", w);
  }
}
function gA(d = bA, u = typeof document < "u" && document.documentElement) {
  if (u) {
    let s = yA(d);
    s.observe(u);
    let { destroy: h } = d;
    d.destroy = () => {
      s.disconnect(), h.call(d);
    };
  }
  return d;
}
function SA(d) {
  let u = document.querySelector(d || 'style[data-twind=""]');
  return (!u || u.tagName != "STYLE") && (u = document.createElement("style"), document.head.prepend(u)), u.dataset.twind = "claimed", u;
}
function wA(d) {
  let u = d != null && d.cssRules ? d : (d && typeof d != "string" ? d : SA(d)).sheet;
  return {
    target: u,
    snapshot() {
      let s = Array.from(u.cssRules, (h) => h.cssText);
      return () => {
        this.clear(), s.forEach(this.insert);
      };
    },
    clear() {
      for (let s = u.cssRules.length; s--;)
        u.deleteRule(s);
    },
    destroy() {
      var s;
      (s = u.ownerNode) == null || s.remove();
    },
    insert(s, h) {
      try {
        u.insertRule(s, h);
      } catch {
        u.insertRule(":root{}", h);
      }
    },
    resume: $w
  };
}
let bA = /* @__PURE__ */ new Proxy(
  // just exposing the active as tw should work with most bundlers
  // as ES module export can be re-assigned BUT some bundlers to not honor this
  // -> using a delegation proxy here
  $w,
  {
    apply(d, u, s) {
      return hw(s[0]);
    },
    get(d, u) {
      let s = hw[u];
      return typeof s == "function" ? function () {
        return s.apply(hw, arguments);
      } : s;
    }
  }
), Dw = {
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  },
  columns: {
    auto: "auto",
    // Handled by plugin,
    // 1: '1',
    // 2: '2',
    // 3: '3',
    // 4: '4',
    // 5: '5',
    // 6: '6',
    // 7: '7',
    // 8: '8',
    // 9: '9',
    // 10: '10',
    // 11: '11',
    // 12: '12',
    "3xs": "16rem",
    "2xs": "18rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem"
  },
  spacing: {
    px: "1px",
    0: "0px",
    .../* @__PURE__ */ Si(4, "rem", 4, 0.5, 0.5),
    // 0.5: '0.125rem',
    // 1: '0.25rem',
    // 1.5: '0.375rem',
    // 2: '0.5rem',
    // 2.5: '0.625rem',
    // 3: '0.75rem',
    // 3.5: '0.875rem',
    // 4: '1rem',
    .../* @__PURE__ */ Si(12, "rem", 4, 5),
    // 5: '1.25rem',
    // 6: '1.5rem',
    // 7: '1.75rem',
    // 8: '2rem',
    // 9: '2.25rem',
    // 10: '2.5rem',
    // 11: '2.75rem',
    // 12: '3rem',
    14: "3.5rem",
    .../* @__PURE__ */ Si(64, "rem", 4, 16, 4),
    // 16: '4rem',
    // 20: '5rem',
    // 24: '6rem',
    // 28: '7rem',
    // 32: '8rem',
    // 36: '9rem',
    // 40: '10rem',
    // 44: '11rem',
    // 48: '12rem',
    // 52: '13rem',
    // 56: '14rem',
    // 60: '15rem',
    // 64: '16rem',
    72: "18rem",
    80: "20rem",
    96: "24rem"
  },
  durations: {
    75: "75ms",
    100: "100ms",
    150: "150ms",
    200: "200ms",
    300: "300ms",
    500: "500ms",
    700: "700ms",
    1e3: "1000ms"
  },
  animation: {
    none: "none",
    spin: "spin 1s linear infinite",
    ping: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
    pulse: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
    bounce: "bounce 1s infinite"
  },
  aspectRatio: {
    auto: "auto",
    square: "1/1",
    video: "16/9"
  },
  backdropBlur: /* @__PURE__ */ ct("blur"),
  backdropBrightness: /* @__PURE__ */ ct("brightness"),
  backdropContrast: /* @__PURE__ */ ct("contrast"),
  backdropGrayscale: /* @__PURE__ */ ct("grayscale"),
  backdropHueRotate: /* @__PURE__ */ ct("hueRotate"),
  backdropInvert: /* @__PURE__ */ ct("invert"),
  backdropOpacity: /* @__PURE__ */ ct("opacity"),
  backdropSaturate: /* @__PURE__ */ ct("saturate"),
  backdropSepia: /* @__PURE__ */ ct("sepia"),
  backgroundColor: /* @__PURE__ */ ct("colors"),
  backgroundImage: {
    none: "none"
  },
  // These are built-in
  // 'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
  // 'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
  // 'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
  // 'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
  // 'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
  // 'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
  // 'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
  // 'gradient-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
  backgroundOpacity: /* @__PURE__ */ ct("opacity"),
  // backgroundPosition: {
  //   // The following are already handled by the plugin:
  //   // center, right, left, bottom, top
  //   // 'bottom-10px-right-20px' -> bottom 10px right 20px
  // },
  backgroundSize: {
    auto: "auto",
    cover: "cover",
    contain: "contain"
  },
  blur: {
    none: "none",
    0: "0",
    sm: "4px",
    DEFAULT: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "40px",
    "3xl": "64px"
  },
  brightness: {
    .../* @__PURE__ */ Si(200, "", 100, 0, 50),
    // 0: '0',
    // 50: '.5',
    // 150: '1.5',
    // 200: '2',
    .../* @__PURE__ */ Si(110, "", 100, 90, 5),
    // 90: '.9',
    // 95: '.95',
    // 100: '1',
    // 105: '1.05',
    // 110: '1.1',
    75: "0.75",
    125: "1.25"
  },
  borderColor: ({ theme: d }) => ({
    DEFAULT: d("colors.gray.200", "currentColor"),
    ...d("colors")
  }),
  borderOpacity: /* @__PURE__ */ ct("opacity"),
  borderRadius: {
    none: "0px",
    sm: "0.125rem",
    DEFAULT: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    "1/2": "50%",
    full: "9999px"
  },
  borderSpacing: /* @__PURE__ */ ct("spacing"),
  borderWidth: {
    DEFAULT: "1px",
    .../* @__PURE__ */ Hi(8, "px")
  },
  // 0: '0px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',
  boxShadow: {
    sm: "0 1px 2px 0 rgba(0,0,0,0.05)",
    DEFAULT: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)",
    md: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
    lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
    xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)",
    "2xl": "0 25px 50px -12px rgba(0,0,0,0.25)",
    inner: "inset 0 2px 4px 0 rgba(0,0,0,0.05)",
    none: "0 0 #0000"
  },
  boxShadowColor: ct("colors"),
  // container: {},
  // cursor: {
  //   // Default values are handled by plugin
  // },
  caretColor: /* @__PURE__ */ ct("colors"),
  accentColor: ({ theme: d }) => ({
    auto: "auto",
    ...d("colors")
  }),
  contrast: {
    .../* @__PURE__ */ Si(200, "", 100, 0, 50),
    // 0: '0',
    // 50: '.5',
    // 150: '1.5',
    // 200: '2',
    75: "0.75",
    125: "1.25"
  },
  content: {
    none: "none"
  },
  divideColor: /* @__PURE__ */ ct("borderColor"),
  divideOpacity: /* @__PURE__ */ ct("borderOpacity"),
  divideWidth: /* @__PURE__ */ ct("borderWidth"),
  dropShadow: {
    sm: "0 1px 1px rgba(0,0,0,0.05)",
    DEFAULT: [
      "0 1px 2px rgba(0,0,0,0.1)",
      "0 1px 1px rgba(0,0,0,0.06)"
    ],
    md: [
      "0 4px 3px rgba(0,0,0,0.07)",
      "0 2px 2px rgba(0,0,0,0.06)"
    ],
    lg: [
      "0 10px 8px rgba(0,0,0,0.04)",
      "0 4px 3px rgba(0,0,0,0.1)"
    ],
    xl: [
      "0 20px 13px rgba(0,0,0,0.03)",
      "0 8px 5px rgba(0,0,0,0.08)"
    ],
    "2xl": "0 25px 25px rgba(0,0,0,0.15)",
    none: "0 0 #0000"
  },
  fill: ({ theme: d }) => ({
    ...d("colors"),
    none: "none"
  }),
  grayscale: {
    DEFAULT: "100%",
    0: "0"
  },
  hueRotate: {
    0: "0deg",
    15: "15deg",
    30: "30deg",
    60: "60deg",
    90: "90deg",
    180: "180deg"
  },
  invert: {
    DEFAULT: "100%",
    0: "0"
  },
  flex: {
    1: "1 1 0%",
    auto: "1 1 auto",
    initial: "0 1 auto",
    none: "none"
  },
  flexBasis: ({ theme: d }) => ({
    ...d("spacing"),
    ...rp(2, 6),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    // '1/5': '20%',
    // '2/5': '40%',
    // '3/5': '60%',
    // '4/5': '80%',
    // '1/6': '16.666667%',
    // '2/6': '33.333333%',
    // '3/6': '50%',
    // '4/6': '66.666667%',
    // '5/6': '83.333333%',
    ...rp(12, 12),
    // '1/12': '8.333333%',
    // '2/12': '16.666667%',
    // '3/12': '25%',
    // '4/12': '33.333333%',
    // '5/12': '41.666667%',
    // '6/12': '50%',
    // '7/12': '58.333333%',
    // '8/12': '66.666667%',
    // '9/12': '75%',
    // '10/12': '83.333333%',
    // '11/12': '91.666667%',
    auto: "auto",
    full: "100%"
  }),
  flexGrow: {
    DEFAULT: 1,
    0: 0
  },
  flexShrink: {
    DEFAULT: 1,
    0: 0
  },
  fontFamily: {
    sans: 'ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'.split(","),
    serif: 'ui-serif,Georgia,Cambria,"Times New Roman",Times,serif'.split(","),
    mono: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'.split(",")
  },
  fontSize: {
    xs: [
      "0.75rem",
      "1rem"
    ],
    sm: [
      "0.875rem",
      "1.25rem"
    ],
    base: [
      "1rem",
      "1.5rem"
    ],
    lg: [
      "1.125rem",
      "1.75rem"
    ],
    xl: [
      "1.25rem",
      "1.75rem"
    ],
    "2xl": [
      "1.5rem",
      "2rem"
    ],
    "3xl": [
      "1.875rem",
      "2.25rem"
    ],
    "4xl": [
      "2.25rem",
      "2.5rem"
    ],
    "5xl": [
      "3rem",
      "1"
    ],
    "6xl": [
      "3.75rem",
      "1"
    ],
    "7xl": [
      "4.5rem",
      "1"
    ],
    "8xl": [
      "6rem",
      "1"
    ],
    "9xl": [
      "8rem",
      "1"
    ]
  },
  fontWeight: {
    thin: "100",
    extralight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900"
  },
  gap: /* @__PURE__ */ ct("spacing"),
  gradientColorStops: /* @__PURE__ */ ct("colors"),
  gridAutoColumns: {
    auto: "auto",
    min: "min-content",
    max: "max-content",
    fr: "minmax(0,1fr)"
  },
  gridAutoRows: {
    auto: "auto",
    min: "min-content",
    max: "max-content",
    fr: "minmax(0,1fr)"
  },
  gridColumn: {
    // span-X is handled by the plugin: span-1 -> span 1 / span 1
    auto: "auto",
    "span-full": "1 / -1"
  },
  // gridColumnEnd: {
  //   // Defaults handled by plugin
  // },
  // gridColumnStart: {
  //   // Defaults handled by plugin
  // },
  gridRow: {
    // span-X is handled by the plugin: span-1 -> span 1 / span 1
    auto: "auto",
    "span-full": "1 / -1"
  },
  // gridRowStart: {
  //   // Defaults handled by plugin
  // },
  // gridRowEnd: {
  //   // Defaults handled by plugin
  // },
  gridTemplateColumns: {
    // numbers are handled by the plugin: 1 -> repeat(1, minmax(0, 1fr))
    none: "none"
  },
  gridTemplateRows: {
    // numbers are handled by the plugin: 1 -> repeat(1, minmax(0, 1fr))
    none: "none"
  },
  height: ({ theme: d }) => ({
    ...d("spacing"),
    ...rp(2, 6),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    // '1/5': '20%',
    // '2/5': '40%',
    // '3/5': '60%',
    // '4/5': '80%',
    // '1/6': '16.666667%',
    // '2/6': '33.333333%',
    // '3/6': '50%',
    // '4/6': '66.666667%',
    // '5/6': '83.333333%',
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    auto: "auto",
    full: "100%",
    screen: "100vh"
  }),
  inset: ({ theme: d }) => ({
    ...d("spacing"),
    ...rp(2, 4),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    auto: "auto",
    full: "100%"
  }),
  keyframes: {
    spin: {
      from: {
        transform: "rotate(0deg)"
      },
      to: {
        transform: "rotate(360deg)"
      }
    },
    ping: {
      "0%": {
        transform: "scale(1)",
        opacity: "1"
      },
      "75%,100%": {
        transform: "scale(2)",
        opacity: "0"
      }
    },
    pulse: {
      "0%,100%": {
        opacity: "1"
      },
      "50%": {
        opacity: ".5"
      }
    },
    bounce: {
      "0%, 100%": {
        transform: "translateY(-25%)",
        animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
      },
      "50%": {
        transform: "none",
        animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
      }
    }
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em"
  },
  lineHeight: {
    .../* @__PURE__ */ Si(10, "rem", 4, 3),
    // 3: '.75rem',
    // 4: '1rem',
    // 5: '1.25rem',
    // 6: '1.5rem',
    // 7: '1.75rem',
    // 8: '2rem',
    // 9: '2.25rem',
    // 10: '2.5rem',
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2"
  },
  // listStyleType: {
  //   // Defaults handled by plugin
  // },
  margin: ({ theme: d }) => ({
    auto: "auto",
    ...d("spacing")
  }),
  maxHeight: ({ theme: d }) => ({
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    screen: "100vh",
    ...d("spacing")
  }),
  maxWidth: ({ theme: d, breakpoints: u }) => ({
    ...u(d("screens")),
    none: "none",
    0: "0rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    prose: "65ch"
  }),
  minHeight: {
    0: "0px",
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    screen: "100vh"
  },
  minWidth: {
    0: "0px",
    full: "100%",
    min: "min-content",
    max: "max-content",
    fit: "fit-content"
  },
  // objectPosition: {
  //   // The plugins joins all arguments by default
  // },
  opacity: {
    .../* @__PURE__ */ Si(100, "", 100, 0, 10),
    // 0: '0',
    // 10: '0.1',
    // 20: '0.2',
    // 30: '0.3',
    // 40: '0.4',
    // 60: '0.6',
    // 70: '0.7',
    // 80: '0.8',
    // 90: '0.9',
    // 100: '1',
    5: "0.05",
    25: "0.25",
    75: "0.75",
    95: "0.95"
  },
  order: {
    // Handled by plugin
    // 1: '1',
    // 2: '2',
    // 3: '3',
    // 4: '4',
    // 5: '5',
    // 6: '6',
    // 7: '7',
    // 8: '8',
    // 9: '9',
    // 10: '10',
    // 11: '11',
    // 12: '12',
    first: "-9999",
    last: "9999",
    none: "0"
  },
  padding: /* @__PURE__ */ ct("spacing"),
  placeholderColor: /* @__PURE__ */ ct("colors"),
  placeholderOpacity: /* @__PURE__ */ ct("opacity"),
  outlineColor: /* @__PURE__ */ ct("colors"),
  outlineOffset: /* @__PURE__ */ Hi(8, "px"),
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',,
  outlineWidth: /* @__PURE__ */ Hi(8, "px"),
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',,
  ringColor: ({ theme: d }) => ({
    ...d("colors"),
    DEFAULT: "#3b82f6"
  }),
  ringOffsetColor: /* @__PURE__ */ ct("colors"),
  ringOffsetWidth: /* @__PURE__ */ Hi(8, "px"),
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',,
  ringOpacity: ({ theme: d }) => ({
    ...d("opacity"),
    DEFAULT: "0.5"
  }),
  ringWidth: {
    DEFAULT: "3px",
    .../* @__PURE__ */ Hi(8, "px")
  },
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',
  rotate: {
    .../* @__PURE__ */ Hi(2, "deg"),
    // 0: '0deg',
    // 1: '1deg',
    // 2: '2deg',
    .../* @__PURE__ */ Hi(12, "deg", 3),
    // 3: '3deg',
    // 6: '6deg',
    // 12: '12deg',
    .../* @__PURE__ */ Hi(180, "deg", 45)
  },
  // 45: '45deg',
  // 90: '90deg',
  // 180: '180deg',
  saturate: /* @__PURE__ */ Si(200, "", 100, 0, 50),
  // 0: '0',
  // 50: '.5',
  // 100: '1',
  // 150: '1.5',
  // 200: '2',
  scale: {
    .../* @__PURE__ */ Si(150, "", 100, 0, 50),
    // 0: '0',
    // 50: '.5',
    // 150: '1.5',
    .../* @__PURE__ */ Si(110, "", 100, 90, 5),
    // 90: '.9',
    // 95: '.95',
    // 100: '1',
    // 105: '1.05',
    // 110: '1.1',
    75: "0.75",
    125: "1.25"
  },
  scrollMargin: /* @__PURE__ */ ct("spacing"),
  scrollPadding: /* @__PURE__ */ ct("spacing"),
  sepia: {
    0: "0",
    DEFAULT: "100%"
  },
  skew: {
    .../* @__PURE__ */ Hi(2, "deg"),
    // 0: '0deg',
    // 1: '1deg',
    // 2: '2deg',
    .../* @__PURE__ */ Hi(12, "deg", 3)
  },
  // 3: '3deg',
  // 6: '6deg',
  // 12: '12deg',
  space: /* @__PURE__ */ ct("spacing"),
  stroke: ({ theme: d }) => ({
    ...d("colors"),
    none: "none"
  }),
  strokeWidth: /* @__PURE__ */ Si(2),
  // 0: '0',
  // 1: '1',
  // 2: '2',,
  textColor: /* @__PURE__ */ ct("colors"),
  textDecorationColor: /* @__PURE__ */ ct("colors"),
  textDecorationThickness: {
    "from-font": "from-font",
    auto: "auto",
    .../* @__PURE__ */ Hi(8, "px")
  },
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',
  textUnderlineOffset: {
    auto: "auto",
    .../* @__PURE__ */ Hi(8, "px")
  },
  // 0: '0px',
  // 1: '1px',
  // 2: '2px',
  // 4: '4px',
  // 8: '8px',
  textIndent: /* @__PURE__ */ ct("spacing"),
  textOpacity: /* @__PURE__ */ ct("opacity"),
  // transformOrigin: {
  //   // The following are already handled by the plugin:
  //   // center, right, left, bottom, top
  //   // 'bottom-10px-right-20px' -> bottom 10px right 20px
  // },
  transitionDuration: ({ theme: d }) => ({
    ...d("durations"),
    DEFAULT: "150ms"
  }),
  transitionDelay: /* @__PURE__ */ ct("durations"),
  transitionProperty: {
    none: "none",
    all: "all",
    DEFAULT: "color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter",
    colors: "color,background-color,border-color,text-decoration-color,fill,stroke",
    opacity: "opacity",
    shadow: "box-shadow",
    transform: "transform"
  },
  transitionTimingFunction: {
    DEFAULT: "cubic-bezier(0.4,0,0.2,1)",
    linear: "linear",
    in: "cubic-bezier(0.4,0,1,1)",
    out: "cubic-bezier(0,0,0.2,1)",
    "in-out": "cubic-bezier(0.4,0,0.2,1)"
  },
  translate: ({ theme: d }) => ({
    ...d("spacing"),
    ...rp(2, 4),
    // '1/2': '50%',
    // '1/3': '33.333333%',
    // '2/3': '66.666667%',
    // '1/4': '25%',
    // '2/4': '50%',
    // '3/4': '75%',
    full: "100%"
  }),
  width: ({ theme: d }) => ({
    min: "min-content",
    max: "max-content",
    fit: "fit-content",
    screen: "100vw",
    ...d("flexBasis")
  }),
  willChange: {
    scroll: "scroll-position"
  },
  // other options handled by rules
  // auto: 'auto',
  // contents: 'contents',
  // transform: 'transform',
  zIndex: {
    .../* @__PURE__ */ Si(50, "", 1, 0, 10),
    // 0: '0',
    // 10: '10',
    // 20: '20',
    // 30: '30',
    // 40: '40',
    // 50: '50',
    auto: "auto"
  }
};
function rp(d, u) {
  let s = {};
  do
    for (var h = 1; h < d; h++)
      s[`${h}/${d}`] = Number((h / d * 100).toFixed(6)) + "%";
  while (++d <= u);
  return s;
}
function Hi(d, u, s = 0) {
  let h = {};
  for (; s <= d; s = 2 * s || 1)
    h[s] = s + u;
  return h;
}
function Si(d, u = "", s = 1, h = 0, g = 1, w = {}) {
  for (; h <= d; h += g)
    w[h] = h / s + u;
  return w;
}
function ct(d) {
  return ({ theme: u }) => u(d);
}
let EA = {
  /*
  1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
  2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
  */
  "*,::before,::after": {
    boxSizing: "border-box",
    /* 1 */
    borderWidth: "0",
    /* 2 */
    borderStyle: "solid",
    /* 2 */
    borderColor: "theme(borderColor.DEFAULT, currentColor)"
  },
  /* 2 */
  "::before,::after": {
    "--tw-content": "''"
  },
  /*
  1. Use a consistent sensible line-height in all browsers.
  2. Prevent adjustments of font size after orientation changes in iOS.
  3. Use a more readable tab size.
  4. Use the user's configured `sans` font-family by default.
  5. Use the user's configured `sans` font-feature-settings by default.
  */
  html: {
    lineHeight: 1.5,
    /* 1 */
    WebkitTextSizeAdjust: "100%",
    /* 2 */
    MozTabSize: "4",
    /* 3 */
    tabSize: 4,
    /* 3 */
    fontFamily: `theme(fontFamily.sans, ${Dw.fontFamily.sans})`,
    /* 4 */
    fontFeatureSettings: "theme(fontFamily.sans[1].fontFeatureSettings, normal)"
  },
  /* 5 */
  /*
  1. Remove the margin in all browsers.
  2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
  */
  body: {
    margin: "0",
    /* 1 */
    lineHeight: "inherit"
  },
  /* 2 */
  /*
  1. Add the correct height in Firefox.
  2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
  3. Ensure horizontal rules are visible by default.
  */
  hr: {
    height: "0",
    /* 1 */
    color: "inherit",
    /* 2 */
    borderTopWidth: "1px"
  },
  /* 3 */
  /*
  Add the correct text decoration in Chrome, Edge, and Safari.
  */
  "abbr:where([title])": {
    textDecoration: "underline dotted"
  },
  /*
  Remove the default font size and weight for headings.
  */
  "h1,h2,h3,h4,h5,h6": {
    fontSize: "inherit",
    fontWeight: "inherit"
  },
  /*
  Reset links to optimize for opt-in styling instead of opt-out.
  */
  a: {
    color: "inherit",
    textDecoration: "inherit"
  },
  /*
  Add the correct font weight in Edge and Safari.
  */
  "b,strong": {
    fontWeight: "bolder"
  },
  /*
  1. Use the user's configured `mono` font family by default.
  2. Use the user's configured `mono` font-feature-settings by default.
  3. Correct the odd `em` font sizing in all browsers.
  */
  "code,kbd,samp,pre": {
    fontFamily: `theme(fontFamily.mono, ${Dw.fontFamily.mono})`,
    fontFeatureSettings: "theme(fontFamily.mono[1].fontFeatureSettings, normal)",
    fontSize: "1em"
  },
  /*
  Add the correct font size in all browsers.
  */
  small: {
    fontSize: "80%"
  },
  /*
  Prevent `sub` and `sup` elements from affecting the line height in all browsers.
  */
  "sub,sup": {
    fontSize: "75%",
    lineHeight: 0,
    position: "relative",
    verticalAlign: "baseline"
  },
  sub: {
    bottom: "-0.25em"
  },
  sup: {
    top: "-0.5em"
  },
  /*
  1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
  2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
  3. Remove gaps between table borders by default.
  */
  table: {
    textIndent: "0",
    /* 1 */
    borderColor: "inherit",
    /* 2 */
    borderCollapse: "collapse"
  },
  /* 3 */
  /*
  1. Change the font styles in all browsers.
  2. Remove the margin in Firefox and Safari.
  3. Remove default padding in all browsers.
  */
  "button,input,optgroup,select,textarea": {
    fontFamily: "inherit",
    /* 1 */
    fontSize: "100%",
    /* 1 */
    lineHeight: "inherit",
    /* 1 */
    color: "inherit",
    /* 1 */
    margin: "0",
    /* 2 */
    padding: "0"
  },
  /* 3 */
  /*
  Remove the inheritance of text transform in Edge and Firefox.
  */
  "button,select": {
    textTransform: "none"
  },
  /*
  1. Correct the inability to style clickable types in iOS and Safari.
  2. Remove default button styles.
  */
  "button,[type='button'],[type='reset'],[type='submit']": {
    WebkitAppearance: "button",
    /* 1 */
    backgroundColor: "transparent",
    /* 2 */
    backgroundImage: "none"
  },
  /* 4 */
  /*
  Use the modern Firefox focus style for all focusable elements.
  */
  ":-moz-focusring": {
    outline: "auto"
  },
  /*
  Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
  */
  ":-moz-ui-invalid": {
    boxShadow: "none"
  },
  /*
  Add the correct vertical alignment in Chrome and Firefox.
  */
  progress: {
    verticalAlign: "baseline"
  },
  /*
  Correct the cursor style of increment and decrement buttons in Safari.
  */
  "::-webkit-inner-spin-button,::-webkit-outer-spin-button": {
    height: "auto"
  },
  /*
  1. Correct the odd appearance in Chrome and Safari.
  2. Correct the outline style in Safari.
  */
  "[type='search']": {
    WebkitAppearance: "textfield",
    /* 1 */
    outlineOffset: "-2px"
  },
  /* 2 */
  /*
  Remove the inner padding in Chrome and Safari on macOS.
  */
  "::-webkit-search-decoration": {
    WebkitAppearance: "none"
  },
  /*
  1. Correct the inability to style clickable types in iOS and Safari.
  2. Change font properties to `inherit` in Safari.
  */
  "::-webkit-file-upload-button": {
    WebkitAppearance: "button",
    /* 1 */
    font: "inherit"
  },
  /* 2 */
  /*
  Add the correct display in Chrome and Safari.
  */
  summary: {
    display: "list-item"
  },
  /*
  Removes the default spacing and border for appropriate elements.
  */
  "blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre": {
    margin: "0"
  },
  fieldset: {
    margin: "0",
    padding: "0"
  },
  legend: {
    padding: "0"
  },
  "ol,ul,menu": {
    listStyle: "none",
    margin: "0",
    padding: "0"
  },
  /*
  Prevent resizing textareas horizontally by default.
  */
  textarea: {
    resize: "vertical"
  },
  /*
  1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
  2. Set the default placeholder color to the user's configured gray 400 color.
  */
  "input::placeholder,textarea::placeholder": {
    opacity: 1,
    /* 1 */
    color: "theme(colors.gray.400, #9ca3af)"
  },
  /* 2 */
  /*
  Set the default cursor for buttons.
  */
  'button,[role="button"]': {
    cursor: "pointer"
  },
  /*
  Make sure disabled buttons don't get the pointer cursor.
  */
  ":disabled": {
    cursor: "default"
  },
  /*
  1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)
  2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
    This can trigger a poorly considered lint error in some tools but is included by design.
  */
  "img,svg,video,canvas,audio,iframe,embed,object": {
    display: "block",
    /* 1 */
    verticalAlign: "middle"
  },
  /* 2 */
  /*
  Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
  */
  "img,video": {
    maxWidth: "100%",
    height: "auto"
  },
  /* Make elements with the HTML hidden attribute stay hidden by default */
  "[hidden]": {
    display: "none"
  }
}, _A = [
  /* arbitrary properties: [paint-order:markers] */
  ne("\\[([-\\w]+):(.+)]", ({ 1: d, 2: u }, s) => ({
    "@layer overrides": {
      "&": {
        [d]: uu(`[${u}]`, "", s)
      }
    }
  })),
  /* Styling based on parent and peer state */
  ne("(group|peer)([~/][^-[]+)?", ({ input: d }, { h: u }) => [
    {
      c: u(d)
    }
  ]),
  /* LAYOUT */
  oe("aspect-", "aspectRatio"),
  ne("container", (d, { theme: u }) => {
    let { screens: s = u("screens"), center: h, padding: g } = u("container"), w = {
      width: "100%",
      marginRight: h && "auto",
      marginLeft: h && "auto",
      ...m("xs")
    };
    for (let _ in s) {
      let C = s[_];
      typeof C == "string" && (w[Fw(C)] = {
        "&": {
          maxWidth: C,
          ...m(_)
        }
      });
    }
    return w;
    function m(_) {
      let C = g && (typeof g == "string" ? g : g[_] || g.DEFAULT);
      if (C)
        return {
          paddingRight: C,
          paddingLeft: C
        };
    }
  }),
  // Content
  oe("content-", "content", ({ _: d }) => ({
    "--tw-content": d,
    content: "var(--tw-content)"
  })),
  // Box Decoration Break
  ne("(?:box-)?decoration-(slice|clone)", "boxDecorationBreak"),
  // Box Sizing
  ne("box-(border|content)", "boxSizing", ({ 1: d }) => d + "-box"),
  // Display
  ne("hidden", {
    display: "none"
  }),
  // Table Layout
  ne("table-(auto|fixed)", "tableLayout"),
  ne([
    "(block|flex|table|grid|inline|contents|flow-root|list-item)",
    "(inline-(block|flex|table|grid))",
    "(table-(caption|cell|column|row|(column|row|footer|header)-group))"
  ], "display"),
  // Floats
  "(float)-(left|right|none)",
  // Clear
  "(clear)-(left|right|none|both)",
  // Overflow
  "(overflow(?:-[xy])?)-(auto|hidden|clip|visible|scroll)",
  // Isolation
  "(isolation)-(auto)",
  // Isolation
  ne("isolate", "isolation"),
  // Object Fit
  ne("object-(contain|cover|fill|none|scale-down)", "objectFit"),
  // Object Position
  oe("object-", "objectPosition"),
  ne("object-(top|bottom|center|(left|right)(-(top|bottom))?)", "objectPosition", Sy),
  // Overscroll Behavior
  ne("overscroll(-[xy])?-(auto|contain|none)", ({ 1: d = "", 2: u }) => ({
    ["overscroll-behavior" + d]: u
  })),
  // Position
  ne("(static|fixed|absolute|relative|sticky)", "position"),
  // Top / Right / Bottom / Left
  oe("-?inset(-[xy])?(?:$|-)", "inset", ({ 1: d, _: u }) => ({
    top: d != "-x" && u,
    right: d != "-y" && u,
    bottom: d != "-x" && u,
    left: d != "-y" && u
  })),
  oe("-?(top|bottom|left|right)(?:$|-)", "inset"),
  // Visibility
  ne("(visible|collapse)", "visibility"),
  ne("invisible", {
    visibility: "hidden"
  }),
  // Z-Index
  oe("-?z-", "zIndex"),
  /* FLEXBOX */
  // Flex Direction
  ne("flex-((row|col)(-reverse)?)", "flexDirection", K_),
  ne("flex-(wrap|wrap-reverse|nowrap)", "flexWrap"),
  oe("(flex-(?:grow|shrink))(?:$|-)"),
  /*, 'flex-grow' | flex-shrink */
  oe("(flex)-"),
  /*, 'flex' */
  oe("grow(?:$|-)", "flexGrow"),
  oe("shrink(?:$|-)", "flexShrink"),
  oe("basis-", "flexBasis"),
  oe("-?(order)-"),
  /*, 'order' */
  "-?(order)-(\\d+)",
  /* GRID */
  // Grid Template Columns
  oe("grid-cols-", "gridTemplateColumns"),
  ne("grid-cols-(\\d+)", "gridTemplateColumns", eC),
  // Grid Column Start / End
  oe("col-", "gridColumn"),
  ne("col-(span)-(\\d+)", "gridColumn", Z_),
  oe("col-start-", "gridColumnStart"),
  ne("col-start-(auto|\\d+)", "gridColumnStart"),
  oe("col-end-", "gridColumnEnd"),
  ne("col-end-(auto|\\d+)", "gridColumnEnd"),
  // Grid Template Rows
  oe("grid-rows-", "gridTemplateRows"),
  ne("grid-rows-(\\d+)", "gridTemplateRows", eC),
  // Grid Row Start / End
  oe("row-", "gridRow"),
  ne("row-(span)-(\\d+)", "gridRow", Z_),
  oe("row-start-", "gridRowStart"),
  ne("row-start-(auto|\\d+)", "gridRowStart"),
  oe("row-end-", "gridRowEnd"),
  ne("row-end-(auto|\\d+)", "gridRowEnd"),
  // Grid Auto Flow
  ne("grid-flow-((row|col)(-dense)?)", "gridAutoFlow", (d) => Sy(K_(d))),
  ne("grid-flow-(dense)", "gridAutoFlow"),
  // Grid Auto Columns
  oe("auto-cols-", "gridAutoColumns"),
  // Grid Auto Rows
  oe("auto-rows-", "gridAutoRows"),
  // Gap
  oe("gap-x(?:$|-)", "gap", "columnGap"),
  oe("gap-y(?:$|-)", "gap", "rowGap"),
  oe("gap(?:$|-)", "gap"),
  /* BOX ALIGNMENT */
  // Justify Items
  // Justify Self
  "(justify-(?:items|self))-",
  // Justify Content
  ne("justify-", "justifyContent", J_),
  // Align Content
  // Align Items
  // Align Self
  ne("(content|items|self)-", (d) => ({
    ["align-" + d[1]]: J_(d)
  })),
  // Place Content
  // Place Items
  // Place Self
  ne("(place-(content|items|self))-", ({ 1: d, $$: u }) => ({
    [d]: ("wun".includes(u[3]) ? "space-" : "") + u
  })),
  /* SPACING */
  // Padding
  oe("p([xytrbl])?(?:$|-)", "padding", Of("padding")),
  // Margin
  oe("-?m([xytrbl])?(?:$|-)", "margin", Of("margin")),
  // Space Between
  oe("-?space-(x|y)(?:$|-)", "space", ({ 1: d, _: u }) => ({
    "&>:not([hidden])~:not([hidden])": {
      [`--tw-space-${d}-reverse`]: "0",
      ["margin-" + {
        y: "top",
        x: "left"
      }[d]]: `calc(${u} * calc(1 - var(--tw-space-${d}-reverse)))`,
      ["margin-" + {
        y: "bottom",
        x: "right"
      }[d]]: `calc(${u} * var(--tw-space-${d}-reverse))`
    }
  })),
  ne("space-(x|y)-reverse", ({ 1: d }) => ({
    "&>:not([hidden])~:not([hidden])": {
      [`--tw-space-${d}-reverse`]: "1"
    }
  })),
  /* SIZING */
  // Width
  oe("w-", "width"),
  // Min-Width
  oe("min-w-", "minWidth"),
  // Max-Width
  oe("max-w-", "maxWidth"),
  // Height
  oe("h-", "height"),
  // Min-Height
  oe("min-h-", "minHeight"),
  // Max-Height
  oe("max-h-", "maxHeight"),
  /* TYPOGRAPHY */
  // Font Weight
  oe("font-", "fontWeight"),
  // Font Family
  oe("font-", "fontFamily", ({ _: d }) => typeof (d = jt(d))[1] == "string" ? {
    fontFamily: ga(d)
  } : {
    fontFamily: ga(d[0]),
    ...d[1]
  }),
  // Font Smoothing
  ne("antialiased", {
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale"
  }),
  ne("subpixel-antialiased", {
    WebkitFontSmoothing: "auto",
    MozOsxFontSmoothing: "auto"
  }),
  // Font Style
  ne("italic", "fontStyle"),
  ne("not-italic", {
    fontStyle: "normal"
  }),
  // Font Variant Numeric
  ne("(ordinal|slashed-zero|(normal|lining|oldstyle|proportional|tabular)-nums|(diagonal|stacked)-fractions)", ({ 1: d, 2: u = "", 3: s }) => (
    // normal-nums
    u == "normal" ? {
      fontVariantNumeric: "normal"
    } : {
      ["--tw-" + (s ? (
        // diagonal-fractions, stacked-fractions
        "numeric-fraction"
      ) : "pt".includes(u[0]) ? (
        // proportional-nums, tabular-nums
        "numeric-spacing"
      ) : u ? (
        // lining-nums, oldstyle-nums
        "numeric-figure"
      ) : (
        // ordinal, slashed-zero
        d
      ))]: d,
      fontVariantNumeric: "var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)",
      ...iu({
        "--tw-ordinal": "var(--tw-empty,/*!*/ /*!*/)",
        "--tw-slashed-zero": "var(--tw-empty,/*!*/ /*!*/)",
        "--tw-numeric-figure": "var(--tw-empty,/*!*/ /*!*/)",
        "--tw-numeric-spacing": "var(--tw-empty,/*!*/ /*!*/)",
        "--tw-numeric-fraction": "var(--tw-empty,/*!*/ /*!*/)"
      })
    }
  )),
  // Letter Spacing
  oe("tracking-", "letterSpacing"),
  // Line Height
  oe("leading-", "lineHeight"),
  // List Style Position
  ne("list-(inside|outside)", "listStylePosition"),
  // List Style Type
  oe("list-", "listStyleType"),
  ne("list-", "listStyleType"),
  // Placeholder Opacity
  oe("placeholder-opacity-", "placeholderOpacity", ({ _: d }) => ({
    "&::placeholder": {
      "--tw-placeholder-opacity": d
    }
  })),
  // Placeholder Color
  Vn("placeholder-", {
    property: "color",
    selector: "&::placeholder"
  }),
  // Text Alignment
  ne("text-(left|center|right|justify|start|end)", "textAlign"),
  ne("text-(ellipsis|clip)", "textOverflow"),
  // Text Opacity
  oe("text-opacity-", "textOpacity", "--tw-text-opacity"),
  // Text Color
  Vn("text-", {
    property: "color"
  }),
  // Font Size
  oe("text-", "fontSize", ({ _: d }) => typeof d == "string" ? {
    fontSize: d
  } : {
    fontSize: d[0],
    ...typeof d[1] == "string" ? {
      lineHeight: d[1]
    } : d[1]
  }),
  // Text Indent
  oe("indent-", "textIndent"),
  // Text Decoration
  ne("(overline|underline|line-through)", "textDecorationLine"),
  ne("no-underline", {
    textDecorationLine: "none"
  }),
  // Text Underline offset
  oe("underline-offset-", "textUnderlineOffset"),
  // Text Decoration Color
  Vn("decoration-", {
    section: "textDecorationColor",
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  // Text Decoration Thickness
  oe("decoration-", "textDecorationThickness"),
  // Text Decoration Style
  ne("decoration-", "textDecorationStyle"),
  // Text Transform
  ne("(uppercase|lowercase|capitalize)", "textTransform"),
  ne("normal-case", {
    textTransform: "none"
  }),
  // Text Overflow
  ne("truncate", {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  }),
  // Vertical Alignment
  ne("align-", "verticalAlign"),
  // Whitespace
  ne("whitespace-", "whiteSpace"),
  // Word Break
  ne("break-normal", {
    wordBreak: "normal",
    overflowWrap: "normal"
  }),
  ne("break-words", {
    overflowWrap: "break-word"
  }),
  ne("break-all", {
    wordBreak: "break-all"
  }),
  ne("break-keep", {
    wordBreak: "keep-all"
  }),
  // Caret Color
  Vn("caret-", {
    // section: 'caretColor',
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  // Accent Color
  Vn("accent-", {
    // section: 'accentColor',
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  // Gradient Color Stops
  ne("bg-gradient-to-([trbl]|[tb][rl])", "backgroundImage", ({ 1: d }) => `linear-gradient(to ${Ts(d, " ")},var(--tw-gradient-stops))`),
  Vn("from-", {
    section: "gradientColorStops",
    opacityVariable: !1,
    opacitySection: "opacity"
  }, ({ _: d }) => ({
    "--tw-gradient-from": d.value,
    "--tw-gradient-to": d.color({
      opacityValue: "0"
    }),
    "--tw-gradient-stops": "var(--tw-gradient-from),var(--tw-gradient-to)"
  })),
  Vn("via-", {
    section: "gradientColorStops",
    opacityVariable: !1,
    opacitySection: "opacity"
  }, ({ _: d }) => ({
    "--tw-gradient-to": d.color({
      opacityValue: "0"
    }),
    "--tw-gradient-stops": `var(--tw-gradient-from),${d.value},var(--tw-gradient-to)`
  })),
  Vn("to-", {
    section: "gradientColorStops",
    property: "--tw-gradient-to",
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  /* BACKGROUNDS */
  // Background Attachment
  ne("bg-(fixed|local|scroll)", "backgroundAttachment"),
  // Background Origin
  ne("bg-origin-(border|padding|content)", "backgroundOrigin", ({ 1: d }) => d + "-box"),
  // Background Repeat
  ne([
    "bg-(no-repeat|repeat(-[xy])?)",
    "bg-repeat-(round|space)"
  ], "backgroundRepeat"),
  // Background Blend Mode
  ne("bg-blend-", "backgroundBlendMode"),
  // Background Clip
  ne("bg-clip-(border|padding|content|text)", "backgroundClip", ({ 1: d }) => d + (d == "text" ? "" : "-box")),
  // Background Opacity
  oe("bg-opacity-", "backgroundOpacity", "--tw-bg-opacity"),
  // Background Color
  // bg-${backgroundColor}/${backgroundOpacity}
  Vn("bg-", {
    section: "backgroundColor"
  }),
  // Background Image
  // supported arbitrary types are: length, color, angle, list
  oe("bg-", "backgroundImage"),
  // Background Position
  oe("bg-", "backgroundPosition"),
  ne("bg-(top|bottom|center|(left|right)(-(top|bottom))?)", "backgroundPosition", Sy),
  // Background Size
  oe("bg-", "backgroundSize"),
  /* BORDERS */
  // Border Radius
  oe("rounded(?:$|-)", "borderRadius"),
  oe("rounded-([trbl]|[tb][rl])(?:$|-)", "borderRadius", ({ 1: d, _: u }) => {
    let s = {
      t: [
        "tl",
        "tr"
      ],
      r: [
        "tr",
        "br"
      ],
      b: [
        "bl",
        "br"
      ],
      l: [
        "bl",
        "tl"
      ]
    }[d] || [
        d,
        d
      ];
    return {
      [`border-${Ts(s[0])}-radius`]: u,
      [`border-${Ts(s[1])}-radius`]: u
    };
  }),
  // Border Collapse
  ne("border-(collapse|separate)", "borderCollapse"),
  // Border Opacity
  oe("border-opacity(?:$|-)", "borderOpacity", "--tw-border-opacity"),
  // Border Style
  ne("border-(solid|dashed|dotted|double|none)", "borderStyle"),
  // Border Spacing
  oe("border-spacing(-[xy])?(?:$|-)", "borderSpacing", ({ 1: d, _: u }) => ({
    ...iu({
      "--tw-border-spacing-x": "0",
      "--tw-border-spacing-y": "0"
    }),
    ["--tw-border-spacing" + (d || "-x")]: u,
    ["--tw-border-spacing" + (d || "-y")]: u,
    "border-spacing": "var(--tw-border-spacing-x) var(--tw-border-spacing-y)"
  })),
  // Border Color
  Vn("border-([xytrbl])-", {
    section: "borderColor"
  }, Of("border", "Color")),
  Vn("border-"),
  // Border Width
  oe("border-([xytrbl])(?:$|-)", "borderWidth", Of("border", "Width")),
  oe("border(?:$|-)", "borderWidth"),
  // Divide Opacity
  oe("divide-opacity(?:$|-)", "divideOpacity", ({ _: d }) => ({
    "&>:not([hidden])~:not([hidden])": {
      "--tw-divide-opacity": d
    }
  })),
  // Divide Style
  ne("divide-(solid|dashed|dotted|double|none)", ({ 1: d }) => ({
    "&>:not([hidden])~:not([hidden])": {
      borderStyle: d
    }
  })),
  // Divide Width
  ne("divide-([xy]-reverse)", ({ 1: d }) => ({
    "&>:not([hidden])~:not([hidden])": {
      ["--tw-divide-" + d]: "1"
    }
  })),
  oe("divide-([xy])(?:$|-)", "divideWidth", ({ 1: d, _: u }) => {
    let s = {
      x: "lr",
      y: "tb"
    }[d];
    return {
      "&>:not([hidden])~:not([hidden])": {
        [`--tw-divide-${d}-reverse`]: "0",
        [`border-${Ts(s[0])}Width`]: `calc(${u} * calc(1 - var(--tw-divide-${d}-reverse)))`,
        [`border-${Ts(s[1])}Width`]: `calc(${u} * var(--tw-divide-${d}-reverse))`
      }
    };
  }),
  // Divide Color
  Vn("divide-", {
    // section: $0.replace('-', 'Color') -> 'divideColor'
    property: "borderColor",
    // opacityVariable: '--tw-border-opacity',
    // opacitySection: section.replace('Color', 'Opacity') -> 'divideOpacity'
    selector: "&>:not([hidden])~:not([hidden])"
  }),
  // Ring Offset Opacity
  oe("ring-opacity(?:$|-)", "ringOpacity", "--tw-ring-opacity"),
  // Ring Offset Color
  Vn("ring-offset-", {
    // section: 'ringOffsetColor',
    property: "--tw-ring-offset-color",
    opacityVariable: !1
  }),
  // opacitySection: section.replace('Color', 'Opacity') -> 'ringOffsetOpacity'
  // Ring Offset Width
  oe("ring-offset(?:$|-)", "ringOffsetWidth", "--tw-ring-offset-width"),
  // Ring Inset
  ne("ring-inset", {
    "--tw-ring-inset": "inset"
  }),
  // Ring Color
  Vn("ring-", {
    // section: 'ringColor',
    property: "--tw-ring-color"
  }),
  // opacityVariable: '--tw-ring-opacity',
  // opacitySection: section.replace('Color', 'Opacity') -> 'ringOpacity'
  // Ring Width
  oe("ring(?:$|-)", "ringWidth", ({ _: d }, { theme: u }) => ({
    ...iu({
      "--tw-ring-offset-shadow": "0 0 #0000",
      "--tw-ring-shadow": "0 0 #0000",
      "--tw-shadow": "0 0 #0000",
      "--tw-shadow-colored": "0 0 #0000",
      // Within own declaration to have the defaults above to be merged with defaults from shadow
      "&": {
        "--tw-ring-inset": "var(--tw-empty,/*!*/ /*!*/)",
        "--tw-ring-offset-width": u("ringOffsetWidth", "", "0px"),
        "--tw-ring-offset-color": lu(u("ringOffsetColor", "", "#fff")),
        "--tw-ring-color": lu(u("ringColor", "", "#93c5fd"), {
          opacityVariable: "--tw-ring-opacity"
        }),
        "--tw-ring-opacity": u("ringOpacity", "", "0.5")
      }
    }),
    "--tw-ring-offset-shadow": "var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)",
    "--tw-ring-shadow": `var(--tw-ring-inset) 0 0 0 calc(${d} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
    boxShadow: "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)"
  })),
  /* EFFECTS */
  // Box Shadow Color
  Vn("shadow-", {
    section: "boxShadowColor",
    opacityVariable: !1,
    opacitySection: "opacity"
  }, ({ _: d }) => ({
    "--tw-shadow-color": d.value,
    "--tw-shadow": "var(--tw-shadow-colored)"
  })),
  // Box Shadow
  oe("shadow(?:$|-)", "boxShadow", ({ _: d }) => ({
    ...iu({
      "--tw-ring-offset-shadow": "0 0 #0000",
      "--tw-ring-shadow": "0 0 #0000",
      "--tw-shadow": "0 0 #0000",
      "--tw-shadow-colored": "0 0 #0000"
    }),
    "--tw-shadow": ga(d),
    // replace all colors with reference to --tw-shadow-colored
    // this matches colors after non-comma char (keyword, offset) before comma or the end
    "--tw-shadow-colored": ga(d).replace(/([^,]\s+)(?:#[a-f\d]+|(?:(?:hsl|rgb)a?|hwb|lab|lch|color|var)\(.+?\)|[a-z]+)(,|$)/g, "$1var(--tw-shadow-color)$2"),
    boxShadow: "var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)"
  })),
  // Opacity
  oe("(opacity)-"),
  /*, 'opacity' */
  // Mix Blend Mode
  ne("mix-blend-", "mixBlendMode"),
  /* FILTERS */
  ...X_(),
  ...X_("backdrop-"),
  /* TRANSITIONS AND ANIMATION */
  // Transition Property
  oe("transition(?:$|-)", "transitionProperty", (d, { theme: u }) => ({
    transitionProperty: ga(d),
    transitionTimingFunction: d._ == "none" ? void 0 : ga(u("transitionTimingFunction", "")),
    transitionDuration: d._ == "none" ? void 0 : ga(u("transitionDuration", ""))
  })),
  // Transition Duration
  oe("duration(?:$|-)", "transitionDuration", "transitionDuration", ga),
  // Transition Timing Function
  oe("ease(?:$|-)", "transitionTimingFunction", "transitionTimingFunction", ga),
  // Transition Delay
  oe("delay(?:$|-)", "transitionDelay", "transitionDelay", ga),
  oe("animate(?:$|-)", "animation", (d, { theme: u, h: s, e: h }) => {
    let g = ga(d), w = g.split(" "), m = u("keyframes", w[0]);
    return m ? {
      ["@keyframes " + (w[0] = h(s(w[0])))]: m,
      animation: w.join(" ")
    } : {
      animation: g
    };
  }),
  /* TRANSFORMS */
  // Transform
  "(transform)-(none)",
  ne("transform", Ow),
  ne("transform-(cpu|gpu)", ({ 1: d }) => ({
    "--tw-transform": xC(d == "gpu")
  })),
  // Scale
  oe("scale(-[xy])?-", "scale", ({ 1: d, _: u }) => ({
    ["--tw-scale" + (d || "-x")]: u,
    ["--tw-scale" + (d || "-y")]: u,
    ...Ow()
  })),
  // Rotate
  oe("-?(rotate)-", "rotate", gw),
  // Translate
  oe("-?(translate-[xy])-", "translate", gw),
  // Skew
  oe("-?(skew-[xy])-", "skew", gw),
  // Transform Origin
  ne("origin-(center|((top|bottom)(-(left|right))?)|left|right)", "transformOrigin", Sy),
  /* INTERACTIVITY */
  // Appearance
  "(appearance)-",
  // Columns
  oe("(columns)-"),
  /*, 'columns' */
  "(columns)-(\\d+)",
  // Break Before, After and Inside
  "(break-(?:before|after|inside))-",
  // Cursor
  oe("(cursor)-"),
  /*, 'cursor' */
  "(cursor)-",
  // Scroll Snap Type
  ne("snap-(none)", "scroll-snap-type"),
  ne("snap-(x|y|both)", ({ 1: d }) => ({
    ...iu({
      "--tw-scroll-snap-strictness": "proximity"
    }),
    "scroll-snap-type": d + " var(--tw-scroll-snap-strictness)"
  })),
  ne("snap-(mandatory|proximity)", "--tw-scroll-snap-strictness"),
  // Scroll Snap Align
  ne("snap-(?:(start|end|center)|align-(none))", "scroll-snap-align"),
  // Scroll Snap Stop
  ne("snap-(normal|always)", "scroll-snap-stop"),
  ne("scroll-(auto|smooth)", "scroll-behavior"),
  // Scroll Margin
  // Padding
  oe("scroll-p([xytrbl])?(?:$|-)", "padding", Of("scroll-padding")),
  // Margin
  oe("-?scroll-m([xytrbl])?(?:$|-)", "scroll-margin", Of("scroll-margin")),
  // Touch Action
  ne("touch-(auto|none|manipulation)", "touch-action"),
  ne("touch-(pinch-zoom|pan-(?:(x|left|right)|(y|up|down)))", ({ 1: d, 2: u, 3: s }) => ({
    ...iu({
      "--tw-pan-x": "var(--tw-empty,/*!*/ /*!*/)",
      "--tw-pan-y": "var(--tw-empty,/*!*/ /*!*/)",
      "--tw-pinch-zoom": "var(--tw-empty,/*!*/ /*!*/)",
      "--tw-touch-action": "var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)"
    }),
    // x, left, right -> pan-x
    // y, up, down -> pan-y
    // -> pinch-zoom
    [`--tw-${u ? "pan-x" : s ? "pan-y" : d}`]: d,
    "touch-action": "var(--tw-touch-action)"
  })),
  // Outline Style
  ne("outline-none", {
    outline: "2px solid transparent",
    "outline-offset": "2px"
  }),
  ne("outline", {
    outlineStyle: "solid"
  }),
  ne("outline-(dashed|dotted|double)", "outlineStyle"),
  // Outline Offset
  oe("-?(outline-offset)-"),
  /*, 'outlineOffset'*/
  // Outline Color
  Vn("outline-", {
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  // Outline Width
  oe("outline-", "outlineWidth"),
  // Pointer Events
  "(pointer-events)-",
  // Will Change
  oe("(will-change)-"),
  /*, 'willChange' */
  "(will-change)-",
  // Resize
  [
    "resize(?:-(none|x|y))?",
    "resize",
    ({ 1: d }) => ({
      x: "horizontal",
      y: "vertical"
    })[d] || d || "both"
  ],
  // User Select
  ne("select-(none|text|all|auto)", "userSelect"),
  /* SVG */
  // Fill, Stroke
  Vn("fill-", {
    section: "fill",
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  Vn("stroke-", {
    section: "stroke",
    opacityVariable: !1,
    opacitySection: "opacity"
  }),
  // Stroke Width
  oe("stroke-", "strokeWidth"),
  /* ACCESSIBILITY */
  // Screen Readers
  ne("sr-only", {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    clip: "rect(0,0,0,0)",
    borderWidth: "0"
  }),
  ne("not-sr-only", {
    position: "static",
    width: "auto",
    height: "auto",
    padding: "0",
    margin: "0",
    overflow: "visible",
    whiteSpace: "normal",
    clip: "auto"
  })
];
function Sy(d) {
  return (typeof d == "string" ? d : d[1]).replace(/-/g, " ").trim();
}
function K_(d) {
  return (typeof d == "string" ? d : d[1]).replace("col", "column");
}
function Ts(d, u = "-") {
  let s = [];
  for (let h of d)
    s.push({
      t: "top",
      r: "right",
      b: "bottom",
      l: "left"
    }[h]);
  return s.join(u);
}
function ga(d) {
  return d && "" + (d._ || d);
}
function J_({ $$: d }) {
  return ({
    // /* aut*/ o: '',
    /* sta*/
    r: (
      /*t*/
      "flex-"
    ),
    /* end*/
    "": "flex-",
    // /* cen*/ t /*er*/: '',
    /* bet*/
    w: (
      /*een*/
      "space-"
    ),
    /* aro*/
    u: (
      /*nd*/
      "space-"
    ),
    /* eve*/
    n: (
      /*ly*/
      "space-"
    )
  }[d[3] || ""] || "") + d;
}
function Of(d, u = "") {
  return ({ 1: s, _: h }) => {
    let g = {
      x: "lr",
      y: "tb"
    }[s] || s + s;
    return g ? {
      ...wy(d + "-" + Ts(g[0]) + u, h),
      ...wy(d + "-" + Ts(g[1]) + u, h)
    } : wy(d + u, h);
  };
}
function X_(d = "") {
  let u = [
    "blur",
    "brightness",
    "contrast",
    "grayscale",
    "hue-rotate",
    "invert",
    d && "opacity",
    "saturate",
    "sepia",
    !d && "drop-shadow"
  ].filter(Boolean), s = {};
  for (let h of u)
    s[`--tw-${d}${h}`] = "var(--tw-empty,/*!*/ /*!*/)";
  return s = {
    // move defaults
    ...iu(s),
    // add default filter which allows standalone usage
    [`${d}filter`]: u.map((h) => `var(--tw-${d}${h})`).join(" ")
  }, [
      `(${d}filter)-(none)`,
      ne(`${d}filter`, s),
      ...u.map((h) => oe(
        // hue-rotate can be negated
        `${h[0] == "h" ? "-?" : ""}(${d}${h})(?:$|-)`,
        h,
        ({ 1: g, _: w }) => ({
          [`--tw-${g}`]: jt(w).map((m) => `${h}(${m})`).join(" "),
          ...s
        })
      ))
    ];
}
function gw({ 1: d, _: u }) {
  return {
    ["--tw-" + d]: u,
    ...Ow()
  };
}
function Ow() {
  return {
    ...iu({
      "--tw-translate-x": "0",
      "--tw-translate-y": "0",
      "--tw-rotate": "0",
      "--tw-skew-x": "0",
      "--tw-skew-y": "0",
      "--tw-scale-x": "1",
      "--tw-scale-y": "1",
      "--tw-transform": xC()
    }),
    transform: "var(--tw-transform)"
  };
}
function xC(d) {
  return [
    d ? (
      // -gpu
      "translate3d(var(--tw-translate-x),var(--tw-translate-y),0)"
    ) : "translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y))",
    "rotate(var(--tw-rotate))",
    "skewX(var(--tw-skew-x))",
    "skewY(var(--tw-skew-y))",
    "scaleX(var(--tw-scale-x))",
    "scaleY(var(--tw-scale-y))"
  ].join(" ");
}
function Z_({ 1: d, 2: u }) {
  return `${d} ${u} / ${d} ${u}`;
}
function eC({ 1: d }) {
  return `repeat(${d},minmax(0,1fr))`;
}
function iu(d) {
  return {
    "@layer defaults": {
      "*,::before,::after": d,
      "::backdrop": d
    }
  };
}
let CA = [
  [
    "sticky",
    "@supports ((position: -webkit-sticky) or (position:sticky))"
  ],
  [
    "motion-reduce",
    "@media (prefers-reduced-motion:reduce)"
  ],
  [
    "motion-safe",
    "@media (prefers-reduced-motion:no-preference)"
  ],
  [
    "print",
    "@media print"
  ],
  [
    "(portrait|landscape)",
    ({ 1: d }) => `@media (orientation:${d})`
  ],
  [
    "contrast-(more|less)",
    ({ 1: d }) => `@media (prefers-contrast:${d})`
  ],
  [
    "(first-(letter|line)|placeholder|backdrop|before|after)",
    ({ 1: d }) => `&::${d}`
  ],
  [
    "(marker|selection)",
    ({ 1: d }) => `& *::${d},&::${d}`
  ],
  [
    "file",
    "&::file-selector-button"
  ],
  [
    "(first|last|only)",
    ({ 1: d }) => `&:${d}-child`
  ],
  [
    "even",
    "&:nth-child(2n)"
  ],
  [
    "odd",
    "&:nth-child(odd)"
  ],
  [
    "open",
    "&[open]"
  ],
  // All other pseudo classes are already supported by twind
  [
    "(aria|data)-",
    ({
      1: d,
      /* aria or data */
      $$: u
    }, s) => u && `&[${d}-${// aria-asc or data-checked -> from theme
    s.theme(d, u) || // aria-[...] or data-[...]
    uu(u, "", s) || // default handling
    `${u}="true"`}]`
  ],
  /* Styling based on parent and peer state */
  // Groups classes like: group-focus and group-hover
  // these need to add a marker selector with the pseudo class
  // => '.group:focus .group-focus:selector'
  [
    "((group|peer)(~[^-[]+)?)(-\\[(.+)]|[-[].+?)(\\/.+)?",
    ({ 2: d, 3: u = "", 4: s, 5: h = "", 6: g = u }, { e: w, h: m, v: _ }) => {
      let C = up(h) || (s[0] == "[" ? s : _(s.slice(1)));
      return `${(C.includes("&") ? C : "&" + C).replace(/&/g, `:merge(.${w(m(d + g))})`)}${d[0] == "p" ? "~" : " "}&`;
    }
  ],
  // direction variants
  [
    "(ltr|rtl)",
    ({ 1: d }) => `[dir="${d}"] &`
  ],
  [
    "supports-",
    ({ $$: d }, u) => {
      if (d && (d = u.theme("supports", d) || uu(d, "", u)), d)
        return d.includes(":") || (d += ":var(--tw)"), /^\w*\s*\(/.test(d) || (d = `(${d})`), // Chrome has a bug where `(condtion1)or(condition2)` is not valid
          // But `(condition1) or (condition2)` is supported.
          `@supports ${d.replace(/\b(and|or|not)\b/g, " $1 ").trim()}`;
    }
  ],
  [
    "max-",
    ({ $$: d }, u) => {
      if (d && (d = u.theme("screens", d) || uu(d, "", u)), typeof d == "string")
        return `@media not all and (min-width:${d})`;
    }
  ],
  [
    "min-",
    ({ $$: d }, u) => (d && (d = uu(d, "", u)), d && `@media (min-width:${d})`)
  ],
  // Arbitrary variants
  [
    /^\[(.+)]$/,
    ({ 1: d }) => /[&@]/.test(d) && up(d).replace(/[}]+$/, "").split("{")
  ]
];
function xA({ colors: d, disablePreflight: u } = {}) {
  return {
    // allow other preflight to run
    preflight: u ? void 0 : EA,
    theme: {
      ...Dw,
      colors: {
        inherit: "inherit",
        current: "currentColor",
        transparent: "transparent",
        black: "#000",
        white: "#fff",
        ...d
      }
    },
    variants: CA,
    rules: _A,
    finalize(s) {
      return (
        // automatically add `content: ''` to before and after so you don’t have to specify it unless you want a different value
        // ignore global, preflight, and auto added rules
        s.n && // only if there are declarations
          s.d && // and it has a ::before or ::after selector
          s.r.some((h) => /^&::(before|after)$/.test(h)) && // there is no content property yet
          !/(^|;)content:/.test(s.d) ? {
          ...s,
          d: "content:var(--tw-content);" + s.d
        } : s
      );
    }
  };
}
let TA = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a"
}, RA = {
  50: "#f9fafb",
  100: "#f3f4f6",
  200: "#e5e7eb",
  300: "#d1d5db",
  400: "#9ca3af",
  500: "#6b7280",
  600: "#4b5563",
  700: "#374151",
  800: "#1f2937",
  900: "#111827"
}, kA = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  500: "#71717a",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b"
}, DA = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#e5e5e5",
  300: "#d4d4d4",
  400: "#a3a3a3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717"
}, OA = {
  50: "#fafaf9",
  100: "#f5f5f4",
  200: "#e7e5e4",
  300: "#d6d3d1",
  400: "#a8a29e",
  500: "#78716c",
  600: "#57534e",
  700: "#44403c",
  800: "#292524",
  900: "#1c1917"
}, LA = {
  50: "#fef2f2",
  100: "#fee2e2",
  200: "#fecaca",
  300: "#fca5a5",
  400: "#f87171",
  500: "#ef4444",
  600: "#dc2626",
  700: "#b91c1c",
  800: "#991b1b",
  900: "#7f1d1d"
}, AA = {
  50: "#fff7ed",
  100: "#ffedd5",
  200: "#fed7aa",
  300: "#fdba74",
  400: "#fb923c",
  500: "#f97316",
  600: "#ea580c",
  700: "#c2410c",
  800: "#9a3412",
  900: "#7c2d12"
}, MA = {
  50: "#fffbeb",
  100: "#fef3c7",
  200: "#fde68a",
  300: "#fcd34d",
  400: "#fbbf24",
  500: "#f59e0b",
  600: "#d97706",
  700: "#b45309",
  800: "#92400e",
  900: "#78350f"
}, UA = {
  50: "#fefce8",
  100: "#fef9c3",
  200: "#fef08a",
  300: "#fde047",
  400: "#facc15",
  500: "#eab308",
  600: "#ca8a04",
  700: "#a16207",
  800: "#854d0e",
  900: "#713f12"
}, NA = {
  50: "#f7fee7",
  100: "#ecfccb",
  200: "#d9f99d",
  300: "#bef264",
  400: "#a3e635",
  500: "#84cc16",
  600: "#65a30d",
  700: "#4d7c0f",
  800: "#3f6212",
  900: "#365314"
}, zA = {
  50: "#f0fdf4",
  100: "#dcfce7",
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e",
  600: "#16a34a",
  700: "#15803d",
  800: "#166534",
  900: "#14532d"
}, jA = {
  50: "#ecfdf5",
  100: "#d1fae5",
  200: "#a7f3d0",
  300: "#6ee7b7",
  400: "#34d399",
  500: "#10b981",
  600: "#059669",
  700: "#047857",
  800: "#065f46",
  900: "#064e3b"
}, FA = {
  50: "#f0fdfa",
  100: "#ccfbf1",
  200: "#99f6e4",
  300: "#5eead4",
  400: "#2dd4bf",
  500: "#14b8a6",
  600: "#0d9488",
  700: "#0f766e",
  800: "#115e59",
  900: "#134e4a"
}, $A = {
  50: "#ecfeff",
  100: "#cffafe",
  200: "#a5f3fc",
  300: "#67e8f9",
  400: "#22d3ee",
  500: "#06b6d4",
  600: "#0891b2",
  700: "#0e7490",
  800: "#155e75",
  900: "#164e63"
}, HA = {
  50: "#f0f9ff",
  100: "#e0f2fe",
  200: "#bae6fd",
  300: "#7dd3fc",
  400: "#38bdf8",
  500: "#0ea5e9",
  600: "#0284c7",
  700: "#0369a1",
  800: "#075985",
  900: "#0c4a6e"
}, PA = {
  50: "#eff6ff",
  100: "#dbeafe",
  200: "#bfdbfe",
  300: "#93c5fd",
  400: "#60a5fa",
  500: "#3b82f6",
  600: "#2563eb",
  700: "#1d4ed8",
  800: "#1e40af",
  900: "#1e3a8a"
}, VA = {
  50: "#eef2ff",
  100: "#e0e7ff",
  200: "#c7d2fe",
  300: "#a5b4fc",
  400: "#818cf8",
  500: "#6366f1",
  600: "#4f46e5",
  700: "#4338ca",
  800: "#3730a3",
  900: "#312e81"
}, BA = {
  50: "#f5f3ff",
  100: "#ede9fe",
  200: "#ddd6fe",
  300: "#c4b5fd",
  400: "#a78bfa",
  500: "#8b5cf6",
  600: "#7c3aed",
  700: "#6d28d9",
  800: "#5b21b6",
  900: "#4c1d95"
}, IA = {
  50: "#faf5ff",
  100: "#f3e8ff",
  200: "#e9d5ff",
  300: "#d8b4fe",
  400: "#c084fc",
  500: "#a855f7",
  600: "#9333ea",
  700: "#7e22ce",
  800: "#6b21a8",
  900: "#581c87"
}, YA = {
  50: "#fdf4ff",
  100: "#fae8ff",
  200: "#f5d0fe",
  300: "#f0abfc",
  400: "#e879f9",
  500: "#d946ef",
  600: "#c026d3",
  700: "#a21caf",
  800: "#86198f",
  900: "#701a75"
}, qA = {
  50: "#fdf2f8",
  100: "#fce7f3",
  200: "#fbcfe8",
  300: "#f9a8d4",
  400: "#f472b6",
  500: "#ec4899",
  600: "#db2777",
  700: "#be185d",
  800: "#9d174d",
  900: "#831843"
}, QA = {
  50: "#fff1f2",
  100: "#ffe4e6",
  200: "#fecdd3",
  300: "#fda4af",
  400: "#fb7185",
  500: "#f43f5e",
  600: "#e11d48",
  700: "#be123c",
  800: "#9f1239",
  900: "#881337"
}, GA = {
  __proto__: null,
  slate: TA,
  gray: RA,
  zinc: kA,
  neutral: DA,
  stone: OA,
  red: LA,
  orange: AA,
  amber: MA,
  yellow: UA,
  lime: NA,
  green: zA,
  emerald: jA,
  teal: FA,
  cyan: $A,
  sky: HA,
  blue: PA,
  indigo: VA,
  violet: BA,
  purple: IA,
  fuchsia: YA,
  pink: qA,
  rose: QA
};
function WA({ disablePreflight: d } = {}) {
  return xA({
    colors: GA,
    disablePreflight: d
  });
}
var KA = /* @__PURE__ */ new Map([["align-self", "-ms-grid-row-align"], ["color-adjust", "-webkit-print-color-adjust"], ["column-gap", "grid-column-gap"], ["forced-color-adjust", "-ms-high-contrast-adjust"], ["gap", "grid-gap"], ["grid-template-columns", "-ms-grid-columns"], ["grid-template-rows", "-ms-grid-rows"], ["justify-self", "-ms-grid-column-align"], ["margin-inline-end", "-webkit-margin-end"], ["margin-inline-start", "-webkit-margin-start"], ["mask-border", "-webkit-mask-box-image"], ["mask-border-outset", "-webkit-mask-box-image-outset"], ["mask-border-slice", "-webkit-mask-box-image-slice"], ["mask-border-source", "-webkit-mask-box-image-source"], ["mask-border-repeat", "-webkit-mask-box-image-repeat"], ["mask-border-width", "-webkit-mask-box-image-width"], ["overflow-wrap", "word-wrap"], ["padding-inline-end", "-webkit-padding-end"], ["padding-inline-start", "-webkit-padding-start"], ["print-color-adjust", "color-adjust"], ["row-gap", "grid-row-gap"], ["scroll-margin-bottom", "scroll-snap-margin-bottom"], ["scroll-margin-left", "scroll-snap-margin-left"], ["scroll-margin-right", "scroll-snap-margin-right"], ["scroll-margin-top", "scroll-snap-margin-top"], ["scroll-margin", "scroll-snap-margin"], ["text-combine-upright", "-ms-text-combine-horizontal"]]);
function JA(d) {
  return KA.get(d);
}
function XA(d) {
  var u = /^(?:(text-(?:decoration$|e|or|si)|back(?:ground-cl|d|f)|box-d|mask(?:$|-[ispro]|-cl)|pr|hyphena|flex-d)|(tab-|column(?!-s)|text-align-l)|(ap)|u|hy)/i.exec(d);
  return u ? u[1] ? 1 : u[2] ? 2 : u[3] ? 3 : 5 : 0;
}
function ZA(d, u) {
  var s = /^(?:(pos)|(cli)|(background-i)|(flex(?:$|-b)|(?:max-|min-)?(?:block-s|inl|he|widt))|dis)/i.exec(d);
  return s ? s[1] ? /^sti/i.test(u) ? 1 : 0 : s[2] ? /^pat/i.test(u) ? 1 : 0 : s[3] ? /^image-/i.test(u) ? 1 : 0 : s[4] ? u[3] === "-" ? 2 : 0 : /^(?:inline-)?grid$/i.test(u) ? 4 : 0 : 0;
}
let eM = [
  [
    "-webkit-",
    1
  ],
  // 0b001
  [
    "-moz-",
    2
  ],
  // 0b010
  [
    "-ms-",
    4
  ]
];
function tM() {
  return ({ stringify: d }) => ({
    stringify(u, s, h) {
      let g = "", w = JA(u);
      w && (g += d(w, s, h) + ";");
      let m = XA(u), _ = ZA(u, s);
      for (let C of eM)
        m & C[1] && (g += d(C[0] + u, s, h) + ";"), _ & C[1] && (g += d(u, C[0] + s, h) + ";");
      return g + d(u, s, h);
    }
  });
}
const nM = _C({
  darkMode: "class",
  presets: [tM(), WA(
    /* options */
  )]
  /* config */
}), TC = wA(new CSSStyleSheet()), rM = vA(nM, TC), cM = (d) => {
  const u = mO(null);
  return nC(() => {
    const s = u.current.attachShadow({ mode: "open" });
    s.adoptedStyleSheets = [TC.target], gA(rM, s);
    const h = document.createElement("div");
    return B_.render(/* @__PURE__ */ au(XL, { ...d }), h), s.appendChild(h), () => {
      B_.unmountComponentAtNode(h);
    };
  }, []), /* @__PURE__ */ au("div", { ref: u });
};
export {
  XL as I,
  sM as M,
  cM as a,
  ZL as g
};
