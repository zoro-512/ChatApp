import { Avatar, Box, Button, Typography } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useState } from "react";

export default function AddUser() {
  const [user, setUser] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("userName");

    try {
      const userRef = collection(db, "user");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "30%",
        left: "30%",
        zIndex: 999,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#2f203266",
          backdropFilter: "blur(19px)",
          minWidth: "300px",
          maxWidth: "500px",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.2)",
          padding: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
          Add user
        </Typography>

        <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
          <input
            name="userName"
            type="text"
            placeholder="username"
            className="userName"
            style={{
              backgroundColor: "#2f203266",
              padding: "12px",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "8px",
              width: "100%",
              marginBottom: "15px",
              color: "white",
              fontSize: "16px",
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#731a8e",
              "&:hover": {
                backgroundColor: "#5a1570",
              },
              borderRadius: 2,
              padding: "10px 20px",
            }}
          >
            Search
          </Button>
        </Box>

        {user && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              padding: 2,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Avatar sx={{ bgcolor: "#731a8e" }}>
              {user.username?.[0]?.toUpperCase() || "?"}
            </Avatar>
            <Typography variant="h6" sx={{ color: "white" }}>
              {user.username}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
