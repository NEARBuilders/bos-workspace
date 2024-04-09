const { value, onChange, onSubmit, onCancel } = props;

return (
  <Widget
    src={"efiz.near/widget/SimpleMDE"}
    props={{
      data: { content: value },
      onChange,
      toolbar: [
        "heading",
        "bold",
        "italic",
        "quote",
        "code",
        "link",
        "unordered-list",
        "ordered-list",
        "checklist",
        "mention",
      ],
      statusConfig: [],
      spellChecker: false,
    }}
  />
);
