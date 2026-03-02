
import './App.css'
import MasterLayout from './layouts/MasterLayouts'
import Home from './pages/home/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Category from './pages/Category'
import Blogs from './pages/Blogs'
import NotFound from './pages/NotFound'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MasterLayout />} >
            <Route index element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/category" element={<Category />} />
            <Route path="/blog" element={<Blogs />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
