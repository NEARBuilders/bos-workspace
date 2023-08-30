const path = props.path;
const blockHeight = props.blockHeight;

const eventThing = Social.getr(path, blockHeight);

if (!eventThing) {
  return <div>Loading...</div>;
}

const {
  title,
  description,
  start,
  startTime,
  end,
  endTime,
  location,
  link,
  organizer,
  isAllDay,
  category,
  logo,
  background,
  hashTags,
} = eventThing.data;

const startDate = new Date(`${start} ${startTime}`);
const endDate = new Date(`${end} ${endTime}`);

const formatDate = () => {
  const eventStartDate = startDate.toLocaleString("en-is", {
    month: "short",
    day: "numeric",
  });
  const eventStartTime = `${startDate.getHours()}:${startDate.getMinutes()}`;

  const eventEndDate = endDate.toLocaleString("en-is", {
    month: "short",
    day: "numeric",
  });
  const eventEndTime = `${endDate.getHours()}:${endDate.getMinutes()}`;

  if (startDate.getDate() === endDate.getDate()) {
    return `${eventStartDate} @ ${eventStartTime} - ${eventEndTime}`;
  } else {
    return `${eventStartDate} @ ${eventStartTime} - ${eventEndDate} @ ${eventEndTime}`;
  }
};

const tags = JSON.parse(hashTags);

return (
  <>
    <div className="container">
      <div className="shadow mb-5 rounded">
        <div className="position-relative ">
          {/* Background Image */}
          <Widget
            src="mob.near/widget/Image"
            props={{
              image: background,
              alt: "event background",
              className: "img-fluid rounded-top mb-3 shadow",
              style: { width: "100%", height: "14rem", objectFit: "cover" },
              fallbackUrl:
                "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm",
            }}
          />

          <Widget
            src="mob.near/widget/Image"
            props={{
              image: logo,
              alt: "event logo",
              className: "rounded-circle position-absolute shadow",
              style: {
                width: "128px",
                height: "128px",
                objectFit: "cover",
                bottom: -25,
                left: 25,
              },
              fallbackUrl:
                "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm",
            }}
          />
        </div>
        <div className="mt-5 ms-3">
          <div className="d-flex flex-column">
            {/* Event Title */}
            <h3>{title}</h3>

            {/* Organizer */}
            <p>
              <i className="bi bi-person me-2"></i>
              {organizer}
            </p>

            {/* Event Description */}
            <div>
              <Widget
                src="efiz.near/widget/every.markdown.view"
                props={{ data: description }}
              />
            </div>

            {/* Time */}
            <p>
              <i className="bi bi-calendar-event me-2"></i>
              {formatDate()}
            </p>

            {/* Link */}
            {link && (
              <p>
                <i className="bi bi-box-arrow-up-right me-2"></i>
                <a href={link}>{link}</a>
              </p>
            )}

            {/* Location */}
            {location && (
              <p>
                <i className="bi bi-pin-map me-2"></i>
                {location}
              </p>
            )}

            {/* Hashtags */}
            {tags.length !== 0 && (
              <div className="d-flex">
                <i className="bi bi-hash me-2"></i>
                <p>
                  {tags.map((item) => (
                    <span className="badge bg-primary me-1">#{item}</span>
                  ))}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
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
            hashtagWhitelist: tags,
          },
        }}
      />
    </div>
  </>
);
