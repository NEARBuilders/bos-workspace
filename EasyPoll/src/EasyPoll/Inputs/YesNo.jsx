const label = props.label ?? "Label";
const value = props.value ?? "";
const onChange = props.onChange ?? (() => {});
const error = props.error ?? "";
const disabled = props.disabled ?? "";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0px;
  gap: 0.45em;
  width: 100%;
`;

const Label = styled.label`
  font-style: normal;
  font-weight: 600;
  font-size: 0.95em;
  line-height: 1.25em;
  color: #344054;
`;

const Error = styled.span`
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: 0.75em;
  line-height: 1.25em;
  color: #ff4d4f;
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease-in-out;

  &.show {
    height: 1.25em;
  }
`;

const Button = styled.button`
  padding: 12px 16px;
  border: 3px solid transparent;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 16px;
  width: 100%;
  font-weight: 700;
  font-size: 20;
  flex: 1;
  transition: all 200ms ease;
  color: #000;

  &.yes {
    background-color: #82ecaa;
  }

  &.no {
    background-color: #f08788;
  }

  &.active {
    border-color: #4f46e5;
  }

  &.active {
    border-color: #4f46e5;
  }

  &.notactive {
    opacity: 0.6;
  }

  &[disabled] {
    cursor: not-allowed;
  }
`;

return (
  <Container>
    <Label>{label}</Label>
    <div className="d-flex gap-3 w-100">
      <Button
        className={
          (value == "yes" ? "active " : value == "no" ? "notactive" : "") +
          " yes"
        }
        onClick={() => !disabled && onChange("yes")}
        disabled={disabled}
      >
        Yes
      </Button>
      <Button
        className={
          (value == "no" ? "active " : value == "yes" ? "notactive" : "") +
          " no"
        }
        onClick={() => !disabled && onChange("no")}
        disabled={disabled}
      >
        No
      </Button>
    </div>
    <Error className={error ? "show" : ""}>{error}</Error>
  </Container>
);
