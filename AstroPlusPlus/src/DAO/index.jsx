const widgetOwner = props.widgetOwner ?? "astro.sking.near";

State.init({
  tab: props.tab ?? "home",
  accountId: props.accountId ?? context.accountId,
  daoId: props.daoId,
  proposalId: props.proposalId,
});

const update = (state) => State.update(state);

const constructURL = (paramObj, base) => {
  const baseURL = base ?? `#/${widgetOwner}/widget/DAO`;
  let params = "";
  for (const [key, value] of Object.entries(paramObj)) {
    params += `${key}=${value}&`;
  }
  params = params.slice(0, -1);
  return `${baseURL}?${params}`;
};

const tabs = {
  home: {
    name: "Discussion",
    widget: "DAO.Discussion",
    href: constructURL({ tab: "home", daoId: state.daoId }),
  },
  proposals: {
    name: "Proposals",
    widget: "DAO.Proposals.index",
    href: constructURL({ tab: "proposals", daoId: state.daoId }),
  },
  funds: {
    name: "Fund Flows",
    widget: "DAO.Funds.index",
    href: constructURL({ tab: "funds", daoId: state.daoId }),
  },
  members: {
    name: "Members & Policy",
    widget: "DAO.Members.index",
    href: constructURL({ tab: "members", daoId: state.daoId }),
  },
  projects: {
    name: "Projects",
    widget: "DAO.Projects",
    href: constructURL({ tab: "projects", daoId: state.daoId }),
  },
  followers: {
    name: "Followers",
    widget: "DAO.Followers",
    href: constructURL({ tab: "followers", daoId: state.daoId }),
  },
  bounties: {
    name: "Bounties",
    widget: "DAO.Bounties",
    href: constructURL({ tab: "bounties", daoId: state.daoId }),
  },
};

if (!props.daoId) {
  // TODO: add a proper error screen
  return "Please provide a DAO ID";
}

const tabContent = (
  <Widget
    src={`${widgetOwner}/widget/${tabs[state.tab || "home"].widget}`}
    props={{
      update,
      tab: state.tab,
      accountId: state.accountId,
      daoId: state.daoId,
      proposalId: state.proposalId,
      ...props,
    }}
  />
);

const Main = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: 352px minmax(0, 1fr);
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

// To keep our styles  consistent across widgets, let's define them here based on html tags and classes
const Root = styled.div`
  font-family: "Open Sans", "Manrope", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 16px;
  line-height: 1.5;
  color: #000;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 0.5em;
  }

  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 20px;
  }

  h4 {
    font-size: 16px;
  }

  h5 {
    font-size: 14px;
  }

  h6 {
    font-size: 12px;
  }

  a {
    color: #000;
    text-decoration: none;
  }

  a:hover {
    color: #4498e0;
  }

  .ndc-card {
    border-radius: 16px;
    box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px, rgba(0, 0, 0, 0.05) 0 1px 20px;
    background-color: #fff;
  }
`;

return (
  <Root className="pb-5">
    <Widget src={`nui.sking.near/widget/Typography.OpenSansFont`} />

    <Widget
      src={`${widgetOwner}/widget/DAO.Layout.Header`}
      props={{
        daoId: state.daoId,
      }}
    />
    <Main>
      <Widget
        src={`${widgetOwner}/widget/DAO.Layout.Sidebar`}
        props={{
          daoId: state.daoId,
        }}
      />
      <div>
        <Widget
          src={`${widgetOwner}/widget/DAO.Layout.Tabs`}
          props={{
            tabs: tabs,
            tab: state.tab,
            update,
          }}
        />
        {tabContent}
      </div>
    </Main>
  </Root>
);
