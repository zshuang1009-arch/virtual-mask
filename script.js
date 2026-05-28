class Desktop {
    constructor() {
        this.dragging = null;
        this.dragOffset = { x: 0, y: 0 };
        this.currentFolder = null;
        
        this.folderData = {
            info1: {
                name: 'Information 1',
                files: [
                    { name: 'Report.pdf', icon: '📄' },
                    { name: 'Data.xlsx', icon: '📊' },
                    { name: 'Presentation.pptx', icon: '📈' },
                    { name: 'Notes.txt', icon: '📝' }
                ]
            },
            info2: {
                name: 'Information 2',
                files: [
                    { name: 'Image.png', icon: '🖼️' },
                    { name: 'Video.mp4', icon: '🎬' },
                    { name: 'Archive.zip', icon: '📦' }
                ]
            },
            confidential: {
                name: 'Confidential File',
                files: [
                    { name: 'Secret.docx', icon: '🔒' },
                    { name: 'Encrypted.dat', icon: '🛡️' },
                    { name: 'Private.key', icon: '🔑' },
                    { name: 'Logs.txt', icon: '📋' },
                    { name: 'Audit.pdf', icon: '📑' }
                ]
            }
        };

        this.init();
    }

    init() {
        this.setupFolderDrag();
        this.setupFolderClick();
        this.setupWindowDrag();
        this.setupDockItems();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
    }

    setupFolderDrag() {
        const folders = document.querySelectorAll('.folder');
        
        folders.forEach(folder => {
            folder.addEventListener('mousedown', (e) => this.startDrag(e, folder));
            folder.addEventListener('touchstart', (e) => this.startTouchDrag(e, folder));
        });

        document.addEventListener('mousemove', (e) => this.onDrag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        document.addEventListener('touchmove', (e) => this.onTouchDrag(e));
        document.addEventListener('touchend', () => this.stopDrag());
    }

    startDrag(e, folder) {
        e.preventDefault();
        this.dragging = folder;
        const rect = folder.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        folder.classList.add('dragging');
    }

    startTouchDrag(e, folder) {
        const touch = e.touches[0];
        e.preventDefault();
        this.dragging = folder;
        const rect = folder.getBoundingClientRect();
        this.dragOffset = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
        folder.classList.add('dragging');
    }

    onDrag(e) {
        if (!this.dragging) return;
        
        const x = e.clientX - this.dragOffset.x;
        const y = e.clientY - this.dragOffset.y;
        
        const maxX = window.innerWidth - this.dragging.offsetWidth;
        const maxY = window.innerHeight - this.dragging.offsetHeight - 80;
        
        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(35, Math.min(y, maxY));
        
        this.dragging.style.left = `${boundedX}px`;
        this.dragging.style.top = `${boundedY}px`;
    }

    onTouchDrag(e) {
        if (!this.dragging) return;
        
        const touch = e.touches[0];
        const x = touch.clientX - this.dragOffset.x;
        const y = touch.clientY - this.dragOffset.y;
        
        const maxX = window.innerWidth - this.dragging.offsetWidth;
        const maxY = window.innerHeight - this.dragging.offsetHeight - 80;
        
        const boundedX = Math.max(0, Math.min(x, maxX));
        const boundedY = Math.max(35, Math.min(y, maxY));
        
        this.dragging.style.left = `${boundedX}px`;
        this.dragging.style.top = `${boundedY}px`;
    }

    stopDrag() {
        if (this.dragging) {
            this.dragging.classList.remove('dragging');
            this.dragging = null;
        }
    }

    setupFolderClick() {
        const folders = document.querySelectorAll('.folder');
        
        folders.forEach(folder => {
            folder.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openFolder(folder);
            });
        });
    }

    openFolder(folder) {
        const folderId = folder.dataset.folder;
        
        if (folderId === 'info1') {
            window.location.href = 'folder1.html';
            return;
        }
        
        if (folderId === 'info2') {
            window.location.href = 'folder2.html';
            return;
        }
        
        if (folderId === 'confidential') {
            window.location.href = 'folder3.html';
            return;
        }
        
        const data = this.folderData[folderId];
        
        if (!data) return;
        
        const folderWindow = document.getElementById('folderWindow');
        const folderTitle = document.getElementById('folderTitle');
        const folderContent = document.getElementById('folderContent');
        
        folderTitle.textContent = data.name;
        folderContent.innerHTML = '';
        
        data.files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-icon">${file.icon}</div>
                <div class="file-name">${file.name}</div>
            `;
            folderContent.appendChild(fileItem);
        });
        
        folderWindow.style.display = 'block';
        this.currentFolder = folderId;
    }

    closeFolderWindow() {
        const folderWindow = document.getElementById('folderWindow');
        folderWindow.style.display = 'none';
        this.currentFolder = null;
    }

    setupWindowDrag() {
        const windows = document.querySelectorAll('.window-header');
        
        windows.forEach(header => {
            let dragging = false;
            let offset = { x: 0, y: 0 };
            const windowEl = header.parentElement;
            
            header.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('dot')) return;
                dragging = true;
                const rect = windowEl.getBoundingClientRect();
                offset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!dragging) return;
                const x = e.clientX - offset.x;
                const y = e.clientY - offset.y;
                const maxX = window.innerWidth - windowEl.offsetWidth;
                const maxY = window.innerHeight - windowEl.offsetHeight - 80;
                windowEl.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
                windowEl.style.top = `${Math.max(35, Math.min(y, maxY))}px`;
            });
            
            document.addEventListener('mouseup', () => {
                dragging = false;
            });
            
            header.querySelector('.dot.red').addEventListener('click', () => {
                if (windowEl.id === 'folderWindow') {
                    this.closeFolderWindow();
                }
            });
        });
    }

    setupDockItems() {
        const dockItems = document.querySelectorAll('.dock-item');
        
        dockItems.forEach(item => {
            item.addEventListener('click', () => {
                item.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 150);
            });
        });
    }

    updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.querySelector('.time').textContent = `${hours}:${minutes}:${seconds}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Desktop();
});