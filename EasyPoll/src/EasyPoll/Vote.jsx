const hasVoted = props.hasVoted ?? false;
const src = props.src;
const indexVersion = props.indexVersion ?? "4.0.0";
const widgetOwner = props.widgetOwner ?? "easypoll-v0.ndc-widgets.near";
const blockHeight = props.blockHeight;
const { questions } = props.poll;
const userAnswers = props.userAnswers;
const humansOnly = props.poll.verifiedHumansOnly;
const isHuman = props.isHuman ?? false;
const alreadyVoted = userAnswers.length > 0;
const resultsHref = props.resultsHref ?? "";
const accountId = props.accountId ?? context.accountId;
const isLoggedIn = accountId ? true : false;

if (!questions) return <></>;

if (!src) return "Please provide poll src";

const isUpcoming = props.poll.startTimestamp > Date.now();
const isEnded = props.poll.endTimestamp < Date.now();

const ViewResultsButton = () => (
  <a href={resultsHref} className="text-decoration-none">
    <Widget
      src="rubycop.near/widget/NDC.StyledComponents"
      props={{
        Button: {
          text: "View Results",
          icon: <i className="bi bi-eye-fill"></i>,
          className: "primary d-flex flex-row-reverse gap-2 align-items-center",
          onClick: () => {},
        },
      }}
    />
  </a>
);

if (isEnded) {
  return (
    <div
      className="d-flex flex-column gap-3 justify-content-center align-items-center"
      style={{
        border: "1.5px solid #4f46e520",
        padding: "60px 12px",
        borderRadius: "16px",
      }}
    >
      <span
        style={{
          fontWeight: "bold",
          fontsize: 15,
          color: "#239f28",
        }}
      >
        Vote Ended!
      </span>
      <ViewResultsButton />
    </div>
  );
}

if (isUpcoming) {
  return (
    <div
      className="d-flex flex-column gap-3 justify-content-center align-items-center"
      style={{
        border: "1.5px solid #4f46e520",
        padding: "60px 12px",
        borderRadius: "16px",
      }}
    >
      <span
        style={{
          fontWeight: "bold",
          fontsize: 15,
          color: "#239f28",
        }}
      >
        Vote Begins:{" "}
        <span style={{ color: "#000" }}>
          {new Date(props.poll.startTimestamp).toLocaleString()}
        </span>
      </span>
    </div>
  );
}

if (humansOnly && !isHuman && isLoggedIn) {
  return (
    <div
      className="d-flex flex-column gap-3 justify-content-center align-items-center"
      style={{
        border: "1.5px solid #4f46e520",
        padding: "60px 12px",
        borderRadius: "16px",
      }}
    >
      <img
        height={80}
        width={80}
        style={{
          marginBottom: 6,
          marginLeft: 6,
        }}
        src="data:image/png;base64,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"
      />
      <span
        style={{
          fontWeight: "bold",
          fontsize: 15,
          color: "#000",
        }}
      >
        This poll requires Human Verification. Complete the verification process
        to cast your vote.
      </span>
      <a
        href="https://i-am-human.app"
        target="_blank"
        className="text-decoration-none"
      >
        <Widget
          src="rubycop.near/widget/NDC.StyledComponents"
          props={{
            Button: {
              text: "Verify as Human",
              icon: (
                // should be replaced with I-AM-HUMAN logo svg but I couldn't find it :(
                <img
                  height={25}
                  width={25}
                  style={{
                    filter: "brightness(100)",
                  }}
                  src="data:image/png;base64,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"
                />
              ),
              className: "primary dark d-flex gap-2 align-items-center",
              onClick: () => {},
            },
          }}
        />
      </a>
    </div>
  );
}

State.init({
  step: 0,
  form: {},
});

const currentQuestion = questions[state.step];

const ipfsUrl = (cid) => `https://ipfs.near.social/ipfs/${cid}`;

const handleNext = () => {
  if (isLoggedIn && !alreadyVoted) {
    if (!validateCurrentStep()) return;
  }
  if (state.form[state.step].error) return;

  if (questions.length === state.step) {
    return onFinish();
  }
  State.update({
    step: questions.length === state.step ? state.step : state.step + 1,
  });
};
const handlePrev = () => {
  State.update({
    step: state.step - 1,
  });
};

