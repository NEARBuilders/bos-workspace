const steps = props.steps;
const colors = props.colors;
const onClick = props.onClick;

if (!state) {
  State.init({
    ExperimentalCachedWrapper: styled.ol`
      list-style: none;
      margin: 0;
      padding: 0;
      width: 100%;
      display: flex;
      gap: 16px;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;

      li {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        transition: all 100ms ease-in-out;
        width: 90px;
      }

      li.active-outline {
        .step-circle {
          border: 1px solid ${({ colors }) => colors.activeBG || "#82E299"};
          color: ${({ colors }) => colors.activeBG || "#82E299"};
          background: transparent;
        }
      }

      li.danger-outline {
        .step-circle {
          border: 1px solid #ff0000;
          color: #ff0000;
          background: transparent;
        }
      }

      .step-circle {
        display: flex;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        justify-content: center;
        align-items: center;
        background: ${({ colors }) => colors.bg || "#fff"};
        border: 1px solid ${({ colors }) => colors.border || "#e5e5e5"};
        color: ${({ colors }) => colors.text || "#000"};
        font-size: 18px;
        font-weight: 600;
        transform: scale(1);
        transition: 100ms ease-in-out;
      }

      .step-title {
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        width: 100%;
        color: ${({ colors }) => colors.text || "#000"};
        margin-top: 8px;
      }

      li.active {
        .step-circle {
          background: ${({ colors }) => colors.activeBG || "#82E299"};
          color: ${({ colors }) => colors.activeText || "#000"};
          border: 1px solid ${({ colors }) => colors.activeBG || "#82E299"};
          transform: scale(1.2);
        }
      }

      li.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .step-line {
        flex: 1;
        max-width: 200px;
        height: 1px;
        background: ${({ colors }) => colors.border || "#e5e5e5"};
        transition: all 100ms ease-in-out;
        margin-top: 24px;

        @media (max-width: 768px) {
          display: none;
        }
      }
    `,
  });
}

const { ExperimentalCachedWrapper } = state;

return (
  <ExperimentalCachedWrapper colors={colors}>
    {steps.map((step, i) => {
      return (
        <>
          {i !== 0 && (
            <div
              className={["step-line", step.active && "active"].join(" ")}
            ></div>
          )}
          <li
            key={i}
            className={[
              step.active && "active",
              step.disabled && "disabled",
              step.className,
            ].join(" ")}
            onClick={step.onClick || (() => onClick(i))}
            role="button"
          >
            <div className="step-circle">{step.icon ? step.icon : i + 1}</div>
            <div className="step-title">{step.title}</div>
          </li>
        </>
      );
    })}
  </ExperimentalCachedWrapper>
);
