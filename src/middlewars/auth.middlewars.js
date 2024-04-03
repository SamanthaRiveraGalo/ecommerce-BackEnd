const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/views/products');
    next();
};

const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/views/login');
    next();
};

module.exports = {
    publicAccess,
    privateAccess
}