let timerInterval;
let timeLeft = 30;
let currentQuestion;
let currentLevel = 14;
let recentQuestions = [];
let typeInterval;
let questionCount = 0;

let lifelines = {
    fifty: true,
    call: true,
    poll: true,
    switch: true
};

// Mobile touch support - prevent double tap zoom
let lastTouchEnd = 0;
document.addEventListener('touchend', function(event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Prevent pinch zoom
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

// Mobile-friendly scaling function
function scaleForMobile() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust timer and font sizes for mobile
    if (viewportWidth <= 768) {
        document.body.classList.add('mobile-view');
    } else {
        document.body.classList.remove('mobile-view');
    }
}

// Listen for orientation changes and resize
window.addEventListener('resize', scaleForMobile);
window.addEventListener('orientationchange', scaleForMobile);

// Initialize on load
window.addEventListener('load', scaleForMobile);

const ladderAmounts = [
"₹7Cr","₹50L","₹25L","₹12.5L","₹6.4L",
"₹3.2L","₹1.6L","₹80K","₹40K","₹20K",
"₹10K","₹5K","₹3K","₹2K","₹1K"
];

const questionBank = {
  easy: [
    {q:"Who wrote Ramayana?",o:["Valmiki","Tulsidas","Kalidasa","Ved Vyasa"],c:0},
    {q:"Capital of Japan?",o:["Beijing","Tokyo","Seoul","Bangkok"],c:1},
    {q:"Largest planet?",o:["Mars","Earth","Jupiter","Venus"],c:2},
    {q:"2 + 2 = ?",o:["3","4","5","6"],c:1},
    {q:"National animal of India?",o:["Lion","Tiger","Elephant","Leopard"],c:1},
    {q:"What is the capital of France?",o:["London","Berlin","Paris","Madrid"],c:2},
    {q:"Who painted the Mona Lisa?",o:["Michelangelo","Leonardo da Vinci","Raphael","Donatello"],c:1},
    {q:"What is the smallest prime number?",o:["0","1","2","3"],c:2},
    {q:"How many continents are there?",o:["5","6","7","8"],c:2},
    {q:"Which is the longest river in the world?",o:["Amazon","Nile","Yangtze","Mississippi"],c:1},
    {q:"What is the chemical symbol for Gold?",o:["Gd","Go","Au","G"],c:2},
    {q:"Who was the first President of the USA?",o:["Thomas Jefferson","George Washington","John Adams","Benjamin Franklin"],c:1},
    {q:"What is the square root of 144?",o:["10","11","12","13"],c:2},
    {q:"Which planet is closest to the Sun?",o:["Venus","Mercury","Earth","Mars"],c:1},
    {q:"What is the capital of Australia?",o:["Sydney","Melbourne","Canberra","Brisbane"],c:2},
    {q:"How many sides does a hexagon have?",o:["5","6","7","8"],c:1},
    {q:"What is the capital of India?",o:["Mumbai","Bangalore","New Delhi","Chennai"],c:2},
    {q:"Who wrote Romeo and Juliet?",o:["Mark Twain","William Shakespeare","Jane Austen","Charles Dickens"],c:1},
    {q:"What is the currency of Japan?",o:["Won","Rupee","Yen","Peso"],c:2},
    {q:"Which ocean is the largest?",o:["Atlantic","Indian","Arctic","Pacific"],c:3},
    {q:"How many strings does a violin have?",o:["4","5","6","7"],c:0},
    {q:"What is the capital of Germany?",o:["Munich","Hamburg","Berlin","Frankfurt"],c:2},
    {q:"Who discovered America?",o:["Leif Erikson","Christopher Columbus","Vasco da Gama","Ferdinand Magellan"],c:1},
    {q:"What is the chemical symbol for Iron?",o:["I","Ir","Fe","In"],c:2},
    {q:"Which is the tallest mountain in the world?",o:["K2","Kangchenjunga","Mont Blanc","Mount Everest"],c:3},
    {q:"What is the capital of Italy?",o:["Milan","Venice","Naples","Rome"],c:3},
    {q:"How many bones are in the human body?",o:["186","206","226","246"],c:1},
    {q:"What is 15% of 100?",o:["10","15","20","25"],c:1},
    {q:"Who was the first Indian President?",o:["Jawaharlal Nehru","Rajendra Prasad","Sardar Patel","Vallabhbhai Patel"],c:1},
    {q:"What is the capital of Canada?",o:["Toronto","Vancouver","Edmonton","Ottawa"],c:3},
    {q:"How many sides does a triangle have?",o:["2","3","4","5"],c:1},
    {q:"What is the largest mammal in the world?",o:["African Elephant","Giraffe","Blue Whale","Hippopotamus"],c:2},
    {q:"Who wrote Pride and Prejudice?",o:["Charlotte Bronte","Emily Bronte","Jane Austen","George Eliot"],c:2},
    {q:"What is the capital of Russia?",o:["St. Petersburg","Vladivostok","Novosibirsk","Moscow"],c:3},
    {q:"How many planets are in our solar system?",o:["7","8","9","10"],c:1},
    {q:"What is the chemical symbol for Oxygen?",o:["O","Ox","Os","Oh"],c:0},
    {q:"Which country is known as the Land of the Rising Sun?",o:["China","Korea","Japan","Thailand"],c:2},
    {q:"What is the capital of Brazil?",o:["Rio de Janeiro","Sao Paulo","Salvador","Brasilia"],c:3},
    {q:"How many sides does a square have?",o:["3","4","5","6"],c:1},
    {q:"Who invented electricity?",o:["Thomas Edison","Benjamin Franklin","Nikola Tesla","Michael Faraday"],c:1},
    {q:"What is the capital of Mexico?",o:["Cancun","Acapulco","Guadalajara","Mexico City"],c:3},
    {q:"How many wheels does a bicycle have?",o:["1","2","3","4"],c:1},
    {q:"Who is known as the Father of Modern Physics?",o:["Isaac Newton","Albert Einstein","Galileo Galilei","Stephen Hawking"],c:1},
    {q:"What is the capital of Spain?",o:["Barcelona","Valencia","Seville","Madrid"],c:3},
    {q:"How many days are in a leap year?",o:["364","365","366","367"],c:2},
    {q:"Who wrote Sherlock Holmes?",o:["Oscar Wilde","Arthur Conan Doyle","Agatha Christie","J.K. Rowling"],c:1},
    {q:"What is the capital of Egypt?",o:["Alexandria","Giza","Cairo","Luxor"],c:2},
    {q:"How many strings does a guitar have?",o:["4","5","6","7"],c:2},
    {q:"Who invented the telephone?",o:["Nikola Tesla","Alexander Graham Bell","Thomas Edison","Guglielmo Marconi"],c:1},
    {q:"What is the capital of Kenya?",o:["Mombasa","Nairobi","Kisumu","Nakuru"],c:1},
    {q:"How many sides does a pentagon have?",o:["3","4","5","6"],c:2},
    {q:"What is the largest desert in the world?",o:["Gobi","Kalahari","Arabian","Antarctic"],c:3},
    {q:"Who wrote 1984?",o:["Robert Frost","George Orwell","Aldous Huxley","Kurt Vonnegut"],c:1},
    {q:"What is the capital of Thailand?",o:["Phuket","Chiang Mai","Pattaya","Bangkok"],c:3},
    {q:"What is 25% of 100?",o:["15","20","25","30"],c:1},
    {q:"Who is considered the Father of Indian Independence?",o:["Jawaharlal Nehru","Subhas Chandra Bose","Mahatma Gandhi","Sardar Patel"],c:2},
    {q:"What is the capital of Turkey?",o:["Istanbul","Izmir","Ankara","Bursa"],c:2},
    {q:"What is the most spoken language in the world?",o:["Spanish","English","Hindi","Mandarin Chinese"],c:3},
    {q:"Who invented the light bulb?",o:["Nikola Tesla","Joseph Swan","Thomas Edison","Humphry Davy"],c:2},
    {q:"What is the capital of Pakistan?",o:["Lahore","Karachi","Islamabad","Multan"],c:2},
    {q:"How many hours are in a day?",o:["20","22","24","26"],c:2},
    {q:"Who wrote Macbeth?",o:["Christopher Marlowe","William Shakespeare","Ben Jonson","John Ford"],c:1},
    {q:"What is the capital of Bangladesh?",o:["Chittagong","Sylhet","Dhaka","Khulna"],c:2},
    {q:"What is 50% of 100?",o:["25","50","75","100"],c:1},
    {q:"Who invented the airplane?",o:["Samuel Langley","Nikola Tesla","Wright Brothers","Gustave Whitehead"],c:2},
    {q:"Which country won the FIFA World Cup 2018?",o:["France","Germany","Brazil","Argentina"],c:0},
    {q:"How many players are in a cricket team?",o:["9","10","11","12"],c:2},
    {q:"What is the national sport of India?",o:["Kabaddi","Cricket","Hockey","Football"],c:2},
    {q:"Who won the Wimbledon 2023 men's singles?",o:["Novak Djokovic","Roger Federer","Rafael Nadal","Carlos Alcaraz"],c:3},
    {q:"How many strings does a sitar have?",o:["5","6","7","8"],c:2},
    {q:"Who is the highest-paid actor in Hollywood?",o:["Dwayne Johnson","Tom Cruise","Shah Rukh Khan","Brad Pitt"],c:0},
    {q:"Which movie won the Oscar for Best Picture 2023?",o:["Avatar","Oppenheimer","Killers of the Flower Moon","American Fiction"],c:1},
    {q:"Who directed Titanic?",o:["Steven Spielberg","James Cameron","Peter Jackson","Christopher Nolan"],c:1},
    {q:"What is the box office highest-grossing film ever?",o:["Avatar","Avengers Endgame","Titanic","Star Wars"],c:0},
    {q:"Who is the fastest bowler in cricket?",o:["Wasim Akram","Brett Lee","Shoaib Akhtar","Jasprit Bumrah"],c:2},
    {q:"What is the speed of light?",o:["186,000 m/s","300,000 km/s","150,000 km/s","250,000 km/s"],c:1},
    {q:"What is absolute zero in Celsius?",o:["-273.15°C","-100°C","0°C","32°C"],c:0},
    {q:"Who invented the steam engine?",o:["George Stephenson","James Watt","Thomas Newcomen","Richard Trevithick"],c:1},
    {q:"What is the SI unit of force?",o:["Dyne","Newton","Joule","Watt"],c:1},
    {q:"Who wrote Harry Potter?",o:["J.R.R. Tolkien","J.K. Rowling","Stephen King","George R.R. Martin"],c:1},
    {q:"How many Harry Potter books are there?",o:["5","6","7","8"],c:2},
    {q:"What is Iron Man's real name?",o:["Steve Rogers","Bruce Wayne","Tony Stark","Peter Parker"],c:2},
    {q:"Which superhero is known as the Man of Steel?",o:["Batman","Superman","Wonder Woman","Iron Man"],c:1},
    {q:"Who is the main antagonist in Game of Thrones?",o:["Cersei Lannister","Daenerys Targaryen","The Night King","Theon Greyjoy"],c:2},
    {q:"What is the currency of Switzerland?",o:["Euro","Franc","Pound","Dollar"],c:1},
    {q:"How many states are in America?",o:["48","50","52","60"],c:1},
    {q:"What is the smallest country in the world?",o:["Monaco","Liechtenstein","San Marino","Vatican City"],c:3},
    {q:"Who was the first man to walk on the moon?",o:["Buzz Aldrin","Neil Armstrong","John Glenn","Yuri Gagarin"],c:1},
    {q:"What is the capital of Australia?",o:["Sydney","Melbourne","Canberra","Brisbane"],c:2}
  ],
  medium: [
    {q:"Who wrote The Great Gatsby?",o:["Ernest Hemingway","F. Scott Fitzgerald","Thomas Wolfe","Sinclair Lewis"],c:1},
    {q:"What is the capital of Denmark?",o:["Aarhus","Odense","Aalborg","Copenhagen"],c:3},
    {q:"What is 30% of 100?",o:["20","25","30","35"],c:2},
    {q:"Who is considered the Father of Mathematics?",o:["Euclid","Archimedes","Isaac Newton","Albert Einstein"],c:0},
    {q:"What is the capital of Sweden?",o:["Gothenburg","Malmo","Uppsala","Stockholm"],c:3},
    {q:"What is the hottest planet in our solar system?",o:["Mercury","Venus","Earth","Mars"],c:1},
    {q:"Who wrote To Kill a Mockingbird?",o:["Carson McCullers","Flannery O'Connor","Harper Lee","Eudora Welty"],c:2},
    {q:"What is the capital of Norway?",o:["Bergen","Stavanger","Trondheim","Oslo"],c:3},
    {q:"How many vowels are there in the English alphabet?",o:["3","4","5","6"],c:2},
    {q:"Who invented the microscope?",o:["Isaac Newton","Louis Pasteur","Antonie van Leeuwenhoek","Robert Hooke"],c:2},
    {q:"What is the capital of Finland?",o:["Espoo","Tampere","Turku","Helsinki"],c:3},
    {q:"What is the smallest continent?",o:["Europe","Australia","South America","Africa"],c:1},
    {q:"Who wrote The Catcher in the Rye?",o:["Kurt Vonnegut","J.D. Salinger","Jack Kerouac","Allen Ginsberg"],c:1},
    {q:"What is the capital of Poland?",o:["Krakow","Wroclaw","Poznan","Warsaw"],c:3},
    {q:"How many seconds are in a minute?",o:["45","50","60","70"],c:2},
    {q:"Who discovered Penicillin?",o:["Louis Pasteur","Joseph Lister","Alexander Fleming","Howard Florey"],c:2},
    {q:"What is the capital of Czech Republic?",o:["Brno","Ostrava","Plzen","Prague"],c:3},
    {q:"What is the coldest continent?",o:["Greenland","Arctic","Antarctica","Siberia"],c:2},
    {q:"Who wrote Wuthering Heights?",o:["Charlotte Bronte","Anne Bronte","Emily Bronte","George Eliot"],c:2},
    {q:"What is the capital of Hungary?",o:["Debrecen","Szeged","Miskolc","Budapest"],c:3},
    {q:"What is 40% of 100?",o:["30","35","40","45"],c:2},
    {q:"Who is the founder of Microsoft?",o:["Steve Jobs","Bill Gates","Mark Zuckerberg","Larry Ellison"],c:1},
    {q:"What is the capital of Austria?",o:["Salzburg","Graz","Linz","Vienna"],c:3},
    {q:"How many minutes are in a day?",o:["1200","1440","1600","1800"],c:1},
    {q:"Who wrote The Odyssey?",o:["Sophocles","Aeschylus","Homer","Euripides"],c:2},
    {q:"What is the capital of Romania?",o:["Constanta","Iasi","Cluj-Napoca","Bucharest"],c:3},
    {q:"What is 20% of 100?",o:["15","20","25","30"],c:1},
    {q:"Who founded Google?",o:["Eric Schmidt","Sergey Brin","Steve Wozniak","Larry Page"],c:3},
    {q:"What is the capital of Bulgaria?",o:["Plovdiv","Varna","Ruse","Sofia"],c:3},
    {q:"How many kingdoms are there in biology?",o:["3","4","5","6"],c:2},
    {q:"Who wrote Ulysses?",o:["Samuel Beckett","James Joyce","Virginia Woolf","Gertrude Stein"],c:1},
    {q:"What is the capital of Serbia?",o:["Nis","Subotica","Zemun","Belgrade"],c:3},
    {q:"What is 60% of 100?",o:["50","55","60","65"],c:2},
    {q:"Who is the founder of Facebook?",o:["Sheryl Sandberg","Mark Zuckerberg","Chris Hughes","Eduardo Saverin"],c:1},
    {q:"What is the capital of Croatia?",o:["Split","Rijeka","Osijek","Zagreb"],c:3},
    {q:"What is the rarest blood type?",o:["AB","O","A","Rh-null"],c:3},
    {q:"Who wrote Moby Dick?",o:["Nathaniel Hawthorne","Walt Whitman","Herman Melville","Mark Twain"],c:2},
    {q:"What is the capital of Slovenia?",o:["Maribor","Celje","Kranj","Ljubljana"],c:3},
    {q:"How many hours are in a week?",o:["144","168","192","216"],c:1},
    {q:"Who is the founder of Tesla?",o:["Martin Eberhard","Elon Musk","Marc Tarpenning","JB Straubel"],c:1},
    {q:"What is the capital of Slovakia?",o:["Kosice","Bratislava","Zilina","Nitra"],c:1},
    {q:"What is the most common blood type?",o:["A","B","AB","O"],c:3},
    {q:"Who wrote Jane Eyre?",o:["George Eliot","Charlotte Bronte","Emily Bronte","Anne Bronte"],c:1},
    {q:"What is the capital of Estonia?",o:["Tartu","Narva","Kohtla-Jarve","Tallinn"],c:3},
    {q:"What is 70% of 100?",o:["60","65","70","75"],c:2},
    {q:"Who founded Apple?",o:["Steve Wozniak","Steve Jobs","Ronald Wayne","Arthur Levenson"],c:1},
    {q:"What is the capital of Latvia?",o:["Daugavpils","Liepaja","Jelgava","Riga"],c:3},
    {q:"How many sides does a trapezoid have?",o:["3","4","5","6"],c:1},
    {q:"Who wrote The Count of Monte Cristo?",o:["Jules Verne","Victor Hugo","Alexandre Dumas","Honore de Balzac"],c:2},
    {q:"What is the capital of Lithuania?",o:["Kaunas","Klaipeda","Siauliai","Vilnius"],c:3},
    {q:"What is 80% of 100?",o:["70","75","80","85"],c:2},
    {q:"Who is the founder of Oracle?",o:["Jennifer Oracle","Charles Geschke","Larry Ellison","Bob Metcalfe"],c:2},
    {q:"Who wrote Crime and Punishment?",o:["Leo Tolstoy","Ivan Turgenev","Fyodor Dostoevsky","Anton Chekhov"],c:2},
    {q:"What is the fastest animal on land?",o:["Lion","Greyhound","Pronghorn Antelope","Cheetah"],c:3},
    {q:"Who wrote Anna Karenina?",o:["Fyodor Dostoevsky","Ivan Turgenev","Leo Tolstoy","Anton Chekhov"],c:2},
    {q:"What is the capital of Montenegro?",o:["Niksic","Pljevlja","Cetinje","Podgorica"],c:3},
    {q:"How many bones does a newborn baby have?",o:["150","200","250","300"],c:2},
    {q:"Who wrote The Brothers Karamazov?",o:["Leo Tolstoy","Ivan Turgenev","Fyodor Dostoevsky","Anton Chekhov"],c:2},
    {q:"Which Indian cricketer has most international centuries?",o:["Ravi Shastri","Virat Kohli","Sachin Tendulkar","Rahul Dravid"],c:2},
    {q:"What is the tallest waterfall in the world?",o:["Victoria Falls","Niagara Falls","Angel Falls","Yosemite Falls"],c:2},
    {q:"Who directed The Shawshank Redemption?",o:["Martin Scorsese","Steven Spielberg","Frank Darabont","Christopher Nolan"],c:2},
    {q:"What is the largest coral reef system in the world?",o:["Red Sea Reef","Palau","Great Barrier Reef","Belize Barrier Reef"],c:2},
    {q:"Who won the Nobel Prize in Physics 2022?",o:["Donna Strickland","Pierre Agostini","Ferenc Krausz","Alain Aspect"],c:3},
    {q:"What is the chemical symbol for Helium?",o:["H","Ha","He","Hl"],c:2},
    {q:"Who is the author of Sapiens?",o:["Yuval Noah Harari","Malcolm Gladwell","Bill Gates","Elon Musk"],c:0},
    {q:"What is the highest mountain peak in Asia?",o:["K2","Kangchenjunga","Mount Everest","Lhotse"],c:2},
    {q:"WHO declared COVID-19 as pandemic in which year?",o:["2019","2020","2021","2022"],c:1},
    {q:"What is the speed of sound?",o:["300 m/s","343 m/s","500 m/s","1000 m/s"],c:1},
    {q:"How many elements are in the periodic table?",o:["100","104","106","118"],c:3},
    {q:"What is the most expensive painting ever sold?",o:["Wheat Field with Cypresses","Salvator Mundi","The Night Watch","Girl with Pearl Earring"],c:1},
    {q:"Who wrote The Origin of Species?",o:["Alfred Wallace","Charles Darwin","Thomas Huxley","George Cuvier"],c:1},
    {q:"What is the deepest ocean trench?",o:["Tonga Trench","Kuril Trench","Mariana Trench","Philippine Trench"],c:2},
    {q:"How many sides does a dodecagon have?",o:["10","11","12","13"],c:2}
  ],
  hard: [
    {q:"What is Schrödinger's Cat thought experiment about?",o:["Quantum superposition","Classical mechanics","Relativity","Thermodynamics"],c:0},
    {q:"Who won the Abel Prize in 2023?",o:["Terence Tao","Luis A. Caffarelli","Maryam Mirzakhani","Andrew Wiles"],c:1},
    {q:"What is the Heisenberg Uncertainty Principle?",o:["Energy-time uncertainty","Position-momentum uncertainty","Wave-particle duality","Spin-orbit coupling"],c:1},
    {q:"Who proposed the Many-Worlds Interpretation?",o:["Niels Bohr","Erwin Schrödinger","Hugh Everett","David Deutsch"],c:2},
    {q:"What is quantum entanglement?",o:["Particles vibrating together","Particles correlating instantaneously","Particles in the same state","Particles with same energy"],c:1},
    {q:"Who formulated the Drake Equation?",o:["Carl Sagan","Frank Drake","Arthur C. Clarke","John Wheeler"],c:1},
    {q:"What is the Fermi Paradox about?",o:["Subatomic particles","Extraterrestrial life absence","Speed of light","Black holes"],c:1},
    {q:"Who won the Fields Medal in 2022?",o:["James Maynard","Hugo Duminil-Copin","June Huh","Maryna Viazovska"],c:3},
    {q:"What is the Higgs Boson's significance?",o:["Gives particles mass","Creates energy","Breaks symmetry","Stabilizes atoms"],c:0},
    {q:"Who discovered gravitational waves?",o:["Albert Einstein","LIGO team","Stephen Hawking","Roger Penrose"],c:1},
    {q:"What is the Standard Model in physics?",o:["Particle classification","Universal template","Force unification","Quantum description"],c:3},
    {q:"Who developed String Theory?",o:["Juan Maldacena","Michael Green","John Schwarz","Brian Greene"],c:3},
    {q:"What is dark energy?",o:["Black hole energy","Universe expansion energy","Star energy","Antimatter"],c:1},
    {q:"Who won the 2020 Physics Nobel Prize?",o:["Roger Penrose","Reinhard Genzel","Andrea Ghez","Gérard Mourou"],c:3},
    {q:"What is the cosmological constant?",o:["Universe expansion rate","Gravity constant","Speed of light","Planck constant"],c:0},
    {q:"Who proposed the Big Bang Theory?",o:["Edwin Hubble","Georges Lemaître","Fred Hoyle","Arno Penzias"],c:1},
    {q:"What is entropy in thermodynamics?",o:["Heat energy","Disorder measure","Temperature","Work done"],c:1},
    {q:"Who formulated Maxwell's Equations?",o:["Albert Einstein","James Clerk Maxwell","Michael Faraday","Hendrik Lorentz"],c:1},
    {q:"What is the Casimir Effect?",o:["Quantum vacuum force","Electromagnetic force","Gravitational force","Strong force"],c:0},
    {q:"Who proposed the Pauli Exclusion Principle?",o:["Werner Heisenberg","Wolfgang Pauli","Niels Bohr","Erwin Schrödinger"],c:1},
    {q:"What is phonon in solid state physics?",o:["Quantum of light","Quantum of vibration","Quantum of spin","Quantum of charge"],c:1},
    {q:"Who won the Turing Award 2022?",o:["Geoffrey Hinton","Yann LeCun","Demis Hassabis","Stuart Russell"],c:0},
    {q:"What is the FLOPS measurement for?",o:["Flight operations","Floating point operations","Film analysis","Frequency loading"],c:1},
    {q:"Who founded the Bitcoin network?",o:["Vitalik Buterin","Satoshi Nakamoto","Hal Finney","Nick Szabo"],c:1},
    {q:"What is the Byzantine Generals Problem?",o:["Historical military strategy","Consensus in distributed systems","Computer security","Network routing"],c:1},
    {q:"Who invented the RSA encryption?",o:["Rivest, Shamir, Adleman","Rabin, Shannon, Abelson","Rivest, Stewart, Adams","Rabin, Shamir, Ament"],c:0},
    {q:"What is a zero-day exploit?",o:["Security patch","Unknown software vulnerability","Antivirus program","Encryption method"],c:1},
    {q:"Who proposed the Turing Test?",o:["Alan Turing","John von Neumann","Claude Shannon","Alonzo Church"],c:0},
    {q:"What is the P versus NP problem?",o:["Programming concept","Million dollar problem","Code complexity","Algorithm design"],c:1},
    {q:"Who developed the first neural network?",o:["Geoffrey Hinton","Yann LeCun","Michael Bengio","Warren McCulloch"],c:3},
    {q:"What is CRISPR-Cas9?",o:["Virus detection","Gene editing tool","Protein synthesis","DNA sequencing"],c:1},
    {q:"Who won the 2023 Nobel Prize in Physiology?",o:["Katalin Karikó","Drew Weissman","Pieter Zwart","Katalin Karikó"],c:1},
    {q:"What is mRNA vaccine technology?",o:["Antivirus program","Genetic instruction delivery","Protein engineering","Cancer treatment"],c:1},
    {q:"Who discovered the structure of DNA?",o:["Watson, Crick, Franklin","Pauling, Sanger","Avery, MacLeod","Hershey, Chase"],c:0},
    {q:"What is reverse transcription?",o:["DNA to RNA conversion","RNA to DNA conversion","Protein synthesis","Gene translation"],c:1},
    {q:"Who developed CRISPR gene therapy?",o:["Jennifer Doudna","Emmanuelle Charpentier","George Church","David Baltimore"],c:3},
    {q:"What is the TATA box in genetics?",o:["DNA sequence promoter","Protein coding region","Mutation marker","Gene regulatory element"],c:3},
    {q:"What is the Rosalind Franklin's contribution?",o:["X-ray crystallography of DNA","Double helix model","Genetic code","RNA structure"],c:0},
    {q:"Who proposed the Central Dogma?",o:["Francis Crick","James Watson","George Gamow","Sydney Brenner"],c:0},
    {q:"What is horizontal gene transfer?",o:["Sexual reproduction","Gene movement between organisms","Vertical inheritance","Mutation process"],c:1},
    {q:"What is the Anthropocene epoch?",o:["Historical age","Geological era of human impact","Stone age","Ice age"],c:1},
    {q:"Who discovered tectonic plate theory?",o:["Alfred Wegener","Harry Hess","J. Tuzo Wilson","Dan McKenzie"],c:1},
    {q:"What is TRAPPIST-1 system?",o:["Exoplanet star system","Space mission","Astronomical discovery","Black hole"],c:1},
    {q:"Who discovered gravitational lensing?",o:["Albert Einstein","Arthur Eddington","Isaac Newton","Stephen Hawking"],c:1},
    {q:"What is the cosmic microwave background?",o:["Radiation from Big Bang","Stellar radiation","Galaxy light","Quasar emission"],c:0},
    {q:"Who calculated the fine structure constant?",o:["Arnold Sommerfeld","Max Planck","Niels Bohr","Peter Dirac"],c:0},
    {q:"What is the photolysis process?",o:["Light-induced decomposition","Chemical bonding","Energy transfer","Quantum tunneling"],c:0},
    {q:"Who proposed the Boltzmann equation?",o:["James Clerk Maxwell","Ludwig Boltzmann","J Willard Gibbs","Josiah Gibbs"],c:1},
    {q:"What is the Andreev reflection phenomenon?",o:["Superconductor effect","Normal reflection","Light refraction","Wave interference"],c:0},
    {q:"Who discovered the Casimir effect experimentally?",o:["Hendrik Casimir","Marcus Bordag","Steve Lamoreaux","Pablo Esquinazi"],c:2},
    {q:"What is topological order in physics?",o:["Arrangement order","Quantum order state","Spatial arrangement","Linear ordering"],c:1},
    {q:"Who formulated the Dirac equation?",o:["Werner Heisenberg","Paul Dirac","Erwin Schrödinger","Hans Bethe"],c:1},
    {q:"What is the Lamb shift?",o:["Spectral line shift","Energy level splitting","Radiation pressure","Doppler effect"],c:0},
    {q:"Who proposed the Yang-Mills theory?",o:["Chen Ning Yang","Robert Mills","Sheldon Glashow","Abdus Salam"],c:1},
    {q:"What is symmetry breaking in physics?",o:["Mirror breaking","Gauge symmetry loss","Structural change","Phase transition"],c:1},
    {q:"How many novels did Tolstoy write?",o:["8","10","12","15"],c:0},
    {q:"Who discovered the neutron?",o:["Ernest Rutherford","James Chadwick","Hans Geiger","Ernest Marsden"],c:1},
    {q:"What is the photoelectric effect?",o:["Light reflection","Light-electron interaction","Light absorption","Light refraction"],c:1},
    {q:"Who first predicted the existence of positron?",o:["Paul Dirac","Carl Anderson","Richard Feynman","Julian Schwinger"],c:0}
  ]
};

function getDifficultyCategory(){
    if(currentLevel >= 10) return "easy";
    if(currentLevel >= 4) return "medium";
    return "hard";
}

function getQuestionsArray(){
    let difficulty = getDifficultyCategory();
    if(difficulty === "easy") return questionBank.easy;
    if(difficulty === "medium") return questionBank.medium;
    return questionBank.hard;
}

window.onload = function(){
    console.log("Game loaded!");
    const startButton = document.getElementById("startButton");
    const startOverlay = document.getElementById("startOverlay");
    const audioStatus = document.getElementById("audioStatus");

    if(!startButton || !startOverlay){
        console.log("Start overlay missing, starting automatically");
        startSequence();
        return;
    }

    startButton.addEventListener("click", () => {
        if(audioStatus){
            audioStatus.textContent = "Audio: starting...";
        }
        // Hide overlay immediately so user sees progress
        startOverlay.classList.add("hidden");
        const result = startSequence();
        if(result && typeof result.then === "function"){
            result.catch((err) => {
                console.log("Start blocked:", err);
                if(audioStatus){
                    audioStatus.textContent = "Audio blocked. Click anywhere to enable sound.";
                }
            });
        }
    });

    // Add Walk Away button handler
    const walkAwayBtn = document.querySelector(".walk-away");
    if(walkAwayBtn){
        walkAwayBtn.addEventListener("click", () => {
            let winAmount = ladderAmounts[currentLevel];
            showGameOverModal(winAmount, "💰 Walk Away!");
        });
    }
};

function startSequence(){
    // Clean up any previous audio on reload
    cleanupAudio();
    
    console.log("Preloading audio files...");
    let bgAudio = document.getElementById("bgAudio");
    let introAudio = document.getElementById("introAudio");
    let questionAudio = document.getElementById("questionAudio");
    let wrongAudio = document.getElementById("wrongAudio");
    let winAudio = document.getElementById("winAudio");
    let audioStatus = document.getElementById("audioStatus");
    
    let loadingBar = document.querySelector(".loading-bar-fill");
    let loadingPercent = document.querySelector(".loading-percent");
    let gameStarted = false;
    let firstQuestionLoaded = false;
    
    // Reset loading bar
    loadingBar.style.width = "0%";
    loadingPercent.innerText = "0%";
    
    function startIntroPhase() {
        if(gameStarted) return;
        gameStarted = true;
        
        console.log("🎮 Starting intro phase - game screen now visible");
        document.getElementById("loadingScreen").classList.add("hidden");
        const gameScreen = document.getElementById("gameScreen");
        gameScreen.classList.remove("hidden");
        gameScreen.classList.add("show");
        
        renderLadder();
    }

    function startFirstQuestion(){
        if(firstQuestionLoaded) return;
        firstQuestionLoaded = true;
        loadQuestion();
    }
    
    // Sync state
    let introStarted = false;
    let loadingDone = false;
    let gameShown = false;
    
    function setupAudioRetry(){
        const retry = () => {
            if(audioStatus){
                audioStatus.textContent = "Audio: retrying...";
            }
            bgAudio.play().then(() => {
                if(audioStatus){
                    audioStatus.textContent = "Audio: background playing";
                }
            }).catch((err) => {
                console.log("Retry failed:", err);
                if(audioStatus){
                    audioStatus.textContent = "Audio blocked. Click again to retry.";
                }
                document.body.addEventListener("click", retry, { once: true });
            });
        };
        document.body.addEventListener("click", retry, { once: true });
    }

    // Timed sequence: background audio + loading bar, then intro audio
    console.log("▶ Attempting to play background audio...");
    if(audioStatus){
        audioStatus.textContent = "Audio: playing background...";
    }
    bgAudio.muted = false;
    bgAudio.loop = false;
    bgAudio.volume = 0.7;
    bgAudio.load();
    bgAudio.currentTime = 0;

    const playPromise = bgAudio.play();
    if(playPromise === undefined){
        return Promise.reject(new Error("Audio play not supported"));
    }

    return playPromise.then(() => {
        console.log("Background audio started");
        if(audioStatus){
            audioStatus.textContent = "Audio: background playing";
        }

        // Sync loading bar + trigger intro at 10s of background audio
        bgAudio.addEventListener("timeupdate", function() {
            if(bgAudio.duration > 0 && !loadingDone) {
                let percentage = (bgAudio.currentTime / bgAudio.duration) * 100;
                loadingBar.style.width = percentage + "%";
                loadingPercent.innerText = Math.round(percentage) + "%";
                if(percentage >= 100) {
                    loadingDone = true;
                    startIntroPhase();
                }
            }

            if(bgAudio.currentTime >= 10 && !introStarted) {
                introStarted = true;
                console.log("Intro audio start (10s)");
                if(audioStatus){
                    audioStatus.textContent = "Audio: intro playing";
                }
                introAudio.muted = false;
                introAudio.currentTime = 0;
                introAudio.volume = 1;
                introAudio.play().catch(err => {
                    console.log("Intro audio play error:", err);
                });
            }
        });

        // Load first question only when intro ends
        introAudio.addEventListener("ended", function() {
            console.log("Intro ended - load first question");
            startFirstQuestion();
        });

        // Fallback if sequence stalls
        setTimeout(() => {
            if(!gameStarted) {
                console.log("Fallback: forcing game start");
                startIntroPhase();
            }
        }, 25000);
    }).catch(err => {
        console.log("Audio blocked:", err);
        if(audioStatus){
            audioStatus.textContent = "Audio blocked. Click anywhere to enable sound.";
        }
        setupAudioRetry();
        throw err;
    });
    
}

function loadQuestionWithIntro() {
    // Clear and reset
    document.getElementById("messageBox").innerText = "";
    document.querySelectorAll(".option").forEach(o => {
        o.style.display = "block";
        o.classList.remove("correct", "wrong", "reveal");
    });
    
    // Load the question data
    let questionsArray = getQuestionsArray();
    let available = questionsArray.filter((q, idx) => !recentQuestions.includes(idx));
    let randomIndex = Math.floor(Math.random() * available.length);
    let selectedQuestion = available[randomIndex];
    let selectedIdx = questionsArray.indexOf(selectedQuestion);
    
    recentQuestions.push(selectedIdx);
    if(recentQuestions.length > 50) recentQuestions.shift();
    
    currentQuestion = selectedQuestion;
    
    // Display question text
    document.getElementById("questionText").innerText = currentQuestion.q;
    
    // Display options with reveal animation
    document.querySelectorAll(".option-text").forEach((e, i) => {
        e.innerText = currentQuestion.o[i];
        document.querySelectorAll(".option")[i].classList.add("reveal");
    });
    
    // Intro audio is already playing from the timed sequence
    console.log("Initial question shown with option reveal");
}

function renderLadder(){
    const ul = document.getElementById("ladderList");
    ul.innerHTML = "";
    ladderAmounts.forEach((amt,i)=>{
        let li = document.createElement("li");
        li.innerText = amt;
        if(i === currentLevel) li.classList.add("active");
        ul.appendChild(li);
    });
}

function loadQuestion(){
    // Reset recent questions if difficulty level changed
    let newDifficulty = getDifficultyCategory();
    if(window.lastDifficulty !== newDifficulty) {
        recentQuestions = [];
        window.lastDifficulty = newDifficulty;
    }
    
    document.getElementById("messageBox").innerText="";
    
    // Remove animation classes and hide options
    document.querySelectorAll(".option").forEach(o=>{
        o.style.display="block";
        o.classList.remove("correct","wrong","reveal");
        o.style.opacity = "0";
    });

    currentQuestion = getNewQuestion();

    questionCount += 1;
    const questionNumberEl = document.getElementById("questionNumber");
    if(questionNumberEl){
        questionNumberEl.innerText = "Question " + questionCount;
    }

    // Update score display
    const scorePill = document.querySelector(".score-pill");
    if(scorePill){
        scorePill.textContent = "₹ " + ladderAmounts[currentLevel];
    }

    typeQuestion(currentQuestion.q, () => {
        // Add reveal animation to options with delay
        document.querySelectorAll(".option-text").forEach((e,i)=>{
            e.innerText=currentQuestion.o[i];
            setTimeout(() => {
                document.querySelectorAll(".option")[i].classList.add("reveal");
                document.querySelectorAll(".option")[i].style.opacity = "1";
            }, i * 300);
        });

        // Start timer after options appear
        setTimeout(() => {
            startTimer();
        }, 1200);
    });

    // Stop any previous audio playback
    let introAudio = document.getElementById("introAudio");
    introAudio.pause();
    introAudio.currentTime = 0;
    
    // Play question audio
    let questionAudio = document.getElementById("questionAudio");
    questionAudio.currentTime = 0;
    questionAudio.play().catch(e => console.log("Question audio play failed:", e));
}

function typeQuestion(text, done){
    const el = document.getElementById("questionText");
    if(typeInterval){
        clearInterval(typeInterval);
    }
    el.textContent = "";
    let i = 0;
    const speed = 25;
    typeInterval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if(i >= text.length){
            clearInterval(typeInterval);
            typeInterval = null;
            if(done) done();
        }
    }, speed);
}

