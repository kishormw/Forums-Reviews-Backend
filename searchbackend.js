const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request');
const axios = require("axios");
const dotenv = require("dotenv").config();
const { getToken } = require("./getToken");
const { updateToken } = require("./updateToken");

let PORT = process.env.ListenPort;

const currentDate = new Date();
const currentTimestamp = currentDate.getTime();

const twelveMonthsAgo = new Date();
twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
const dynamicDateStart = twelveMonthsAgo.getTime();

const dynamicDateEnd = currentTimestamp;

app.use(express.json());

//Base route
app.get('/', (req, res) => {
    res.json({message: 'I Can See You Now💀'});
});

// Your API key for Webhose.IO
const webhoseApiKey = "2e7eabff-a926-4e97-b323-10cf483b542a";

// Function to calculate timestamp for 30 days ago in epoch time
function getThirtyDaysAgoTimestamp() {
    return new Date().getTime() - (30 * 24 * 60 * 60 * 1000);
}

//Cors for allow origins.
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
}));

app.listen(PORT, () => {
    console.log('started server');
    console.log('Server is running on port ', PORT);
});

//Token function and the gettokens and updatetoken files are created already.
async function fetchToken() {
    let token;
    let isNewToken;

    try {
        [token, isNewToken] = await getToken();
        if (isNewToken) {
            await updateToken(token);
        }
    } catch (error) {
        console.error('Error fetching token:', error);
        return null;
    }

    return token;
}


