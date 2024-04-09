const groupId = props.groupId ?? "6fd36ddf4884flm20pbe91e7b208b88d16";
const creatorId = props.creatorId ?? "*";

let members = Social.keys(`${creatorId}/graph/${groupId}/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

if (!members) {
  return "Loading...";
}

const groupKey = Object.keys(members)[0];

members = Object.entries(members[groupKey]?.graph[groupId] || {});
members.sort((a, b) => b[1] - a[1]);
return (
  <>
    {members.map(([accountId], i) => (
      <div key={i} className="d-flex justify-content-between mb-3">
        <div className="me-4">
          <Widget src="mob.near/widget/Profile" props={{ accountId }} />
        </div>
      </div>
    ))}
  </>
);