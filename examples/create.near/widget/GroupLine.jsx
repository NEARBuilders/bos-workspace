const accountId = props.accountId ?? context.accountId;
const link = props.link ?? true;

const group = props.group ?? Social.getr(`${accountId}/group`);

const inner = (
  <>
    <Widget
      src="create.near/widget/GroupImage"
      props={{
        style: { width: "1.5em", height: "1.5em" },
        profile,
        accountId,
        className: "d-inline-block",
        imageClassName: "rounded w-100 h-100 align-top",
      }}
    />
    <span>{group.name || ""}</span>
  </>
);

return link ? (
  <a
    href={
      link !== true ? link : `#/create.near/widget/Group?accountId=${accountId}`
    }
    className="link-dark text-truncate"
    style={{ textDecoration: "none" }}
  >
    {inner}
  </a>
) : (
  <span className="text-truncate">{inner}</span>
);
