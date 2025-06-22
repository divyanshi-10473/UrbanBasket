import { Outlet } from "react-router-dom";
import shoppingImg from "@/assets/man.jpg"; 

function AuthLayout() {
  return (
    <div >
     
      {/* <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-pink-500 via-red-400 to-yellow-300 text-white w-1/2 p-10">
        <div className="text-center max-w-md space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-snug">
            Welcome to <br /> <span className="text-white">UrbanBasket 🛒</span>
          </h1>
          <p className="text-lg font-medium">
            Your one-stop destination for fashion, lifestyle & accessories at great prices!
          </p>
          <img
            src={shoppingImg}
            alt="Shopping"
            className="rounded-xl shadow-xl mt-6 w-full max-w-xs"
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-12"> */}
        {/* <div className="w-full max-w-md"> */}
          <Outlet />
        {/* </div> */}
      {/* </div> */}
    </div>
  );
}

export default AuthLayout;
