const hasNext = props.hasNext ?? false;
const hasPrev = props.hasPrev ?? false;
const hasSubmit = props.hasSubmit ?? !hasNext;
const hasDraft = props.hasDraft ?? false;
const onNext = props.onNext ?? (() => {});
const onPrev = props.onPrev ?? (() => {});
const onSubmit = props.onSubmit ?? (() => {});
const onDraft = props.onDraft ?? (() => {});

return (
  <div className="d-flex gap-4 pt-4 justify-content-end">
    {hasPrev && (
      <Widget
        src="rubycop.near/widget/NDC.StyledComponents"
        props={{
          Button: {
            text: "Previous",
            icon: <i className="bi bi-chevron-left" />,
            className:
              "dark d-flex gap-2 align-items-center flex-row-reverse me-auto",
            onClick: onPrev,
          },
        }}
      />
    )}
    {hasDraft && (
      <Widget
        src="rubycop.near/widget/NDC.StyledComponents"
        props={{
          Button: {
            text: "Save Draft",
            icon: <i className="bi bi-file-arrow-down" />,
            className: "dark d-flex gap-2 align-items-center",
            onClick: onDraft,
          },
        }}
      />
    )}
    {hasNext && (
      <Widget
        src="rubycop.near/widget/NDC.StyledComponents"
        props={{
          Button: {
            text: "Next",
            icon: <i className="bi bi-chevron-right" />,
            className: "primary dark d-flex gap-2 align-items-center",
            onClick: onNext,
          },
        }}
      />
    )}
    {hasSubmit && (
      <Widget
        src="rubycop.near/widget/NDC.StyledComponents"
        props={{
          Button: {
            text: "Submit",
            icon: <i className="bi bi-chevron-right" />,
            className: "primary dark d-flex gap-2 align-items-center",
            onClick: onSubmit,
          },
        }}
      />
    )}
  </div>
);
