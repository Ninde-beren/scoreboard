import React, {FC, useState} from 'react';
import {Fade, IconButton, Paper, Popover} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {notSkew, paperStyle, popoverStyle} from "../../_styles/Style";

const FormPopover: FC<{ children: any, open: string, setOpen: any, index: string }>
    = ({children, open, setOpen, index }) => {

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (index: string, event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setOpen(index);
    };

    const handleClose = () => {
        setOpen("");
        setAnchorEl(null);
    };

    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <IconButton onClick={(e) => handleClick(index, e)}><AddIcon sx={{color:"white"}}/></IconButton>
                <Popover
                    id={id}
                    open={open === index}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Paper sx={popoverStyle}>
                        {children}
                    </Paper>
                </Popover>
        </>
    );
};

export default FormPopover;
