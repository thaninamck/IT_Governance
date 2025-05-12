import React, { useState } from "react";
import "./FormStyle.css";
import Button from "../Button";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";
import InputForm from "./InputForm";
import SelectInput from "./SelectInput";
import useReferentiel from "../../Hooks/useReferentiel";
function AddControleForm({ title, isOpen, onClose, onControleCreated }) {
  if (!isOpen) return null; // Ne pas afficher le modal si isOpen est false
  const { typeOptions, majorOptions, subOptions, sourceOptions ,loading} =
    useReferentiel();
  const [error, setError] = useState("");


  const formatOptions = (data, labelKey, valueKey) =>
    data ? data.map((item) => ({ label: item[labelKey], value: item[valueKey] })) : [];
  const typesOptions = formatOptions(typeOptions, "name", "id"); 
const majorProcOptions = formatOptions(majorOptions, "code", "id");
const subProcOptions = formatOptions(subOptions, "name", "id");
const sourcesOptions = formatOptions(sourceOptions, "name", "id");

  

  const [controleData, setControleData] = useState({
    code: "",
    controle: "",
    testScripts: "", // Initialiser comme une chaîne pour l'entrée utilisateur
    type: "",
    sources: [], // Mettre un tableau pour gérer plusieurs sources
    majorProc: "",
    subProc: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Vérification des champs obligatoires
    if (
      !controleData.code ||
      !controleData.controle ||
      !controleData.testScripts ||
      !controleData.type ||
      controleData.sources.length === 0 || // Vérifier qu'au moins une source est sélectionnée
      !controleData.majorProc ||
      !controleData.subProc
    ) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return; // Empêcher la soumission
    }
  
    // Vérification des étapes du test (doivent être énumérées avec des numéros)
    const testScriptsArray = controleData.testScripts
      .split("\n") // Diviser par ligne
      .map((step) => step.trim()) // Supprimer les espaces
      .filter((step) => step !== ""); // Supprimer les étapes vides
  
    const isValid = testScriptsArray.every((step, index) => {
      const regex = new RegExp(`^${index + 1}\\.\\s.+`); // Vérifie si chaque étape commence par "1. ", "2. ", etc.
      return regex.test(step);
    });
  
    if (!isValid) {
      setError(
        'Les étapes du test doivent être énumérées et commencer par des numéros (ex : "1. Étape 1", "2. Étape 2").'
      );
      return; // Empêcher la soumission
    }
  
    setError(""); // Réinitialiser les erreurs si tout est bon
    // Récupérer les informations supplémentaires des options sélectionnées
    const selectedType = typeOptions.find((option) => option.id === controleData.type);
    const selectedMajorProc = majorOptions.find((option) => option.id === controleData.majorProc);
    const selectedSubProc = subOptions.find((option) => option.id === controleData.subProc); // Utiliser `id` au lieu de `code`
    const selectedSources = controleData.sources.map((sourceId) =>
      sourceOptions.find((option) => option.id === sourceId)
    );
    
  
    // Construire les données dans le format attendu par le backend
    const formattedData = {
      description: controleData.controle,
      code: controleData.code,
      test_script: controleData.testScripts,
      type: selectedType
        ? {
            id: selectedType.id,
            name: selectedType.name,
          }
        : null,
      majorProcess: selectedMajorProc
        ? {
            id: selectedMajorProc.id, // Utiliser l'ID au lieu du code
            code: selectedMajorProc.code,
            description: selectedMajorProc.description,
          }
        : null,
      subProcess: selectedSubProc
        ? {
            id: selectedSubProc.id, // Utiliser l'ID au lieu du code
            code: selectedSubProc.code,
            name: selectedSubProc.name,
          }
        : null,
        sources: Array.isArray(selectedSources)
        ? selectedSources.map((source) => ({
            id: source?.id || null,
            name: source?.name || "",
          }))
        : [],
    };
  
    // Envoyer les données au backend
    onControleCreated(formattedData);
    if (!loading) {
      onClose();

    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <form className="appForm_container" onSubmit={handleSubmit}>
        <button className="close-button" type="button" onClick={onClose}>
          &times;
        </button>

        <p>{title}</p>

        {error && <span className="text-red-500 text-xs">{error}</span>}

        {/* Code du contrôle */}
        <div className="form-row">
          <InputForm
            type="text"
            label="Code du controle"
            placeholder="code"
            width="130px"
            required={true}
            flexDirection="flex-col"
            value={controleData.code}
            onChange={(e) =>
              setControleData({ ...controleData, code: e.target.value })
            }
          />
        </div>

        {/* Description du contrôle */}
        <InputForm
          type="text"
          label="Controle"
          placeholder="description"
          width="540px"
          required={true}
          flexDirection="flex-col"
          value={controleData.controle}
          onChange={(e) =>
            setControleData({ ...controleData, controle: e.target.value })
          }
        />

        {/* Test script du contrôle */}
        <InputForm
          type="textarea"
          label="Étapes du test (séparées par des numéros)"
          placeholder="1. Étape 1\n2. Étape 2\n3. Étape 3"
          width="540px"
          required={true}
          flexDirection="flex-col"
          value={controleData.testScripts}
          onChange={(e) =>
            setControleData({ ...controleData, testScripts: e.target.value })
          }
        />

        {/* Type du contrôle */}
        <SelectInput
          label="Type du controle"
          options={typesOptions}
          value={controleData.type}
          onChange={(e) =>
            setControleData({ ...controleData, type: e.target.value })
          }
          width="170px"
          multiSelect={false}
          required={true}
        />

        {/* Sources du contrôle (multi-sélection) */}
        <SelectInput
          label="Sources du controle"
          options={sourcesOptions}
          value={controleData.sources}
          onChange={(e) =>
            setControleData({
              ...controleData,
              sources: Array.isArray(e.target.value)
                ? e.target.value
                : [e.target.value], // Gérer plusieurs valeurs
            })
          }
          width="250px"
          required={true}
          multiSelect={true} // Activer la multi-sélection
        />

        <div className="form-row">
          {/* Major process */}
          <SelectInput
            label="Major process"
            options={majorProcOptions}
            value={controleData.majorProc}
            onChange={(e) =>
              setControleData({ ...controleData, majorProc: e.target.value })
            }
            width="250px"
            multiSelect={false}
            required={true}
          />

          {/* Sub process */}
          <SelectInput
            label="Sub process"
            options={subProcOptions}
            value={controleData.subProc}
            onChange={(e) =>
              setControleData({ ...controleData, subProc: e.target.value })
            }
            width="250px"
            multiSelect={false}
            required={true}
          />
        </div>

        {/* Bouton Créer */}
        {/* <div className="mt-6 text-right">
          <Button loading={loading} btnName="Créer" type="submit" />
        </div> */}
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

export default AddControleForm;
// {/*
//   {/* Liste des Test Scripts */
//   <div className='mt-3'>
//   <div className='flex items-center gap-2'>
//     <label className="block text-sm  mb-2">Test Scripts</label>
//     <span className="text-[var(--alert-red)]">*</span>
//     </div>
//     <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
//       {controleData.testScripts.map((script, index) => (
//         <div key={index} className="py-1 px-2 border border-gray-300 rounded-lg shadow-sm relative">
//           {/* Input script */}

//           <input
//            required
//             type="text"
//             value={script}
//             onChange={(e) => updateTestScript(index, e.target.value)}
//             className="w-full text-sm  mb-1 flex-1 focus:outline-none placeholder:text-xs "
//             placeholder={`Test Script ${index + 1}`}
//           />

//           {/* Commentaire */}
//           {comments.hasOwnProperty(index) && (
//               <div className='flex gap-1 items-center'>
//               <label className='text-xs pt-2 text-[var(--status-gray)]'>commentaire</label>
//             <input
//               type="text"
//               value={comments[index]}
//               onChange={(e) => updateComment(index, e.target.value)}
//               className="w-full text-sm p-2 border-b border-gray-300 rounded-lg  focus:outline-none placeholder:text-xs"
//               placeholder=" un nouveau commentaire ajouté"
//             />
//             </div>
//           )}

//           {/* Actions */}
//           <div className="absolute top-1 right-3 flex items-center gap-2">
//             <AddCommentRoundedIcon
//               className="cursor-pointer text-[var(--blue-menu)] w-[10px] h-[10px]"
//               onClick={() => updateComment(index, '')} // Ajouter un commentaire vide si clic
//             />
//             <button
//               type="button"
//               onClick={() => removeTestScript(index)}
//               className="text-[var(--alert-red)]  text-xl border-none"
//             >
//               &times;
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//     <button
//       type="button"
//       onClick={addTestScript}
//       className="mt-4 text-[var(--blue-menu)]  border-none text-sm font-medium"
//     >
//       + Ajouter
//     </button>
//   </div>

//   */ }

// const [comments, setComments] = useState({}); // Gestion des commentaires {index: "commentaire"}

//   // Ajouter un nouveau script vide
//   const addTestScript = () => {
//     setControleData({
//       ...controleData,
//       testScripts: [...controleData.testScripts, ''],
//     });
//   };

//   // Mettre à jour un test script spécifique
//   const updateTestScript = (index, value) => {
//     const updatedScripts = [...controleData.testScripts];
//     updatedScripts[index] = value;
//     setControleData({ ...controleData, testScripts: updatedScripts });
//   };

//   // Ajouter ou mettre à jour un commentaire
//   const updateComment = (index, value) => {
//     setComments({
//       ...comments,
//       [index]: value,
//     });
//   };

//   // Supprimer un script
//   const removeTestScript = (index) => {
//     const updatedScripts = controleData.testScripts.filter((_, i) => i !== index);
//     setControleData({ ...controleData, testScripts: updatedScripts });

//     // Supprimer le commentaire associé (si existant)
//     const updatedComments = { ...comments };
//     delete updatedComments[index];
//     setComments(updatedComments);
//   };
// const typesOptions = [
  //   { label: "Détéctif", value: "Détéctif" },
  //   { label: "Corréctif", value: "Corréctif" },
  // ];
  // const sourcesOptions = [
  //   { label: "iso27001", value: "iso27001" },
  //   { label: "ITGC", value: "ITGC" },
  //   { label: "COBIT", value: "COBIT" },
  //   { label: "NIST", value: "NIST" },
  // ];
  // const majorProcOptions = [
  //   { label: "T1", value: "value" },
  //   { label: "T2", value: "T2" },
  // ];
  // const subProcOptions = [
  //   { label: "sub1", value: "sub1" },
  //   { label: "sub2", value: "sub2" },
  // ];