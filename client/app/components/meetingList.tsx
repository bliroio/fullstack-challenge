'use client';

import React from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import MeetingItem from "@/app/components/MeetingItem";
import { Meeting } from "@/app/models/Meeting";

type Props = {
  meetings: Meeting[];
  hasMore: boolean;
  onNext: () => void;
}

const MeetingList: React.FC<Props> = ({ meetings, hasMore, onNext }) => {
  return (
    <InfiniteScroll
      dataLength={meetings.length}
      next={onNext}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      scrollThreshold={1}
    >
      {meetings.map((meeting) => (
        <MeetingItem key={meeting.id} meeting={meeting} />
      ))}
    </InfiniteScroll>
  );
};

export default MeetingList;
