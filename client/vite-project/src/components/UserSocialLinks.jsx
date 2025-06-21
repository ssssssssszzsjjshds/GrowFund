import React from "react";
import { FaInstagram, FaFacebook, FaLinkedin, FaGlobe } from "react-icons/fa";

export default function UserSocialLinks({
  instagram,
  facebook,
  linkedin,
  portfolio,
}) {
  const socials = [
    {
      icon: <FaInstagram />,
      url: instagram,
      label: "Instagram",
      color: "text-pink-500",
    },
    {
      icon: <FaFacebook />,
      url: facebook,
      label: "Facebook",
      color: "text-blue-600",
    },
    {
      icon: <FaLinkedin />,
      url: linkedin,
      label: "LinkedIn",
      color: "text-blue-700",
    },
    {
      icon: <FaGlobe />,
      url: portfolio,
      label: "Portfolio",
      color: "text-green-700",
    },
  ];

  return (
    <div className="flex gap-4 justify-center mb-8">
      {socials.map(
        (s, idx) =>
          s.url &&
          s.url.trim() && (
            <a
              key={idx}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className={`text-2xl hover:scale-110 transition-transform ${s.color}`}
            >
              {s.icon}
            </a>
          )
      )}
    </div>
  );
}
