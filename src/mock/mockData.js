// Deterministic mock content for the YouTube clone UI.
// Used when no VITE_YT_API_KEY is configured (see src/axios.js).

const PALETTE = [
  ["#1e3a8a", "#3b82f6"],
  ["#7c2d12", "#f97316"],
  ["#14532d", "#22c55e"],
  ["#4c1d95", "#a855f7"],
  ["#831843", "#ec4899"],
  ["#0f766e", "#2dd4bf"],
  ["#713f12", "#eab308"],
  ["#1e293b", "#64748b"],
];

const hash = (value) => {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const escapeXml = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const svgUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const thumb = (seed, label) => {
  const [from, to] = PALETTE[hash(seed) % PALETTE.length];
  return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="320" height="180" fill="url(#g)"/>
    <circle cx="160" cy="88" r="26" fill="#ffffff" fill-opacity="0.9"/>
    <path d="M152 74 L179 88 L152 102 Z" fill="${from}"/>
    <text x="16" y="26" font-family="Arial, Helvetica, sans-serif" font-size="12" font-weight="bold" fill="#ffffff" fill-opacity="0.8">MOCK</text>
    <text x="16" y="162" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#ffffff">${escapeXml(label)}</text>
  </svg>`);
};

const avatar = (seed, initials) => {
  const [from, to] = PALETTE[hash(seed) % PALETTE.length];
  return svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
    <defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="240" height="240" fill="url(#a)"/>
    <text x="120" y="145" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="88" font-weight="bold" fill="#ffffff">${escapeXml(initials)}</text>
  </svg>`);
};

export const categories = [
  { id: "10", title: "Music" },
  { id: "20", title: "Gaming" },
  { id: "28", title: "Technology" },
  { id: "26", title: "Cooking" },
  { id: "19", title: "Travel" },
  { id: "27", title: "Design" },
  { id: "24", title: "Sports" },
  { id: "25", title: "Science" },
  { id: "23", title: "Comedy" },
  { id: "22", title: "News" },
];

const CHANNELS = [
  { id: "UCmockmedialab0000000001", title: "Mock Media Lab", initials: "MM", subscribers: 1820000 },
  { id: "UCkitchenbytes00000000002", title: "Kitchen Bytes", initials: "KB", subscribers: 940000 },
  { id: "UCpixelandpaint0000000003", title: "Pixel & Paint", initials: "PP", subscribers: 415000 },
  { id: "UCfieldnotes0000000000004", title: "Field Notes", initials: "FN", subscribers: 268000 },
  { id: "UCbaselinebeats0000000005", title: "Baseline Beats", initials: "BB", subscribers: 1210000 },
];

export const channels = CHANNELS.map((channel) => ({
  id: channel.id,
  snippet: {
    title: channel.title,
    description: `${channel.title} — mock channel used for UI testing.`,
    thumbnails: {
      default: { url: avatar(channel.id, channel.initials) },
      medium: { url: avatar(channel.id, channel.initials) },
      high: { url: avatar(channel.id, channel.initials) },
    },
  },
  contentDetails: { relatedPlaylists: { uploads: `uploads_${channel.id}` } },
  statistics: { subscriberCount: String(channel.subscribers), videoCount: "120" },
}));

export const uploadsIdForChannel = (channelId) => `uploads_${channelId}`;

const CHANNEL_BY_ID = new Map(channels.map((channel) => [channel.id, channel]));

// [title, channel index, category, views, days ago, duration]
const ENTRIES = [
  ["Build a Video App with React in 20 Minutes", 0, "Technology", 842000, 3, "12:41"],
  ["Vite vs. Webpack: Which Dev Server Wins?", 0, "Technology", 512000, 12, "08:05"],
  ["State Management Explained Simply", 0, "Technology", 331000, 26, "15:22"],
  ["CSS Grid Tricks You Probably Missed", 0, "Technology", 148000, 41, "09:48"],
  ["Debugging React Renders Like a Pro", 0, "Technology", 76200, 58, "18:30"],
  ["Morning Routine of a Software Engineer", 0, "Technology", 902000, 7, "06:12"],
  ["Ranking Every Browser (Honestly)", 0, "Gaming", 1240000, 19, "11:03"],
  ["Weeknight Pasta in 15 Minutes", 1, "Cooking", 2100000, 2, "07:44"],
  ["The Perfect Sourdough, Step by Step", 1, "Cooking", 683000, 21, "22:10"],
  ["Five Sauces Every Cook Should Know", 1, "Cooking", 455000, 35, "13:27"],
  ["Cast Iron Care: A Beginner's Guide", 1, "Cooking", 187000, 49, "05:56"],
  ["Street Food Tour: Night Market Edition", 1, "Travel", 934000, 9, "17:15"],
  ["Colour Theory for Interface Design", 2, "Design", 412000, 5, "14:02"],
  ["Redesigning a Dashboard in 10 Minutes", 2, "Design", 286000, 16, "10:10"],
  ["Typography Rules That Actually Matter", 2, "Design", 129000, 30, "08:52"],
  ["From Sketch to Prototype", 2, "Design", 64200, 44, "16:40"],
  ["Designing Icons at 16 Pixels", 2, "Design", 41800, 62, "07:19"],
  ["48 Hours in Lisbon", 3, "Travel", 736000, 11, "19:35"],
  ["Hiking the Coastal Trail", 3, "Travel", 224000, 24, "13:08"],
  ["Packing Light for Two Weeks", 3, "Travel", 98000, 38, "09:24"],
  ["A Slow Train Through the Mountains", 3, "Travel", 156000, 52, "21:47"],
  ["Hidden Beaches Worth the Walk", 3, "Travel", 87200, 70, "12:33"],
  ["Making a Beat from Kitchen Sounds", 4, "Music", 1450000, 1, "11:21"],
  ["Home Studio Setup Under $500", 4, "Music", 587000, 14, "15:04"],
  ["Why Vinyl Still Sounds Different", 4, "Music", 341000, 28, "10:37"],
  ["Learning Any Song by Ear", 4, "Music", 112000, 46, "08:16"],
];

