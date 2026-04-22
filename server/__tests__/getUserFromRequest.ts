import { Request } from "express"
import jwt from "jsonwebtoken"
import { getUserFromRequest } from "../src/utils/getUserFromRequest"
import { User } from "../src/entities/User"
import { describe, expect, jest, test, beforeEach } from "@jest/globals"

jest.mock("jsonwebtoken")

jest.mock("../src/entities/User", () => ({
  User: {
    findOneBy: async () => null,
  },
}))

const mockedJwt = jwt as jest.Mocked<typeof jwt>
const mockedUser = User as unknown as { findOneBy: jest.Mock }

describe("getUserFromRequest", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockedUser.findOneBy = jest.fn()
  })

  test("returns a user when authorization header contains a valid token", async () => {
    const expectedUser = { id: 1, email: "test@example.com", hashedPassword: "hash" }
    mockedJwt.verify.mockReturnValue({ userId: 1 })
    mockedUser.findOneBy.mockResolvedValue(expectedUser)

    const req = {
      headers: { authorization: "Bearer valid.token.here" },
    } as Request

    const user = await getUserFromRequest(req)

    expect(user).toEqual(expectedUser)
    expect(mockedJwt.verify).toHaveBeenCalledWith("valid.token.here", expect.any(String))
    expect(mockedUser.findOneBy).toHaveBeenCalledWith({ id: 1 })
  })

  test("returns a user when token is provided in cookies", async () => {
    const expectedUser = { id: 2, email: "cookie@example.com", hashedPassword: "hash" }
    mockedJwt.verify.mockReturnValue({ userId: 2 })
    mockedUser.findOneBy.mockResolvedValue(expectedUser)

    const req = {
      headers: {},
      cookies: { token: "cookie.token.value" },
    } as Request

    const user = await getUserFromRequest(req)

    expect(user).toEqual(expectedUser)
    expect(mockedJwt.verify).toHaveBeenCalledWith("cookie.token.value", expect.any(String))
    expect(mockedUser.findOneBy).toHaveBeenCalledWith({ id: 2 })
  })

  test("returns null when the token is invalid", async () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new Error("invalid token")
    })

    const req = {
      headers: { authorization: "Bearer invalid.token" },
    } as Request

    const user = await getUserFromRequest(req)

    expect(user).toBeNull()
    expect(mockedUser.findOneBy).not.toHaveBeenCalled()
  })

  test("returns null when no token is present", async () => {
    const req = {
      headers: {},
    } as Request

    const user = await getUserFromRequest(req)

    expect(user).toBeNull()
    expect(mockedJwt.verify).not.toHaveBeenCalled()
    expect(mockedUser.findOneBy).not.toHaveBeenCalled()
  })

  test("returns null when the user cannot be found", async () => {
    mockedJwt.verify.mockReturnValue({ userId: 3 })
    mockedUser.findOneBy.mockResolvedValue(null)

    const req = {
      headers: { authorization: "Bearer unknown.user.token" },
    } as Request

    const user = await getUserFromRequest(req)

    expect(user).toBeNull()
    expect(mockedUser.findOneBy).toHaveBeenCalledWith({ id: 3 })
  })
})
