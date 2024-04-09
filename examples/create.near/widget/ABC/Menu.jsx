const menu = context.accountId
  ? Social.get(`${context.accountId}/settings/near.social/page.menu`)
  : undefined;

if (menu === null) {
  return "";
}

const defaultWidgets = [
  {
    src: "create.near/widget/Page.Links",
  },
  {
    src: "create.near/widget/Page.Compose",
    requiresLogin: true,
  },
  {
    src: "create.near/widget/Pages",
  },
  {
    src: "create.near/widget/ABC.Members",
  },
];

const widgets = (menu && JSON.parse(menu)) ?? defaultWidgets;

const Div = styled.div`
  position: relative;
  @media (hover: hover) {
    > .edit-link {
      display: none;
    }
  }
  &:hover {
    > .edit-link {
      display: inline;
    }
  }
`;

return (
  <Div>
    {context.accountId && (
      <a
        key="edit"
        href={"#/create.near/widget/Page.Menu.Editor"}
        className="edit-link position-absolute top-0 end-0 link-secondary me-2 mt-1"
      >
        <i class="bi bi-pencil" /> Edit Menu
      </a>
    )}
    {widgets.map(
      ({ src, requiresLogin }, i) =>
        (!requiresLogin || context.accountId) && (
          <div key={i} className="text-bg-light rounded-4 p-3 mb-3">
            <Widget src={src} />
          </div>
        )
    )}
  </Div>
);
