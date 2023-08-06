/**
  To make sure that the sidebar displays correctly, you need to add some bootstrap classes to the parent component.
 
  Add the following className to the parent component: "row"
  and add the following CSS to the content component: "col"

Example:

return (
  <div className="row">
    <Widget src="account.near/widget/Common.Layout.Header" />
    <div className="col">home</div>
  </div>
);
 
*/

const hasSidebar = props.hasSidebar ?? true;
const items = props.items ?? [];

State.init({
  sidebarExpanded: false,
});

const Header = styled.div`
  border-bottom: 1px solid #e5e5e5;

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
  height: 100%;
  transition: all 0.5s ease-in-out;
  max-width: 300px;
  background: #fff;
  border-right: 1px solid #e5e5e5;

  &.collapsed {
    padding-right: 26px;
    max-width: 120px;
  }

  @media (max-width: 768px) {
    position: fixed !important;
    top: 0;
    bottom: 0;
    z-index: 10000;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &.collapsed {
      left: -400px;
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
    width: 100%;
    max-width: 240px;
  }

  .group {
    width: 100%;
  }

  li {
    background: #fff;
    cursor: pointer;
    border-radius: 8px;
    width: 100%;
    transition: all 100ms ease-in-out;

    div,
    a {
      padding: 8px 26px;
      color: #000 !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0;
      display: flex;
      gap: 12px;
      align-items: center;
    }

    i {
      font-size: 19px;
    }
  }

  li:hover {
    background-color: rgba(68, 152, 224, 0.1);

    * {
      color: #4498e0 !important;
    }
  }

  li:active {
    background-color: rgba(68, 152, 224, 0.12);
    * {
      color: #4498e0 !important;
    }
  }

  li.active {
    background-color: rgba(68, 152, 224, 0.1);

    * {
      color: #4498e0 !important;
    }
  }

  &.collapsed {
    li {
      width: 100% !important;

      div,
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        text-align: center;
        gap: 4px;
      }
    }
  }
`;

const Toggle = styled.div`
  position: absolute;
  top: 10px;
  right: -20px;
  z-index: 1000;
  height: 40px;
  width: 40px;
  background: #4498e0;
  color: #fff;
  border-radius: 6px;
  display: grid;
  place-items: center;

  @media (max-width: 768px) {
    bottom: 100px;
    top: auto;
  }
`;

const MobileToggle = styled.div`
  height: 40px;
  width: 40px;
  background: #4498e0;
  color: #fff;
  border-radius: 6px;
  display: grid;
  place-items: center;
`;

return (
  <>
    <Header className=" d-flex justify-content-between align-items-center py-3 px-md-3 m-0 flex-row">
      <MobileToggle
        className="sidebar-toggle btn btn-outline-light"
        onClick={() =>
          State.update({ sidebarExpanded: !state.sidebarExpanded })
        }
      >
        <i className="bi bi-list"></i>
      </MobileToggle>
      <a
        href="#//*__@appAccount__*//widget/home"
        className="h4 text-decoration-none fw-bold text-black m-0"
      >
        ASTRA++
      </a>
      <span>{context.accountId}</span>
    </Header>
    <Sidebar
      className={[
        "position-relative col-sm",
        !state.sidebarExpanded && "collapsed",
      ].join(" ")}
    >
      <Toggle
        role="button"
        onClick={() =>
          State.update({ sidebarExpanded: !state.sidebarExpanded })
        }
      >
        {state.sidebarExpanded ? (
          <i className="bi bi-chevron-left"></i>
        ) : (
          <i className="bi bi-chevron-right"></i>
        )}
      </Toggle>
      <ul className="pt-4">
        {items.map((item, i) => {
          if (Array.isArray(item)) {
            return (
              <div key={i} className="group">
                <ul>
                  {item.map((subItem, j) => {
                    if (subItem.hidden) return null;
                    return (
                      <li
                        key={j}
                        className={[
                          subItem.active && "active",
                          j > 0 && "ms-auto",
                        ].join(" ")}
                        style={{
                          width: j > 0 ? "85%" : "",
                        }}
                      >
                        {subItem.href ? (
                          <a href={subItem.href}>
                            {subItem.icon}
                            {subItem.title}
                          </a>
                        ) : (
                          <div onClick={subItem.onClick} role="button">
                            {subItem.icon}
                            {subItem.title}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          } else {
            if (item.hidden) return null;
            return (
              <li key={i} className={item.active && "active"}>
                {item.href ? (
                  <a href={item.href}>
                    {item.icon}
                    {item.title}
                  </a>
                ) : (
                  <div onClick={item.onClick} role="button">
                    {item.icon}
                    {item.title}
                  </div>
                )}
              </li>
            );
          }
        })}
      </ul>
    </Sidebar>
  </>
);
