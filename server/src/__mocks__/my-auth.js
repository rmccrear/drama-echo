const jwtCheck = function (req, _res, next) {
  req.auth = {
    sub: "1",
  };
  next();
};

module.exports = { jwtCheck };
