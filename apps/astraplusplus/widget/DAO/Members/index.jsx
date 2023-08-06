const daoId = props.daoId;

State.init({
  filterByRole,
});

const processPolicy = (policy) => {
  const obj = {
    policy,
    users: {},
    roles: {},
    everyone: {},
  };
  policy.roles.forEach((role) => {
    if (role.kind === "Everyone") {
      obj.everyone = role;
    }
    if (role.kind.Group) {
      if (!obj.roles[role.name]) {
        obj.roles[role.name] = role;
      }
      role.kind.Group.forEach((user) => {
        if (!obj.users[user]) {
          obj.users[user] = [];
        }

        obj.users[user].push(role.name);
      });
    }
  });

  return obj;
};

const policy = useCache(
  () =>
    Near.asyncView(daoId, "get_policy").then((policy) => processPolicy(policy)),
  daoId + "-policy",
  { subscribe: false },
);

if (policy === null) return "";

const isUserAllowedTo = (user, kind, action) => {
  const userRoles = policy.users[user] || ["Everyone"];

  let allowed = false;

  userRoles.forEach((role) => {
    let permissions = policy.roles[role].permissions;
    if (role === "Everyone") {
      permissions = policy.everyone.permissions;
    }
    const allowedRole =
      permissions.includes(`${kind.toString()}:${action.toString()}`) ||
      permissions.includes(`${kind.toString()}:*`) ||
      permissions.includes(`*:${action.toString()}`) ||
      permissions.includes("*:*");
    allowed = allowed || allowedRole;
    return allowedRole;
  });

  return allowed;
};

const onRemoveUserProposal = (memberId, roleId) => {
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "Remove DAO member",
          kind: {
            RemoveMemberFromRole: {
              member_id: memberId,
              role: roleId ?? "council",
            },
          },
        },
      },
      gas: 219000000000000,
      deposit: policy.policy.proposal_bond,
    },
  ]);
};

const Wrapper = styled.div`
  .userRow {
    width: 100%;
    @media screen and (min-width: 600px) {
      width: calc(50% - 1rem);
    }
    @media screen and (min-width: 1400px) {
      width: calc(33% - 1rem);
    }
  }
`;

