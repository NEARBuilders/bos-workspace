const Url = {
  construct: (url, params) => {
    let query = "";
    Object.keys(params || {}).forEach((key) => {
      if (params.hasOwnProperty(key)) {
        query += Url.encode(key) + "=" + Url.encode(params[key]);
        if (key !== Object.keys(params || {}).slice(-1)[0]) {
          query += "&";
        }
      }
    });
    return url + "?" + query;
  },
  // Alternative to encodeURIComponent
  encode: (str) => {
    return `${str}`
      .replace(/[!'()*]/g, (c) => {
        return "%" + c.charCodeAt(0).toString(16);
      })
      .replace(/[^!'\(\)~\*A-Za-z0-9\-_\.~]/g, (c) => {
        return "%" + c.charCodeAt(0).toString(16);
      });
  },
};

const classNames = (classes) =>
  classes.filter((className) => className).join(" ");


function Navbar({ open, setOpen, pages, onPageChange }) {
  return (
    <div
      className="navbar mb-3 navbar-expand-lg px-4 rounded-pill"
      style={{
        backgroundColor: "#f9fbfe",
        border: "1px solid #d1d5db",
      }}
    >
      <a
        className="navbar-brand d-flex align-items-center gap-2 text-decoration-none"
        href="#/create.near/widget/home"
        onClick={() => onPageChange("projects")}
      >
        <img
          src="https://ipfs.near.social/ipfs/bafkreidttc7hbxdkykiwjefngcpwguapc6jhtaro65laysquzrgwlsxlo4"
          alt="Create Logo"
          height={30}
          width={30}
          style={{
            marginBottom: 5,
            objectFit: "contain",
          }}
        />
        <span
          style={{
            fontWeight: 600,
            letterSpacing: -1,
          }}
        >
          Create
        </span>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setOpen(!open)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className={classNames([
          "collapse navbar-collapse",
          open ? "show" : "hide",
        ])}
        id="navbarNav"
      >
        <ul className="navbar-nav">
          {Array.isArray(pages) &&
            pages.map((p) => {
              return (
                <li className="nav-item">
                  <a
                    className="nav-link text-capitalize text-decoration-none"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => onPageChange(p)}
                    href={Url.construct("#/create.near/widget/home", {
                      page: p,
                    })}
                  >
                    {p}
                  </a>
                </li>
              );
            })}
        </ul>
      </div>
      {/* Then this button could be installed on the gateway level 
    <Widget
      src="nui.sking.near/widget/Input.Button"
      props={{
        children: (
          <>
            Share
            <i className="bi bi-share"></i>
          </>
        ),
        onClick: () => {
          const url = Storage.get("url");
          clipboard.writeText("https://everything.dev/" + url);
        },
        variant: "info outline",
        size: "md",
      }}
    />
    */}
    </div>
  );
}

return Navbar(props);
