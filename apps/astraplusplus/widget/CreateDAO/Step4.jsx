const { formState, errors, renderFooter } = props;
const { accountId } = context;

const initialAnswers = {
  policy: formState.policy,
};

// not using formState because, the formState doesn't match the ui state

const initialMembers = [];

for (const role of initialAnswers.policy.roles) {
  if (!role.kind.Group) continue;
  for (const member of role.kind.Group) {
    initialMembers.push({
      role: role.name,
      name: member,
    });
  }
}

const initialState = {
  roles: initialAnswers.policy.roles.length
    ? initialAnswers.policy.roles.map((r) => r.name)
    : ["all", "council"],
  members: initialMembers.length
    ? initialMembers
    : [{ role: "council", name: accountId }],
};

State.init({
  answers: initialState,
});

// -- roles
const onAddEmptyRole = () => {
  State.update({
    answers: {
      ...state.answers,
      roles: [...state.answers.roles, ""],
    },
  });
};

const onRemoveRole = (index) => {
  State.update({
    answers: {
      ...state.answers,
      roles: state.answers.roles.map((role, i) => (i === index ? null : role)),
    },
  });
};

const onSetRoleName = (index, name) => {
  State.update({
    answers: {
      ...state.answers,
      roles: state.answers.roles.map((role, i) => (i === index ? name : role)),
    },
  });
};

// -- members
const onAddEmptyMember = () => {
  State.update({
    answers: {
      ...state.answers,
      members: [
        ...state.answers.members,
        { name: "", role: state.answers.roles[0] },
      ],
    },
  });
};

const onRemoveMember = (index) => {
  State.update({
    answers: {
      ...state.answers,
      members: state.answers.members.map((member, i) =>
        i === index ? null : member,
      ),
    },
  });
};

const onSetMemberName = (index, name) => {
  State.update({
    answers: {
      ...state.answers,
      members: state.answers.members.map((member, i) =>
        i === index ? { ...member, name } : member,
      ),
    },
  });
};

const onSetMemberRole = (index, role) => {
  State.update({
    answers: {
      ...state.answers,
      members: state.answers.members.map((member, i) =>
        i === index ? { ...member, role } : member,
      ),
    },
  });
};

// Make the state back to formState format
const finalState = {
  policy: {
    ...formState.policy,
    roles: state.answers.roles
      .filter((role, i) => role !== null && role !== "")
      .map((role, i) => {
        if (role === "all")
          return {
            name: role,
            permissions: formState.policy.roles[i]?.permissions || [],
            kind: "Everyone",
            vote_policy: formState.policy.roles[i]?.vote_policy || {},
          };
        return {
          name: role,
          kind: {
            Group: state.answers.members
              .filter((m) => m.role === role && m !== null && m.name !== "")
              .map((m) => m.name),
          },
          permissions:
            formState.policy.roles[i]?.permissions || role === "council"
              ? ["*:*"]
              : [],
          vote_policy: formState.policy.roles[i]?.vote_policy || {},
        };
      }),
  },
};

return (
  <div className="mt-4 ndc-card p-4">
    <div className="d-flex flex-column gap-4">
      <h2 className="h5 fw-bold">
        <span
          className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bolder h5 me-2"
          style={{
            width: "48px",
            height: "48px",
            border: "1px solid #82E299",
          }}
        >
          4
        </span>
        Add Groups & Members
      </h2>

      <div className="mb-3">
        <div className="d-flex gap-2 justify-content-between">
          <div>
            <h3 className="h6 fw-bold">Add Groups</h3>
            <p className="text-black-50 fw-light small">
              Adding groups to DAO during creation is not supported using web
              based wallets. Anyway, you can add more groups later in DAO
              settings
            </p>
          </div>
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-plus-lg" />,
              variant: "icon info outline",
              size: "lg",
              onClick: onAddEmptyRole,
            }}
          />
        </div>
        {state.answers.roles.map((r, i) => (
          <div
            className={[
              "d-flex align-items-center gap-2 mt-2",
              r === null ? "d-none" : "",
            ].join(" ")}
            key={i}
          >
            <Widget
              src="nearui.near/widget/Input.ExperimentalText"
              props={{
                placeholder: "Group 1",
                size: "lg",
                disabled: i < 2,
                value: i < 2 ? r : undefined,
                onChange: (v) => onSetRoleName(i, v),
                useTimeout: true,
                error:
                  errors.policy.roles[
                    finalState.policy.roles.findIndex((role) => role.name === r)
                  ].name,

                inputProps: { defaultValue: r },
              }}
            />
            {i > 1 && (
              <Widget
                src="nearui.near/widget/Input.Button"
                props={{
                  children: <i className="bi bi-trash" />,
                  variant: "icon danger outline",
                  size: "lg",
                  onClick: () => onRemoveRole(i),
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div>
        <div className="d-flex gap-2 justify-content-between">
          <div>
            <h3 className="h6 fw-bold">Add Members</h3>
            <p className="text-black-50 fw-light small">
              Add members to the DAO and set their{" "}
              <a
                href=""
                target="_blank"
                style={{
                  color: "#4498E0",
                }}
              >
                roles
              </a>
              .
            </p>
          </div>
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-plus-lg" />,
              variant: "icon info outline",
              size: "lg",
              onClick: onAddEmptyMember,
            }}
          />
        </div>

        {state.answers.members.map((member, i) => {
          const trueRoleIndex =
            member !== null &&
            finalState.policy.roles.findIndex(
              (role) => role.name === member.role,
            );
          const trueMemberIndex =
            member !== null &&
            trueRoleIndex !== -1 &&
            typeof finalState.policy.roles[trueRoleIndex].kind === "object"
              ? finalState.policy.roles[trueRoleIndex].kind.Group.findIndex(
                  (m) => m === member.name,
                )
              : null;

          return (
            <div
              className={[
                "d-flex align-items-center gap-2 mt-2",
                member === null ? "d-none" : "",
              ].join(" ")}
              key={i}
            >
              <Widget
                src="nearui.near/widget/Input.ExperimentalText"
                props={{
                  placeholder: "user.near",
                  size: "lg",
                  useTimeout: true,
                  inputProps: { defaultValue: member.name },
                  onChange: (v) => onSetMemberName(i, v),
                  disabled: i === 0,
                  error:
                    trueMemberIndex !== null &&
                    errors.policy.roles[trueRoleIndex].kind.Group[
                      trueMemberIndex
                    ],
                }}
              />
              <Widget
                src="nearui.near/widget/Input.Select"
                props={{
                  placeholder: "Role",
                  size: "lg",
                  options: state.answers.roles
                    .filter((r) => r !== null && r !== "" && r !== "all")
                    .map((r) => ({
                      title: r,
                      value: r,
                    })),
                  value: member.role,
                  onChange: (v) => onSetMemberRole(i, v),
                  disabled: i === 0,
                }}
              />
              {i > 0 && (
                <Widget
                  src="nearui.near/widget/Input.Button"
                  props={{
                    children: <i className="bi bi-trash" />,
                    variant: "icon danger outline",
                    size: "lg",
                    onClick: () => onRemoveMember(i),
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>

    {renderFooter(finalState)}
  </div>
);
