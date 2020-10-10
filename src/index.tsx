import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { App } from './components/App/index'
import './styles.css'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => navigator.serviceWorker.ready.then((worker) => {
      worker.sync.register('syncdata');
    }))
    .catch((err) => console.log(err));
}

const root = document.getElementById('app')
ReactDOM.render(
  (<App />),
  root
)
