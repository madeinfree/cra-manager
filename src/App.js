import React from 'react';
import './global.css';
import {
  Dimmer,
  Loader,
  Grid,
  Header,
  Icon,
  List,
  Button,
  Container
} from 'semantic-ui-react';
import { Route, withRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import CreateProject from './pages/CreateProject';
import Projects from './pages/Projects';
import io from 'socket.io-client';

function App(props) {
  const [socket, setSocket] = React.useState(null);
  const [folderInfo, setFolderInfo] = React.useState({
    payload: []
  });

  function updateFolderInfo(data) {
    setFolderInfo(data);
  }

  function emitFolderInfo(ioSocket) {
    ioSocket.emit('get:folderInfo');
  }

  React.useEffect(() => {
    const ioSocket = io('http://localhost:29966');
    ioSocket.on('connect', () => {
      setSocket(ioSocket);
    });
    emitFolderInfo(ioSocket);
    if (!ioSocket.hasListeners('echo:folderInfo')) {
      ioSocket.addEventListener('echo:folderInfo', updateFolderInfo);
    }

    // return () =>
    //   ioSocket.removeEventListener('echo:folderInfo', updateFolderInfo);
  }, []);
  return (
    <Grid style={{ minHeight: '100vh', marginTop: 0 }}>
      {!socket ? (
        <Dimmer active={true}>
          <Loader>Websocket connecting...</Loader>
        </Dimmer>
      ) : (
        <Dimmer active={!socket.connected}>
          <Loader>Websocket connecting...</Loader>
        </Dimmer>
      )}
      <Grid.Column
        style={{
          paddingTop: 20,
          paddingRight: 0,
          paddingLeft: 0
        }}
        width="3"
      >
        <Header style={{ marginBottom: 0 }} as="h2" icon textAlign="center">
          <Icon
            style={{ cursor: 'pointer' }}
            name="box"
            onClick={() => props.history.push('/')}
          />
          <Header.Content>CRA Manager</Header.Content>
        </Header>
        <div style={{ color: 'grey', textAlign: 'center', fontSize: 12 }}>
          Create React Application Manager
        </div>
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <Button
            onClick={() => props.history.push('/create-project')}
            basic
            color="black"
          >
            Create New Project
          </Button>
        </div>
        <div style={{ textAlign: 'center', color: '#ccc', marginTop: 10 }}>
          version 0.0.2 <br />
          Design by{' '}
          <a
            style={{ color: '#ccc' }}
            href="https://www.facebook.com/haowei.liou"
          >
            Whien
          </a>
        </div>
        <List divided>
          {folderInfo.payload.map((dir, index) => (
            <List.Item
              key={index}
              className="folder_info__list__item"
              onClick={() => props.history.push(`/projects/${dir}`)}
              style={{
                padding: 20,
                cursor: 'pointer',
                color: 'white',
                minWidth: '100%'
              }}
            >
              <List.Icon name="react" />
              <List.Content>{dir}</List.Content>
            </List.Item>
          ))}
        </List>
        <List
          style={{
            paddingLeft: 20,
            minWidth: '100%',
            bottom: 0
          }}
        >
          <List.Item
            onClick={() => props.history.push('/settings')}
            style={{
              cursor: 'pointer',
              color: 'black',
              minWidth: '100%'
            }}
          >
            <List.Icon name="cog" />
            <List.Content>Settings</List.Content>
          </List.Item>
        </List>
      </Grid.Column>
      <Grid.Column
        style={{ paddingRight: 0, paddingLeft: 0 }}
        width="13"
        style={{ backgroundColor: '#00acff24' }}
      >
        <Container style={{ padding: 30 }}>
          <Route exact path="/" component={Landing} />
          <Route
            exact
            path="/settings"
            component={() => <Settings folderInfo={folderInfo} />}
          />
          <Route
            exact
            path="/create-project"
            component={() => (
              <CreateProject
                emitFolderInfo={emitFolderInfo}
                socket={socket}
                folderInfo={folderInfo}
              />
            )}
          />
          <Route
            exact
            path="/projects/:name"
            component={() => <Projects socket={socket} />}
          />
        </Container>
      </Grid.Column>
    </Grid>
  );
}

export default withRouter(App);
