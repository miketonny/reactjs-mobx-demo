//getting rid of the require animation warning since react 16.x
const raf = global.requestAnimationFrame = (cb) => {
    setTimeout(cb, 0)
  }
  
  export default raf