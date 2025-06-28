import { useState } from "react";
import CampaignCard from "./CampaignCard";

// Helper: chunk array into arrays of n elements
function chunk(array, n) {
  return Array.from({ length: Math.ceil(array.length / n) }, (_, i) =>
    array.slice(i * n, i * n + n)
  );
}

const CampaignCarousel = ({
  campaigns = [],
  savedCampaigns = [],
  onSave,
  onUnsave,
  cardsPerSlide = 5,
  rowsPerSlide = 1,
}) => {
  const colsPerRow = Math.ceil(cardsPerSlide / rowsPerSlide);
  const totalSlides = Math.ceil(campaigns.length / cardsPerSlide);
  const slides = Array.from({ length: totalSlides }, (_, i) =>
    campaigns.slice(i * cardsPerSlide, (i + 1) * cardsPerSlide)
  );
  const [current, setCurrent] = useState(0);

  const prevSlide = () =>
    setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const nextSlide = () =>
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
  const goToSlide = (idx) => setCurrent(idx);

  if (slides.every((slide) => slide.length === 0)) {
    return <div className="text-center p-8">No recommended campaigns yet.</div>;
  }

  return (
    <div className="w-full">
      <div
        className="overflow-x-clip"
        style={{ width: "100%", minHeight: "340px" }}
      >
        <div
          className="flex transition-transform duration-500"
          style={{
            width: `${100 * slides.length}%`,
            transform: `translateX(-${(100 / slides.length) * current}%)`,
          }}
        >
          {slides.map((slide, slideIdx) => {
            // Split slide into rows
            const slideRows = chunk(slide, colsPerRow);
            return (
              <div
                key={slideIdx}
                className="flex flex-col gap-4"
                style={{
                  minWidth: `${100 / slides.length}%`,
                }}
              >
                {slideRows.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-4 mb-2">
                    {row.map((c, idx) =>
                      c ? (
                        <CampaignCard
                          key={c._id}
                          campaign={c}
                          isSaved={savedCampaigns.includes(c._id)}
                          onSave={onSave}
                          onUnsave={onUnsave}
                        />
                      ) : (
                        <div key={idx} className="flex-1" />
                      )
                    )}
                    {/* Pad to always colsPerRow cards per row */}
                    {row.length < colsPerRow &&
                      Array(colsPerRow - row.length)
                        .fill(0)
                        .map((_, idx) => <div key={idx} className="flex-1" />)}
                  </div>
                ))}
                {/* Pad to always rowsPerSlide rows per slide */}
                {slideRows.length < rowsPerSlide &&
                  Array(rowsPerSlide - slideRows.length)
                    .fill(0)
                    .map((_, idx) => (
                      <div key={idx} className="flex gap-4 mb-2">
                        {Array(colsPerRow)
                          .fill(0)
                          .map((__, i) => (
                            <div key={i} className="flex-1" />
                          ))}
                      </div>
                    ))}
              </div>
            );
          })}
        </div>
      </div>
      {/* Progress Bar Indicator with Dots */}
      <div className="w-full max-w-lg mx-auto mt-7 pb-2 relative">
        {/* Track */}
        <div className="h-2 bg-gray-200 rounded-full relative select-none">
          {/* Progress fill */}
          <div
            className="h-2 bg-blue-500 rounded-full transition-all absolute top-0 left-0"
            style={{
              width:
                slides.length === 1
                  ? "100%"
                  : `calc(${(current / (slides.length - 1)) * 100}% + 4px)`,
              zIndex: 1,
              transition: "width 350ms cubic-bezier(.4,1,.7,1)",
            }}
          />
          {/* Dots */}
          <div
            className="absolute top-1/2 left-0 w-full flex justify-between items-center pointer-events-none"
            style={{ transform: "translateY(-50%)" }}
          >
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-4 h-4 rounded-full border-2 shadow transition-all duration-200
                  ${
                    current === idx
                      ? "bg-blue-500 border-blue-700 scale-125"
                      : "bg-white border-gray-400 hover:bg-blue-200"
                  }
                `}
                style={{
                  marginLeft: idx === 0 ? "-8px" : 0,
                  marginRight: idx === slides.length - 1 ? "-8px" : 0,
                  pointerEvents: "auto",
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignCarousel;
