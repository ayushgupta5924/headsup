// words.js — Heads Up! word data
// To add words: append to any array below. Guest-submitted words are mixed in at runtime.

export const HARDCODED_WORDS = {
  celebrities: [
    "Beyoncé","Elon Musk","Taylor Swift","Leonardo DiCaprio",
    "Oprah Winfrey","LeBron James","Cristiano Ronaldo","Lady Gaga",
    "Morgan Freeman","Rihanna","Kanye West","Serena Williams",
    "Tom Hanks","Billie Eilish","Dwayne Johnson","Adele",
    "Justin Bieber","Scarlett Johansson","Lionel Messi","Shah Rukh Khan",
  ],
  movies: [
    "The Dark Knight","Inception","Titanic","Avengers: Endgame",
    "The Lion King","Interstellar","Jurassic Park","Home Alone",
    "The Godfather","Spider-Man","Harry Potter","Star Wars",
    "The Matrix","Forrest Gump","Toy Story","Finding Nemo","Black Panther","Shrek",
  ],
  animals: [
    "Platypus","Axolotl","Meerkat","Pangolin",
    "Komodo Dragon","Narwhal","Capybara","Tapir",
    "Okapi","Binturong","Aye-Aye","Quokka",
    "Mantis Shrimp","Naked Mole Rat","Fossa","Wolverine",
    "Manatee","Proboscis Monkey","Shoebill Stork",
  ],
  places: [
    "The Eiffel Tower","Machu Picchu","The Great Wall of China","Niagara Falls",
    "The Sahara Desert","Stonehenge","The Colosseum","Mount Everest",
    "The Grand Canyon","Easter Island","Angkor Wat","The Taj Mahal",
    "Chichen Itza","The Great Barrier Reef","The Dead Sea","Bora Bora","Petra","Yellowstone",
  ],
  actions: [
    "Playing guitar","Surfing a wave","Milking a cow","Threading a needle",
    "Building a sandcastle","Parallel parking","Doing yoga","Hammering a nail",
    "Painting a fence","Rowing a boat","Changing a tire","Flying a kite",
    "Hula hooping","Tightrope walking","Playing chess","Blowing up a balloon",
  ],
  food: [
    "Croissant","Pho","Moussaka","Kimchi","Tiramisu","Baklava","Ceviche","Bibimbap",
    "Shakshuka","Pierogi","Ratatouille","Bouillabaisse","Borscht","Paella",
    "Rendang","Injera","Tamagoyaki","Stroopwafel","Mole","Baba Ghanoush",
  ],
};

const CATEGORIES = [
  { id: "celebrities", name: "Celebrities", emoji: "🌟", color: "#FF6B6B" },
  { id: "movies",      name: "Movies",      emoji: "🎬", color: "#4ECDC4" },
  { id: "animals",     name: "Animals",     emoji: "🦁", color: "#F7B731" },
  { id: "places",      name: "Places",      emoji: "🗺️", color: "#A29BFE" },
  { id: "actions",     name: "Act It Out",  emoji: "🎭", color: "#FD79A8" },
  { id: "food",        name: "Food & Drink",emoji: "🍕", color: "#00B894" },
];

export default CATEGORIES;