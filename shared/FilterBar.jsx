import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { categories } from "../shared/categories";

const filters = [
  { value: "most_viewed", label: "Most Viewed" },
  { value: "most_recent", label: "Most Recent" },
  { value: "popular", label: "Popular" },
  { value: "most_pledged", label: "Most Pledged" },
];
const COLUMNS = 3;

function splitIntoColumns(arr, columns) {
  const perCol = Math.ceil(arr.length / columns);
  return Array.from({ length: columns }, (_, i) =>
    arr.slice(i * perCol, (i + 1) * perCol)
  );
}

const FilterBar = ({ selectedCategory, setCategory, filter, setFilter }) => {
  const [catOpen, setCatOpen] = useState(false);
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    function handleClick(e) {
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setCatOpen(false);
      }
    }
    if (catOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [catOpen]);

  useEffect(() => {
    if (catOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [catOpen]);

  const categoryColumns = splitIntoColumns(categories, COLUMNS);

  const dropdown = (
    <div
      ref={dropdownRef}
      className="absolute z-[9999] w-[420px] bg-white border border-gray-300 rounded shadow-2xl p-0 animate-fadeIn"
      style={{
        top: dropdownPos.top,
        left: dropdownPos.left,
        position: "absolute",
        zIndex: "9999",
      }}
    >
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          Categories
        </div>
      </div>
      <div className="flex gap-6 p-4">
        {[["All categories"], ...categoryColumns].map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-1 min-w-[110px]">
            {col.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat === "All categories" ? "" : cat);
                  setCatOpen(false);
                }}
                className={`block text-left px-2 py-1 rounded transition text-base
                  ${
                    (cat === "All categories" && !selectedCategory) ||
                    cat === selectedCategory
                      ? "text-green-600 font-semibold border border-green-300 bg-green-50"
                      : "hover:bg-gray-100 text-gray-800"
                  }
                `}
                style={{
                  borderStyle:
                    cat === "All categories" && !selectedCategory
                      ? "dashed"
                      : undefined,
                  borderWidth:
                    cat === "All categories" && !selectedCategory
                      ? "1px"
                      : undefined,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="w-full h-full bg-white border-b border-gray-200 flex items-center justify-center">
      <div className="flex items-center gap-4 mx-auto max-w-4xl">
        <span className="text-lg font-bold text-gray-700 whitespace-nowrap">
          Show me
        </span>
        <div className="relative" ref={btnRef}>
          <button
            type="button"
            className={`px-5 py-2 bg-white border border-gray-300 text-base font-medium min-w-[180px] flex items-center gap-2 hover:border-gray-500 focus:outline-none transition ring-inset ${
              catOpen ? "ring-2 ring-green-400 border-green-400" : ""
            }`}
            onClick={() => setCatOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={catOpen}
          >
            <span className="truncate">
              {selectedCategory || "All categories"}
            </span>
            <svg className="ml-2 w-4 h-4" viewBox="0 0 20 20" fill="none">
              <path
                d="M7 8l3 3 3-3"
                stroke="#444"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </button>
          {catOpen && createPortal(dropdown, document.body)}
        </div>
        <span className="text-lg font-bold text-gray-700 whitespace-nowrap">
          projects sorted by
        </span>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-5 py-2 bg-white border border-gray-300 text-base font-medium min-w-[150px] focus:outline-none hover:border-gray-500 transition"
        >
          {filters.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default FilterBar;
