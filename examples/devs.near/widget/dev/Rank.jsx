const ownerId = props.ownerId ?? "devs.near";
const accountWidgetCount = [];

let accounts = Social.keys(`${ownerId}/graph/follow/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

if (accounts === null) {
  return "Loading...";
}

accounts = Object.entries(accounts[ownerId].graph.follow || {});
accounts.sort((a, b) => b[1] - a[1]);

for (let i = 0; i < accounts.length; ++i) {
  let accountId = accounts[i][0];
  let widgets = Social.get(`${accountId}/widget/*`, "final", {
    return_type: "BlockHeight",
    values_only: true,
  });
  let widgetCount = 0;
  if (widgets) {
    widgetCount = Object.keys(widgets).length;
  }
  accountWidgetCount.push({
    accountId: accountId,
    count: widgetCount,
  });
}

const accountWidgetSort = accountWidgetCount.sort((a, b) => b.count - a.count);
const numAccounts = accountWidgetSort.length;
accountWidgetSort = accountWidgetSort.slice(0, limit);
console.log(accountWidgetSort);

const totalWidgetCount = accountWidgetCount.reduce(
  (sum, account) => sum + account.count,
  0
);

return (
  <>
    <h3 className="m-2">Builders</h3>
    <div className="m-2">Total Widgets: {totalWidgetCount}</div>{" "}
    {accountWidgetCount.map((rank, index) => {
      let accountId = rank.accountId;
      return (
        <div className="d-flex m-2" key={accountId}>
          <div className="me-4" style={{ width: "45%" }}>
            <Widget src="mob.near/widget/Profile" props={{ accountId }} />
          </div>
          <div className="d-flex flex-column" style={{ width: "30%" }}>
            <div>
              Rank:
              <span
                style={{
                  backgroundColor: "black",
                  borderRadius: "5px",
                  padding: "5px",
                  color: "white",
                }}
              >
                {index + 1}
              </span>
            </div>
            <div>
              Widgets:{" "}
              <span
                style={{
                  fontWeight: "bold",
                }}
              >
                {rank.count}
              </span>
            </div>
          </div>
          <div className="m-2" style={{ width: "25%" }}>
            <Widget src="mob.near/widget/FollowButton" props={{ accountId }} />
          </div>
        </div>
      );
    })}
  </>
);
