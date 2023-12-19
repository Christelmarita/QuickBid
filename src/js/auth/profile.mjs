import { handleAuctionFormSubmit } from '../utilities/create-auction.mjs';

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
