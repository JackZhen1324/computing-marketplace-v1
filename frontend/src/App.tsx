import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import Solutions from './pages/Solutions'
import GPUBareMetal from './pages/IntelligentComputing/GPUBareMetal'
import GPUCloud from './pages/IntelligentComputing/GPUCloud'
import Appliance from './pages/IntelligentComputing/Appliance'
import MaaS from './pages/IntelligentComputing/MaaS'
import GeneralComputing from './pages/GeneralComputing'
import ServicePlatform from './pages/Solutions/ServicePlatform'
import NetworkSystem from './pages/Solutions/NetworkSystem'
import FusionBase from './pages/Solutions/FusionBase'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#3F58FA',
          colorBgBase: '#FFFFFF',
          fontSize: 14,
          fontFamily: 'PingFang SC, Arial, sans-serif',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="intelligent" element={<div style={{ padding: '50px', textAlign: 'center' }}>智算专区 - 请选择子分类</div>} />
            <Route path="intelligent/gpu-bare-metal" element={<GPUBareMetal />} />
            <Route path="intelligent/gpu-cloud" element={<GPUCloud />} />
            <Route path="intelligent/appliance" element={<Appliance />} />
            <Route path="intelligent/maas" element={<MaaS />} />
            <Route path="general" element={<GeneralComputing />} />
            <Route path="solutions" element={<Solutions />} />
            <Route path="solutions/service-platform" element={<ServicePlatform />} />
            <Route path="solutions/network-system" element={<NetworkSystem />} />
            <Route path="solutions/fusion-base" element={<FusionBase />} />
            <Route path="news" element={<div style={{ padding: '50px', textAlign: 'center' }}>政策&新闻 - Coming Soon</div>} />
            <Route path="about" element={<div style={{ padding: '50px', textAlign: 'center' }}>关于我们 - Coming Soon</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
