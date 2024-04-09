const { href } = VM.require("buildhub.near/widget/lib.url") || {
  href: () => "/",
};

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

function findDefaultRoute(routesObject) {
  const routeKey =
    routesObject &&
    Object.keys(routesObject).find((key) => {
      const route = routesObject[key];
      return route.default === true;
    });

  if (routeKey) {
    return routesObject[routeKey];
  } else {
    return null;
  }
}

function Router({ config, ...passProps }) {
  const { routes, PageNotFound, debug, param } = config;

  if (!param) param = "page";

  const defaultRoute =
    findDefaultRoute(routes) ??
    (routes && Object.keys(routes).length && routes[Object.keys(routes)[0]]);
  const activeRoute =
    (routes &&
      routes.hasOwnProperty(passProps[param]) &&
      routes[passProps[param]]) ||
    defaultRoute;

  if (!PageNotFound) PageNotFound = () => <p>404 Not Found</p>;

  if (!activeRoute) {
    // Handle 404 or default case for unknown routes
    return <PageNotFound />;
  }

  // An improvement may be to "lazy load", e.g. load all widgets at once and only "display" the active one
  // potentionally add a "lazy: true" prop to the route object

  // for each route, if lazy, load the widget and store it in a map
  // set display for the active route

  // we may want to convert this to a widget for that purpose, to manage state?
  if (debug) {
    return (
      <div key={JSON.stringify(activeRoute)}>
        <pre>{JSON.stringify(activeRoute, null, 2)}</pre>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </div>
    );
  } else {
    return (
      <Content key={param + JSON.stringify(activeRoute)}>
        <Widget
          src={activeRoute.path}
          props={activeRoute.init}
          loading={<div style={{ height: "100%", width: "100%" }} />}
        />
      </Content>
    );
  }
}

return { Router };
