const daoId = "build.sputnik-dao.near";
const daos = Near.view(factoryId, "get_dao_list");
const daoVersion = Near.view(daoId, "version");
const factory = Near.view(daoId, "get_factory_info");
const policy = Near.view(daoId, "get_policy");
const config = Near.view(daoId, "get_config");

// PROPOSALS
const proposal = Near.view(daoId, "get_proposal", {
  id: parseInt(proposalId),
});
const lastProposalId = Near.view(daoId, "get_last_proposal_id");
let proposals = [];
if (lastProposalId) {
  proposals =
    Near.view(daoId, "get_proposals", {
      from_index: Math.max(0, lastProposalId - limit),
      limit,
    }) || [];
  proposals.reverse();
}

// ROLES + PERMISSIONS
const groups = policy.roles
  .filter((role) => role.name === groupId)
  .map((role) => {
    const group = role.kind.Group;

    return group;
  });
const isMember = groups.map((group) => {
  return !group
    ? false
    : group.filter((address) => address === accountId).length > 0;
})?.[0];
const processPolicy = (policy) => {
  const roles = {};
  const options = [];
  policy.roles.forEach((role) => {
    if (role.kind.Group) {
      if (!roles[role.name]) {
        roles[role.name] = role;
        options.push({ text: role.name, value: role.name });
      }
    }
  });
  State.update({ rolesOptions: options });
  return roles;
};
const allowedRoles = useCache(
  () =>
    Near.asyncView(daoId, "get_policy").then((policy) => processPolicy(policy)),
  daoId + "-remove-member-proposal",
  { subscribe: false }
);

// BOUNTIES
const bounty = Near.view(daoId, "get_bounty", {
  id: bountyId,
});
const claims = Near.view(daoId, "get_bounty_claims", {
  account_id: accountId,
});
const numberOfClaims = Near.view(daoId, "get_bounty_number_of_claims", {
  id: bountyId,
});

// UTILS
const call = ({ daoId, methodName, args, deposit }) => {
  Near.call([
    {
      contractName: daoId,
      methodName,
      args,
      deposit: deposit,
      gas: gas,
    },
  ]);
};

const actions = {
  AddProposal: "create proposal",
  VoteApprove: "vote approve",
  VoteReject: "vote reject",
  VoteRemove: "vote remove",
};

const proposalTypes = [
  "All",
  "Transfer",
  "Vote",
  "FunctionCall",
  "AddBounty",
  "BountyDone",
  "AddMemberToRole",
  "RemoveMemberFromRole",
  "ChangeConfig",
  "ChangePolicy",
  "ChangePolicyUpdateParameters",
  "ChangePolicyUpdateDefaultVotePolicy",
  "ChangePolicyRemoveRole",
  "ChangePolicyAddOrUpdateRole",
  "FactoryInfoUpdate",
  "SetStakingContract",
  "UpgradeRemote",
  "UpgradeSelf",
].map((t) => {
  return {
    value: t,
    label: t,
  };
});

// -----------------

const addProposal = ({ daoId, proposal }) => {
  const policy = Near.view(daoId, "get_policy");

  if (policy === null) {
    return "Loading...";
  }

  const deposit = policy.proposal_bond;

  call({
    daoId,
    methodName: "add_proposal",
    args: {
      proposal,
    },
    deposit,
  });
};

// CREATE DAO
const newDao_args = {
  config,
  policy,
};
const dao_args = Buffer.from(JSON.stringify(newDao_args), "utf-8").toString(
  "base64"
);
const createDao = () => {
  Near.call([
    {
      contractName: "sputnik-dao.near",
      methodName: "create",
      args: {
        name: daoName,
        args: dao_args,
      },
      deposit: "7000000000000000000000000",
      gas: "200000000000000",
    },
  ]);
};

// ADD MEMBER
const addMember = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: `add ${memberId ?? accountId} to ${roleId ?? "council"}`,
          kind: {
            AddMemberToRole: {
              member_id: memberId ?? accountId,
              role: roleId ?? "council",
            },
          },
        },
      },
      gas: gas,
      deposit: deposit,
    },
  ]);
};

// REMOVE MEMBER
const removeMember = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: `remove ${memberId ?? accountId} from ${
            roleId ?? "council"
          }`,
          kind: {
            RemoveMemberFromRole: {
              member_id: memberId ?? accountId,
              role: roleId ?? "council",
            },
          },
        },
      },
      gas: gas,
      deposit: deposit,
    },
  ]);
};

