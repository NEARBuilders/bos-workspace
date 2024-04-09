const accountId = props.accountId ?? context.accountId;
const groupId = props.groupId ?? "526fb256e74eelmf0nw3n5909bc189c13d";
if (!groupId) {
  return "";
}

const description = Social.get(
  `${accountId}/thing/${groupId}/metadata/description`
);

const Description = styled.div`
  max-height: 8rem;
  position: relative;
  overflow: hidden;
  h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6 {
    font-size: 1.2rem;
    margin: 0
  }
  p {
    margin: 0
  }
  :after {
    content  : "";
    position : absolute;
    z-index  : 1;
    top   : 4rem;
    left     : 0;
    pointer-events   : none;
    background-image : linear-gradient(to bottom, 
                      rgba(255,255,255, 0), 
                      rgba(255,255,255, 1) 90%);
    width    : 100%;
    height   : 4rem;
  }
`;

return (
  <div className="d-flex flex-column gap-1">
    <a
      href={`#/devs.near/widget/group?groupId=${groupId}`}
      className="link-dark text-truncate"
    >
      <Widget src="devs.near/widget/group.inline" props={{ groupId }} />
    </a>
    <Description>
      <Markdown text={description} />
    </Description>
    <div className="d-flex">
      <div className="me-3">
        <Widget src="devs.near/widget/group.stats" props={{ accountId }} />
      </div>
    </div>
    <div className="d-flex gap-2 mt-2">
      <Widget src="devs.near/widget/group.join" props={{ accountId }} />
    </div>
  </div>
);