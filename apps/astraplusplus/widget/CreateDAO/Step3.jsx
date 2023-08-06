const { formState, errors, renderFooter } = props;

const initialAnswers = {
  gracePeriod: formState.gracePeriod,
};

State.init({
  answers: initialAnswers,
});

const update = (key, value) =>
  State.update({
    answers: {
      ...state.answers,
      [key]: value,
    },
  });

return (
  <div className="mt-4 ndc-card p-4">
    <div className="d-flex flex-column gap-4">
      <div>
        <h2 className="h5 fw-bold">
          <span
            className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bolder h5 me-2"
            style={{
              width: "48px",
              height: "48px",
              border: "1px solid #82E299",
            }}
          >
            3
          </span>
          Cool Down Period
        </h2>
        <p className="text-black-50 fw-light small">
          Setup the period between when a proposal is approved and is executed.
        </p>
      </div>

      <Widget
        src="nearui.near/widget/Input.ExperimentalText"
        props={{
          label: "Define Period",
          placeholder: "Enter days",
          size: "lg",
          inputProps: {
            type: "number",
            min: 0,
            max: 3650,
            name: "gracePeriod",
            defaultValue: state.answers.gracePeriod,
          },
          error: errors["gracePeriod"],
          onChange: (v) => update("gracePeriod", parseInt(v)),
        }}
      />
    </div>

    {renderFooter(state.answers)}
  </div>
);
