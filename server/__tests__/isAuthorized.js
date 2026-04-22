"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuthorized_1 = require("../src/utils/isAuthorized");
const getUserFromRequest_1 = require("../src/utils/getUserFromRequest");
const globals_1 = require("@jest/globals");
globals_1.jest.mock("../src/utils/getUserFromRequest");
// Mock the User entity to prevent babel decorator errors during parsing
globals_1.jest.mock("../src/entities/User", () => ({
    User: class {
    }
}));
(0, globals_1.describe)("isAuthorized", () => {
    let mockReq;
    let mockRes;
    let mockNext;
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.resetAllMocks();
        mockReq = {};
        mockRes = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        mockNext = globals_1.jest.fn();
    });
    (0, globals_1.test)("calls next() when a user is found", async () => {
        ;
        getUserFromRequest_1.getUserFromRequest.mockResolvedValue({
            id: 1,
            email: "test@example.com",
        });
        await (0, isAuthorized_1.isAuthorized)(mockReq, mockRes, mockNext);
        (0, globals_1.expect)(getUserFromRequest_1.getUserFromRequest).toHaveBeenCalledWith(mockReq);
        (0, globals_1.expect)(mockNext).toHaveBeenCalled();
        (0, globals_1.expect)(mockRes.status).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockRes.json).not.toHaveBeenCalled();
    });
    (0, globals_1.test)("returns 403 with access denied message when no user is found", async () => {
        ;
        getUserFromRequest_1.getUserFromRequest.mockResolvedValue(null);
        await (0, isAuthorized_1.isAuthorized)(mockReq, mockRes, mockNext);
        (0, globals_1.expect)(getUserFromRequest_1.getUserFromRequest).toHaveBeenCalledWith(mockReq);
        (0, globals_1.expect)(mockNext).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockRes.status).toHaveBeenCalledWith(403);
        (0, globals_1.expect)(mockRes.json).toHaveBeenCalledWith({ message: "access denied" });
    });
});
//# sourceMappingURL=isAuthorized.js.map