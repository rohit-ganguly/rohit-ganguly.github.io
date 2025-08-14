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
  let isDetailView = false;
  let currentDetailIndex = 0;
  let detailInteractiveElements = [];
  const menuItems = [];
  const contentSections = [];
  let menuPointer = null;
  let detailPointer = null;
  let gameContainer = null;
  let fadeOverlay = null;

  // Fade transition functions
  function fadeToBlack(callback) {
    if (!fadeOverlay) fadeOverlay = document.getElementById('fadeOverlay');
    if (!fadeOverlay) return;

    fadeOverlay.classList.add('fade-in');
    
    // Execute callback when screen is fully black
    setTimeout(() => {
      if (callback) callback();
      
      // Fade back in after content has changed
      setTimeout(() => {
        fadeOverlay.classList.remove('fade-in');
      }, 50); // Small delay to ensure content is rendered
    }, 300); // Wait for full fade to black
  }

  function initializeMenu() {
    // Get menu elements
    const menuItemElements = document.querySelectorAll('.menu-item');
    const contentSectionElements = document.querySelectorAll('.content-section');
    menuPointer = document.querySelector('.menu-pointer');
    gameContainer = document.querySelector('.game-container');
    
    // Convert NodeLists to arrays
    menuItems.length = 0;
    contentSections.length = 0;
    menuItemElements.forEach(item => menuItems.push(item));
    contentSectionElements.forEach(section => contentSections.push(section));
    
    // Add click listeners to menu items
    menuItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (hasStarted && !isDetailView) {
          currentMenuIndex = index;
          showDetailView(item.dataset.section);
        }
      });
    });
    
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
    
    // If in detail view, handle detail navigation instead of menu navigation
    if (isDetailView) {
      navigateDetailView(direction);
      return;
    }
    
    if (direction === 'up') {
      currentMenuIndex = currentMenuIndex === 0 ? menuItems.length - 1 : currentMenuIndex - 1;
    } else if (direction === 'down') {
      currentMenuIndex = currentMenuIndex === menuItems.length - 1 ? 0 : currentMenuIndex + 1;
    }
    
    updateMenuPointer();
  }

  function navigateDetailView(direction) {
    // Special handling for contact detail view
    if (isDetailView && document.getElementById('contact-detail').classList.contains('active')) {
      navigateContactCarousel(direction);
      return;
    }
    
    if (!isDetailView || detailInteractiveElements.length === 0) {
      // Fallback to scrolling if no interactive elements
      scrollDetailView(direction);
      return;
    }
    
    if (direction === 'up') {
      currentDetailIndex = currentDetailIndex === 0 ? detailInteractiveElements.length - 1 : currentDetailIndex - 1;
    } else if (direction === 'down') {
      currentDetailIndex = currentDetailIndex === detailInteractiveElements.length - 1 ? 0 : currentDetailIndex + 1;
    }
    
    updateDetailPointer();
    scrollToActiveDetailElement();
  }

  function updateDetailPointer() {
    if (!detailPointer || detailInteractiveElements.length === 0) return;
    
    const activeElement = detailInteractiveElements[currentDetailIndex];
    if (!activeElement) return;
    
    // Remove active class from all elements
    detailInteractiveElements.forEach(el => el.classList.remove('active'));
    
    // Add active class to current element
    activeElement.classList.add('active');
    
    // Position pointer relative to the active element
    const detailContent = activeElement.closest('.detail-content');
    if (!detailContent) return;
    
    const elementRect = activeElement.getBoundingClientRect();
    const contentRect = detailContent.getBoundingClientRect();
    
    // Calculate position relative to detail-content
    const relativeTop = elementRect.top - contentRect.top + detailContent.scrollTop;
    
    detailPointer.style.top = `${relativeTop + (elementRect.height / 2)}px`;
    detailPointer.style.display = 'block';
    
    console.log('Detail pointer moved to index', currentDetailIndex);
  }

  function scrollToActiveDetailElement() {
    if (!detailInteractiveElements[currentDetailIndex]) return;
    
    const activeElement = detailInteractiveElements[currentDetailIndex];
    const detailContent = activeElement.closest('.detail-content');
    
    if (detailContent) {
      const elementTop = activeElement.offsetTop;
      const elementHeight = activeElement.offsetHeight;
      const containerHeight = detailContent.clientHeight;
      const scrollTop = detailContent.scrollTop;
      
      // Check if element is visible
      const elementVisible = elementTop >= scrollTop && 
                           elementTop + elementHeight <= scrollTop + containerHeight;
      
      if (!elementVisible) {
        // Scroll to center the element
        const targetScroll = elementTop - (containerHeight / 2) + (elementHeight / 2);
        detailContent.scrollTop = Math.max(0, targetScroll);
      }
    }
  }

  function initializeDetailInteractiveElements(detailView) {
    detailInteractiveElements = [];
    currentDetailIndex = 0;
    
    if (!detailView) return;
    
    // Special handling for contact detail view
    if (detailView.id === 'contact-detail') {
      initializeContactCarousel(detailView);
      return;
    }
    
    // Find all interactive elements (links, etc.)
    const interactiveElements = detailView.querySelectorAll('a.contact-link, .detail-interactive');
    
    interactiveElements.forEach(el => {
      detailInteractiveElements.push(el);
      // Add click handler
      el.addEventListener('click', (e) => {
        if (isDetailView && el.classList.contains('active')) {
          // Element is selected, allow normal click behavior
          return true;
        }
        // Prevent default if not selected
        e.preventDefault();
      });
    });
    
    // Get the detail pointer for this view
    detailPointer = detailView.querySelector('.detail-view-pointer');
    
    if (detailInteractiveElements.length > 0) {
      updateDetailPointer();
    } else if (detailPointer) {
      detailPointer.style.display = 'none';
    }
    
    console.log('Initialized detail interactive elements:', detailInteractiveElements.length);
  }

  function selectCurrentDetailItem() {
    // Special handling for contact detail view
    if (isDetailView && document.getElementById('contact-detail').classList.contains('active')) {
      selectCurrentContactItem();
      return;
    }
    
    if (!isDetailView || detailInteractiveElements.length === 0) return;
    
    const currentElement = detailInteractiveElements[currentDetailIndex];
    if (currentElement && currentElement.tagName === 'A') {
      // For links, trigger the click
      currentElement.click();
      console.log('Clicked detail link:', currentElement.href);
    }
  }

  function scrollDetailView(direction) {
    const activeDetailView = document.querySelector('.detail-view.active');
    if (!activeDetailView) return;
    
    const detailContent = activeDetailView.querySelector('.detail-content');
    if (!detailContent) return;
    
    const scrollAmount = 30; // pixels to scroll per button press
    
    if (direction === 'up') {
      detailContent.scrollTop = Math.max(0, detailContent.scrollTop - scrollAmount);
    } else if (direction === 'down') {
      const maxScroll = detailContent.scrollHeight - detailContent.clientHeight;
      detailContent.scrollTop = Math.min(maxScroll, detailContent.scrollTop + scrollAmount);
    }
    
    console.log('Scrolling detail view', direction, 'to position:', detailContent.scrollTop);
  }

  function showDetailView(section) {
    fadeToBlack(() => {
      isDetailView = true;
      gameContainer.classList.add('detail-mode');
      
      // Hide all detail views first
      const detailViews = document.querySelectorAll('.detail-view');
      detailViews.forEach(view => view.classList.remove('active'));
      
      // Show the selected detail view
      const targetDetail = document.getElementById(`${section}-detail`);
      if (targetDetail) {
        targetDetail.classList.add('active');
        // Initialize interactive elements for this detail view
        initializeDetailInteractiveElements(targetDetail);
      }
      
      console.log('Showing detail view for:', section);
    });
  }

  function hideDetailView() {
    if (!isDetailView) return;
    
    fadeToBlack(() => {
      isDetailView = false;
      gameContainer.classList.remove('detail-mode');
      
      // Hide all detail views
      const detailViews = document.querySelectorAll('.detail-view');
      detailViews.forEach(view => view.classList.remove('active'));
      
      // Clear detail interactive elements
      detailInteractiveElements.forEach(el => el.classList.remove('active'));
      detailInteractiveElements = [];
      currentDetailIndex = 0;
      
      console.log('Returning to main menu');
    });
  }

  function selectCurrentMenuItem() {
    if (!hasStarted) return;
    
    if (isDetailView) {
      // In detail view, select the current interactive element
      selectCurrentDetailItem();
    } else if (menuItems.length > 0) {
      // In main menu, show detail view
      const currentItem = menuItems[currentMenuIndex];
      if (currentItem) {
        showDetailView(currentItem.dataset.section);
      }
    }
  }

  // Contact carousel specific functions
  let contactCarouselIndex = 0;
  let contactCarouselItems = [];
  
  function initializeContactCarousel(detailView) {
    // Get carousel items
    contactCarouselItems = Array.from(detailView.querySelectorAll('.contact-carousel-item'));
    contactCarouselIndex = 0;
    
    // Hide the detail pointer for contact carousel
    detailPointer = detailView.querySelector('.detail-view-pointer');
    if (detailPointer) {
      detailPointer.style.display = 'none';
    }
    
    // Initialize first item as active
    updateContactCarousel();
    
    console.log('Initialized contact carousel with', contactCarouselItems.length, 'items');
  }
  
  function navigateContactCarousel(direction) {
    if (contactCarouselItems.length === 0) return;
    
    if (direction === 'left') {
      contactCarouselIndex = contactCarouselIndex === 0 ? contactCarouselItems.length - 1 : contactCarouselIndex - 1;
    } else if (direction === 'right') {
      contactCarouselIndex = contactCarouselIndex === contactCarouselItems.length - 1 ? 0 : contactCarouselIndex + 1;
    }
    
    updateContactCarousel();
  }
  
  function updateContactCarousel() {
    if (contactCarouselItems.length === 0) return;
    
    // Update carousel items
    contactCarouselItems.forEach((item, index) => {
      item.classList.toggle('active', index === contactCarouselIndex);
    });
    
    // Update progress dots
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === contactCarouselIndex);
    });
    
    console.log('Contact carousel updated to index:', contactCarouselIndex);
  }
  
  function selectCurrentContactItem() {
    if (contactCarouselItems.length === 0) return;
    
    const currentItem = contactCarouselItems[contactCarouselIndex];
    if (currentItem) {
      const url = currentItem.dataset.url;
      if (url) {
        window.open(url, '_blank');
        console.log('Opened contact link:', url);
      }
    }
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
    if (hasStarted) navigateMenu('left');
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
    if (hasStarted) navigateMenu('right');
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
    if (hasStarted) navigateMenu('left');
    e.preventDefault();
  });
  dpadLeft.addEventListener('touchend', () => {
    console.log('Left touch ended');
    dpad.classList.remove('pressing-left');
  });
  
  dpadRight.addEventListener('touchstart', (e) => {
    console.log('Right touched');
    dpad.classList.add('pressing-right');
    if (hasStarted) navigateMenu('right');
    e.preventDefault();
  });
  dpadRight.addEventListener('touchend', () => {
    console.log('Right touch ended');
    dpad.classList.remove('pressing-right');
  });

  // A Button events
  aButton.addEventListener('mousedown', () => {
    console.log('A button pressed');
    if (hasStarted) selectCurrentMenuItem();
  });
  aButton.addEventListener('mouseup', () => {
    console.log('A button released');
  });
  aButton.addEventListener('touchstart', () => {
    console.log('A button touched');
    if (hasStarted) selectCurrentMenuItem();
  });
  aButton.addEventListener('touchend', () => {
    console.log('A button touch ended');
  });

  // B Button events
  bButton.addEventListener('mousedown', () => {
    console.log('B button pressed');
    if (hasStarted) hideDetailView();
  });
  bButton.addEventListener('mouseup', () => {
    console.log('B button released');
  });
  bButton.addEventListener('touchstart', () => {
    console.log('B button touched');
    if (hasStarted) hideDetailView();
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
    // Only specific keys start the device if not started
    if (!hasStarted) {
      const validStartKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'b', 'B', ' '];
      if (validStartKeys.includes(e.key)) {
        handleGBAButtonStart(e);
      }
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
        if (hasStarted) navigateMenu('left');
        e.preventDefault();
        break;
      case 'ArrowRight':
        console.log('Arrow Right pressed');
        dpad.classList.add('pressing-right');
        if (hasStarted) navigateMenu('right');
        e.preventDefault();
        break;
      case 'Enter':
        console.log('Enter pressed (A button)');
        aButton.classList.add('pressed');
        if (hasStarted) selectCurrentMenuItem();
        e.preventDefault();
        break;
      case 'Escape':
      case 'b':
      case 'B':
        console.log('Escape/B pressed (B button)');
        bButton.classList.add('pressed');
        if (hasStarted) hideDetailView();
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
      case 'b':
      case 'B':
        bButton.classList.remove('pressed');
        break;
    }
  });
});