const daoId = props.daoId ?? "multi.sputnik-dao.near";

const proposal_id = props.id ?? 1;

State.init({
  proposal_id,
});

const proposal = Near.view(daoId, "get_proposal", {
  id: JSON.parse(state.proposal_id),
});

const handleApprove = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "act_proposal",
      args: {
        id: JSON.parse(state.proposal_id),
        action: "VoteApprove",
      },
      gas: 200000000000000,
    },
  ]);
};

const handleReject = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "act_proposal",
      args: {
        id: JSON.parse(state.proposal_id),
        action: "VoteReject",
      },
      gas: 200000000000000,
    },
  ]);
};

const onChangeProposal = (proposal_id) => {
  State.update({
    proposal_id,
  });
};

return (
  <>
    <div className="mb-2">
      <input
        type="number"
        placeholder="Enter Proposal ID"
        onChange={(e) => onChangeProposal(e.target.value)}
      />
    </div>
    <hr />
    <p>Proposal #{state.proposal_id}</p>

    <h5>by {proposal.proposer}</h5>
    <p>{proposal.description}</p>
    <div>
      <h4>Vote Below</h4>
      <a className="btn btn-outline-success" onClick={handleApprove}>
        Yes
      </a>
      <a className="btn btn-outline-danger" onClick={handleReject}>
        No
      </a>
    </div>
  </>
);
