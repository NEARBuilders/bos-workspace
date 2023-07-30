const label = props.label;
const onChange = props.onChange ?? (() => {});
const buttonText = props.buttonText || "Upload an image";
const cid = props.value ?? null;
const showDelete = props.showDelete ?? true;

State.init({
  file: { cid },
});

const ipfsUrl = (cid) => `https://ipfs.near.social/ipfs/${cid}`;

const filesOnChange = (file) => {
  if (file?.length > 0) {
    State.update({
      file: {
        uploading: true,
        cid: null,
      },
    });
    const body = file[0];
    asyncFetch("https://ipfs.near.social/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body,
    }).then((res) => {
      const cid = res.body.cid;
      State.update({
        file: {
          cid,
        },
      });
      if (onChange) {
        onChange(cid);
      }
    });
  } else {
    State.update({
      file: null,
    });
    if (onChange) {
      onChange(null);
    }
  }
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0px;
  gap: 0.45em;
  width: 100%;
`;

const Label = styled.label`
  font-style: normal;
  font-weight: 600;
  font-size: 0.95em;
  line-height: 1.25em;
  color: #344054;
`;

const Error = styled.span`
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 0.75em;
  line-height: 1.25em;
  color: #ff4d4f;
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease-in-out;

  &.show {
    height: 1.25em;
  }
`;

const IconButton = styled.div`
  font-size: 18px;
  padding: 5px;
  transition: all 100ms ease;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;

  &.danger {
    color: red;
  }

  &.danger:hover {
    color: red;
  }

  &:hover {
    color: #4f46e5;
    transform: scale(1.3);
  }
`;

return (
  <Container>
    {label && <Label>{label}</Label>}
    <div className="d-inline-flex align-items-center gap-2">
      {cid ? <img src={ipfsUrl(cid)} width={100} /> : <></>}
      <Files
        multiple={false}
        accepts={["image/*"]}
        minFileSize={1}
        clickable
        className="btn btn-outline-primary"
        onChange={filesOnChange}
      >
        {state.file?.uploading ? "Uploading" : cid ? "Replace" : buttonText}
      </Files>
      {showDelete && !state.file?.uploading && cid ? (
        <IconButton
          className="danger"
          role="button"
          title="Delete Image"
          onClick={() => filesOnChange([])}
        >
          <i class="bi bi-x-lg"></i>
        </IconButton>
      ) : null}
    </div>
    <Error className={error ? "show" : ""}>{error}</Error>
  </Container>
);
