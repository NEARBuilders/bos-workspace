const widgetOwner = "easypoll-v0.ndc-widgets.near";
const id = props.id;
const onDelete = props.onDelete;
const onMoveUp = props.onMoveUp;
const onMoveDown = props.onMoveDown;
const onQuestionFieldChange = props.onQuestionFieldChange;
const question = props.question;

const validationConfig = {
  question: {
    required: true,
    minLength: 4,
    maxLength: 400,
  },
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

  if (options.custom) {
    const customError = options.custom(value);
    if (customError) {
      return setError(customError);
    }
  }

  setError(null);
};

const Container = styled.div`
  background: #f4f7f7;
  padding: 16px;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
`;

const IconButton = styled.div`
  font-size: 18px;
  padding: 5px;
  transition: all 100ms ease;
  color: #000;

  &.danger {
    color: red;
  }

  &.danger:hover {
    color: red;
  }

  &:hover {
    color: #4f46e5;
    transform: scale(1.3);
  }
`;

return (
  <Container className="d-flex gap-3 flex-column">
    <div className="d-flex gap-3 mb-2">
      <h4 className="me-auto">Question {id + 1}</h4>
      <IconButton role="button" title="Move Up" onClick={onMoveUp}>
        <i class="bi bi-chevron-up"></i>
      </IconButton>
      <IconButton role="button" title="Move Down" onClick={onMoveDown}>
        <i class="bi bi-chevron-down"></i>
      </IconButton>
      <IconButton
        className="danger"
        role="button"
        title="Delete Question"
        onClick={onDelete}
      >
        <i class="bi bi-x-lg"></i>
      </IconButton>
    </div>
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
      props={{
        label: "Title*",
        placeholder: "Enter Your Question",
        value: question.title.value,
        error: question.title.error,
        onChange: (v) => onQuestionFieldChange(id, "title", "value", v),
        validate: () =>
          onValidate("title", question.title.value, (e) =>
            onQuestionFieldChange(id, "title", "error", e)
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
        placeholder: "More Details About Your Question (Markdown Supported)",
        value: question.description.value,
        error: question.description.error,
        onChange: (v) => onQuestionFieldChange(id, "description", "value", v),
        validate: () =>
          onValidate("description", question.description.value, (e) =>
            onQuestionFieldChange(id, "description", "error", e)
          ),
        inputProps: {
          minLength: 0,
          maxLength: 500,
        },
        textarea: true,
      }}
    />
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Inputs.Toggle`}
      props={{
        label: "Answer Required",
        value: question.required.value,
        error: question.required.error,
        onChange: (v) => onQuestionFieldChange(id, "required", "value", v),
      }}
    />
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Inputs.Image`}
      props={{
        label: "Image",
        value: question.imageIPFS.value,
        error: question.imageIPFS.error,
        onChange: (v) => onQuestionFieldChange(id, "imageIPFS", "value", v),
      }}
    />
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.CreatePoll.QuestionType`}
      props={{
        label: "Question Type*",
        value: question.questionType.value,
        error: question.questionType.error,
        onChange: (v) => onQuestionFieldChange(id, "questionType", "value", v),
      }}
    />
    {question.questionType.value === 1 && (
      <>
        <div className="d-flex align-items-center gap-2">
          <Widget
            src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
            props={{
              label: "Min Choices",
              placeholder: "",
              value: question.minChoices.value,
              error: question.minChoices.error,
              onChange: (v) =>
                onQuestionFieldChange(id, "minChoices", "value", v),
              validate: () =>
                onValidate("minChoices", question.minChoices.value, (e) =>
                  onQuestionFieldChange(id, "minChoices", "error", e)
                ),
              inputProps: {
                type: "number",
                min: 1,
                max: 100,
              },
            }}
          />
          <Widget
            src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
            props={{
              label: "Max Choices",
              placeholder: "",
              value: question.maxChoices.value,
              error: question.maxChoices.error,
              onChange: (v) =>
                onQuestionFieldChange(id, "maxChoices", "value", v),
              validate: () =>
                onValidate("maxChoices", question.maxChoices.value, (e) =>
                  onQuestionFieldChange(id, "maxChoices", "error", e)
                ),
              inputProps: {
                type: "number",
                min: 1,
                max: 100,
              },
            }}
          />
        </div>
        <Widget
          src={`${widgetOwner}/widget/EasyPoll.Inputs.Options`}
          props={{
            label: "Answer Options* (Markdown Supported)",
            value: question.choicesOptions.value,
            error: question.choicesOptions.error,
            onChange: (v) => {
              console.log(v);
              onQuestionFieldChange(id, "choicesOptions", "value", v);
            },
            placeholder: "",
            textarea: true,
          }}
        />
      </>
    )}
    {question.questionType.value === 2 && (
      <>
        <div className="d-flex align-items-center gap-2">
          <Widget
            src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
            props={{
              label: "Min Choices",
              placeholder: "",
              value: question.minChoices.value,
              error: question.minChoices.error,
              onChange: (v) =>
                onQuestionFieldChange(id, "minChoices", "value", v),
              validate: () =>
                onValidate("minChoices", question.minChoices.value, (e) =>
                  onQuestionFieldChange(id, "minChoices", "error", e)
                ),
              inputProps: {
                type: "number",
                min: 1,
                max: 100,
              },
            }}
          />
          <Widget
            src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
            props={{
              label: "Max Choices",
              placeholder: "",
              value: question.maxChoices.value,
              error: question.maxChoices.error,
              onChange: (v) =>
                onQuestionFieldChange(id, "maxChoices", "value", v),
              validate: () =>
                onValidate("maxChoices", question.maxChoices.value, (e) =>
                  onQuestionFieldChange(id, "maxChoices", "error", e)
                ),
              inputProps: {
                type: "number",
                min: 1,
                max: 100,
              },
            }}
          />
        </div>
        <Widget
          src={`${widgetOwner}/widget/EasyPoll.Inputs.PicturesOptions`}
          props={{
            label: "Answer Options*",
            value: question.choicesOptions.value,
            error: question.choicesOptions.error,
            onChange: (v) => {
              console.log(v);
              onQuestionFieldChange(id, "choicesOptions", "value", v);
            },
            placeholder: "",
          }}
        />
      </>
    )}
    {question.questionType.value === 3 && (
      <>
        <Widget
          src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
          props={{
            label: "0 label",
            placeholder: "",
            value: question.label0.value,
            error: question.label0.error,
            onChange: (v) => onQuestionFieldChange(id, "label0", "value", v),
            validate: () =>
              onValidate("label0", question.label0.value, (e) =>
                onQuestionFieldChange(id, "label0", "error", e)
              ),
            inputProps: {
              minLength: 0,
              maxLength: 20,
            },
          }}
        />
        <Widget
          src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
          props={{
            label: "5 label",
            placeholder: "",
            value: question.label5.value,
            error: question.label5.error,
            onChange: (v) => onQuestionFieldChange(id, "label5", "value", v),
            validate: () =>
              onValidate("label5", question.label5.value, (e) =>
                onQuestionFieldChange(id, "label5", "error", e)
              ),
            inputProps: {
              minLength: 0,
              maxLength: 20,
            },
          }}
        />
        <Widget
          src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
          props={{
            label: "10 label",
            placeholder: "",
            value: question.label10.value,
            error: question.label10.error,
            onChange: (v) => onQuestionFieldChange(id, "label10", "value", v),
            validate: () =>
              onValidate("label10", question.label10.value, (e) =>
                onQuestionFieldChange(id, "label10", "error", e)
              ),
            inputProps: {
              minLength: 0,
              maxLength: 20,
            },
          }}
        />
      </>
    )}
  </Container>
);
