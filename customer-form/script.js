document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const form = document.getElementById('complaint-form');
    const steps = document.querySelectorAll('.form-step');
    const progressFill = document.getElementById('progress-fill');
    const progressSteps = document.querySelectorAll('.step');
    const modal = document.getElementById('success-modal');
    const complaintSummary = document.getElementById('complaint-summary');
    const referenceId = document.getElementById('reference-id');
    
    // Current step tracking
    let currentStep = 1;
    const totalSteps = 4;
    
    // Form data storage
    let formData = {
        personal: {},
        order: {},
        complaint: {},
        solution: {}
    };
    
    // Initialize
    updateProgress();
    setupEventListeners();
    
    // Event Listeners Setup
    function setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.btn-next').forEach(btn => {
            btn.addEventListener('click', goToNextStep);
        });
        
        document.querySelectorAll('.btn-prev').forEach(btn => {
            btn.addEventListener('click', goToPrevStep);
        });
        
        // Quantity controls
        document.getElementById('increase-qty').addEventListener('click', () => {
            const quantityInput = document.getElementById('quantity');
            quantityInput.value = parseInt(quantityInput.value) + 1;
            validateField(quantityInput);
        });
        
        document.getElementById('decrease-qty').addEventListener('click', () => {
            const quantityInput = document.getElementById('quantity');
            if (parseInt(quantityInput.value) > 1) {
                quantityInput.value = parseInt(quantityInput.value) - 1;
                validateField(quantityInput);
            }
        });
        
        // Real-time validation
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => validateField(input));
        });
        
        // Character counters
        const complaintDesc = document.getElementById('complaint-description');
        const solutionDesc = document.getElementById('solution-description');
        
        complaintDesc.addEventListener('input', () => {
            document.getElementById('complaint-chars').textContent = 
                `${complaintDesc.value.length}/100`;
            validateField(complaintDesc);
        });
        
        solutionDesc.addEventListener('input', () => {
            document.getElementById('solution-chars').textContent = 
                `${solutionDesc.value.length}/500`;
            validateField(solutionDesc);
        });
        
        // File upload
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('evidence-files');
        
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', e => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary)';
            uploadArea.style.background = 'var(--primary-light)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        });
        
        uploadArea.addEventListener('drop', e => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileUpload();
            }
        });
        
        fileInput.addEventListener('change', handleFileUpload);
        
        // Complaint checkboxes - require at least one
        document.querySelectorAll('#step-3 input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', validateComplaints);
        });
        
        // Solution radios - require one selected
        document.querySelectorAll('#step-4 input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', validateSolutions);
        });
        
        // Terms checkbox
        document.getElementById('terms').addEventListener('change', validateTerms);
        
        // Form submission
        form.addEventListener('submit', handleSubmit);
        
        // Modal actions
        document.getElementById('print-complaint').addEventListener('click', printComplaint);
        document.getElementById('new-complaint').addEventListener('click', resetForm);
        
        // Set default order date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('order-date').value = today;
        document.getElementById('order-date').max = today;
    }
    
    // Navigation Functions
    function goToNextStep(e) {
        const nextStep = parseInt(e.target.dataset.next);
        if (!validateStep(currentStep)) {
            showStepError(currentStep);
            return;
        }
        
        saveStepData(currentStep);
        showStep(nextStep);
    }
    
    function goToPrevStep(e) {
        const prevStep = parseInt(e.target.dataset.prev);
        saveStepData(currentStep);
        showStep(prevStep);
    }
    
    function showStep(stepNumber) {
        // Hide all steps
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        
        // Update progress
        currentStep = stepNumber;
        updateProgress();
        
        // Scroll to top of form
        document.getElementById(`step-${stepNumber}`).scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    function updateProgress() {
        // Update progress bar
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Update step indicators
        progressSteps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            if (stepNum < currentStep) {
                step.classList.add('completed');
                step.classList.add('active');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active');
                step.classList.remove('completed');
            }
        });
    }
    
    // Validation Functions
    function validateStep(step) {
        let isValid = true;
        
        switch(step) {
            case 1:
                isValid = validateStep1();
                break;
            case 2:
                isValid = validateStep2();
                break;
            case 3:
                isValid = validateStep3();
                break;
            case 4:
                isValid = validateStep4();
                break;
        }
        
        return isValid;
    }
    
    function validateStep1() {
        const name = document.getElementById('full-name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        
        let valid = true;
        
        if (!name.value.trim()) {
            showError('name-error', 'Full name is required');
            valid = false;
        } else {
            clearError('name-error');
        }
        
        if (!email.value.trim() || !isValidEmail(email.value)) {
            showError('email-error', 'Valid email address is required');
            valid = false;
        } else {
            clearError('email-error');
        }
        
        if (phone.value && !isValidPhone(phone.value)) {
            showError('phone-error', 'Please enter a valid phone number');
            valid = false;
        } else {
            clearError('phone-error');
        }
        
        return valid;
    }
    
    function validateStep2() {
        const orderNo = document.getElementById('order-no');
        const orderDate = document.getElementById('order-date');
        const productCode = document.getElementById('product-code');
        const quantity = document.getElementById('quantity');
        
        let valid = true;
        
        if (!orderNo.value.trim() || !/^2024\d{6}$/.test(orderNo.value)) {
            showError('order-error', 'Valid order number required (format: 2024######)');
            valid = false;
        } else {
            clearError('order-error');
        }
        
        if (!orderDate.value) {
            showError('date-error', 'Order date is required');
            valid = false;
        } else {
            clearError('date-error');
        }
        
        if (!productCode.value.trim() || !/^[A-Za-z]{2}\d{2}-[A-Za-z]\d{3}-[A-Za-z]{2}\d$/.test(productCode.value)) {
            showError('product-error', 'Valid product code required (format: XX##-X###-XX#)');
            valid = false;
        } else {
            clearError('product-error');
        }
        
        if (!quantity.value || parseInt(quantity.value) < 1) {
            showError('quantity-error', 'Quantity must be at least 1');
            valid = false;
        } else {
            clearError('quantity-error');
        }
        
        return valid;
    }
    
    function validateStep3() {
        const complaints = document.querySelectorAll('#step-3 input[type="checkbox"]:checked');
        const complaintDesc = document.getElementById('complaint-description');
        
        let valid = true;
        
        if (complaints.length === 0) {
            showError('complaint-error', 'Please select at least one complaint reason');
            valid = false;
        } else {
            clearError('complaint-error');
        }
        
        if (!complaintDesc.value.trim() || complaintDesc.value.trim().length < 20) {
            showError('complaint-desc-error', 'Please provide detailed description (minimum 20 characters)');
            valid = false;
        } else {
            clearError('complaint-desc-error');
        }
        
        return valid;
    }
    
    function validateStep4() {
        const solutions = document.querySelectorAll('#step-4 input[type="radio"]:checked');
        const terms = document.getElementById('terms');
        
        let valid = true;
        
        if (solutions.length === 0) {
            showError('solution-error', 'Please select a desired solution');
            valid = false;
        } else {
            clearError('solution-error');
        }
        
        if (!terms.checked) {
            showError('terms-error', 'You must agree to the terms and conditions');
            valid = false;
        } else {
            clearError('terms-error');
        }
        
        return valid;
    }
    
    function validateField(input) {
        const id = input.id;
        const value = input.value.trim();
        
        switch(id) {
            case 'full-name':
                if (!value) {
                    showError('name-error', 'Full name is required');
                    input.style.borderColor = 'var(--danger)';
                } else {
                    clearError('name-error');
                    input.style.borderColor = 'var(--success)';
                }
                break;
                
            case 'email':
                if (!value || !isValidEmail(value)) {
                    showError('email-error', 'Valid email address is required');
                    input.style.borderColor = 'var(--danger)';
                } else {
                    clearError('email-error');
                    input.style.borderColor = 'var(--success)';
                }
                break;
                
            case 'order-no':
                if (!value || !/^2024\d{6}$/.test(value)) {
                    showError('order-error', 'Format: 2024 followed by 6 digits');
                    input.style.borderColor = 'var(--danger)';
                } else {
                    clearError('order-error');
                    input.style.borderColor = 'var(--success)';
                }
                break;
                
            case 'product-code':
                if (!value || !/^[A-Za-z]{2}\d{2}-[A-Za-z]\d{3}-[A-Za-z]{2}\d$/.test(value)) {
                    showError('product-error', 'Format: XX##-X###-XX#');
                    input.style.borderColor = 'var(--danger)';
                } else {
                    clearError('product-error');
                    input.style.borderColor = 'var(--success)';
                }
                break;
                
            case 'complaint-description':
                if (value.length < 20) {
                    showError('complaint-desc-error', `Minimum 20 characters (${value.length}/20)`);
                    input.style.borderColor = 'var(--danger)';
                } else {
                    clearError('complaint-desc-error');
                    input.style.borderColor = 'var(--success)';
                }
                break;
        }
    }
    
    function validateComplaints() {
        const complaints = document.querySelectorAll('#step-3 input[type="checkbox"]:checked');
        const errorElement = document.getElementById('complaint-error');
        
        if (complaints.length === 0) {
            showError('complaint-error', 'Please select at least one complaint reason');
        } else {
            clearError('complaint-error');
        }
    }
    
    function validateSolutions() {
        const solutions = document.querySelectorAll('#step-4 input[type="radio"]:checked');
        const errorElement = document.getElementById('solution-error');
        
        if (solutions.length === 0) {
            showError('solution-error', 'Please select a desired solution');
        } else {
            clearError('solution-error');
        }
    }
    
    function validateTerms() {
        const terms = document.getElementById('terms');
        const errorElement = document.getElementById('terms-error');
        
        if (!terms.checked) {
            showError('terms-error', 'You must agree to the terms and conditions');
        } else {
            clearError('terms-error');
        }
    }
    
    function showStepError(step) {
        const stepElement = document.getElementById(`step-${step}`);
        stepElement.classList.add('error-shake');
        
        setTimeout(() => {
            stepElement.classList.remove('error-shake');
        }, 500);
        
        // Scroll to first error
        const firstError = stepElement.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Utility Functions
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function isValidPhone(phone) {
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
    }
    
    function showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    }
    
    function clearError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = '';
            element.style.display = 'none';
        }
    }
    
    // Data Handling
    function saveStepData(step) {
        switch(step) {
            case 1:
                formData.personal = {
                    name: document.getElementById('full-name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    customerId: document.getElementById('customer-id').value
                };
                break;
                
            case 2:
                formData.order = {
                    orderNo: document.getElementById('order-no').value,
                    orderDate: document.getElementById('order-date').value,
                    productCode: document.getElementById('product-code').value,
                    quantity: document.getElementById('quantity').value
                };
                break;
                
            case 3:
                const complaints = [];
                document.querySelectorAll('#step-3 input[type="checkbox"]:checked').forEach(cb => {
                    complaints.push(cb.value);
                });
                
                formData.complaint = {
                    reasons: complaints,
                    description: document.getElementById('complaint-description').value,
                    files: Array.from(document.getElementById('evidence-files').files).map(f => f.name)
                };
                break;
                
            case 4:
                const solution = document.querySelector('#step-4 input[type="radio"]:checked');
                const priority = document.querySelector('input[name="priority"]:checked');
                
                formData.solution = {
                    type: solution ? solution.value : '',
                    description: document.getElementById('solution-description').value,
                    priority: priority ? priority.value : 'low'
                };
                break;
        }
    }
    
    // File Upload Handling
    function handleFileUpload() {
        const fileList = document.getElementById('file-list');
        const files = document.getElementById('evidence-files').files;
        
        fileList.innerHTML = '';
        
        if (files.length === 0) {
            fileList.innerHTML = '<p class="no-files">No files selected</p>';
            return;
        }
        
        Array.from(files).forEach((file, index) => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is too large (max 5MB)`);
                return;
            }
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const icon = getFileIcon(fileExtension);
            
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas ${icon} file-icon"></i>
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button type="button" class="remove-file" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            fileList.appendChild(fileItem);
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                removeFile(index);
            });
        });
    }
    
    function removeFile(index) {
        const fileInput = document.getElementById('evidence-files');
        const files = Array.from(fileInput.files);
        files.splice(index, 1);
        
        const dataTransfer = new DataTransfer();
        files.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;
        
        handleFileUpload();
    }
    
    function getFileIcon(extension) {
        const icons = {
            'pdf': 'fa-file-pdf',
            'jpg': 'fa-file-image',
            'jpeg': 'fa-file-image',
            'png': 'fa-file-image',
            'doc': 'fa-file-word',
            'docx': 'fa-file-word',
            'txt': 'fa-file-alt'
        };
        
        return icons[extension] || 'fa-file';
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Form Submission
    function handleSubmit(e) {
        e.preventDefault();
        
        if (!validateStep(4)) {
            showStepError(4);
            return;
        }
        
        saveStepData(4);
        
        // Generate reference ID
        const refId = 'COMP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        referenceId.textContent = refId;
        
        // Create summary
        createComplaintSummary();
        
        // Show success modal
        modal.classList.add('active');
        
        // In a real app, you would send data to server here
        console.log('Form submitted:', formData);
        console.log('Reference ID:', refId);
        
        // Simulate server response delay
        setTimeout(() => {
            referenceId.textContent = refId;
        }, 1000);
    }
    
    function createComplaintSummary() {
        const summaryHTML = `
            <p><strong>Customer:</strong> ${formData.personal.name}</p>
            <p><strong>Order:</strong> ${formData.order.orderNo}</p>
            <p><strong>Product:</strong> ${formData.order.productCode}</p>
            <p><strong>Complaint:</strong> ${formData.complaint.reasons.join(', ')}</p>
            <p><strong>Solution Requested:</strong> ${formData.solution.type.replace('-', ' ')}</p>
            <p><strong>Priority:</strong> ${formData.solution.priority}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `;
        
        complaintSummary.innerHTML = summaryHTML;
    }
    
    function printComplaint() {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Complaint Confirmation - ${referenceId.textContent}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #333; }
                        .summary { border: 1px solid #ccc; padding: 20px; margin: 20px 0; }
                        .footer { margin-top: 40px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <h1>Complaint Submission Confirmation</h1>
                    <div class="summary">
                        ${complaintSummary.innerHTML}
                        <p><strong>Reference ID:</strong> ${referenceId.textContent}</p>
                    </div>
                    <div class="footer">
                        <p>This is an automatically generated confirmation.</p>
                        <p>Please keep this reference for future communication.</p>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
    
    function resetForm() {
        // Reset form
        form.reset();
        
        // Reset form data
        formData = {
            personal: {},
            order: {},
            complaint: {},
            solution: {}
        };
        
        // Reset UI
        document.getElementById('complaint-chars').textContent = '0/100';
        document.getElementById('solution-chars').textContent = '0/500';
        document.getElementById('file-list').innerHTML = '';
        
        // Set default order date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('order-date').value = today;
        
        // Hide modal
        modal.classList.remove('active');
        
        // Go back to step 1
        showStep(1);
        
        // Clear all errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        // Reset input borders
        document.querySelectorAll('input, textarea, select').forEach(input => {
            input.style.borderColor = '';
        });
    }
    
    // Add CSS for error shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .error-shake {
            animation: shake 0.5s ease;
            border-color: var(--danger) !important;
        }
    `;
    document.head.appendChild(style);
});