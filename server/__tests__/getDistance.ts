import { getDistance } from "../src/utils/getDistance"
import { describe, expect, test } from "@jest/globals"

describe("getDistance", () => {
    test("calculates the distance between two different points", () => {
        expect(getDistance({ lng: 50, lat: 50 }, { lng: -10, lat: -10 })).toBeCloseTo(8831.87)
    })

    test("returns 0 when points are identical", () => {
        expect(getDistance({ lng: 2.3522, lat: 48.8566 }, { lng: 2.3522, lat: 48.8566 })).toBeCloseTo(0)
    })

    test("produces a symmetric result regardless of argument order", () => {
        const first = { lng: 2.3522, lat: 48.8566 }
        const second = { lng: -0.1276, lat: 51.5074 }

        expect(getDistance(first, second)).toBeCloseTo(getDistance(second, first))
    })

    test("approximates the known distance between Paris and London", () => {
        const paris = { lng: 2.3522, lat: 48.8566 }
        const london = { lng: -0.1276, lat: 51.5074 }

        expect(getDistance(paris, london)).toBeCloseTo(343.55, 2)
    })
})