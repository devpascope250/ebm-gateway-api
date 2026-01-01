declare global {
  namespace Express {
    interface Request {
      context: {
        tin: string;
        bhfId: string;
        lastRequestDate?: Date;
      };
    }
  }
}
