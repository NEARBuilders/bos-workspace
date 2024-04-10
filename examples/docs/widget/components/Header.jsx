const { basePath, param, page } = props;

return (
  <div className="header">
    <div className="branding">
      <Link to={`/${basePath}`} className="link">
        <h3>bos-workspace</h3>
      </Link>
    </div>

    <div className="nav">
      {/* <Link to={`/${basePath}?${param}=about`} className="link">
        about
      </Link>
      <Link to={`/${basePath}?${param}=contact`} className="link">
        contact
      </Link> */}
    </div>
    <div className="end">
      {context.accountId === "efiz.near" && (
        <>
          {/* <Link
            to={
              props[param] === "edit"
                ? `/${basePath}?${param}=${page}`
                : `/${basePath}?${param}=edit&path=${page}`
            }
            className="link"
          >
            <img
              src="https://win98icons.alexmeub.com/icons/png/write_wordpad-1.png"
              alt="edit"
              width="32px"
              height="32px"
              aria-label="editor"
              title="editor"
            />
          </Link> */}
          <Link
            to={
              props[param] === "settings"
                ? `/${basePath}`
                : `/${basePath}?${param}=settings`
            }
            className="link"
          >
            <img
              src="https://win98icons.alexmeub.com/icons/png/settings_gear-0.png"
              alt="settings"
              width="32px"
              height="32px"
              aria-label="settings"
              title="settings"
            />
          </Link>
        </>
      )}
    </div>
  </div>
);
