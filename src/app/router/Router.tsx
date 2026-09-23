import ManagementContest from '@features/contest-management/ui/pages/ManagementContestPage';
import ScoreViewer from '@features/contest-viewer/ui/pages/ScoreViewerPage';
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router';

import Loader from './Loader';

const Router = () =>
  useRoutes([
    {
      path: '/',
      children: [
        {
          path: '/',
          element: (
            <Suspense fallback={<Loader />}>
              <ManagementContest />
            </Suspense>
          ),
        },
        {
          path: '/contest-viewer',
          element: (
            <Suspense fallback={<Loader />}>
              <ScoreViewer />
            </Suspense>
          ),
        },
      ],
    },
  ]);

export default Router;
