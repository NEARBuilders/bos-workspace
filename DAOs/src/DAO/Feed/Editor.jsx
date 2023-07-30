const daoId = props.daoId;

const defaultFeed = "hack.near/widget/DAO.Social";

const feed = Social.get(`${daoId}/settings/dao/feed`);

if (feed === null) {
  return "Loading...";
}

State.init({
  profile,
  daoId: daoId,
  feed: feed ?? defaultFeed,
});

const feed_args = JSON.stringify({
  data: {
    [state.daoId]: {
      settings: {
        dao: {
          feed: state.feed,
        },
      },
    },
  },
});

const proposal_args = Buffer.from(feed_args, "utf-8").toString("base64");

const handleProposal = () => {
  Near.call([
    {
      contractName: state.daoId ?? daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "update DAO feed on NEAR Social",
          kind: {
            FunctionCall: {
              receiver_id: "social.near",
              actions: [
                {
                  method_name: "set",
                  args: proposal_args,
                  deposit: "50000000000000000000000",
                  gas: "200000000000000",
                },
              ],
            },
          },
        },
      },
      deposit: "100000000000000000000000",
      gas: "200000000000000",
    },
  ]);
};

const resetFeed = () => {
  state.feed = defaultFeed;
  State.update();
};

return (
  <div>
    <div>
      <h3>Edit Community Feed</h3>
      <h5>{daoId}</h5>
    </div>
    <div className="mb-2">
      <p className="m-1">Account Name:</p>
      <input
        type="text"
        value={state.daoId}
        placeholder={daoId ?? "example.sputnik-dao.near"}
      />
    </div>
    <div className="mb-3">
      <p className="m-1">Widget Source:</p>
      <input type="text" value={state.feed} placeholder={defaultFeed} />
    </div>
    <div className="mb-2">
      <button className="btn btn-success" onClick={handleProposal}>
        Propose Changes
      </button>
      {state.feed !== defaultFeed && (
        <button className="btn btn-outline-primary ms-2" onClick={resetFeed}>
          Reset
        </button>
      )}
      {feed === state.feed && (
        <a className="btn btn-outline-primary ms-2" href={`#/`}>
          View
        </a>
      )}
    </div>
    <hr />
    <div className="mb-2">
      <Widget src={state.feed} props={{ daoId }} />
    </div>
  </div>
);
