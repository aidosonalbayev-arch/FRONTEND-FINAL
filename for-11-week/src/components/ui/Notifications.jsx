// components/ui/Notifications.jsx
// Компонент отображения toast-уведомлений
// Читает из Redux store и показывает в правом нижнем углу
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../../store/notificationSlice";

export default function Notifications() {
  const dispatch = useDispatch();
  // Читаем список уведомлений из Redux
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

// Отдельный компонент для одного уведомления
// Автоматически исчезает через 3 секунды
function NotificationItem({ notification, onRemove }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Таймер — удаляем через 3 сек автоматически
    const timer = setTimeout(() => {
      onRemove();
    }, 3000);
    // Очищаем таймер если компонент размонтировался раньше
    return () => clearTimeout(timer);
  }, [notification.id]);

  // Иконка в зависимости от типа
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
