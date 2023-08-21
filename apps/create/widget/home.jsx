State.init({
  view: "EDITOR",
});

return (
  <div>
    <div>
      <button onClick={() => State.update({ view: "LIST" })}>list</button>
      <button onClick={() => State.update({ view: "EDITOR" })}>editor</button>
    </div>
    {state.view === "LIST" ? (
      <Widget src="create.near/widget/list.index" />
    ) : (
      <Widget src="create.near/widget/editor" />
    )}
  </div>
);
