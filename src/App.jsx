import { Box, IconButton } from '@mui/material';
import List from './Component/list/list';
import Detail from './Component/dea/detail';
import Chat from './Component/chat/chat';
import Login from './Login/Login';
import Notification from './Notification/Notification';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from './lib/userStore';
import { auth } from './lib/firebase';
import { useChatStore } from './lib/chatStore';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId, changeChat } = useChatStore();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showList, setShowList] = useState(true); // for mobile toggle

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserInfo(user.uid);
      } else {
        fetchUserInfo(null);
      }
    });

    return () => unSub();
  }, [fetchUserInfo]);

  useEffect(() => {
    if (isMobile) {
      setShowList(!chatId); // hide list when chat is selected
    }
  }, [chatId, isMobile]);

  if (isLoading) return <div style={{ color: 'white' }}>Loading...</div>;

  return (
    <>
      {currentUser ? (
        <Box
          sx={{
            backgroundImage: 'url("/jm3kocgn1eef1.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              backgroundColor: '#1a778e3a',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              width: { xs: '100vw', md: '90vw' },
              height: { xs: '100vh', md: '90vh' },
              borderRadius: 2,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Chat List - Only show on mobile when showList is true */}
            {(!chatId || showList || !isMobile) && (
              <Box
                sx={{
                  width: { xs: '100%', md: '25%' },
                  height: { xs: '100%', md: '100%' },
                  borderRight: { md: '1px solid rgba(255,255,255,0.2)' },
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 1,
                }}
              >
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <List />
                </Box>
              </Box>
            )}

            {/* Chat Section */}
            {chatId && (
              <Box
                sx={{
                  width: { xs: '100%', md: '50%' },
                  height: '100%',
                  borderRight: { md: '1px solid rgba(255,255,255,0.2)' },
                  position: 'relative',
                }}
              >
                {isMobile && (
                  <IconButton
                    onClick={() => {
                      setShowList(true);
                      changeChat(null, null);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 10,
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                )}
                <Chat />
              </Box>
            )}

            {/* Detail - Only for desktop */}
            {!isMobile && (
              <Box
                sx={{
                  width: '25%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Detail />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Login />
      )}

      <Notification />
    </>
  );
}
