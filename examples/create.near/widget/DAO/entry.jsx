const text =
  props.text ?? "This page includes content from a list of qualified builders.";

const buttonText = props.buttonText ?? "Construction Site";

const Wrapper = styled.div`
    background-color: #000;
color: #fff;
  border-bottom: 1px solid #eee;
  margin: 0 0 0 -12px;
`;

return (
  <Wrapper className="d-flex align-items-center flex-row p-2">
    <div className="m-3">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Yellow_hard_hat.svg"
        style={{ width: "50px", height: "50px" }}
        alt="Builder Hat"
      />{" "}
    </div>
    <div className="m-2 flex-grow-1">
      <p>{text}</p>
      <div>
        <a
          className="btn btn-secondary rounded-5 mb-1"
          href="https://nearbuilders.org/join"
        >
          <i class="bi bi-cone-striped"></i> {buttonText}
        </a>
      </div>
    </div>
  </Wrapper>
);
