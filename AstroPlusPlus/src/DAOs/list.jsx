const daos = props.daos;
const currentPage = props.page ?? 1;
const resPerPage = props.resPerPage ?? 6;

State.init({
  currentPage: currentPage,
  search: null,
});

const renderSubheader = () => (
  <div className="d-flex align-items-center gap-2 mt-4">
    <Widget
      key="search"
      src="nui.sking.near/widget/Input.Text"
      props={{
        placeholder: "Search by name",
        type: "search",
        size: "md",
        icon: (
          <i
            className="bi bi-search"
            style={{
              color: "#4498E0",
            }}
          />
        ),
        onChange: (v) => {
          State.update({
            search: v,
          });
        },
        value: state.search,
        inputProps: {
          autoFocus: true,
        },
      }}
    />
    <Widget
      src="nui.sking.near/widget/Layout.Modal"
      props={{
        open: state.filtersOpen,
        onOpenChange: (open) => {
          State.update({
            ...state,
            filtersOpen: open,
          });
        },
        toggle: (
          <Widget
            src="nui.sking.near/widget/Input.Button"
            props={{
              children: (
                <>
                  Filter
                  <i className="bi bi-funnel"></i>
                </>
              ),
              variant: "info outline",
              size: "md",
            }}
          />
        ),
        content: <div className="ndc-card p-2">WIP</div>,
      }}
    />
  </div>
);

const renderEmpty = () => (
  <div
    className="d-flex flex-column justify-content-center align-content-center text-center gap-3 m-auto"
    style={{
      height: "max(50vh, 400px)",
      maxWidth: "460px",
    }}
  >
    <i
      className="bi bi-exclamation-circle"
      style={{ fontSize: "4rem", color: "#4498E0" }}
    />
    <p className="h6">No DAO is found. Would you like to create one now?</p>
    <Widget
      src="nui.sking.near/widget/Input.Button"
      props={{
        children: "Create a new DAO",
        variant: "info w-100",
        size: "lg",
      }}
    />
    <Widget
      src="nui.sking.near/widget/Input.Button"
      props={{
        children: "Go to home",
        variant: "info outline w-100",
        size: "lg",
        href: "#/astro.sking.near/widget/index",
      }}
    />
  </div>
);

const renderLoading = () => <>loading</>;

let filteredDAOs = [];
let paginatedDAOs = [];
if (daos) {
  filteredDAOs = daos.filter((d) => {
    if (state.search == null) {
      return true;
    }
    return d.contract_id.toLowerCase().includes(state.search.toLowerCase());
  });
  paginatedDAOs = filteredDAOs.slice(
    (state.currentPage - 1) * resPerPage,
    state.currentPage * resPerPage
  );
}


const renderDAOsRows = () => {
  return (
    <div className="row g-3 flex-wrap">
      {paginatedDAOs.map((dao) => (
        <div
          key={dao.contract_id}
          className="flex-grow-1 col-12 col-md-6 col-lg-4 col-xl-3"
          style={{
            minWidth: "320px",
          }}
        >
          <Widget
            src="astro.sking.near/widget/DAOs.Card"
            props={{
              daoId: dao.contract_id,
            }}
          />
        </div>
      ))}
      {paginatedDAOs.length < resPerPage &&
        [...Array(resPerPage - paginatedDAOs.length)].map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex-grow-1 col-12 col-md-6 col-lg-4 col-xl-3"
            style={{
              minWidth: "320px",
            }}
          ></div>
        ))}
    </div>
  );
};
const renderPagination = () => (
  <div className="d-flex justify-content-center align-items-center gap-2">
    <Widget
      src="nui.sking.near/widget/Navigation.Paginate"
      props={{
        pageSize: resPerPage,
        currentPage: state.currentPage,
        totalPageCount: Math.ceil(filteredDAOs.length / resPerPage),
        onPageChange: (page) => {
          State.update({
            currentPage: page,
          });
        },
        revaluateOnRender: true,
      }}
    />
  </div>
);

return (
  <>
    {renderSubheader()}
    {daos != null &&
      (!daos || daos.length < 1 || filteredDAOs.length < 1) &&
      renderEmpty()}
    {daos == null && renderLoading()}
    {((daos != null && daos) || daos.length > 0) && (
      <div className="my-4">{renderDAOsRows()}</div>
    )}
    {((daos != null && daos) ||
      daos.length > resPerPage ||
      filteredDAOs.length > resPerPage) &&
      renderPagination()}
  </>
);
