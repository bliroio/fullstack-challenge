import Calendar from "@/app/assets/svgs/calendar.svg";
import MoreIcon from "@/app/assets/svgs/more-horizontal.svg";
import Delivered from "@/app/assets/svgs/send-horizontal.svg";
import Timer from "@/app/assets/svgs/timer.svg";
import User from "@/app/assets/svgs/user.svg";
import Users from "@/app/assets/svgs/users.svg";

import { colors } from "@/app/styles/colors";
import {
  BodyNormalSemiBold,
  BodyXXSmallRegular,
} from "@/app/styles/textStyles";
import { styled } from "styled-components";

type MeetingProps = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  delivered?: boolean;
  participants?: string[];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${month}. ${year} - ${hours}.${minutes}`;
};

const meetingDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const duration = (end.getTime() - start.getTime()) / 60000; // duration in minutes
  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60);
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};

export const SingleMeeting = (props: MeetingProps) => {
  const { id, title, startTime, endTime } = props;
  const formattedStartTime = formatDate(startTime);
  const duration = meetingDuration(startTime, endTime);
  const formattedParticipants = props.participants?.map(
    (participant) =>
      participant.split(" ")[0] + " " + participant.split(" ")[1][0] + "."
  );
  const amountOfParticipants = formattedParticipants?.length || 0;
  const participantsString =
    formattedParticipants?.splice(0, 3).join(", ") +
    (amountOfParticipants > 3 ? ` +${amountOfParticipants - 3} others` : "");

  return (
    <MeetingContainer key={id}>
      <InnerContainer>
        <MeetingContent>
          <MeetingTitle>{title}</MeetingTitle>
          <MeetingDetails>
            <SingleDetailContainer>
              <Calendar />
              <DetailsText>{formattedStartTime}</DetailsText>
            </SingleDetailContainer>
            <DetailsDivider />
            <SingleDetailContainer>
              <Timer />
              <DetailsText>{duration}</DetailsText>
            </SingleDetailContainer>
            <DetailsDivider />
            <SingleDetailContainer>
              <Delivered />
              <DetailsText>delivered</DetailsText>
            </SingleDetailContainer>
            <DetailsDivider />
            <SingleDetailContainer>
              <Users />
              <DetailsText>{amountOfParticipants}</DetailsText>
            </SingleDetailContainer>
            <DetailsDivider />
            <SingleDetailContainer>
              <User />
              <DetailsText>{participantsString}</DetailsText>
            </SingleDetailContainer>
          </MeetingDetails>
        </MeetingContent>
        <MoreIcon />
      </InnerContainer>
    </MeetingContainer>
  );
};

const MeetingContainer = styled.div`
  padding: 16px;
  padding-left: 24px;
  border-radius: 4px;
  border: 1px solid ${colors.dark7};
  box-shadow: 0px 1px 1px rgba(19, 26, 38, 0.08);
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const MeetingContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MeetingTitle = styled(BodyNormalSemiBold)`
  color: ${colors.dark2};
  margin: 0;
`;

const MeetingDetails = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const DetailsText = styled(BodyXXSmallRegular)`
  color: ${colors.dark4};
`;

const DetailsDivider = styled.div`
  width: 1px;
  height: 16px;
  margin: 0 2px;
  background-color: ${colors.dark6};
`;

const SingleDetailContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
