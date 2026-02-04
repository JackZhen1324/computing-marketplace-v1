/*
 * @Author: zhen qian xhdp123@126.com
 * @Date: 2026-02-04 06:38:56
 * @LastEditors: zhen qian xhdp123@126.com
 * @LastEditTime: 2026-02-04 15:29:00
 * @FilePath: /算力超市demo/.worktrees/computing-marketplace/frontend/src/components/layout/AppFooter.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Layout } from 'antd'

const { Footer: AntFooter } = Layout

const AppFooter = () => {
  return (
    <AntFooter style={{ background: '#f5f5f5', padding: '48px 0' }}>
      <div style={{ maxWidth: '1920px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>联系我们</h3>
            <p style={{ marginBottom: '8px' }}><strong>中电信数智科技有限公司</strong></p>
            <p style={{ marginBottom: '8px' }}><strong>地&nbsp;&nbsp;&nbsp;&nbsp;址：</strong>北京市西城区展览路街道京鼎大厦</p>
          </div>
          <div>
            <p style={{ color: '#999' }}>© 2025 云聚通智一体算力超市. All rights reserved.</p>
          </div>
        </div>
      </div>
    </AntFooter>
  )
}

export default AppFooter
