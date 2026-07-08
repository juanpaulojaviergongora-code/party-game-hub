import { useEffect, useMemo, useState } from "react";

const wouldYouRatherPrompts = [
  {
    id: "wyr-1",
    category: "Barkada",
    optionA: "Always choose the restaurant",
    optionB: "Always choose the playlist",
  },
  {
    id: "wyr-2",
    category: "Funny",
    optionA: "Speak only in song lyrics for one day",
    optionB: "Communicate only with emojis for one day",
  },
  {
    id: "wyr-3",
    category: "Food",
    optionA: "Eat breakfast food for dinner forever",
    optionB: "Eat dinner food for breakfast forever",
  },
  {
    id: "wyr-4",
    category: "Travel",
    optionA: "Have free flights forever",
    optionB: "Have free hotels forever",
  },
  {
    id: "wyr-5",
    category: "Barkada",
    optionA: "Be the first person to arrive",
    optionB: "Be the last person to leave",
  },
  {
    id: "wyr-6",
    category: "Funny",
    optionA: "Have a laugh that sounds like a horn",
    optionB: "Have a sneeze that sounds like a drumroll",
  },
  {
    id: "wyr-7",
    category: "Skills",
    optionA: "Be amazing at singing",
    optionB: "Be amazing at dancing",
  },
  {
    id: "wyr-8",
    category: "Movies",
    optionA: "Live inside a comedy movie",
    optionB: "Live inside an adventure movie",
  },
  {
    id: "wyr-9",
    category: "Food",
    optionA: "Never eat rice again",
    optionB: "Never eat fries again",
  },
  {
    id: "wyr-10",
    category: "Phone",
    optionA: "Lose your phone for one week",
    optionB: "Lose Wi-Fi for one week",
  },
  {
    id: "wyr-11",
    category: "Barkada",
    optionA: "Host every party",
    optionB: "Clean up after every party",
  },
  {
    id: "wyr-12",
    category: "Funny",
    optionA: "Wear socks on your hands",
    optionB: "Wear gloves on your feet",
  },
  {
    id: "wyr-13",
    category: "Music",
    optionA: "Only listen to old-school hits",
    optionB: "Only listen to new releases",
  },
  {
    id: "wyr-14",
    category: "Food",
    optionA: "Give up sweets for a year",
    optionB: "Give up salty snacks for a year",
  },
  {
    id: "wyr-15",
    category: "School / Work",
    optionA: "Have meetings every morning",
    optionB: "Have deadlines every Friday",
  },
  {
    id: "wyr-16",
    category: "Travel",
    optionA: "Go to the beach every weekend",
    optionB: "Go to the mountains every weekend",
  },
  {
    id: "wyr-17",
    category: "Funny",
    optionA: "Always have glitter on your face",
    optionB: "Always have confetti in your shoes",
  },
  {
    id: "wyr-18",
    category: "Barkada",
    optionA: "Be known as the funniest friend",
    optionB: "Be known as the most reliable friend",
  },
  {
    id: "wyr-19",
    category: "Superpower",
    optionA: "Read minds for five minutes a day",
    optionB: "Pause time for five minutes a day",
  },
  {
    id: "wyr-20",
    category: "Movies",
    optionA: "Watch the same movie every day for a month",
    optionB: "Watch no movies for a month",
  },
  {
    id: "wyr-21",
    category: "Food",
    optionA: "Only drink cold drinks",
    optionB: "Only drink hot drinks",
  },
  {
    id: "wyr-22",
    category: "Phone",
    optionA: "Use a flip phone for a year",
    optionB: "Use a phone with no camera for a year",
  },
  {
    id: "wyr-23",
    category: "Funny",
    optionA: "Have your favorite song play every time you enter a room",
    optionB: "Have a laugh track play after every joke you tell",
  },
  {
    id: "wyr-24",
    category: "Barkada",
    optionA: "Be the group photographer",
    optionB: "Be the group driver",
  },
  {
    id: "wyr-25",
    category: "Skills",
    optionA: "Learn any language instantly",
    optionB: "Learn any instrument instantly",
  },
  {
    id: "wyr-26",
    category: "Travel",
    optionA: "Travel with no luggage",
    optionB: "Travel with no phone",
  },
  {
    id: "wyr-27",
    category: "Funny",
    optionA: "Have a talking pet",
    optionB: "Have a tiny personal robot",
  },
  {
    id: "wyr-28",
    category: "Food",
    optionA: "Only eat homemade food",
    optionB: "Only eat restaurant food",
  },
  {
    id: "wyr-29",
    category: "Barkada",
    optionA: "Be in charge of party games",
    optionB: "Be in charge of karaoke songs",
  },
  {
    id: "wyr-30",
    category: "Dream Life",
    optionA: "Have more free time",
    optionB: "Have more travel money",
  },
  {
    id: "wyr-31",
    category: "Barkada",
    optionA: "Always plan the group trip",
    optionB: "Always pay the group bill first and collect later",
  },
  {
    id: "wyr-32",
    category: "Funny",
    optionA: "Have a tiny marching band follow you for one day",
    optionB: "Have a spotlight follow you for one day",
  },
  {
    id: "wyr-33",
    category: "Food",
    optionA: "Eat only spicy food for a month",
    optionB: "Eat only sweet food for a month",
  },
  {
    id: "wyr-34",
    category: "Travel",
    optionA: "Visit a new city every month",
    optionB: "Return to your favorite place every month",
  },
  {
    id: "wyr-35",
    category: "Skills",
    optionA: "Be able to draw anything perfectly",
    optionB: "Be able to cook anything perfectly",
  },
  {
    id: "wyr-36",
    category: "Phone",
    optionA: "Have unlimited battery forever",
    optionB: "Have unlimited mobile data forever",
  },
  {
    id: "wyr-37",
    category: "Barkada",
    optionA: "Always be the designated photographer",
    optionB: "Always be the designated DJ",
  },
  {
    id: "wyr-38",
    category: "Funny",
    optionA: "Have hiccups every time you laugh",
    optionB: "Have to whisper every time you are excited",
  },
  {
    id: "wyr-39",
    category: "School / Work",
    optionA: "Work four long days a week",
    optionB: "Work five shorter days a week",
  },
  {
    id: "wyr-40",
    category: "Movies",
    optionA: "Star in a comedy",
    optionB: "Star in an action movie",
  },
  {
    id: "wyr-41",
    category: "Food",
    optionA: "Only eat food with a spoon",
    optionB: "Only eat food with a fork",
  },
  {
    id: "wyr-42",
    category: "Dream Life",
    optionA: "Live in a small cozy house",
    optionB: "Live in a big busy city apartment",
  },
  {
    id: "wyr-43",
    category: "Funny",
    optionA: "Always have to wear one mismatched shoe",
    optionB: "Always have to wear one mismatched sock",
  },
  {
    id: "wyr-44",
    category: "Music",
    optionA: "Be able to sing every high note",
    optionB: "Be able to play every guitar solo",
  },
  {
    id: "wyr-45",
    category: "Travel",
    optionA: "Take a train everywhere",
    optionB: "Take a boat everywhere",
  },
  {
    id: "wyr-46",
    category: "Barkada",
    optionA: "Be the person everyone calls for advice",
    optionB: "Be the person everyone calls for fun plans",
  },
  {
    id: "wyr-47",
    category: "Superpower",
    optionA: "Teleport once a day",
    optionB: "Fly for ten minutes a day",
  },
  {
    id: "wyr-48",
    category: "Funny",
    optionA: "Have your thoughts appear as subtitles",
    optionB: "Have your mood appear as a color above your head",
  },
  {
    id: "wyr-49",
    category: "Food",
    optionA: "Never eat dessert again",
    optionB: "Never eat chips again",
  },
  {
    id: "wyr-50",
    category: "School / Work",
    optionA: "Always present first",
    optionB: "Always present last",
  },
  {
    id: "wyr-51",
    category: "Movies",
    optionA: "Know how every movie ends",
    optionB: "Never know how any movie ends",
  },
  {
    id: "wyr-52",
    category: "Phone",
    optionA: "Have no social media for a year",
    optionB: "Have no streaming apps for a year",
  },
  {
    id: "wyr-53",
    category: "Barkada",
    optionA: "Win every board game",
    optionB: "Win every karaoke battle",
  },
  {
    id: "wyr-54",
    category: "Funny",
    optionA: "Walk with a bounce forever",
    optionB: "Talk with a rhyme forever",
  },
  {
    id: "wyr-55",
    category: "Skills",
    optionA: "Be great at fixing anything",
    optionB: "Be great at organizing anything",
  },
  {
    id: "wyr-56",
    category: "Travel",
    optionA: "Travel only with friends",
    optionB: "Travel only with family",
  },
  {
    id: "wyr-57",
    category: "Food",
    optionA: "Have unlimited halo-halo",
    optionB: "Have unlimited pizza",
  },
  {
    id: "wyr-58",
    category: "Dream Life",
    optionA: "Have a personal chef",
    optionB: "Have a personal driver",
  },
  {
    id: "wyr-59",
    category: "Funny",
    optionA: "Always accidentally use the wrong name",
    optionB: "Always accidentally wave at strangers",
  },
  {
    id: "wyr-60",
    category: "Barkada",
    optionA: "Be in every group photo",
    optionB: "Never be in any group photo",
  },
  {
    id: "wyr-61",
    category: "Music",
    optionA: "Choose every road-trip song",
    optionB: "Choose every movie-night film",
  },
  {
    id: "wyr-62",
    category: "Superpower",
    optionA: "Understand every animal",
    optionB: "Understand every language",
  },
  {
    id: "wyr-63",
    category: "School / Work",
    optionA: "Get an extra hour of sleep",
    optionB: "Get an extra hour of free time",
  },
  {
    id: "wyr-64",
    category: "Funny",
    optionA: "Have a dramatic sound effect after every step",
    optionB: "Have a tiny applause after every sentence",
  },
  {
    id: "wyr-65",
    category: "Food",
    optionA: "Only eat breakfast at midnight",
    optionB: "Only eat dinner at sunrise",
  },
  {
    id: "wyr-66",
    category: "Movies",
    optionA: "Live in a fantasy world",
    optionB: "Live in a sci-fi world",
  },
  {
    id: "wyr-67",
    category: "Travel",
    optionA: "Stay in a luxury hotel once",
    optionB: "Travel on a budget many times",
  },
  {
    id: "wyr-68",
    category: "Barkada",
    optionA: "Have everyone know your funniest story",
    optionB: "Have everyone know your most embarrassing story",
  },
  {
    id: "wyr-69",
    category: "Skills",
    optionA: "Remember every name you hear",
    optionB: "Remember every face you see",
  },
  {
    id: "wyr-70",
    category: "Funny",
    optionA: "Have permanent bed hair",
    optionB: "Have permanent glitter on your clothes",
  },
  {
    id: "wyr-71",
    category: "Food",
    optionA: "Eat adobo every week",
    optionB: "Eat sinigang every week",
  },
  {
    id: "wyr-72",
    category: "Phone",
    optionA: "Only send voice messages",
    optionB: "Only send text messages",
  },
  {
    id: "wyr-73",
    category: "Dream Life",
    optionA: "Have a home near the beach",
    optionB: "Have a home near the mountains",
  },
  {
    id: "wyr-74",
    category: "Barkada",
    optionA: "Be the friend who always brings snacks",
    optionB: "Be the friend who always brings games",
  },
  {
    id: "wyr-75",
    category: "Funny",
    optionA: "Be able to speak to plants",
    optionB: "Be able to speak to household objects",
  },
  {
    id: "wyr-76",
    category: "Music",
    optionA: "Have a perfect singing voice",
    optionB: "Have perfect rhythm",
  },
  {
    id: "wyr-77",
    category: "School / Work",
    optionA: "Never have homework again",
    optionB: "Never have group projects again",
  },
  {
    id: "wyr-78",
    category: "Travel",
    optionA: "Explore a new country alone",
    optionB: "Explore a new country with your barkada",
  },
  {
    id: "wyr-79",
    category: "Food",
    optionA: "Only drink milk tea",
    optionB: "Only drink iced coffee",
  },
  {
    id: "wyr-80",
    category: "Movies",
    optionA: "Be a superhero sidekick",
    optionB: "Be a movie villain's assistant",
  },
  {
    id: "wyr-81",
    category: "Funny",
    optionA: "Always have to introduce yourself with a dance",
    optionB: "Always have to leave a room with a bow",
  },
  {
    id: "wyr-82",
    category: "Skills",
    optionA: "Type extremely fast",
    optionB: "Talk extremely fast",
  },
  {
    id: "wyr-83",
    category: "Barkada",
    optionA: "Plan the surprise party",
    optionB: "Be surprised at the surprise party",
  },
  {
    id: "wyr-84",
    category: "Superpower",
    optionA: "Make one object invisible",
    optionB: "Make one object float",
  },
  {
    id: "wyr-85",
    category: "Dream Life",
    optionA: "Get free food forever",
    optionB: "Get free clothes forever",
  },
  {
    id: "wyr-86",
    category: "Food",
    optionA: "Only eat crunchy food",
    optionB: "Only eat soft food",
  },
  {
    id: "wyr-87",
    category: "Phone",
    optionA: "Use only a tablet",
    optionB: "Use only a laptop",
  },
  {
    id: "wyr-88",
    category: "Funny",
    optionA: "Have a personal theme song",
    optionB: "Have a personal catchphrase",
  },
  {
    id: "wyr-89",
    category: "Travel",
    optionA: "Go camping every weekend",
    optionB: "Go glamping every weekend",
  },
  {
    id: "wyr-90",
    category: "Barkada",
    optionA: "Always know the latest gossip",
    optionB: "Always know the best hidden food spots",
  },
  {
    id: "wyr-91",
    category: "Movies",
    optionA: "Have unlimited movie tickets",
    optionB: "Have unlimited concert tickets",
  },
  {
    id: "wyr-92",
    category: "School / Work",
    optionA: "Always have an early schedule",
    optionB: "Always have a late schedule",
  },
  {
    id: "wyr-93",
    category: "Skills",
    optionA: "Be great at public speaking",
    optionB: "Be great at making people laugh",
  },
  {
    id: "wyr-94",
    category: "Funny",
    optionA: "Have your voice sound like a robot",
    optionB: "Have your voice sound like a cartoon character",
  },
  {
    id: "wyr-95",
    category: "Food",
    optionA: "Never eat fast food again",
    optionB: "Never eat home-cooked food again",
  },
  {
    id: "wyr-96",
    category: "Dream Life",
    optionA: "Own a small business",
    optionB: "Work at your dream company",
  },
  {
    id: "wyr-97",
    category: "Barkada",
    optionA: "Always be picked first for teams",
    optionB: "Always be the team captain",
  },
  {
    id: "wyr-98",
    category: "Superpower",
    optionA: "See one hour into the future",
    optionB: "See one hour into the past",
  },
  {
    id: "wyr-99",
    category: "Music",
    optionA: "Only listen to live music",
    optionB: "Only listen to studio recordings",
  },
  {
    id: "wyr-100",
    category: "Funny",
    optionA: "Have a tiny cloud rain on you when sad",
    optionB: "Have confetti appear when happy",
  },

  {
    id: "wyr-101",
    category: "Tagalog Kulitan",
    optionA: "Mag-vlog nang malakas sa jeep nang isang minuto",
    optionB: "Magkunwaring food influencer sa grocery aisle nang isang minuto",
  },
  {
    id: "wyr-102",
    category: "Nakakahiya",
    optionA: "Mag-rap ng order mo sa fast-food counter",
    optionB: "Kantahin ang pangalan mo bago ka magsalita buong araw",
  },
  {
    id: "wyr-103",
    category: "Tagalog Kulitan",
    optionA: "Magpanggap na contestant sa noontime show kapag may simpleng tanong",
    optionB: "Sumagot ng parang reporter kapag may kumakausap sa iyo",
  },
  {
    id: "wyr-104",
    category: "Nakakahiya",
    optionA: "Mag-selfie pose tuwing may nagsasabing picture",
    optionB: "Mag-thumbs up sa lahat ng sasabihin ng barkada sa loob ng isang oras",
  },
  {
    id: "wyr-105",
    category: "Tagalog Kulitan",
    optionA: "Magsalita na parang bida sa teleserye nang isang round",
    optionB: "Magsalita na parang game-show host nang isang round",
  },
  {
    id: "wyr-106",
    category: "Nakakahiya",
    optionA: "Maglakad na parang may runway kahit saan",
    optionB: "Mag-bow tuwing may tatawag sa pangalan mo",
  },
  {
    id: "wyr-107",
    category: "Tagalog Kulitan",
    optionA: "Magbigay ng weather report tungkol sa mood ng barkada",
    optionB: "Magbigay ng traffic report tungkol sa pila sa pagkain",
  },
  {
    id: "wyr-108",
    category: "Nakakahiya",
    optionA: "Magkunwaring may sariling theme song at humuni bago umupo",
    optionB: "Magkunwaring celebrity na may imaginary camera crew",
  },
  {
    id: "wyr-109",
    category: "Tagalog Kulitan",
    optionA: "Magbenta ng tubig na parang live seller",
    optionB: "Magbenta ng tissue na parang may malaking discount",
  },
  {
    id: "wyr-110",
    category: "Nakakahiya",
    optionA: "Mag-order gamit ang boses ng cartoon character",
    optionB: "Magpasalamat na parang tumanggap ng award",
  },
  {
    id: "wyr-111",
    category: "Tagalog Kulitan",
    optionA: "Magpanggap na barangay announcer kapag may sasabihin",
    optionB: "Magpanggap na radio DJ kapag magpapakilala",
  },
  {
    id: "wyr-112",
    category: "Nakakahiya",
    optionA: "Magpaliwanag ng simpleng bagay na parang professor",
    optionB: "Mag-react sa bawat joke na parang may laugh track",
  },
  {
    id: "wyr-113",
    category: "Tagalog Kulitan",
    optionA: "Magbigay ng motivational speech bago kumain",
    optionB: "Magbigay ng closing remarks pagkatapos kumain",
  },
  {
    id: "wyr-114",
    category: "Nakakahiya",
    optionA: "Mag-dance move tuwing may notification sound",
    optionB: "Mag-pose na parang album cover tuwing may camera",
  },
  {
    id: "wyr-115",
    category: "Tagalog Kulitan",
    optionA: "Magpanggap na contestant sa singing contest habang nagsasalita",
    optionB: "Magpanggap na judge sa talent show habang nagbibigay ng opinyon",
  },
  {
    id: "wyr-116",
    category: "Nakakahiya",
    optionA: "Tumawa na parang kontrabida sa bawat funny story",
    optionB: "Mag-gasp na parang shocked sa bawat normal na balita",
  },
  {
    id: "wyr-117",
    category: "Tagalog Kulitan",
    optionA: "Magbasa ng menu na parang dramatic poem",
    optionB: "Magbasa ng group chat na parang teleserye script",
  },
  {
    id: "wyr-118",
    category: "Nakakahiya",
    optionA: "Mag-high five sa sarili pagkatapos ng bawat sentence",
    optionB: "Mag-finger heart sa hangin pagkatapos ng bawat sentence",
  },
  {
    id: "wyr-119",
    category: "Tagalog Kulitan",
    optionA: "Magpanggap na may cooking show habang kumakain",
    optionB: "Magpanggap na travel vlogger habang naglalakad sa bahay",
  },
  {
    id: "wyr-120",
    category: "Nakakahiya",
    optionA: "Maglakad na parang robot sa susunod na tatlong lakad",
    optionB: "Maglakad na parang slow motion sa susunod na tatlong lakad",
  },
  {
    id: "wyr-121",
    category: "Tagalog Kulitan",
    optionA: "Magbigay ng horoscope ng barkada gamit lang ang pagkain",
    optionB: "Magbigay ng love advice na parang tita sa reunion",
  },
  {
    id: "wyr-122",
    category: "Nakakahiya",
    optionA: "Magkunwaring may microphone habang nagsasalita",
    optionB: "Magkunwaring may headset habang may kausap",
  },
  {
    id: "wyr-123",
    category: "Tagalog Kulitan",
    optionA: "Magpanggap na quiz bee contestant kapag may tanong",
    optionB: "Magpanggap na news anchor kapag may chismis",
  },
  {
    id: "wyr-124",
    category: "Nakakahiya",
    optionA: "Mag-salute bago umalis ng room",
    optionB: "Mag-wave na parang pageant contestant bago umalis ng room",
  },
  {
    id: "wyr-125",
    category: "Tagalog Kulitan",
    optionA: "Mag-commentate sa nangyayari na parang basketball announcer",
    optionB: "Mag-commentate sa nangyayari na parang boxing announcer",
  },
  {
    id: "wyr-126",
    category: "Nakakahiya",
    optionA: "Magpanggap na may invisible pet at kausapin ito",
    optionB: "Magpanggap na may invisible assistant at utusan ito",
  },
  {
    id: "wyr-127",
    category: "Tagalog Kulitan",
    optionA: "Magsalita gamit ang sobrang lalim na Tagalog nang isang minute",
    optionB: "Magsalita gamit ang sobrang formal na English nang isang minute",
  },
  {
    id: "wyr-128",
    category: "Nakakahiya",
    optionA: "Magpanggap na may award acceptance speech pagkatapos manalo sa rock-paper-scissors",
    optionB: "Magpanggap na may press conference pagkatapos matalo sa rock-paper-scissors",
  },
  {
    id: "wyr-129",
    category: "Tagalog Kulitan",
    optionA: "Magbenta ng ulam na parang TV commercial",
    optionB: "Magbenta ng tsinelas na parang luxury product",
  },
  {
    id: "wyr-130",
    category: "Nakakahiya",
    optionA: "Magbigay ng pangalan sa bawat snack na makikita mo",
    optionB: "Magbigay ng nickname sa bawat upuan na makikita mo",
  },
  {
    id: "wyr-131",
    category: "Tagalog Kulitan",
    optionA: "Magpanggap na barangay captain habang nag-aassign ng upuan",
    optionB: "Magpanggap na teacher habang nagbibilang ng players",
  },
  {
    id: "wyr-132",
    category: "Nakakahiya",
    optionA: "Mag-beatbox bago magsabi ng isang request",
    optionB: "Mag-whisper na parang may secret mission bago magsabi ng isang request",
  },
  {
    id: "wyr-133",
    category: "Tagalog Kulitan",
    optionA: "Magbasa ng random sentence na parang hugot line",
    optionB: "Magbasa ng random sentence na parang spoken poetry",
  },
  {
    id: "wyr-134",
    category: "Nakakahiya",
    optionA: "Magpanggap na mannequin kapag may tumitingin sa iyo",
    optionB: "Magpanggap na security guard kapag may dadaan",
  },
  {
    id: "wyr-135",
    category: "Tagalog Kulitan",
    optionA: "Magbigay ng food review sa tubig",
    optionB: "Magbigay ng movie review sa isang electric fan",
  },
  {
    id: "wyr-136",
    category: "Nakakahiya",
    optionA: "Mag-clap para sa sarili pagkatapos ng bawat challenge",
    optionB: "Mag-cheer para sa sarili na parang nasa stadium",
  },
  {
    id: "wyr-137",
    category: "Tagalog Kulitan",
    optionA: "Magpanggap na host ng raffle kapag pipili ng next player",
    optionB: "Magpanggap na host ng pageant kapag tatawag ng next player",
  },
  {
    id: "wyr-138",
    category: "Nakakahiya",
    optionA: "Mag-announce ng imaginary sale sa buong room",
    optionB: "Mag-announce ng imaginary emergency dahil ubos na ang snacks",
  },
  {
    id: "wyr-139",
    category: "Tagalog Kulitan",
    optionA: "Magsabi ng good morning kahit gabi na sa bawat bagong kausap",
    optionB: "Magsabi ng magandang gabi kahit umaga sa bawat bagong kausap",
  },
  {
    id: "wyr-140",
    category: "Nakakahiya",
    optionA: "Mag-pretend na may dance battle challenge bago umupo",
    optionB: "Mag-pretend na may magic trick bago tumayo",
  },
  {
    id: "wyr-141",
    category: "Tagalog Kulitan",
    optionA: "Magbigay ng documentary narration tungkol sa isang kaibigan",
    optionB: "Magbigay ng nature documentary narration tungkol sa pagkain",
  },
  {
    id: "wyr-142",
    category: "Nakakahiya",
    optionA: "Magpanggap na may fan club at batiin sila",
    optionB: "Magpanggap na may haters at sagutin sila politely",
  },
  {
    id: "wyr-143",
    category: "Tagalog Kulitan",
    optionA: "Mag-order ng tubig na parang may royal accent",
    optionB: "Magpasalamat sa pagkain na parang may coronation speech",
  },
  {
    id: "wyr-144",
    category: "Nakakahiya",
    optionA: "Mag-dramatic exit kahit pupunta lang sa kabilang side ng room",
    optionB: "Mag-dramatic entrance kahit babalik lang sa upuan",
  },
  {
    id: "wyr-145",
    category: "Tagalog Kulitan",
    optionA: "Magpanggap na may teleserye cliffhanger bago magbigay ng sagot",
    optionB: "Magpanggap na may commercial break bago magbigay ng sagot",
  },
  {
    id: "wyr-146",
    category: "Nakakahiya",
    optionA: "Mag-quiz yourself out loud bago pumili ng pagkain",
    optionB: "Mag-interview yourself out loud bago pumili ng kanta",
  },
  {
    id: "wyr-147",
    category: "Tagalog Kulitan",
    optionA: "Magbigay ng slogan sa bawat player",
    optionB: "Magbigay ng campaign promise sa bawat player",
  },
  {
    id: "wyr-148",
    category: "Nakakahiya",
    optionA: "Magpanggap na may fashion show habang naglalakad",
    optionB: "Magpanggap na may slow-motion action scene habang naglalakad",
  },
  {
    id: "wyr-149",
    category: "Tagalog Kulitan",
    optionA: "Magbigay ng voice-over sa sariling ginagawa nang isang minuto",
    optionB: "Magbigay ng tutorial sa pag-upo nang isang minuto",
  },
  {
    id: "wyr-150",
    category: "Nakakahiya",
    optionA: "Magpanggap na may imaginary audience at mag-thank you sa kanila",
    optionB: "Magpanggap na may imaginary sponsor at banggitin sila sa bawat sentence",
  },
];


