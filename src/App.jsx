import { Box } from '@mui/material';
import List from './Component/list/list';
import Detail from './Component/dea/detail';
import Chat from './Component/chat/chat';
import Login from './Login/Login';
import Notification from './Notification/Notification';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from './lib/userStore';
import { auth } from './lib/firebase';
import { useChatStore } from './lib/chatStore';

export default function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

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

  if (isLoading) return <div style={{ color: 'white' }}>Loading...</div>;

  return (
    <>
      {currentUser ? (
        <Box
          sx={{
            backgroundImage: 'url("/cherry-blossom-scenery-4k-3840x2160-v0-x2r5r2qp2a1e1.webp")',
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
              backdropFilter: 'blur(19px)',
              border: '1px solid rgba(255,255,255,0.2)',
              width: '90vw',
              height: '90vh',
              borderRadius: 10,
              display: 'flex',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: '25%',
                height: '100%',
                borderRight: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <List />
              </Box>
            </Box>

            <Box
              sx={{
                width: '50%',
                height: '100%',
                borderRight: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                {chatId && <Chat />}
              </Box>
            </Box>

            <Box
              sx={{
                width: '25%',
                height: '100%',
                display: { xs: 'none', sm: 'none', md: 'none', lg: 'flex' },
                flexDirection: 'column',
              }}
            >
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Detail />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Login />
      )}

      <Notification />
    </>
  );
}
