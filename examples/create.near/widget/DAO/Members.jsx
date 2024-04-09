const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "build.sputnik-dao.near";

const policy = Near.view(daoId, "get_policy");

if (!policy) {
  return "Loading...";
}

const groups = policy.roles
  .filter((role) => role.kind.Group)
  .map((role) => ({
    name: role.name,
    members: role.kind.Group,
  }));

return (
  <div>
    {groups.map((group, i) => (
      <div key={i}>
        <h3>{group.name}</h3>
        {group.members.map((member, j) => (
          <div className="d-flex justify-content-between mb-3">
            <div className="me-3">
              <Widget
                key={j}
                src="mob.near/widget/Profile"
                props={{ accountId: member }}
              />
            </div>
            <div className>
              <Widget
                src="hack.near/widget/DAO.RemoveMember"
                props={{ daoId, memberId: member, roleId: group.name }}
              />
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
);
