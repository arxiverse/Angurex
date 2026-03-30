import type { Home } from './home';

interface HomeComponentProps {
  instance?: Home;
}

const HomeComponent = ({ instance }: HomeComponentProps) => {
  return <p>{instance?.headline ?? 'Home Works'}</p>;
};

export default HomeComponent;
