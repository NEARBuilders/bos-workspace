const accountId = props.accountId;

if (!accountId) {
  return "";
}

const leaders = Social.keys(`${accountId}/graph/connect/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

const members = Social.keys(`*/graph/connect/${accountId}`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

const numLeaders = leaders
  ? Object.keys(leaders[accountId].graph.connect || {}).length
  : null;
const numMembers = members ? Object.keys(members || {}).length : null;

return (
  <div>
    <div className="d-flex flex-row">
      <div className="me-4">
        <a
          href={`#/create.near/widget/JoinPage?accountId=${accountId}&tab=leaders`}
          className="text-dark"
        >
          {numLeaders !== null ? (
            <span className="fw-bolder">{numLeaders}</span>
          ) : (
            "?"
          )}{" "}
          <span className="text-muted">Leaders</span>
        </a>
      </div>
      <div>
        <a
          href={`#/create.near/widget/JoinPage?accountId=${accountId}&tab=members`}
          className="text-dark"
        >
          {numMembers !== null ? (
            <span className="fw-bolder">{numMembers}</span>
          ) : (
            "?"
          )}{" "}
          <span className="text-muted">Member{numMembers !== 1 && "s"}</span>
        </a>
      </div>
    </div>
  </div>
);
