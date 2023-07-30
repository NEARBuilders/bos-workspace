const transfer = props.transfer;
const daoId = props.daoId;
const type = props.type;

const direction = transfer.sender == daoId ? "out" : "in";
const explorerUrl = "https://explorer.near.org";

// convert timestamp from ns to ms
const timestampMillis = Big(transfer.timestamp).div(1000000);
const date = new Date(timestampMillis.toNumber()).toLocaleString();

const ellipsis = (str, length) => {
  if (str.length <= length) {
    return str;
  }
  const mid = Math.floor(length / 2);
  return str.slice(0, mid) + "..." + str.slice(str.length - mid);
};

let proposalId = null;

if (direction === "out") {
  //   const res = fetch("https://archival-rpc.mainnet.near.org", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       jsonrpc: "2.0",
  //       id: "dontcare",
  //       method: "EXPERIMENTAL_tx_status",
  //       params: [transfer.transaction_id, transfer.sender],
  //     }),
  //   });

  //   const argsBase64 = res.body.result.transaction.actions[0].FunctionCall.args;
  //   if (argsBase64) {
  //     const args = JSON.parse(
  //       Buffer.from(argsBase64, "base64").toString("utf-8")
  //     );
  //     proposalId = args.id;
  //   }
  const res = fetch(
    "https://api.pikespeak.ai/tx/graph-by-hash/" + transfer.transaction_id,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "36f2b87a-7ee6-40d8-80b9-5e68e587a5b5",
      },
    }
  );

  proposalId =
    res.body[0].transaction_graph.transaction.actions[0].action.args.id;
}

const TransferDirectionIcon = styled.div`
  background-color: ${(props) =>
    props.direction == "in" ? "#5BC65F" : "#DD5E56"};
  color: white;
  border-radius: 50%;
  margin-right: 1rem;
  height: 50px;
  width: 50px;
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 50px auto minmax(120px, 160px) minmax(120px, 160px);
  grid-template-rows: 1fr;
  grid-column-gap: 1rem;
  align-items: center;
`;

cons

return (
  <Container>
    <TransferDirectionIcon
      direction={direction}
      title={direction == "in" ? "Incoming" : "Outgoing"}
    >
      {direction == "out" ? (
        <i className="bi bi-arrow-up-short"></i>
      ) : (
        <i className="bi bi-arrow-down-short"></i>
      )}
    </TransferDirectionIcon>
    <div className="d-flex flex-column text-start tx-info gap-1 justify-content-start">
      <span title={direction == "out" ? transfer.receiver : transfer.sender}>
        <Widget
          src="nui.sking.near/widget/Element.User"
          props={{
            accountId: direction == "out" ? transfer.receiver : transfer.sender,
            options: {
              size: "sm",
              showSocialName: true,
              showImage: false,
            },
          }}
        />
      </span>
      <a
        href={`${explorerUrl}/transactions/${transfer.transaction_id}`}
        target="_blank"
        rel="noreferrer"
        title={transfer.transaction_id}
      >
        {ellipsis(transfer.transaction_id, 10)}
        <i className="bi bi-box-arrow-up-right ms-1"></i>
      </a>
      <span>{date}</span>
    </div>
    <div className="d-flex justify-content-end">
      <Widget
        src="nui.sking.near/widget/Element.Token"
        props={{
          amountWithDecimals:
            direction == "out" ? -transfer.amount : transfer.amount,
          address: type == "ft" ? transfer.contract : "",
        }}
      />
    </div>
    <div className="d-flex justify-content-end">
      {proposalId && (
        <Widget
          src="nui.sking.near/widget/Layout.Modal"
          props={{
            toggle: (
              <Widget
                src="nui.sking.near/widget/Input.Button"
                props={{
                  children: `Proposal #${proposalId}`,
                  variant: "secondary outline",
                  size: "sm",
                }}
              />
            ),
            content: (
              <Widget
                src="sking.near/widget/DAO.Proposal"
                props={{ daoId: daoId, proposalId: proposalId }}
              />
            ),
          }}
        />
      )}
    </div>
  </Container>
);
