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

document.addEventListener('message', (res) => {
  const message = JSON.parse(res.data);
  if(message.error){
    logger.insertAdjacentHTML('afterbegin',
      `<span class="flex flex-col bg-red-50 p-2 rounded-md text-red-600 font-mono text-xs font-medium mb-2">
        Error: ${message.error}
      </span>`
    );
  }else if(message.cameraPermission){
    logger.insertAdjacentHTML('afterbegin',
      `<span class="flex flex-col bg-red-50 p-2 rounded-md text-red-600 font-mono text-xs font-medium mb-2">
        cameraPermission: ${message.cameraPermission}
      </span>`
    );
  }else {
    logger.insertAdjacentHTML('afterbegin',
      `<span class="flex flex-col bg-red-50 p-2 rounded-md text-red-600 font-mono text-xs font-medium mb-2">
        message: ${JSON.stringify(message)}
      </span>`
    );
  };
});