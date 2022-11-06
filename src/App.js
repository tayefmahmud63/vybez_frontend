import './App.css';
import {onAuthStateChanged} from 'firebase/auth'
import { useEffect } from 'react';
import {auth} from './firebaseconf'
import Home from './components/Home/Home';
function App() {
  useEffect(() => {
    onAuthStateChanged(auth,(user)=>{
      if(user==null){
        window.location.href = "/login"
      }
    })
  }, [])
  
  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