// Forum Endpoints.
app.post('/forumscheck', async (req, res) => {
    const forumurl = req.body.Query;
    console.log('Forum URL ', forumurl);

    const token = await fetchToken();
    if (!token) {
        return res.status(500).send('Failed to fetch token');
    }
    getToken(forumurl);
    function getToken(forumurl) {
        const options1 = {
            method: 'POST',
            url: 'https://discovery-next-mw-apollo-production.meltwater.io/graphql',
            headers: {
                'Accept-Language': 'en-US,en;q=0.9',
                Connection: 'keep-alive',
                Origin: 'https://app.meltwater.com',
                Referer: 'https://app.meltwater.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                accept: '*/*',
                'apollographql-client-name': 'discovery-next',
                'apollographql-client-version': '01720b04ab61ded08e94e76a669bab60486dbb09',
                Authorization: `Bearer ${token}`,
                'content-type': 'application/json',
            },
            body: {
                operationName: 'GetToken',
                variables: {
                    searchCriteria: {
                        booleanQuery: forumurl,
                        filter: {
                            type: 'CUSTOM',
                            filters: {
                                sourceType: ['social_message_boards'],
                                twitter: {
                                    likes: {},
                                    gender: [],
                                    replies: {},
                                    retweets: {},
                                    followers: {},
                                    tweetType: [],
                                    accountStatus: []
                                }
                            }
                        },
                        allKeywords: [],
                        anyKeywords: [],
                        notKeywords: [],
                        allSearches: [],
                        anySearches: [],
                        notSearches: [],
                        caseSensitive: 'no',
                        searchQueryType: 'boolean',
                        informationTypes: []
                    },
                    elsEntities: [],
                    dateStart: "2023-12-31T18:30:00.000Z",
                    dateEnd: "2024-05-17T18:29:59.999Z"
                },
                query: 'query GetToken($searchCriteria: SearchQueryInput!, $elsEntities: [KgEntityInput!], $dateStart: String, $dateEnd: String) {\n  token(\n    searchQuery: $searchCriteria\n    elsEntities: $elsEntities\n    dateStart: $dateStart\n    dateEnd: $dateEnd\n  ) {\n    token\n    __typename\n  }\n}'
            },
            json: true
        };

        const options2 = {
            method: 'POST',
            url: 'https://af.meltwater.io/data/runes',
            headers: {
                Accept: 'application/json',
                Authorization: token,
                Connection: 'keep-alive',
                'Content-Type': 'application/json',
                Origin: 'https://app.meltwater.com',
                Referer: 'https://app.meltwater.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site'
            },
            body: {
                token: '!OxZNoihHRiQGjauoTaI/ecnAsJlIQfe3tjAWeptd7ahyzpLsCkPGT4uJjLABMaTkHQT1ojVCwEX5bvSkutCXjv5YCyY61/UMnepIo/8d2KG2H5lSU2dp0ZZvvVMtsaWJR9vHVXxPKxr0w1Mz5Mt+PimV0yivCQlRZpxKYBlAIOzCniPyD0tOMI8iHJKtB74+HvHBJOXXW4EaCg3AkvQyfvzHVLxVdiiY8WecxGUOB1r+IbXJzKBep7nrwAdKxSYFH/ylxhy8aHt1lvAuYdRTcE0JUQ7qTQqXQN/M15bZZW3f9pn8++3c92qFVI7HmyR1TybDCtY0QL6P/fsgpgOTozHELKzDmEhzBi7wuQMvBWIhTQgcEBlMrdAHslBuZCWnmZd8rwpaHZnkSkvhLuJDGmFtzXEoOG2dPgfRb4Ifl7IccPPpHuK/mH2f6k8Hfx+unlRRJ+kcVZQBMn9Moh5MSi+JiNduVDF0OrmTZ2vFY8+tc4vKhirM9098OjjENDAZKEpLISA+eT6/tN3nMy+PDkci9vXhgpqMmaQXHY+gc9E'
            },
            json: true
        };

        const options3 = {
            method: 'POST',
            url: 'https://af.meltwater.io/data/search',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                Connection: 'keep-alive',
                'Content-Type': 'application/json',
                Origin: 'https://app.meltwater.com',
                Referer: 'https://app.meltwater.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site'
            },
            body: {
                runes: {
                    type: 'all',
                    allQueries: [
                        {
                            type: 'not',
                            matchQuery: { type: 'all', allQueries: [] },
                            notMatchQuery: {
                                type: 'all',
                                allQueries: [
                                    { type: 'term', field: 'metaData.source.socialOriginType', value: 'sina_weibo' },
                                    { type: 'term', field: 'metaData.discussionType', value: 'rp' }
                                ]
                            }
                        },
                        {
                            allQueries: [
                                {
                                    field: 'metaData.analyzedUrl',
                                    value: forumurl,
                                    type: 'word'
                                },
                                {
                                    anyQueries: [
                                        {
                                            allQueries: [
                                                { field: 'metaData.source.informationType', value: 'social', type: 'term' },
                                                {
                                                    anyQueries: [
                                                        { field: 'metaData.source.socialOriginType', value: 'social_blogs', type: 'term' },
                                                        {
                                                            field: 'metaData.source.socialOriginType',
                                                            value: 'social_comments',
                                                            type: 'term'
                                                        },
                                                        {
                                                            field: 'metaData.source.socialOriginType',
                                                            value: 'social_message_boards',
                                                            type: 'term'
                                                        },
                                                        {
                                                            field: 'metaData.source.socialOriginType',
                                                            value: 'social_reviews',
                                                            type: 'term'
                                                        },
                                                    ],
                                                    type: 'any'
                                                }
                                            ],
                                            type: 'all'
                                        }
                                    ],
                                    type: 'any'
                                },
                                {
                                    allQueries: [
                                        {
                                            anyQueries: [
                                                {
                                                    field: 'metaData.source.socialOriginType',
                                                    value: 'social_message_boards',
                                                    type: 'term'
                                                }
                                            ],
                                            type: 'any'
                                        }
                                    ],
                                    type: 'all'
                                }
                            ],
                            type: 'all'
                        }
                    ]
                },
                twitterApproved: false,
                dateRange: { dateStart: dynamicDateStart, dateEnd: dynamicDateEnd, granularity: 'day' },
                document: {
                    sortField: 'date',
                    sortOrder: 'DESC',
                    groupingOption: 'similar',
                    groupFrom: 0,
                    start: 0,
                    size: 25,
                    page: 0,
                    hidden: false,
                    keywords: []
                },
                entityCanonicalNames: [],
                visualizationIds: [
                    'AF-mentionsStatsTrendPredictive',
                    'AF-topStories',
                    'AF-topStoriesBubble',
                    'AF-topTerms',
                    'AF-topLocations',
                    'AF-sentiment',
                    'AF-resultListSorted',
                    'AF-filterTotal',
                    'AF-filterCountry',
                    'AF-filterInformationType',
                    'AF-filterLanguage',
                    'AF-filterMediaType',
                    'AF-filterSentiment',
                    'AF-filterSourceType',
                    'AF-mergedSourceTypes'
                ]
            },
            json: true
        };

        request(options3, function (error, response, body) {
            if (error) {
                console.error('Error in request:', error);
                return res.status(500).send('Internal Server Error');
            }

            const mentionsStats = body["AF-mentionsStatsTrendPredictive"]["compoundWidgetData"]["AF-totalMentions"]["number"];
            if (mentionsStats === 0) {
                const hasSlash = /\/+/.test(forumurl);
                if (hasSlash) {
                    console.log("No results found");
                    forumurl = forumurl.replace(/\/[^/]*$/, '');
                    if (forumurl === 'https:/*' || forumurl === 'www.' || forumurl === 'https:*') {
                        console.log("Invalid URL after truncation");
                        return res.status(400).send("Invalid URL after truncation");
                    } else {
                        console.log('Truncate', forumurl);
                        getToken(forumurl);
                    }
                } else {
                    console.log("Results not found and its here!!");
                    checkWebhose(forumurl, res); // Check with Webhose if no results found in Meltwater
                }
            } else {
                console.log("Results found");
                const documents = body['AF-resultListSorted'].documents;
                const updatedDocuments = documents.map(document => {
                    return {
                        originalUrl: document.originalUrl,
                        body: document.body,
                        date: document.date,
                        source: document.source,
                        sourceUrl: document.sourceUrl,
                        forumurl: forumurl // Add forumurl to each document
                    };
                });
                return res.json(updatedDocuments);
            }            
        });
    }
});

function checkWebhose(forumurl, res) {
    const thirtyDaysAgo = getThirtyDaysAgoTimestamp();
    const webhoseEndpoint = `https://api.webz.io/filterWebContent?token=${webhoseApiKey}&format=json&ts=${thirtyDaysAgo}&sort=crawled&q=site%3A${encodeURIComponent(forumurl)}%20AND%20site_type%3A%22Discussions%22`;

    const options = {
        method: 'GET',
        url: webhoseEndpoint,
        headers: {}
    };

    request(options, function (error, response) {
        if (error) {
            console.error('Error in Webhose request:', error);
            return res.status(500).send('Internal Server Error');
        }

        const responseData = JSON.parse(response.body);
        const totalResults = responseData.totalResults;
        const requestsLeft = response.headers['x-webhose-requests-left'];

        console.log(`Webhose - Total Results: ${totalResults}`);
        console.log(`Webhose - Requests Left: ${requestsLeft}`);

        if (totalResults > 0) {
            return res.json({
                source: 'Webhose',
                totalResults: totalResults,
                results: responseData.posts, // Or however the results are structured in the response
                webhoseUsed: true // Add a flag to indicate Webhose was used
            });
        } else {
            return res.json({
                source: 'Webhose',
                totalResults: totalResults,
                webhoseUsed: true // Add a flag to indicate Webhose was used
            });
        }
    });
}



//Reviews Endpoints.
//1. For URL Search.
app.post('/reviewsurl', async (req, res) => {
    const reviewurl = req.body.Query;
    console.log('Review URL ', reviewurl);
    const token = await fetchToken();
    if (!token) {
        return res.status(500).send('Failed to fetch token');
    }
    getToken(reviewurl);
    function getToken(reviewurl) {
        const options1 = {
            method: 'POST',
            url: 'https://discovery-next-mw-apollo-production.meltwater.io/graphql',
            headers: {
                Connection: 'keep-alive',
                Origin: 'https://app.meltwater.com',
                Referer: 'https://app.meltwater.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site',
                accept: '*/*',
                'apollographql-client-name': 'discovery-next',
                'apollographql-client-version': '7640c5c15c83b3dea37728ea8b0118ae9e23b94b',
                Authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            },
            body: '{"operationName":"GetToken","variables":{"searchCriteria":{"booleanQuery":"url:\\"https://www.flipkart.com/reviews/SWSGHCKFG6PRXGFN:106?reviewId7e865ae7-716d-4e62-a3f4-de98d9fe8178\\"","filter":{"type":"CUSTOM","filters":{"subKeyword":[],"country":[],"geoname":[],"booleans":[],"language":[],"newsReach":[],"rssSource":[],"sentiment":[],"authorList":[],"newsSource":[],"sourceType":["social_reviews"],"customCategory":[],"newsOutletTypes":[],"newsMediaFormats":[],"newsPremiumTypes":[],"broadcastSubtypes":[],"twitter":{"likes":{},"gender":[],"replies":{},"retweets":{},"followers":{},"tweetType":[],"accountStatus":[]}}},"allKeywords":[],"anyKeywords":[],"notKeywords":[],"allSearches":[],"anySearches":[],"notSearches":[],"caseSensitive":"no","searchQueryType":"boolean","informationTypes":[]},"elsEntities":[],"dateStart":"2022-12-31T18:30:00.000Z","dateEnd":"2023-12-31T18:29:59.999Z"},"query":"query GetToken($searchCriteria: SearchQueryInput\u0021, $elsEntities: [KgEntityInput\u0021], $dateStart: String, $dateEnd: String) {\\n  token(\\n    searchQuery: $searchCriteria\\n    elsEntities: $elsEntities\\n    dateStart: $dateStart\\n    dateEnd: $dateEnd\\n  ) {\\n    token\\n    __typename\\n  }\\n}"}'
        };

        const options2 = {
            method: 'POST',
            url: 'https://af.meltwater.io/data/runes',
            headers: {
                Accept: 'application/json',
                Authorization: token,
                Connection: 'keep-alive',
                'Content-Type': 'application/json',
                Origin: 'https://app.meltwater.com',
                Referer: 'https://app.meltwater.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site'
            },
            body: '{"token":"\u0021JmoP2msUFYxVTVm5oEm0Kx+YH365isXfJ6ELATdaAMpsgAMv+FRpRP9KU8Gkgafx+j2T8AI9YptScQOe7G7XGHGAo3u6ngW/xZ1uYZ7Ti/1MGE6F8ykA4gE7IewYFTv82bvX/W24G9U1UFv1lGQxA9A177VyQdVMg8sQCfrqi0BXyvD7rk4gKxzv388KkxAq4Jycm+KI3tGzedRc0LkELuevsvUNnKVPYHAml7LIQLy3n6c3hyfnWds84zZ0O0CqVRgG/MX3vnDwb63+LgqSj0ivaRSBNY2gEUrripzrShy3pYMVhj/5dhtcNWae9UpbYpZf0XeLubrsH+ybMmFSlsG+k7NxN0/nak+R75rya0Yj7W38oaANRXgmNUGAy48FuTUpK35b1r0vAOef9ipnPtRehxBPvX7n6NVGXl+kvUgrjGCcz3VbiAuVc9DRWLgU0a3whLaMmLlVXu5+atkV4SUa4ZE9J+FLPQu1OzQQen7z+jQiB+LTRUiCGs7Ljt4kc0gVXTTTU2bV/z+yDs24nQ/skWl+HI+hkk+0e7430JgHr2Bk/g0LM0zkhDxfLBoMqyW8bMawbGSyZrWMVBb2xSKvpXOCIa08oQACYAhG051y8Q6Jd5SkLBoXJj0bqPUXz3g46YH8M8QwEpXA3WD0iw'
        };

        const options3 = {
            method: 'POST',
            url: 'https://af.meltwater.io/data/search',
            headers: {
                Accept: 'application/json',
                Authorization: token,
                Connection: 'keep-alive',
                'Content-Type': 'application/json',
                Origin: 'https://app.meltwater.com',
                Referer: 'https://app.meltwater.com/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site'
            },
            body: {
                runes: {
                    type: 'all',
                    allQueries: [
                        {
                            type: 'not',
                            matchQuery: { type: 'all', allQueries: [] },
                            notMatchQuery: {
                                type: 'all',
                                allQueries: [
                                    { type: 'term', field: 'metaData.source.socialOriginType', value: 'sina_weibo' },
                                    { type: 'term', field: 'metaData.discussionType', value: 'rp' }
                                ]
                            }
                        },
                        {
                            allQueries: [
                                {
                                    field: 'metaData.url',
                                    value: reviewurl,
                                    type: 'wildcard'
                                },
                                {
                                    anyQueries: [
                                        {
                                            allQueries: [
                                                { field: 'metaData.source.informationType', value: 'social', type: 'term' },
                                                {
                                                    anyQueries: [
                                                        { field: 'metaData.source.socialOriginType', value: 'social_blogs', type: 'term' },
                                                        {
                                                            field: 'metaData.source.socialOriginType',
                                                            value: 'social_comments',
                                                            type: 'term'
                                                        },
                                                        {
                                                            field: 'metaData.source.socialOriginType',
                                                            value: 'social_message_boards',
                                                            type: 'term'
                                                        },
                                                        {
                                                            field: 'metaData.source.socialOriginType',
                                                            value: 'social_reviews',
                                                            type: 'term'
                                                        },
                                                    ],
                                                    type: 'any'
                                                }
                                            ],
                                            type: 'all'
                                        }
                                    ],
                                    type: 'any'
                                },
                                {
                                    allQueries: [
                                        {
                                            anyQueries: [
                                                {
                                                    field: 'metaData.source.socialOriginType',
                                                    value: 'social_reviews',
                                                    type: 'term'
                                                }
                                            ],
                                            type: 'any'
                                        }
                                    ],
                                    type: 'all'
                                }
                            ],
                            type: 'all'
                        }
                    ]
                },
                twitterApproved: false,
                dateRange: { dateStart: dynamicDateStart, dateEnd: dynamicDateEnd, granularity: 'day' },
                document: {
                    sortField: 'date',
                    sortOrder: 'DESC',
                    groupingOption: 'similar',
                    groupFrom: 0,
                    start: 0,
                    size: 25,
                    page: 0,
                    hidden: false,
                    keywords: []
                },
                entityCanonicalNames: [],
                visualizationIds: [
                    'AF-mentionsStatsTrendPredictive',
                    'AF-topStories',
                    'AF-topStoriesBubble',
                    'AF-topTerms',
                    'AF-topLocations',
                    'AF-sentiment',
                    'AF-resultListSorted',
                    'AF-filterTotal',
                    'AF-filterCountry',
                    'AF-filterInformationType',
                    'AF-filterLanguage',
                    'AF-filterMediaType',
                    'AF-filterSentiment',
                    'AF-filterSourceType',
                    'AF-mergedSourceTypes'
                ]
            },
            json: true
        };

        request(options3, function (error, response, body) {
            if (error) throw new Error(error);

            if (body["AF-mentionsStatsTrendPredictive"]["compoundWidgetData"]["AF-totalMentions"]["number"] === 0) {
                console.log("no results found");

                const protocolEnd = reviewurl.indexOf("://") + 3;
                const baseUrl = reviewurl.slice(0, protocolEnd);
                let remainingUrl = reviewurl.slice(protocolEnd);

                // Check if further truncation is possible
                if (remainingUrl.includes('/')) {
                    remainingUrl = remainingUrl.replace(/\/[^/]*$/, '*');
                    reviewurl = baseUrl + remainingUrl;
                    console.log('truncate', reviewurl);

                    // Recursively call getToken with the truncated URL
                    getToken(reviewurl);
                } else {
                    console.log("Results not found and no further truncation possible for-", reviewurl);
                    res.send("Results not found");
                }
            } else {
                console.log("results found for-", reviewurl);
                const documents = body['AF-resultListSorted'].documents;
                res.json(documents);
            }
        });

    }
})


