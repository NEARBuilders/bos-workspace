if (!props.accountId || !context.accountId) {
  return "";
}

const o = Social.keys(
  `${props.accountId}/graph/connect/${context.accountId}`,
  undefined,
  {
    values_only: true,
  }
);

return o && Object.keys(o).length ? (
  <span className="badge bg-secondary fw-light">Group Member</span>
) : (
  ""
);
