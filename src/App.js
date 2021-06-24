import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

// Material UI
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  // createMuiTheme,
  // Fixes forward Ref issue - NOT FOR PRODUCTION USE
  // https://material-ui.com/customization/theming/#unstable-createmuistrictmodetheme-options-args-theme
  unstable_createMuiStrictModeTheme as createMuiTheme,
} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

// App assets
import { context } from './context/StoreProvider';
import { themes } from './service/ThemeService';

// App components
import HeaderComponent from './components/Header/HeaderComponent';
import LandingComponent from './components/Landing/LandingComponent';
import LoginComponent from './components/Login/LoginComponent';
import SettingsComponent from './components/Settings/SettingsComponent';
import ApprovalList from './components/Approval/ApprovalList';
import ApprovalCRQ from './components/Approval/ApprovalCRQ';
import ApprovalREQ from './components/Approval/ApprovalREQ';
import AssetList from './components/Asset/AssetList';
import Error404Component from './components/Error/Error404Component';

const App = () => {
  const [state] = React.useContext(context);
  const appTheme = createMuiTheme(themes[state.theme]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <HeaderComponent />
        <Toolbar />
        <Switch>
          <Route path="/" exact component={LandingComponent} />
          <Route path="/login" component={LoginComponent} />
          <Route path="/settings" component={SettingsComponent} />
          <Route path="/approval" exact component={ApprovalList} />
          <Route path="/approval/crq/:id" component={ApprovalCRQ} />
          <Route path="/approval/req/:id" component={ApprovalREQ} />
          <Route path="/asset" component={AssetList} />
          <Route component={Error404Component} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
