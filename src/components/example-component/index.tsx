import React from 'react';
import styles from './example-component.module.scss';

interface ExampleComponentProps {
  name: string;
}

const ExampleComponent = ({name}: ExampleComponentProps) => {
  return (
    <div>
      <h1 className={styles.exampleComponent}>{name}</h1>
      <hr/>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam sed ipsam nemo nam mollitia vero quis, reprehenderit temporibus assumenda in. Molestiae, animi nulla? Doloribus, possimus voluptatum! Odio ducimus aut delectus.</p>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat veniam ipsam fugiat saepe eum nemo fuga, doloremque omnis aliquam quibusdam labore laboriosam suscipit ea eligendi facere illum esse iure perspiciatis.</p>
    </div>
  )
}

export default ExampleComponent;
