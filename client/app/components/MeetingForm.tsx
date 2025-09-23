"use client";

import { Meeting } from "@/app/models/Meeting";
import { useMemo } from "react";
import * as Yup from "yup";
import { Form, Formik, FormikHelpers } from "formik";
import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Typography from "@mui/material/Typography";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

type MeetingFormValues = {
  title: string;
  startTime: Date | null;
  endTime: Date | null;
};

type Props = {
  initialData?: MeetingFormValues;
  onSubmitMeeting: (meeting: Omit<Meeting, "id">) => Promise<void>;
};
export default function MeetingForm({ initialData, onSubmitMeeting }: Props) {
  const initialValues: MeetingFormValues = useMemo(() => {
    if (initialData) {
      return {
        ...initialData,
        startTime: initialData.startTime
          ? new Date(initialData.startTime)
          : null,
        endTime: initialData.endTime ? new Date(initialData.endTime) : null,
      };
    }

    return { title: "", startTime: null, endTime: null };
  }, [initialData]);

  const validationSchema = useMemo(() => {
    return Yup.object({
      title: Yup.string()
        .min(
          5,
          `Name your meeting with minimum 5 characters, so every participant can directly see what's the meeting about`,
        )
        .required(`A meeting name is required`),
      startTime: Yup.date()
        .typeError("Please set a valid start time")
        .required(
          "Please set a start time so every participant knows when the meeting starts",
        ),
      endTime: Yup.date()
        .typeError("Please set a valid end time")
        .required(
          "Please set an end time so every participant knows when the meeting starts",
        )
        .min(Yup.ref("startTime"), "End must be after start")
        // Check duration
        .test(
          "max-duration",
          "Meeting duration must be less than 8 hours",
          function (end) {
            const { startTime } = this.parent;
            if (!startTime || !end) return true;
            const minutes = (end.getTime() - startTime.getTime()) / 60000;
            return minutes <= 8 * 60;
          },
        ),
    });
  }, []);

  const handleSubmit = async (
    values: MeetingFormValues,
    helpers: FormikHelpers<MeetingFormValues>,
  ) => {
    helpers.setSubmitting(true);

    try {
      // Convert Date objects -> ISO strings for your Meeting model
      const payload: Omit<Meeting, "id"> = {
        title: values.title,
        startTime: values.startTime ? values.startTime.toISOString() : "",
        endTime: values.endTime ? values.endTime.toISOString() : "",
      };

      await onSubmitMeeting(payload);
    } catch (err) {
      console.error(err);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            touched,
            errors,
            isSubmitting,
            isValid,
            dirty,
            handleChange,
            handleBlur,
            setFieldValue,
            setFieldTouched,
          }) => {
            return (
              <Form noValidate>
                <Stack spacing={3}>
                  {/* Header like the screenshot */}
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      Create a new meeting
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Complete the information below in order to create a new
                      meeting.
                    </Typography>
                  </Box>

                  {/* Meeting title */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      mb={0.5}
                      sx={{ fontWeight: "bold" }}
                    >
                      Meeting title <span style={{ color: "#d32f2f" }}>*</span>
                    </Typography>
                    <TextField
                      name="title"
                      placeholder="Write your meeting title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.title && Boolean(errors.title)}
                      helperText={touched.title && errors.title}
                      fullWidth
                      size="medium"
                    />
                  </Box>

                  {/* Start time: Date + Time side by side */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      mb={0.5}
                      sx={{ fontWeight: "bold" }}
                    >
                      Start time <span style={{ color: "#d32f2f" }}>*</span>
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={7}>
                        <DatePicker
                          value={values.startTime}
                          onChange={(datePicked) =>
                            setFieldValue("startTime", datePicked)
                          }
                          onClose={() => setFieldTouched("startTime", true)}
                          format="dd MMM. yyyy"
                          slotProps={{
                            textField: {
                              placeholder: "18 Feb. 2025",
                              fullWidth: true,
                              error:
                                touched.startTime && Boolean(errors.startTime),
                              helperText: touched.startTime && errors.startTime,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <TimePicker
                          value={values.startTime}
                          onChange={(datePicked) =>
                            setFieldValue("startTime", datePicked)
                          }
                          onClose={() => setFieldTouched("startTime", true)}
                          ampm={false}
                          format="HH:mm"
                          slotProps={{
                            textField: {
                              placeholder: "11:15",
                              fullWidth: true,
                              error:
                                touched.startTime && Boolean(errors.startTime),
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* End time: Date + Time side by side */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      mb={0.5}
                      sx={{ fontWeight: "bold" }}
                    >
                      End time <span style={{ color: "#d32f2f" }}>*</span>
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={7}>
                        <DatePicker
                          value={values.endTime}
                          onChange={(datePicked) =>
                            setFieldValue("endTime", datePicked)
                          }
                          onClose={() => setFieldTouched("endTime", true)}
                          format="dd MMM. yyyy"
                          minDate={values?.startTime ?? undefined}
                          slotProps={{
                            textField: {
                              placeholder: "18 Feb. 2025",
                              fullWidth: true,
                              error: touched.endTime && Boolean(errors.endTime),
                              helperText: touched.endTime && errors.endTime,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <TimePicker
                          value={values.endTime}
                          onChange={(datePicked) =>
                            setFieldValue("endTime", datePicked)
                          }
                          onClose={() => setFieldTouched("endTime", true)}
                          ampm={false}
                          format="HH:mm"
                          slotProps={{
                            textField: {
                              placeholder: "11:30",
                              fullWidth: true,
                              error: touched.endTime && Boolean(errors.endTime),
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Actions */}
                  <Box display="flex" gap={2} mt={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting || !dirty || !isValid}
                    >
                      {isSubmitting ? "Saving..." : "Save meeting"}
                    </Button>
                    <Button
                      type="reset"
                      variant="outlined"
                      disabled={isSubmitting}
                    >
                      Reset
                    </Button>
                  </Box>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </LocalizationProvider>
    </>
  );
}
