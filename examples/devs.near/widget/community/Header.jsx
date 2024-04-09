const Header = styled.div`
   {
    height: 204px;
    overflow: hidden;
    background: #f3f3f3;
    padding: 10px 0;
    margin-top: -25px;
    margin-bottom: 25px;
    padding-left: 32px;
  }
`;

const NavUnderline = styled.ul`
  a {
    color: #3252a6;
    text-decoration: none;
  }

  a.active {
    font-weight: bold;
    border-bottom: 2px solid #0c7283;
  }
`;

const BreadcrumbLink = styled.a`
   {
    color: #3252a6;
    text-decoration: none;
  }
`;
const BreadcrumbBold = styled.b`
   {
    color: #3252a6;
  }
`;

return (
  <>
    <Header>
      <div aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <BreadcrumbLink href="Feed">DevHub</BreadcrumbLink>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            <BreadcrumbBold>{props.title}</BreadcrumbBold>
          </li>
        </ol>
      </div>
      <div class="d-flex flex-row align-items-center pb-3">
        <img src={props.icon} width="95px" height="95px"></img>
        <div>
          <div class="h5 pt-3 ps-3">{props.title}</div>
          <div class="ps-3 pb-2 text-secondary">{props.desc}</div>
        </div>
      </div>
      <div>
        <NavUnderline className="nav">
          <li class="nav-item">
            <a
              className={
                props.tab === "Overview" ? "nav-link active" : "nav-link"
              }
              aria-current="page"
              href="/devs.near/widget/community.Overview"
              label={props.label}
            >
              <i class="bi-house-door"> </i>
              Overview
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              className={
                props.tab === "Discussions" ? "nav-link active" : "nav-link"
              }
              href="/devs.near/widget/community.Discussions"
              label={props.label}
              tab="Events"
            >
              <i class="bi-chat-square-text"> </i>
              Discussions
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              className={
                props.tab === "Sponsorship" ? "nav-link active" : "nav-link"
              }
              href="/devs.near/widget/community.Sponsorship"
              label={props.label}
              tab="Events"
            >
              <i class="bi-kanban"> </i>
              Sponsorship
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              className={
                props.tab === "Events" ? "nav-link active" : "nav-link"
              }
              href="/devs.near/widget/community.Events"
              label={props.label}
              tab="Events"
            >
              <i class="bi-calendar"> </i>
              Events
            </a>
          </li>
        </NavUnderline>
      </div>
    </Header>
  </>
);
