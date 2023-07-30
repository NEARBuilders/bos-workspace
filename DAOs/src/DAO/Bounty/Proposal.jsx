const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "multi.sputnik-dao.near";
const onClose = props.onClose;

if (!accountId) {
  return "Please connect your NEAR wallet :)";
}

State.init({
  description: state.description,
  token: state.token ?? "",
  amount: state.amount ?? 0,
  times: state.times ?? 1,
  max_deadline: state.max_deadline,
});

const handleProposal = () => {
  // convert amount
  let ftMetadata = {
    decimals: 24,
  };
  if (state.token !== "") {
    ftMetadata = Near.view(state.token, "ft_metadata", {});
    if (ftMetadata === null) return null;
  }
  const amountInYocto = Big(state.amount ?? 0)
    .mul(Big(10).pow(ftMetadata.decimals))
    .toFixed();

  const bounty = {
    description: state.description,
    token: state.token ?? "",
    amount: amountInYocto,
    times: JSON.parse(state.times),
    max_deadline: state.max_deadline,
  };
  const gas = 200000000000000;
  const deposit = 100000000000000000000000;
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "new bounty proposal",
          kind: {
            AddBounty: {
              bounty,
            },
          },
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
  });
};

const onChangeToken = (token) => {
  State.update({
    token,
  });
};

const onChangeAmount = (amount) => {
  State.update({
    amount,
  });
};

const onChangeTimes = (times) => {
  State.update({
    times,
  });
};

const onChangeDeadline = (days, hours, minutes) => {
  let max_deadline = Big(days).mul(86400000000000);
  max_deadline = max_deadline.add(Big(hours).mul(3600000000000));
  max_deadline = max_deadline.add(Big(minutes).mul(60000000000));
  max_deadline = max_deadline.toFixed();
  State.update({
    max_deadline,
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

const defaultBountyDescription =
  "# [Bounty Title Here]\n\n## Description\n\n[Detailed description of what the bounty entails. What needs to be done, any specific requirements or skills needed, etc.]\n\n## Acceptance Criteria\n\n[What should be delivered upon the completion of the bounty? Be specific and clear about what you expect.]\n\n## Steps to Claim\n\n[Explanation of the procedure to claim the bounty. Step by step guide on what needs to be done to complete the bounty and how to submit the work.]\n\n## Additional Information\n\n[If applicable, include any additional information or resources relevant to the bounty. It could be helpful links, tips, or contacts.]";

return (
  <Wrapper>
    <div className="d-flex justify-content-between align-items-center">
      <h3>Propose New Bounty</h3>
      {onClose && (
        <CloseButton onClick={onClose}>
          <i className="bi bi-x"></i>
        </CloseButton>
      )}
    </div>
    <div className="d-flex gap-3 flex-wrap">
      <div>
        <h5>DAO</h5>
        <Widget
          src="mob.near/widget/Profile.ShortInlineBlock"
          props={{ accountId: daoId, tooltip: true }}
        />
      </div>
      <div className="ms-sm-5">
        <h5>Proposer</h5>
        <Widget
          src="mob.near/widget/Profile.ShortInlineBlock"
          props={{ accountId: accountId, tooltip: true }}
        />
      </div>
    </div>

    <div>
      <h5>Bounty Description</h5>
      <Widget
        src="sking.near/widget/Common.Inputs.Markdown"
        props={{
          onChange: (value) => onChangeDescription(value),
          height: "270px",
          initialText: defaultBountyDescription,
        }}
      />
    </div>

    <div>
      <h5>Reward Token ID</h5>
      <input
        type="text"
        onChange={(e) => onChangeToken(e.target.value)}
        placeholder="Leave empty for NEAR"
      />
    </div>

    <div className="row gap-4 gap-sm-0">
      <div className="col-sm">
        <h5>Reward per Bounty Claim</h5>
        <input
          type="number"
          onChange={(e) => onChangeAmount(e.target.value)}
          min="0"
          placeholder="0"
          defaultValue={0}
        />
      </div>
      <div className="col-sm">
        <h5>Max Bounty Claims</h5>
        <input
          type="number"
          onChange={(e) => onChangeTimes(e.target.value)}
          min="1"
          placeholder="0"
          defaultValue={1}
        />
      </div>
    </div>
    <div style={{ width: "240px" }}>
      <h5>Maximum Time to Complete</h5>
      <Widget
        src="sking.near/widget/Common.Inputs.TimeAmount"
        props={{
          onChange: ({ days, hours, minutes }) =>
            onChangeDeadline(days, hours, minutes),
          days: 0,
          hours: 0,
          minutes: 0,
        }}
      />
    </div>
    {state.error && <div className="text-danger">{state.error}</div>}
    <div className="ms-auto">
      <Widget
        src="sking.near/widget/Common.Button"
        props={{
          children: "Propose Bounty",
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
