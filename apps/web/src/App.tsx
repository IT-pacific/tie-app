import { useEffect } from "react";
import Routers from "./Routers/Routers";
import {Toaster} from "react-hot-toast"
import io, { Socket } from 'socket.io-client';
import { useAppSelector } from "./store/store";
import { useDispatch } from "react-redux";
import { addNotification } from "./store/reducers/notificationReducer";
import { Notification } from "./types";
import { GoogleOAuthProvider } from '@react-oauth/google';

interface ServerToClientEvents {
  registered: (message: string) => void;
  new_notification:(notification:Notification)=>void
}

interface ClientToServerEvents {
  register: (userId: string) => void;
  joinRoom: (roomName: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:8000');
const App = () => {
  const dispatch=useDispatch()
  const {user}=useAppSelector((state)=>state.auth)
  useEffect(() => {
    
    socket.on('connect', () => {
      socket.on('new_notification', (notification:Notification) => {
        dispatch(addNotification(notification))
      })
      
    });
    socket.on('registered', () => {
      socket.emit('joinRoom', user?.user_id?user?.user_id:"");
      
  });
   
    
    socket.emit('register', user?.user_id?user?.user_id:"");
    return () => {
      // socket.disconnect();
    };
  }, [user]);
  return <>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
      <Routers/>
  <Toaster toastOptions={{
    duration: 3000,
    position:"top-center"
  }}/>
    </GoogleOAuthProvider>;

  
  </>;
};

export default App;
