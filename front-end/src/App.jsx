import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import ArticlesListPage from './pages/ArticlesListPage'
import AboutPage from './pages/AboutPage'
import ArticlePage, { loader as articleLoader } from './pages/ArticlePage'
import Layout from './Layout'
import NotFoundPage from './pages/NotFoundPage'

const routes = [{
  path: '/',
  element: <Layout />,
  errorElement: <NotFoundPage />,
  children: [
    {
      path: '/',
      element: <HomePage />
    }, {
      path: '/about',
      element: <AboutPage />
    }, {
      path: '/articles',
      element: <ArticlesListPage />
    }, {
      path: '/articles/:name', // -> /articles/learn-react
      element: <ArticlePage />,
      loader: articleLoader
    }]
}]
const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      </>
  );
}

export default App
