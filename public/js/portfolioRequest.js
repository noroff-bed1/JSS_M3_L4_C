async function sendDelete(url, filename) {
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.adminToken}`
            },
            body: JSON.stringify({
                name: filename
            })
        });

        const resData = 'resource deleted...';
        location.reload()
        return resData;
    } catch (error) {
        console.log(error)
    }
}
