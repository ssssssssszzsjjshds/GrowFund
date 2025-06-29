import React from "react";

/**
 * SimpleWideCard
 * Props:
 * - image: string (URL)
 * - title: string
 * - desc: string
 * - link?: string (optional, for "Read more")
 */
const SimpleWideCard = ({ image, title, desc, link }) => (
  <div
    className="bg-white rounded-md shadow-md overflow-hidden flex flex-col"
    style={{
      width: "46vw", // wider
      minWidth: 350, // a bit wider minimum
      maxWidth: 640, // increased max width
      margin: "0 auto",
      borderRadius: 6, // minimal rounding
    }}
  >
    {image && (
      <img
        src={image}
        alt={title}
        className="w-full"
        style={{
          height: "17rem", // taller image (68px taller than h-48)
          objectFit: "cover",
          borderBottom: "1px solid #e5e7eb",
        }}
      />
    )}
    <div className="p-7 flex flex-col flex-1">
      <h3 className="text-2xl font-semibold mb-3 border-l-4 border-green-700 pl-3">
        {title}
      </h3>
      <p className="text-gray-700 mb-6">{desc}</p>
      {link && (
        <a
          href={link}
          className="mt-auto text-blue-600 hover:underline text-sm font-medium"
        >
          Read more
        </a>
      )}
    </div>
  </div>
);

export default SimpleWideCard;
