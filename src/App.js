
import React, {Component} from 'react';
import Layout from './hoc/Layout/Layout';
import './App.css';
import EnergyFootprinter from './containers/EnergyFootprinter/EnergyFootprinter';

class App extends Component{
  render() {
    return (
      <div >
        <Layout>
          <EnergyFootprinter/>
        </Layout>
      </div>
    );
  }
}

export default App;
