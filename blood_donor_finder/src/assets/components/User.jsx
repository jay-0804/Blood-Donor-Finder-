import { useState, useEffect } from "react";
import styles from './User.module.css';

function User() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");

  useEffect(() => {
    async function getUsers() {
      try {
        const data = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await data.json();
        const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

        const transformedDonors = users.map((donor, index) => ({
          id: donor.id,
          name: donor.name,
          city: donor.address.city,
          bloodGroup: bloodGroups[index % bloodGroups.length],
          available: Math.random() > 0.4,
          requested: false,
        }));

        setDonors(transformedDonors);
        setLoading(false);
      } catch (error) {
        console.error("System Error: Failed to fetch nodes", error);
        setLoading(false);
      }
    }
    getUsers();
  }, []);

  const handleRequest = (id) => {
    setDonors(prev => prev.map(d => d.id === id ? { ...d, requested: true } : d));
  };

  const filteredDonors = selectedBloodGroup === "All"
    ? donors
    : donors.filter(d => d.bloodGroup === selectedBloodGroup);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>CONNECTING_TO_DATABASE...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <h2>BLOOD<br />PROTOCOL</h2>
          <p>Next-gen emergency donor synchronization. Real-time availability for critical response.</p>
        </header>

        <div className={styles.controls}>
          <div className={styles.filterBox}>
            <label>FILTER_BY_TYPE</label>
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className={styles.select}
            >
              <option value="All">ALL_TYPES</option>
              {["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className={styles.statusBadge}>
            <span className={styles.pulse}></span>
            {filteredDonors.filter(d => d.available).length} ONLINE_NODES
          </div>
        </div>

        <div className={styles.cardsWrapper}>
          {filteredDonors.length === 0 ? (
            <div className={styles.noDonor}>NO_AVAILABLE_DONORS_IN_REGION</div>
          ) : (
            filteredDonors.map((donor) => (
              <div key={donor.id} className={styles.card}>
                <span className={styles.bloodBadge}>{donor.bloodGroup}</span>
                <div className={styles.cardContent}>
                  <p className={styles.location}>Region // {donor.city}</p>
                  <h3>{donor.name}</h3>
                  
                  <div className={styles.cardFooter}>
                    {donor.requested ? (
                      <div className={styles.requested}>BROADCAST_SENT ✅</div>
                    ) : (
                      <button
                        onClick={() => handleRequest(donor.id)}
                        disabled={!donor.available}
                        className={styles.button}
                      >
                        {donor.available ? "REQUEST ASSISTANCE" : "UNAVAILABLE"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default User;