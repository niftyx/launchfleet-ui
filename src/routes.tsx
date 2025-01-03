import { LoadingScreen } from "components";
import { MainLayout } from "layouts";
import React, { Fragment, Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const routes = [
  {
    exact: false,
    path: "/",
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: "/",
        component: lazy(() => import("pages/HomePage")),
      },
      {
        exact: false,
        path: "/pools",
        component: lazy(() => import("pages/PoolsPage")),
      },
      {
        exact: true,
        path: "/pool/:id",
        component: lazy(() => import("pages/PoolDetailsPage")),
      },
      {
        exact: true,
        path: "/new-pool",
        component: lazy(() => import("pages/PoolCreatePage")),
      },
      {
        exact: false,
        path: "/",
        // eslint-disable-next-line react/display-name
        component: () => <Redirect to="/" />,
      },
    ],
  },
  {
    path: "*",
    // eslint-disable-next-line
    component: () => <Redirect to="/" />,
  },
];

export const renderRoutes = (routes = []) => (
  <Suspense fallback={<LoadingScreen />}>
    <Switch>
      {routes.map((route: any, i) => {
        const Layout = route.layout || Fragment;
        const Component = route.component;

        return (
          <Route
            exact={route.exact}
            key={i}
            path={route.path}
            render={(props) => (
              <Layout>
                {route.routes ? (
                  renderRoutes(route.routes)
                ) : (
                  <Component {...props} />
                )}
              </Layout>
            )}
          />
        );
      })}
    </Switch>
  </Suspense>
);

export default routes;