function getNewQuestion(){
    let questionsArray = getQuestionsArray();
    let available = questionsArray.filter((q,idx) => !recentQuestions.includes(idx));
    let randomIndex = Math.floor(Math.random() * available.length);
    let selectedQuestion = available[randomIndex];
    let selectedIdx = questionsArray.indexOf(selectedQuestion);
    
    recentQuestions.push(selectedIdx);
    if(recentQuestions.length > 50) recentQuestions.shift();
    
    return selectedQuestion;
}

function startTimer(){
    timeLeft = 30;
    document.getElementById("timer").innerText=timeLeft;

    clearInterval(timerInterval);
    timerInterval=setInterval(()=>{
        timeLeft--;
        document.getElementById("timer").innerText=timeLeft;
        if(timeLeft<=0){
            clearInterval(timerInterval);
            document.querySelectorAll(".option").forEach((o,idx)=>{
                if(idx === currentQuestion.c) o.classList.add("correct");
            });
            
            // Stop question audio and play wrong sound when time expires
            let questionAudio = document.getElementById("questionAudio");
            questionAudio.pause();
            questionAudio.currentTime = 0;
            
            let wrongAudio = document.getElementById("wrongAudio");
            wrongAudio.currentTime = 0;
            wrongAudio.play().catch(e => console.log("Wrong audio play failed:", e));
            
            showWrong(-1);
        }
    },1000);
}

