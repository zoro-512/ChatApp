import { Avatar, Box, Button, Typography } from "@mui/material";

export default function AddUser() {
  return (
    <Box sx={{
      position: 'fixed', 
      top: '30%',         
      left: '30%',
      zIndex: 999
    }}>
      <Box sx={{
        backgroundColor: '#2f203266',
        backdropFilter: 'blur(19px)', 
        minWidth: '300px',           
        maxWidth: '500px',
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.2)',
        padding: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}> 
        <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
          Add user
        </Typography>
        
        <Box component="form" sx={{ mb: 2 }}>
          <input 
            type="text" 
            placeholder="username" 
            style={{
              backgroundColor: '#2f203266',
              padding: '12px',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              width: '100%',
              marginBottom: '15px',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              backgroundColor: '#731a8e',
              '&:hover': {
                backgroundColor: '#5a1570'
              },
              borderRadius: 2,
              padding: '10px 20px'
            }}
          >
            Search
          </Button>
        </Box>
         
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: 2,
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Avatar sx={{ bgcolor: '#731a8e' }}>A</Avatar>
          <Typography variant="h6" sx={{ color: 'white' }}>
            asfu
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}