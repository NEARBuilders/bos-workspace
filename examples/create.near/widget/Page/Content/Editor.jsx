const accountId = context.accountId;

const defaultContent = "create.near/widget/Page.Content";

const content = Social.get(`${accountId}/settings/near.social/page.content`);

if (content === null) {
  return "Loading";
}

initState({
  content: content ?? defaultContent,
});

const resetContent = () => {
  state.content = defaultContent;
  State.update();
};

return (
  <div>
    <div>
      <h4>Edit Community Page</h4>
    </div>
    <div className="mb-2">
      <p className="mb-2">
        Customize your experience by inputting any widget source:
      </p>
      <input type="text" value={state.content} placeholder={defaultContent} />
    </div>
    <div className="mb-2">
      <CommitButton
        data={{
          settings: {
            "near.social": { "page.content": state.content },
          },
        }}
      >
        Save
      </CommitButton>
      {state.content !== defaultContent && (
        <button className="btn btn-outline-primary ms-2" onClick={resetContent}>
          Reset
        </button>
      )}
      {content === state.content && (
        <a className="btn btn-outline-primary ms-2" href={`#/`}>
          Open
        </a>
      )}
    </div>
    <hr />
    <div className="mb-2">
      <Widget src={state.content} />
    </div>
  </div>
);