const renderUserRow = (user, roles, i) => {
  return (
    <div key={i} className="ndc-card ratio ratio-1x1 userRow">
      <div className=" d-flex flex-column p-4">
        <Widget
          src="nearui.near/widget/Element.User"
          props={{
            accountId: user,
            options: {
              showHumanBadge: true,
              showImage: true,
              showSocialName: true,
            },
          }}
        />
        <div className="d-flex gap-1 mt-3 flex-wrap mb-3">
          {roles.map((role, i) => {
            return (
              <Widget
                src="nearui.near/widget/Input.Button"
                props={{
                  children: role,
                  size: "sm",
                  variant: "default",
                  className: "text-capitalize",
                }}
                key={i}
              />
            );
          })}
        </div>
        <div className="d-flex flex-column gap-2 mt-auto flex-wrap w-100">
          <Widget
            src="nearui.near/widget/Social.FollowButton"
            props={{
              accountId: user,
              size: "sm",
              className: "w-100",
            }}
          />
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: "Propose to Mint SBT",
              size: "sm",
              variant: ["secondary", "outline"],
              className: "w-100",
            }}
          />
          {isUserAllowedTo(
            context.accountId,
            "remove_member_from_role",
            "AddProposal",
          ) && (
            <Widget
              src="nearui.near/widget/Layout.Modal"
              props={{
                toggle: (
                  <Widget
                    src="nearui.near/widget/Input.Button"
                    props={{
                      children: "Propose to Remove",
                      size: "sm",
                      variant: ["danger", "outline"],
                      className: "w-100",
                    }}
                  />
                ),
                content: (
                  <div className="ndc-card p-4">
                    <Widget
                      src="nearui.near/widget/Input.Select"
                      props={{
                        label: "Propose to remove from role:",
                        options: roles.map((r) => {
                          return {
                            title: r,
                            value: r,
                          };
                        }),
                        onChange: (v) => State.update({ removeFromRole: v }),
                        value: state.removeFromRole,
                      }}
                    />
                    <Widget
                      src="nearui.near/widget/Input.Button"
                      props={{
                        children: "Propose to Remove",
                        size: "sm",
                        variant: ["danger"],
                        className: "w-100",
                        onClick: () =>
                          onRemoveUserProposal(user, state.removeFromRole),
                      }}
                    />
                  </div>
                ),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const renderGroups = () => {
  return (
    <div className="d-flex gap-2 flex-wrap">
      <Widget
        src="nearui.near/widget/Input.Button"
        props={{
          children: `all (${Object.keys(policy.users).length})`,
          size: "sm",
          variant: !state.filterByRole ? "primary" : "default",
          className: "text-capitalize",
          onClick: () =>
            State.update({
              filterByRole: null,
            }),
        }}
        key={i}
      />
      {Object.keys(policy.roles).map((role, i) => {
        return (
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: `${role} (${policy.roles[role].kind.Group.length})`,
              size: "sm",
              variant: state.filterByRole === role ? "primary" : "default",
              className: "text-capitalize",
              onClick: () =>
                State.update({
                  filterByRole: role,
                }),
            }}
            key={i}
          />
        );
      })}
    </div>
  );
};

const actions = {
  AddProposal: "create proposal",
  VoteApprove: "vote approve",
  VoteReject: "vote reject",
  VoteRemove: "vote remove",
};

const kinds = {
  config: "Change config",
  policy: "Change policy",
  add_member_to_role: "Add member to role",
  remove_member_from_role: "Remove member from role",
  call: "Call",
  upgrade_self: "Upgrade self",
  upgrade_remote: "Upgrade remote",
  transfer: "Transfer",
  set_vote_token: "Set staking contract",
  add_bounty: "Add bounty",
  bounty_done: "Bounty done",
  vote: "Vote",
  factory_info_update: "Factory info update",
  policy_add_or_update_role: "Change policy add or update role",
  policy_remove_role: "Change policy remove role",
  policy_update_default_vote_policy: "Change policy update default vote policy",
  policy_update_parameters: "Change policy update parameters",
  "*": "All types",
};

const renderPermissions = (role) => {
  const permissions = new Map();

  const rolePermissions =
    role === "all"
      ? policy.everyone?.permissions
      : policy.roles[role].permissions;

  rolePermissions?.forEach((p) => {
    const [kindKey, actionKey] = p.split(":");

    const kind = kinds[kindKey] || kindKey;
    const action = actions[actionKey] || actionKey;

    if (!permissions.has(action)) {
      permissions.set(action, new Set());
    }

    permissions.get(action).add(kind);
  });

  const filteredPermissions = new Map(
    [...permissions].filter(([action, kindsSet]) => kindsSet.size > 0),
  );

  const sortedPermissions = Array.from(filteredPermissions.entries()).sort(
    (a, b) => {
      if (a[0] === actions.AddProposal) {
        return -1;
      }
      if (b[0] === actions.AddProposal) {
        return 1;
      }
      return 0;
    },
  );

  return sortedPermissions.map(([action, kindsSet], i) => (
    <li key={i}>
      <span className="text-capitalize">{action}</span>{" "}
      {action === actions.AddProposal
        ? "of the following types:"
        : "on proposals of the following types:"}
      <ul>
        {Array.from(kindsSet).map((kind, j) => (
          <li key={j}>{kind}</li>
        ))}
      </ul>
    </li>
  ));
};

const users = !state.filterByRole
  ? Object.keys(policy.users)
  : Object.keys(policy.users).filter((user) =>
      policy.users[user].includes(state.filterByRole),
    );

return (
  <Wrapper className="d-flex flex-column gap-4">
    <h2>Members & Policy</h2>
    <div className="ndc-card p-4">
      <h4 className="mb-3 text-capitalize">Groups</h4>
      {renderGroups()}
      <div className="mt-4">
        <h4 className="mb-2 muted">
          <span className="text-capitalize">
            {state.filterByRole || "Everyone"}
          </span>{" "}
          have permission to:{" "}
        </h4>
        {renderPermissions(state.filterByRole || "all")}
      </div>
    </div>
    <div className="d-flex gap-4 flex-wrap">
      {users.map((user, i) => renderUserRow(user, policy.users[user], i))}
    </div>
  </Wrapper>
);
