
/**
 * Autoriser le require dynamique
 * Impact -> https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md
 */
/* eslint global-require: 0 */ // --> OFF
/* eslint import/no-dynamic-require: 0 */ // --> OFF

const fs = require('fs');
const express = require('express');
const { RigorousError, errorsMessages } = require('../errors/index');
const buildRouteCallback = require('./buildRouteCallback');

const router = express.Router();

function isRouteDirectory(directory) {
    return (directory.indexOf('.') === -1 && directory.indexOf('__') === -1);
}

function isRouteFile(file) {

    if (process.env.NODE_ENV === 'production') {

        if (file.indexOf('.js.map') === -1) {
            return false;
        }
    }

    return (file.indexOf('.js') > -1 && file.indexOf('__') === -1 && file.indexOf('.test.') === -1);
}

function isValidRouteFile(name) {
    return (name !== '' && name !== 'virtualReturnedFields');
}

function getRoutelFileName(file) {

    const numberOfLetterRemoved = process.env.NODE_ENV === 'production' ? 7 : 3;

    return file.substr(0, file.length - numberOfLetterRemoved); // 3 = .js or 7 = .js.map

}

function routeParsing(app, apiVersion, path) {

    if (!fs.statSync(path).isFile()) {

        fs.readdirSync(path).forEach((file) => {

            if (file === 'index.js') {
                return;
            }

            if (isRouteFile(file)) {

                const name = getRoutelFileName(file);

                try {
                    if (isValidRouteFile(name)) {

                        const routeCallback = buildRouteCallback(`${path}/${name}`);

                        const route = require(`${path}/${name}`);
                        const routeMethod = route.getMethod(); // 'post'
                        const routeName = `/v${apiVersion}/${route.getPath()}`;

                        // console.log('Method: ', `${routeMethod}`);
                        console.log('Route: ', `${routeName} ----> ${routeMethod}`);
                        
                        router[routeMethod](routeName, route.getMiddlewares(), routeCallback);
                    }
                } catch (err) {

                    console.log(`Route ${name} failed to load:'`, err);
                    throw new RigorousError(errorsMessages.RigorousRouterMalformed);
                }
            } else {
                routeParsing(app, apiVersion, `${path}/${file}`);
            }

        });

    }

}

module.exports = {

    init: (app, apiVersion, PATH_ROUTES) => {
        fs.readdirSync(PATH_ROUTES).forEach((directory) => {

            if (isRouteDirectory(directory)) {
                routeParsing(app, apiVersion, `${PATH_ROUTES}/${directory}`);
            }
        });
    },

    getRouter: () => router,

};
