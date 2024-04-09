const Hover = styled.div`
  &:hover {
    box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
      0px 1px 2px rgba(16, 24, 40, 0.06);
  }
`;

return (
  <Hover className="card">
    <a
      href="/#/devs.near/widget/community.Overview"
      label="props.label"
      class="text-decoration-none text-reset"
    >
      <img src={props.cover} class="card-img-top"></img>
      <div class="h5 pt-3 ps-3">{props.title}</div>
      <div class="ps-3 pb-2 text-secondary">{props.desc}</div>
    </a>
  </Hover>
);
