import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileLines,
  faStar,
  IconDefinition,
} from '@fortawesome/free-regular-svg-icons'
import {
  faCalculator,
  faCode,
  faPencil,
  faLock,
} from '@fortawesome/free-solid-svg-icons'
import React, { PropsWithChildren } from 'react'
import { Nav } from 'react-bootstrap'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

type SidebarNavItemProps = {
  href: string
  icon?: IconDefinition
} & PropsWithChildren

const SidebarNavItem = (props: SidebarNavItemProps) => {
  const { icon, children, href } = props

  return (
    <Nav.Item>
      <Link href={href} passHref legacyBehavior>
        <Nav.Link className="px-3 py-2 d-flex align-items-center">
          {icon ? (
            <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
          ) : (
            <span className="nav-icon ms-n3" />
          )}
          {children}
        </Nav.Link>
      </Link>
    </Nav.Item>
  )
}

const ProtectedSidebarUserItems = () => {
  const { status, data } = useSession()
  if (status === 'authenticated') {
    return (
      <>
        <SidebarNavItem icon={faCode} href="/user/submissions">
          Submissions
        </SidebarNavItem>
        <SidebarNavItem icon={faPencil} href="/user/scrimmages">
          Scrimmages
        </SidebarNavItem>
      </>
    )
  }
  return null
}

const ProtectedSidebarAdminItems = () => {
  const { status, data } = useSession()
  if (status === 'authenticated' && data?.user?.role === 'admin') {
    return (
      <>
        <SidebarNavItem icon={faLock} href="/admin">
          Admin
        </SidebarNavItem>
      </>
    )
  }
  return null
}

export default function SidebarNav() {
  return (
    <ul className="list-unstyled">
      <SidebarNavItem icon={faStar} href="/">
        Home
      </SidebarNavItem>
      <SidebarNavItem icon={faFileLines} href="/getting_started">
        Getting Started
      </SidebarNavItem>
      <SidebarNavItem icon={faCalculator} href="/leaderboard">
        Leaderboard
      </SidebarNavItem>
      <ProtectedSidebarUserItems />
      <ProtectedSidebarAdminItems />
    </ul>
  )
}
