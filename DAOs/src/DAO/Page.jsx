State.init({
  selectedTab: props.tab || "discussion",
});

const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "multi.sputnik-dao.near";

const page = accountId
  ? Social.get(`${accountId}/settings/dao/page`)
  : undefined;

if (page === null) {
  return "Loading...";
}

const feed = accountId
  ? Social.get(`${accountId}/settings/dao/feed`)
  : undefined;

if (feed === null) {
  return "Loading...";
}

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const profile = props.profile ?? Social.getr(`${daoId}/profile`);
const accountUrl = `#/sking.near/widget/DAO.Page?daoId=${daoId}`;

const Wrapper = styled.div`
  padding-bottom: 48px;
`;

const Main = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: 352px minmax(0, 1fr);
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const BackgroundImage = styled.div`
  height: 240px;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  margin: 0 -12px;
  background: #eceef0;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1200px) {
    margin: calc(var(--body-top-padding) * -1) -12px 0;
    border-radius: 0;
  }

  @media (max-width: 900px) {
    height: 100px;
  }
`;

const SidebarWrapper = styled.div`
  position: relative;
  z-index: 5;
  margin-top: -55px;
  width: 100%;

  @media (max-width: 900px) {
    margin-top: -40px;
  }
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
  margin-bottom: 28px;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1200px) {
    background: #f8f9fa;
    border-top: 1px solid #eceef0;
    margin: 0 -12px 26px;

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

const Bio = styled.div`
  color: #11181c;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 48px;

  > *:last-child {
    margin-bottom: 0 !important;
  }

  @media (max-width: 900px) {
    margin-bottom: 48px;
  }
`;

if (profile === null) {
  return "Loading...";
}

return (
  <Wrapper>
    <BackgroundImage>
      {profile.backgroundImage && (
        <Widget
          src="mob.near/widget/Image"
          props={{
            image: profile.backgroundImage,
            alt: "profile background image",
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
          }}
        />
      )}
    </BackgroundImage>

    <Main>
      <SidebarWrapper>
        <Widget
          src="hack.near/widget/DAO.Page.Sidebar"
          props={{
            daoId,
            profile,
          }}
        />
      </SidebarWrapper>

      <Content>
        <Tabs>
          <TabsButton
            href={`${accountUrl}&tab=discussion`}
            selected={state.selectedTab === "discussion"}
          >
            Discussion
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=proposals`}
            selected={state.selectedTab === "proposals"}
          >
            Proposals
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=members`}
            selected={state.selectedTab === "members"}
          >
            Members
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=projects`}
            selected={state.selectedTab === "projects"}
          >
            Projects
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=followers`}
            selected={state.selectedTab === "followers"}
          >
            Followers
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=bounties`}
            selected={state.selectedTab === "bounties"}
          >
            Bounties
          </TabsButton>
        </Tabs>

        {state.selectedTab === "discussion" && (
          <>
            <h3>Curated Posts</h3>
            <a
              className="btn btn-outline-secondary m-2"
              href="/#/hack.near/widget/DAO.Feed.Editor"
            >
              <b>Update Feed</b>
            </a>
            <hr />
            <Widget
              src={feed ?? "hack.near/widget/DAO.Social"}
              props={{ daoId }}
            />
          </>
        )}

        {state.selectedTab === "proposals" && (
          <Widget src="sking.near/widget/DAO.Proposals" props={{ daoId }} />
        )}

        {state.selectedTab === "proposal" && (
          <Widget
            src="sking.near/widget/DAO.Proposal"
            props={{ daoId, ...props }}
          />
        )}

        {state.selectedTab === "members" && (
          <Widget src="hack.near/widget/DAO.Members" props={{ daoId }} />
        )}

        {state.selectedTab === "projects" && (
          <Widget src="efiz.near/widget/Gigs.Board" props={{ daoId }} />
        )}

        {state.selectedTab === "followers" && (
          <Widget
            src="near/widget/FollowersList"
            props={{ accountId: daoId }}
          />
        )}

        {state.selectedTab === "bounties" && (
          <Widget src="sking.near/widget/DAO.Bounties" props={{ daoId }} />
        )}

        {state.selectedTab === "bounty" && (
          <Widget
            src="sking.near/widget/DAO.Bounty"
            props={{ daoId, ...props }}
          />
        )}
      </Content>
    </Main>
  </Wrapper>
);
