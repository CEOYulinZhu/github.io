function showThankYou() {

    document.getElementById('donate-button').disabled = true;
    setTimeout(function () {
        document.getElementById('thank-you-message').style.display = 'block';
    }, 1000);
}