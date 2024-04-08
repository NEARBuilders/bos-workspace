const { normalize } = VM.require("devhub.near/widget/core.lib.stringUtils") || {
  normalize: (str) => str,
};

const { basePath, param } = props;

const data = {
  "": JSON.stringify({
    title: "My Documentation",
    sections: [
      {
        title: "Getting Started",
        subsections: [
          {
            title: "Installation",
            content: "Instructions for installing the software.",
          },
          {
            title: "Setup",
            content: "Guidelines for setting up the environment.",
          },
        ],
      },
      {
        title: "Usage",
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

// Create a map to store paths and corresponding content
const contentMap = {};

// Iterate over sections
documentation.sections.forEach((section) => {
  const sectionPath = normalize(section.title);
  contentMap[sectionPath] = { title: section.title, content: section.content };

  // Iterate over subsections
  section.subsections.forEach((subsection) => {
    const subsectionPath = normalize(subsection.title);
    contentMap[`${sectionPath}/${subsectionPath}`] = { title: subsection.title, content: subsection.content };
  });
});

// Function to retrieve content based on path
const getContent = (path) => {
  return contentMap[path];
};

// Example usage:
const routePath = 'getting-started/setup'; // Example path
const content = getContent(routePath);

return <p>{JSON.stringify(content)}</p>