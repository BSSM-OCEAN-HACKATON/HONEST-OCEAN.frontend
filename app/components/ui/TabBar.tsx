import TabBarClient from './TabBarClient'

type TabRoute = '/' | '/map' | '/camera/scan' | '/save'

const tabs = [
  { label: 'Home', iconPath: '/icon/home', href: '/' as TabRoute },
  { label: 'Map', iconPath: '/icon/map', href: '/map' as TabRoute },
  { label: 'Camera', iconPath: '/icon/camera', href: '/camera/scan' as TabRoute },
  { label: 'Save', iconPath: '/icon/save', href: '/save' as TabRoute },
]

const TabBar = () => {
  return <TabBarClient tabs={tabs} />
}

export default TabBar