import { useEffect } from "react";
import CampaignList from "../../components/CampaignList";
import NewestCampaigns from "../../components/NewestCampaigns";


const Home = () => {
  useEffect(() => {
    console.log("Home");
    
  })
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Active Campaigns</h1>
      
      <CampaignList />
      <NewestCampaigns count={3} />
    </div>
  );
};

export default Home;
