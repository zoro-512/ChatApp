import { Box, Typography, IconButton, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AddUser from './addUser';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../../lib/userStore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useChatStore } from '../../../lib/chatStore';

export default function ChatList() {
  const [chat, setChat] = useState([]);
  const [addUse, setAddUser] = useState(false);
  const [inp, setInp] = useState('');
  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser?.id) return;

    const unSub = onSnapshot(doc(db, "userChats", currentUser.id), async (res) => {
      const items = res.data()?.chats;

      if (!items || items.length === 0) {
        setChat([]);
        return;
      }

      const promises = items.map(async (item) => {
        try {
          const userDocRef = doc(db, "user", item.receiverID);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.exists() ? userDocSnap.data() : null;

          return { ...item, user };
        } catch (error) {
          console.log("Error fetching user data:", error);
          return { ...item, user: null };
        }
      });

      const chatData = await Promise.all(promises);
      setChat(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => unSub();
  }, [currentUser?.id]);

  const handleSelect = async (chatItem) => {
    const userChats = chat.map(item => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(item => item.chatId === chatItem.chatId);
    if (chatIndex !== -1) {
      userChats[chatIndex].isSeen = true;
    }

    const userChatRef = doc(db, "userChats", currentUser.id);

    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chatItem.chatId, chatItem.user);
    } catch (error) {
      console.log(error);
    }
  };

  const filtChat=chat.filter(c=>c.user.username.toLowerCase().includes(inp.toLowerCase()))

  return (
    <Box className="chatList" sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box className="search" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          className="searchBar"
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#363739',
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
            onChange={(e)=>setInp(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor: '#363739',
              width: '100%',
              fontSize: '16px',
              color: "white"
            }}
          />
        </Box>

        <IconButton onClick={() => setAddUser(!addUse)} sx={{ color: 'white' }}>
          <AddIcon />
        </IconButton>
      </Box>

      <Box className="us">
        {chat && chat.length > 0 ? (
          filtChat.map((chatItem, index) => (
            <Box
              key={chatItem.chatId || index}
              onClick={() => handleSelect(chatItem)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                backgroundColor: chatItem.isSeen ? 'rgba(255,255,255,0.1)' : "#731a8e",
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2
                }
              }}
            >
              <Avatar sx={{ bgcolor: "#731a8e" }}>
                {chatItem.user?.username?.[0]?.toUpperCase() || "?"}
              </Avatar>
              <Box>
                                <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
  {(chatItem.user?.blocked || []).includes(currentUser.id)
    ? "User"
    : chatItem.user?.username || "Unknown User"}
</Typography>



                <Typography sx={{ color: 'gray', fontSize: '0.9rem' }}>
                  {chatItem.lastMessage || "No messages yet"}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography sx={{ color: 'gray', textAlign: 'center', mt: 2 }}>
            No chats yet
          </Typography>
        )}
      </Box>

      {addUse && <AddUser />}
    </Box>
  );
}
