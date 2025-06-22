import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store/store.js'; 
import { Toaster } from './components/ui/toaster';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
   <Provider store={store}>
          <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
    <Toaster/>
   </Provider>
    </BrowserRouter>

)
