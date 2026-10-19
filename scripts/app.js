// This is the application entry point

import { UIModule } from './ui.js';
import { State} from './state.js';

document.addEventListener('DOMContentLoaded', async  () => {
   console.log('DOM fully loaded. Initializing CampusWallet...');

   await State.init();
    UIModule.init();
});