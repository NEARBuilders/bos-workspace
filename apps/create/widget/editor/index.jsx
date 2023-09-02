/*__@import:everything/utils/debounce__*/

const { project: projectId, handle } = props;

const path = handle["document"].getSelected(projectId);
const doc = handle["document"].get(path);

const on = {
  change: (k, v) => {
    debounce(() => handle["document"].update(projectId, path, { [k]: v }));
  },
  publish: () => handle["document"].publish(projectId, path),
};

const lastUpdated = doc.metadata.updatedAt;
const isBuffer = doc._.inBuffer;

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

const Folders = props.templates["Folders"];
// We can create layout files that look just like this one
// They are stateless
// It holds the styles and gets passed the definitions
// for the components it shows.
// Folders can then be swapped out for other "Folders" templates, it just has to follow the props
return (
  <>
    <Root>
      <div className="c__left">
        {/* And just reference the component here */}
        <Widget src={Folders} props={props} />
      </div>
      <div className="c__right" key={path}>
        {/*
         * We can now swap out the editor below
         */}
        <Widget src="/*__@appAccount__*//widget/editor.ui" props={{
          key: path,
          data: doc.data,
          on,
          ...props,
        }} />
        <div className="c__footer">
          <span>
            {isBuffer ? "Draft auto-saved " : "Last published "} at{" "}
            {new Date(lastUpdated).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            .
          </span>
          <div>
            <Widget src="/*__@replace:nui__*//widget/Input.Button" props={{
              children: "Publish",
              variant: "success",
              onClick: on.publish,
              disabled: !isBuffer,
            }} />
          </div>
        </div>
      </div>
    </Root>
  </>
);
