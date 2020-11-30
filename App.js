import React,{useEffect} from 'react';
import {} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import SplashScreen from 'react-native-splash-screen';
import {ConfigureStore} from './redux/Store';
import Main from './components/main_routing';
import LoadingScreen from './components/loadingScreen';
import {AuthService} from './Services/videoCalling/AuthService';

const {store,persistor}=ConfigureStore();

export default class App extends React.Component{

  constructor(props){
    super(props);
    global.url="https://pdoc-api.herokuapp.com/";
    global.userAuthData={};

    //services
    AuthService.init();
  }

  componentDidMount(){
    SplashScreen.hide();
  }

  render(){
    return (
      <Provider store={store}>
        <PersistGate
          loading={<LoadingScreen backgroundColor="#fff" color="#147EFB"/>}
          persistor={persistor}
        >
          <Main/>
        </PersistGate>
      </Provider>
    );
  }
};

