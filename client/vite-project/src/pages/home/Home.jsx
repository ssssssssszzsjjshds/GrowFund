import CampaignList from "../../components/CampaignList";

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Active Campaigns</h1>
      <CampaignList />
    </div>
  );
};

export default Home;
