const hashtag = props.hashtag ?? "abc";

const page = context.accountId
  ? Social.get(`${context.accountId}/settings/near.social/page`)
  : undefined;

if (page === null) {
  return "";
}

const defaultWidgets = [
  {
    src: "create.near/widget/ABC.Navbar",
  },
  {
    src: "create.near/widget/Page.Header",
  },
  {
    src: "create.near/widget/ABC.Featured",
  },
  {
    src: "create.near/widget/ABC.Feed",
  },
];

const widgets = (page && JSON.parse(page)) ?? defaultWidgets;

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
    <div className="mb-3">
      <Widget
        src="miraclx.near/widget/Attribution"
        props={{
          dep: true,
          authors: ["create.near"],
        }}
      />
      {context.accountId && (
        <a
          key="edit"
          href={"#/create.near/widget/Custom.Page.Editor"}
          className="edit-link position-absolute top-0 end-0 link-secondary me-2 mt-1"
        >
          <i class="bi bi-pencil" /> Edit Page
        </a>
      )}
    </div>
    <div>
      {widgets.map(
        ({ src, requiresLogin }, i) =>
          (!requiresLogin || context.accountId) && (
            <div key={i} className="text-bg-light rounded-4 p-3 mb-3">
              <Widget src={src} />
            </div>
          )
      )}
    </div>
  </Div>
);
