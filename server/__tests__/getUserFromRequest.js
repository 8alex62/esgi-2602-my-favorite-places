"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getUserFromRequest_1 = require("../src/utils/getUserFromRequest");
const User_1 = require("../src/entities/User");
const globals_1 = require("@jest/globals");
globals_1.jest.mock("jsonwebtoken");
globals_1.jest.mock("../src/entities/User", () => ({
    User: {
        findOneBy: async () => null,
    },
}));
const mockedJwt = jsonwebtoken_1.default;
const mockedUser = User_1.User;
(0, globals_1.describe)("getUserFromRequest", () => {
    (0, globals_1.beforeEach)(() => {
        globals_1.jest.resetAllMocks();
        mockedUser.findOneBy = globals_1.jest.fn();
    });
    (0, globals_1.test)("returns a user when authorization header contains a valid token", async () => {
        const expectedUser = { id: 1, email: "test@example.com", hashedPassword: "hash" };
        mockedJwt.verify.mockReturnValue({ userId: 1 });
        mockedUser.findOneBy.mockResolvedValue(expectedUser);
        const req = {
            headers: { authorization: "Bearer valid.token.here" },
        };
        const user = await (0, getUserFromRequest_1.getUserFromRequest)(req);
        (0, globals_1.expect)(user).toEqual(expectedUser);
        (0, globals_1.expect)(mockedJwt.verify).toHaveBeenCalledWith("valid.token.here", globals_1.expect.any(String));
        (0, globals_1.expect)(mockedUser.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
    (0, globals_1.test)("returns a user when token is provided in cookies", async () => {
        const expectedUser = { id: 2, email: "cookie@example.com", hashedPassword: "hash" };
        mockedJwt.verify.mockReturnValue({ userId: 2 });
        mockedUser.findOneBy.mockResolvedValue(expectedUser);
        const req = {
            headers: {},
            cookies: { token: "cookie.token.value" },
        };
        const user = await (0, getUserFromRequest_1.getUserFromRequest)(req);
        (0, globals_1.expect)(user).toEqual(expectedUser);
        (0, globals_1.expect)(mockedJwt.verify).toHaveBeenCalledWith("cookie.token.value", globals_1.expect.any(String));
        (0, globals_1.expect)(mockedUser.findOneBy).toHaveBeenCalledWith({ id: 2 });
    });
    (0, globals_1.test)("returns null when the token is invalid", async () => {
        mockedJwt.verify.mockImplementation(() => {
            throw new Error("invalid token");
        });
        const req = {
            headers: { authorization: "Bearer invalid.token" },
        };
        const user = await (0, getUserFromRequest_1.getUserFromRequest)(req);
        (0, globals_1.expect)(user).toBeNull();
        (0, globals_1.expect)(mockedUser.findOneBy).not.toHaveBeenCalled();
    });
    (0, globals_1.test)("returns null when no token is present", async () => {
        const req = {
            headers: {},
        };
        const user = await (0, getUserFromRequest_1.getUserFromRequest)(req);
        (0, globals_1.expect)(user).toBeNull();
        (0, globals_1.expect)(mockedJwt.verify).not.toHaveBeenCalled();
        (0, globals_1.expect)(mockedUser.findOneBy).not.toHaveBeenCalled();
    });
    (0, globals_1.test)("returns null when the user cannot be found", async () => {
        mockedJwt.verify.mockReturnValue({ userId: 3 });
        mockedUser.findOneBy.mockResolvedValue(null);
        const req = {
            headers: { authorization: "Bearer unknown.user.token" },
        };
        const user = await (0, getUserFromRequest_1.getUserFromRequest)(req);
        (0, globals_1.expect)(user).toBeNull();
        (0, globals_1.expect)(mockedUser.findOneBy).toHaveBeenCalledWith({ id: 3 });
    });
});
//# sourceMappingURL=getUserFromRequest.js.map