import React, {Component} from 'react';
import './App.css';
import {ApolloProvider} from "react-apollo";
import client from './apollo/client';
import {HashRouter as Router, Route} from "react-router-dom";
import Store from "./Store";
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks';
import AppBar from "./components/AppBar";

class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <ApolloHooksProvider client={client}>
                    <Router>
                        <div className="App">
                            <AppBar/>
                            <Route exact path="/" component={Store}/>
                        </div>
                    </Router>
                </ApolloHooksProvider>
            </ApolloProvider>
        );
    }
}


export default App;
