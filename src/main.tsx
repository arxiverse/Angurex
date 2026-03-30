import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { RoutesComponent } from './app.routes';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import './index.css'

const router = createBrowserRouter(RoutesComponent);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)