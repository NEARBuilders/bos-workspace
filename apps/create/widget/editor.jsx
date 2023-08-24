

// TODO: get data from SocialDB using projectID
const data = {
  Doc1: {
    title: "",
    content: "Hello, World!",
  },
};

// TODO: get project from SocialDB using projectID
const project = {
  id: projectID,
  title: "Project 1",
  logo: "https://ipfs.near.social/ipfs/bafkreifjxdfynw6icgtagcgyhsgq5ounl7u45i2pa2xadiax2bpg7kt3hu",
  tags: ["tag", "docs"],
};

State.init({ docs: data });

/**
 * I'm trying to imagine this as the start of a plugin. 
 */


return (
  <>
    {/** <p>{JSON.stringify(state.docs)}</p> */}
    <Widget
      src="/*__@appAccount__*//widget/editor.index"
      props={{ docs: state.docs, onChange: handleDocChange, project }}
    />
  </>
);
