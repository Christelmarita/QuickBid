import {
    API_LOGIN_URL,
    errorMessageElement,
  } from '../const/constant.mjs';
  
  document.addEventListener('DOMContentLoaded', function () {
    async function loginUser(username, password) {
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
  
        enableBidFunctionality();
  
      } catch (error) {
        console.error('Error:', error);
        errorMessageElement.textContent = 'Login failed. Please try again.';
      }
    }
  
    function enableBidFunctionality() {
      console.log('Enabling bid functionality...');
      const bidAmountInput = document.getElementById('bidAmount');
      const placeBidBtn = document.getElementById('placeBidBtn');
  
      bidAmountInput.removeAttribute('disabled');
      placeBidBtn.removeAttribute('disabled');
    }
  
    document.getElementById('loginForm').addEventListener('submit', function (event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      loginUser(username, password);
    });
  });
  