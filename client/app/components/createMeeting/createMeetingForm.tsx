import { colors } from "@/app/styles/colors";
import { BodyNormalRegular, Subheading1 } from "@/app/styles/textStyles";
import { useState } from "react";
import { styled } from "styled-components";
import { InputField } from "../global/inputField";
import { TextArea } from "../global/textArea";

type CreateMeetingFormProps = {
  onFormDataChange: (data: {
    title: string;
    startTime: string;
    endTime: string;
  }) => void;
};

function parseDateTimeToISOString(dateStr: string, timeStr: string): string {
  // Example dateStr: "18 Feb. 2025", timeStr: "11:15"
  if (!dateStr || !timeStr) return "";

  // Remove dot from month if present
  const cleanedDateStr = dateStr.replace(".", "");

  // Parse date
  const dateParts = cleanedDateStr.split(" ");
  if (dateParts.length !== 3) return "";

  const day = dateParts[0];
  const month = dateParts[1];
  const year = dateParts[2];

  // Map month name to number
  const months: { [key: string]: string } = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const monthNum = months[month];
  if (!monthNum) return "";

  // Build ISO string
  const isoString = `${year}-${monthNum.padStart(2, "0")}-${day.padStart(2, "0")}T${timeStr}:00.000Z`;
  const dateObj = new Date(isoString);

  // Return ISO string in UTC
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

    const startDateTime = parseDateTimeToISOString(
      formData.startDate,
      formData.startTime
    );
    const endDateTime = parseDateTimeToISOString(
      formData.endDate,
      formData.endTime
    );

    console.log("Updated Form Data:", updatedData); // Debugging line to check updated data

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
        <HorizontalFieldsContainer>
          <InputField
            label="Start time"
            placeholder="18 Feb. 2025"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData({ startDate: e.target.value })
            }
            required
          />
          <InputField
            placeholder="11:15"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData({ startTime: e.target.value })
            }
          />
        </HorizontalFieldsContainer>
        <HorizontalFieldsContainer>
          <InputField
            label="End time"
            placeholder="18 Feb. 2025"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData({ endDate: e.target.value })
            }
            required
          />
          <InputField
            placeholder="11:15"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData({ endTime: e.target.value })
            }
          />
        </HorizontalFieldsContainer>
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

const SmallInputField = styled(InputField)`
  width: 25%;
`;

const HorizontalFieldsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  > :first-child {
    width: calc(75% - 24px);
  }
  > :last-child {
    width: calc(25% - 24px);
  }
`;
