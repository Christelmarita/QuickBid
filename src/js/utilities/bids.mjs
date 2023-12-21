import { API_ALL_LISTINGS } from '../const/constant.mjs';
import { getListings, createListingHTML } from '../auctions/listings.mjs';

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
            body: JSON.stringify({ amount: bidAmount }),
        });

        if (!response.ok) {
            throw new Error(`Failed to place bid: ${await response.text()}`);
        }

        alert('Bid placed successfully!');
        location.reload();
    } catch (error) {
        console.error('Error placing bid:', error.message);
        alert('Failed to place bid. Please try again.');
    }

    try {
        const updatedListings = await getListings();
        createListingHTML(updatedListings);
    } catch (error) {
        console.error('Error updating listings:', error.message);
    }
}

export function calculateHighestBid(listing) {
    const sortedBids = (listing.bids || []).slice().sort((a, b) => b.amount - a.amount);
    return sortedBids[0] || null;
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
