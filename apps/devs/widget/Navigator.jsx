/**
 * TODO: Make super generic header bar with ability to change theming on it.
 */

const RouterLink = props.RouterLink;

return (
  <div>
    {Object.keys(props.routes).map((route) => (
      <RouterLink to={route}>hey</RouterLink>
    ))}
  </div>
);
