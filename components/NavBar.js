/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import {
  Navbar, Container, Nav, Button,
} from 'react-bootstrap';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';

export default function NavBar() {
  const { user } = useAuth();
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Link passHref href="/">
          <Navbar.Brand>StringTheory</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* CLOSE NAVBAR ON LINK SELECTION: https://stackoverflow.com/questions/72813635/collapse-on-select-react-bootstrap-navbar-with-nextjs-not-working */}
            <Link passHref href="/">
              <Nav.Link>Home</Nav.Link>
            </Link>
            <Link passHref href={user.userId ? `/edit/${user.userId}` : '/newUser'}>
              <Nav.Link>{user.userId ? 'Edit Profile' : 'Create Profile'}</Nav.Link>
            </Link>
            <Link passHref href="/createPost">
              <Nav.Link>NewPost</Nav.Link>
            </Link>
            <Link passHref href="/postSpace">
              <Nav.Link>MyPosts</Nav.Link>
            </Link>
            <Link passHref href="/postSpaceWeb">
              <Nav.Link>AllPosts</Nav.Link>
            </Link>
            <Button variant="danger" onClick={signOut}>Sign Out</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
