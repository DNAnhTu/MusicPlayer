import React from 'react'
import { makeStyles, AppBar, Container, Toolbar, Typography } from '@material-ui/core'


const useStyles = makeStyles({
    avatar:{
        height:25,
        objectFit: 'contain'
    },
    toolbar:{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    }
});

const Footer = () => {
    const classes = useStyles()
    return (
        <AppBar position="static" color="primary">
          <Container>
            <Toolbar className={classes.toolbar} >
              <Typography variant="body1" color="inherit">
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
    )
}
export default Footer
