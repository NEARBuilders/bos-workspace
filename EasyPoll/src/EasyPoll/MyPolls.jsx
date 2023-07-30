const indexVersion = props.indexVersion ?? "4.0.0";
const accountId = props.accountId ?? context.accountId;
const whitelist = props.whitelist ?? [];
const blackList = props.blackList ?? [];
const tabs = props.tabs ?? [];
const widgetOwner = props.widgetOwner ?? "easypoll-v0.ndc-widgets.near";

State.init({
  selectedTab: whitelist.includes(accountId) ? "all" : "public",
});

function selectTab(selectedTab) {
  State.update({ selectedTab });
}

let keys;

if (state.selectedTab === "draft") {
  keys = `${accountId}/easypoll-${indexVersion}/draft/*`;
} else if (state.selectedTab === "official") {
  keys = `${accountId}/easypoll-${indexVersion}/official/*`;
} else if (state.selectedTab === "public") {
  keys = `${accountId}/easypoll-${indexVersion}/poll/*`;
} else {
  keys = [
    `${accountId}/easypoll-${indexVersion}/official/*`,
    `${accountId}/easypoll-${indexVersion}/poll/*`,
  ];
}

console.log(keys);

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
  display: block;
  position: relative;
  border: 1px solid #e6e8eb;
  border-right: none;
  padding: 3px 24px;
  border-radius: 0;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => (p.selected ? "#fff" : "#687076")};
  background: ${(p) => (p.selected ? "#4f46e5 !important" : "#FBFCFD")};
  font-weight: 600;
  transition: all 200ms;

  &:hover {
    background: #ecedee;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: #4f46e5 !important;
    box-shadow: 0 0 0 1px #4f46e5;
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

return (
  <div>
    <div className="mb-4">
      <span>Filter: </span>
      <PillSelect>
        {whitelist.includes(accountId) && (
          <PillSelectButton
            type="button"
            onClick={() => selectTab("all")}
            selected={state.selectedTab === "all"}
          >
            All
          </PillSelectButton>
        )}

        {whitelist.includes(accountId) && (
          <PillSelectButton
            type="button"
            onClick={() => selectTab("official")}
            selected={state.selectedTab === "official"}
          >
            Official NDC Polls
          </PillSelectButton>
        )}

        <PillSelectButton
          type="button"
          onClick={() => selectTab("public")}
          selected={state.selectedTab === "public"}
        >
          Public Polls
        </PillSelectButton>

        <PillSelectButton
          type="button"
          onClick={() => selectTab("draft")}
          selected={state.selectedTab === "draft"}
        >
          Drafts
        </PillSelectButton>
      </PillSelect>
    </div>
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Polls`}
      props={{
        indexVersion,
        onlyVerifiedHumans: false,
        blackList,
        tabs,
        customKeys: keys,
      }}
    />
  </div>
);
