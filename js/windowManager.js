export class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndex = 1000;
        this.windowStates = new Map();
        this.windowCount = 0;
        this.lastPosition = null;
    }

    createWindow(app, x = null, y = null) {
        const template = document.getElementById('window-template');
        const clone = template.content.cloneNode(true);
        const windowElement = clone.querySelector('.window');
        
        const windowId = `window-${Date.now()}`;
        windowElement.id = windowId;
        
        // debug
        windowElement.style.position = 'fixed';

        // Use provided coordinates or calculate smart position
        let finalX = x;
        let finalY = y;
        
        if (x === null || y === null) {
            const smartPos = this.getSmartPosition(app);
            finalX = smartPos.x;
            finalY = smartPos.y;
        }

        // compute actual taskbar height from DOM to match CSS instead of hardcoding
        const taskbarEl = document.querySelector('.taskbar');
        const taskbarHeight = taskbarEl ? taskbarEl.offsetHeight : 40;
        const margin = 20; // keep a small gap from edges
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;

        // clamp finalX/finalY so the window fits within viewport and above the taskbar
        if (finalX < margin) finalX = margin;
        if (finalY < margin) finalY = margin;
        if (finalX + app.width > viewportW - margin) {
            finalX = Math.max(margin, viewportW - app.width - margin);
        }
        const maxAllowedY = Math.max(margin, viewportH - taskbarHeight - app.height - margin);
        if (finalY > maxAllowedY) finalY = maxAllowedY;

        // if the requested app height is larger than available space, cap it
        let appliedHeight = app.height;
        const maxHeight = Math.max(100, viewportH - taskbarHeight - (margin * 2));
        if (appliedHeight > maxHeight) appliedHeight = maxHeight;
        // similarly cap width if needed
        let appliedWidth = app.width;
        const maxWidth = Math.max(200, viewportW - (margin * 2));
        if (appliedWidth > maxWidth) appliedWidth = maxWidth;
        
        // Set window position and size
        // windowElement.style.left = `${finalX}px`;
        // windowElement.style.top = `${finalY}px`;
        // windowElement.style.width = `${app.width}px`;
        // windowElement.style.height = `${app.height}px`;
        windowElement.style.left = `${finalX}px`;
        windowElement.style.top = `${finalY}px`;
        windowElement.style.width = `${appliedWidth}px`;
        windowElement.style.height = `${appliedHeight}px`;
        windowElement.style.zIndex = this.zIndex++;
        
        // Set window content
        windowElement.querySelector('.window-title').textContent = app.name;
        windowElement.querySelector('.window-content').innerHTML = app.content;
        
        // Add to DOM
        document.getElementById('windows-container').appendChild(windowElement);
        
        // Add to taskbar
        const taskbarApp = this.addToTaskbar(windowId, app.name);
        
        // Get the maximize button reference BEFORE initializing
        const maximizeBtn = windowElement.querySelector('.maximize-btn');
        
        // Initialize window functionality
        this.initializeWindow(windowElement, windowId, taskbarApp, maximizeBtn);
        
        // Store window state
        this.windowStates.set(windowId, {
            element: windowElement,
            taskbarApp: taskbarApp,
            isMinimized: false,
            isMaximized: false,
            maximizeButton: maximizeBtn, // Store the actual button element
            originalStyle: {
                display: windowElement.style.display,
                left: windowElement.style.left,
                top: windowElement.style.top,
                width: windowElement.style.width,
                height: windowElement.style.height
            }
        });
        
        this.windows.set(windowId, windowElement);
        this.windowCount++;
        this.lastPosition = { x: finalX, y: finalY };
        this.bringToFront(windowElement, taskbarApp);
        
        return windowElement;
    }

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

    initializeWindow(windowElement, windowId, taskbarApp, maximizeBtn) {
        const header = windowElement.querySelector('.window-header');
        const minimizeBtn = windowElement.querySelector('.minimize-btn');
        const closeBtn = windowElement.querySelector('.close-btn');
        const resizeHandle = windowElement.querySelector('.window-resize-handle');

        // Set initial maximize button text
        maximizeBtn.textContent = '□';
        maximizeBtn.title = 'Maximize';

        // Drag functionality
        this.makeDraggable(header, windowElement);

        // Resize functionality
        this.makeResizable(resizeHandle, windowElement);

        // Window controls
        minimizeBtn.addEventListener('click', () => this.minimizeWindow(windowId));
        maximizeBtn.addEventListener('click', () => this.toggleMaximize(windowId));
        closeBtn.addEventListener('click', () => this.closeWindow(windowId));

        // Bring to front on click
        windowElement.addEventListener('mousedown', () => this.bringToFront(windowElement, taskbarApp));
        
        // Taskbar click event
        taskbarApp.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleWindow(windowId);
        });
    }

    makeDraggable(handle, element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
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
        const taskbarEl = document.querySelector('.taskbar');
        const taskbarHeight = taskbarEl ? Math.round(taskbarEl.getBoundingClientRect().height) : 40;

        // Maximize
        element.style.left = '0px';
        element.style.top = '0px';
        element.style.width = `${window.innerWidth}px`;
        element.style.height = `${Math.max(0, window.innerHeight - taskbarHeight)}px`;

        // Maximize
        // element.style.width = 'calc(100vw - 4px)';
        // element.style.height = 'calc(100vh - 44px)';
        // element.style.left = '2px';
        // element.style.top = '2px';
        
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