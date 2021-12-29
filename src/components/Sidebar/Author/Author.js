// @flow strict
import React from 'react';
import { withPrefix, Link } from 'gatsby';
import { useLocation } from "@reach/router";
import styles from './Author.module.scss';

type Props = {
  author: {
    name: string,
    bio: string,
    photo: string
  },
  isIndex: ?boolean
};

const Author = ({ author, isIndex }: Props) => {
  const location = useLocation();
  const isJapanese = location.pathname.match(/\/ja\/?.*/);
  const homePath = isJapanese ? "/ja/": "/";
  return (
    <div className={styles['author']}>
      
      <Link to={homePath}>
        <img
          src={withPrefix(author.photo)}
          className={styles['author__photo']}
          width="75"
          height="75"
          alt={author.name}
        />
      </Link>
      <div className={styles['author__lang']}>
        { isJapanese ? (
          <h4> <Link to={location.pathname.replace(/\/ja\/?(.*)/, "/$1")} className={styles['author__sub_lang']}>En</Link> / Ja </h4>
        ) : (
          <h4> En / <Link to={location.pathname.replace(/(.+)/, "/ja$1")} className={styles['author__sub_lang']}>Ja</Link> </h4>
        )}
      </div>

      { isIndex === true ? (
        <h1 className={styles['author__title']}>
          <Link className={styles['author__title-link']} to={homePath}>{author.name}</Link>
        </h1>
      ) : (
        <h2 className={styles['author__title']}>
          <Link className={styles['author__title-link']} to={homePath}>{author.name}</Link>
        </h2>
      )}
      <p className={styles['author__subtitle']}>{author.bio}</p>
    </div>
  )
};

export default Author;
