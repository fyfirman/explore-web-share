var cameraElements = document.getElementById('cameraOnWebview');
var logger = document.getElementById('logger');
var button = document.getElementById('button');
var requestCameraPermissionAndroid;

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      cameraElements.srcObject = stream;
      cameraElements.setAttribute('muted', '');
      cameraElements.setAttribute('playsinline', '');
    })
    .catch(function (e) {
      logger.insertAdjacentHTML('afterbegin',
        `<span class="flex flex-col bg-red-50 p-2 rounded-md text-red-600 font-mono text-xs font-medium mb-2">
          Error (navigator.mediaDevices): ${e.message}
        </span>`
      );
    })
}

const request = async () => {
  try {
    await requestCameraPermissionAndroid();
    logger.insertAdjacentHTML('afterbegin',
      `<span class="flex flex-col bg-green-50 p-2 rounded-md text-green-600 font-mono text-xs font-medium mb-2">
        Log: requestCameraPermissionAndroid is executed
      </span>`
    );
  } catch (error) {
    logger.insertAdjacentHTML('afterbegin',
      `<span class="flex flex-col bg-yellow-50 p-2 rounded-md text-yellow-600 font-mono text-xs font-medium mb-2">
        Warn: ${error.message}
      </span>`
    );
  }
}

request();

button.addEventListener('click', async () => {
  try {
    await request();
  } catch (error) {
  }
});

window.addEventListener('message', (message) => {
  if(message.data.error){
    logger.insertAdjacentHTML('afterbegin',
      `<span class="flex flex-col bg-red-50 p-2 rounded-md text-red-600 font-mono text-xs font-medium mb-2">
        Error: ${message.data.error}
      </span>`
    );
  }else if(message.data.cameraPermission){
    logger.insertAdjacentHTML('afterbegin',
      `<span class="flex flex-col bg-red-50 p-2 rounded-md text-red-600 font-mono text-xs font-medium mb-2">
        cameraPermission: ${message.data.cameraPermission}
      </span>`
    );
  };
});