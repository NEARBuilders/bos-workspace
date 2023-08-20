/*__@import:QoL/widget__*/

const { handleCreateProject } = props;

State.init({
  logo: undefined,
  title: undefined,
});

const update = (k, v) => State.update({ [k]: v });

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
        onChange: (v) => update("title", v),
      })}
      {state.logo && <img src={state.logo} alt="" height={100} width={100} />}
      {widget(SI, {
        onChange: (v) => update("logo", v),
        value: state.logo,
      })}
      {widget(IB, {
        children: "Create Project",
        variant: "success",
      })}
    </div>
  </div>
);
