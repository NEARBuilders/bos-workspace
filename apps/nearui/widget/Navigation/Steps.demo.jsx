State.init({
  step: 2,
});

const steps = [
  {
    title: "Step 1",
    active: state.step === 0,
    disabled: false,
    icon: state.step === 0 ? "1" : <i className="bi bi-check2"></i>,
    className: state.step === 0 ? undefined : "active-outline",
    onClick: () => {
      State.update({
        step: 0,
      });
    },
  },
  {
    title: "Step 2",
    active: state.step === 1,
    disabled: false,
    icon: state.step < 2 ? "2" : <i className="bi bi-x"></i>,
    className: state.step < 2 ? undefined : "danger-outline",
    onClick: () => {
      State.update({
        step: 1,
      });
    },
  },
  {
    title: "Step 3",
    active: state.step === 2,
    disabled: false,
    onClick: () => {
      State.update({
        step: 2,
      });
    },
  },
  {
    title: "Step 4",
    active: state.step === 3,
    disabled: false,
    onClick: () => {
      State.update({
        step: 3,
      });
    },
  },
  {
    title: "Step 5",
    icon: <i className="bi bi-check2"></i>,
    active: state.step === 4,
    disabled: false,
    onClick: () => {
      State.update({
        step: 4,
      });
    },
  },
];

return (
  <div className="w-100">
    <Widget
      src={`/*__@appAccount__*//widget/Navigation.Steps`}
      props={{
        steps: steps,
      }}
    />
    <br />
    <div>Content {state.step + 1}</div>
  </div>
);
