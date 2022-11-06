import { Audiotrack, Delete } from '@mui/icons-material'
import { Button, ButtonGroup, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import {storage} from '../../../../firebaseconf'
import {deleteObject, ref as storef} from 'firebase/storage'
import apiurl from '../../../../apiurl'
import axios from 'axios'

const MusicContainer = ({data,loadData}) => {
    const [del, setdel] = useState(false)
    const deleteMusic = () =>{
    
      deleteObject(storef(storage,data.musicPath)).then(()=>{
        deleteObject(storef(storage,data.albumPath)).then(()=>{
          axios.post(`${apiurl}/deleteMusic`,{
            data
          }).then((data)=>{
            loadData()
            console.log(data)
          }).catch((err)=>{
            alert(err)
          })
        }).catch(()=>{
          alert("Something happened wrong!")
        })
      }).catch(()=>{
        alert("Something happened wrong!")
      })
    }
  return (
    <Paper sx={{p:2}}>
                    <Box alignItems="center" justifyContent="center">
                      {data.cover ? <img src={data.cover} height={200} width={200}/>:
                        <Typography color="gray">
                            <Audiotrack color="gray" fontSize="large"/>
                        </Typography>}
                        <Typography variant="body1" color="initial">{data.title}</Typography>
                        <Typography variant="body2">Genre: {data.genre}</Typography>
                        <ButtonGroup variant="outlined" size='small' aria-label="">
                          <Button color="error" startIcon={<Delete/>} onClick={e=> setdel(true)}>Delete</Button>                      
                        </ButtonGroup>
                    </Box>
                    <Dialog open={del} onClose={e=> setdel(false)} aria-labelledby="Delete Dialog">
                      <DialogTitle>
                        Are You sure?
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                              Are You sure that you want to delete this music forever? It cannot be undone
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <ButtonGroup>
                        <Button onClick={deleteMusic} color="error" variant="contained">
                          Delete
                        </Button>
                        <Button variant="contained" color="primary" onClick={e=> setdel(false)}>
                          Cancel
                        </Button>
                        </ButtonGroup>
                      </DialogActions>
                      
                    </Dialog>
    </Paper>
  )
}

export default MusicContainer