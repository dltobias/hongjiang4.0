// 自定义确认对话框
function showConfirm(options) {
    return new Promise((resolve) => {
        const {
            title = '确认操作',
            message = '确定要执行此操作吗？',
            confirmText = '确定',
            cancelText = '取消',
            type = 'warning' // warning, danger, info
        } = options;

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4 fade-in';
        
        const iconClass = type === 'danger' ? 'fa-exclamation-triangle text-red-500' :
                          type === 'warning' ? 'fa-exclamation-circle text-orange-500' :
                          'fa-info-circle text-blue-500';
        
        const btnClass = type === 'danger' ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-200' :
                         type === 'warning' ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-200' :
                         'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-200';

        modal.innerHTML = `
            <div class="bg-white rounded-xl w-full max-w-sm shadow-2xl transform transition-all scale-in">
                <div class="p-6 text-center">
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <i class="fas ${iconClass} text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-bold text-gray-800 mb-2">${title}</h3>
                    <p class="text-sm text-gray-600 mb-6">${message}</p>
                    <div class="flex gap-3">
                        <button class="cancel-btn flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors">
                            ${cancelText}
                        </button>
                        <button class="confirm-btn flex-1 py-2.5 ${btnClass} text-white rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition-all">
                            ${confirmText}
                        </button>
                    </div>
                </div>
            </div>
            <style>
                .fade-in { animation: fadeIn 0.2s ease-out; }
                .scale-in { animation: scaleIn 0.2s ease-out; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            </style>
        `;

        document.body.appendChild(modal);

        const confirmBtn = modal.querySelector('.confirm-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');

        confirmBtn.addEventListener('click', () => {
            modal.remove();
            resolve(true);
        });

        cancelBtn.addEventListener('click', () => {
            modal.remove();
            resolve(false);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                resolve(false);
            }
        });
    });
}
