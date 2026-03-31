/**
 * Deterministic daily tasks: same calendar day → same default prompt (per variant).
 * No API cost; rotate with variant for "another angle" on the same day.
 */

function localDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function hashPick(key: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  return Math.abs(h) % modulo;
}

export const DAILY_WRITING_PROMPTS: string[] = [
  "Do the advantages of remote work outweigh the disadvantages for most employees? Discuss and give your opinion.",
  "Some argue that public museums and galleries should be free. To what extent do you agree or disagree?",
  "In many cities, traffic congestion is worsening. What are the causes, and what measures could governments take?",
  "Technology makes information freely available, but not everyone benefits equally. Discuss both views and give your opinion.",
  "Should governments ban advertising aimed at children? To what extent do you agree or disagree?",
  "The gap between high and low earners is widening. What problems might this cause, and what could be done?",
  "Some people think university education should be free for all. Others believe students should pay. Discuss both views.",
  "Plastic waste is a global problem. Who should take more responsibility — producers, governments, or individuals?",
  "Living in a foreign country can be rewarding but challenging. What are the main difficulties, and how can people overcome them?",
  "Should companies be required to publish their gender pay gap? To what extent do you agree or disagree?",
  "Social media connects people but may harm mental health. Discuss both sides and state your view.",
  "Large shopping malls are replacing small local shops. Is this a positive or negative development?",
  "Some believe handwriting will disappear in schools. Do the benefits of typing outweigh the loss of handwriting?",
  "Climate change requires urgent action, but economic growth is also a priority. How can governments balance these goals?",
  "Should parents be legally responsible for crimes their teenage children commit? To what extent do you agree?",
  "Tourism boosts economies but can damage culture and the environment. Discuss the impacts and suggest how to reduce harm.",
  "Many jobs will be automated. What are the social consequences, and how should societies prepare?",
  "Some think competitive sports teach valuable life skills; others say they encourage aggression. Discuss both views.",
  "Governments spend money on arts and culture while some citizens lack basic services. Is this justified?",
  "The best way to reduce crime is longer prison sentences. To what extent do you agree or disagree?",
  "People today read less literature than in the past. What are the reasons, and is this a problem?",
  "Should wealthy nations be required to share resources with poorer ones? Give reasons for your answer.",
  "Online learning can replace traditional classrooms. To what extent do you agree or disagree?",
  "Advertising encourages people to buy things they do not need. Is this a harmful effect of a free market?",
  "Some cities invest in cycle lanes instead of roads. Is this a positive trend?",
  "The news media should be controlled by the government to reduce misinformation. Do you agree?",
  "People are living longer. What are the advantages and disadvantages for society?",
  "Success is measured by wealth and status. Others define it by happiness and relationships. Discuss both views.",
  "Should animal testing be banned for cosmetics and medicines? Give a balanced argument.",
  "Urban green spaces are essential for quality of life. To what extent do you agree?",
  "International sporting events promote peace and understanding. To what extent is this true?",
  "Some parents give children pocket money for chores; others disagree. What is your view?",
  "The rise of fast fashion has environmental costs. Who is responsible, and what should change?",
  "People should eat less meat for health and the planet. To what extent do you agree or disagree?",
  "Libraries are obsolete in the digital age. To what extent do you agree or disagree?",
  "Working fewer hours per week would improve well-being and productivity. Discuss.",
  "Public figures deserve less privacy than ordinary citizens. To what extent do you agree?",
  "Artificial intelligence will do more good than harm in the next twenty years. Discuss both views.",
  "Children should learn a foreign language from primary school. What are the benefits and drawbacks?",
  "Housing costs in cities are unaffordable for young people. What are the causes, and what solutions exist?",
  "Volunteering should be compulsory for all young adults. To what extent do you agree or disagree?",
  "The best way to learn a language is to live in a country where it is spoken. Do you agree?",
  "Companies should promote from within rather than hire externally. Discuss the pros and cons.",
  "Printed newspapers will disappear completely. Is this a positive development?",
  "Governments should fund space exploration despite problems on Earth. To what extent do you agree?",
  "Older people should retire at a fixed age to give jobs to the young. Discuss both views.",
];

