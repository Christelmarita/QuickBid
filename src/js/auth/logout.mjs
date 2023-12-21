import { updateBidFunctionality } from '../utilities/bids.mjs';

export function logout() {
    try {
        localStorage.removeItem('accessToken');
        hideLogoutButton();
        showLoginRegisterForms();
        updateBidFunctionality(false);

        const headerContentDiv = document.querySelector('.bg-dark.header-content');
        if (headerContentDiv) {
            headerContentDiv.style.display = 'none';
        }

    } catch (error) {
        console.error('Error during logout:', error);
    }
}

function hideLogoutButton() {
    const loggedInContent = document.getElementById('loggedInContent');
    const loggedInProfile = document.getElementById('loggedInProfile');
    if (loggedInContent) {
        loggedInContent.style.display = 'none';
    }
    if (loggedInProfile) {
        loggedInProfile.style.display = 'none';
    }
}

function showLoginRegisterForms() {
    const loginRegisterContainer = document.getElementById('loginRegisterContainer');
    if (loginRegisterContainer) {
        loginRegisterContainer.style.display = 'block';
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