/**
 * Modal can be moved to its own module
 */
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const ModalBox = styled.div`
  background-color: white;
  min-width: 400px;
  max-width: 600px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1003;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
`;

const CloseButton = styled.button`
  background: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  float: right;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  padding: 10px;
`;

function Modal({ onClose, children }) {
  return (
    <ModalBackdrop>
      <ModalBox>
        <ModalHeader>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </ModalHeader>
        <ModalContent>{children}</ModalContent>
      </ModalBox>
    </ModalBackdrop>
  );
}

const [isModalOpen, setModalOpen] = useState(props.isModalOpen);

const toggleModal = (pluginId) => {
  setModalOpen(!isModalOpen);
};

const Button = styled.button`
  // this could take in theme
  padding: 10px 20px;
`;

const { path, data, type } = props;

const parts = path.split("/");
const creatorId = parts[0];

return (
  <>
    <Widget
      src="nui.sking.near/widget/Layout.Modal"
      props={{
        open: state.filtersOpen,
        onOpenChange: (open) => {
          State.update({
            ...state,
            filtersOpen: open,
          });
        },
        toggle: (
          <Button className="classic" onClick={() => toggleModal()}>
            <>
              <i className={"bi bi-save"} />
              save
            </>
          </Button>
        ),
        content: (
          <div className="w-100">
            <ModalBox>
              <Widget
                src={"devs.near/widget/hyperfile.create"}
                props={{
                  // Prop hydration (?)
                  creatorId: creatorId, // requester?
                  type: type,
                  filename: "main",
                  path: path,
                  data: data, // vs dynamic
                  // loadSnapshot: loadSnapshot
                }}
              />
            </ModalBox>
          </div>
        ),
      }}
    />
  </>
);
