const label = props.label;
const choices = props.choices ?? [];
const min = Number(props.min ?? 0);
const max = Number(props.max ?? 0);
const images = props.images;
const value = props.value ?? [];
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

const hasImage = images;

let Option;
if (hasImage) {
  Option = styled.div`
    margin-bottom: 24px;
    flex: 1;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
      rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    padding: 4px;
    cursor: pointer;
    border: 2px solid transparent;
    position: relative;
    min-width: 160px;
    max-width: 184px;
    aspect-ratio: 0.85;
    display: flex;
    flex-direction: column;
    background: #fff;

    &[disabled] {
      cursor: default;
      opacity: 0.7;
    }
    &[disabled].active {
      background: #f1f1fd;
    }

    h5 {
      font-size: 16px;
      font-weight: 600;
      padding: 6px 16px;
      text-align: center;
      margin: 0;
      padding-left: 8px;
    }

    img {
      width: 100%;
      aspect-ratio: 1;
      margin: 0 auto auto auto;
      max-width: 200px;
      border-radius: 16px;
      background: #eee;
    }

    &.active {
      border-color: #4f46e5;
    }

    input {
      accent-color: #4f46e5;
      margin: 0;
      margin-left: 6px;
    }
  `;
} else {
  Option = styled.div`
    flex: 1;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
      rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
    padding: 8px 16px;
    cursor: pointer;
    border: 2px solid transparent;
    display: flex;
    width: 100%;
    gap: 6px;
    align-items: center;
    background: #fff;
    cursor: pointer;

    &[disabled] {
      cursor: default;
      opacity: 0.7;
    }
    &[disabled].active {
      background: #f1f1fd;
    }

    .md > p:last-child {
      font-size: 15px;
      font-weight: 500;
      text-align: left;
      margin: 0;
    }

    &.active {
      border-color: #4f46e5;
    }

    input {
      accent-color: #4f46e5;
      margin: 0;
      margin-right: 8px;
      min-width: 16px;
      height: 16px;
    }
  `;
}

let defaultLabel;

if (max === 1) {
  defaultLabel = "Select one answer";
} else if (min === max) {
  defaultLabel = `Select exactly ${min} answers`;
} else if (max > 1000) {
  defaultLabel = `Choose at least ${min} answers.`;
} else if (min === 0) {
  defaultLabel = `Please choose up to ${max} answers.`;
} else {
  defaultLabel = `Select between ${min} and ${max} answers`;
}

const type = max === 1 ? "single" : "multiple";

const handleChange = (v) => {
  if (type === "single") {
    onChange([v]);
    return;
  }
  if (value.includes(v)) {
    const new_value = value.filter((val) => val !== v);
    onChange(new_value);
  } else {
    if (value.length < max) {
      onChange([...value, v]);
    } else {
      console.log("Maximum limit reached");
    }
  }
};

return (
  <Container>
    <Label>{label || defaultLabel}</Label>
    <div
      className={`d-flex flex-wrap w-100 ${
        !hasImage ? "gap-3 flex-column" : "gap-3"
      }`}
    >
      {choices?.map((v, i) => {
        let text = v;
        v = hasImage ? images[i] : v;
        return (
          <Option
            role="button"
            className={value == v || value.includes(v) ? "active" : ""}
            onClick={() => !disabled && handleChange(v)}
            disabled={disabled}
          >
            {hasImage && <img src={images[i]} />}
            <div className="d-flex gap-1 align-items-center">
              <input
                className="form-check-input"
                type={type === "single" ? "radio" : "checkbox"}
                checked={value == v || value.includes(v)}
              />
              {hasImage ? (
                <h5>{text}</h5>
              ) : (
                <div className="md">
                  <Markdown text={text} />
                </div>
              )}
            </div>
          </Option>
        );
      })}
    </div>
    <Error className={error ? "show" : ""}>{error}</Error>
  </Container>
);
