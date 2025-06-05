import { createMocks } from "node-mocks-http";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../orders";
import { adminDB } from "@/lib/firebaseAdmin";
import type { Order } from "@/types/order";

jest.mock("@/lib/firebaseAdmin", () => {
  const mockGet = jest.fn();
  const mockCollection = jest.fn().mockReturnValue({
    get: mockGet,
  });
  return {
    adminDB: {
      collection: mockCollection,
    },
  };
});

describe("Orders API Handler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return orders on GET request", async () => {
    const mockOrderDate = new Date();
    const mockUpdatedAt = new Date();
    const mockOrderData = {
      orderId: "order-123",
      userId: "user-456",
      products: [{ productId: "p1", quantity: 2 }],
      total: 99.95,
      orderDate: mockOrderDate,
      updatedAt: mockUpdatedAt,
      giftOptions: { wrap: true, message: "Happy Birthday!" },
      paymentInfo: { method: "card", transactionId: "txn-789" },
      shippingAddress: {
        street: "123 Main St",
        city: "Anytown",
        postalCode: "12345",
        country: "US",
      },
      discountsApplied: [{ code: "SUMMER20", amount: 20 }],
      status: "processing",
      usedBonuses: 10,
    };

    const mockedDocs = [
      {
        id: "unused-id",
        data: () => mockOrderData,
      },
    ];

    const collectionRef = adminDB.collection("orders");
    (collectionRef.get as jest.Mock).mockResolvedValue({
      docs: mockedDocs,
    });

    const { req, res } = createMocks({ method: "GET" });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    expect(res._getStatusCode()).toBe(200);
    const json = JSON.parse(res._getData());

    // Проверяем, что у нас вернулся массив orders длиной 1
    expect(Array.isArray(json.orders)).toBe(true);
    expect(json.orders).toHaveLength(1);

    // Проверяем содержимое заказа, переводя даты в ISO-строку
    const returnedOrder: Order = json.orders[0];
    expect(returnedOrder).toMatchObject({
      orderId: mockOrderData.orderId,
      userId: mockOrderData.userId,
      products: mockOrderData.products,
      total: mockOrderData.total,
      orderDate: mockOrderDate.toISOString(),
      updatedAt: mockUpdatedAt.toISOString(),
      giftOptions: mockOrderData.giftOptions,
      paymentInfo: mockOrderData.paymentInfo,
      shippingAddress: mockOrderData.shippingAddress,
      discountsApplied: mockOrderData.discountsApplied,
      status: mockOrderData.status,
      usedBonuses: mockOrderData.usedBonuses,
    });
  });

  it("should return error on GET request failure", async () => {
    const collectionRef = adminDB.collection("orders");
    (collectionRef.get as jest.Mock).mockRejectedValue(
      new Error("Database failure")
    );

    const { req, res } = createMocks({ method: "GET" });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Failed to fetch orders",
      details: "Database failure",
    });
  });

  it("should return 405 for unsupported methods", async () => {
    const { req, res } = createMocks({ method: "POST" });
    await handler(
      req as unknown as NextApiRequest,
      res as unknown as NextApiResponse
    );

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({ error: "Method not allowed" });
  });
});
