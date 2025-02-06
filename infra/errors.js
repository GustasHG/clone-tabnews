export class InternalServerError extends Error {
  constructor({ cause }) {
    super("Um erro interno não esperado aconteceu", {
      cause,
    });
    this.name = "Internal Server Error";
    this.action = "Entre em contato com o suporte";
    this.statusCode = 400;
  }

  toJson() {
    return {
      name: this.name,
      message: this.message,
      action: "Entre em contato com o suporte",
      status_code: 400,
    };
  }
}
