# GitHub Pages Setup Guide

This document explains how to configure GitHub Pages for this repository to enable automatic deployment via GitHub Actions.

## The Issue

If you encounter an error like:
```
HttpError: Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions
```

This means GitHub Pages is not properly configured in your repository settings.

## Solution: Enable GitHub Pages with GitHub Actions

Follow these steps to fix the issue:

### Step 1: Navigate to Repository Settings

1. Go to your repository on GitHub
2. Click on the **Settings** tab (top navigation bar)
3. Scroll down the left sidebar and click on **Pages**

### Step 2: Configure Build and Deployment Source

1. Under the **"Build and deployment"** section
2. Find the **"Source"** dropdown menu
3. Select **"GitHub Actions"** from the dropdown
4. The page will automatically save this setting

### Step 3: Verify Configuration

After setting the source to "GitHub Actions":
- You should see a message confirming the configuration
- The workflow will now be able to deploy to GitHub Pages
- Re-run any failed workflows to deploy your site

## Alternative: Using a Branch

If you prefer to deploy from a branch instead of GitHub Actions:

1. In the **"Source"** dropdown, select **"Deploy from a branch"**
2. Choose your branch (typically `main` or `gh-pages`)
3. Select the folder (`/ (root)` or `/docs`)
4. Click **Save**

**Note:** This repository is configured to use GitHub Actions for deployment, so this alternative is not recommended unless you modify the workflow.

## Workflow Configuration

This repository includes two GitHub Actions workflows:

### 1. Jekyll GitHub Pages (`jekyll-gh-pages.yml`)
- **Purpose**: Builds and deploys the site to GitHub Pages
- **Trigger**: On push to `main` branch or manual trigger
- **Requirements**: GitHub Pages must be enabled with "GitHub Actions" as source

### 2. Lyra+ Ops (`lyra_plus_ops.yml`)
- **Purpose**: Automated weekly data generation
- **Trigger**: Weekly on Mondays at 06:15 UTC or manual trigger
- **Requirements**: Write permissions to commit data changes

## Troubleshooting

### Error: "Get Pages site failed"

**Cause**: GitHub Pages is not enabled or not configured to use GitHub Actions.

**Solution**: Follow the steps above to enable GitHub Pages with GitHub Actions as the source.

### Error: "Permission denied"

**Cause**: Workflow doesn't have sufficient permissions.

**Solution**: Ensure the workflow has the following permissions in the YAML file:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### Build succeeds but site doesn't update

**Causes**:
1. DNS or deployment delay (can take a few minutes)
2. Browser cache (try hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
3. Incorrect Pages source configuration

**Solution**: 
1. Wait 2-5 minutes for propagation
2. Clear browser cache
3. Verify Pages settings are correct

## GitHub Pages URL

Once configured, your site will be available at:
```
https://<username>.github.io/<repository-name>/
```

For example:
```
https://aouggad-web.github.io/zlecaf-project-/
```

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Actions for Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Security Considerations

- **Public repositories**: Pages sites are always public
- **Private repositories**: Pages sites are public on free plans, private on GitHub Enterprise
- **Sensitive data**: Never commit API keys, passwords, or sensitive data to the repository

## Support

If you continue to experience issues:
1. Check the Actions tab for detailed error logs
2. Review the workflow file syntax
3. Ensure all required secrets are configured
4. Open an issue in the repository with:
   - Error message
   - Screenshots of Pages settings
   - Workflow run logs

---

*Last updated: 2025-10-13*
