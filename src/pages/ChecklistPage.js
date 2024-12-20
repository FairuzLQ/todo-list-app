import React, { useState, useEffect } from "react";
import API from "../services/api"; // Ensure token handling is configured
import { useNavigate } from "react-router-dom";

const ChecklistPage = () => {
  const [checklists, setChecklists] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login page if no token
    } else {
      fetchChecklists(token); // Pass token to fetch checklists
    }
  }, [navigate]);

  // Fetch all checklists
  const fetchChecklists = async (token) => {
    setLoading(true);
    try {
      const response = await API.get("/checklist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check the response status code
      if (response.data.statusCode === 2100) {
        console.log("Fetched checklists:", response.data.data); // Log the response
        setChecklists(response.data.data); // Update the state with the fetched checklists
      } else {
        console.error("Failed to fetch checklists:", response.data.message);
      }
    } catch (err) {
      console.error("Failed to fetch checklists:", err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/"); // Redirect to login if token is invalid
      }
    } finally {
      setLoading(false);
    }
  };

  // Add a new checklist
  const addChecklist = async (token) => {
    if (!title) return; // Ensure title is provided
    setLoading(true);
    try {
      const response = await API.post(
        "/checklist",
        { name: title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Added checklist:", response.data);

      // Use response data to update the checklists list
      if (response.data && response.data.data) {
        const newChecklist = response.data.data;
        setChecklists((prevChecklists) => [
          ...prevChecklists,
          newChecklist,
        ]);
      }

      setTitle(""); // Clear input field
    } catch (err) {
      console.error("Failed to add checklist:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a checklist by ID
  const deleteChecklist = async (id, token) => {
    setLoading(true);
    try {
      const response = await API.delete(`/checklist/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Deleted checklist:", response.data);
      fetchChecklists(token); // Refresh checklist after deleting
    } catch (err) {
      console.error("Failed to delete checklist:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login page
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Checklists</h2>
      <div style={styles.addChecklist}>
        <input
          type="text"
          placeholder="Enter checklist title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={() => {
            const token = localStorage.getItem("token");
            addChecklist(token);
          }}
          style={styles.addButton}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Checklist"}
        </button>
      </div>
      <div style={styles.checklistContainer}>
        {loading ? (
          <p>Loading checklists...</p>
        ) : checklists.length > 0 ? (
          checklists.map((checklist) => (
            <div key={checklist.id} style={styles.checklistCard}>
              <h3>{checklist.name}</h3>
              <p>
                Completion Status: {checklist.checklistCompletionStatus ? "Completed" : "Not Completed"}
              </p>
              {checklist.items && checklist.items.length > 0 ? (
                <div>
                  {checklist.items.map((item) => (
                    <div key={item.id} style={styles.item}>
                      <p>{item.name}</p>
                      <p>Status: {item.itemCompletionStatus ? "Completed" : "Not Completed"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No items to complete yet.</p> // Pesan jika items null atau kosong
              )}
              <div style={styles.actions}>
                <button
                  onClick={() => navigate(`/checklist/${checklist.id}`)}
                  style={styles.viewButton}
                >
                  View
                </button>
                <button
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    deleteChecklist(checklist.id, token);
                  }}
                  style={styles.deleteButton}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No checklists available. Add one to get started!</p>
        )}
      </div>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  addChecklist: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    marginRight: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  checklistContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  checklistCard: {
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
  item: {
    marginBottom: "10px",
    padding: "5px 0",
    borderBottom: "1px solid #ccc",
  },
  actions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
  },
  viewButton: {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default ChecklistPage;
