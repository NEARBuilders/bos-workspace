import { ensureDir, outputFile } from "@/lib/utils/fs";
import path from "path";

const templates = {
  "js-single-app": {
    "./bos.config.json": JSON.stringify({
      account: "bosworkspace",
    }),
    "./aliases.json": JSON.stringify({
      "name": "My App",
    }),
    "./module/hello.js": "const hello = () => `Welcome to @{alias/name}, @{config/account}!`; export { hello };",
    "./widget/home.metadata.json": JSON.stringify({
      name: "Hello",
      description: "Hello world widget",
    }),
    "./widget/home.tsx": "const { hello } = VM.require('@{module/hello/utils.ts}'); return hello();",
  }
};

// TODO: WIP
export async function initProject(pwd: string, template: keyof typeof templates = "js-single-app") {
  try {
    await Promise.all(Object.entries(templates[template]).map(async ([relativePath, content]) => {
      const fullPath = path.join(pwd, relativePath);

      const dir = path.dirname(fullPath);

      await ensureDir(dir);
      await outputFile(fullPath, content);
    }));

    console.log('Project initialization complete.');
  } catch (error) {
    console.error('Error during project initialization:', error);
  }
}
