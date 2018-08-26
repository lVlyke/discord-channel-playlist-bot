export namespace Constants {

    export namespace DataStore {

        export const Keys = {
            channelPlaylistCollection: "channelPlaylistCollection",
            userAuthCollection: "userAuthCollection",
            spotifyUserLookupMap: "spotifyUserLookupMap",
            subscriptions: "subscriptions",
            userChannelPlaylists: "userChannelPlaylists"
        };
    }

    export namespace Strings {

        export const Common = {
            helpInstructions: "For help, **@Mention** me and say `help`.",
            authInstructions: "**@Mention** me and say `authorize`"
        };

        export const Commands = {
            Authorize: {
                successResponse: "To authorize me to manage your channel playlists, follow this link: ${authorizationUrl}\r\nPlease note that you **must** send me the authorization token you receive via a direct message."
            },
            ForceUserPlaylistUpdate: {
                successResponse: "The latest weekly channel playlist has been published on Spotify!"
            },
            Help: {
                generalHelp: {
                    1: "This bot allows you to subscribe to music posted to any Discord channel from Spotify. A playlist will be periodically created on your Spotify account with all of the tracks posted to this channel in that time.",
                    2: `To get started, you will need to authorize me to manage the playlist via Spotify. To do this, ${Strings.Common.authInstructions}.`
                },
                availableCommands: "Available commands:"
            },
            RegisterToken: {
                missingToken:  {
                    1: "Please provide a valid Spotify authorization token to be registered.",
                    2: Strings.Common.helpInstructions
                },
                invalidToken: {
                    1: `Uh oh... your token appears to be invalid. To receive a valid token, ${Strings.Common.authInstructions}.`,
                    2: Strings.Common.helpInstructions
                },
                successResponse: "You're all set! You can now **@Mention** me in any channel and say `subscribe` to have me manage a weekly playlist for that channel."
            },
            Subscribe: {
                unregisteredUserId: {
                    1: `You need to authorize me to manage your channel playlists via Spotify before you can subscribe. To authorize, ${Strings.Common.authInstructions}.`,
                    2: Strings.Common.helpInstructions
                },
                alreadySubscribed: "You are already subscribed to this channel's playlist.",
                successResponse: "You have subscribed to this channel's Spotify playlist. You will receive a new playlist each week with music submitted to this channel."
            }
        };

        export const CommandError = {
            Prefixes: [
                "I don't know what that is, I've never seen that.",
                "Beep boop, I'm just a bot.",
                "What?",
                "Cool."
            ],
            Response: "You can say `help` to see a list of commands."
        };

        export const Notifications = {
            messageOnPlaylistCommit: "Spotify playlists for this channel are being updated. Get ready!",
            messageOnPlaylistChange: "Your track(s) have been added to the playlist."
        };
    }
}

export const DataStore = Constants.DataStore;
export const Strings = Constants.Strings;