function Provider(props) {
  /*__@import:everything/utils/UUID__*/

  const Children = props.Children;

  const KEYS = {
    selectedDoc: (pid) => `selectedDoc/${pid}`,
    doc: (did) => `doc/${did}`,
    docs: (pid) => `docs/${pid}`,
  };

  const set = (k, v) => State.update({ [k]: v }); // because this is the only thing that makes this not a VM.require module
  const get = (k) => state[k]; // cuz modules don't manage state, but we don't need the provider to do this
  const store = (k, v) => Storage.privateSet(k, v); 
  const retrieve = (k) => Storage.privateGet(k);

  const setPath = (docs, path, value) => {
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
      docs[path[0]].children = setPath(
        docs[path[0]].children,
        path.slice(1),
        value
      );
      return docs;
    }
  };
  const getPath = (docs, path) => {
    return path.reduce((currentDoc, key, index) => {
      // If it's the last key in the path, return the document itself
      if (index === path.length - 1) {
        return currentDoc[key];
      }
      // Otherwise, navigate to the children of the current document
      return currentDoc[key].children;
    }, docs);
  };
  const didToPath = (docs, id) => {
    const path = [];
    const traverse = (docs, id) => {
      for (const key in docs) {
        if (key === id) {
          path.push(key);
          return true;
        }
        if (docs[key].children) {
          path.push(key);
          if (traverse(docs[key].children, id)) {
            return true;
          }
          path.pop();
        }
      }
      return false;
    };
    traverse(docs, id);
    return path;
  };
  const pathToObj = (path) => {
    const obj = {};
    path.reduce((currentObj, key, index) => {
      if (index === path.length - 1) {
        currentObj[key] = {};
      } else {
        currentObj[key] = {};
        return currentObj[key];
      }
    }, obj);
    return obj;
  };

  const handle = {
    document: {
      get: (pid, path) => {
        // TODO: get document from SocialDB, including children
        return {
          title: "Hello",
          content: "Hello, World!",
          children: {
            1: {
              title: "World",
              content: "Hello, World!",
              children: {
                2: {
                  title: "NEAR",
                  content: "Hello, World!",
                },
              },
            },
            2: {
              title: "NEAR",
              content: "Hello, World!",
            },
          },
        };
      },
      open: (pid, path) => {
        store(KEYS.selectedDoc(pid), path);
      },
      create: (pid, parentPath) => {
        const docs = retrieve(KEYS.docs(pid));

        const newKey = UUID.generate();
        let newPath; // This will store the path to the newly created document

        if (parentPath && parentPath.length) {
          newPath = [...parentPath, newKey];
        } else {
          newPath = [newKey];
        }

        // Update the docs structure in storage
        store(KEYS.docs(pid), setPath(docs, newPath, {}));

        // open the new document
        store(KEYS.selectedDoc(pid), newPath);
      },
      delete: (pid, path) => {
        const docs = retrieve(KEYS.docs(pid));

        // Update the docs in storage
        store(KEYS.docs(pid), setPath(docs, path, null));

        // If the deleted document is the selected document, clear the selected document
        if (path === retrieve(KEYS.selectedDoc(pid))) {
          store(KEYS.selectedDoc(pid), null);
        }
      },
      update: (pid, did, value) => {
        const doc = retrieve(KEYS.doc(did));

        // Update the doc content in storage
        store(KEYS.doc(did), { ...doc, ...value }); 
      },
      publish: (pid, did) => {
        const doc = retrieve(KEYS.doc(did));
        const docWithPath = pathToObj(didToPath(docs, did));

        // TODO: publish doc to SocialDB

        // Remove the doc from the doc storage
        store(KEYS.doc(did), null);
      },
    },
    project: {
      getAll: () => {
        // TODO: get projects from SocialDB
        return [
          {
            id: "project1",
            title: "Project 1",
            logo: "https://ipfs.near.social/ipfs/bafkreifjxdfynw6icgtagcgyhsgq5ounl7u45i2pa2xadiax2bpg7kt3hu",
            tags: ["tag", "docs"],
            template: "/*__@appAccount__*//widget/templates/default",
          },
          {
            id: "project2",
            title: "Project 2 NEAR BOS NDC EVERYTHING",
            tags: ["near", "bos"],
            logo: "https://near.org/_next/static/media/logo-black.2e682d59.svg",
            template: "/*__@appAccount__*//widget/templates/docs",
          },
        ];
      },
      get: (pid) => {
        // TODO: get project from SocialDB
        return {
          id: pid,
          title: "Project 1",
          logo: "https://ipfs.near.social/ipfs/bafkreifjxdfynw6icgtagcgyhsgq5ounl7u45i2pa2xadiax2bpg7kt3hu",
          tags: ["tag", "docs"],
          template: "/*__@appAccount__*//widget/templates/default",
        };
      },
      create: (project) => {
        const pid = UUID.generate();

        // TODO: publish project to SocialDB
      },
      delete: (pid) => {
        // TODO: delete project from SocialDB
      },
      update: (pid, project) => {
        // TODO: update project metadata in SocialDB
      },
    },
  };

  return <Children handle={handle} {...props} />;
}

return { Provider };
