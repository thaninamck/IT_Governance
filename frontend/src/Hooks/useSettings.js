import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../Api';

const useSettings = ({ fetchEndpoint, createEndpoint, deleteEndpoint, labelKey = 'name', itemKey, onAdd }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fonction pour récupérer les logs
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/logs'); // Appel API
      setLogs(response.data); // Stockage des logs
      setFilteredLogs(response.data); // Remplissage des données affichées
    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error);
    }
  };

  const fetchLayers = async () => {
    try {
      const response = await api.get(fetchEndpoint);
      setItems(response.data.map(item => ({
        label: item[labelKey],
        value: item.id.toString(),
      })));
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      toast.error("Erreur lors du chargement des données");
    }
  };

  useEffect(() => {
    fetchLayers();
  }, [fetchEndpoint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const itemExists = items.some(item => item.label.toLowerCase() === inputValue.toLowerCase());
    if (itemExists) {
      setError("Cet élément existe déjà. Veuillez choisir un autre nom.");
      return;
    }

    try {
      const response = await api.post(createEndpoint, { name: inputValue });
      const newItem = {
        label: response.data[itemKey][labelKey],
        value: response.data[itemKey].id.toString()
      };

      setItems([...items, newItem]);
      setInputValue('');
      setError('');
      setShowForm(false);
      toast.success("Élément ajouté avec succès");
      if (onAdd) onAdd(newItem);
    } catch (error) {
      console.error('Erreur lors de l’ajout :', error);
      setError("Une erreur est survenue lors de l'ajout.");
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleDeleteClick = (value) => {
    setItemToDelete(value);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`${deleteEndpoint}/${itemToDelete}`);
      setItems(items.filter(item => item.value !== itemToDelete));
      toast.success("Élément supprimé avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      setError("Une erreur est survenue lors de la suppression.");
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteConfirmationOpen(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };

  return {
    selectedValue,
    setSelectedValue,
    inputValue,
    setInputValue,
    showForm,
    setShowForm,
    error,
    items,
    deleteConfirmationOpen,
    handleSubmit,
    handleDeleteClick,
    confirmDelete,
    cancelDelete,
    logs,
    filteredLogs,
    fetchLogs,
    
  };
};

export default useSettings;
