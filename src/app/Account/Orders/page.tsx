"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import AccountLayout from "@/app/Account/components/AccountLayout";
import WelcomeBlock from "@/app/Account/components/WelcomeBlock";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import Loading from "@/app/components/Loading/Loading";

interface MockOrder {
  orderId: string;
  placedDate: string;
  nextStepDate: string;
  nextStepLabel: string;
  progress: number; // 0–1
  item: {
    img: string;
    name: string;
    price: string;
  };
  address: {
    name: string;
    street: string;
    city: string;
    zip: string;
  };
  updates: {
    email: string;
    phone: string;
  };
}

const mockOrders: MockOrder[] = [
  {
    orderId: "54879",
    placedDate: "March 22, 2021",
    nextStepDate: "March 24, 2021",
    nextStepLabel: "Preparing to ship",
    progress: 0.5,
    item: {
      img: "/images/products/tumbler-front.jpg",
      name: "Nomad Tumbler",
      price: "$35.00",
    },
    address: {
      name: "Floyd Miles",
      street: "7363 Cynthia Pass",
      city: "Toronto, ON N3Y 4H8",
      zip: "",
    },
    updates: {
      email: "f***@example.com",
      phone: "1••••••••40",
    },
  },
  // можно добавить ещё mock-заказов
];

export default function MyOrders() {
  const [user, loadingAuth] = useAuthState(auth);
  const pathname = usePathname();

  if (loadingAuth) return <Loading />;

  return (
    <>
      <Navbar isScrolled isLoggedIn={!!user} />
      <AccountLayout pathname={pathname ?? ""} sideLinks={[]}>
        <WelcomeBlock firstName="Имя" lastName="Фамилия" />

        <div className="mt-6 space-y-6 text-gray-800" style={{ fontFamily: "var(--font-poppins)" }}>
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
            My Orders
          </h2>

          {mockOrders.map((o) => (
            <div key={o.orderId} className="bg-white p-6 rounded-lg shadow">
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Order #{o.orderId}</h3>
                <Link
                  href={`/account/orders/${o.orderId}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View details →
                </Link>
              </div>
              <p className="text-sm text-gray-500 mb-4">Order placed {o.placedDate}</p>

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Item */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={o.item.img}
                      alt={o.item.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{o.item.name}</p>
                    <p className="text-sm text-gray-600">{o.item.price}</p>
                  </div>
                </div>

                {/* Delivery address */}
                <div>
                  <h4 className="font-medium mb-1">Delivery address</h4>
                  <p className="text-sm">{o.address.name}</p>
                  <p className="text-sm">{o.address.street}</p>
                  <p className="text-sm">{o.address.city}</p>
                </div>

                {/* Shipping updates */}
                <div>
                  <h4 className="font-medium mb-1">Shipping updates</h4>
                  <p className="text-sm">{o.updates.email}</p>
                  <p className="text-sm">{o.updates.phone}</p>
                  <button className="mt-1 text-sm text-indigo-600 hover:underline">Edit</button>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">
                  {o.nextStepLabel} on {o.nextStepDate}
                </p>
                <div className="w-full bg-gray-200 h-1 rounded overflow-hidden">
                  <div
                    className="h-1 bg-indigo-600"
                    style={{ width: `${o.progress * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2 uppercase">
                  <span className={o.progress > 0 ? "text-indigo-600" : ""}>Order placed</span>
                  <span className={o.progress > 0.25 ? "text-indigo-600" : ""}>Processing</span>
                  <span className={o.progress > 0.75 ? "text-indigo-600" : ""}>Shipped</span>
                  <span className={o.progress >= 1 ? "text-indigo-600" : ""}>Delivered</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AccountLayout>
      <Footer />
    </>
  );
}
