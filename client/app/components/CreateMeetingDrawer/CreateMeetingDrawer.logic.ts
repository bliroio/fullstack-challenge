import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

const createMeetingSchema = z.object({
  meetingTitle: z.string().min(1, 'Meeting title is required'),
  startDate: z.string().min(1, 'Start date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endDate: z.string().min(1, 'End date is required'),
  endTime: z.string().min(1, 'End time is required'),
  description: z.string().optional()
});

type CreateMeetingSchema = z.infer<typeof createMeetingSchema>;

export const useCreateMeetingDrawer = () => {
  const {setValue, getValues, handleSubmit, control, formState: {isValid}} = useForm<CreateMeetingSchema>({
    resolver: zodResolver(createMeetingSchema)
  });

  const onSubmit = (data: CreateMeetingSchema) => {


  }


  const validateForm = () => {

  }

  return {
    control,
    getValues,
    setValue,
    isValid
  }
};
