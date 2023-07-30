const children = props.children ?? "Button";
const onClick = props.onClick ?? (() => {});
const href = props.href;
const variant = props.variant ?? "primary"; // primary, success, danger

const tag = href ? "a" : "button";

const Wrapper = styled[tag]`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 14px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  padding: 12px 32px;
  border: 1px solid #d7dbdf;

  color: ${(p) => {
    switch (p.variant) {
      case "primary":
        return "#11181c";
      case "success":
        return "#000";
      case "danger":
        return "#fff";
    }
  }} !important;
  background: ${(p) => {
    switch (p.variant) {
      case "primary":
        return "#FBFCFD";
      case "success":
        return "#59e692";
      case "danger":
        return "#e5484d";
    }
  }};

  &:hover,
  &:focus {
    text-decoration: none;
    outline: none;
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

return (
  <Wrapper onClick={() => onClick} href={href} variant={variant} {...props}>
    {children}
  </Wrapper>
);
