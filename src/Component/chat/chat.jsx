import { Box, Typography, IconButton, Button, InputBase, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AddCallIcon from '@mui/icons-material/AddCall';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { useEffect, useRef, useState } from 'react';

import { doc, getDoc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { useChatStore } from '../../lib/chatStore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';

export default function ChatSection() {
  const [text, setText] = useState('');
  const [chat, setChat] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const endRef = useRef(null);

  const { currentUser } = useUserStore();
  const { chatId, user } = useChatStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji.native);
  };

  const handleSend = async () => {
    if (text === '') return;
    try {
      //seting actual data
      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: Date.now(),
        }),
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
         
      
        const userChatsRef = doc(db, 'userChats', id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatData = userChatsSnapshot.data();
          const chatIndex = userChatData.chats.findIndex((c) => c.chatId === chatId);

          //setting meta data
          if (chatIndex !== -1) {
            userChatData.chats[chatIndex].lastMessage = text;
            userChatData.chats[chatIndex].isSeen = id === currentUser.id;
            userChatData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatsRef, {
              chats: userChatData.chats,
            });
          }
        }
      })

      setText('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        className="top"
        sx={{
          flex: 0.3,
          borderBottom: '1px solid #ccc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <AccountCircleIcon sx={{ fontSize: 49 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', p: 0, m: 0 }}>
            <Typography variant="h6">{user?.username || 'Username'}</Typography>
            <Typography variant="body2" color="text.secondary">
              stats
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton><InfoIcon /></IconButton>
          <IconButton><VideoCallIcon /></IconButton>
          <IconButton><AddCallIcon /></IconButton>
        </Box>
      </Box>

      <Box
        className="mid"
        sx={{
          flex: 2.5,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
        }}
      >
   {chat?.messages?.map((message, index) => (
  <Box
    key={index}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: message.senderId === currentUser.id ? 'flex-end' : 'flex-start',
    }}
  >
    <Box
      sx={{
        bgcolor: message.senderId === currentUser.id ? '#4caf4f46' : '#1976d226',
        p: 1.5,
        borderRadius: 2,
        maxWidth: '70%',
        minWidth:'80px',
        color: 'white',
        wordBreak: 'break-word',
        position: 'relative',
        borderRadius: message.senderId === currentUser.id
      ? '30px 20px 0px 26px'   
      : '26px 30px 20px 0px',  
      }}
    >
      <Typography variant="body1" sx={{ wordBreak: 'break-word',color:'white' }}>
        {message.text}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          color: 'white',
          fontSize: '0.7rem',
          mt: 0.5,
          display: 'block',
          textAlign: 'right',
        }}
      >
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Typography>
    </Box>
  </Box>
))}

        <Box ref={endRef}></Box>
      </Box>

      <Box
        className="bottom"
        sx={{
          flex: 0.1,
          borderTop: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          gap: 1,
          position: 'relative',
          backgroundColor: 'rgba(0, 0, 0, 0.19)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <IconButton><InsertPhotoIcon /></IconButton>
        <IconButton><PhotoCameraIcon /></IconButton>
        <IconButton><MicIcon /></IconButton>

        <InputBase
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          sx={{
            flex: 1,
            px: 2,
            py: 1,
            borderRadius: 2,
            backgroundColor: '#ffffff10',
            color: 'white',
          }}
        />

        <IconButton onClick={() => setShowPicker((val) => !val)}>
          <EmojiEmotionsIcon />
        </IconButton>

        {showPicker && (
          <Box
            ref={pickerRef}
            sx={{
              position: 'absolute',
              bottom: '60px',
              right: '10px',
              zIndex: 100,
            }}
          >
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </Box>
        )}

        <IconButton onClick={handleSend}><SendIcon /></IconButton>
      </Box>
    </Box>
  );
}
