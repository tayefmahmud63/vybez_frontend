import { Box, Button, Grid, Paper, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithPopup} from 'firebase/auth'
import {auth} from '../../firebaseconf'
import logo from '../../logo.jpg'
import apiurl from '../../apiurl'
import axios from 'axios'
import { Google } from '@mui/icons-material'
const Signup = () => {
  const [email, setemail] = useState('')
  const [pass, setpass] = useState('')
  const [name, setname] = useState('')
  const [donetext, setdonetext] = useState({title:'',text:''})
  const [diaopen, setdiaopen] = useState(false)
  useEffect(() => {
    onAuthStateChanged(auth,(user)=>{
      if(user!=null){
        axios.get(`${apiurl}/${user.uid}`).then((res)=>{
          if(res.status==200){
            if(res.data !== "NotFound"){
              window.location.href = `/`
            }
          }
        })
      }
    })
  }, [])
  
  const loginGoogle = ()=>{
    signInWithPopup(auth,new GoogleAuthProvider().addScope('https://www.googleapis.com/auth/contacts.readonly'))
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      axios.get(`${apiurl}/${user.uid}`).then((res)=>{
      console.log(res.data)
        if(res.status==200){
          if(res.data === "NotFound"){
            console.log(res.data)
            axios.post(`${apiurl}/createUser/${user.uid}`,{
              token,
              image: user.photoURL,
              name: user.displayName,
              musics: [],
              like: 0,
              listen:0,
              totalPlayed:0
            }).then((res)=>{
              if(res.status === 200){
                window.location.href  = "/"
              }
            }).catch((err)=>{
              alert(err)
            })
          }
          else{
            window.location.href  = "/"
          }
        }
      }).catch((err)=>{
        alert(err)
      })
    }).catch((error) => {
      alert('Something happened wrong')
    });
   }

   const createEmailPass = () =>{
    if(!email.includes('@')){
      setdonetext({title:"Wrong Email",text:"Please check your email again and enter a valid email address"})
      setdiaopen(true)
    }
    else if(pass.length<6){
      setdonetext({title:"Passoword Error",text:"The Password must contain more than 6 characters"})
      setdiaopen(true)
    }
    else{
      createUserWithEmailAndPassword(auth,email,pass).then((user)=>{
        if(user.user!=null){
          axios.get(`${apiurl}/${user.user.uid}`).then((res)=>{
            if(res.status==200){
              if(res.data === "NotFound"){
                axios.post(`${apiurl}/createUser/${user.user.uid}`,{
                  image: null,
                  name: name,
                  musics: [],
                  like: 0,
                  listen:0,
                  totalPlayed:0
                }).then((res)=>{
                  if(res.status === 200){
                    window.location.href  = "/"
                  }
                }).catch((err)=>{
                  alert(err)
                })
              }
            }
          })
        }
        else{
          setdonetext({title:"Unknown Error",text:"Please refresh the page and try again"})
           setdiaopen(true)
        }
      }).catch((err)=>{
        setdonetext({title:"Login Error",text:err})
         setdiaopen(true)
      })
    }
   }

  return (
    <div style={{display:'flex',alignItems:'center',height:'100vh',justifyContent:'center'}}>
      <Paper sx={{p:3,width:'90%'}}>
        <Grid container style={{width:'100%'}}>
          <Grid item xs={12} md={6}>
          <center>
              <img src={logo} alt="" width="100%"/>
            </center>
          </Grid>
          <Grid item xs={12} md={6}>
            <center>
              <Typography variant="h6" color="primary">Create Account on Vibez</Typography>
            </center>
            <Box sx={{mt:2,width:"100%"}}>
            <TextField
                label="Full Name"
                value={name}
                onChange={e=> setname(e.target.value)}
                fullWidth
                variant='outlined'
              />
              <TextField
                label="Email"
                value={email}
                onChange={e=> setemail(e.target.value)}
                fullWidth
                variant='outlined'
                sx={{mt:2}}
                type="email"
              />
              <TextField
                label="Password"
                value={pass}
                onChange={e=> setpass(e.target.value)}
                fullWidth
                type="password"
                sx={{mt:2}}
              />
              <center>
                <Button variant="contained" color="primary" sx={{mt:2}} fullWidth onClick={createEmailPass}>
                  Create Account
                </Button>
                <Button variant="contained" color="primary" fullWidth sx={{my:1}} startIcon={<Google/>} onClick={loginGoogle}>
                Continue with Google
                </Button>
                <Typography variant="subtitle2" color="gray" sx={{my:1}}>Already have an Account?</Typography>
             
                <Button variant="outlined"  onClick={()=>{window.location = "login"}}  color="primary" fullWidth>
                  Login
                </Button>
           
              </center>
            </Box>
          </Grid>
        </Grid>
        <Dialog open={diaopen} onClose={e=> setdiaopen(false)} aria-labelledby="Dialog SignUp">
          <DialogTitle>
            {donetext.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {donetext.text}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={e=> setdiaopen(false)} color="primary" variant="text">
              Okay
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  )
}

export default Signup