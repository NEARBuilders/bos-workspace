/**
  To make sure that the sidebar displays correctly, you need to add some bootstrap classes to the parent component.
 
  Add the following className to the parent component: "row"
  and add the following CSS to the content component: "col"

Example:

return (
  <div className="row">
    <Widget src="astro.sking.near/widget/Common.Layout.Header" />
    <div className="col">home</div>
  </div>
);
 
*/

State.init({
  sidebarExpanded: true,
});

const Header = styled.div`
  .sidebar-toggle {
    display: none;
  }
  @media (max-width: 768px) {
    .sidebar-toggle {
      display: block;
    }
  }
`;

const Sidebar = styled.div`
  background-color: lightblue;
  height: 100%;
  transition: all 0.5s ease-in-out;
  max-width: 50px;

  &.expanded {
    max-width: 300px;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: -400px;
    bottom: 0;
    z-index: 10000;

    &.expanded {
      left: 0;
    }
  }
`;

return (
  <>
    <Header className=" d-flex justify-content-between align-items-center py-3 px-1 bg-danger m-0 flex-row">
      <button
        className="sidebar-toggle btn btn-outline-light"
        onClick={() =>
          State.update({ sidebarExpanded: !state.sidebarExpanded })
        }
      >
        <i className="bi bi-list"></i>
      </button>
      <a
        href="#/astro.sking.near/widget/home"
        className="h4 text-decoration-none fw-bold text-black m-0"
      >
        ASTRA++
      </a>
      <span>{context.accountId}</span>
    </Header>
    <Sidebar
      className={["col-sm", state.sidebarExpanded && "expanded"].join(" ")}
    >
      <button
        onClick={() =>
          State.update({ sidebarExpanded: !state.sidebarExpanded })
        }
      >
        toggle
      </button>
      bobo
    </Sidebar>
  </>
);
