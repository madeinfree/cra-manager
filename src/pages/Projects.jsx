import React from 'react';
import {
  Segment,
  Icon,
  Header,
  Button,
  Input,
  List,
  Label,
  Form
} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

function Projects(props) {
  const name = props.match.params.name;
  const [logs, setLogs] = React.useState([]);
  const [portIsAlready, setPortIsAlready] = React.useState(false);
  const [deps, setDeps] = React.useState([]);
  const [version, setVersion] = React.useState('');
  const [installDepName, setInstallDepName] = React.useState('');
  const updateLogsCallback = React.useCallback(
    function updateLogs(data) {
      setLogs(state => {
        return state.concat(data.message);
      });
      if (data.message.indexOf('Something is already') >= 0) {
        setPortIsAlready(true);
      }

      if (data.message.indexOf('----END----') >= 0) {
        props.socket.emit('get:projectDeps', { name });
      }
      if (data.message.indexOf('Compiled successfully!') >= 0) {
        props.setInstanceStatus(state => {
          return Object.assign({}, state, {
            [name]: {
              ...state[name],
              status: 'start'
            }
          });
        });
      }
    },
    [name, props]
  );
  function updateDeps(data) {
    setVersion(data.message.version);
    setDeps(
      Object.keys(data.message.dependencies).map(key => ({
        name: key,
        version: data.message.dependencies[key]
      }))
    );
  }
  React.useEffect(() => {
    if (props.socket && !props.socket.hasListeners('echo:createLogs')) {
      props.socket.addEventListener('echo:projectDeps', updateDeps);
      props.socket.addEventListener('echo:createLogs', updateLogsCallback);
      props.socket.emit('get:projectDeps', { name });
    }
    return () => {
      props.socket.removeEventListener('echo:projectDeps', updateDeps);
      props.socket.removeEventListener('echo:createLogs', updateLogsCallback);
    };
  }, [name, props.socket, updateLogsCallback]);

  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="react" />
        {name} v{version}
      </Header>
      <Segment.Inline>
        <Button
          disabled={props.instanceStatus[name].status === 'start'}
          onClick={() => {
            setLogs([]);
            props.socket.emit('projectStart', {
              name,
              port: props.instanceStatus[name].port
            });
          }}
          basic
          color="green"
        >
          Start
        </Button>
        <Button
          onClick={() => {
            setLogs(['PROCESS KILLED !']);
            props.socket.emit('projectKill', {
              name
            });
            props.setInstanceStatus(state => {
              return Object.assign({}, state, {
                [name]: {
                  ...state[name],
                  status: 'stop'
                }
              });
            });
          }}
          disabled={props.instanceStatus[name].status === 'stop'}
          basic
          color="red"
        >
          Stop
        </Button>
      </Segment.Inline>
      <br />
      <Input
        error={portIsAlready}
        label="PORT"
        value={props.instanceStatus[name].port}
        onChange={(_, data) => {
          props.setInstanceStatus(state => {
            return Object.assign({}, state, {
              [name]: {
                ...state[name],
                port: parseInt(data.value, 10)
              }
            });
          });
        }}
        type="text"
      />
      <Segment style={{ margin: 0 }} basic>
        <h2>Dependencies</h2>
        <Form>
          <Input
            placeholder="install dependency"
            action={{
              icon: 'download',
              onClick: () => {
                if (installDepName === '')
                  return alert('dependency name required.');
                setLogs([]);
                props.socket.emit('install:projectDeps', {
                  name,
                  depName: installDepName
                });
              }
            }}
            value={installDepName}
            onChange={e => setInstallDepName(e.target.value)}
            type="text"
          />
        </Form>
        <br />
        <List celled horizontal>
          {deps.map((dep, index) => (
            <List.Item key={index}>
              <Label color="blue">
                {dep.name} {dep.version}
                <Icon
                  onClick={() => {
                    const confirm = window.confirm(
                      'Do you want to delete this dependencie ?'
                    );
                    if (confirm) {
                      props.socket.emit('del:projectDeps', {
                        name,
                        depName: dep.name
                      });
                    }
                  }}
                  name="delete"
                />
              </Label>
            </List.Item>
          ))}
        </List>
      </Segment>
      <Segment style={{ overflow: 'auto' }} inverted>
        <h2>Logs</h2>
        {logs.map((log, index) => (
          <div key={index}>
            <pre style={{ color: 'white' }}>{log}</pre>
          </div>
        ))}
      </Segment>
    </Segment>
  );
}

export default withRouter(Projects);
