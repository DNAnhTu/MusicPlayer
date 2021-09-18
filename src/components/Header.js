import React from 'react';
import { AppBar, Toolbar, Typography, makeStyles, useMediaQuery } from '@material-ui/core';
import MusicNoteSharpIcon from '@material-ui/icons/MusicNoteSharp';


const useStyles = makeStyles(theme=>({
    title:{
        marginLeft: theme.spacing(1)
    },
    avatar:{
        height:25,
        objectFit: 'contain'
    },
    info:{
        display:'flex',
        position:'absolute',
        right:40
    }
}));

function Header(){
    const greaterThanMd = useMediaQuery(theme => theme.breakpoints.up('md'));

    const classes=useStyles();
    return (
        <AppBar color="primary" position='fixed'>
            <Toolbar>
                <MusicNoteSharpIcon/>
                <Typography className={classes.title} variant="h6" component="h1">
                    Note Music Player
                </Typography>
                <div className={classes.info} >
                    {greaterThanMd && 
                        <>
                        <Typography variant="body1" color="inherit"></Typography>
                        </>
                    }
                </div>
            </Toolbar>
        </AppBar>
    );
}

export default Header;