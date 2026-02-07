// FakeBill - Bill Generator JavaScript

// State
let selectedBank = {
    code: 'vcb',
    name: 'Vietcombank',
    color: '#006A4E',
    logo: 'https://api.vietqr.io/img/VCB.png'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set current date/time
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 16);
    document.getElementById('transDate').value = dateStr;
    
    // Generate random transaction ID
    document.getElementById('transId').value = generateTransId();
    
    // Bank selection
    document.querySelectorAll('.bank-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.bank-item').forEach(b => b.classList.remove('selected'));
            item.classList.add('selected');
            
            selectedBank = {
                code: item.dataset.bank,
                name: item.dataset.name,
                color: item.dataset.color,
                logo: item.querySelector('img').src
            };
        });
    });
    
    // Format amount input
    document.getElementById('amount').addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
    });
});

// Generate transaction ID
function generateTransId() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 900000000) + 100000000;
    return `FT${year}${random}`;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Generate Bill
function generateBill() {
    const receiverName = document.getElementById('receiverName').value || 'NGUYEN VAN A';
    const accountNumber = document.getElementById('accountNumber').value || '0123456789';
    const amount = document.getElementById('amount').value || '1000000';
    const content = document.getElementById('content').value || 'Chuyen tien';
    const transDate = document.getElementById('transDate').value;
    const transId = document.getElementById('transId').value || generateTransId();
    
    // Update preview
    document.getElementById('billBankLogo').src = selectedBank.logo;
    document.getElementById('billBankName').textContent = selectedBank.name;
    document.getElementById('billAmount').textContent = formatCurrency(amount) + ' VNĐ';
    document.getElementById('billReceiver').textContent = receiverName.toUpperCase();
    document.getElementById('billAccount').textContent = accountNumber;
    document.getElementById('billContent').textContent = content;
    document.getElementById('billTime').textContent = formatDate(transDate);
    document.getElementById('billTransId').textContent = transId;
    
    // Show preview
    document.getElementById('placeholder').style.display = 'none';
    document.getElementById('billPreview').style.display = 'block';
    document.getElementById('downloadBtn').disabled = false;
    
    // Apply bank color
    document.querySelector('.bill-success .icon').style.background = 
        `linear-gradient(135deg, ${selectedBank.color}, ${adjustColor(selectedBank.color, 30)})`;
}

// Adjust color brightness
function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + amount);
    const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + amount);
    return `rgb(${r}, ${g}, ${b})`;
}

// Download Bill as Image
async function downloadBill() {
    const preview = document.getElementById('billPreview');
    
    try {
        const canvas = await html2canvas(preview, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false
        });
        
        const link = document.createElement('a');
        link.download = `bill_${selectedBank.code}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Error generating image:', error);
        alert('Có lỗi khi tạo ảnh. Vui lòng thử lại.');
    }
}
