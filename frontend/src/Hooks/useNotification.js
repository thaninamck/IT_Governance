import { useState, useEffect } from "react";
import { authApi } from "../Api"; // Instance Axios
import { useAuth } from "../Context/AuthContext"; // Contexte d'authentification
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useUser = () => {
  const navigate = useNavigate(); // Hook pour la navigation

  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  // Fonction pour récupérer l'URL selon le type de notification
  const getNotificationUrl = (notification) => {
    console.log('not',notification)
    switch (notification?.type) {
      
      case "mission":
        const notifUrl = JSON.parse(notification.url); // Convertir en objet
      return `/missions/${notifUrl.id}`;
      case "affectation_cntrl":
        return `/wshkaaeyn before/${notification.url.id}`;//complete ici
      case "cloture_mission":
        return `/missions`;
      case "review_cntrl":
          return `/revue/revueExecution/CTRL-234`;  //complete ici
      case "validation_cntrl":
        return `/revue/revueExecution/CTRL-234`;   //complete ici   
      case "security":
        return "#";
      default:
        return "/";
    }
    
  };

  // Fonction pour formater les notifications
  const transformNotifications = (data) => {
    return data.map((notif) => ({
      id: notif.id, // UUID
      sender: "SS", // Statique (tu peux changer si besoin)
      message: notif.message, // Message récupéré
      date: notif.created_at,
      url: getNotificationUrl(notif), // Générer l'URL selon le type
      isRead: notif.read_at !== null, // true si la notification a été lue
    }));
  };

  // Fonction pour récupérer les notifications depuis l'API
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.get("/notifications"); // Récupération des notifications
      const formattedNotifications = transformNotifications(response.data);
      setNotifications(formattedNotifications);
    } catch (error) {
      setError("Erreur lors de la récupération des notifications.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const MarkNotificationAsRead = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post(`/notifications/${id}/read`);
      return response.status;
    } catch (error) {
      setError("Erreur lors de la récupération des notifications.");
      console.error(error);
      return error.response ? error.response.status : 500; // Retourne le statut de l'erreur ou 500 si inconnu
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Token actuel on est dans iuseeffect:", token); // Vérifier si le token est bien défini
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const markAsRead = async (id, event) => {
    const notif = notifications.find((n) => n.id === id);
    console.log("uuid", id);
    // if (notif?.url && !notif.url === "#" && !notif.url === "") {
    const status = await MarkNotificationAsRead(id); // Appelle l'API pour marquer comme lu

    if (status === 200) {
      // Vérifie si la requête a réussi
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );

      // Trouver la notification correspondante
      if (notif?.url) {
        if (notif.url === "#" || notif.url === "") {
          event.preventDefault(); // Empêche la navigation
        } else {
          navigate(notif.url); // Redirige normalement si l'URL est valide
        }
      }
    } else {
      toast.error(`Erreur lors de la mise à jour : ${status}`);
    }
    //}
  };

  // Lorsque vous appelez markAsRead dans le gestionnaire d'événements :
  const handleClick = (event, id) => {
    markAsRead(id, event); // Passez l'événement et l'id à la fonction
  };

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.post("/notifications/read-all"); // Endpoint pour tout marquer comme lu
      if (response.status === 200) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) => ({ ...notif, isRead: true }))
        );
      } else {
        toast.error("Erreur lors de la mise à jour des notifications.");
      }
    } catch (error) {
      setError("Erreur lors de la mise à jour des notifications.");
      toast.error("Erreur lors de la mise à jour des notifications.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // État pour stocker le filtre sélectionné (Tout ou Non lues)
  const [filter, setFilter] = useState("all");

  // Filtrer les notifications en fonction du filtre sélectionné
  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notif) => !notif.isRead) // Afficher uniquement les non lues
      : notifications; // Afficher toutes les notifications

  return {
    filter,
    setFilter,
    filteredNotifications,
    setNotifications,
    markAsRead,
    markAllAsRead,
    loading,
    error,
    notifications,
    user,
    unreadCount,
  };
};

export default useUser;
/*
 const [notificationss, setNotificationss] = useState([
    {
      id: 1,
      sender: "SS",
      message: "Un contrôle vous a été affecté : contrôle 5.2, mission DSP.",
      date: "Aujourd'hui à 9:42 AM",
      isRead: false,
    },
    {
      id: 2,
      sender: "SS",
      message:
        "Vous avez été affecté(e) à la mission DSP. Veuillez consulter les détails.",
      date: "15 DEC à 14:42 AM",
      isRead: false,
    },
    {
      id: 3,
      sender: "SL",
      message:
        "Sara Lounes a ajouté une remarque concernant le contrôle 5.3 de la mission DSP.",
      date: "13 DEC à 11:32 AM",
      isRead: true,
    },
    {
      id: 4,
      sender: "SS",
      message: "Un contrôle vous a été affecté : contrôle 2.4, mission DSP.",
      date: "11 DEC à 9:42 AM",
      isRead: true,
    },
    {
      id: 5,
      sender: "SL",
      message:
        "Sara Lounes a ajouté une remarque concernant le contrôle 5.3 de la mission DSP.",
      date: "11 DEC à 9:42 AM",
      isRead: true,
    },
    {
      id: 6,
      sender: "SL",
      message:
        "Sara Lounes a ajouté une remarque concernant le contrôle 5.3 de la mission DSP.",
      date: "11 DEC à 9:42 AM",
      isRead: true,
    },
    {
      id: 7,
      sender: "SL",
      message:
        "Sara Lounes a ajouté une remarque concernant le contrôle 5.3 de la mission DSP.",
      date: "11 DEC à 9:42 AM",
      isRead: true,
    },
    {
      id: 8,
      sender: "SL",
      message:
        "Sara Lounes a ajouté une remarque concernant le contrôle 5.3 de la mission DSP.",
      date: "11 DEC à 9:42 AM",
      isRead: true,
    },
  ]);

*/
