import { API_ALL_LISTINGS, API_PROFILE_URL, errorMessageElement } from '../const/constant.mjs';
import { handleAuctionFormSubmit } from '../utilities/create-auction.mjs'


async function deleteAuction(auctionId) {
    const accessToken = localStorage.getItem('accessToken');
    const url = `${API_ALL_LISTINGS}/${auctionId}`;

    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete auction');
    }
}

export function getLocalUserProfile() {
    try {
        const userName = localStorage.getItem('userName');
        const userCredits = localStorage.getItem('userCredit');
        const avatarImg = document.querySelector('.profile-avatar');
        const accessToken = localStorage.getItem('accessToken');

        if (avatarImg) {
            const avatarSrc = localStorage.getItem('userAvatar');
            avatarImg.src = avatarSrc || '../../../images/placeholder.png';
            avatarImg.alt = 'User Avatar';
        }

        return {
            name: userName || 'N/A',
            credits: userCredits || 0,
            accessToken: accessToken,
        };
    } catch (error) {
        errorMessageElement.textContent = 'Displaying profile failed. Please try again.';
        errorMessageElement.classList.add('mt-5');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const userNameElement = document.getElementById('userName');
    const userCreditsElement = document.getElementById('userCredits');
    const updateAvatarBtn = document.getElementById('updateAvatarBtn');
    const createdTab = document.getElementById('created');
    const auctionForm = document.getElementById('auctionForm');

    try {
        const userProfile = getLocalUserProfile();

        if (userNameElement && userCreditsElement) {
            userNameElement.textContent = userProfile.name;
            userCreditsElement.textContent = `${userProfile.credits} Credits`;
        }

        if (updateAvatarBtn) {
            updateAvatarBtn.addEventListener('click', updateAvatar);
        }

        fetchUserListings(userProfile.name, userProfile.accessToken, 'created').then((createdAuctions) => {
            displayAuctions(createdTab, createdAuctions, true);
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
    }

    if (auctionForm) {
        auctionForm.addEventListener('submit', handleAuctionFormSubmit);
    }

    function fetchUserListings(userName, accessToken, type) {
        const apiUrl = `${API_PROFILE_URL}${encodeURIComponent(userName)}/listings?type=${type}`;

        return fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch listings');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
                return [];
            });
    }

    function displayAuctions(tab, auctions, isCreatedByUser) {
        const auctionList = document.createElement('div');
        auctionList.classList.add('row');
    
        auctions.forEach(auction => {
            const auctionCard = createAuctionCard(auction, isCreatedByUser);
            auctionList.appendChild(auctionCard);
        });
    
        tab.appendChild(auctionList);
    }
    
    function createAuctionCard(auction, isCreatedByUser) {
        const cardContainer = document.createElement('div');
        cardContainer.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-4', 'd-flex', 'flex-column');
        cardContainer.dataset.listingId = auction.id;
    
        const card = document.createElement('div');
        card.classList.add('card', 'card-body', 'auction-card', 'profile-card');
        
    
        const img = document.createElement('img');
        img.src = auction.media && auction.media[0] || 'placeholder.jpg';
        img.alt = 'Auction Image';
        img.classList.add('card-img-top', 'auction-img', 'product-images', 'mb-3');

        const cardBody = document.createElement('div');
        cardBody.classList.add('d-flex', 'flex-column', 'flex-grow-1');
    
        const title = document.createElement('h3');
        title.classList.add('card-title');
        title.textContent = auction.title;
    
        const endsAt = document.createElement('p');
        endsAt.classList.add('card-text', 'text-muted', 'mt-auto');
        endsAt.textContent = `Ends at: ${new Date(auction.endsAt).toLocaleString()}`;
    
        cardBody.appendChild(title);
        cardBody.appendChild(endsAt);
    
        if (isCreatedByUser) {
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'mt-2', 'ms-auto');
            deleteBtn.textContent = 'Delete Auction';
    
            deleteBtn.addEventListener('click', async function () {
                try {
                    await deleteAuction(auction.id);
                    alert('Auction deleted successfully!');
                    cardContainer.remove();
                } catch (error) {
                    console.error('Error deleting auction:', error.message);
                    alert('Error deleting auction. Please try again.');
                }
            });
    
            cardBody.appendChild(deleteBtn);
        }
    
        card.appendChild(img);
        card.appendChild(cardBody);
    
        cardContainer.appendChild(card);
    
        return cardContainer;
    }

    function updateAvatar() {
        const newAvatarUrl = document.getElementById('newAvatarUrl').value;
        const username = localStorage.getItem('userName');
        const accessToken = localStorage.getItem('accessToken');
        const url = `${API_PROFILE_URL}${encodeURIComponent(username)}/media`;

        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ avatar: newAvatarUrl }),
        })
        .then(handleResponse)
        .then(data => {
            alert("Avatar updated successfully!");
            const avatarImg = document.querySelector('.profile-avatar');
            avatarImg.src = newAvatarUrl;
            localStorage.setItem('userAvatar', newAvatarUrl);
        })
        .catch(handleError);
    }

    function handleResponse(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }

    function handleError(error) {
        console.error('Error:', error);
        alert("Error: " + error.message);
    }
});
