const accountId = context.accountId;

const side = context.accountId
  ? Social.get(`${context.accountId}/settings/dev/side`)
  : undefined;

if (side === null) {
  return "";
}

const defaultWidgets = [
  {
    src: "devs.near/widget/dev.info",
  },
  {
    src: "devs.near/widget/dev.profile",
  },
  {
    src: "devs.near/widget/dev.collab",
  },
];

const settingWidgets = side && JSON.parse(side);

if (state.widgets === undefined) {
  const widgets = settingWidgets ?? defaultWidgets;
  State.update({ widgets });
}

const move = (fromIndex, toIndex) => {
  const widget = state.widgets.splice(fromIndex, 1)[0];
  if (toIndex !== undefined) {
    state.widgets.splice(toIndex, 0, widget);
  }
  State.update();
};

const renderMenu = (src, requireLogin, index) => {
  return (
    <div className="mb-3" key="menu">
      <div className="font-monospace mb-2">{src}</div>
      <button
        className="btn btn-primary"
        title="Move Up"
        disabled={index === 0}
        onClick={() => move(index, index - 1)}
      >
        <i className="bi bi-chevron-up" />
      </button>
      <button
        className="btn btn-primary"
        title="Move Down"
        disabled={index + 1 === state.widgets.length}
        onClick={() => move(index, index + 1)}
      >
        <i className="bi bi-chevron-down" />
      </button>
      <button
        className="btn btn-primary"
        title="Move to the Tottom"
        disabled={index === 0}
        onClick={() => move(index, 0)}
      >
        <i className="bi bi-chevron-double-up" />
      </button>
      <button
        className="btn btn-primary"
        title="Move to the Bottom"
        disabled={index + 1 === state.widgets.length}
        onClick={() => move(index, state.widgets.length - 1)}
      >
        <i className="bi bi-chevron-double-down" />
      </button>
      <button
        className="btn btn-danger ms-4"
        title="Remove"
        onClick={() => move(index, undefined)}
      >
        <i className="bi bi-trash3" /> Remove
      </button>
    </div>
  );
};

const openButton = ({ widgetPath: src, onHide }) => {
  return (
    <button
      className="btn btn-primary"
      onClick={() => {
        state.widgets.splice(0, 0, { src });
        State.update();
        onHide();
      }}
    >
      <i className="bi bi-plus-lg" /> Add
    </button>
  );
};

return (
  <>
    <h3>Dev Sidebar Editor</h3>
    <div className="mb-2">
      <Widget
        src="mob.near/widget/Welcome.RHS.Editor.ComponentSearch"
        props={{ extraButtons: openButton }}
      />
    </div>
    <div className="mb-2">
      <CommitButton
        data={{
          settings: {
            dev: { side: JSON.stringify(state.widgets) },
          },
        }}
      >
        Save Changes
      </CommitButton>
      {settingWidgets &&
        JSON.stringify(state.widgets) !== JSON.stringify(settingWidgets) && (
          <button
            className="btn btn-outline-primary"
            onClick={() => State.update({ widgets: settingWidgets })}
          >
            Revert
          </button>
        )}
      {JSON.stringify(state.widgets) !== JSON.stringify(defaultWidgets) && (
        <button
          className="btn btn-outline-danger float-end"
          onClick={() => State.update({ widgets: defaultWidgets })}
        >
          Reset
        </button>
      )}
    </div>
    <hr />
    {state.widgets.map(({ src, requiresLogin }, i) => (
      <div key={src} className="border rounded-4 p-3 mb-3">
        {renderMenu(src, requireLogin, i)}
        <div className="text-bg-light rounded-4 p-3">
          <Widget src={src} />
        </div>
      </div>
    ))}
  </>
);
