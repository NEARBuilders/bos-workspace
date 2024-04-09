const hashtag = props.hashtag ?? "abc";

return (
  <>
    <Widget src="mob.near/widget/ProfileOnboarding" />
    <ul
      className="nav nav-pills nav-fill mb-3 d-lg-none"
      id="pills-tab"
      role="tablist"
    >
      <li className="nav-item" role="presentation">
        <button
          className="nav-link active"
          id="pills-content-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-content"
          type="button"
          role="tab"
          aria-controls="pills-content"
          aria-selected="true"
        >
          Content
        </button>
      </li>
      <li className="nav-item" role="presentation">
        <button
          className="nav-link"
          id="pills-menu-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-menu"
          type="button"
          role="tab"
          aria-controls="pills-menu"
          aria-selected="false"
        >
          Menu
        </button>
      </li>
    </ul>
    <div className="tab-content row p-0" id="pills-tabContent">
      <div
        className="tab-pane show active d-lg-block col-lg-8"
        id="pills-content"
        role="tabpanel"
        aria-labelledby="pills-content-tab"
      >
        <Widget src="create.near/widget/ABC.Page" props={props} />
      </div>
      <div
        className="tab-pane d-lg-block col-lg-4"
        id="pills-menu"
        role="tabpanel"
        aria-labelledby="pills-menu-tab"
      >
        <Widget src="create.near/widget/ABC.Menu" props={props} />
      </div>
    </div>
  </>
);
