import React, { useState, useEffect } from "react";
import AddCommentRoundedIcon from "@mui/icons-material/AddCommentRounded";

function InstructionSplitter({ steps, onChange }) {
  const [phrases, setPhrases] = useState([]);
  const [comments, setComments] = useState({});
  const [validatedSteps, setValidatedSteps] = useState({});
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    if (steps.length > 0) {
      const initialPhrases = steps.map((step) => step.step_text);
      setPhrases(initialPhrases);

      const initialComments = {};
      const initialValidated = {};

      steps.forEach((step, index) => {
        initialComments[index] = step.step_comment || "";
        initialValidated[index] = step.step_checked || false;
      });

      setComments(initialComments);
      setValidatedSteps(initialValidated);

      emitChanges(initialComments, initialValidated, initialPhrases);
    }
  }, [steps]);

  const toggleValidation = (index) => {
    const updated = { ...validatedSteps, [index]: !validatedSteps[index] };
    setValidatedSteps(updated);
    emitChanges(comments, updated, phrases);
  };

  const toggleComment = (index) => {
    setShowComments((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const updateComment = (index, value) => {
    const updated = { ...comments, [index]: value };
    setComments(updated);
    emitChanges(updated, validatedSteps, phrases);
  };

  const emitChanges = (commentsMap, validatedMap, phrasesList, stepsList = steps) => {
    const result = phrasesList.map((phrase, index) => ({
      step_text: phrase,
      step_checked: validatedMap[index] || false,
      step_comment: commentsMap[index] || "",
      step_execution_id: stepsList[index]?.step_execution_id ?? null,
    }));

    onChange(result);
  };

  // Fonction qui calcule si une étape doit être désactivée
  const computeDisabledStates = () => {
    const disabledStates = {};
    let locked = false;

    for (let i = 0; i < phrases.length; i++) {
      if (locked) {
        disabledStates[i] = true;
      } else {
        const checked = validatedSteps[i];
        const commented = (comments[i] || "").trim() !== "";

        if (!checked && !commented) {
          locked = true;
        }
        disabledStates[i] = false;
      }
    }

    return disabledStates;
  };

  const disabledSteps = computeDisabledStates();

  return (
    <div>
      <label className="text-font-gray font-medium">Test Scripts</label>
      <div className="max-h-80 overflow-y-auto space-y-2 my-1">
        {phrases.map((phrase, index) => (
          <div
            key={index}
            className="pb-1 px-3 border border-gray-300 rounded-lg shadow-sm relative flex flex-col gap-1 ml-4 max-h-64 overflow-y-auto"
          >
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={validatedSteps[index] || false}
                onChange={() => toggleValidation(index)}
                disabled={disabledSteps[index]}
                title={
                  disabledSteps[index]
                    ? "Les étapes précédentes doivent être validées ou commentées."
                    : ""
                }
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
                <input
                  type="text"
                  value={comments[index] || ""}
                  onChange={(e) => updateComment(index, e.target.value)}
                  disabled={disabledSteps[index]}
                  className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:outline-none"
                  placeholder="Ajoutez un commentaire..."
                />
              )}
            </div>

            <AddCommentRoundedIcon
              className="absolute top-3 right-8 cursor-pointer text-blue-500"
              onClick={() => toggleComment(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default InstructionSplitter;
