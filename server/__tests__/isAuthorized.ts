import { Request, Response, NextFunction } from "express"
import { isAuthorized } from "../src/utils/isAuthorized"
import { getUserFromRequest } from "../src/utils/getUserFromRequest"
import { describe, expect, jest, test, beforeEach } from "@jest/globals"

jest.mock("../src/utils/getUserFromRequest")

// Mock the User entity to prevent babel decorator errors during parsing
jest.mock("../src/entities/User", () => ({
  User: class {}
}))

describe("isAuthorized", () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: jest.Mock

  beforeEach(() => {
    jest.resetAllMocks()
    mockReq = {}
    mockRes = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    }
    mockNext = jest.fn()
  })

  test("calls next() when a user is found", async () => {
    ;(getUserFromRequest as jest.Mock).mockResolvedValue({
      id: 1,
      email: "test@example.com",
    })

    await isAuthorized(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction,
    )

    expect(getUserFromRequest).toHaveBeenCalledWith(mockReq)
    expect(mockNext).toHaveBeenCalled()
    expect(mockRes.status).not.toHaveBeenCalled()
    expect(mockRes.json).not.toHaveBeenCalled()
  })

  test("returns 403 with access denied message when no user is found", async () => {
    ;(getUserFromRequest as jest.Mock).mockResolvedValue(null)

    await isAuthorized(
      mockReq as Request,
      mockRes as Response,
      mockNext as NextFunction,
    )

    expect(getUserFromRequest).toHaveBeenCalledWith(mockReq)
    expect(mockNext).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(403)
    expect(mockRes.json).toHaveBeenCalledWith({ message: "access denied" })
  })
})
