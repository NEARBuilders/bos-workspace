const label = props.label;
const placeholder = props.placeholder ?? "";
const value = props.value ?? "";
const options = props.options ?? [
  {
    title: "Example 1",
    value: 1,
  },
  {
    title: "Example 2",
    value: 2,
    default: true,
  },
  {
    title: "Example 3",
    value: 3,
  },
];
const onChange = props.onChange ?? (() => {});
const validate = props.validate ?? (() => {});
const error = props.error ?? "";
const selectProps = props.selectProps ?? {};
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

const Select = styled.select`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5em;
  background: #ffffff;
  border: 1px solid #d0d5dd;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 8px;
  width: 100%;
  padding: 8px 10px;
  font-size: 14px;
  color: #101828;
  transition: border-color 100ms ease-in-out;

  &:hover {
    border-color: #aaa;
  }

  &[disabled] {
    background: #f1f1fd;
    opacity: 0.7;
  }
`;

return (
  <Container>
    {label && <Label>{label}</Label>}
    <Select
      placeholder={placeholder}
      value={value}
      onChange={({ target: { value } }) => onChange(value)}
      onBlur={() => validate()}
      disabled={disabled}
      {...selectProps}
    >
      {options.map((o) => (
        <option value={o.value} default={o.default}>
          {o.title}
        </option>
      ))}
    </Select>
    <Error className={error ? "show" : ""}>{error}</Error>
  </Container>
);
