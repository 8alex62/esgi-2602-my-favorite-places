import axios from "axios"
import { describe, expect, jest, test, beforeEach } from "@jest/globals"
import { getCoordinatesFromSearch } from "../src/utils/getCoordinatesFromSearch"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("getCoordinatesFromSearch", () => {
    beforeEach(() => {
        jest.resetAllMocks()
    })

    test("returns coordinates when a valid feature exists", async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                features: [
                    {
                        geometry: { coordinates: [2.3522, 48.8566] },
                    },
                ],
            },
        })

        const result = await getCoordinatesFromSearch("Paris")

        expect(result).toEqual({ lng: 2.3522, lat: 48.8566 })
    })

    test("returns null when the response contains no valid coordinates", async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                features: [
                    { geometry: { coordinates: [2.3522] } },
                    { geometry: { coordinates: [] } },
                ],
            },
        })

        const result = await getCoordinatesFromSearch("Invalid place")

        expect(result).toBeNull()
    })

    test("returns null when axios throws an error", async () => {
        mockedAxios.get.mockRejectedValue(new Error("Network error"))

        const result = await getCoordinatesFromSearch("Paris")

        expect(result).toBeNull()
    })

    test("encodes the search term in the request URL", async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                features: [
                    {
                        geometry: { coordinates: [12.34, 56.78] },
                    },
                ],
            },
        })

        const searchWord = "Saint-Pierre & Miquelon"
        await getCoordinatesFromSearch(searchWord)

        expect(mockedAxios.get).toHaveBeenCalledWith(
            `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(searchWord)}`,
        )
    })
})
