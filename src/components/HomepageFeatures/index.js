import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'WPILib',
    Svg: require('@site/static/img/wpilib.svg').default,
    link: 'https://simbotics.github.io/sim-docs/docs/get-ready/wpilib-installation',
    description: (
      <>
        <b>WPILib</b> is the official FRC robotics library, providing the core APIs for motor control, sensor input, and robot code structure.
      </>
    ),
  },
  {
    title: 'Java',
    Svg: require('@site/static/img/java.svg').default,
    link: 'https://simbotics.github.io/sim-docs/docs/category/java-basics',
    description: (
      <>
        <b>Java</b> is the programming language used to write the robot's code, providing the logic that controls its behavior.
      </>
    ),
  },
  {
    title: 'Git',
    Svg: require('@site/static/img/git.svg').default,
    link: 'https://simbotics.github.io/sim-docs/docs/get-ready/version-control',
    description: (
      <>
        <b>Git</b> is the version control system used to manage the team's codebase, enabling collaborative development without conflicting changes.
      </>
    ),
  },
];

function Feature({ Svg, title, link, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <a href={link}>
          <Svg className={styles.featureSvg} role="img" />
        </a>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
