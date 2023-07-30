const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "multi.sputnik-dao.near";
const onClose = props.onClose;
const bountyId = props.bountyId;

if (!accountId) {
  return "Please connect your NEAR wallet :)";
}

State.init({
  description: state.description,
});

const handleProposal = () => {
  const description = state.description ?? "Work done";

  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: description,
          kind: {
            BountyDone: {
              receiver_id: accountId,
              bounty_id: JSON.parse(bountyId),
            },
          },
        },
      },
      gas: gas,
      deposit: 100000000000000000000000,
    },
  ]);
};

const onChangeDescription = (description) => {
  State.update({
    description,
  });
};

const Wrapper = styled.div`
  margin: 16px auto;
  width: 100%;
  max-width: 900px;
  max-height: 100%;
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 4px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;

  @media (max-width: 600px) {
    border-radius: 0;
  }

  p {
    line-height: 1.4;
    font-weight: 400;
    font-size: 15px;
    color: #868682;
    margin: 0;
  }

  h3 {
    font-weight: 600;
    font-size: 24px;
    color: #1b1b18;
  }

  h5 {
    font-size: 12px;
    font-weight: 400;
    line-height: 1.2;
    color: #6c757d;
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(27, 27, 24);
  border-radius: 100px;
  height: 40px;
  width: 40px;
  border: none;
  margin: 0;
  font-size: 26px;
  background-color: rgb(246, 246, 245);

  &:hover {
    background-color: rgb(243, 243, 242);
    color: rgb(0, 0, 0);
  }
`;

const defaultSubmissionDescription = "[Describe the work you've done here.]";

return (
  <Wrapper>
    <div className="d-flex justify-content-between align-items-center">
      <h3>Submit Work for Bounty #{bountyId}</h3>
      {onClose && (
        <CloseButton onClick={onClose}>
          <i className="bi bi-x"></i>
        </CloseButton>
      )}
    </div>

    <div>
      <h5>Submission Description</h5>
      <Widget
        src="sking.near/widget/Common.Inputs.Markdown"
        props={{
          onChange: (value) => onChangeDescription(value),
          height: "270px",
          initialText: defaultSubmissionDescription,
        }}
      />
    </div>

    {state.error && <div className="text-danger">{state.error}</div>}
    <div className="ms-auto">
      <Widget
        src="sking.near/widget/Common.Button"
        props={{
          children: "Submit Work",
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
  </Wrapper>
);
