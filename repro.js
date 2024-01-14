import * as vite from 'vite';

async function main() {
  const server = await vite.createServer({
    server: { middlewareMode: true },
  });

  const transformed = await server.transformRequest('repro-entry.js', {
    ssr: true,
  });
  console.log([`## transformRequest`]);
  console.log(transformed.code);

  console.log([`## ssrLoadModule`]);
  const mod = await server.ssrLoadModule('repro-entry.js');
  console.log(mod);

  await server.close();
}

main();
