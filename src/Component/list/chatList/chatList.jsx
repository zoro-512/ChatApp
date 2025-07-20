import { Box, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddUser from './addUser';
import { useState } from 'react';

export default function ChatList() {
  const [addUse,setAddUser]=useState(false);
  return (
    <Box className="chatList" sx={{ display: 'flex', flexDirection: 'column', p: 2}}>
      <Box className="search" sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
       
        <Box
          className="searchBar"
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor:'#363739',
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
            style={{
              border: 'none',
              outline: 'none',
              backgroundColor:'#363739',
              width: '100%',
              fontSize: '16px',
              color:"white"
            }}
          />
        </Box>

        {/* Add icon button */}
        <IconButton onClick={()=>setAddUser(!addUse)}>
          <AddIcon />
        </IconButton>
      </Box>
      <Box className="us" >
        <Box className="item" sx={{ display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
           borderBottom: '1px solid #ccc',
           p:2,
          gap: 4,}}>
            <AccountCircleIcon sx={{fontSize:34}}/>
            <Typography variant='h6'>user</Typography>
        </Box>
                <Box className="item" sx={{ display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
           borderBottom: '1px solid #ccc',
           p:2,
          gap: 4,}}>
            <AccountCircleIcon sx={{fontSize:34}}/>
            <Typography variant='h6'>user</Typography>
        </Box>
                <Box className="item" sx={{ display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
           borderBottom: '1px solid #ccc',
           p:2,
          gap: 4,}}>
            <AccountCircleIcon sx={{fontSize:34}}/>
            <Typography variant='h6'>user</Typography>
        </Box>
                <Box className="item" sx={{ display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
           borderBottom: '1px solid #ccc',
           p:2,
          gap: 4,}}>
            <AccountCircleIcon sx={{fontSize:34}}/>
            <Typography variant='h6'>user</Typography>
        </Box>
                <Box className="item" sx={{ display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
           borderBottom: '1px solid #ccc',
           p:2,
          gap: 4,}}>
            <AccountCircleIcon sx={{fontSize:34}}/>
            <Typography variant='h6'>user</Typography>
        </Box>
                <Box className="item" sx={{ display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
           borderBottom: '1px solid #ccc',
           p:2,
          gap: 4,}}>
            <AccountCircleIcon sx={{fontSize:34}}/>
            <Typography variant='h6'>user</Typography>
        </Box>
                <Box className="item" sx={{ display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
           borderBottom: '1px solid #ccc',
           p:2,
          gap: 4,}}>
            <AccountCircleIcon sx={{fontSize:34}}/>
            <Typography variant='h6'>user</Typography>
        </Box>
                <Box className="item" sx={{ display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
           borderBottom: '1px solid #ccc',
           p:2,
          gap: 4,}}>
            <AccountCircleIcon sx={{fontSize:34}}/>
            <Typography variant='h6'>user</Typography>
        </Box>
        

      </Box>
     {addUse&& <AddUser />}
    </Box>
  );
}
