import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/customers/customers-list',
    label: 'Customers',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiAccountCircle' in icon ? icon['mdiAccountCircle' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_CUSTOMERS'
  },
  {
    href: '/queue_entries/queue_entries-list',
    label: 'Queue entries',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiQueue' in icon ? icon['mdiQueue' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_QUEUE_ENTRIES'
  },
  {
    href: '/services/services-list',
    label: 'Services',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiScissorsCutting' in icon ? icon['mdiScissorsCutting' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_SERVICES'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

 {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  },
]

export default menuAside
