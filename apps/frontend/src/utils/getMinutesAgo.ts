export const getMinutesAgo = (receivedAt: Date) => {
  const minutesAgo = Math.floor(
    (Date.now() - new Date(receivedAt).getTime()) / 1000 / 60
  );
  return minutesAgo >= 0 ? minutesAgo : 0;
};
