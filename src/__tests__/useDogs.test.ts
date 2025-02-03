import { renderHook, waitFor } from "@testing-library/react";
import { useDogs } from "../hooks/useDogs";
import { fetchBreeds, fetchDogs, fetchDogDetails } from "../api/dogs";
import { fetchLocations } from "../api/locations";

jest.mock("../api/dogs");
jest.mock("../api/locations");

describe("useDogs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should load breeds on mount", async () => {
    const breeds = ["Labrador", "Poodle"];
    (fetchBreeds as jest.Mock).mockResolvedValue(breeds);

    // Mock other API calls to prevent errors
    (fetchDogs as jest.Mock).mockResolvedValue({ resultIds: [], next: null });
    (fetchDogDetails as jest.Mock).mockResolvedValue([]);
    (fetchLocations as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useDogs());

    await waitFor(() => expect(result.current.breeds).toEqual(breeds));

    expect(result.current.error).toBeNull();
  });
});
