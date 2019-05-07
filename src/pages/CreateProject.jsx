import React from 'react';
import { Segment, Form, Checkbox } from 'semantic-ui-react';
import SweetAlert from 'react-bootstrap-sweetalert';

export default function CreateProject(props) {
  const [name, setName] = React.useState('');
  const [createLogs, setCreateLogs] = React.useState([]);
  const [working, isWorking] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [isConflict, setIsConflict] = React.useState(false);
  const [useTypeScript, setUseTypeScript] = React.useState(false);
  function updateLogs(data) {
    setCreateLogs(state => {
      return state.concat(data.message);
    });
    if (data.message.indexOf('could conflict') >= 0) {
      setIsConflict(true);
    }
    if (data.message.indexOf('----END----') >= 0) {
      setShowAlert(true);
      isWorking(false);
    }
  }
  React.useEffect(() => {
    if (props.socket && !props.socket.hasListeners('echo:createLogs')) {
      props.socket.addEventListener('echo:createLogs', updateLogs);
      return () =>
        props.socket.removeEventListener('echo:createLogs', updateLogs);
    }
  }, []);

  return (
    <div>
      <h1>Create Project</h1>
      {showAlert && (
        <SweetAlert
          error={isConflict}
          success={!isConflict}
          title={isConflict ? 'Conflict!' : 'Congratulations!'}
          onConfirm={() => {
            setShowAlert(false);
            props.emitFolderInfo(props.socket);
          }}
        >
          {isConflict
            ? `Project name '${name}' is Conflict !`
            : `Create ${name} Success !`}
        </SweetAlert>
      )}
      <Segment basic>
        <Form>
          <Form.Field>
            <label>Folder Path</label>
            <input
              type="text"
              value={props.folderInfo.user_home_dir + '/cra-workspace/' + name}
              disabled
            />
          </Form.Field>
          <Form.Field>
            <label>Project Name</label>
            <input
              disabled={working}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              onChange={(_, data) => setUseTypeScript(data.checked)}
              checked={useTypeScript}
              label="Use TypeScript"
            />
          </Form.Field>
          <Form.Button
            onClick={() => {
              if (name === '') return alert('Project Name Required');
              setCreateLogs([]);
              isWorking(true);
              setIsConflict(false);
              props.socket.emit('create', {
                name,
                useTypeScript
              });
            }}
            disabled={working}
            positive
            fluid
          >
            {working ? 'Working...' : 'Create'}
          </Form.Button>
        </Form>
      </Segment>
      <Segment style={{ overflow: 'auto' }} inverted>
        <h2>Logs</h2>
        {createLogs.map((log, index) => (
          <div key={index}>
            <pre style={{ color: 'white' }}>{log}</pre>
          </div>
        ))}
      </Segment>
    </div>
  );
}
