import { contestObserver } from '@app/App';
import GetContest from '@features/contest-management/infra/db/GetContest';
import { Contest } from '@shared/model/Contest';

export const broadcastContestUpdate = (contest: Contest) => {
  localStorage.setItem('contest', JSON.stringify(contest));
  contestObserver.next(contest);
};

export const refreshContestState = async () => {
  const contest = await GetContest();
  if (contest) {
    broadcastContestUpdate(contest);
  }
  return contest;
};
