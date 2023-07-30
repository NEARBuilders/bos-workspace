const whitelist = props.whitelist ?? [];
const widgetOwner = "easypoll-v0.ndc-widgets.near";
const onNext = props.onSubmit ?? (() => {});
const isEditNotDraft = props.isEditNotDraft ?? false;
const initialFormState = props.initialFormState ?? {
  title: {
    value: "",
    error: false,
  },
  description: {
    value: "",
    error: false,
  },
  tgLink: {
    value: "",
    error: false,
  },
  startTimestamp: {
    value: "",
    error: false,
  },
  endTimestamp: {
    value: "",
    error: false,
  },
  verifiedHumansOnly: {
    value: false,
    error: false,
  },
  officialNDCPoll: {
    value: false,
    error: false,
  },
};

State.init({
  form: initialFormState,
});

const validationConfig = {
  title: {
    required: true,
    minLength: 4,
    maxLength: 70,
  },
  description: {
    required: false,
    minLength: 0,
    maxLength: 2000,
  },
  tgLink: {
    isURL: true,
    required: false,
  },
  startTimestamp: {
    required: true,
    custom: (value) => {
      if (getTimestamp(value) < getTimestamp(new Date().getTime() + 3600000)) {
        return "Please Ensure the Start Date is Set to the Present or a Future Time";
      }
      return false;
    },
  },
  endTimestamp: {
    required: true,
    custom: (value) => {
      if (getTimestamp(value) < getTimestamp(new Date())) {
        return "Please Ensure the End Date is Set to a Future Time";
      }
      if (
        getTimestamp(value) <= getTimestamp(state.form.startTimestamp.value)
      ) {
        return "Please Ensure the End Date is Set to after Start Date";
      }
      return false;
    },
  },
};

const onFormFieldChange = (field, key, value) => {
  State.update({
    ...state,
    form: {
      ...state.form,
      [field]: {
        ...state.form[field],
        [key]: value,
      },
    },
  });
};

const onValidate = (field, value, setError) => {
  const options = validationConfig[field];

  if (options.required) {
    if (!value || value === "" || value.length < 1) {
      return setError("This field is required");
    }
  }

  if (options.minLength) {
    if (value.length < options.minLength) {
      return setError(
        `Input is too short. Minimum length is ${options.minLength} characters.`
      );
    }
  }

  if (options.maxLength) {
    if (value.length > options.maxLength) {
      return setError(
        `Input is too long. Maximum length is ${options.maxLength} characters.`
      );
    }
  }

  if (options.isURL && value && value !== "") {
    try {
      new URL(value);
    } catch (_) {
      return setError("Input is not a valid URL");
    }
  }

  if (options.custom) {
    const customError = options.custom(value);
    if (customError) {
      return setError(customError);
    }
  }

  setError(null);
};

const validateAll = () => {
  const form = state.form;
  let isValid = true;

  Object.keys(form).forEach((field) => {
    onValidate(field, form[field].value, (error) => {
      if (error) isValid = false;
      onFormFieldChange(field, "error", error);
    });
  });

  return isValid;
};

const getTimestamp = (date) => new Date(`${date}`).getTime();

const handleNext = () => {
  if (validateAll()) {
    onNext(state.form);
  }
};

