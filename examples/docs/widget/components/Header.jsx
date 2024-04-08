const { basePath, param } = props;

return (
  <div className="header">
    <Link to={`/${basePath}`} className="link">
      <h3>bos-workspace</h3>
    </Link>
    <Link to={`/${basePath}?${param}=settings`} className="link">settings</Link>
  </div>
);
