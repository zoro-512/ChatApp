import {
  Box,
  Avatar,
  Typography,
  Button,
  Input,
  IconButton,
  SvgIcon,
} from '@mui/material';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db, googleProvider } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { sendEmailVerification } from "firebase/auth";

export default function Login() {
  const [overlayActive, setOverlayActive] = useState(true);
  const [load, setLoad] = useState(false);
  const [avtar, setAvtar] = useState({ file: null, url: '' });

  const handleOAuthLogin = async (provider, name) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, 'user', user.uid), {
        username: user.displayName || 'No Name',
        email: user.email,
        id: user.uid,
        photoURL: user.photoURL || '',
        blocked: [],
      }, { merge: true });

      await setDoc(doc(db, 'userChats', user.uid), { chats: [] }, { merge: true });

      toast.success(`Welcome ${user.displayName || user.email}!`);
    } catch (error) {
      toast.error(`${name} login failed: ${error.message}`);
      console.error(error);
    }
  };

  const handleAvt = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvtar({ file, url: URL.createObjectURL(file) });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoad(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Account logged in successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoad(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoad(true);
    const formData = new FormData(e.target);
    const { userName, email, password } = Object.fromEntries(formData);

    try {

      const res = await createUserWithEmailAndPassword(auth, email, password);
       const user = res.user;

    await sendEmailVerification(user);
    toast.info("📧 Verification email sent! Please check your inbox.");
    await user.reload();

      await setDoc(doc(db, 'user', res.user.uid), {
        username: userName,
        id: res.user.uid,
        blocked: [],
        photoURL: '',
        email: res.user.email,
      }, { merge: true });

      await setDoc(doc(db, 'userChats', res.user.uid), {
        chats: [],
      }, { merge: true });

      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoad(false);
    }
  };

  return (
    <Box>
<Box
  className="Login" 
  sx={{
    position:'relative',
    minHeight: '91.9vh',
    background: 'black',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    color: 'white',
    p: 4,
    position: 'relative',
    overflow: 'hidden',
  
  }}
>
  <Box sx={{ position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '50%',
    background: 'rgba(0, 0, 0, 1)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 1.2s ease-in-out',
     transform: overlayActive ? 'translateX(0%)' : 'translateX(100%)', 
    zIndex: 10,
  }}>
   <Typography
  variant="h3"
  sx={{
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    mb: 2,
    lineHeight: 1.2,
  }}
>
  Join the Conversation
</Typography>

<Typography
  variant="body1"
  sx={{
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '1.1rem',
    textAlign: 'center',
    maxWidth: '80%',
    mb: 4,
  }}
>
  Connect with friends, share ideas, and be part of something amazing.
  Experience seamless, real-time messaging like never before.
</Typography>

  <Button onClick={() => setOverlayActive(!overlayActive)}
   sx={{
    background: 'linear-gradient(217deg, rgba(201, 191, 191, 1) 0%, rgba(196, 192, 192, 1) 19%, rgba(10, 9, 10, 1) 69%, rgba(47, 27, 48, 1) 100%)',
    backgroundSize: '200%',
    backgroundPosition: 'left center',
    color: '#fff',
    px: 4,
    py: 1.5,
    borderRadius: '12px',
    transition: 'all 0.4s ease',
    '&:hover': {
      backgroundPosition: 'right center',
      transform: 'translateX(9px)', 
    },
  }}
    >{overlayActive?"Sign In" :"new"}</Button>
  </Box>

  {/* Sign In Section */}
  { <Box
    className="item"
    sx={{
      flex: 1,
      background: 'rgba(40, 40, 40, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(100,100,100,0.3)',
      borderRadius: '20px',
      padding: 5,
      height: '70vh',
      maxWidth: '50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      position: 'relative',
      zIndex: 1,
      transition: 'all 0.3s ease',
      opacity: overlayActive ? 0 : 1,
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
      }
    }}
  >



    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(45deg, #fff, #e0e0e0)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          mb: 2,
          textAlign: 'center'
        }}
      >
        Welcome Back
      </Typography>
      <Typography 
        variant="body1" 
        sx={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '1.1rem',
          fontWeight: 400,
          mb: 1
        }}
      >
        Sign in to continue your conversations
      </Typography>
      <Typography 
        variant="body2" 
        sx={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.9rem'
        }}
      >
        Connect instantly with friends and communities
      </Typography>
    </Box>
    
    <form style={{ width: '70%' }} onSubmit={handleLogin}>
      <Input 
        type="text" 
        placeholder="Email" 
        name="email" 
        fullWidth  
        disableUnderline={false}
        sx={{
          m: 2,
          backgroundColor: 'rgba(60, 60, 60, 0.6)',
          borderRadius: '12px',
          color: 'white',
          px: 2,
          py: 1.5,
          border: '1px solid rgba(100,100,100,0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(70, 70, 70, 0.7)',
            border: '1px solid rgba(120,120,120,0.4)',
          },
          '&:focus-within': {
            backgroundColor: 'rgba(80, 80, 80, 0.8)',
            border: '1px solid rgba(140,140,140,0.6)',
            transform: 'scale(1.02)',
          },
          '& input': {
            color: 'white',
            backgroundColor: 'transparent',
            '&::placeholder': {
              color: 'rgba(200,200,200,0.6)',
            }
          },
        }}
      />
      
      <Input 
        type="password" 
        placeholder="Password" 
        name="password" 
        fullWidth  
        sx={{
          m: 2,
          backgroundColor: 'rgba(60, 60, 60, 0.6)',
          borderRadius: '12px',
          color: 'white',
          px: 2,
          py: 1.5,
          border: '1px solid rgba(100,100,100,0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(70, 70, 70, 0.7)',
            border: '1px solid rgba(120,120,120,0.4)',
          },
          '&:focus-within': {
            backgroundColor: 'rgba(80, 80, 80, 0.8)',
            border: '1px solid rgba(140,140,140,0.6)',
            transform: 'scale(1.02)',
          },
          '& input': {
            color: 'white',
            backgroundColor: 'transparent',
            '&::placeholder': {
              color: 'rgba(200,200,200,0.6)',
            }
          },
        }} 
      />
      
      <Button 
        variant="contained" 
        type='submit' 
        fullWidth 
        sx={{
          m: 2,
          py: 1.5,
          borderRadius: '12px',
          background: 'linear-gradient(45deg, #333333, #4a4a4a)',
          fontWeight: 600,
          fontSize: '1rem',
          textTransform: 'none',
          boxShadow: '0 8px 25px rgba(60, 60, 60, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(45deg, #404040, #575757)',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 35px rgba(70, 70, 70, 0.5)',
          }
        }}
      >
        Sign In
      </Button>
    </form>
    <Typography variant='h7'>
      Or
    </Typography>
    <Box sx={{  display: 'flex', flexDirection: 'column', gap: 1 }}>
  <IconButton
  onClick={() => handleOAuthLogin(googleProvider, 'Google')}
  aria-label="Login with Google" // Essential for accessibility
  sx={{
    p: 1,
    transition: 'all 0.4s ease-in-out',
    boxShadow: '0 0 0px rgba(255, 255, 255, 0)', // Initial state for smooth transition
    '&:hover': {
      backgroundColor: 'transparent',
      filter: `
        drop-shadow(0 0 5px rgba(42, 43, 44, 0.6))
        drop-shadow(0 0 15px rgba(90, 135, 208, 0.72))
      `,
    },
  }}
