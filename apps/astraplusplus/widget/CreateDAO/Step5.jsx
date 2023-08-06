const { formState, errors, renderFooter } = props;
const { accountId } = context;

const initialAnswers = {
  policy: formState.policy,
};

State.init({
  answers: initialAnswers,
});

// -- roles
const rolesArray = [...state.answers.policy.roles.map((role) => role.name)];

const proposalKinds = {
  ChangeDAOConfig: {
    title: "Change DAO Config",
    key: "config",
  },
  ChangeDAOPolicy: {
    title: "Change DAO Policy",
    key: "policy",
  },
  Bounty: {
    title: "Bounty",
    key: "add_bounty",
  },
  BountyDone: {
    title: "Bounty Done",
    key: "bounty_done",
  },
  Transfer: {
    title: "Transfer",
    key: "transfer",
  },
  Polls: {
    title: "Polls",
    key: "vote",
  },
  RemoveMembers: {
    title: "Remove Members",
    key: "remove_member_from_role",
  },
  AddMembers: {
    title: "Add Members",
    key: "add_member_to_role",
  },
  FunctionCall: {
    title: "Function Call",
    key: "call",
  },
  UpgradeSelf: {
    title: "Upgrade Self",
    key: "upgrade_self",
  },
  UpgradeRemote: {
    title: "Upgrade Remote",
    key: "upgrade_remote",
  },
  SetVoteToken: {
    title: "Set Vote Token",
    key: "set_vote_token",
  },
};

const proposalActions = {
  AddProposal: {
    title: "Add Proposal",
    key: "AddProposal",
  },
  VoteApprove: {
    title: "Vote Approve",
    key: "VoteApprove",
  },
  VoteReject: {
    title: "Vote Reject",
    key: "VoteReject",
  },
  VoteRemove: {
    title: "Vote Remove",
    key: "VoteRemove",
  },
};

const allActionArray = Object.keys(proposalActions).map(
  (key) => proposalActions[key].key,
);
const allProposalKindArray = Object.keys(proposalKinds).map(
  (key) => proposalKinds[key].key,
);

const hasPermission = (role, proposalKind, permissionType) => {
  const roleObj = state.answers.policy.roles.find((r) => r.name === role);

  if (roleObj) {
    const permission = `${proposalKind}:${permissionType}`;
    return roleObj.permissions.some(
      (p) =>
        p === permission ||
        p === "*:*" ||
        p === `${proposalKind}:*` ||
        p === `*:${permissionType}`,
    );
  } else {
    return false;
  }
};

const cleanPermissions = (permissions) => {
  // if there is a *:* permission, remove all other permissions
  if (permissions.includes("*:*")) return ["*:*"];

  // if there is a *:proposalAction, remove all other permissions with the same action except *:proposalAction
  allActionArray.forEach((action) => {
    if (permissions.some((p) => p === `*:${action}`)) {
      permissions = permissions.filter(
        (p) => !p.endsWith(`:${action}`) || p === `*:${action}`,
      );
    }
  });

  // if there is a proposalKind:*, remove all other permissions with the same proposalKind except proposalKind:*
  allProposalKindArray.forEach((kind) => {
    if (permissions.some((p) => p === `${kind}:*`)) {
      permissions = permissions.filter(
        (p) => !p.startsWith(`${kind}:`) || p === `${kind}:*`,
      );
    }
  });

  // Check for proposalKind:[allProposalActions], if true remove them and add proposalKind:*
  allProposalKindArray.forEach((kind) => {
    if (
      allActionArray.every((action) =>
        permissions.includes(`${kind}:${action}`),
      )
    ) {
      permissions = permissions.filter(
        (p) => !p.startsWith(`${kind}:`) || p === `${kind}:*`,
      );
      permissions.push(`${kind}:*`);
    }
  });

  // Check for [allProposalKinds]:proposalAction, if true remove them and add *:proposalAction
  allActionArray.forEach((action) => {
    if (
      allProposalKindArray.every((kind) =>
        permissions.includes(`${kind}:${action}`),
      )
    ) {
      permissions = permissions.filter(
        (p) => !p.endsWith(`:${action}`) || p === `*:${action}`,
      );
      permissions.push(`*:${action}`);
    }
  });

  // if there is a [allProposalKinds]:[allProposalActions], remove all other permissions and add *:*
  if (
    allProposalKindArray.every((kind) => permissions.includes(`${kind}:*`)) &&
    allActionArray.every((action) => permissions.includes(`*:${action}`))
  ) {
    permissions = ["*:*"];
  }

  return permissions;
};

const popActionWildCard = (permissions) => {
  let expandedPermissions = [];
  permissions.forEach((permission) => {
    const [proposalKind, action] = permission.split(":");
    if (action === "*") {
      expandedPermissions.push(
        ...allActionArray.map((a) => `${proposalKind}:${a}`),
      );
    } else {
      expandedPermissions.push(permission);
    }
  });
  return [...new Set(expandedPermissions)]; // Remove duplicates
};

const popProposalKindWildCard = (permissions) => {
  let expandedPermissions = [];
  permissions.forEach((permission) => {
    const [proposalKind, action] = permission.split(":");
    if (proposalKind === "*") {
      expandedPermissions.push(
        ...allProposalKindArray.map((k) => `${k}:${action}`),
      );
    } else {
      expandedPermissions.push(permission);
    }
  });
  return [...new Set(expandedPermissions)]; // Remove duplicates
};

