import React, { useState, useEffect } from "react";
import "./NotificationBar.css";
import icons from '../../assets/Icons'; // Importing icons from the icons.js file

const NotificationPopup = ({ setUnreadCount }) => {
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
  ]);

  const [filter, setFilter] = useState("all");

  const filteredNotifications = filter === "unread"
    ? notifications.filter((notif) => !notif.isRead)
    : notifications;

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  useEffect(() => {
    // Update unread notifications count when the list changes
    const unreadCount = notifications.filter((notif) => !notif.isRead).length;
    setUnreadCount(unreadCount);
  }, [notifications, setUnreadCount]);

  return (
    <div className="notificationPopup">
      {/* Header */}
      <div className="notificationPopup__header">
        <div className="notificationPopup__actions">
          <h3>NOTIFICATIONS</h3>
          <select className="notificationPopup__filter" onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Tout</option>
            <option value="unread">Non lues</option>
          </select>
        </div>
        <span className="notificationPopup__markAll" onClick={markAllAsRead}>
          Marquer tout comme lu <icons.checkCircle sx={{ width: "12px", marginLeft: "10px" }} />
        </span>
      </div>

      {/* List of filtered notifications */}
      <div className="notificationPopup__list">
        {filteredNotifications.length === 0 ? (
          <p className="notificationPopup__empty">Aucune notification à afficher</p>
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
                className={`notificationPopup__item ${!notif.isRead ? "unread" : ""}`}
                onClick={() => markAsRead(notif.id)} // Mark as read on click
              >
                <div className="notificationPopup__initials">{notif.sender}</div>
                <div className="notificationPopup__details">
                  <p className="notificationPopup__message">
                    <strong>{boldText}</strong> {normalText}
                  </p>
                  <p className="notificationPopup__date">{notif.date}</p>
                </div>
                {!notif.isRead && <div className="notificationPopup__unreadDot"></div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
