import React from "react";
import "./NotificationBar.css";
import icons from "../../assets/Icons";
import useNotification from "../../Hooks/useNotification";
import { Bell } from "lucide-react";
import Spinner from "../Spinner";

const NotificationBar = () => {
  const {
    filter,
    setFilter,
    filteredNotifications,
    markAsRead,
    markAllAsRead,
    loading,
    error,
  } = useNotification();

  console.log("filtrednotification", filteredNotifications)
  return (
    <div className="notificationBar">
      {/* Header */}
      <div className="notificationBar__header">
        <div className="notificationBar__actions">
          <h3>NOTIFICATIONS</h3>
          <select
            className="notificationBar__filter"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tout</option>
            <option value="unread">Non lues</option>
          </select>
        </div>
        <span className="notificationBar__markAll" onClick={markAllAsRead}>
          Marquer tout comme lu{" "}
          <icons.checkCircle sx={{ width: "18px", marginLeft: "10px" }} />
        </span>
      </div>

      {/* Contenu des notifications */}
      <div className="notificationBar__list">
        {/* Affichage du spinner en cas de chargement */}
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <Spinner color="var(--blue-menu)" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <p className="notificationBar__empty">
            Aucune notification à afficher
          </p>
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
                className={`notificationBar__item ${
                  !notif.isRead ? "unread" : ""
                }`}
                onClick={(event) => markAsRead(notif.id,event)}
               // onClick={() => markAsRead(notif.id)}
              >
                <div className="notificationBar__icon mr-7">
                  <Bell size={20} />
                </div>
                <div className="notificationBar__details">
                  <p className="notificationBar__message">
                    {!notif.isRead ? <strong>{boldText}</strong> : boldText}{" "}
                    {normalText}
                  </p>
                  <p className="notificationBar__date">{notif.date}</p>
                </div>
                {!notif.isRead && (
                  <div className="notificationBar__unreadDot"></div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationBar;
