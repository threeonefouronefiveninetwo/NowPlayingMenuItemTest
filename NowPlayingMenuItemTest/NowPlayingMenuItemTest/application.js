//# sourceURL=application.js

//
//  application.js
//  NowPlayingTest
//
//

/*
 * This file provides an example skeletal stub for the server-side implementation 
 * of a TVML application.
 *
 * A javascript file such as this should be provided at the tvBootURL that is 
 * configured in the AppDelegate of the TVML application. Note that  the various 
 * javascript functions here are referenced by name in the AppDelegate. This skeletal 
 * implementation shows the basic entry points that you will want to handle 
 * application lifecycle events.
 */

/**
 * @description The onLaunch callback is invoked after the application JavaScript 
 * has been parsed into a JavaScript context. The handler is passed an object 
 * that contains options passed in for launch. These options are defined in the
 * swift or objective-c client code. Options can be used to communicate to
 * your JavaScript code that data and as well as state information, like if the 
 * the app is being launched in the background.
 *
 * The location attribute is automatically added to the object and represents 
 * the URL that was used to retrieve the application JavaScript.
 */
var baseURL;
var menuBarDocument;

App.onLaunch = function(options) {
    var menuBarDocument = createMenuTemplate();
    navigationDocument.pushDocument(menuBarDocument);
    baseURL = options.BASEURL
    var menuBar = menuBarDocument.getElementById("menu");
    var menuBarFeature = menuBar.getFeature("MenuBarDocument");
    var trackDoc = createTracksDocument();
    var menuItem = menuBar.getElementsByTagName("menuItem").item(0);
    menuBarFeature.setDocument(trackDoc, menuItem);
}


App.onWillResignActive = function() {

}

App.onDidEnterBackground = function() {

}

App.onWillEnterForeground = function() {
    
}

App.onDidBecomeActive = function() {
    
}

App.onWillTerminate = function() {
    
}


/**
 * This convenience funnction returns an alert template, which can be used to present errors to the user.
 */
var createAlert = function(title, description) {

    var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <alertTemplate>
            <title>${title}</title>
            <description>${description}</description>
          </alertTemplate>
        </document>`

    var parser = new DOMParser();

    var alertDoc = parser.parseFromString(alertString, "application/xml");

    return alertDoc
}


// Create a menu template with now playing
// and add handler for menuItem select events.
var createMenuTemplate = function() {
    var menuTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
            <menuBarTemplate>
                <menuBar id="menu">
                    <!-- Only appears during audio playback -->
                    <nowPlayingMenuItem id="nowPlaying" />
                    <menuItem id="tracks">
                        <title>Tracks</title>
                    </menuItem>
                    <menuItem id="secondTab">
                        <title>Second Tab</title>
                    </menuItem>
                    <menuItem id="thirdTab">
                        <title>Third Tab</title>
                    </menuItem>
                    <menuItem id="fourthTab">
                        <title>Last Tab</title>
                    </menuItem>
                </menuBar>
            </menuBarTemplate>
        </document>
    `;
    
    var parser = new DOMParser();
    
    var menuDoc = parser.parseFromString(menuTemplate, "application/xml");
    menuDoc.addEventListener("select", printSelectedMenuItem);
    
    // MenuBarDocument:setDocument
    // Uncomment following line to see how the bug affects setting documents for a menuItem
    // menuDoc.addEventListener("select", updateDocumentForSelectedMenuItem);
    
    
    menuBarDocument = menuDoc;
    return menuDoc;
}


// Create a stack template with Tracks to plag.
// Code and resources are copied from TVMLGuideCoreConcepts
// https://developer.apple.com/library/archive/samplecode/TVMLGuide/Introduction/Intro.html#//apple_ref/doc/uid/TP40016778
// link no longer points to the sample code.
var createTracksDocument = function() {
    var xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <!--
    Copyright (C) 2016 Apple Inc. All Rights Reserved.
    See LICENSE.txt for this sample’s licensing information
        -->
        <document>
            <stackTemplate>
                <banner>
                    <title>Tracks</title>
                </banner>
                <collectionList>
                    <grid>
                        <section>
        <lockup audioURL="${baseURL}/audio/Building_Blocks.mp3">
                                <img width="308" height="308" style="tv-placeholder: music;" src="${baseURL}/images/square_1.jpg" />
                                <title>Play Me</title>
                            </lockup>
                            <lockup audioURL="${baseURL}/audio/Building_Together.mp3">
                                <img width="308" height="308" style="tv-placeholder: music;" src="${baseURL}/images/square_2.jpg" />
                                <title>Play Me</title>
                            </lockup>
                        </section>
                    </grid>
                </collectionList>
            </stackTemplate>
        </document>`;
    
    var parser = new DOMParser();
    
    var doc = parser.parseFromString(xml, "application/xml");
    
    doc.addEventListener("play", playSelectedLockup);
    doc.addEventListener("select", playSelectedLockup);
    
    return doc;
}



function playSelectedLockup(event) {
    const targetElem = event.target;
    // Convert the URL on the lockup from relative to absolute with the DocumentLoader
    const audioURL = targetElem.getAttribute("audioURL");
    if (audioURL) {
        // Prepare an Audio MediaItem with metadata from the lockup...
        const mediaItem = new MediaItem("audio", audioURL);
        // Assign the artwork metadata
        const imgElem = targetElem.getElementsByTagName("img").item(0);
        if (imgElem && imgElem.hasAttribute("src")) {
            mediaItem.artworkImageURL = imgElem.getAttribute("src");
        }
        // Assign the title metadata
        const titleElem = targetElem.getElementsByTagName("title").item(0);
        if (titleElem) {
            mediaItem.title = titleElem.textContent;
        }
        // Create a Player and assign the MediaItem to its Playlist
   
        const player = new Player();
        player.playlist = new Playlist();
        player.playlist.push(mediaItem);
        // Present the player and start playback
        player.play();
    }
}


function printSelectedMenuItem(event) {
    const targetElem = event.target;
    
    console.log(event);
    console.log(targetElem.nodeName);
    console.log(targetElem.innerHTML);
}

function updateDocumentForSelectedMenuItem(event) {
    const menuBarElem = menuBarDocument.getElementsByTagName("menuBar").item(0);
    const menuItemElem = event.target;
    // Set the stack document on the menu bar item
    const menuBarFeature = menuBarElem.getFeature("MenuBarDocument");
    
    var menuId = menuItemElem.getAttribute("id");
    // Don't update tab content for now playing or tracks tabs.
    if (menuId === "tracks" || menuId == "nowPlaying") {
        return;
    }
    
    var title = menuItemElem.textContent;
    var desciption = `Tab for menuItem "${title}"`
    var tabDocument = createAlert(title, desciption);
    menuBarFeature.setDocument(tabDocument, menuItemElem);
}
