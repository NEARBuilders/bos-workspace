const label = props.label ?? "Label";
const placeholder = props.placeholder ?? "Placeholder";
const value = props.value ?? "";
const onChange = props.onChange ?? (() => {});
const validate = props.validate ?? (() => {});
const error = props.error ?? "";
const textarea = props.textarea ?? false;
const inputProps = props.inputProps ?? {};
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

const Input = styled[textarea ? "textarea" : "input"]`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.5em 0.75em;
  gap: 0.5em;
  background: #ffffff;
  border: 1px solid #d0d5dd;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 4px;
  color: #101828;
  width: 100%;
  background: #fff;

  &[disabled] {
    background: #f1f1fd;
    opacity: 0.7;
  }
`;

return (
  <Container>
    <Label>{label}</Label>
    <Input
      type={inputProps.type ?? "text"}
      placeholder={placeholder}
      value={value}
      onChange={({ target: { value } }) => onChange(value)}
      onBlur={() => validate()}
      disabled={disabled}
      {...inputProps}
    />
    <Error className={error ? "show" : ""}>{error}</Error>
  </Container>
);
