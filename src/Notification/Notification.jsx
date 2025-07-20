import { Box } from '@mui/material';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function Notification() {
  return (
    <Box>
      <ToastContainer position="bottom-right" autoClose={3000} style={{ zIndex: 9999 }}/>
    </Box>
  );
}
