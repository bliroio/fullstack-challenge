import {FC} from 'react';
import {Button, ButtonGroup, Drawer, FormLabel, TextareaAutosize, TextField} from '@mui/material';
import {useCreateMeetingDrawer} from '@/app/components/CreateMeetingDrawer/CreateMeetingDrawer.logic';
import Typography from '@mui/material/Typography';

interface CreateMeetingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateMeetingDrawer: FC<CreateMeetingDrawerProps> = ({isOpen, onClose}) => {
  const {getValues, setValue, isValid} = useCreateMeetingDrawer();

  return (
    <Drawer open={isOpen} onClose={onClose} variant={'temporary'} anchor={'right'}>
      <div className={'w-[480px] flex flex-col gap-8 p-8'}>
        <Typography variant={'h3'}>Create a new meeting</Typography>
        <Typography variant={'body1'}>Complete the information below in order to create a new meeting.</Typography>

        <form className={'flex flex-col gap-4 p-4'}>
          <FormLabel className={'flex flex-col gap-1'}>
            <Typography variant={'caption'}>
              Meeting title <span className={'text-red-800'}>*</span>
            </Typography>
            <TextField
              variant={'outlined'}
              required
              value={getValues().meetingTitle}
              onChange={(e) => setValue('meetingTitle', e.target.value)}
            />
          </FormLabel>

          <FormLabel className={'flex flex-col gap-1'}>
            <Typography variant={'caption'}>
              Start time<span className={'text-red-800'}>*</span>
            </Typography>
            <div className={'flex gap-2'}>
              <TextField
                variant={'outlined'}
                required
                type={'date'}
                value={getValues().startDate}
                onChange={(e) => setValue('startDate', e.target.value)}
              ></TextField>
              <TextField
                variant={'outlined'}
                required
                type={'time'}
                value={getValues().startTime}
                onChange={(e) => setValue('startTime', e.target.value)}
              />
            </div>
          </FormLabel>

          <FormLabel className={'flex flex-col gap-1'}>
            <Typography variant={'caption'}>
              End time<span className={'text-red-800'}>*</span>
            </Typography>
            <div className={'flex gap-2'}>
              <TextField
                variant={'outlined'}
                required
                type={'date'}
                value={getValues().endDate}
                onChange={(e) => setValue('endDate', e.target.value)}
              />
              <TextField
                variant={'outlined'}
                required
                type={'time'}
                value={getValues().endTime}
                onChange={(e) => setValue('endTime', e.target.value)}
              />
            </div>
          </FormLabel>

          <FormLabel className={'flex flex-col gap-1'}>
            <Typography variant={'caption'}>Description</Typography>
            <TextareaAutosize
              className={'border-[0.5px] border-gray-500'}
              minRows={4}
              style={{width: '100%'}}
              value={getValues().description}
              onChange={(e) => e.target.value}
            />
          </FormLabel>
        </form>

        <div className={'sticky bottom-0'}>
          <ButtonGroup>
            <Button variant={'outlined'} className={'h-10'} onClick={onClose}>
              Cancel
            </Button>
            <Button variant={'contained'} color={'warning'} className={'h-10'} disabled={!isValid}>
              Save
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </Drawer>
  );
};
