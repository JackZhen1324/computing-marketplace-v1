import { useState } from 'react';
import { Form, Input, Button, message, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/api/auth';
import styles from './Login.module.css';

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterFormValues {
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  password: string;
  confirmPassword?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const handleLogin = async (values: LoginFormValues) => {
    setLoginLoading(true);
    try {
      const response = await authService.login(values);
      message.success('登录成功！');

      // 根据角色跳转
      if (response.user.role === 'ADMIN') {
        navigate('/admin/inquiries');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    setRegisterLoading(true);
    try {
      await authService.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
        companyName: values.companyName,
      });
      message.success('注册成功！即将跳转到登录页...');
      registerForm.resetFields();

      // 切换到登录
      setTimeout(() => {
        setIsLogin(true);
      }, 1500);
    } catch (error: any) {
      message.error(error.response?.data?.message || '注册失败');
    } finally {
      setRegisterLoading(false);
    }
  };

  const switchToRegister = () => {
    setIsLogin(false);
    loginForm.resetFields();
  };

  const switchToLogin = () => {
    setIsLogin(true);
    registerForm.resetFields();
  };

  return (
    <div className={styles.container}>
      {/* Left Panel - Brand */}
      <motion.div
        className={styles.leftPanel}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.brandContent}>
          <div className={styles.brandIcon}>🚀</div>
          <h1 className={styles.brandTitle}>云聚通智</h1>
          <p className={styles.brandSubtitle}>算力新未来 · 智能驱动创新</p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <div className={styles.featureText}>
                <div className={styles.featureTitle}>极速部署</div>
                <div className={styles.featureDesc}>开箱即用，分钟级上线</div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <div className={styles.featureText}>
                <div className={styles.featureTitle}>安全可靠</div>
                <div className={styles.featureDesc}>企业级安全保障</div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💎</div>
              <div className={styles.featureText}>
                <div className={styles.featureTitle}>优质服务</div>
                <div className={styles.featureDesc}>7×24小时技术支持</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative circles */}
        <div className={styles.circle} style={{ top: '10%', left: '10%', width: '300px', height: '300px' }} />
        <div className={styles.circle} style={{ bottom: '20%', right: '15%', width: '200px', height: '200px' }} />
      </motion.div>

      {/* Right Panel - Form */}
      <div className={styles.rightPanel}>
        <motion.div
          className={styles.formContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Logo for mobile */}
          <div className={styles.mobileLogo}>
            <span className={styles.logoIcon}>🚀</span>
            <span className={styles.logoText}>云聚通智</span>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.formWrapper}
              >
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>欢迎回来</h2>
                  <p className={styles.formSubtitle}>登录您的账户以继续</p>
                </div>

                <Form
                  form={loginForm}
                  name="login"
                  onFinish={handleLogin}
                  layout="vertical"
                  requiredMark={false}
                  className={styles.form}
                >
                  <Form.Item
                    name="email"
                    label={<span className={styles.formLabel}>邮箱</span>}
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className={styles.inputIcon} />}
                      placeholder="请输入邮箱"
                      size="large"
                      className={styles.input}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label={<span className={styles.formLabel}>密码</span>}
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className={styles.inputIcon} />}
                      placeholder="请输入密码"
                      size="large"
                      className={styles.input}
                    />
                  </Form.Item>

                  <div className={styles.formActions}>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox className={styles.checkbox}>记住我</Checkbox>
                    </Form.Item>
                    <a className={styles.forgotLink}>忘记密码？</a>
                  </div>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loginLoading}
                      block
                      size="large"
                      className={styles.submitButton}
                    >
                      登录
                    </Button>
                  </Form.Item>

                  <div className={styles.switchForm}>
                    <span className={styles.switchText}>还没有账号？</span>
                    <button
                      type="button"
                      onClick={switchToRegister}
                      className={styles.switchButton}
                    >
                      立即注册
                    </button>
                  </div>

                  <div className={styles.demoAccounts}>
                    <div className={styles.demoTitle}>测试账号：</div>
                    <div className={styles.demoAccount}>
                      <span className={styles.demoLabel}>管理员</span>
                      <span className={styles.demoEmail}>admin@computing-marketplace.com</span>
                      <span className={styles.demoDivider}>/</span>
                      <span className={styles.demoPassword}>Admin@123</span>
                    </div>
                    <div className={styles.demoAccount}>
                      <span className={styles.demoLabel}>客户</span>
                      <span className={styles.demoEmail}>customer@example.com</span>
                      <span className={styles.demoDivider}>/</span>
                      <span className={styles.demoPassword}>Customer@123</span>
                    </div>
                  </div>
                </Form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={styles.formWrapper}
              >
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>创建账户</h2>
                  <p className={styles.formSubtitle}>注册以开始使用算力服务</p>
                </div>

                <Form
                  form={registerForm}
                  name="register"
                  onFinish={handleRegister}
                  layout="vertical"
                  requiredMark={false}
                  className={styles.form}
                >
                  <Form.Item
                    name="fullName"
                    label={<span className={styles.formLabel}>姓名</span>}
                    rules={[{ required: true, message: '请输入您的姓名' }]}
                  >
                    <Input
                      prefix={<UserOutlined className={styles.inputIcon} />}
                      placeholder="请输入您的姓名"
                      size="large"
                      className={styles.input}
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label={<span className={styles.formLabel}>邮箱</span>}
                    rules={[
                      { required: true, message: '请输入邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' }
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined className={styles.inputIcon} />}
                      placeholder="请输入邮箱"
                      size="large"
                      className={styles.input}
                    />
                  </Form.Item>

                  <Form.Item
                    name="phone"
                    label={<span className={styles.formLabel}>手机号（可选）</span>}
                  >
                    <Input
                      prefix={<PhoneOutlined className={styles.inputIcon} />}
                      placeholder="请输入手机号"
                      size="large"
                      className={styles.input}
                    />
                  </Form.Item>

                  <Form.Item
                    name="companyName"
                    label={<span className={styles.formLabel}>公司名称（可选）</span>}
                  >
                    <Input
                      prefix={<TeamOutlined className={styles.inputIcon} />}
                      placeholder="请输入公司名称"
                      size="large"
                      className={styles.input}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label={<span className={styles.formLabel}>密码</span>}
                    rules={[
                      { required: true, message: '请输入密码' },
                      { min: 6, message: '密码至少6位' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className={styles.inputIcon} />}
                      placeholder="请输入密码（至少6位）"
                      size="large"
                      className={styles.input}
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label={<span className={styles.formLabel}>确认密码</span>}
                    dependencies={['password']}
                    rules={[
                      { required: true, message: '请确认密码' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('两次输入的密码不一致'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className={styles.inputIcon} />}
                      placeholder="请再次输入密码"
                      size="large"
                      className={styles.input}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={registerLoading}
                      block
                      size="large"
                      className={styles.submitButton}
                    >
                      注册
                    </Button>
                  </Form.Item>

                  <div className={styles.switchForm}>
                    <span className={styles.switchText}>已有账号？</span>
                    <button
                      type="button"
                      onClick={switchToLogin}
                      className={styles.switchButton}
                    >
                      立即登录
                    </button>
                  </div>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
