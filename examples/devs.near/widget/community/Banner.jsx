const Banner = styled.div`
   {
    height: 62px;
    background: #181818;
    padding: 16px 20px;

    img {
      height: 30px;
    }

    margin-bottom: 25px;
  }
`;

return (
  <>
    <Banner className="d-flex justify-content-between">
      <a href="Feed">
        <img src="https://ipfs.near.social/ipfs/bafkreibjsn3gswlcc5mvgkfv7ady2lzkd2htm55l472suarbd34qryh2uy"></img>
      </a>
      <div>
        <a
          href="https://www.neardevgov.org/blog/near-developer-dao"
          class="text-white me-2"
        >
          Developer DAO
        </a>

        <div class="btn-group" role="group">
          <button
            type="button"
            class="btn btn-outline-light rounded-circle"
            style={{
              width: "30px",
              height: "30px",
              padding: "6px 0px",
              borderWidth: "0.5px",
              lineHeight: "0px",
            }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-question-lg"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a
                target="_blank"
                class="dropdown-item"
                href="https://github.com/near/devgigsboard-widgets/issues/new?assignees=&labels=bug&template=bug_report.md&title="
              >
                Report a bug
              </a>
            </li>
            <li>
              <a
                target="_blank"
                class="dropdown-item"
                href="https://github.com/near/devgigsboard-widgets/issues/new?assignees=&labels=enhancement&template=feature-request.md&title="
              >
                Suggest an improvement
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Banner>
  </>
);
