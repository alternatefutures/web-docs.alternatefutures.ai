# Security Policy

## Supported Versions

We take the security of the Alternate Futures documentation seriously. As this is a documentation repository, security concerns typically relate to:

- Build pipeline security
- Dependency vulnerabilities
- Documentation content that may inadvertently expose sensitive information
- XSS or injection vulnerabilities in generated documentation

| Component | Status |
| --- | --- |
| Main branch (latest) | :white_check_mark: Supported |
| Older commits | :x: Not supported |

## Reporting a Vulnerability

We encourage responsible disclosure of security vulnerabilities. If you discover a security issue, please report it privately.

### Using GitHub Private Vulnerability Reporting (Recommended)

1. Navigate to the [Security tab](../../security) of this repository
2. Click "Report a vulnerability"
3. Fill out the vulnerability report form with:
   - A description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested remediation (if available)

### Email Reporting

If you prefer not to use GitHub's private reporting, you can email security concerns to:

**system@alternatefutures.ai**

Please include:
- A clear description of the vulnerability
- Steps to reproduce the issue
- Your assessment of the severity
- Any proof of concept code (if applicable)

## What to Report

Please report any security concerns including but not limited to:

### Documentation Repository
- **Dependency vulnerabilities** in npm packages used by VitePress or build tools
- **Build pipeline security issues** in GitHub Actions workflows
- **XSS vulnerabilities** in documentation rendering
- **Sensitive information disclosure** in documentation content or code examples
- **Supply chain attacks** targeting the documentation build process

### Related Repositories
If you find vulnerabilities in the main application (`cloud-cli` or `cloud-sdk`), please report them to the respective repository's security team.

## What NOT to Report

The following are generally not considered security vulnerabilities:

- Typos or grammatical errors in documentation
- Broken links or formatting issues
- Feature requests or enhancement suggestions
- Issues already publicly disclosed

## Response Timeline

We are committed to responding to security reports in a timely manner:

- **Initial Response**: Within 48 hours of report submission
- **Status Update**: Within 5 business days with an initial assessment
- **Resolution Timeline**: Varies based on severity and complexity
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: 60 days

## Disclosure Policy

- We follow coordinated vulnerability disclosure
- We request that you do not publicly disclose the vulnerability until we have had a chance to address it
- Once fixed, we will:
  1. Release a patch
  2. Publish a security advisory
  3. Credit the reporter (unless they prefer to remain anonymous)

## Security Best Practices

When contributing to this documentation repository:

1. **Dependencies**: Keep dependencies up to date; run `pnpm audit` regularly
2. **Secrets**: Never commit API keys, tokens, or credentials
3. **Code Examples**: Ensure code examples in documentation follow security best practices
4. **Build Scripts**: Review any changes to build scripts or CI/CD workflows carefully
5. **Third-party Content**: Be cautious when embedding third-party content or scripts

## Security Updates

Security updates and patches will be:
- Applied to the main branch
- Documented in release notes
- Announced via GitHub Security Advisories for significant issues

## Contact

For general security questions or concerns, please open a discussion in the repository or contact the maintainers.

For vulnerability reports, please use the private reporting methods described above.

---

Thank you for helping keep Alternate Futures documentation secure!
