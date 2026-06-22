import type { VercelRequest, VercelResponse } from '@vercel/node';

interface UpdateContentRequestBody {
  adminPassword?: string;
  data?: any;
}

interface GitHubFileGetResponse {
  sha: string;
}

interface GitHubFilePutResponse {
  commit: {
    sha: string;
  };
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Only accept POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate Limiter
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'anonymous';
  const now = Date.now();
  const limitData = rateLimitMap.get(ip);

  if (!limitData || now > limitData.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
  } else {
    limitData.count++;
    if (limitData.count > MAX_REQUESTS) {
      return res.status(429).json({ error: 'Too Many Requests: Rate limit exceeded. Max 10 updates per minute.' });
    }
  }

  try {
    const { adminPassword, data } = req.body as UpdateContentRequestBody;

    // 2. Validate admin password
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedPassword || adminPassword !== expectedPassword) {
      return res.status(401).json({ error: 'Unauthorized: Invalid password' });
    }

    if (!data) {
      return res.status(400).json({ error: 'Bad Request: Missing data payload' });
    }

    // 3. Resolve GitHub credentials & target coordinates
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const token = process.env.GITHUB_TOKEN;
    const path = 'app/public/portfolio-data.json'; // Path relative to git repo root

    if (!owner || !repo || !token) {
      return res.status(500).json({ 
        error: 'Internal Server Error: Missing server-side GitHub environment configurations' 
      });
    }

    // 4. Fetch the existing file's current SHA from GitHub Contents API
    const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    
    const getResponse = await fetch(getUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    let sha = '';
    if (getResponse.ok) {
      const fileData = await getResponse.json() as GitHubFileGetResponse;
      sha = fileData.sha;
    } else if (getResponse.status === 409) {
      return res.status(409).json({ error: 'Conflict: SHA mismatch when reading current file state' });
    } else if (getResponse.status !== 404) {
      const getErrorText = await getResponse.text();
      return res.status(getResponse.status).json({ 
        error: `Failed to retrieve existing file from GitHub: ${getErrorText}` 
      });
    }

    // 5. Convert JSON content and encode as Base64 (supporting multi-byte UTF-8 strings)
    const newContentString = JSON.stringify(data, null, 2);
    const base64Content = Buffer.from(newContentString, 'utf-8').toString('base64');

    // 6. Commit the updated JSON file back using PUT method
    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const putBody = {
      message: 'Update portfolio content via admin panel',
      content: base64Content,
      sha: sha || undefined, // undefined will create the file if it does not exist
      branch: branch,
    };

    const putResponse = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(putBody),
    });

    if (putResponse.ok) {
      const putResult = await putResponse.json() as GitHubFilePutResponse;
      return res.status(200).json({ 
        success: true, 
        commitSha: putResult.commit.sha 
      });
    } else {
      const putErrorData = await putResponse.json() as { message?: string };
      const status = putResponse.status;
      
      // If there's an edit conflict (sha mismatch on write)
      if (status === 409) {
        return res.status(409).json({ error: 'Conflict: SHA mismatch when writing content to GitHub' });
      }

      return res.status(status).json({ 
        error: putErrorData.message || 'GitHub API write error' 
      });
    }
  } catch (error: any) {
    console.error('Error executing update-content serverless function:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
