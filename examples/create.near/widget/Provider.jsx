const UUID = {
  generate: (template) => {
    if (typeof template !== "string") {
      template = "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx";
    }
    return template.replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
};

/*__@import:everything/utils/UUID__*/

function filterByType(data, targetType) {
  return Object.keys(data || {}).reduce((result, key) => {
    if (data[key].metadata?.type === targetType) {
      result[key] = data[key];
    }
    return result;
  }, {});
}

function deepMerge(obj1, obj2) {
  return Object.keys({ ...obj1, ...obj2 }).reduce((acc, key) => {
    if (
      obj1[key] &&
      obj2[key] &&
      typeof obj1[key] === "object" &&
      typeof obj2[key] === "object"
    ) {
      acc[key] = deepMerge(obj1[key], obj2[key]);
    } else {
      acc[key] = obj2[key] !== undefined ? obj2[key] : obj1[key];
    }
    return acc;
  }, {});
}

/**
 * Gets all things of a given type, optionally filtered by accounts and blockHeight
 * @param {string} type - type of thing to filter by
 * @param {Array<string>} [accounts] - Optional list of accounts to filter by
 * @param {string|number} blockHeight - Optional blockHeight to use; defaults to "final"
 * @returns {object} - all things of the given type
 */
function getAllThings(type, accounts, blockHeight) {
  let paths;
  if (!blockHeight) {
    blockHeight = "final";
  }

  if (Array.isArray(accounts) && accounts.length) {
    // We could change this to get all metadata, metadata includes type
    // and then we have all we need in order to show on screens. Anything else can be fetched separately.
    paths = accounts.map((account) => `${account}/thing/*/metadata/*`);
  } else {
    paths = ["*/thing/*/metadata/*"];
  }
  const things = Social.get(paths, blockHeight);
  return filterByType(things, type) ?? {};
}

/**
 * Gets the thing matching id, optionally filtered by accounts and blockHeight
 * @param {string} id - thing id
 * @param {Array<string>} [accountIds] - Optional list of accounts to filter by. If not provided, defaults to any account.
 * @param {string|number} blockHeight - Optional blockHeight to use; defaults to "final"
 * @returns {object|null} - the thing, multiple things if matches id across accounts, or null if not found
 */
function getThing(id, accountIds, blockHeight) {
  let paths;
  if (!blockHeight) {
    blockHeight = "final";
  }

  if (Array.isArray(accountIds) && accountIds.length) {
    paths = accountIds.map((accountId) => `${accountId}/thing/${id}/**`);
  } else {
    paths = [`*/thing/${id}/**`];
  }

  const thing = Social.get(paths, blockHeight) || {};

  return thing;
}

function deleteThing(id) {
  Social.set({
    thing: {
      [id]: null,
    },
  });
}

/**
 * Creates a thing with the given type, data, and metadata
 * Subsequently calls onCommit or onCancel
 * @param {string} type - type of thing to create
 * @param {object} data - data to store
 * @param {object} metadata - metadata to store
 */
function createThing(type, data, metadata) {
  // Temporary small id
  const id = UUID.generate("xxxxxxx");
  return {
    [id]: {
      // I think there may be some value in stringify-ing the data and storing in empty key, but I'm not sure
      // Maybe it's for published data? Data that has no relations?
      // It's more space efficient for the social contract if we limit the number of keys
      "": JSON.stringify(data),
      data, // so I'm just gonna do both for right now :)
      metadata: { ...metadata, type },
    },
  };
}

const store = (k, v) => Storage.privateSet(k, v);
const retrieve = (k) => Storage.privateGet(k);


State.init({
  debug: true,
});

const accountId = context.accountId;
const Children = props.Children;

let theprops = { ...props };
delete theprops.Children;

const KEYS = {
  selectedDoc: (pid) => `selectedDoc/${pid}`,
  doc: (path) => `doc/${path}`, // having path here will let us always know the structure of the doc
  docs: (pid) => `docs/${pid}`, // this should be the array of project docs
  init: (pid) => `init/${pid}`, // lets us know when the project has been initialized
};
const DOC_SEPARATOR = ".";
const DEFAULT_TEMPLATE = "create.near/widget/templates.project.doc";

const handleDocument = {
  /**
   * Create, or updates, or deletes document in Local Storage
   *
   * if value is an object, then create or update the document
   * if value is null, then delete the document
   *
   * @param {string} pid - project id
   * @param {string} path - path to the document
   * @param {object} value - the value to set at the path
   *
   * @returns {void} - nothing
   */
  set: (pid, path, value) => {
    store(KEYS.doc(path), value);

    // We need to keep track of the documents in the project
    let paths = retrieve(KEYS.docs(pid));
    paths = Array.isArray(paths) ? paths : [];

    // If the document is being deleted, then we need to remove it from the docs array
    if (value === null) {
      const newDocs = paths.filter((docPath) => docPath !== path);
      store(KEYS.docs(pid), newDocs);
    }

    // If the document is being created or updated, we need to make sure it's in the docs array
    if (value !== null && !paths.includes(path)) {
      store(KEYS.docs(pid), [...paths, path]);
    }

    // Open the new document
    store(KEYS.selectedDoc(pid), path);
  },

  /**
   * Wrapper for set that only updates the document keys
   *
   * @param {string} pid - project id
   * @param {string} path - path to the document
   * @param {object} value - the value to set at the path
   * @returns {void} - nothing
   *
   * @example
   * // This will update the document title, without afecting the content
   * handle["document"].update(projectId, path, { title: "New Title" });
   */
  update: (pid, path, value) => {
    const doc = retrieve(KEYS.doc(path));
    console.log("doc", doc);
    // TODO need to fix the structure
    handleDocument.set(pid, path, {
      data: {
        ...doc.data,
        ...value,
      },
      metadata: {
        ...doc.metadata,
        updatedAt: new Date().toISOString(),
      },
      _: {
        inBuffer: true,
      },
    });
  },

  /**
   * Wrapper for set that creates a new document under parent path
   * @param {string} pid - project id (root id)
   * @param {string} parentPath - optional path to the parent document
   * @param {object} value - optional value to set at the path
   */
  create: (pid, parentPath, value) => {
    if (!value) value = { title: "", content: "" };
    if (!parentPath) parentPath = "";
    const did = UUID.generate("xxxxxxx");

    const document = {
      // I'm doing it this funny nested away cuz I'm trying to figure out a generic createThing
      [did]: {
        data: value,
        metadata: {
          createdAt: new Date().toISOString(),
          type: "create.near/type/document",
        },
      },
    };
    const path = `${parentPath}${parentPath && DOC_SEPARATOR}${did}`;

    // Now just using pid to help with Storage
    handleDocument.set(pid, path, {
      ...document[did],
      _: {
        inBuffer: true,
      },
    });
  },

  /**
   * Wrapper for set that deletes a document
   * @param {string} pid - project id
   * @param {string} path - path to the document
   * @returns {void} - nothing
   */
  delete: (pid, path) => handleDocument.set(pid, path, undefined),

  /**
   * Get a document from Local Storage
   * @param {string} path - path to the document
   * @returns {object} - the document
   */
  get: (path) => retrieve(KEYS.doc(path)),
  // TODO: this should get from local storage first and then from SocialDB if not found

  /**
   * Get project documents from Local Storage
   * @param {string} pid - project id
   * @returns {object} - the documents
   */
  getAll: (pid) => {
    let paths = retrieve(KEYS.docs(pid)) || [];
    paths = Array.isArray(paths) ? paths : [];

    let docs = {};
    paths.forEach((path) => {
      const doc = retrieve(KEYS.doc(path));
      if (doc) docs[path] = retrieve(KEYS.doc(path));
    });
    return docs;
  },

  /**
   * Get the selected document from Local Storage, if none is selected, then return the first document and open it
   * @param {string} pid - project id
   * @returns {path} - the path to the selected document
   */
  getSelected: (pid) => {
    const selected = retrieve(KEYS.selectedDoc(pid));
    if (selected) return selected;

    const docs = handleDocument.getAll(pid);
    const firstDoc = Object.keys(docs)[0];
    if (firstDoc) {
      handleDocument.open(pid, firstDoc);
      return firstDoc;
    }
  },

  // TODO
  fetch: (did) => {
    const doc = Social.get(`${accountId}/thing/${did}/**`);
    return doc;
  },

  // TODO
  fetchAll: (pid) => {
    const docs = JSON.parse(Social.get(`${accountId}/thing/${pid}/documents`) || "null");
    return docs;
  },

  // TODO
  fetchAllTitles: (pid, path) => {
    const docs = Social.get(`${accountId}/document/${pid}/*/title`);
    return docs;
  },

  /**
   * Set the selected document in Local Storage
   * @param {string} pid - project id
   * @param {string} path - path to the document
   */
  open: (pid, path) => store(KEYS.selectedDoc(pid), path),

  /**
   * Saves the document to SocialDB
   * @param {string} pid - project id
   * @param {string} path - path to the document
   */
  publish: (pid, path) => {
    const doc = handleDocument.get(path);
    delete doc._;
    const did = path.split(DOC_SEPARATOR).pop();
    
    // TODO: check if document has already been added
    function addDocumentToProject() {
      const project = handleProject.get(pid);
      const documents = JSON.parse(project.documents) || [];
      // this holds the heirachical data
      return {
        thing: {
          [pid]: {
            documents: [...documents, path],
          },
        },
      };
    }

    // TODO: check if project has already been added
    function addProjectToDocument() {
      const projects = JSON.parse(document[did].projects) || [];
      return {
        thing: {
          [did]: {
            projects: [...projects, pid],
          },
        },
      };
    }

    const projectToDoc = addProjectToDocument(did, pid);
    const docToProject = addDocumentToProject(pid, did);

    //combine the json from createThing and addDocumentToProject
    const combined = deepMerge(
      deepMerge({ thing: { [did]: doc } }, projectToDoc),
      docToProject
    );

    Social.set(combined, {
      onCommit: () => {
        handleDocument.set(pid, path, {
          ...doc,
          _: {
            inBuffer: false,
          },
        });
      },
    });
  },

  /**
   * Generates a new UID
   * @returns {string} - the new UID
   */
  generateId: () => UUID.generate("xxxxxxx"),
};

const handleProject = {
  getAll: () => {
    return getAllThings("create.near/type/project", [accountId]);
  },
  get: (pid) => {
    return getThing(pid, [accountId]);
  },
  create: (project) => {
    // TODO: this should be prehandled by the form
    const tags = {};
    project.tags.forEach((tag) => {
      tags[tag] = "";
    });
    // currently setting project as metadata, need to match with typical metadata
    Social.set({
      thing: createThing("create.near/type/project", {}, project),
    });
  },
  delete: (pid) => {
    Social.set({
      thing: {
        [pid]: null,
      },
    });
  },
  update: (pid, project) => {
    Social.set({
      thing: {
        [pid]: project,
      },
    });
  },

  /**
   * Fetches project documents from SocialDB and stores them in Local Storage,
   * it does not override the local documents if updatedAt is more recent,
   *
   * @note I'm not sure if it's okay to store all documents in Local Storage, it may be too much data for big projects,
   * I think it's better to use fetchTitle and fetch to get the document when user opens it, and then store it in Local Storage
   * if edited.
   *
   * @param {string} pid - project id
   * @returns {void} - nothing
   */
  init: (pid, force) => {
    if (!pid) return;
    if (!force) {
      const lastInit = retrieve(KEYS.init(pid));
      // if the project has already been initialized in the past 24 hours, then don't do it again
      if (lastInit && new Date(lastInit) > new Date(Date.now() - 86400000))
        return;
    }

    const docs = handleDocument.fetchAll(pid);
    if (docs === null) return;

    docs.forEach((path) => {
      const doc = docs[path];
      const localDoc = handleDocument.get(path);
      if (!localDoc || new Date(doc.updatedAt) > new Date(localDoc.updatedAt)) {
        handleDocument.set(pid, path, doc);
      }
    });

    store(KEYS.init(pid), new Date().toISOString());
    console.log("Project initialized");
  },
};

/**
 * Initialize
 */
props.project && handleProject.init(props.project);

const handleUtils = {
  /**
   * Unflatten the documents object
   * @param {object} inputObject - the object to unflatten
   * @returns {object} - the unflattened object
   * @example
   * 
const input = {
  702250: { title: "", content: "" },
  "702250.3cbbb3": { title: "", content: "" },
  "702250.3cbbb3.acuont": { title: "", content: "" },
  "702250.89thao": { title: "", content: "" },
};

const output = {
  702250: {
    title: "",
    content: "",
    children: {
      "3cbbb3": {
        title: "",
        content: "",
        children: {
          acuont: { title: "", content: "" },
        },
      },
      "89thao": {
        title: "",
        content: "",
      },
    },
  },
};
    */
  unflattenDocuments: (inputObject) => {
    const result = {};

    Object.keys(inputObject).forEach((key) => {
      const keys = key.split(".");
      let currentLevel = result;

      keys.forEach((k, i) => {
        if (i === keys.length - 1) {
          // last key
          currentLevel[k] = inputObject[key];
        } else {
          currentLevel[k] = currentLevel[k] || {};
          currentLevel[k].children = currentLevel[k].children || {};
          currentLevel = currentLevel[k].children;
        }
      });
    });

    return result;
  },
};

const handle = {
  document: handleDocument,
  project: handleProject,
  utils: handleUtils,
  other: { DOC_SEPARATOR },
};

if (Storage.privateGet("debug")) {
  const selectedDoc = handle["document"].getSelected(props.project);
  const doc = handle["document"].get(selectedDoc);
  const projectData = handle["project"].get(props.project);

  return (
    <>
      <Children handle={handle} {...theprops} />
      <hr />
      <Widget
        src="nearui.near/widget/Input.Select"
        props={{
          label: "Debug",
          value: `${!!Storage.privateGet("debug")}`,
          onChange: (v) => {
            Storage.privateSet("debug", v === "true");
          },
          options: [
            {
              title: "Enabled",
              value: true,
            },
            {
              title: "Disabled",
              value: false,
            },
          ],
        }}
      />
      <hr />
      <p>Selected Project: {props.project}</p>
      Content:
      <p style={{ maxHeight: 300, overflow: "auto" }}>
        <Markdown text={"```json " + JSON.stringify(projectData, null, 2)} />
      </p>
      <hr />
      <p>Selected Doc: {selectedDoc}</p>
      Local Doc:
      <p style={{ maxHeight: 300, overflow: "auto" }}>
        <Markdown text={"```json " + JSON.stringify(doc, null, 2)} />
      </p>
      <hr />
      All Local Docs:
      <p style={{ maxHeight: 300, overflow: "auto" }}>
        <Markdown
          text={
            "```json " +
            JSON.stringify(handle["document"].getAll(props.project), null, 2)
          }
        />
      </p>
      <button
        onClick={() => {
          store(KEYS.docs(props.project), []);
        }}
      >
        clear local docs
      </button>
      <hr />
      Fetched
      <p style={{ maxHeight: 300, overflow: "auto" }}>
        <Markdown
          text={
            "```json " +
            JSON.stringify(
              handle["document"].fetch(props.project, selectedDoc),
              null,
              2
            )
          }
        />
      </p>
      <hr />
      Fetch All Titles
      <p style={{ maxHeight: 300, overflow: "auto" }}>
        <Markdown
          text={
            "```json " +
            JSON.stringify(
              handle["document"].fetchAllTitles(props.project),
              null,
              2
            )
          }
        />
      </p>
      <hr />
      Fetch All
      <p style={{ maxHeight: 300, overflow: "auto" }}>
        <Markdown
          text={
            "```json " +
            JSON.stringify(handle["document"].fetchAll(props.project), null, 2)
          }
        />
      </p>
    </>
  );
}

return (
  <>
    <Children handle={handle} {...theprops} />
    <hr />
    <Widget
      src="nearui.near/widget/Input.Select"
      props={{
        label: "Debug",
        value: `${!!Storage.privateGet("debug")}`,
        onChange: (v) => {
          Storage.privateSet("debug", v === "true");
        },
        options: [
          {
            title: "Enabled",
            value: true,
          },
          {
            title: "Disabled",
            value: false,
          },
        ],
      }}
    />
    <hr />
  </>
);
