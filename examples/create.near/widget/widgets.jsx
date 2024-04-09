const accountId = props.accountId ?? context.accountId;

if (!accountId) {
  return "Please sign in with NEAR wallet to view your widgets";
}

let data = Social.keys(`${accountId}/widget/*`, "final", {
  return_type: "BlockHeight",
  values_only: true,
});

if (!data) {
  return "Loading";
}

data = Object.entries(data[accountId].widget ?? {});
data.sort((a, b) => b[1] - a[1]);

const widgets = data.map((p, i) => {
  const widgetName = p[0];

  return (
    <div className="d-flex flex-row justify-content-between" key={i}>
      <h5 className="m-3 mt-5">
        <a href={`#/${creatorId}/widget/${widgetName}`}>
          {p[0] || <i>widget</i>}
        </a>
      </h5>
      <div className="m-2 me-3">
        <Widget
          src="create.near/widget/widget.stats"
          props={{ accountId, widgetName }}
        />
      </div>
    </div>
  );
});

return (
  <div className="col">
    <div className="card h-100">
      <div className="card-header d-flex flex-row justify-content-between">
        <div className="mt-3 mb-3 ms-2">
          <Widget src="mob.near/widget/Profile" props={{ accountId }} />
        </div>
        <Widget src="create.near/widget/dev.stats" props={{ accountId }} />
      </div>
      <div className="card-body">{widgets}</div>
    </div>
  </div>
);