// 2. For Keyword Search.
app.post('/reviewskeywords', async (req, res) => {
    const reviewurl = req.body.Query;
    const reviewwords = req.body.Words;
    console.log('Review URL:', reviewurl);
    console.log('Review words:', reviewwords)
    const token = await fetchToken();
    if (!token) {
        return res.status(500).send('Failed to fetch token');
    }
    else{
        getToken(reviewurl, reviewwords);
    }
    
    function getToken(reviewurl, reviewwords) {
        const options1 = {
            method: 'POST',
            url: 'https://discovery-next-mw-apollo-production.meltwater.io/graphql',
            headers: {

                Authorization: `Bearer ${token}`,
                'content-type': 'application/json',
                accept: '*/*',
                Referer: 'https://app.meltwater.com/',
                'apollographql-client-version': '130f2a5408dcd1a3f465d1e482b936eab9240683',
                'sec-ch-ua-platform': '"Android"'
            },
            body: '{"operationName":"GetToken","variables":{"searchCriteria":{"booleanQuery":"url:\\"https://www.flipkart.com/*\\" and productreview:\\"gray sneaker shoes for mens Sneakers For Men \\"","filter":{"type":"CUSTOM","filters":{"subKeyword":[],"country":[],"geoname":[],"booleans":[],"language":[],"newsReach":[],"rssSource":[],"sentiment":[],"authorList":[],"newsSource":[],"sourceType":["social_reviews"],"customCategory":[],"newsOutletTypes":[],"newsMediaFormats":[],"newsPremiumTypes":[],"broadcastSubtypes":[],"twitter":{"likes":{},"gender":[],"replies":{},"retweets":{},"followers":{},"tweetType":[],"accountStatus":[]}}},"allKeywords":[],"anyKeywords":[],"notKeywords":[],"allSearches":[],"anySearches":[],"notSearches":[],"caseSensitive":"no","searchQueryType":"boolean","informationTypes":[]},"elsEntities":[],"dateStart":"2023-12-31T18:30:00.000Z","dateEnd":"2024-05-19T18:29:59.999Z"},"query":"query GetToken($searchCriteria: SearchQueryInput\u0021, $elsEntities: [KgEntityInput\u0021], $dateStart: String, $dateEnd: String) {\\n  token(\\n    searchQuery: $searchCriteria\\n    elsEntities: $elsEntities\\n    dateStart: $dateStart\\n    dateEnd: $dateEnd\\n  ) {\\n    token\\n    __typename\\n  }\\n}"}'
        };

        const options2 = {
            method: 'POST',
            url: 'https://af.meltwater.io/data/runes',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Referer: 'https://app.meltwater.com/'
            },
            body: {
                token: '!9T7s+lj5Lr5/9Wzhi0oyLmiwLFxFNokLGSjBnbu6GPLdzi9knhQTZWW/f0NxvEQWEfVXKVhh7Hf7qNcE8qBIsVIqqVE2QhFYYxu9zs/hbDHRwYcKHnQHnuMzfjsPLB9E+z7YDlgizHQ9+fhbUgO3pUEMyauArkCmlXIzPtY88RKS45fSRb/IC6OTfjUEMZSyxc97AMZWYdkMZIkBcE1so73+REyurlLpm3bYJ1LDJ95cOdpIYmv8XsjbISP+7X9ra7df8tbfPgowuktAdqlSburrX1K94Qv3XekWVrkjvAE7tPv34Y1PstFezEwMTeeqdfuAR+Azqx63TO4I6phg8FT+BRYkqx2C0YtcW/L34oGemfnfnSM5zf8x7qjOhLpe0o9WZtS+AC+k4zvGSM5274lzM9jXomewELZFpXxLUVeYcATSQ9mJZONtw7RdC9goSWKDd435hw1XPFSRd847VHB67GGyZDAFcDtWHvNvF1OG4Yu7RVLLCJ32YsdO22pZhsIl0UskvveGrFI6d6GwXoWvz5GrCu7yqgADQ7I/ysQ7n7YPwrj7QYeujsXaFqiPKxd6CG870Te881kQg99O1qjbJP2RBmQTSYPaQ4fhp8/747cvL0ci41QTnCkGFgE9'
            },
            json: true
        };


        const options3 = {
            method: 'POST',
            url: 'https://af.meltwater.io/data/search',
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Referer: 'https://app.meltwater.com/'
            },
            body: {
                runes: {
                    type: 'all',
                    allQueries: [
                        {
                            type: 'not',
                            matchQuery: { type: 'all', allQueries: [] },
                            notMatchQuery: {
                                type: 'all',
                                allQueries: [
                                    { type: 'term', field: 'metaData.source.socialOriginType', value: 'sina_weibo' },
                                    { type: 'term', field: 'metaData.discussionType', value: 'rp' }
                                ]
                            }
                        },
                        {
                            allQueries: [
                                {
                                    allQueries: [
                                        { field: 'metaData.url', value: reviewurl, type: 'wildcard' },
                                        {
                                            field: 'metaData.product',
                                            value: reviewwords,
                                            type: 'word'
                                        }
                                    ],
                                    type: 'all'
                                },
                                {
                                    anyQueries: [
                                        {
                                            allQueries: [
                                                { field: 'metaData.source.informationType', value: 'social', type: 'term' },
                                                {
                                                    anyQueries: [
                                                        { field: 'metaData.source.socialOriginType', value: 'social_blogs', type: 'term' },
                                                        {
                                                            field: 'metaData.source.socialOriginType',
                                                            value: 'social_comments',
                                                            type: 'term'
                                                        },
                                                        {
                                                            field: 'metaData.source.socialOriginType',
                                                            value: 'social_message_boards',
                                                            type: 'term'
                                                        },
                                                        {
                                                            field: 'metaData.source.socialOriginType',
                                                            value: 'social_reviews',
                                                            type: 'term'
                                                        },
                                                    ],
                                                    type: 'any'
                                                }
                                            ],
                                            type: 'all'
                                        }
                                    ],
                                    type: 'any'
                                },
                                {
                                    allQueries: [
                                        {
                                            anyQueries: [
                                                {
                                                    field: 'metaData.source.socialOriginType',
                                                    value: 'social_reviews',
                                                    type: 'term'
                                                }
                                            ],
                                            type: 'any'
                                        }
                                    ],
                                    type: 'all'
                                }
                            ],
                            type: 'all'
                        }
                    ]
                },
                twitterApproved: false,
                dateRange: { dateStart: dynamicDateStart, dateEnd: dynamicDateEnd, granularity: 'day' },
                document: {
                    sortField: 'date',
                    sortOrder: 'DESC',
                    groupingOption: 'similar',
                    groupFrom: 0,
                    start: 0,
                    size: 25,
                    page: 0,
                    hidden: false,
                    keywords: []
                },
                entityCanonicalNames: [],
                visualizationIds: [
                    'AF-mentionsStatsTrendPredictive',
                    'AF-topStories',
                    'AF-topStoriesBubble',
                    'AF-topTerms',
                    'AF-topLocations',
                    'AF-sentiment',
                    'AF-resultListSorted',
                    'AF-filterTotal',
                    'AF-filterCountry',
                    'AF-filterInformationType',
                    'AF-filterLanguage',
                    'AF-filterMediaType',
                    'AF-filterSentiment',
                    'AF-filterSourceType',
                    'AF-mergedSourceTypes'
                ]
            },
            json: true
        };

        request(options3, function (error, response, body) {
            if (error) throw new Error(error);
            if (body["AF-mentionsStatsTrendPredictive"]["compoundWidgetData"]["AF-totalMentions"]["number"] == 0) {
                const hasSlash = /\/+/.test(reviewurl);
                if (hasSlash) {
                    console.log("no results found");
                    reviewurl = reviewurl.replace(/\/[^/]*$/, '*');
                    if (reviewurl === 'https:/*' || reviewurl === 'http:/*' || reviewurl === 'www.' || reviewurl === 'http://*' || reviewurl === 'https://*') {
                        console.log("Invalid URL after truncation");
                        res.send("Results not found");
                    } else {
                        getToken(reviewurl, reviewwords);
                        console.log('truncate', reviewurl);
                    }
                } else {
                    console.log("Results not found");
                    res.send("Results not found");
                }
            } else {
                console.log("results found");
                const documents = body['AF-resultListSorted'].documents;
                res.json(documents);
            }
        });
    }
})

