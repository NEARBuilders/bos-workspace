const hashtags = [
  { name: "dev", required: true },
  { name: "bos", required: true },
];

return (
  <Widget
    src="efiz.near/widget/Community.Posts"
    props={{
      communityHashtags: hashtags,
      exclusive: false,
      allowPublicPosting: true,
    }}
  />
);
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
        <Widget src="devs.near/widget/dev.main" props={props} />
      </div>
      <div
        className="tab-pane d-lg-block col-lg-4"
        id="pills-menu"
        role="tabpanel"
        aria-labelledby="pills-menu-tab"
      >
        <Widget src="devs.near/widget/dev.side" props={props} />
      </div>
    </div>
  </>
);