function getSavedCustomQuestions() {
  try {
    const saved = localStorage.getItem("party-wyr-custom-questions");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function getRandomWouldYouRatherPrompt(prompts, usedIds, currentId) {
  let choices = prompts.filter(
    (prompt) => !usedIds.includes(prompt.id) && prompt.id !== currentId
  );

  if (choices.length === 0) {
    choices = prompts.filter((prompt) => prompt.id !== currentId);
  }

  return choices[Math.floor(Math.random() * choices.length)] || prompts[0];
}

export default function WouldYouRather({ onBack, onSound }) {
  const [players, setPlayers] = useState(["Player 1", "Player 2", "Player 3"]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [screen, setScreen] = useState("setup");
  const [question, setQuestion] = useState(null);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [votes, setVotes] = useState([]);
  const [roundNumber, setRoundNumber] = useState(1);

  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [customQuestions, setCustomQuestions] = useState(getSavedCustomQuestions);
  const [customCategory, setCustomCategory] = useState("");
  const [customOptionA, setCustomOptionA] = useState("");
  const [customOptionB, setCustomOptionB] = useState("");
  const [setupError, setSetupError] = useState("");
  const [questionError, setQuestionError] = useState("");

  const allQuestions = useMemo(
    () => [...wouldYouRatherPrompts, ...customQuestions],
    [customQuestions]
  );

  const currentPlayerName =
    players[playerIndex]?.trim() || `Player ${playerIndex + 1}`;

  const voteSummary = useMemo(() => {
    const aVotes = votes.filter((vote) => vote.choice === "a").length;
    const bVotes = votes.filter((vote) => vote.choice === "b").length;

    if (!question) {
      return {
        aVotes,
        bVotes,
        losingChoice: null,
        isTie: false,
      };
    }

    return {
      aVotes,
      bVotes,
      losingChoice: aVotes === bVotes ? null : aVotes < bVotes ? "a" : "b",
      isTie: aVotes === bVotes,
    };
  }, [question, votes]);

  const losingPlayerNames = useMemo(() => {
    if (!voteSummary.losingChoice) return [];

    return votes
      .filter((vote) => vote.choice === voteSummary.losingChoice)
      .map(
        (vote) =>
          players[vote.playerIndex]?.trim() || `Player ${vote.playerIndex + 1}`
      );
  }, [players, votes, voteSummary.losingChoice]);

  useEffect(() => {
    localStorage.setItem(
      "party-wyr-custom-questions",
      JSON.stringify(customQuestions)
    );
  }, [customQuestions]);

  function getReadyPlayers() {
    return players.map((player, index) => player.trim() || `Player ${index + 1}`);
  }

  function updatePlayer(index, value) {
    setPlayers((oldPlayers) =>
      oldPlayers.map((player, playerNumber) =>
        playerNumber === index ? value : player
      )
    );
  }

  function addPlayer() {
    const cleanedName = newPlayerName.trim();

    if (!cleanedName) return;

    setPlayers((oldPlayers) => [...oldPlayers, cleanedName]);
    setNewPlayerName("");
    setSetupError("");
  }

  function removePlayer(index) {
    if (players.length <= 2) return;

    setPlayers((oldPlayers) =>
      oldPlayers.filter((_, playerNumber) => playerNumber !== index)
    );
  }

  function addCustomQuestion() {
    const optionA = customOptionA.trim();
    const optionB = customOptionB.trim();
    const category = customCategory.trim() || "Custom";

    if (!optionA || !optionB) {
      setQuestionError("Write both Option A and Option B before saving.");
      return;
    }

    const customQuestion = {
      id: `custom-wyr-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      category,
      optionA,
      optionB,
      isCustom: true,
    };

    setCustomQuestions((oldQuestions) => [...oldQuestions, customQuestion]);
    setCustomCategory("");
    setCustomOptionA("");
    setCustomOptionB("");
    setQuestionError("");
    setShowQuestionEditor(false);
  }

  function removeCustomQuestion(id) {
    setCustomQuestions((oldQuestions) =>
      oldQuestions.filter((customQuestion) => customQuestion.id !== id)
    );
  }

  function beginFirstRound() {
    const readyPlayers = getReadyPlayers();

    if (readyPlayers.length < 2) {
      setSetupError("Add at least two players before starting.");
      return;
    }

    const firstQuestion = getRandomWouldYouRatherPrompt(allQuestions, [], "");

    if (!firstQuestion) {
      setSetupError("Add a question before starting the game.");
      return;
    }

    setPlayers(readyPlayers);
    setQuestion(firstQuestion);
    setUsedQuestionIds([firstQuestion.id]);
    setVotes([]);
    setPlayerIndex(0);
    setRoundNumber(1);
    setScreen("pass");
    setSetupError("");
    onSound?.("card");
  }

  function castVote(choice) {
    const updatedVotes = [
      ...votes,
      {
        playerIndex,
        choice,
      },
    ];

    setVotes(updatedVotes);

    if (playerIndex === players.length - 1) {
      setScreen("results");
      onSound?.("winner");
      return;
    }

    setPlayerIndex((oldIndex) => oldIndex + 1);
    setScreen("pass");
  }

  function nextQuestion() {
    let previousUsed = usedQuestionIds;

    if (previousUsed.length >= allQuestions.length) {
      previousUsed = [];
    }

    const nextPrompt = getRandomWouldYouRatherPrompt(
      allQuestions,
      previousUsed,
      question?.id
    );

    setQuestion(nextPrompt);
    setUsedQuestionIds([...previousUsed, nextPrompt.id]);
    setVotes([]);
    setPlayerIndex(0);
    setRoundNumber((oldRound) => oldRound + 1);
    setScreen("pass");
    onSound?.("card");
  }

  function restartGame() {
    setScreen("setup");
    setQuestion(null);
    setUsedQuestionIds([]);
    setVotes([]);
    setPlayerIndex(0);
    setRoundNumber(1);
    setSetupError("");
  }

  return (
    <>
      <style>{`
        #would-you-rather {
          --wyr-cream: #fff0c2;
          --wyr-gold: #ffd36c;
          --wyr-muted: #efd5a7;
          --wyr-line: rgba(255, 222, 143, 0.48);
          --wyr-line-soft: rgba(255, 222, 143, 0.28);
          --wyr-panel: rgba(104, 45, 13, 0.86);
          --wyr-panel-deep: rgba(54, 18, 5, 0.94);
          width: min(100%, 1120px) !important;
          max-width: 1120px !important;
          margin: 0 auto !important;
          padding: clamp(18px, 3vw, 30px) !important;
          border: 1px solid var(--wyr-line) !important;
          border-radius: 24px !important;
          background:
            linear-gradient(145deg, rgba(72, 29, 9, 0.82), rgba(35, 10, 3, 0.90)) !important;
          box-shadow:
            0 20px 48px rgba(23, 6, 1, 0.30),
            inset 0 1px 0 rgba(255, 242, 203, 0.09) !important;
          color: var(--wyr-cream);
          box-sizing: border-box;
        }

        #would-you-rather .back-button {
          margin: 0 0 24px;
        }

        #would-you-rather .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin: 0 0 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--wyr-line-soft);
        }

        #would-you-rather .section-heading .eyebrow {
          margin: 0 0 6px;
          color: var(--wyr-gold);
          font-size: 0.70rem;
          font-weight: 1000;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        #would-you-rather .section-heading h2 {
          margin: 0;
          color: var(--wyr-cream);
          font-size: clamp(1.6rem, 3.4vw, 2.35rem);
          line-height: 1.05;
          text-shadow: 2px 2px 0 rgba(41, 12, 2, 0.42);
        }

        #would-you-rather .wyr-shell {
          display: grid;
          grid-template-columns: 315px minmax(0, 1fr);
          gap: 22px;
          align-items: stretch;
        }

        #would-you-rather .wyr-setup-card,
        #would-you-rather .wyr-stage,
        #would-you-rather .wyr-result-card,
        #would-you-rather .wyr-custom-question-card {
          border: 1px solid var(--wyr-line);
          border-radius: 20px;
          background:
            radial-gradient(circle at 82% 10%, rgba(255, 210, 108, 0.11), transparent 24%),
            linear-gradient(145deg, var(--wyr-panel), var(--wyr-panel-deep));
          color: var(--wyr-cream);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.07),
            0 10px 24px rgba(24, 6, 1, 0.13);
        }

        #would-you-rather .wyr-setup-card {
          padding: 22px;
        }

        #would-you-rather .wyr-setup-card h3,
        #would-you-rather .wyr-custom-question-card h4,
        #would-you-rather .wyr-result-card h3 {
          margin: 0;
          color: var(--wyr-cream);
          font-size: 1.28rem;
        }

        #would-you-rather .wyr-setup-card h3::before {
          content: "✦";
          display: inline-grid;
          place-items: center;
          width: 28px;
          height: 28px;
          margin-right: 9px;
          border: 1px solid rgba(255, 220, 134, 0.45);
          border-radius: 50%;
          color: var(--wyr-gold);
          font-size: .86rem;
          vertical-align: 2px;
        }

        #would-you-rather .small-text {
          margin: 14px 0 0;
          color: var(--wyr-muted);
          font-size: .91rem;
          line-height: 1.55;
        }

        #would-you-rather .wyr-player-list {
          display: grid;
          gap: 9px;
          margin: 17px 0;
        }

        #would-you-rather .wyr-player-row,
        #would-you-rather .wyr-add-player {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 8px;
        }

        #would-you-rather input,
        #would-you-rather textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid rgba(255, 222, 143, 0.50);
          border-radius: 10px;
          background: rgba(47, 14, 3, 0.82);
          color: var(--wyr-cream);
          font: inherit;
        }

        #would-you-rather input {
          min-height: 45px;
          padding: 0 11px;
        }

        #would-you-rather textarea {
          min-height: 74px;
          padding: 10px 11px;
          color: var(--wyr-muted);
          line-height: 1.45;
          resize: vertical;
        }

        #would-you-rather input::placeholder,
        #would-you-rather textarea::placeholder {
          color: rgba(255, 231, 181, 0.54);
        }

        #would-you-rather input:focus,
        #would-you-rather textarea:focus {
          outline: 2px solid rgba(255, 211, 108, 0.44);
          outline-offset: 2px;
        }

        #would-you-rather .primary-button,
        #would-you-rather .secondary-button,
        #would-you-rather .danger-button,
        #would-you-rather .reset-link {
          min-height: 45px;
          border: 1px solid rgba(255, 225, 151, 0.64);
          border-radius: 11px;
          cursor: pointer;
          font: inherit;
          font-weight: 1000;
          letter-spacing: .015em;
          transition: transform .18s ease, box-shadow .18s ease;
        }

        #would-you-rather .primary-button {
          background: linear-gradient(145deg, #c42a33, #710d16);
          color: #fff6df;
          box-shadow: 0 5px 0 rgba(67, 6, 12, .62);
        }

        #would-you-rather .secondary-button,
        #would-you-rather .reset-link {
          background: linear-gradient(145deg, #84501a, #3e1d08);
          color: #fff0c2;
          box-shadow: 0 5px 0 rgba(38, 13, 4, .58);
        }

        #would-you-rather .danger-button {
          background: linear-gradient(145deg, #97251e, #500909);
          color: #fff1e0;
          box-shadow: 0 4px 0 rgba(48, 5, 5, .54);
        }

        #would-you-rather button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        #would-you-rather button:active:not(:disabled) {
          transform: translateY(1px);
        }

        #would-you-rather button:disabled {
          cursor: not-allowed;
          opacity: .55;
        }

        #would-you-rather .full-width {
          width: 100%;
          margin-top: 17px;
        }

        #would-you-rather .wyr-rule-note {
          margin: 16px 0;
          padding: 13px;
          border-left: 3px solid var(--wyr-gold);
          border-radius: 0 12px 12px 0;
          background: rgba(255, 210, 96, 0.10);
          color: #f9e4b7;
          font-size: .90rem;
          line-height: 1.55;
        }

        #would-you-rather .wyr-question-toggle {
          width: 100%;
          margin-top: 11px;
        }

        #would-you-rather .wyr-custom-question-card {
          margin-top: 15px;
          padding: 15px;
          border-radius: 15px;
          background:
            linear-gradient(145deg, rgba(75, 28, 8, 0.84), rgba(43, 13, 4, 0.92));
        }

        #would-you-rather .wyr-custom-question-card h4 {
          font-size: 1rem;
        }

        #would-you-rather .wyr-custom-question-card .small-text {
          margin-top: 7px;
          font-size: .82rem;
        }

        #would-you-rather .wyr-custom-fields {
          display: grid;
          gap: 9px;
          margin-top: 13px;
        }

        #would-you-rather .wyr-custom-question-card .primary-button {
          width: 100%;
          margin-top: 11px;
        }

        #would-you-rather .wyr-custom-list {
          display: grid;
          gap: 8px;
          margin-top: 14px;
          padding-top: 13px;
          border-top: 1px solid var(--wyr-line-soft);
        }

        #would-you-rather .wyr-custom-list-title {
          margin: 0;
          color: var(--wyr-gold);
          font-size: .76rem;
          font-weight: 1000;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        #would-you-rather .wyr-custom-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 8px;
          align-items: start;
          padding: 9px;
          border: 1px solid rgba(255, 222, 143, .22);
          border-radius: 10px;
          background: rgba(31, 9, 2, .42);
        }

        #would-you-rather .wyr-custom-item strong,
        #would-you-rather .wyr-custom-item span {
          display: block;
        }

        #would-you-rather .wyr-custom-item strong {
          color: var(--wyr-cream);
          font-size: .78rem;
        }

        #would-you-rather .wyr-custom-item span {
          margin-top: 4px;
          color: var(--wyr-muted);
          font-size: .73rem;
          line-height: 1.35;
        }

        #would-you-rather .wyr-custom-item .danger-button {
          min-height: 34px;
          padding: 0 8px;
          font-size: .72rem;
        }

        #would-you-rather .form-error {
          margin: 11px 0 0;
          color: #ffd0c8;
          font-size: .83rem;
          font-weight: 800;
          line-height: 1.45;
        }

        #would-you-rather .wyr-stage {
          position: relative;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 30px;
          text-align: center;
          background:
            radial-gradient(circle at 50% 30%, rgba(255, 214, 117, 0.10), transparent 25%),
            linear-gradient(145deg, rgba(91, 35, 10, 0.96), rgba(42, 12, 3, 0.98));
        }

        #would-you-rather .wyr-stage::before,
        #would-you-rather .wyr-stage::after {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: rgba(255, 214, 107, 0.84);
          pointer-events: none;
        }

        #would-you-rather .wyr-stage::before {
          top: 18px;
          left: 18px;
          border-top: 2px solid;
          border-left: 2px solid;
          border-radius: 7px 0 0 0;
        }

        #would-you-rather .wyr-stage::after {
          right: 18px;
          bottom: 18px;
          border-right: 2px solid;
          border-bottom: 2px solid;
          border-radius: 0 0 7px 0;
        }

        #would-you-rather .wyr-stage-content,
        #would-you-rather .wyr-result-card {
          position: relative;
          z-index: 1;
          width: min(100%, 760px);
        }

        #would-you-rather .wyr-stage-content h2,
        #would-you-rather .wyr-result-card h2 {
          margin: 12px 0 0;
          color: var(--wyr-cream);
          font-size: clamp(2.1rem, 5vw, 4.25rem);
          line-height: 1.03;
          text-shadow: 3px 3px 0 rgba(45, 13, 2, 0.44);
        }

        #would-you-rather .wyr-stage-content > p,
        #would-you-rather .wyr-result-card > p {
          max-width: 650px;
          margin: 18px auto 0;
          color: var(--wyr-muted);
          font-size: .98rem;
          line-height: 1.58;
        }

        #would-you-rather .wyr-private-note {
          color: #f5dba8 !important;
          font-size: .86rem !important;
        }

        #would-you-rather .rank-badge,
        #would-you-rather .wyr-round-indicator,
        #would-you-rather .wyr-category {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 11px;
          border: 1px solid rgba(255, 219, 125, .66);
          border-radius: 999px;
          background: rgba(83, 35, 9, .64);
          color: var(--wyr-gold);
          font-size: .76rem;
          font-weight: 1000;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        #would-you-rather .wyr-question-card {
          width: 100%;
          box-sizing: border-box;
          margin-top: 20px;
          padding: 19px;
          border: 1px solid rgba(255, 221, 137, .46);
          border-radius: 18px;
          background:
            radial-gradient(circle at 85% 14%, rgba(255, 221, 123, .14), transparent 23%),
            linear-gradient(145deg, rgba(111, 31, 43, .90), rgba(62, 14, 23, .96));
        }

        #would-you-rather .wyr-question-card h3 {
          margin: 10px 0 0;
          color: #fff8df;
          font-size: clamp(1.35rem, 3vw, 2rem);
        }

        #would-you-rather .wyr-options {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 22px;
        }

        #would-you-rather .wyr-option {
          min-height: 190px;
          padding: 22px 17px;
          border: 2px solid rgba(255, 233, 164, .48);
          border-radius: 18px;
          background:
            radial-gradient(circle at 85% 14%, rgba(255, 244, 191, .16), transparent 20%),
            linear-gradient(145deg, rgba(153, 40, 64, .96), rgba(75, 17, 36, .98));
          color: #fffaf0;
          cursor: pointer;
          font: inherit;
          text-align: left;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.10);
          transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
        }

        #would-you-rather .wyr-option.option-b {
          background:
            radial-gradient(circle at 85% 14%, rgba(255, 224, 147, .16), transparent 20%),
            linear-gradient(145deg, rgba(132, 70, 19, .96), rgba(61, 25, 5, .98));
        }

        #would-you-rather .wyr-option:hover {
          border-color: #fff0ad;
          box-shadow: 0 15px 28px rgba(0, 0, 0, .20);
          transform: translateY(-4px);
        }

        #would-you-rather .wyr-option-label {
          display: block;
          color: #ffe29a;
          font-size: .77rem;
          font-weight: 1000;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        #would-you-rather .wyr-option-text {
          display: block;
          margin-top: 12px;
          color: #fff8df;
          font-size: clamp(1.12rem, 2.3vw, 1.5rem);
          font-weight: 900;
          line-height: 1.3;
        }

        #would-you-rather .wyr-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        #would-you-rather .wyr-actions button {
          min-width: 160px;
          padding: 0 16px;
        }

        #would-you-rather .wyr-result-card {
          padding: 28px;
          text-align: center;
        }

        #would-you-rather .wyr-score-panel {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 22px;
        }

        #would-you-rather .wyr-score-box {
          min-height: 145px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 16px;
          border: 1px solid rgba(255, 222, 143, .34);
          border-radius: 15px;
          background: rgba(47, 14, 3, .58);
        }

        #would-you-rather .wyr-score-box.losing {
          border-color: #ffbcad;
          background: rgba(135, 29, 30, .28);
        }

        #would-you-rather .wyr-score-box strong {
          color: var(--wyr-gold);
          font-size: clamp(2.4rem, 6vw, 4rem);
          line-height: 1;
        }

        #would-you-rather .wyr-score-box span {
          margin-top: 10px;
          color: var(--wyr-muted);
          line-height: 1.45;
        }

        #would-you-rather .wyr-losing-players {
          margin: 20px auto 0;
          padding: 16px;
          border: 1px solid rgba(255, 190, 150, 0.52);
          border-radius: 14px;
          background: linear-gradient(
            145deg,
            rgba(128, 30, 27, 0.34),
            rgba(62, 14, 8, 0.52)
          );
          color: #fff0dd;
          text-align: left;
        }

        #would-you-rather .wyr-losing-players h4 {
          margin: 0;
          color: #ffd2b6;
          font-size: 1rem;
        }

        #would-you-rather .wyr-losing-players p {
          margin: 7px 0 0;
          color: #f1d5bc;
          font-size: .87rem;
          line-height: 1.45;
        }

        #would-you-rather .wyr-losing-name-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        #would-you-rather .wyr-losing-name {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
          padding: 0 11px;
          border: 1px solid rgba(255, 207, 169, 0.56);
          border-radius: 999px;
          background: rgba(58, 11, 6, 0.52);
          color: #fff2dd;
          font-size: .83rem;
          font-weight: 900;
        }

        @media (max-width: 850px) {
          #would-you-rather .wyr-shell {
            grid-template-columns: 1fr;
          }

          #would-you-rather .wyr-stage {
            min-height: 430px;
          }
        }

        @media (max-width: 590px) {
          #would-you-rather {
            width: min(calc(100vw - 20px), 1120px) !important;
            padding: 14px !important;
            border-radius: 17px !important;
          }

          #would-you-rather .section-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          #would-you-rather .wyr-setup-card,
          #would-you-rather .wyr-stage,
          #would-you-rather .wyr-result-card {
            border-radius: 16px;
          }

          #would-you-rather .wyr-setup-card,
          #would-you-rather .wyr-result-card {
            padding: 17px;
          }

          #would-you-rather .wyr-stage {
            min-height: 400px;
            padding: 21px 14px;
          }

          #would-you-rather .wyr-player-row,
          #would-you-rather .wyr-add-player,
          #would-you-rather .wyr-options,
          #would-you-rather .wyr-score-panel {
            grid-template-columns: 1fr;
          }

          #would-you-rather .wyr-player-row .danger-button,
          #would-you-rather .wyr-add-player .secondary-button {
            width: 100%;
          }

          #would-you-rather .wyr-actions {
            display: grid;
          }

          #would-you-rather .wyr-actions button {
            width: 100%;
          }
        }
      `}</style>

      <section id="would-you-rather" className="page-section">
        <button className="back-button" onClick={onBack}>
          ← Back to Other Games
        </button>

        <div className="section-heading">
          <div>
            <p className="eyebrow">Private Pass-the-Phone Vote</p>
            <h2>Would You Rather</h2>
          </div>

          {screen !== "setup" && (
            <button className="reset-link" onClick={restartGame}>
              New Setup
            </button>
          )}
        </div>

        {screen === "setup" && (
          <div className="wyr-shell">
            <aside className="wyr-setup-card">
              <h3>Party Setup</h3>

              <p className="small-text">
                Add your players. Each person receives the phone privately and
                chooses A or B.
              </p>

              <div className="wyr-player-list">
                {players.map((player, index) => (
                  <div className="wyr-player-row" key={`wyr-player-${index}`}>
                    <input
                      value={player}
                      onChange={(event) => updatePlayer(index, event.target.value)}
                      aria-label={`Player ${index + 1} name`}
                    />

                    {players.length > 2 && (
                      <button
                        className="danger-button"
                        onClick={() => removePlayer(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="wyr-add-player">
                <input
                  value={newPlayerName}
                  onChange={(event) => setNewPlayerName(event.target.value)}
                  placeholder="Add a player"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addPlayer();
                  }}
                />

                <button className="secondary-button" onClick={addPlayer}>
                  Add Player
                </button>
              </div>

              <p className="wyr-rule-note">
                Result rule: the option with fewer votes is the losing group.
                Anyone who chose that option takes a drink or your group's
                agreed safe alternative.
              </p>

              <button
                className="primary-button full-width"
                onClick={beginFirstRound}
              >
                Start Private Voting
              </button>

              <button
                className="secondary-button wyr-question-toggle"
                onClick={() => setShowQuestionEditor((oldValue) => !oldValue)}
              >
                {showQuestionEditor
                  ? "Hide Question Editor"
                  : "Add a Would You Rather Question"}
              </button>

              {setupError && <p className="form-error">{setupError}</p>}

              {showQuestionEditor && (
                <section className="wyr-custom-question-card">
                  <h4>Add Your Own Question</h4>
                  <p className="small-text">
                    Saved questions are mixed into the game deck for this
                    browser.
                  </p>

                  <div className="wyr-custom-fields">
                    <input
                      value={customCategory}
                      onChange={(event) => setCustomCategory(event.target.value)}
                      placeholder="Category (optional)"
                    />

                    <textarea
                      value={customOptionA}
                      onChange={(event) => setCustomOptionA(event.target.value)}
                      placeholder="Option A — for example: Eat pizza every day"
                    />

                    <textarea
                      value={customOptionB}
                      onChange={(event) => setCustomOptionB(event.target.value)}
                      placeholder="Option B — for example: Eat burgers every day"
                    />
                  </div>

                  {questionError && <p className="form-error">{questionError}</p>}

                  <button className="primary-button" onClick={addCustomQuestion}>
                    Save Question
                  </button>

                  {customQuestions.length > 0 && (
                    <div className="wyr-custom-list">
                      <p className="wyr-custom-list-title">
                        Your saved questions ({customQuestions.length})
                      </p>

                      {customQuestions.map((customQuestion) => (
                        <div className="wyr-custom-item" key={customQuestion.id}>
                          <div>
                            <strong>{customQuestion.category}</strong>
                            <span>
                              A: {customQuestion.optionA}
                              <br />
                              B: {customQuestion.optionB}
                            </span>
                          </div>

                          <button
                            className="danger-button"
                            onClick={() => removeCustomQuestion(customQuestion.id)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </aside>

            <section className="wyr-stage">
              <div className="wyr-stage-content">
                <span className="rank-badge">Anonymous Group Choice</span>
                <h2>Choose A or B.<br />Keep Your Vote Secret.</h2>
                <p>
                  Everyone gets the phone privately and picks one answer.
                  When all players vote, the group totals are revealed.
                </p>
                <p className="wyr-private-note">
                  No player names appear in the results — only Option A and
                  Option B totals.
                </p>
              </div>
            </section>
          </div>
        )}

        {screen === "pass" && question && (
          <section className="wyr-stage">
            <div className="wyr-stage-content">
              <span className="wyr-round-indicator">Round {roundNumber}</span>
              <h2>Pass the phone to<br />{currentPlayerName}</h2>
              <p>
                Everyone else should look away. Tap below only when{" "}
                {currentPlayerName} is ready to vote.
              </p>

              <div className="wyr-question-card">
                <span className="wyr-category">{question.category}</span>
                <h3>Would you rather…</h3>
              </div>

              <div className="wyr-actions">
                <button
                  className="primary-button"
                  onClick={() => setScreen("vote")}
                >
                  I am {currentPlayerName}
                </button>
              </div>
            </div>
          </section>
        )}

        {screen === "vote" && question && (
          <section className="wyr-stage">
            <div className="wyr-stage-content">
              <span className="wyr-round-indicator">
                {currentPlayerName}'s private vote · Round {roundNumber}
              </span>

              <h2>Would you rather…</h2>

              <div className="wyr-options">
                <button
                  className="wyr-option option-a"
                  onClick={() => castVote("a")}
                >
                  <span className="wyr-option-label">Option A</span>
                  <span className="wyr-option-text">{question.optionA}</span>
                </button>

                <button
                  className="wyr-option option-b"
                  onClick={() => castVote("b")}
                >
                  <span className="wyr-option-label">Option B</span>
                  <span className="wyr-option-text">{question.optionB}</span>
                </button>
              </div>

              <p className="wyr-private-note">
                Tap only one choice. Your vote stays hidden from the results.
              </p>
            </div>
          </section>
        )}

        {screen === "results" && question && (
          <section className="wyr-stage">
            <div className="wyr-result-card">
              <span className="rank-badge">Round {roundNumber} Results</span>
              <h2>Group Vote Revealed</h2>

              <div className="wyr-score-panel">
                <div
                  className={
                    voteSummary.losingChoice === "a"
                      ? "wyr-score-box losing"
                      : "wyr-score-box"
                  }
                >
                  <strong>{voteSummary.aVotes}</strong>
                  <span>Option A: {question.optionA}</span>
                </div>

                <div
                  className={
                    voteSummary.losingChoice === "b"
                      ? "wyr-score-box losing"
                      : "wyr-score-box"
                  }
                >
                  <strong>{voteSummary.bVotes}</strong>
                  <span>Option B: {question.optionB}</span>
                </div>
              </div>

              {voteSummary.isTie ? (
                <p>
                  It is a tie. Nobody has the lower total this round. Pick a
                  funny group challenge or move to the next question.
                </p>
              ) : (
                <>
                  <p>
                    Anyone who chose{" "}
                    <strong>
                      Option {voteSummary.losingChoice === "a" ? "A" : "B"}
                    </strong>{" "}
                    is in the lower-vote group. Use your group's agreed safe
                    alternative, then continue to the next question.
                  </p>

                  <section className="wyr-losing-players">
                    <h4>Lowest-vote players</h4>
                    <p>
                      These players chose the option with the fewest votes.
                    </p>

                    <div className="wyr-losing-name-list">
                      {losingPlayerNames.map((playerName, index) => (
                        <span
                          className="wyr-losing-name"
                          key={`${playerName}-${index}`}
                        >
                          {playerName}
                        </span>
                      ))}
                    </div>
                  </section>
                </>
              )}

              <div className="wyr-actions">
                <button className="primary-button" onClick={nextQuestion}>
                  Next Question
                </button>

                <button className="secondary-button" onClick={restartGame}>
                  Change Players
                </button>
              </div>
            </div>
          </section>
        )}
      </section>
    </>
  );
}
