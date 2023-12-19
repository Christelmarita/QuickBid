import {
    API_ALL_LISTINGS,
    errorMessageElement,
} from '../const/constant.mjs';

import { placeBid, updateBidFunctionality } from '../utilities/bids.mjs';

async function displayListingDetails(listingId) {
    try {
        const listing = await getListingById(listingId);

        const titleElement = document.getElementById('listingTitle');
        const authorElement = document.getElementById('listingAuthor');
        const imageElement = document.getElementById('listingImage');
        const descriptionElement = document.getElementById('listingDescription');
        const bidHistoryElement = document.getElementById('bidHistory');
        const galleryContainer = document.getElementById('imageGallery');

        titleElement.textContent = listing.title;
        authorElement.textContent = 'Seller: ' + listing.seller.name;


        if (listing.media && listing.media.length > 0) {
            imageElement.src = listing.media[0];
            imageElement.alt = listing.title;
        } else {
            imageElement.src = '../../../images/placeholder.png';
            imageElement.alt = 'Placeholder Image';
        }

        if (listing.media && listing.media.length > 1) {
            listing.media.slice(1).forEach((imageSrc, index) => {
                const galleryImage = document.createElement('img');
                galleryImage.src = imageSrc;
                galleryImage.alt = `Gallery Image ${index + 1}`;
                galleryImage.classList.add('img-thumbnail', 'img-fluid', 'col-4');
            
                galleryContainer.appendChild(galleryImage);
            
                galleryImage.setAttribute('data-bs-toggle', 'modal');
                galleryImage.setAttribute('data-bs-target', '#imageModal');
            
                galleryImage.addEventListener('click', () => {
                    openModal(imageSrc);
                });
            });
        }

        descriptionElement.textContent = listing.description || 'No description available';

        const bidHistory = bidHistoryElement;
        bidHistory.innerHTML = '';

        if (listing.bids && listing.bids.length > 0) {
            listing.bids.forEach(bid => {
                const li = document.createElement('li');
                li.textContent = `${bid.amount} credits by ${bid.bidderName}`;
                bidHistory.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No bids yet';
            bidHistory.appendChild(li);
        }

        

        updateBidFunctionality(localStorage.getItem('accessToken') !== null);

        const bidFormContainer = document.getElementById('bidFormContainer');
        bidFormContainer.innerHTML = ''; 

        if (localStorage.getItem('accessToken') !== null) {
            const bidForm = document.createElement('form');
            bidForm.classList.add('row', 'g-2', 'bid-form');

            const bidAmountCol = document.createElement('div');
            bidAmountCol.classList.add('col-md-6');

            const bidAmountInput = document.createElement('input');
            bidAmountInput.type = 'number';
            bidAmountInput.classList.add('form-control', 'bid-amount-input');
            bidAmountInput.name = 'bidAmount';
            bidAmountInput.required = true;
            bidAmountInput.style.appearance = 'textfield';

            const bidLabel = document.createElement('label');
            bidLabel.classList.add('form-label', 'mt-4', 'h2');
            bidLabel.textContent = 'Your Bid:';

            const placeBidBtn = document.createElement('button');
            placeBidBtn.type = 'submit';
            placeBidBtn.classList.add('btn', 'btn-primary', 'place-bid-btn');
            placeBidBtn.textContent = 'Place Bid';

            bidForm.addEventListener('submit', async function (event) {
                event.preventDefault();
                const bidAmountInputValue = bidAmountInput.value.trim();
                const bidAmount = parseFloat(bidAmountInputValue);

                if (isNaN(bidAmount) || bidAmount <= 0) {
                    alert('Please enter a valid bid amount.');
                    return;
                }

                await placeBid(listing.id, bidAmount);
                await displayListingDetails(listingId);
            });

            bidAmountCol.appendChild(bidLabel);
            bidAmountCol.appendChild(bidAmountInput);
            bidForm.appendChild(bidAmountCol);
            bidForm.appendChild(placeBidBtn);

            bidFormContainer.appendChild(bidForm);
        }

    } catch (error) {
        console.error('Error displaying listing details:', error.message);
        errorMessageElement.textContent = 'Displaying listing details failed. Please try again.';
    }
}


function openModal(imageSrc) {
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;

    setTimeout(() => {
        try {
            const modalElement = document.getElementById('imageModal');
            const imageModal = new bootstrap.Modal(modalElement);
            imageModal.show();
        } catch (error) {
            console.error('Error during modal initialization:', error);
        }
    }, 100);
}


export async function getListingById(listingId) {
    try {
        const url = `${API_ALL_LISTINGS}/${listingId}?_seller=true&_bids=true`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch listing details');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching listing details:', error.message);
        errorMessageElement.textContent = 'Fetching listing details failed. Please try again.';
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const listingId = urlParams.get('id');

        if (listingId) {
            await displayListingDetails(listingId);
        } else {
            console.error('Listing ID is missing in the URL parameters.');
            errorMessageElement.textContent = 'Listing ID is missing. Please try again.';
        }

    } catch (error) {
        console.error('Error in listing page initialization:', error.message);
    }
});



