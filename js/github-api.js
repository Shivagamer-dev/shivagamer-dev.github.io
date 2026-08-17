/* ============================================================
   GITHUB API — Real Data Integration
   ============================================================ */

import { langColors } from './utils.js';

export async function initGitHubAPI() {
  const username = 'Shivagamer-dev';
  const statsContainer = document.getElementById('github-stats');
  const reposContainer = document.getElementById('github-repos');

  if (!statsContainer && !reposContainer) return;

  try {
    // Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (userRes.ok) {
      const user = await userRes.json();
      renderStats(user);
    } else {
      useFallbackStats();
    }

    // Fetch repositories
    if (reposContainer) {
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=owner`);
      if (reposRes.ok) {
        const repos = await reposRes.json();
        // Filter out forks if preferred, or just show latest active
        const activeRepos = repos.filter(r => !r.fork).slice(0, 6);
        renderRepos(activeRepos, reposContainer);
      } else {
        reposContainer.innerHTML = '<p class="text-secondary text-center">Unable to load repositories. Please check my GitHub profile directly.</p>';
      }
    }

  } catch (error) {
    console.error('GitHub API Error:', error);
    useFallbackStats();
    if (reposContainer) {
      reposContainer.innerHTML = '<p class="text-secondary text-center">Unable to load repositories. Please check my GitHub profile directly.</p>';
    }
  }
}

function renderStats(user) {
  const container = document.getElementById('github-stats');
  if (!container) return;

  container.innerHTML = `
    <div class="github__stat-card">
      <div class="github__stat-value">${user.public_repos}</div>
      <div class="github__stat-label">Repositories</div>
    </div>
    <div class="github__stat-card">
      <div class="github__stat-value">${user.followers}</div>
      <div class="github__stat-label">Followers</div>
    </div>
    <div class="github__stat-card">
      <div class="github__stat-value">${user.following}</div>
      <div class="github__stat-label">Following</div>
    </div>
  `;
}

function useFallbackStats() {
  const container = document.getElementById('github-stats');
  if (!container) return;
  // If API rate limited, use the svg cards as fallback
  container.innerHTML = `
    <div class="github__contrib" style="grid-column: 1 / -1; display: flex; flex-direction: column; gap: 16px; align-items: center; max-width: 100%; overflow-x: hidden;">
      <img src="https://github-readme-stats.vercel.app/api?username=Shivagamer-dev&show_icons=true&theme=nord&bg_color=0D1117&text_color=f1f5f9&icon_color=3b82f6&title_color=3b82f6&border_color=212b44" alt="GitHub Stats" style="max-width: 100%;" />
      <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=Shivagamer-dev&layout=compact&theme=nord&bg_color=0D1117&text_color=f1f5f9&title_color=3b82f6&border_color=212b44" alt="Top Languages" style="max-width: 100%;" />
    </div>
  `;
}

function renderRepos(repos, container) {
  if (repos.length === 0) {
    container.innerHTML = '<p class="text-secondary text-center">No public repositories found.</p>';
    return;
  }

  const html = repos.map(repo => {
    const langColor = langColors[repo.language] || langColors.default;
    const desc = repo.description || 'No description provided.';
    const date = new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    return `
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card">
        <h4 class="repo-card__name">${repo.name}</h4>
        <p class="repo-card__desc">${desc}</p>
        <div class="repo-card__meta">
          ${repo.language ? `
            <span><span class="repo-card__lang-dot" style="background-color: ${langColor}"></span>${repo.language}</span>
          ` : ''}
          ${repo.stargazers_count > 0 ? `
            <span style="display: flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path></svg>
              ${repo.stargazers_count}
            </span>
          ` : ''}
          ${repo.forks_count > 0 ? `
            <span style="display: flex; align-items: center; gap: 4px;">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>
              ${repo.forks_count}
            </span>
          ` : ''}
          <span style="margin-left: auto;">Updated ${date}</span>
        </div>
      </a>
    `;
  }).join('');

  container.innerHTML = html;
}
