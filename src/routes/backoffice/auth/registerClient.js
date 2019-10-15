const uniqid = require('uniqid');

const errorsMessages = require('$root/etc/errorsMessages');

const {
    RigorousError,
    formatChecker,
    secureInput,
    RigorousRoute,
} = require('$core');

const { Client, Auth } = require('$models');

const settingsRoute = {
    method: 'post', path: 'bo/auth/register'
};

const middlewares = [];

class Route extends RigorousRoute {

    async secure(req) {
        try {
            this.inputs = {
                email: secureInput.secureEmail(req.body.email),
                password: secureInput.securePassword(req.body.password),
                firstname: secureInput.secureName(req.body.firstname, 'firstname', formatChecker.isFirstLetterCapitalized),
                lastname: secureInput.secureName(req.body.lastname, 'lastname', formatChecker.isFirstLetterCapitalized),
                birthdate: secureInput.secureBirthdate(req.body.birthdate, true),
                gender: req.body.gender
            };

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }

    async process() {
        try {
            const { email, password, firstname, lastname, birthdate, gender } = this.inputs;

            const username = `${firstname}-${lastname}-${uniqid()}`.toLowerCase();

            const attributesCreate = {
                email,
                firstname,
                lastname,
                username
            };

            if (birthdate) {
                attributesCreate.birthdate = new Date(birthdate);
            }

            if (gender) {
                attributesCreate.gender = gender;
            }

            console.log('attributesCreate:', attributesCreate);

            const client = await Client.create(attributesCreate);

            console.log(client);

            if (formatChecker.isNil(client)) {
                throw new RigorousError(errorsMessages.DataNotConform);
            }

            console.log('test OK');

            const cred = await Auth.create({
                user_id: client.id,
                type: 'Client',
                email: client.email,
                password
            });

            if (formatChecker.isNil(cred)) {
                throw new RigorousError(errorsMessages.DataNotConform);
            }

            const token = await Auth.generateTokenAuth(cred);

            if (formatChecker.isNil(token)) {
                throw new RigorousError(errorsMessages.DataNotConform);
            }

            return token;

        } catch (err) {
            throw new RigorousError(errorsMessages.RouteError, err);
        }
    }
}


module.exports = new Route(settingsRoute.method, settingsRoute.path, []);
