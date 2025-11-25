export class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndex = 1000;
        this.windowPositions = new Map();
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
        this.addToTaskbar(windowId, app.name);
        
        // Initialize window functionality
        this.initializeWindow(windowElement, windowId);
        
        this.windows.set(windowId, windowElement);
        this.bringToFront(windowElement);
        
        return windowElement;
    }

    initializeWindow(windowElement, windowId) {
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
        windowElement.addEventListener('mousedown', () => this.bringToFront(windowElement));
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
            
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);

            function resize(e) {
                element.style.width = (e.clientX - element.offsetLeft) + 'px';
                element.style.height = (e.clientY - element.offsetTop) + 'px';
            }

            function stopResize() {
                window.removeEventListener('mousemove', resize);
                window.removeEventListener('mouseup', stopResize);
            }
        }
    }

    addToTaskbar(windowId, appName) {
        const taskbarApp = document.createElement('div');
        taskbarApp.className = 'taskbar-app';
        taskbarApp.textContent = appName;
        taskbarApp.addEventListener('click', () => this.bringToFront(this.windows.get(windowId)));
        
        document.getElementById('taskbar-apps').appendChild(taskbarApp);
    }

    bringToFront(element) {
        element.style.zIndex = this.zIndex++;
        
        // Update taskbar active state
        document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
    }

    minimizeWindow(windowId) {
        const window = this.windows.get(windowId);
        window.style.display = 'none';
    }

    toggleMaximize(element) {
        if (element.style.width === '100vw') {
            element.style.width = '600px';
            element.style.height = '400px';
            element.style.left = '100px';
            element.style.top = '100px';
        } else {
            element.style.width = '100vw';
            element.style.height = 'calc(100vh - 40px)';
            element.style.left = '0';
            element.style.top = '0';
        }
    }

    closeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.remove();
            this.windows.delete(windowId);
            
            // Remove from taskbar
            const taskbarApps = document.getElementById('taskbar-apps');
            const taskbarApp = Array.from(taskbarApps.children).find(
                app => app.textContent === window.querySelector('.window-title').textContent
            );
            if (taskbarApp) taskbarApp.remove();
        }
    }
}