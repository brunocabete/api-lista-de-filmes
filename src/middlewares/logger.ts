module.exports = function (options) {
    return function (req, res, next) {

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