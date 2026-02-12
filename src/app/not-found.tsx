import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-white"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <h1
        className="text-7xl md:text-9xl font-bold text-gray-200 mb-5"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        404
      </h1>
      <h2
        className="text-2xl md:text-3xl font-semibold mb-4"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Page Not Found
      </h2>
      <p className="text-gray-500 text-base md:text-lg mb-8 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
