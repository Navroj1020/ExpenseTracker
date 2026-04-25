import React from 'react'
import{
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import UserProvider from './context/userContext';
import { useBackendWakeup } from "./hooks/useBackendWakeup";
import WakeupScreen from "./components/WakeupScreen";
import { Toaster } from "react-hot-toast"

const App = () => {
  const { status, elapsed } = useBackendWakeup();

  if (status === "waking") return <WakeupScreen elapsed={elapsed} />;
  
  if (status === "timeout") return (
    <WakeupScreen
      elapsed={elapsed}
      onRetry={() => window.location.reload()}
    />
  )
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Root />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/signUp' element={<SignUp />}/>
          <Route path='/dashboard' element={<Home />}/>
          <Route path='/income' element={<Income />}/>
          <Route path='/expense' element={<Expense />}/>
        </Routes>
      </Router>
    </div>
    <Toaster
      toastOptions={{
        className:"",
        style:{
          fontSize:"13px"
        }
      }}
      />
    </UserProvider>
  )
}

export default App;

// const Root = () =>{
//   // Check if token is in local storage
//   const isAuthenticated = !!localStorage.getItem("token");

//   //redirect to dashboard else go to login page
//   return isAuthenticated?(
//     <Navigate to="/dashboard"/>
//   ) : (
//     <Navigate to="/login"/>
//   )
  
// }
const Root = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />;
};
