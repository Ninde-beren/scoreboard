import { PoolProps } from '@features/contest-viewer/domain/model/scoreboardUi.model';
import { Paper } from '@mui/material';
import { Match } from '@shared/model/Match';
import MatchRowContent from '@shared/ui/components/MatchRowContent';
import { itemListStyle } from '@shared/ui/styles/Style';
const Pool = ({ pool }: PoolProps) => {
  return (
    <>
      {pool.matchs.map((match: Match, index: number) => (
        <Paper key={index} sx={[itemListStyle]} elevation={5}>
          <MatchRowContent match={match} />
        </Paper>
      ))}
    </>
  );
};
export default Pool;
