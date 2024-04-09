const {
  Trigger,
  Content,
  isOpen,
  onClose,
  onOpen,
  ModalOverlay,
  ModalContainer,
} = props ?? {
  Trigger: () => <></>,
  Content: () => <></>,
  isOpen: false,
  onClose: () => {},
  onOpen: () => {},
  ModalOverlay: undefined,
  ModalContainer: undefined,
};

const DefaultModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DefaultModalContainer = styled.div`
  display: "flex";
  flex-direction: "column";
  width: 100%;
  max-width: 600px;
  padding: 24px;
  background: white;
  border: 1px black solid;
`;

ModalOverlay = ModalOverlay ?? DefaultModalOverlay;
ModalContainer = ModalContainer ?? DefaultModalContainer;

const [isModalOpen, setIsModalOpen] = useState(isOpen ?? false);

const openModal = () => {
  onOpen && onOpen();
  setIsModalOpen(true);
};

const closeModal = () => {
  onClose && onClose();
  setIsModalOpen(false);
};

const Modal = ({ isOpen, closeModal, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={closeModal}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContainer>
    </ModalOverlay>
  );
};

return (
  <>
    <Trigger openModal={openModal} />
    <Modal isOpen={isModalOpen} closeModal={closeModal}>
      <Content closeModal={closeModal} />
    </Modal>
  </>
);
