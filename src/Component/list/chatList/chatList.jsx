import { Box, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddUser from './addUser';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../../lib/userStore';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function ChatList() {
  const [chat,setChat]=useState([]);
  const [addUse,setAddUser]=useState(false);
  const { currentUser } = useUserStore();

  useEffect(() => {
  const unSub = onSnapshot(doc(db, "userChats", currentUser.id), async (res) => {
    const items = res.data()?.chats;

    if (!items || items.length === 0) {
      setChat([]); // clear chat list if no chats
      return;
    }

    const promises = items.map(async (item) => {
      const userDocRef = doc(db, "user", item.userId);
      const userDocSnap = await getDoc(userDocRef);
      const user = userDocSnap.exists() ? userDocSnap.data() : null;

      return { ...item, user };
    });

    const chatData = await Promise.all(promises);
    setChat(chatData.sort((a,b)=>b.updatedAt-a.updatedAt));
  });

  return () => unSub();
}, [currentUser.id]);

  
  return (
    <Box className="chatList" sx={{ display: 'flex', flexDirection: 'column', p: 2}}>
      <Box className="search" sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
       
        <Box
          className="searchBar"
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor:'#363739',
       backdropFilter: 'blur(19px)', 
            padding: '6px 12px',
            borderRadius: 2,
            flex: 1,
            
          }}
        >
          <SearchIcon sx={{ color: 'gray', mr: 1 }} />
          <input
            type="text"
            placeholder="Search..."
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor:'#363739',
              width: '100%',
              fontSize: '16px',
              color:"white"
            }}
          />
        </Box>

        {/* Add icon button */}
        <IconButton onClick={()=>setAddUser(!addUse)}>
          <AddIcon />
        </IconButton>
      </Box>
      <Box className="us" >

       {chat.map((chat) => (
  <Box key={chat.userId} sx={{ display: 'flex', gap: 2, p: 2 }}>
    <Avatar />
    <Typography>{chat.user?.username || "Unknown User"}</Typography>
  </Box>
))}
        
               

      </Box>
     {addUse&& <AddUser />}
    </Box>
  );
}
