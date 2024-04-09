const Wrapper = styled.div`
  max-width: 400px;
  margin: 0 auto;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 5px;
`;

const Select = styled.select`
  padding: 8px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const [path, setPath] = useState(props.path);
const [content, setContent] = useState(`[EMBED](${path})\n\n#test`);

if (!path) {
  return (
    <Wrapper>
      <h3>path must be provided</h3>
      <FormGroup>
        <button
          className={"btn btn-success"}
          onClick={() => {
            if (props.closeModal) props.closeModal();
          }}
        >
          close
        </button>
      </FormGroup>
    </Wrapper>
  );
}

const extractMentions = (text) => {
  const mentionRegex =
    /@((?:(?:[a-z\d]+[-_])*[a-z\d]+\.)*(?:[a-z\d]+[-_])*[a-z\d]+)/gi;
  mentionRegex.lastIndex = 0;
  const accountIds = new Set();
  for (const match of text.matchAll(mentionRegex)) {
    if (
      !/[\w`]/.test(match.input.charAt(match.index - 1)) &&
      !/[/\w`]/.test(match.input.charAt(match.index + match[0].length)) &&
      match[1].length >= 2 &&
      match[1].length <= 64
    ) {
      accountIds.add(match[1].toLowerCase());
    }
  }
  return [...accountIds];
};

const extractHashtags = (text) => {
  const hashtagRegex = /#(\w+)/gi;
  hashtagRegex.lastIndex = 0;
  const hashtags = new Set();
  for (const match of text.matchAll(hashtagRegex)) {
    if (
      !/[\w`]/.test(match.input.charAt(match.index - 1)) &&
      !/[/\w`]/.test(match.input.charAt(match.index + match[0].length))
    ) {
      hashtags.add(match[1].toLowerCase());
    }
  }
  return [...hashtags];
};

const extractMentionNotifications = (text, item) =>
  extractMentions(text || "")
    .filter((accountId) => accountId !== context.accountId)
    .map((accountId) => ({
      key: accountId,
      value: {
        type: "mention",
        item,
      },
    }));

const handlePost = () => {
  const data = {
    post: {
      main: JSON.stringify({
        type: "md",
        text: content,
      }),
    },
    index: {
      post: JSON.stringify({
        key: "main",
        value: {
          type: "md",
        },
      }),
    },
  };

  const item = {
    type: "social",
    path: `${context.accountId}/post/main`,
  };

  const notifications = extractMentionNotifications(content, item);

  if (notifications.length) {
    data.index.notify = JSON.stringify(
      notifications.length > 1 ? notifications : notifications[0]
    );
  }

  const hashtags = extractHashtags(content);

  if (hashtags.length) {
    data.index.hashtag = JSON.stringify(
      hashtags.map((hashtag) => ({
        key: hashtag,
        value: item,
      }))
    );
  }

  Social.set(data, {
    force: "true",
    onCommit: (v) => {
      if (props.closeModal) props.closeModal();
    },
    onCancel: (v) => {
      if (props.closeModal) props.closeModal();
    },
  });
};

return (
  <Wrapper>
    <h3>post</h3>
    <Form>
      <textarea
        className="form-control mb-3"
        rows={5}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </Form>
    <FormGroup>
      <button className="btn btn-success mb-1" onClick={handlePost}>
        submit
      </button>
    </FormGroup>
  </Wrapper>
);
