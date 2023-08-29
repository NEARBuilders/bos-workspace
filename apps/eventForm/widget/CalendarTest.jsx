const dummyData = {
  id: "something",
  title: "Test Event",
  description: {
    content: "Test",
  },
  start: "2023-08-29",
  startTime: "13:43",
  end: "2023-08-29",
  endTime: "14:45",
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
  isAllDay: false,
};

const dummyData2 = {
  id: "something",
  title: "Test Event 2",
  description: {
    content: "Test",
  },
  start: "2023-08-29",
  startTime: "15:43",
  end: "2023-08-29",
  endTime: "16:45",
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
  isAllDay: true,
};

const fetchedEvents = Social.get("every.near/type/event/*");

console.log(fetchedEvents);

const events = fetchedEvents || [dummyData, dummyData2];
const formattedEvents = events.map((event) => {
  return {
    title: event.title,
    start: `${event.start}T${event.startTime}`,
    end: `${event.end}T${event.endTime}`,
    url: event.link,
    allDay: event.isAllDay,
    editable: false,
  };
});

return (
  <Widget
    src="evrything.near/widget/Calendar"
    props={{ events: formattedEvents }}
  />
);
