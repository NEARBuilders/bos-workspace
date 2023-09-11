const path = props.path || context.accountId;

if (!path) return <p>Please login.</p>;

State.init({
  layout: "LIST",
  path,
  history: [path],
  currentHistoryIndex: 0,
});

function setPath(v) {
  const updatedHistory = state.history
    .slice(0, state.currentHistoryIndex + 1)
    .concat(v);
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

function setHistory(v) {
  State.update({ history: v });
}

function setLayout(v) {
  State.update({ layout: v });
}

const Children = props.Children;

return (
  <Children
    setPath={setPath}
    setHistory={setHistory}
    setLayout={setLayout}
    path={state.path}
    layout={state.layout}
    goBack={goBack}
    goForward={goForward}
  />
);
