import { Outlet, useLocation } from 'react-router-dom'
import { Layout } from 'antd'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

const { Content } = Layout

const AppLayout = () => {
  const location = useLocation()

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [location.pathname])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ background: '#fff' }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  )
}

export default AppLayout
