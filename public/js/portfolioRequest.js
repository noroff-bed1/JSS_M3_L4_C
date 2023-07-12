async function sendDelete(url, filename) {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            name: filename
        })
    });

    const resData = 'resource deleted...';
    location.reload()
    return resData;
}
