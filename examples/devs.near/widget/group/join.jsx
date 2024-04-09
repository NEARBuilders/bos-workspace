const accountId = props.accountId ?? context.accountId;
const groupId = props.groupId ?? "f8ad9d1a76259lmdpjnd74e69162a0a014";
const creatorId = props.creatorId ?? "hack.near";

if (!props.accountId && !context.accountId) {
  return "";
}

const joinEdge = Social.keys(
  `${context.accountId}/graph/${groupId}/${context.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const memberEdge = Social.keys(
  `${creatorId}/graph/${groupId}/${context.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const loading = joinEdge === null || memberEdge === null;
const join = joinEdge && Object.keys(joinEdge).length;
const inverse = memberEdge && Object.keys(memberEdge).length;

const type = join ? "leave" : "join";

const handleJoin = () => {
  Social.set({
    graph: { [groupId]: { [accountId]: join ? null : "" } },
    index: {
      graph: JSON.stringify({
        key: groupId,
        value: {
          type,
          accountId,
        },
      }),
      notify: JSON.stringify([
        {
          key: creatorId,
          value: {
            type,
            accountId,
          },
        },
      ]),
    },
  });
};

return (
  <>
    <button
      disabled={loading}
      className={`btn ${
        loading || join ? "btn-outline-secondary" : "btn-outline-dark"
      }`}
      onClick={handleJoin}
    >
      {loading ? "loading" : join ? "leave" : member ? "accept" : "join"}
    </button>
  </>
);