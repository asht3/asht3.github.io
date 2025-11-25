export class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndex = 1000;
        this.windowStates = new Map(); // Track window states
    }

    createWindow(app, x = 100, y = 100) {
        const template = document.getElementById('window-template');
        const clone = template.content.cloneNode(true);
        const windowElement = clone.querySelector('.window');
        
        const windowId = `window-${Date.now()}`;
        windowElement.id = windowId;
        
        // Set window position and size
        windowElement.style.left = `${x}px`;
        windowElement.style.top = `${y}px`;
        windowElement.style.width = `${app.width}px`;
        windowElement.style.height = `${app.height}px`;
        windowElement.style.zIndex = this.zIndex++;
        
        // Set window content
        windowElement.querySelector('.window-title').textContent = app.name;
        windowElement.querySelector('.window-content').innerHTML = app.content;
        
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
            originalStyle: {
                display: windowElement.style.display,
                left: windowElement.style.left,
                top: windowElement.style.top,
                width: windowElement.style.width,
                height: windowElement.style.height
            }
        });
        
        this.windows.set(windowId, windowElement);
        this.bringToFront(windowElement, taskbarApp);
        
        return windowElement;
    }

    initializeWindow(windowElement, windowId, taskbarApp) {
        const header = windowElement.querySelector('.window-header');
        const minimizeBtn = windowElement.querySelector('.minimize-btn');
        const maximizeBtn = windowElement.querySelector('.maximize-btn');
        const closeBtn = windowElement.querySelector('.close-btn');
        const resizeHandle = windowElement.querySelector('.window-resize-handle');

        // Drag functionality
        this.makeDraggable(header, windowElement);

        // Resize functionality
        this.makeResizable(resizeHandle, windowElement);

        // Window controls
        minimizeBtn.addEventListener('click', () => this.minimizeWindow(windowId));
        maximizeBtn.addEventListener('click', () => this.toggleMaximize(windowElement));
        closeBtn.addEventListener('click', () => this.closeWindow(windowId));

        // Bring to front on click
        windowElement.addEventListener('mousedown', () => this.bringToFront(windowElement, taskbarApp));
        
        // Taskbar click event - toggle minimize/restore
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
            return; // Don't bring minimized windows to front
        }
        
        element.style.zIndex = this.zIndex++;
        
        // Update taskbar active state
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

    toggleMaximize(element) {
        const windowState = this.getWindowStateByElement(element);
        if (!windowState) return;

        if (element.style.width === '100vw' && element.style.height === 'calc(100vh - 40px)') {
            // Restore to original size
            element.style.width = windowState.originalStyle.width || '600px';
            element.style.height = windowState.originalStyle.height || '400px';
            element.style.left = windowState.originalStyle.left || '100px';
            element.style.top = windowState.originalStyle.top || '100px';
        } else {
            // Store current style before maximizing
            windowState.originalStyle = {
                width: element.style.width,
                height: element.style.height,
                left: element.style.left,
                top: element.style.top
            };
            
            // Maximize
            element.style.width = '100vw';
            element.style.height = 'calc(100vh - 40px)';
            element.style.left = '0';
            element.style.top = '0';
        }
    }

    closeWindow(windowId) {
        const windowState = this.windowStates.get(windowId);
        if (windowState) {
            windowState.element.remove();
            windowState.taskbarApp.remove();
            this.windowStates.delete(windowId);
            this.windows.delete(windowId);
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