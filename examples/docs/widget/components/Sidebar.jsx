const { routes, basePath, param } = props;

return (
  <div className="sidebar">
    {Object.keys(routes).map((pageKey) => (
      <Link to={`/${basePath}?${param}=${pageKey}`}>
        <button className="button" key={pageKey}>
          {routes[pageKey].init.name}
        </button>
      </Link>
    ))}
  </div>
);
