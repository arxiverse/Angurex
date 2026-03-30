import LoginComponent from './app/login/login.tsx';
import RegisterComponent from './app/register/register.tsx';
import { redirect } from 'react-router-dom';

export const RoutesComponent = [
  { path: '/', loader: () => redirect('/login')},
  { path: '/login', Component: LoginComponent },
  { path: '/register', Component: RegisterComponent },
  { path: '*', loader: () => redirect('/login')}
];