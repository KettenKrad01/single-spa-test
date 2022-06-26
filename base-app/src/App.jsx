import './App.css';
import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { Layout, Menu } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';

const {Sider, Content} = Layout;

function App() {
  const params = useLocation();
  console.log(params);

  return (
    <div className="App">
        <Layout>
          <Sider trigger={null}>
            <div className="logo">single-spa test</div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={[]}
              items={[
                {
                  key: '1',
                  icon: <VideoCameraOutlined/>,
                  label: <Link to="/react">React</Link>,
                },
                {
                  key: '2',
                  icon: <VideoCameraOutlined/>,
                  label: <Link to="/vue">Vue</Link>,
                }
              ]}
            />
          </Sider>
          <Layout className="site-layout">
            <Content
              className="site-layout-background"
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
              }}
            >
              <div id="vue-app" />
              <div id="react-app" />
            </Content>
          </Layout>
        </Layout>
    </div>
  );
}

export default (App) ;