return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 28,
    }}
  >
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
      props={{
        label: "Title*",
        placeholder: "Enter Your Poll's Headline",
        value: state.form.title.value,
        error: state.form.title.error,
        onChange: (v) => onFormFieldChange("title", "value", v),
        validate: () =>
          onValidate("title", state.form.title.value, (e) =>
            onFormFieldChange("title", "error", e)
          ),
        inputProps: {
          minLength: 4,
          maxLength: 70,
          required: true,
        },
      }}
    />
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
      props={{
        label: "Description",
        placeholder: "Describe Your Poll (Markdown Supported)",
        value: state.form.description.value,
        error: state.form.description.error,
        onChange: (v) => onFormFieldChange("description", "value", v),
        validate: () =>
          onValidate("description", state.form.description.value, (e) =>
            onFormFieldChange("description", "error", e)
          ),
        textarea: true,
        inputProps: {
          minLength: 0,
          maxLength: 2000,
          required: false,
        },
      }}
    />
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
      props={{
        label: "Discussion link (optional)",
        placeholder: "Enter Link for Discussion (if applicable)",
        value: state.form.tgLink.value,
        error: state.form.tgLink.error,
        onChange: (v) => onFormFieldChange("tgLink", "value", v),
        validate: () =>
          onValidate("tgLink", state.form.tgLink.value, (e) =>
            onFormFieldChange("tgLink", "error", e)
          ),
      }}
    />
    <div className="d-flex gap-4">
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.Inputs.DateTime`}
        props={{
          label: "Start Date*",
          value: state.form.startTimestamp.value,
          error: state.form.startTimestamp.error,
          onChange: (v) => onFormFieldChange("startTimestamp", "value", v),
          validate: () =>
            onValidate("startTimestamp", state.form.startTimestamp.value, (e) =>
              onFormFieldChange("startTimestamp", "error", e)
            ),
        }}
      />
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.Inputs.DateTime`}
        props={{
          label: "End Date*",
          value: state.form.endTimestamp.value,
          error: state.form.endTimestamp.error,
          onChange: (v) => onFormFieldChange("endTimestamp", "value", v),
          validate: () =>
            onValidate("endTimestamp", state.form.endTimestamp.value, (e) =>
              onFormFieldChange("endTimestamp", "error", e)
            ),
        }}
      />
    </div>
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Inputs.Toggle`}
      props={{
        label: (
          <>
            Only verified humans can vote{" "}
            <img
              height={25}
              width={25}
              style={{
                marginBottom: 6,
                marginLeft: 6,
              }}
              src="data:image/png;base64,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"
            />
          </>
        ),
        value: state.form.verifiedHumansOnly.value,
        error: state.form.verifiedHumansOnly.error,
        onChange: (v) => onFormFieldChange("verifiedHumansOnly", "value", v),
      }}
    />
    {whitelist.includes(context.accountId) && (
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.Inputs.Toggle`}
        props={{
          label: (
            <>
              Official NDC polls
              <svg
                height={25}
                width={25}
                style={{
                  marginBottom: 6,
                  marginLeft: 6,
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 283.92 336.51"
                fill="currentColor"
              >
                <path d="M136.95 155.55 43.01 61.72c-.98-.98-2.66-.29-2.66 1.1v91.91c0 .86-.7 1.56-1.56 1.56H16.51c-.86 0-1.56-.7-1.56-1.56V1.56c0-1.39 1.68-2.08 2.66-1.1l137.28 137.13c.61.61.61 1.6 0 2.21l-15.74 15.76c-.61.61-1.6.61-2.21 0" />
                <path d="M187.26 194.3h-23.68c-1.02 0-1.85-.83-1.85-1.85v-21.7c0-1.02.83-1.85 1.85-1.85h24c40.1 0 72.77-33.25 70.87-73.31-1.75-37.02-32.43-66.6-69.88-66.6h-25.49s-.05.02-.05.05v52.61c0 1.02-.83 1.85-1.85 1.85h-21.7c-1.02 0-1.85-.83-1.85-1.85V5.44c0-1.02.83-1.85 1.85-1.85h49.08c52.01 0 94.42 41.85 95.34 93.64.95 53.53-43.11 97.07-96.65 97.07M135.45 336.51H84.92C38.75 336.51.43 299.64 0 253.48c-.42-46.57 37.33-84.58 83.8-84.58h51.65c1.11 0 2.01.9 2.01 2.01v21.38c0 1.11-.9 2.01-2.01 2.01H83.81c-32.49 0-58.87 26.66-58.4 59.26.46 32.07 27.26 57.55 59.33 57.55h50.71c1.11 0 2.01.9 2.01 2.01v21.38c0 1.11-.9 2.01-2.01 2.01M261.53 336.51h-97.54c-1.25 0-2.26-1.01-2.26-2.26v-20.89c0-1.25 1.01-2.26 2.26-2.26h97.54c1.25 0 2.26 1.01 2.26 2.26v20.89c0 1.25-1.01 2.26-2.26 2.26" />
              </svg>
            </>
          ),
          value: state.form.officialNDCPoll.value,
          error: state.form.officialNDCPoll.error,
          onChange: (v) => onFormFieldChange("officialNDCPoll", "value", v),
          disabled: isEditNotDraft,
        }}
      />
    )}
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Inputs.Footer`}
      props={{
        hasNext: true,
        onNext: handleNext,
      }}
    />
  </div>
);
