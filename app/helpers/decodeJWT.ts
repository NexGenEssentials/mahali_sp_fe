export const decodeJWT = async (accessToken: string) => {
  try {
    const payload = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  } catch (error) {
    console.error("Invalid JWT Token", error);
  }
};
