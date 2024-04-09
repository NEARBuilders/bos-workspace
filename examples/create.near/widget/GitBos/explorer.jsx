const [creator, setCreator] = useState("create.near");
const [type, setType] = useState("widget");
const [name, setName] = useState("GitBos");

const exists = Social.get(`${creator}/${type}/${name}`);

return (
  <>
    <div className="m-2">
      <h3 className="mb-3">GitBos Explorer</h3>
      <input
        type="text"
        placeholder="creator"
        value={creator}
        onChange={(e) => setCreator(e.target.value)}
      />
    </div>
    <div className="m-2">
      <input
        type="text"
        placeholder="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
    </div>
    <div className="m-2">
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <br />
    {exists ? (
      <Widget
        src="create.near/widget/repository.content"
        props={{ path: `${creator}/${type}/${name}` }}
      />
    ) : (
      <p className="m-3">nothing found</p>
    )}
  </>
);
