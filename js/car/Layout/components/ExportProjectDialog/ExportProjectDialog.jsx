import React from 'react';
import { useQueryClient } from 'react-query';
import { SubmitDialog } from '../../../common/components/SubmitDialog';
import { Typography } from '@material-ui/core';
import { DialogSection } from '../../../common/components/DialogSection';
import { DialogSectionHeading } from '../../../common/components/DialogSectionHeading';
import { getTargetsQueryKey } from '../../../common/api/targetsQueryKeys';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { FormExportBatchSelector } from './components/FormExportBatchSelector';
import { parseAsync } from 'json2csv';
import { axiosGet } from '../../../common/utils/axiosFunctions';
import { useGlobalSnackbar } from '../../../common/hooks/useGlobalSnackbar';
import { useProjectSnackbar } from '../../../common/hooks/useProjectSnackbar';
import { CloseSnackbarButton } from '../../../common/components/CloseSnackbarButton';
import { DownloadButton } from './components/DownloadButton/DownloadButton';

export const ExportProjectDialog = ({ open, onClose }) => {
  const queryClient = useQueryClient();

  const { enqueueSnackbarInfo } = useProjectSnackbar();
  const { enqueueSnackbarSuccess, enqueueSnackbarError, closeSnackbar } = useGlobalSnackbar();

  return (
    <Formik
      initialValues={{
        selectedBatchesMap: {}
      }}
      validationSchema={yup.object().shape({
        selectedBatchesMap: yup
          .object()
          .test('one-or-more-selected', 'Select at least one batch', value => Object.values(value).some(val => val))
      })}
      onSubmit={async ({ selectedBatchesMap }) => {
        onClose();

        const messageId = enqueueSnackbarInfo('Your download is being prepared...');

        try {
          const selectedBatchesIds = Object.entries(selectedBatchesMap)
            .filter(([_, value]) => value)
            .map(([key]) => Number(key));

          const batchTargets = await Promise.all(
            selectedBatchesIds.map(id => {
              const queryKey = getTargetsQueryKey({ batch_id: id, fetchall: 'yes' });

              return queryClient.fetchQuery({ queryKey, queryFn: async () => (await axiosGet(queryKey)).results });
            })
          );

          // This transforms the data into an array where an item represents a method
          const data = batchTargets
            .map(targets =>
              targets.map(target =>
                target.methods?.map((method, i) => ({
                  target_SMILES: target.smiles,
                  method_no: i + 1,
                  ...Object.fromEntries(
                    method.reactions
                      .map((reaction, j) => [
                        ...reaction.reactants.map((reactant, k) => [`react${j + 1}.${k + 1}_SMILES`, reactant.smiles]),
                        [`prod${j + 1}_SMILES`, reaction.products[0].smiles]
                      ])
                      .flat()
                  )
                }))
              )
            )
            .flat(2);

          // From the data derive the unique columns since the number of columns depends on the data
          const fields = [
            ...new Set(
              data.reduce((accumulator, item) => {
                return [...accumulator, ...Object.keys(item)];
              }, [])
            )
          ];

          const csvData = await parseAsync(data, { fields });

          closeSnackbar(messageId);
          enqueueSnackbarSuccess('Your download is ready', {
            action: key => (
              <>
                <DownloadButton messageId={key} csvData={csvData} />
                <CloseSnackbarButton messageId={key} />
              </>
            )
          });
        } catch (err) {
          closeSnackbar(messageId);
          enqueueSnackbarError(err.message);
        }
      }}
    >
      {({ isSubmitting, resetForm }) => (
        <SubmitDialog
          id="export-project-dialog"
          open={open}
          title="Export project"
          content={
            <Form id="export-project-form">
              <DialogSection>
                <DialogSectionHeading>Batches</DialogSectionHeading>
                <Typography>Please select batches for export:</Typography>

                <FormExportBatchSelector name="selectedBatchesMap" label="Batch selector" />
              </DialogSection>
            </Form>
          }
          onClose={onClose}
          submitDisabled={isSubmitting}
          SubmitButtonProps={{
            type: 'submit',
            form: 'export-project-form',
            children: 'Download'
          }}
          TransitionProps={{
            onExited: () => {
              resetForm();
            }
          }}
        />
      )}
    </Formik>
  );
};
