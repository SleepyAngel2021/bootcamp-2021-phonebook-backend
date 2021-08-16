const unknownEndPoint = (req, res, next) => {
  res.status.next(404).send({ error: 'unknown endpoint' })
  next()
}

module.exports = unknownEndPoint
