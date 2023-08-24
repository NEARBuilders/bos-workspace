/*__@import:QoL/widget__*/
/*__@import:everything/utils/debounce__*/

const Root = styled.div`
  min-height: max(300px, 80vh);
  width: 100%;
  border-radius: 16px;
  background-color: #f9fbfe;
  color: #000;
  display: flex;
  gap: 4px;
  border: 1px solid var(--c__border-color);

  --c__border-color: rgb(209, 213, 219);


  .c__left {
    min-height: inherit;
    border-radius: inherit;
    width: min(300px, 100%);
  }

  .c__right {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 1rem 1rem 1rem 0rem;
    background-color: #fff;
    padding: 1rem;
  }

  .c__header {
    padding: .5rem 1rem;
    width: 100%;
    border-radius: 16px;
    background-color: #fff;
    border: 1px solid var(--c__border-color);
    margin-bottom: 1rem;

    input {
      font-size: 20px;
      margin: 0 auto;
      background: none !important;
      outline: none !important;
      border: none !important;
      box-shadow: none !important;
    }
  }

  .c__tabs {
    width: 100%;
    padding: 0 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;

    button {
      outline: none;
      background: none;
      padding: 0.5rem 1rem;
      border-radius: 16px;x
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      color: #000;
      transition: all 0.3s;
      transform: translateY(1px);
      border-radius: 16px 16px 0 0;
      border: 1px solid transparent;
      border-bottom: none;
      
      &.active {
        border-color: var(--c__border-color);
        background-color: #fff;
      }
    }
  }

  .c__editor {
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--c__border-color);
    border-bottom: none;
    border-radius: 16px 16px 0 0 ;
    min-height: 450px;
  }

  .c__footer {
    width: 100%;
    padding: 1rem;
    border-radius: 0 0 16px 16px;
    background-color: #fff;
    border: 1px solid var(--c__border-color);
    border-top: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

State.init({
  tab: props.tab || "EDIT",
  // No need to have content in state, since the inputs are uncontrolled
});

function handleTitleChange(v) {
  // these need to know the document id
  debounce(() =>
    props.handle["document"].update(props.projectId, props.did, { title: v })
  ); // this almost needs to be abstracted out
}

function handleTabChange(v) {
  State.update({ tab: v });
}

function handleContentChange(v) {
  // it's almost like these could be accessed by the type
  debounce(() =>
    props.handle["document"].update(props.projectId, props.did, { content: v })
  ); // this almost needs to be abstracted out
}

function handlePublish(v) {}

// need to be fed a project id.

return (
  <Root>
    <div className="c__left" key={props.did}>
      {widget("/*__@appAccount__*//widget/editor.uiFolders", props)}
    </div>
    <div className="c__right">
      <div className="c__header">
        <input
          type="text"
          placeholder="Untitled"
          defaultValue={props.doc.title}
          onInput={(e) => handleTitleChange(e.target.value)}
          key={props.did}
        />
      </div>
      <div className="c__tabs">
        <button
          className={state.tab === "EDIT" ? "active" : ""}
          onClick={() => handleTabChange("EDIT")}
        >
          Write
        </button>
        <button
          className={state.tab === "VIEW" ? "active" : ""}
          onClick={() => handleTabChange("VIEW")}
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
          key={props.did}
        >
          {widget("efiz.near/widget/SimpleMDE", {
            onChange: handleContentChange,
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
          })}
        </div>
      </div>
      <div className="c__footer">
        <span>
          Draft auto-saved at{" "}
          {new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          .
        </span>
        {widget("/*__@replace:nui__*//widget/Input.Button", {
          children: "Publish",
          variant: "success",
          onClick: props.handlePublish,
        })}
      </div>
    </div>
  </Root>
);
