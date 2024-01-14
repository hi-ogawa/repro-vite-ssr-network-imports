investigating https://github.com/vitejs/vite/issues/15143

```sh
$ node --version
v18.19.0

# ok
$ node --experimental-network-imports repro-entry.js
[react.version] 18.2.0

# not ok
$ node --experimental-network-imports repro.js  # should work?
$ node repro-entry.js
$ node repro.js
```

## without patch

```sh
$ node --experimental-network-imports repro.js
## transformRequest
const __vite_ssr_import_0__ = await __vite_ssr_import__("https://esm.sh/react@18.2.0", {"importedNames":["default"]});
console.log('[react.version]', __vite_ssr_import_0__.default.version);
__vite_ssr_exports__.default = __vite_ssr_import_0__.default.version;

## ssrLoadModule
[vite] Error when evaluating SSR module repro-entry.js: failed to import "https://esm.sh/react@18.2.0"
|- Error: Cannot find module 'https://esm.sh/react@18.2.0' imported from '/home/hiroshi/Downloads/repro-vite-ssr-network-imports/repro-entry.js'
    at nodeImport (file:///home/hiroshi/Downloads/repro-vite-ssr-network-imports/node_modules/.pnpm/vite@5.0.11/node_modules/vite/dist/node/chunks/dep-V3BH7oO1.js:50892:25)
    at ssrImport (file:///home/hiroshi/Downloads/repro-vite-ssr-network-imports/node_modules/.pnpm/vite@5.0.11/node_modules/vite/dist/node/chunks/dep-V3BH7oO1.js:50799:30)
    at ssrDynamicImport (file:///home/hiroshi/Downloads/repro-vite-ssr-network-imports/node_modules/.pnpm/vite@5.0.11/node_modules/vite/dist/node/chunks/dep-V3BH7oO1.js:50832:16)
    at eval (/home/hiroshi/Downloads/repro-vite-ssr-network-imports/repro-entry.js:3:34)
    at instantiateModule (file:///home/hiroshi/Downloads/repro-vite-ssr-network-imports/node_modules/.pnpm/vite@5.0.11/node_modules/vite/dist/node/chunks/dep-V3BH7oO1.js:50861:15)
```

## with patch

```sh
# with experimental flags
$ node --experimental-network-imports repro.js
...
[react.version] 18.2.0
{ default: '18.2.0', [Symbol(Symbol.toStringTag)]: 'Module' }

# without experimental flags
$ node repro.js
...
[vite] Error when evaluating SSR module repro-entry.js: failed to import "https://esm.sh/react@18.2.0"
|- Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only URLs with a scheme in: file, data, and node are supported by the default ESM loader. Received protocol 'https:'
    at new NodeError (node:internal/errors:405:5)
    ...
```

## build

```sh
$ npx vite build --ssr
$ cat dist/repro-entry.js
import react from "https://esm.sh/react@18.2.0";
console.log("[react.version]", react.version);
const reproEntry = react.version;
export {
  reproEntry as default
};
```
