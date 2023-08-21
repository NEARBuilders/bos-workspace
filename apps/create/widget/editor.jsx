const projectID = props.project;

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

const updateNestedDoc = (docs, path, value) => {
  if (path.length === 1) {
    if (value !== null) {
      const updatedDoc = {
        ...docs[path[0]],
        ...value,
      };
      return {
        ...docs,
        [path[0]]: updatedDoc,
      };
    } else {
      // We're deleting a document
      const remainingDocs = JSON.parse(JSON.stringify(docs));
      delete remainingDocs[path[0]];
      return remainingDocs;
    }
  } else {
    docs[path[0]].children = updateNestedDoc(
      docs[path[0]].children,
      path.slice(1),
      value
    );
    return docs;
  }
};

const handleDocChange = (path, value) => {
  const updatedDocs = updateNestedDoc({ ...state.docs }, path, value);
  State.update({
    docs: updatedDocs,
  });
};

return (
  <>
    {/** <p>{JSON.stringify(state.docs)}</p> */}
    <Widget
      src="/*__@appAccount__*//widget/editor.index"
      props={{ docs: state.docs, onChange: handleDocChange, project }}
    />
  </>
);
