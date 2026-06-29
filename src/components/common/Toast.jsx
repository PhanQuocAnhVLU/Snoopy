import { useApp } from '../../contexts/AppContext';

const Toast = () => {
  const { notification } = useApp();
  if (!notification) return null;

  return (
    <div className="toast-container">
      <div key={notification.id} className={`toast toast-${notification.type || 'info'}`}>
        <span>{notification.message}</span>
      </div>
    </div>
  );
};

export default Toast;
