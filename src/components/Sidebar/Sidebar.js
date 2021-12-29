// @flow strict
import React from 'react';
import { useLocation } from "@reach/router";
import Author from './Author';
import Contacts from './Contacts';
import Copyright from './Copyright';
import Menu from './Menu';
import styles from './Sidebar.module.scss';
import { useSiteMetadata } from '../../hooks';

type Props = {
  isIndex?: boolean,
};

const Sidebar = ({ isIndex }: Props) => {
  const { author, copyright, menu, jaMenu } = useSiteMetadata();
  const location = useLocation();

  const isJapanese = location.pathname.match(/\/ja\/?.*/);
  const adaptiveMenu = isJapanese ? jaMenu: menu;

  return (
    <div className={styles['sidebar']}>
      <div className={styles['sidebar__inner']}>
        <Author author={author} isIndex={isIndex} />
        <Menu menu={adaptiveMenu} />
        <Contacts contacts={author.contacts} />
        <Copyright copyright={copyright} />
      </div>
    </div>
  );
};

export default Sidebar;
