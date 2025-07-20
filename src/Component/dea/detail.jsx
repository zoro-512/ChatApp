import {
  Box,
  Avatar,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';

export default function Detail() {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth:'90vw',
        maxWidth: 320,
        height: '100vh', // 🔥 important for scroll to work
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      {/* Profile */}
      <Box sx={{ textAlign: 'center' }}>
        <Avatar sx={{ width: 72, height: 72, mx: 'auto', mb: 1 }}>A</Avatar>
        <Typography variant="h6">Jane Doe</Typography>
        <Typography variant="body2" color="gray">
          Lorem ipsum dolor sit amet.
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Accordions */}
      <Accordion sx={{ background: 'transparent', color: 'white' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
          <Typography>Chat Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">Theme, Notifications etc.</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ background: 'transparent', color: 'white' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
          <Typography>Privacy & Help</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2">Blocked users, support links, etc.</Typography>
        </AccordionDetails>
      </Accordion>

      <Box sx={{overflow:'auto', maxHeight:'40vh'}}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Shared Photos
        </Typography>

        <List>
          {Array.from({ length: 10 }).map((_, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <IconButton edge="end" aria-label="download">
                  <DownloadIcon sx={{ color: 'white' }} />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  src="https://via.placeholder.com/40"
                  alt={`photo_${i}`}
                />
              </ListItemAvatar>
              <ListItemText primary={`photo_2024_${i}.png`} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box >
        <Button sx={{backgroundColor:'rgba(254, 1, 1, 0.54)',color:'white', width:'100%'}}>
            BLOCK
        </Button>
      </Box>
    </Box>
  );
}
