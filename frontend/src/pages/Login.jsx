import React from 'react';
import SignUpForm from '../components/Forms/SignUpForm';
import logoWithShadow from '../assets/images/logoWithShadow.png';
const Login = () => {
  return (
    <main className=" flex min-h-screen">
      {/* Partie bleue (barre latérale) */}
      <div className="sm:w-[20%] md:w-[30%] sm:flex sm:flex-col py-5 sm:justify-between sm:gap-2 w-0 bg-blue-menu relative -z-10">
        <p className='font-semibold mt-4 text-white text-3xl  text-center'>
        Bienvenue dans <br /> la plateforme <br />d’audit IT
        </p>
        <div c>
            <img src={logoWithShadow} alt="" />
        </div>
      </div>

      {/* Partie blanche qui déborde légèrement */}
      <div className="bg-white relative flex-1 flex justify-center items-center rounded-l-xl -ml-4 text-black shadow-lg">
        <SignUpForm  title="Forvis Mazars" />
      </div>
    </main>
  );
};

export default Login;
