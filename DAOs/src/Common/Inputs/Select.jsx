const label = props.label ?? "Label";
const noLabel = props.noLabel ?? false;
const placeholder = props.placeholder ?? "Select an option";
const value = props.value ?? "";
const options = props.options ?? [];
const onChange = props.onChange ?? (() => {});
const validate = props.validate ?? (() => {});
const error = props.error ?? "";

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
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  color: #6c757d;
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

const Input = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 0.75em;
  gap: 0.5em;
  background: #ffffff;
  border: 1px solid #d0d5dd;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  border-radius: 4px;
  color: #101828;
  width: 100%;
`;

const Placeholder = styled.span`
  color: #a0a3a8;
`;

const scaleOut = styled.keyframes`
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0;
  gap: 0.5em;
  width: 100%;
  border: 1px solid #d0d5dd;
  border-radius: 4px;
  background: #ffffff;
  z-index: 3 !important;

  /* &[data-state="open"] { */
  /*   animation: ${scaleOut} 0.2s ease-in-out; */
  /* } */
  /**/
  /* &[data-state="closed"] { */
  /*   animation: ${scaleOut} 0.2s ease-in-out reverse; */
  /* } */
`;

const Viewport = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0;
  width: 100%;
`;

const Item = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0.5em 0.75em;
  gap: 0.5em;
  width: 100%;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: background 0.2s ease-in-out;

  &:nth-child(n + 1) {
    border-top: 1px solid #d0d5dd;
  }

  &:hover {
    background: #d0d5dd;
    boder: none;
  }

  &:focus {
    outline: none;
  }
`;

return (
  <Container>
    {noLabel ? <></> : <Label>{label}</Label>}
    <Select.Root
      value={value?.value}
      onValueChange={(value) =>
        onChange(options.find((option) => option.value === value))
      }
    >
      <Select.Trigger asChild={true}>
        <Input>
          <Select.Value
            aria-label={value.value}
            placeholder={<Placeholder>{placeholder}</Placeholder>}
          />
          <Select.Icon>
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </Select.Icon>
        </Input>
      </Select.Trigger>

      <Select.Content asChild={true}>
        <Content>
          <Select.Viewport asChild={true}>
            <Viewport>
              {props.options.map(({ text, value }) => (
                <Select.Item value={value} asChild={true}>
                  <Item>
                    <Select.ItemText>{text}</Select.ItemText>
                    <Select.ItemIndicator>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </Select.ItemIndicator>
                  </Item>
                </Select.Item>
              ))}
            </Viewport>
          </Select.Viewport>
        </Content>
      </Select.Content>
    </Select.Root>
  </Container>
);
