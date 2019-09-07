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
  

const Photo = ({url}) => {
  console.log('hoto')
  const img = useRef(undefined)
  const [data, setData] = useState({})
  useEffect(async () => {
    await waitForLoad(img.current);
    const data = await getData(img.current)
    setData(pick(data, 
      'Make',
      'Model',
      'DateTime',
      'FNumber',
      'FocalLengthIn35mmFilm',
      'ExposureBias',
      'ShutterSpeedValue',
      'ISOSpeedRatings'
      )
    )
  }, [])

  return (
    <div>
      <img src={url} ref={img} />
      <pre formatting="json">
        { JSON.stringify(data, null, 2) }
      </pre>
    </div>  
  )
}

const images = [
  'images/DSCF0269.jpg'
]

ReactDOM.render(<div>
    hi
    {
      images.map(url => <Photo url={url}></Photo>)
    }
  </div>, document.getElementById('app'),
)

console.log('hi')