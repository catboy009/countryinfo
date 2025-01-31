'use client'

import { cn } from '@/lib/utils'
import { ChangeEvent, useState } from 'react'
import useSWR from 'swr'

interface Currency {
  name: string
  symbol: string
}

interface CountryData {
  name: { official: string }
  capital: string[]
  region: string
  subregion: string
  latlng: number[]
  capitalInfo: { latlng: number[] }
  flag: string
  population: number
  timezones: string[]
  tld: string[]
  languages: { [key: string]: string }
  currencies: { [key: string]: Currency }
  borders: string[] | null
  landlocked: boolean
  startOfWeek: string
  continents: string[] | null
  maps: { openStreetMaps: string }
}

const fetcher = (url: string): Promise<CountryData[]> => fetch(url).then((res) => res.json())

export default function Home() {
  const [country, setCountry] = useState<string>('')

  const { data, error } = useSWR<CountryData[]>(
    country
      ? `https://restcountries.com/v3.1/translation/${country}?fields=name,capital,population,flag,region,subregion,timezones,latlng,capitalInfo,tld,languages,currencies,borders,landlocked,startOfWeek,continents,maps`
      : null,
    fetcher,
  )

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setCountry(e.target.value)

  return (
    <main className='max-w-3xl mx-auto p-6 space-y-6'>
      <div className='space-y-4'>
        <input
          type='text'
          aria-label='Enter country'
          placeholder='Enter country'
          value={country}
          onChange={handleInputChange}
          autoFocus
          className={cn(
            'rounded-md border border-surface0 bg-base',
            'py-2 px-4 capitalize shadow-sm',
            'outline-none transition-colors duration-300',
            'placeholder:text-overlay0 hover:border-surface1',
            'focus:text-text focus:border-surface2',
          )}
        />
      </div>

      {data && data.length > 0 && (
        <div className='space-y-4'>
          <ul className='animated-list grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Official Name</span>
              <span>{data[0].name.official} {data[0].flag}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Capital</span>
              <span>{data[0].capital[0]}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Region</span>
              <span>{data[0].region}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Subregion</span>
              <span>{data[0].subregion}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>LatLng</span>
              <span>{data[0].latlng[0]}/{data[0].latlng[1]}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Capital LatLng</span>
              <span>{data[0].capitalInfo.latlng[0]}/{data[0].capitalInfo.latlng[1]}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Timezones</span>
              <span>{data[0].timezones.join(' ')}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>TLD</span>
              <span>{data[0].tld.join(' ')}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Population</span>
              <span>{data[0].population.toLocaleString()}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Borders</span>
              <span>{data[0].borders ? data[0].borders.join(' ') : 'None'}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Languages</span>
              <span>{Object.values(data[0].languages).join(' ')}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Currencies</span>
              <span>
                {Object.values(data[0].currencies).map((currency) => `${currency.name} (${currency.symbol})`).join(' ')}
              </span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Landlocked</span>
              <span>{data[0].landlocked ? 'Yes' : 'No'}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Start of Week</span>
              <span>{data[0].startOfWeek}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Continents</span>
              <span>{data[0].continents?.join(' ')}</span>
            </li>
            <li className='flex flex-col'>
              <span className='text-overlay0'>Maps</span>
              <span>
                <a
                  href={data[0].maps.openStreetMaps}
                  target='_blank'
                  className='text-blue-500 hover:underline'
                >
                  OpenStreetMaps
                </a>
              </span>
            </li>
          </ul>
        </div>
      )}

      {error && <div className='text-red font-bold'>Failed to load country info</div>}
    </main>
  )
}