function cleanupAudio() {
    // Stop and reset all audio
    let bgAudio = document.getElementById("bgAudio");
    let introAudio = document.getElementById("introAudio");
    let questionAudio = document.getElementById("questionAudio");
    let wrongAudio = document.getElementById("wrongAudio");
    let winAudio = document.getElementById("winAudio");
    
    // Pause all audio
    bgAudio.pause();
    introAudio.pause();
    questionAudio.pause();
    wrongAudio.pause();
    winAudio.pause();
    
    // Reset playback position
    bgAudio.currentTime = 0;
    introAudio.currentTime = 0;
    questionAudio.currentTime = 0;
    wrongAudio.currentTime = 0;
    winAudio.currentTime = 0;
    
    // Clear any event listeners to prevent conflicts
    bgAudio.onended = null;
    introAudio.onended = null;
    
    console.log("Audio cleanup complete");
}

function selectAnswer(i){
    clearInterval(timerInterval);
    let optionElements = document.querySelectorAll(".option");

    if(i === currentQuestion.c){
        optionElements[i].classList.add("correct");
        document.getElementById("messageBox").innerText="✅ Correct!";
        currentLevel--;
        if(currentLevel < 0){
            // Trigger cracker burst effect
            crackerBurst();
            
            // Stop all other audio
            cleanupAudio();
            
            // Play 7 crore winning sound
            let winAudio = document.getElementById("winAudio");
            winAudio.currentTime = 0;
            winAudio.play().catch(e => console.log("Win audio play failed:", e));
            
            setTimeout(() => {
                alert("🎉 You Won 7 Crore!");
                cleanupAudio();
                location.reload();
            }, 3000);
            return;
        }
        renderLadder();
        
        // Stop question audio before loading next question
        let questionAudio = document.getElementById("questionAudio");
        questionAudio.pause();
        questionAudio.currentTime = 0;
        
        setTimeout(loadQuestion, 2000);
    } else {
        optionElements[i].classList.add("wrong");
        optionElements[currentQuestion.c].classList.add("correct");
        
        // Stop question audio and play wrong answer sound
        let questionAudio = document.getElementById("questionAudio");
        questionAudio.pause();
        questionAudio.currentTime = 0;
        
        let wrongAudio = document.getElementById("wrongAudio");
        wrongAudio.currentTime = 0;
        wrongAudio.play().catch(e => console.log("Wrong audio play failed:", e));
        
        showWrong(i);
    }
}

