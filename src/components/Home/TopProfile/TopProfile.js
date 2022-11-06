import { Add, Close, Edit, PowerSettingsNew, UploadFile } from '@mui/icons-material'
import {Stack, Typography, ButtonGroup, Button, Grid, Slide, Dialog,DialogContent, DialogActions, AppBar, Toolbar, TextField, FormControl, InputLabel, Select, MenuItem, LinearProgress, DialogTitle, DialogContentText } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import {auth,storage} from '../../../firebaseconf'
import {ref as storef, uploadBytes, getDownloadURL} from 'firebase/storage'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import MusicContainer from './MusicContainer/MusicContainer'
import axios from 'axios'
import apirul from '../../../apiurl'

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const TopProfile = () => {
    const [user, setuser] = useState()
    const [add, setadd] = useState(false)
    const [musictitle, setmusictitle] = useState('')
    const [gen, setgen] = useState('')
    const [desc, setdesc] = useState('')
    const [mufile, setmufile] = useState('')
    const [mualim, setmualim] = useState('')
    const [uid, setuid] = useState('')
    const [uptext, setuptext] = useState('')
    const [editprofile, seteditprofile] = useState('')
    const [uploading, setuploading] = useState(false)
    const [usermusics, setusermusics] = useState([])
    const [doneupload, setdoneupload] = useState(false)
    const [editdia, seteditdia] = useState(false)
    const loadData = ()=>{
      onAuthStateChanged(auth,(user)=>{
        if(user!=null){
            axios.get(`${apirul}/${user.uid}`).then((data)=>{
                setuser(data.data)
                setuid(user.uid)
                setusermusics([])
                axios.get(`${apirul}/userMusic/${user.uid}`).then((data)=>{
                  setusermusics(data.data)
                }).catch((err)=>{
                  console.log(err)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }
      })
    }
    useEffect(() => {
      loadData()  
    }, [])
    useEffect(() => {
      loadData()
    }, [doneupload])

    useEffect(() => {
      if(editprofile){
      uploadBytes(storef(storage,`images/${editprofile.name}`),editprofile)
      .then((res)=>{
        getDownloadURL(storef(storage,res.ref.fullPath)).then((url)=>{
        axios.post(`${apirul}/editProfile`,{
          uid,
          newLink:url
        }).then((res)=>{
          window.location.href = "/"
          seteditprofile('')
        }).catch((err)=>{
          alert(err)
        })
      })
      }).catch((err)=>{
        alert(err)
      })
    }
    }, [editprofile])
    
    
    
    const logout = ()=>{
        signOut(auth).then(()=>{
            window.location.href = "/login"
        }).catch(()=>{
            alert('something hapenned wrong')
        })
    }
    const uploadMusic = ()=>{
      setuploading(true)
      setuptext('Uploading Music File')
         uploadBytes(storef(storage,`songs/${mufile.name}`),mufile).then(async (music)=>{
          setuptext('Music File Uploaded!')
          setuptext('Uploading Album Image')
         uploadBytes(storef(storage,`/images/${mualim.name}`),mualim).then((image)=>{
          setuptext('Adding Music to Database')
          getDownloadURL(storef(storage,image.ref.fullPath)).then((url)=>{
            getDownloadURL(storef(storage,music.ref.fullPath)).then(async (musicurl)=>{
              await axios.post(`${apirul}/addMusic`,{
                artist: user.name,
                description : desc,
                title:musictitle,
                cover: url,
                music: musicurl,
                genre: gen,
                uid,
                musicPath:`songs/${mufile.name}`,
                albumPath: `images/${mualim.name}`
              }).then((res)=>{
                if(res.status == 200){
                  setuptext('Music Uploaded')
                  setuploading(false)
                  setadd(false)
                  setdoneupload(true)
                }
              })
            })
          })
         })
          
         })
    }
  return (
    <Box sx={{p:2}}>
        <center>
            <img style={{boxShadow:'0px 10px 10px 5px #d7d7d7',width:'200px' ,height:'200px',borderRadius:'50%'}} src={user ? user.image : `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png`}/>
            <Typography variant="h4" color="primary" sx={{my:3}}>{user && user.name}</Typography>
            <Stack direction="row" alignItems="center" justifyContent="center" sx={{my:3}}>
                <Box sx={{mx:2}}>
                    <Typography variant="h5" color="primary">{user&&user.totalPlayed}</Typography>
                    <Typography variant="caption">Music Played</Typography>
                </Box>
                <Box sx={{mx:2}}>
                    <Typography variant="h5" color="primary">{user && user.listen}</Typography>
                    <Typography variant="caption">Listener</Typography>
                </Box>
                <Box sx={{mx:2}}>
                    <Typography variant="h5" color="primary">{user && user.like}</Typography>
                    <Typography variant="caption">Likes</Typography>
                </Box>
            </Stack>
            <ButtonGroup>
              <Button variant="contained" startIcon={<Add/>} onClick={setadd} >Add Music</Button>
              <Button variant="contained" color="secondary" startIcon={<Edit/>} onClick={seteditdia}>Edit Profile</Button>
              <Button variant="outlined" color="error" startIcon={<PowerSettingsNew/>} onClick={logout}>Logout</Button>
            </ButtonGroup>
        </center>
        
        <Typography variant="h6" align='left' sx={{my:2}}>My Musics</Typography>
        <Grid container spacing={3}>
            {usermusics && usermusics.map((v,i)=>{
                return  <Grid item xs={6} md={3} lg={2}>
                <MusicContainer data={v} key={i} loadData={loadData} />
              </Grid>
            })}
        </Grid>
                {usermusics && usermusics.length <1 ? <Typography variant="body2" color="initial" align="center">No Music Added yet</Typography>: null}
        <Dialog open={add} fullScreen TransitionComponent={Transition} onClose={e=> setadd(false)}>
          <DialogContent>
            <AppBar position="fixed" color="primary">
              <Toolbar>
                <Typography variant="h6">
                  Add Music
                </Typography>
                
                <Close sx={{position:'fixed',right:20}} onClick={e=> setadd(false)}/>
              </Toolbar>
            </AppBar>
              <Grid container spacing={3} sx={{mt:10}}>
                <Grid item xs={12} sm={12} lg={6}>
                    <TextField
                      label="Title"
                      value={musictitle}
                      onChange={e=> setmusictitle(e.target.value)}
                      variant="outlined"
                      fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Genre</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={gen}
                    label="Genre"
                    onChange={e=> setgen(e.target.value)}
                >
                    <MenuItem value={'Hipco'}>Hipco</MenuItem>
                    <MenuItem value={'Tranditional'}>Tranditional</MenuItem>
                    <MenuItem value={'Gbema'}>Gbema</MenuItem>
                    <MenuItem value={'Gospel'}>Gospel</MenuItem>
                    <MenuItem value={'Trapco'}>Trapco</MenuItem>
                    <MenuItem value={'RnB/Afro soul'}>RnB/Afro soul</MenuItem>
                    <MenuItem value={'Raggae Dancehall'}>Raggae Dancehall</MenuItem>
                    <MenuItem value={'Afro dance'}>Afro dance</MenuItem>
                    <MenuItem value={'hip-hop'}>hip-hop</MenuItem>
                    <MenuItem value={'Afrobeat'}>Afrobeat</MenuItem>
                    <MenuItem value={'Jazz'}>Jazz</MenuItem>
                    <MenuItem value={'Amapiano'}>Amapiano</MenuItem>
                </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                
                </Grid>
                <Grid item xs={12} sx={{p:3}}>
                  <TextField
                    label="Description"
                    value={desc}
                    onChange={e=> setdesc(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                    <Stack direction="row" alignItems="ceter">
                   <Button variant="contained" color="primary" component="label">
                     Select Music <input type="file" hidden onChange={e=> setmufile(e.target.files[0])} />
                   </Button>
                   {mufile ? <Typography variant="body1" sx={{mx:2}}>File Selected : {mufile.name}</Typography>: <Typography variant="body1" sx={{mx:2}}>Select Your Music File</Typography>}
                   </Stack>
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                    <Stack direction="row" alignItems="ceter">
                   <Button variant="contained" color="primary" component="label">
                     Select Image <input type="file" hidden onChange={e=> setmualim(e.target.files[0])} />
                   </Button>
                   {mualim ? <Typography variant="body1" sx={{mx:2}}>File Selected : {mualim.name}</Typography>: <Typography variant="body1" sx={{mx:2}}>Select Your Album Image</Typography>}
                   </Stack>
              </Grid>
              <Grid item xs={12} sx={{my:2}}>
              <center>
                <Button variant="contained" color="primary" disabled={!musictitle || !gen || !mufile || !mualim || !desc} onClick={uploadMusic}>
                  <UploadFile/> Upload Music
                </Button>
                {uploading &&
                <Box justifyContent="center" alignItems="center" sx={{m:3}}>
                  <LinearProgress/>
                  <Typography variant="subtitle1">{uptext}</Typography>
                </Box>}
              </center>
              </Grid>
              </Grid>
          </DialogContent>
          <DialogActions>
          </DialogActions>
        </Dialog>
        <Dialog open={doneupload} onClose={e=> setdoneupload(false)} aria-labelledby="Upload Done Dialog">
          <DialogTitle>
            Upload Done
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              The music has been uploaded successfully!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={e=> setdoneupload(false)} color="primary" variant="contained">
              Okay
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editdia} onClose={e=> seteditdia(false)} fullScreen TransitionComponent={Transition} aria-labelledby='Edit Profile'>
          <DialogTitle>
          <AppBar position="fixed" color="primary">
              <Toolbar>
                <Typography variant="h6">
                  Edit Profile
                </Typography>
                
                <Close sx={{position:'fixed',right:20}} onClick={e=> seteditdia(false)}/>
              </Toolbar>
            </AppBar>
          </DialogTitle>
          <DialogContent>
            <Box sx={{mt:10}}>
                  <center>
                  <img style={{boxShadow:'0px 10px 10px 5px #d7d7d7',width:'200px' ,height:'200px',borderRadius:'50%'}} src={user ? user.image : `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png`}/> <br/>
                  <Button variant="contained" color="primary" sx={{mt:3}} component="label">
                    <input type="file" hidden onChange={e=> seteditprofile(e.target.files[0])} />
                    Change Profile Picture
                  </Button>
                  </center>
            </Box>
          </DialogContent>
        </Dialog>
    </Box>
  )
}

export default TopProfile