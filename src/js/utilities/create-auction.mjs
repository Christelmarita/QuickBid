import { API_ALL_LISTINGS } from '../const/constant.mjs';
import { getListings, createListingHTML } from '../auctions/listings.mjs';

export async function handleAuctionFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('auctionTitle').value;
    const description = document.getElementById('auctionDescription').value;
    const tags = document.getElementById('auctionTags').value.split(',').map(tag => tag.trim());
    const media = document.getElementById('auctionMedia').value.split(',').map(url => url.trim());
    const endsAt = document.getElementById('auctionEndsAt').value;

    const requestData = {
        title: title,
        description: description,
        tags: tags,
        media: media,
        endsAt: new Date(endsAt).toISOString(),
    };

    try {
        document.getElementById('createAuctionBtn').disabled = true;

        await createAuction(requestData);

        const updatedListings = await getListings();
        createListingHTML(updatedListings);

        alert('Auction created successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating auction. Please try again.');
    } finally {
        document.getElementById('createAuctionBtn').disabled = false;

        const createAuctionModal = document.getElementById('createAuctionModal');
        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];

        createAuctionModal.classList.remove('show');
        modalBackdrop.remove();
    }
}

export async function createAuction(data) {
    const accessToken = localStorage.getItem('accessToken');
    const url = `${API_ALL_LISTINGS}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create auction');
    }

    return response.json();
}
