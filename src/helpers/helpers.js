const pad = value => {
  return String(value).padStart(2, '0');
};

const getTime = time => {
  const hours = pad(Math.floor(time / (60 * 60 * 24) / (60 * 60)));
  const minutes = pad(Math.floor((time % (60 * 60)) / 60));
  const seconds = pad(Math.floor(time % 60));
  return { hours, minutes, seconds };
};

export default getTime;
