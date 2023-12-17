import { updateBidFunctionality } from '../const/constant.mjs';

export function logout() {
    try {
        localStorage.removeItem('accessToken');
        hideLogoutButton();
        showLoginRegisterForms();
        updateBidFunctionality(false);
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

function hideLogoutButton() {
    const loggedInContent = document.getElementById('loggedInContent');
    if (loggedInContent) {
        loggedInContent.style.display = 'none';
    }
}

function showLoginRegisterForms() {
    const loginRegisterContainer = document.getElementById('loginRegisterContainer');
    if (loginRegisterContainer) {
        loginRegisterContainer.style.display = 'block';
    }
}

function disableBidFunctionality() {
    console.log('Disabling bid functionality...');
    const bidAmountInput = document.getElementById('bidAmount');
    const placeBidBtn = document.getElementById('placeBidBtn');

    if (bidAmountInput && placeBidBtn) {
        bidAmountInput.setAttribute('disabled', 'true');
        placeBidBtn.setAttribute('disabled', 'true');
    } else {
        console.error('Bid functionality elements not found.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logoutBtn');

    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            logout();
        });
    }
});
