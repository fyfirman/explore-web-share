var cameraElements = document.getElementById('cameraOnWebview');
var logger = document.getElementById('logger');
var button = document.getElementById('button');
var openSettingButton = document.getElementById('open-setting-button');
var requestCameraPermissionAndroid;

const writeLog = (message, label = 'message', color = 'green') => {
  logger.insertAdjacentHTML('afterbegin',
  `<span class="flex flex-col bg-${color}-50 p-2 rounded-md text-${color}-600 font-mono text-xs font-medium mb-2">
    ${label}: ${message}
  </span>`
  );
}

var startCamera = function (){
  if (navigator.mediaDevices || navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        cameraElements.srcObject = stream;
        cameraElements.setAttribute('muted', '');
        cameraElements.setAttribute('playsinline', '');
      })
      .catch(function (error) {
        writeLog(error.message, 'Error', 'red');
      })
  }
}


button.addEventListener('click', async () => {
  try {
    await requestCameraPermissionAndroid();
    logger.insertAdjacentHTML('afterbegin',
      `<span class="flex flex-col bg-green-50 p-2 rounded-md text-green-600 font-mono text-xs font-medium mb-2">
        Log: requestCameraPermissionAndroid is executed
      </span>`
    );
    writeLog('requestCameraPermissionAndroid is executed', 'log');
  } catch (error) {
    writeLog(error.message, 'Error', 'red');
  }
});

openSettingButton.addEventListener('click', async () => {
  try {
    await openAppSetting();
  } catch (error) {
    logger.insertAdjacentHTML('afterbegin',
      `<span class="flex flex-col bg-yellow-50 p-2 rounded-md text-yellow-600 font-mono text-xs font-medium mb-2">
        Warn: ${error.message}
      </span>`
    );
  }
})


let lastAppState = 'active';

startCamera();

const messageHandler = (res) => {
  const message = JSON.parse(res.data);
  if(message.cameraPermission){
    // cameraPermission : 'granted' | 'unavailable' | 'denied' | 'blocked' | 'not_android'
    writeLog(message.cameraPermission, 'cameraPermission');
    
  } else if(message.openAppSetting){
    // openAppSetting : 'success' | 'failed'
    if(message.openAppSetting === 'success'){
      writeLog(message.openAppSetting, 'openAppSetting');
    } else {
      writeLog(message.error, 'Error (openAppSetting)', 'red');
    }
  } else if(message.appState){
    // appState : 'active' | 'background' | 'inactive' | 'unknown' | 'extension'
    if(appState === 'active' && lastAppState === 'background'){
      startCamera();
    }
    
    writeLog(`change lastAppState "${lastAppState}" to "${message.appState}"`, 'log', 'yellow');
    lastAppState = message.appState;
  } else if(message.error){
    // Handle if error
    writeLog(message.error, 'Error', 'red');
  } else {
    // just for debugging
    writeLog(JSON.stringify(message), 'message', 'yellow');
  };
}

document.addEventListener('message', messageHandler);
window.addEventListener('message', messageHandler);