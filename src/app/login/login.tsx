import type { Login } from './login';

interface LoginComponentProps {
  instance?: Login;
}

const LoginComponent = ({ instance }: LoginComponentProps) => {
  return <p>{instance?.headline ?? 'Login Works'}</p>;
};

export default LoginComponent;