const DAY = 24 * 60 * 60 * 1000;

const isoDuration = (clock) => {
  const [m, s] = clock.split(":").map(Number);
  return `PT${m}M${s}S`;
};

const isoAgo = (days) => new Date(Date.now() - days * DAY).toISOString();

export const videos = ENTRIES.map(([title, channelIndex, category, views, daysAgo, duration], index) => {
  const channel = channels[channelIndex];
  const id = `mockvid${String(index + 1).padStart(4, "0")}`;
  return {
    id,
    etag: `mock-etag-${id}`,
    category,
    snippet: {
      publishedAt: isoAgo(daysAgo),
      channelId: channel.id,
      title,
      description: `${title}\n\nMock description for UI testing. No YouTube API key is configured, so this content is generated locally by src/mock/mockData.js.\n\nReplace it by adding a VITE_YT_API_KEY environment variable.`,
      channelTitle: channel.snippet.title,
      thumbnails: {
        default: { url: thumb(id, title) },
        medium: { url: thumb(id, title) },
        high: { url: thumb(id, title) },
      },
    },
    contentDetails: { duration: isoDuration(duration) },
    statistics: {
      viewCount: String(views),
      likeCount: String(Math.round(views / 28)),
      dislikeCount: String(Math.round(views / 400)),
      commentCount: String(120 + (hash(id) % 860)),
      favoriteCount: "0",
    },
  };
});

export const findVideo = (id) => {
  const existing = videos.find((video) => video.id === id);
  if (existing) return existing;
  const channel = channels[hash(id) % channels.length];
  const title = `Mock video ${id}`;
  return {
    id,
    etag: `mock-etag-${id}`,
    category: "Technology",
    snippet: {
      publishedAt: isoAgo(2),
      channelId: channel.id,
      title,
      description: "Mock description for UI testing.",
      channelTitle: channel.snippet.title,
      thumbnails: {
        default: { url: thumb(id, title) },
        medium: { url: thumb(id, title) },
        high: { url: thumb(id, title) },
      },
    },
    contentDetails: { duration: "PT10M00S" },
    statistics: {
      viewCount: "45000",
      likeCount: "1600",
      dislikeCount: "40",
      commentCount: "230",
      favoriteCount: "0",
    },
  };
};

export const channelById = (id) => CHANNEL_BY_ID.get(id);

export const videosForChannel = (channelId) =>
  videos.filter((video) => video.snippet.channelId === channelId);

const COMMENT_AUTHORS = [
  "Ava Chen",
  "Marcus Lee",
  "Priya Nair",
  "Tom Becker",
  "Sofia Rossi",
  "Dan Okafor",
  "Yuki Tanaka",
  "Lena Fischer",
];

const COMMENT_TEXTS = [
  "This is exactly what I needed today — thanks for keeping it practical.",
  "The pacing on this one is perfect. More like this please!",
  "I tried this last week and it worked first time. Great explanation.",
  "Could you go deeper on the middle section in a follow-up?",
  "Been watching for a year and this is still my favourite channel.",
  "Small tip: pause at 4:20, the diagram makes it click.",
  "My whole team watched this in standup. Genuinely useful.",
  "Underrated. The audio quality alone is worth it.",
  "Rewatching before I start my own project this weekend.",
  "Okay but the edit at the end is so satisfying.",
];

const initialsOf = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("");

export const commentsForVideo = (videoId) => {
  const base = hash(videoId);
  return Array.from({ length: 12 }, (_, index) => {
    const author = COMMENT_AUTHORS[(base + index) % COMMENT_AUTHORS.length];
    return {
      id: `${videoId}-comment-${index + 1}`,
      snippet: {
        topLevelComment: {
          snippet: {
            textOriginal: COMMENT_TEXTS[(base + index * 3) % COMMENT_TEXTS.length],
            authorDisplayName: author,
            authorProfileImageUrl: avatar(author, initialsOf(author)),
            publishedAt: isoAgo(index * 2 + 1),
            likeCount: (base + index * 7) % 900,
          },
        },
      },
    };
  });
};
