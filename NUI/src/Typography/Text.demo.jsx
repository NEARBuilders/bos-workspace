const NDCUI_ACCOUNT = props.NDCUI_ACCOUNT ?? "nui.sking.near";

const propsTable = `
| Prop Name  | Type/Values  | Default Value  | Description |
|------------|--------------|----------------|-------------|
| ${"`tag`"}      | string       | ${'`"span"`'}       | Determines the HTML tag for the text component. Any valid HTML tag can be used (e.g., ${'`"span"`'}, ${'`"p"`'}, ${'`"h1"`'}, ${'`"h2"`'} etc.). |
| ${"`fontSize`"} | number/string | ${"`1`"}            | Controls the size of the text. Possible values range from ${"`0`"} to ${"`6`"}, or any valid CSS font-size. |
| ${"`fontWeight`"} | string    | ${'`"normal"`'}     | Controls the weight of the text. Possible values include ${'`"thin"`'}, ${'`"normal"`'}, ${'`"bold"`'}, or any valid CSS font-weight. |
| ${"`color`"}    | string       | ${'`"default"`'}    | Defines the color of the text. Possible values include ${'`"default"`'}, ${'`"primary"`'}, ${'`"green"`'}, ${'`"red"`'}, ${'`"yellow"`'}, ${'`"muted"`'}, or any valid CSS color. |
| ${"`className`"}| string       | ${'`""`'}           | Add custom CSS classes for additional styling. |
| ${"`children`"} | string/ReactNode    | ${'`"Hello World"`'}| The content to be displayed within the Text component. |
| ${"`otherProps`"} | object     | ${"`{}`"}           | Any other props will be passed directly to the underlying HTML element. |
`;
const widgetCode = `
\`\`\`jsx
<Widget
  src={\`${NDCUI_ACCOUNT}/widget/Typography.Text\`}
  props={{
    children: "Your Text Here",
    tag: "h1",
    size: "5",
    weight: "bold",
    color: "primary",
    className: "mt-4 mb-2",
    otherProps: { 
        id: "my-text",
    },
  }}
/>
\`\`\`
`;

return (
  <div className="d-flex flex-column gap-1 pb-4">
    <Widget
      src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
      props={{
        children: "Preview",
        tag: "h2",
        size: "4",
        weight: "bold",
        color: "default",
        className: "mt-4 mb-2",
      }}
    />
    <div
      className="d-flex flex-column gap-1"
      style={{
        background: "#fefefe",
        border: "1px solid #ccc",
        padding: "24px",
        borderRadius: "12px",
      }}
    >
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Size 6",
          size: "6",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Size 5",
          size: "5",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Size 4",
          size: "4",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Size 3",
          size: "3",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Size 2",
          size: "2",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Size 1",
          size: "1",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Size 0",
          size: "0",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Weight Thin",
          weight: "thin",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Weight Normal",
          weight: "normal",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Weight Bold",
          weight: "bold",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Color Default",
          color: "default",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Color Primary",
          color: "primary",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Color Green",
          color: "green",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Color Red",
          color: "red",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Color Yellow",
          color: "yellow",
        }}
      />
      <Widget
        src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
        props={{
          children: "Color Muted",
          color: "muted",
        }}
      />
    </div>
    <Widget
      src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
      props={{
        children: "Usage",
        tag: "h2",
        size: "4",
        weight: "bold",
        color: "default",
        className: "mt-4 mb-2",
      }}
    />
    <Markdown text={widgetCode} />
    <Widget
      src={`${NDCUI_ACCOUNT}/widget/Typography.Text`}
      props={{
        children: "Properties",
        tag: "h2",
        size: "4",
        weight: "bold",
        color: "default",
        className: "mt-4 mb-2",
      }}
    />
    <Markdown text={propsTable} />
  </div>
);
