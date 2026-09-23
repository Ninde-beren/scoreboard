import { Box, Typography } from '@mui/material';
import { TeamBuildingMemberProps } from '@shared/domain/model/sharedUi.model';
import { Member as MemberType } from '@shared/model/Member';
const Member = ({ team, teamId }: TeamBuildingMemberProps) => {
  return (
    <>
      {team.members?.map((member: MemberType, index: number) => (
        <Box sx={style} key={teamId + index + '-member'}>
          <Typography variant="body1" sx={{ transform: 'skewX(20deg)' }}>
            {member?.name}
          </Typography>
        </Box>
      ))}
    </>
  );
};
export default Member;

const style = {
  color: 'white',
  backgroundColor: '#4A9AD5',
  p: 1,
  borderImage:
    'linear-gradient(50deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%) 1',
  borderBottom: '5px solid',
};
