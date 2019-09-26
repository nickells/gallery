
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React, { useCallback, useRef, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Waypoint } from 'react-waypoint'


const waitForLoad = (img) => new Promise((resolve, reject) => {
  img.addEventListener('load', resolve)
})


function parseDate(s) {
  var b = s.split(/\D/);
  const original = new Date(b[0],b[1]-1,b[2],b[3],b[4],b[5]).getTime();
  // timezone
  return new Date(original + 46800000)
}

function setPath(url){
  window.history.replaceState( {} , 'doc', '?' + url )
}

const Photo = ({img, initial}) => {
  const $img = useRef(undefined)
  const data = img.exif
  const url = '/images/' + img.url
  const nanoUrl = url.replace('.jpg', '_nano.jpg')
  const [imageUrl, setimageUrl] = useState(nanoUrl)
  const [entered, setEntered] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const selectImage = useCallback(async () => {
    setPath(img.url)
    setEntered(true)
  }, [])

  const loadImage = useCallback(async () => {
    setimageUrl(url)
    await waitForLoad($img.current)
    setLoaded(true)
  }, [])

  const onMove = useCallback(e => {
    if (initial) console.log(e)
  }, [])
  
  const onExit = useCallback(() => {
    setEntered(false)
  }, [])

  let date = parseDate(data.DateTimeOriginal || '')

  return (
    <div 
      className={"item"}
      style={{marginLeft: initial ? '20vw' : '0px'}}
    >
      <div className="info top">
        {
          ` 
          ${date.toDateString()}, ${date.toTimeString().slice(0, 8)}
          `
        }
      </div>
      <Waypoint
        onEnter={loadImage}
        horizontal
      />
      <Waypoint
        onEnter={selectImage}
        onLeave={onExit}
        topOffset={(window.innerWidth / 2) - 1}
        bottomOffset={(window.innerWidth / 2) - 1}
        horizontal
      >
        <img src={imageUrl} ref={$img}
          style={
            {
              imageRendering: loaded ? 'unset' : 'pixelated',
            }
          }
        />
      </Waypoint>
      <div className="info bottom">
        { 
          `Camera: FUJIFILM X-T30
          Date: ${date.toDateString()}
          Time: ${date.toTimeString().slice(0, 8)}
          Aperture: F/${data.FNumber}
          Focal Length: ${data.FocalLength}mm
          EV: ${data.ExposureBiasValue}
          Shutter Speed: 1/${Math.round(1/data.ExposureTime)}
          ISO: ${data.ISO}`
        }
      </div>
    </div>  
  )
}


const go = async () => {
  const data = await fetch('/images/data.json')
  const images = await data.json()
  ReactDOM.render(
    <div className="gallery">
      {
        images.map((img, idx) => <Photo img={img} key={img.url} initial={idx === 0}></Photo>)
      }
    </div>, document.getElementById('app'),
  )

  setTimeout(() => {
    let gallery = document.getElementsByClassName('gallery')[0]
    document.body.style.height = gallery.scrollWidth + 'px'
  
    let isWindowScrolling = false
    let isGalleryScrolling = false
    gallery.addEventListener('scroll', () => {
      if (isWindowScrolling) return
      isGalleryScrolling = true
      window.scrollTo(0, gallery.scrollLeft)
      isGalleryScrolling = false
    })
    
    window.addEventListener('scroll', e => {
      if (isGalleryScrolling) return
      isWindowScrolling = true
      gallery.scrollLeft = window.scrollY
      isWindowScrolling = false
    })
    
  }, 0)
}

go()

console.log('hi')