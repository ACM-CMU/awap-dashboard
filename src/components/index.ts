/* eslint-disable import/prefer-default-export */
export { default as ImageFallback } from './Image/ImageFallback'
export default (req, res) => {
    res.statusCode = 200
    res.json({ name: 'John Doe' })
  }