const popAllWildCards = (permissions) => {
  permissions = popActionWildCard(permissions);
  permissions = popProposalKindWildCard(permissions);
  return permissions;
};

const setPermission = (role, proposalKind, permissionType, value) => {
  const roleObj = role;

  const permission = `${proposalKind}:${permissionType}`;

  // if true add permission
  if (value) {
    // if permission already exists or there is a wildcard, do nothing
    if (hasPermission(role.name, proposalKind, permissionType)) {
      return roleObj;
    }
    // if permission does not exist, add it
    roleObj.permissions.push(permission);
    // clean up permissions and add wildcards if needed
    roleObj.permissions = cleanPermissions(roleObj.permissions);
  }
  // if false remove permission
  else {
    // if permission does not exist, do nothing
    if (!hasPermission(role.name, proposalKind, permissionType)) {
      return roleObj;
    }
    // if permission exists, make sure to pop all wildcards
    roleObj.permissions = popAllWildCards(roleObj.permissions);
    // remove permission
    roleObj.permissions = roleObj.permissions.filter((p) => p !== permission);
    // clean up permissions and add wildcards back if needed
    roleObj.permissions = cleanPermissions(roleObj.permissions);
  }
  return roleObj;
};

const setCreatePermission = (roleName, proposalKind, value) => {
  const role = state.answers.policy.roles.find((r) => r.name === roleName);

  const newRole = setPermission(role, proposalKind, "AddProposal", value);

  const newRoles = state.answers.policy.roles.map((r) =>
    r.name === roleName ? newRole : r,
  );

  State.update({
    answers: {
      ...state.answers,
      policy: {
        ...state.answers.policy,
        roles: newRoles,
      },
    },
  });
};

const setVotePermission = (roleName, proposalKind, value) => {
  const role = state.answers.policy.roles.find((r) => r.name === roleName);

  let newRole = setPermission(role, proposalKind, "VoteApprove", value);
  newRole = setPermission(newRole, proposalKind, "VoteReject", value);
  newRole = setPermission(newRole, proposalKind, "VoteRemove", value);

  const newRoles = state.answers.policy.roles.map((r) =>
    r.name === roleName ? newRole : r,
  );

  State.update({
    answers: {
      ...state.answers,
      policy: {
        ...state.answers.policy,
        roles: newRoles,
      },
    },
  });
};

const Table = styled.ul`
  border-radius: 4px;
  width: 100%;
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  position: relative;

  li {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(100px, 2fr) repeat(
        auto-fit,
        minmax(100px, 1fr)
      );
    grid-auto-flow: column;
    grid-auto-columns: minmax(100px, 1fr);
    max-width: 100%;
    align-items: center;
    padding: 16px;
    justify-items: center;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid #eee;

    & > *:first-child {
      justify-self: flex-start;
      display: block;
    }

    &:first-child {
      border-color: #4498e0;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  p {
    font-size: 0.8rem;
    color: #666;
    margin: 0;
  }

  li .label {
    display: none;
  }

  .cbx:not(:last-child) {
    margin-right: 0 !important;
  }

  @media (max-width: 600px) {
    li {
      display: flex;
      flex-wrap: wrap;
    }
    li > div:first-child {
      margin-bottom: 1rem;
      flex: 1;
      min-width: 100%;
    }
    li .label {
      display: block;
    }

    .cbx:not(:last-child) {
      margin-right: 6px !important;
    }
    .hide-on-mobile {
      display: none;
    }
  }
`;

const renderTable = (roles, rows, action) => {
  return (
    <Table>
      <li className="fw-bold">
        <span>Actions</span>
        {roles.map((role) => (
          <span className="hide-on-mobile">{role}</span>
        ))}
      </li>
      {Object.keys(rows).map((key) => (
        <li>
          <div>{rows[key].title}</div>
          {roles.map((role) => (
            <Widget
              src="nearui.near/widget/Input.Checkbox"
              props={{
                label: role,
                onChange: (checked) => {
                  if (action === "Vote") {
                    setVotePermission(role, rows[key].key, checked);
                  } else if (action === "AddProposal") {
                    setCreatePermission(role, rows[key].key, checked);
                  }
                },
                checked:
                  action === "Vote"
                    ? hasPermission(role, rows[key].key, "VoteApprove") ||
                      hasPermission(role, rows[key].key, "VoteReject") ||
                      hasPermission(role, rows[key].key, "VoteRemove")
                    : hasPermission(role, rows[key].key, action),
              }}
            />
          ))}
        </li>
      ))}
    </Table>
  );
};

return (
  <div className="mt-4 ndc-card p-4">
    <div className="d-flex flex-column gap-4">
      <h2 className="h5 fw-bold mb-2">
        <span
          className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bolder h5 me-2"
          style={{
            width: "48px",
            height: "48px",
            border: "1px solid #82E299",
          }}
        >
          5
        </span>
        Proposal and permissions
      </h2>

      <div>
        <h3 className="h6 fw-bold mb-0">Proposal creation</h3>
        <p className="text-black-50 fw-light small">
          Choose what creation rights you give DAO groups. This can be changed
          in settings later.
        </p>
        {renderTable(rolesArray, proposalKinds, "AddProposal")}
      </div>

      <div>
        <h3 className="h6 fw-bold mb-0">Voting Permissions</h3>
        <p className="text-black-50 fw-light small">
          Choose what voting permissions you give DAO groups.
        </p>
        {renderTable(rolesArray, proposalKinds, "Vote")}
      </div>
    </div>

    {renderFooter(state.answers)}
  </div>
);
