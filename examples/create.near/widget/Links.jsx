const IconButtonLink = styled.a`
  display: block;
  padding: 0;
  height: 32px;
  border-radius: 6px;
  font-size: 16px;
  line-height: 32px;
  text-align: center;
  cursor: pointer;
  border: none;
  background: #f1f3f5;
  color: #006adc !important;

  &:hover,
  &:focus {
    background: #ecedee;
    text-decoration: none;
    outline: none;
  }
`;

const IconButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
`;

return (
  <>
    <IconButtons>
      <IconButtonLink href="/#/adminalpha.near/widget/ProfilePage?accountId=borderlesscommunity.near">
        <i className="bi bi-person-circle"></i>
      </IconButtonLink>
      <IconButtonLink href="https://t.me/nearnoborders">
        <i className="bi bi-telegram"></i>
      </IconButtonLink>
      <IconButtonLink href="https://near.social/#/devgovgigs.near/widget/gigs-board.pages.Feed?label=abc">
        <i className="bi bi-clipboard-check-fill"></i>
      </IconButtonLink>
      <IconButtonLink href="https://twitter.com/nearnoborders">
        <i className="bi bi-twitter"></i>
      </IconButtonLink>
      <IconButtonLink href="http://nearbuilders.com/nft-calendar">
        <i className="bi bi-calendar3"></i>
      </IconButtonLink>
    </IconButtons>
  </>
);
