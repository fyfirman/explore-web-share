var cameraElements = document.getElementsByClassName('camera')

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      [...cameraElements].forEach(function(element){
        element.srcObject = stream;
        element.setAttribute('muted', '');
        element.setAttribute('playsinline', '');
      });
    })
    .catch(function (e) {
      console.error('Something went wrong!', e)
    })
}