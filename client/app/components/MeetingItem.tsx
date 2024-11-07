import React from "react";
import { Meeting } from "@/app/models/Meeting";
import { BsThreeDots } from "react-icons/bs";
import { FiCalendar } from "react-icons/fi";
import { MdOutlineAlarm } from "react-icons/md";
import { Box, Divider } from "@mui/material";
import moment from "moment";
import Typography from "@mui/material/Typography";
import styles from './meetingItem.module.css';

type Props = {
  meeting: Meeting;
}

const MeetingItem: React.FC<Props> = ({ meeting }) => {
  return (
    <div className={styles.meetingItem}>
      <div>
        <Typography variant="body1" fontWeight="bold">
          {meeting.title}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <div className={styles.date}>
            <FiCalendar />
            <span>
              {moment(meeting.startTime).format('DD MMM.YYYY - HH:mm')}
            </span>
          </div>
          <Divider className={styles.divider} orientation="vertical" />
          <div className={styles.date}>
            <MdOutlineAlarm />
            <span>
              {moment(meeting.endTime).diff(meeting.startTime, 'm')}
              {' '}
              min
              </span>
          </div>
        </Box>
      </div>
      <BsThreeDots />
    </div>
  )
}

export default MeetingItem;
