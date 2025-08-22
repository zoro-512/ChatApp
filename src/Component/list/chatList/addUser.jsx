import { Avatar, Box, Button, Typography } from "@mui/material";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useState } from "react";
import { useUserStore } from "../../../lib/userStore";
import { useAddUserStore } from "../../../lib/addUserStore";


export default function AddUser() {
  const { closeBox,isOpen } = useAddUserStore();
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

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

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userChats");
    
    try {
      const newChatRef = doc(chatRef);

      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverID: currentUser.id, 
          updatedAt: Date.now()
        })
      });

      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverID: user.id, 
          updatedAt: Date.now()
        })
      });

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: []
      });

      setUser(null);
      
    } catch (error) {
      console.log(error);
    }
  };
 if (!isOpen) return null;
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

       <Button variant="contained" onClick={closeBox}>close</Button>

        <Box component="form" onSubmit={handleSearch} sx={{ mb: 2,justifyContent:'center' }}>
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
              width: "85%",
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
            <Button 
              onClick={handleAdd}
              variant="contained"
              sx={{
                backgroundColor: "#731a8e",
                "&:hover": {
                  backgroundColor: "#5a1570",
                },
                borderRadius: 2,
              }}
            >
              add
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}