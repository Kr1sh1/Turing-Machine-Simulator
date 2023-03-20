import Home from './pages/Home'
import Machine from './components/Machine'
import "./App.css"

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from 'react-router-dom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Home />} />
      <Route path='/machines' element={<Machine />} />
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
