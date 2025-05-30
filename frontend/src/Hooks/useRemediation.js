import { useCallback, useEffect, useState } from "react";
import { api } from "../Api";
import { toast } from "react-toastify";

import emailjs from "emailjs-com";
emailjs.init("oAXuwpg74dQwm0C_s");

export default function useRemediation(missionId,systemId,executionId, controlCode,user) {
  

  const [action, setAction] = useState([]);
 const [error, setError] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [showRemediation, setShowRemediation] = useState(false);
  const [showDecisionPopup, setShowDecisionPopup] = useState(false);
  const [isAddingAnother, setIsAddingAnother] = useState(false);


  const fetchRemediations = async () => {
    if (!executionId) return;
    try {
      const response = await api.get(`mission/${missionId}/app/${systemId}/execution/${executionId}/getremediations`);
      setAction(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (executionId) {
      fetchRemediations();
    }
  }, [executionId]);

  const handleAdd = async (remediation) => {
    try {
      if (remediation.id) {
        const response = await api.put(`mission/${missionId}/app/${systemId}/execution/updateRemediation/${remediation.id}`, remediation);
        setAction(prev => prev.map(row => row.id === remediation.id ? response.data : row));
        setSelectedActionId(null);
        setShowRemediation(false);
      } else {
        if (!executionId || !controlCode) {
          throw new Error("executionId ou controlCode manquant");
        }
        const response = await api.post(`mission/${missionId}/app/${systemId}/execution/${executionId}/${controlCode}/createremediation`, remediation);
        setAction(prev => [...prev, response.data]);
        setShowDecisionPopup(true);
      }
       setSelectedActionId(null);
      setShowRemediation(false);
    } catch (error) {
      console.error("Erreur dans l'ajout/màj remediation:", error);
      throw error;
    }
  };

  const handleDeleteRow = (selectedRow) => {
    setSelectedActionId(selectedRow.id);
    setIsDeletePopupOpen(true);
  };

  const confirmDeleteRemediation = async () => {
    try {
      if (selectedActionId !== null) {
        await api.delete(`mission/${missionId}/app/${systemId}/execution/deleteRemediation/${selectedActionId}`);
        setAction(prev => prev.filter(row => row.id !== selectedActionId));
      }
    } catch (error) {
      console.error("Erreur suppression remediation:", error);
    } finally {
      setIsDeletePopupOpen(false);
      setSelectedActionId(null);
    }
  };

  const handleEditRow = (selectedRow) => {
    const transformedremediation = {
            id: selectedRow.id,
            description: selectedRow.description,
            owner_cntct: selectedRow.ownerContact,
            start_date: selectedRow.startDate,
            end_date: selectedRow.endDate,
          };
          setSelectedActionId(transformedremediation);
         // if (!showRemediation) setShowRemediation((prev) => !prev);
         setShowRemediation(true);
  };
  const handleCloseForm = () => {
    setSelectedActionId(null);
    setShowRemediation(false);
    setIsAddingAnother(false);
  };
  const handleCloseRow = async (selectedRow) => {
    try {
      await api.put(`/closeremediation/${selectedRow.id}`);
      await fetchRemediations();
    } catch (error) {
      toast.error("Erreur lors de la clôture de la remediation.");
    }
  };

  const handleSendAction = async (selectedRow) => {
    console.log('action selectedrow',selectedRow)
    if (!selectedRow || !selectedRow.ownerContact) {
      toast.error("Email manquant pour cet élément !");
      return;
    }

    const templateParams = {
      to_email: selectedRow.ownerContact,
      cc_email: (selectedRow.ownerSystem_email && selectedRow.risk_owner && selectedRow.control_owner) || "",
      controlCode: selectedRow.controlCode,
      SystemName: selectedRow.SystemName,
      missionName: selectedRow.missionName,
      description: selectedRow.description,
      suivi: selectedRow.suivi,
      startDate: selectedRow.startDate,
      endDate: selectedRow.endDate,

      // Infos dynamiques de l'utilisateur connecté
  from_name: `${user.firstName} ${user.lastName}`,
  from_email: user.email,
  reply_to: user.email,
    };

    try {
      await emailjs.send("service_dg6av6d", "template_f4ojiam", templateParams);
      toast.success(`E-mail envoyé à ${selectedRow.ownerContact} !`);
      await api.put(`/updatestatusremediation/${selectedRow.id}`);
      await fetchRemediations();
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email.");
    }
  };

  const handleDecisionResponse = (response) => {
    setShowDecisionPopup(false);
    if (response) setIsAddingAnother(true);
    else {
      setIsAddingAnother(false);
      //setSelectedActionId(null);
      setShowRemediation(false);
    }
  };

  return {
    action,
    error,
    showRemediation,
    setShowRemediation,
    fetchRemediations,
    handleAdd,
    handleEditRow,
    handleDeleteRow,
    confirmDeleteRemediation,
    handleCloseRow,
    handleSendAction,
    showDecisionPopup,
    setShowDecisionPopup,
    handleDecisionResponse,
    isDeletePopupOpen,
    setIsDeletePopupOpen,
    selectedActionId,
    setSelectedActionId,
    isAddingAnother,
    handleSendAction,
    handleCloseForm

    
  };
}
