import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <h1 style={{ fontSize: '2em' }}>404 - Страница не найдена</h1>
      <p style={{ marginTop: '10px' }}>Запрашиваемая вами страница не существует</p>
    </div>
  );
};

export default NotFoundPage;