>
  {/* Wrap the custom SVG in an SvgIcon component for better integration */}
  <SvgIcon viewBox="0 0 48 48" sx={{ fontSize: '48px' }}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,35.245,44,30.028,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </SvgIcon>
</IconButton>

</Box>
  </Box>}

  {/* Register Section */}
  { (
    <Box
      className="item"
      sx={{
        flex: 1,
        background: 'rgba(40, 40, 40, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(100,100,100,0.3)',
        borderRadius: '20px',
        padding: 5,
        height: '70vh',
        maxWidth: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1,
        transition: 'all 0.3s ease',
        opacity: overlayActive ? 1 : 0,
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
        }
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 ,m:0}}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #fff, #e0e0e0)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2,
            textAlign: 'center'
          }}
        >
          Create an Account
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem',
            fontWeight: 400,
            mb: 1
          }}
        >
          Join our chat community today
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.9rem'
          }}
        >
          Start meaningful conversations with people worldwide
        </Typography>
      </Box>

      <form onSubmit={handleRegister} style={{ width: '70%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <label 
            htmlFor="file" 
            style={{ 
              cursor: 'pointer', 
              display: 'block', 
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            {avtar.url ? (
              <img
                src={avtar.url}
                alt="avatar"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: 'auto',
                  border: '3px solid rgba(120,120,120,0.4)',
                  transition: 'all 0.3s ease',
                }}
              />
            ) : (
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 1,
                  background: 'linear-gradient(45deg, #333333, #4a4a4a)',
                  border: '3px solid rgba(120,120,120,0.4)',
                  fontSize: '2rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    border: '3px solid rgba(150,150,150,0.6)',
                  }
                }}
              >
                A
              </Avatar>
            )}
            <Typography 
              variant="body2" 
              sx={{
                color: 'rgba(200,200,200,0.8)',
                fontWeight: 500,
                mt: 1
              }}
            >
              Upload Image
            </Typography>
          </label>
        </Box>

        <Input type="file" id="file" sx={{ display: 'none' }} onChange={handleAvt} />

        <Input
          type="text"
          placeholder="Username"
          name="userName"
          fullWidth
          disableUnderline
          sx={{
            m: 1.5,
            backgroundColor: 'rgba(60, 60, 60, 0.6)',
            borderRadius: '12px',
            color: 'white',
            px: 2,
            py: 1.2,
            border: '1px solid rgba(100,100,100,0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(70, 70, 70, 0.7)',
              border: '1px solid rgba(120,120,120,0.4)',
            },
            '&:focus-within': {
              backgroundColor: 'rgba(80, 80, 80, 0.8)',
              border: '1px solid rgba(140,140,140,0.6)',
              transform: 'scale(1.02)',
            },
            '& input': {
              color: 'white',
              backgroundColor: 'transparent',
              '&::placeholder': {
                color: 'rgba(200,200,200,0.6)',
              }
            },
          }}
        />
        
        <Input
          type="text"
          placeholder="Email"
          name="email"
          fullWidth
          disableUnderline
          sx={{
            m: 1.5,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: 'white',
            px: 2,
            py: 1.2,
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
            },
            '&:focus-within': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255,255,255,0.5)',
              transform: 'scale(1.02)',
            },
            '& input': {
              color: 'white',
              backgroundColor: 'transparent',
              '&::placeholder': {
                color: 'rgba(255,255,255,0.7)',
              }
            },
          }}
        />
        
        <Input
          type="password"
          placeholder="Password"
          name="password"
          fullWidth
          disableUnderline
          sx={{
            m: 1.5,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: 'white',
            px: 2,
            py: 1.2,
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
            },
            '&:focus-within': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255,255,255,0.5)',
              transform: 'scale(1.02)',
            },
            '& input': {
              color: 'white',
              backgroundColor: 'transparent',
              '&::placeholder': {
                color: 'rgba(255,255,255,0.7)',
              }
            },
          }}
        />

        {!load && (
          <Button 
            variant="contained" 
            type="submit" 
            fullWidth 
            sx={{ 
              m: 1.5,
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #2d2d2d, #3d3d3d)',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 8px 25px rgba(50, 50, 50, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(45deg, #3a3a3a, #4a4a4a)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 35px rgba(60, 60, 60, 0.5)',
              }
            }}
          >
            Register
          </Button>
        )}
      </form>
    </Box>
  )}

  <ToastContainer position="bottom-right" />
</Box>
    </Box>
   
  );
}