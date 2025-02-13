import React from "react";
import SideBar from "../components/sideBar/SideBar";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EmailIcon from "@mui/icons-material/Email";
import PasswordChange from "../components/Forms/PasswordChange";
import HeaderBis from "../components/Header/HeaderBis";

const MyProfile = () => {
  const user = {
    initials: "TM",
    nom: "Mecherak",
    prenom: "Thanina",
    grade: "Stagiaire – Consultante IT",
    numerotel: "0779594222",
    email: "email@email.com"
  };

  return (
    <div className="flex flex-wrap min-h-screen bg-gray-100">
      <SideBar userRole="admin" />
      <div className="flex-1  flex flex-col bg-white overflow-auto  ">
        <HeaderBis />
        <div className="flex flex-col items-center justify-center  sm:flex-row gap-20 items-center">
          <div className="flex flex-col items-center space-y-6  p-14 m-10 sm:p-0 ">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-xl font-medium">
              {user.initials}
            </div>
            <div className="text-center">
              <p className="text-black font-semibold text-lg">{user.nom} {user.prenom}</p>
              <p className="text-gray-500 text-lg">{user.grade}</p>
            </div>
            <div className="space-y-3 text-gray-500 pt-10 ">
              <div className="flex items-center gap-3">
                <PhoneInTalkIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                <span>{user.numerotel}</span>
              </div>
              <div className="flex items-center gap-3">
                <EmailIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
          <PasswordChange />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
