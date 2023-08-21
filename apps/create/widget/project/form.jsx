/*__@import:QoL/widget__*/

/*__@import:everything/utils/UUID__*/

const { handleCreateProject, defaultProject, buttonChildren, buttonProps } =
  props;

console.log("project.form", props);

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

const IT = "/*__@replace:nui__*//widget/Input.ExperimentalText";
const SI = "/*__@replace:nui__*//widget/Social.ImageUpload";
const IB = "/*__@replace:nui__*//widget/Input.Button";
return (
  <div className="p-4 bg-white rounded-4">
    <div className="d-flex flex-column gap-3">
      <h5>New Project</h5>
      {widget(IT, {
        label: "Title",
        placeholder: "My project",
        inputProps: {
          defaultValue: state.project.title,
        },
        onChange: (v) => updateP("title", v),
      })}
      {widget(IT, {
        label: "Description",
        placeholder: "Describe your project",
        textarea: true,
        inputProps: {
          defaultValue: state.project.description,
        },
        onChange: (v) => updateP("description", v),
      })}
      {widget(IT, {
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
              .map((v) => v.trim()),
          ),
      })}
      <h6 className="mb-0">Logo</h6>
      {state.project.logo && (
        <img src={state.project.logo} alt="" height={100} width={100} />
      )}
      {widget(SI, {
        onChange: (v) => updateP("logo", v),
        value: state.project.logo,
      })}
      <div className="text-danger mt-2">{state.error}</div>
      {widget(IB, {
        children: buttonChildren ?? "Create Project",
        variant: "success",
        onClick: () => beforeHandleCreateProject(),
      })}
    </div>
  </div>
);
