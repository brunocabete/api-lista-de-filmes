export function requireAuth(req, res, next) {
    console.log(req.session)
    if (req.session.userId) {
        next(); // User is authenticated, continue to next middleware
    } else {
        res.status(401).send('Não autenticado') // User is not authenticated, redirect to login page
    }
}