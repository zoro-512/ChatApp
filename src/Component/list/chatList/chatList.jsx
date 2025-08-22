import { Box, Typography, IconButton, Avatar, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AddUser from './addUser';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../../lib/userStore';
import { addDoc, doc, collection, setDoc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import Checkbox from '@mui/material/Checkbox';
import Groups2Icon from '@mui/icons-material/Groups2';
import { useAddUserStore } from "../../../lib/addUserStore";
import { useChatStore } from '../../../lib/chatStore';

export default function ChatList() {
  const { isOpen, openBox, closeBox } = useAddUserStore();
  const [chat, setChat] = useState([]);
  const [inp, setInp] = useState('');
  const { currentUser } = useUserStore();
  const { changeChat, changeGrpChat } = useChatStore();

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
        } catch {
          return { ...item, user: null };
        }
      });

      const chatData = await Promise.all(promises);
      setChat(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => unSub();
  }, [currentUser?.id]);

  const [groupChats, setGroupChats] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "userGroup"), where("userId", "==", currentUser.id));
    const unSub = onSnapshot(q, async (snapshot) => {
      const groupPromises = snapshot.docs.map(async (docSnap) => {
        const groupId = docSnap.data().groupId;
        try {
          const groupRef = doc(db, "group", groupId);
          const groupDoc = await getDoc(groupRef);

          if (groupDoc.exists()) {
            return { id: groupId, ...groupDoc.data() };
          }
        } catch {
          return null;
        }
      });

      const groups = await Promise.all(groupPromises);
      const filtered = groups.filter(g => g !== null);
      setGroupChats(filtered);
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
    } catch {}
  };

  async function handleSelectGrp(group) {
    if (!group.name) {
      try {
        const docSnap = await getDoc(doc(db, "group", group.id));
        if (docSnap.exists()) {
          group = { ...group, name: docSnap.data().name };
        }
      } catch {}
    }

    changeGrpChat(group.id, group);
  }

  const [grp, setGrp] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'user'));
      const users = querySnapshot.docs
        .map(doc => doc.data())
        .filter(u => u.id !== currentUser.id);
      setAllUsers(users);
    };

    fetchUsers();
  }, []);

  const toggleUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length < 2) {
      alert("Please enter a group name and select at least 2 members.");
      return;
    }

    try {
      const newGroup = {
        name: groupName,
        createdBy: currentUser.id,
        members: [...selectedUsers, currentUser.id],
        createdAt: serverTimestamp(),
      };

      const grpRef = await addDoc(collection(db, "group"), newGroup);
      await setDoc(doc(db, "groupChat", grpRef.id), {
        name: groupName,
        messages: [],
      });

      const userGroupPromises = [...selectedUsers, currentUser.id].map(userId =>
        addDoc(collection(db, "userGroup"), {
          groupId: grpRef.id,
          userId,
          joinedAt: serverTimestamp(),
        })
      );

      await Promise.all(userGroupPromises);

      setGroupName('');
      setSelectedUsers([]);
      setGrp(false);
    } catch {}
  };

  const filtChat = chat.filter(c =>
    c.user?.username?.toLowerCase().includes(inp.toLowerCase())
  );

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
            onChange={(e) => setInp(e.target.value)}
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

        <IconButton onClick={openBox} sx={{ color: 'white' }}>
          <AddIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          m: 1,
        }}
      >
        <Button variant='contained' onClick={() => setGrp(!grp)} sx={{ backgroundColor: '#696a6b55' }}><Typography variant='h6'>New group</Typography></Button>
      </Box>
      {grp && <Box sx={{ height: 'auto', width: 'auto', backgroundColor: '#696a6b55' }}>
        <Typography variant="h6">Create Group</Typography>

        <input
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          style={{ padding: 8, marginBottom: 16, width: 'auto' }}
        />

        <Typography variant="subtitle1" sx={{ mb: 1 }}>Select members:</Typography>
        {allUsers.map((user) => (
          <Box key={user.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Checkbox
              checked={selectedUsers.includes(user.id)}
              onChange={() => toggleUser(user.id)}
            />
            <Avatar sx={{ mr: 1 }}>{user.username[0]}</Avatar>
            <Typography>{user.username}</Typography>
          </Box>
        ))}

        <Button
          variant="contained"
          onClick={handleCreateGroup}
          disabled={!groupName || selectedUsers.length < 2}
          sx={{ mt: 2 }}
        >
          Create Group
        </Button>
      </Box>}

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

      {isOpen && <AddUser />}

      <Box className="groupChats">
        {groupChats.map(group => (
          <Box key={group.id} onClick={() => handleSelectGrp(group)} sx={{ p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Groups2Icon fontSize='large'></Groups2Icon>
            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
              {group.name}
            </Typography>
            <Typography sx={{ color: 'gray', fontSize: '0.85rem' }}>
              Members: {group.members?.length || 0}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
