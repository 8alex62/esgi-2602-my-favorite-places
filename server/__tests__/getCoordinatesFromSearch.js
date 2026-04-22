"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const globals_1 = require("@jest/globals");
const getCoordinatesFromSearch_1 = require("../src/utils/getCoordinatesFromSearch");
globals_1.jest.mock("axios");
const mockedAxios = axios_1.default;
(0, globals_1.describe)("getCoordinatesFromSearch", () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.resetAllMocks();
    });
    (0, globals_1.test)("returns coordinates when a valid feature exists", async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                features: [
                    {
                        geometry: { coordinates: [2.3522, 48.8566] },
                    },
                ],
            },
        });
        const result = await (0, getCoordinatesFromSearch_1.getCoordinatesFromSearch)("Paris");
        (0, globals_1.expect)(result).toEqual({ lng: 2.3522, lat: 48.8566 });
    });
    (0, globals_1.test)("returns null when the response contains no valid coordinates", async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                features: [
                    { geometry: { coordinates: [2.3522] } },
                    { geometry: { coordinates: [] } },
                ],
            },
        });
        const result = await (0, getCoordinatesFromSearch_1.getCoordinatesFromSearch)("Invalid place");
        (0, globals_1.expect)(result).toBeNull();
    });
    (0, globals_1.test)("returns null when axios throws an error", async () => {
        mockedAxios.get.mockRejectedValue(new Error("Network error"));
        const result = await (0, getCoordinatesFromSearch_1.getCoordinatesFromSearch)("Paris");
        (0, globals_1.expect)(result).toBeNull();
    });
    (0, globals_1.test)("encodes the search term in the request URL", async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                features: [
                    {
                        geometry: { coordinates: [12.34, 56.78] },
                    },
                ],
            },
        });
        const searchWord = "Saint-Pierre & Miquelon";
        await (0, getCoordinatesFromSearch_1.getCoordinatesFromSearch)(searchWord);
        (0, globals_1.expect)(mockedAxios.get).toHaveBeenCalledWith(`https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(searchWord)}`);
    });
});
//# sourceMappingURL=getCoordinatesFromSearch.js.map