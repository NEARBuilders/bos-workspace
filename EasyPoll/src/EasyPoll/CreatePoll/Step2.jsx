const widgetOwner = "easypoll-v0.ndc-widgets.near";
const onPrev = props.onPrev ?? (() => {});
const onSubmit = props.onSubmit ?? (() => {});
const initialFormState = props.initialFormState ?? {
  questions: [
    {
      title: {
        value: "",
        error: null,
      },
      description: {
        value: "",
        error: null,
      },
      required: {
        value: false,
        error: null,
      },
      questionType: {
        value: 0,
        error: null,
      },
      choicesOptions: { value: ["", ""], error: null },
      imageIPFS: {
        value: "",
        error: null,
      },
      minChoices: {
        value: "1",
        error: null,
      },
      maxChoices: {
        value: "4",
        error: null,
      },
      label0: {
        value: "Strongly Disagree",
      },
      label5: {
        value: "Neutral",
      },
      label10: {
        value: "Strongly Agree",
      },
    },
  ],
};

State.init({
  form: initialFormState,
});

const onAddQuestion = () => {
  State.update({
    form: {
      ...state.form,
      questions: [
        ...state.form.questions,
        {
          title: {
            value: "",
            error: null,
          },
          description: {
            value: "",
            error: null,
          },
          required: {
            value: false,
            error: null,
          },
          questionType: {
            value: 0,
            error: null,
          },
          choicesOptions: { value: ["", ""], error: null },
          imageIPFS: {
            value: "",
            error: null,
          },
          minChoices: {
            value: "1",
            error: null,
          },
          maxChoices: {
            value: "4",
            error: null,
          },
          label0: {
            value: "Strongly Disagree",
          },
          label5: {
            value: "Neutral",
          },
          label10: {
            value: "Strongly Agree",
          },
        },
      ],
    },
  });
};

const onQuestionFieldChange = (id, field, key, value) => {
  let new_questions = [...state.form.questions];
  new_questions[id] = {
    ...state.form.questions[id],
    [field]: {
      ...state.form.questions[id][field],
      [key]: value,
    },
  };
  State.update({
    ...state,
    form: {
      ...state.form,
      questions: new_questions,
    },
  });
};

const onQuestionDelete = (i) => {
  if (state.form.questions.length < 2) return;

  let new_questions = [...state.form.questions];
  new_questions.splice(i, 1);

  State.update({
    form: {
      ...state.form,
      questions: new_questions,
    },
  });
};

const onQuestionMoveUp = (id) => {
  if (id < 1) return;

  let new_questions = [...state.form.questions];
  let temp = new_questions[id];
  new_questions[id] = new_questions[id - 1];
  new_questions[id - 1] = temp;

  State.update({
    form: {
      ...state.form,
      questions: new_questions,
    },
  });
};

const onQuestionMoveDown = (id) => {
  if (id >= state.form.questions.length - 1) return;

  let new_questions = [...state.form.questions];
  let temp = new_questions[id];
  new_questions[id] = new_questions[id + 1];
  new_questions[id + 1] = temp;

  State.update({
    form: {
      ...state.form,
      questions: new_questions,
    },
  });
};

const AddContainer = styled.div`
  background: #4f46e5;
  color: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
    rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  text-align: center;
  cursor: pointer;
`;

return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 28,
    }}
  >
    {state.form.questions.map((v, i) => {
      return (
        <Widget
          key={i}
          src={`${widgetOwner}/widget/EasyPoll.CreatePoll.Step2Question`}
          props={{
            hasNext: false,
            hasPrev: true,
            hasSubmit: true,
            onPrev: () => onPrev(state.form),
            onSubmit: onSubmit,
            onQuestionFieldChange,
            id: i,
            question: state.form.questions[i],
            onDelete: () => onQuestionDelete(i),
            onMoveUp: () => onQuestionMoveUp(i),
            onMoveDown: () => onQuestionMoveDown(i),
          }}
        />
      );
    })}
    <AddContainer role="button" onClick={onAddQuestion}>
      <i className="bi bi-plus-lg me-2"></i>
      Add Question
    </AddContainer>
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Inputs.Footer`}
      props={{
        hasNext: false,
        hasPrev: true,
        hasSubmit: true,
        hasDraft: true,
        onPrev: () => onPrev(state.form),
        onSubmit: () => onSubmit(state.form),
        onDraft: () => onSubmit(state.form, true),
      }}
    />
  </div>
);
