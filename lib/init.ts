import { promises as fs } from "fs"
import path from "path";
import mvdir from "mvdir";
import prompts from "prompts";
import replace from "replace-in-file";
import slugify from "slugify";

export async function initProject(pwd: string, template: string) {
  const ts = template === "ts"
  const codebase = ts ? "ts" : "js";
  const res = await prompts([
    {
      type: "text",
      name: "app",
      message: "What NEAR AccountId deploys your project?",
    },
    {
      type: async (prev) =>
        (await hasDirectory(getDir(path.join(pwd, prev)))) ? "text" : null,
      name: "dir",
      message: async (prev) =>
        `Looks like a directory already exists called "${slugify(prev, {
          lower: true,
        })}". Where should your app be placed instead?`,
    },
  ]);

  const name = res.app.trim();
  const slug = slugify(name, { lower: true });
  const dir = res.dir || path.join(pwd, slug);
  const templateDir = path.join(__dirname, '..', '..', 'templates')
  try {
    await mvdir(path.resolve(templateDir, codebase), path.resolve(dir), { copy: true });
    await mvdir(path.resolve(dir, "_gitignore"), path.resolve(dir, ".gitignore"));

    await mvdir(path.resolve(dir, "_github"), path.resolve(dir, ".github"));

    const prefixPath = (p) => path.resolve(dir, p);

    // await mvdir(
    //   path.join(dir, "/%ACCOUNT_ID%"),
    //   path.join(dir, `/${name}`)
    // );

    await replace({
      files: [
        "README.md",
        `bos.config.json`,
        `widget/app.${ts ? "tsx" : "jsx"}`,
        `.github/workflows/release.yml`,
      ].map(prefixPath),
      from: /%ACCOUNT_ID%/g,
      to: name,
    });

    await replace({
      files: ["README.md", `bos.config.json`, "package.json"].map(
        prefixPath
      ),
      from: /%ACCOUNT_ID%/g,
      to: slug,
    });

    console.log('Project initialization complete.');
    console.log(`To get started, cd into the ${res.dir || slug} directory, then run:
    yarn install
    yarn dev`);
    console.log("Be the BOS!");
  } catch (err) {
    console.error(err);
    console.log(
      `Something went wrong when generating your app. You may need to delete the folder at ${dir}`
    );
  }
}

async function hasDirectory(dir) {
  try {
    await fs.access(dir);
    return true;
  } catch (err) {
    return false;
  }
}

function getDir(accountId) {
  const slug = slugify(accountId, { lower: true });
  return path.join(".", slug);
}
