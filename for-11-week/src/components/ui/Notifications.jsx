import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../../store/notificationSlice";

export default function Notifications() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.notifications.items);

  return (
    <div className="notifications-wrap">
      {items.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          onRemove={() => dispatch(removeNotification(n.id))}
        />
      ))}
    </div>
  );
}

function NotificationItem({ notification, onRemove }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 3000);
    return () => clearTimeout(timer);
  }, [notification.id]);

  const icon =
    {
      success: "✓",
      error: "✕",
      info: "i",
    }[notification.type] || "i";

  return (
    <div className={`notification notification--${notification.type}`}>
      <span className="notification-icon">{icon}</span>
      <p className="notification-msg">{notification.message}</p>
      <button className="notification-close" onClick={onRemove}>
        ×
      </button>
    </div>
  );
}
