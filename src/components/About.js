import React from 'react';

const linkStyle = {
  color: 'cornflowerblue',
};

const About = () => (
  <>
    <h1>Hi and welcome to my Blog!</h1>
    <p>
      I am a Solutions Architect specialized in Microsoft Azure and Microsoft
      Stack.
    </p>
    <p>
      Currently working for Version 1 in Dublin, Ireland, my main role is
      assisting several customers with Azure and Microsoft technologies. Either
      architecting and building cloud native application or migrating and
      modernizing existing applications.
    </p>
    <p>
      I am also a contributor to the local tech community in the{' '}
      <a
        style={linkStyle}
        href='https://www.cloudlunchlearn.com/'
        target='_blank'
        rel='noopener noreferrer'
      >
        Cloud Lunch and Learn initiative.
      </a>
    </p>
    <h2>Certifications</h2>
    <p>
      Check here:  <a
        style={linkStyle}
        href='https://www.youracclaim.com/users/joao-goncalves.02406dd6'
        target='_blank'
        rel='noopener noreferrer'
      >
        Acclaim profile
      </a> 
    </p>
  </>
);

export default About;
