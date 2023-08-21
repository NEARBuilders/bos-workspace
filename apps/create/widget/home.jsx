/*__@import:QoL/widget__*/

State.init({
  page: props.page ?? "PROJECTS",
});

return (
  <div>
    {widget("/*__@appAccount__*//widget/ui.navbar", {
      onPageChange: (v) => State.update({ page: v }),
      pages: ["EDITOR", "PROJECTS"],
    })}
    {state.page === "PROJECTS" ? (
      <Widget src="create.near/widget/list.index" />
    ) : state.page === "EDITOR" ? (
      <Widget src="create.near/widget/editor" />
    ) : (
      "404"
    )}
  </div>
);
