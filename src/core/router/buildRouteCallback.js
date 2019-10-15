/* eslint global-require:0 */

// #TEMPO
function sucess(res, data) {
    res.status(200).json({ data });
}

function error(res, err) {

    // stack is not sent so we use a workaround
    // We do not do it in RigorousError because the log become messy...
    if (process.env.NODE_ENV === 'development') {
        if (err.stack) {
            err.stackTrace = err.stack;
            delete err.stack;

            let err2 = err.detail;

            while (err2) {
                err2.stackTrace = err2.stack;
                delete err2.stack;
                err2 = err2.detail;
            }
        }
    }

    res.status(500).json({ error: err });
}

module.exports = (path) => {
    const route = require(path);

    return async (req, res) => {
        try {

            /* ------- 1/5 SECURE INPUT ----------------- */
            await route.secure(req);

            /* ------- 2/5 CHECK AUTHORIZATION ---------- */
            await route.authorize();

            /* ------- 3/5 PROCESS ---------------------- */
            const result = await route.process();

            sucess(res, result);

        } catch (err) {
            console.log(err);
            error(res, err);
        }
    };
};
