import { useEffect, useState } from "react";
import CampaignList from "../../components/CampaignList";
import NewestCampaigns from "../../components/NewestCampaigns";
import styles from "./Home.module.css";

import { useLocation } from "react-router";
import { validCategories } from "../../../../../shared/categories";
import FilterBar from "../../../../../shared/FilterBar";
import HomeCarousel from "./components/HomeCarousel";

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
    <div>
      <HomeCarousel />
      <h1 className="text-3xl font-bold mb-6">Active Campaigns</h1>

      <CampaignList />
      <NewestCampaigns count={6} />
    </div>
  );
};

export default Home;
