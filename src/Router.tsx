import React, {Suspense} from "react";
import {useRoutes,} from "react-router-dom";
import ManagementContest from "./page/ManagementContest";
import ScoreViewer from "./page/ScoreViewer";

const Loader = () => <img src="https://scontent-cdg4-1.xx.fbcdn.net/v/t39.30808-6/311478792_2954168274884006_60309490960188610_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=TYxMoTlnA8cAX9Hin4o&_nc_ht=scontent-cdg4-1.xx&oh=00_AfDVLukvyLAHiukdnB-z4Y2L1aanvq7F8K87JfQeSDjwpw&oe=641D5DF3" alt="logo"/>

const Router = () => useRoutes([
    {
        path: "/",
        children: [
            {
                path: "/",
                element: (
                    <Suspense fallback={<Loader/>}>
                        <ManagementContest/>
                    </Suspense>
                ),
            },
            {
                path: "/scoreboard",
                element: (
                    <Suspense fallback={<Loader/>}>
                        <ScoreViewer/>
                    </Suspense>
                ),
            }
        ]
    }]);

export default Router