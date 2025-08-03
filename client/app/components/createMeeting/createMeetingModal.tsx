import { colors } from "@/app/styles/colors";
import { useState } from "react";
import { styled } from "styled-components";
import { MainButton } from "../global/mainButton";
import { CreateMeetingForm } from "./createMeetingForm";
import { useHandleCreateNewMeeting } from "./utils/useHandleCreateNewMeeting";

export const hexWithOpacity = (hex: string, opacity: number) => {
  const hexWithoutHash = hex.replace("#", "");
  const r = parseInt(hexWithoutHash.substring(0, 2), 16);
  const g = parseInt(hexWithoutHash.substring(2, 4), 16);
  const b = parseInt(hexWithoutHash.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

type CreateMeetingModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export const CreateMeetingModal = ({
  onClose,
  onSuccess,
}: CreateMeetingModalProps) => {
  const { handleCreateMeeting, isLoading, error } = useHandleCreateNewMeeting();
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });

  const isFormValid = formData.title && formData.startTime && formData.endTime;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const result = await handleCreateMeeting(formData);
    if (result) {
      onSuccess?.();
      onClose?.();
    } else {
      console.error("Failed to create meeting");
    }
  };

  return (
    <ModalContainer>
      <ModalContent>
        <CreateMeetingForm onFormDataChange={setFormData} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ButtonsContainer>
          <MainButton
            text="Cancel"
            onClick={onClose}
            color={colors.white}
            $textColor={colors.dark2}
            $borderColor={colors.dark6}
            disabled={isLoading}
          />
          <MainButton
            text={isLoading ? "Creating..." : "Create"}
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
          />
        </ButtonsContainer>
      </ModalContent>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${hexWithOpacity(colors.dark1, 0.75)};
  display: flex;
  justify-content: flex-end;
`;

const ModalContent = styled.div`
  background-color: white;
  z-index: 1;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
  width: 100%;
  > * {
    width: 50%;
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.red};
  font-size: 14px;
  margin-top: 8px;
  padding: 8px;
  background-color: #ffeaea;
  border: 1px solid #ffcccb;
  border-radius: 4px;
`;
