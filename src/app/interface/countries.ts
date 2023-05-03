export interface ICountry {
    name: string;
    cities: Array<{name: string}>;
  }

  export const listCountries: Array<ICountry> = [
    {name: 'Portugal',
    cities: [
      {name: 'Lisboa'},
      {name: 'Porto'},
    ],
  },
  {name: 'França',
    cities: [
      {name: 'Paris'},
      {name: 'Marseille'},
    ],
  },
  {name: 'Itália',
    cities: [
      {name: 'Rome'},
      {name: 'Venice'},
    ],
  },
  {name: 'Alemanha',
    cities: [
      {name: 'Berlin'},
      {name: 'Munich'},
    ],
  },
  {name: 'Brasil',
    cities: [
      {name: 'Rio de Janeiro'},
      {name: 'São Paulo	'},
    ],
  }
]