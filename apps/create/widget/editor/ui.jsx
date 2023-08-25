/*__@import:QoL/widget__*/

const { on } = props;

State.init({
  tab: props.tab || "EDIT",
});

// Now this is an isolated editor
// Can still modify the styles of it using the template

return (
  <>
    <div className="c__header">
      <input
        type="text"
        placeholder="Untitled"
        defaultValue={props.doc.title}
        onInput={(e) => on.change("title", e.target.value)}
        key={props.key}
      />
    </div>
    <div className="c__tabs">
      <button
        className={state.tab === "EDIT" ? "active" : ""}
        onClick={() => State.update({ tab: "EDIT" })}
      >
        Write
      </button>
      <button
        className={state.tab === "VIEW" ? "active" : ""}
        onClick={() => State.update({ tab: "VIEW" })}
      >
        View
      </button>
    </div>
    <div className="c__editor">
      {state.tab === "VIEW" &&
        widget("openwebbuild.near/widget/Post.Markdown", {
          text: props.doc.content,
        })}

      {/* Just hiding the iframe, so that it doesn't reload everything on tab change */}
      <div
        className={"w-100 h-100" + (state.tab !== "EDIT" ? " d-none" : "")}
        key={props.key}
      >
        {widget(
          "efiz.near/widget/SimpleMDE",
          {
            onChange: (v) => on.change("content", v),
            data: { content: props.doc.content },
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
              "reference",
            ],
          }
        )}
      </div>
    </div>
  </>
);
