import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import Header from './Header'
import Footer from './Footer'

const { Content } = Layout

const AppLayout = () => {
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
