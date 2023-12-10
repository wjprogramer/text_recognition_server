# TicketPlus

```js
// Svg to image data
var svgElement = document.querySelector('.recaptcha-area svg');
var svgString = new XMLSerializer().serializeToString(svgElement);

var blob = new Blob([svgString], { type: 'image/svg+xml' });
var svgUrl = URL.createObjectURL(blob);

// Create img
var img = new Image();
img.src = svgUrl;

// --> for testing
// var body = document.querySelector('body');
// body.appendChild(img)

// Build form data
const formData = new FormData();
formData.append('image', blob, 'image.svg');

// Send image
fetch('http://localhost:9487/api/main/recognize', {
  method: 'POST',
  body: formData
})
  .then(response => {
    // 处理服务器响应
  })
  .catch(error => {
    console.error('发送图像时发生错误：', error);
  });
```