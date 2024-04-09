const { value } = props;

const loading = <div className="placeholder" style={{ height: "48px" }} />;

const widgetSrc =
  value.type === "follow" || value.type === "unfollow"
    ? "mob.near/widget/Notification.Item.Follow"
    : value.type === "poke"
    ? "mob.near/widget/Notification.Item.Poke"
    : value.type === "like"
    ? "mob.near/widget/Notification.Item.Like"
    : value.type === "comment"
    ? "mob.near/widget/Notification.Item.Comment"
    : value.type && value.type?.startsWith("devgovgigs/")
    ? "mob.near/widget/Notification.Item.DevGov"
    : value.type === "mention"
    ? "mob.near/widget/Notification.Item.Mention"
    : value.type === "repost"
    ? "mob.near/widget/Notification.Item.Repost"
    : value.type === "chess-game"
    ? "chess-game.near/widget/Notification.Item.ChessGame@98857466"
    : value.type === "request"
    ? "hack.near/widget/Notification.Item.Request"
    : null;

return (
  <div className="mb-3">
    {widgetSrc ? (
      <Widget
        loading={loading}
        src={widgetSrc}
        props={{ loading, src: value.src, update: value.update, ...props }}
      />
    ) : (
      <div>
        Unknown notification:{" "}
        <span className="font-monospace">{JSON.stringify(value)}</span>
      </div>
    )}
  </div>
);
