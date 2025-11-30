export class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndex = 1000;
        this.windowStates = new Map();
        this.windowCount = 0;
        this.lastPosition = null;
        this.isMobile = window.innerWidth <= 768;
    }

    createWindow(app, x = null, y = null) {
        const template = document.getElementById('window-template');
        const clone = template.content.cloneNode(true);
        const windowElement = clone.querySelector('.window');
        
        const windowId = `window-${Date.now()}`;
        windowElement.id = windowId;
        
        // On mobile, use fullscreen positioning
        if (this.isMobile) {
            x = 0;
            y = 0;
        } else {
            // Use provided coordinates or calculate smart position
            let finalX = x;
            let finalY = y;
            
            if (x === null || y === null) {
                const smartPos = this.getSmartPosition(app);
                finalX = smartPos.x;
                finalY = smartPos.y;
            }
            
            windowElement.style.left = `${finalX}px`;
            windowElement.style.top = `${finalY}px`;
            this.lastPosition = { x: finalX, y: finalY };
        }
        
        // Set window size
        if (this.isMobile) {
            windowElement.style.width = '100vw';
            windowElement.style.height = 'calc(100vh - 50px)';
        } else {
            windowElement.style.width = `${app.width}px`;
            windowElement.style.height = `${app.height}px`;
        }
        
        windowElement.style.zIndex = this.zIndex++;
        
        // Set window content
        windowElement.querySelector('.window-title').textContent = app.name;
        windowElement.querySelector('.window-content').innerHTML = app.content;
        
        // Add mobile controls if on mobile
        if (this.isMobile) {
            this.addMobileControls(windowElement, windowId);
        }
        
        // Add to DOM
        document.getElementById('windows-container').appendChild(windowElement);
        
        // Add to taskbar
        const taskbarApp = this.addToTaskbar(windowId, app.name);
        
        // Initialize window functionality
        this.initializeWindow(windowElement, windowId, taskbarApp);
        
        // Store window state
        this.windowStates.set(windowId, {
            element: windowElement,
            taskbarApp: taskbarApp,
            isMinimized: false,
            isMaximized: this.isMobile, // Start maximized on mobile
            maximizeButton: null,
            originalStyle: this.isMobile ? null : {
                display: windowElement.style.display,
                left: windowElement.style.left,
                top: windowElement.style.top,
                width: windowElement.style.width,
                height: windowElement.style.height
            }
        });
        
        this.windows.set(windowId, windowElement);
        this.windowCount++;
        this.bringToFront(windowElement, taskbarApp);
        
        return windowElement;
    }

    addMobileControls(windowElement, windowId) {
        const mobileControls = document.createElement('div');
        mobileControls.className = 'mobile-window-controls';
        // mobileControls.innerHTML = `
        //     <button class="mobile-control-button" data-action="minimize">MINIMIZE</button>
        //     <button class="mobile-control-button" data-action="maximize">FULLSCREEN</button>
        //     <button class="mobile-control-button" data-action="close">CLOSE</button>
        // `;
        
        windowElement.querySelector('.window-content').appendChild(mobileControls);
        
        // Add event listeners for mobile controls
        this.setupMobileControlButtons(mobileControls, windowId);
        
        // Add swipe to close gesture - ONLY from header and with proper separation
        // this.addSwipeToClose(windowElement, windowId);
    }

    setupMobileControlButtons(mobileControls, windowId) {
        mobileControls.querySelectorAll('.mobile-control-button').forEach(button => {
            // Remove any existing listeners
            button.replaceWith(button.cloneNode(true));
            
            const newButton = mobileControls.querySelector(`[data-action="${button.dataset.action}"]`);
            
            // Use click event for reliability
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                const action = newButton.dataset.action;
                console.log(`Mobile control clicked: ${action}`);
                
                switch (action) {
                    case 'minimize':
                        this.minimizeWindow(windowId);
                        break;
                    case 'maximize':
                        this.toggleMaximize(windowId);
                        break;
                    case 'close':
                        this.closeWindow(windowId);
                        break;
                }
            }, true); // Use capture phase
            
            // Also add touchend for immediate response
            newButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                
                const action = newButton.dataset.action;
                console.log(`Mobile control touched: ${action}`);
                
                switch (action) {
                    case 'minimize':
                        this.minimizeWindow(windowId);
                        break;
                    case 'maximize':
                        this.toggleMaximize(windowId);
                        break;
                    case 'close':
                        this.closeWindow(windowId);
                        break;
                }
            }, true); // Use capture phase
        });
    }

    // addSwipeToClose(windowElement, windowId) {
    //     const header = windowElement.querySelector('.window-header');
    //     if (!header) return;

    //     let startY = 0;
    //     let currentY = 0;
    //     let isSwiping = false;
    //     let swipeElement = null;
        
    //     header.addEventListener('touchstart', (e) => {
    //         // Check if the touch is on a button - if so, don't start swipe
    //         if (e.target.closest('button')) {
    //             return;
    //         }
            
    //         // Only start swipe from the top 30px of the header
    //         const rect = header.getBoundingClientRect();
    //         if (e.touches[0].clientY - rect.top > 30) {
    //             return;
    //         }
            
    //         startY = e.touches[0].clientY;
    //         currentY = startY;
    //         isSwiping = true;
    //         swipeElement = e.target;
            
    //     }, { passive: true }); // Keep passive true to avoid blocking buttons
        
    //     header.addEventListener('touchmove', (e) => {
    //         if (!isSwiping) return;
            
    //         currentY = e.touches[0].clientY;
    //         const diff = currentY - startY;
            
    //         // Only trigger if swiping down significantly and not on a button
    //         if (diff > 10 && !e.target.closest('button')) {
    //             windowElement.style.transform = `translateY(${diff}px)`;
    //             windowElement.style.opacity = `${1 - (diff / 300)}`;
    //         }
    //     }, { passive: true }); // Keep passive true
        
    //     header.addEventListener('touchend', (e) => {
    //         if (!isSwiping) return;
            
    //         // Check if the touch ended on a button - if so, cancel swipe
    //         if (e.target.closest('button')) {
    //             this.resetWindowPosition(windowElement);
    //             isSwiping = false;
    //             return;
    //         }
            
    //         const diff = currentY - startY;
            
    //         // Only close if swiped down more than 80px and not on a button
    //         if (diff > 80) {
    //             this.closeWindow(windowId);
    //         } else {
    //             this.resetWindowPosition(windowElement);
    //         }
            
    //         isSwiping = false;
    //         swipeElement = null;
    //     }, { passive: true });
        
    //     // Reset if touch is cancelled
    //     header.addEventListener('touchcancel', () => {
    //         if (isSwiping) {
    //             this.resetWindowPosition(windowElement);
    //             isSwiping = false;
    //             swipeElement = null;
    //         }
    //     }, { passive: true });
    // }

    // resetWindowPosition(windowElement) {
    //     windowElement.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    //     windowElement.style.transform = 'translateY(0)';
    //     windowElement.style.opacity = '1';
        
    //     setTimeout(() => {
    //         windowElement.style.transition = '';
    //     }, 300);
    // }

    getSmartPosition(app) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const taskbarHeight = 40;
        
        if (this.windowCount === 0) {
            return {
                // x: (viewportWidth - app.width) / 2,
                // y: (viewportHeight - app.height) / 3
                x: Math.max(20, (viewportWidth - app.width) / 2),
                y: Math.max(20, (viewportHeight - app.height - taskbarHeight) / 3)
            };
        }
        
        // if (this.lastPosition) {
        //     const offset = 40;
        //     let newX = this.lastPosition.x + offset;
        //     let newY = this.lastPosition.y + offset;
            
        //     if (newX + app.width > viewportWidth - 20) {
        //         newX = Math.max(20, viewportWidth - app.width - 20);
        //     }
        //     if (newY + app.height > viewportHeight - 60) {
        //         newY = Math.max(20, viewportHeight - app.height - 60);
        //     }
            
        //     return { x: newX, y: newY };
        // }

        if (this.lastPosition) {
            const offset = 40;
            let newX = this.lastPosition.x + offset;
            let newY = this.lastPosition.y + offset;
            
            // Make sure the window stays within viewport bounds and above taskbar
            if (newX + app.width > viewportWidth - 20) {
                newX = Math.max(20, viewportWidth - app.width - 20);
            }
            if (newY + app.height > viewportHeight - taskbarHeight - 20) {
                newY = Math.max(20, viewportHeight - app.height - taskbarHeight - 20);
            }
            
            return { x: newX, y: newY };
        }

        const baseX = (viewportWidth - app.width) / 2;
        const baseY = (viewportHeight - app.height - taskbarHeight) / 4; // Higher position
        
        return {
            x: Math.min(baseX + (this.windowCount * 30), viewportWidth - app.width - 20),
            y: Math.min(baseY + (this.windowCount * 30), viewportHeight - app.height - taskbarHeight - 20)
        };
        
        // const baseX = (viewportWidth - app.width) / 2;
        // const baseY = (viewportHeight - app.height) / 3;
        // const offset = 30;
        
        // return {
        //     x: Math.min(baseX + (this.windowCount * offset), viewportWidth - app.width - 20),
        //     y: Math.min(baseY + (this.windowCount * offset), viewportHeight - app.height - 60)
        // };
    }

    initializeWindow(windowElement, windowId, taskbarApp) {
        const header = windowElement.querySelector('.window-header');
        const minimizeBtn = windowElement.querySelector('.minimize-btn');
        const maximizeBtn = windowElement.querySelector('.maximize-btn');
        const closeBtn = windowElement.querySelector('.close-btn');
        const resizeHandle = windowElement.querySelector('.window-resize-handle');

        // Store maximize button reference
        const windowState = this.windowStates.get(windowId);
        if (windowState) {
            windowState.maximizeButton = maximizeBtn;
        }

        // Set initial maximize button text
        if (maximizeBtn) {
            maximizeBtn.textContent = this.isMobile ? '⧉' : '□';
            maximizeBtn.title = this.isMobile ? 'Restore' : 'Maximize';
        }

        // Only enable drag on desktop
        if (!this.isMobile) {
            this.makeDraggable(header, windowElement);
            this.makeResizable(resizeHandle, windowElement);
        }

        // Window controls - use click for both desktop and mobile
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.minimizeWindow(windowId);
            });
        }

        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMaximize(windowId);
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeWindow(windowId);
            });
        }

        // Bring to front on click/tap
        windowElement.addEventListener('mousedown', () => this.bringToFront(windowElement, taskbarApp));
        windowElement.addEventListener('touchstart', () => this.bringToFront(windowElement, taskbarApp));

        // Taskbar click event - toggle minimize/restore
        if (taskbarApp) {
            taskbarApp.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleWindow(windowId);
            });
            
            // Also support touch for mobile
            taskbarApp.addEventListener('touchend', (e) => {
                e.stopPropagation();
                this.toggleWindow(windowId);
            });
        }

        // Fix all buttons in this window for mobile
        if (this.isMobile) {
            this.fixWindowButtonsMobile(windowElement);
        }
    }

    fixWindowButtonsMobile(windowElement) {
        const buttons = windowElement.querySelectorAll('button');
        buttons.forEach(button => {
            // Ensure buttons are properly styled for mobile
            button.style.cursor = 'pointer';
            button.style.minHeight = '44px';
            button.style.touchAction = 'manipulation';
            
            // Add visual feedback
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
                this.style.opacity = '0.8';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
                this.style.opacity = '1';
            });
        });
    }


    makeDraggable(handle, element) {
        // Disable dragging on mobile
        if (this.isMobile) return;

        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const taskbarHeight = this.isMobile ? 50 : 40;
        
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            element.style.zIndex = this.zIndex++; // Bring to front when dragging
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            const newTop = element.offsetTop - pos2;
            const newLeft = element.offsetLeft - pos1;
            
            // Calculate maximum positions
            const maxTop = window.innerHeight - taskbarHeight - element.offsetHeight;
            const maxLeft = window.innerWidth - element.offsetWidth;
            
            // Constrain movement within bounds
            element.style.top = Math.max(0, Math.min(newTop, maxTop)) + "px";
            element.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    makeResizable(handle, element) {
        handle.addEventListener('mousedown', initResize);

        function initResize(e) {
            e.preventDefault();
            
            const startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
            const startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
            const startX = e.clientX;
            const startY = e.clientY;
            
            function resize(e) {
                element.style.width = (startWidth + (e.clientX - startX)) + 'px';
                element.style.height = (startHeight + (e.clientY - startY)) + 'px';
            }

            function stopResize() {
                window.removeEventListener('mousemove', resize);
                window.removeEventListener('mouseup', stopResize);
            }

            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        }
    }

    addToTaskbar(windowId, appName) {
        const taskbarApp = document.createElement('div');
        taskbarApp.className = 'taskbar-app';
        taskbarApp.textContent = appName;
        taskbarApp.setAttribute('data-window-id', windowId);
        
        document.getElementById('taskbar-apps').appendChild(taskbarApp);
        return taskbarApp;
    }

    bringToFront(element, taskbarApp) {
        const windowState = this.getWindowStateByElement(element);
        if (windowState && windowState.isMinimized) {
            return;
        }
        
        element.style.zIndex = this.zIndex++;
        
        document.querySelectorAll('.taskbar-app').forEach(app => {
            app.classList.remove('active');
        });
        
        if (taskbarApp) {
            taskbarApp.classList.add('active');
        }
    }

    minimizeWindow(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (windowState) {
            windowState.element.style.display = 'none';
            windowState.isMinimized = true;
            windowState.taskbarApp.classList.remove('active');
        }
    }

    restoreWindow(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (windowState) {
            windowState.element.style.display = 'block';
            windowState.isMinimized = false;
            this.bringToFront(windowState.element, windowState.taskbarApp);
        }
    }

    toggleWindow(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (windowState) {
            if (windowState.isMinimized) {
                this.restoreWindow(windowId);
            } else {
                this.minimizeWindow(windowId);
            }
        }
    }

    toggleMaximize(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (!windowState) return;

        if (windowState.isMaximized) {
            this.restoreWindowSize(windowId);
        } else {
            this.maximizeWindow(windowId);
        }
    }

    maximizeWindow(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (!windowState) return;

        const element = windowState.element;
        
        // Store current style before maximizing
        if (!windowState.isMaximized) {
            windowState.originalStyle = {
                width: element.style.width,
                height: element.style.height,
                left: element.style.left,
                top: element.style.top
            };
        }

        // compute current taskbar height so bottom of window touches it
        // const taskbarEl = document.querySelector('.taskbar');
        // const taskbarHeight = taskbarEl ? Math.round(taskbarEl.getBoundingClientRect().height) : 40;

        // Maximize
        // element.style.left = '0px';
        // element.style.top = '0px';
        // element.style.width = `${window.innerWidth}px`;
        // element.style.height = `${Math.max(0, window.innerHeight - taskbarHeight)}px`;

        // Maximize
        element.style.width = 'calc(100vw - 4px)';
        element.style.height = 'calc(100vh - 44px)';
        element.style.left = '2px';
        element.style.top = '2px';
        
        // Update state and button
        windowState.isMaximized = true;
        if (windowState.maximizeButton) {
            windowState.maximizeButton.textContent = '⧉';
            windowState.maximizeButton.title = 'Restore';
        }
    }

    restoreWindowSize(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (!windowState) return;

        const element = windowState.element;
        
        // Restore to original size and position
        element.style.width = windowState.originalStyle.width || '600px';
        element.style.height = windowState.originalStyle.height || '400px';
        element.style.left = windowState.originalStyle.left || '100px';
        element.style.top = windowState.originalStyle.top || '100px';
        
        // Update state and button
        windowState.isMaximized = false;
        if (windowState.maximizeButton) {
            windowState.maximizeButton.textContent = '□';
            windowState.maximizeButton.title = 'Maximize';
        }
    }

    closeWindow(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (windowState) {
            windowState.element.remove();
            windowState.taskbarApp.remove();
            this.windowStates.delete(windowId);
            this.windows.delete(windowId);
            this.windowCount = Math.max(0, this.windowCount - 1);
            
            if (this.windowCount === 0) {
                this.lastPosition = null;
            }
        }
    }

    getWindowStateByElement(element) {
        for (const [windowId, state] of this.windowStates) {
            if (state.element === element) {
                return state;
            }
        }
        return null;
    }
}