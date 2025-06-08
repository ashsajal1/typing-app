import { createRootRoute, Outlet } from '@tanstack/react-router'
import { HelmetProvider } from 'react-helmet-async'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export const Route = createRootRoute({
  component: () => (
    <HelmetProvider>
      <div className="overflow-x-hidden">
        <Navbar />
        <Outlet />
        <Footer />
        {/* <TanStackRouterDevtools /> */}
      </div>
    </HelmetProvider>
  ),
})
