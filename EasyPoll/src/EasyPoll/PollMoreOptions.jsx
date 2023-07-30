const poll = props.poll;
const accountId = props.accountId ?? context.accountId;
const href = props.href;
const editHref = props.editHref;
const deleteHref = props.deleteHref;
const canEdit = poll.accountId === accountId;

const Button = styled.button`
  border-radius: 9px;
  height: 30px;
  width: 30px;
  font-size: 18px;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  color: #000;
  background-color: #ebedee40;
  transition: all 200ms ease;

  :hover {
    background: #ebedee;
  }
`;

const Wrapper = styled.div`
  .content {
    min-width: 220px;
    background-color: white;
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35),
      0px 10px 20px -15px rgba(22, 23, 24, 0.2);
    animation-duration: 400ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, opacity;
    animation-name: slideUpAndFade;
  }

  .item {
    background: #fff;
    color: #4f46e5;
    padding: 6px 12px;
    font-size: 15px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    display: block;
    text-decoration: none;
  }

  .item.danger {
    background: #fff;
    color: #dd5e56;
  }

  .item:hover {
    background: #4f46e5;
    color: #fff;
    outline: none;
  }

  .item.danger:hover {
    background: #dd5e56;
  }

  .item:active {
    opacity: 0.6;
  }

  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

return (
  <Wrapper>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button aria-label="More options">
          <i class="bi bi-three-dots-vertical"></i>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content className="content" sideOffset={5}>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            className="item"
            onClick={() => {
              href && clipboard.writeText("https://near.org/" + href);
            }}
          >
            Copy link
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        {canEdit && (
          <>
            <DropdownMenu.Separator
              style={{
                height: 1,
                backgroundColor: "#4f46e550",
                margin: 5,
              }}
            />
            <DropdownMenu.Group>
              <DropdownMenu.Item asChild>
                <a className="item" href={editHref}>
                  Edit
                </a>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <a className="item danger" href={deleteHref}>
                  Delete Poll
                </a>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Wrapper>
);
