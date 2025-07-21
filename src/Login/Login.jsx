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
import { Password } from '@mui/icons-material';

export default function Login() {
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
  id: res.user.uid, // ✅ fixed here
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
   <Box
  className="Login" 
  sx={{
   
    minHeight: '91.9vh',
   backgroundImage: `linear-gradient(to right top, #282c34, #21252b, #1c1e22, #181a1c, #131517)`,
          
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    color: 'white',
    p: 4,
  }}
>
      {/* Sign In Section */}
      <Box
        className="item"
        sx={{
            flex:1,
          backgroundColor: '#36373920',
          backdropFilter: 'blur(19px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 4,
          padding: 4,
           height:'70vh',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent:'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome Back
        </Typography>
        <form style={{ width: '100%' }} onSubmit={handleLogin} >
          <Input type="text" placeholder="Email" name="email" fullWidth sx={{ mb: 2 ,color:'white'}} />
          <Input type="password" placeholder="Password" name="password" fullWidth sx={{ mb: 2 ,color:'white'}} />
          <Button variant="contained" type='submit' fullWidth>
            Sign In
          </Button>
        </form>
      </Box>

      {/* Register Section */}
      <Box
        className="item"
        sx={{
            flex:1,
          backgroundColor: '#36373920',
          backdropFilter: 'blur(19px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 4,
          padding: 4,
          height:'70vh',
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create an Account
        </Typography>

        <form onSubmit={handleRegister} style={{ width: '100%' }}>
          <label htmlFor="file" style={{ cursor: 'pointer', display: 'block', textAlign: 'center' }}>
            {avtar.url ? (
              <img
                src={avtar.url}
                alt="avatar"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: 'auto',
                }}
              />
            ) : (
              <Avatar sx={{ width: 72, height: 72, mx: 'auto', mb: 1 }}>A</Avatar>
            )}
            <Typography variant="body2" color="primary">
              Upload Image
            </Typography>
          </label>

          <Input type="file" id="file" sx={{ display: 'none' }} onChange={handleAvt} />
          <Input type="text" placeholder="Username" name="userName" fullWidth sx={{ mb: 2,color:'white' }} />
          <Input type="text" placeholder="Email" name="email" fullWidth sx={{ mb: 2 ,color:'white'}} />
          <Input type="password" placeholder="Password" name="password" fullWidth sx={{ mb: 2,color:'white' }} />
          {!load && <Button variant="contained" type='submit' fullWidth>
            Register
          </Button>}
        </form>
      </Box>
      <ToastContainer position="bottom-right" />

    </Box>
  );
}
