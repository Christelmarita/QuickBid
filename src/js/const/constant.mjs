export const API_BASE_URL = 'https://api.noroff.dev/api/v1';
export const API_REGISTER_URL = `${API_BASE_URL}/auction/auth/register`;
export const API_LOGIN_URL = `${API_BASE_URL}/auction/auth/login`;
export const API_ALL_LISTINGS = `${API_BASE_URL}/auction/listings`;
export const API_PROFILE_URL = `${API_BASE_URL}/auction/profile/`;
export const queryString = document.location.search;
export const params = new URLSearchParams(queryString);
export const id = params.get("id");
export const errorMessageElement = document.getElementById('error-message');

export function updateBidFunctionality(isLoggedIn) {
    console.log(`Bid functionality enabled: ${isLoggedIn}`);

    const bidForms = document.querySelectorAll('.card-container form.row.g-2');
    
    bidForms.forEach(bidForm => {
        const bidAmountInput = bidForm.querySelector('[name="bidAmount"]');
        const placeBidBtn = bidForm.querySelector('[type="submit"]');
        
        if (bidAmountInput && placeBidBtn) {
            bidAmountInput.disabled = !isLoggedIn;
            placeBidBtn.disabled = !isLoggedIn;
        }
    });
}
