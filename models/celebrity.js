var mongoose = require("mongoose");

var celebSchema = new mongoose.Schema({
	celebName:String,
	image:String,
	fbLink:String,
	twitterLink:String,
	instaLink:String,
    youtubeLink:String,
	soundcloudLink:String,
	itunesLink:String,
	spotifyLink:String,
    amazonmusicLink:String,
    googleplayLink:String
});

var Celebrity = mongoose.model("Celebrity", celebSchema);
module.exports  = Celebrity;


// Celebrity.create({ celebName:"Boyce Avenue",  image:"grid-images/ba.jpg", fbLink:"https://www.facebook.com/BoyceAvenue/",    twitterLink:"https://twitter.com/BoyceAvenue",   instaLink:"https://www.instagram.com/boyceavenue/",        youtubeLink:"https://www.youtube.com/user/boyceavenue",      spotifyLink:"https://open.spotify.com/artist/7CQwac16i1W5ej8YpuL3dv",   soundcloudLink:"https://soundcloud.com/boyceavenue",            itunesLink:"https://itunes.apple.com/us/artist/boyce-avenue/251854427",  amazonmusicLink:"https://music.amazon.com/artists/B0013TI39M?tab=CATALOG",  googleplayLink:"https://play.google.com/store/music/artist/Boyce_Avenue?id=Afr4sf3dluoi4q3jeoanikv7eze&hl=en",  tourName:"2019 Tour",           tourDates:["4 April 2019", "9 April 2019", "13 April 2019" , "4 April 2019", "17 April 2019", "18 April 2019", "21 April 2019", "23 April 2019", "26 April 2019", "29 April 2019"], tourCity:["Taoyuan", "Tokyo", "Kuala Lumpur", "Hong Kong", "Hong Kong", "Incheon", "Osaka", "Singapore", "Bangkok", "Jakarta"], tourCountry:["Taiwan", "Japan", "Malaysia", "Hong Kong", "Hong Kong", "South Korea", "Japan", "Singapore", "Thailand", "Indonesia"], tourVenue:["Taoyuan City Stadium", "Tokyo Dome", "Bukit Jalil National Stadium", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Songdo Moonlight Festival Park", "Kyocera Dome", "Singapore National Stadium", "Rajamangala Stadium", "Gelora Bung Karno Stadium"]});
// Celebrity.create({ celebName:"Ed Sheeran",    image:"grid-images/es.jpg", fbLink:"https://www.facebook.com/EdSheeranMusic/", twitterLink:"https://twitter.com/edsheeran",     instaLink:"https://www.instagram.com/teddysphotos/",       youtubeLink:"https://www.youtube.com/user/EdSheeran",        spotifyLink:"https://open.spotify.com/playlist/4IMDymOM2HfAcNq0BKAVGi", soundcloudLink:"https://soundcloud.com/edsheeran",              itunesLink:"https://itunes.apple.com/us/artist/ed-sheeran/183313439",    amazonmusicLink:"https://music.amazon.com/artists/B0015H24HO?tab=CATALOG",  googleplayLink:"https://play.google.com/store/music/artist/Ed_Sheeran?id=Aelpv6xw456fdtfl3yf3nkdzdwq&hl=en",    tourName:"Divide Tour",         tourDates:["4 April 2019", "9 April 2019", "13 April 2019" , "4 April 2019", "17 April 2019", "18 April 2019", "21 April 2019", "23 April 2019", "26 April 2019", "29 April 2019"], tourCity:["Taoyuan", "Tokyo", "Kuala Lumpur", "Hong Kong", "Hong Kong", "Incheon", "Osaka", "Singapore", "Bangkok", "Jakarta"], tourCountry:["Taiwan", "Japan", "Malaysia", "Hong Kong", "Hong Kong", "South Korea", "Japan", "Singapore", "Thailand", "Indonesia"], tourVenue:["Taoyuan City Stadium", "Tokyo Dome", "Bukit Jalil National Stadium", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Songdo Moonlight Festival Park", "Kyocera Dome", "Singapore National Stadium", "Rajamangala Stadium", "Gelora Bung Karno Stadium"]});
// Celebrity.create({ celebName:"Ariana Grande", image:"grid-images/ag.jpg", fbLink:"https://www.facebook.com/arianagrande/",   twitterLink:"https://twitter.com/ArianaGrande",  instaLink:"https://www.instagram.com/arianagrande/",       youtubeLink:"https://www.youtube.com/user/osnapitzari",      spotifyLink:"https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR",   soundcloudLink:"https://soundcloud.com/ariana-grande-official", itunesLink:"https://itunes.apple.com/us/artist/ariana-grande/412778295", amazonmusicLink:"https://music.amazon.com/artists/B004IUAQ9S?tab=CATALOG",  googleplayLink:"https://play.google.com/store/music/artist/Ariana_Grande?id=Avewmc27cho5mrhf63psbn3qbsy&hl=en", tourName:"Sweetner World Tour", tourDates:["4 April 2019", "9 April 2019", "13 April 2019" , "4 April 2019", "17 April 2019", "18 April 2019", "21 April 2019", "23 April 2019", "26 April 2019", "29 April 2019"], tourCity:["Taoyuan", "Tokyo", "Kuala Lumpur", "Hong Kong", "Hong Kong", "Incheon", "Osaka", "Singapore", "Bangkok", "Jakarta"], tourCountry:["Taiwan", "Japan", "Malaysia", "Hong Kong", "Hong Kong", "South Korea", "Japan", "Singapore", "Thailand", "Indonesia"], tourVenue:["Taoyuan City Stadium", "Tokyo Dome", "Bukit Jalil National Stadium", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Songdo Moonlight Festival Park", "Kyocera Dome", "Singapore National Stadium", "Rajamangala Stadium", "Gelora Bung Karno Stadium"]});    
// Celebrity.create({ celebName:"Taylor Swift",  image:"grid-images/ts.jpg", fbLink:"https://www.facebook.com/TaylorSwift/",    twitterLink:"https://twitter.com/taylorswift13", instaLink:"https://www.instagram.com/taylorswift/",        youtubeLink:"https://www.youtube.com/user/taylorswift",      spotifyLink:"https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02",   soundcloudLink:"https://soundcloud.com/taylorswiftofficial",    itunesLink:"https://itunes.apple.com/us/artist/taylor-swift/159260351",  amazonmusicLink:"https://music.amazon.com/artists/B00157GJ20?tab=CATALOG",  googleplayLink:"https://play.google.com/store/music/artist/Taylor_Swift?id=A4saifqiazru565jhrrm6d72jaa&hl=en",  tourName:"Reputation Tour",     tourDates:["4 April 2019", "9 April 2019", "13 April 2019" , "4 April 2019", "17 April 2019", "18 April 2019", "21 April 2019", "23 April 2019", "26 April 2019", "29 April 2019"], tourCity:["Taoyuan", "Tokyo", "Kuala Lumpur", "Hong Kong", "Hong Kong", "Incheon", "Osaka", "Singapore", "Bangkok", "Jakarta"], tourCountry:["Taiwan", "Japan", "Malaysia", "Hong Kong", "Hong Kong", "South Korea", "Japan", "Singapore", "Thailand", "Indonesia"], tourVenue:["Taoyuan City Stadium", "Tokyo Dome", "Bukit Jalil National Stadium", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Songdo Moonlight Festival Park", "Kyocera Dome", "Singapore National Stadium", "Rajamangala Stadium", "Gelora Bung Karno Stadium"]});    
// Celebrity.create({ celebName:"Charlie Puth",  image:"grid-images/cp.jpg", fbLink:"https://www.facebook.com/charlieputh/",    twitterLink:"https://twitter.com/charlieputh",   instaLink:"https://www.instagram.com/charlieputh/",        youtubeLink:"https://www.youtube.com/user/CharliesVlogs",    spotifyLink:"https://open.spotify.com/artist/6VuMaDnrHyPL1p4EHjYLi7",   soundcloudLink:"https://soundcloud.com/charlieputh",            itunesLink:"https://itunes.apple.com/us/artist/charlie-puth/336249253",  amazonmusicLink:"https://music.amazon.com/artists/B004E4J24S?tab=CATALOG",  googleplayLink:"https://play.google.com/store/music/artist/Charlie_Puth?id=Atv6vqoeu34ojrlgsj4raqtwt5y&hl=en",  tourName:"Voice Notes Tour",    tourDates:["4 April 2019", "9 April 2019", "13 April 2019" , "4 April 2019", "17 April 2019", "18 April 2019", "21 April 2019", "23 April 2019", "26 April 2019", "29 April 2019"], tourCity:["Taoyuan", "Tokyo", "Kuala Lumpur", "Hong Kong", "Hong Kong", "Incheon", "Osaka", "Singapore", "Bangkok", "Jakarta"], tourCountry:["Taiwan", "Japan", "Malaysia", "Hong Kong", "Hong Kong", "South Korea", "Japan", "Singapore", "Thailand", "Indonesia"], tourVenue:["Taoyuan City Stadium", "Tokyo Dome", "Bukit Jalil National Stadium", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Songdo Moonlight Festival Park", "Kyocera Dome", "Singapore National Stadium", "Rajamangala Stadium", "Gelora Bung Karno Stadium"]});
// Celebrity.create({ celebName:"Metallica",     image:"grid-images/me.jpg", fbLink:"https://www.facebook.com/Metallica/",      twitterLink:"https://twitter.com/Metallica",     instaLink:"https://www.instagram.com/metallica/",          youtubeLink:"https://www.youtube.com/user/MetallicaTV",      spotifyLink:"https://open.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",   soundcloudLink:"https://soundcloud.com/officialmetallica",      itunesLink:"https://itunes.apple.com/us/artist/metallica/3996865",       amazonmusicLink:"https://music.amazon.com/artists/B000QJPIHU?tab=CATALOG" , googleplayLink:"https://play.google.com/store/music/artist/Metallica?id=Asofl5rpj6oa6kxnwsb5oqnpasi&hl=en",     tourName:"WorldWired Tour",     tourDates:["4 April 2019", "9 April 2019", "13 April 2019" , "4 April 2019", "17 April 2019", "18 April 2019", "21 April 2019", "23 April 2019", "26 April 2019", "29 April 2019"], tourCity:["Taoyuan", "Tokyo", "Kuala Lumpur", "Hong Kong", "Hong Kong", "Incheon", "Osaka", "Singapore", "Bangkok", "Jakarta"], tourCountry:["Taiwan", "Japan", "Malaysia", "Hong Kong", "Hong Kong", "South Korea", "Japan", "Singapore", "Thailand", "Indonesia"], tourVenue:["Taoyuan City Stadium", "Tokyo Dome", "Bukit Jalil National Stadium", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Songdo Moonlight Festival Park", "Kyocera Dome", "Singapore National Stadium", "Rajamangala Stadium", "Gelora Bung Karno Stadium"]});
// Celebrity.create({ celebName:"Justin Bieber", image:"grid-images/jb.jpg", fbLink:"https://www.facebook.com/JustinBieber/",   twitterLink:"https://twitter.com/justinbieber",  instaLink:"https://www.instagram.com/justinbieber/",       youtubeLink:"https://www.youtube.com/user/kidrauhl",         spotifyLink:"https://open.spotify.com/artist/1uNFoZAHBGtllmzznpCI3s",   soundcloudLink:"https://soundcloud.com/justinbieber",           itunesLink:"https://itunes.apple.com/us/artist/justin-bieber/320569549", amazonmusicLink:"https://music.amazon.com/artists/B002F0BWIM?tab=CATALOG" , googleplayLink:"https://play.google.com/store/music/artist/Justin_Bieber?id=A2mfgoustq7iqjdbvlenw7pnap4&hl=en", tourName:"Purpose Tour",        tourDates:["4 April 2019", "9 April 2019", "13 April 2019" , "4 April 2019", "17 April 2019", "18 April 2019", "21 April 2019", "23 April 2019", "26 April 2019", "29 April 2019"], tourCity:["Taoyuan", "Tokyo", "Kuala Lumpur", "Hong Kong", "Hong Kong", "Incheon", "Osaka", "Singapore", "Bangkok", "Jakarta"], tourCountry:["Taiwan", "Japan", "Malaysia", "Hong Kong", "Hong Kong", "South Korea", "Japan", "Singapore", "Thailand", "Indonesia"], tourVenue:["Taoyuan City Stadium", "Tokyo Dome", "Bukit Jalil National Stadium", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Songdo Moonlight Festival Park", "Kyocera Dome", "Singapore National Stadium", "Rajamangala Stadium", "Gelora Bung Karno Stadium"]});
// Celebrity.create({ celebName:"Evanescence",   image:"grid-images/ev.jpg", fbLink:"https://www.facebook.com/Evanescence/",    twitterLink:"https://twitter.com/evanescence",   instaLink:"https://www.instagram.com/evanesceneofficial/", youtubeLink:"https://www.youtube.com/user/evanescencevideo", spotifyLink:"https://open.spotify.com/artist/5nGIFgo0shDenQYSE0Sn7c",   soundcloudLink:"https://soundcloud.com/evanescence",            itunesLink:"https://itunes.apple.com/us/artist/evanescence/42102393",    amazonmusicLink:"https://music.amazon.com/artists/B0013TI0CC?tab=CATALOG",  googleplayLink:"https://play.google.com/store/music/artist/Evanescence?id=Aaf3rdtbepfze35cwlywocxyczy&hl=en",   tourName:"Synthesis Tour",      tourDates:["4 April 2019", "9 April 2019", "13 April 2019" , "4 April 2019", "17 April 2019", "18 April 2019", "21 April 2019", "23 April 2019", "26 April 2019", "29 April 2019"], tourCity:["Taoyuan", "Tokyo", "Kuala Lumpur", "Hong Kong", "Hong Kong", "Incheon", "Osaka", "Singapore", "Bangkok", "Jakarta"], tourCountry:["Taiwan", "Japan", "Malaysia", "Hong Kong", "Hong Kong", "South Korea", "Japan", "Singapore", "Thailand", "Indonesia"], tourVenue:["Taoyuan City Stadium", "Tokyo Dome", "Bukit Jalil National Stadium", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Fantasy Road Outdoor Venue Hong Kong Disneyland", "Songdo Moonlight Festival Park", "Kyocera Dome", "Singapore National Stadium", "Rajamangala Stadium", "Gelora Bung Karno Stadium"]});
