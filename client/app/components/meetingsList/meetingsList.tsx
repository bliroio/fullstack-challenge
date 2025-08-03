import { colors } from "@/app/styles/colors";
import { Subheading1 } from "@/app/styles/textStyles";
import { styled } from "styled-components";
import { Meeting } from "../../models/Meeting";
import { deliveredStatus, participants } from "./dummyData";
import { SingleMeeting } from "./singleMeeting";

type MeetingListProps = {
  meetings?: Meeting[];
};

export const MeetingsList = (props: MeetingListProps) => {
  const { meetings } = props;
  if (!meetings || meetings.length === 0) {
    return <div>No meetings available</div>;
  }

  return (
    <Container>
      <Title>My Meetings</Title>
      <MeetingsContainer>
        {meetings.map((meeting, index) => (
          <SingleMeeting
            key={meeting.id || index}
            id={meeting.id}
            title={meeting.title}
            startTime={meeting.startTime}
            endTime={meeting.endTime}
            delivered={deliveredStatus}
            participants={participants}
          />
        ))}
      </MeetingsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
`;

const MeetingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const Title = styled(Subheading1)`
  color: ${colors.dark1};
`;