export const DAILY_SPEAKING_CUES: string[] = [
  "Describe a skill you would like to learn in the next year. Say what it is, why you want it, how you would learn it, and how it would help you.",
  "Talk about a book or article that influenced you. Say what it was, when you read it, what it said, and why it mattered.",
  "Describe a time you helped someone solve a problem. Say who it was, what the problem was, what you did, and how it turned out.",
  "Describe a place in your hometown you would show a visitor. Say where it is, what they would see, when you go there, and why you recommend it.",
  "Talk about a goal you are working towards now. Say what it is, why you chose it, what steps you are taking, and what difficulties you face.",
  "Describe a piece of technology you rely on daily. Say what it is, how long you have used it, what you use it for, and what you would do without it.",
  "Talk about someone you admire professionally. Say who they are, how you know of them, what they do well, and what you have learned.",
  "Describe a festival or celebration you enjoy. Say what it is, when it happens, what people do, and why you like it.",
  "Talk about a difficult decision you made. Say what the situation was, what options you had, what you chose, and whether you would decide the same way again.",
  "Describe a café or restaurant you like. Say where it is, how often you go, what you usually order, and why you keep going back.",
  "Talk about a hobby that relaxes you. Say what it is, when you started, how often you do it, and why it helps you unwind.",
  "Describe a journey you remember well. Say where you went, who you were with, what happened, and why it stayed with you.",
  "Talk about a news story that caught your attention recently. Say what it was about, where you heard it, why it mattered to you, and what you think should happen next.",
  "Describe your ideal weekend day. Say how you would spend the morning, afternoon, and evening, and who you would spend it with.",
  "Talk about a teacher or mentor who shaped you. Say who they were, what subject or area, what they did differently, and how you benefited.",
  "Describe a small business you would like to start. Say what it would sell or do, where it would be, who your customers would be, and why you think it could work.",
  "Talk about a sport or physical activity you enjoy or would try. Say what it is, whether you do it now, what equipment or space you need, and what you get out of it.",
  "Describe a museum, gallery, or exhibition you visited. Say where it was, what you saw, who you went with, and what impressed you most.",
  "Talk about how you prefer to study or work. Say where you like to be, what tools you use, how you avoid distractions, and what you would change.",
  "Describe a tradition in your family or culture. Say what happens, when, who takes part, and why it is important to you.",
  "Talk about a time you received useful feedback. Say who gave it, what situation it was about, what they said, and how you applied it.",
  "Describe a park or outdoor space you use. Say where it is, what you do there, how often you go, and why it matters to your routine.",
  "Talk about a film or series you would recommend. Say what it is, what genre it is, what happens without spoiling the end, and who would enjoy it.",
  "Describe a challenge your city or region faces. Say what the issue is, who is affected, what is being done, and what you would suggest.",
  "Talk about learning English (or another language). Say when you started, what methods help you most, what is still hard, and why you keep going.",
  "Describe a gift you gave or received that was meaningful. Say what it was, the occasion, why you chose it or appreciated it, and whether you still have it.",
  "Talk about a rule at school or work you find fair or unfair. Say what the rule is, why it exists, how people react, and what you would change if anything.",
  "Describe a time you worked in a team. Say what the project was, what your role was, what went well or badly, and what you learned.",
  "Talk about how you manage stress during busy periods. Say what triggers stress for you, what techniques you use, what works best, and what you avoid.",
  "Describe a building or landmark you find interesting. Say where it is, what it looks like, whether you have been inside, and why you notice it.",
];

export function pickDailyWritingPrompt(date: Date, variant = 0): string {
  const day = localDayKey(date);
  const i = hashPick(`${day}:writing:v${variant}`, DAILY_WRITING_PROMPTS.length);
  return DAILY_WRITING_PROMPTS[i]!;
}

export function pickDailySpeakingCue(date: Date, variant = 0): string {
  const day = localDayKey(date);
  const i = hashPick(`${day}:speaking:v${variant}`, DAILY_SPEAKING_CUES.length);
  return DAILY_SPEAKING_CUES[i]!;
}

export function formatDailyPracticeDate(date: Date): string {
  try {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return localDayKey(date);
  }
}
