'use client';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import CreateMeetingPage from './CreateMeetingPage';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/create-meeting' element={<CreateMeetingPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
