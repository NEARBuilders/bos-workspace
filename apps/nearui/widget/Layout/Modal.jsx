const toggle = props.toggle ?? <button>Open Modal</button>;
const content = props.content ?? (
  <div className="p-5 bg-white">Modal Content</div>
);
const open = props.open;
const onOpenChange = props.onOpenChange;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
`;

const Content = styled.div`
  min-width: 500px;
  max-width: 1000px;
  margin-top: 20px;
  margin-bottom: 20px;

  &.focus-visible {
    outline: none !important;
  }
`;

const NoButton = styled.button`
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
`;

return (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Trigger asChild>
      <NoButton>{toggle}</NoButton>
    </Dialog.Trigger>
    <Dialog.Overlay asChild>
      <Overlay>
        <Dialog.Content asChild>
          <Content>{content}</Content>
        </Dialog.Content>
      </Overlay>
    </Dialog.Overlay>
  </Dialog.Root>
);
