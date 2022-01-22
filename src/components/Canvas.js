// Canvas with React.js

// Photo by Logan Weaver on Unsplash
// In this article, we will see how to create a Canvas React component and a custom hook for extracting its logic, so we can just draw inside it like we usually draw in a regular canvas html element.
// This article is based on Corey’s article “Animating a Canvas with React Hooks”. Any other sources and related contents are linked throughout this article.
// I am assuming that you already know canvas, but if you don’t know yet, I recommend this tutorial from MDN to you:
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
//
// - Starting a new project
// In order to see what we are doing, let’s create a new react app with `create-react-app` (feel free to skip this step if you are already familiar with React and create-react-app). You can start a new project by running ```npx create-react-app``` example or yarn create react-app example if you prefer yarn. If you open the project folder (example) in your code editor, you must get something like this:

//* src/App.js:
// import React from 'react'
// import Canvas from './Canvas'

// function App() {

//   return <h1>Hello world!</h1>
// }
//
// export default App

//* public/index.html:
// <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1" />
//     <meta
//       name="description"
//       content="Web site created using create-react-app"
//     />
//     <title>React App</title>
//   </head>
//   <body>
//     <noscript>You need to enable JavaScript to run this app.</noscript>
//     <div id="root"></div>
//   </body>
// </html>

// ~ yarn start


//* The Canvas Component
// Now that we see it is all working, we can replace the “hello world” with the Canvas component that we will create.
// import React from 'react'
// import canvas from './components/Canvas'

// function App() {
    
//     return
//         <Canvas />
// }

// export default App


// // We need a canvas element to draw inside it, so we must create a component that is basically a canvas element:
// import React from 'react'

// const Canvas = props => <canvas {...props}/>

// export default Canvas

// Now we have a canvas element wrapped in a react component called Canvas. Great! However, how can we draw in it? Well… we will need to get the DOM canvas element itself to get its context object, right? The React way to get a dom element is by giving it a ref prop.

// //* Getting Canvas Context
// //To get the canvas element, we will create a ref and give it to the canvas element:
// import React, { useRef } from 'react'

// const Canvas = props => {
  
//   const canvasRef = useRef(null)
  
//   return <canvas ref={canvasRef} {...props}/>
// }

// export default Canvas

// // We can access the canvas element through the canvasRef now. Now we just need to get the context and start drawing!
// import React, { useRef } from 'react'

// const Canvas = props => {
  
//   const canvasRef = useRef(null)
//   const canvas = canvasRef.current
//   const context = canvas.getContext('2d')
  
//   return <canvas ref={canvasRef} {...props}/>
// }

// export default Canvas

// //*What? Is it broken? Cannot read property getContext of null? getContext is not a function? 😓
// The component is not mounted yet when we tried to get the canvas through the ref, so its value is, naturally, the initial value that we gave for it (which is null in my case). We must wait the component did mount properly before get the real canvas. Fortunately, there is a hook to handle that problem!
// The useEffect hook allow us to perform side effects in function components. It means that we can call functions right after the component did mount, component update or change of some variable, and some other stuff. (Learn more about useEffect hook here and life cycle of components here)
// We are interested in the first case right now: the component did mount. Right after the canvas element is available in the dom for us, we want to get it on javascript to take its context and make some draw. To do that, we pass a function to be executed as the first argument of the useEffect, and an empty array as the second. The empty array says to useEffect that we want execute that function only once, after the component did mount (we will discuss more about this array later). If we pass only the first argument (the function), useEffect will call the function after every single update of the component:

// import React, { useRef, useEffect } from 'react'

// const Canvas = props => {
  
//   const canvasRef = useRef(null)
  
//   useEffect(() => {
//     const canvas = canvasRef.current
//     const context = canvas.getContext('2d')
//     //Our first draw
//     context.fillStyle = '#000000'
//     context.fillRect(0, 0, context.canvas.width, context.canvas.height)
//   }, [])
  
//   return <canvas ref={canvasRef} {...props}/>
// }

// export default Canvas

//* Time to DRAW!!!

// import React, { useRef, useEffect } from 'react'

// const Canvas = props => {
  
//   const canvasRef = useRef(null)
  
//   const draw = ctx => {
//     ctx.fillStyle = '#000000'
//     ctx.beginPath()
//     ctx.arc(50, 100, 20, 0, 2*Math.PI)
//     ctx.fill()
//   }
  
//   useEffect(() => {
    
//     const canvas = canvasRef.current
//     const context = canvas.getContext('2d')
    
//     //Our draw come here
//     draw(context)
//   }, [draw])
  
//   return <canvas ref={canvasRef} {...props}/>
// }

// export default Canvas

// //* ADD ANIMATION
// import React, { useRef, useEffect } from 'react'

// const Canvas = props => {
  
//   const canvasRef = useRef(null)
  
//   const draw = (ctx, frameCount) => {
//     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
//     ctx.fillStyle = '#000000'
//     ctx.beginPath()
//     ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
//     ctx.fill()
//   }
  
//   useEffect(() => {
    
//     const canvas = canvasRef.current
//     const context = canvas.getContext('2d')
//     let frameCount = 0
//     let animationFrameId
    
//     //Our draw came here
//     const render = () => {
//       frameCount++
//       draw(context, frameCount)
//       animationFrameId = window.requestAnimationFrame(render)
//     }
//     render()
    
//     return () => {
//       window.cancelAnimationFrame(animationFrameId)
//     }
//   }, [draw])
  
//   return <canvas ref={canvasRef} {...props}/>
// }

// export default Canvas

// Let me explain what happened here:
//* Function render: 
// All the steps that will be repeated in the animation were wrapped in a function called render which will be called recursively by the requestAnimationFrame method.
//* The frameCount variable: 
// This is a control variable that counts frames. If you prefer, you can use a counter for time instead. The goal of this variable is provide a clock to our draw function since the animation is time dependent.
//* Draw function: 
// The draw function now takes the frame counter as argument and the radius of the circle changes over time. We also clear the canvas with clearRect function, otherwise it would draw over the previous draw every iteration.
//* Cancel animation frame: 
// The function returned in the useEffect callback (aka clean up function) is called right before the component unmount. That way we can ensure that our animation frame is cancelled after our canvas component unmount.

// // Looks good, don’t you think? But defining the draw function inside the component doesn’t sounds good… I mean, we still have the same draw for every canvas! 🤔
// I can see you yelling to me: “TAKE THE DRAW CALLBACK FROM PROPS!!”
// Keep calm young one, that is exactly what we’re gonna do right now 😎

import React, { useRef, useEffect } from 'react'

const Canvas = props => {
  
  const { draw, ...rest } = props
  const canvasRef = useRef(null)
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId
    
    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])
  
  return <canvas ref={canvasRef} {...rest}/>
}

export default Canvas