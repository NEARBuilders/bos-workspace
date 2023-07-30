const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "multi.sputnik-dao.near";
const groupId = props.groupId ?? "council";

const group2Id = props.group2Id ?? "community";
const policy = Near.view(daoId, "get_policy");

const group = policy.roles
  .filter((role) => role.name === groupId)
  .map((role) => {
    const group = role.kind.Group;

    return group;
  });

const group2 = policy.roles
  .filter((role) => role.name === group2Id)
  .map((role) => {
    const group2 = role.kind.Group;

    return group2;
  });

return (
  <>
    <div>
      <h3>{groupId}</h3>
      <div>
        {group.map((members, i) => (
          <div key={i}>
            {members.map((member, j) => (
              <a
                key={j}
                className="text-decoration-none"
                href={`#mob.near/widget/ProfilePage?accountId=${member}`}
              >
                <h4>{member}</h4>
              </a>
            ))}
          </div>
        ))}
      </div>

      <h3>{group2Id}</h3>
      <div>
        {group2.map((members, i) => (
          <div key={i}>
            {members.map((member, j) => (
              <a
                key={j}
                className="text-decoration-none"
                href={`#mob.near/widget/ProfilePage?accountId=${member}`}
              >
                <h4>{member}</h4>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  </>
);
