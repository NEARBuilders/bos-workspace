const COMMIT_DISPLAY_LIMIT = 5;

State.init({
  showAllCommits: false,
  selectedTab: "data",
  blockHeight: props.blockHeight ? parseInt(props.blockHeight) : null,
});

const current = Social.get(props.path, state.blockHeight);

const historyBlocksRequest = Social.keys(`${props.path}`, "final", {
  return_type: "History",
});

if (historyBlocksRequest === null || current === null) return "Loading...";

const [accountId, type, name] = props.path.split("/");
let blocksChanges = historyBlocksRequest[accountId]?.[type]?.[name];
if (blocksChanges) blocksChanges = blocksChanges?.sort((a, b) => b - a);
if (!state.blockHeight) State.update({ blockHeight: blocksChanges[0] });
const index = blocksChanges.findIndex((el) => el == state.blockHeight);

function getTimestampFromBlockHeight(blockHeight) {
  const block = Near.block(blockHeight);
  const date = new Date(block.header.timestamp_nanosec / 1e6);
  return date.toLocaleString();
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 30px;

  @media (max-width: 980px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  min-height: 30px;
  margin-bottom: 30px;
`;

const Sidebar = styled.div``;

const Commits = styled.div`
  background: var(--sand2);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;

  button {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--sand5) !important;
    cursor: pointer;
    padding: 10px 16px;
    background: none;

    &:hover,
    &:active,
    &:focus {
      box-shadow: none !important;
      outline: none !important;
      background: var(--sand3) !important;
    }

    &:focus {
      span:first-child {
        text-decoration: underline;
      }
    }

    &[data-selected="true"] {
      background: var(--violet2) !important;
      border-color: var(--violet5) !important;
      span:first-child {
        color: var(--violet10) !important;
      }
    }

    &:last-child {
      border-bottom: none !important;
    }

    @media (max-width: 980px) {
      flex-direction: row;
      justify-content: space-between;
    }
  }
`;

const Main = styled.div`
  pre > div {
    margin-top: 0 !important;
  }
`;

const Text = styled.p`
  font: var(--${(p) => p.size ?? "text-base"});
  font-weight: ${(p) => p.weight};
  color: var(--${(p) => p.color ?? "sand10"});
  margin: 0;

  ${(p) =>
    p.flex &&
    `
    display: flex;
    align-items: center;
    gap: 16px;
  `}
`;

const PillSelect = styled.div`
  display: inline-flex;
  align-items: center;

  @media (max-width: 600px) {
    width: 100%;

    button {
      flex: 1;
    }
  }
`;

const PillSelectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  position: relative;
  border: 1px solid #e6e8eb;
  border-right: none;
  padding: 3px 24px;
  border-radius: 0;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => (p.selected ? "#fff" : "#687076")};
  background: ${(p) => (p.selected ? "var(--violet10) !important" : "#FBFCFD")};
  font-weight: 600;
  transition: all 200ms;

  &:hover {
    background: #ecedee;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: var(--violet10) !important;
    box-shadow: 0 0 0 1px var(--violet10);
    z-index: 5;
  }

  &:first-child {
    border-radius: 6px 0 0 6px;
  }
  &:last-child {
    border-radius: 0 6px 6px 0;
    border-right: 1px solid #e6e8eb;
  }
`;

const Badges = styled.div`
  display: flex;
  gap: 6px;
`;

const Badge = styled.span`
  display: inline-block;
  font: var(--text-xs);
  font-weight: 500;
  min-width: 2em;
  text-align: center;
  padding: 2px 4px;
  background: var(--${(p) => p.backgroundColor ?? "sand2"});
  color: var(--${(p) => p.textColor ?? "sand12"});
  border-radius: 5px;
  vertical-align: middle;
`;

if (!blocksChanges) {
  return "incorrect path";
}

const oldVersion = {
  [name]: {
    [type]: current,
  },
};

const handleRevert = () => {
  Social.set(oldVersion);
};

return (
  <Wrapper>
    <Sidebar>
      <Header>
        <Text as="h3" size="text-md" color="sand12" weight="400">
          COMMITS ({blocksChanges.length})
        </Text>
      </Header>

      <Commits>
        {blocksChanges
          .slice(
            0,
            state.showAllCommits ? blocksChanges.length : COMMIT_DISPLAY_LIMIT
          )
          .map((blockHeight, key) => (
            <button
              type="button"
              data-selected={state.blockHeight == blockHeight}
              onClick={() => {
                State.update({ blockHeight });
              }}
            >
              <Text as="span" size="text-s" weight="500" color="sand12">
                {key === 0 ? `#${blockHeight} (head)` : `#${blockHeight}`}
              </Text>
              <Text as="span" size="text-s">
                {getTimestampFromBlockHeight(blockHeight)}
              </Text>
            </button>
          ))}
      </Commits>

      {!state.showAllCommits && blocksChanges.length > COMMIT_DISPLAY_LIMIT && (
        <Widget
          src="near/widget/DIG.Button"
          props={{
            fill: "outline",
            variant: "secondary",
            label: "Show All Commits",
            size: "small",
            style: { width: "100%" },
            onClick: () => {
              State.update({ showAllCommits: true });
            },
          }}
        />
      )}
    </Sidebar>

    <Main>
      <Header>
        <Text>Changes:</Text>
        <Badges>
          <Badge backgroundColor="green4" textColor="green11">
            +{state.lineCountInserted}
          </Badge>
          <Badge backgroundColor="red3" textColor="red11">
            -{state.lineCountDeleted}
          </Badge>
        </Badges>

        <Text size="text-s" style={{ marginRight: "auto" }}>
          {getTimestampFromBlockHeight(state.blockHeight)}
        </Text>

        <PillSelect>
          <PillSelectButton
            type="button"
            onClick={() => State.update({ selectedTab: "data" })}
            selected={state.selectedTab === "data"}
          >
            <i className="ph-bold ph-data"></i>
            Data
          </PillSelectButton>

          <PillSelectButton
            type="button"
            onClick={() => State.update({ selectedTab: "render" })}
            selected={state.selectedTab === "render"}
          >
            <i className="ph-bold ph-eye"></i>
            View
          </PillSelectButton>
        </PillSelect>
      </Header>

      {blocksChanges[0] !== state.blockHeight && (
        <div className="mb-3">
          <button onClick={handleRevert}>Revert</button>
        </div>
      )}

      {state.selectedTab == "data" && (
        <Widget
          src={`create.near/widget/GitBos.history`}
          key={`data-${state.blockHeight}`}
          props={{
            path: props.path,
            currentBlockHeight: state.blockHeight,
            prevBlockHeight: blocksChanges[index + 1],
            findUniqueResult: (
              lineCountDeleted,
              lineCountInserted,
              lineCountCurrent,
              lineCountPrevious,
              allLineCount
            ) => {
              if (
                state.lineCountDeleted === undefined ||
                state.lineCountInserted === undefined
              )
                State.update({ lineCountDeleted, lineCountInserted });
            },
          }}
        />
      )}

      {state.selectedTab == "render" && (
        <div>
          <Widget
            data={current}
            key={`preview-${state.blockHeight}`}
            props={props}
          />
        </div>
      )}
    </Main>
  </Wrapper>
);
