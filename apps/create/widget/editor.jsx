const path = props.path;

// Thing
// Type
// Any custom
State.init({
  docs: {
    Doc1: {
      content: "Content of Doc1",
      children: {
        "Doc1.1": {
          content: "Content of Doc1.1",
          children: {
            "Doc1.1.1": {
              content: "Content of Doc1.1.1",
              children: {},
            },
          },
        },
        "Doc1.2": {
          content: "Content of Doc1.2",
          children: {},
        },
      },
    },
    Doc2: {
      content: "Content of Doc2",
      children: {},
    },
  },
});

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
      value,
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

const toggleExpand = () => {
  State.update({ isExpanded: !state.isExpanded });
};

function isJSON(str) {
  if (typeof str !== "string") {
    return false;
  }

  str = str.trim();
  return (
    (str.startsWith("{") && str.endsWith("}")) ||
    (str.startsWith("[") && str.endsWith("]"))
  );
}

return (
  <>
    <Widget src="/*__@appAccount__*//widget/ui.navbar" />

    <Widget
      src="/*__@appAccount__*//widget/editor.index"
      props={{ docs: state.docs, onChange: handleDocChange }}
    />
  </>
);
