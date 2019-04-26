const mustBeLoggedIn = (req, res, next) => {
  if (!req.session.logged) {
    req.session.message = 'Please log in';
    res.redirect('/auth/login'); // Replace with HTTP_REFERER
  } else {
    next();
  }
};

module.exports = mustBeLoggedIn;