//Geting the User details. 
let userDetails = {};

// login user email address
app.post('/logindetails', (req, res) => {
    res.json({message: 'I Can See login Now💀'});
    const mail = req.body.Mail;
    const Username = req.body.Username;
    userDetails.mail = mail;
    userDetails.Username=Username;
    // userDetails.username=username;
    console.log('Mail ', mail);
    console.log('Username:', Username);
    // console.log('Name',username);
    
});

//Forum Ticket Raiser.
app.post('/forumticket', (req, res) => {
    const email = userDetails.mail;
    const forumsummary = req.body.forsummary;
    const forumaccurl = req.body.foraccurl;
    const forumdescription = req.body.fordescription;
    //console.log('Forum ticket data');
    const baseUrl = process.env.API_BASE_URL || 'https://meltwater.atlassian.net';
    var accid = {
        'method': 'GET',
        'url': `${baseUrl}/rest/api/3/user/search?query=${email}`,
        'headers': {
            'Authorization': `Basic ${process.env.BASIC_TOKEN}==`,
            'Cookie': 'atlassian.xsrf.token=6aa3f8fb144c5fff4c660b84b1f67e08e12e5e08_lin'
        }
    };
    //'Basic ZGlzaGFudGgucEBtZWx0d2F0ZXIuY29tOkFUQVRUM3hGZkdGMGloSHdqUElRSW9INW1RU2pObDBtZHNYQnRjenN0NEl4bWhBeE1Gazk1ZnV4YnBNU2tQTnM2WmdldV9ySmp1cm5pNVBYZVNwOW02VUR0RzVzLVc5N0p0TnFPOE0yTTVoVnYxU2RvTVZza1dUVGlLS3ExVE1HVDAxWEtLcEhUZlYtUkNKVlZoVUVoOVZ4SUYyLXpDMFJhNHFydEVXRHJxSnV1QW02V0ZGTzRwND1BRTBFNzE4Mg=='

    request(accid, function (error, response) {
        if (error) throw new Error(error);
        var responseBody = JSON.parse(response.body);
        var accountId = responseBody[0].accountId;
        ticketfor(accountId);
    });

    function ticketfor(accountId) {
        var forumsticket = {
            'method': 'POST',
            'url': 'https://meltwater.atlassian.net/rest/api/2/issue',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${process.env.BASIC_TOKEN}==`,
                'Cookie': 'atlassian.xsrf.token=608805bbba719ff20921582c7620208e84958ceb_lin'
            },
            body: JSON.stringify({
                "fields": {
                    "project": {
                        "key": "MWTRSTAGE"
                    },
                    "summary": forumsummary, // ticket summary
                    "customfield_10040": forumaccurl,  // ticket account / opportunity URL
                    // content type
                    "customfield_11317": {
                        "self": "https://meltwater.atlassian.net/rest/api/3/customFieldOption/30407",
                        "value": "Missing Content",
                        "id": "30407"
                    },
                    // ticket group  
                    "customfield_10986": {
                        "self": "https://meltwater.atlassian.net/rest/api/3/customFieldOption/30368",
                        "value": "Content",
                        "id": "30368"
                    },
                    "description": forumdescription, // ticket description 
                    // ticket issue type
                    "issuetype": {
                        "name": "Support"
                    },
                    "reporter": {
                        "self": `${process.env.API_BASE_URL}/rest/api/3/user?accountId= ${accountId}`,
                        "accountId": accountId,
                        "emailAddress": email, 
                        "avatarUrls": {
                            "48x48": "https://secure.gravatar.com/avatar/5fb9ca4a8f36c77dfb2119acdbc6bc22?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSC-3.png",
                            "24x24": "https://secure.gravatar.com/avatar/5fb9ca4a8f36c77dfb2119acdbc6bc22?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSC-3.png",
                            "16x16": "https://secure.gravatar.com/avatar/5fb9ca4a8f36c77dfb2119acdbc6bc22?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSC-3.png",
                            "32x32": "https://secure.gravatar.com/avatar/5fb9ca4a8f36c77dfb2119acdbc6bc22?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSC-3.png"
                        },
                        "active": true,
                        "timeZone": "Asia/Calcutta",
                        "accountType": "atlassian"
                    },
                    //request type
                    "customfield_10010": "762"
                }
            }),
        };

        //for fetching the ticket number as key {can be statcic all the time till the personals are not changed}
        request(forumsticket, function (error, response) {
            if (error) throw new Error(error);
            //console.log(response.body);
            const parsedData = JSON.parse(response.body);
            const keyValue = parsedData.key;
            //console.log(keyValue);

            res.json({ key: keyValue });

            var options = {
                method: 'POST',
                url: `https://meltwater.atlassian.net/rest/api/3/issue/${keyValue}/comment`,
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'Authorization': `Basic ${process.env.BASIC_TOKEN}==`,
                },
                body: JSON.stringify({
                    "body": {
                        "version": 1,
                        "type": "doc",
                        "content": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "Hi Team,"
                                    }
                                ]
                            },
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "Please look into the issue, the details are in the ticket description."
                                    }
                                ]
                            },
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "Thank you."
                                    }
                                ]
                            },
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "mention",
                                        "attrs": {
                                            "id": "712020:7d0c98eb-02f7-453f-bbe9-d105557c2078",
                                            "text": "@Dishanth P",
                                            "accessLevel": ""
                                        }
                                    },
                                    {
                                        "type": "text",
                                        "text": " "
                                    },
                                    {
                                        "type": "text",
                                        "text": "  / "
                                    },
                                    {
                                        "type": "mention",
                                        "attrs": {
                                            "id": "712020:3e4015bd-218c-42b7-9939-0f7fd092cc4f",
                                            "text": "@Karthik Pohane",
                                            "accessLevel": ""
                                        }
                                    },
                                    {
                                        "type": "text",
                                        "text": " "
                                    }
                                ]
                            }
                        ]
                    },
                    "properties": [
                        {
                            "key": "sd.public.comment",
                            "value": {
                                "internal": true
                            }
                        }
                    ],
                    "visibility": null
                })
            };

            request(options, function (error, response) {
                if (error) throw new Error(error);
                //console.log("Internal comment added forum ticket");
            });
        });

    }
})


