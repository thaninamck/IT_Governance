import React, { useState } from 'react';
import './FormStyle.css';
import Button from '../Button';
import AddCommentRoundedIcon from '@mui/icons-material/AddCommentRounded';
import InputForm from './InputForm';

function AddControleForm({ title, isOpen, onClose, onControleCreated }) {
  if (!isOpen) return null; // Ne pas afficher le modal si isOpen est false

  const [controleData, setControleData] = useState({
    code: '',
    controle: '',
    testScripts: [''], // Initialiser avec un champ vide
  });

  const [comments, setComments] = useState({}); // Gestion des commentaires {index: "commentaire"}

  // Ajouter un nouveau script vide
  const addTestScript = () => {
    setControleData({
      ...controleData,
      testScripts: [...controleData.testScripts, ''],
    });
  };

  // Mettre à jour un test script spécifique
  const updateTestScript = (index, value) => {
    const updatedScripts = [...controleData.testScripts];
    updatedScripts[index] = value;
    setControleData({ ...controleData, testScripts: updatedScripts });
  };

  // Ajouter ou mettre à jour un commentaire
  const updateComment = (index, value) => {
    setComments({
      ...comments,
      [index]: value,
    });
  };

  // Supprimer un script
  const removeTestScript = (index) => {
    const updatedScripts = controleData.testScripts.filter((_, i) => i !== index);
    setControleData({ ...controleData, testScripts: updatedScripts });

    // Supprimer le commentaire associé (si existant)
    const updatedComments = { ...comments };
    delete updatedComments[index];
    setComments(updatedComments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onControleCreated({ ...controleData, comments }); // Inclure les commentaires lors de la soumission
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
      <form
        className="appForm_container"
        onSubmit={handleSubmit}
      >
        <button className="close-button" type="button" onClick={onClose}>
          &times;
        </button>

        <p>{title}</p>
        {/* Code du contrôle */}
        <InputForm
          type="text"
          label="Code du controle"
          placeholder="code"
          width="150px"
          flexDirection="flex-col"
          value={controleData.code}
          onChange={(e) => setControleData({ ...controleData, code: e.target.value })}
        />

        
        {/* Description du contrôle */}
    
        <InputForm
          type="text"
          label="Controle"
          placeholder="description"
          width="630px"
          flexDirection="flex-col"
          value={controleData.controle}
          onChange={(e) => setControleData({ ...controleData, controle: e.target.value })}
        />


        {/* Liste des Test Scripts */}
        <div className='mt-3'>
          <label className="block text-sm  mb-2">Test Scripts</label>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {controleData.testScripts.map((script, index) => (
              <div key={index} className="py-1 px-2 border border-gray-300 rounded-lg shadow-sm relative">
                {/* Input script */}
                <input
                  type="text"
                  value={script}
                  onChange={(e) => updateTestScript(index, e.target.value)}
                  className="w-full text-sm  mb-1 flex-1 focus:outline-none placeholder:text-xs "
                  placeholder={`Test Script ${index + 1}`}
                />

                {/* Commentaire */}
                {comments.hasOwnProperty(index) && (
                    <div className='flex gap-1 items-center'>
                    <label className='text-xs pt-2 text-[var(--status-gray)]'>commentaire</label>
                  <input
                    type="text"
                    value={comments[index]}
                    onChange={(e) => updateComment(index, e.target.value)}
                    className="w-full text-sm p-2 border-b border-gray-300 rounded-lg  focus:outline-none placeholder:text-xs"
                    placeholder=" un nouveau commentaire ajouté"
                  />
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-1 right-3 flex items-center gap-2">
                  <AddCommentRoundedIcon
                    className="cursor-pointer text-[var(--blue-menu)] w-[10px] h-[10px]"
                    onClick={() => updateComment(index, '')} // Ajouter un commentaire vide si clic
                  />
                  <button
                    type="button"
                    onClick={() => removeTestScript(index)}
                    className="text-[var(--alert-red)]  text-xl border-none"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addTestScript}
            className="mt-4 text-[var(--blue-menu)]  border-none text-sm font-medium"
          >
            + Ajouter
          </button>
        </div>

        {/* Bouton Créer */}
        <div className="mt-6 text-right">
          <Button btnName="Créer" type="submit" />
        </div>
      </form>
    </div>
  );
}

export default AddControleForm;
