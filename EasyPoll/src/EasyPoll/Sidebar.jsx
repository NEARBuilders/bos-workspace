const tabs = props.tabs ?? {};

const Wrapper = styled.div`
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  li {
    background: #fff;
    cursor: pointer;
    border-radius: 6px;
  }

  li:hover {
    background-color: #ebedee;
  }

  li:active {
    background-color: #d0d6d9;
  }

  li.active {
    background-color: #e9e8fd;
  }

  li.active a {
    color: #4f46e5 !important;
  }

  li a {
    padding: 8px 26px;
    color: #000 !important;
    text-decoration: none;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: 0;
    display: flex;
    gap: 12px;
    align-items: center;
  }
`;

return (
  <Wrapper className="py-3">
    <hr />
    <ul>
      <li className={tabs.OFFICIAL_POLLS.active && "active"}>
        <a href={tabs.OFFICIAL_POLLS.href}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 283.92 336.51"
            height={16}
            width={16}
            fill="currentColor"
          >
            <path d="M136.95 155.55 43.01 61.72c-.98-.98-2.66-.29-2.66 1.1v91.91c0 .86-.7 1.56-1.56 1.56H16.51c-.86 0-1.56-.7-1.56-1.56V1.56c0-1.39 1.68-2.08 2.66-1.1l137.28 137.13c.61.61.61 1.6 0 2.21l-15.74 15.76c-.61.61-1.6.61-2.21 0" />
            <path d="M187.26 194.3h-23.68c-1.02 0-1.85-.83-1.85-1.85v-21.7c0-1.02.83-1.85 1.85-1.85h24c40.1 0 72.77-33.25 70.87-73.31-1.75-37.02-32.43-66.6-69.88-66.6h-25.49s-.05.02-.05.05v52.61c0 1.02-.83 1.85-1.85 1.85h-21.7c-1.02 0-1.85-.83-1.85-1.85V5.44c0-1.02.83-1.85 1.85-1.85h49.08c52.01 0 94.42 41.85 95.34 93.64.95 53.53-43.11 97.07-96.65 97.07M135.45 336.51H84.92C38.75 336.51.43 299.64 0 253.48c-.42-46.57 37.33-84.58 83.8-84.58h51.65c1.11 0 2.01.9 2.01 2.01v21.38c0 1.11-.9 2.01-2.01 2.01H83.81c-32.49 0-58.87 26.66-58.4 59.26.46 32.07 27.26 57.55 59.33 57.55h50.71c1.11 0 2.01.9 2.01 2.01v21.38c0 1.11-.9 2.01-2.01 2.01M261.53 336.51h-97.54c-1.25 0-2.26-1.01-2.26-2.26v-20.89c0-1.25 1.01-2.26 2.26-2.26h97.54c1.25 0 2.26 1.01 2.26 2.26v20.89c0 1.25-1.01 2.26-2.26 2.26" />
          </svg>
          <span>{tabs.OFFICIAL_POLLS.text}</span>
        </a>
      </li>
      <li className={tabs.PUBLIC_POLLS.active && "active"}>
        <a href={tabs.PUBLIC_POLLS.href}>
          <i class="bi bi-globe2"></i>
          <span>{tabs.PUBLIC_POLLS.text}</span>
        </a>
      </li>
    </ul>
    <hr />
    <ul>
      <li className={tabs.MY_POLLS.active && "active"}>
        <a href={tabs.MY_POLLS.href}>
          <i class="bi bi-person-fill"></i>
          <span>{tabs.MY_POLLS.text}</span>
        </a>
      </li>
    </ul>
  </Wrapper>
);
