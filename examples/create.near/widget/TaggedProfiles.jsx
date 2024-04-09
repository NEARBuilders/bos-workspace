const tag = props.tag;

/*
let keys = `${accountId ?? "*"}/profile/*`;

const profiles = Social.get(`profile/tags`, "final") || {};

const profilesWithTags = { ...profiles };
Object.entries(profiles).forEach(([key, valueObj]) => {
  if (!valueObj?.profile?.hasOwnProperty("tags")) {
    delete profilesWithTags[key];
  }
});
const taggedProfiles = Social.keys(`profile/tags`, "final") || {};

const processData = (data) => {
  const members = Object.entries(data);

  members.sort((a, b) => b.blockHeight - a.blockHeight);
  return members;
};

const processData = (data) => {
  const accounts = Object.entries(data);

  const members = accounts
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
    <a
      href={`#/mob.near/widget/ProfilePage?accountId=${a.accountId}`}
      className="text-decoration-none"
      key={JSON.stringify(a)}
    >
      <Widget
        src="mob.near/widget/ProfileImage"
        props={{
          accountId: a.accountId,
          tooltip: true,
          className: "d-inline-block overflow-hidden",
        }}
      />
    </a>
  );
};

if (JSON.stringify(data) !== JSON.stringify(state.data || {})) {
  State.update({
    data,
    members: processData(data),
  });
}

return (
  <div className="d-flex flex-wrap gap-1 my-3">
    {state.members
      .slice(0, props.limit ? parseInt(props.limit) : 999)
      .map(renderItem)}
  </div>
);
*/

const data = Social.keys("*/profile", "final");

const limit = props.limit || 21;

if (!data) {
  return "Loading";
}

let accounts = Object.entries(data);
const numAccounts = accounts.length;
accounts = accounts.slice(numAccounts - limit, numAccounts);

const allProfiles = [];

for (let i = 0; i < accounts.length; ++i) {
  const accountId = accounts[i][0];

  allProfiles.push(
    <a
      href={`#/mob.near/widget/ProfilePage?accountId=${accountId}`}
      className="text-decoration-none"
      key={i}
    >
      <Widget
        src="mob.near/widget/ProfileImage"
        props={{
          accountId,
          tooltip: true,
          className: "d-inline-block overflow-hidden",
        }}
      />
    </a>
  );
}

return <div className="d-flex flex-wrap gap-1">{allProfiles}</div>;
