/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2026-02-04 10:22:10
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2026-02-05 14:42:23
 * @FilePath: /computing-marketplace/frontend/src/App.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { InquiryProvider } from './contexts/InquiryContext'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import Solutions from './pages/Solutions'
import IntelligentHome from './pages/IntelligentComputing/IntelligentHome'
import GPUBareMetal from './pages/IntelligentComputing/GPUBareMetal'
import GPUCloud from './pages/IntelligentComputing/GPUCloud'
import Appliance from './pages/IntelligentComputing/Appliance'
import MaaS from './pages/IntelligentComputing/MaaS'
import GeneralComputing from './pages/GeneralComputing'
import ServicePlatform from './pages/Solutions/ServicePlatform'
import NetworkSystem from './pages/Solutions/NetworkSystem'
import FusionBase from './pages/Solutions/FusionBase'
import InquiryAdmin from './pages/Admin/InquiryAdmin'
import News from './pages/News'
import About from './pages/About'

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
      <InquiryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="intelligent-computing" element={<IntelligentHome />} />
              <Route path="intelligent-computing/gpu-bare-metal" element={<GPUBareMetal />} />
              <Route path="intelligent-computing/gpu-cloud" element={<GPUCloud />} />
              <Route path="intelligent-computing/appliance" element={<Appliance />} />
              <Route path="intelligent-computing/maas" element={<MaaS />} />
              <Route path="general-computing" element={<GeneralComputing />} />
              <Route path="solutions" element={<Solutions />} />
              <Route path="solutions/service-platform" element={<ServicePlatform />} />
              <Route path="solutions/network-system" element={<NetworkSystem />} />
              <Route path="solutions/fusion-base" element={<FusionBase />} />
              <Route path="admin/inquiries" element={<InquiryAdmin />} />
              <Route path="news" element={<News />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </InquiryProvider>
    </ConfigProvider>
  )
}

export default App
