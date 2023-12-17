import { API_REGISTER_URL } from "../const/constant.mjs";

export async function registerUser(url, userData) {
    try {
        const postData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        };
        const response = await fetch(url, postData);

        if (response.ok) {
            showRegistrationSuccess();
        } else {
            const errorData = await response.json();
            alert('Failed to register user');
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function showRegistrationSuccess() {
    const registrationFormContainer = document.getElementById('registrationFormContainer');
    const registrationSuccessContainer = document.getElementById('registrationSuccessContainer');

    if (registrationFormContainer && registrationSuccessContainer) {
        registrationFormContainer.style.display = 'none';

        const successMessage = document.createElement('p');
        successMessage.textContent = 'Registration successful!';

        const loginLink = document.createElement('button');
        loginLink.textContent = 'Go to Login Page';
        loginLink.className = 'btn btn-primary';
        loginLink.addEventListener('click', function () {
            window.location.href = '/index.html';
        });

        registrationSuccessContainer.appendChild(successMessage);
        registrationSuccessContainer.appendChild(loginLink);
        registrationSuccessContainer.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const userToRegister = {
            name,
            email,
            password,
        };

        await registerUser(API_REGISTER_URL, userToRegister);
    });
});
