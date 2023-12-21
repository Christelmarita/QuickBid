import { API_LOGIN_URL } from '../const/constant.mjs';

import { updateBidFunctionality } from '../utilities/bids.mjs';


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
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userCredit', data.credits.toString());
        if (data.avatar) {
            localStorage.setItem('userAvatar', data.avatar);
        }

        checkAndHideForms();
        updateBidFunctionality(true);

    } catch (error) {
        console.error('Error:', error);
        alert('Login failed. Please try again');
    }
}

function checkAndHideForms() {
    const accessToken = localStorage.getItem('accessToken');
    
    const userNameElement = document.getElementById('userName');
    const userCreditsElement = document.getElementById('userCredits');
    const headerContentDiv = document.querySelector('.bg-dark.header-content');

    if (accessToken && userNameElement && userCreditsElement) {
        const userName = localStorage.getItem('userName');
        const userCredits = localStorage.getItem('userCredit');

        if (userName && userCredits) {
            userNameElement.textContent = userName;
            userCreditsElement.textContent = `${userCredits} Credits`;

            updateBidFunctionality();
            hideLoginRegisterForms();
            showLogoutButton();


            if (headerContentDiv) {
                headerContentDiv.style.display = 'block';
            }
        }
    } else {
        if (headerContentDiv) {
            headerContentDiv.style.display = 'none';
        }
    }
}

function showLogoutButton() {
    const loggedInContent = document.getElementById('loggedInContent');
    const loggedInProfile = document.getElementById('loggedInProfile')
    if (loggedInContent) {
        loggedInContent.style.display = 'block';
    }
    if (loggedInProfile) {
        loggedInProfile.style.display = 'block';
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

function updateHeader() {
    const accessToken = localStorage.getItem('accessToken');
    const userNameElement = document.getElementById('userName');
    const userCreditsElement = document.getElementById('userCredits');

    if (accessToken && userNameElement && userCreditsElement) {
        const userName = localStorage.getItem('userName');
        const userCredits = localStorage.getItem('userCredit');

        if (userName && userCredits) {
            userNameElement.textContent = userName;
            userCreditsElement.textContent = `${userCredits} Credits`;
        }
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    checkAndHideForms();
    updateHeader();
});
