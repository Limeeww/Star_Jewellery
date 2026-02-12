import Link from "next/link";

interface ProfileCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  linkHref?: string;
  linkLabel?: string;
}

export default function ProfileCard({
  title,
  description,
  children,
  linkHref,
  linkLabel = "View Details",
}: ProfileCardProps) {
  return (
    <div className="border p-6 flex flex-col h-full bg-gray-50 rounded-md shadow-sm">
      <h3
        className="text-lg font-semibold mb-3"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h3>

      {description && (
        <p className="text-sm text-gray-700 flex-grow">{description}</p>
      )}

      {children}

      {linkHref && (
        <div className="pt-4">
          <Link
            href={linkHref}
            className="underline text-sm cursor-pointer text-gray-700 hover:text-black transition-colors"
          >
            {linkLabel}
          </Link>
        </div>
      )}
    </div>
  );
}
