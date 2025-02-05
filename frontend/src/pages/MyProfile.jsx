import React from "react";
import SideBar from "../components/sideBar/SideBar";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EmailIcon from "@mui/icons-material/Email";
import PasswordChange from "../components/Forms/PasswordChange";
const MyProfile = () => {
  const initials = "TM";
  const nom = "Mecherak";
  const prenom = "Thanina";
  const grade = "Stagiaire – Consultante IT";
  const numerotel = "0779594222";
  const email = "email@email.com";

  return (
    <main className="flex flex-wrap sm:min-h-screen  bg-gray-100">
      {/* Barre latérale */}
     
      <SideBar userRole="admin" />
      {/* Contenu principal */}
      <div className="bg-white min-h-screen flex overflow-auto flex-1 items-center justify-center p-6   rounded-lg">
        <div className="  flex flex-col  gap-96 sm:flex sm:relative sm:flex-row sm:gap-x-96  ">
          <div className="flex    flex-col h-1/2 items-center space-y-20">
            
            <div className="flex flex-col  items-center ">


                {/* Avatar avec initiales */}
              <div className="flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full">
                <span className="text-blue-500 text-xl font-medium">
                  {initials}
                </span>
              </div>

              <div className="text-center">
                {/* Nom et grade */}
                <p className="text-black font-semibold text-lg">
                  {nom} {prenom}
                </p>
                <p className="text-gray-500 font-normal text-lg">{grade}</p>
              </div>
            </div>

            {/* Contact (téléphone & email) */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-xl">
                  <PhoneInTalkIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                </div>
                <p className="text-gray-500 font-normal">{numerotel}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-xl">
                  <EmailIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                </div>
                <p className="text-gray-500 font-normal">{email}</p>
              </div>
            </div>
          </div>
          <div className="relative   ">
            <PasswordChange />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyProfile;
