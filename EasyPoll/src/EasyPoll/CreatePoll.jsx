const widgetOwner = "easypoll-v0.ndc-widgets.near";
const indexVersion = props.indexVersion ?? "4.0.0";
const whitelist = props.whitelist ?? [];
const src = props.src;
const blockHeight = props.blockHeight ?? "final";
const isEdit = src ? true : false;
const accountId = props.accountId ?? context.accountId;

const formatDBForState = (input) => {
  let firstStep = Object.keys(input).reduce((obj, key) => {
    if (key === "startTimestamp" || key === "endTimestamp") {
      let date = new Date(input[key]);
      let formattedDate = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}-${("0" + date.getDate()).slice(-2)}T${(
        "0" + date.getHours()
      ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}`;
      obj[key] = { value: formattedDate };
    } else if (key !== "questions" && key !== "isDraft") {
      obj[key] = { value: input[key] };
    }
    return obj;
  }, {});

  let original_questions = input.questions.map((question, index) => {
    let originalQuestion = {};
    Object.keys(question).forEach((key) => {
      originalQuestion[key] = {
        value: question[key],
      };
    });
    if (question.choicesOptions) {
      originalQuestion.choicesOptions = {
        value: question.choicesOptions,
      };
    }
    return originalQuestion;
  });

  return { 1: firstStep, 2: { questions: original_questions } };
};

if (isEdit) {
  const poll = Social.get(`${src}`, blockHeight);
  if (!poll) {
    return "Loading...";
  }
  poll = JSON.parse(poll);
  poll.accountId = src.split("/")[0];

  State.init({ step: 1, answers: formatDBForState(poll) });
} else {
  State.init({
    step: 1,
    answers: answers ?? {},
  });
}

const steps = [
  {
    text: "Poll Information",
    active: state.step === 1,
  },
  {
    text: "Questions",
    active: state.step === 2,
  },
];

const formatStateForDB = (input) => {
  let firstStep = input[1];
  let secondStep = input[2];

  Object.keys(firstStep).forEach((key, index) => {
    firstStep[key] = firstStep[key].value;
  });

  firstStep["startTimestamp"] = new Date(
    `${firstStep["startTimestamp"]}`
  ).getTime();
  firstStep["endTimestamp"] = new Date(
    `${firstStep["endTimestamp"]}`
  ).getTime();
  firstStep["timestamp"] = Date.now();

  let new_questions = [];
  secondStep.questions.forEach((question, index) => {
    Object.keys(question).forEach((key) => {
      new_questions[index] = {
        ...new_questions[index],
        [key]: question[key].value,
      };
    });
    if (question.questionType.value == 0) {
      new_questions[index] = {
        ...new_questions[index],
        choicesOptions: ["Yes", "No"],
      };
    }
    if (
      question.questionType.value !== 1 &&
      question.questionType.value !== 2
    ) {
      delete new_questions[index].minChoices;
      delete new_questions[index].maxChoices;
      delete new_questions[index].choicesOptions;
    }
    if (question.questionType.value !== 3) {
      delete new_questions[index].label0;
      delete new_questions[index].label5;
      delete new_questions[index].label10;
    }
  });

  return {
    ...firstStep,
    questions: new_questions,
  };
};

const onFinish = (isDraft) => {
  const answers = state.answers;
  const isOfficialNDCPoll = answers[1].officialNDCPoll.value;
  const formattedAnswers = formatStateForDB(answers);

  console.log("poll to commit", formattedAnswers);

  let uid =
    Math.random().toString(16).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(16).slice(2);

  if (isEdit) {
    uid = src.split("/")[3];
  }

  let key = isDraft ? "draft" : isOfficialNDCPoll ? "official" : "poll";

  const commit = {
    ["easypoll-" + indexVersion]: {
      [key]: {
        [uid]: JSON.stringify(formattedAnswers),
      },
    },
    index: {
      ["easypoll-" + indexVersion]: JSON.stringify({
        key: key,
        value: uid,
      }),
    },
  };

  State.update({ commitLoading: true });
  Social.set(commit, {
    force: true,
    onCommit: () => {
      State.update({ commitLoading: false, committed: true });
    },
    onCancel: () => {
      State.update({ commitLoading: false });
    },
  });
};

const Container = styled.div`
  border-radius: 21px;
  padding: 24px;
  box-shadow: rgba(0, 0, 0, 0.1) -4px 9px 25px -6px;
  max-width: 860px;
  margin: auto;
  width: 100%;
  background: #fafbfb;
`;

if (state.committed) {
  return (
    <Container
      className="text-center d-flex flex-column align-items-center"
      style={{
        padding: "60px 12px",
        color: "#239f28",
      }}
    >
      <i
        className="bi bi-check-circle"
        style={{
          fontSize: 60,
        }}
      />
      <span
        style={{
          fontWeight: "bold",
          fontsize: 15,
          color: "#239f28",
        }}
      >
        Posted Successfully!
      </span>

      <a
        href={`#/${widgetOwner}/widget/EasyPoll?page=my_polls`}
        className="text-decoration-none mt-4"
      >
        <Widget
          src="rubycop.near/widget/NDC.StyledComponents"
          props={{
            Button: {
              text: "My Polls",
              icon: <i class="bi bi-person-fill"></i>,
              className:
                "primary dark d-flex flex-row-reverse gap-2 align-items-center",
              onClick: () => {},
            },
          }}
        />
      </a>
    </Container>
  );
}

if (state.commitLoading) {
  return (
    <Container
      className="text-center"
      style={{
        padding: "60px 12px",
      }}
    >
      <Widget
        src={`easypoll-v0.ndc-widgets.near/widget/Common.Spinner`}
        props={{
          color1: "#ffd50d",
          color2: "#4f46e5",
        }}
      />
      <span
        style={{
          fontWeight: "bold",
          fontsize: 15,
          color: "#4f46e5",
          textAlign: "center",
        }}
      >
        Saving...
      </span>
    </Container>
  );
}

return (
  <Container>
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.CreatePoll.Header`}
      props={{
        steps,
      }}
    />
    <Widget
      src={`${widgetOwner}/widget/EasyPoll.CreatePoll.Step${state.step}`}
      props={{
        whitelist,
        onSubmit: (formState, isDraft) => {
          State.update({
            answers: {
              ...state.answers,
              [state.step]: formState,
            },
          });
          if (steps.length === state.step) {
            onFinish(isDraft ?? false);
          }
          State.update({
            step: steps.length === state.step ? state.step : state.step + 1,
          });
        },
        onPrev: (formState) => {
          State.update({
            answers: {
              ...state.answers,
              [state.step]: formState,
            },
            step: state.step - 1,
          });
        },
        initialFormState: state.answers[state.step],
        isEditNotDraft: isEdit && src.split("/")[2] !== "draft",
      }}
    />
  </Container>
);
