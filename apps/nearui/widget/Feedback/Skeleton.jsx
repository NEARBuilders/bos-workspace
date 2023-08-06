let { layout } = props;

const SkeletonBlock = styled.div`
  background-color: #dfe9f360;
  background: linear-gradient(170deg, #dfe9f380 0, #dfe9f350 200px);
  border-radius: 4px;
  animation: skeleton 1.5s ease-in-out infinite;

  @keyframes skeleton {
    50% {
      opacity: 0.3;
    }
  }

  &.avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    aspect-ratio: 1;

    &.sm {
      width: 20px;
      height: 20px;
    }

    &.lg {
      width: 50px;
      height: 50px;
    }
  }
  &.text {
    width: 100%;
    height: 20px;

    &.sm {
      width: 100%;
      height: 14px;
    }

    &.md {
      width: 100%;
      height: 24px;
    }

    &.lg {
      width: 100%;
      height: 30px;
    }
  }
  &.box {
    width: 100%;
    height: 100px;
    border-radius: 8px;

    &.sm {
      width: 100%;
      height: 50px;
    }

    &.md {
      width: 100%;
      height: 80px;
    }

    &.lg {
      width: 100%;
      height: 120px;
    }
  }
`;

const SkeletonRowStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
`;

const SkeletonLayoutStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonElement = (props) => {
  let { type, variants, rows, count, style } = props;
  let elements = [];

  for (let i = 0; i < (count || rows || 1); i++) {
    elements.push(
      <SkeletonBlock
        key={i}
        className={`${type} ${(variants || []).join(" ")}`}
        style={style}
      ></SkeletonBlock>,
    );
  }

  return elements;
};

const SkeletonRow = (props) => {
  let { content, variants, style } = props;

  return (
    <SkeletonRowStyle className={(variants || []).join(" ")} style={style}>
      {content.map((element, index) => SkeletonElement(element))}
    </SkeletonRowStyle>
  );
};

return (
  <SkeletonLayoutStyle>
    {layout.map((element, index) => {
      if (element.type === "row") {
        return SkeletonRow(element);
      }
      return SkeletonElement(element);
    })}
  </SkeletonLayoutStyle>
);
