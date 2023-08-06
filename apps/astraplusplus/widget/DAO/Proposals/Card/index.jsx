const multiSelectMode = props.multiSelectMode ?? false;
const { proposalString, proposalId, daoId } = props;
const accountId = context.accountId;

const proposal = proposalString ? JSON.parse(proposalString) : null;


let roles = Near.view(daoId, "get_policy");

if (roles === null)
return <Widget src="/*__@appAccount__*//widget/DAO.Proposals.Card.skeleton" />;


let new_proposal = null;
if (!proposalString && proposalId && daoId) {
  new_proposal = Near.view(daoId, "get_proposal", {
    id: Number(proposalId),
  });
  if (new_proposal === null) {
    return <Widget src="/*__@appAccount__*//widget/DAO.Proposals.Card.skeleton" />;
  } else if (!new_proposal) {
    return "Proposal not found, check console for details.";
  }
} else if (!proposalString) {
  return "Please provide a daoId and a proposal or proposalId.";
}

const expensiveWork = () => {
  let my_proposal = new_proposal ? new_proposal : proposal;

  // --- check user permissions
  const proposalKinds = {
    ChangeConfig: "config",
    ChangePolicy: "policy",
    AddMemberToRole: "add_member_to_role",
    RemoveMemberFromRole: "remove_member_from_role",
    FunctionCall: "call",
    UpgradeSelf: "upgrade_self",
    UpgradeRemote: "upgrade_remote",
    Transfer: "transfer",
    SetStakingContract: "set_vote_token",
    AddBounty: "add_bounty",
    BountyDone: "bounty_done",
    Vote: "vote",
    FactoryInfoUpdate: "factory_info_update",
    ChangePolicyAddOrUpdateRole: "policy_add_or_update_role",
    ChangePolicyRemoveRole: "policy_remove_role",
    ChangePolicyUpdateDefaultVotePolicy: "policy_update_default_vote_policy",
    ChangePolicyUpdateParameters: "policy_update_parameters",
  };

  const actions = {
    AddProposal: "AddProposal",
    VoteApprove: "VoteApprove",
    VoteReject: "VoteReject",
    VoteRemove: "VoteRemove",
  };

  // -- Get all the roles from the DAO policy
  roles = roles === null ? [] : roles.roles;

  // -- Filter the user roles
  const userRoles = [];
  for (const role of roles) {
    if (role.kind === "Everyone") {
      userRoles.push(role);
      continue;
    }
    if (!role.kind.Group) continue;
    if (accountId && role.kind.Group && role.kind.Group.includes(accountId)) {
      userRoles.push(role);
    }
  }

  const isAllowedTo = (kind, action) => {
    // -- Check if the user is allowed to perform the action
    let allowed = false;
    userRoles
      .filter(({ permissions }) => {
        const allowedRole =
          permissions.includes(`${kind.toString()}:${action.toString()}`) ||
          permissions.includes(`${kind.toString()}:*`) ||
          permissions.includes(`*:${action.toString()}`) ||
          permissions.includes("*:*");
        allowed = allowed || allowedRole;
        return allowedRole;
      })
      .map((role) => role.name);
    return allowed;
  };

  const kindName =
    typeof proposal.kind === "string"
      ? proposal.kind
      : Object.keys(proposal.kind)[0];

  const isAllowedToVote = [
    isAllowedTo(proposalKinds[kindName], actions.VoteApprove),
    isAllowedTo(proposalKinds[kindName], actions.VoteReject),
    isAllowedTo(proposalKinds[kindName], actions.VoteRemove),
  ];

  // --- end check user permissions

  my_proposal.typeName = kindName.replace(/([A-Z])/g, " $1").trim(); // Add spaces between camelCase
  my_proposal.statusName = proposal.status.replace(/([A-Z])/g, " $1").trim();

  if (!state) {
    State.init({
      proposal: my_proposal,
      isAllowedToVote,
    });
  } else {
    State.update({
      proposal: my_proposal,
      isAllowedToVote,
    });
  }
};

if (!state || state.proposal.id !== proposal.id) {
  // Only execute expensive work once
  expensiveWork();
  return <Widget src="/*__@appAccount__*//widget/DAO.Proposals.Card.skeleton" />;
}

return (
  <Widget
    src="/*__@appAccount__*//widget/DAO.Proposals.Card.ui"
    props={{
      proposal: state.proposal,
      isAllowedToVote: state.isAllowedToVote,
      multiSelectMode,
      daoId,
    }}
  />
);