const onFormFieldChange = (step, key, value) => {
  State.update({
    ...state,
    form: {
      ...state.form,
      [step]: {
        ...state.form[step],
        [key]: value,
      },
    },
  });
};

const formatStateForDB = (input) => {
  let answers = input;

  Object.keys(answers).forEach((key, index) => {
    answers[key] = answers[key].value;
  });

  return {
    answers: answers,
    timestamp: Date.now(),
  };
};
const validateCurrentStep = () => {
  if (currentQuestion.required) {
    if (!state.form[state.step].value) {
      onFormFieldChange(state.step, "error", "This question is required");
      return false;
    }
    onFormFieldChange(state.step, "error", null);
  }
  if (Number(currentQuestion.minChoices)) {
    if (
      state.form[state.step].value.length <
        Number(currentQuestion.minChoices) ||
      !state.form[state.step].value
    ) {
      onFormFieldChange(
        state.step,
        "error",
        `Select at least ${currentQuestion.minChoices} answer${
          Number(currentQuestion.minChoices) === 1 ? "" : "s"
        } to continue`
      );
      return false;
    }
    onFormFieldChange(state.step, "error", null);
  }
  if (currentQuestion.maxChoices) {
    if (
      state.form[state.step].value.length > Number(currentQuestion.maxChoices)
    ) {
      onFormFieldChange(
        state.step,
        "error",
        `Select ${currentQuestion.maxChoices} answers or less to continue`
      );
      return false;
    }
    onFormFieldChange(state.step, "error", null);
  }
  if (currentQuestion.minLength) {
    if (
      state.form[state.step].value.length < Number(currentQuestion.minLength)
    ) {
      onFormFieldChange(
        state.step,
        "error",
        `Input is too short. Minimum length is ${currentQuestion.minLength} characters.`
      );
      return false;
    }
    onFormFieldChange(state.step, "error", null);
  }
  if (currentQuestion.maxLength) {
    if (
      state.form[state.step].value.length > Number(currentQuestion.maxLength)
    ) {
      onFormFieldChange(
        state.step,
        "error",
        `Input is too long. Maximum length is ${currentQuestion.maxLength} characters.`
      );
      return false;
    }
    onFormFieldChange(state.step, "error", null);
  }
  return true;
};

