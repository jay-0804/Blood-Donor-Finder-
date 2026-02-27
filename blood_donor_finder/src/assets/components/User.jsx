import { useState, useEffect } from "react";
import styles from './User.module.css'

function User() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("All");

  useEffect(() => {
    async function getUsers() {

      const data = await fetch("https://jsonplaceholder.typicode.com/users");

      const donors = await data.json();

      console.log(donors);

      const bloodGroups = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"];

      const transformedDonors = donors.map((donor, index) => ({
        id: donor.id,
        name: donor.name,
        city: donor.address.city,
        bloodGroup: bloodGroups[index % bloodGroups.length],
        available: Math.random() > 0.5,
        requested: false,
      }));

      setLoading(false);

      setDonors(transformedDonors);

    }

    getUsers();

  }, []);

  if (loading) {
    return <h2>Loading</h2>;
  } 
  
  else {

    const filteredDonors =
      selectedBloodGroup === "All"
        ? donors
        : donors.filter((donor) => donor.bloodGroup === selectedBloodGroup);

    const availableCount = filteredDonors.filter(
      (donor) => donor.available
    ).length;

    const handleRequest = (id) => {
      setDonors((prevDonors) =>
        prevDonors.map((donor) =>
          donor.id === id ? { ...donor, requested: true } : donor,
        ),
      );
    };

    return (
  <div className={styles.container}>
    <h2>Blood Donors</h2>

    <select
      value={selectedBloodGroup}
      onChange={(e) => setSelectedBloodGroup(e.target.value)}
      className={styles.select}
    >
      <option value="All">All</option>
      <option value="A+">A+</option>
      <option value="B+">B+</option>
      <option value="O+">O+</option>
      <option value="AB+">AB+</option>
      <option value="A-">A-</option>
      <option value="B-">B-</option>
      <option value="O-">O-</option>
      <option value="AB-">AB-</option>
    </select>

    <p className={styles.count}>
      Total Available Donors: {availableCount}
    </p>

    {filteredDonors.length === 0 && (
      <h2 className={styles.noDonor}>
        No donors found for the selected blood group.
      </h2>
    )}

    {filteredDonors.map((donor) => (
      <div key={donor.id} className={styles.card}>
        <p><strong>{donor.name}</strong></p>
        <p>{donor.city}</p>
        <p>{donor.bloodGroup}</p>

        <p
          className={
            donor.available
              ? styles.available
              : styles.notAvailable
          }
        >
          {donor.available ? "Available" : "Not Available"}
        </p>

        {donor.requested ? (
          <p className={styles.requested}>
            Request Sent ✅
          </p>
        ) : (
          <button
            onClick={() => handleRequest(donor.id)}
            disabled={!donor.available}
            className={styles.button}
          >
            Request Help
          </button>
        )}
      </div>
    ))}
  </div>
);
  }
}
export default User;
