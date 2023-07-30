const accountId = props.accountId ?? context.accountId;

const defaultPolicy = [accountId];

State.init({
  name: "",
  purpose: "",
});

const dao_config = {
  purpose: state.purpose,
  bond: "100000000000000000000000",
  vote_period: "604800000000000",
  grace_period: "86400000000000",
  policy: {
    roles: [
      {
        name: "council",
        slug: "council",
        kind: {
          Group: [accountId],
        },
        permissions: [
          "*:Finalize",
          "policy:AddProposal",
          "add_bounty:AddProposal",
          "bounty_done:AddProposal",
          "transfer:AddProposal",
          "vote:AddProposal",
          "remove_member_from_role:AddProposal",
          "add_member_to_role:AddProposal",
          "config:AddProposal",
          "call:AddProposal",
          "upgrade_remote:AddProposal",
          "upgrade_self:AddProposal",
          "set_vote_token:AddProposal",
          "policy:VoteApprove",
          "policy:VoteReject",
          "policy:VoteRemove",
          "add_bounty:VoteApprove",
          "add_bounty:VoteReject",
          "add_bounty:VoteRemove",
          "bounty_done:VoteApprove",
          "bounty_done:VoteReject",
          "bounty_done:VoteRemove",
          "transfer:VoteApprove",
          "transfer:VoteReject",
          "transfer:VoteRemove",
          "vote:VoteApprove",
          "vote:VoteReject",
          "vote:VoteRemove",
          "remove_member_from_role:VoteApprove",
          "remove_member_from_role:VoteReject",
          "remove_member_from_role:VoteRemove",
          "add_member_to_role:VoteApprove",
          "add_member_to_role:VoteReject",
          "add_member_to_role:VoteRemove",
          "call:VoteApprove",
          "call:VoteReject",
          "call:VoteRemove",
          "config:VoteApprove",
          "config:VoteReject",
          "config:VoteRemove",
          "set_vote_token:VoteApprove",
          "set_vote_token:VoteReject",
          "set_vote_token:VoteRemove",
          "upgrade_self:VoteApprove",
          "upgrade_self:VoteReject",
          "upgrade_self:VoteRemove",
          "upgrade_remote:VoteApprove",
          "upgrade_remote:VoteReject",
          "upgrade_remote:VoteRemove",
        ],
        vote_policy: {},
      },
      {
        name: "all",
        slug: "all",
        kind: "Everyone",
        permissions: [
          "policy:AddProposal",
          "add_bounty:AddProposal",
          "bounty_done:AddProposal",
          "transfer:AddProposal",
          "vote:AddProposal",
          "remove_member_from_role:AddProposal",
          "add_member_to_role:AddProposal",
          "config:AddProposal",
          "call:AddProposal",
          "upgrade_remote:AddProposal",
          "upgrade_self:AddProposal",
          "set_vote_token:AddProposal",
          "vote:VoteApprove",
          "vote:VoteReject",
          "vote:VoteRemove",
        ],
        vote_policy: {},
      },
    ],
    default_vote_policy: {
      weight_kind: "RoleWeight",
      quorum: "0",
      threshold: [1, 2],
    },
    proposal_bond: "100000000000000000000000",
    proposal_period: "604800000000000",
    bounty_bond: "100000000000000000000000",
    bounty_forgiveness_period: "604800000000000",
  },
  config: {
    name: state.name,
    purpose: state.purpose,
    metadata: "",
  },
};

const dao_args = Buffer.from(JSON.stringify(dao_config), "utf-8").toString(
  "base64"
);

const handleCreate = () => {
  Near.call([
    {
      contractName: "sputnik-dao.near",
      methodName: "create",
      args: {
        name: state.name,
        args: dao_args,
      },
      deposit: "7000000000000000000000000",
      gas: "200000000000000",
    },
  ]);
};

const onChangeName = (name) => {
  State.update({
    name,
  });
};

const onChangePurpose = (purpose) => {
  State.update({
    purpose,
  });
};

return (
  <div className="mb-3">
    <h3>DAO Factory</h3>
    <div className="mb-2">
      Name:
      <input type="text" onChange={(e) => onChangeName(e.target.value)} />
    </div>
    <div className="mb-2">
      Purpose:
      <input type="text" onChange={(e) => onChangePurpose(e.target.value)} />
    </div>
    <button className="btn btn-outline-success mt-3" onClick={handleCreate}>
      Create DAO
    </button>
  </div>
);
