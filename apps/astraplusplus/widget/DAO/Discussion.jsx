return (
  <>
    <h3>Curated Posts</h3>
    <a
      className="btn btn-outline-secondary m-2"
      href="/#/hack.near/widget/DAO.Feed.Editor"
    >
      <b>Update Feed</b>
    </a>
    <hr />
    <Widget
      src={"hack.near/widget/DAO.Social"}
      props={{ daoId: props.daoId }}
    />
  </>
);
