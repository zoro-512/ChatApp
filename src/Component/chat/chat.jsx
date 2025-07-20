import { Box, Typography, IconButton,Button, InputBase } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import AddCallIcon from '@mui/icons-material/AddCall';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MicIcon from '@mui/icons-material/Mic';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useEffect, useRef, useState } from 'react';
import { red } from '@mui/material/colors';

export default function ChatSection() {
    const [text, setText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const endRef = useRef(null);
  useEffect(()=>{
   endRef.current?.scrollIntoView({behaviour:'smooth'});
},[])
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
        
        <Box sx={{ display: 'flex', alignItems: 'center',justifyContent:'center', gap: 1 }}>
          <AccountCircleIcon sx={{ fontSize: 49 }} />
        
                  <Box sx={{ display: 'flex', flexDirection: 'column' ,p:0,m:0}}>
                  <Typography variant="h6">userName</Typography>
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
  <Box
    className="their"
    sx={{
      display: 'flex',
      justifyContent: 'flex-start',
    }}
  >
    <Box
      sx={{
        bgcolor: '#3692f445', 
        p: 1.5,
        borderRadius: 2,
        maxWidth: '70%',
        color: 'white',
      }}
    >
      Lorem ipsum dolor sit amet consectetur adipisicing asdasdasdelit...
    </Box>
  </Box>
  <Box
    className="own"
    sx={{
      display: 'flex',
      justifyContent: 'flex-end',
    }}
  >
    <Box
      sx={{
        bgcolor: '#4caf4f46', // green
        p: 1.5,
        borderRadius: 2,
        maxWidth: '70%',
        color: 'white',
      }}
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit...
    </Box>
  </Box>

   <Box
    className="their"
    sx={{
      display: 'flex',
      justifyContent: 'flex-start',
    }}
  >
    <Box
      sx={{
        bgcolor: '#3692f445', 
        p: 1.5,
        borderRadius: 2,
        maxWidth: '70%',
        color: 'white',
      }}
    >
      Lorem ipsum dolor sit amet consectetur adipisicing asdasdasdelit...
    </Box>
  </Box>
  <Box
    className="own"
    sx={{
      display: 'flex',
      justifyContent: 'flex-end',
    }}
  >
    <Box
      sx={{
        bgcolor: '#4caf4f46', // green
        p: 1.5,
        borderRadius: 2,
        maxWidth: '70%',
        color: 'white',
      }}
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit...
    </Box>
  </Box>

   <Box
    className="their"
    sx={{
      display: 'flex',
      justifyContent: 'flex-start',
    }}
  >
    <Box
      sx={{
        bgcolor: '#3692f445', 
        p: 1.5,
        borderRadius: 2,
        maxWidth: '70%',
        color: 'white',
      }}
    >
      Lorem ipsum dolor sit amet consectetur adipisicing asdasdasdelit...
    </Box>
  </Box>
  <Box
    className="own"
    sx={{
      display: 'flex',
      justifyContent: 'flex-end',
      
    }}
  >
    <Box
      sx={{
        bgcolor: '#4caf4f46', // green
        p: 1.5,
        borderRadius: 2,
        maxWidth: '70%',
        color: 'white',
      }}
    >
      Lorem ipsum dolor sit amet consectetur adipisicing elit...
    </Box>
   </Box>


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
        backgroundColor: 'rgba(0, 0, 0, 0.19)', // optional glass style
        backdropFilter: 'blur(8px)', // optional
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

      <IconButton><SendIcon /></IconButton>
    </Box>
    </Box>
  );
}
