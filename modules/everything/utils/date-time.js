const getCurrentDate = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const day = currentDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
  const currentDate = new Date();

  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

const isoTime = (date, time) => {
  const temp = new Date(`${date} ${time}`);
  const now = temp.toISOString();

  return now.split("T")[1];
};

const isoDate = (date, time) => {
  const temp = new Date(`${date} ${time}`);
  const now = temp.toISOString();

  return now.split("T")[0];
};
