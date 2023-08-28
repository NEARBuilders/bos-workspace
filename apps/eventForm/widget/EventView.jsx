const dummyData = {
  id: "something",
  title: "Test Event",
  description: {
    content: "Test",
  },
  start: "2023-10-10",
  startTime: "13:43",
  end: "2023-10-10",
  endTime: "13:45",
  location: "Earth",
  link: "https://test.com",
  organizer: "itexpert120.near",
  hashTags: ["test"],
  background: {
    url: "https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg",
  },
  logo: {
    url: "https://static.wikia.nocookie.net/gameofthronesfanon/images/e/e8/Geralt2-e1520342690656_%282%29.jpg",
  },
};

const data = props.data || dummyData;

const title = data.title || "No-title event";
const description = data.description;
const logo = data.logo;
const backgroundImage = data.background;
const tags = Object.keys(data.tags ?? {});
const organizer = data.organizer;
const eventLink = data.link;
const link = `https://near.org/near/widget/ProfilePage?accountId=${organizer}`;
const category = data.category;
const hashtags = data.hashTags;
const startDate = data.start;
const startTime = data.startTime;
const endDate = data.end;
const endTime = data.endTime;
const location = data.location;

const bgComponent = () => {
  return (
    <Widget
      src="mob.near/widget/Image"
      props={{
        image: backgroundImage,
        alt: "event background",
        className: "w-full h-full object-cover shadow-md rounded-md",
        fallbackUrl:
          "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm",
      }}
    />
  );
};

const logoComponent = () => {
  return (
    <div className="relative w-28 h-28 md:w-36 md:h-36">
      <Widget
        src="mob.near/widget/Image"
        props={{
          image: logo,
          alt: "event logo",
          className:
            "w-full h-full object-cover rounded-full bottom-20 md:bottom-16 md:-right-8 absolute shadow-md",
          fallbackUrl:
            "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm",
        }}
      />
    </div>
  );
};

const hashTagsComponent = () => {
  return (
    hashtags.length !== 0 && (
      <p className="flex flex-wrap items-center">
        <i className="bi bi-hash mr-3"></i>
        {hashtags.map((tag) => (
          <span className="badge bg-primary mr-2">#{tag}</span>
        ))}
      </p>
    )
  );
};

const timeComponent = () => {
  return (
    <p>
      <i className="bi bi-calendar-event mr-2"></i>
      {new Date(startDate).toLocaleString("en-us", {
        month: "short",
        day: "numeric",
      })}{" "}
      @ {startTime} -{" "}
      {startDate === endDate
        ? endTime
        : `${new Date(endDate).toLocaleString("en-us", {
            month: "short",
            day: "numeric",
          })} @ ${endTime}`}
    </p>
  );
};

const Content = () => {
  return (
    <div>
      <div className="w-full shadow-md my-4 rounded-md">
        <div className="relative h-36 md:h-48">
          {/* BG */}
          <bgComponent />
          {/* Logo */}
          <logoComponent />
        </div>
        <div className="mx-4 mt-16 mb-4 md:mt-24 flex flex-col gap-y-2">
          {/* Title */}
          <h2 className="text-3xl font-bold">{title}</h2>
          {/* Organizer */}
          <p>
            <i className="bi bi-person mr-2"></i>
            {organizer}
          </p>
          {/* Description */}
          {description && (
            <div className="flex items-start">
              <i className="bi bi-info-circle mr-3"></i>
              <Widget
                src="efiz.near/widget/every.markdown.view"
                props={{ data: description }}
              />
            </div>
          )}
          {/* Time */}
          <timeComponent />
          {/* Link */}
          {eventLink && (
            <p>
              <i className="bi bi-link mr-2"></i>
              <a
                className="underline hover:text-blue-500 transition"
                href={eventLink}
              >
                {eventLink}
              </a>
            </p>
          )}
          {/* Location */}
          {location && (
            <p>
              <i className="bi bi-pin-map mr-2"></i>
              {location}
            </p>
          )}
          {/* Hashtags */}
          <hashTagsComponent />
        </div>
      </div>
    </div>
  );
};

return (
  <>
    <Widget
      src="igris.near/widget/TailwindWrapper"
      props={{ children: <Content /> }}
    />
    <Widget
      src="every.near/widget/every.feed.view"
      props={{
        data: {
          typeWhitelist: ["md"],
          sources: [
            {
              domain: "post",
              key: "main",
            },
          ],
          hashtagWhitelist: hashtags,
        },
      }}
    />
  </>
);
