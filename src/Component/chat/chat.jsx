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
import { toast } from 'react-toastify';


import { doc, getDoc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { useChatStore } from '../../lib/chatStore';
import { db } from '../../lib/firebase';
import { useUserStore } from '../../lib/userStore';
import { Group } from '@mui/icons-material';

export default function ChatSection() {
  const [text, setText] = useState('');
  const [chat, setChat] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const endRef = useRef(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const { currentUser } = useUserStore();
  const { chatId, user,isCurrentUserBlocked,  isReceiverUserBlocked,changeBlock,isGroup,groupName } = useChatStore();

  useEffect(() => {
  const fetchGroupMembers = async () => {
    if (!isGroup || !chatId) return;

    try {
      const groupDoc = await getDoc(doc(db, "group", chatId));
      if (!groupDoc.exists()) return;

      const groupData = groupDoc.data();
      const memberIds = groupData.members || [];

      const memberPromises = memberIds.map((id) => getDoc(doc(db, "user", id)));
      const memberDocs = await Promise.all(memberPromises);

      const memberNames = memberDocs
        .map((docSnap) => docSnap.exists() ? docSnap.data().username : "Unknown")
        .filter(Boolean); // Remove nulls

      setGroupMembers(memberNames);
    } catch (err) {
      console.error("Error fetching group members:", err);
    }
  };

  fetchGroupMembers();
}, [chatId, isGroup]);

  
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  useEffect(() => {
  if (!chatId) return;

  const collectionName = isGroup ? 'groupChat' : 'chats';

  const unSub = onSnapshot(doc(db, collectionName, chatId), (res) => {
    setChat(res.data());
  });

  return () => unSub();
}, [chatId, isGroup]);

const getGroupName = async (groupId) => {
  try {
    const groupRef = doc(db, "group", groupId);
    const groupSnap = await getDoc(groupRef);

    if (groupSnap.exists()) {
      const groupData = groupSnap.data();
      return groupData.name || null;
    } else {
      console.warn("No such group found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching group name:", error);
    return null;
  }
};

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
  const trimmedText = text.trim();
  if (trimmedText === '' || !chatId) return;

  if (!isGroup) {
    if (isCurrentUserBlocked) {
      toast.error("You are blocked and cannot send messages.");
      return;
    }
    if (isReceiverUserBlocked) {
      toast.error("You have blocked this user. Unblock to send messages.");
      return;
    }
  }

  try {
    const messageData = {
      senderId: currentUser.id,
      text: trimmedText,
      createdAt: Date.now(),
    };

    if (isGroup) {
      messageData.senderName = currentUser.username || "Unknown";
    }
    await updateDoc(doc(db, isGroup ? 'groupChat' : 'chats', chatId), {
      messages: arrayUnion(messageData),
    });

    if (!isGroup && user?.id) {
      const userIDs = [currentUser.id, user.id];

      await Promise.all(
        userIDs.map(async (id) => {
          const userChatsRef = doc(db, 'userChats', id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data();
            const chatIndex = userChatData.chats.findIndex((c) => c.chatId === chatId);

            if (chatIndex !== -1) {
              userChatData.chats[chatIndex].lastMessage = trimmedText;
              userChatData.chats[chatIndex].isSeen = id === currentUser.id;
              userChatData.chats[chatIndex].updatedAt = Date.now();

              await updateDoc(userChatsRef, {
                chats: userChatData.chats,
              });
            }
          }
        })
      );
    }

    setText('');
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message.");
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
           <Typography variant="h6">
  {isGroup ? chat?.name || groupName : user?.username || "Username"}
</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
  {isGroup ? groupMembers.join(', ') : "Online"}
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
  {chat?.messages?.map((message, index) => {
    const isOwnMessage = message.senderId === currentUser.id;
    return (
      <Box
        key={index}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
        }}
      >
        {/* Show sender name only in group chat and if not own message */}
        {isGroup && !isOwnMessage && (
          <Typography
            variant="h8"
            sx={{ color: '#ff9900ff', mb: '2px', ml: 1 }}
          >
            {message.senderName || "Unknown"}
          </Typography>
        )}

        <Box
          sx={{
            bgcolor: isOwnMessage ? '#4caf4f46' : '#1976d226',
            p: 1.5,
            borderRadius: isOwnMessage
              ? '30px 20px 0px 26px'
              : '26px 30px 20px 0px',
            maxWidth: '70%',
            minWidth: '80px',
            color: 'white',
            wordBreak: 'break-word',
            position: 'relative',
          }}
        >
          <Typography
            variant="body1"
            sx={{ wordBreak: 'break-word', color: 'white' }}
          >
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
    );
  })}

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

        <IconButton disabled={isCurrentUserBlocked || isReceiverUserBlocked } onClick={handleSend}><SendIcon /></IconButton>
      </Box>
    </Box>
  );
}
