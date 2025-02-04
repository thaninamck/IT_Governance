import React, { useState } from "react";
import "./NotificationBar.css";
import icons from '../../assets/Icons'; // Importing icons from the icons.js file

const NotificationBar = () => {
  const [notifications, setNotifications] = useState([
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
      message: "Vous avez été affecté(e) à la mission DSP. Veuillez consulter les détails.",
      date: "15 DEC à 14:42 AM",
      isRead: false,
    },
    {
      id: 3,
      sender: "SL",
      message: "Sara Lounes a ajouté une remarque concernant le contrôle 5.3 de la mission DSP.",
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
      message: "Sara Lounes a ajouté une remarque concernant le contrôle 5.3 de la mission DSP.",
      date: "11 DEC à 9:42 AM",
      isRead: true,
    },
    {
      id: 6,
      sender: "SL",
      message: "Sara Lounes a ajouté une remarque concernant le contrôle 5.3 de la mission DSP.",
      date: "11 DEC à 9:42 AM",
      isRead: true,
    },
    {
      id: 7,
      sender: "SL",
      message: "Sara Lounes a ajouté une remarque concernant le contrôle 5.3 de la mission DSP.",
      date: "11 DEC à 9:42 AM",
      isRead: true,
    },
    {
      id: 8,
      sender: "SL",
      message: "Sara Lounes a ajouté une remarque concernant le contrôle 5.3 de la mission DSP.",
      date: "11 DEC à 9:42 AM",
      isRead: true,
    },
  ]);

  // État pour stocker le filtre sélectionné (Tout ou Non lues)
  const [filter, setFilter] = useState("all");

  // Filtrer les notifications en fonction du filtre sélectionné
  const filteredNotifications = filter === "unread"
    ? notifications.filter((notif) => !notif.isRead) // Afficher uniquement les non lues
    : notifications; // Afficher toutes les notifications

  // Fonction pour marquer la notification comme lue
  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  return (
    <div className="notificationBar">
      {/* Header */}
      <div className="notificationBar__header">
        <div className="notificationBar__actions">
          <h3>NOTIFICATIONS</h3>
          <select className="notificationBar__filter" onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Tout</option>
            <option value="unread">Non lues</option>
          </select>
        </div>
        <span className="notificationBar__markAll" onClick={markAllAsRead}>
          Marquer tout comme lu <icons.checkCircle sx={{ width: "18px", marginLeft: "10px" }} />
        </span>
      </div>

      {/* Liste des notifications filtrées */}
      <div className="notificationBar__list">
        {filteredNotifications.length === 0 ? (
          <p className="notificationBar__empty">Aucune notification à afficher</p>
        ) : (
          filteredNotifications.map((notif) => {
            let boldText = "";
            let normalText = notif.message;

            if (notif.sender === "SS") {
              boldText = notif.message;
              normalText = "";
            } else {
              const match = notif.message.match(/^([\w\s]+)\sa ajouté/);
              if (match) {
                boldText = match[1];
                normalText = notif.message.replace(boldText, "");
              }
            }

            return (
              <div
                key={notif.id}
                className={`notificationBar__item ${!notif.isRead ? "unread" : ""}`}
                onClick={() => markAsRead(notif.id)} // Marquer comme lu au clic
              >
                <div className="notificationBar__initials">{notif.sender}</div>
                <div className="notificationBar__details">
                  <p className="notificationBar__message">
                    <strong>{boldText}</strong> {normalText}
                  </p>
                  <p className="notificationBar__date">{notif.date}</p>
                </div>
                {!notif.isRead && <div className="notificationBar__unreadDot"></div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationBar;
