const cards = document.querySelectorAll('.card');
let currentIndex = 0;
let isDragging = false;
let startX = 0;
let currentX = 0;
let initialTransform = 0;
let distanceMoved = 0;
const swipeThreshold = 0.3;  // Swipe threshold percentage of card's width (30% swipe)

// Start dragging
function startEvent(e) {
    isDragging = true;
    startX = e.clientX || e.touches[0].clientX;
    initialTransform = parseInt(getComputedStyle(cards[currentIndex]).transform.split(',')[4]) || 0;
    cards[currentIndex].style.transition = ''; // Disable transition during drag
    e.preventDefault();
}

// Debounce to avoid excessive function calls
function debounce(func, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };
}

// Move the card while dragging
function moveEvent(e) {
    if (!isDragging) return;
    currentX = e.clientX || e.touches[0].clientX;
    distanceMoved = currentX - startX + initialTransform;
    cards[currentIndex].style.transform = `translateX(${distanceMoved}px) rotate(${distanceMoved / 10}deg)`; // Add rotation to the swipe
}

// End dragging and apply swipe logic
function endEvent(e) {
    if (!isDragging) return;
    isDragging = false;

    const cardWidth = cards[currentIndex].offsetWidth;  // Get the card width
    const swipeDistance = Math.abs(distanceMoved);

    // If swipe goes beyond the threshold, swipe the card out
    if (swipeDistance > cardWidth * swipeThreshold) {
        const direction = distanceMoved > 0 ? 1 : -1;

        // Add swipe and opacity transition
        cards[currentIndex].style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
        cards[currentIndex].style.transform = `translateX(${direction * 100}vw) rotate(${direction * 20}deg)`; // Swipe fully off-screen
        cards[currentIndex].style.opacity = 0;  // Fade out

        // Wait for the transition to finish before changing the image and hiding the card
        setTimeout(() => {
            cards[currentIndex].style.display = 'none'; // Hide the card
            showNextCard(); // Show the next card
        }, 600); // Match duration of transition
    } else {
        // Reset position if swipe wasn't large enough
        cards[currentIndex].style.transition = 'transform 0.2s ease';
        cards[currentIndex].style.transform = 'translateX(0) rotate(0deg)';
    }
}

// Show the next card
function showNextCard() {
    cards[currentIndex].style.display = 'block'; // Ensure the current card is visible before hiding it

    currentIndex++;
    if (currentIndex < cards.length) {
        cards[currentIndex].style.zIndex = '1';
        setupCardSwipe(cards[currentIndex]);
    } else {
        console.log('No more cards to swipe!');
    }
}

// Initialize the swipe functionality on the first card
if (cards.length > 0) {
    setupCardSwipe(cards[currentIndex]);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Attempt to make the document fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { // Firefox
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
            document.documentElement.msRequestFullscreen();
        }
    } else {
        // If already in fullscreen, exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }
}



// Set up swipe event listeners for touch and mouse events
function setupCardSwipe(card) {
    card.addEventListener('mousedown', startEvent);  // Mouse support
    card.addEventListener('touchstart', startEvent);  // Touch support
    card.addEventListener('mousemove', moveEvent);    // Mouse move support
    card.addEventListener('touchmove', moveEvent);    // Touch move support
    card.addEventListener('mouseup', endEvent);       // Mouse up support
    card.addEventListener('touchend', endEvent);      // Touch end support
    card.addEventListener('mouseleave', endEvent);    // Mouse leave support (if dragging outside)
    card.addEventListener('touchcancel', endEvent);   // Touch cancel support

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js').then(registration => {
                console.log('ServiceWorker registered with scope:', registration.scope);
            }).catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
        });
    }

}
