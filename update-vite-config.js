import fs from 'fs';
let code = fs.readFileSync('vite.config.ts', 'utf8');

if (!code.includes('base:')) {
  code = code.replace(
    'export default defineConfig(() => {\n  return {',
    "export default defineConfig(() => {\n  return {\n    base: './',"
  );
  fs.writeFileSync('vite.config.ts', code);
  console.log("Updated vite.config.ts");
} else {
  console.log("base already set in vite.config.ts");
}
