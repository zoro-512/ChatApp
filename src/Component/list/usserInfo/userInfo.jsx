import { Box } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddCallIcon from '@mui/icons-material/AddCall';

export default function UserInfo() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2,
        borderBottom: '3px solid #ccc',
      }}
    >
      {/* Left side: User avatar */}
      <Box>
        <PersonIcon fontSize="large" />
      </Box>

      {/* Right side: Action icons */}
      <Box sx={{ display: 'flex', gap: '10px' }}>
        <MoreHorizIcon />
        <AddCallIcon />
        <VideoCallIcon />
      </Box>
    </Box>
  );
}
