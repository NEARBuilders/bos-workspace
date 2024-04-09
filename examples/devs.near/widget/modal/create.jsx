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
];

const defaultAdapter = adapters[0];

const { creatorId } = props;

const [json, setJson] = useState(props.data ?? "");
const [source, setSource] = useState(props.source ?? "");
const [adapter, setAdapter] = useState(defaultAdapter.value ?? "");
const [reference, setReference] = useState(undefined);
const [activeTab, setActiveTab] = useState("data");
const [name, setName] = useState(props.name ?? "");
const [description, setDescription] = useState(props.description ?? "");
const [type, setType] = useState(props.type ?? "document");
const [path, setPath] = useState(`${context.accountId}/every/document/test`);

const socialDbAdapter = {
  get: (path, blockHeight) => {
    if (!path) console.log("path not provided") && null;
    if (!blockHeight) blockHeight = "final";
    return Social.get(path, blockHeight);
  },
  create: (v, path, type) => {
    const parts = path.split("/");
    let nestedObject = {};
    let currentLevel = nestedObject;

    for (let i = 1; i < parts.length - 1; i++) {
      const part = parts[i];
      currentLevel[part] = {};
      currentLevel = currentLevel[part];
    }

    currentLevel[parts[parts.length - 1]] = {
      "": v,
      metadata: {
        name: name,
        description: description,
        type: type,
      },
    };

    return Social.set(nestedObject, {
      force: "true",
      onCommit: (v) => {
        if (props.closeModal) props.closeModal();
      },
      onCancel: (v) => {
        if (props.closeModal) props.closeModal();
      },
    });
  },
};

const handleCreate = () => {
  // load in the state.adapter (modules for IPFS, Arweave, Ceramic, Verida, On Machina... )
  const { create } = adapter ? VM.require(adapter) : socialDbAdapter;
  // const { create } = VM.require(adapter) || (() => {});
  if (create) {
    // store the data somewhere, based on the adapter
    create(json, path, type);
  }
  if (props.setPath) props.setPath(path);
};

return (
  <Wrapper>
    <h3>create</h3>
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
              disabled // temp
              onChange={(e) => setPath(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>type</Label>
            <Input
              type="text"
              value={type}
              disabled // temp
              onChange={(e) => setType(e.target.value)}
            />
          </FormGroup>
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
