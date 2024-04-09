const src = props.src ?? "devs.near/widget/community";
const update = props.update ?? "hack.near/widget/community";

const { handleClose } = props;

State.init({
  src,
  update,
});

const source = Social.get(`${state.src}`);
const newVersion = Social.get(`${state.update}`);

const [creatorId, type, name] = src.split("/");

const data = {
  index: {
    notify: JSON.stringify({
      key: creatorId,
      value: {
        type: "request",
        data: {
          type: "merge",
          src: state.src,
          update: state.update,
        },
      },
    }),
  },
};

const Container = styled.div`
  .profile-image {
    width: 120px;
    height: 120px;
  }

  .top-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  @media (max-width: 576px) {
    .profile-image {
      width: 160px;
      height: 160px;
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
`;

const ComponentWrapper = styled.div`
  display: flex;
  width: 80%;
  height: 80%;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  background: #fff;
  border: 1px solid transparent;
  margin: 140px auto auto auto;
  @media only screen and (max-width: 480px) {
    width: 90%;
  }
`;

const CardStyled = styled.div`
  width: 100%;
  height: 100%;
  background: #f8f8f9;
  gap: 10px;
  padding: 25px;
  margin: 0 auto;
  border-radius: 10px;
  overflow-y: scroll;
`;

const CardForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

return (
  <Modal>
    <ComponentWrapper>
      <CardStyled>
        <CardForm>
          <Container>
            <div className="d-flex flex-wrap justify-content-between mb-3">
              <div className="m-1">
                <h3>Request Changes</h3>
              </div>
              <div className="ms-auto me-0 me-md-2 d-flex align-items-center">
                <div className="top-right">
                  <Widget
                    src="james.near/widget/styling"
                    props={{
                      Button: {
                        style: "danger",
                        text: "Close",
                        onClick: handleClose,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <h5 className="m-1 mt-4">input path of updated thing</h5>
            <div className="input-group m-1 mb-2">
              <input
                className="form-control mt-2"
                defaultValue={state.update}
                onChange={(e) => {
                  State.update({
                    update: e.target.value,
                  });
                }}
              />
            </div>
            <CommitButton
              disabled={source === newVersion}
              className="btn btn-outline-secondary m-1 mt-3"
              data={data}
            >
              <i className="bi bi-git"></i>
              Submit
            </CommitButton>
            <hr />
            <h3>Preview Changes</h3>
            <Widget
              src="hack.near/widget/compare"
              props={{ src: state.src, update: state.update }}
            />
          </Container>
        </CardForm>
      </CardStyled>
    </ComponentWrapper>
  </Modal>
);
