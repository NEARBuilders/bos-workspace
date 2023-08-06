const daoId = props.daoId;
const onHideMultiSelect = props.onHideMultiSelect;

State.init({
  openModal: false,
  page: 0,
});

const STORAGE_KEY = "proposalsMultiVote";
const STORAGE_SRC = "/*__@appAccount__*//widget/DAO.Proposals.Card.MultiVote";
const STORAGE = Storage.get(STORAGE_KEY, STORAGE_SRC);

console.log(STORAGE);

if (STORAGE === null) return "";

if (Object.keys(STORAGE[daoId] || {}).length < 1) {
  return "";
}

const proposal_ids = Object.keys(STORAGE[daoId]).map((id) => parseInt(id));


const handleSubmit = () => {
  const calls = [];
  Object.keys(STORAGE[daoId]).forEach((id) => {
    let vote = STORAGE[daoId][id];
    switch (`${vote}`) {
      case "0":
        vote = "VoteApprove";
        break;
      case "1":
        vote = "VoteReject";
        break;
      case "2":
        vote = "VoteRemove";
        break;
      default:
        console.error("Invalid vote");
        break;
    }
    calls.push({
      contractName: daoId,
      methodName: "act_proposal",
      args: {
        id: parseInt(id),
        action: vote,
      },
      gas: 200000000000000,
    });
  });
  return Near.call(calls);
};

let Wrapper = styled.div`
  position: fixed;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 500px;
  max-width: 100vw;
  background-color: #fff;
`;

return (
  <Wrapper className="ndc-card p-4">
    <h4>Voting on multiple proposals</h4>
    <p>
      Proposals:{" "}
      {Object.keys(STORAGE[daoId])
        .map((id) => parseInt(id))
        .reverse()
        .join(", ")}
    </p>
    <div className="d-flex justify-content-end mt-4 gap-3">
      <Widget
        src="nearui.near/widget/Input.Button"
        props={{
          children: "Cancel",
          onClick: () => {
            onHideMultiSelect();
          },
          variant: "secondary outline",
          className: "me-auto",
        }}
      />
      <Widget
        src="nearui.near/widget/Input.Button"
        props={{
          children: "Clear",
          onClick: () => {
            Storage.set(STORAGE_KEY, {});
          },
          variant: "secondary outline",
        }}
      />
      <Widget
        src="nearui.near/widget/Input.Button"
        props={{
          children: "Submit",
          onClick: () => {
            handleSubmit();
          },
          variant: "secondary",
        }}
      />
    </div>
  </Wrapper>
);
