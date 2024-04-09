const accountId = "devs.near";

let following = Social.keys(`${accountId}/graph/follow/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

if (following === null) {
  return "Loading";
}

following = Object.entries(following[accountId].graph.follow || {});
following.sort((a, b) => b[1] - a[1]);

return (
  <div>
    <h5>Connect</h5>
    <div className="mb-2">
      <Widget
        src="mob.near/widget/ProfileSearch"
        props={{
          limit: 10,
          onChange: ({ result }) => State.update({ profiles: result }),
        }}
      />
    </div>
    {state.profiles && state.profiles.length > 0 && (
      <div className="mb-2">
        {state.profiles.map(({ accountId }, i) => (
          <div
            key={i}
            className="d-flex justify-content-between align-items-center mb-3"
          >
            <div className="me-2 text-truncate">
              <a
                href={`#/mob.near/widget/ProfilePage?accountId=${accountId}`}
                className="text-decoration-none link-dark text-truncate"
              >
                <Widget
                  src="mob.near/widget/Profile.InlineBlock"
                  props={{ accountId }}
                />
              </a>
            </div>
            <div className="d-none text-nowrap d-md-block">
              <Widget
                src="mob.near/widget/FollowButton"
                props={{ accountId }}
              />
            </div>
          </div>
        ))}
        <hr />
      </div>
    )}
    {following.map(([accountId], i) => (
      <a
        className="d-flex flex-wrap gap-1"
        href={`#/mob.near/widget/ProfilePage?accountId=${accountId}`}
        className="text-decoration-none"
        key={i}
      >
        <Widget
          src="mob.near/widget/ProfileImage"
          props={{
            accountId,
            tooltip: true,
            className: "d-inline-block m-1 overflow-hidden",
          }}
        />
      </a>
    ))}
  </div>
);
