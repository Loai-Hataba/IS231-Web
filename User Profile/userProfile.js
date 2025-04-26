document.getElementById('signout-btn').addEventListener('click', () => {

    var user = localStorage.getItem('user');
    if(user) {
        localStorage.removeItem('user');
        alert('You have been signed out successfully!');
        window.location.href = 'login.html';
    }
});