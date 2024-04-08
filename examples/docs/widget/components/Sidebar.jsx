const pages = {
  home: {
    path: "${config_account}/widget/home",
    blockHeight: "final",
    init: {
      name: "Home",
    },
    default: true,
  },
};

return (
  <div className="sidebar">
    {Object.keys(pages).map((pageKey) => (
      <button className="button" key={pageKey}>
        {pages[pageKey].init.name}
      </button>
    ))}
  </div>
);
