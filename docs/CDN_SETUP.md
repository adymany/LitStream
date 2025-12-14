# Backblaze B2 + Cloudflare CDN Setup Guide

This guide walks you through setting up Backblaze B2 for video storage with Cloudflare CDN for free bandwidth delivery.

## Why This Combo?

| Feature | Benefit |
|---------|---------|
| **B2 Storage** | $0.005/GB/month (cheapest cloud storage) |
| **B2 Egress** | Free through Cloudflare (Bandwidth Alliance) |
| **Cloudflare** | Free CDN with global edge caching |

**Example cost for 100GB of videos:** $0.50/month, unlimited downloads!

---

## Step 1: Create Backblaze B2 Bucket

1. Go to [backblaze.com](https://www.backblaze.com/b2/cloud-storage.html) and sign up
2. Navigate to **B2 Cloud Storage** → **Buckets**
3. Click **Create a Bucket**
4. Settings:
   - **Bucket Name:** `litstream-videos` (must be globally unique)
   - **Files in Bucket:** `Public`
   - **Default Encryption:** None (for video streaming)
   - **Object Lock:** Disabled
5. Click **Create a Bucket**

### Get Your Bucket URL

After creation, note your bucket details:
- **Bucket Endpoint:** e.g., `f003.backblazeb2.com`
- **Bucket URL:** e.g., `https://f003.backblazeb2.com/file/litstream-videos/`

---

## Step 2: Upload Videos to B2

### Option A: Web Interface
1. Click on your bucket
2. Click **Upload**
3. Drag and drop your video files

### Option B: B2 CLI (Recommended for large files)
```bash
# Install B2 CLI
pip install b2

# Authorize (get keys from B2 > App Keys)
b2 authorize-account <applicationKeyId> <applicationKey>

# Upload a video
b2 upload-file litstream-videos movie.mp4 videos/movie.mp4

# Upload folder of videos
b2 sync ./local-videos b2://litstream-videos/videos/
```

---

## Step 3: Set Up Cloudflare CDN

1. Go to [cloudflare.com](https://cloudflare.com) and create a free account
2. Add your domain (or use a free subdomain via Cloudflare Pages)

### Create a CNAME for B2

1. In Cloudflare, go to **DNS**
2. Add a new **CNAME** record:
   - **Name:** `cdn` (or `videos`)
   - **Target:** Your B2 endpoint, e.g., `f003.backblazeb2.com`
   - **Proxy status:** **Proxied** (orange cloud ON)
3. Click **Save**

Now your videos are accessible at:
```
https://cdn.yourdomain.com/file/litstream-videos/videos/movie.mp4
```

---

## Step 4: Configure Cloudflare Cache Rules

1. Go to **Caching** → **Cache Rules**
2. Create a rule:
   - **Name:** `Cache Videos`
   - **When:** URI Path contains `/file/litstream-videos/`
   - **Then:** 
     - Cache eligibility: **Eligible for cache**
     - Edge TTL: **1 month**
     - Browser TTL: **1 day**

This ensures videos are cached at Cloudflare's edge, reducing B2 requests.

---

## Step 5: Update LitStream App

### Set Environment Variable

Create a `.env` file in your project root:

```env
VITE_CDN_BASE_URL=https://cdn.yourdomain.com/file/litstream-videos
```

### For Local Development (keep using local files)

```env
VITE_CDN_BASE_URL=
```

When `VITE_CDN_BASE_URL` is empty, the app uses local `/videos/` folder.

---

## Video URL Structure

| Environment | Video URL |
|-------------|-----------|
| **Local Dev** | `/videos/Stranger-Things-s5-e1.mp4` |
| **Production** | `https://cdn.yourdomain.com/file/litstream-videos/videos/Stranger-Things-s5-e1.mp4` |

---

## Final Checklist

- [ ] Created B2 account and bucket
- [ ] Uploaded videos to B2
- [ ] Added domain to Cloudflare
- [ ] Created CNAME pointing to B2
- [ ] Set up cache rules
- [ ] Added `VITE_CDN_BASE_URL` to `.env`
- [ ] Tested video playback in production

---

## Troubleshooting

### CORS Errors
Add CORS rules to your B2 bucket:
1. Go to Bucket Settings → **CORS Rules**
2. Add:
```json
[
  {
    "corsRuleName": "allowAll",
    "allowedOrigins": ["*"],
    "allowedOperations": ["s3_get", "s3_head"],
    "allowedHeaders": ["*"],
    "maxAgeSeconds": 3600
  }
]
```

### Videos Not Caching
Ensure Cloudflare proxy is enabled (orange cloud) and cache rules match your paths.
