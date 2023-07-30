if (!props.daoId || !context.accountId || context.accountId === props.daoId) {
  return "";
}

const followEdge = Social.keys(
  `${context.accountId}/graph/follow/${props.daoId}`,
  undefined,
  {
    values_only: true,
  }
);

const inverseEdge = Social.keys(
  `${props.daoId}/graph/follow/${context.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const loading = followEdge === null || inverseEdge === null;
const follow = followEdge && Object.keys(followEdge).length;
const inverse = inverseEdge && Object.keys(inverseEdge).length;

const type = follow ? "unfollow" : "follow";

const data = {
  graph: { follow: { [props.daoId]: follow ? null : "" } },
  index: {
    graph: JSON.stringify({
      key: "follow",
      value: {
        type,
        accountId: props.daoId,
      },
    }),
    notify: JSON.stringify({
      key: props.daoId,
      value: {
        type,
      },
    }),
  },
};

return (
  <CommitButton
    disabled={loading}
    className={`btn ${loading || follow ? "btn-outline-dark" : "btn-primary"}`}
    data={data}
  >
    {loading
      ? "Loading"
      : follow
      ? "Following"
      : inverse
      ? "Follow back"
      : "Follow"}
  </CommitButton>
);
