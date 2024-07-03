---
layout: default
title: WebSocket Playground
permalink: /all-ops/websockets/play
grand_parent: API Operations
parent: WebSockets
nav_order: 1
---

<script>
    window.addEventListener('load', () => {
        const TDV = Symbol.for('tdv-docs');
        window[TDV].defineTryit({
            name: 'Using the WebSocket Playground',
            excerpt: `<p>Welcome to the Tradovate WebSocket Playground. All you need to get started is an access token!</p><h3>Authorization Procedure</h3><p>Choose a WebSocket server from the dropdown menu. You can connect to Demo, Live, Real-time Market Data, or Market Replay servers. Each has a different purpose. After you've picked a server, press 'Connect'. You should see the 'open' frame as a message IN(<span style="color:red;">↘</span>) from the server. To complete opening the socket connection, the server needs to receive the 'authorize' command. Click on the button labelled 'authorize', then press the 'Generate Message' button. You should see a pre-generated message in the INPUT box. If you've already authorized this website with a valid access token, the message will have the token message body pre-filled for you. Otherwise, replace <code>your_access_token</code> with the an actual access token value.</p><h3>Using the Command Palette</h3><p>You can generate messages to send over the WebSocket at the click of a button. When you clicked the 'authorize' button, you actually used the Command Palette to generate a valid message for you. This is a great way to learn how to use the WebSockets APIs interactively! Explore with the various commands that appear in the palette - they will change based on what is valid for the server that you've chosen. You'll be able to see anything sent over the WebSocket as a message OUT(<span style="color:blue;">↖</span>).</p><blockquote><em><strong>Pro Tip! </strong>You can click on response items to copy the JSON data to your clipboard, and on input items to copy the generated message as JSON text.</em></blockquote><h3>Working With WebSockets</h3><p>WebSockets might seem intimidating at first, but really they have a fairly simple API. There are four message types that you may encounter:</p><ul><li><code>o</code> - the Open frame. Respond to this in-message with the 'authorize' out-message.</li><li><code>h</code> - the Heartbeat frame. This is a constant pinging back and forth between the server and the client socket. Heartbeats are implemented in the playground automatically, but when you write your own code you will have to compensate. You should be sending a heartbeat to the server every 2.5 seconds. A sent heartbeat looks like this <code>'[]'</code></li><li><code>a</code> - this is the Data frame. Any 'a' frame message will contain an Array of JSON data immediately after the 'a' character.</li><li><code>c</code> - the Close frame. When the WebSocket connection is closed remotely, you'll receive the 'c' frame.</li></ul><blockquote><em><strong>Pro Tip! </strong>If the heartbeat messages become cumbersome to deal with, you can make them run silently by un-checking the 'Show Hearbeats' control.</em></blockquote>`,
            excerptOnly: true
        });
    });
</script>

## WebSocket Playground
<div id="tdv-playground" class="tdv-socket-box">
    <select id="url-selector">
        <option>wss://demo-d.tradovateapi.com/v1/websocket</option>
        <option>wss://live-d.tradovateapi.com/v1/websocket</option>
        <option>wss://md-d.tradovateapi.com/v1/websocket</option>
        <option>wss://replay-d.tradovateapi.com/v1/websocket</option>
    </select>
    <button id="start-socket-btn" style="font-family: Montserrat, sans-serif;" class="btn btn-red">Connect</button>
    
    <label><h4 style="border-bottom: 1px solid #eeebee;">OUTPUT</h4></label>
    <div class="tdv-msg-output">
        <figure class="tdv-msgs">
            <pre>
                <ul id="tdv-responses-list">
                </ul>
            </pre>
        </figure>
    </div>

    <label for="send-text"><h4 style="border-bottom: 1px solid #eeebee;">INPUT</h4></label>
    <div class="tdv-msg-input">
        <figure>
            <pre id="send-text" contentEditable>



            </pre>
        </figure>
        <hr/>
        <button id="build-btn" style="font-family: Montserrat, sans-serif;" class="btn" disabled>Generate Message</button>
        <button id="send-btn" style="font-family: Montserrat, sans-serif;" class="btn btn-green">Send</button>
        <label class="checker" style="font-family: Montserrat, sans-serif;" for="show-heartbeats">Show Heartbeats
            <input id="show-heartbeats" type="checkbox" checked="checked" />
            <span class="checker-inner"></span>
        </label>
    </div>
    
    <div id="palette" class="tdv-ws-palette">
        <h4 style="border-bottom: 1px solid #eeebee;">PARAMS</h4>
        <section id="palette-buttons"></section>
        <h4>COMMAND PALETTE</h4>
        <section id="palette-options"></section>
    </div>
</div>

<script src="{{ '/assets/js/playground.js' | relative_url }}"></script>
