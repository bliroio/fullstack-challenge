import styles from "@/app/page.module.css";
import {CalendarIcon} from "@/public/CalendarIcon";
import { DurationIcon } from "@/public/DurationIcon";
import { UserIcon } from "@/public/UsersIcon";
import { CountdownTimer } from "./CountdownTimer";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("default", {
    dateStyle: "long",
    timeStyle: "short",
  });
  return formatter.format(date);
};

const meetingDuration = (startDate: string, endDate: string) => {
    let start = new Date(startDate);
    let end = new Date(endDate);

    // difference in milliseconds
    let duration: number = end.getTime() - start.getTime();
    // Converting time into hh:mm:ss format

    // Total number of seconds in the difference
    const totalSeconds = Math.floor(duration / 1000);

    // Total number of minutes in the difference
    const totalMinutes = Math.floor(totalSeconds / 60);

    // Total number of hours in the difference
    const totalHours = Math.floor(totalMinutes / 60);

    // Getting the number of seconds left in one minute
    const remSeconds = totalSeconds % 60;

    // Getting the number of minutes left in one hour
    const remMinutes = totalMinutes % 60;

    return `${totalHours}h ${remMinutes}m`;
}


interface MeetingDetails {
    startTime: string,
    endTime: string,
    status: string
}

interface DetailItems {
    icon: React.ReactNode,
    children: React.ReactNode
}

const DetailItem = ({
  icon,
  children,
}: DetailItems) => (
  <span className={styles.itemdetail}>
    {icon}
    <span style={{ marginLeft: "0.3rem" }}>{children}</span>
  </span>
);

export const ListItemDetail = ({startTime, endTime, status}: MeetingDetails) => {
  const now = Date.now();
  const isMeetingInProgress = (now > Date.parse(startTime) && now < Date.parse(endTime));
  const isPastMeeting = (Date.parse(endTime) - now) < 0;
  const showTimer = !isPastMeeting && status != "Cancelled";
    return (
        <>
           <span className={styles.carddetails}>
                <DetailItem icon={<CalendarIcon />}>{formatDate(startTime)}</DetailItem> 
                <span className={styles.seperator}>|</span>
                <DetailItem icon={<DurationIcon />}>{meetingDuration(startTime, endTime)}</DetailItem>
                <span className={styles.seperator}>|</span>
                <DetailItem icon={<UserIcon/>}>{Math.floor(Math.random() * 20)}</DetailItem>

                {showTimer ? 
                    <>
                    <span className={styles.seperator}>|</span>
                    <DetailItem icon={<DurationIcon/>}><CountdownTimer startTime={startTime} endTime={endTime}/></DetailItem>
                    </> : ""
                }
                {status === "Cancelled" ? 
                <>
                  <span className={styles.seperator}>|</span>
                  <DetailItem icon={null}> 🚨 Cancelled</DetailItem>
                </> : ""}
            </span>
        </>
    );
}