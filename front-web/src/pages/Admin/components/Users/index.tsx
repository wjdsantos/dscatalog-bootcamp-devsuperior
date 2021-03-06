import React from 'react';
import { Route, Switch } from 'react-router';
import Form from './Form';
import List from './List';

const Users = () => {

    return (
        <div>
            <Switch>
                <Route path="/admin/users" exact>
                    <List />
                </Route>
                <Route path="/admin/users/:userId">
                    <Form />
                </Route>
            </Switch>
        </div>
    );
}

export default Users;