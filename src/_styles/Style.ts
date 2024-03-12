export const paperStyle = {
    transform: 'skewX(-20deg)',
    position: 'relative',
    width: 200,
    backgroundColor: 'transparent',
};

export const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 475,
}


export const paperMarginBottom = {
    marginBottom: '65px !important'
}

export const teamHeaderStyle = {
    backgroundColor: "#C32533",
    color: "white",
    borderRadius: '10px',
    position: 'relative',
    top: -30,
    left: -25,
    width: 275,
};
export const teamBodyStyle = {
    backgroundColor: "#C32533",
    color: "white",
    borderRadius: '10px',
    marginTop: '-30px',
    width: 200,
};

export const popoverStyle = {
    color: 'white',
    border: '4px solid',
    borderImage: 'linear-gradient(210deg, #4a9ad5, #ffffff, #C32533, #ffffff, #4a9ad5)1',
    backgroundColor: "#4a9ad5",
    padding: 2
}

export const notSkew = {
    transform: 'skewX(20deg)'
}
export const stageHeaderStyle = {
    transform: 'skewX(-20deg)',
    padding: '10px 20px',
    backgroundColor: "#C32533",
    color: "white",
    borderRadius: 1,
    position: "relative"
};

export const poolHeaderStyle = {
    transform: 'skewX(-5deg)',
    padding: '10px 20px',
    backgroundColor: "#C32533",
    color: "white",
    borderRadius: 1,
};

export const matchStyle = {
    width: 250,
    border: '4px solid',
    borderImage: 'linear-gradient(50deg, rgba(74,154,213,1) 0%, rgba(255,255,255,1) 50%, rgba(74,154,213,1) 100%)1',
}
export const matchTeamStyle = {
    position: 'relative',
    backgroundColor: "#4A9AD5",
    height: 30,
}
export const matchTeamDividerStyle = {
    borderImage: 'linear-gradient(50deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)1',
    borderBottom: '5px solid',
}


export const itemListStyle = {
    color: "white",
    width: 500,
    backgroundColor: "#4A9AD5",
    borderImage: 'linear-gradient(50deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)1',
    borderTop: '5px solid',
    borderBottom: '5px solid',
    borderWidth: '5px',
};
export const scoreStyle = {
    color: 'white',
    width: 50,
    backgroundColor: "#C32533",
    position: 'absolute',
    right: -20,
    p: '8px 10px 0',
    height: 40,
    borderRadius: 1
};
export const scoreTournamentStyle = {
    color: 'white',
    width: 50,
    backgroundColor: "#C32533",
    position: 'relative',
    right: -25,
    borderRadius: 1,
    transform: 'skew(-20deg)'
};
export const scoreItemListStyle = {
    width: 20,
    backgroundColor: "#C32533",
    p: '5px 14px',
};

export const avatarStyle = {
    position: 'absolute',
    width: '56px',
    height: '56px',
    background: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(50deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%) border-box',
    color: '#313149',
    //padding: '10px',
    border: '3px solid transparent',
    // borderRadius: '50' +
    //     '%',
    // display: 'inline-block',
}
export const leftStyle = {
    left: '45px'
}
export const rightStyle = {
    right: '45px'
}


export const dataOnSide = {
    '& > button':{
        marginX: 10,
        marginY:1,
        zIndex: 0
    },
    '& > button > div > div > div:nth-child(4)': {
        color: "white",
        position: 'absolute',
        zIndex: -1,
        padding: 1,
        backgroundColor: "#4A9AD5",
        border: '4px solid',
        borderImage: 'linear-gradient(50deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 100%)1',

    },
    '& > button:nth-child(even) > div > div > div:nth-child(4)': {
        right: -50,
        paddingLeft: 5
    },
    '& > button:nth-child(odd) > div > div > div:nth-child(4)': {
        left: -65,
        paddingRight: 5
    }
}
