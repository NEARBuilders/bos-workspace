const { basePath, param } = props;

const { get } = VM.require("${config_account}/widget/adapter");

const documents = get();

return (
  <div className="sidebar">
    {Object.keys(documents).map((path) => (
      <Link to={`/${basePath}?${param}=${path}`} key={path}>
        <button className="button">{documents[path].title}</button>
      </Link>
    ))}
  </div>
);
