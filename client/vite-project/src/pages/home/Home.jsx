import { useEffect, useState } from "react";
import CampaignList from "../../components/CampaignList";
import NewestCampaigns from "../../components/NewestCampaigns";

import { useLocation } from "react-router";
import { validCategories } from "../../../../../shared/categories";
import FilterBar from "../../../../../shared/FilterBar";

function useCategory() {
  const params = new URLSearchParams(useLocation().search);
  const category = params.get("category");
  return validCategories.includes(category) ? category : null;
}

const Home = () => {
  useEffect(() => {
    console.log("Home");
  });
  const category = useCategory();


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Active Campaigns</h1>
      
      <CampaignList  />
      <NewestCampaigns count={3} />
    </div>
  );
};

export default Home;
