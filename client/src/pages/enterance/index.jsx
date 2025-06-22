import { Link } from 'react-router-dom';
import logo from '@/assets/logo1.png'; // UrbanBasket logo
import modelImage from '@/assets/model.png'; // Aesthetic model image

function EnterancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ffe6e6] via-white to-[#fff6f0] relative overflow-hidden flex flex-col">
<header className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
  <div className="flex justify-between items-center w-full sm:w-auto">
    <img src={logo} alt="UrbanBasket Logo" className="w-40 md:w-56" />
  </div>
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
    <Link
      to="/auth/login"
      className="px-5 py-2 rounded-full bg-white text-red-600 font-semibold border border-red-300 hover:bg-red-100 transition text-center"
    >
      Login
    </Link>
    <Link
      to="/auth/register"
      className="px-5 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition text-center"
    >
      Register
    </Link>
  </div>
</header>

  
      <main className="flex-grow flex flex-col-reverse lg:flex-row items-center justify-between px-8 md:px-16 lg:px-24 pt-32 lg:pt-40 pb-16 relative z-10">
      
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Where Trends Begin <br />
            Only at <span className="text-red-500">StyleIn</span>
          </h1>

          <p className="text-gray-700 text-lg md:text-xl">
            Discover the trendiest outfits, accessories, and deals tailored just for you.
            Fashion made effortless and fabulous.
          </p>
          <div className="pt-4">
            <Link
              to="/shop/home"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow hover:bg-red-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        </div>

     
        <div className="w-full lg:w-1/2 flex justify-center relative mt-24 md:mt-0">
          <img
            src={modelImage}
            alt="Fashion Model"
            className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl drop-shadow-2xl z-20"
          />

          {/* Text overlay above model on mobile */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 lg:hidden bg-white/70 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg">
            <p className="text-gray-800 font-semibold text-lg">Unleash Your Look 💃</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 py-5 px-4 text-center text-sm text-gray-600">
        <p>
          &copy; 2024 <span className="font-semibold text-red-500">Divyanshi</span>. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default EnterancePage;
