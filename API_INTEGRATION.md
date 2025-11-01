# 3D Marketplace - API Integration Guide

## Overview

This marketplace integrates with **3 major 3D model platforms** to provide a unified browsing experience:

- **Thingiverse** - The world's largest 3D printing community
- **MyMiniFactory** - Premium curated 3D models  
- **Cults3D** - Designer marketplace with free & premium models

## API Setup

### 1. Thingiverse API

1. Visit [Thingiverse Developers](https://www.thingiverse.com/developers)
2. Create an account or sign in
3. Register a new application
4. Copy your API token
5. Add to `.env.local`:

```env
THINGIVERSE_API_TOKEN=your_token_here
```

**Endpoints Used:**
- `/search/{query}` - Search models
- Rate limit: 300 requests/hour

### 2. MyMiniFactory API

1. Visit [MyMiniFactory API Docs](https://www.myminifactory.com/pages/for-developers)
2. Request API access
3. Obtain your API key
4. Add to `.env.local`:

```env
MYMINIFACTORY_API_KEY=your_key_here
```

**Endpoints Used:**
- `/v2/objects` - List popular models
- `/v2/search` - Search models
- Rate limit: 5000 requests/day

### 3. Cults3D

⚠️ **Note:** Cults3D does not have a public API. The integration uses:
- Curated fallback models
- Web scraping (if implemented)
- Manual model curation

## Features

### ✅ Unified Model Search
- Search across all 3 platforms simultaneously
- Intelligent result aggregation
- Duplicate detection

### ✅ Platform Indicators
- Color-coded badges show model source:
  - 🔵 **Blue** = Thingiverse
  - 🟢 **Green** = MyMiniFactory
  - 🟣 **Purple** = Cults3D

### ✅ Advanced Filtering
- **Category**: Figures, Toys, Home Decor, Cosplay, Tools, etc.
- **Price**: Free models / Paid models
- **Sort**: Popular, Downloads, Price, Newest

### ✅ External Links
- Click external link icon to visit model on source platform
- Download directly from original site
- Support creators by visiting their pages

### ✅ Fallback System
- If APIs are unavailable, shows curated models
- Graceful error handling
- No broken user experience

## File Structure

```
src/
├── lib/
│   └── api-clients.ts          # API integration layer
│       ├── ThingiverseClient   # Thingiverse API wrapper
│       ├── MyMiniFactoryClient # MMF API wrapper
│       ├── Cults3DClient       # Cults3D fallback
│       └── UnifiedModelClient  # Aggregates all sources
├── app/
│   └── products/
│       └── page.tsx            # Product catalog with API calls
└── components/
    └── product-card.tsx        # Card supports ExternalModel type
```

## Usage

### Fetching Models

```typescript
import { modelClient } from '@/lib/api-clients'

// Get models from all platforms
const models = await modelClient.getAllModels(50)

// Search specific query
const results = await modelClient.searchAllPlatforms('dragon', 30)

// Get featured models
const featured = await modelClient.getFeaturedModels(12)
```

### Model Data Structure

```typescript
interface ExternalModel {
  id: string
  name: string
  slug?: string
  description: string
  thumbnail: string
  previewImage: string
  creator: string
  creatorAvatar?: string
  downloads: number
  likes: number
  price: number
  isFree: boolean
  category: string
  tags: string[]
  source: 'thingiverse' | 'myminifactory' | 'cults3d'
  externalUrl: string
  createdAt: string
  fileCount?: number
  featured?: boolean
}
```

## Performance Optimizations

### Caching Strategy
- API responses cached for 1 hour using Next.js `revalidate`
- Reduces API calls and improves load times
- Configurable cache duration

```typescript
fetch(url, {
  next: { revalidate: 3600 } // 1 hour
})
```

### Pagination
- Load 50 models per page by default
- Implement infinite scroll for better UX
- Lazy load images

### Error Handling
- Graceful fallback to local models
- User-friendly error messages
- Retry mechanism for failed requests

## API Rate Limits

| Platform | Limit | Window |
|----------|-------|--------|
| Thingiverse | 300 req | /hour |
| MyMiniFactory | 5000 req | /day |
| Cults3D | N/A | N/A |

**Best Practices:**
- Cache aggressively
- Batch requests when possible
- Monitor usage with logging
- Implement exponential backoff

## Testing Without API Keys

The system works perfectly **without** API keys by using:

1. **Fallback Models** - 12 pre-configured models with real data
2. **Mock Data** - Representative of actual API responses
3. **Same UI/UX** - No degradation in user experience

Simply run the app and browse models immediately!

## Future Enhancements

- [ ] Add Printables.com API integration
- [ ] Implement model caching in database
- [ ] Add real-time popularity tracking
- [ ] Support more file formats (OBJ, 3MF, STEP)
- [ ] Creator profiles and follows
- [ ] Advanced search with tags and filters
- [ ] Model remix tracking
- [ ] Print farm integration
- [ ] AR model preview
- [ ] Community ratings and reviews

## Troubleshooting

### Issue: "Using fallback models" message

**Solution:**
- Add API keys to `.env.local`
- Restart development server
- Check API key validity
- Verify network connectivity

### Issue: Slow loading times

**Solution:**
- Reduce models per page (change `getAllModels(50)` to lower number)
- Increase cache duration
- Implement pagination
- Use CDN for images

### Issue: Rate limit errors

**Solution:**
- Implement request queuing
- Use multiple API keys (if allowed)
- Increase cache duration
- Add exponential backoff

## Support

For issues or questions:
- Check API documentation links above
- Review error messages in browser console
- Open GitHub issue with error logs
- Contact platform support for API access

---

**Built with ❤️ for the 3D printing community**
