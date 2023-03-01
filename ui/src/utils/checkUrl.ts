function escapeStringRegexp(string: string): string {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  }

  return string
    .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    .replace(/-/g, '\\x2d');
}

export function matchUrl(matcher: string, originUrl: string, targetUrl: string): boolean {
  let href = '';
  let hash = '';
  let search = '';

  try {
    const fullUrl = new URL(targetUrl, '');
    href = fullUrl.href;
    hash = fullUrl.hash;
    search = fullUrl.search;
  } catch (error) {
    href = targetUrl;
  }

  let regex;
  let testUrl;

  switch (matcher) {
    case 'EXACT':
      testUrl = href;
      regex = new RegExp('^' + escapeStringRegexp(originUrl) + '/?$');
      break;
    case 'SIMPLE':
      testUrl = href.replace(hash, '').replace(search, '');
      regex = new RegExp('^' + escapeStringRegexp(originUrl) + '/?$');
      break;
    case 'SUBSTRING':
      testUrl = href.replace(search, '');
      regex = new RegExp('.*' + escapeStringRegexp(originUrl) + '.*$');
      break;
    case 'REGULAR':
      testUrl = href.replace(search, '');
      regex = new RegExp(originUrl);
      break;
    default:
      return false;
  }

  return regex.test(testUrl);
}