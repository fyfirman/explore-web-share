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
writeLog('Application start', 'log', 'yellow');

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
  } else {
    writeLog('navigator.mediaDevices.getUserMedia is not defined', 'Error', 'red');
  }
}


button.addEventListener('click', async () => {
  try {
    await requestCameraPermissionAndroid();
    writeLog('requestCameraPermissionAndroid is executed', 'log', 'yellow');
  } catch (error) {
    writeLog(error.message, 'Error', 'red');
  }
});

openSettingButton.addEventListener('click', async () => {
  try {
    await openAppSetting();
  } catch (error) {
    writeLog(error.message, 'Error', 'red');
  }
})


let lastAppState = 'active';
let cameraPermission = 'denied';

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
    if(message.appState === 'active' && (lastAppState === 'background' || lastAppState === 'inactive') && cameraPermission === 'granted'){
      writeLog(`startCamera is executed`, 'log', 'yellow');
      startCamera();
      writeLog(`startCamera is done`, 'log', 'yellow');
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