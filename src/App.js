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
import SettingsComponent from './components/Settings/SettingsComponent';
import ApprovalList from './components/Approval/ApprovalList';
import ApprovalCRQ from './components/Approval/ApprovalCRQ';
import ApprovalREQ from './components/Approval/ApprovalREQ';
import AssetList from './components/Asset/AssetList';
import AssetDetails from './components/Asset/AssetDetails';
import ChangeList from './components/Change/ChangeList';
import ChangeView from './components/Change/ChangeView';
import PeopleList from './components/People/PeopleList';
import PeopleView from './components/People/PeopleView';
import IncidentList from './components/Incident/IncidentList';
import IncidentView from './components/Incident/IncidentView';
import Error404Component from './components/Error/Error404Component';

const App = () => {
  const [state] = React.useContext(context);
  const appTheme = createMuiTheme(themes[state.theme]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <HeaderComponent />
        <Toolbar />
        <Switch>
          <Route path="/" exact component={LandingComponent} />
          <Route path="/settings" component={SettingsComponent} />
          <Route path="/approval" exact component={ApprovalList} />
          <Route path="/approval/crq/:apid/:crqid" component={ApprovalCRQ} />
          <Route path="/approval/req/:apid/:reqid" component={ApprovalREQ} />
          <Route path="/asset" exact component={AssetList} />
          <Route path="/asset/:astid" component={AssetDetails} />
          <Route path="/change" exact component={ChangeList} />
          <Route path="/change/:crqid" component={ChangeView} />
          <Route path="/incident" exact component={IncidentList} />
          <Route path="/incident/:incid" component={IncidentView} />
          <Route path="/people" exact component={PeopleList} />
          <Route path="/people/:pplid" component={PeopleView} />
          <Route component={Error404Component} />
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
