import { Contest } from '@shared/model/Contest';

type ScoreViewerVMInput = {
  contest: Contest | false;
  loading: boolean;
  value: number;
};

export const buildScoreViewerVM = ({ contest, loading, value }: ScoreViewerVMInput) => {
  return {
    hasContest: Boolean(contest),
    isLoading: loading,
    activeTab: value,
  };
};
