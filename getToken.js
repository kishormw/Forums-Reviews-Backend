const axios = require('axios');
let tokenData = null;

async function getToken() {
    if (tokenData) {
        const tokenPayload = JSON.parse(Buffer.from(tokenData.split('.')[1], 'base64').toString());
        if (tokenPayload.exp * 1000 > Date.now()) {
            // Token is still valid
            return [tokenData, false];
        }
    }

    // Token is not valid or doesn't exist, create a new one
    tokenData = await login();
    if (!tokenData) return false;
    return [tokenData, true];
}

async function login() {
    try {
        const options = {
            method: 'POST',
            url: 'https://idp.app-framework.meltwater.io/login',
            headers: {'Content-Type': 'application/json'},
            data: {email: process.env.EMAIL, password: process.env.PASSWORD, rememberMe: true}
        };

        const result = await axios.request(options);
        if (!result.data.success) return false;
        return result.data.token;
    } catch (e) {
        console.log("Failed to generate token", e);
        return false;
    }
}

exports.getToken = getToken;
