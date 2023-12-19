import {
    API_ALL_LISTINGS,
} from '../const/constant.mjs';

export async function placeBid(listingId, bidAmount) {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const url = `${API_ALL_LISTINGS}/${listingId}/bids`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                amount: bidAmount,
            }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to place bid: ${errorMessage}`);
        }

        alert('Bid placed successfully!');
        location.reload();
    } catch (error) {
        console.error('Error placing bid:', error.message);
        alert('Failed to place bid. Please try again.');
    }
}

export function calculateHighestBid(listing) {
    if (listing.bids && listing.bids.length > 0) {
        return listing.bids[0];
    } else {
        return null;
    }
}

export function updateBidFunctionality(isLoggedIn) {

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
