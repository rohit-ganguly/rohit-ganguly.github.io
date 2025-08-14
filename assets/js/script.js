/* Loading screen functionality */
document.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const lcdContent = document.getElementById('lcdContent');
  const lcd = document.querySelector('.lcd'); // reference to LCD for background GIF
  let hasStarted = false;

  // Function to hide loading screen and show LCD content
  function startDevice() {
    if (hasStarted) return;
    hasStarted = true;
    
    loadingScreen.classList.add('hidden');
    lcdContent.classList.add('show');

    // Reveal background GIF behind content
    if (lcd) {
      // slight delay to let loading screen begin fading before showing GIF
      setTimeout(() => lcd.classList.add('show-background'), 50);
    }
    
    // Remove boot class after LCD content is shown
    setTimeout(()=>document.body.classList.remove('boot'),300);
    
    // Initialize menu after device starts
    initializeMenu();
  }

  // Menu navigation system
  let currentMenuIndex = 0;
  const menuItems = [];
  const contentSections = [];
  let menuPointer = null;

  function initializeMenu() {
    // Get menu elements
    const menuItemElements = document.querySelectorAll('.menu-item');
    const contentSectionElements = document.querySelectorAll('.content-section');
    menuPointer = document.querySelector('.menu-pointer');
    
    // Convert NodeLists to arrays
    menuItems.length = 0;
    contentSections.length = 0;
    menuItemElements.forEach(item => menuItems.push(item));
    contentSectionElements.forEach(section => contentSections.push(section));
    
    // Set initial pointer position
    updateMenuPointer();
    
    console.log('Menu initialized with', menuItems.length, 'items');
  }

  function updateMenuPointer() {
    if (!menuPointer || menuItems.length === 0) return;
    
    // Calculate position based on current menu index
    const itemHeight = 1.1; // rem - matches .menu-item height
    const itemSpacing = 0.15; // rem - margin-bottom between items
    const menuTopMargin = 0.8; // rem - menu-items margin-top
    const itemPadding = 0.25; // rem - menu-item padding-top
    const pointerOffset = 0.55; // rem - center the pointer vertically in the item
    
    const pointerTop = menuTopMargin + itemPadding + pointerOffset + (currentMenuIndex * (itemHeight + itemSpacing));
    
    menuPointer.style.top = `${pointerTop}rem`;
    
    // Update active states
    menuItems.forEach((item, index) => {
      item.classList.toggle('active', index === currentMenuIndex);
    });
    
    // Update content sections
    contentSections.forEach((section, index) => {
      section.classList.toggle('active', index === currentMenuIndex);
    });
    
    console.log('Menu pointer moved to index', currentMenuIndex);
  }

  function navigateMenu(direction) {
    if (!hasStarted || menuItems.length === 0) return;
    
    if (direction === 'up') {
      currentMenuIndex = currentMenuIndex === 0 ? menuItems.length - 1 : currentMenuIndex - 1;
    } else if (direction === 'down') {
      currentMenuIndex = currentMenuIndex === menuItems.length - 1 ? 0 : currentMenuIndex + 1;
    }
    
    updateMenuPointer();
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

  // Add press effects with logging and menu navigation
  dpadUp.addEventListener('mousedown', (e) => {
    console.log('Up pressed');
    dpad.classList.add('pressing-up');
    if (hasStarted) navigateMenu('up');
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
    if (hasStarted) navigateMenu('down');
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
    if (hasStarted) navigateMenu('up');
    e.preventDefault();
  });
  dpadUp.addEventListener('touchend', () => {
    console.log('Up touch ended');
    dpad.classList.remove('pressing-up');
  });
  
  dpadDown.addEventListener('touchstart', (e) => {
    console.log('Down touched');
    dpad.classList.add('pressing-down');
    if (hasStarted) navigateMenu('down');
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

  // Keyboard support for arrow keys and menu navigation
  document.addEventListener('keydown', (e) => {
    // Any key starts the device if not started
    if (!hasStarted) {
      handleGBAButtonStart(e);
      return;
    }

    // Arrow key navigation after device is started
    switch(e.key) {
      case 'ArrowUp':
        console.log('Arrow Up pressed');
        dpad.classList.add('pressing-up');
        navigateMenu('up');
        e.preventDefault();
        break;
      case 'ArrowDown':
        console.log('Arrow Down pressed');
        dpad.classList.add('pressing-down');
        navigateMenu('down');
        e.preventDefault();
        break;
      case 'ArrowLeft':
        console.log('Arrow Left pressed');
        dpad.classList.add('pressing-left');
        e.preventDefault();
        break;
      case 'ArrowRight':
        console.log('Arrow Right pressed');
        dpad.classList.add('pressing-right');
        e.preventDefault();
        break;
      case 'Enter':
        console.log('Enter pressed (A button)');
        aButton.classList.add('pressed');
        e.preventDefault();
        break;
      case 'Escape':
        console.log('Escape pressed (B button)');
        bButton.classList.add('pressed');
        e.preventDefault();
        break;
    }
  });

  document.addEventListener('keyup', (e) => {
    // Remove D-pad press effects on key release
    switch(e.key) {
      case 'ArrowUp':
        dpad.classList.remove('pressing-up');
        break;
      case 'ArrowDown':
        dpad.classList.remove('pressing-down');
        break;
      case 'ArrowLeft':
        dpad.classList.remove('pressing-left');
        break;
      case 'ArrowRight':
        dpad.classList.remove('pressing-right');
        break;
      case 'Enter':
        aButton.classList.remove('pressed');
        break;
      case 'Escape':
        bButton.classList.remove('pressed');
        break;
    }
  });
});