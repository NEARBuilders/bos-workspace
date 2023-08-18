const handler = props.handler ?? (() => {});
const id = props.id ?? "";
const renderTrigger = props.renderTrigger ?? (() => <></>);

const Wrapper = styled.div`
  padding: 6px;
  min-width: 200px;
  width: 200px;
  border-radius: 6px;
  box-shadow: 0 3px 15px -3px rgba(13, 20, 33, 0.13);
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e8eb;
  background-color: #fff;
  gap: 1px;

  .menu__item {
    padding: 3px;
    display: flex;
    color: #000;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
      background-color: #eff2f5;
    }
  }
  .menu__item__icon {
    font-size: 14px;
    border-radius: 5px;
    box-shadow: 0 0 0 1px rgba(201, 201, 204, 0.48);
    background: #fff;
    color: #000;
    height: 26px;
    width: 26px;
    display: flex;
    margin-right: 10px;
    justify-content: center;
    align-items: center;
  }
`;

return (
  <ContextMenu.Root>
    <ContextMenu.Trigger asChild>{renderTrigger()}</ContextMenu.Trigger>
    <ContextMenu.Content sideOffset={5} align="end" asChild>
      <Wrapper>
        <ContextMenu.Item
          className="menu__item"
          onSelect={() => handler("delete", id)}
        >
          <i className="menu__item__icon bi bi-x-lg" />
          Delete u
        </ContextMenu.Item>
        <ContextMenu.Item
          className="menu__item"
          onSelect={() => handler("rename", id)}
        >
          <i className="menu__item__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 28 28"
              fill="currentColor"
            >
              <path d="M11.75 2C11.3358 2 11 2.33579 11 2.75C11 3.16421 11.3358 3.5 11.75 3.5H13.25V24.5H11.75C11.3358 24.5 11 24.8358 11 25.25C11 25.6642 11.3358 26 11.75 26H16.25C16.6642 26 17 25.6642 17 25.25C17 24.8358 16.6642 24.5 16.25 24.5H14.75V3.5H16.25C16.6642 3.5 17 3.16421 17 2.75C17 2.33579 16.6642 2 16.25 2H11.75Z" />
              <path d="M6.25 6.01958H12.25V7.51958H6.25C5.2835 7.51958 4.5 8.30308 4.5 9.26958V18.7696C4.5 19.7361 5.2835 20.5196 6.25 20.5196H12.25V22.0196H6.25C4.45507 22.0196 3 20.5645 3 18.7696V9.26958C3 7.47465 4.45507 6.01958 6.25 6.01958Z" />
              <path d="M21.75 20.5196H15.75V22.0196H21.75C23.5449 22.0196 25 20.5645 25 18.7696V9.26958C25 7.47465 23.5449 6.01958 21.75 6.01958H15.75V7.51958H21.75C22.7165 7.51958 23.5 8.30308 23.5 9.26958V18.7696C23.5 19.7361 22.7165 20.5196 21.75 20.5196Z" />
            </svg>
          </i>
          Rename
        </ContextMenu.Item>
        <ContextMenu.Item
          className="menu__item"
          onSelect={() => handler("move", id)}
        >
          <i className="menu__item__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              height="1em"
            >
              <path
                d="M2 12V6.94975C2 6.06722 2 5.62595 2.06935 5.25839C2.37464 3.64031 3.64031 2.37464 5.25839 2.06935C5.62595 2 6.06722 2 6.94975 2C7.33642 2 7.52976 2 7.71557 2.01738C8.51665 2.09229 9.27652 2.40704 9.89594 2.92051C10.0396 3.03961 10.1763 3.17633 10.4497 3.44975L11 4C11.8158 4.81578 12.2237 5.22367 12.7121 5.49543C12.9804 5.64471 13.2651 5.7626 13.5604 5.84678C14.0979 6 14.6747 6 15.8284 6H16.2021C18.8345 6 20.1506 6 21.0062 6.76946C21.0849 6.84024 21.1598 6.91514 21.2305 6.99383C22 7.84935 22 9.16554 22 11.7979V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2.51839 20.1752 2.22937 19.3001 2.10149 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M2 15C8.44365 15 6.55635 15 13 15M13 15L8.875 12M13 15L8.875 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </i>
          Move
        </ContextMenu.Item>
      </Wrapper>
    </ContextMenu.Content>
  </ContextMenu.Root>
);
