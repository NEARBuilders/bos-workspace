State.init({
  checked: false,
});

return (
  <div className="d-flex flex-column gap-4 py-4">
    <Widget
      src="/*__@appAccount__*//widget/Input.Checkbox"
      props={{
        checked: state.checked,
        onChange: (checked) => State.update({ checked }),
        label: "Checkbox",
        id: "checkbox-demo",
      }}
    />
  </div>
);
