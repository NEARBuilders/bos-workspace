const accountId = props.accountId ?? context.accountId;
const groupId = props.groupId ?? "526fb256e74eelmf0nw3n5909bc189c13d";
const creatorId = props.creatorId ?? "devs.near";

if (!accountId) {
  return "";
}

const contributors = Social.keys(`${creatorId}/graph/${groupId}/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

const community = Social.keys(`*/graph/${groupId}/${accountId}`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

const numContributors = contributors
  ? Object.keys(contributors[accountId].graph[groupId] || {}).length
  : null;
const numCommunity = community ? Object.keys(community || {}).length : null;

return (
  <div>
    <div className="d-flex flex-row">
      <div className="me-4">
        <a
          href={`#/devs.near/widget/group?groupId=${groupId}&tab=contributors`}
          className="text-dark"
        >
          {numContributors !== null ? (
            <span className="fw-bolder">{numContributors}</span>
          ) : (
            "?"
          )}{" "}
          <span className="text-muted">Contributors</span>
        </a>
      </div>
      <div>
        <a
          href={`#/devs.near/widget/group?groupId=${groupId}&tab=community`}
          className="text-dark"
        >
          {numCommunity !== null ? (
            <span className="fw-bolder">{numCommunity}</span>
          ) : (
            "?"
          )}{" "}
          <span className="text-muted">Member{numCommunity !== 1 && "s"}</span>
        </a>
      </div>
    </div>
  </div>
);