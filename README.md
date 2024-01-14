investigating https://github.com/vitejs/vite/issues/15143

```sh
# ok
node --experimental-network-imports repro-entry.js

# not ok
node --experimental-network-imports repro.js  # should work?
node repro-entry.js
node repro.js
```
