import defaultSettings from '@/settings'

const title = defaultSettings.title || '星舟'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
