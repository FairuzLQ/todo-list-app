import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const ChecklistPage = () => {
  const [checklists, setChecklists] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [checklistToDelete, setChecklistToDelete] = useState(null); // Track checklist to be deleted
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

      if (response.data.statusCode === 2100) {
        setChecklists(response.data.data);
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

  // Check if checklist has items
  const hasItems = (checklist) => checklist.items && checklist.items.length > 0;

  // Open modal for deleting checklist
  const openDeleteModal = (checklist) => {
    if (hasItems(checklist)) {
      setChecklistToDelete(checklist);
      setShowModal(true);
    } else {
      deleteChecklist(checklist.id);
    }
  };

  // Delete checklist by ID
  const deleteChecklist = async (id, token) => {
    setLoading(true);
    try {
      const response = await API.delete(`/checklist/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  // Confirm modal action
  const confirmDelete = () => {
    const token = localStorage.getItem("token");
    deleteChecklist(checklistToDelete.id, token);
    setShowModal(false);
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
                <p>No items to complete yet.</p>
              )}
              <div style={styles.actions}>
                <button
                  onClick={() => navigate(`/checklist/${checklist.id}`)}
                  style={styles.viewButton}
                >
                  View
                </button>
                <button
                  onClick={() => openDeleteModal(checklist)}
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

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Warning</h3>
            <p>There are items in this checklist. You must remove all items before deleting the checklist.</p>
            <div style={styles.modalActions}>
              <button onClick={() => setShowModal(false)} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={confirmDelete} style={styles.confirmButton}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    textAlign: "center",
    width: "300px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
  cancelButton: {
    padding: "5px 10px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  confirmButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ChecklistPage;
