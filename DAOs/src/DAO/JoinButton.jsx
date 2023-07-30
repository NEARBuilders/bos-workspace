const accountId = context.accountId;
const daoId = props.daoId ?? "multi.sputnik-dao.near";
const role = props.role ?? "council";

const handleProposal = () => {
  const gas = 200000000000000;
  const deposit = 100000000000000000000000;
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "potential member",
          kind: {
            AddMemberToRole: {
              member_id: accountId,
              role: role,
            },
          },
        },
      },
      gas: gas,
      deposit: deposit,
    },
  ]);
};

return (
  <div>
    <button className="btn btn-success" onClick={handleProposal}>
      Join
    </button>
  </div>
);
