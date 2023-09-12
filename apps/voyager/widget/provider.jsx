const path = props.path || context.accountId;

if (!path) return <p>Please login.</p>;

State.init({
  layout: "LIST",
  path,
  history: [path],
  currentHistoryIndex: 0,
  showPreview: false,
  selectedPath: "",
});

function isNearAccount(str) {
  return typeof str === "string" && str.endsWith(".near");
}

function setPath(v) {
  const updatedHistory = state.history
    .slice(0, state.currentHistoryIndex + 1)
    .concat(v);

  const parts = v.split("/");
  const lastPart = parts[parts.length - 1];
  if (isNearAccount(lastPart)) {
    v = lastPart;
  }

  State.update({
    path: v,
    history: updatedHistory,
    currentHistoryIndex: updatedHistory.length - 1,
  });
}

function goBack() {
  // Check if we can go back
  if (state.currentHistoryIndex > 0) {
    const newIndex = state.currentHistoryIndex - 1;
    State.update({
      currentHistoryIndex: newIndex,
      path: state.history[newIndex],
    });
  }
}

function goForward() {
  // Check if we can go forward
  if (state.currentHistoryIndex < state.history.length - 1) {
    const newIndex = state.currentHistoryIndex + 1;
    State.update({
      currentHistoryIndex: newIndex,
      path: state.history[newIndex],
    });
  }
}

function setSelectedPath(v) {
  State.update({ selectedPath: v });
}

function setHistory(v) {
  State.update({ history: v });
}

function setLayout(v) {
  State.update({ layout: v });
}

function togglePreview() {
  State.update({ showPreview: !state.showPreview });
}

const Children = props.Children;

return (
  <Children
    setPath={setPath}
    setHistory={setHistory}
    setLayout={setLayout}
    showPreview={state.showPreview}
    togglePreview={togglePreview}
    selectedPath={state.selectedPath}
    setSelectedPath={setSelectedPath}
    path={state.path}
    layout={state.layout}
    goBack={goBack}
    goForward={goForward}
  />
);
