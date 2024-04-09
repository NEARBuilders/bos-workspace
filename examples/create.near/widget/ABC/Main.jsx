const hashtag = props.hashtag ?? "abc";

State.init({
  selectedTab: props.tab || "about",
});

const accountId = props.accountId ?? context.accountId;
if (!accountId) {
  return "No account ID";
}

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const profile = props.profile ?? Social.getr(`${accountId}/profile`);
const accountUrl = `/#/create.near/widget/Page`;

const options = [
  {
    title: "Content",
  },
];

if (hashtag) {
  options.push({
    title: `#${hashtag}`,
  });
}

let accounts = undefined;

if (state.pageIndex === 0) {
  const graph = Social.keys(`${context.accountId}/graph/follow/*`, "final");
  if (graph !== null) {
    accounts = Object.keys(graph[context.accountId].graph.follow || {});
    accounts.push(context.accountId);
  } else {
    accounts = [];
  }
}

const Wrapper = styled.div`
  padding-bottom: 48px;
`;

const Content = styled.div`
  .post {
    padding-left: 0;
    padding-right: 0;
  }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: ${(p) => p.size || "25px"};
  line-height: 1.2em;
  color: #11181c;
  margin: ${(p) => (p.margin ? "0 0 24px" : "0")};
  overflow-wrap: anywhere;
`;

const Tabs = styled.div`
  display: flex;
  height: 48px;
  border-bottom: 1px solid #eceef0;
  margin-bottom: 23px;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1200px) {
    background: #f8f9fa;
    border-top: 1px solid #eceef0;
    margin: 0 -12px 48px;

    > * {
      flex: 1;
    }
  }
`;

const TabsButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;
  position: relative;
  color: ${(p) => (p.selected ? "#11181C" : "#687076")};
  background: none;
  border: none;
  outline: none;
  text-align: center;
  text-decoration: none !important;

  &:hover {
    color: #11181c;
  }

  &::after {
    content: "";
    display: ${(p) => (p.selected ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #59e692;
  }
`;

if (profile === null) {
  return "Loading...";
}

return (
  <Wrapper>
    <Content>
      <Tabs>
        <TabsButton
          href={`${accountUrl}&tab=about`}
          selected={state.selectedTab === "about"}
        >
          About
        </TabsButton>

        <TabsButton
          href={`${accountUrl}&tab=content`}
          selected={state.selectedTab === "content"}
        >
          Content
        </TabsButton>
      </Tabs>

      {state.selectedTab === "about" && (
        <Widget src="create.near/widget/Page.Header" />
      )}

      {state.selectedTab === "content" && (
        <Widget src="create.near/widget/ABC.Feed" />
      )}
    </Content>
  </Wrapper>
);
