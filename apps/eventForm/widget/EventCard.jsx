const data = props.data;

const container = styled.div`
  width: 24rem;
`;

const EventCard = () => {
  const title = data.title || "No-title event";
  const description = data.description;
  const logo = data.logo;
  const backgroundImage = data.background;
  const tags = Object.keys(data.tags ?? {});
  const organizer = data.organizer;
  const eventLink = data.link;
  const profileLink = `https://near.org/near/widget/ProfilePage?accountId=${organizer}`;
  const category = data.category;
  const hashtags = data.hashTags;
  const startDate = data.start;
  const startTime = data.startTime;
  const endDate = data.end;
  const endTime = data.endTime;
  const location = data.location;

  return (
    <div class="card mb-3">
      <div class="card-body">
        <div className="d-flex gap-3">
          <div className="">
            <Widget
              src="mob.near/widget/Image"
              props={{
                image: logo,
                alt: "event logo",
                className: "rounded-circle",
                style: {
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  objectFit: "cover",
                },
                fallbackUrl:
                  "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm",
              }}
            />
          </div>
          <div className="">
            <h5 class="card-title">{title}</h5>
            <Widget
              src="efiz.near/widget/every.markdown.view"
              props={{ data: description }}
            />
            <a href={eventLink} class="card-link">
              Go to event
            </a>
            <a href="#" class="card-link">
              Event Feed
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

return (
  <container>
    <EventCard />
  </container>
);
