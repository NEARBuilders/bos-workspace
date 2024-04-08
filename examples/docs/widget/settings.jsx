const data = Social.get("${config_account}/project/main/**") || {
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

if (!data) {
  return <p>404 Not Found</p>;
}

const { metadata } = data;

return (
  <div>
    <h1>{metadata.title}</h1>
    <p>{metadata.description}</p>
  </div>
);
