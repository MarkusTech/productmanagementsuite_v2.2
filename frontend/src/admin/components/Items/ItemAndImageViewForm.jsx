import React, { useState, useEffect } from "react";
import { Button, Grid, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ItemAndImageViewForm = ({ itemID, closeForm }) => {
  const [itemData, setItemData] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItemData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/v1/item-images/${itemID}`);

        if (!response.ok) {
          throw new Error("Failed to fetch item data");
        }

        const data = await response.json();

        if (data && data.success) {
          setItemData(data.data);
          setImages(data.data.images || []);
        } else {
          setError("Failed to fetch item data");
        }
      } catch (err) {
        console.error("Error fetching item data:", err);
        setError("Error fetching item data");
      } finally {
        setLoading(false);
      }
    };

    loadItemData();
  }, [itemID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.formContainer}>
      <IconButton
        style={styles.closeButton}
        onClick={closeForm}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <h1
        style={{ marginTop: "20px", fontWeight: "bold", textAlign: "center" }}
      >
        ITEM DETAILS AND IMAGES
      </h1>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Item Code"
            value={itemData.itemCode || ""}
            variant="outlined"
            fullWidth
            style={styles.textField}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Item Name"
            value={itemData.itemName || ""}
            variant="outlined"
            fullWidth
            style={styles.textField}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Category"
            value={itemData.categoryID || ""}
            variant="outlined"
            fullWidth
            style={styles.textField}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Price"
            value={itemData.price || ""}
            variant="outlined"
            fullWidth
            style={styles.textField}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Cost"
            value={itemData.cost || ""}
            variant="outlined"
            fullWidth
            style={styles.textField}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={itemData.description || ""}
            variant="outlined"
            fullWidth
            style={styles.textField}
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {images.length > 0 ? (
              images.map((image, index) => (
                <Grid item xs={4} key={image.id}>
                  <img
                    src={`http://localhost:5000/${image.url.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt="Item"
                    style={styles.image}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <p>No images available</p>
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={closeForm}
            fullWidth
          >
            Close
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

const styles = {
  formContainer: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1000px",
    height: "850px",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "10px",
    zIndex: 1000,
    overflow: "auto",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
  },
  textField: {
    marginBottom: "10px",
  },
  image: {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "5px",
  },
};

export default ItemAndImageViewForm;
