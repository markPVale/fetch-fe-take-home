import fetchDogsApi from "./index";

/***
 * Login the user with the given name and email.
 * @param name - The name of the user.
 * @param email - The email of the user.
 * @returns A Promise that resolves when the login is successful.
 *
 */
export const loginUser = async (name: string, email: string): Promise<void> => {
  try {
    const response = await fetchDogsApi.post("/auth/login", { name, email });
    console.log("Login successful", response.status);
  } catch (error: any) {
    console.error("Login error", error);
  }
};

/***
 * Logout the user, invalidate the current session.
 * @returns A Promise that resolves when the logout is successful.
 *
 */
export const logoutUser = async (): Promise<void> => {
  try {
    const response = await fetchDogsApi.post("/auth/logout");
    console.log("Logout successful", response.status);
  } catch (error: any) {
    // fallback to error.message if response.data is undefined (e.g. network error)
    console.error("Logout error", error.response?.data || error.message);
  }
};
