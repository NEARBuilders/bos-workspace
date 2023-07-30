const active = props.value ?? false;
const disabled = props.disabled ?? false;
const label = props.label ?? "";
const onChange = props.onChange ?? (() => {});

const ToggleRoot = styled.div`
  justify-content: space-between;
  width: fit-content;
  max-width: 100%;
  display: flex;
  gap: 16px;
  align-items: center;

  &.disabled {
    cursor: not-allowed;
  }
`;

const ToggleSwitchRoot = styled("Switch.Root")`
  all: unset;
  display: block;
  width: 42px;
  height: 25px;
  background-color: #d1d1d1;
  border-radius: 9999px;
  position: relative;
  box-shadow: 0 2px 10px var(--blackA7);
  min-width: 42px;

  &[data-state="checked"] {
    background-color: #00d084;
  }

  &[data-disabled=""] {
    opacity: 0.7;
  }
`;

const ToggleSwitchThumb = styled("Switch.Thumb")`
  all: unset;
  display: block;
  width: 21px;
  height: 21px;
  border-radius: 9999px;
  box-shadow: 0 2px 2px var(--blackA7);
  transition: transform 100ms;
  transform: translateX(2px);
  will-change: transform;

  &[data-state="checked"] {
    transform: translateX(19px);
  }
`;

const ToggleLabel = styled.label`
  font-style: normal;
  font-weight: 600;
  font-size: 0.95em;
  line-height: 1.25em;
  color: #344054;
  cursor: pointer;
`;

const key = props.key ?? Math.random().toString(16).slice(2);

return (
  <ToggleRoot className={disabled ? "disabled" : ""}>
    <ToggleSwitchRoot
      type="text"
      checked={active}
      id={`toggle-${key}`}
      onCheckedChange={disabled ? null : onChange}
      title={disabled ? `Disabled` : null}
      {...{ disabled }}
    >
      <ToggleSwitchThumb className="bg-light" />
    </ToggleSwitchRoot>
    <ToggleLabel htmlFor={`toggle-${key}`}>{label}</ToggleLabel>
  </ToggleRoot>
);
