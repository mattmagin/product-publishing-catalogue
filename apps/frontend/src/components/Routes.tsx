import { Route, Routes as ReactRouterDomRoutes } from 'react-router-dom'
import { Container } from './styled'

export interface AppRoute {
  path: string
  Component: React.FC
}

type RouteProps = {
  routes: AppRoute[]
}

const Routes: React.FC<RouteProps> = ({ routes }) => {
  return (
    <ReactRouterDomRoutes>
      {routes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <Container>
              <Component />
            </Container>
          }
        />
      ))}
    </ReactRouterDomRoutes>
  )
}

export default Routes
