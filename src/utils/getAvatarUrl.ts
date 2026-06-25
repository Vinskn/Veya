export const getAvatarUrl = (username: string) => {
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`;
};