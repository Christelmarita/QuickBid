import {
    API_ALL_LISTINGS,
} from '../const/constant.mjs';

export function getLocalUserProfile() {
    const userName = localStorage.getItem('userName');
    const userCredits = localStorage.getItem('userCredit');
    const avatarImg = document.querySelector('.profile-avatar');

    if (avatarImg) {
        const avatarSrc = localStorage.getItem('userAvatar');
        avatarImg.src = avatarSrc || '../../../images/placeholder.png';
        avatarImg.alt = 'User Avatar';
    }

    return {
        name: userName || 'N/A',
        credits: userCredits || 0,
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const userNameElement = document.getElementById('userName');
    const userCreditsElement = document.getElementById('userCredits');
    const updateAvatarBtn = document.getElementById('updateAvatarBtn');
    const auctionForm = document.getElementById('auctionForm');

    try {
        const userProfile = getLocalUserProfile();

        if (userNameElement && userCreditsElement) {
            userNameElement.textContent = userProfile.name;
            userCreditsElement.textContent = `${userProfile.credits} Credits`;
        }

    } catch (error) {
        console.error('Profile fetch error:', error);
    }

    if (updateAvatarBtn) {
        updateAvatarBtn.addEventListener('click', updateAvatar);
    }

    if (auctionForm) {
        auctionForm.addEventListener('submit', handleAuctionFormSubmit);
    }

    function updateAvatar() {
        const newAvatarUrl = document.getElementById('newAvatarUrl').value;
        const username = localStorage.getItem('userName');
        const accessToken = localStorage.getItem('accessToken');
        const url = `https://api.noroff.dev/api/v1/auction/profiles/${encodeURIComponent(username)}/media`;

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

    async function handleAuctionFormSubmit(event) {
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

    async function createAuction(data) {
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
