const accountId = props.accountId ?? context.accountId;
if (!accountId) {
  return "Please log in with NEAR :)";
}

let following = Social.keys(`${accountId}/graph/follow/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

if (following === null) {
  return "Loading...";
}

following = Object.entries(following[accountId].graph.follow || {});
following.sort((a, b) => b[1] - a[1]);

console.log(following);

return (
  <>
    {following.map(([accountId]) => (
      <div className="d-flex justify-content-between mb-3">
        <div className="me-4">
          <Widget src="mob.near/widget/Profile" props={{ accountId }} />
        </div>
        <div>
          <Widget src="mob.near/widget/FollowButton" props={{ accountId }} />
        </div>
      </div>
    ))}
  </>
);
