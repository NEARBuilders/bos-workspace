const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "multi.sputnik-dao.near";

const policy = Near.view(daoId, "get_policy");

if (policy === null) {
  return "";
}

const deposit = policy.proposal_bond;

const followEdge = Social.keys(
  `${accountId}/graph/follow/${daoId}`,
  undefined,
  {
    values_only: true,
  }
);

const inverseEdge = Social.keys(
  `${daoId}/graph/follow/${accountId}`,
  undefined,
  {
    values_only: true,
  }
);

const loading = followEdge === null || inverseEdge === null;
const isFollowing = Object.keys(followEdge || {}).length > 0;
const isInverse = Object.keys(inverseEdge || {}).length > 0;

const type = follow ? "unfollow" : "follow";

const follow_args = JSON.stringify({
  data: {
    [daoId]: {
      graph: {
        follow: {
          [accountId]: "",
        },
      },
      index: {
        graph: {
          key: follow,
          value: {
            type: follow,
            accountId: [accountId],
          },
        },
        notify: {
          key: [accountId],
          value: {
            type: follow,
          },
        },
      },
    },
  },
});

const proposal_args = Buffer.from(follow_args, "utf-8").toString("base64");

const handleProposal = () => {
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "connection request",
          kind: {
            FunctionCall: {
              receiver_id: "social.near",
              actions: [
                {
                  method_name: "set",
                  args: proposal_args,
                  deposit: "80000000000000000000000",
                  gas: "219000000000000",
                },
              ],
            },
          },
        },
      },
      deposit: deposit,
      gas: "219000000000000",
    },
  ]);
};

return (
  <button className="btn btn-outline-success" onClick={handleProposal}>
    {isFollowing && <i className="bi-16 bi bi-check"></i>}
    {isFollowing ? "Member" : isInverse ? "Join" : "Connect"}
  </button>
);
