function t(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var o = function () {
  throw new Error(
    "ws does not work in the browser. Browser clients must use the native WebSocket object"
  );
};
const r = /* @__PURE__ */ t(o), n = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: r
}, Symbol.toStringTag, { value: "Module" }));
export {
  n as b
};
