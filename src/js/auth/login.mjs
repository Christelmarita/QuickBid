import {
    API_LOGIN_URL,
    errorMessageElement,
} from '../const/constant.mjs';

import { updateBidFunctionality } from '../const/constant.mjs';

export async function loginUser(username, password) {
    try {
        const response = await fetch(API_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: username,
                password: password,
            }),
        });

        if (!response.ok) {
            throw new Error(`Login failed! Status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);

        checkAndHideForms();

    } catch (error) {
        console.error('Error:', error);
        errorMessageElement.textContent = 'Login failed. Please try again.';
    }
}

function checkAndHideForms() {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        hideLoginRegisterForms();
        showLogoutButton();
        updateBidFunctionality(true);
    }
}

function showLogoutButton() {
    const loggedInContent = document.getElementById('loggedInContent');
    if (loggedInContent) {
        loggedInContent.style.display = 'block';
    }
}


document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    loginUser(username, password);
});


function hideLoginRegisterForms() {
    const loginRegisterContainer = document.getElementById('loginRegisterContainer');
    if (loginRegisterContainer) {
        loginRegisterContainer.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    checkAndHideForms();
});
