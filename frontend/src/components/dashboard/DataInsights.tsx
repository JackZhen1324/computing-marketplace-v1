import React from 'react';
import { Card, Collapse, Row, Col } from 'antd';
import { ConversionFunnel } from './ConversionFunnel';
import { TrendChart } from './TrendChart';
import { ProductRanking } from './ProductRanking';
import type { TimeRange } from '../../types/dashboard';
import styles from './DataInsights.module.css';

const { Panel } = Collapse;

export const DataInsights: React.FC<{ timeRange: TimeRange }> = ({ timeRange }) => {
  return (
    <Card title="📊 数据洞察" className={styles.insights} bordered={false}>
      <Collapse defaultActiveKey={['charts']} ghost>
        <Panel header="展开/收起图表" key="charts">
          <Row gutter={24}>
            <Col span={8}>
              <ConversionFunnel timeRange={timeRange} />
            </Col>
            <Col span={8}>
              <TrendChart timeRange={timeRange} />
            </Col>
            <Col span={8}>
              <ProductRanking timeRange={timeRange} />
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </Card>
  );
};
