# Security and privacy notes

Shubh Nimantran is a static, serverless website. The browser-based builder does not create a server-side account.

- The builder stores drafts in the current browser's local storage. Clearing browser data can permanently remove those drafts.
- The optional PIN is a convenience lock only. It is stored locally and is not authentication or encryption. Do not reuse an important password or PIN.
- Shared invitation and group links contain their invitation data in a URL fragment. The fragment is not sent in ordinary HTTP requests, but anyone who receives the complete link can decode and view its contents.
- Do not include information in a shared invitation that you would not want recipients to see, such as private home addresses, personal phone numbers, or sensitive family details.
- GitHub Pages content is public. Anyone who knows or discovers the site URL can access published files.
- Only upload photos, fonts, and music that you own or have permission to share.

For a hosted multi-user product with private drafts, authenticated access, or revocable links, use a trusted backend and access-control model rather than relying on this client-only builder.
