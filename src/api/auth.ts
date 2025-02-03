import fetchDogsApi from "./index";

/**
 * Checks if the user is authenticated by making a request to an endpoint that requires authentication.
 * If the request is successful (status code 200), the user is considered authenticated.
 * In case of an error, such as an expired or missing auth token, the user is considered not authenticated.
 *
 * @returns {Promise<boolean>} Returns `true` if the user is authenticated, otherwise `false`.
 *
 * @throws {Error} If the request fails for any reason, the function will catch the error and return `false`.
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    // Attempt to make a request that requires authentication
    const response = await fetchDogsApi.get("/dogs/breeds"); // Fetch any resource that requires auth
    return response.status === 200; // If successful, the user is authenticated
  } catch (error: unknown) {
    console.warn(
      "Authentication check failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return false; // If an error occurs, the user is not authenticated
  }
};

/***
 * Login the user with the given name and email.
 * @param name - The name of the user.
 * @param email - The email of the user.
 * @returns A Promise that resolves when the login is successful.
 *
 */
export const loginUser = async (name: string, email: string): Promise<void> => {
  try {
    await fetchDogsApi.post("/auth/login", { name, email });
  } catch (error: unknown) {
    console.warn(
      "Login failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
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
  } catch (error: unknown) {
    // fallback to error.message if response.data is undefined (e.g. network error)
    console.warn(
      "Logout failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
