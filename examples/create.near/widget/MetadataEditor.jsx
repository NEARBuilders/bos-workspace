const initialMetadata = props.initialMetadata ?? {};
const onChange = props.onChange;
const options = props.options;

State.init({
  initialMetadata,
  metadata: initialMetadata,
  reportedMetadata: initialMetadata,
  image: initialMetadata.image,
});

const metadata = {
  name: options.name ? state.metadata.name : undefined,
  description: options.name ? state.metadata.description : undefined,
  image:
    options.image && state.image && Object.keys(state.image).length > 0
      ? state.image
      : undefined,
};

if (
  onChange &&
  JSON.stringify(state.reportedMetadata) !== JSON.stringify(metadata)
) {
  State.update({
    reportedMetadata: metadata,
  });
  onChange(metadata);
}

return (
  <>
    {options.name && (
      <div className="mb-2">
        {options.name.label ?? "Name"}
        <input type="text" value={state.metadata.name} />
      </div>
    )}
    {options.image && (
      <div className="mb-2">
        {options.image.label ?? "Image"}
        <Widget
          src="mob.near/widget/ImageEditorTabs"
          props={{
            image: state.image,
            onChange: (image) => State.update({ image }),
          }}
        />
      </div>
    )}
    {options.description && (
      <div className="mb-2">
        {options.description.label ?? "Description"}
        <span className="text-secondary"> (supports markdown)</span>
        <textarea
          className="form-control"
          rows={5}
          value={state.metadata.description}
          onChange={(e) => {
            state.metadata.description = e.target.value;
            State.update();
          }}
        />
      </div>
    )}
  </>
);
