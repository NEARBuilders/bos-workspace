const { formState, errors, renderFooter } = props;

const initialAnswers = {
  links: formState.links.length > 0 ? formState.links : [""],
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

const onAddLink = () => update("links", [...state.answers.links, ""]);

const onLinkChange = (index, value) => {
  const newLinks = [...state.answers.links];
  newLinks[index] = value;
  update("links", newLinks);
};

const onRemoveLink = (index) => {
  const newLinks = [...state.answers.links];
  newLinks[index] = null;
  update("links", newLinks);
};

const Error = styled.span`
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.25em;
  color: #ff4d4f;
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease-in-out;

  &.show {
    height: 1.25em;
  }
`;

return (
  <div className="mt-4 ndc-card p-4">
    <div className="d-flex flex-column gap-4">
      <div>
        <div className="d-flex gap-2 justify-content-between">
          <h2 className="h5 fw-bold">
            <span
              className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bolder h5 me-2"
              style={{
                width: "48px",
                height: "48px",
                border: "1px solid #82E299",
              }}
            >
              2
            </span>
            Links and socials{" "}
            <span className="text-black-50 fw-light small">(optional)</span>
          </h2>
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-plus-lg" />,
              variant: "icon info outline",
              size: "lg",
              onClick: onAddLink,
            }}
          />
        </div>
        <p className="text-black-50 fw-light small">
          Looking to grow the DAO members? Add links to allow people to learn
          more about your DAO. You can only add 10 links.
        </p>
      </div>

      {state.answers.links.map((l, i) => (
        <div
          className={[
            "d-flex align-items-center gap-2",
            l === null && "d-none",
          ].join(" ")}
        >
          <Widget
            src="nearui.near/widget/Input.ExperimentalText"
            props={{
              placeholder: "https://",
              size: "lg",
              onChange: (v) => onLinkChange(i, v),
              inputProps: {
                name: `link-${i}`,
                defaultValue: l,
              },
            }}
          />
          <Widget
            src="nearui.near/widget/Input.Button"
            props={{
              children: <i className="bi bi-trash" />,
              variant: "icon danger outline",
              size: "lg",
              onClick: () => onRemoveLink(i),
            }}
          />
        </div>
      ))}
      {errors.links && (
        <Error className={errors.links ? "show" : ""} size={size}>
          {errors.links}
        </Error>
      )}
    </div>

    {renderFooter({
      links: state.answers.links.filter((l) => l !== null && l !== ""),
    })}
  </div>
);
