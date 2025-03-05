import React, { useState, useEffect } from "react";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";

function InstructionSplitter({ instructions: initialInstructions, onChange }) {
  const [phrases, setPhrases] = useState([]);
  const [comments, setComments] = useState({});
  const [validatedSteps, setValidatedSteps] = useState({});
  const [showComments, setShowComments] = useState({});

  // Diviser les instructions en phrases lors du montage ou de la mise à jour des instructions
  useEffect(() => {
    if (initialInstructions) {
      console.log('instruction :' ,initialInstructions)
      splitInstructions(initialInstructions);
      console.log('instructionafter :' ,initialInstructions)

    }
  }, [initialInstructions]);

   // Fonction pour diviser les instructions en phrases
   const splitInstructions = (instructions) => {
    try {
      if (!instructions || typeof instructions !== "string") {
        throw new Error("Invalid instructions format");
      }
  
      // Diviser les instructions en phrases en utilisant une expression régulière pour détecter les numéros
      const phrases = instructions.split(/(\d+\.)/g).filter(Boolean);
  
      // Combiner les numéros avec leurs phrases correspondantes
      const result = [];
      for (let i = 0; i < phrases.length; i += 2) {
        const numberPart = phrases[i].trim(); // Partie du numéro (ex: "1.")
        const textPart = phrases[i + 1] ? phrases[i + 1].trim() : ""; // Partie du texte (ex: "Obtain the access management policy")
        result.push(`${numberPart} ${textPart}`);
      }
  
      console.log("Phrases after splitting:", result);
      setPhrases(result);
  
      // Initialiser testScriptData avec des valeurs par défaut
      const defaultTestScriptData = result.map((phrase) => ({
        phrase,
        isChecked: false,
        comment: "",
      }));
      console.log("Default test script data:", defaultTestScriptData);
      onChange(defaultTestScriptData);
    } catch (error) {
      console.error("Error splitting instructions:", error);
    }
  };
  // const splitInstructions = (instructions) => {
  //   const lines = instructions.split(/\n/);
  //   const result = [];
  //   let currentPhrase = "";

  //   lines.forEach((line) => {
  //     if (/^\d+(\.\d+)*([.)-]|\s)/.test(line.trim())) {
  //       if (currentPhrase) result.push(currentPhrase.trim());
  //       currentPhrase = line;
  //     } else if (line.trim()) {
  //       currentPhrase += "\n" + line;
  //     }
  //   });

  //   if (currentPhrase) result.push(currentPhrase.trim());
  //   setPhrases(result);

  //   // Initialiser testScriptData avec des valeurs par défaut
  //   const defaultTestScriptData = result.map((phrase) => ({
  //       phrase,
  //       isChecked: false, // Par défaut, la validation est "Non"
  //       comment: "", // Par défaut, le commentaire est vide
  //     }));
  //     onChange(defaultTestScriptData); // Transmettre les données par défaut au parent
  // };

//   const updateComment = (index, value) => {
//     setComments((prev) => ({
//       ...prev,
//       [index]: value,
//     }));
//   };

   // Mettre à jour un commentaire
   const updateComment = (index, value) => {
    const newComments = { ...comments, [index]: value };
    setComments(newComments);
    emitChanges(newComments, validatedSteps); // Transmettre les changements au parent
  };
  const toggleComment = (index) => {
    setShowComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

//   const toggleValidation = (index) => {
//     setValidatedSteps((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

 // Basculer l'état de validation d'une étape
 const toggleValidation = (index) => {
    const newValidatedSteps = { ...validatedSteps, [index]: !validatedSteps[index] };
    setValidatedSteps(newValidatedSteps);
    emitChanges(comments, newValidatedSteps); // Transmettre les changements au parent
  };

  const saveComment = (index) => {
    console.log(`Commentaire pour l'étape ${index + 1}:`, comments[index]);
  };

  const removeTestScript = (index) => {
    setPhrases((prev) => prev.filter((_, i) => i !== index));
    setComments((prev) => {
      const newComments = { ...prev };
      delete newComments[index];
      return newComments;
    });
    setValidatedSteps((prev) => {
      const newValidated = { ...prev };
      delete newValidated[index];
      return newValidated;
    });
  };

//   const handleSave = () => {
//     const testScriptData = phrases.map((phrase, index) => ({
//       phrase,
//       isChecked: validatedSteps[index] || false,
//       comment: comments[index] || "",
//     }));
//     onSave(testScriptData); // Transmettre les données au parent
//   };
 // Transmettre les changements au parent
 const emitChanges = (comments, validatedSteps) => {
    const testScriptData = phrases.map((phrase, index) => ({
      phrase,
      isChecked: validatedSteps[index] || false,
      comment: comments[index] || "",
    }));
   
    onChange(testScriptData); // Appeler la fonction de rappel du parent
    console.log('data test', testScriptData)
  };


  return (
    <div className=" ">
        <label className="text-font-gray font-medium ">Test Scripts</label>
        <div className="max-h-80 overflow-y-auto space-y-2 my-1">
      {phrases.map((phrase, index) => (
        <div key={index} className=" pb-1 px-3 border border-gray-300 rounded-lg shadow-sm relative flex flex-col gap-1 ml-4 max-h-64 overflow-y-auto">
          <div className="flex gap-2">
            <input
              type="checkbox"
              checked={validatedSteps[index] || false}
              onChange={() => toggleValidation(index)}
              className="w-5 h-5 accent-green-500 mt-3"
            />
            <textarea
              className="w-full px-2 pt-4 pb-1 mr-12 rounded-lg"
              rows={phrase.split("\n").length}
              value={phrase}
              readOnly
            />
          </div>

          <div className="flex items-center gap-2">
            {showComments[index] && (
              <>
                <input
                  type="text"
                  value={comments[index] || ""}
                  onChange={(e) => updateComment(index, e.target.value)}
                  className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Ajoutez un commentaire..."
                />
                {/* <button
                  onClick={() => saveComment(index)}
                  className="bg-[var(--success-green)] text-white p-2 border-none rounded-lg text-xs"
                >
                  Enregistrer
                </button> */}
              </>
            )}
            
          </div>
         

          <AddCommentRoundedIcon
            className="absolute top-3 right-8 cursor-pointer text-blue-500"
            onClick={() => toggleComment(index)}
          />

          <button
            type="button"
            onClick={() => removeTestScript(index)}
            className="absolute top-0 right-0 text-red-500 text-xl border-none"
          >
            &times;
          </button>
          
        </div>
      ))}
       </div>
    </div>
  );
}

export default InstructionSplitter;