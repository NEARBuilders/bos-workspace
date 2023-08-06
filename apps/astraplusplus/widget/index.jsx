let { tab } = props;
if (!tab) {
  tab = "home";
}
const currentLink = "#//*__@appAccount__*//widget/index";

const tabs = [
  {
    title: "Home",
    icon: <i className="bi bi-house-door"></i>,
    href: currentLink + "?tab=home",
    active: tab === "home",
    widgetName: "home",
  },
  [
    {
      title: "DAOs",
      icon: <i class="bi bi-grid bi-"></i>,
      active: tab.split("-")[0] === "daos",
      href: currentLink + "?tab=daos-all",
      widgetName: "DAOs.index",
      defaultProps: {},
    },
    {
      title: "NDC",
      active: tab === "daos-ndc",
      href: currentLink + "?tab=daos-ndc",
      widgetName: "DAOs.index",
      defaultProps: {},
    },
    {
      title: "Following",
      active: tab === "daos-following",
      href: currentLink + "?tab=daos-following",
      widgetName: "DAOs.index",
      defaultProps: {},
    },
    {
      title: "All",
      active: tab === "daos-all",
      href: currentLink + "?tab=daos-all",
      widgetName: "DAOs.index",
      defaultProps: {},
    },
  ],
  {
    title: "Bounties area",
    icon: <i class="bi bi-briefcase"></i>,
    active: tab === "bounties",
    href: currentLink + "?tab=bounties",
    widgetName: "bounties",
    defaultProps: {},
  },
  {
    title: "Actions library",
    icon: <i class="bi bi-code-slash"></i>,
    active: tab === "actions",
    href: currentLink + "?tab=actions",
    widgetName: "actions",
  },
  {
    title: "Create DAO",
    active: tab === "create-dao",
    href: currentLink + "?tab=create-dao",
    widgetName: "CreateDAO.index",
    hidden: true,
  },
];

let activeTab = null;
tabs.find((tab) => {
  if (Array.isArray(tab)) {
    return tab.find((subTab) => {
      if (subTab.active) {
        activeTab = subTab;
        return true;
      }
      return false;
    });
  }
  if (tab.active) {
    activeTab = tab;
    return true;
  }
  return false;
});

const tabContent = activeTab ? (
  <Widget
    src={"/*__@appAccount__*//widget/" + activeTab.widgetName}
    props={{
      ...activeTab.defaultProps,
      ...props,
    }}
  />
) : (
  "404"
);

const Root = styled.div`
  font-family:
    "Open Sans",
    "Manrope",
    system-ui,
    -apple-system,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    "Noto Sans",
    "Liberation Sans",
    Arial,
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji";
  font-size: 16px;
  line-height: 1.5;
  color: #000;

  a {
    color: #000;
    text-decoration: none;
  }

  a:hover {
    color: #4498e0;
  }

  .ndc-card {
    border-radius: 16px;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0 1px 3px,
      rgba(0, 0, 0, 0.05) 0 1px 20px;
    background-color: #fff;
  }
`;
return (
  <Root className="row">
    <Widget src={`nearui.near/widget/Typography.OpenSansFont`} />

    <Widget
      src="/*__@appAccount__*//widget/Common.Layout.Header"
      props={{
        items: tabs,
      }}
    />
    <div className="col ms-sm-4 ps-lg-5 py-3 py-md-5 overflow-hidden">
      {tabContent}
    </div>
  </Root>
);
