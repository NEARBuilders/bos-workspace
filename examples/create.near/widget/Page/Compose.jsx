if (!context.accountId) {
  return "";
}

const composeData = () => {
  const data = {
    post: {
      abc: JSON.stringify(state.content),
    },
    index: {
      post: JSON.stringify({
        key: "abc",
        value: {
          type: "md",
        },
      }),
    },
  };

  const item = {
    type: "social",
    path: `${context.accountId}/post/abc`,
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
    <h5>NEAR Generation</h5>
    <Widget
      src="mob.near/widget/Common.Compose"
      props={{
        placeholder:
          "Nominate contributors by mentioning them in a post with our community hashtag #ABC",
        onChange: state.onChange,
        onHelper: ({ extractMentionNotifications, extractHashtags }) => {
          State.update({ extractMentionNotifications, extractHashtags });
        },
        composeButton: (onCompose) => (
          <CommitButton
            disabled={!state.content}
            force
            className="btn btn-dark rounded-3"
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
    {state.content && (
      <div className="mt-3">
        <Widget
          src="create.near/widget/Page.Post"
          props={{
            accountId: context.accountId,
            content: state.content,
            blockHeight: "now",
          }}
        />
      </div>
    )}
  </>
);
