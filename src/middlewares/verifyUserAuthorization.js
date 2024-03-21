const AppError = require("../utils/AppError")

function verifyUserAuthorization(roleToVerify) {
  return (request, response, next) => {
    const { role } = request.user;

    if (role !== roleToVerify) {
      throw new AppError("Usuário não tem permissão para acessar esse recurso", 401)
    }

    return next();
  }
} 

module.exports = verifyUserAuthorization