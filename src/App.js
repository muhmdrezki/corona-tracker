import React from 'react';
// Component
import List from './components/List'

import { Provider } from "react-redux";
import store from "./redux/store/index";

function App() {
  return (
    <Provider store={store}>
      <List/>
    </Provider>
  );
}

export default App;
