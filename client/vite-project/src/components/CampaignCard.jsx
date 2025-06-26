import { useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";
import styles from "./CampaignCard.module.css";

// Set your API base URL or use VITE_API_BASE_URL env var
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Helper for profile picture
const getProfilePicUrl = (picPath) => {
  if (!picPath) return "/default-profile.png";
  return picPath.startsWith("http") ? picPath : `${API_BASE_URL}${picPath}`;
};

function getDaysLeft(deadline) {
  if (!deadline) return "-";
  const diff = Math.ceil(
    (new Date(deadline) - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return diff > 0 ? diff : 0;
}

const CampaignCard = ({ campaign, onSave, onUnsave, isSaved }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const timestamp = Date.now();

    try {
      await axios.post(`/api/campaigns/${campaign._id}/view`);
      navigate(`/campaigns/${campaign._id}`, {
        replace: true,
        state: {
          viewCounted: true,
          timestamp,
        },
      });
    } catch (err) {
      console.error("Error counting view:", err);
      navigate(`/campaigns/${campaign._id}`);
    }
  };

  // Progress bar value (0-100)
  const progress = Math.min(
    100,
    Math.round(((campaign.raisedAmount || 0) / campaign.goal) * 100)
  );

  const creator = campaign.creator || {};
  const daysLeft = getDaysLeft(campaign.deadline);

  function truncate(str, n) {
    return str && str.length > n ? str.slice(0, n) + "..." : str;
  }

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={0}
      role="button"
    >
      <div className={styles.imageWrapper}>
        <img
          src={
            campaign.image
              ? campaign.image.startsWith("http")
                ? campaign.image
                : `${API_BASE_URL}${campaign.image}`
              : "/placeholder-campaign.jpg"
          }
          alt={campaign.title}
          className={styles.campaignImg}
          
        />
        {/* Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {/* Save/Unsave Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            isSaved ? onUnsave(e, campaign._id) : onSave(e, campaign._id);
          }}
          className={`${styles.saveBtn} ${isSaved ? styles.saved : ""}`}
          aria-label={isSaved ? "Unsave" : "Save"}
        >
          {isSaved ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1abc60">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#222"
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          )}
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.creatorNProfile}>
          {creator.profilePic ? (
            <img
              src={getProfilePicUrl(creator.profilePic)}
              alt={creator.name}
              className={styles.creatorImg}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${creator._id}`);
              }}
              title="Go to profile"
            />
          ) : (
            <div
              className={styles.creatorPlaceholder}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${creator._id}`);
              }}
              title="Go to profile"
            >
              {creator.name ? creator.name[0].toUpperCase() : "?"}
            </div>
          )}
          <div className={styles.creatorInfo}>
            <div className={styles.campaignTitle} title={campaign.title}>
              {campaign.title}
            </div>
            <div className="text-sm text-gray-500 ">{creator.name}</div>
            <div className={styles.campaignStats}>
              <span className="flex items-center gap-1">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {daysLeft} days left
              </span>
              <span>• {progress}% funded</span>
            </div>
          </div>
        </div>
        {/* Hover overlay */}
        <div
          className={`${styles.hoverOverlay} ${
            hovered ? styles.hoverOverlayVisible : ""
          }`}
        >
          <div className={styles.hoverDescription}>
            {truncate(campaign.description, 30)}
          </div>
          <div className={styles.hoverCategory}>{campaign.category}</div>
          {/* Show campaign location if available */}
          {campaign.location && (
            <div className={styles.hoverLocation}>{campaign.location}</div>
          )}
          {/* Show campaign blocks (text/image) if desired */}
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
