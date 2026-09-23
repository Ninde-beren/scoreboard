import { EditMatchScoreProps } from '@features/contest-viewer/domain/model/scoreboardUi.model';
import Match from '@features/contest-viewer/ui/components/scoreBoardTournament/Match';
import { useEffect, useMemo } from 'react';

import MatchSkeletonTournament from './MatchSkeletonTournament';

const EditMatchScore = ({ stage }: EditMatchScoreProps) => {
  const skeletonNumber = stage.totalMatchs - stage.matchs.length + 1;
  const skeletons = useMemo(() => {
    const count = Math.max(0, skeletonNumber - 1);
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [skeletonNumber]);

  useEffect(() => {}, [stage]);

  return (
    <>
      {stage.matchs.map((match) => (
        <Match match={match} />
      ))}
      {skeletons.map((value, index) => (
        <MatchSkeletonTournament key={index} />
      ))}
    </>
  );
};

export default EditMatchScore;
