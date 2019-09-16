# Majabris!

## Members
- Braydon Berthelet -> #36436933
- Isaac Cormack -> #28799896
- Jamie St Martin -> #3781898
- Marina Dunn -> #26510100

## Prospective Projects
1. TindArt (selected) - Sell art with a UI resembling Tinder (Rough notes follow below) (Possibly change name to something that would be more appropriate to put on a resume?)
   - User initially fills out a questionaire of sorts to match with art they are most likely interested in
   - Once user has liked an art piece it is stored onto their liked page where they are then able to message the artist asking further questions, arranging a meetup, negotiating on price (private chat context, ie can have more than one chat with same author)
   - 3 main pages:
   1. Edit your user account page, update profile picture, your bio, interests, etc. and post new art
   2. Tinder-esque art matching page, swipe (or other UI, maybe click for simplicity) through art filtered according to proximity and user preferences
   3. Matches page where the are you liked is stored, same format as tinder where you have a list of art you have liked along with a list of artists you are in conversation with over pieces of art
   - Other pages:
   1. Other user profiles containing art they are selling (empty if not selling any) (could contain more ie. activity)
   - Art is posted with price, description, link to artists page (via their name) (hashtags, distance, ..?)
   (Will need to scale down requirements from list of functionality above)
2. Mock Instagram - create accounts, share images, comment on images, user profiles, etc.
3. Boardgame Meetup App - user profiles in facebook manner, main homepage where users post about meetup, posts filtered by different criteria, ability to comment on posts, like posts, show interest (ie. is going, is interested, etc. ), posts can contain images

## TindArt

### CRUD/DB Model

User

  * User ID (for internal use & the URL of each user)
  * Profile Photo (location on server)
  * Username (for login. probably should be contact email)
  * Hashed Password
  * Password Salt
  * Name (real name/displayed on profile)
  * User Bio (text description to display)
  * User location (city - we're not dealing with proper location stuff, just enter your city and you'll see art from the same city)
  * Phone number (or other contact info, for connecting buyers with sellers - this could be replaced with a messaging system but that's beyond our scope)

Photo

  * Photo ID (used to link to the photo)
  * User ID (foreign key)
  * Title
  * Price

Likes

  * User ID (of the liker)
  * Photo ID (of the photo they liked)
  
