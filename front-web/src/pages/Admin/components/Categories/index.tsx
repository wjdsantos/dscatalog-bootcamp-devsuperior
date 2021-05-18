import React from 'react';
import { Route, Switch } from 'react-router';
import List from './List';
import Form from './Form';

const Categories = () => {

    return (
        <div>
            <Switch>
                <Route path="/admin/categories" exact>
                    <List />
                </Route>
                <Route path="/admin/categories/:categoryId">
                    <Form />
                </Route>
            </Switch>
        </div>
    );
}

export default Categories;