import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../products";
import { adminDB } from "@/lib/firebaseAdmin";

jest.mock("@/lib/firebaseAdmin", () => {
  const mockGet = jest.fn();
  const mockSet = jest.fn();
  const mockDoc = jest.fn().mockReturnValue({ set: mockSet });
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

describe("Products API Handler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return products on GET request", async () => {
    const mockCreatedAt = new Date();
    const mockUpdatedAt = new Date();
    const mockProductData = {
      name: "Product 1",
      description: "Description 1",
      slug: "product-1",
      categoryId: "1",
      variants: [],
      createdAt: mockCreatedAt,
      updatedAt: mockUpdatedAt,
      isHidden: false,
      additionalDescription: "Additional info 1",
      tag: "tag1",
    };

    // Mock one Firestore document
    const mockedDocs = [
      {
        id: "1", // Can specify id, but in test we won't expect it in response
        data: () => mockProductData,
      },
    ];

    const collectionRef = adminDB.collection("products");
    (collectionRef.get as jest.Mock).mockResolvedValue({
      docs: mockedDocs,
    });

    const { req, res } = createMocks({ method: "GET" });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());

    // Ensure an array of length 1 arrived
    expect(Array.isArray(json.products)).toBe(true);
    expect(json.products).toHaveLength(1);

    // Check content of the first product (ignore "id" field because handler doesn't return it)
    expect(json.products[0]).toMatchObject({
      name: mockProductData.name,
      description: mockProductData.description,
      slug: mockProductData.slug,
      categoryId: mockProductData.categoryId,
      variants: mockProductData.variants,
      createdAt: mockCreatedAt.toISOString(),
      updatedAt: mockUpdatedAt.toISOString(),
      isHidden: mockProductData.isHidden,
      additionalDescription: mockProductData.additionalDescription,
      tag: mockProductData.tag,
    });
  });

  it("should return error on GET request failure", async () => {
    const collectionRef = adminDB.collection("products");
    (collectionRef.get as jest.Mock).mockRejectedValue(
      new Error("Database error"),
    );

    const { req, res } = createMocks({ method: "GET" });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Failed to fetch products",
      details: "Database error",
    });
  });

  it("should create a product on POST request", async () => {
    const mockProduct = {
      name: "New Product",
      description: "New Product Description",
      slug: "new-product",
      categoryId: "2",
      variants: [],
      isHidden: false,
      additionalDescription: "New additional description",
      tag: "new-tag",
    };

    const collectionRef = adminDB.collection("products");
    // When handler calls collectionRef.doc(), it receives an object with set method
    // We need to return mockDocRef which has an id field
    const mockDocRef = {
      set: jest.fn().mockResolvedValue({}),
      id: "generated-id-123",
    };
    (collectionRef.doc as jest.Mock).mockReturnValue(mockDocRef);

    const { req, res } = createMocks({ method: "POST", body: mockProduct });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(201);
    // Ensure set() was called with correct data
    expect(mockDocRef.set).toHaveBeenCalledWith(
      expect.objectContaining(mockProduct),
    );

    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
    expect(typeof data.id).toBe("string");
  });

  it("should return error on POST request failure", async () => {
    const mockProduct = {
      name: "New Product",
      description: "New Product Description",
      slug: "new-product",
      categoryId: "2",
      variants: [],
      isHidden: false,
      additionalDescription: "New additional description",
      tag: "new-tag",
    };

    const collectionRef = adminDB.collection("products");
    const mockDocRef = {
      set: jest.fn().mockRejectedValue(new Error("Failed to create product")),
      id: "whatever",
    };
    (collectionRef.doc as jest.Mock).mockReturnValue(mockDocRef);

    const { req, res } = createMocks({ method: "POST", body: mockProduct });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      error: "Failed to create product",
      details: "Failed to create product",
    });
  });

  it("should return 405 for unsupported methods", async () => {
    const { req, res } = createMocks({ method: "PUT" });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse,
    );

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ error: "Method not allowed" });
  });
});
