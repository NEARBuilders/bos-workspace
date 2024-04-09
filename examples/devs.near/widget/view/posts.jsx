const domains = props.domains;
const hashtags = props.hashtags;

let index;
if (hashtags && hashtags.length > 0) {
  index = hashtags.map((it) => ({
    action: "hashtag",
    key: it.toLowerCase(),
    options: {
      limit: 10,
      order: "desc",
      accountId: props.accounts,
    },
  }));
} else {
  if (domains && domains.length > 0) {
    index = domains.map((it) => ({
      action: it,
      key: "main",
      options: {
        limit: 10,
        order: "desc",
        accountId: props.accounts,
      },
    }));
  } else {
    index = {
      action: "post",
      key: "main",
      options: {
        limit: 10,
        order: "desc",
        accountId: props.accounts,
      },
    };
  }
}

const Post = styled.div`
  border-bottom: 1px solid #eceef0;
  padding: 24px 0 12px;

  @media (max-width: 1200px) {
    padding: 12px 0 0;
  }
`;

const renderItem = (a) => {
  if (hashtags && hashtags.length > 0) {
    if (domains && domains.length > 0) {
      for (let i = 0; i < domains.length; i++) {
        const it = domains[i];
        if (
          a.value.type === "social" &&
          `${a.accountId}/${it}/main` === a.value.path
        ) {
          return (
            <div key={JSON.stringify(a)} className="mb-3">
              <Widget
                src="mob.near/widget/MainPage.Post"
                props={{ accountId: a.accountId, blockHeight: a.blockHeight }}
              />
            </div>
          );
        } else if (
          a.value.type === "social" &&
          `${a.accountId}/${it}/comment` === a.value.path
        ) {
          return (
            <div key={JSON.stringify(a)} className="mb-3">
              <Widget
                src="mob.near/widget/MainPage.Comment.Post"
                props={{ accountId: a.accountId, blockHeight: a.blockHeight }}
              />
            </div>
          );
        }
      }
    } else {
      return (
        (a.value.type === "social" &&
          `${a.accountId}/post/main` === a.value.path && (
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
          ))
      );
    }
  } else {
    return (
      (a.value.type === "md" && (
        <Post className="post" key={JSON.stringify(a)}>
          <Widget
            src="near/widget/Posts.Post"
            props={{ accountId: a.accountId, blockHeight: a.blockHeight }}
          />
        </Post>
      )) ||
      (a.value.type === "social" &&
        `${a.accountId}/post/main` === a.value.path && (
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
        ))
    );
  }
};

return (
  <Widget src="mob.near/widget/MergedIndexFeed" props={{ index, renderItem }} />
);
