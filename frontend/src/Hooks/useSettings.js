import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../Api';

const useSettings = ({ fetchEndpoint, createEndpoint, deleteEndpoint, labelKey = 'name', itemKey, onAdd }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Logs
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/logs');
      setLogs(response.data);
      setFilteredLogs(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error);
      toast.error("Erreur lors de la récupération des logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchLayers = async () => {
    setLoading(true);
    try {
      const response = await api.get(fetchEndpoint);
      setItems(response.data.map(item => ({
        label: item[labelKey],
        value: item.id.toString(),
      })));
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
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

    setLoading(true);
    setError('');
    try {
      const response = await api.post(createEndpoint, { name: inputValue });
      const newItem = {
        label: response.data[itemKey][labelKey],
        value: response.data[itemKey].id.toString()
      };

      setItems(prevItems => [...prevItems, newItem]);
      setInputValue('');
      setShowForm(false);
      toast.success("Élément ajouté avec succès");
      if (onAdd) onAdd(newItem);
    } catch (error) {
      console.error('Erreur lors de l’ajout :', error);
      setError("Une erreur est survenue lors de l'ajout.");
      toast.error("Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (value) => {
    setItemToDelete(value);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`${deleteEndpoint}/${itemToDelete}`);
      setItems(prevItems => prevItems.filter(item => item.value !== itemToDelete));
      toast.success("Élément supprimé avec succès");
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      setError("Une erreur est survenue lors de la suppression.");
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteConfirmationOpen(false);
      setItemToDelete(null);
      setLoading(false);
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
    loading,
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
