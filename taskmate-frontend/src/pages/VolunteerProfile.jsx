import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RatingDisplay from "../components/RatingDisplay";

export default function VolunteerProfile() {
  const { id } = useParams();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteer();
  }, [id]);

  const fetchVolunteer = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${id}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setVolunteer(data);
    } catch (err) {
      console.error("Failed to load volunteer");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!volunteer) return <p>User not found</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 Volunteer Profile</h2>

        <div className="profile-info">
          <p><strong>Name:</strong> {volunteer.name}</p>
          <p><strong>Email:</strong> {volunteer.email}</p>

          <div className="profile-rating">
            <h4>⭐ Rating</h4>
            <RatingDisplay
              rating={volunteer.averageRating}
              count={volunteer.totalRatings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}