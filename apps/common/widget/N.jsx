const hashtag = props.hashtag;

if (!state || state.hashtag !== hashtag) {
  State.update({
    feedIndex: hashtag ? "hashtag" : context.accountId ? "following" : "all",
    hashtag,
  });
}

const options = [
  {
    id: "following",
    title: "Following",
    disabled: !context.accountId,
  },
  {
    id: "all",
    title: "All Posts",
  },
  {
    id: "menu",
    title: "Menu",
    mobileOnly: true,
  },
];

if (hashtag) {
  options.splice(2, 0, {
    id: "hashtag",
    title: `#${hashtag}`,
  });
}

let accounts = undefined;

if (state.feedIndex === "following") {
  const graph = Social.keys(`${context.accountId}/graph/follow/*`, "final");
  if (graph !== null) {
    accounts = Object.keys(graph[context.accountId].graph.follow || {});
    accounts.push(context.accountId);
  } else {
    accounts = [];
  }
}

const Nav = styled.div`
  .nav-pills {
    background: #fbfbfb;
    font-weight: 500;
    --bs-nav-pills-border-radius: 0;
    --bs-nav-link-color: #000;
    --bs-nav-pills-link-active-color: #000;
    --bs-nav-pills-link-active-bg: #fbfbfb;
    --bs-nav-link-padding-y: 0.75rem;
    border-bottom: 1px solid #eee;
    padding-top: 3px;
  }
  .nav-link.active {
    border-bottom: 3px solid rgb(13, 110, 253);
  }

  .nav-item:not(:has(> .disabled)):hover {
    background: rgba(13, 110, 253, 0.15);
  }

  margin: 0 -12px;

  @media(max-width: 991px) {
    margin: -24px -12px 0;
  }
`;

return (
  <div className="row">
    <div className="col-lg-8">
      <Nav>
        <ul className="nav nav-pills nav-fill">
          {options.map((option, i) => (
            <li
              className={`nav-item ${option.mobileOnly ? "d-lg-none" : ""}`}
              key={i}
            >
              <button
                className={`nav-link ${
                  state.feedIndex === option.id ? "active" : ""
                } ${option.disabled ? "disabled" : ""}`}
                aria-disabled={!!option.disabled}
                onClick={() =>
                  !option.disabled && State.update({ feedIndex: option.id })
                }
              >
                {option.title}
              </button>
            </li>
          ))}
        </ul>
      </Nav>
      <div
        className={`${state.feedIndex === "menu" ? "d-none" : ""} d-lg-block`}
      >
        {context.accountId && (
          <Widget
            key="compose"
            loading=""
            src="mob.near/widget/MainPage.N.Compose"
            props={{}}
          />
        )}
        {state.feedIndex === "hashtag" ? (
          <Widget
            key="hash-feed"
            src="mob.near/widget/Hashtag.N.Feed"
            props={{ hashtag }}
          />
        ) : (
          <Widget
            key="reg-feed"
            src="mob.near/widget/MainPage.N.Feed"
            props={{ accounts }}
          />
        )}
      </div>
    </div>
    <div
      className={`${
        state.feedIndex !== "menu" ? "d-none" : "pt-3"
      } d-lg-block col-lg-4`}
    >
      <Widget src="mob.near/widget/Welcome.RHS" props={props} />
    </div>
  </div>
);