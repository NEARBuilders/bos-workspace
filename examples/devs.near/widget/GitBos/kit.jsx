const kit = context.accountId
  ? Social.get(`${context.accountId}/settings/near.builders/kit`)
  : undefined;

if (kit === null) {
  return "";
}

const defaultWidgets = [
  {
    src: "devs.near/widget/GitBos.info",
  },
  {
    src: "devs.near/widget/dev.collab",
  },
];

const widgets = (kit && JSON.parse(kit)) ?? defaultWidgets;

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
      <h5>Welcome Builders!</h5>
      {context.accountId && (
        <a
          key="edit"
          href={"/devs.near/widget/GitBos.kit.editor"}
          className="edit-link position-absolute top-0 end-0 link-secondary me-2 mt-1"
        >
          <i class="bi bi-pencil-square" /> Customize
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
