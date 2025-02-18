import React from 'react';
import SignUpForm from '../components/Forms/SignUpForm';
import whiteLogo from '../../public/whiteLogo.png';

const Login = () => {
  return (
    <main className="flex min-h-screen">
      {/* Partie bleue (barre latérale) */}
      <div className="sm:w-[20%] md:w-[30%] sm:flex sm:flex-col py-5 w-0 bg-blue-menu relative -z-10">
        <p className="font-semibold mt-4 text-white text-3xl text-center">
          Bienvenue dans <br /> la plateforme <br />d’audit IT
        </p>

        {/* Logo centré en bas */}
        <div className="absolute bottom-5 ml-4  ">
          <img src={whiteLogo} alt="logo" className=" w-60" />
        </div>
      </div>

      {/* Partie blanche */}
      <div className="bg-white relative flex-1 flex justify-center items-center rounded-l-xl -ml-4 text-black shadow-lg">
        <SignUpForm title="Forvis Mazars" />
      </div>
    </main>
  );
};

export default Login;
