const Wrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const TabContent = styled.div`
  margin-top: 1rem;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 5px;
`;

const Select = styled.select`
  padding: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const adapters = [
  // these can come from the user (or app) settings
  // {
  //   title: "Local Storage",
  //   value: "everycanvas.near/widget/adapter.local_storage",
  //   saveRef: false
  // },
  // {
  //   title: "SocialDB",
  //   value: "everycanvas.near/widget/adapter.social",
  // },
  {
    title: "Social DB",
    value: null,
  },
  {
    title: "IPFS",
    value: "everycanvas.near/widget/adapter.ipfs",
  },
  {
    title: "Sputnik DAO",
    value: "devs.near/widget/adapter.sputnik-dao",
  },
  // {
  //   title: "GitHub",
  //   value: "hack.near/widget/adapter.github",
  // },
  // {
  //   title: "Obsidian",
  //   value: "hack.near/widget/adapter.obsidian",
  // },
  // {
  //   title: "Tldraw",
  //   value: "hack.near/widget/adapter.tldraw",
  // },
];

const defaultAdapter = adapters[0];

const { creatorId } = props;

const [json, setJson] = useState(props.data ?? "");
const [source, setSource] = useState(props.source ?? "");
const [adapter, setAdapter] = useState(defaultAdapter.value ?? "");
const [reference, setReference] = useState(undefined);
const [filename, setFilename] = useState(props.filename ?? "");
const [activeTab, setActiveTab] = useState("data");
const [name, setName] = useState(props.name ?? "");
const [description, setDescription] = useState(props.description ?? "");
const [path, setPath] = useState(props.path ?? "");
const [type, setType] = useState(props.type ?? "");

const socialDbAdapter = {
  get: (path, blockHeight) => {
    if (!path) console.log("path not provided") && null;
    if (!blockHeight) blockHeight = "final";
    return Social.get(path, blockHeight);
  },
  create: (v) => {
    const parts = path.split("/");
    return Social.set(
      {
        [parts[1]]: {
          [parts[2]]: {
            "": v,
            metadata: {
              type: type,
            },
          },
        },
      },
      {
        force: "true",
        onCommit: (v) => {
          console.log(v);
        },
        onCancel: (v) => {
          console.log(v);
        },
      }
    );
  },
};

function generateUID() {
  return (
    Math.random().toString(16).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(16).slice(2)
  );
}

const handleCreate = () => {
  const isCreator = context.accountId === creatorId;

  // load in the state.adapter (modules for IPFS, Arweave, Ceramic, Verida, On Machina... )
  const { create } = adapter ? VM.require(adapter) : socialDbAdapter;
  console.log("creating with", adapter);
  // const { create } = VM.require(adapter) || (() => {});
  if (create) {
    // store the data somewhere, based on the adapter
    create(json)
    // .then((reference) => {
    //   // now we have a reference to the data
    //   // we need to name it... are we the original creator or are we forking? We don't want to overwrite any of the users custom (or maybe we do!)
    //   const thingId = filename ?? generateUID();

    //   const hyperfile = {
    //     [props.type]: {
    //       // which we store in the social contract
    //       [thingId]: {
    //         "": JSON.stringify({
    //           fileformat: `${props.type}.${source}`,
    //           source: source,
    //           adapter: adapter,
    //           reference: reference,
    //         }),
    //         metadata: {
    //           name: name,
    //           description: description,
    //           type: props.type,
    //         },
    //       },
    //     },
    //   };

    //   if (creatorId !== context.accountId) {
    //     // handle request merge
    //     hyperfile.index = {
    //       notify: JSON.stringify({
    //         key: creatorId,
    //         value: {
    //           type: "request",
    //           data: {
    //             type: "merge",
    //             upstream: `${creatorId}/${props.type}/${props.filename}`,
    //             origin: `${context.accountId}/${props.type}/${thingId}`,
    //           },
    //         },
    //       }),
    //     };
    //     hyperfile[props.type][thingId].metadata = {
    //       ...hyperfile[props.type][thingId].metadata,
    //       upstream: `${creatorId}/${props.type}/${props.filename}`,
    //     };
    //     // I want to make a request to merge
    //     // set upstream and downstream
    //   }

    //   // sometimes we're not logged in, so it doesn't do anything!
    //   Social.set(hyperfile, { force: true });
    // });
  }
};

return (
  <Wrapper>
    <h3>{context.accountId === creatorId ? "create" : "request merge"}</h3>
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <a
          className={`nav-link ${activeTab === "data" ? "active" : ""}`}
          onClick={() => setActiveTab("data")}
        >
          Data
        </a>
      </li>
      <li className="nav-item">
        <a
          className={`nav-link ${activeTab === "metadata" ? "active" : ""}`}
          onClick={() => setActiveTab("metadata")}
        >
          Metadata
        </a>
      </li>
    </ul>

    <TabContent>
      {activeTab === "data" && (
        <Form>
          <FormGroup>
            <Label>path</Label>
            <Input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>type</Label>
            <Input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>source</Label>
            <Input
              type="text"
              value={source}
              onChange={(e) => onChangeSource(e.target.value)}
              disabled={props.source} // disable if source is passed in
            />
          </FormGroup>
          {/* <Widget
            src="bozon.near/widget/CodeDiff"
            props={{ currentCode: update, prevCode: src, ...props }}
          /> */}
          <textarea
            className="form-control mb-3"
            rows={5}
            value={json}
            onChange={(e) => setJson(e.target.value)}
          />
          <FormGroup>
            <Label>adapter</Label>
            <Select
              value={adapter}
              onChange={(e) => setAdapter(e.target.value)}
            >
              {adapters.map((o) => (
                <option value={o.value}>{o.title}</option>
              ))}
            </Select>
          </FormGroup>
        </Form>
      )}
    </TabContent>
    <TabContent>
      {activeTab === "metadata" && (
        <Form>
          <FormGroup>
            <Label>name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>description</Label>
            <textarea
              className="form-control mb-3"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>
        </Form>
      )}
    </TabContent>
    <FormGroup>
      <button className="btn btn-success mb-1" onClick={handleCreate}>
        Create
      </button>
    </FormGroup>
  </Wrapper>
);
