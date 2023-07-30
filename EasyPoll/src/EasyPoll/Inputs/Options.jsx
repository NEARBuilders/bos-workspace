const label = props.label ?? "Label";
const placeholder = props.placeholder ?? "Placeholder";
const value = props.value ?? [{}];
const textarea = props.textarea ?? false;
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
`;

const IconButton = styled.div`
  font-size: 18px;
  padding: 5px;
  transition: all 100ms ease;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;

  &.danger {
    color: red;
  }

  &.danger:hover {
    color: red;
  }

  &:hover {
    color: #4f46e5;
    transform: scale(1.3);
  }
`;

const onOptionChange = (id, v) => {
  const new_value = [...value];
  new_value[id] = v;

  onChange(new_value);
};

const onOptionRemove = (id) => {
  if (value.length < 2) return;
  const new_value = [...value];
  new_value.splice(id, 1);

  onChange(new_value);
};

const onAddOption = () => {
  if (value.length > 12) return;

  const new_value = [...value, ""];

  onChange(new_value);
};

return (
  <Container>
    <Label>{label}</Label>
    {value?.map((v, i) => {
      return (
        <div className="w-100 d-flex gap-2 align-content-center">
          <Input
            type="text"
            placeholder={placeholder}
            value={v}
            onChange={({ target: { value } }) => onOptionChange(i, value)}
            className="flex-1"
          />
          <IconButton
            className="danger"
            role="button"
            title="Delete Option"
            onClick={() => onOptionRemove(i)}
          >
            <i class="bi bi-x-lg"></i>
          </IconButton>
        </div>
      );
    })}
    {value.length < 12 && (
      <div className="mt-1" role="button" onClick={onAddOption}>
        <i class="bi bi-plus-lg"></i>
        <span>Add another option</span>
      </div>
    )}
    <Error className={error ? "show" : ""}>{error}</Error>
  </Container>
);