function showWrong(selectedIdx){
    let winAmount = ladderAmounts[currentLevel];
    showGameOverModal(winAmount, selectedIdx === -1 ? "⏱️ Time's Up!" : "❌ Wrong Answer!");
}

function showGameOverModal(amount, title){
    document.getElementById("gameOverTitle").textContent = title;
    document.getElementById("gameOverAmount").textContent = amount;
    document.getElementById("kannadaText").style.display = "none";
    document.getElementById("gameOverModal").classList.remove("hidden");
}

function confirmGameOver(){
    // Show Kannada text
    document.getElementById("kannadaText").style.display = "block";
    
    // Disable button and prepare for restart
    const button = document.querySelector(".game-over-button");
    button.disabled = true;
    
    setTimeout(() => {
        closeGameOverModal();
    }, 2000);
}

function closeGameOverModal(){
    document.getElementById("gameOverModal").classList.add("hidden");
    cleanupAudio();
    location.reload();
}


function useFifty(){
    if(!lifelines.fifty) return;
    lifelines.fifty=false;
    document.querySelectorAll(".lifelines button")[0].disabled=true;

    let wrong=[0,1,2,3].filter(x=>x!==currentQuestion.c);
    wrong.sort(()=>0.5-Math.random());

    document.querySelectorAll(".option")[wrong[0]].style.display="none";
    document.querySelectorAll(".option")[wrong[1]].style.display="none";
}

