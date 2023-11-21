exports.createResponse = createResponse;

function createResponse (res, status, message, data, pager) {
  return res.status(status).send({
    'status'  : status,
    'message' : message,
    'payload' : data,
    'pager'   : pager,
  });
}