exports.authorizationJwt = (roleArray) => {
    return async (req, res, next) => {
        try {

            if (!req.user || !req.user.role) {
                return res.status(401).send({ error: 'No autorizado' });
            }

            const userRole = req.user.role.toUpperCase();

            if (!roleArray.includes(userRole)) {
                return res.status(401).send({ error: 'No tiene permiso' });
            }
            next();

        } catch (error) {
            next(error)
        }
    }
}