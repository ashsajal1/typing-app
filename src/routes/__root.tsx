import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { HelmetProvider } from 'react-helmet-async'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/** The typing view drops the navigation so nothing competes with the keyboard. */
const FOCUS_ROUTES = ['/practice']

function RootLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isTypingPage = FOCUS_ROUTES.some((route) => pathname.startsWith(route))

  return (
    <HelmetProvider>
      <div className="overflow-x-hidden">
        {!isTypingPage && <Navbar />}
        <Outlet />
        <Footer />
        {/* <TanStackRouterDevtools /> */}
      </div>
    </HelmetProvider>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
