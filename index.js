import "core-js/stable";
import "regenerator-runtime/runtime";

import EXIF from 'exif-js'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import pick from 'lodash/pick'


const waitForLoad = (img) => new Promise((resolve, reject) => {
  img.addEventListener('load', resolve)
})

const getData = (img) => new Promise((resolve, reject) => {
  EXIF.getData(img, function() {
    const data = EXIF.getAllTags(this)
    resolve(data)
  })
})
  
function parseDate(s) {
  var b = s.split(/\D/);
  const original = new Date(b[0],b[1]-1,b[2],b[3],b[4],b[5]).getTime();
  // timezone
  return new Date(original + 46800000)
}

const Photo = ({url}) => {
  const img = useRef(undefined)
  const [data, setData] = useState({})
  useEffect(async () => {
    await waitForLoad(img.current);
    const data = await getData(img.current)
    setData(pick(data, 
      'Make',
      'Model',
      'DateTimeOriginal',
      'FNumber',
      'FocalLength',
      'ExposureBias',
      'ExposureTime',
      'ShutterSpeedValue',
      'ISOSpeedRatings'
      )
    )
  }, [])

  let date = parseDate(data.DateTimeOriginal || '')
  return (
    <div className="item">
      <img src={url} ref={img} />
      <div className="info">
        {
          `
          Camera: ${data.Make} ${data.Model}
          Date: ${date.toDateString()}
          Time: ${date.toTimeString().slice(0, 8)}
          Aperture: 1/${data.FNumber}
          Focal Length: ${data.FocalLength}mm
          EV: ${data.ExposureBias}
          Shutter Speed: 1/${Math.round(1/data.ExposureTime)}
          ISO: ${data.ISOSpeedRatings}
          `
        }
      </div>
    </div>  
  )
}

const images = [
  'images/DSCF0175.jpg',
  'images/DSCF0179.jpg',
  'images/DSCF0180.jpg',
  'images/DSCF0181.jpg',
  'images/DSCF0191.jpg',
  'images/DSCF0194.jpg',
  'images/DSCF0195.jpg',
  'images/DSCF0196.jpg',
  'images/DSCF0199.jpg',
  'images/DSCF0200.jpg',
  'images/DSCF0203.jpg',
  'images/DSCF0209.jpg',
  'images/DSCF0211.jpg',
  'images/DSCF0213.jpg',
  'images/DSCF0214.jpg',
  'images/DSCF0216.jpg',
  'images/DSCF0217.jpg',
  'images/DSCF0218.jpg',
  'images/DSCF0220.jpg',
  'images/DSCF0221.jpg',
  'images/DSCF0222.jpg',
  'images/DSCF0225.jpg',
  'images/DSCF0226.jpg',
  'images/DSCF0230.jpg',
  'images/DSCF0234.jpg',
  'images/DSCF0236.jpg',
  'images/DSCF0238.jpg',
  'images/DSCF0245.jpg',
  'images/DSCF0248.jpg',
  'images/DSCF0256.jpg',
  'images/DSCF0257.jpg',
  'images/DSCF0259.jpg',
  'images/DSCF0261.jpg',
  'images/DSCF0263.jpg',
]

ReactDOM.render(
  <div className="gallery">
    {
      images.map(url => <Photo url={url}></Photo>)
    }
  </div>, document.getElementById('app'),
)

console.log('hi')