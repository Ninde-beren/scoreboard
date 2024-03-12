import React, {FC, useEffect, useState} from 'react';
import MatchSkeletonTournament from "../../managementContest/MatchSkeletonTournament";
import {Stage} from "../../../_types/Stage";
import Match from "../scoreBoardTournament/Match";
import {dataOnSide} from "../../../_styles/Style";
import {Box} from "@mui/material";

const EditMatchScore: FC<{ stage: Stage }> = ({stage}) => {

    const [skeletonNumber, setSkeletonNumber] = useState(0);
    const [skeletons, setSkeletons] = useState<number[]>([]);

    useEffect(() => {
        console.log('edit match score',stage)
        setSkeletonNumber(() => (stage.totalMatchs - stage.matchs.length + 1))
        for (let i = 1; i < skeletonNumber; i++)
        skeletons.push(i)
    }, []);

    return (
        <>
            {stage.matchs.map((match, index) =>
                <Match match={match}/>
            )}
            {skeletons.map((value, index) =>
                <MatchSkeletonTournament key={index}/>
            )}
        </>
    )
}

export default EditMatchScore
