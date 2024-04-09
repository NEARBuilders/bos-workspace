const propsTable = `

| Prop Name       | Type/Values     | Default Value  | Description                                        |
|-----------------|-----------------|----------------|----------------------------------------------------|
| ${"`index`"}         | Object/Array           | ${"`N/A`"}            | The index to query for the feed. Follows props for Social.index.                          |
| ${"`Item`"}      | Function/ReactNode          | <div>{JSON.stringify(props)}</div>            | The Item to render for each feed item, will be passed the full object as props                     |
| ${"`Layout`"}  | Function/reactNode        | ${"`N/A`"}            | Optional Layout element for rendering the feed.           |
| ${"`typeWhitelist`"}| Array        | ${"['md']"}            | Optional whitelist for the item type to allow render.          |
`;

const widgetCode = `
\`\`\`jsx
const { Feed } = VM.require("devs.near/widget/Module.Feed");

Feed = Feed || (() => <></>); // make sure you have this or else it can break

return (
  <Feed
    index={{
      action: "every",
      key: "group",
      options: {
        limit: 10,
        order: "desc",
        accountId: undefined,
      },
    }}
    Item={(p) => {
      return <Widget
        key={p}
        src={widgets.group}
        props={{
          creatorId: p.accountId,
          groupId: p.value.id,
        }}
      />
    }}
    Layout={Grid}
  />
);
\`\`\`
`;

const { Feed } = VM.require("devs.near/widget/Module.Feed");

Feed = Feed || (() => <></>); // make sure you have this or else it can break

return (
  <div className="d-flex flex-column gap-1 pb-4">
    <Widget
      src={`nearui.near/widget/Typography.Text`}
      props={{
        children: "Usage",
        tag: "h2",
        size: "4",
        weight: "bold",
        color: "default",
        className: "mt-4 mb-2",
      }}
    />
    <Markdown text={widgetCode} />
    <Widget
      src={`nearui.near/widget/Typography.Text`}
      props={{
        children: "Properties",
        tag: "h2",
        size: "4",
        weight: "bold",
        color: "default",
        className: "mt-4 mb-2",
      }}
    />
    <Markdown text={propsTable} />
    <Widget
      src={"nearui.near/widget/Typography.Text"}
      props={{
        children: "Preview",
        tag: "h2",
        size: "4",
        weight: "bold",
        color: "default",
        className: "mt-4 mb-2",
      }}
    />
    <div
      className="d-flex flex-column gap-1"
      style={{
        background: "#fefefe",
        border: "1px solid #ccc",
        padding: "24px",
        borderRadius: "12px",
      }}
    >
      <Feed
        index={[
          {
            action: "post",
            key: "main",
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
            key: "main",
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
    </div>
  </div>
);
