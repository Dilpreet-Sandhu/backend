
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';


let user = false;


function App() {

  return (
    <div>
     <Routes>
        <Route path='/' element={<Home/>}/>
     </Routes>
     
    </div>
  )
}

export default App
