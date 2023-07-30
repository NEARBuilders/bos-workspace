const accountId = props.accountId;
const blockHeight =
  props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const content =
  props.content ??
  JSON.parse(Social.get(`${accountId}/post/main`, blockHeight) ?? "null");
const subscribe = !!props.subscribe;
const raw = !!props.raw;

const notifyAccountId = accountId;
const item = {
  type: "social",
  path: `${accountId}/post/dao`,
  blockHeight,
};

const link = `#/hack.near/widget/DAO.Post?accountId=${accountId}&blockHeight=${blockHeight}`;

return (
  <div className="border-bottom pt-3 pb-1">
    <Widget
      src="mob.near/widget/MainPage.Post.Header"
      props={{ accountId, blockHeight, link, postType: "post", flagItem: item }}
    />
    <div className="mt-3 text-break">
      <Widget
        src="mob.near/widget/MainPage.Post.Content"
        props={{ content, raw }}
      />
    </div>
    {blockHeight !== "now" && (
      <div className="mt-1 d-flex justify-content-between">
        <div className="me-4">
          <Widget
            src="mob.near/widget/CommentButton"
            props={{
              onClick: () =>
                !state.showReply && State.update({ showReply: true }),
            }}
          />
        </div>
        <div className="me-4">
          <Widget
            src="mob.near/widget/RepostButton"
            props={{
              notifyAccountId,
              item,
            }}
          />
        </div>
        <div className="me-4">
          <Widget
            src="mob.near/widget/LikeButton"
            props={{
              notifyAccountId,
              item,
            }}
          />
        </div>
        <div>
          <Widget
            src="mob.near/widget/MainPage.Post.ShareButton"
            props={{ accountId, blockHeight, postType: "post" }}
          />
        </div>
      </div>
    )}
    <div className="mt-3 ps-5">
      {state.showReply && (
        <div className="mb-2">
          <Widget
            src="mob.near/widget/MainPage.Comment.Compose"
            props={{
              notifyAccountId,
              item,
              onComment: () => State.update({ showReply: false }),
            }}
          />
        </div>
      )}
      <Widget
        src="mob.near/widget/MainPage.Comment.Feed"
        props={{
          item,
          highlightComment: props.highlightComment,
          limit: props.commentsLimit,
          subscribe,
          raw,
        }}
      />
    </div>
  </div>
);
