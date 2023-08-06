const { formState, errors, renderFooter } = props;

const initialAnswers = {
  name: formState.name,
  address: formState.address,
  soulBoundTokenIssuer: formState.soulBoundTokenIssuer,
  purpose: formState.purpose,
  legalStatus: formState.legalStatus,
  legalDocument: formState.legalDocument,
};

State.init({
  answers: initialAnswers,
});

const onValueChange = (key, value) => {
  State.update({
    answers: {
      ...state.answers,
      [key]: value,
    },
  });
};

return (
  <div className="mt-4 ndc-card p-4">
    <div className="d-flex flex-column gap-4">
      <h2 className="h5 fw-bold">
        <span
          className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bolder h5 me-2"
          style={{
            width: "48px",
            height: "48px",
            border: "1px solid #82E299",
          }}
        >
          1
        </span>
        DAO Info & KYC
      </h2>
      <Widget
        src="nearui.near/widget/Input.ExperimentalText"
        props={{
          label: "DAO Name",
          placeholder: "Lorem Ipsum",
          size: "md",
          onChange: (v) => {
            onValueChange("name", v);
            // generate address
            onValueChange(
              "address",
              `${v
                .toLowerCase()
                .replace(/\s/g, "-")
                .replace(/[^a-zA-Z0-9-]/g, "")}.sputnik-dao.near`,
            );
          },
          inputProps: {
            name: "name",
            defaultValue: state.answers.name,
          },
          error: errors["name"],
        }}
      />
      <Widget
        src="nearui.near/widget/Input.ExperimentalText"
        props={{
          label: (
            <>
              DAO Address{" "}
              <span className="text-black-50 fw-light small">
                (auto-filled)
              </span>
            </>
          ),
          placeholder: "sample-dao-name.sputnik-dao.near",
          value:
            state.answers.address === "" ? undefined : state.answers.address,
          size: "md",
          disabled: true,
          onChange: (v) => onValueChange("address", v),
          inputProps: {
            name: "address",
            defaultValue: state.answers.address,
          },
          error: errors["address"],
        }}
      />
      <Widget
        src="nearui.near/widget/Input.ExperimentalText"
        props={{
          label: (
            <>
              Soul Bound Token Issuer{" "}
              <span className="text-black-50 fw-light small">(optional)</span>
            </>
          ),
          placeholder: "The address of the token issuer",
          size: "md",
          onChange: (v) => onValueChange("soulBoundTokenIssuer", v),
          error: errors["soulBoundTokenIssuer"],
          inputProps: {
            name: "soulBoundTokenIssuer",
            defaultValue: state.answers.soulBoundTokenIssuer,
          },
        }}
      />
      <Widget
        src="nearui.near/widget/Input.ExperimentalText"
        props={{
          label: "Purpose",
          placeholder: "Please add the purpose of your DAO",
          size: "md",
          textarea: true,
          inputProps: {
            rows: 5,
            name: "purpose",
            defaultValue: state.answers.purpose,
          },
          onChange: (v) => onValueChange("purpose", v),
          error: errors["purpose"],
        }}
      />
      <h3 className="h5 fw-bold">
        KYC <span className="text-black-50 fw-light small">(optional)</span>
      </h3>
      <Widget
        src="nearui.near/widget/Input.ExperimentalText"
        props={{
          label: (
            <>
              Please explain your DAO&apos;s Legal Status and Jurisdiction{" "}
              <span className="text-black-50 fw-light small">(if known)</span>
            </>
          ),
          placeholder: "LLC",
          size: "md",
          onChange: (v) => onValueChange("legalStatus", v),
          error: errors["legalStatus"],
          inputProps: {
            name: "legalStatus",
            defaultValue: state.answers.legalStatus,
          },
        }}
      />
      <Widget
        src="nearui.near/widget/Input.ExperimentalText"
        props={{
          label: (
            <>
              Please provide a link to your DAO&apos;s Legal Document{" "}
              <span className="text-black-50 fw-light small">(if any)</span>
            </>
          ),
          placeholder: "https://Legal_Document",
          size: "md",
          onChange: (v) => onValueChange("legalDocument", v),
          error: errors["legalDocument"],
          inputProps: {
            name: "legalDocument",
            defaultValue: state.answers.legalDocument,
          },
        }}
      />
    </div>

    {renderFooter(state.answers)}
  </div>
);
