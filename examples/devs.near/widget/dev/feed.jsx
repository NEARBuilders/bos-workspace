const accountId = props.accountId;
const tag = props.tag;

const makeLink = (accountId, tag) => {
  const args = [];
  if (accountId) {
    args.push(`accountId=${accountId}`);
  }
  if (tag) {
    args.push(`tag=${tag}`);
  }
  return `#/mob.near/widget/LastWidgets${args.length > 0 ? "?" : ""}${args.join(
    "&"
  )}`;
};

const render = (content) => {
  return (
    <div className="px-2 mx-auto" style={{ maxWidth: "42em" }}>
      <h2 className="p-1">Latest Widgets</h2>
      {(accountId || tag) && (
        <div className="mb-2">
          Filter:
          {accountId && (
            <a
              href={makeLink(undefined, tag)}
              className="btn btn-outline-primary"
            >
              <Widget
                src="mob.near/widget/ProfileLine"
                props={{ accountId, link: false }}
              />
              <i className="bi bi-x-square"></i>
            </a>
          )}
          {tag && (
            <a
              href={makeLink(accountId, undefined)}
              className="btn btn-outline-primary"
            >
              <span className="badge text-bg-secondary">#{tag}</span>
              <i className="bi bi-x-square"></i>
            </a>
          )}
        </div>
      )}
      {content}
    </div>
  );
};

let keys = `${accountId ?? "*"}/widget/*`;

if (tag) {
  const taggedWidgets = Social.keys(
    `${accountId ?? "*"}/widget/*/metadata/tags/${tag}`,
    "final"
  );

  if (taggedWidgets === null) {
    return render("Loading tags...");
  }

  keys = Object.entries(taggedWidgets)
    .map((kv) => Object.keys(kv[1].widget).map((w) => `${kv[0]}/widget/${w}`))
    .flat();

  if (!keys.length) {
    return render(`No widgets found by tag #${tag}`);
  }
}

const data = Social.keys(keys, "final", {
  return_type: "BlockHeight",
});

if (data === null) {
  return render("Loading...");
}

const processData = (data) => {
  const accounts = Object.entries(data);

  const allItems = accounts
    .map((account) => {
      const accountId = account[0];
      return Object.entries(account[1].widget).map((kv) => ({
        accountId,
        widgetName: kv[0],
        blockHeight: kv[1],
      }));
    })
    .flat();

  allItems.sort((a, b) => b.blockHeight - a.blockHeight);
  return allItems;
};

const renderTag = (tag, tagBadge) => (
  <a href={makeLink(accountId, tag)}>{tagBadge}</a>
);

const renderItem = (a) => {
  return (
    <div className="mb-3" key={JSON.stringify(a)} style={{ minHeight: "10em" }}>
      <Widget
        src="hack.near/widget/dev.Widget.Card"
        props={{
          accountId: a.accountId,
          widgetName: a.widgetName,
          blockHeight: a.blockHeight,
          renderTag,
          profileLink: makeLink(a.accountId, tag),
        }}
      />
    </div>
  );
};

console.log(data);

if (JSON.stringify(data) !== JSON.stringify(state.data || {})) {
  State.update({
    data,
    allItems: processData(data),
  });
}

return render(
  <Widget
    src="mob.near/widget/ItemFeed"
    props={{ items: state.allItems || [], renderItem }}
  />
);
