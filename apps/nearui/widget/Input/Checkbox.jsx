const id = props.id ?? Math.random().toString(36).substring(7);
const onChange = props.onChange;
const checked = props.checked || false;
const disabled = props.disabled;
const label = props.label;
const inputProps = props.inputProps;

/**
 * Checkbox design By Andreas Storm
 * https://codepen.io/avstorm/full/pXgKNB
 */

const Wrapper = styled.div`
  * {
    box-sizing: border-box;
  }
  .cbx {
    appearance: none;
    border: none;
    background: none;
    text-align: start;

    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.2s ease;
    display: inline-block;
  }
  .cbx:not(:last-child) {
    margin-right: 6px;
  }
  .cbx:hover {
    background: rgba(0, 119, 255, 0.06);
  }
  .cbx span {
    float: left;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
  }
  .cbx span:first-child {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    transform: scale(1);
    border: 1px solid #cccfdb;
    transition: all 0.2s ease;
    box-shadow: 0 1px 1px rgba(0, 16, 75, 0.05);
  }
  .cbx span:first-child svg {
    position: absolute;
    top: 3px;
    left: 2px;
    fill: none;
    stroke: #fff;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
  }
  .cbx span:last-child {
    padding-left: 8px;
    line-height: 18px;
  }
  .cbx:hover span:first-child {
    border-color: #07f;
  }
  .checked.cbx span:first-child {
    background: #07f;
    border-color: #07f;
    animation: wave-4 0.4s ease;
  }
  .checked.cbx span:first-child svg {
    stroke-dashoffset: 0;
  }
  .inline-svg {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
    user-select: none;
  }
  @media screen and (max-width: 640px) {
    .cbx {
      width: 100%;
      display: inline-block;
    }
  }
  @-moz-keyframes wave-4 {
    50% {
      transform: scale(0.9);
    }
  }
  @-webkit-keyframes wave-4 {
    50% {
      transform: scale(0.9);
    }
  }
  @-o-keyframes wave-4 {
    50% {
      transform: scale(0.9);
    }
  }
  @keyframes wave-4 {
    50% {
      transform: scale(0.9);
    }
  }
`;

return (
  <Wrapper>
    <button
      id={id}
      type="checkbox"
      onClick={() => {
        onChange(!checked);
      }}
      disabled={disabled}
      className={`cbx ${checked ? "checked" : ""}`}
      {...inputProps}
    >
      <span>
        <svg width="12px" height="10px">
          <use xlinkHref="#check-4"></use>
        </svg>
      </span>
      {label && <span className="label">{label}</span>}
    </button>
    <svg className="inline-svg">
      <symbol id="check-4" viewBox="0 0 12 10">
        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
      </symbol>
    </svg>
  </Wrapper>
);
