import "https://apis.google.com/js/api.js"
import "https://accounts.google.com/gsi/client"

function start() {
    // 2. Initialize the JavaScript client library.
    gapi.client.init({
        'apiKey': 'AIzaSyDG2CIZOlghXegzSWAhQVDKNcQA8Sq1lWs',
        // Your API key will be automatically added to the Discovery Document URLs.
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        // clientId and scope are optional if auth is not required.

        'clientId': '765048538359-i75u7cnd4fl1flqfrv6iiimap9u9i1i9.apps.googleusercontent.com',
        'scope': 'profile',
    }).then(function() {
        // 3. Initialize and make the API request.
        return gapi.client.drive.files.get(
            {
                fileId: '1FZfy1L_iwoi0ua_bVW5M5DRFLQAaWGPx',
                alt: 'media',
            }
        );
    }).then(function(response) {
        PDFDocument.load(response.body)
    }).then(function(doc) {
        console.log(doc);
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });
};
// 1. Load the JavaScript client library.


let tokenClient;
let accessToken = null;
let pickerInited = false;
let gisInited = false;

// Use the API Loader script to load google.picker
function onApiLoad() {
    gapi.load('picker', onPickerApiLoad);
}

function onPickerApiLoad() {
    pickerInited = true;
}

function gisLoaded() {
    // TODO(developer): Replace with your client ID and required scopes
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '765048538359-i75u7cnd4fl1flqfrv6iiimap9u9i1i9.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata.readonly',
        callback: '', // defined later
    });
    gisInited = true;
}
/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '765048538359-i75u7cnd4fl1flqfrv6iiimap9u9i1i9.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDG2CIZOlghXegzSWAhQVDKNcQA8Sq1lWs';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', intializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function intializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        await listFiles();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

/**
 * Print metadata for first 10 files.
 */
async function listFiles() {
    let response;
    try {
        response = await gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': 'files(id, name)',
        });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }
    const files = response.result.files;
    if (!files || files.length == 0) {
        document.getElementById('content').innerText = 'No files found.';
        return;
    }
    response = await gapi.client.drive.files.get({
        'fileId': files[0].id,
        'alt': 'media'
    });

    debugger;

    const output = files.reduce(
        (str, file) => `${str}${file.name} (${file.id}\n`,
        'Files:\n');
    document.getElementById('content').innerText = output;
}
