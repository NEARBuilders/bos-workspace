const label = props.label;
const label0 = props.label0 ?? "Strongly Disagree";
const label5 = props.label5 ?? "Neutral";
const label10 = props.label10 ?? "Strongly Agree";
const value = props.value;
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
  margin-top: 6px;
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

let Option = styled.div`
  border-radius: 12px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  border: 2px solid transparent;
  background: #fff;
  align-items: center;
  color: rgb(0, 0, 0);
  cursor: pointer;
  display: flex;
  justify-content: center;
  text-align: center;
  user-select: none;

  width: 44px;
  height: 44px;
  aspect-ratio: 1;
  font-size: 14px;

  @media screen and (min-width: 786px) {
    width: 54px;
    height: 54px;
    font-size: 16px;
  }

  &[disabled] {
    cursor: default;
    opacity: 0.7;
  }
  &[disabled].active {
    background: #f1f1fd;
  }

  &.active {
    border-color: #4f46e5;
  }
`;

const Grid = styled.div`
  justify-content: flex-start;

  @media screen and (min-width: 389px) {
    max-width: 310px;
    justify-content: center;
  }
  @media screen and (min-width: 786px) {
    max-width: 690px;
  }
`;

const Labels = styled.div`
  label {
    width: 200px;
  }
  label span {
    display: none;
  }

  @media screen and (max-width: 786px) {
    flex-direction: column;
    label {
      width: auto;
      text-align: start !important;
    }
    label span {
      display: inline-block;
    }
  }
`;

return (
  <Container>
    {label && <Label>{label}</Label>}

    <Grid className="d-flex gap-2 flex-wrap w-100 m-auto">
      {[...Array(11)]?.map((_, i) => (
        <Option
          role="button"
          className={value == i ? "active" : ""}
          onClick={() => !disabled && onChange(i)}
          disabled={disabled}
        >
          {i}
        </Option>
      ))}
    </Grid>
    <Labels
      className="w-100 m-auto d-flex justify-content-between"
      style={{
        maxWidth: 690,
      }}
    >
      <label className="text-start">
        <span>0 - </span>
        {label0}
      </label>
      <label className="text-center">
        <span>5 - </span>
        {label5}
      </label>
      <label className="text-end">
        <span>10 - </span>
        {label10}
      </label>
    </Labels>
    <Error className={error ? "show" : ""}>{error}</Error>
  </Container>
);
