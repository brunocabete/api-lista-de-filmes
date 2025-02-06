module.exports = function (options) {
    return function (req, res, next) {
        // Implement the middleware function based on the options object

        const reqResPair = {
            req: req,
            res: res
        }

        options.forEach(fun => {
            fun(reqResPair)
        });
        next()
    }
}