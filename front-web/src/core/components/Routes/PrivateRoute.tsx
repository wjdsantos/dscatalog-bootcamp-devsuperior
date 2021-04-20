import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isAllowedByRole, isAuthenticated, Role } from 'core/utils/auth';

type Props = {
    children: React.ReactNode;
    path: string;
    allowedRoutes?: Role[];
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ children, path, allowedRoutes }: Props) => {
//    let auth = useAuth();
//    const isAuthenticated = false;

    //"authData" no localStorage no navegador tem de ter dados
    //access_token não pode estar expirado

    return (
      <Route
        path={path}
        render={({ location }) => {
          if (!isAuthenticated()) {
              return (
                <Redirect
                  to={{
                    pathname: "/auth/login",
                    state: { from: location }
                  }}
                />
              )
          } else if (isAuthenticated() && !isAllowedByRole(allowedRoutes)) {
              return (
                  <Redirect to={{ pathname: "/admin" }} />
              )
          }

          return children;
        }}
      />
    );
  }

  export default PrivateRoute;