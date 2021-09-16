import React from 'react';
import { Dialog, DialogActions, TextField, InputAdornment, Button, DialogTitle, DialogContent, makeStyles } from '@material-ui/core';
import { Link, AddBoxOutlined } from '@material-ui/icons'
import ReactPlayer from 'react-player';
import YoutubePlayer from 'react-player/lib/players/YouTube';
import {ADD_SONG} from '../graphql/mutations';
import { useMutation } from '@apollo/client';

const useStyles = makeStyles(theme => ({
    container:{
        display: 'flex',
        alignItems:'center',
    },
    urlInput:{
        margin: theme.spacing(1)
    },
    addSongButton:{
        margin: theme.spacing(1)
    },
    dialog:{
        textAlign:'center',
    },
    thumbnail:{
        width:'90%'
    }
}));

const DEFAULT_SONG = {
    artist:"",
    duration:0,
    thumbnail:"",
   title:"",
    url:"" 
    //id:"d9443a71-16ab-4a7e-aff7-1a226ddeb47b",
    //title: "Pariah",
    //artist: "Steven Wilson, Ninet Tayeb",
    //thumbnail : "https://img.youtube.com/vi/cNTaFArEObU/0.jpg",
    //url: "https://youtu.be/cNTaFArEObU",
    //duration: 279,
}


function AddSong(){
    const [addSong, {error}] = useMutation(ADD_SONG);
    const classes=useStyles();
    const [dialog,setDialog] = React.useState(false);
    const [playable, setPlayable] = React.useState(false);
    const [url,setUrl] = React.useState('');
    const [song,setSong] = React.useState(DEFAULT_SONG);

    React.useEffect(()=>{
        const isPlayable = YoutubePlayer.canPlay(url);
        setPlayable(isPlayable);
    },[url]);

    function handleCloseDialog(){
        setDialog(false);
    }

    async function handleEditSong({player}){
        const nestedPlayer = player.player.player;
        let songData;
        if(nestedPlayer.getVideoData){
            songData = getYoutubeInfo(nestedPlayer);
        }
        setSong({...songData,url});
    }

    function getYoutubeInfo(player){
        const duration = player.getDuration();
        const {title, video_id, author} = player.getVideoData();
        const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
       // const thumbnail = `https://img.youtube.com/vi/cNTaFArEObU/0.jpg`;
        return {
            artist: 
            author,
            duration,            
            thumbnail,
            title
            //title: "Pariah",
            //artist: "Steven Wilson, Ninet Tayeb",
           // thumbnail : "https://img.youtube.com/vi/cNTaFArEObU/0.jpg",
            //url: "https://youtu.be/cNTaFArEObU",
           // duration: 279,
        }
    }

    async function handleAddSong(){

        const {artist, duration, thumbnail, title, url} = song
        try{
            await addSong({
                variables: {
                   artist: artist.length > 0 ? artist : null,
                    duration: duration > 0 ? duration : null,
                    thumbnail: thumbnail.length > 0 ? thumbnail:null,
                    title: title.length > 0 ? title: null,
                    url: url.length > 0 ? url : null,
                   //title: "Pariah",
                  // artist: "Steven Wilson, Ninet Tayeb",
                   //thumbnail : "https://img.youtube.com/vi/cNTaFArEObU/0.jpg",
                  // url: "https://youtu.be/cNTaFArEObU",
                   //duration: 279,
                }
            })
            handleCloseDialog();
            setSong(DEFAULT_SONG);
            setUrl('');
        }catch(error){
            console.log(JSON.stringify(error));
        }        
    }

    function handleChangeSong(event){
        const {name, value} = event.target;
        setSong(prevSong=>({
            ...prevSong,
            [name]:value
        }))
    }
    function handleError(field){
        return error?.networkError?.extensions?.path.includes(field)
    }

    const {thumbnail,title,artist} = song;
    return (
        <div className={classes.container}>
            <Dialog
                className={classes.dialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    style: {
                      background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
                      boxShadow: "none"
                    },
                  }}
                // style={{backgroundColor:'transparent'}}
                open={dialog}
            >
                <DialogTitle>Edit Song</DialogTitle>
                <DialogContent>
                    <img 
                        alt="Song Thumbnail"
                        className={classes.thumbnail}
                        src={thumbnail}
                    />
                    <TextField
                        error={handleError('title')}
                        fullWidth
                        helperText={handleError('title') && "Invalid Input"}
                        label="Title"
                        margin="dense"
                        name="title"
                        onChange={handleChangeSong}
                        value={title}
                    />
                    <TextField
                        error={handleError('artist')}
                        fullWidth
                        helperText={handleError('artist') && "Invalid Input"}
                        label="Artist"
                        margin="dense"
                        name="artist"
                        onChange={handleChangeSong}
                        value={artist}
                    />
                    <TextField
                        error={handleError('thumbnail')}
                        fullWidth
                        helperText={handleError('thumbnail') && "Invalid Input"}
                        margin="dense"
                        label="Thumbnail"
                        name="thumbnail"
                        onChange={handleChangeSong}
                        value={thumbnail}
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        color="secondary"
                        onClick={handleCloseDialog}
                    >
                    Cancel
                    </Button>
                    <Button 
                        color="white"
                        onClick={handleAddSong}
                        variant="outlined"
                    >
                    Add Song
                    </Button>
                </DialogActions>

            </Dialog>
            <TextField 
                className={classes.urlInput}
                fullWidth
                InputProps={{
                    startAdornment:(
                        <InputAdornment position="start">
                            <Link/>
                        </InputAdornment>
                    )
                }}
                margin="normal"
                onChange={event=>setUrl(event.target.value)}
                placeholder="Add YouTube URL"
                type="url"
                value={url}
            />
            <Button
                className={classes.addSongButton}
                color="primary"
                disabled={!playable}
                endIcon={<AddBoxOutlined/>}
                onClick={()=>setDialog(true)}
                variant="contained"
            >
            Add
            </Button>
            <ReactPlayer url={url} hidden onReady={handleEditSong}/>
        </div>
    );
}

export default AddSong;