// POLL
const createPoll = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description,
          kind: "Vote",
        },
      },
      gas: gas,
      deposit: deposit,
    },
  ]);
};

// TRANSFER
const transferProposal = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: `transfer ${amount} ${token_id} to ${receiver_id}`,
          kind: {
            Transfer: {
              token_id,
              receiver_id,
              amount,
            },
          },
        },
      },
      gas: gas,
      deposit: deposit,
    },
  ]);
};

// BOUNTY PROPOSAL
const bountyProposal = () => {
  const bounty = {
    description,
    token,
    amount,
    times,
    max_deadline,
  };
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: `offer ${amount} ${token_id} (up to ${times} claims)`,
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

// BOUNTY CLAIM
const claimBounty = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "bounty_claim",
      args: {
        id: JSON.parse(bounty.id),
        deadline: bounty.max_deadline,
      },
      deposit: deposit,
      gas: gas,
    },
  ]);
};

// BOUNTY UNCLAIM
const unclaimBounty = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "bounty_giveup",
      args: {
        id: JSON.parse(bounty.id),
      },
      gas: gas,
    },
  ]);
};

// BOUNTY SUBMIT WORK
const submitBounty = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "work submitted",
          kind: {
            BountyDone: {
              receiver_id: accountId,
              bounty_id: JSON.parse(bounty.id),
            },
          },
        },
      },
      deposit: deposit,
      gas: gas,
    },
  ]);
};

// FUNCTION CALL
const createFunctionCallProposal = ({
  daoId,
  receiver_id,
  method_name,
  args,
}) => {
  const proposal_args = Buffer.from(JSON.stringify(args), "utf-8").toString(
    "base64"
  );
  addProposal({
    daoId,
    proposal: {
      description: `call ${method_name} to ${receiver_id}`,
      kind: {
        FunctionCall: {
          receiver_id,
          actions: [
            {
              method_name,
              args: proposal_args,
              deposit: "100000000000000000000000",
              gas: "219000000000000",
            },
          ],
        },
      },
    },
  });
};
function decodeArgs() {
  try {
    const args64 = proposal.kind["FunctionCall"].actions[0].args;
    const jsonArgs = JSON.parse(
      Buffer.from(args64, "base64").toString("utf-8")
    );
    return JSON.stringify(jsonArgs, undefined, 2);
  } catch {
    return "failed to deserialize";
  }
}

// VOTE
const actProposal = ({ daoId, proposal }) => {
  const policy = Near.view(daoId, "get_policy");

  if (policy === null) {
    return "Loading...";
  }

  const deposit = policy.proposal_bond;

  call({
    daoId,
    methodName: "act_proposal",
    args: {
      proposal,
    },
    deposit,
  });
};
function vote(action) {
  return Near.call(daoId, "act_proposal", {
    id: proposal.id,
    action,
  });
}
const handleApprove = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "act_proposal",
      args: {
        id: JSON.parse(proposal.id),
        action: "VoteApprove",
      },
      gas: gas,
    },
  ]);
};
const handleReject = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "act_proposal",
      args: {
        id: JSON.parse(proposal.id),
        action: "VoteReject",
      },
      gas: gas,
    },
  ]);
};
const handleSpam = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "act_proposal",
      args: {
        id: JSON.parse(proposal.id),
        action: "VoteRemove",
      },
      gas: gas,
    },
  ]);
};

// CREATE DAO POST
const create = (v) => {
  createFunctionCallProposal({
    daoId: "build.sputnik-dao.near",
    receiver_id: "social.near",
    method_name: "set",
    args: {
      data: {
        "build.sputnik-dao.near": {
          post: {
            main: JSON.stringify(v),
          },
          index: {
            post: JSON.stringify({
              key: "main",
              value: {
                type: "md",
              },
            }),
          },
        },
      },
    },
  });
};

return {
  daos,
  daoVersion,
  factory,
  policy,
  config,
  proposal,
  lastProposalId,
  proposals,
  groups,
  isMember,
  processPolicy,
  allowedRoles,
  bounty,
  claims,
  numberOfClaims,
  call,
  actions,
  proposalTypes,
  addProposal,
  createDao,
  addMember,
  removeMember,
  createPoll,
  transferProposal,
  bountyProposal,
  claimBounty,
  unclaimBounty,
  submitBounty,
  createFunctionCallProposal,
  create,
  decodeArgs,
  actProposal,
  vote,
  handleApprove,
  handleReject,
  handleSpam,
};
