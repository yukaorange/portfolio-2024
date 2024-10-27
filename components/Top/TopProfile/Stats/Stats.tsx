import styles from '@/components/Top/TopProfile/Stats/stats.module.scss';

export const Stats = () => {
  const stats = [
    {
      term: 'Age',
      desc: 33,
      unit: 'yr',
    },
    {
      term: 'Height',
      desc: 175,
      unit: 'cm',
    },
    {
      term: 'Weight',
      desc: 75,
      unit: 'kg',
    },
    {
      term: 'Foot_Size',
      desc: '27',
      unit: 'cm',
    },
    {
      term: 'Blood_Type',
      desc: 'A',
      unit: 'type',
    },
    {
      term: 'I_Can_Run',
      desc: '20',
      unit: 'km/h',
    },
    {
      term: 'I_Can_Swim',
      desc: '3',
      unit: 'km/h',
    },
  ];

  return (
    <div className={styles.stats}>
      {stats.map((stat, index) => {
        return (
          <div className={`${styles.stats__row} _en`} key={index}>
            <dt className={styles.stats__term}>{stat.term}</dt>
            <dd className={styles.stats__desc}>{stat.desc}</dd>
            <span className={styles.stats__unit}>{stat.unit}</span>
          </div>
        );
      })}
    </div>
  );
};
