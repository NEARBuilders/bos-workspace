if (
  !props.accountId ||
  !context.accountId ||
  context.accountId === props.accountId
) {
  return "";
}

const joinEdge = Social.keys(
  `${context.accountId}/graph/connect/${props.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const inverseEdge = Social.keys(
  `${props.accountId}/graph/connect/${context.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const loading = joinEdge === null || inverseEdge === null;
const join = joinEdge && Object.keys(joinEdge).length;
const inverse = inverseEdge && Object.keys(inverseEdge).length;

const type = join ? "leave" : "join";

const data = {
  graph: { join: { [props.accountId]: join ? null : "" } },
  index: {
    graph: JSON.stringify({
      key: "join",
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
  <CommitButton
    disabled={loading}
    className={`btn ${loading || join ? "btn-outline-dark" : "btn-primary"}`}
    data={data}
  >
    {loading ? "Loading" : join ? "Members" : inverse ? "Connect" : "Join"}
  </CommitButton>
);
