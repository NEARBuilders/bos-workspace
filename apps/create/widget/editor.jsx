const path = props.path;

const data = props.data ?? {
  Doc1: {
    title: "",
    content: "Content of Doc1",
    children: {
      "Doc1.1": {
        title: "",
        content: "Content of Doc1.1",
        children: {
          "Doc1.1.1": {
            title: "",
            content: "Content of Doc1.1.1",
            children: {},
          },
        },
      },
      "Doc1.2": {
        title: "",
        content: "Content of Doc1.2",
        children: {},
      },
    },
  },
  Doc2: {
    title: "",
    content: "Content of Doc2",
    children: {},
  },
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
    <Widget
      src="/*__@appAccount__*//widget/editor.index"
      props={{ docs: state.docs, onChange: handleDocChange }}
    />
  </>
);
