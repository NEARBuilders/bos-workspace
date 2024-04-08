const { href } = VM.require("devs.near/widget/lib.url") || {
  href: () => "/",
};

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

function Router({ config, ...passProps }) {
  const { routes, PageNotFound, debug, param } = config;

  let activeRoute;
  let activeRouteProps = {};

  if (!param) param = "page";
  const matchingRoute = routes.find((route) => {
    const pattern = `^${route.path
      .substring(1)
      .replace(/\//g, "\\/")
      .replace(/:\w+\*?/g, "([^/]+)")}$`;

    if (passProps[param] === undefined && route.path === "/") {
      return true; // Match root path
    } else if (passProps[param]) {
      const match = passProps[param].match(pattern);
      if (match) {
        const [_, ...params] = match;
        activeRouteProps = { _params: { [param]: params.join("") } };
        return true;
      }
    }

    return false;
  });

  if (matchingRoute) {
    activeRoute = matchingRoute;
  } else {
    // Fallback to dynamic path route if no other route matches
    const dynamicPathRoute = routes.find((route) => route.path === "/:path*");
    if (dynamicPathRoute) {
      activeRoute = dynamicPathRoute;
      activeRouteProps = { _params: { [param]: passProps[param] || "" } };
    } else {
      activeRoute = PageNotFound;
    }
  }

  if (activeRoute.element) {
    activeRouteProps = {
      ...activeRouteProps,
      ...activeRoute.element.initialProps,
    };
  }

  if (debug) {
    return (
      <div key={JSON.stringify(activeRoute)}>
        <pre>{JSON.stringify(activeRoute, null, 2)}</pre>
        <pre>{JSON.stringify(passProps, null, 2)}</pre>
      </div>
    );
  } else {
    const params = passProps[param]
      ? { _params: { [param]: passProps[param] } }
      : {};
    return (
      <Content key={param + JSON.stringify(activeRoute)}>
        <Widget
          src={activeRoute.element.src}
          props={{ ...activeRouteProps, ...params }}
          loading={<div style={{ height: "100%", width: "100%" }} />}
        />
      </Content>
    );
  }
}

return { Router };
