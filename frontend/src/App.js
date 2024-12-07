import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardAdmin from "./components/DashboardComponent/DashboardAdmin";
import { routes } from './routes';

function App() {
  return (
    <Router>
      <Routes>
        {routes
          .filter(route => route.isShowDashboardAdmin)
          .map(route => (
            <Route element={<DashboardAdmin pageIndex={route.pageIndex} />}>
              <Route
                key={route.path}
                path={route.path}
                element={<route.page />}
              />
            </Route>
          ))}
        
        {routes
          .filter(route => !route.isShowDashboard && !route.isShowDashboardAdmin)
          .map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.page />}
            />
          ))}
      </Routes>
    </Router>
  );
}

export default App;
