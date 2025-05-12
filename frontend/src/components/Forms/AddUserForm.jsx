import React, { useEffect, useState } from "react";
import InputForm from "./InputForm";
import "./FormStyle.css";
import Button from "../Button";
import emailjs from "emailjs-com";
import SelectInput from "./SelectInput";
import useUser from "../../Hooks/useUser";

function AddUserForm({
  title,
  isOpen,
  loading,
  onClose,
  initialValues,
  onUserCreated,
}) {
  if (!isOpen) return null;

  const { fetchGrades } = useUser();

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const defaultUserData = {
    username: "",
    nom: "",
    prenom: "",
    position_id: "",
    position_name: "",
    lastPasswordChange: "pas encore changé",
    email: "",
    contact: "",
    dateField: "",
    dateField1: getCurrentDate(),
    status: "Actif",
    role: "Utilisateur normal",
    password: "",
  };

  const [userData, setUserData] = useState(defaultUserData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [internalLoading, setInternalLoading] = useState(false);
  const [grades, setGrades] = useState([]);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";
    return Array.from({ length: 12 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  useEffect(() => {
    const fetchGradesData = async () => {
      const fetchedGrades = await fetchGrades();
      setGrades(fetchedGrades);
    };

    fetchGradesData();
  }, [fetchGrades]);

  useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        setUserData(initialValues);
        setIsUpdating(true);
      } else {
        setUserData(defaultUserData);
        setIsUpdating(false);
      }
    }
  }, [isOpen, initialValues]);

  useEffect(() => {
    if (userData.nom && userData.prenom) {
      const generatedUsername = `${userData.prenom
        .trim()
        .replace(/\s+/g, "")
        .toLowerCase()}.${userData.nom
        .trim()
        .replace(/\s+/g, "")
        .toLowerCase()}`;
      setUserData((prev) => ({ ...prev, username: generatedUsername }));
    }
  }, [userData.nom, userData.prenom]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !userData.nom ||
      !userData.prenom ||
      !userData.email ||
      !userData.contact ||
      !userData.position_id
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    let updatedUser = { ...userData };

    if (!isUpdating) {
      setInternalLoading(true);
      const generatedPassword = generatePassword();
      updatedUser.password = generatedPassword;

      const templateParams = {
        user_name: `${updatedUser.prenom} ${updatedUser.nom}`,
        user_email: updatedUser.email,
        user_password: generatedPassword,
      };

      // Tentative d'envoi de l'email avec emailjs (commenté ici)
      // try {
      //   const response = await emailjs.send('service_mcpkn9g', 'template_ln3j8zy', templateParams, 'oAXuwpg74dQwm0C_s');
      //   if (response.status !== 200) {
      //     alert('Échec de l\'envoi de l\'e-mail.');
      //     return;
      //   }
      // } catch (error) {
      //   console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
      //   alert('Une erreur est survenue lors de l\'envoi de l\'e-mail.');
      //   return;
      // } finally {
      //   setInternalLoading(false);
      // }
    }

    await onUserCreated(updatedUser);
    onClose();
    setError("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <form
        className="bg-white p-6 rounded-lg shadow-lg max-w-[90%] md:max-w-[700px] w-full relative"
        onSubmit={handleSubmit}
      >
        <button className="close-button" type="button" onClick={onClose}>
          &times;
        </button>

        <p className="text-lg font-semibold mb-4">{title}</p>
        {error && (
          <span className="text-red-500 text-xs block mb-4">{error}</span>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputForm
            type="text"
            label="Nom"
            placeholder="Nom"
            flexDirection="flex-col"
            required={true}
            readOnly={false}
            value={userData.nom}
            onChange={(e) => setUserData({ ...userData, nom: e.target.value })}
          />
          <InputForm
            type="text"
            label="Prénom"
            placeholder="Prénom"
            flexDirection="flex-col"
            required={true}
            readOnly={false}
            value={userData.prenom}
            onChange={(e) =>
              setUserData({ ...userData, prenom: e.target.value })
            }
          />
          <InputForm
            type="email"
            label="Email"
            placeholder="Email"
            flexDirection="flex-col"
            required={true}
            readOnly={false}
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
          <InputForm
            type="text"
            label="Contact"
            placeholder="Ex: 0551234567 ou +213551234567"
            flexDirection="flex-col"
            required={true}
            readOnly={false}
            value={userData.contact}
            onChange={(e) => {
              const value = e.target.value;
              if (/^(\+?[0-9]{0,10})$/.test(value)) {
                setUserData({ ...userData, contact: value });
              }
            }}
          />

          <SelectInput
            label="Grade"
            options={grades}
            value={userData.position_id}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedGrade = grades.find((g) => g.value === selectedId);
              setUserData({
                ...userData,
                position_id: selectedId,
                grade: selectedGrade ? selectedGrade.label : "",
              });
            }}
            required={true}
            multiSelect={false}
          />

          <SelectInput
            label="Status"
            options={[
              { label: "Actif", value: "Actif" },
              { label: "Bloqué", value: "Bloqué" },
            ]}
            value={userData.status}
            onChange={(e) =>
              setUserData({ ...userData, status: e.target.value })
            }
            required={true}
            multiSelect={false}
          />
          <SelectInput
            label="Role"
            options={[
              { label: "Admin", value: "Admin" },
              { label: "Utilisateur normal", value: "Utilisateur normal" },
            ]}
            value={userData.role}
            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            required={true}
            multiSelect={false}
          />
        </div>

        {/* <Button
          btnName={loading ? "Enregistrement..." : "Enregistrer"}
          type="submit"
          disabled={loading}
          className="mt-6"
        /> */}

<div className="flex justify-center mt-4 mb-2">
  <button
    type="submit"
    className="bg-[var(--blue-menu)] border-none hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
    disabled={loading}
  >
    {initialValues?.id
      ? (loading ? "Mise à jour en cours..." : "Mettre à jour")
      : (loading ? "Création en cours..." : "Créer")}
  </button>
</div>

      </form>
    </div>
  );
}

export default AddUserForm;