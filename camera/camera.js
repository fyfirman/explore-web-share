var cameraElements = document.getElementById('cameraOnWebview');
var logger = document.getElementById('logger');

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      cameraElements.srcObject = stream;
      cameraElements.setAttribute('muted', '');
      cameraElements.setAttribute('playsinline', '');
    })
    .catch(function (e) {
      logger.insertAdjacentHTML('beforeend',
        `<span class="flex flex-col bg-red-50 p-2 rounded-md text-red-600 font-mono text-xs font-medium mb-2">
          Error (navigator.mediaDevices): ${e.message}
        </span>`
      );
    })
}

if(requestCameraPermissionAndroid){
  requestCameraPermissionAndroid();
}

window.addEventListener('message', (message) => {
  if(message.data.error){
    logger.insertAdjacentHTML('beforeend',
      `<span class="flex flex-col bg-red-50 p-2 rounded-md text-red-600 font-mono text-xs font-medium mb-2">
        Error: ${message.data.error}
      </span>`
    );
  }else if(message.data.cameraPermission){
    logger.insertAdjacentHTML('beforeend',
      `<span class="flex flex-col bg-red-50 p-2 rounded-md text-red-600 font-mono text-xs font-medium mb-2">
        cameraPermission: ${message.data.cameraPermission}
      </span>`
    );
  };
});