const path = require('path');
const { generateOutlineFromSidebars } = require('./lib/sidebar-processor');

const sidebarsFile = path.resolve(__dirname, 'website/my-sample-sidebars.js');

generateOutlineFromSidebars(sidebarsFile);