//Reviews Ticket Raiser.
app.post('/reviewticket', (req, res) => {
    const email = userDetails.mail;
    const reviewsummary = req.body.revsummary;
    const reviewaccurl = req.body.revaccurl;
    const reviewdescription = req.body.revdescription;
    //console.log('Review ticket data');
    var accid = {
        'method': 'GET',
        'url': `https://meltwater.atlassian.net/rest/api/3/user/search?query=${email}`,
        'headers': {
            'Authorization': `Basic ${process.env.BASIC_TOKEN}==`,
            'Cookie': 'atlassian.xsrf.token=6aa3f8fb144c5fff4c660b84b1f67e08e12e5e08_lin'
        }
    };
    request(accid, function (error, response) {
        if (error) throw new Error(error);
        var responseBody = JSON.parse(response.body);
        var accountId = responseBody[0].accountId;
        ticketfor(accountId);
    });

    function ticketfor(accountId) {
        var reviewsticket = {
            'method': 'POST',
            'url': 'https://meltwater.atlassian.net/rest/api/2/issue',
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${process.env.BASIC_TOKEN}==`,
                'Cookie': 'atlassian.xsrf.token=608805bbba719ff20921582c7620208e84958ceb_lin'
            },
            body: JSON.stringify({
                "fields": {
                    "project": {
                        "key": "MWTRSTAGE"
                    },
                    "summary": reviewsummary, // ticket summary
                    "customfield_10040": reviewaccurl,  // ticket account / opportunity URL
                    // content type
                    "customfield_11317": {
                        "self": "https://meltwater.atlassian.net/rest/api/3/customFieldOption/30407",
                        "value": "Missing Content",
                        "id": "30407"
                    },
                    // ticket group  
                    "customfield_10986": {
                        "self": "https://meltwater.atlassian.net/rest/api/3/customFieldOption/30368",
                        "value": "Content",
                        "id": "30368"
                    },
                    "description": reviewdescription, // ticket description 
                    // ticket issue type
                    "issuetype": {
                        "name": "Support"
                    },
                    "reporter": {
                        "self": `https://meltwater.atlassian.net/rest/api/3/user?accountId= ${accountId}`,
                        "accountId": accountId,
                        "emailAddress": email,
                        "avatarUrls": {
                            "48x48": "https://secure.gravatar.com/avatar/5fb9ca4a8f36c77dfb2119acdbc6bc22?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSC-3.png",
                            "24x24": "https://secure.gravatar.com/avatar/5fb9ca4a8f36c77dfb2119acdbc6bc22?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSC-3.png",
                            "16x16": "https://secure.gravatar.com/avatar/5fb9ca4a8f36c77dfb2119acdbc6bc22?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSC-3.png",
                            "32x32": "https://secure.gravatar.com/avatar/5fb9ca4a8f36c77dfb2119acdbc6bc22?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FSC-3.png"
                        },
                        "active": true,
                        "timeZone": "Asia/Calcutta",
                        "accountType": "atlassian"
                    },
                    //request type
                    "customfield_10010": "762"
                }
            }),
        };
        request(reviewsticket, function (error, response) {
            if (error) throw new Error(error);
            //console.log(response.body);
            const parsedData = JSON.parse(response.body);
            const keyValue = parsedData.key;
            //console.log(keyValue);

            res.json({ key: keyValue });

            var options = {
                method: 'POST',
                url: `https://meltwater.atlassian.net/rest/api/3/issue/${keyValue}/comment`,
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'Authorization': `Basic ${process.env.BASIC_TOKEN}==`,
                },
                body: JSON.stringify({
                    "body": {
                        "version": 1,
                        "type": "doc",
                        "content": [
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "Hi Team,"
                                    }
                                ]
                            },
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "Please look into the issue, the details are in the ticket description."
                                    }
                                ]
                            },
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "Thank you."
                                    }
                                ]
                            },
                            {
                                "type": "paragraph",
                                "content": [
                                    {
                                        "type": "mention",
                                        "attrs": {
                                            "id": "712020:7d0c98eb-02f7-453f-bbe9-d105557c2078",
                                            "text": "@Dishanth P",
                                            "accessLevel": ""
                                        }
                                    },
                                    {
                                        "type": "text",
                                        "text": " "
                                    },
                                    {
                                        "type": "text",
                                        "text": "  / "
                                    },
                                    {
                                        "type": "mention",
                                        "attrs": {
                                            "id": "712020:3e4015bd-218c-42b7-9939-0f7fd092cc4f",
                                            "text": "@Karthik Pohane",
                                            "accessLevel": ""
                                        }
                                    },
                                    {
                                        "type": "text",
                                        "text": " "
                                    }
                                ]
                            }
                        ]
                    },
                    "properties": [
                        {
                            "key": "sd.public.comment",
                            "value": {
                                "internal": true
                            }
                        }
                    ],
                    "visibility": null
                })
            };

            request(options, function (error, response) {
                if (error) throw new Error(error);
                //console.log("Internal comment added review ticket");
            });
        });

    }
})


