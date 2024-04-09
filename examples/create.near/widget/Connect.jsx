const userId = context.accountId;
const ownerId = "create.near";

if (!userId) {
  return "Please log in with NEAR :)";
}

const accounts = Social.keys(`*/graph/connect/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

if (accounts === null) {
  return "Loading";
}

const leadersData = Social.keys(`${userId}/graph/connect/*`, "final");
if (leadersData === null) {
  return "Loading";
}

const leaders = leadersData[userId]["graph"]["connect"] ?? {};

let connectDev = prop.connectDev ?? false;

if (connectDev) {
  leaders[ownerId] = true;
}

State.init({
  leaders,
  connectDev,
});

let leadersAll = [];
Object.keys(accounts).forEach((accountId) => {
  Object.keys(accounts[accountId].graph.connect).forEach((leadersAccountId) => {
    leadersAll[leadersAccountId] = (leadersAll[leadersAccountId] ?? 0) + 1;
  });
});

let leadersTop = Object.keys(leadersAll).sort(
  (a, b) => leadersAll[b] - leadersAll[a]
);

let handleChange = (accountId) => {
  let leaders = state.leaders;
  leaders[accountId] = !leaders[accountId];
  State.update({ leaders });
};

let connectDevChange = () => {
  handleChange(ownerId);
  State.update({ connectDev: !state.connectDev });
};

let leadersBlocks = leadersTop.map((accountId) => (
  <li
    className={`list-group-item ${
      state.leaders[accountId] ? "list-group-item-success" : ""
    }`}
  >
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value={accountId}
        disabled={accountId == userId}
        id={`connect-${accountId}`}
        name={`connect-${accountId}`}
        onChange={() => handleChange(accountId)}
        checked={state.leaders[accountId] ?? false}
      />
      <label className="form-check-label" for={`connect-${accountId}`}>
        <Widget
          src="zavodil.near/widget/ProfileLine"
          props={{
            accountId,
            link: "",
          }}
        />{" "}
        <span
          className="badge rounded-pill bg-primary"
          title={`${leadersAll[accountId]} leaders`}
        >
          {leadersAll[accountId]}
        </span>
        <a
          className="btn btn-sm btn-outline-secondary border-0"
          href={`#/mob.near/widget/ProfilePage?accountId=${accountId}`}
          target="_blank"
        >
          <i className="bi bi-window-plus me-1" title="Open in new tab"></i>
        </a>
      </label>
    </div>
  </li>
));

let dataConnect = {};
Object.keys(state.leaders).map((accountId) => {
  if (accountId !== userId) {
    let connect = !!state.leaders[accountId];
    dataConnect[accountId] = connect ? "" : null;
  }
});

let dataGraph = [];
let dataNotify = [];

Object.keys(state.leaders).map((accountId) => {
  if (leaders[accountId] != state.leaders[accountId]) {
    let connect = !!state.leaders[accountId];
    dataGraph.push({
      key: "connect",
      value: {
        type: connect ? "add" : "remove",
        accountId,
      },
    });

    dataNotify.push({
      key: accountId,
      value: {
        type: connect ? "add" : "remove",
      },
    });
  }
});

const data = {
  graph: {
    connect: dataConnect,
  },
  index: {
    graph: JSON.stringify(dataGraph),
    notify: JSON.stringify(dataNotify),
  },
};

return (
  <>
    <h3>Choose Leaders</h3>
    <p>Select from the list of accounts below.</p>

    <div className="mb-3">
      <CommitButton
        disabled={context.loading}
        className={`btn ${
          context.loading ? "btn-outline-dark" : "btn-primary"
        }`}
        data={data}
      >
        {context.loading ? "Loading" : "Connect"}
      </CommitButton>
    </div>
    <h5>Near Social Community</h5>
    <ul className="list-group">{leadersBlocks}</ul>

    <div className="mt-2 mb-3">
      <CommitButton
        disabled={context.loading}
        className={`btn ${
          context.loading ? "btn-outline-dark" : "btn-primary"
        }`}
        data={data}
      >
        {context.loading ? "Loading" : "Connect"}
      </CommitButton>
    </div>
  </>
);
