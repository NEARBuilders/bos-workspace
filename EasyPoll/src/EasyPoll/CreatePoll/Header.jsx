const steps = props.steps;

const Step = styled.div`
  text-decoration: none;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 700;
  color: #828688;
  opacity: 0.8;

  b {
    background: #828688;
    color: #fff;
    line-height: 28px;
    width: 28px;
    padding: 0 10px;
    display: inline-block;
    border-radius: 50%;
    margin-right: 8px;
    font-size: 15px;
  }
  :after {
    content: "";
    display: inline-block;
    height: 2px;
    width: 16px;
    background: #0000a8;
    margin: 0 32px;
    opacity: 0.5;
  }
  :last-child:after {
    display: none;
  }

  &.active {
    color: #4f46e5;
    opacity: 1;
  }
  &.active b {
    background: #4f46e5;
  }
`;

return (
  <div className="w-100 px-4 py-2 mb-4">
    <h1
      className="text-center mb-4"
      style={{
        fontSize: 24,
        fontWeight: "500",
        letterSpacing: "-1px",
      }}
    >
      Creating a New Poll
    </h1>
    <div className="d-flex align-items-center justify-content-center">
      {steps.map(({ text, active }, i) => {
        return (
          <Step className={active && "active"}>
            <b>{i + 1}</b>
            <span>{text}</span>
          </Step>
        );
      })}
    </div>
  </div>
);
