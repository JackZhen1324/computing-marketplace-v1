import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import { HomeOutlined, CloudServerOutlined, ExperimentOutlined, SolutionOutlined, ReadOutlined, InfoCircleOutlined, DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

const AppHeader = () => {
  const location = useLocation()

  const items: MenuItem[] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: 'intelligent',
      icon: <CloudServerOutlined />,
      label: (
        <span>
          智算专区
          <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
        </span>
      ),
      children: [
        { key: '/intelligent/gpu-bare-metal', label: <Link to="/intelligent/gpu-bare-metal">GPU裸金属</Link> },
        { key: '/intelligent/gpu-cloud', label: <Link to="/intelligent/gpu-cloud">GPU云主机</Link> },
        { key: '/intelligent/appliance', label: <Link to="/intelligent/appliance">智算一体机</Link> },
        { key: '/intelligent/maas', label: <Link to="/intelligent/maas">MaaS平台</Link> },
      ],
    },
    {
      key: '/general',
      icon: <ExperimentOutlined />,
      label: <Link to="/general">通算专区</Link>,
    },
    {
      key: '/solutions',
      icon: <SolutionOutlined />,
      label: <Link to="/solutions">解决方案</Link>,
    },
    {
      key: '/news',
      icon: <ReadOutlined />,
      label: <Link to="/news">政策&新闻</Link>,
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined />,
      label: <Link to="/about">关于我们</Link>,
    },
  ]

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const path = location.pathname
    if (path.startsWith('/intelligent/')) {
      return ['intelligent']
    }
    return [path]
  }

  return (
    <header style={{ background: '#fff' }}>
      <div style={{ maxWidth: '1920px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '48px' }}>
            <div style={{
              width: '62px',
              height: '44px',
              backgroundColor: '#3F58FA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <img src="/images/home/u3.png" alt="Logo" style={{ height: '30px' }} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 600 }}>云聚通智一体算力超市</span>
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={getSelectedKeys()}
            items={items}
            style={{ flex: 1, border: 'none' }}
          />
        </div>
      </div>
    </header>
  )
}

export default AppHeader
