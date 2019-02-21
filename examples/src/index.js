/*** examples/src/index.js ***/
import React from 'react';
import { render} from 'react-dom';
import QRCODE from '../../src';
const App = () => (
 <QRCODE/>
);
render(<App />, document.getElementById("root"));
