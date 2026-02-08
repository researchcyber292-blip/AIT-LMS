export const adminCredentials = {
  'ethical-hacking': { username: 'cyber@ait.com', password: 'cyber@ait(hacking)' },
  'data-science': { username: 'datascience@ait.com', password: 'data@ait(datascience)' },
  'full-stack-dev': { username: 'webdev@ait.com', password: 'website@ait(webdev)' },
  'ai-ml': { username: 'aiml@ait.com', password: 'aiml@ait(aiml)' },
  'robotics-tech': { username: 'robotics@ait.com', password: 'robo@ait(machine)' },
  'coding': { username: 'coding@ait.com', password: 'coding@ait(programming)' },
};

export type AdminCategory = keyof typeof adminCredentials;
