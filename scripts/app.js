// This is the application entry point

import { State } from './state.js';
import { UIModule } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
   console.log('CampusWallet initialising...');

   //This loads from storage or seed.json)
   await State.init();

    //Initialize UI rendering and event listeners
    UIModule.init();

    console.log('CampusWallet successfully initialized and running.';
});