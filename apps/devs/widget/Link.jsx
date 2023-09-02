const to = props.to;
const handleNavigate = props.handleNavigate;
const children = props.children;

return (
  <button onClick={() => handleNavigate(to)} key={to}>
    {children}
  </button>
);
