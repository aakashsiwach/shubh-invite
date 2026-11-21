/* Compact, backwards-compatible invitation link codec. */
(function () {
  "use strict";
  function toBase64Url(bytes) {
    var binary = "";
    for (var i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode.apply(null, bytes.subarray(i, Math.min(i + 0x8000, bytes.length)));
    return btoa(binary).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/, "");
  }
  function fromBase64Url(value) {
    var b64 = value.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    var binary = atob(b64), bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  async function transform(bytes, Constructor, format) {
    var stream = new Blob([bytes]).stream().pipeThrough(new Constructor(format));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  async function encode(value) {
    var bytes = new TextEncoder().encode(JSON.stringify(value));
    if (typeof CompressionStream === "function") {
      try {
        var compressed = await transform(bytes, CompressionStream, "deflate");
        if (compressed.length + 1 < bytes.length) return "z" + toBase64Url(compressed);
      } catch (e) {}
    }
    return "j" + toBase64Url(bytes);
  }
  async function decode(value) {
    if (value.charAt(0) === "z") {
      if (typeof DecompressionStream !== "function") throw new Error("Compressed invitation links need a modern browser.");
      var expanded = await transform(fromBase64Url(value.slice(1)), DecompressionStream, "deflate");
      return JSON.parse(new TextDecoder().decode(expanded));
    }
    var bytes = fromBase64Url(value.charAt(0) === "j" ? value.slice(1) : value);
    return JSON.parse(new TextDecoder().decode(bytes));
  }
  window.SHUBH_LINK_CODEC = { encode: encode, decode: decode };
})();