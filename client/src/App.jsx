import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Correct import
import AuthLayout from "./components/auth/layout"; // Import your AuthLayout component
import AuthLogin from "./pages/auth/login"; // Import your Login component
import AuthRegister from "./pages/auth/register"; // Import your Register component
import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminOrder from "./pages/admin-view/order";
import AdminProduct from "./pages/admin-view/product";
import AdminFeature from "./pages/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found"; // Import your NotFound component
import ShoppingHome from "./pages/shopping-view/home"; 
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import CheckAuth from "./components/common/check-auth";
import { checkAuth } from "./store/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import UnauthPage from "./pages/unauth-page";
import PaypalReturn from "./pages/shopping-view/paypal-return";
import PaymentSuccess from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import EntrancePage from "./pages/enterance";
import GoogleLogins from "./components/auth/googleLogin";
import { LoadingBig } from "./components/common/loadingBig";
function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem('token'));
    dispatch(checkAuth(token));
  }, [dispatch]);

if (isLoading) {
  return (
    <div className='flex justify-center items-center h-screen bg-gradient-to-br from-[#ffe6e6] via-white to-[#fff6f0]'>
    <LoadingBig/>
    </div>
  )
}
  return (
    <div className="flex flex-col overflow-hidden bg-white">

      {/* Wrap Routes with Router */}
  
        <Routes>
           <Route path="/google-login" element={<GoogleLogins />} />
          <Route path="/" element={<EntrancePage/>} />
          <Route path="/auth" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
            </CheckAuth>
            }>
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>
          <Route path="/admin"   element={
             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
             </CheckAuth>
             }>
            {/* Add your AdminLayout component here */}
              <Route path="dashboard" element={<AdminDashboard/>}></Route>     
              <Route path="order" element={<AdminOrder/>}></Route>     
              <Route path="product" element={<AdminProduct/>}></Route>     
              <Route path="features" element={<AdminFeature/>}></Route>     
          </Route>
          <Route path="/shop" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
           <ShoppingLayout/>
             </CheckAuth>
             }>
               <Route path="home" element={<ShoppingHome/>}></Route>
               <Route path="listing" element={<ShoppingListing/>}></Route>
               <Route path="account" element={<ShoppingAccount/>}></Route>
               <Route path="checkout" element={<ShoppingCheckout/>}></Route>
               <Route path="paypal-return" element={<PaypalReturn/>}></Route>
               <Route path="payment-success" element={<PaymentSuccess/>}></Route>
               <Route path="search" element={<SearchProducts/>}></Route>
          </Route>
          <Route path="/unauth-page" element={<UnauthPage/>}> </Route>
          <Route path="*" element={<NotFound/>}/>
          
        </Routes>
   
    </div>
  );
}

export default App;
