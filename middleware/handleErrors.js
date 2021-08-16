const handleErrors = (error, req, res, next) => {
  if (error.name === 'CastError') {
    res.status(400).send({ error: 'id used is malformed' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else {
    res.status(500).end()
  }
}

module.exports = handleErrors
