import { Fab, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Tooltip } from '@material-ui/core';
import { DeleteForever } from '@material-ui/icons';
import React from 'react';
import { useGetProjects } from '../../../../../common/hooks/useGetProjects';
import { setCurrentProject } from '../../../../../common/stores/currentProjectStore';
import { requestDeleteProject } from '../../stores/deleteProjectDialogStore';
import { DeleteProjectDialog } from '../DeleteProjectDialog/DeleteProjectDialog';

const useStyles = makeStyles(theme => ({
  deleteButton: {
    color: theme.palette.error.main,
    minHeight: 'unset',
    width: 36,
    height: 36,
    boxShadow: 'none !important'
  }
}));

export const ProjectList = () => {
  const classes = useStyles();

  const { data: projects } = useGetProjects();

  return (
    <>
      <List>
        {!!projects?.length ? (
          projects.map(project => (
            <ListItem key={project.id} onClick={() => setCurrentProject(project)} button>
              <ListItemText primary={project.name} />
              <ListItemSecondaryAction>
                <Tooltip title="Delete project">
                  <Fab
                    className={classes.deleteButton}
                    onClick={() => requestDeleteProject(project)}
                    edge="end"
                    aria-label="delete-project"
                  >
                    <DeleteForever />
                  </Fab>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <ListItem>There are no projects</ListItem>
        )}
      </List>

      <DeleteProjectDialog />
    </>
  );
};
