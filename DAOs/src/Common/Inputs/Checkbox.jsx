const Box = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5em;

  button {
    padding: 0;
    width: 1.5em;
    height: 1.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #888;
    background: #fff;
    border-radius: 7px;
    transition: background 200ms ease-out;

    &[data-state="checked"] {
      background: #59e691;
      border-color: #d7dbdf;
    }

    &[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  svg {
    color: #111;
  }
`;

const Label = styled.label`
  font-style: normal;
  font-weight: 400;
  font-size: 0.75em;
  line-height: 1em;
  color: #202024;
  font-style: normal;
`;

return (
  <Box>
    <Checkbox.Root
      checked={props.checked}
      defaultChecked={props.defaultChecked}
      onCheckedChange={props.onChange}
      id={props.id}
      disabled={props.disabled}
    >
      <Checkbox.Indicator>
        <svg
          width="20"
          height="20"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          ></path>
        </svg>
      </Checkbox.Indicator>
    </Checkbox.Root>
    <Label htmlFor={props.id}>{props.label}</Label>
  </Box>
);
