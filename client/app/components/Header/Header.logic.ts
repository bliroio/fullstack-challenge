import {useState} from 'react';

export const useHeader = () => {
  const [isCreateMeetingDrawerOpen, setIsCreateMeetingDrawerOpen] = useState(false);

  const openCreateMeetingDrawer = () => {
    setIsCreateMeetingDrawerOpen(true);
  };

  const closeCreateMeetingDrawer = () => {
    setIsCreateMeetingDrawerOpen(false);
  };

  return {
    isCreateMeetingDrawerOpen,
    openCreateMeetingDrawer,
    closeCreateMeetingDrawer
  };
};
