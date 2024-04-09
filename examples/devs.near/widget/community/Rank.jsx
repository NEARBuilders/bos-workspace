const accountId = props.accountId ?? "academy.near";
const accountFollowerCount = [];

let accounts = Social.keys(`${accountId}/graph/follow/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

if (accounts === null) {
  return "Loading...";
}

accounts = Object.entries(accounts[accountId].graph.follow || {});
accounts.sort((a, b) => b[1] - a[1]);

for (let i = 0; i < accounts.length; ++i) {
  let accountId = accounts[i][0];
  let followers = Social.keys(`*/graph/follow/${accountId}`, "final", {
    return_type: "BlockHeight",
    values_only: true,
  });
  if (followers) {
    accountFollowerCount.push({
      accountId: accountId,
      count: Object.keys(followers).length,
    });
  }
}
const accountFollowerSort = accountFollowerCount.sort(
  (a, b) => b.count - a.count
);
const numAccounts = accountFollowerSort.length;
accountFollowerSort = accountFollowerSort.slice(0, limit);
console.log(accountFollowerSort);

return (
  <>
    <h3>Communities</h3>
    {accountFollowerSort.map((rank, index) => {
      let accountId = rank.accountId;
      return (
        <div className="d-flex m-2">
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
              Followers:{" "}
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
