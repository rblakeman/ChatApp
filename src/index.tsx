import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

import './index.css';

const container = document.getElementById('root');
// @ts-expect-error IGNORE
const root = createRoot(container);

root.render(<App tab="home" />);
