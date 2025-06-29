import { useParams } from "react-router";

import { categoryLabels } from "../../../../../shared/categories.js"; // should be an object: { "Art": "Artistic Inspirations", ... }
import CategoryCampaignsList from "../../components/CategoryCampaignsList.jsx";

const CategoryPage = () => {
  const { category } = useParams();
  const decodedCategory = category ? decodeURIComponent(category) : "";

  // Use label if available, otherwise fall back to raw category
  const displayLabel =
    (decodedCategory && categoryLabels[decodedCategory]) ||
    decodedCategory ||
    "Unknown";

  return (
    <div className="category-page w-full min-h-screen bg-gray-50   flex flex-col items-center">
      {/* Centered header, nice spacing */}

      <div className="w-full  ">
        <CategoryCampaignsList category={decodedCategory} />
      </div>
    </div>
  );
};

export default CategoryPage;
