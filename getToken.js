const axios = require('axios');
const fs = require('fs');
const { updateToken } = require('./updateToken');

async function getToken() {
    let token;
    try {
        token = require('./token.json');
        if (JSON.stringify(token).length < 20) {
            token = false;
        } else {
            const tokenPayload = JSON.parse(Buffer.from(token.token.split('.')[1], 'base64').toString());
            if (tokenPayload.exp * 1000 > Date.now()) {
                //console.log("Token reused");
                return [token.token, false];
            } else {
                token = false;
            }
        }
    } catch (e) {
        token = false;
    }

    if (!token) {
        //console.log("Creating new token");
        token = await login();
        if (!token) return false;
        return [token, true];
    }
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
        updateToken(result.data.token)
        return result.data.token;
    } catch (e) {
        console.log("Failed to generate token");
        return false;
    }
}

exports.getToken = getToken;
