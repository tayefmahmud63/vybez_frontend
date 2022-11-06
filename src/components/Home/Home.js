import React, { useEffect } from 'react'
import TopProfile from './TopProfile/TopProfile'
import {auth} from '../../firebaseconf'
import { onAuthStateChanged } from 'firebase/auth'

const Home = () => {
    useEffect(() => {
      onAuthStateChanged(auth,(user)=>{
        if(user==null){
            window.location.href = "/login"
        }
      })
    }, [])
    
  return (
    <div>
        <TopProfile/>
    </div>
  )
}

export default Home