const fetcher = props?.fether ?? (() => {});
const daoId = props?.daoId;

const balances = fetcher.balances([daoId]);

if (!balances.body) {
  return "Loading...";
}

return (
  <div className="ndc-card p-4">
    <h3 className="mb-3">Current Balance</h3>
    <Widget
      src="nearui.near/widget/Data.Balances"
      props={{
        balances: balances.body,
      }}
    />
  </div>
);
