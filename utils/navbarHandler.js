
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
});

function updateNavigation() {
   
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
   
    if (currentUser) {
      
        updateLandingPageNav(currentUser);
        updateStandardNav(currentUser);
    }
}


function updateLandingPageNav(user) {
    // Find the signup button in the navigation
    const signupButton = document.querySelector('.navigation .button .sign-up');
    if (signupButton) {
        updateProfileLink(signupButton, user);
    }

    // Also update any "Start Reading" buttons if they exist
    const startReadingButtons = document.querySelectorAll('.start-reading a, button.primary');
    startReadingButtons.forEach(button => {
        if (button.tagName === 'A') {
            button.textContent = 'My Books';
            button.href = user.isAdmin 
                ? '../AdminPanel/AdminPanel.html' 
                : '../UserProfile/UserProfile.html';
        } else if (button.tagName === 'BUTTON') {
            button.textContent = 'My Books';
            button.addEventListener('click', function() {
                window.location.href = user.isAdmin 
                    ? '../AdminPanel/AdminPanel.html' 
                    : '../UserProfile/UserProfile.html';
            });
        }
    });

    // Update CTA button section if it exists
    const ctaButtons = document.querySelector('.cta-buttons');
    if (ctaButtons) {
        ctaButtons.innerHTML = `
            <a href="${user.isAdmin ? '../AdminPanel/AdminPanel.html' : '../UserProfile/UserProfile.html'}">
                <button class="secondary">My Profile</button>
            </a>
        `;
    }
}


function updateStandardNav(user) {
    // For other pages that have different navigation structure
    const navLinks = document.querySelectorAll('header nav ul');
    
    navLinks.forEach(nav => {
        // Check if there's already a profile link
        const existingProfileLink = Array.from(nav.querySelectorAll('li a')).find(
            link => link.textContent.includes('Sign Up') || 
                   link.textContent.includes('Log In') ||
                   link.textContent.includes('Profile')
        );
        
        // If there's a sign up or login link, replace it
        if (existingProfileLink) {
            const listItem = existingProfileLink.closest('li');
            updateProfileLink(listItem, user);
        } else {
            // If no existing link is found, add a new profile link
            const profileLi = document.createElement('li');
            profileLi.className = 'profile-link';
            
            const profileLink = document.createElement('a');
            profileLink.href = user.isAdmin 
                ? '../../AdminPanel/AdminPanel.html' 
                : '../../UserProfile/UserProfile.html';
                
            profileLink.className = 'profile-button';
            profileLink.textContent = user.isAdmin ? 'Admin Panel' : 'My Profile';
            
            profileLi.appendChild(profileLink);
            nav.appendChild(profileLi);
        }
    });
}


function updateProfileLink(element, user) {
    // Determine current page level (for proper relative paths)
    const pathPrefix = window.location.pathname.includes('/Landing Page/') ? '../' : '../../';
    
    if (element.tagName === 'A') {
        element.textContent = user.isAdmin ? 'Admin Panel' : 'My Profile';
        element.href = user.isAdmin 
            ? `${pathPrefix}AdminPanel/AdminPanel.html` 
            : `${pathPrefix}UserProfile/UserProfile.html`;
        element.className = 'profile-button';
    } else {
        // For div or li elements that contain an a tag
        const link = element.querySelector('a') || document.createElement('a');
        link.textContent = user.isAdmin ? 'Admin Panel' : 'My Profile';
        link.href = user.isAdmin 
            ? `${pathPrefix}AdminPanel/AdminPanel.html` 
            : `${pathPrefix}UserProfile/UserProfile.html`;
        link.className = 'profile-button';
        
        if (!link.parentElement) {
            element.innerHTML = '';
            element.appendChild(link);
        }
    }
    
    // Add user initial or icon to the button
    if (user.firstName) {
        const userInitial = document.createElement('span');
        userInitial.className = 'user-initial';
        userInitial.textContent = user.firstName.charAt(0).toUpperCase();
        
        if (element.querySelector('.user-initial')) {
            element.querySelector('.user-initial').remove();
        }
        
        if (element.tagName === 'A') {
            element.prepend(userInitial);
        } else {
            link.prepend(userInitial);
        }
    }
}