// Uses some hacks to make it lag less

const label = props.label;
const placeholder = props.placeholder ?? "Placeholder";
const value = props.value;
const onChange = props.onChange ?? (() => {});
const validate = props.validate ?? (() => {});
const error = props.error;
const textarea = props.textarea ?? false;
const inputProps = props.inputProps ?? {};
const disabled = props.disabled;
const icon = props.icon;
const size = props.size ?? "md"; // sm, md, lg
const className = props.className ?? "";
const useTimeout = props.useTimeout ?? false; // Uses a timeout beween typing event and calling onChange

if (!state) {
  State.init({
    value: value,

    Container: styled.div`
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0px;
      gap: 0.45em;
      width: max-content;
      flex: 1;
      min-width: 140px;
      width: 100%;
    `,

    Label: styled.label`
      font-style: normal;
      font-weight: 600;
      font-size: ${({ size }) =>
        size === "sm" ? "0.8em" : size === "lg" ? "1.1em" : "0.95em"};
      line-height: 1.25em;
      color: #344054;
    `,

    Error: styled.span`
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
    `,

    InputContainer: styled.div`
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

      &.rounded {
        border-radius: 50px !important;
      }

      .icon {
        position: absolute;
        left: 1em;
        top: 50%;
        transform: translateY(-50%);
        color: #999;
        font-size: inherit;
      }
    `,

    Input: styled[textarea ? "textarea" : "input"]`
      border: none;
      background: transparent;
      font-size: inherit;
      color: inherit;
      font-family: inherit;
      font-weight: 500;
      width: 100%;
      border-radius: inherit;
      line-height: 24px;
      padding: ${({ size }) =>
        size === "sm" ? "4px 15px" : size === "lg" ? "8px 23px" : "6px 18px"};

      ${({ hasIcon }) => (hasIcon ? "padding-left: 2.8em" : "")};
    `,
    timeout: null,
  });

  return "";
}

const { Container, Label, InputContainer, Input, Error } = state;

return (
  <Container>
    {label && <Label size={size}>{label}</Label>}
    <InputContainer
      className={`${disabled ? "disabled" : ""} ${className}`}
      size={size}
    >
      <div className="icon">{icon}</div>
      <Input
        type={inputProps.type ?? "text"}
        placeholder={placeholder}
        value={value ?? state.value}
        onChange={(e) => {
          if (useTimeout) {
            clearTimeout(state.timeout);
            const newTimeout = setTimeout(
              () => {
                onChange(state.value);
                console.log(
                  "Input.ExperimentalText: Called input onChange because of timeout with the id:",
                  newTimeout,
                );
              },
              typeof useTimeout === "number" ? useTimeout : 300,
            );
            State.update({
              value: e.target.value,
              timeout: newTimeout,
            });
          } else {
            State.update({
              value: e.target.value,
            });
            onChange(state.value);
          }
        }}
        onBlur={() => validate()}
        disabled={disabled}
        size={size}
        className={className}
        hasIcon={!!icon}
        {...inputProps}
      />
    </InputContainer>
    {error && (
      <Error className={error ? "show" : ""} size={size}>
        {error}
      </Error>
    )}
  </Container>
);
