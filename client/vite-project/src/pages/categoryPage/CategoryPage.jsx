import { useParams } from "react-router";
import CampaignList from "../../components/CampaignList";

const CategoryPage = () => {
  const { category } = useParams();

  // You can pass the category as a prop to CampaignList
  return (
    <div className="category-page">
      <h1 className="text-3xl font-bold mb-6">
        Category: <span className="text-yellow-500">{category}</span>
      </h1>
      <CampaignList category={category} />
    </div>
  );
};

export default CategoryPage;
