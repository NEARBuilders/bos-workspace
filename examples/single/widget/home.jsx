const CONTRACT = "${alias_contract}"; // this will get replaced by bos-workspace according to -n {network_env}
const storedGreeting = Near.view(CONTRACT, "get_greeting") ?? "hello world";

if (!storedGreeting || context.loading) {
  return "Loading...";
}

const [greeting, setGreeting] = useState(storedGreeting);
const [showSpinner, setShowSpinner] = useState(false);
const loggedIn = !!context.accountId;

const onInputChange = ({ target }) => {
  setGreeting(target.value);
};

const onBtnClick = () => {
  setShowSpinner(true);
  Near.call(CONTRACT, "set_greeting", { greeting });
  setShowSpinner(false);
};

const Main = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI
`;

// Render
return (
  <Main>
    <div className="text-center">
      <h3 className="font-weight-bold"> Hello Near </h3>
      <p className="small font-weight-light">
        A greeting stored in
        <span className="text-danger">{CONTRACT}</span>
      </p>
    </div>
    <div className="container py-4 px-5 text-dark bg-light rounded">
      <h2 className="text-center">
        The contract says:
        <span className="text-primary"> {greeting} </span>
      </h2>

      <div class="p-4">
        <div className="input-group" hidden={!loggedIn}>
          <input placeholder="Store a new greeting" onChange={onInputChange} />
          <button className="btn btn-primary" onClick={onBtnClick}>
            <span hidden={showSpinner}>Save</span>
            <i
              className="spinner-border spinner-border-sm"
              hidden={!showSpinner}
            ></i>
          </button>
        </div>

        <p className="text-center py-2" hidden={loggedIn}>
          Login to change the greeting
        </p>
      </div>
    </div>
  </Main>
);