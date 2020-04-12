import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faLinkedin,
  faTwitter
} from '@fortawesome/free-brands-svg-icons';
import styles from './Bio.module.scss';

const Bio = ({ config, expanded }) => (
  <>
    <img
      className={styles.avatar}
      src={config.userAvatar}
      alt={config.userName}
    />
    <p className={styles.text}>
      <strong>{config.userName}</strong>
    </p>
    <div>
      <a
        href={`https://twitter.com/${config.userTwitter}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        <FontAwesomeIcon icon={faTwitter} />
      </a>
      <a
        href={`https://github.com/${config.userGitHub}`}
        target='_blank'
        rel='noopener noreferrer'
      >
        <FontAwesomeIcon icon={faGithub} />
      </a>
      <a
        href={`https://linkedin.com/in/joaopedroreis`}
        target='_blank'
        rel='noopener noreferrer'
      >
        <FontAwesomeIcon icon={faLinkedin} />
      </a>
    </div>
  </>
);

export default Bio;
