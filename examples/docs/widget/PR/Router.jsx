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
  let params = {};

  if (!param) param = "page";
  const matchingRoute = routes.find((route) => {
    // if no path is provided, match root path
    if (passProps[param] === undefined && route.path === "/") {
      return true;
    } else if (passProps[param] === route.path.substring(1)) {
      return true;
    }
    return false;
  });

  if (matchingRoute) {
    activeRoute = matchingRoute;
  } else {
    // Fallback to dynamic path route if no other route matches
    const dynamicPathRoute = routes.find((route) => {
      const path = route.path.substring(1);
      return path.startsWith(":") || path.startsWith("*");
    });
    if (dynamicPathRoute) {
      const key = dynamicPathRoute.path
        .substring(1)
        .replace("*", "")
        .replace(":", "");
      activeRoute = dynamicPathRoute;
      params = { _params: { [key]: passProps[param] || "" } };
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
