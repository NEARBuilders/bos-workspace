const hashtag = props.hashtag;
if (!hashtag) {
  return "props.hashtag is required";
}

const index = {
  action: "hashtag",
  key: hashtag.toLowerCase(),
  options: {
    limit: 10,
    order: "desc",
    accountId: props.accounts,
  },
};

const renderItem = (a) =>
  (a.value.type === "social" && `${a.accountId}/post/main` === a.value.path && (
    <div key={JSON.stringify(a)} className="mb-3">
      <Widget
        src="mob.near/widget/MainPage.Post"
        props={{ accountId: a.accountId, blockHeight: a.blockHeight }}
      />
    </div>
  )) ||
  (a.value.type === "social" &&
    `${a.accountId}/post/comment` === a.value.path && (
      <div key={JSON.stringify(a)} className="mb-3">
        <Widget
          src="mob.near/widget/MainPage.Comment.Post"
          props={{ accountId: a.accountId, blockHeight: a.blockHeight }}
        />
      </div>
    ));

return (
  <div>
    <Widget
      src="mob.near/widget/FilteredIndexFeed"
      props={{ index, renderItem }}
    />
  </div>
);
