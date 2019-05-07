import React from 'react';
import { Segment, Icon, Header, Button, Input } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

function Projects(props) {
  const name = props.match.params.name;
  const [logs, setLogs] = React.useState([]);
  const [port, setPort] = React.useState(3000);
  const [portIsAlready, setPortIsAlready] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  function updateLogs(data) {
    setLogs(state => {
      return state.concat(data.message);
    });
    if (data.message.indexOf('Something is already') >= 0) {
      setListening(false);
      setPortIsAlready(true);
    } else if (data.message.indexOf('PROCESS IS KILLED') >= 0) {
      setListening(false);
    } else {
      setPortIsAlready(false);
    }
  }
  React.useEffect(() => {
    if (props.socket && !props.socket.hasListeners('echo:createLogs')) {
      props.socket.addEventListener('echo:createLogs', updateLogs);
      return () => {
        props.socket.emit('projectKill', {
          name
        });
        props.socket.removeEventListener('echo:createLogs', updateLogs);
      };
    }
  }, []);
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="react" />
        {name}
      </Header>
      <Segment.Inline>
        <Button
          disabled={listening}
          onClick={() => {
            setListening(true);
            setLogs([]);
            props.socket.emit('projectStart', {
              name,
              port
            });
          }}
          basic
          color="green"
        >
          Start
        </Button>
        <Button
          onClick={() => {
            setListening(false);
            setLogs(['PROCESS KILLED !']);
            props.socket.emit('projectKill', {
              name
            });
          }}
          disabled={!listening}
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
        value={port}
        onChange={e => setPort(e.target.value)}
        type="text"
      />
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
