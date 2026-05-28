import { useState } from "react";
import { Meeting } from "../../../models/Meeting";

const ONE_HOUR_MS = 60 * 60 * 1000;

const buildInitialFormData = (): FormData => {
  const startTime = new Date();
  return {
    title: "",
    startTime,
    endTime: new Date(startTime.getTime() + ONE_HOUR_MS),
    roomId: "",
  };
};

interface UseCreateMeetingFormProps {
  onSubmit: (meeting: Omit<Meeting, "_id">) => Promise<void>;
  onClose: () => void;
}

interface FormData {
  title: string;
  startTime: Date | null;
  endTime: Date | null;
  roomId: string;
}

interface FormErrors {
  title?: string;
  startTime?: string;
  endTime?: string;
  roomId?: string;
  general?: string;
}

export const useCreateMeetingForm = ({
  onSubmit,
  onClose,
}: UseCreateMeetingFormProps) => {
  const [formData, setFormData] = useState<FormData>(buildInitialFormData);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({});

    try {
      await onSubmit({
        title: formData.title.trim(),
        startTime: formData.startTime!.toISOString(),
        endTime: formData.endTime!.toISOString(),
        roomId: formData.roomId,
      });
      resetForm();
    } catch (error) {
      console.error("Error creating meeting:", error);
      setErrors({
        general: "Failed to create meeting. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(buildInitialFormData());
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateField = (field: keyof FormData, value: string | Date | null) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Keep endTime strictly after startTime when the user moves startTime.
      if (
        field === "startTime" &&
        value instanceof Date &&
        (!prev.endTime || prev.endTime <= value)
      ) {
        next.endTime = new Date(value.getTime() + ONE_HOUR_MS);
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const isFormValid =
    !!formData.title.trim() &&
    !!formData.roomId &&
    !!formData.startTime &&
    !!formData.endTime &&
    formData.startTime < formData.endTime;

  return {
    formData,
    errors,
    isSubmitting,
    isFormValid,
    handleSubmit,
    handleClose,
    updateField,
  };
};
