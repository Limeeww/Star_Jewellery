import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../discounts";
import { adminDB } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { uuidToNumber } from "@/hooks/uuidToNumber";

jest.mock("@/lib/firebaseAdmin", () => {
  const mockGet = jest.fn();
  const mockDoc = jest.fn().mockReturnValue({
    set: jest.fn(),
  });
  const mockCollection = jest.fn().mockReturnValue({
    get: mockGet,
    doc: mockDoc,
  });
  return {
    adminDB: {
      collection: mockCollection,
    },
  };
});

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("@/hooks/uuidToNumber", () => ({
  uuidToNumber: jest.fn(),
}));

describe("Discounts API Handler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/discounts", () => {
    it("should return error when GET fails", async () => {
      const collectionRef = adminDB.collection("discounts");
      (collectionRef.get as jest.Mock).mockRejectedValue(
        new Error("Fetch error")
      );

      const { req, res } = createMocks({ method: "GET" });
      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse
      );

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Failed to fetch discounts",
      });
    });
  });

  describe("POST /api/discounts", () => {
    it("should create a discount and return its numeric ID", async () => {
      (uuidv4 as jest.Mock).mockReturnValue("test-uuid");
      (uuidToNumber as jest.Mock).mockReturnValue(1234);

      const now = Date.now();
      const validFromPlain = { seconds: Math.floor(now / 1000) };
      const validUntilPlain = {
        seconds: Math.floor((now + 3600 * 1000) / 1000),
      };

      const mockBody = {
        name: "Holiday Sale",
        value: 15,
        type: "percentage",
        targetType: "order",
        applicableTo: ["o1", "o2"],
        validFrom: validFromPlain,
        validUntil: validUntilPlain,
        priority: 2,
      };

      const setMock = jest.fn().mockResolvedValue({});
      const docRefMock = { set: setMock };
      const collectionRef = adminDB.collection("discounts");
      (collectionRef.doc as jest.Mock).mockReturnValue(docRefMock);

      const fakeTimestamp = admin.firestore.Timestamp.fromDate(new Date());
      jest
        .spyOn(admin.firestore.Timestamp, "fromMillis")
        .mockReturnValue(fakeTimestamp);
      jest
        .spyOn(admin.firestore.Timestamp, "fromDate")
        .mockReturnValue(fakeTimestamp);

      const { req, res } = createMocks({ method: "POST", body: mockBody });
      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse
      );

      expect(res._getStatusCode()).toBe(201);
      const response = JSON.parse(res._getData());
      expect(response).toEqual({ success: true, id: 1234 });

      expect(setMock).toHaveBeenCalledWith({
        ...mockBody,
        id: 1234,
        validFrom: fakeTimestamp,
        validUntil: fakeTimestamp,
      });
    });

    it("should return error when POST fails", async () => {
      (uuidv4 as jest.Mock).mockReturnValue("test-uuid");
      (uuidToNumber as jest.Mock).mockReturnValue(5678);

      const mockBody = {
        name: "Flash Sale",
        value: 5,
        type: "fixed",
        targetType: "product",
        applicableTo: ["p3"],
        validFrom: { seconds: 0 },
        validUntil: { seconds: 0 },
        priority: 1,
      };

      const setMock = jest.fn().mockRejectedValue(new Error("Create error"));
      const docRefMock = { set: setMock };
      const collectionRef = adminDB.collection("discounts");
      (collectionRef.doc as jest.Mock).mockReturnValue(docRefMock);

      const { req, res } = createMocks({ method: "POST", body: mockBody });
      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse
      );

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Failed to create discount",
      });
    });
  });

  describe("unsupported methods", () => {
    it("should return 405 for PUT", async () => {
      const { req, res } = createMocks({ method: "PUT" });
      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse
      );

      expect(res._getStatusCode()).toBe(405);
      expect(res._getData()).toContain("Method PUT Not Allowed");
    });
  });
});