const onFinish = () => {
  if (!validateCurrentStep()) return;
  const formattedAnswers = formatStateForDB(state.form);
  console.log("answer to commit", formattedAnswers);

  const commit = {
    index: {
      ["easypoll-" + indexVersion + "-answer"]: JSON.stringify(
        {
          key: `${src}`,
          value: formattedAnswers,
        },
        undefined,
        0
      ),
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

if (state.committed) {
  return (
    <div
      className="text-center d-flex flex-column align-items-center flex-wrap"
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
          marginBottom: 10,
        }}
      >
        Voted Successfully!
      </span>

      <ViewResultsButton />
    </div>
  );
}

if (state.commitLoading) {
  return (
    <div
      className="d-flex flex-column gap-1"
      style={{
        border: "1.5px solid #4f46e520",
        padding: "60px 12px",
        borderRadius: "16px",
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
    </div>
  );
}

return (
  <div
    className="d-flex flex-column gap-1"
    style={{
      border: "1.5px solid #4f46e520",
      padding: "12px",
      borderRadius: "16px",
    }}
  >
    {alreadyVoted && (
      <div
        className="py-2 d-flex align-content-center gap-1"
        style={{
          fontWeight: "bold",
          fontsize: 15,
          color: "#239f28",
        }}
      >
        <i className="bi bi-check-lg h5" />
        <span className="me-auto">"You've already voted"</span>
        <ViewResultsButton />
      </div>
    )}
    {!isLoggedIn && (
      <div
        className="py-2 d-flex align-content-center gap-1"
        style={{
          fontWeight: "bold",
          fontsize: 15,
          color: "#DD5E56",
        }}
      >
        <span className="me-auto">Sign In To Use EasyPoll</span>
      </div>
    )}
    <div className="d-flex">
      <p
        style={{
          backgroundColor: "#4f46e5",
          color: "#ffd50d",
          borderRadius: "100px",
          minWidth: 36,
          height: 36,
          fontSize: 17,
          fontWeight: "700",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {state.step + 1}
      </p>
      <div
        style={{
          fontWeight: "700",
          fontSize: 20,
          marginLeft: "15px",
          overflow: "auto",
        }}
      >
        {currentQuestion.title}
      </div>
    </div>

    {currentQuestion.description && (
      <div
        style={{
          fontSize: 14,
          marginLeft: "15px",
          maxHeight: 1000,
          overflow: "auto",
        }}
      >
        <Markdown text={currentQuestion.description} />
      </div>
    )}

    {currentQuestion.imageIPFS && (
      <div className="d-flex w-100 mb-3">
        <img
          src={ipfsUrl(currentQuestion.imageIPFS)}
          style={{
            maxHeight: 400,
            minHeight: 200,
            maxWidth: "100%",
            minWidth: "100px",
            objectFit: "contain",
          }}
        />
      </div>
    )}

    {currentQuestion.questionType == 0 && (
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.Inputs.YesNo`}
        props={{
          label: "Vote",
          value: alreadyVoted
            ? userAnswers[0].value.answers[state.step]
            : state.form[state.step].value,
          error: state.form[state.step].error,
          onChange: (v) => onFormFieldChange(state.step, "value", v),
          disabled: alreadyVoted || !isLoggedIn,
        }}
      />
    )}

    {currentQuestion.questionType === 1 && (
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.Inputs.Choices`}
        props={{
          value: alreadyVoted
            ? userAnswers[0].value.answers[state.step]
            : state.form[state.step].value,
          error: state.form[state.step].error,
          onChange: (v) => onFormFieldChange(state.step, "value", v),
          choices: currentQuestion.choicesOptions,
          disabled: alreadyVoted || !isLoggedIn,
          min: currentQuestion.minChoices,
          max: currentQuestion.maxChoices,
        }}
      />
    )}

    {currentQuestion.questionType === 2 && (
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.Inputs.Choices`}
        props={{
          value: alreadyVoted
            ? userAnswers[0].value.answers[state.step]
            : state.form[state.step].value,
          error: state.form[state.step].error,
          onChange: (v) => onFormFieldChange(state.step, "value", v),
          disabled: alreadyVoted || !isLoggedIn,
          min: currentQuestion.minChoices,
          max: currentQuestion.maxChoices,
          choices: currentQuestion.choicesOptions.map((_, i) => i + 1),
          images: currentQuestion.choicesOptions.map((v) => ipfsUrl(v)),
        }}
      />
    )}

    {currentQuestion.questionType === 3 && (
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.Inputs.OpinionScale`}
        props={{
          value: alreadyVoted
            ? userAnswers[0].value.answers[state.step]
            : state.form[state.step].value,
          error: state.form[state.step].error,
          onChange: (v) => onFormFieldChange(state.step, "value", v),
          disabled: alreadyVoted || !isLoggedIn,
          label0: currentQuestion.label0,
          label5: currentQuestion.label5,
          label10: currentQuestion.label10,
        }}
      />
    )}

    {currentQuestion.questionType === 4 && (
      <Widget
        src={`${widgetOwner}/widget/EasyPoll.Inputs.Text`}
        props={{
          label: "Answer",
          placeholder: "Type your answer here...",
          value: alreadyVoted
            ? userAnswers[0].value.answers[state.step]
            : state.form[state.step].value,
          error: state.form[state.step].error,
          onChange: (v) => onFormFieldChange(state.step, "value", v),
          disabled: alreadyVoted || !isLoggedIn,
        }}
      />
    )}

    <Widget
      src={`${widgetOwner}/widget/EasyPoll.Inputs.Footer`}
      props={{
        hasNext: questions.length > 1 && state.step !== questions.length - 1,
        onNext: handleNext,
        hasSubmit:
          !alreadyVoted && isLoggedIn && state.step === questions.length - 1,
        onSubmit: onFinish,
        hasPrev: state.step > 0,
        onPrev: handlePrev,
      }}
    />
  </div>
);
