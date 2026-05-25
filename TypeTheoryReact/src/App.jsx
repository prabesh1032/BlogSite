
import './App.css'
import MasterLayout from './layouts/MasterLayouts'
import Home from './pages/home/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Category from './pages/Category'
import ViewBlog from './pages/ViewBlog'
import Search from './pages/Search'
import MyContain from './pages/MyContain'
import LikedBlogs from './pages/LikedBlogs'
import BookmarkedBlogs from './pages/BookmarkedBlogs'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'
import UserProfile from './pages/UserProfile'
import EditProfile from './pages/EditProfile'
import Login  from './pages/auth/Login';
import Register  from './pages/auth/Signup';
import Authlayouts from './layouts/Authlayouts';
import NotFound from './pages/NotFound'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop';

function App() {

  return (
    <>
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          {/* Public Routes with MasterLayout */}
          <Route path="/" element={<MasterLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="search" element={<Search />} />
            <Route path="category" element={<Category />} />
            <Route path="category/:slug" element={<Category />} />
            <Route path="blog/:slug" element={<ViewBlog />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="mycontain" element={<MyContain />} />
              <Route path="mycontains" element={<MyContain />} />
              <Route path="liked" element={<LikedBlogs />} />
              <Route path="bookmarked" element={<BookmarkedBlogs />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="profile/edit" element={<EditProfile />} />
              <Route path="mycontains/createblog" element={<CreateBlog />} />
              <Route path="mycontains/editblog" element={<EditBlog />} />
            </Route>
          </Route>

          {/* Auth Routes */}
          <Route element={<PublicRoute />}>
            <Route element={<Authlayouts />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
