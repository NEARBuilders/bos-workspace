const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "multi.sputnik-dao.near";
const onClose = props.onClose;

if (!accountId) {
  return "Please connect your NEAR wallet :)";
}

State.init({
  description: state.description,
  error: state.error,
});

const handleProposal = () => {
  if (!state.description) {
    State.update({
      error: "Please enter a description",
    });
    return;
  }
  const gas = 200000000000000;
  const deposit = 100000000000000000000000;
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: state.description,
          kind: "Vote",
        },
      },
      gas: gas,
      deposit: deposit,
    },
  ]);
};

const onChangeDescription = (description) => {
  State.update({
    description,
    error: undefined,
  });
};

const defaultDescription =
  "# [Your Title Here]\n\n## Description\n\n[Detailed description of what the proposal is about.]\n\n## Why This Proposal?\n\n[Explanation of why this proposal is necessary or beneficial.]\n\n## Execution Plan\n\n[Description of how the proposal will be implemented.]\n\n## Budget\n\n[If applicable, outline the budget required to execute this proposal.]\n\n## Timeline\n\n[Proposed timeline for the execution of the proposal.]";

return (
  <>
    <h5>Proposal Description</h5>
    <Widget
      src="sking.near/widget/Common.Inputs.Markdown"
      props={{
        onChange: (value) => onChangeDescription(value),
        height: "270px",
        initialText: defaultDescription,
      }}
    />
    {state.error && <div className="text-danger">{state.error}</div>}
    <div className="ms-auto">
      <Widget
        src="sking.near/widget/Common.Button"
        props={{
          children: "Create Proposal",
          onClick: handleProposal,
          className: "mt-2",
          variant: "success",
        }}
      />
      {onClose && (
        <Widget
          src="sking.near/widget/Common.Button"
          props={{
            children: "Close",
            onClick: onClose,
            className: "mt-2",
          }}
        />
      )}
    </div>
  </>
);
