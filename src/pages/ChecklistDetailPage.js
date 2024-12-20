import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const ChecklistDetailPage = () => {
  const { checklistId } = useParams();
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [editItemId, setEditItemId] = useState(null); // Track item being edited
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal state
  const [loadingDeleteAll, setLoadingDeleteAll] = useState(false); // Loading state for delete all
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if no token found
    } else {
      fetchItems(); // Fetch items when the page loads
    }
  }, [navigate, checklistId]);

  // Fetch items for the checklist
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/checklist/${checklistId}/item`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setItems(response.data.data || []); // Adjust data if needed
    } catch (err) {
      console.error("Failed to fetch checklist items:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add or edit an item in the checklist
  const handleItemSubmit = async () => {
    if (!itemName) return; // Make sure item name is not empty
    setLoading(true);
    try {
      if (editItemId) {
        // Rename existing item using the correct endpoint
        await API.put(
          `/checklist/${checklistId}/item/rename/${editItemId}`, // Correct endpoint for renaming
          {
            itemName: itemName, // Send the new name
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        // Add new item
        await API.post(
          `/checklist/${checklistId}/item`,
          { itemName: itemName },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }
      setItemName(""); // Clear input after submission
      setEditItemId(null); // Reset edit state
      fetchItems(); // Refresh the items list
    } catch (err) {
      console.error("Failed to submit checklist item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete an item
  const deleteItem = async (itemId) => {
    setLoading(true);
    try {
      await API.delete(`/checklist/${checklistId}/item/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchItems(); // Refresh items after deletion
    } catch (err) {
      console.error("Failed to delete checklist item:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle item completion status
  const updateStatus = async (itemId, currentStatus) => {
    const newStatus = currentStatus ? "pending" : "completed";
    setLoading(true);
    try {
      await API.put(
        `/checklist/${checklistId}/item/${itemId}`,
        {
          itemCompletionStatus: newStatus, // Corrected field name here
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchItems(); // Refresh items list after status update
    } catch (err) {
      console.error("Failed to update item status:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete all items
  const deleteAllItems = async () => {
    setLoadingDeleteAll(true);
    try {
      await Promise.all(
        items.map((item) =>
          API.delete(`/checklist/${checklistId}/item/${item.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        )
      );
      fetchItems(); // Refresh items after deletion
    } catch (err) {
      console.error("Failed to delete all checklist items:", err);
    } finally {
      setLoadingDeleteAll(false);
      setShowDeleteModal(false); // Close the delete confirmation modal
    }
  };

  return (
    <div style={styles.container}>
      <h2>Checklist Detail</h2>
      <div style={styles.addChecklistItem}>
        <input
          type="text"
          placeholder="Enter item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={handleItemSubmit}
          style={styles.addButton}
          disabled={loading}
        >
          {loading ? "Processing..." : editItemId ? "Update Item" : "Add Item"}
        </button>
      </div>
      <div style={styles.checklistItemContainer}>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} style={styles.checklistCard}>
              <h4>{item.name}</h4> {/* Corrected name field */}
              <p>Status: {item.itemCompletionStatus ? "Completed" : "Pending"}</p>
              <div style={styles.actions}>
                <button
                  onClick={() => updateStatus(item.id, item.itemCompletionStatus)}
                  style={styles.statusButton}
                >
                  {item.itemCompletionStatus ? "Mark as Pending" : "Mark as Completed"}
                </button>
                <button
                  onClick={() => {
                    setItemName(item.name); // Populate input with the item name for editing
                    setEditItemId(item.id); // Set item as being edited
                  }}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  style={styles.deleteButton}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No items available. Add one to get started!</p>
        )}
      </div>

      {/* Delete All Button */}
      {items.length > 0 && (
        <button
          onClick={() => setShowDeleteModal(true)}
          style={styles.deleteAllButton}
          disabled={loadingDeleteAll}
        >
          {loadingDeleteAll ? "Deleting All..." : "Delete All Items"}
        </button>
      )}

      {/* Modal for confirming deletion of all items */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Are you sure?</h3>
            <p>This will delete all items in the checklist. This action cannot be undone.</p>
            <div style={styles.modalActions}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={deleteAllItems}
                style={styles.confirmButton}
                disabled={loadingDeleteAll}
              >
                {loadingDeleteAll ? "Deleting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
  },
  addChecklistItem: {
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
  checklistItemContainer: {
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
  actions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
  },
  statusButton: {
    padding: "5px 10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "#ffc107",
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
  deleteAllButton: {
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

export default ChecklistDetailPage;
