export const GetUserInfo = (token: string): { role: string } | null => {
  try {
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  } catch (error) {
    console.error("Invalid JWT Token", error);
    return null;
  }
};
