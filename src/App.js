import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Navs from './components/Navs';

function App() {
  return (
    <div>
      <Navs />
      <Switch>
        <Route exact path="/">
          This is Home Page
        </Route>

        <Route exact path="/starred">
          This is starred Page
        </Route>

        <Route>
          <div>This Page is not found ! ERROR_404</div>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
