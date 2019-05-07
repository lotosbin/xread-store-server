import React from 'react';
import './App.css';
import {ApolloProvider} from "react-apollo";
import client from './apollo/client';
import {HashRouter as Router, Route} from "react-router-dom";
import Store from "./Store";
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks';
import AppBar from "./components/AppBar";
import {Advice} from "./components/Advice";

const App = () => <ApolloProvider client={client}>
    <ApolloHooksProvider client={client}>
        <Router>
            <div className="App">
                <AppBar/>
                <Route exact path="/" component={Store}/>
                <Advice/>
            </div>
        </Router>
    </ApolloHooksProvider>
</ApolloProvider>;

export default App;
