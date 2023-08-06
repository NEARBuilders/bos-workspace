const tag = props.tag ?? "span";
const fontSize = props.size ?? 1; // 0 | 1 | 2 | 3 | 4 | 5 | 6 | [css font-size]
const fontWeight = props.weight ?? "normal"; // thin | normal | bold | [css font-weight]
const color = props.color ?? "default"; // default | primary | green | red | yellow | muted | [css color]
const className = props.className ?? "";
const children = props.children ?? "Hello World";
const otherProps = props.otherProps ?? {};

const fontSizeMapped =
  {
    0: "13px",
    1: "14px",
    2: "16px",
    3: "18px",
    4: "22px",
    5: "26px",
    6: "32px",
  }[fontSize] ?? fontSize;
const colorMapped =
  {
    default: "#141414",
    primary: "#4498E0",
    green: "#5BC65F",
    red: "#DD5E56",
    yellow: "#FFD50D",
    muted: "#999",
  }[color] ?? color;
const letterSpacingMapped =
  {
    0: "0",
    1: "0",
    2: "0",
    3: "0",
    4: "-1px",
    5: "-1px",
    6: "-1px",
  }[fontSize] ?? "0";
const fontWeightMapped =
  {
    thin: "300",
    normal: "500",
    bold: "700",
  }[fontWeight] ?? fontWeight;

const Text = styled[tag]`
  margin: 0;
  padding: 0;
  line-height: 1.43;
  font-size: ${fontSizeMapped};
  font-weight: ${fontWeightMapped};
  color: ${colorMapped};
  letter-spacing: ${letterSpacingMapped};
`;

return (
  <Text className={`${className}`} {...otherProps}>
    {children}
  </Text>
);
