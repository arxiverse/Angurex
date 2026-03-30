import type { Register } from './register';

interface RegisterComponentProps {
  instance?: Register;
}

const RegisterComponent = ({ instance }: RegisterComponentProps) => {
  return <p>{instance?.headline ?? 'Register Works'}</p>;
};

export default RegisterComponent;
