const fetcher = props.fether ?? (() => {});
const daoId = props.daoId;
const widgetOwner = props.widgetOwner ?? "astro.sking.near";
const config = props.config ?? {
  limitPerPage: 10,
  type: "near", // near | ft
};

State.init({
  currentPage: state.currentPage ?? 0,
  type: state.type ?? config.type,
});

const currentOffset = state.currentPage * config.limitPerPage;
const transfers = fetcher[
  state.type == "ft" ? "ft_transfers" : "near_transfers"
](
  daoId,
  config.limitPerPage,
  currentOffset,
  state.type == "ft" ? undefined : config.minNearAmount
);

if (!transfers.body) {
  // TODO: Add proper loading
  return "Loading...";
}

console.log("transfers", transfers.body);


const Table = styled.div`
  & > div {
    padding: 1.61rem 0.61rem;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  .tx-info {
    font-size: 14px;
    color: #999;
    text-transform: lowercase;

    span:nth-child(1) {
      color: #000;
      font-weight: 600;
      font-size: 16px;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;


return (
  <div className="ndc-card p-4">
    <div className="d-flex justify-content-between gap-2">
      <h3 className="mb-3">NEAR Transactions</h3>
      <div>
        <Widget
          src="nui.sking.near/widget/Input.Select"
          props={{
            options: [
              {
                title: "NEAR",
                value: "near",
                default: state.type == "near",
              },
              {
                title: "Fungible Tokens",
                value: "ft",
                default: state.type == "ft",
              },
            ],
            onChange: (v) => State.update({ type: v }),
            value: state.type,
          }}
        />
      </div>
    </div>
    <Table className="d-flex flex-column">
      {transfers.body.length == 0 && (
        <div className="text-center">No transactions found</div>
      )}
      {transfers.body.map((transfer) => {
        return (
          <Widget
            src={`${widgetOwner}/widget/DAO.Funds.TransactionLine`}
            props={{
              transfer,
              daoId,
              type: state.type,
            }}
          />
        );
      })}
    </Table>
    <div className="d-flex gap-3 flex-wrap justify-content-center">
      <Widget
        src="nui.sking.near/widget/Navigation.PrevNext"
        props={{
          hasPrev: state.currentPage > 0,
          hasNext: transfers.body.length == config.limitPerPage,
          onPrev: () => State.update({ currentPage: state.currentPage - 1 }),
          onNext: () => State.update({ currentPage: state.currentPage + 1 }),
        }}
      />
    </div>
  </div>
);
