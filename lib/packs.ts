export interface PackSeed {
  left: string
  right: string
  center: string
}

export interface Pack {
  id: string
  name: string
  emoji: string
  seeds: PackSeed[]
}

export const PACKS: Pack[] = [
  {
    id: 'dev',
    name: 'Dev Pack',
    emoji: '💻',
    seeds: [
      { left: 'tabs', right: 'spaces', center: 'writing code that breaks in prod' },
      { left: 'vim users', right: 'vs code users', center: 'judging each other\'s editor' },
      { left: 'frontend devs', right: 'backend devs', center: 'blaming devops' },
      { left: 'people who write tests', right: 'people who skip tests', center: 'shipping on friday' },
      { left: 'stack overflow copiers', right: 'people who read the docs', center: 'getting the same answer' },
      { left: 'dark mode devs', right: 'light mode devs', center: 'staring at screens all day' },
      { left: 'git commit -m "fix"', right: 'git commit -m "refactor core auth middleware to support oauth2 flows"', center: 'breaking the build' },
      { left: 'microservices people', right: 'monolith defenders', center: 'overengineering everything' },
      { left: 'people who comment their code', right: 'people who write self-documenting code', center: 'confusing the next dev' },
      { left: 'npm install everything', right: 'write it from scratch people', center: 'spending 3 hours on a feature' },
    ],
  },
  {
    id: 'uk',
    name: 'UK Pack',
    emoji: '🇬🇧',
    seeds: [
      { left: 'tea with milk first', right: 'tea with water first', center: 'having a very strong opinion about tea' },
      { left: 'people who say "sorry" constantly', right: 'people who never apologise', center: 'being british' },
      { left: 'northerners', right: 'southerners', center: 'arguing about the price of a pint' },
      { left: 'people who queue properly', right: 'people who push in', center: 'waiting for the bus' },
      { left: 'biscuit dunkers', right: 'biscuit non-dunkers', center: 'having tea' },
      { left: 'people who call it a bread roll', right: 'people who call it a cob', center: 'ordering a sandwich' },
      { left: 'tube people', right: 'overground people', center: 'commuting in london' },
      { left: '"it\'s not that cold"', right: '"i\'m absolutely freezing"', center: 'it being 14 degrees' },
      { left: 'marks & spencer people', right: 'lidl people', center: 'buying groceries' },
      { left: 'people who moan about the weather', right: 'people who love the rain', center: 'talking about weather constantly' },
    ],
  },
  {
    id: 'food',
    name: 'Food Pack',
    emoji: '🍕',
    seeds: [
      { left: 'pineapple on pizza', right: 'no pineapple on pizza', center: 'having extremely strong pizza opinions' },
      { left: 'ketchup people', right: 'mayo people', center: 'ruining someone\'s chips' },
      { left: 'well-done steak people', right: 'medium-rare steak people', center: 'upsetting a chef' },
      { left: 'cilantro lovers', right: 'cilantro tastes like soap people', center: 'debating genetics' },
      { left: 'cereal before milk', right: 'milk before cereal', center: 'eating breakfast wrong' },
      { left: 'people who eat pizza with a fork', right: 'hand pizza people', center: 'eating pizza' },
      { left: 'diet coke people', right: 'full fat coke people', center: 'ordering at mcdonalds' },
      { left: 'people who eat the crust', right: 'people who leave the crust', center: 'wasting bread' },
      { left: 'breakfast burrito people', right: 'avocado toast people', center: 'spending £12 on brunch' },
      { left: 'spicy food lovers', right: 'plain food people', center: 'ordering medium' },
    ],
  },
  {
    id: 'relationship',
    name: 'Relationship Pack',
    emoji: '💕',
    seeds: [
      { left: 'people who text back in 10 seconds', right: 'people who leave you on read for 3 days', center: 'owning a smartphone' },
      { left: 'window seat people', right: 'aisle seat people', center: 'arguing on planes' },
      { left: 'people who are always early', right: 'people who are always late', center: 'stressing everyone out' },
      { left: 'people who plan everything', right: 'spontaneous people', center: 'going on holiday together' },
      { left: 'morning people', right: 'night people', center: 'disrupting each other\'s sleep' },
      { left: 'people who want the ac on', right: 'people who are always cold', center: 'arguing about room temperature' },
      { left: 'people who leave dishes to soak', right: 'people who wash up immediately', center: 'passive aggressively cleaning' },
      { left: 'people who leave cupboard doors open', right: 'people who close every cupboard', center: 'low-key arguing at home' },
      { left: 'couch cuddlers', right: 'personal space people', center: 'watching tv together' },
      { left: 'gift givers', right: 'experience givers', center: 'celebrating birthdays' },
    ],
  },
  {
    id: 'gamer',
    name: 'Gamer Pack',
    emoji: '🎮',
    seeds: [
      { left: 'pc master race', right: 'console peasants', center: 'playing the same games' },
      { left: 'people who skip cutscenes', right: 'people who watch every cutscene', center: 'playing rpgs' },
      { left: 'achievement hunters', right: 'people who just play for fun', center: 'spending 200 hours on a game' },
      { left: 'controller users', right: 'keyboard and mouse users', center: 'losing at fps games' },
      { left: 'people who pause during combat', right: 'people who never pause', center: 'making the game harder' },
      { left: 'stealth players', right: 'run and gun players', center: 'failing the mission' },
      { left: 'people who read every item description', right: 'people who skip all lore', center: 'missing the point' },
      { left: 'people who play on hard mode', right: 'people who play on easy', center: 'finishing the game' },
      { left: 'day one buyers', right: 'wait for the sale people', center: 'playing the same game' },
      { left: 'people who mute voice chat', right: 'people who argue on voice chat', center: 'playing multiplayer' },
    ],
  },
]
