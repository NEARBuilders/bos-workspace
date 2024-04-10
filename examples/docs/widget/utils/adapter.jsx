const { normalize } = VM.require("devhub.near/widget/core.lib.stringUtils") || {
  normalize: (str) => str,
};

const data = {
  "": JSON.stringify({
    title: "My Documentation",
    sections: [
      {
        title: "Getting Started",
        content: `
        ## Quickstart

        To begin, either [use this template repository](https://github.com/new?template_name=quickstart&template_owner=NEARBuilders) or install \`bos-workspace\` within an existing project:
        
        \`\`\`cmd
        yarn add -D bos-workspace
        \`\`\`
        
        Then, you can clone widgets from an existing [account](https://near.social/mob.near/widget/Everyone) via:
        
        \`\`\`bash
        bos-workspace clone [accountId]
        \`\`\`
        
        Or ensure the proper workspace [structure and usage](#usage).
        `,
        subsections: [
          {
            title: "Installation",
            content: "# Instructions for installing the software.",
          },
          {
            title: "Setup",
            content: "Guidelines for setting up the environment.",
          },
        ],
      },
      {
        title: "Usage",
        content: "Hello 2",
        subsections: [
          {
            title: "Basic Usage",
            content: "Instructions for basic usage.",
          },
          {
            title: "Advanced Usage",
            content: "Instructions for advanced usage.",
          },
        ],
      },
      {
        title: "Examples",
        content: "Hello 3",
        subsections: [
          {
            title: "Example 1",
            content: "Description and usage of Example 1.",
          },
          {
            title: "Example 2",
            content: "Description and usage of Example 2.",
          },
        ],
      },
    ],
  }),
  metadata: {
    name: "bos-workspace",
    description: `bos-workspace is a comprehensive toolset designed to simplify the
      development and deployment of NEAR components and applications. With
      support for hot reload, TypeScript, and multiple app management, it caters
      to developers looking for an efficient and scalable developer environment.`,
  },
};

const documentation = JSON.parse(data[""] || "null");

const contentMap = {};

// Iterate over sections and subsections to populate content map
documentation.sections.forEach((section) => {
  const sectionPath = normalize(section.title);
  contentMap[sectionPath] = { title: section.title, content: section.content };

  section.subsections.forEach((subsection) => {
    const subsectionPath = `${sectionPath}/${normalize(subsection.title)}`;
    contentMap[subsectionPath] = {
      title: subsection.title,
      content: subsection.content,
    };
  });
});

return {
  get: (path) => {
    if (path) {
      return contentMap[path];
    } else {
      return contentMap;
    }
  },
  create: (k, v) => {
    console.log("create");
  }
};
