// /pages/api/collections/__tests__/collections.test.ts

import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../collections";
import { adminDB } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { uuidToNumber } from "@/hooks/uuidToNumber";
//import type { Collection } from "@/types/collection";

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

describe("Collections API Handler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/collections", () => {
    it("should return collections on GET request", async () => {
      // Prepare fake documents
      const mockCreatedAt = "2025-01-01T12:00:00Z";
      const mockDocs = [
        {
          id: "doc1",
          data: () => ({
            id: 100,
            name: "Spring Collection",
            description: "Bright and fresh",
            images: ["img1.jpg", "img2.jpg"],
            parentCategory: "seasonal",
            isActive: true,
            createdAt: mockCreatedAt,
            productIds: ["p1", "p2"],
          }),
        },
        {
          id: "doc2",
          data: () => ({
            id: 101,
            name: "Summer Collection",
            description: "Warm and vibrant",
            images: [],
            parentCategory: "seasonal",
            isActive: false,
            createdAt: mockCreatedAt,
            productIds: [],
          }),
        },
      ];

      const collectionRef = adminDB.collection("collections");
      (collectionRef.get as jest.Mock).mockResolvedValue({ docs: mockDocs });

      const { req, res } = createMocks({ method: "GET" });
      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse,
      );

      expect(res._getStatusCode()).toBe(200);
      const json = JSON.parse(res._getData());

      expect(Array.isArray(json.collections)).toBe(true);
      expect(json.collections).toHaveLength(2);

      // Check first object
      expect(json.collections[0]).toEqual({
        id: "100",
        name: "Spring Collection",
        description: "Bright and fresh",
        images: ["img1.jpg", "img2.jpg"],
        parentCategory: "seasonal",
        isActive: true,
        createdAt: mockCreatedAt,
        productIds: ["p1", "p2"],
      });

      // Check second object
      expect(json.collections[1]).toEqual({
        id: "101",
        name: "Summer Collection",
        description: "Warm and vibrant",
        images: [],
        parentCategory: "seasonal",
        isActive: false,
        createdAt: mockCreatedAt,
        productIds: [],
      });
    });

    it("should return error when GET fails", async () => {
      const collectionRef = adminDB.collection("collections");
      (collectionRef.get as jest.Mock).mockRejectedValue(new Error("DB error"));

      const { req, res } = createMocks({ method: "GET" });
      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse,
      );

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Failed to fetch collections",
      });
    });
  });

  describe("POST /api/collections", () => {
    it("should create a collection and return its string ID", async () => {
      (uuidv4 as jest.Mock).mockReturnValue("any-uuid");
      (uuidToNumber as jest.Mock).mockReturnValue(555);

      const newCol = {
        name: "Autumn Collection",
        description: "Cozy and warm",
        images: ["aut1.png"],
        parentCategory: "seasonal",
        isActive: true,
        productIds: ["p3"],
      };

      // Use FieldValue type instead of any
      const fakeTimestamp = {
        _seconds: 1234567890,
        _nanoseconds: 0,
      } as unknown as admin.firestore.FieldValue;
      jest
        .spyOn(admin.firestore.FieldValue, "serverTimestamp")
        .mockReturnValue(fakeTimestamp);

      const setMock = jest.fn().mockResolvedValue({});
      const docRefMock = { set: setMock };
      const collectionRef = adminDB.collection("collections");
      (collectionRef.doc as jest.Mock).mockReturnValue(docRefMock);

      const { req, res } = createMocks({ method: "POST", body: newCol });
      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse,
      );

      expect(res._getStatusCode()).toBe(201);
      const response = JSON.parse(res._getData());
      expect(response).toEqual({ success: true, id: "555" });

      expect(setMock).toHaveBeenCalledWith({
        ...newCol,
        id: 555,
        createdAt: fakeTimestamp,
      });
    });

    it("should return error when POST fails", async () => {
      (uuidv4 as jest.Mock).mockReturnValue("any-uuid");
      (uuidToNumber as jest.Mock).mockReturnValue(777);

      const newCol = {
        name: "Winter Collection",
        description: "Cold and crisp",
        images: [],
        parentCategory: "seasonal",
        isActive: false,
        productIds: [],
      };

      const setMock = jest.fn().mockRejectedValue(new Error("Creation error"));
      const docRefMock = { set: setMock };
      const collectionRef = adminDB.collection("collections");
      (collectionRef.doc as jest.Mock).mockReturnValue(docRefMock);

      const { req, res } = createMocks({ method: "POST", body: newCol });
      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse,
      );

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Failed to create collection",
      });
    });
  });

  describe("unsupported methods", () => {
    it("should return 405 for PUT", async () => {
      const { req, res } = createMocks({ method: "PUT" });
      await handler(
        req as unknown as NextApiRequest,
        res as unknown as NextApiResponse,
      );

      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({
        error: "Method not allowed",
      });
    });
  });
});
