const lhs = context.accountId
  ? Social.get(`${context.accountId}/settings/near.social/page.lhs`)
  : undefined;

if (lhs === null) {
  return "";
}

const defaultContent = [
  {
    src: "create.near/widget/Page.Content",
  },
];

const content = (lhs && JSON.parse(lhs)) ?? defaultContent;

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
        href={"#/create.near/widget/Page.LHS.Editor"}
        className="edit-link position-absolute top-0 end-0 link-secondary me-2 mt-1"
      >
        <i class="bi bi-pencil" /> Edit Content
      </a>
    )}
    {content.map(
      ({ src, requiresLogin }, i) =>
        (!requiresLogin || context.accountId) && (
          <div key={i} className="text-bg-light rounded-4 p-3 mb-3">
            <Widget src={src} />
          </div>
        )
    )}
  </Div>
);
