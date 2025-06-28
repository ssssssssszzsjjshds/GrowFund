import { useEffect, useState } from "react";
import CampaignList from "../../components/CampaignList";
import NewestCampaigns from "../../components/NewestCampaigns";
import styles from "./Home.module.css";

import { useLocation } from "react-router";
import { validCategories } from "../../../../../shared/categories";
import FilterBar from "../../../../../shared/FilterBar";
import HomeCarousel from "./components/HomeCarousel";
import RecommendedList from "../../components/RecommendedList";
import FreshFavorites from "../../components/FreshFavorites";
import RandomCategoryCarousel from "../../components/RandomCategoryCarousel";

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
      <h1>Recommended</h1>
      <RecommendedList />
      <h1 className="text-3xl font-bold mb-6">Active Campaigns</h1>

      <CampaignList />
      <NewestCampaigns count={6} />
      
      <FreshFavorites />
      <RandomCategoryCarousel />
    </div>
  );
};

export default Home;
