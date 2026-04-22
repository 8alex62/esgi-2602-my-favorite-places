"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getDistance_1 = require("../src/utils/getDistance");
const globals_1 = require("@jest/globals");
(0, globals_1.describe)("getDistance", () => {
    (0, globals_1.test)("calculates the distance between two different points", () => {
        (0, globals_1.expect)((0, getDistance_1.getDistance)({ lng: 50, lat: 50 }, { lng: -10, lat: -10 })).toBeCloseTo(8831.87);
    });
    (0, globals_1.test)("returns 0 when points are identical", () => {
        (0, globals_1.expect)((0, getDistance_1.getDistance)({ lng: 2.3522, lat: 48.8566 }, { lng: 2.3522, lat: 48.8566 })).toBeCloseTo(0);
    });
    (0, globals_1.test)("produces a symmetric result regardless of argument order", () => {
        const first = { lng: 2.3522, lat: 48.8566 };
        const second = { lng: -0.1276, lat: 51.5074 };
        (0, globals_1.expect)((0, getDistance_1.getDistance)(first, second)).toBeCloseTo((0, getDistance_1.getDistance)(second, first));
    });
    (0, globals_1.test)("approximates the known distance between Paris and London", () => {
        const paris = { lng: 2.3522, lat: 48.8566 };
        const london = { lng: -0.1276, lat: 51.5074 };
        (0, globals_1.expect)((0, getDistance_1.getDistance)(paris, london)).toBeCloseTo(343.55, 2);
    });
});
//# sourceMappingURL=getDistance.js.map