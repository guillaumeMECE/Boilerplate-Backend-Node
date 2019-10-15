/*
 * CHART CODE FOR ROUTE:
 * 
 * 1/4 SECURE INPUT (avoid script injection)
 * 2/4 CHECK CONFORMITY INPUT (to avoid integrity issues when editing multiple collections, if one fail because of validity)
 * 3/4 CHECK AUTHORIZATION (is the user legitim ?)
 * 4/4 PROCESS (handle not found case)
 */

class RigorousRoute {

    constructor(method, path, middlewares) {
        this.middlewares = middlewares;
        this.method = method;
        this.path = path;
    }

    getMethod() {
        return this.method;
    }

    getPath() {
        return this.path;
    }
    
    getMiddlewares() {
        return this.middlewares;
    }

    async secure(req) { /* to be Overridden */ }

    async authorize() { /* to be Overridden */ }

    async process() { /* to be Overridden */ }


}

module.exports = RigorousRoute;
