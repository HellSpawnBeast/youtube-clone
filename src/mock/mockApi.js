// Mock YouTube Data API v3 responses so the UI can be tested without an API key.
// Routed by src/axios.js whenever VITE_YT_API_KEY is empty.

import {
  categories,
  channels,
  channelById,
  commentsForVideo,
  findVideo,
  uploadsIdForChannel,
  videos,
  videosForChannel,
} from "./mockData";

const NETWORK_DELAY = 180;
const PAGE_SIZE = 20;

const wait = () => new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY));

const paginate = (items, params, size) => {
  const page = Number(params?.pageToken) > 0 ? Number(params.pageToken) : 1;
  const start = (page - 1) * size;
  return {
    items: items.slice(start, start + size),
    nextPageToken: start + size < items.length ? String(page + 1) : undefined,
    totalResults: items.length,
  };
};

const toSearchItem = (video) => ({
  kind: "youtube#searchResult",
  etag: video.etag,
  id: { kind: "youtube#video", videoId: video.id },
  snippet: video.snippet,
});

const videoSearchItem = (video) => ({
  id: video.id,
  snippet: video.snippet,
});

/**
 * Returns the response body for a mocked YouTube API request.
 * @param {string} url path relative to the API base URL, e.g. "/videos"
 * @param {object} params axios params
 */
export async function mockRequest(url, params = {}) {
  await wait();
  const path = String(url || "").replace(/\/+$/, "") || "/";

  switch (path) {
    case "/videoCategories": {
      return {
        kind: "youtube#videoCategoryListResponse",
        items: categories.map((category) => ({
          kind: "youtube#videoCategory",
          id: category.id,
          snippet: { title: category.title, assignable: true },
        })),
      };
    }

    case "/videos": {
      // Detail lookup used by video cards, metadata and the watch screen.
      if (params.id) {
        const ids = String(params.id).split(",");
        return {
          kind: "youtube#videoListResponse",
          items: ids.map(findVideo),
          pageInfo: { totalResults: ids.length, resultsPerPage: ids.length },
        };
      }
      // Most popular feed.
      const sorted = [...videos].sort(
        (a, b) => Number(b.statistics.viewCount) - Number(a.statistics.viewCount)
      );
      const page = paginate(sorted, params, PAGE_SIZE);
      return {
        kind: "youtube#videoListResponse",
        items: page.items.map(videoSearchItem),
        nextPageToken: page.nextPageToken,
        pageInfo: { totalResults: page.totalResults, resultsPerPage: PAGE_SIZE },
      };
    }

    case "/search": {
      const related = params.relatedToVideoId;
      const query = String(params.q || "").trim().toLowerCase();

      let pool = videos;
      if (related) {
        pool = videos.filter((video) => video.id !== related);
      } else if (query) {
        const matchedChannels = channels.filter((channel) =>
          channel.snippet.title.toLowerCase().includes(query)
        );
        const matchedVideos = videos.filter((video) =>
          [video.snippet.title, video.snippet.channelTitle, video.category]
            .join(" ")
            .toLowerCase()
            .includes(query)
        );
        const results = [
          ...matchedVideos.map(toSearchItem),
          ...matchedChannels.map((channel) => ({
            id: { kind: "youtube#channel", channelId: channel.id },
            snippet: {
              title: channel.snippet.title,
              description: channel.snippet.description,
              channelId: channel.id,
              channelTitle: channel.snippet.title,
              publishedAt: videoPublishedFallback(),
              thumbnails: channel.snippet.thumbnails,
            },
          })),
        ];
        if (results.length) {
          return {
            kind: "youtube#searchListResponse",
            items: results,
            pageInfo: { totalResults: results.length, resultsPerPage: PAGE_SIZE },
          };
        }
      }

      const page = paginate(pool, params, PAGE_SIZE);
      return {
        kind: "youtube#searchListResponse",
        items: page.items.map(toSearchItem),
        nextPageToken: page.nextPageToken,
        pageInfo: { totalResults: page.totalResults, resultsPerPage: PAGE_SIZE },
      };
    }

    case "/channels": {
      const channel = channelById(String(params.id || ""));
      return {
        kind: "youtube#channelListResponse",
        items: channel ? [channel] : [],
        pageInfo: { totalResults: channel ? 1 : 0, resultsPerPage: 1 },
      };
    }

    case "/playlistItems": {
      const channel = channels.find(
        (item) => uploadsIdForChannel(item.id) === params.playlistId
      );
      const uploads = channel ? videosForChannel(channel.id) : [];
      const page = paginate(uploads, params, 25);
      return {
        kind: "youtube#playlistItemListResponse",
        items: page.items.map((video) => ({
          id: `playlistItem-${video.id}`,
          snippet: {
            ...video.snippet,
            resourceId: { kind: "youtube#video", videoId: video.id },
          },
          contentDetails: { videoId: video.id },
        })),
        nextPageToken: page.nextPageToken,
        pageInfo: { totalResults: page.totalResults, resultsPerPage: 25 },
      };
    }

    case "/commentThreads": {
      const page = paginate(commentsForVideo(String(params.videoId || "")), params, 5);
      return {
        kind: "youtube#commentThreadListResponse",
        items: page.items,
        nextPageToken: page.nextPageToken,
        pageInfo: { totalResults: page.totalResults, resultsPerPage: 5 },
      };
    }

    default:
      return { items: [] };
  }
}

const videoPublishedFallback = () =>
  new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
