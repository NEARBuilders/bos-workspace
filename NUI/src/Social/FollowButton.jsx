if (
  !props.accountId ||
  !context.accountId ||
  context.accountId === props.accountId
) {
  return "";
}

State.init({
  loading: false,
});

const followEdge = Social.keys(
  `${context.accountId}/graph/follow/${props.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const inverseEdge = Social.keys(
  `${props.accountId}/graph/follow/${context.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const loading = followEdge === null || inverseEdge === null;
const isFollowing = Object.keys(followEdge || {}).length > 0;
const isInverse = Object.keys(inverseEdge || {}).length > 0;

const type = follow ? "unfollow" : "follow";

const data = {
  graph: { follow: { [props.accountId]: isFollowing ? null : "" } },
  index: {
    graph: JSON.stringify({
      key: "follow",
      value: {
        type,
        accountId: props.accountId,
      },
    }),
    notify: JSON.stringify({
      key: props.accountId,
      value: {
        type,
      },
    }),
  },
};

return (
  <Widget
    src="nui.sking.near/widget/Input.Button"
    props={{
      children: (
        <>
          {isFollowing && <i className="bi bi-check-lg"></i>}
          {isFollowing ? "Following" : isInverse ? "Follow Back" : "Follow"}
        </>
      ),
      variant: props.variant ?? (isFollowing ? [] : ["secondary"]),
      disabled: props.disabled ?? loading,
      onClick: () => {
        State.update({ loading: true });
        Social.set(data, {
          force: true,
          onCommit: () => {
            State.update({ loading: false });
          },
          onCancel: () => {
            State.update({ loading: false });
          },
        });
      },
      ...props,
    }}
  />
);
