const projectID = props.project;

if (!projectID) {
  return <div>Please specify a project ID</div>;
}

const handleUpdateProject = (new_project) => {};

// TODO: get project from SocialDB using projectID
const project = {
  id: projectID,
  title: "Project 1",
  logo: "https://ipfs.near.social/ipfs/bafkreifjxdfynw6icgtagcgyhsgq5ounl7u45i2pa2xadiax2bpg7kt3hu",
  tags: ["tag", "docs"],
  description: "This is a project description",
  templateSrc: "/*__@appAccount__*//widget/templates/default",
};

return (
  <Widget
    src="/*__@appAccount__*//widget/project.ui"
    props={{ project: project }}
  />
);
