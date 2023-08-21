/*__@import:QoL/widget__*/

const handleCreateProject = (project) => {
  // TODO: Save project to SocialDB
  // Idk how to do this yet. project should have a unique ID, and the data needed
  console.log("handleCreateProject", project);
};

// TODO: Get projects from SocialDB
const projects = [
  {
    id: "132987",
    title: "Project 1",
    tags: ["tag", "docs"],
    logo: "https://ipfs.near.social/ipfs/bafkreifjxdfynw6icgtagcgyhsgq5ounl7u45i2pa2xadiax2bpg7kt3hu",
  },
  {
    id: "897980",
    title: "Project 2 NEAR BOS NDC EVERYTHING",
    tags: ["near", "bos"],
    logo: "https://near.org/_next/static/media/logo-black.2e682d59.svg",
  },
];

return widget("/*__@appAccount__*//widget/manager.ui", {
  handleCreateProject,
  projects,
});
