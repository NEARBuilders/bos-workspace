const children = props.children ?? "Button";
const onClick = props.onClick ?? (() => {});
const href = props.href;
const disabled = props.disabled;
const variant =
  typeof props.variant === "string"
    ? props.variant
    : Array.isArray(props.variant)
    ? props.variant.join(" ")
    : ""; // can have many, can be an array or separated by space similar to className: primary, secondary, danger, success, info, outline, rounded, disabled, icon
const size = props.size ?? "md"; // sm, md, lg
const className = props.className ?? "";
const buttonProps = props.buttonProps ?? {};

const tag = href || buttonProps.href ? "a" : "button";

const Wrapper = styled[tag]`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
  white-space: nowrap;
  text-decoration: none;

  width: max-content;
  padding: ${({ size }) =>
    size === "sm" ? "4px 20px" : size === "lg" ? "8px 28px" : "6px 24px"};
  font-size: ${({ size }) =>
    size === "sm" ? "12px" : size === "lg" ? "16px" : "14px"};
  border-radius: ${({ size }) =>
    size === "sm" ? "8px" : size === "lg" ? "12px" : "10px"};
  font-weight: 600;
  line-height: 24px;
  text-align: center;
  border: 1px solid transparent;

  &:hover,
  &:focus {
    text-decoration: none;
    opacity: 0.85;
  }

  &:disabled {
    cursor: not-allowed;
  }

  &.rounded {
    border-radius: 100px !important;
  }

  &.icon {
    padding: 0;
    width: 2.36em;
    height: 2.36em;
    font-size: ${({ size }) =>
      size === "sm" ? "14px" : size === "lg" ? "18px" : "16px"};
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.primary {
    color: #11181c;
    background: #ffd50d;
    border-color: #ffd50d;

    &.outline {
      background: transparent;
      color: #dab70f;
      border-color: #ffd50d;
    }
  }

  &.secondary {
    color: #fff;
    background: linear-gradient(90deg, #9333ea 0%, #4f46e5 100%);
    border-color: transparent;

    &.outline {
      background: transparent;
      color: #4f46e5;
      border-color: #4f46e5;
    }

    // &.outline {
    //   background: #fff;
    //   color: #4f46e5;
    //   border: 1px solid transparent;
    //   position: relative;
    //   background-clip: padding-box !important;
    //   opacity: 1 !important;

    //   &::before {
    //     content: "";
    //     background-image: linear-gradient(90deg, #9333ea 0%, #4f46e5 100%);
    //     border-radius: inherit;
    //     top: 0;
    //     right: 0;
    //     bottom: 0;
    //     left: 0;
    //     position: absolute;
    //     z-index: -1;
    //     margin: -1px;
    //   }
    // }
  }

  &.danger {
    border-color: #e5484d;
    background: #e5484d;
    color: #fff;

    &.outline {
      background: transparent;
      color: #e5484d;
      border-color: #e5484d;
    }
  }

  &.success {
    background: #00ec97;
    color: #11181c;
    border-color: #00ec97;

    &.outline {
      background: transparent;
      color: #00ec97;
      border-color: #00ec97;
    }
  }

  &.info {
    background: #4498e0;
    color: #fff;
    border-color: #4498e0;

    &.outline {
      background: transparent;
      color: #4498e0;
      border-color: #4498e0;
    }
  }

  &.disabled,
  &:disabled {
    background: #f0f0f0;
    color: #aaa;
    border-color: #f0f0f0;

    &.outline {
      background: transparent;
      color: #aaa;
      border-color: #aaa;
    }
  }
`;

return (
  <Wrapper
    onClick={onClick}
    className={`${variant} ${className}`}
    href={href ?? buttonProps.href}
    disabled={disabled ?? buttonProps.disabled ?? false}
    size={size}
    {...buttonProps}
  >
    {children}
  </Wrapper>
);
