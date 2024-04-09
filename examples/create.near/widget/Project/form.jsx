const UUID = {
  generate: (template) => {
    if (typeof template !== "string") {
      template = "xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx";
    }
    return template.replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
};


const { handleCreateProject, defaultProject, buttonChildren, buttonProps } =
  props;

State.init({
  error: undefined,
  project: defaultProject ?? {
    id: UUID.generate(),
    logo: undefined,
    title: undefined,
    description: undefined,
    tags: [],
  },
});

const update = (k, v) => State.update({ [k]: v });
const updateP = (k, v) => update("project", { ...state.project, [k]: v });

const beforeHandleCreateProject = () => {
  update("error", undefined);
  if (!state.project.title) {
    update("error", "Title is required");
  }
  if (!state.error) {
    handleCreateProject(state.project);
  }
};

const IT = "nearui.near/widget/Input.ExperimentalText";
const SI = "nearui.near/widget/Social.ImageUpload";
const IB = "nearui.near/widget/Input.Button";
return (
  <div className="p-4 bg-white rounded-4">
    <div className="d-flex flex-column gap-3">
      <h3>{buttonChildren || "Create Project"}</h3>
      <Widget
        src={IT}
        props={{
          label: "Title",
          placeholder: "My project",
          inputProps: {
            defaultValue: state.project.title,
          },
          onChange: (v) => updateP("title", v),
        }}
      />
      <Widget
        src={IT}
        props={{
          label: "Description",
          placeholder: "Describe your project",
          textarea: true,
          inputProps: {
            defaultValue: state.project.description,
          },
          onChange: (v) => updateP("description", v),
        }}
      />
      <Widget
        src={IT}
        props={{
          label: "Tags",
          placeholder: "Separate with commas",
          inputProps: {
            defaultValue: state.project.tags.join(", "),
          },
          onChange: (v) =>
            updateP(
              "tags",
              (v || "")
                .split(",")
                .filter((v) => v !== "")
                .map((v) => v.trim())
            ),
        }}
      />
      <h6 className="mb-0">Logo</h6>
      {state.project.logo && (
        <img src={state.project.logo} alt="" height={100} width={100} />
      )}
      <Widget
        src={SI}
        props={{
          onChange: (v) => updateP("logo", v),
          value: state.project.logo,
        }}
      />
      <div className="text-danger mt-2">{state.error}</div>
      <Widget
        src={IB}
        props={{
          children: buttonChildren ?? "Create Project",
          variant: "success",
          onClick: () => beforeHandleCreateProject(),
        }}
      />
    </div>
  </div>
);
