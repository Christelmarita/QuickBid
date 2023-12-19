import {
    API_ALL_LISTINGS,
    errorMessageElement,
} from '../const/constant.mjs';

import { placeBid, calculateHighestBid, updateBidFunctionality } from '../utilities/bids.mjs';

export async function getListings() {
    try {
        const timestamp = new Date().getTime();
        const url = `${API_ALL_LISTINGS}?_bids=true&_timestamp=${timestamp}&sort=created`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch auction listings');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching auction listings:', error.message);
        errorMessageElement.textContent = 'Fetching failed. Please try again.';
        throw error;
    }
}

export async function createListingHTML(listingContainer) {
    const container = document.querySelector('.card-row');
    const isLoggedIn = localStorage.getItem('accessToken') !== null;

    listingContainer.forEach(listing => {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('col-md-4', 'mb-4', 'card-container');
        cardContainer.dataset.listingId = listing.id;

        const card = document.createElement('div');
        card.classList.add('card');

        const image = document.createElement('img');
        if (listing.media && listing.media.length > 0) {
            image.src = listing.media[0];
        } else {
            image.src = '../../../images/placeholder.png';
        }
        image.alt = listing.title;
        image.classList.add('card-img-top', 'h-100');
        image.dataset.listingId = listing.id;

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        
        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = listing.title;
        
        const bidText = document.createElement('p');
        bidText.classList.add('card-text');
        
        const highestBid = calculateHighestBid(listing);
        const strongElement = document.createElement('strong');
        
        if (highestBid) {
            const bidderName = highestBid.bidderName;
            bidText.textContent = 'Current Highest Bid: ';
            strongElement.textContent = `${highestBid.amount} credits by ${bidderName}`;
        } else {
            strongElement.textContent = 'No bids yet';
        }
        
        const bidForm = document.createElement('form');
        bidForm.classList.add('row', 'g-2', 'bid-form');
        
        const bidAmountCol = document.createElement('div');
        bidAmountCol.classList.add('col-md-6');
        
        const bidAmountInput = document.createElement('input');
        bidAmountInput.type = 'number';
        bidAmountInput.classList.add('form-control', 'bid-amount-input');
        bidAmountInput.name = 'bidAmount';
        bidAmountInput.required = true;
        bidAmountInput.disabled = !isLoggedIn;
        
        const bidLabel = document.createElement('label');
        bidLabel.classList.add('form-label');
        bidLabel.textContent = 'Your Bid:';
        
        const placeBidBtn = document.createElement('button');
        placeBidBtn.type = 'submit';
        placeBidBtn.classList.add('btn', 'btn-primary', 'place-bid-btn');
        placeBidBtn.disabled = !isLoggedIn;
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
        });
        
        cardBody.append(title, bidText, bidForm);
        bidText.appendChild(strongElement);
        
        bidAmountCol.appendChild(bidLabel);
        bidAmountCol.appendChild(bidAmountInput);
        bidForm.appendChild(bidAmountCol);
        bidForm.appendChild(placeBidBtn);

        card.append(image, cardBody);
        cardContainer.appendChild(card);
        container.appendChild(cardContainer);
    });
}

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const listings = await getListings();
        console.log('Fetched listings:', listings);

        createListingHTML(listings);

        const isLoggedIn = localStorage.getItem('accessToken') !== null;
        console.log('Is logged in:', isLoggedIn);
        updateBidFunctionality(isLoggedIn);

        const linkContainers = document.querySelectorAll('.card-img-top');
        linkContainers.forEach(linkContainer => {
            linkContainer.style.cursor = 'pointer';
            linkContainer.addEventListener('click', function () {
                const listingId = linkContainer.dataset.listingId;
                if (listingId !== undefined) {
                    window.location.href = `../../../listing.html?id=${listingId}`;
                }
            });
        });

    } catch (error) {
        console.error('Error in initialization:', error.message);
    }
});