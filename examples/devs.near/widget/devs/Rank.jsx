const accountWidgetCount = [];
const data = Social.keys("*/profile", "final");
if (!data) {
  return "Loading...";
}
let accounts = Object.entries(data);
const limit = 888;

for (let i = 0; i < accounts.length; ++i) {
  let accountId = accounts[i][0];
  let widgets = Social.get(`${accountId}/widget/*`, "final", {
    return_type: "BlockHeight",
    values_only: true,
  });
  if (widgets) {
    accountWidgetCount.push({
      accountId: accountId,
      count: Object.keys(widgets).length,
    });
  }
}
const accountWidgetSort = accountWidgetCount.sort((a, b) => b.count - a.count);
const numAccounts = accountWidgetSort.length;
accountWidgetSort = accountWidgetSort.slice(0, limit);
console.log(accountWidgetSort);

return (
  <>
    <h3>Top Widget Builders</h3>
    {accountWidgetSort.map((rank, index) => {
      let accountId = rank.accountId;
      return (
        <div className="d-flex justify-content-between mb-3">
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
          <div style={{ width: "10%" }}>
            <Widget src="mob.near/widget/FollowButton" props={{ accountId }} />
          </div>
        </div>
      );
    })}
  </>
);
