const { formState, errors, renderFooter } = props;

const initialAnswers = {
  profileImage: formState.profileImage,
  coverImage: formState.coverImage,
};

State.init({
  answers: initialAnswers,
});

const onValueChange = (key, value) => {
  State.update({
    answers: {
      ...state.answers,
      [key]: value,
    },
  });
};

const Profile = styled.div`
  .avatar {
    width: 15%;
    max-width: 180px;
    min-width: 100px;
    margin-left: 50px;
    transform: translateY(-50%);
    background-color: #eee;
    background-size: cover;
    background-position: center;
  }
`;

const BG = styled.div`
  --bs-aspect-ratio: 20%;
  background-color: #eee;
  background-size: cover;
  background-position: center;
  min-height: 120px;
`;

const renderUploadButton = ({ onChange, value }) => {
  return (
    <Widget
      src="nearui.near/widget/Social.ImageUpload"
      props={{
        onChange: onChange,
        value: value,
        uploadButton: (otherProps) => (
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-pen" />,
              variant: "icon  info",
              size: "md",
              className: "position-absolute bottom-0 end-0 m-3",
              ...otherProps,
            }}
          />
        ),
        deleteButton: (otherProps) => (
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-trash" />,
              variant: "icon  danger",
              size: "md",
              className: "position-absolute bottom-0 end-0 m-3",
              ...otherProps,
            }}
          />
        ),
        loadingButton: (otherProps) => (
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: (
                <div
                  class="spinner-border text-light"
                  style={{
                    width: "1.1rem",
                    height: "1.1rem",
                    borderWidth: "0.15em",
                  }}
                  role="status"
                ></div>
              ),
              variant: "icon info",
              size: "md",
              className: "position-absolute bottom-0 end-0 m-3",
              ...otherProps,
            }}
          />
        ),
      }}
    />
  );
};

const renderAssetsEditor = (hideEditButtons) => {
  return (
    <Profile
      className="overflow-hidden w-100"
      style={{
        marginBottom: "-40px",
      }}
    >
      <BG
        className="ratio rounded-4"
        style={{
          backgroundImage: `url(${state.answers.coverImage})`,
        }}
      >
        <div>
          {!hideEditButtons &&
            renderUploadButton({
              onChange: (v) => onValueChange("coverImage", v),
              value: state.answers.coverImage,
            })}
        </div>
      </BG>
      <div
        className="avatar rounded-4 border border-2 border-white ratio ratio-1x1 position-relative z-1"
        style={{
          backgroundImage: `url(${state.answers.profileImage})`,
        }}
      >
        <div>
          {!hideEditButtons &&
            renderUploadButton({
              onChange: (v) => onValueChange("profileImage", v),
              value: state.answers.profileImage,
            })}
        </div>
      </div>
    </Profile>
  );
};

const daoPreviewState = `
\`\`\`json
${JSON.stringify({ ...formState, ...state.answers }, null, 2)}
\`\`\`
`;

return (
  <div className="mt-4 ndc-card p-4">
    <div className="d-flex flex-column gap-4">
      <div className="d-flex gap-2 justify-content-between align-items-center">
        <h2 className="h5 fw-bold">
          <span
            className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bolder h5 me-2 mb-0"
            style={{
              width: "48px",
              height: "48px",
              border: "1px solid #82E299",
            }}
          >
            6
          </span>
          Create DAO Assets
        </h2>
        <Widget
          src="nearui.near/widget/Layout.Modal"
          props={{
            content: (
              <div className="ndc-card p-4">
                <h3 className="h6 fw-bold">DAO Preview</h3>
                <Markdown text={daoPreviewState} />
                {renderFooter(state.answers, {
                  hasPrevious: false,
                })}
              </div>
            ),
            toggle: (
              <Widget
                src="nearui.near/widget/Input.Button"
                props={{
                  children: "Preview DAO",
                  variant: "outline info",
                  size: "lg",
                }}
              />
            ),
          }}
        />
      </div>
      <div className="d-flex gap-2 justify-content-between align-items-center">
        <div>
          <h3 className="h6 fw-bold">Set profile image and background image</h3>
          <p className="text-black-50 fw-light small">
            Update the DAO profile image and background images below
          </p>
        </div>
        <Widget
          src="nearui.near/widget/Layout.Modal"
          props={{
            content: (
              <div className="ndc-card p-4">
                <h3 className="h5 fw-bold mb-4">Preview DAO Assets</h3>
                <h4 className="h6 fw-bold mb-2">Profile & Background Image</h4>
                {renderAssetsEditor(true)}
                <h4 className="h6 fw-bold mb-2">DAO Name</h4>
                <h5 className="h5 fw-bold">{formState.name}</h5>
              </div>
            ),
            toggle: (
              <Widget
                src="nearui.near/widget/Input.Button"
                props={{
                  children: (
                    <>
                      Preview DAO Assets <i className="bi bi-eye" />
                    </>
                  ),
                  variant: "outline info",
                  size: "lg",
                }}
              />
            ),
          }}
        />
      </div>
      {renderAssetsEditor()}

      <div
        className="d-flex gap-2 flex-column p-3 rounded-4"
        style={{
          border: "1px solid #4498e0",
        }}
      >
        <h3 className="h6 fw-bold d-flex align-items-center">
          <i
            className="bi bi-info-circle me-2"
            style={{
              color: "#4498e0",
              fontSize: "22px",
            }}
          />
          Create a new DAO costs 6 NEAR.
        </h3>
        <p className="mb-0">
          The 6 NEAR will be used to pay for the contract deployment and
          storage.
        </p>
      </div>
    </div>

    {renderFooter(state.answers)}
  </div>
);
