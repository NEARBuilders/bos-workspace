const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0;
  min-width: 200px;
  max-width: 400px;
  width: 100%;
  color: #212529;
  background-color: #fff;
  border: 1px solid #ced4da;
  appearance: none;
  border-radius: 0.375rem;

  .label {
    font-size: 16px;
    font-weight: 500;
  }

  .input {
    width: 33%;
    position: relative;

    .label {
      position: absolute;
      font-size: 12px;
      top: 1px;
      left: 4px;
      user-select: none;
      color: #212529;
      opacity: 0.5;
    }

    input {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      background-color: transparent;
      border: none;
      outline: none;
      text-align: center;
      width: 100%;
      margin: 0;
      padding: 18px 12px 2px 0;
    }
  }

  .separator {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 500;
    padding-top: 8px;
  }
`;

State.init({
  days: props.days ?? null,
  hours: props.hours ?? null,
  minutes: props.minutes ?? null,
});

const onChange = (new_state) => {
  let s = {
    days: new_state.days === null ? 0 : parseInt(new_state.days),
    hours: new_state.hours === null ? 0 : parseInt(new_state.hours),
    minutes: new_state.minutes === null ? 0 : parseInt(new_state.minutes),
  };
  if (s.hours > 23) {
    return onChange({ ...s, days: s.days + 1, hours: 0 });
  }
  if (s.minutes > 59) {
    return onChange({ ...s, hours: s.hours + 1, minutes: 0 });
  }
  State.update(s);
  props.onChange && props.onChange(s);
};

return (
  <Wrapper className="time-input">
    <div className="input">
      <label className="label">Days</label>
      <input
        type="number"
        onChange={(e) => onChange({ ...state, days: e.target.value })}
        min="0"
        max="365"
        value={state.days}
        title="Days"
        defaultValue={props.days}
      />
    </div>
    <span className="separator">:</span>
    <div className="input">
      <label className="label">Hours</label>
      <input
        type="number"
        onChange={(e) => onChange({ ...state, hours: e.target.value })}
        min="0"
        value={state.hours}
        title="Hours"
        defaultValue={props.hours}
      />
    </div>
    <span className="separator">:</span>
    <div className="input">
      <label className="label">Minutes</label>
      <input
        className="input"
        type="number"
        onChange={(e) => onChange({ ...state, minutes: e.target.value })}
        min="0"
        value={state.minutes}
        title="Minutes"
        defaultValue={props.minutes}
      />
    </div>
  </Wrapper>
);
