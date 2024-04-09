const accountId = context.accountId;

const defaultPage = "create.near/widget/Page";

const page = Social.get(`${accountId}/settings/near.social/page`);

if (page === null) {
  return "Loading";
}

initState({
  page: page ?? defaultPage,
});

const resetPage = () => {
  state.page = defaultPage;
  State.update();
};

return (
  <div>
    <div>
      <h4>Edit your page</h4>
    </div>
    <div className="mb-2">
      Widget:
      <input type="text" value={state.page} placeholder={defaultPage} />
    </div>
    <div className="mb-2">
      <CommitButton
        data={{ settings: { "near.social": { page: state.page } } }}
      >
        Save page
      </CommitButton>
      {state.page !== defaultPage && (
        <button className="btn btn-outline-primary ms-2" onClick={resetPage}>
          Reset page
        </button>
      )}
      {page === state.page && (
        <a className="btn btn-outline-primary ms-2" href={`#/`}>
          Open page
        </a>
      )}
    </div>
    <hr />
    <div className="mb-2">
      <Widget src={state.page} />
    </div>
  </div>
);
