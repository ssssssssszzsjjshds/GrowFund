import React from "react";
const filters = [
  { value: "most_viewed", label: "Most Viewed" },
  { value: "most_recent", label: "Most Recent" },
  { value: "popular", label: "Popular" },
  { value: "most_pledged", label: "Most Pledged" },
];
const FilterBar = ({ filter, setFilter }) => (
  <div>
    {filters.map(f => (
      <button
        key={f.value}
        onClick={() => setFilter(f.value)}
        style={{
          fontWeight: filter === f.value ? "bold" : "normal",
          textDecoration: filter === f.value ? "underline" : "none"
        }}
      >
        {f.label}
      </button>
    ))}
  </div>
);
export default FilterBar;