function callFriend(){
    if(!lifelines.call) return;
    lifelines.call=false;
    document.querySelectorAll(".lifelines button")[1].disabled=true;

    document.getElementById("callModal").classList.remove("hidden");
    document.getElementById("callText").innerText=
    "I think answer is " + ["A","B","C","D"][currentQuestion.c];

    setTimeout(()=>{
        document.getElementById("callModal").classList.add("hidden");
    },4000);
}

function audiencePoll(){
    if(!lifelines.poll) return;
    lifelines.poll=false;
    document.querySelectorAll(".lifelines button")[2].disabled=true;

    document.getElementById("pollModal").classList.remove("hidden");

    let bars=document.getElementById("pollBars");
    bars.innerHTML="";

    let percentages=[0,0,0,0];
    percentages[currentQuestion.c]=Math.floor(Math.random()*30)+40;
    
    let remaining=100-percentages[currentQuestion.c];
    for(let i=0;i<4;i++){
        if(i!==currentQuestion.c){
            let percent=Math.floor(remaining/3);
            percentages[i]=percent;
            remaining-=percent;
        }
    }
    percentages[Math.floor(Math.random()*4)]+=remaining;

    for(let i=0;i<4;i++){
        let container=document.createElement("div");
        container.className="poll-item";
        
        let label=document.createElement("div");
        label.className="poll-label";
        label.innerText="Option "+["A","B","C","D"][i];
        
        let barContainer=document.createElement("div");
        barContainer.className="poll-bar-container";
        
        let bar=document.createElement("div");
        bar.className="poll-bar";
        bar.style.width=percentages[i]+"%";
        
        let percent=document.createElement("div");
        percent.className="poll-percent";
        percent.innerText=percentages[i]+"%";
        
        barContainer.appendChild(bar);
        barContainer.appendChild(percent);
        container.appendChild(label);
        container.appendChild(barContainer);
        bars.appendChild(container);
    }

    setTimeout(()=>{
        document.getElementById("pollModal").classList.add("hidden");
    },5000);
}

