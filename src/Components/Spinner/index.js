import React from 'react';
import styles from './styles.module.scss';

const spinner = () => (
    <div className={styles.background}>
        <div className={styles.loader}/>
        <p className={styles.message}>Fetching nearby attractions.</p>
    </div>

);

export default spinner;

