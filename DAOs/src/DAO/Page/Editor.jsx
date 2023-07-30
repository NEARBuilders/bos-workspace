const daoId = props.daoId;

const defaultPage = "hack.near/widget/DAO.Profile";

const page = Social.get(`${daoId}/settings/dao/page`);

if (page === null) {
  return "Loading...";
}

let profile = Social.getr(`${daoId}/profile`);

if (profile === null) {
  return "Loading...";
}

State.init({
  profile,
  daoId: daoId,
  page: page ?? defaultPage,
});

const profile_args = JSON.stringify({
  data: {
    [state.daoId]: {
      settings: {
        dao: {
          page: state.page,
        },
      },
    },
  },
});

const proposal_args = Buffer.from(profile_args, "utf-8").toString("base64");

const handleProposal = () => {
  Near.call([
    {
      contractName: state.daoId ?? daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "update DAO page on NEAR Social",
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

const onChangeContract = (daoId) => {
  State.update({
    daoId,
  });
};

const resetPage = () => {
  state.page = defaultPage;
  State.update();
};

return (
  <div>
    <div>
      <h3>Edit Featured Widget</h3>
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
      <input type="text" value={state.page} placeholder={defaultPage} />
    </div>
    <div className="mb-2">
      <button className="btn btn-success" onClick={handleProposal}>
        Propose Changes
      </button>
      {state.page !== defaultPage && (
        <button className="btn btn-outline-primary ms-2" onClick={resetPage}>
          Reset
        </button>
      )}
      {page === state.page && (
        <a className="btn btn-outline-primary ms-2" href={`#/`}>
          View
        </a>
      )}
    </div>
    <hr />
    <div className="mb-2">
      <Widget src={state.page} props={{ daoId }} />
    </div>
  </div>
);
