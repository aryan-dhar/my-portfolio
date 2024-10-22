const path = require('path');

module.exports = {
    entry: './js/main.js',      // Your entry JavaScript file
    output: {
        filename: 'bundle.js',  // The bundled output
        path: path.resolve(__dirname, 'dist'), // Output to a 'dist' folder
    },
    module: {
        rules: [
            {
                test: /\.css$/,       // Process CSS files
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    mode: 'development',        // Set to 'production' when deploying
};
