import CommonForm from "@/components/common/form";
import { useToast } from "@/hooks/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import shoppingImg from "@/assets/logImg.png";
import logo from "@/assets/logo1.png";
import bgImage from "@/assets/login.jpg"; // Same background as login

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: data?.payload?.message });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message || "Registration failed",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6">
        <img src={logo} alt="UrbanBasket Logo" className="w-44 md:w-64" />
        <div className="space-x-4 hidden md:block ">
          <Link
            to="/auth/login"
            className=" px-5 py-2 rounded-full bg-white text-red-600 font-semibold border border-red-300 hover:bg-red-100 transition"
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="px-5 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Register
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen backdrop-blur-md bg-white/40">
        {/* Left Side - Image + Quote */}
        <div className="hidden lg:flex flex-col justify-center items-center text-black p-10">
          <div className="text-center max-w-md space-y-6">
            <img
              src={shoppingImg}
              alt="Register Visual"
              className="w-[600px] rounded-xl mt-4"
            />
            <p className="text-lg font-medium">
              Trendy fashion, cool accessories & more – all in one place.
              Start your style journey now.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-col items-center justify-center px-6 sm:px-8 md:px-14 py-12">
          {/* Show brand on mobile */}
          <div className="block lg:hidden mb-6 text-center">
            <p className="text-sm text-black mt-1">
              Your style journey starts here.
            </p>
          </div>

          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg shadow-slate-400 p-8 sm:p-10 space-y-6 border border-gray-200">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">
                Create an Account
              </h2>
              <p className="text-sm text-gray-600">
                Already have an account?
                <Link
                  to="/auth/login"
                  className="ml-1 text-blue-600 hover:underline font-medium"
                >
                  Login
                </Link>
              </p>
            </div>

            <CommonForm
              formControls={registerFormControls}
              buttonText="Sign Up"
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
            <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 py-5 px-4 text-center text-sm text-gray-600">
        <p>
          &copy; 2024 <span className="font-semibold text-red-500">Divyanshi</span>. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default AuthRegister;
