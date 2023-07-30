const daoId = props.daoId;

const index = [
  {
    action: "post",
    key: "main",
    options: {
      limit: 10,
      order: "desc",
      accountId: daoId,
    },
  },
  {
    action: "repost",
    key: "main",
    options: {
      limit: 10,
      order: "desc",
      accountId: daoId,
    },
  },
];

const renderedPosts = {};

const makePostItem = (a) => ({
  type: "social",
  path: `${a.accountId}/post/main`,
  blockHeight: a.blockHeight,
});

const renderPost = (a) => {
  if (a.value.type !== "md") {
    return false;
  }
  const item = JSON.stringify(makePostItem(a));
  if (item in renderedPosts) {
    return false;
  }
  renderedPosts[item] = true;

  return (
    <div key={JSON.stringify(a)} className="mb-3">
      <Widget
        src="hack.near/widget/News.Post"
        props={{ accountId: a.accountId, blockHeight: a.blockHeight }}
      />
    </div>
  );
};

const repostSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fill-rule="evenodd"
      d="M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z"
      transform="rotate(180, 12, 12), translate(0, 4)"
    />
    <path
      fill-rule="evenodd"
      d="M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z"
      transform="translate(0, 4)"
    />
  </svg>
);

const extractParentPost = (item) => {
  if (!item || item.type !== "social" || !item.path || !item.blockHeight) {
    return undefined;
  }
  const accountId = item.path.split("/")[0];
  return `${accountId}/post/main` === item.path
    ? { accountId, blockHeight: item.blockHeight }
    : undefined;
};

const renderRepost = (a) => {
  if (a.value.type !== "repost") {
    return false;
  }
  const post = extractParentPost(a.value.item);
  if (!post) {
    return false;
  }
  const item = JSON.stringify(makePostItem(post));
  if (item in renderedPosts) {
    return false;
  }
  renderedPosts[item] = true;

  return (
    <div key={JSON.stringify(a)} className="mb-3">
      <div className="text-muted">
        {repostSvg} Reposted by{" "}
        <Widget
          src="mob.near/widget/ProfileLine"
          props={{
            accountId: a.accountId,
            hideImage: true,
            hideAccountId: true,
            tooltip: true,
          }}
        />
      </div>
      <Widget
        src="hack.near/widget/DAO.Social.Post"
        props={{ accountId: post.accountId, blockHeight: post.blockHeight }}
      />
    </div>
  );
};

const renderItem = (item) =>
  item.action === "post" ? renderPost(item) : renderRepost(item);

return (
  <div>
    <Widget
      src="mob.near/widget/MergedIndexFeed"
      props={{ index, renderItem }}
    />
  </div>
);