// getting the ticket list created by the particular user
app.get('/gettickets', (req, res) => {
    const email = userDetails.mail;
    //console.log('ticket data');
    var accid = {
        'method': 'GET',
        'url': `https://meltwater.atlassian.net/rest/api/3/user/search?query=${email}`,
        'headers': {
            'Authorization': `Basic ${process.env.BASIC_TOKEN}==`,
            'Cookie': 'atlassian.xsrf.token=6aa3f8fb144c5fff4c660b84b1f67e08e12e5e08_lin'
        }
    };
    request(accid, function (error, response) {
        if (error) throw new Error(error);
        var responseBody = JSON.parse(response.body);
        var accountId = responseBody[0].accountId;
        ticketfor(accountId);
    });

    function ticketfor(accountId) {
        var ticketskey = {
            'method': 'GET',
            'url': `https://meltwater.atlassian.net/rest/api/3/search?jql=reporter=${accountId}`,
            'headers': {
                'Authorization': `Basic ${process.env.BASIC_TOKEN}==`,
                'Cookie': 'atlassian.xsrf.token=78e751d73d45dcb1583c0051e6290c5fce218144_lin'
            }
        };
        request(ticketskey, function (error, response) {
            if (error) throw new Error(error);

            var data = JSON.parse(response.body);

            var tickets = data.issues
                .filter(issue => issue.key.includes('MWTRSTAGE'))
                .map(issue => issue.key);

            res.json(tickets);
        });
    }
})


//Fetching Dates.
const getDynamicDateStart = () => {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    return twelveMonthsAgo.getTime();
};
;

// Route to fetch all dates
app.get('/dates', (req, res) => {
    const currentTimestamp = new Date().getTime();
    const dynamicDateStart = getDynamicDateStart();
    res.json({
        currentTimestamp,
        dynamicDateStart,
        dynamicDateEnd: currentTimestamp
    });
});
