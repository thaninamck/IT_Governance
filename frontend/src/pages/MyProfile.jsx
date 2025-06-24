import React from "react";
import SideBar from "../components/sideBar/SideBar";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import EmailIcon from "@mui/icons-material/Email";
import PasswordChange from "../components/Forms/PasswordChange";
import HeaderBis from "../components/Header/HeaderBis";
import { useAuth } from "../Context/AuthContext";
import SideBarStdr from "../components/sideBar/SideBarStdr";

const MyProfile = () => {
  const { user, viewMode } = useAuth();
  console.log('usertttt',user?.position?.name)
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {user?.role === "admin" && viewMode !== "user" ? (
        <SideBar user={user} />
      ) : (
        <SideBarStdr user={user} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderBis />
        
        <main className="flex-1 overflow-y-auto px-8 mt-2">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm px-8 py-4">
              <h1 className="text-xl font-bold text-gray-800 mb-2">Mon Profil</h1>
              
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Profile Card */}
                <div className="w-full lg:w-1/3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 shadow-inner">
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mb-6 shadow-md">
                        {user?.fullName?.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">{user?.fullName || 'Utilisateur'}</h2>
                        <p className="text-blue-600 font-medium">{user?.position?.name || 'Poste non défini'}</p>
                      </div>
                      
                      <div className="w-full space-y-4">
                        <div className="flex items-center p-3 bg-white rounded-lg shadow-xs">
                          <div className="p-2 bg-blue-100 rounded-full mr-4">
                            <PhoneInTalkIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Téléphone</p>
                            <p className="font-medium text-gray-700">{user?.phoneNumber || 'Non renseigné'}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center p-3 bg-white rounded-lg shadow-xs">
                          <div className="p-2 bg-blue-100 rounded-full mr-4">
                            <EmailIcon sx={{ fontSize: 20, color: "#3b82f6" }} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-700">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                
                <div className="w-full lg:w-2/3">
                  <div className="mt-8 bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Informations supplémentaires</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     
                      <div>
                        <p className="text-sm text-gray-500">Département</p>
                        <p className="font-medium">IT</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Grade</p>
                        <p className="font-medium">{user?.position?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Localisation</p>
                        <p className="font-medium">Alger, Algerie</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyProfile;