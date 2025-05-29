"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import Navbar from "@/app/components/Navbar/Navbar";
import AccountLayout from "@/app/Account/components/AccountLayout";
import Loading from "@/app/components/Loading/Loading";
import { Collection } from "@/types/collection";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import LinkButton from "@/app/Account/components/LinkButton";
import Footer from "@/app/components/Footer/Footer";

export default function AddCollection() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading } = useUserRole();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !loading && !!user;

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      router.push("/");
    } else if (!loading && role === "admin") {
      fetchProducts();
    }
  }, [loading, role, user, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/collections/collections");
      const data = await res.json();
      setCollections(data.collections);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (
    timestamp: { toDate?: () => Date; _seconds?: number } | null | undefined
  ) => {
    if (!timestamp) return "N/A";

    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate().toLocaleString();
    }

    if (typeof timestamp._seconds === "number") {
      return new Date(timestamp._seconds * 1000).toLocaleString();
    }

    return "N/A";
  };
  if (loading || role !== "admin" || isLoading) return <Loading />;
  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />
      <AccountLayout pathname={pathname || ""} sideLinks={[]}>
        <h3
          className="uppercase text-xl font-bold mb-6 text-center"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          MANAGING COLLECTIONS
        </h3>
        <LinkButton
          text="Add Collection"
          className="w-full bg-black text-white text-md font-medium px-4 py-2 hover:bg-gray-800 transition-colors my-2"
          showArrow={false}
          onClick={() => router.push(`/Admin/Collections/Add`)}
        />

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collections.map((collection) => (
            <li
              key={collection.id}
              className="flex flex-col justify-between border p-4 sm:p-5 rounded-xl bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 space-y-2 text-sm text-gray-800">
                <p>
                  <strong>Name:</strong> {collection.name}
                </p>
                <p>
                  <strong>Descroption:</strong> {collection.description}
                </p>
                <p
                  className={
                    collection.isActive ? "text-green-600" : "text-gray-500"
                  }
                >
                  <strong>{collection.isActive ? "Active" : "Inactive"}</strong>
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {formatTimestamp(collection.createdAt)}
                </p>

                <div className="grid grid-cols-1 gap-6 pt-2">
                  {collection.images && collection.images.length > 0 && (
                    <div className="mt-4">
                      <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop
                        className="mt-2"
                        renderArrowPrev={(onClickHandler, hasPrev, label) =>
                          hasPrev && (
                            <button
                              type="button"
                              onClick={onClickHandler}
                              title={label}
                              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white hidden md:block"
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M15 18l-6-6 6-6"
                                  stroke="black"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          )
                        }
                        renderArrowNext={(onClickHandler, hasNext, label) =>
                          hasNext && (
                            <button
                              type="button"
                              onClick={onClickHandler}
                              title={label}
                              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow hover:bg-white hidden md:block"
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M9 6l6 6-6 6"
                                  stroke="black"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          )
                        }
                      >
                        {collection.images.map((photo, idx) => (
                          <div key={idx} className="w-full h-64 relative">
                            <Image
                              src={photo}
                              alt={`Variant Image ${idx + 1}`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        ))}
                      </Carousel>
                    </div>
                  )}
                </div>
              </div>
              <LinkButton
                text="Edit"
                className="w-full bg-black text-white text-md font-medium px-4 py-2 hover:bg-gray-800 transition-colors"
                showArrow={false}
                onClick={() =>
                  router.push(`/Admin/Collections/Edit/${collection.id}`)
                }
              />
            </li>
          ))}
        </ul>
      </AccountLayout>
      <Footer />
    </>
  );
}
