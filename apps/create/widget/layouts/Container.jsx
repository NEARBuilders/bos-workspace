const { Left, Right } = props;

// We define the styles that get passed down to all childs
// I'm sure we can override styles in children too?
const Root = styled.div`
  min-height: max(300px, 80vh);
  width: 100%;
  border-radius: 16px;
  background-color: #f9fbfe;
  color: #000;
  display: flex;
  gap: 4px;
  border: 1px solid var(--c__border-color);

  --c__border-color: rgb(209, 213, 219);

  .c__left {
    min-height: inherit;
    border-radius: inherit;
    width: min(300px, 100%);
  }

  .c__right {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 1rem 1rem 1rem 0rem;
    background-color: #fff;
    padding: 1rem;
  }
`;

// It's structural and styled
// The components passed are either more of the same as this,
// or purely functional

// I feel like since Left and Right are defined in the parent/provider,
// we no longer have to pass functions so deep?
return (
  <Root>
    <div className="c__left">
      <Left />
    </div>
    <div className="c__right">
      <Right />
    </div>
  </Root>
);
