import React from 'react';
import { Segment, Form } from 'semantic-ui-react';

export default function Settings(props) {
  return (
    <div>
      <h1>Settings</h1>
      <Segment basic>
        <Form>
          <Form.Field>
            <label>RootPath</label>
            <input
              type="text"
              value={props.folderInfo.user_home_dir + '/cra-workspace/'}
              disabled
            />
          </Form.Field>
        </Form>
      </Segment>
    </div>
  );
}
