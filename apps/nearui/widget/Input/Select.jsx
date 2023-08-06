const label = props.label;
const placeholder = props.placeholder ?? "";
const value = props.value;
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
const error = props.error;
const selectProps = props.selectProps ?? {};
const disabled = props.disabled;
const size = props.size ?? "md"; // sm, md, lg
const className = props.className ?? "";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 0.45em;
  width: max-content;
  flex: 1;
  min-width: 140px;
  width: 100%;
`;

const Label = styled.label`
  font-style: normal;
  font-weight: 600;
  font-size: ${({ size }) =>
    size === "sm" ? "0.8em" : size === "lg" ? "1.1em" : "0.95em"};
  line-height: 1.25em;
  color: #344054;
`;

const Error = styled.span`
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  font-size: ${({ size }) =>
    size === "sm" ? "0.65em" : size === "lg" ? "0.85em" : "0.75em"};
  line-height: 1.25em;
  color: #ff4d4f;
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease-in-out;

  &.show {
    height: 1.25em;
  }
`;

const InputContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5em;
  background: #ffffff;
  border: 1px solid #d0d5dd;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  color: #101828;
  background: #fff;
  position: relative;
  width: 100%;

  font-size: ${({ size }) =>
    size === "sm" ? "12px" : size === "lg" ? "16px" : "14px"};
  border-radius: ${({ size }) =>
    size === "sm" ? "8px" : size === "lg" ? "12px" : "10px"};

  &.disabled {
    background: #f5f5f5;
    opacity: 0.7;
  }
`;

const Select = styled.select`
  border: none;
  background: transparent;
  font-size: inherit;
  color: inherit;
  font-family: inherit;
  font-weight: 500;
  width: 100%;
  border-radius: inherit;
  padding: ${({ size }) =>
    size === "sm" ? "0 15px" : size === "lg" ? "0 23px" : "0 18px"};
  height: ${({ size }) =>
    size === "sm" ? "32px" : size === "lg" ? "40px" : "36px"};

  option {
    font-size: inherit;
    color: inherit;
    font-family: inherit;
    font-weight: 500;
  }
`;

return (
  <Container>
    {label && <Label size={size}>{label}</Label>}
    <InputContainer
      className={`${disabled ? "disabled" : ""} ${className}`}
      size={size}
    >
      <Select
        placeholder={placeholder}
        value={value}
        onChange={({ target: { value } }) => onChange(value)}
        onBlur={() => validate()}
        disabled={disabled}
        size={size}
        className={className}
        {...selectProps}
      >
        {options.map((o) => (
          <option value={o.value} default={o.default}>
            {o.title}
          </option>
        ))}
      </Select>
    </InputContainer>
    {error && (
      <Error className={error ? "show" : ""} size={size}>
        {error}
      </Error>
    )}
  </Container>
);
