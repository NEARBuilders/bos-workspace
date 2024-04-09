const accountId = props.accountId ?? context.accountId;
const tab = props.tab === "leaders" ? props.tab : "members";

return (
  <div>
    <ul className="nav nav-pills nav-fill mb-4" role="tablist">
      <li className="nav-item" role="presentation">
        <a
          href={`#/create.near/widget/JoinPage?accountId=${accountId}&tab=members`}
          className={`btn nav-link ${tab === "members" ? "active" : ""}`}
          role="tab"
        >
          Members
        </a>
      </li>
      <li className="nav-item" role="presentation">
        <a
          href={`#/create.near/widget/JoinPage?accountId=${accountId}&tab=leaders`}
          className={`btn nav-link ${tab === "leaders" ? "active" : ""}`}
          role="tab"
        >
          Leaders
        </a>
      </li>
    </ul>
    <div className="tab-content">
      <div className="tab-pane fade in show active" role="tabpanel">
        <Widget
          src={
            tab === "members"
              ? "create.near/widget/Members"
              : "create.near/widget/Leaders"
          }
          props={{ accountId }}
        />
      </div>
    </div>
  </div>
);
