export interface Seed {
  left: string
  right: string
  center: string
}

export const SEEDS: Seed[] = [
  { left: "people who wake up at 5am", right: "people who stay up until 5am", center: "telling everyone about their sleep schedule" },
  { left: "iphone users", right: "android users", center: "judging people with green bubbles" },
  { left: "frontend devs", right: "backend devs", center: "blaming devops" },
  { left: "vegans", right: "carnivores", center: "making their diet a personality" },
  { left: "people who hate mondays", right: "people who love mondays", center: "talking about it constantly" },
  { left: "tea drinkers", right: "coffee drinkers", center: "judging the other side" },
  { left: "gym rats", right: "people who never exercise", center: "owning gym clothes" },
  { left: "introverts", right: "extroverts", center: "cancelling plans" },
  { left: "chrome users", right: "safari users", center: "having too many tabs open" },
  { left: "dog people", right: "cat people", center: "thinking their pet is superior" },
  { left: "people who reply instantly", right: "people who leave you on read", center: "being tired" },
  { left: "marvel fans", right: "dc fans", center: "watching every single one anyway" },
  { left: "windows users", right: "mac users", center: "spending too much on their setup" },
  { left: "tourists", right: "locals", center: "complaining about tourists" },
  { left: "morning shower people", right: "night shower people", center: "judging shower timing" },
  { left: "people who skip the gym", right: "people who never miss the gym", center: "wearing lululemon" },
  { left: "spicy food lovers", right: "people who can't handle spice", center: "ordering medium" },
  { left: "remote workers", right: "office workers", center: "complaining about commutes" },
  { left: "night owls", right: "early birds", center: "being tired all the time" },
  { left: "people who read the book", right: "people who watched the movie", center: "spoiling the ending" },
  { left: "pineapple on pizza people", right: "people who hate pineapple on pizza", center: "having strong opinions about pizza" },
  { left: "people who skip ads", right: "people who watch ads", center: "using youtube" },
  { left: "fast walkers", right: "slow walkers", center: "getting annoyed on sidewalks" },
  { left: "people who are always early", right: "people who are always late", center: "stressing everyone out" },
  { left: "people who text back immediately", right: "people who take 3 days to reply", center: "using their phones" },
  { left: "people who love cold weather", right: "people who love hot weather", center: "complaining about the weather" },
  { left: "ketchup people", right: "no ketchup people", center: "judging condiment choices" },
  { left: "light mode users", right: "dark mode users", center: "judging screen setups" },
  { left: "people who meal prep", right: "people who order delivery every day", center: "spending money on food" },
  { left: "people who skip the intro", right: "people who watch every credit", center: "sitting through end credits" },
  { left: "people who set 10 alarms", right: "people who wake up on the first alarm", center: "struggling to get up" },
  { left: "tab hoarders", right: "people with 1 tab open", center: "judging browser habits" },
  { left: "people who still use cash", right: "people who only use cards", center: "awkward moments at checkout" },
  { left: "people who fold laundry immediately", right: "people who live out of the laundry basket", center: "having clean clothes" },
  { left: "reply-all people", right: "please-stop-reply-all people", center: "email chains" },
  { left: "people who use 'per my last email'", right: "people who ignore emails", center: "passive aggression" },
  { left: "people who love cilantro", right: "people who think cilantro tastes like soap", center: "debating food genetics" },
  { left: "standing desk users", right: "sitting desk users", center: "having a desk" },
  { left: "people who narrate their workouts", right: "people who silently suffer at the gym", center: "going to the gym" },
  { left: "people who bring their own snacks", right: "people who buy overpriced airport food", center: "surviving long flights" },
]

export function getRandomSeed(): Seed {
  return SEEDS[Math.floor(Math.random() * SEEDS.length)]
}
