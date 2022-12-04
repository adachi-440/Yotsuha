import type { NextPage } from 'next'
import { useTheme as useNextTheme } from 'next-themes'
import { Button, Link, Navbar, Switch, useTheme, Text } from '@nextui-org/react'


const Header: NextPage = () => {
  const { setTheme } = useNextTheme()
  const { isDark } = useTheme()

  return (
    <Navbar isBordered variant='floating'>
      <Navbar.Brand>
        <Text b color='inherit' hideIn='xs'>
          Futaba
        </Text>
      </Navbar.Brand>
      {/* <Navbar.Content hideIn='xs' variant='highlight-rounded'>
        <Navbar.Link href='#'>Features</Navbar.Link>
        <Navbar.Link isActive href='#'>
          Customers
        </Navbar.Link>
        <Navbar.Link href='#'>Pricing</Navbar.Link>
        <Navbar.Link href='#'>Company</Navbar.Link>
      </Navbar.Content> */}
      <Navbar.Content>
        <Navbar.Item>
          
        </Navbar.Item>
        <Navbar.Item>
          <Switch checked={isDark} onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')} />
        </Navbar.Item>
      </Navbar.Content>
    </Navbar>
  )
}

export default Header