
/* Loading screen functionality */
document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const lcdContent = document.getElementById('lcdContent');
  let hasStarted = false;

  // Function to hide loading screen and show LCD content
  function startDevice() {
    if (hasStarted) return;
    hasStarted = true;
    
    loadingScreen.classList.add('hidden');
    lcdContent.classList.add('show');
    
    // Remove boot class after LCD content is shown
    setTimeout(()=>document.body.classList.remove('boot'),300);
  }

  // Function to handle GBA button clicks to start the device
  function handleGBAButtonStart(e) {
    e.preventDefault();
    startDevice();
  }

  // Button press animations and logging after device is shown
  // D-pad elements
  const dpad = document.querySelector('.dpad');
  const dpadUp = document.querySelector('.dpad-up');
  const dpadDown = document.querySelector('.dpad-down');
  const dpadLeft = document.querySelector('.dpad-left');
  const dpadRight = document.querySelector('.dpad-right');

  // Other button elements
  const aButton = document.querySelector('.ab-btn[aria-label="A"]');
  const bButton = document.querySelector('.ab-btn[aria-label="B"]');
  const startButton = document.querySelector('button[aria-label="start"]');
  const selectButton = document.querySelector('button[aria-label="select"]');
  const brightnessButton = document.querySelector('button[aria-label="brightness"]');

  console.log('All button elements found:', { 
    dpad, dpadUp, dpadDown, dpadLeft, dpadRight,
    aButton, bButton, startButton, selectButton, brightnessButton 
  });

  // Add start device functionality to all GBA buttons
  if (dpadUp) dpadUp.addEventListener('click', handleGBAButtonStart);
  if (dpadDown) dpadDown.addEventListener('click', handleGBAButtonStart);
  if (dpadLeft) dpadLeft.addEventListener('click', handleGBAButtonStart);
  if (dpadRight) dpadRight.addEventListener('click', handleGBAButtonStart);
  if (aButton) aButton.addEventListener('click', handleGBAButtonStart);
  if (bButton) bButton.addEventListener('click', handleGBAButtonStart);
  if (startButton) startButton.addEventListener('click', handleGBAButtonStart);
  if (selectButton) selectButton.addEventListener('click', handleGBAButtonStart);
  if (brightnessButton) brightnessButton.addEventListener('click', handleGBAButtonStart);

  // Add touch support for mobile
  if (dpadUp) dpadUp.addEventListener('touchend', handleGBAButtonStart);
  if (dpadDown) dpadDown.addEventListener('touchend', handleGBAButtonStart);
  if (dpadLeft) dpadLeft.addEventListener('touchend', handleGBAButtonStart);
  if (dpadRight) dpadRight.addEventListener('touchend', handleGBAButtonStart);
  if (aButton) aButton.addEventListener('touchend', handleGBAButtonStart);
  if (bButton) bButton.addEventListener('touchend', handleGBAButtonStart);
  if (startButton) startButton.addEventListener('touchend', handleGBAButtonStart);
  if (selectButton) selectButton.addEventListener('touchend', handleGBAButtonStart);
  if (brightnessButton) brightnessButton.addEventListener('touchend', handleGBAButtonStart);

  // Add press effects with logging
  dpadUp.addEventListener('mousedown', (e) => {
    console.log('Up pressed');
    dpad.classList.add('pressing-up');
    e.preventDefault();
  });
  dpadUp.addEventListener('mouseup', () => {
    console.log('Up released');
    dpad.classList.remove('pressing-up');
  });
  dpadUp.addEventListener('mouseleave', () => dpad.classList.remove('pressing-up'));

  dpadDown.addEventListener('mousedown', (e) => {
    console.log('Down pressed');
    dpad.classList.add('pressing-down');
    e.preventDefault();
  });
  dpadDown.addEventListener('mouseup', () => {
    console.log('Down released');
    dpad.classList.remove('pressing-down');
  });
  dpadDown.addEventListener('mouseleave', () => dpad.classList.remove('pressing-down'));

  dpadLeft.addEventListener('mousedown', (e) => {
    console.log('Left pressed');
    dpad.classList.add('pressing-left');
    e.preventDefault();
  });
  dpadLeft.addEventListener('mouseup', () => {
    console.log('Left released');
    dpad.classList.remove('pressing-left');
  });
  dpadLeft.addEventListener('mouseleave', () => dpad.classList.remove('pressing-left'));

  dpadRight.addEventListener('mousedown', (e) => {
    console.log('Right pressed');
    dpad.classList.add('pressing-right');
    e.preventDefault();
  });
  dpadRight.addEventListener('mouseup', () => {
    console.log('Right released');
    dpad.classList.remove('pressing-right');
  });
  dpadRight.addEventListener('mouseleave', () => dpad.classList.remove('pressing-right'));

  // Touch support
  dpadUp.addEventListener('touchstart', (e) => {
    console.log('Up touched');
    dpad.classList.add('pressing-up');
    e.preventDefault();
  });
  dpadUp.addEventListener('touchend', () => {
    console.log('Up touch ended');
    dpad.classList.remove('pressing-up');
  });
  
  dpadDown.addEventListener('touchstart', (e) => {
    console.log('Down touched');
    dpad.classList.add('pressing-down');
    e.preventDefault();
  });
  dpadDown.addEventListener('touchend', () => {
    console.log('Down touch ended');
    dpad.classList.remove('pressing-down');
  });
  
  dpadLeft.addEventListener('touchstart', (e) => {
    console.log('Left touched');
    dpad.classList.add('pressing-left');
    e.preventDefault();
  });
  dpadLeft.addEventListener('touchend', () => {
    console.log('Left touch ended');
    dpad.classList.remove('pressing-left');
  });
  
  dpadRight.addEventListener('touchstart', (e) => {
    console.log('Right touched');
    dpad.classList.add('pressing-right');
    e.preventDefault();
  });
  dpadRight.addEventListener('touchend', () => {
    console.log('Right touch ended');
    dpad.classList.remove('pressing-right');
  });

  // A Button events
  aButton.addEventListener('mousedown', () => {
    console.log('A button pressed');
  });
  aButton.addEventListener('mouseup', () => {
    console.log('A button released');
  });
  aButton.addEventListener('touchstart', () => {
    console.log('A button touched');
  });
  aButton.addEventListener('touchend', () => {
    console.log('A button touch ended');
  });

  // B Button events
  bButton.addEventListener('mousedown', () => {
    console.log('B button pressed');
  });
  bButton.addEventListener('mouseup', () => {
    console.log('B button released');
  });
  bButton.addEventListener('touchstart', () => {
    console.log('B button touched');
  });
  bButton.addEventListener('touchend', () => {
    console.log('B button touch ended');
  });

  // Start Button events
  startButton.addEventListener('mousedown', () => {
    console.log('Start button pressed');
  });
  startButton.addEventListener('mouseup', () => {
    console.log('Start button released');
  });
  startButton.addEventListener('touchstart', () => {
    console.log('Start button touched');
  });
  startButton.addEventListener('touchend', () => {
    console.log('Start button touch ended');
  });

  // Select Button events
  selectButton.addEventListener('mousedown', () => {
    console.log('Select button pressed');
  });
  selectButton.addEventListener('mouseup', () => {
    console.log('Select button released');
  });
  selectButton.addEventListener('touchstart', () => {
    console.log('Select button touched');
  });
  selectButton.addEventListener('touchend', () => {
    console.log('Select button touch ended');
  });

  // Brightness Button events
  brightnessButton.addEventListener('mousedown', () => {
    console.log('Brightness button pressed');
  });
  brightnessButton.addEventListener('mouseup', () => {
    console.log('Brightness button released');
  });
  brightnessButton.addEventListener('touchstart', () => {
    console.log('Brightness button touched');
  });
  brightnessButton.addEventListener('touchend', () => {
    console.log('Brightness button touch ended');
  });
});