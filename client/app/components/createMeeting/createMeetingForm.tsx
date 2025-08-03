import { colors } from "@/app/styles/colors";
import { BodyNormalRegular, Subheading1 } from "@/app/styles/textStyles";
import { useState } from "react";
import { styled } from "styled-components";
import { DateTimeInput } from "../global/dateTimeInput";
import { InputField } from "../global/inputField";
import { TextArea } from "../global/textArea";

type CreateMeetingFormProps = {
  onFormDataChange: (data: {
    title: string;
    startTime: string;
    endTime: string;
  }) => void;
};

function combineDateTime(date: string, time: string): string {
  if (!date || !time) return "";

  // Combine date and time into ISO string
  const dateTimeString = `${date}T${time}:00.000Z`;
  const dateObj = new Date(dateTimeString);

  // Return ISO string
  return dateObj.toISOString();
}

export const CreateMeetingForm = ({
  onFormDataChange,
}: CreateMeetingFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    description: "",
  });

  // Update parent component whenever form data changes
  const updateFormData = (newData: Partial<typeof formData>) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);

    const startDateTime = combineDateTime(
      updatedData.startDate,
      updatedData.startTime
    );
    const endDateTime = combineDateTime(
      updatedData.endDate,
      updatedData.endTime
    );

    onFormDataChange({
      title: updatedData.title,
      startTime: startDateTime,
      endTime: endDateTime,
    });
  };

  return (
    <Container>
      <HeaderContainer>
        <Title>Create New Meeting</Title>
        <Description>
          Complete the information below in order to create a new meeting.
        </Description>
      </HeaderContainer>
      <FieldsContainer>
        <InputField
          label="Meeting title"
          placeholder="Write your meeting title"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData({ title: e.target.value })
          }
          required
        />
        <DateTimeInput
          dateLabel="Start date"
          timeLabel="Time"
          onDateChange={(date: string) => updateFormData({ startDate: date })}
          onTimeChange={(time: string) => updateFormData({ startTime: time })}
          dateValue={formData.startDate}
          timeValue={formData.startTime}
          required
        />
        <DateTimeInput
          dateLabel="End date"
          timeLabel="Time"
          onDateChange={(date: string) => updateFormData({ endDate: date })}
          onTimeChange={(time: string) => updateFormData({ endTime: time })}
          dateValue={formData.endDate}
          timeValue={formData.endTime}
          required
        />
        <TextArea
          label="Description"
          placeholder="Write a description for your meeting"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            updateFormData({ description: e.target.value })
          }
        />
      </FieldsContainer>
    </Container>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 32px;
`;

const Title = styled(Subheading1)`
  color: ${colors.dark1};
`;

const Description = styled(BodyNormalRegular)`
  color: ${colors.dark3};
`;

const FieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: calc(100% - 32px);
`;
