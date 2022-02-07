import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import Header from '../../../Layout/Header';
import Body from '../../../Body/Body';
import Project from '../../../Project';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
});

export const App = () => {
  const [projectId, setProjectId] = useState(1);

  function changeProject(projectid) {
    setProjectId(projectid);
  }

  function deleteProject() {
    setProjectId();
  }

  function generateProtocol() {
    setProjectId(0);
    // Need to figure out how to setshow Body vs Prot generator -> setShow in state did not work...
  }

  return (
    <>
      <Helmet>
        <link rel="stylesheet" href="https://bootswatch.com/4/sandstone/bootstrap.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <script
          src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
          integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
          crossorigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"
          integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN"
          crossorigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js"
          integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s"
          crossorigin="anonymous"
        ></script>
        <script src="https://unpkg.com/@rdkit/rdkit/Code/MinimalLib/dist/RDKit_minimal.js"></script>
        <script>
          {`window
            .initRDKitModule()
            .then(function(RDKit) {
              console.log('RDKit version: ' + RDKit.version());
              window.RDKit = RDKit;
              /**
               * The RDKit module is now loaded.
               * You can use it anywhere.
               */
            })
            .catch(() => {
              // handle loading errors here...
            })`}
        </script>
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <Header changeProject={changeProject} deleteProject={deleteProject} generateProtocol={generateProtocol} />
        {projectId && <Project projectId={projectId} />}
        {/* <ProtocolBody ProjectID={ProjectID} key={ProjectID + 1} /> */}
      </QueryClientProvider>
    </>
  );
};
