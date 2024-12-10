async function handleLogout() {
    try {
        const response = await fetch('/auth/logout', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            window.location.href = '/';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
}