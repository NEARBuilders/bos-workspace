const creatorId = props.creatorId;
const groupId = props.groupId;

const groupInfo = Social.get(`${creatorId}/thing/${groupId}/**`, "final");

if (!groupInfo) {
  return "group details not found";
}
const groupData = JSON.parse(groupInfo[""]);

const NavUnderline = styled.ul`
  border-bottom: 1px #eceef0 solid;

  a {
    color: #687076;
    text-decoration: none;
  }

  a.active {
    font-weight: bold;
    color: #0c7283;
    border-bottom: 4px solid #0c7283;
  }
`;
/* END_INCLUDE: "core/lib/gui/navigation" */

const Button = styled.button`
  height: 40px;
  font-size: 14px;
  border-color: #e3e3e0;
  background-color: #ffffff;
`;

const Banner = styled.div`
  max-width: 100%;
  min-height: 240px;
  height: 240px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const { Feed } = VM.require("efiz.near/widget/Module.Feed");
Feed = Feed || (() => <></>);

const tabs = [
  {
    defaultActive: true,
    title: "Activity",
    iconClass: "bi bi-house-door",
    module: () => (
      <>
        <Widget
          src="devs.near/widget/Compose"
          props={{
            index: {
              post: JSON.stringify([
                {
                  key: {
                    id: groupId,
                    type: "thing",
                  },
                  value: {
                    type: "md",
                  },
                },
              ]),
            },
          }}
        />
        <Feed
          index={[
            {
              action: "post",
              key: {
                type: "thing",
                path: `${creatorId}/thing/${groupId}`,
              },
              options: {
                limit: 10,
                order: "desc",
                accountId: props.accounts,
              },
              cacheOptions: {
                ignoreCache: true,
              },
            },
            {
              action: "repost",
              key: JSON.stringify({
                type: "thing",
                path: `${creatorId}/thing/${groupId}`,
              }),
              options: {
                limit: 10,
                order: "desc",
                accountId: props.accounts,
              },
              cacheOptions: {
                ignoreCache: true,
              },
            },
          ]}
          Item={(p) => (
            <Widget
              loading={<div className="w-100" style={{ height: "200px" }} />}
              src="mob.near/widget/MainPage.N.Post"
              props={{ accountId: p.accountId, blockHeight: p.blockHeight }}
            />
          )}
        />
      </>
    ),
  },
  {
    iconClass: "bi bi-house-door",
    title: "Members",
    module: () => (
      <>
        <p>These are mutual members across all graphs</p>
        <Widget src="devs.near/widget/group.members" props={{ groupId }} />
      </>
    ),
  },
  {
    iconClass: "bi bi-house-door",
    title: "Graphs",
    module: () => (
      <>
        <p>
          These are the users that have created their versions of this group.
        </p>
        <Widget src="devs.near/widget/group.members" props={{ groupId }} />
      </>
    ),
  },
  {
    iconClass: "bi bi-gear",
    title: "Settings",
    module: () => (
      <Widget
        src="devs.near/widget/group.settings"
        props={{ groupId, groupData }}
      />
    ),
  },
  ...(groupData.tabs || []),
];

State.init({
  selectedTab: tabs[0],
});

const { metadata } = groupInfo;
const { name, description, image, backgroundImage } = metadata;

function Module({ module }) {
  if (typeof module === "function") {
    return module();
  } else {
    return <Widget src={module.src} />;
  }
}

return (
  <div className="d-flex flex-column gap-3 bg-white">
    <Banner
      className="object-fit-cover"
      style={{
        background: `center / cover no-repeat url(https://ipfs.near.social/ipfs/${backgroundImage.ipfs_cid})`,
      }}
    />

    <div className="d-md-flex d-block justify-content-between container">
      <div className="d-md-flex d-block align-items-end">
        <div className="position-relative">
          <div style={{ width: 150, height: 100 }}>
            <img
              alt="Loading logo..."
              className="border border-3 border-white rounded-circle shadow position-absolute"
              width="150"
              height="150"
              src={`https://ipfs.near.social/ipfs/${image.ipfs_cid}`}
              style={{ top: -50 }}
            />
          </div>
        </div>

        <div className="d-flex flex-column ps-3 pt-3 pb-2">
          <span className="h1 text-nowrap">{name}</span>
          <span className="text-secondary">{description}</span>
        </div>
      </div>

      <div className="d-flex align-items-end gap-3">
        <Button
          className="btn btn-outline-primary"
          onClick={() => State.update({ selectedTab: tabs[3] })}
        >
          Configure Community
        </Button>
        <Button className="btn btn-outline-primary">Join</Button>
      </div>
    </div>

    <NavUnderline className="nav">
      {tabs.map(({ iconClass, title }, index) =>
        title ? (
          <li className="nav-item" key={title}>
            <div
              className={[
                "d-inline-flex gap-2",
                state.selectedTab === title ? "nav-link active" : "nav-link",
              ].join(" ")}
              onClick={() => State.update({ selectedTab: tabs[index] })}
            >
              <i className={iconClass} />
              <span>{title}</span>
            </div>
          </li>
        ) : null
      )}
    </NavUnderline>
    <Content>
      <Module module={state.selectedTab.module} />
    </Content>
  </div>
);
