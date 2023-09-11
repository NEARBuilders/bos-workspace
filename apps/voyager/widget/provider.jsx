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

const Wrapper = styled.div`
  padding: 6px;
  min-width: 200px;
  width: 200px;
  border-radius: 6px;
  box-shadow: 0 3px 15px -3px rgba(13, 20, 33, 0.13);
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e8eb;
  background-color: #fff;
  gap: 1px;

  .menu__item {
    padding: 3px;
    display: flex;
    color: #000;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background-color: #eff2f5;
    }
  }
  .menu__item__icon {
    font-size: 14px;
    border-radius: 5px;
    box-shadow: 0 0 0 1px rgba(201, 201, 204, 0.48);
    background: #fff;
    color: #000;
    height: 26px;
    width: 26px;
    display: flex;
    margin-right: 10px;
    justify-content: center;
    align-items: center;
  }
`;

return (
  <ContextMenu.Root>
    <Children
      setPath={setPath}
      setHistory={setHistory}
      setLayout={setLayout}
      path={state.path}
      layout={state.layout}
      goBack={goBack}
      goForward={goForward}
    />
    <ContextMenu.Content sideOffset={5} align="end" asChild>
      <Wrapper>
        <ContextMenu.Item
          className="menu__item"
          onSelect={() => handler["delete"](passProps["delete"])}
        >
          <i className="menu__item__icon bi bi-x-lg" />
          Delete
        </ContextMenu.Item>
      </Wrapper>
    </ContextMenu.Content>
  </ContextMenu.Root>
);
