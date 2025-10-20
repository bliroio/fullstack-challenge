import { useState } from "react";
import { Meeting } from "../../../models/Meeting";

interface UseCreateMeetingFormProps {
  onSubmit: (meeting: Omit<Meeting, "id">) => Promise<void>;
  onClose: () => void;
}

interface FormData {
  title: string;
  startTime: Date | null;
  endTime: Date | null;
}

interface FormErrors {
  title?: string;
  startTime?: string;
  endTime?: string;
  general?: string;
}

export const useCreateMeetingForm = ({
  onSubmit,
  onClose,
}: UseCreateMeetingFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    startTime: new Date(),
    endTime: new Date(),
  });

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
    setFormData({
      title: "",
      startTime: new Date(),
      endTime: new Date(),
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateField = (field: keyof FormData, value: string | Date | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const isFormValid =
    formData.title.trim() &&
    formData.startTime &&
    formData.endTime &&
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
