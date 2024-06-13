const fs = require('fs').promises;

async function updateToken(newToken) {
    try {
        await fs.writeFile("token.json", JSON.stringify({ token: newToken }));
        console.log({ Message: "Token updated" });
    } catch (err) {
        console.error("Error in updating token file", err);
    }
}

exports.updateToken = updateToken;
