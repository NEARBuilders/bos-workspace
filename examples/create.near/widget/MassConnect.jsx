let accountId = context.accountId;

if (!accountId) {
  return "Please sign in with NEAR wallet";
}

const dataFollowed = socialGetr(`${accountId}/follow`);

dataFollowed = !!dataFollowed ? dataFollowed : {};

if (dataFollowed === null) {
  return "Loading";
}

const data = {
  follow: {
    [state.accountId]: "",
  }
};

initState({});

state.accountId = state.accountId ? state.accountId.toLowerCase() : "";

const followed = Object.entries(dataFollowed);
const allFollowed = [];

for (let i = 0; i < followed.length; ++i) {
  const accountId = followed[i][0];
 
 allFollowed.push(
    <div className="mb-2">
      <Widget src="mob.near/widget/Profile" props={{ accountId: accountId }} />
 
    </div>
  );
}

let followedMessage = allFollowed.length ? "Accounts you follow:" : "";


return (
<div>
  <div className="container row">
    <div>
      <div>Follow NEAR Account</div>
      <Widget
        src="mob.near/widget/Profile"
        props={{ accountId: state.accountId }}
      />
    </div>
    <div>
      Account Id:
      <input type="text" value={state.accountId} />
    </div>
    <div className="mt-2">
      <CommitButton data={data}>Follow</CommitButton>
    </div>
  </div>
<hr />
<div>{followedMessage}</div>
<div>{allFollowed}</div>
</div>
);
