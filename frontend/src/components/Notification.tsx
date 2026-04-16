import React from 'react';

interface Props {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Notification = ({ message, type = 'success', onClose }: Props) => {
  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default Notification;