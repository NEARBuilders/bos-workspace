State.init({
  selectedTab: Storage.privateGet("selectedTab") || "abc",
});

const previousSelectedTab = Storage.privateGet("selectedTab");

if (previousSelectedTab && previousSelectedTab !== state.selectedTab) {
  State.update({
    selectedTab: previousSelectedTab,
  });
}

let accounts = undefined;

if (state.selectedTab === "following" && context.accountId) {
  const graph = Social.keys(`${context.accountId}/graph/follow/*`, "final");
  if (graph !== null) {
    accounts = Object.keys(graph[context.accountId].graph.follow || {});
    accounts.push(context.accountId);
  } else {
    accounts = [];
  }
} else {
  accounts = undefined;
}

function selectTab(selectedTab) {
  Storage.privateSet("selectedTab", selectedTab);
  State.update({ selectedTab });
}

const H2 = styled.h2`
  font-size: 19px;
  line-height: 22px;
  color: #11181c;
  margin: 0 0 24px;
  padding: 0 24px;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const Content = styled.div`
  @media (max-width: 1200px) {
    > div:first-child {
      border-top: none;
    }
  }
`;

const ComposeWrapper = styled.div`
  border-top: 1px solid #eceef0;
`;

const FilterWrapper = styled.div`
  border-top: 1px solid #eceef0;
  padding: 24px 24px 0;

  @media (max-width: 1200px) {
    padding: 12px;
  }
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
  display: block;
  position: relative;
  border: 1px solid #e6e8eb;
  border-right: none;
  padding: 3px 24px;
  border-radius: 0;
  font-size: 12px;
  line-height: 18px;
  color: ${(p) => (p.selected ? "#fff" : "#687076")};
  background: ${(p) => (p.selected ? "#006ADC !important" : "#FBFCFD")};
  font-weight: 600;
  transition: all 200ms;

  &:hover {
    background: #ecedee;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: #006adc !important;
    box-shadow: 0 0 0 1px #006adc;
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

const FeedWrapper = styled.div`
  .post {
    padding-left: 24px;
    padding-right: 24px;

    @media (max-width: 1200px) {
      padding-left: 12px;
      padding-right: 12px;
    }
  }
`;

const hashtag = props.hashtag;

if (!state || state.hashtag !== hashtag) {
  State.update({
    feedIndex: hashtag ? 2 : context.accountId ? 0 : 1,
    hashtag,
  });
}

const options = [
  {
    title: "Your Community",
    disabled: !context.accountId,
  },
  {
    title: "Everyone",
  },
];

if (hashtag) {
  options.push({
    title: `#${hashtag}`,
  });
}

if (state.feedIndex === 0) {
  const graph = Social.keys(`${context.accountId}/graph/follow/*`, "final");
  if (graph !== null) {
    accounts = Object.keys(graph[context.accountId].graph.follow || {});
    accounts.push(context.accountId);
  } else {
    accounts = [];
  }
}

return (
  <>
    <H2>Posts</H2>

    <Content>
      {context.accountId && (
        <>
          <ComposeWrapper>
            {context.accountId && (
              <div className="mb-3">
                <Widget src="create.near/widget/Posts.Compose" props={{}} />
              </div>
            )}
          </ComposeWrapper>

          <FilterWrapper>
            <ul className="nav nav-pills mb-3">
              {options.map((option, i) => (
                <li className="nav-item" key={i}>
                  <button
                    className={`nav-link ${
                      state.feedIndex === i ? "active" : ""
                    } ${option.disabled ? "disabled" : ""}`}
                    aria-disabled={!!option.disabled}
                    onClick={() =>
                      !option.disabled && State.update({ feedIndex: i })
                    }
                  >
                    {option.title}
                  </button>
                </li>
              ))}
            </ul>
          </FilterWrapper>
        </>
      )}

      <FeedWrapper>
        {state.feedIndex === 2 ? (
          <Widget src="create.near/widget/Hashtag.Feed" props={{ hashtag }} />
        ) : (
          <Widget src="create.near/widget/Posts.Feed" props={{ accounts }} />
        )}
      </FeedWrapper>
    </Content>
  </>
);
