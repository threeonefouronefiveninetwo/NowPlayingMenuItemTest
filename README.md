# NowPlayingMenuItemTest

This test project demonstrates a bug that exists with using nowPlayingMenuItem in a menuBarTemplate with a TVML application.

## Summary

When nowPlayingMenuItem element is used in menuBarTemplate, and if you have other menuItem elements coming after the nowPlayingMenuItem element, "select" events dispatched from these menuItem elements contain incorrect event targets after stating a second playback session.

## Steps to Reproduce
1. Run the project as you would run a TVML app (create an http server in the root folder). You might need to update App Transport Security settings in the project .plist file.
1. Start playback, go back to document with menuBarTemplate and observe "Now Playing"  menu item is showing up. Add this point navigating between menuItems works correctly (you can console.log event targets for select event).
1. Start playback again (this can be with the same track or a different track)
1. Go back to document with menuBarTemplate. Navigate between menus. 

### Actual Result
After second playback, we expect to see incorrect event targets are printed, the menuItem Element selected sent to the event listener is not correct. I am printing the target element content to the console where it can be observed

### Expected Result
After second playback, we expect to see correct event target, the menuItem Element selected sent to the event listener. 

