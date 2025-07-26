import {
  Box,
  Avatar,
  Typography,
  Button,
  Input,
} from '@mui/material';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Password, Translate } from '@mui/icons-material';

export default function Login() {
  const [overlayActive, setOverlayActive] = useState(true);
  const [cr,setCr]=useState(false);
  const [load,setLoad]=useState(false);
  const [avtar, setAvtar] = useState({
    file: null,
    url: ''
  });

  const handleAvt = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvtar({
        file: file,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleLogin=async (e)=>{
     e.preventDefault();
 const formData = new FormData(e.target);
  const { email, password } = Object.fromEntries(formData);

  try {
    await signInWithEmailAndPassword(auth,email,password)
    toast.success("Account logged in successfully!");
  } catch (error) {
    toast.error(error.message);
  }
  finally{
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

   await setDoc(doc(db, 'user', res.user.uid), {
  username: userName,
  id: res.user.uid, 
  blocked: [],
});


    await setDoc(doc(db,'userChats',res.user.uid),{
      chats:[],
    });


    toast.success("Account created successfully!");
  } catch (error) {
    toast.error(error.message);
  }
  finally{
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
    transition: 'transform 0.3s ease-in-out',
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
