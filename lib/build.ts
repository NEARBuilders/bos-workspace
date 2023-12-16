// - reads all the files in src 
//   - check for bos.config.js
//   - check for aliases.json
//   - check for ipfs.json
// - uploads the changed /ipfs/ files to ipfs
// - generate ipfs.json files
// - transpiles the js/jsx/ts/tsx files in /module/ and /widget/
// - generates data.json

// return a list of files that were written
export async function buildApp(src: string, dest: string, network?: string): Promise<string[]> {
  return [];
}
