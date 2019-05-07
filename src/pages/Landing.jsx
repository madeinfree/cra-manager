import React from 'react';
import { Header, Segment, List } from 'semantic-ui-react';

export default function Landing() {
  return (
    <div>
      <Header as="h1" textAlign="center">
        Create React App Manager
      </Header>
      <List>
        <Segment>
          <List.Item>
            <List.Content>
              <List.Header as="h2">Introduction</List.Header>
              <List.Description>
                CRA Manager help you easily to create application without any
                command line from create-react-app cli.{' '}
              </List.Description>
            </List.Content>
          </List.Item>
        </Segment>
        <Segment>
          <List.Item>
            <List.Content>
              <List.Header as="h2">Default</List.Header>
              <List.Description>
                Root Path - CRA Manager use default root path{' '}
                <b>$homedir/cra-workspace</b> to create new application, it
                would be useful for manage our projects.
              </List.Description>
            </List.Content>
          </List.Item>
        </Segment>
        <Segment>
          <List.Item>
            <List.Content>
              <List.Header as="h2">Automatically</List.Header>
              <List.Description>
                CRA Manager will be create and check our root path folder
                $homedir/cra-workspace automatically when you create new react
                project.
              </List.Description>
            </List.Content>
          </List.Item>
        </Segment>
      </List>
    </div>
  );
}
