State.init({
  selectedTab: props.tab || "posts",
});

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const activityUrl = `/#/create.near/widget/ABC`;

const Wrapper = styled.div`
  margin-top: calc(var(--body-top-padding) * -1);
  padding-bottom: 48px;
`;

const Main = styled.div`
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr) 290px;
  grid-gap: 16px;

  @media (max-width: 1200px) {
    display: block;
  }
`;

const Section = styled.div`
  padding-top: 24px;
  border-left: ${(p) => (p.primary ? "1px solid #ECEEF0" : "none")};
  border-right: ${(p) => (p.primary ? "1px solid #ECEEF0" : "none")};

  > div {
    padding-bottom: 24px;
    margin-bottom: 24px;
    border-bottom: 1px solid #eceef0;

    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: none;
    }
  }

  @media (max-width: 1200px) {
    padding-top: 0px;
    border-left: none;
    border-right: none;
    display: ${(p) => (p.active ? "block" : "none")};
    margin: ${(p) => (p.negativeMargin ? "0 -12px" : "0")};
  }
`;

const Tabs = styled.div`
  display: none;
  height: 48px;
  background: #f8f9fa;
  border-bottom: 1px solid #eceef0;
  margin-bottom: ${(p) => (p.noMargin ? "0" : p.halfMargin ? "24px" : "24px")};
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1200px) {
    display: flex;
    margin-left: -12px;
    margin-right: -12px;

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

return (
  <Wrapper negativeMargin={state.selectedTab === "posts"}>
    <Tabs
      halfMargin={state.selectedTab === "apps"}
      noMargin={state.selectedTab === "posts"}
    >
      <TabsButton
        href={`${activityUrl}?tab=posts`}
        selected={state.selectedTab === "posts"}
      >
        Posts
      </TabsButton>

      <TabsButton
        href={`${activityUrl}?tab=apps`}
        selected={state.selectedTab === "apps"}
      >
        Components
      </TabsButton>

      <TabsButton
        href={`${activityUrl}?tab=explore`}
        selected={state.selectedTab === "explore"}
      >
        Explore
      </TabsButton>
    </Tabs>

    <Main>
      <Section active={state.selectedTab === "apps"}>
        <Widget src="create.near/widget/Featured" />
      </Section>
      <Section negativeMargin primary active={state.selectedTab === "posts"}>
        <Widget src="create.near/widget/Page.Content" />
      </Section>
      <Section active={state.selectedTab === "explore"}>
        <Widget src="create.near/widget/Explore" />
      </Section>
    </Main>
  </Wrapper>
);
