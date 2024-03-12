import React, {useState} from 'react';
import Add from "../request/Add";
import Update from "../request/Update";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import GetContest from "../request/GetContest";
import {Contest} from "../_types/Contest";
import {contestObserver} from "../App";
import {StageType} from "../_types/StageType";
import {SubContest} from "../_types/SubContest";

const AddContest = () => {
    const [name, setName] = useState("");
    const [teamNumber, setTeamNumber] = useState("2");
    const [poolNumber, setPoolNumber] = useState("4");
    const add = () => {
        Add('contest', {name: name, stages: [], teams: [], date: '01/05/2023', winners: []}).then(async contest => {

            const params = await Add('params', {teamNumber: teamNumber, poolNumber: poolNumber})
            console.log(contest, params)
            const contestParam = await Update('contest', contest.id, {params: params.id})

            const stage = await Add('stage', {type: StageType.POOL, pools: []})
            const contest1 = await Update('contest', contestParam.id, {stages: [stage.id]})

            const stage2 = await Add('stage', {type: StageType.EIGHTER_FINAL, matchs: [], subContest: SubContest.PRINCIPALE, totalMatchs: 8});
            const stage21 = await Add('stage', {type: StageType.EIGHTER_FINAL, matchs: [],subContest: SubContest.CONSOLANTE, totalMatchs: 8});
            const contest2 = await Update('contest', contest.id, {stages: [...contest1.stages, stage2.id, stage21.id]})

            const stage3 = await Add('stage', {type: StageType.QUARTER_FINAL, matchs: [], subContest: SubContest.PRINCIPALE,totalMatchs: 4})
            const stage31 = await Add('stage', {type: StageType.QUARTER_FINAL, matchs: [],subContest: SubContest.CONSOLANTE, totalMatchs: 4})
            const contest3 = await Update('contest', contest.id, {stages: [...contest2.stages, stage3.id, stage31.id]})

            const stage4 = await Add('stage', {type: StageType.SEMI_FINAL, matchs: [], subContest:  SubContest.PRINCIPALE,totalMatchs: 2})
            const stage41 = await Add('stage', {type: StageType.SEMI_FINAL, matchs: [],subContest: SubContest.CONSOLANTE, totalMatchs: 2})
            const contest4 = await Update('contest', contest.id, {stages: [...contest3.stages, stage4.id, stage41.id]})

            const stage5 = await Add('stage', {type: StageType.FINAL, matchs: [], subContest: SubContest.PRINCIPALE,totalMatchs: 1})
            const stage51 = await Add('stage', {type: StageType.FINAL, matchs: [],subContest: SubContest.CONSOLANTE, totalMatchs: 1})
            await Update('contest', contest.id, {stages: [...contest4.stages, stage5.id, stage51.id]})

            GetContest().then((contest: Contest) => {
                localStorage.setItem("contest", JSON.stringify(contest));
                contestObserver.next(contest)
            })
        })
    }

    return (
            <Container>
                <Stack height="100vh" alignItems="center" justifyContent="center" spacing={2}>
                    <Typography variant="h4" padding={1}>Quel est le nom de votre concours ? </Typography>
                        <Paper>
                            <TextField
                                type="text"
                                value={name}

                                onChange={ev => setName(ev.target.value)}
                            />
                        </Paper>
                    <Typography variant="h4" padding={1}>Quel est le nombre de joueurs par équipe ? </Typography>
                    <Paper sx={{
                        padding: 1
                    }}>
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue={teamNumber}
                                name="radio-buttons-group"
                                onChange={(e) => {
                                    setTeamNumber(e.target.value)
                                }}
                            >
                                <FormControlLabel value="2" control={<Radio sx={ButtonColors}/>} label="Doublette"/>
                                <FormControlLabel value="3" control={<Radio sx={ButtonColors}/>} label="Triplette"/>
                                <FormControlLabel value="4" control={<Radio sx={ButtonColors}/>} label="Quadriplette"/>
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                    <Typography variant="h4" padding={1}>Quel est le nombre d'équipes par poule ? </Typography>
                    <Paper sx={{
                        padding: 1
                    }}>
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue={poolNumber}
                                name="radio-buttons-group"
                                onChange={(e) => {
                                    setPoolNumber(e.target.value)
                                }}
                            >
                                <FormControlLabel value="3" control={<Radio sx={ButtonColors}/>} label="3"/>
                                <FormControlLabel value="4" control={<Radio sx={ButtonColors}/>} label="4"/>
                                <FormControlLabel value="5" control={<Radio sx={ButtonColors}/>} label="5"/>
                                <FormControlLabel value="6" control={<Radio sx={ButtonColors}/>} label="6"/>
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                    <Box width={450}>
                    <Button sx={{mt:2,p: 1}} variant="contained" fullWidth onClick={add}>
                        Go !
                    </Button>
                    </Box>
                </Stack>
            </Container>
    );
};

const ButtonColors = {
    color: "#4A9AD5",
    '&.Mui-checked': {
        color: "#C32533",
    }
}
export default AddContest;
