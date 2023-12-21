import { API_ALL_LISTINGS, errorMessageElement } from '../const/constant.mjs';
import { createListingHTML } from '../auctions/listings.mjs';

export async function handleSearch(event) {
    event.preventDefault();

    const searchInput = document.getElementById('searchInput').value.trim();

    try {
        const listings = await searchListings(searchInput);

        if (listings.length === 0) {
            alert('No results found.');
        } else {
            createListingHTML(listings);
        }
    } catch (error) {
        console.error('Error in search:', error.message);
        errorMessageElement.textContent = 'Search failed. Please try again.';
        errorMessageElement.classList.add('my-5');
    }
}

async function searchListings(query) {
    try {
        const timestamp = new Date().getTime();
        const searchTerm = encodeURIComponent(query);
        const url = `${API_ALL_LISTINGS}?_bids=true&_timestamp=${timestamp}&sort=created&_tag=${searchTerm}&title=${searchTerm}_&active=true`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch search results. Status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching search results:', error.message);
        throw error;
    }
}
