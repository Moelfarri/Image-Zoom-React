//import img from "./data/wind_front_sams.PNG";
import img from "./data/test.PNG"
import React, { useRef, useState, Component } from "react";
import "./App.css";

//source of inspiration: https://github.com/SoorajChandran/image-hover-zoom



/**
 * Today:
 */




//TODO:
/**
 * 1.rewrite "ImageZoom" to modern react
 * 2.redo the code so that the zoom panel follows the ship
 */
function ImageZoomTwo (props) {
  let zoomFactor  = parseInt(props.options.zoomFactor, 10) || 3;
  const imgWidth  = 700;
  const imgHeight = 700;
  let frameHeight = imgHeight/6;
  let frameWidth  = imgWidth/3;
  

  const [xState, setXState] = useState(0);
  const [yState, setYState] = useState(0);

  /* find the target sibling element - takes element - el and the id of the sibling - targetId  */
  const getTargetElement = (el, targetId) => {
    const children = el.parentNode.childNodes;
    return Array.from(children).find(item => item.id === targetId);
  };



  /* to add the frame on hover */
  const addFrame = (x, y, el) => {
    const { left, top, width, height } = el.getBoundingClientRect();
    const minX = x - frameWidth/zoomFactor  /2  //Math.min(x  , left + width - frameWidth);
    const minY = y - frameHeight/zoomFactor /2  //Math.min(y , top + height - frameHeight);
    const frameEl = getTargetElement(el, "frame");
    frameEl.style.left = `${minX}px`;
    frameEl.style.top = `${minY}px`;
    const scaledValues = scaleValues(
      minX - el.offsetLeft ,
      minY  - el.offsetTop 
    );
    getTargetElement(
      el,
      "zoomedImageContainer"
    ).style.backgroundPosition = `${scaledValues[0]}px ${scaledValues[1]}px`;
  };

  const hide = (id, el) => {
    getTargetElement(el, id).style.display = "none";
  }


  /* return the scaled values */
  const scaleValues = (x, y) => [
    -1 * zoomFactor * parseInt(x, 10),
    -1 * zoomFactor * parseInt(y, 10)
  ];



   /* show the zoomed image container */
   const showZoomedContainer = el => {
    const targetEl =  getTargetElement(el, "zoomedImageContainer");
    targetEl.style.display = "block";
    const { left, top, width } = el.getBoundingClientRect();
    /* to check the location if the images - whether left/right */
    targetEl.style.left =
      left <= window.screen.width / 2 ? `${left + width}px` : `${left - imgWidth}px`;
    targetEl.style.top = `${top}px`;

    if ( isImageLoaded()) {
      targetEl.style.background = `url(${
         props.options.originalImage
      }) no-repeat`;
      targetEl.style.backgroundSize = `${ zoomFactor * imgWidth}px ${zoomFactor * imgHeight}px`;
    } else {
      targetEl.style.background = `url(${
         props.options.compressedImage
      }) no-repeat`;
      targetEl.style.backgroundSize = `${ zoomFactor * imgWidth}px ${zoomFactor * imgHeight}px`;
    }
  };

  /* to check if the high-def image is loaded */
  const isImageLoaded = () => {
    const img = new Image();
    img.src =  props.options.originalImage;
    return img.complete;
  };

  /* handle mouse enter */
  const handleMouseEnter = e => {
     getTargetElement(e.target, "frame").style.display = "block";
     showZoomedContainer(e.target);
  };

  /* handle mouse move */
  const handleMouseMove = e => {
    //necessary with the "set" state call to make things happen
    setXState(e.clientX);
    setYState(e.clientY);
     addFrame(e.clientX, e.clientY, e.target);
  };

  /* handle mouse leave */
  const handleMouseLeave = e => {
     hide("frame", e.target);
     hide("zoomedImageContainer", e.target);
  };


  const { compressedImage, dir } =  props.options;

    return (
      <div>
        <div className={`image-container ${dir}`} style={{dir: "left"}}>
          <img
            onMouseMove={ handleMouseMove}
            onMouseLeave={ handleMouseLeave}
            onMouseEnter={ handleMouseEnter}
            /**className="sampleImage"*/
            src={compressedImage}
            alt="sample"
            width={imgWidth}
            height={imgHeight}
            style={{height: `${imgHeight}px`, width: `${imgWidth}px`, cursor: "crosshair"}}
          />
          <div id="frame" /**className="frame"*/ style={{height: frameHeight/zoomFactor, width: frameWidth/zoomFactor, top: "0", left: "0", display: "none", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(0, 0, 0, 0.8)", position: "absolute", pointerEvents: "none"}} />
          <div id="zoomedImageContainer" /**className="zoomedImageContainer"*/ style={{height: frameHeight, width: frameWidth, overflow: "hidden", position: "absolute", backgroundPosition: "0 0"}}>
            
            <div id="horizontal line" style={{width: frameWidth, height: "0", border: "1px solid #000000", background: "rgba(0,0,0,1)", marginTop: frameHeight/2, position: "absolute"}} />
            <div id="vertical line"   style={{width: "0", height: frameHeight, border: "1px solid #000000", background: "rgba(0,0,0,1)", marginLeft: frameWidth/2}} />
            
          </div>
        </div>
      </div>
    );
}






//**Other Component */

class ImageZoom extends Component {
  constructor(props) {
    super(props);
    this.zoomFactor = parseInt(this.props.options.zoomFactor, 10) || 3;
    this.frameHeight = 100;
    this.frameWidth = 200;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }

  /* find the target sibling element - takes element - el and the id of the sibling - targetId  */
  getTargetElement = (el, targetId) => {
    const children = el.parentNode.childNodes;
    return Array.from(children).find(item => item.id === targetId);
  };

  /* to add the frame on hover */
  addFrame = (x, y, el) => {
    const { left, top, width, height } = el.getBoundingClientRect();
    const minX = Math.min(x, left + width - this.frameWidth);
    const minY = Math.min(y, top + height - this.frameHeight);
    const frameEl = this.getTargetElement(el, "frame");
    frameEl.style.left = `${minX}px`;
    frameEl.style.top = `${minY}px`;
    const scaledValues = this.scaleValues(
      minX - el.offsetLeft,
      minY - el.offsetTop
    );
    this.getTargetElement(
      el,
      "zoomedImageContainer"
    ).style.backgroundPosition = `${scaledValues[0]}px ${scaledValues[1]}px`;
  };

  hide(id, el) {
    this.getTargetElement(el, id).style.display = "none";
  }

  /* return the scaled values */
  scaleValues = (x, y) => [
    -1 * this.zoomFactor * parseInt(x, 10),
    -1 * this.zoomFactor * parseInt(y, 10)
  ];

  /* show the zoomed image container */
  showZoomedContainer = el => {
    const targetEl = this.getTargetElement(el, "zoomedImageContainer");
    targetEl.style.display = "block";
    const { left, top, width } = el.getBoundingClientRect();
    /* to check the location if the images - whether left/right */
    targetEl.style.left =
      left <= window.screen.width / 2 ? `${left + width}px` : `${left - 600}px`;
    targetEl.style.top = `${top}px`;

    if (this.isImageLoaded()) {
      targetEl.style.background = `url(${
        this.props.options.originalImage
      }) no-repeat`;
      targetEl.style.backgroundSize = `${this.zoomFactor * 600}px ${this
        .zoomFactor * 300}px`;
    } else {
      targetEl.style.background = `url(${
        this.props.options.compressedImage
      }) no-repeat`;
      targetEl.style.backgroundSize = `${this.zoomFactor * 600}px ${this
        .zoomFactor * 300}px`;
    }
  };

  /* to check if the high-def image is loaded */
  isImageLoaded = () => {
    const img = new Image();
    img.src = this.props.options.originalImage;
    return img.complete;
  };

  /* handle mouse enter */
  handleMouseEnter = e => {
    this.getTargetElement(e.target, "frame").style.display = "block";
    this.showZoomedContainer(e.target);
  };

  /* handle mouse move */
  handleMouseMove = e => {
    this.addFrame(e.clientX, e.clientY, e.target);
  };

  /* handle mouse leave */
  handleMouseLeave = e => {
    this.hide("frame", e.target);
    this.hide("zoomedImageContainer", e.target);
  };

  render() {
    const { compressedImage, dir } = this.props.options;

    return (
      <div>
        <div className={`image-container ${dir}`}>
          <img
            onMouseMove={this.handleMouseMove}
            onMouseLeave={this.handleMouseLeave}
            onMouseEnter={this.handleMouseEnter}
            className="sampleImage"
            src={compressedImage}
            alt="sample"
            width="600"
            height="600" 
          />
          <div id="frame" className="frame" />
          <div id="zoomedImageContainer" className="zoomedImageContainer" />
        </div>
      </div>
    );
  }
}




const img1 = {
compressedImage: `${img}`,
  originalImage: `${img}`,
  zoomFactor: "3",
  dir: "left"
};

 

const App = () => {
 

 return (
  <div className="App">
    {/**
     * Original hover thing that i am taking inspiration from:
     * <h1> Hover on the image - copy:</h1>
    <ImageZoom options={img1} />
  */}
    <h1> Hover on the image:</h1>
    <ImageZoomTwo options={img1} />
 
  </div>
);}

export default App;