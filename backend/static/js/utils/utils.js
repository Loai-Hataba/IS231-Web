function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function checkAuth() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = '/Sign up & Log in & About Us/Forms/login.html';
        return false;
    }
    return true;
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = '/Sign up & Log in & About Us/Forms/login.html';
}