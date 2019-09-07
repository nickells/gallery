import "core-js/stable";
import "regenerator-runtime/runtime";

const EXIF = require('exif-js');
const React = require('react');
const ReactDOM = require('react-dom')
const pick = require('lodash/pick')

const waitForLoad = (img) => new Promise((resolve, reject) => {
  img.addEventListener('load', resolve)
})

const getData = (img) => new Promise((resolve, reject) => {
  EXIF.getData(img, function() {
    const data = EXIF.getAllTags(this)
    resolve(data)
  })
})
  
async function go () {
  const img = new Image()
  img.src = 'images/DSCF0269.jpg'
  document.body.appendChild(img)
  await waitForLoad(img)
  const data = await getData(img)
  
}

go();

ReactDOM.render(() => (
  <div>
    Hello world!;
  </div>
), document.getElementById('app'))