function crackerBurst(){
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8A5C0', '#9FF1ED'];
    const particleCount = 80;
    
    for(let i = 0; i < particleCount; i++){
        let cracker = document.createElement("div");
        cracker.className = "cracker burst";
        cracker.style.left = "50%";
        cracker.style.top = "50%";
        cracker.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random angle for burst direction
        let angle = (Math.PI * 2 * i) / particleCount;
        let velocity = 3 + Math.random() * 8;
        let tx = Math.cos(angle) * velocity * 100;
        let ty = Math.sin(angle) * velocity * 100;
        
        cracker.style.setProperty('--tx', tx + 'px');
        cracker.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(cracker);
        
        // Remove element after animation
        setTimeout(() => cracker.remove(), 1200);
    }
    
    // Falling confetti
    for(let i = 0; i < 50; i++){
        setTimeout(() => {
            let confetti = document.createElement("div");
            confetti.className = "cracker fall";
            confetti.style.left = Math.random() * 100 + "%";
            confetti.style.top = "-10px";
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.setProperty('--drift', (Math.random() - 0.5) * 300 + 'px');
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

function switchQuestion(){
    if(!lifelines.switch) return;
    lifelines.switch=false;
    document.querySelectorAll(".lifelines button")[3].disabled=true;
    loadQuestion();
}