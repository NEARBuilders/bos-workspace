const call = ({ daoId, methodName, args, deposit }) => {
  Near.call([
    {
      contractName: daoId,
      methodName,
      args,
      deposit: deposit,
      gas: "219000000000000",
    },
  ]);
};

const addProposal = ({ daoId, proposal }) => {
  const policy = Near.view(daoId, "get_policy");

  if (policy === null) {
    return "Loading..."; // lol what does this do...
  }

  const deposit = policy.proposal_bond;

  call({
    daoId,
    methodName: "add_proposal",
    args: {
      proposal,
    },
    deposit,
  });
};

const createFunctionCallProposal = ({
  daoId,
  receiver_id,
  method_name,
  args,
}) => {
  const proposal_args = Buffer.from(JSON.stringify(args), "utf-8").toString("base64");
  addProposal({
    daoId,
    proposal: {
      description: `call ${method_name} to ${receiver_id}`,
      kind: {
        FunctionCall: {
          receiver_id,
          actions: [
            {
              method_name,
              args: proposal_args,
              deposit: "100000000000000000000000",
              gas: "219000000000000",
            },
          ],
        },
      },
    },
  });
};

const create = (v) => {
  createFunctionCallProposal({
    daoId: "build.sputnik-dao.near",
    receiver_id: "social.near",
    method_name: "set",
    args: {
      data: {
        "build.sputnik-dao.near": {
          post: {
            main: JSON.stringify(v),
          },
          index: {
            post: JSON.stringify({
              key: "main",
              value: {
                type: "md",
              },
            }),
          },
        },
      },
    },
  })
};

return { createFunctionCallProposal, create };
