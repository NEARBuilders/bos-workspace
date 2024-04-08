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

const allRoutes = [];

// Iterate over sections
documentation.sections.forEach((section) => {
  const sectionPath = normalize(section.title);
  allRoutes.push({ path: sectionPath, title: section.title });

  // Iterate over subsections
  section.subsections.forEach((subsection) => {
    const subsectionPath = normalize(subsection.title);
    allRoutes.push({
      path: `${sectionPath}/${subsectionPath}`,
      title: subsection.title,
    });
  });
});

return (
  <div className="sidebar">
    {allRoutes.map((route) => (
      <Link to={`/${basePath}?${param}=${route.path}`} key={route.path}>
        <button className="button">{route.title}</button>
      </Link>
    ))}
  </div>
);
// return (
//   <div className="sidebar">
//     {routes.map((route) => {
//       const { path } = route;
//       if (path === "/") {
//         return (
//           <Link to={`/${basePath}`}>
//             <button className="button" key={path}>
//               home
//             </button>
//           </Link>
//         );
//       } else {
//         path = path.substring(1);
//         return (
//           <Link to={`/${basePath}?${param}=${path}`}>
//             <button className="button" key={path}>
//               {path}
//             </button>
//           </Link>
//         );
//       }
//     })}
//   </div>
// );
