
if (!context.accountId) {
  return "";
}

// We index specifically to the type
// hashtags work as normal
// 
const composeData = () => {
  const data = {
    post: {
      main: JSON.stringify(state.content),
    },
    index: {
      post: JSON.stringify({
        key: "main",
        value: {
          type: "md",
        },
      }),
      every: JSON.stringify({
        key: "idea",
        value: {
          type: "md",
        }
      }),
    },
  };

  const item = {
    type: "social",
    path: `${context.accountId}/post/main`,
  };

  const notifications = state.extractMentionNotifications(
    state.content.text,
    item
  );

  if (notifications.length) {
    data.index.notify = JSON.stringify(
      notifications.length > 1 ? notifications : notifications[0]
    );
  }

  const hashtags = state.extractHashtags(state.content.text);

  if (hashtags.length) {
    data.index.hashtag = JSON.stringify(
      hashtags.map((hashtag) => ({
        key: hashtag,
        value: item,
      }))
    );
  }

  return data;
};

State.init({
  onChange: ({ content }) => {
    State.update({ content });
  },
});

return (
  <>
    <div style={{ margin: "0 -12px" }}>
      <Widget
        src="mob.near/widget/MainPage.N.Common.Compose"
        props={{
          placeholder: "What's happening?",
          onChange: state.onChange,
          onHelper: ({ extractMentionNotifications, extractHashtags }) => {
            State.update({ extractMentionNotifications, extractHashtags });
          },
          composeButton: (onCompose) => (
            <CommitButton
              disabled={!state.content}
              force
              className="btn btn-primary rounded-5"
              data={composeData}
              onCommit={() => {
                onCompose();
              }}
            >
              Post
            </CommitButton>
          ),
        }}
      />
    </div>
    {state.content && (
      <Widget
        src="mob.near/widget/MainPage.N.Post"
        props={{
          accountId: context.accountId,
          content: state.content,
          blockHeight: "now",
        }}
      />
    )}
  </>
);