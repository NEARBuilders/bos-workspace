const accountId = context.accountId;

const homepage = accountId
  ? Social.get(`${accountId}/settings/every/homepage`)
  : undefined;

if (homepage === null) {
  return "Loading";
}

const { ContextMenu } = VM.require("efiz.near/widget/Module.ContextMenu");

ContextMenu = ContextMenu || (() => <></>);

return (
  <ContextMenu
    Item={() => (
      <Widget src={homepage ?? "every.near/widget/home.index"} props={props} />
    )}
    passProps={{}}
    handlers={{
      setHomepage: ({ path }) => {
        if (props.open) {
          props.open({ src: "efiz.near/widget/placeholder" });
        }
      },
    }}
    items={{
      setHomepage: () => (
        <>
          <i className="menu__item__icon bi bi-x-lg" />
          Set Homepage
        </>
      ),
    }}
  />
);
