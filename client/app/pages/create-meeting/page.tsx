'use client';

import React from 'react';
import Home from '../home/page';
import CreateMeetingDrawer from '../../components/CreateMeetingDrawer/CreateMeetingDrawer';

export default function CreateMeetingPage() {
  return (
    <>
      <Home />
      <CreateMeetingDrawer open={true} />
    </>
  );
}
