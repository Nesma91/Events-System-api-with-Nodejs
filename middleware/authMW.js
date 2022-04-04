const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  let token, decode;
  try {
    token = request.get("Authorization").split(" ")[1];
    decode = jwt.verify(token, "secretSpeakerLoginKey");
  } catch (error) {
    error.message = "Not Authorized";
    error.status = 403;
    next(error);
  }
  if (decode !== undefined) {
    request.role = decode.role;
    request.email = decode.email; //to modefiy on his own data
    next();
  }
};
