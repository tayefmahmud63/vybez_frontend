import React, { useEffect, useState } from 'react'
import {onAuthStateChanged, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup} from 'firebase/auth'
import {auth} from '../../firebaseconf'
import { Paper, Grid, Typography, TextField, Button } from '@mui/material'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'
import logo from '../../logo.jpg'
import { Google } from '@mui/icons-material'
import apiurl from '../../apiurl'
import axios from 'axios'
auth.languageCode = 'en'
const Login = () => {
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
    const [email, setemail] = useState('')
    const [pass, setpass] = useState('')
    const [emailerr, setemailerr] = useState(false)
    const [passerr, setpasserr] = useState(false)
    const [emailerrtext, setemailerrtext] = useState('')
    const [passworderrtext, setpassworderrtext] = useState('')
   const login = ()=>{
    if(!email.includes('@')){
      setemailerr(true)
      setemailerrtext("Please Enter a Valid Email Address")
    }
    else if(String(pass).length<6){
      setpasserr(true)
      setpassworderrtext('Password Must Contain more than 6 characters')
    }
    else{
      signInWithEmailAndPassword(auth, email, pass).then((res)=>{
        if(res.user!=null){
          window.location.href  = "/"
        }
      }).catch((err)=>{
        
        console.log(pass)
        console.log(Object.assign(err))
        setpasserr(true)
        setpassworderrtext(err.message)
      })
    }
   }
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
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      alert('Something happened wrong')
    });
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
              <Typography variant="h6" color="primary">Login on Vibez</Typography>
            </center>
            <Box sx={{mt:2,width:"100%"}}>
              <TextField
                label="Email"
                value={email}
                error={emailerr}
                helperText={emailerrtext}
                onChange={e=> setemail(e.target.value)}
                fullWidth
                variant='outlined'
                type="email"
              />
              <TextField
                label="Password"
                value={pass}
                error={passerr}
                helperText={passworderrtext}
                onChange={e=> setpass(e.target.value)}
                fullWidth
                type="password"
                sx={{mt:2}}
              />
              <center>
                <Button variant="contained" color="primary" sx={{mt:2}} fullWidth onClick={login}>
                  Login
                </Button>
                <Button variant="contained" color="primary" fullWidth sx={{my:1}} startIcon={<Google/>} onClick={loginGoogle}>
                Continue with Google
                </Button>
                <Typography variant="subtitle2" color="gray" sx={{my:1}}>Don't have an Account?</Typography>
           
                <Button variant="outlined" onClick={()=>{window.location = "signup"}} color="primary" fullWidth>
                  Create an Account
                </Button>
                
              </center>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

export default Login